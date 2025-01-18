/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
package org.openmrs.module.icare.core.impl;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.SocketTimeoutException;
import java.net.URISyntaxException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.TimeUnit;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;
import javax.mail.Authenticator;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.naming.ConfigurationException;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.openmrs.Concept;
import org.openmrs.ConceptReferenceTerm;
import org.openmrs.ConceptSet;
import org.openmrs.Diagnosis;
import org.openmrs.Drug;
import org.openmrs.Encounter;
import org.openmrs.Location;
import org.openmrs.Order;
import org.openmrs.Patient;
import org.openmrs.PatientIdentifier;
import org.openmrs.PatientProgram;
import org.openmrs.Person;
import org.openmrs.PersonAttribute;
import org.openmrs.Privilege;
import org.openmrs.Program;
import org.openmrs.ProgramWorkflow;
import org.openmrs.ProgramWorkflowState;
import org.openmrs.Role;
import org.openmrs.User;
import org.openmrs.Visit;
import org.openmrs.api.APIException;
import org.openmrs.api.AdministrationService;
import org.openmrs.api.ConceptService;
import org.openmrs.api.OrderEntryException;
import org.openmrs.api.ProgramWorkflowService;
import org.openmrs.api.UserService;
import org.openmrs.api.VisitService;
import org.openmrs.api.context.Context;
import org.openmrs.api.db.PatientDAO;
import org.openmrs.api.impl.BaseOpenmrsService;
import org.openmrs.module.icare.ICareConfig;
import org.openmrs.module.icare.auditlog.AuditLog;
import org.openmrs.module.icare.billing.ItemNotPayableException;
import org.openmrs.module.icare.billing.models.ItemPrice;
import org.openmrs.module.icare.billing.models.Prescription;
import org.openmrs.module.icare.billing.services.insurance.Claim;
import org.openmrs.module.icare.billing.services.insurance.ClaimResult;
import org.openmrs.module.icare.billing.services.insurance.InsuranceService;
import org.openmrs.module.icare.billing.services.insurance.VerificationException;
import org.openmrs.module.icare.core.ICareService;
import org.openmrs.module.icare.core.Item;
import org.openmrs.module.icare.core.ListResult;
import org.openmrs.module.icare.core.Message;
import org.openmrs.module.icare.core.Pager;
import org.openmrs.module.icare.core.Summary;
import org.openmrs.module.icare.core.dao.AuditLogDAO;
import org.openmrs.module.icare.core.dao.EncounterPatientProgramDAO;
import org.openmrs.module.icare.core.dao.EncounterPatientStateDAO;
import org.openmrs.module.icare.core.dao.ICareDao;
import org.openmrs.module.icare.core.dao.PasswordHistoryDAO;
import org.openmrs.module.icare.core.dao.PrivilegeDAO;
import org.openmrs.module.icare.core.dao.ProgramWorkflowDAO;
import org.openmrs.module.icare.core.dao.RoleDAO;
import org.openmrs.module.icare.core.models.EncounterPatientProgram;
import org.openmrs.module.icare.core.models.EncounterPatientState;
import org.openmrs.module.icare.core.models.PasswordHistory;
import org.openmrs.module.icare.core.utils.Dhis2EventWrapper;
import org.openmrs.module.icare.core.utils.PatientWrapper;
import org.openmrs.module.icare.core.utils.VisitWrapper;
import org.openmrs.module.icare.prescription.services.NotificationService;
import org.openmrs.module.icare.report.dhis2.DHIS2Config;
import org.openmrs.module.icare.store.models.OrderStatus;
import org.openmrs.module.icare.store.services.StoreService;
import org.openmrs.validator.ValidateUtil;
import org.springframework.beans.factory.annotation.Autowired;

import com.fasterxml.jackson.databind.ObjectMapper;
//import org.openmrs.module.reporting.report.Report;
//import org.springframework.stereotype.Component;

public class ICareServiceImpl extends BaseOpenmrsService implements ICareService {

	ICareDao dao;

	PatientDAO patientDAO;

	PasswordHistoryDAO passwordHistoryDAO;

	RoleDAO roleDAO;

	PrivilegeDAO privilegeDAO;

	ProgramWorkflowDAO programWorkflowDAO;

	EncounterPatientStateDAO encounterPatientStateDAO;

	AuditLogDAO auditLogDAO;

	EncounterPatientProgramDAO encounterPatientProgramDAO;

	UserService userService;

	/**
	 * Injected in moduleApplicationContext.xml
	 */
	public void setDao(ICareDao dao) {
		this.dao = dao;
	}

	public void setPasswordHistoryDAO(PasswordHistoryDAO passwordHistoryDAO) {
		this.passwordHistoryDAO = passwordHistoryDAO;
	}

	public void setRoleDAO(RoleDAO roleDAO) {
		this.roleDAO = roleDAO;
	}

	public void setPrivilegeDAO(PrivilegeDAO privilegeDAO) {
		this.privilegeDAO = privilegeDAO;
	}

	public void setProgramWorkflowDAO(ProgramWorkflowDAO programWorkflowDAO) {
		this.programWorkflowDAO = programWorkflowDAO;
	}

	public void setEncounterPatientStateDAO(EncounterPatientStateDAO encounterPatientStateDAO) {
		this.encounterPatientStateDAO = encounterPatientStateDAO;
	}

	public void setEncounterPatientProgramDAO(EncounterPatientProgramDAO encounterPatientProgramDAO) {
		this.encounterPatientProgramDAO = encounterPatientProgramDAO;
	}

	public void setAuditLogDAO(AuditLogDAO auditLogDAO) {
		this.auditLogDAO = auditLogDAO;
	}

	/**
	 * Injected in moduleApplicationContext.xml
	 */
	public void setUserService(UserService userService) {
		this.userService = userService;
	}

	@Override
	public Item getItemByUuid(String uuid) throws APIException {
		return dao.findByUuid(uuid);
	}

	@Override
	public Item saveItem(Item item) throws APIException {
		if ((item.getConcept() == null && item.getDrug() == null) || (item.getConcept() != null && item.getDrug() != null)) {
			throw new APIException("One type between Concept or Drug must be specified.");
		}
		if (item.getConcept() != null) {
			ConceptService conceptService = Context.getService(ConceptService.class);
			Concept concept = conceptService.getConceptByUuid(item.getConcept().getUuid());
			if (concept == null) {
				throw new APIException("Concept Does not Exists");
			}
			item.setConcept(concept);
			if (item.getStockable() == null) {
				item.setStockable(false);
			}
		} else if (item.getDrug() != null) {
			ConceptService conceptService = Context.getService(ConceptService.class);
			Drug drug = conceptService.getDrugByUuid(item.getDrug().getUuid());
			if (drug == null) {
				throw new APIException("Drug Does not Exists");
			}
			item.setDrug(drug);
			if (item.getStockable() == null) {
				item.setStockable(true);
			}
		} else {
			throw new APIException("One type between Concept or Drug must be specified.");
		}
		return dao.saveItem(item);
	}

	@Override
	public Item getItemByConceptId(Integer id) {
		return dao.getItemByConceptId(id);
	}

	@Override
	public ItemPrice getItemPriceByConceptId(Integer serviceConceptId, Integer paymentSchemeConceptId,
											 Integer paymentTypeConceptId) {
		return dao.getItemPriceByConceptId(serviceConceptId, paymentSchemeConceptId, paymentTypeConceptId);
	}

	@Override
	public ItemPrice getItemPriceByConceptAndVisit(Visit visit, Concept billableConcept) throws ItemNotPayableException,
			ConfigurationException {
		//VisitMetaData visitMetaData = VisitExtrapolator.extrapolateMetaData(visit);
		VisitWrapper visitWrapper = new VisitWrapper(visit);
		Concept paymentSchemeConcept = visitWrapper.getPaymentScheme();
		Concept paymentTypeConcept = visitWrapper.getPaymentType();
		if (paymentSchemeConcept == null) {
			throw new ItemNotPayableException("Payment Schema has not been specified in the visit");
		}
		if (paymentTypeConcept == null) {
			throw new ItemNotPayableException("Payment Type has not been specified in the visit");
		}
		return this.getItemPriceByConceptId(billableConcept.getId(), paymentSchemeConcept.getId(),
				paymentTypeConcept.getId());
	}

