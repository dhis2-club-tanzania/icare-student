package org.openmrs.module.icare.billing;

import org.aopalliance.intercept.MethodInvocation;
import org.openmrs.*;
import org.openmrs.api.*;
import org.openmrs.api.context.Context;
import org.openmrs.api.impl.BaseOpenmrsService;
import org.openmrs.attribute.AttributeType;
import org.openmrs.module.icare.ICareConfig;
import org.openmrs.module.icare.billing.dao.DiscountDAO;
import org.openmrs.module.icare.billing.dao.InvoiceDAO;
import org.openmrs.module.icare.billing.dao.PaymentDAO;
import org.openmrs.module.icare.billing.models.*;
import org.openmrs.module.icare.billing.services.BillingService;
import org.openmrs.module.icare.billing.services.insurance.*;
import org.openmrs.module.icare.billing.services.insurance.nhif.NHIFConfig;
import org.openmrs.module.icare.billing.services.insurance.nhif.NHIFServiceImpl;
import org.openmrs.module.icare.core.ICareService;
import org.openmrs.module.icare.core.Item;
import org.openmrs.module.icare.core.dao.ICareDao;
import org.openmrs.module.icare.core.utils.VisitWrapper;

import javax.naming.ConfigurationException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

public class BillingServiceImpl extends BaseOpenmrsService implements BillingService {
	
	ICareDao dao;
	
	InvoiceDAO invoiceDAO;
	
	PaymentDAO paymentDAO;
	
	DiscountDAO discountDAO;
	
	public void setDao(ICareDao dao) {
		this.dao = dao;
	}
	
	public void setInvoiceDAO(InvoiceDAO invoiceDAO) {
		this.invoiceDAO = invoiceDAO;
	}
	
	public void setPaymentDAO(PaymentDAO paymentDAO) {
		this.paymentDAO = paymentDAO;
	}
	
	public void setDiscountDAO(DiscountDAO discountDAO) {
		this.discountDAO = discountDAO;
	}
	
	@Override
	public Invoice createInvoice(Invoice invoice) throws APIException {
		return this.invoiceDAO.save(invoice);
	}
	
	@Override
	public Invoice createInvoice(Encounter encounter) throws APIException {
		Invoice invoice = convertEncounterToInvoice(encounter);
		this.invoiceDAO.save(invoice);
		return invoice;
	}
	
	@Override
	public List<Invoice> getPendingInvoices(String patientUuid) {
		List<Invoice> invoices = this.invoiceDAO.findByPatientUuidAndPending(patientUuid);
		for (Invoice invoice : invoices) {
			List<Discount> discounts = this.discountDAO.findByPatientUuid(invoice.getVisit().getPatient().getUuid());
			for (Discount discount : discounts) {
				for (DiscountInvoiceItem discountItem : discount.getItems()) {
					if (discountItem.getInvoice().getUuid().equals(invoice.getUuid())) {
						invoice.getDiscountItems().add(discountItem);
					}
				}
			}
		}
		return invoices;
		//return this.invoiceDAO.findByPatientUuid(patientUuid);
	}
	
	@Override
	public List<Invoice> getPatientsInvoices(String patientUuid) {
		return this.invoiceDAO.findByPatientUuid(patientUuid);
	}
	
	private InvoiceItem getInvoiceItem(OrderMetaData orderMetaData) {
		ItemPrice itemPrice = orderMetaData.getItemPrice();
		InvoiceItem invoiceItem = new InvoiceItem();
		if (orderMetaData.getOrder() instanceof DrugOrder) {
			DrugOrder drugOrder = (DrugOrder) orderMetaData.getOrder();
			invoiceItem.setQuantity(drugOrder.getQuantity());
		} else if (orderMetaData.getOrder() instanceof Prescription) {
			Prescription drugOrder = (Prescription) orderMetaData.getOrder();
			invoiceItem.setQuantity(drugOrder.getQuantity());
		} else if (orderMetaData.getOrder() instanceof TestOrder) {
			//TestOrder testOrder = (TestOrder) orderMetaData.getOrder();
			invoiceItem.setQuantity(1.0);
		} else {
			invoiceItem.setQuantity(1.0);
		}
		
		invoiceItem.setItem(itemPrice.getItem());
		invoiceItem.setPrice(itemPrice.getPrice());
		invoiceItem.setOrder(orderMetaData.getOrder());
		return invoiceItem;
	}
	
