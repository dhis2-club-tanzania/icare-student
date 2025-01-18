package org.openmrs.module.icare.billing;

import org.aopalliance.intercept.MethodInvocation;
import org.openmrs.*;
import org.openmrs.api.*;
import org.openmrs.api.context.Context;
import org.openmrs.api.impl.BaseOpenmrsService;
import org.openmrs.attribute.AttributeType;
import org.openmrs.module.icare.ICareConfig;
import org.openmrs.module.icare.billing.Utils.PaymentStatus;
import org.openmrs.module.icare.billing.dao.DiscountDAO;
import org.openmrs.module.icare.billing.dao.InvoiceDAO;
import org.openmrs.module.icare.billing.dao.PaymentDAO;
import org.openmrs.module.icare.billing.models.*;
import org.openmrs.module.icare.billing.services.BillingService;
import org.openmrs.module.icare.billing.services.insurance.*;
import org.openmrs.module.icare.billing.services.insurance.nhif.NHIFConfig;
import org.openmrs.module.icare.billing.services.insurance.nhif.NHIFServiceImpl;
import org.openmrs.module.icare.billing.services.payment.gepg.BillHdr;
import org.openmrs.module.icare.billing.services.payment.gepg.BillItem;
import org.openmrs.module.icare.billing.services.payment.gepg.BillItems;
import org.openmrs.module.icare.billing.services.payment.gepg.BillSubmissionRequest;
import org.openmrs.module.icare.billing.services.payment.gepg.BillTrxInf;
import org.openmrs.module.icare.billing.services.payment.gepg.RequestData;
import org.openmrs.module.icare.billing.services.payment.gepg.SignatureUtils;
import org.openmrs.module.icare.billing.services.payment.gepg.SystemAuth;
import org.openmrs.module.icare.core.ICareService;
import org.openmrs.module.icare.core.Item;
import org.openmrs.module.icare.core.dao.ICareDao;
import org.openmrs.module.icare.core.utils.VisitWrapper;

import com.fasterxml.jackson.databind.ObjectMapper;