	@Override
	public ItemPrice getItemPrice(Visit visit, Drug drug) throws ItemNotPayableException, ConfigurationException {
		VisitWrapper visitWrapper = new VisitWrapper(visit);
		String serviceConceptUuidForVisit = visitWrapper.getServiceConceptUuid();

		Concept paymentSchemeConcept = visitWrapper.getPaymentScheme();
		Concept paymentTypeConcept = visitWrapper.getPaymentType();
		if (serviceConceptUuidForVisit == null) {
			throw new ItemNotPayableException("Service has not been specified in the visit");
		}
		if (paymentSchemeConcept == null) {
			throw new ItemNotPayableException("Payment Schema has not been specified in the visit");
		}
		if (paymentTypeConcept == null) {
			throw new ItemNotPayableException("Payment Type has not been specified in the visit");
		}
		return dao.getItemPriceByDrugId(drug.getId(), paymentSchemeConcept.getId(), paymentTypeConcept.getId());
	}

	@Override
	public List<ItemPrice> getItemPricesByConceptId(Integer Id) {
		return dao.getItemPricesByConceptId(Id);
	}

	@Override
	public List<ItemPrice> getItemPrices() {
		return dao.getItemPrices();
	}

	@Override
	public List<ItemPrice> getItemPrices(String paymentType, Integer limit, Integer startIndex) {
		if (paymentType == null) {
			return dao.getItemPrices(limit, startIndex);
		} else {
			return dao.getItemPricesByPaymentType(paymentType, limit, startIndex);
		}
	}

	@Override
	public ItemPrice saveItemPrice(ItemPrice itemPrice) throws APIException {
		ConceptService conceptService = Context.getService(ConceptService.class);
		if (itemPrice.getItem().getUuid() != null) {
			Item item = this.getItemByUuid(itemPrice.getItem().getUuid());
			if (item == null) {
				throw new APIException("Item does not Exists");
			}
			itemPrice.setItem(item);
		}
		if (itemPrice.getPaymentScheme() == null) {
			throw new APIException("Payment Scheme not provided");
		}
		Concept paymentScheme = conceptService.getConceptByUuid(itemPrice.getPaymentScheme().getUuid());
		if (paymentScheme == null) {
			throw new APIException("Payment Scheme does not exist");
		}
		itemPrice.setPaymentScheme(paymentScheme);
		if (itemPrice.getPaymentType() == null) {
			throw new APIException("Payment Type not provided");
		}
		Concept paymentType = conceptService.getConceptByUuid(itemPrice.getPaymentType().getUuid());
		if (paymentType == null) {
			throw new APIException("Payment Type does not exist");
		}

		itemPrice.setPaymentType(paymentType);
		if (itemPrice.getPayable() != null && itemPrice.getPayablePaymentMode() == null) {
			throw new APIException("Payment mode for payable not provided");
		} else if (itemPrice.getPayablePaymentMode() != null && itemPrice.getPayablePaymentMode().getUuid() != null
				&& conceptService.getConceptByUuid(itemPrice.getPayablePaymentMode().getUuid()) != null) {
			Concept payablePaymentMode = conceptService.getConceptByUuid(itemPrice.getPayablePaymentMode().getUuid());
			itemPrice.setPayablePaymentMode(payablePaymentMode);
		}
		return dao.saveItemPrice(itemPrice);
	}

	@Override
	public List<Item> getItems() {
		return dao.getItems();
	}

	@Override
	public List<Item> getItems(String search, Integer limit, Integer startIndex, String department, Item.Type type,
							   Boolean stockable) {
		return dao.getItems(search, limit, startIndex, department, type, stockable);
	}

	@Override
	public List<Object> getConceptItems(String search, Integer limit, Integer startIndex, Item.Type type, Boolean stockable,
										String conceptClass) {
		return dao.getConceptItems(search, limit, startIndex, type, stockable, conceptClass);
	}

	@Override
	public List<Item> getStockableItems(String search, Integer limit, Integer startIndex, Item.Type type, Boolean stockable) {
		return dao.getStockableItems(search, limit, startIndex, type, stockable);
	}

	@Override
	public List<Concept> getConceptStockableItems(String search, Integer limit, Integer startIndex, Item.Type type,
												  Boolean stockable) {
		return dao.getConceptStockableItems(search, limit, startIndex, type, stockable);
	}

	@Autowired
	private NotificationService notificationService;

	@Override
	public Prescription savePrescription(Prescription prescription, String status, String remarks) {
		Prescription savedPrescription = null;
		try {
			if (prescription.getUuid() != null) {
				Prescription existingPrescription = (Prescription) Context.getOrderService().getOrderByUuid(
						prescription.getUuid());
				if (existingPrescription != null) {
					if (existingPrescription.getQuantity() != prescription.getQuantity()) {
						List<OrderStatus> orderStatuses = this.dao.getOrderStatusByOrderUuid(prescription.getUuid());
						for (OrderStatus orderStatus : orderStatuses) {
							if (orderStatus.getStatus() == OrderStatus.OrderStatusCode.DISPENSED) {
								throw new OrderEntryException("Order is already dispensed");
							}
						}
					}
					existingPrescription.updatePrescription(prescription);

					dao.updatePrescription(prescription);
					prescription = existingPrescription;
				}
			}

			if (prescription.getPreviousOrder() != null) {
				Double quantity = prescription.getQuantity();
				Prescription previousOrder = (Prescription) Context.getOrderService().getOrderByUuid(
						prescription.getPreviousOrder().getUuid());
				prescription.updatePrescription(previousOrder);
				prescription.setQuantity(quantity);
			}
			AdministrationService administrationService = Context.getAdministrationService();
			administrationService.setGlobalProperty("validation.disable", "true");
			ValidateUtil.setDisableValidation(true);
			savedPrescription = (Prescription) Context.getOrderService().saveOrder(prescription, null);

			// Set respective OrderStatus
			if (status != null) {
				OrderStatus orderStatus = Context.getService(StoreService.class).setDrugOrderStatus(savedPrescription.getUuid(),
						status, remarks);
			}
			administrationService.setGlobalProperty("validation.disable", "false");

			// Send notification after successful save
			if (savedPrescription != null) {
				try {
					Patient patient = savedPrescription.getPatient();
					notificationService.sendNotification(patient);
				} catch (Exception e) {
					// Log the error but don't throw it to prevent disrupting the main prescription flow
					System.out.print("Error sending notification" + e);
				}
			}

			return savedPrescription;
		} catch (Exception e) {
			// If anything fails during the save, ensure validation is re-enabled
			Context.getAdministrationService().setGlobalProperty("validation.disable", "false");
			throw e;
		}
	}
	@Override
	public List<Visit> getVisitsByOrderType(String search, String orderTypeUuid, String encounterTypeUuid,
											String locationUuid, OrderStatus.OrderStatusCode prescriptionStatus, Order.FulfillerStatus fulfillerStatus,
											Integer limit, Integer startIndex, VisitWrapper.OrderBy orderBy, VisitWrapper.OrderByDirection orderByDirection,
											String attributeValueReference, VisitWrapper.PaymentStatus paymentStatus, String visitAttributeTypeUuid,
											String sampleCategory, String exclude, Boolean includeInactive, Boolean includeDeadPatients) {
		return this.dao.getVisitsByOrderType(search, orderTypeUuid, encounterTypeUuid, locationUuid, prescriptionStatus,
				fulfillerStatus, limit, startIndex, orderBy, orderByDirection, attributeValueReference, paymentStatus,
				visitAttributeTypeUuid, sampleCategory, exclude, includeInactive, includeDeadPatients);
	}

	@Override
	public List<Order> getOrdersByVisitAndOrderType(String visitUuid, String orderTypeUuid,
													Order.FulfillerStatus fulfillerStatus, Integer limit, Integer startIndex) {
		return this.dao.getOrdersByVisitAndOrderType(visitUuid, orderTypeUuid, fulfillerStatus, limit, startIndex);
	}