	private InvoiceItem getTopUpInvoiceItem(OrderMetaData orderMetaData) {
		ItemPrice itemPrice = orderMetaData.getItemPrice();
		if (itemPrice.getPayable() == null) {
			return null;
		}
		if (itemPrice.getPayable() == 0.0) {
			return null;
		}
		InvoiceItem invoiceItem = new InvoiceItem();
		if (orderMetaData.getOrder() instanceof DrugOrder) {
			DrugOrder drugOrder = (DrugOrder) orderMetaData.getOrder();
			invoiceItem.setQuantity(drugOrder.getQuantity());
		} else if (orderMetaData.getOrder() instanceof Prescription) {
			Prescription drugOrder = (Prescription) orderMetaData.getOrder();
			invoiceItem.setQuantity(drugOrder.getQuantity());
		} else if (orderMetaData.getOrder() instanceof TestOrder) {
			//TestOrder testOrder = (TestOrder) orderMetaData.getOrder();
			invoiceItem.setQuantity(1.0);
		} else {
			invoiceItem.setQuantity(1.0);
		}
		
		invoiceItem.setItem(itemPrice.getItem());
		invoiceItem.setPrice(itemPrice.getPayable());
		invoiceItem.setOrder(orderMetaData.getOrder());
		return invoiceItem;
	}
	
	@Override
	public <T extends Order> Order processOrder(OrderMetaData<T> orderMetaData, Double quantity) {
		
		List<Invoice> invoices = this.getInvoicesByVisitUuid(orderMetaData.getOrder().getEncounter().getVisit().getUuid());
		if (invoices.size() == 0) {
			Concept paymentModeConcept;
			if (!orderMetaData.getItemPrice().getPaymentType().getName().getName().toLowerCase().equals("cash")) {
				paymentModeConcept = Context.getConceptService().getConceptByName("Insurance");
				InvoiceItem invoiceItem = getTopUpInvoiceItem(orderMetaData);
				if (invoiceItem != null && invoiceItem.getQuantity() != 0 && invoiceItem.getPrice() != 0) {
					Invoice invoice = new Invoice();
					if (orderMetaData.getItemPrice().getPayablePaymentMode() != null) {
						invoice.setPaymentMode(orderMetaData.getItemPrice().getPayablePaymentMode());
					} else {
						invoice.setPaymentMode(paymentModeConcept);
					}
					invoice.setVisit(orderMetaData.getOrder().getEncounter().getVisit());
					invoiceItem.setInvoice(invoice);
					List<InvoiceItem> invoiceItems = new ArrayList<InvoiceItem>();
					invoiceItems.add(invoiceItem);
					invoice.setInvoiceItems(invoiceItems);
					this.createInvoice(invoice);
				}
			} else {
				paymentModeConcept = Context.getConceptService().getConceptByName("Cash");
			}
			Invoice invoice = new Invoice();
			invoice.setPaymentMode(paymentModeConcept);
			invoice.setVisit(orderMetaData.getOrder().getEncounter().getVisit());
			
			InvoiceItem invoiceItem = getInvoiceItem(orderMetaData);
			if (quantity != null) {
				invoiceItem.setQuantity(quantity);
			}
			invoiceItem.setInvoice(invoice);
			if (invoiceItem != null && invoiceItem.getQuantity() != 0 && invoiceItem.getPrice() != 0) {
				List<InvoiceItem> invoiceItems = new ArrayList<InvoiceItem>();
				invoiceItems.add(invoiceItem);
				invoice.setInvoiceItems(invoiceItems);
				invoice = this.createInvoice(invoice);
				this.invoiceDAO.save(invoice);
			}
		} else {
			Invoice existingInvoice = invoices.get(0);
			int foundIndex = -1;
			int deleteIndex = -1;
			int index = 0;
			for (InvoiceItem invoiceItem1 : existingInvoice.getInvoiceItems()) {
				if (invoiceItem1.getOrder().getUuid().equals(orderMetaData.getOrder().getUuid())) {
					/**
					 * TODO - Check if there payment has been done and throw an error
					 */
					if (orderMetaData.getOrder() instanceof DrugOrder) {
						DrugOrder drugOrder = (DrugOrder) orderMetaData.getOrder();
						invoiceItem1.setQuantity(drugOrder.getQuantity());
					} else if (orderMetaData.getOrder() instanceof Prescription) {
						Prescription drugOrder = (Prescription) orderMetaData.getOrder();
						invoiceItem1.setQuantity(drugOrder.getQuantity());
					}
					if (orderMetaData.getRemoveBill()) {
						deleteIndex = index;
					}
					foundIndex = index;
				}
				index++;
			}
			if (deleteIndex > -1) {
				existingInvoice.getInvoiceItems().remove(deleteIndex);
			}
			if (foundIndex < 0) {
				InvoiceItem invoiceItem = getInvoiceItem(orderMetaData);
				if (quantity != null) {
					invoiceItem.setQuantity(quantity);
				}
				if (invoiceItem != null && invoiceItem.getQuantity() != 0 && invoiceItem.getPrice() != 0) {
					invoiceItem.setInvoice(existingInvoice);
					existingInvoice.getInvoiceItems().add(invoiceItem);
				}
			}
			
			//Automatic discount creation for full exempted discounts
			List<DiscountInvoiceItem> discountInvoiceItems = existingInvoice.getDiscountItems();
			Boolean isFullExemptedCheck = false;
			
			if (discountInvoiceItems != null && discountInvoiceItems.size() > 0) {
				for (DiscountInvoiceItem discountItem : discountInvoiceItems) {
					if (discountItem.getDiscount() != null) {
						if (discountItem.getDiscount().getExempted() != null && discountItem.getDiscount().getExempted()) {
							isFullExemptedCheck = true;
						}
					}
				}
			}
			
			if (isFullExemptedCheck) {
				for (InvoiceItem invoiceItem : existingInvoice.getInvoiceItems()) {
					//Find the coresponding discount item
					boolean found = false;
					for (DiscountInvoiceItem discountItem : discountInvoiceItems) {
						if (discountItem.getItem().getUuid().equals(invoiceItem.getItem().getUuid())) {
							found = true;
							discountItem.setAmount(invoiceItem.getPrice() * invoiceItem.getQuantity());
						}
					}
					if (!found) {
						DiscountInvoiceItem discountInvoiceItem = new DiscountInvoiceItem();
						discountInvoiceItem.setAmount(invoiceItem.getPrice() * invoiceItem.getQuantity());
						discountInvoiceItem.setDiscount(discountInvoiceItems.get(0).getDiscount());
						discountInvoiceItem.setItem(invoiceItem.getItem());
						discountInvoiceItem.setInvoice(invoiceItem.getInvoice());
						discountInvoiceItems.add(discountInvoiceItem);
					}
				}
			}
			this.invoiceDAO.save(existingInvoice);
		}
		return orderMetaData.getOrder();
	}
	