import javax.naming.ConfigurationException;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
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
		// return this.invoiceDAO.findByPatientUuid(patientUuid);
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
			// TestOrder testOrder = (TestOrder) orderMetaData.getOrder();
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
			// TestOrder testOrder = (TestOrder) orderMetaData.getOrder();
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
			
			// Automatic discount creation for full exempted discounts
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
					// Find the coresponding discount item
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
		// TODO Payments should address particular item prices in the invoice
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
			item.setStatus(PaymentStatus.PAID);
		}
		payment.setReceivedBy(Context.getAuthenticatedUser().getName());
		payment.setStatus(PaymentStatus.PAID);
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
		// discount.setCreator(Context.getAuthenticatedUser());
		
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
		
		// Validate the visit with required attributes
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
		// Check the existance of Item Prices
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
		
		// Start Creating Invoice
		Patient patient = visitWrapper.getVisit().getPatient();
		Invoice invoice = new Invoice();
		invoice.setVisit(visitWrapper.getVisit());
		// invoice.setPatient(patient);
		
		// Create a patient encounter at the registration
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
		
		// Get concepts for payment type and payment scheme to assosciate with item
		// price
		
		OrderService orderService = Context.getService(OrderService.class);
		VisitService visitService = Context.getService(VisitService.class);
		// List<Visit> visits = visitService.getVisitsByPatient(patient);
		Date newDate = new Date(System.currentTimeMillis() - TimeUnit.HOURS.toMillis(Integer.valueOf("24")));
		// If this is the first visit for this patient create a registration fee order
		// Check if patient existed in the system to determine whether they should be
		// billed for Registration Fee
		if (patient.getDateCreated().after(newDate)) {
			// TODO Soft code the UUID for fee concept
			Concept feeConcept = visitMetaData.getRegistrationFeeConcept();
			
			Order order = new Order();
			order.setConcept(feeConcept);
			order.setPatient(patient);
			order.setEncounter(encounter);
			order.setOrderer(providers.get(0));
			order.setOrderType(visitMetaData.getBillingOrderType());
			
			OrderContext orderContext = new OrderContext();
			
			// TODO Softcode to get the current care setting of the visit
			orderContext.setCareSetting(orderService.getCareSetting(1));
			encounter.addOrder(order);
			orderService.saveOrder(order, orderContext);
		}
		
		// Get concepts for service
		Concept serviceConcept = visitMetaData.getServiceConcept();
		
		Order order = new Order();
		order.setConcept(serviceConcept);
		order.setPatient(patient);
		order.setEncounter(encounter);
		order.setOrderer(providers.get(0));
		order.setOrderType(visitMetaData.getConsultationOrderType());
		
		OrderContext orderContext = new OrderContext();
		// TODO Softcode to get the current care setting of the visit
		orderContext.setCareSetting(orderService.getCareSetting(1));
		encounter.addOrder(order);
		orderService.saveOrder(order, orderContext);
	}
	
	@Override
	public Visit createVisit(MethodInvocation invocation) throws Throwable {
		// Visit visit = (Visit) invocation.getArguments()[0];
		// VisitWrapper visit = new VisitWrapper((Visit) invocation.getArguments()[0]);
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
	
	@Override
	public List<Object[]> getTotalAmountFromPaidInvoices(Date startDate, Date endDate, String provider) throws Exception {
		return this.invoiceDAO.getTotalAmountFromPaidInvoices(startDate, endDate, provider);
	}
	
	@Override
	public Map<String, Object> processGepgCallbackResponse(Map<String, Object> callbackData) {

		AdministrationService administrationService = Context.getAdministrationService();

		// Initialize the response structure
		Map<String, Object> response = new HashMap<>();
		Map<String, Object> systemAuth = new HashMap<>();
		Map<String, Object> ackData = new HashMap<>();
		// SystemAuth setup
		String systemCode = administrationService.getGlobalProperty(ICareConfig.GEPG_SYSTEM_CODE);
		String clientPrivateKey = administrationService.getGlobalProperty(ICareConfig.CLIENT_PRIVATE_KEY);

		try {
			// Check if Status and FeedbackData fields are present
			if (callbackData.containsKey("Status") && callbackData.containsKey("FeedbackData")) {

				Map<String, Object> status = (Map<String, Object>) callbackData.get("Status");
				Map<String, Object> feedbackData = (Map<String, Object>) callbackData.get("FeedbackData");
				GlobalProperty globalProperty = new GlobalProperty();
				globalProperty.setProperty("gepg.callbackResponseData.icareConnect");
				globalProperty.setPropertyValue(callbackData.toString());
				administrationService.saveGlobalProperty(globalProperty);
				if (feedbackData.containsKey("gepgPmtSpInfo")) {
					Map<String, Object> gepgPmtSpInfo = (Map<String, Object>) feedbackData.get("gepgPmtSpInfo");
					Map<String, Object> pymtTrxInf = (Map<String, Object>) gepgPmtSpInfo.get("PymtTrxInf");
					String requestId = status.containsKey("RequestId") ? (String) status.get("RequestId") : null;
					Payment payment = this.paymentDAO.getPaymentByRequestId(Integer.parseInt(requestId));

					if (payment != null) {
						payment.setReferenceNumber((String) pymtTrxInf.get("PayCtrNum"));
						payment.setBillAmount(Double.parseDouble((String) pymtTrxInf.get("BillAmt")));
						payment.setPaidAmount(Double.parseDouble((String) pymtTrxInf.get("PaidAmt")));
						LocalDateTime localDateTime = LocalDateTime.parse((String) pymtTrxInf.get("TrxDtTm"));
						Date paymentDate = Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
						payment.setReceiptNumber((String) pymtTrxInf.get("PspReceiptNumber"));
						payment.setPaymentDate(paymentDate);
						payment.setPayerNumber((String) pymtTrxInf.get("PyrCellNum"));
						payment.setPayerName((String) pymtTrxInf.get("PyrName"));
						payment.setPspName((String) pymtTrxInf.get("PspName"));
						payment.setAccountNumber((String) pymtTrxInf.get("CtrAccNum"));
						payment.setStatus(PaymentStatus.PAID);

						// Save the updated payment
						paymentDAO.updatePayment(payment);
						ackData.put("SystemAckCode", "0");
						ackData.put("Description", "Payment Successfully Updated");
						ackData.put("RequestId", requestId);
						// Sign the ackData
						String ackDataJson = new ObjectMapper().writeValueAsString(ackData);
						String signature = SignatureUtils.signData(ackDataJson, clientPrivateKey);
						systemAuth.put("Signature", signature);
						systemAuth.put("SystemCode", systemCode);
						response.put("SystemAuth", systemAuth);
						response.put("AckData", ackData);

					} else {
						ackData.put("SystemAckCode", "0");
						ackData.put("Description", "Fail, No Data with this RequestId");
						ackData.put("RequestId", requestId);
						// Sign the ackData
						String ackDataJson = new ObjectMapper().writeValueAsString(ackData);
						String signature = SignatureUtils.signData(ackDataJson, clientPrivateKey);
						systemAuth.put("Signature", signature);
						systemAuth.put("SystemCode", systemCode);
						response.put("SystemAuth", systemAuth);
						response.put("AckData", ackData);
					}
				} else if (feedbackData.containsKey("gepgBillSubResp")) {
					Map<String, Object> gepgBillSubResp = (Map<String, Object>) feedbackData.get("gepgBillSubResp");
					Map<String, Object> billTrxInf = (Map<String, Object>) gepgBillSubResp.get("BillTrxInf");

					String billIdString = (String) billTrxInf.get("BillId");

					String payCntrNum = (String) billTrxInf.get("PayCntrNum");
					String requestId = status.containsKey("RequestId") ? (String) status.get("RequestId") : null;

					systemAuth.put("SystemCode", systemCode);
					if (billIdString == null || payCntrNum == null || requestId == null) {
						return buildErrorResponse(response, systemAuth, ackData, requestId,
								"Invalid data in callbackData: missing BillId, PayCntrNum, or RequestId");
					}

					Integer billId = Integer.parseInt(billIdString);
					Invoice invoice = invoiceDAO.findById(billId);
					if (invoice == null) {
						systemAuth.put("Signature", null);
						return buildErrorResponse(response, systemAuth, ackData, requestId,
								"Invoice of this Bill id " + billId + " is not valid");
					}

					String paymentTypeConceptUuid = administrationService
							.getGlobalProperty(ICareConfig.DEFAULT_PAYMENT_TYPE_VIA_CONTROL_NUMBER);
					if (paymentTypeConceptUuid == null) {
						systemAuth.put("Signature", null);
						return buildErrorResponse(response, systemAuth, ackData, requestId,
								"No default payment type based on control number");
					}

					Concept paymentType = Context.getConceptService().getConceptByUuid(paymentTypeConceptUuid);
					if (paymentType == null) {
						systemAuth.put("Signature", null);
						return buildErrorResponse(response, systemAuth, ackData, requestId,
								"Payment type concept not found for UUID: " + paymentTypeConceptUuid);
					}

					Payment payment = new Payment();
					// payment.setPaymentType(paymentType);
					payment.setReferenceNumber(payCntrNum);
					// payment.setInvoice(invoice);
					// payment.setReceivedBy("SYSTEM");
					// payment.setStatus(PaymentStatus.REQUESTED);
					// payment.setCreator(Context.getAuthenticatedUser());
					// payment.setUuid(requestId);
					payment.setDateCreated(new Date());

					// Prepare the ackData for signing
					ackData.put("RequestId", requestId);
					Integer paymentId = Integer.parseInt(requestId);
					Payment existingPayment = this.paymentDAO.getPaymentByRequestId(paymentId);
					if (existingPayment != null) {
						// Update the existing payment reference number
						Integer requestId_ = Integer.parseInt(requestId);
						int rowsUpdated = this.paymentDAO.setReferenceNumberByPaymentId(requestId_, payCntrNum);

						if (rowsUpdated > 0) {

							ackData.put("SystemAckCode", "0");
							ackData.put("Description", "Successfully Updated");
						} else {
							ackData.put("SystemAckCode", "0");
							ackData.put("Description", "Fail to Update");
						}

					} else {
						ackData.put("SystemAckCode", "0");
						ackData.put("Description", "Fail to get Reference Payments");
					}

					// Sign the ackData
					String ackDataJson = new ObjectMapper().writeValueAsString(ackData);
					String signature = SignatureUtils.signData(ackDataJson, clientPrivateKey);
					systemAuth.put("Signature", signature);

					response.put("SystemAuth", systemAuth);
					response.put("AckData", ackData);
				} else {
					String requestId = status.containsKey("RequestId") ? (String) status.get("RequestId") : null;
					return buildErrorResponse(response, systemAuth, ackData, requestId,
							"Encounter an Error on response");
				}

			} else {
				return buildErrorResponse(response, systemAuth, ackData, null,
						"Status or FeedbackData field not found in callback data");
			}
		} catch (Exception e) {
			e.printStackTrace();
			return buildErrorResponse(response, systemAuth, ackData, null, "Internal server error: " + e.getMessage());
		}
		return response;
	}
	
	// Helper method to build error response
	private Map<String, Object> buildErrorResponse(Map<String, Object> response, Map<String, Object> systemAuth,
	        Map<String, Object> ackData, String requestId, String errorMessage) {
		ackData.put("RequestId", requestId != null ? requestId : "Unknown Request");
		ackData.put("SystemAckCode", "0");
		ackData.put("Description", errorMessage);
		
		response.put("SystemAuth", systemAuth);
		response.put("AckData", ackData);
		
		return response;
	}
	
	@Override
	public List<Payment> getAllPaymentsWithStatus() throws Exception {
		// Fetch the default payment type UUID from the administration service
		AdministrationService administrationService = Context.getAdministrationService();
		String paymentTypeConceptUuid = administrationService
		        .getGlobalProperty(ICareConfig.DEFAULT_PAYMENT_TYPE_VIA_CONTROL_NUMBER);
		
		if (paymentTypeConceptUuid == null || paymentTypeConceptUuid.isEmpty()) {
			throw new Exception("No default payment type UUID configured for control number.");
		}
		
		// Fetch the Concept by UUID
		Concept paymentType = Context.getConceptService().getConceptByUuid(paymentTypeConceptUuid);
		if (paymentType == null) {
			throw new Exception("Payment type concept not found for UUID: " + paymentTypeConceptUuid);
		}
		
		// Use the concept ID to retrieve payments by payment type
		Integer paymentTypeId = paymentType.getId();
		return paymentDAO.findByPaymentTypeId(paymentTypeId);
	}
	
	public String fetchControlNumber(Integer requestId) throws Exception {
		String controlNumber = null;
		long startTime = System.currentTimeMillis();
		long timeout = 32000;
		
		while (System.currentTimeMillis() - startTime < timeout) {
			controlNumber = paymentDAO.getReferenceNumberByRequestId(requestId);
			AdministrationService administrationService = Context.getAdministrationService();
			GlobalProperty globalProperty = new GlobalProperty();
			globalProperty.setProperty("gepg.controlNumberRes.icareConnect");
			globalProperty.setPropertyValue(controlNumber);
			administrationService.saveGlobalProperty(globalProperty);
			if (controlNumber != null) {
				break;
			}
			try {
				Thread.sleep(4000);
			}
			catch (InterruptedException e) {
				Thread.currentThread().interrupt();
			}
		}
		return controlNumber;
	}
	
	// create payload for GePG Control Number Generation
	// @Override
	// public Map<String, Object> createGePGPayload(Patient patient,
	// List<InvoiceItem> invoiceItems,
	// Number totalBillAmount,
	// Date billExpirlyDate, String personPhoneAttributeTypeUuid, String
	// personEmailAttributeTypeUuid,
	// String currency,
	// String gepgAuthSignature, String GFSCodeConceptSourceMappingUuid, String
	// spCode, String sytemCode,
	// String serviceCode, String SpSysId, String subSpCode, String
	// clientPrivateKey, String pkcs12Path,
	// String pkcs12Password, String enginepublicKey, String billId) throws
	// Exception {
	// AdministrationService administrationService =
	// Context.getAdministrationService();
	// // Validate inputs
	// if (patient == null) {
	// throw new IllegalArgumentException("Patient cannot be null");
	// }
	// if (invoiceItems == null || invoiceItems.isEmpty()) {
	// throw new IllegalArgumentException("Invoice items cannot be null or empty");
	// }
	// if (currency == null) {
	// throw new IllegalArgumentException("Currency cannot be null");
	// }
	// if (gepgAuthSignature == null) {
	// gepgAuthSignature = "";
	// }
	// if (GFSCodeConceptSourceMappingUuid == null) {
	// throw new IllegalArgumentException("GFS Code Concept Source Mapping UUID
	// cannot be null");
	// }
	// if (spCode == null || sytemCode == null || serviceCode == null || SpSysId ==
	// null || subSpCode == null) {
	// String missingParams = "";
	// if (spCode == null)
	// missingParams += "spCode ";
	// if (sytemCode == null)
	// missingParams += "systemCode ";
	// if (serviceCode == null)
	// missingParams += "serviceCode ";
	// if (SpSysId == null)
	// missingParams += "SpSysId ";
	// if (subSpCode == null)
	// missingParams += "subSpCode ";
	// throw new IllegalArgumentException("Missing system parameters: " +
	// missingParams.trim());
	// }
	
	// // Retrieve patient attributes
	// String patientNames = patient.getGivenName() + " " + patient.getFamilyName();
	// String patientUuid = patient.getId().toString();
	// String patientPhoneNumber = "";
	// String email = "";
	// for (PersonAttribute attribute : patient.getAttributes()) {
	// if (personPhoneAttributeTypeUuid != null
	// &&
	// attribute.getAttributeType().getUuid().equals(personPhoneAttributeTypeUuid))
	// {
	// patientPhoneNumber = attribute.getValue();
	// } else if (personEmailAttributeTypeUuid != null
	// &&
	// attribute.getAttributeType().getUuid().equals(personEmailAttributeTypeUuid))
	// {
	// email = attribute.getValue();
	// }
	// }
	
	// // BillItems generation
	
	// BillItems billItems = new BillItems();
	
	// for (InvoiceItem invoiceItem : invoiceItems) {
	// Drug drug = invoiceItem.getItem().getDrug();
	// Concept concept = invoiceItem.getItem().getConcept();
	
	// if (drug == null && concept == null) {
	// throw new IllegalStateException("Concept can not be null for InvoiceItem" +
	// drug + concept);
	// } else if (concept != null) {
	// for (ConceptMap conceptMap : concept.getConceptMappings()) {
	// if (conceptMap.getConceptReferenceTerm().getConceptSource().getUuid()
	// .equals(GFSCodeConceptSourceMappingUuid)) {
	// String GFSCode = conceptMap.getConceptReferenceTerm().getCode();
	// billItems.getBillItem().add(
	// new BillItem(invoiceItem.getItem().getId().toString(), "N",
	// invoiceItem.getPrice().toString(),
	// invoiceItem.getPrice().toString(), "0.0", GFSCode));
	// } else {
	// throw new IllegalStateException(
	// "Please verify GFS CODE concept mapping if configured in a correct way");
	// }
	// }
	// } else if (drug != null) {
	// Concept drugConcept = drug.getConcept();
	// GlobalProperty globalProperty = new GlobalProperty();
	// for (ConceptMap conceptMap : drugConcept.getConceptMappings()) {
	// if (conceptMap.getConceptReferenceTerm().getConceptSource().getUuid()
	// .equals(GFSCodeConceptSourceMappingUuid)) {
	// globalProperty.setProperty("iCare.gepg.DrugConcept.icareConnect");
	// globalProperty.setPropertyValue("if condition meet");
	// administrationService.saveGlobalProperty(globalProperty);
	// String GFSCode = conceptMap.getConceptReferenceTerm().getCode();
	// billItems.getBillItem().add(
	// new BillItem(invoiceItem.getItem().getId().toString(), "N",
	// invoiceItem.getPrice().toString(),
	// invoiceItem.getPrice().toString(), "0.0", GFSCode));
	// } else {
	// throw new IllegalStateException(
	// "Please verify GFS CODE concept mapping if configured in a correct way");
	// }
	// }
	// }
	
	// }
	
	// // Create and populate BillHdr
	// BillHdr billHdr = new BillHdr();
	// billHdr.setSpCode(spCode);
	// billHdr.setRtrRespFlg("true");
	
	// // Create and populate BillTrxInf
	// BillTrxInf billTrxInf = new BillTrxInf();
	// billTrxInf.setBillId(billId);
	// billTrxInf.setSubSpCode(subSpCode);
	// billTrxInf.setSpSysId(SpSysId);
	// billTrxInf.setBillAmt(totalBillAmount.toString());
	// billTrxInf.setMiscAmt("0");
	// LocalDateTime now = LocalDateTime.now();
	// DateTimeFormatter formatter =
	// DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
	// String formattedNow = now.format(formatter);
	// billTrxInf.setBillGenDt(formattedNow);
	
	// LocalDateTime expirationTime = now.plusHours(24);
	// String formattedExpirationTime = expirationTime.format(formatter);
	// billTrxInf.setBillExprDt(formattedExpirationTime);
	// billTrxInf.setPyrId("40");
	// billTrxInf.setPyrName(patientNames.toUpperCase());
	// billTrxInf.setBillDesc("Hospital Bill Payments");
	// billTrxInf.setBillGenBy("UDSM Hospital");
	// billTrxInf.setBillApprBy(patientNames.toUpperCase());
	// billTrxInf.setPyrCellNum(patientPhoneNumber);
	// billTrxInf.setPyrEmail(email);
	// billTrxInf.setCcy(currency);
	// billTrxInf.setBillEqvAmt(totalBillAmount.toString());
	// billTrxInf.setRemFlag("false");
	// billTrxInf.setBillPayOpt("2");
	// billTrxInf.setBillItems(billItems);
	// // Create and populate RequestData
	// // Save PaymentData before Reference Number (Control Number)
	// RequestData requestData = new RequestData();
	// try {
	// Integer billUuid = Integer.parseInt(billId);
	// Invoice invoice = invoiceDAO.findById(billUuid);
	// if (invoice == null) {
	// throw new Exception("Invoice of this Bill id " + billId + " is not valid");
	
	// }
	
	// String paymentTypeConceptUuid = administrationService
	// .getGlobalProperty(ICareConfig.DEFAULT_PAYMENT_TYPE_VIA_CONTROL_NUMBER);
	// if (paymentTypeConceptUuid == null) {
	// throw new Exception("No default payment type based on control number");
	// }
	
	// Concept paymentType =
	// Context.getConceptService().getConceptByUuid(paymentTypeConceptUuid);
	// if (paymentType == null) {
	// throw new Exception("Payment type concept not found for UUID: " +
	// paymentTypeConceptUuid);
	// }
	
	// Payment payment = new Payment();
	// payment.setPaymentType(paymentType);
	// payment.setReferenceNumber(null);
	// payment.setInvoice(invoice);
	// payment.setReceivedBy("SYSTEM");
	// payment.setStatus(PaymentStatus.REQUESTED);
	// payment.setCreator(Context.getAuthenticatedUser());
	// payment.setDateCreated(new Date());
	// this.paymentDAO.save(payment);
	// Integer paymentId = payment.getId();
	// requestData.setRequestId(paymentId.toString());
	// } catch (Exception e) {
	// throw new Exception("Failed to Save Payments Data: " + e.getMessage());
	// }
	
	// requestData.setBillHdr(billHdr);
	// requestData.setBillTrxInf(billTrxInf);
	
	// // Create and populate SystemAuth
	// SystemAuth systemAuth = new SystemAuth();
	// systemAuth.setSystemCode(sytemCode);
	// systemAuth.setServiceCode(serviceCode);
	
	// // Create and return BillSubmissionRequest
	// BillSubmissionRequest billRequest = new BillSubmissionRequest();
	// billRequest.setSystemAuth(systemAuth);
	// billRequest.setRequestData(requestData);
	
	// // Serialize RequestData to JSON for signing
	// String requestDataJson = new ObjectMapper().writeValueAsString(requestData);
	
	// // Save the payload in a global property
	// GlobalProperty globalProperty = new GlobalProperty();
	// globalProperty.setProperty("gepg.requestDataJson.icareConnect");
	// globalProperty.setPropertyValue(requestDataJson);
	// administrationService.saveGlobalProperty(globalProperty);
	
	// // Sign the request data
	// String signature = SignatureUtils.signData(requestDataJson,
	// clientPrivateKey);
	// systemAuth.setSignature(signature);
	
	// Map<String, Object> result = new HashMap<>();
	// result.put("billRequest", billRequest);
	// result.put("signature", signature);
	
	// return result;
	// }
	@Override
	public Map<String, Object> createGePGPayload(Patient patient, List<InvoiceItem> invoiceItems,
			Number totalBillAmount, Date billExpirlyDate, String personPhoneAttributeTypeUuid,
			String personEmailAttributeTypeUuid, String currency, String gepgAuthSignature,
			String GFSCodeConceptSourceMappingUuid, String spCode, String sytemCode, String serviceCode,
			String SpSysId, String subSpCode, String clientPrivateKey, String pkcs12Path,
			String pkcs12Password, String enginepublicKey, String billId) throws Exception {

		// Validate inputs
		validateInputs(patient, invoiceItems, currency, gepgAuthSignature, GFSCodeConceptSourceMappingUuid,
				spCode, sytemCode, serviceCode, SpSysId, subSpCode);

		// Retrieve patient attributes
		String patientId = patient.getPatientId().toString();
		String patientNames = patient.getGivenName() + " " + patient.getFamilyName();
		String patientPhoneNumber = getPatientPhoneNumber(patient, personPhoneAttributeTypeUuid);
		String email = getPatientEmail(patient, personEmailAttributeTypeUuid);

		// BillItems generation
		BillItems billItems = createBillItems(invoiceItems, GFSCodeConceptSourceMappingUuid);

		// Create and populate BillHdr
		BillHdr billHdr = createBillHdr(spCode);

		// Create and populate BillTrxInf
		BillTrxInf billTrxInf = createBillTrxInf(totalBillAmount, patientNames, patientPhoneNumber, email,
				currency, billId, billExpirlyDate, billItems, subSpCode, SpSysId, patientId);

		// Create and populate RequestData
		RequestData requestData = createRequestData(billHdr, billTrxInf, billId);

		// Create and populate SystemAuth
		SystemAuth systemAuth = createSystemAuth(sytemCode, serviceCode);

		// Create the BillSubmissionRequest
		BillSubmissionRequest billRequest = new BillSubmissionRequest();
		billRequest.setSystemAuth(systemAuth);
		billRequest.setRequestData(requestData);

		// Serialize RequestData to JSON for signing
		String requestDataJson = new ObjectMapper().writeValueAsString(requestData);

		// Sign the request data
		String signature = SignatureUtils.signData(requestDataJson, clientPrivateKey);
		systemAuth.setSignature(signature);

		// Return the result
		Map<String, Object> result = new LinkedHashMap<>();
		result.put("billRequest", billRequest);
		result.put("signature", signature);

		return result;
	}
	
	// Validate the inputs
	private void validateInputs(Patient patient, List<InvoiceItem> invoiceItems, String currency, String gepgAuthSignature,
	        String GFSCodeConceptSourceMappingUuid, String spCode, String sytemCode, String serviceCode, String SpSysId,
	        String subSpCode) {
		if (patient == null || invoiceItems == null || invoiceItems.isEmpty() || currency == null || spCode == null
		        || sytemCode == null || serviceCode == null || SpSysId == null || subSpCode == null) {
			throw new IllegalArgumentException("Invalid system inputs provided.");
		}
	}
	
	// Retrieve the patient phone number
	private String getPatientPhoneNumber(Patient patient, String personPhoneAttributeTypeUuid) {
		for (PersonAttribute attribute : patient.getAttributes()) {
			if (attribute.getAttributeType().getUuid().equals(personPhoneAttributeTypeUuid)) {
				return attribute.getValue();
			}
		}
		return "";
	}
	
	// Retrieve the patient email
	private String getPatientEmail(Patient patient, String personEmailAttributeTypeUuid) {
		for (PersonAttribute attribute : patient.getAttributes()) {
			if (attribute.getAttributeType().getUuid().equals(personEmailAttributeTypeUuid)) {
				return attribute.getValue();
			}
		}
		return "";
	}
	
	// Create BillItems
	private BillItems createBillItems(List<InvoiceItem> invoiceItems, String GFSCodeConceptSourceMappingUuid) {
		BillItems billItems = new BillItems();
		for (InvoiceItem invoiceItem : invoiceItems) {
			Drug drug = invoiceItem.getItem().getDrug();
			Concept concept = invoiceItem.getItem().getConcept();
			if (drug == null && concept == null) {
				throw new IllegalStateException("Concept can not be null for InvoiceItem" + drug + concept);
			} else if (concept != null) {
				for (ConceptMap conceptMap : concept.getConceptMappings()) {
					if (conceptMap.getConceptReferenceTerm().getConceptSource().getUuid()
					        .equals(GFSCodeConceptSourceMappingUuid)) {
						String GFSCode = conceptMap.getConceptReferenceTerm().getCode();
						billItems.getBillItem().add(
						    new BillItem(invoiceItem.getItem().getId().toString(), "N", invoiceItem.getPrice().toString(),
						            invoiceItem.getPrice().toString(), "0.0", GFSCode));
					} else {
						throw new IllegalStateException(
						        "Please verify GFS CODE concept mapping if configured in a correct way");
					}
				}
			} else if (drug != null) {
				Concept drugConcept = drug.getConcept();
				for (ConceptMap conceptMap : drugConcept.getConceptMappings()) {
					if (conceptMap.getConceptReferenceTerm().getConceptSource().getUuid()
					        .equals(GFSCodeConceptSourceMappingUuid)) {
						
						String GFSCode = conceptMap.getConceptReferenceTerm().getCode();
						billItems.getBillItem().add(
						    new BillItem(invoiceItem.getItem().getId().toString(), "N", invoiceItem.getPrice().toString(),
						            invoiceItem.getPrice().toString(), "0.0", GFSCode));
					} else {
						throw new IllegalStateException(
						        "Please verify GFS CODE concept mapping if configured in a correct way");
					}
				}
			}
		}
		return billItems;
	}
	
	// Create BillHdr
	private BillHdr createBillHdr(String spCode) {
		BillHdr billHdr = new BillHdr();
		billHdr.setSpCode(spCode);
		billHdr.setRtrRespFlg("true");
		return billHdr;
	}
	
	// format Date
	private String formatDate(Date date) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
		return sdf.format(date);
	}
	
	// Create BillTrxInf
	private BillTrxInf createBillTrxInf(Number totalBillAmount, String patientNames, String patientPhoneNumber,
	        String email, String currency, String billId, Date billExpirlyDate, BillItems billItems, String subSpCode,
	        String SpSysId, String patientId) {
		
		Date now = new Date();
		
		// Calculate 24 hours from BillGenDt
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(now);
		calendar.add(Calendar.HOUR_OF_DAY, 24);
		Date billExpiryDate = calendar.getTime();
		BillTrxInf billTrxInf = new BillTrxInf();
		billTrxInf.setBillId(billId);
		billTrxInf.setSubSpCode(subSpCode);
		billTrxInf.setSpSysId(SpSysId);
		billTrxInf.setBillAmt(totalBillAmount.toString());
		billTrxInf.setMiscAmt("0");
		billTrxInf.setBillGenDt(formatDate(new Date()));
		billTrxInf.setBillExprDt(formatDate(billExpiryDate));
		billTrxInf.setPyrId(patientId);
		billTrxInf.setPyrName(patientNames);
		billTrxInf.setBillDesc("Hospital Bill Payments");
		billTrxInf.setBillGenBy("UDSM Hospital");
		billTrxInf.setBillApprBy("UDSM");
		billTrxInf.setPyrCellNum(patientPhoneNumber);
		billTrxInf.setPyrEmail(email);
		billTrxInf.setCcy(currency);
		billTrxInf.setBillEqvAmt(totalBillAmount.toString());
		billTrxInf.setRemFlag("false");
		billTrxInf.setBillPayOpt("2");
		billTrxInf.setBillItems(billItems);
		return billTrxInf;
	}
	
	// Create RequestData
	private RequestData createRequestData(BillHdr billHdr, BillTrxInf billTrxInf, String billId) throws Exception {
		AdministrationService administrationService = Context.getAdministrationService();
		// Save PaymentData before Reference Number (Control Number)
		RequestData requestData = new RequestData();
		try {
			Integer billUuid = Integer.parseInt(billId);
			Invoice invoice = invoiceDAO.findById(billUuid);
			if (invoice == null) {
				throw new Exception("Invoice of this Bill id " + billId + " is not valid");
				
			}
			
			String paymentTypeConceptUuid = administrationService
			        .getGlobalProperty(ICareConfig.DEFAULT_PAYMENT_TYPE_VIA_CONTROL_NUMBER);
			if (paymentTypeConceptUuid == null) {
				throw new Exception("No default payment type based on control number");
			}
			
			Concept paymentType = Context.getConceptService().getConceptByUuid(paymentTypeConceptUuid);
			if (paymentType == null) {
				throw new Exception("Payment type concept not found for UUID: " + paymentTypeConceptUuid);
			}
			
			Payment payment = new Payment();
			payment.setPaymentType(paymentType);
			payment.setReferenceNumber(null);
			payment.setInvoice(invoice);
			payment.setReceivedBy("SYSTEM");
			payment.setStatus(PaymentStatus.REQUESTED);
			payment.setCreator(Context.getAuthenticatedUser());
			payment.setDateCreated(new Date());
			this.paymentDAO.save(payment);
			Integer paymentId = payment.getId();
			requestData.setRequestId(paymentId.toString());
		}
		catch (Exception e) {
			throw new Exception("Failed to Save Payments Data: " + e.getMessage());
		}
		requestData.setBillHdr(billHdr);
		requestData.setBillTrxInf(billTrxInf);
		return requestData;
	}
	
	// Create SystemAuth
	private SystemAuth createSystemAuth(String sytemCode, String serviceCode) {
		SystemAuth systemAuth = new SystemAuth();
		systemAuth.setSystemCode(sytemCode);
		systemAuth.setServiceCode(serviceCode);
		return systemAuth;
	}
	
	@Override
	public String signatureData(String rowData) throws Exception {
		AdministrationService administrationService = Context.getAdministrationService();
		String clientPrivateKey = administrationService.getGlobalProperty(ICareConfig.CLIENT_PRIVATE_KEY);
		try {
			GlobalProperty globalProperty = new GlobalProperty();
			globalProperty.setProperty("gepg.signaturerowData.icareConnect");
			globalProperty.setPropertyValue(rowData);
			administrationService.saveGlobalProperty(globalProperty);
			String signature = SignatureUtils.signData(rowData, clientPrivateKey);
			return signature;
		}
		catch (IOException e) {
			throw new Exception("Error signing data due to I/O: " + e.getMessage(), e);
		}
		
	}
}