	@Override
	public List<Object[]> getCommonlyOrderedItems(String visitUuid, String orderTypeUuid, Integer limit, Integer startIndex,
												  Boolean isDrug, String provider, Date startDate, Date endDate) {
		return this.dao.getCommonlyOrderedItems(visitUuid, orderTypeUuid, limit, startIndex, isDrug, provider, startDate,
				endDate);
	}

	// @Override
	// public Boolean updateGepgControlNumber(String controlNumber, String uuid) {
	// 	return this.dao.updateGepgControlNumber(controlNumber, uuid);
	// }

	@Override
	public Message sendMessage(Message message) throws Exception {
		String messagePhoneNumber = Context.getAdministrationService().getGlobalProperty(ICareConfig.MESSAGE_PHONE_NUMBER);
		if (messagePhoneNumber == null) {
			throw new Exception("Message Phone Number is not configured. Please check " + ICareConfig.MESSAGE_PHONE_NUMBER
					+ ".");
		}
		message.setPhoneNumber(messagePhoneNumber);
		return sendMessageRequest(message);
		/*String urlString = "https://us-central1-maximal-journey-328212.cloudfunctions.net/messaging";
		URL url = new URL(urlString);
		HttpURLConnection con = (HttpURLConnection) url.openConnection();
		//con.setReadTimeout(15000);
		//con.setConnectTimeout(15000);
		con.setRequestMethod("POST");
		//String bearer = String.format("Bearer %1s", authToken.getAccessToken());
		//con.addRequestProperty("Authorization", bearer);
		con.addRequestProperty("Content-Type", "application/json");
		con.setDoInput(true);
		con.setDoOutput(true);

		OutputStream os = con.getOutputStream();
		BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(os, "UTF-8"));
		String json = new ObjectMapper().writeValueAsString(message.toMap());
		writer.write(json);

		writer.flush();
		writer.close();
		os.close();
		try {
			BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
			String inputLine;
			StringBuffer content = new StringBuffer();
			while ((inputLine = in.readLine()) != null) {
				content.append(inputLine);
			}
			in.close();
			return message;
		}
		catch (SocketTimeoutException e) {
			throw e;
		}
		catch (Exception e) {
			BufferedReader in = new BufferedReader(new InputStreamReader(con.getErrorStream()));
			String inputLine;
			StringBuffer content = new StringBuffer();
			while ((inputLine = in.readLine()) != null) {
				content.append(inputLine);
			}
			in.close();
			throw e;
		}*/
	}

	public Message sendMessageRequest(Message message) throws Exception {
		String urlString = "https://us-central1-maximal-journey-328212.cloudfunctions.net/messaging";
		URL url = new URL(urlString);
		HttpURLConnection con = (HttpURLConnection) url.openConnection();
		//con.setReadTimeout(15000);
		//con.setConnectTimeout(15000);
		con.setRequestMethod("POST");
		//String bearer = String.format("Bearer %1s", authToken.getAccessToken());
		//con.addRequestProperty("Authorization", bearer);
		con.addRequestProperty("Content-Type", "application/json");
		con.setDoInput(true);
		con.setDoOutput(true);

		OutputStream os = con.getOutputStream();
		BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(os, "UTF-8"));
		String json = new ObjectMapper().writeValueAsString(message.toMap());
		writer.write(json);