	@Override
	public InvoiceItem getInvoiceItemByOrder(Order order) {
		return invoiceDAO.getInvoiceItemByOrderUuid(order.getUuid());
	}
	
	@Override
	public SyncResult syncInsurance(String insurance) throws Exception {
		InsuranceService insuranceService = null;
		if (insurance.equals("NHIF")) {
			insuranceService = new NHIFServiceImpl();
		} else {
			throw new APIException(insurance + " has not been implemented");
		}
		return insuranceService.syncPriceList();
	}
	
	@Override
	public List<Invoice> getInvoicesByVisitUuid(String visitUuid) {
		List<Invoice> invoices = this.invoiceDAO.findByVisitUuidAndPending(visitUuid);
		for (Invoice invoice : invoices) {
			List<Discount> discounts = this.discountDAO.findByPatientUuid(invoice.getVisit().getPatient().getUuid());
			for (Discount discount : discounts) {
				for (DiscountInvoiceItem discountItem : discount.getItems()) {
					if (discountItem.getInvoice().getUuid().equals(invoice.getUuid())) {
						invoice.getDiscountItems().add(discountItem);
					}
				}
			}
		}
		return invoices;
	}
	
	@Override
	public Invoice getInvoiceDetailsByUuid(String uuid) {
		Invoice invoice = this.invoiceDAO.findByUuid(uuid);
		// TODO: Check for any discounts
		return invoice;
	}
	
	@Override
	public List<Payment> getPatientPayments(String patientUuid) {
		return paymentDAO.findByPatientUuid(patientUuid);
	}
	
	@Override
	public Payment confirmPayment(Payment payment) throws Exception {
		Invoice invoice = invoiceDAO.findByUuid(payment.getInvoice().getUuid());
		//TODO Payments should address particular item prices in the invoice
		payment.setInvoice(invoice);
		Concept paymentType = Context.getService(ConceptService.class).getConceptByUuid(payment.getPaymentType().getUuid());
		if (paymentType == null) {
			throw new Exception("Payment Type with id '" + payment.getPaymentType().getUuid() + "' does not exist.");
		}
		if (payment.getReferenceNumber() == null) {
			throw new Exception("Reference number should not be null.");
		}
		payment.setPaymentType(paymentType);
		
		for (PaymentItem item : payment.getItems()) {
			item.setPayment(payment);
			InvoiceItem invoiceItem = null;
			for (InvoiceItem iI : invoice.getInvoiceItems()) {
				if (iI.getItem().getUuid().equals(item.getItem().getUuid())
				        && iI.getOrder().getUuid().equals(item.getOrder().getUuid())) {
					invoiceItem = iI;
				}
			}
			if (invoiceItem == null) {
				throw new APIException("Invalid payment item for the invoice.");
			}
			item.setItem(invoiceItem.getItem());
			item.setOrder(invoiceItem.getOrder());
		}
		payment.setReceivedBy(Context.getAuthenticatedUser().getName());
		return this.paymentDAO.save(payment);
	}
	
	@Override
	public Discount discountInvoice(Discount discount) throws Exception {
		Concept discountCriteria = Context.getConceptService().getConceptByUuid(discount.getCriteria().getUuid());
		if (discountCriteria == null) {
			throw new Exception("Discount Criteria with id '" + discount.getCriteria().getUuid() + "' does not exist.");
		}
		discount.setCriteria(discountCriteria);
		PatientService patientService = Context.getService(PatientService.class);
		Patient patient = patientService.getPatientByUuid(discount.getPatient().getUuid());
		if (patient == null) {
			throw new Exception("Patient with id '" + patient.getUuid() + "' does not exist.");
		}
		discount.setPatient(patient);
		List<DiscountInvoiceItem> newItems = new ArrayList<DiscountInvoiceItem>();
		for (DiscountInvoiceItem discountInvoiceItem : discount.getItems()) {
			Item item = dao.findByUuid(discountInvoiceItem.getItem().getUuid());
			if (item == null) {
				throw new Exception("Item with id '" + discountInvoiceItem.getItem().getUuid() + "' does not exist.");
			}
			Invoice invoice = invoiceDAO.findByUuid(discountInvoiceItem.getInvoice().getUuid());
			if (invoice == null) {
				throw new Exception("Invoice with id '" + discountInvoiceItem.getInvoice().getUuid() + "' does not exist.");
			}
			
			DiscountInvoiceItem newItem = new DiscountInvoiceItem();
			newItem.setItem(item);
			newItem.setInvoice(invoice);
			newItem.setAmount(discountInvoiceItem.getAmount());
			newItem.setDiscount(discount);
			newItems.add(newItem);
		}
		discount.setItems(newItems);
		
		if (discount.getAttachment() != null) {
			Obs obs = Context.getObsService().getObsByUuid(discount.getAttachment().getUuid());
			if (obs == null) {
				throw new Exception("Attachment with id '" + obs.getUuid() + "' does not exist.");
			}
			discount.setAttachment(obs);
		}
		//discount.setCreator(Context.getAuthenticatedUser());
		
		return discountDAO.save(discount);
	}
	
	@Override
	public List<Discount> getPatientDiscounts(String patientUuid) {
		return discountDAO.findByPatientUuid(patientUuid);
	}
	
	@Override
	public Concept createDiscountCriteria(Concept discountCriteria) {
		Concept newDiscountCriteria = Context.getConceptService().saveConcept(discountCriteria);
		return newDiscountCriteria;
	}
	