		writer.flush();
		writer.close();
		os.close();
		try {
			BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
			String inputLine;
			StringBuffer content = new StringBuffer();
			while ((inputLine = in.readLine()) != null) {
				content.append(inputLine);
			}
			in.close();
			return message;
		}
		catch (SocketTimeoutException e) {
			throw e;
		}
		catch (Exception e) {
			BufferedReader in = new BufferedReader(new InputStreamReader(con.getErrorStream()));
			String inputLine;
			StringBuffer content = new StringBuffer();
			while ((inputLine = in.readLine()) != null) {
				content.append(inputLine);
			}
			in.close();
			throw e;
		}
	}

	@Override
	public List<Message> sendMessages(List<Message> messages) throws MalformedURLException, IOException, Exception {
		for (Message message : messages) {
			this.sendMessage(message);
		}
		return messages;
	}

	@Override
	public List<String> generatePatientIds() {
		AdministrationService adminService = Context.getService(AdministrationService.class);
		String idFormat = adminService.getGlobalProperty(ICareConfig.PATIENT_ID_FORMAT);

		if(idFormat.contains("GP{" + DHIS2Config.facilityCode + "}")){
			String facilityCode = adminService.getGlobalProperty(DHIS2Config.facilityCode);
			idFormat = idFormat.replace("GP{" + DHIS2Config.facilityCode + "}", facilityCode);
		}

		if(idFormat.contains("D{YYYYMMDD}")){
			SimpleDateFormat formatter = new SimpleDateFormat("YYYYMMDD", Locale.ENGLISH);
			idFormat = idFormat.replace("D{YYYYMMDD}", formatter.format(new Date()));
			idFormat = idFormat.replace("COUNT", "" + String.format("%03d", dao.countDailyPatients() + 1));
		}
		if(idFormat.contains("D{YYYYMM}")){
			SimpleDateFormat formatter = new SimpleDateFormat("YYYYMM", Locale.ENGLISH);
			idFormat = idFormat.replace("D{YYYYMM}", formatter.format(new Date()));
			idFormat = idFormat.replace("COUNT", "" + String.format("%04d", dao.countMonthlyPatients() + 1));
		}
		if(idFormat.contains("D{YYYY}")){
			SimpleDateFormat formatter = new SimpleDateFormat("YYYY", Locale.ENGLISH);
			idFormat = idFormat.replace("D{YYYY}", formatter.format(new Date()));
			idFormat = idFormat.replace("COUNT", "" + String.format("%05d", dao.countYearlyPatients() + 1));
		}
//		if(idFormat.contains("COUNTDAILY{PATIENT}")){
//			idFormat = idFormat.replace("COUNTDAILY{PATIENT}", "" + String.format("%03d", dao.countDailyPatients() + 1));
//		}
//		if(idFormat.contains("COUNTMONTHLY{PATIENT}")){
//			idFormat = idFormat.replace("COUNTMONTHLY{PATIENT}", "" + String.format("%04d", dao.countMonthlyPatients() + 1));
//		}
//		if(idFormat.contains("COUNTYEARLY{PATIENT}")){
//			idFormat = idFormat.replace("COUNTYEARLY{PATIENT}", "" + String.format("%05d", dao.countYearlyPatients() + 1));
//		}
		List<String> identifiers = new ArrayList<>();
		identifiers.add(idFormat);
		return identifiers;
	}

	@Override
	public List<String> generateCode(String globalPropertyUuid, String metadataType, Integer count) throws Exception {
		return dao.generateCode(globalPropertyUuid, metadataType, count);
	}

	@Override
	public OrderStatus saveOrderStatus(OrderStatus orderStatus) {
		OrderStatus savedOrderStatus = Context.getService(StoreService.class).setDrugOrderStatus(
				orderStatus.getOrder().getUuid(), orderStatus.getStatus().toString(), orderStatus.getRemarks());
		return savedOrderStatus;
	}

	@Override
	public void updatePasswordHistory() throws Exception {
		List<User> users = Context.getUserService().getAllUsers();
		List<User> usersInPasswordHistory = this.passwordHistoryDAO.getUsersInPasswordHistory();
		PasswordHistory passwordHistory = new PasswordHistory();
		Date date = new Date();

		for (User user : users) {
			if (!(usersInPasswordHistory.contains(user))) {
				passwordHistory.setUser(user);
				passwordHistory.setChangedDate(date);
				passwordHistory.setPassword("Password encryption");
				this.passwordHistoryDAO.save(passwordHistory);

			}
		}
	}

	@Override
	public PasswordHistory savePasswordHistory(User user, String newPassword) throws Exception {
		Date date = new Date();
		PasswordHistory passwordHistory = new PasswordHistory();
		if (user != null) {
			passwordHistory.setUser(user);
		} else {
			passwordHistory.setUser(Context.getAuthenticatedUser());
		}
		if (newPassword != null) {
			passwordHistory.setPassword(newPassword);
		}
		passwordHistory.setChangedDate(date);

		return passwordHistoryDAO.save(passwordHistory);
	}

	@Override
	public List<PasswordHistory> getUserPasswordHistory(String uuid) {

		return passwordHistoryDAO.getUsersPasswordHistory(uuid);
	}

	@Override
	public List<Role> getRoles(String q, Integer startIndex, Integer limit) {
		return roleDAO.getRoles(q, startIndex, limit);
	}

	@Override
	public List<Privilege> getPrivileges(String q, Integer startIndex, Integer limit) {
		return privilegeDAO.getPrivileges(q, startIndex, limit);
	}

	@Override
	public ProgramWorkflow saveProgramWorkflow(ProgramWorkflow programWorkflow) {
		return programWorkflowDAO.save(programWorkflow);
	}

	@Override
	public List<PatientProgram> getPatientProgram(String programUuid, String patientUuid, Integer startIndex, Integer limit, Boolean includeDeadPatients)
			throws Exception {
		Program program = null;
		if (programUuid != null) {
			program = Context.getProgramWorkflowService().getProgramByUuid(programUuid);
			if (program == null) {
				throw new Exception("The program with the given Uuid does not exist");
			}
		}

		Patient patient = null;
		if (patientUuid != null) {
			patient = Context.getPatientService().getPatientByUuid(patientUuid);
			if (patient == null) {
				throw new Exception("The patient with the given Uuid does not exist");
			}

		}
		// TODO: ADD SUPPORT FOR THE API TO ACCOMODATE THE REMAINING PARAMETERS
		List<PatientProgram> patientPrograms = Context.getProgramWorkflowService().getPatientPrograms(patient, program, null, null, null, null, false);

		List<PatientProgram> existingPatientPrograms = new ArrayList<>();
		for(PatientProgram patientProgram : patientPrograms){
			if(!patientProgram.getPatient().getPerson().getDead()){
				existingPatientPrograms.add(patientProgram);
			}
		}
		if(includeDeadPatients){
			return  patientPrograms;
		}
		else{
			return existingPatientPrograms;
		}

	}

	@Override
	public EncounterPatientState saveEncounterPatientState(EncounterPatientState encounterPatientState) {
		return encounterPatientStateDAO.save(encounterPatientState);
	}

	@Override
	public List<Encounter> getEncountersByPatientState(String patientStateUuid) {
		return encounterPatientStateDAO.getEncountersByPatientState(patientStateUuid);
	}

	@Override
	public EncounterPatientProgram saveEncounterPatientProgram(EncounterPatientProgram encounterPatientProgram) {
		return encounterPatientProgramDAO.save(encounterPatientProgram);
	}

	@Override
	public List<Encounter> getEncountersByPatientProgram(String patientProgramUuid) {
		return encounterPatientProgramDAO.getEncounterByPatientProgram(patientProgramUuid);
	}

	@Override
	public Item getItemByConceptUuid(String uuid) {
		return dao.getItemByConceptUuid(uuid);
	}

	@Override
	public Item getItemByDrugConceptUuid(String uuid) {
		return dao.getItemByDrugConceptUuid(uuid);
	}

	@Override
	public void stopVisits() throws APIException {
		AdministrationService adminService = Context.getService(AdministrationService.class);
		String hoursVisitEnd = adminService.getGlobalProperty(ICareConfig.VISIT_LENGTH_IN_HOURS);

		if (hoursVisitEnd == null || hoursVisitEnd.trim().equals("")) {
			//newDate = new Date(System.currentTimeMillis() - TimeUnit.HOURS.toMillis(24));

		} else {
			Date newDate = new Date(System.currentTimeMillis() - TimeUnit.HOURS.toMillis(Integer.valueOf(hoursVisitEnd)));
			List<Visit> visits = dao.getOpenVisit();
			for (Visit visit : visits) {
				if ((!patientIsAdmitted(visit) && newDate.after(visit.getStartDatetime())) || patientIsDischarged(visit)) {
					VisitWrapper visitWrapper = new VisitWrapper(visit);
					//try {
					//if (!(visitWrapper.isInsurance() && visitWrapper.getInsuranceName().toLowerCase().equals("nhif"))) {
					Context.getVisitService().endVisit(visit, new Date());

					//}
					//}
					//catch (ConfigurationException e) {
					//	e.printStackTrace();
					//}
				}
			}
		}
	}

	@Override
	public long getVisitSerialNumber(Visit visit) {
		return dao.getVisitSerialNumber(visit);
	}

	@Override
	public Claim getClaimByVisitUuid(String visitUuid) throws Exception {
		VisitService visitService = Context.getVisitService();
		//Visit visit = visitService.getVisitByUuid(visitUuid);
		//VisitWrapper visitWrapper = new VisitWrapper(visit);
		VisitWrapper visit = new VisitWrapper(visitService.getVisitByUuid(visitUuid));
		InsuranceService insuranceService = visit.getInsuranceService();
		if (insuranceService != null) {
			return insuranceService.getClaim(visit.getVisit());
		}
		return null;
	}

	@Override
	public ClaimResult claimByVisitUuid(String visitUuid) throws Exception {
		VisitService visitService = Context.getVisitService();
		//Visit visit = visitService.getVisitByUuid(visitUuid);
		//VisitWrapper visitWrapper = new VisitWrapper(visit);
		VisitWrapper visit = new VisitWrapper(visitService.getVisitByUuid(visitUuid));
		InsuranceService insuranceService = visit.getInsuranceService();
		if (insuranceService != null) {
			return insuranceService.claim(visit.getVisit());
		}
		return null;
	}

	@Override
	public Item getItemByDrugUuid(String uuid) {
		return dao.getItemByDrugUuid(uuid);
	}

	@Override
	public ItemPrice getItemPriceByDrugId(Integer drugId, Integer paymentSchemeConceptId, Integer paymentTypeConceptId) {
		return dao.getItemPriceByDrugId(drugId, paymentSchemeConceptId, paymentTypeConceptId);
	}

	@Override
	public ListResult getConcepts(String q, String conceptClass, String searchTerm, Integer limit, Integer startIndex,
								  String searchTermOfConceptSetToExclude, String conceptSourceUuid, String referenceTermCode,
								  String attributeType, String attributeValue, Pager pager) {
		return dao.getConceptsBySearchParams(q, conceptClass, searchTerm, limit, startIndex,
				searchTermOfConceptSetToExclude, conceptSourceUuid, referenceTermCode, attributeType, attributeValue, pager);
	}

	@Override
	public List<ConceptReferenceTerm> getConceptReferenceTerms(String q, String source, Integer limit, Integer startIndex) {
		return dao.getConceptReferenceTermsBySearchParams(q, source, limit, startIndex);
	}

	@Override
	public List<ConceptSet> getConceptsSetsByConcept(String concept) {
		return dao.getConceptsSetsByConcept(concept);
	}

	@Override
	public String unRetireConcept(String uuid) {
		return dao.unRetireConcept(uuid);
	}

	@Override
	public List<Location> getLocations(String attributeType, String value, Integer limit, Integer startIndex) {
		return dao.getLocations(attributeType, value, limit, startIndex);
	}

	@Override
	public List<PatientWrapper> getPatients(String search, String patientUUID, PatientWrapper.VisitStatus visitStatus,
											Integer startIndex, Integer limit, PatientWrapper.OrderByDirection orderByDirection) {
		return dao.getPatients(search, patientUUID, visitStatus, startIndex, limit, orderByDirection);
	}

	@Override
	public Patient savePatient(Patient patient) {
		return patientDAO.savePatient(patient);
	}

	Boolean patientIsAdmitted(Visit visit) {
		if (visit.getStopDatetime() == null) {
			for (Encounter encounter : visit.getEncounters()) {
				for (Order order : encounter.getOrders()) {
					if (order.getOrderType().getName().equals("Bed Order")) {
						return true;
					}
				}
			}
		}
		return false;
	}

	Boolean patientIsDischarged(Visit visit) {
		Boolean dischargeState = false;
		for (Encounter encounter : visit.getEncounters()) {
			if (encounter.getEncounterType().getName().equals("Discharge")) {
				dischargeState = true;
			}
		}
		return dischargeState;
	}

	public Summary getSummary() {
		return dao.getSummary();
	}

	@Override
	public List<Drug> getDrugs(String concept, Integer limit, Integer startIndex) {
		return dao.getDrugs(concept, limit, startIndex);
	}

	@Override
	public Map<String, Object> createWorkFlowState(ProgramWorkflowState state) throws Exception {
		try {
			ProgramWorkflowService programWorkflowService = Context.getProgramWorkflowService();
			programWorkflowService.getWorkflow(state.getProgramWorkflow().getId()).addState(state);
		}
		catch (Exception e) {
			throw new RuntimeException("Error occurred while sending  email", e);
		}
		return null;
	}

	private Session emailSession = null;

	/**
	 * Returns the email session
	 */
	@Override
	public Session getEmailSession() throws Exception {
		if (emailSession == null) {
			AdministrationService as = Context.getAdministrationService();
			Properties p = new Properties();
			p.put("mail.transport.protocol", as.getGlobalProperty("mail.transport_protocol", "smtp"));
			p.put("mail.smtp.host", as.getGlobalProperty("mail.smtp_host", "localhost"));
			p.put("mail.smtp.port", as.getGlobalProperty("mail.smtp_port", "587")); // mail.smtp_port
			p.put("mail.smtp.auth", as.getGlobalProperty("mail.smtp_auth", "test")); // mail.smtp_auth
			p.put("mail.smtp.starttls.enable", as.getGlobalProperty("mail.smtp.starttls.enable"));
			p.put("mail.debug", as.getGlobalProperty("mail.debug", "false"));
			p.put("mail.from", as.getGlobalProperty("mail.from", ""));
			final String user = as.getGlobalProperty("mail.user", "");
			final String password = as.getGlobalProperty("mail.password", "");

			if (StringUtils.isNotBlank(user) && StringUtils.isNotBlank(password.toString())) {
				emailSession = Session.getInstance(p, new Authenticator() {

					public PasswordAuthentication getPasswordAuthentication() {
						return new PasswordAuthentication(user, password);
					}
				});
			} else {
				emailSession = Session.getInstance(p);
			}
		}
		return emailSession;
	}

	/**
	 * Performs some action on the given report
	 */
	@Override
	public String processEmail(Properties emailProperties) throws Exception {
		try {
			MimeMessage m = new MimeMessage(getEmailSession());
			m.setFrom(new InternetAddress(emailProperties.getProperty("from")));

			for (String recipient : emailProperties.getProperty("to", "").split("\\,")) {

				m.addRecipient(javax.mail.Message.RecipientType.TO, new InternetAddress(recipient));
			}

			// TODO: Make these such that they can contain report information
			m.setSubject(emailProperties.getProperty("subject"));
			Multipart multipart = new MimeMultipart();
			MimeBodyPart contentBodyPart = new MimeBodyPart();
			String content = emailProperties.getProperty("content", "");
			if (emailProperties.getProperty("attachmentFile") != null) {
				content += emailProperties.getProperty("attachmentFile");
			}
			contentBodyPart.setContent(content, "text/html");
			multipart.addBodyPart(contentBodyPart);

			if (emailProperties.getProperty("attachment") != null) {
				MimeBodyPart attachmentPart = new MimeBodyPart();
				DataSource source = new FileDataSource(new File(emailProperties.getProperty("attachment")));
				attachmentPart.setDataHandler(new DataHandler(source));
				attachmentPart.setFileName(source.getName());
				multipart.addBodyPart(attachmentPart);
			}

			//			if (emailProperties.getProperty("attachmentFile") != null) {
			//				String htmlContent = emailProperties.getProperty("attachmentFile");
			//				ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
			//				Document document = new Document();
			//
			//				PdfWriter writer = PdfWriter.getInstance(document, outputStream);
			//				document.open();
			//				HTMLWorker htmlWorker = new HTMLWorker(document);
			//				htmlWorker.parse(new StringReader(htmlContent));
			//				document.close();
			//
			//				//File encryption implementation
			//				//				PdfReader reader = new PdfReader(outputStream.toByteArray());
			//				//				PdfStamper stamper = new PdfStamper(reader, outputStream);
			//				//				stamper.setEncryption("a".getBytes("UTF-8"), "b".getBytes("UTF-8"), PdfWriter.ALLOW_PRINTING, PdfWriter.ENCRYPTION_AES_128);
			//				//				stamper.close();
			//				//				reader.close();
			//				//
			//				byte[] pdfContent = outputStream.toByteArray();
			//
			//				MimeBodyPart attachmentPart = new MimeBodyPart();
			//
			//				DataSource dataSource = new ByteArrayDataSource(pdfContent, "application/pdf");
			//				attachmentPart.setDataHandler(new DataHandler(dataSource));
			//				attachmentPart.setFileName(emailProperties.getProperty("attachmentFileName"));
			//				multipart.addBodyPart(attachmentPart);
			//			}

			//			if (report.getRenderedOutput() != null && "true".equalsIgnoreCase(configuration.getProperty("addOutputAsAttachment"))) {
			//			MimeBodyPart attachment = new MimeBodyPart();
			//			Object output = null;
			//			attachment.setDataHandler(new DataHandler(output, "text/html"));
			//			attachment.setFileName(emailProperties.getProperty("attachmentName"));
			//			multipart.addBodyPart(attachment);
			//			}

			m.setContent(multipart);
			Transport.send(m);
		}
		catch (Exception e) {
			throw new RuntimeException("Error occurred while sending  email: " + e);
		}
		return "SENT EMAIL";
	}

	public String getClientsFromExternalSystems(String identifier, String identifierReference, String basicAuthKey)
			throws IOException, URISyntaxException {
		AdministrationService administrationService = Context.getService(AdministrationService.class);
		String systemKey = "pimaCovid";
		String baseUrl = administrationService.getGlobalProperty("iCare.externalSystems.integrated." + systemKey
				+ ".baseUrl");
		String username = administrationService.getGlobalProperty("iCare.externalSystems.integrated." + systemKey
				+ ".username");
		String password = administrationService.getGlobalProperty("iCare.externalSystems.integrated." + systemKey
				+ ".password");
		String ou = administrationService.getGlobalProperty("iCare.externalSystems.integrated." + systemKey
				+ ".referenceOuUid");
		String program = administrationService.getGlobalProperty("iCare.externalSystems.integrated." + systemKey
				+ ".programUid");
		//		TODO: Find a way to softcode the API References
		URL url;
		if (baseUrl == null || baseUrl.trim().equals("")) {
			throw new VerificationException("Destination server address url is not set. Please set " + baseUrl + ".");
		}
		//		this.getCreator().getUserProperties().get("")
		String path = "/api/trackedEntityInstances.json?filter=" + identifierReference + ":EQ:" + identifier + "&ou=" + ou
				+ "&ouMode=DESCENDANTS&program=" + program
				+ "&fields=attributes[attribute,code,value],enrollments[*],orgUnit,trackedEntityInstance&paging=false";
		url = new URL(baseUrl.concat(path));

		HttpURLConnection con = (HttpURLConnection) url.openConnection();

		String userCredentials = username.concat(":").concat(password);
		String basicAuth = "Basic " + new String(Base64.getEncoder().encode(userCredentials.getBytes()));

		con.setRequestMethod("GET");
		con.setRequestProperty("Content-Type", "application/json; utf-8");
		con.setRequestProperty("Accept", "application/json");
		con.setRequestProperty("Authorization", basicAuth);
		try {
			BufferedReader bufferIn = new BufferedReader(new InputStreamReader(con.getInputStream()));
			String inputLine;
			StringBuffer content = new StringBuffer();
			while ((inputLine = bufferIn.readLine()) != null) {
				content.append(inputLine);
			}
			bufferIn.close();
			return String.valueOf(content);
		}
		catch (Exception e) {
			BufferedReader in = new BufferedReader(new InputStreamReader(con.getErrorStream()));
			String inputLine;
			StringBuffer content = new StringBuffer();
			while ((inputLine = in.readLine()) != null) {
				content.append(inputLine);
			}
			in.close();
			return String.valueOf(content);
		}
	}

	public String createPimaCovidLabRequest(Map<String, Object> request, String basicAuthKey)
			throws IOException {
		AdministrationService administrationService = Context.getService(AdministrationService.class);

		String baseUrl = administrationService.getGlobalProperty("iCare.externalSystems.integrated.pimaCovid.baseUrl");
		String username = administrationService.getGlobalProperty("iCare.externalSystems.integrated.pimaCovid.username");
		String password = administrationService.getGlobalProperty("iCare.externalSystems.integrated.pimaCovid.password");
		URL url;
		if (baseUrl == null || baseUrl.trim().equals("")) {
			throw new VerificationException("Destination server address url is not set. Please set " + baseUrl + ".");
		}
		//		this.getCreator().getUserProperties().get("")
		String path = "/api/events.json?";
		url = new URL(baseUrl.concat(path));
		String returnValue = "";

		BufferedReader reader;
		String line;
		StringBuffer responseContent = new StringBuffer();

		HttpURLConnection con = (HttpURLConnection) url.openConnection();

//		String basicAuth = "Basic " + basicAuthKey;
		String userCredentials = username.concat(":").concat(password);
		String basicAuth = "Basic " + new String(Base64.getEncoder().encode(userCredentials.getBytes()));

		con.setRequestMethod("POST");
		con.setRequestProperty("Content-Type", "application/json; utf-8");
		con.setRequestProperty("Accept", "application/json");
		con.setRequestProperty("Authorization", basicAuth);
		con.setDoOutput(true);

		ObjectMapper mapper = new ObjectMapper();
		// Converting the Object to JSONString
		String jsonString = mapper.writeValueAsString(request);

		// int status = httpURLConnection.getResponseCode();

		try (OutputStream outputStream = con.getOutputStream()) {
			byte[] input = jsonString.getBytes("utf-8");
			outputStream.write(input, 0, input.length);
		}

		reader = new BufferedReader(new InputStreamReader(con.getInputStream()));
		while ((line = reader.readLine()) != null) {
			responseContent.append(line);
		}
		reader.close();
		return responseContent.toString();
	}

	public String savePimaCovidLabResult(Map<String, Object> results)
			throws IOException {
		AdministrationService administrationService = Context.getService(AdministrationService.class);

		String baseUrl = administrationService.getGlobalProperty("iCare.externalSystems.integrated.pimaCovid.baseUrl");
		String username = administrationService.getGlobalProperty("iCare.externalSystems.integrated.pimaCovid.username");
		String password = administrationService.getGlobalProperty("iCare.externalSystems.integrated.pimaCovid.password");
		String usernamePropertyKey = administrationService.getGlobalProperty("iCare.externalSystems.integrated.pimaCovid.usernamePropertyKey");
		String passwordPropertyKey = administrationService.getGlobalProperty("iCare.externalSystems.integrated.pimaCovid.passwordPropertyKey");
		URL url;
		if (baseUrl == null || baseUrl.trim().equals("")) {
			throw new VerificationException("Destination server address url is not set. Please set " + baseUrl + ".");
		}
		//		this.getCreator().getUserProperties().get("")
		String usernameProperty = Context.getAuthenticatedUser().getUserProperties().get(usernamePropertyKey);
		String passwordPropertyEncrypted = Context.getAuthenticatedUser().getUserProperties().get(passwordPropertyKey);

		String path = "/api/events.json?";
		url = new URL(baseUrl.concat(path));

		BufferedReader reader;
		String line;
		StringBuffer responseContent = new StringBuffer();

		HttpURLConnection con = (HttpURLConnection) url.openConnection();

//		String basicAuth = "Basic " + basicAuthKey;
		String userCredentials = username.concat(":").concat(password);
		String basicAuth = "Basic " + new String(Base64.getEncoder().encode(userCredentials.getBytes()));

		con.setRequestMethod("POST");
		con.setRequestProperty("Content-Type", "application/json; utf-8");
		con.setRequestProperty("Accept", "application/json");
		con.setRequestProperty("Authorization", basicAuth);
		con.setDoOutput(true);

		ObjectMapper mapper = new ObjectMapper();
		// Converting the Object to JSONString
		String jsonString = mapper.writeValueAsString(results);

		// int status = httpURLConnection.getResponseCode();

		try (OutputStream outputStream = con.getOutputStream()) {
			byte[] input = jsonString.getBytes("utf-8");
			outputStream.write(input, 0, input.length);
		}

		reader = new BufferedReader(new InputStreamReader(con.getInputStream()));
		while ((line = reader.readLine()) != null) {
			responseContent.append(line);
		}
		reader.close();
		return responseContent.toString();
	}

	public String verifyExternalSystemCredentials(String username, String password, String systemKey) throws IOException {
		AdministrationService administrationService = Context.getService(AdministrationService.class);

		String baseUrl = administrationService.getGlobalProperty("iCare.externalSystems.integrated." + systemKey
				+ ".baseUrl");
		URL url;
		if (baseUrl == null || baseUrl.trim().equals("")) {
			throw new VerificationException("Destination server address url is not set. Please set base url for system"
					+ systemKey + ".");
		}

		// TODO: Consider to change this to /api/me.json?fields=name
		String path = "/api/organisationUnits.json?";
		url = new URL(baseUrl.concat(path));

		HttpURLConnection con = (HttpURLConnection) url.openConnection();

		String userCredentials = username.concat(":").concat(password);
		String basicAuth = "Basic " + new String(Base64.getEncoder().encode(userCredentials.getBytes()));

		con.setRequestMethod("GET");
		con.setRequestProperty("Content-Type", "application/json; utf-8");
		con.setRequestProperty("Accept", "application/json");
		con.setRequestProperty("Authorization", basicAuth);
		try {
			BufferedReader bufferIn = new BufferedReader(new InputStreamReader(con.getInputStream()));
			String inputLine;
			StringBuffer content = new StringBuffer();
			while ((inputLine = bufferIn.readLine()) != null) {
				content.append(inputLine);
			}
			bufferIn.close();
			return String.valueOf(content);
		}
		catch (Exception e) {
			BufferedReader in = new BufferedReader(new InputStreamReader(con.getErrorStream()));
			String inputLine;
			StringBuffer content = new StringBuffer();
			while ((inputLine = in.readLine()) != null) {
				content.append(inputLine);
			}
			in.close();
			return String.valueOf(content);
		}
	}

	//	public String voidOrder(String uuid, String voidReason) {
	//		return dao.voidOrder(uuid, voidReason);
	//	}

	@Override
	public List<Encounter> getEncountersByEncounterType(String search, String encounterTypeUuid, Integer limit,
														Integer startIndex) {
		return this.dao.getEncountersByEncounterType(search, encounterTypeUuid, limit, startIndex);
	}

	@Override
	public void saveAuditLog(AuditLog auditLog) {
		// Check if user is authenticated first
		User user = Context.getAuthenticatedUser();
		if (user != null) {
			//			this.auditLogDAO.save(auditLog);
		}
	}

	@Override
	public String pushEventWithoutRegistrationDataToDHIS2Instance(String eventData) {
		try {
			AdministrationService administrationService = Context.getAdministrationService();
			String instance = administrationService.getGlobalProperty("dhis2.instance");
			String username = administrationService.getGlobalProperty("dhis2.username");
			String password = administrationService.getGlobalProperty("dhis2.password");
			// TODO: Use configs to access the API below (Remove hardcoded URL)
			URL url = new URL(instance.concat("/api/tracker?async=false&orgUnitIdScheme=CODE&dataElementIdScheme=CODE"));

			HttpURLConnection con = (HttpURLConnection) url.openConnection();

			String userCredentials = username.concat(":").concat(password);
			String basicAuth = "Basic " + new String(Base64.getEncoder().encode(userCredentials.getBytes()));

			con.setRequestProperty("Authorization", basicAuth);

			con.setRequestMethod("POST");
			con.setRequestProperty("Content-Type", "application/json; utf-8");
			con.setRequestProperty("Accept", "application/json");

			con.setDoOutput(true);

			String jsonInputString = eventData;

			OutputStream os;
			BufferedReader br;

			try {
				os = con.getOutputStream();
				byte[] input = jsonInputString.getBytes("utf-8");
				os.write(input, 0, input.length);
			}
			finally {}

			try {
				br = new BufferedReader(new InputStreamReader(con.getInputStream(), "utf-8"));
				StringBuilder response = new StringBuilder();
				String responseLine = null;
				while ((responseLine = br.readLine()) != null) {
					response.append(responseLine.trim());
				}
				return response.toString();
			}
			finally {}

		}
		catch (MalformedURLException e) {
			e.printStackTrace();
			return e.toString();
		}
		catch (IOException e) {
			e.printStackTrace();
			return e.toString();
		}
	}

	@Override
	public String pushDataToExternalMediator(String data, String mediatorKey, String mediatorUrl, String authenticationType,
											 String authReferenceKey) {
		try {
			AdministrationService administrationService = Context.getAdministrationService();
			String instance = administrationService.getGlobalProperty(authReferenceKey + ".instance");
			String username = administrationService.getGlobalProperty(authReferenceKey + ".username");
			String password = administrationService.getGlobalProperty(authReferenceKey + ".password");
			URL url = new URL(instance.concat(mediatorUrl));
			HttpURLConnection con = (HttpURLConnection) url.openConnection();

			System.out.println(instance);
			String userCredentials = username.concat(":").concat(password);
			String basicAuth = "Basic " + new String(Base64.getEncoder().encode(userCredentials.getBytes()));
			con.setRequestProperty("Authorization", basicAuth);
			con.setRequestMethod("POST");
			con.setRequestProperty("Content-Type", "application/json; utf-8");
			con.setRequestProperty("Accept", "application/json");
			con.setDoOutput(true);
			String jsonInputString = data;
			OutputStream os;
			BufferedReader br;
			try {
				os = con.getOutputStream();
				byte[] input = jsonInputString.getBytes("utf-8");
				os.write(input, 0, input.length);
			}
			finally {}

			try {
				br = new BufferedReader(new InputStreamReader(con.getInputStream(), "utf-8"));
				StringBuilder response = new StringBuilder();
				String responseLine = null;
				while ((responseLine = br.readLine()) != null) {
					response.append(responseLine.trim());
				}
				return response.toString();
			}
			finally {}

		}
		catch (MalformedURLException e) {
			e.printStackTrace();
			return e.toString();
		}
		catch (IOException e) {
			e.printStackTrace();
			return e.toString();
		}
	}

	public Map<String, Object> generateVisitsData(Date startDate,
												  Date endDate,
												  Boolean sendToExternalMediator,
												  String uuid) throws Exception {
		// TODO: Implement for all HDU API template blocks and respective parameters
		Map<String, Object> dataTemplateData = new HashMap<>();
		List<Visit> visits = dao.getVisitsByStartDateAndEndDate(startDate, endDate, uuid);

		Map<String, Object> templateDetails = prepareTemplateDetails();

		List<Map<String, Object>> listGrid = generateListGrid(visits);

		Map<String, Object> reportDetails = generateReportDetails();
		Map<String, Object> facilityDetails = generateFacilityDetails();

		Map<String, Object> dataSection = new HashMap<>();
		dataSection.put("reportDetails", reportDetails);
		dataSection.put("facilityDetails", facilityDetails);
		dataSection.put("listGrid", listGrid);

		dataTemplateData.put("templateDetails", templateDetails);
		dataTemplateData.put("data", dataSection);

		if (Boolean.TRUE.equals(sendToExternalMediator)) {
			pushDataToExternalMediator(dataTemplateData, "HDUAPI", "HDUAPI");
		}
		return dataTemplateData;
	}

	public List<Map<String,Object>> getPatientVisitsByIdentifier(String id, String idType, String referralNumber, Integer numberOfVisits) throws Exception {
		// 1. Get client from OpenMRS
		// TODO: Add support to search visits by referralNumber
		List<Visit> visits = dao.getPatientVisitsByIdentifier(id, idType, numberOfVisits);
		List<Map<String,Object>> visitsData = new ArrayList<>();
		for(Visit visit: visits) {
			Map<String,Object> templateData = new HashMap<>();
			templateData.put("visitDetails", prepareVisitDetails(visit));
			templateData.put("demographicDetails", prepareDemographicDetails(visit));
			templateData.put("diagnosisDetails", prepareDiagnosisDetails(visit));
			visitsData.add(templateData);
		}
		return visitsData;
	}

	public Map<String,Object> sendReferralDataToMediator(String uuid) throws Exception {
		Map<String,Object> visitData = new HashMap<>();
		List<Visit> visits = dao.getVisitsByStartDateAndEndDate(null, null, uuid);

		Map<String, Object> templateData = new HashMap<>();
		if (!visits.isEmpty()) {
			Visit visit =  visits.get(0);
			templateData.put("visitDetails", prepareVisitDetails(visit));
			templateData.put("demographicDetails", prepareDemographicDetails(visit));
			templateData.put("diagnosisDetails", prepareDiagnosisDetails(visit));
			templateData.put("investigationDetails", new ArrayList<>());  // Assuming this is filled somewhere else
			templateData.put("outcomeDetails", prepareOutcomeDetails(visit));
		}
//		System.out.println(templateData);
		String response = pushDataToExternalMediator(templateData, "HDUAPI", "SHR");
		return visitData;
	}

	private Map<String, Object> prepareTemplateDetails() {
		AdministrationService administrationService = Context.getAdministrationService();
		String workflowUuid = administrationService.getGlobalProperty(ICareConfig.HDU_API_WORKFLOW_UUID_FOR_OPD);

		Map<String, Object> templateDetails = new HashMap<>();
		Map<String, Object> workflow = new HashMap<>();
		workflow.put("uuid", workflowUuid);

		templateDetails.put("id", "general");
		templateDetails.put("code", "GENERAL");
		templateDetails.put("name", "General");
		templateDetails.put("workflow", workflow);

		return templateDetails;
	}

	private Map<String, Object> generateReportDetails() throws Exception {
		Dhis2EventWrapper dhis2EventWrapper = new Dhis2EventWrapper();
		Map<String, Object> reportDetails = new HashMap<>();
		Date todayDate = new Date();
		reportDetails.put("reportingDate", dhis2EventWrapper.formatDateToYYYYMMDD(todayDate));

		return reportDetails;
	}

	private Map<String, Object> generateFacilityDetails() throws ConfigurationException {
		Dhis2EventWrapper dhis2EventWrapper = new Dhis2EventWrapper();
		Map<String, Object> facilityDetails = new HashMap<>();
		String facilityCode = dhis2EventWrapper.getHFRCode();
		facilityDetails.put("HFCode", facilityCode);
		facilityDetails.put("code", facilityCode);

		return facilityDetails;
	}

	private List<Map<String, Object>> generateListGrid(List<Visit> visits) {
		List<Map<String, Object>> listGrid = new ArrayList<>();
		for (Visit visit : visits) {
			Map<String, Object> listGridItem = new HashMap<>();
			listGridItem.put("visitDetails", prepareVisitDetails(visit));
			listGridItem.put("demographicDetails", prepareDemographicDetails(visit));
			listGridItem.put("diagnosisDetails", prepareDiagnosisDetails(visit));
			listGridItem.put("investigationDetails", new ArrayList<>());  // Assuming this is filled somewhere else
			listGridItem.put("outcomeDetails", prepareOutcomeDetails(visit));
			listGrid.add(listGridItem);
		}
		return listGrid;
	}

	private Map<String, Object> prepareVisitDetails(Visit visit) {
		Map<String, Object> visitDetails = new HashMap<>();
		visitDetails.put("id", visit.getVisitId());
		visitDetails.put("visitDate", visit.getStartDatetime());
		visitDetails.put("closedDate", visit.getStopDatetime());
		return visitDetails;
	}

	private Map<String, Object> prepareDemographicDetails(Visit visit) {
		Map<String, Object> demographicDetails = new HashMap<>();
		Patient patient = visit.getPatient();
		Person person = patient.getPerson();

		demographicDetails.put("dateOfBirth", person.getBirthdate());
		demographicDetails.put("firstName", person.getGivenName());
		demographicDetails.put("middleName", "");
		demographicDetails.put("lastName", person.getFamilyName());
		demographicDetails.put("gender", convertGender(person.getGender()));
		demographicDetails.put("phoneNumbers", getPhoneNumbers(person));
		demographicDetails.put("mrn", getPreferredIdentifier(patient));
		demographicDetails.put("identifier", getPreferredIdentifier(patient));
		demographicDetails.put("identifiers", getPatientIdentifiers(patient));
		return demographicDetails;
	}

	private String convertGender(String gender) {
		switch (gender.toLowerCase()) {
			case "m":
				return "male";
			case "f":
				return "female";
			default:
				return "unknown";
		}
	}

	private List<Map<String, Object>> prepareDiagnosisDetails(Visit visit) {
		List<Map<String, Object>> diagnosisDetails = new ArrayList<>();
		for (Encounter encounter : visit.getEncounters()) {
			for (Diagnosis diagnosis : encounter.getDiagnoses()) {
				Map<String, Object> diagnosisData = new HashMap<>();
				diagnosisData.put("diagnosisCode", diagnosis.getDiagnosis().getCoded());
				diagnosisData.put("diagnosis", diagnosis.getDiagnosis().getSpecificName());
				diagnosisData.put("diagnosisDate", diagnosis.getDateCreated());
				diagnosisData.put("certainty", diagnosis.getCertainty());
				diagnosisDetails.add(diagnosisData);
			}
		}
		return diagnosisDetails;
	}

	private Map<String, Object> prepareOutcomeDetails(Visit visit) {
		Map<String, Object> outcomeDetails = new HashMap<>();
		Person person = visit.getPatient().getPerson();
		boolean isAlive = person.getDead() == null || !person.getDead();

		outcomeDetails.put("isAlive", isAlive);
		if (!isAlive) {
			outcomeDetails.put("deathDate", person.getDeathDate());
		}
		return outcomeDetails;
	}

	private String pushDataToExternalMediator(Map<String, Object> dataTemplateData, String mediatorKeyType,
											  String authReferenceKey) throws Exception {
		try {
			AdministrationService adminService = Context.getService(AdministrationService.class);
			String mediatorsConfigs = adminService.getGlobalProperty(ICareConfig.INTEROPERABILITY_MEDIATORS_LIST);

			if (mediatorsConfigs != null) {
				JSONArray mediatorsList = new JSONArray(mediatorsConfigs);
				ICareService iCareService = Context.getService(ICareService.class);

				if (!mediatorsList.isEmpty()) {
					for (int count = 0; count < mediatorsList.length(); count++) {
						JSONObject mediator = mediatorsList.getJSONObject(count);
						if (mediator.optBoolean("isActive") && mediatorKeyType.equals(mediator.getString("mediatorKey"))) {
							String mediatorKey = mediator.getString("mediatorKey");
							String mediatorUrlPath = mediator.getString("mediatorUrlPath");
							String authenticationType = mediator.getString("authenticationType");
							authReferenceKey = mediator.getString("") != null ? mediator.getString("authKeyReference")
									: mediator.getString("mediatorKey");
							return iCareService.pushDataToExternalMediator(new JSONObject(dataTemplateData).toString(),
									mediatorKey, mediatorUrlPath, authenticationType, authReferenceKey);
						}
					}
				}
			}
		}
		catch (Exception e) {
			e.printStackTrace();
			throw new Exception(e.getMessage());
		}
		return "";
	}

	private String getPhoneNumbers(Person person) {
		AdministrationService administrationService = Context.getAdministrationService();
		String personPhoneNumberAttributeTypeUuid = administrationService
				.getGlobalProperty(ICareConfig.PHONE_NUMBER_ATTRIBUTE);

		if (person.getAttributes() != null) {
			for (PersonAttribute attribute : person.getAttributes()) {
				if (attribute.getAttributeType().getUuid().equals(personPhoneNumberAttributeTypeUuid)) {
					return attribute.getValue();
				}
			}
		}
		return "";
	}

	private String getPreferredIdentifier(Patient patient) {
		if (patient.getIdentifiers() != null) {
			for (PatientIdentifier identifier : patient.getIdentifiers()) {
				if (identifier.getPreferred() != null && identifier.getPreferred()) {
					return identifier.getIdentifier();
				}
			}

			if (!patient.getIdentifiers().isEmpty()) {
				return patient.getIdentifiers().iterator().next().getIdentifier();
			}
		}
		return "";
	}

	private List<Map<String,Object>> getPatientIdentifiers(Patient patient) {
		List<Map<String,Object>> identifiers = new ArrayList<>();
		if (patient.getIdentifiers() != null) {
			for (PatientIdentifier patientIdentifier: patient.getIdentifiers()) {
				Map<String,Object> identifier = new HashMap<>();
				identifier.put("id", patientIdentifier.getIdentifier().toString());
				identifier.put("type", patientIdentifier.getIdentifierType().getName());
				identifier.put("preferred", patientIdentifier.getPreferred());
			}
		}
		return identifiers;
	}

	@Override
	public String getSharedRecordsFromExternalMediator(String hfrCode,
													   String id,
													   String idType,
													   String referralNumber) throws Exception {
		try {
			Map<String,Object> responseData = new HashMap<>();
			AdministrationService administrationService = Context.getAdministrationService();
			String mediatorsConfigs = administrationService.getGlobalProperty(ICareConfig.INTEROPERABILITY_MEDIATORS_LIST);
			JSONArray mediatorsList = new JSONArray(mediatorsConfigs);
			JSONObject sharedRecordsMediatorConfigs = null;
			for (int count = 0; count < mediatorsList.length(); count++) {
				JSONObject mediator = mediatorsList.getJSONObject(count);
				if (mediator.getString("mediatorKey").equals("GET-SHR")) {
					sharedRecordsMediatorConfigs =  mediator;
				}
			}
			if (sharedRecordsMediatorConfigs != null) {
				try {
					String authReferenceKey = sharedRecordsMediatorConfigs.getString("authReferenceKey");
					String mediatorUrl = sharedRecordsMediatorConfigs.getString("mediatorUrlPath");
					// Obtain the necessary configurations from OpenMRS AdministrationService
					String instance = administrationService.getGlobalProperty(authReferenceKey + ".instance");
					String username = administrationService.getGlobalProperty(authReferenceKey + ".username");
					String password = administrationService.getGlobalProperty(authReferenceKey + ".password");

					if (id != null) {
						mediatorUrl += "?id=" + id;
						if (idType != null) {
							if (mediatorUrl.contains("?")) {
								mediatorUrl += "&idType="+ idType;
							}
						}
					}

					if (hfrCode != null) {
						if (mediatorUrl.contains("?")) {
							mediatorUrl += "&hfrCode="+ hfrCode;
						} else {
							mediatorUrl += "?hfrCode=" + hfrCode;
						}
					}


					if (referralNumber != null) {
						if (mediatorUrl.contains("?")) {
							mediatorUrl += "&referralNumber="+ referralNumber;
						} else {
							mediatorUrl += "?referralNumber=" + referralNumber;
						}
					}
					// Construct the URL for the GET request
					URL url = new URL(instance.concat(mediatorUrl));
					HttpURLConnection con = (HttpURLConnection) url.openConnection();

					// Create the Basic Authentication header
					String userCredentials = username.concat(":").concat(password);
					String basicAuth = "Basic " + new String(Base64.getEncoder().encode(userCredentials.getBytes()));

					// Set up the connection properties
					con.setRequestProperty("Authorization", basicAuth);
					con.setRequestMethod("GET");  // Change to GET request
					con.setRequestProperty("Accept", "application/json");

					// Read the response
					BufferedReader br = null;
					try {
						br = new BufferedReader(new InputStreamReader(con.getInputStream(), "utf-8"));
						StringBuilder response = new StringBuilder();
						String responseLine;
						while ((responseLine = br.readLine()) != null) {
							response.append(responseLine.trim());
						}
						return response.toString();
					} finally {
						if (br != null) {
							br.close();  // Ensure resources are closed properly
						}
					}
				} catch (MalformedURLException e) {
					e.printStackTrace();
					return e.toString();
				} catch (IOException e) {
					e.printStackTrace();
					return e.toString();
				}
			} else {
				throw new Exception("Mediator for retrieving data from is not set");
			}
		}catch (Exception e) {
			throw new Exception(e.getMessage());
		}
	}
}