	@Override
	public VisitMetaData validateVisitMetaData(VisitWrapper visit) throws Exception {
		VisitMetaData visitMetaData = new VisitMetaData();
		AdministrationService adminService = Context.getService(AdministrationService.class);
		String serviceAttribute = adminService.getGlobalProperty(ICareConfig.SERVICE_ATTRIBUTE);
		if (serviceAttribute == null) {
			throw new ConfigurationException("Attribute ID for billing is not set. Please set '"
			        + ICareConfig.SERVICE_ATTRIBUTE + "'");
		}
		String paymentSchemeAttribute = adminService.getGlobalProperty(ICareConfig.PAYMENT_SCHEME_ATTRIBUTE);
		if (paymentSchemeAttribute == null) {
			throw new ConfigurationException("Attribute ID for billing is not set. Please set '"
			        + ICareConfig.PAYMENT_SCHEME_ATTRIBUTE + "'");
		}
		String paymentTypeAttribute = adminService.getGlobalProperty(ICareConfig.PAYMENT_TYPE_ATTRIBUTE);
		if (paymentTypeAttribute == null) {
			throw new ConfigurationException("Attribute ID for billing is not set. Please set '"
			        + ICareConfig.PAYMENT_TYPE_ATTRIBUTE + "'");
		}
		String registrationEncounterType = adminService.getGlobalProperty(ICareConfig.REGISTRATION_ENCOUNTER_TYPE);
		if (registrationEncounterType == null) {
			throw new ConfigurationException("Attribute ID for billing is not set. Please set '"
			        + ICareConfig.REGISTRATION_ENCOUNTER_TYPE + "'");
		}
		String registrationFeeConcept = adminService.getGlobalProperty(ICareConfig.REGISTRATION_FEE_CONCEPT);
		if (registrationFeeConcept == null) {
			throw new ConfigurationException("Attribute ID for registration is not set. Please set '"
			        + ICareConfig.REGISTRATION_FEE_CONCEPT + "'");
		}
		String billingOrderTypeUuid = adminService.getGlobalProperty(ICareConfig.BILLING_ORDER_TYPE);
		if (billingOrderTypeUuid == null) {
			throw new ConfigurationException("Attribute ID for billing order type is not set. Please set '"
			        + ICareConfig.BILLING_ORDER_TYPE + "'");
		}
		
		String consultationOrderTypeUuid = adminService.getGlobalProperty(ICareConfig.CONSULTATION_ORDER_TYPE);
		if (consultationOrderTypeUuid == null) {
			throw new ConfigurationException("Attribute ID for consultation order type is not set. Please set '"
			        + ICareConfig.CONSULTATION_ORDER_TYPE + "'");
		}
		
		//Validate the visit with required attributes
		if (visit.getServiceConceptUuid() == null) {
			throw new VisitInvalidException("Service has not been specified in the visit");
		}
		if (visit.getPaymentTypeUuid() == null) {
			throw new VisitInvalidException("Payment Type has not been specified in the visit");
		}
		ConceptService conceptService = Context.getService(ConceptService.class);
		Concept serviceConcept = visit.getServiceConcept();
		if (serviceConcept == null) {
			throw new VisitInvalidException("Service concept is not valid. Check the UUID '" + visit.getServiceConceptUuid()
			        + "'.");
		}
		visitMetaData.setServiceConcept(serviceConcept);
		
		Concept paymentTypeConcept = visit.getPaymentType();
		if (paymentTypeConcept == null) {
			throw new VisitInvalidException("Payment Type concept is not valid. Check the UUID '"
			        + visit.getPaymentTypeUuid() + "'.");
		}
		visitMetaData.setPaymentType(paymentTypeConcept);
		if (visit.isInsurance()) {
			if (visit.getInsuranceConceptUuid() == null) {
				throw new VisitInvalidException("Insurance has not been specified in the visit");
			}
			if (visit.getInsuranceID() == null) {
				throw new VisitInvalidException("Insurance ID has not been specified in the visit");
			}
			InsuranceService insuranceService = visit.getInsuranceService();
			
			VerificationRequest verificationRequest = new VerificationRequest();
			verificationRequest.setId(visit.getInsuranceID());
			verificationRequest.setAuthorizationNumber(visit.getInsuranceAuthorizationNumber());
			verificationRequest.setReferralNumber(visit.getInsuranceReferralNumber());
			verificationRequest.setPaymentScheme(visit.getPaymentSchemeUuid());
			VisitType visitType = Context.getVisitService().getVisitTypeByUuid(visit.getVisit().getVisitType().getUuid());
			verificationRequest.setVisitType(visitType);
			VerificationResponse verificationResponse = insuranceService.request(verificationRequest);
			if (verificationResponse.getAuthorizationStatus() == AuthorizationStatus.REJECTED) {
				throw new VerificationException(verificationResponse.getRemarks());
			}
			visit.setInsuranceAuthorizationNumber(verificationResponse.getAuthorizationNumber());
			visit.setPaymentSchemeUuid(verificationResponse.getPaymentScheme().getUuid());
			
			if (visit.getPaymentSchemeUuid() == null) {
				throw new VisitInvalidException("Payment Schema has not been specified in the visit");
			}
			Concept paymentSchemeConcept = verificationResponse.getPaymentScheme();
			if (paymentSchemeConcept == null) {
				throw new VisitInvalidException("Payment Schema concept is not valid. Check the UUID '"
				        + visit.getPaymentSchemeUuid() + "'.");
			}
			visitMetaData.setPaymentScheme(paymentSchemeConcept);
		} else {
			if (visit.getPaymentSchemeUuid() == null) {
				throw new VisitInvalidException("Payment Schema has not been specified in the visit");
			}
			Concept paymentSchemeConcept = conceptService.getConceptByUuid(visit.getPaymentSchemeUuid());
			if (paymentSchemeConcept == null) {
				throw new VisitInvalidException("Payment Schema concept is not valid. Check the UUID '"
				        + visit.getPaymentSchemeUuid() + "'.");
			}
			visitMetaData.setPaymentScheme(paymentSchemeConcept);
		}
		EncounterService encounterService = Context.getService(EncounterService.class);
		EncounterType encounterType = encounterService.getEncounterTypeByUuid(registrationEncounterType);
		if (encounterType == null) {
			throw new APIException("Registration Encounter does not exist. Please see '" + registrationEncounterType + "'.");
		}
		visitMetaData.setRegistrationEncounterType(encounterType);
		Concept feeConcept = conceptService.getConceptByUuid(registrationFeeConcept);
		if (feeConcept == null) {
			throw new APIException("Fee Concept does not exist. Please see UUID '" + registrationFeeConcept + "'.");
		}
		visitMetaData.setRegistrationFeeConcept(feeConcept);
		
		OrderService orderService = Context.getService(OrderService.class);
		OrderType billingOrderType = orderService.getOrderTypeByUuid(billingOrderTypeUuid);
		if (billingOrderType == null) {
			throw new APIException("Billing order type does not exist. Please see UUID '" + billingOrderTypeUuid + "'.");
		}
		visitMetaData.setBillingOrderType(billingOrderType);
		
		OrderType consultationOrderType = orderService.getOrderTypeByUuid(consultationOrderTypeUuid);
		if (consultationOrderType == null) {
			throw new APIException("Consultation order type does not exist. Please see UUID '" + consultationOrderTypeUuid
			        + "'.");
		}
		visitMetaData.setConsultationOrderType(consultationOrderType);
		//Check the existance of Item Prices
		ICareService iCareService = Context.getService(ICareService.class);
		ItemPrice serviceItemPrice = iCareService.getItemPriceByConceptId(serviceConcept.getId(), visit.getPaymentScheme()
		        .getId(), paymentTypeConcept.getId());
		if (serviceItemPrice == null) {
			throw new VisitInvalidException("Service Fee:" + serviceConcept.getDisplayString() + "("
			        + serviceConcept.getUuid() + ") " + "Payment Scheme:"
			        + visitMetaData.getPaymentScheme().getDisplayString() + "(" + visitMetaData.getPaymentScheme().getUuid()
			        + ") " + " Payment Type:" + paymentTypeConcept.getDisplayString() + "(" + paymentTypeConcept.getUuid()
			        + ") " + "is not a billable item");
		}
		visitMetaData.setServiceItemPrice(serviceItemPrice);
		ItemPrice regItemPrice = iCareService.getItemPriceByConceptId(feeConcept.getId(), visitMetaData.getPaymentScheme()
		        .getId(), paymentTypeConcept.getId());
		
		if (regItemPrice == null) {
			throw new VisitInvalidException("Registration Fee:" + feeConcept.getUuid() + " Payment Scheme:"
			        + visitMetaData.getPaymentScheme().getUuid() + " Payment Type:" + paymentTypeConcept.getUuid()
			        + " is not a billable item");
		}
		visitMetaData.setRegistrationItemPrice(regItemPrice);
		return visitMetaData;
	}
	
	public void processVisit(VisitWrapper visitWrapper, VisitMetaData visitMetaData) throws VisitInvalidException,
	        ConfigurationException {
		
		//Start Creating Invoice
		Patient patient = visitWrapper.getVisit().getPatient();
		Invoice invoice = new Invoice();
		invoice.setVisit(visitWrapper.getVisit());
		//invoice.setPatient(patient);
		
		//Create a patient encounter at the registration
		EncounterService encounterService = Context.getService(EncounterService.class);
		Encounter encounter = new Encounter();
		encounter.setVisit(visitWrapper.getVisit());
		encounter.setPatient(patient);
		encounter.setEncounterDatetime(new Date());
		
		AdministrationService adminService = Context.getService(AdministrationService.class);
		String registrationEncounterRoleId = adminService.getGlobalProperty(ICareConfig.REGISTRATION_ENCOUNTER_ROLE);
		if (registrationEncounterRoleId == null) {
			throw new ConfigurationException("Registration Encounter Role is not configured. Please check "
			        + ICareConfig.REGISTRATION_ENCOUNTER_ROLE + ".");
		}
		List<Provider> providers = (List<Provider>) Context.getService(ProviderService.class).getProvidersByPerson(
		    Context.getAuthenticatedUser().getPerson());
		encounter.setProvider(encounterService.getEncounterRoleByUuid(registrationEncounterRoleId), providers.get(0));
		
		encounterService.getEncounterRoleByUuid(registrationEncounterRoleId);
		encounter.setEncounterType(visitMetaData.getRegistrationEncounterType());
		visitWrapper.getVisit().addEncounter(encounter);
		encounterService.saveEncounter(encounter);
		
		//Get concepts for payment type and payment scheme to assosciate with item price
		
		OrderService orderService = Context.getService(OrderService.class);
		VisitService visitService = Context.getService(VisitService.class);
		//List<Visit> visits = visitService.getVisitsByPatient(patient);
		Date newDate = new Date(System.currentTimeMillis() - TimeUnit.HOURS.toMillis(Integer.valueOf("24")));
		//If this is the first visit for this patient create a registration fee order
		//Check if patient existed in the system to determine whether they should be billed for Registration Fee
		if (patient.getDateCreated().after(newDate)) {
			//TODO Soft code the UUID for fee concept
			Concept feeConcept = visitMetaData.getRegistrationFeeConcept();
			
			Order order = new Order();
			order.setConcept(feeConcept);
			order.setPatient(patient);
			order.setEncounter(encounter);
			order.setOrderer(providers.get(0));
			order.setOrderType(visitMetaData.getBillingOrderType());
			
			OrderContext orderContext = new OrderContext();
			
			//TODO Softcode to get the current care setting of the visit
			orderContext.setCareSetting(orderService.getCareSetting(1));
			encounter.addOrder(order);
			orderService.saveOrder(order, orderContext);
		}
		
		//Get concepts for service
		Concept serviceConcept = visitMetaData.getServiceConcept();
		
		Order order = new Order();
		order.setConcept(serviceConcept);
		order.setPatient(patient);
		order.setEncounter(encounter);
		order.setOrderer(providers.get(0));
		order.setOrderType(visitMetaData.getConsultationOrderType());
		
		OrderContext orderContext = new OrderContext();
		//TODO Softcode to get the current care setting of the visit
		orderContext.setCareSetting(orderService.getCareSetting(1));
		encounter.addOrder(order);
		orderService.saveOrder(order, orderContext);
	}
	
	@Override
	public Visit createVisit(MethodInvocation invocation) throws Throwable {
		//Visit visit = (Visit) invocation.getArguments()[0];
		//VisitWrapper visit = new VisitWrapper((Visit) invocation.getArguments()[0]);
		VisitWrapper visitWrapper = new VisitWrapper((Visit) invocation.getArguments()[0]);
		VisitService visitService = Context.getVisitService();
		Visit existingVisit = visitService.getVisitByUuid(visitWrapper.getVisit().getUuid());
		if (existingVisit != null) {
			return (Visit) invocation.proceed();
		}
		VisitMetaData visitMetaData = this.validateVisitMetaData(visitWrapper);
		visitWrapper = new VisitWrapper((Visit) invocation.proceed());
		this.processVisit(visitWrapper, visitMetaData);
		return visitWrapper.getVisit();
	}
	
	Invoice convertEncounterToInvoice(Encounter encounter) {
		Invoice invoice = new Invoice();
		invoice.setVisit(encounter.getVisit());
		
		List<InvoiceItem> items = new ArrayList<InvoiceItem>();
		for (Order order : encounter.getOrders()) {
			InvoiceItem item = new InvoiceItem();
			item.setOrder(order);
			items.add(item);
		}
		invoice.setInvoiceItems(items);
		return invoice;
	}
	
	public Order createOrderForOngoingIPDPatients() throws Exception {
		
		Order newOrder = new Order();
		OrderService orderService = Context.getService(OrderService.class);
		
		List<Visit> visits = dao.getOpenAdmittedVisit();
		
		for (Visit visit : visits) {
			Order order = new Order();
			AdministrationService administrationService = Context.getService(AdministrationService.class);
			
			String bedOrderTypeUUID = administrationService.getGlobalProperty(ICareConfig.BED_ORDER_TYPE);
			if (bedOrderTypeUUID == null) {
				throw new ConfigurationException("Bed Order Type is not configured. Please check "
				        + ICareConfig.BED_ORDER_TYPE + ".");
			}
			String bedOrderConceptUUID = administrationService.getGlobalProperty(ICareConfig.BED_ORDER_CONCEPT);
			if (bedOrderConceptUUID == null) {
				throw new ConfigurationException("Bed Order Concept is not configured. Please check "
				        + ICareConfig.BED_ORDER_CONCEPT + ".");
			}
			
			OrderType bedOrderOrderType = Context.getOrderService().getOrderTypeByUuid(bedOrderTypeUUID);
			
			Provider provider = Context.getProviderService().getProvider(1);
			
			Concept concept = Context.getConceptService().getConceptByUuid(bedOrderConceptUUID);
			
			order.setPatient(visit.getPatient());
			order.setAction(Order.Action.NEW);
			order.setCareSetting(orderService.getCareSettingByName("Inpatient"));
			order.setOrderType(bedOrderOrderType);
			order.setConcept(concept);
			order.setOrderer(provider);
			order.setEncounter((Encounter) visit.getEncounters().toArray()[0]);
			OrderContext orderContext = new OrderContext();
			orderContext.setCareSetting(orderService.getCareSetting(1));
			newOrder = orderService.saveOrder(order, orderContext);
		}
		return newOrder;
		
	}
	
	public Order createOrderForOngoingDeceasedPatients() throws Exception {
		
		Order newOrder = new Order();
		OrderService orderService = Context.getService(OrderService.class);
		
		List<Visit> visits = dao.getOpenVisitForDeceasedPatients();
		
		for (Visit visit : visits) {
			Order order = new Order();
			AdministrationService administrationService = Context.getService(AdministrationService.class);
			
			String cabinetOrderTypeUUID = administrationService.getGlobalProperty(ICareConfig.CABINET_ORDER_TYPE);
			if (cabinetOrderTypeUUID == null) {
				throw new ConfigurationException("Cabinet Order Type is not configured. Please check "
				        + ICareConfig.CABINET_ORDER_TYPE + ".");
			}
			String cabinetOrderConceptUUID = administrationService.getGlobalProperty(ICareConfig.BED_ORDER_CONCEPT);
			if (cabinetOrderConceptUUID == null) {
				throw new ConfigurationException("Bed Order Concept is not configured. Please check "
				        + ICareConfig.CABINET_ORDER_CONCEPT + ".");
			}
			
			OrderType cabinetOrderOrderType = Context.getOrderService().getOrderTypeByUuid(cabinetOrderTypeUUID);
			
			Provider provider = Context.getProviderService().getProvider(1);
			
			Concept concept = Context.getConceptService().getConceptByUuid(cabinetOrderConceptUUID);
			
			order.setPatient(visit.getPatient());
			order.setAction(Order.Action.NEW);
			order.setCareSetting(orderService.getCareSettingByName("Deceasedpatient"));
			order.setOrderType(cabinetOrderOrderType);
			order.setConcept(concept);
			order.setOrderer(provider);
			order.setEncounter((Encounter) visit.getEncounters().toArray()[0]);
			OrderContext orderContext = new OrderContext();
			orderContext.setCareSetting(orderService.getCareSetting(1));
			newOrder = orderService.saveOrder(order, orderContext);
		}
		return newOrder;
	}
}
