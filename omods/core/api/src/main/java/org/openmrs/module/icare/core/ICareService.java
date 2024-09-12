/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
package org.openmrs.module.icare.core;

import org.openmrs.*;
import org.openmrs.annotation.Authorized;
import org.openmrs.api.APIException;
import org.openmrs.api.OpenmrsService;
import org.openmrs.module.icare.auditlog.AuditLog;
import org.openmrs.module.icare.billing.ItemNotPayableException;
import org.openmrs.module.icare.billing.models.ItemPrice;
import org.openmrs.module.icare.billing.models.Prescription;
import org.openmrs.module.icare.billing.services.insurance.Claim;
import org.openmrs.module.icare.billing.services.insurance.ClaimResult;
import org.openmrs.module.icare.core.models.CommonlyOrderedDrugs;
import org.openmrs.module.icare.core.models.EncounterPatientProgram;
import org.openmrs.module.icare.core.models.EncounterPatientState;
import org.openmrs.module.icare.core.models.PasswordHistory;
import org.openmrs.module.icare.core.utils.PatientWrapper;
import org.openmrs.module.icare.core.utils.VisitWrapper;
import org.openmrs.module.icare.store.models.OrderStatus;
import org.springframework.transaction.annotation.Transactional;

import javax.mail.Session;
import javax.naming.ConfigurationException;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Properties;

/**
 * The main service of this module, which is exposed for other modules. See
 * moduleApplicationContext.xml on how it is wired up.
 */
public interface ICareService extends OpenmrsService {
	
	/**
	 * Returns an item by uuid. It can be called by any authenticated user. It is fetched in read
	 * only transaction.
	 * 
	 * @param uuid
	 * @return
	 * @throws APIException
	 */
	@Authorized()
	@Transactional(readOnly = true)
	Item getItemByUuid(String uuid) throws APIException;
	
	/**
	 * Saves an item. Sets the owner to superuser, if it is not set. It can be called by users with
	 * this module's privilege. It is executed in a transaction.
	 * 
	 * @param item
	 * @return
	 * @throws APIException
	 */
	@Transactional
	Item saveItem(Item item) throws APIException;
	
	Item getItemByConceptId(Integer id);
	
	ItemPrice getItemPriceByConceptId(Integer serviceConceptId, Integer paymentSchemeConceptId, Integer paymentTypeConceptId);
	
	ItemPrice getItemPriceByConceptAndVisit(Visit visit, Concept concept) throws ItemNotPayableException,
	        ConfigurationException;
	
	ItemPrice getItemPrice(Visit visit, Drug drug) throws ItemNotPayableException, ConfigurationException;
	
	List<ItemPrice> getItemPricesByConceptId(Integer Id);
	
	List<ItemPrice> getItemPrices();
	
	List<ItemPrice> getItemPrices(String paymentType, Integer limit, Integer startIndex);
	
	@Transactional
	ItemPrice saveItemPrice(ItemPrice itemPrice) throws APIException;
	
	List<Item> getItems();
	
	Item getItemByConceptUuid(String uuid);
	
	Item getItemByDrugConceptUuid(String uuid);
	
	@Transactional
	void stopVisits() throws APIException;
	
	long getVisitSerialNumber(Visit visit);
	
	Claim getClaimByVisitUuid(String visitUuid) throws Exception;
	
	ClaimResult claimByVisitUuid(String visitUuid) throws Exception;
	
	Item getItemByDrugUuid(String uuid);
	
	ItemPrice getItemPriceByDrugId(Integer serviceConceptId, Integer paymentSchemeConceptId, Integer paymentTypeConceptId);
	
	List<Item> getItems(String search, Integer limit, Integer startIndex, String department, Item.Type type,
	        Boolean stockable);
	
	List<Object> getConceptItems(String search, Integer limit, Integer startIndex, Item.Type type, Boolean stockable,
	        String conceptClassName);
	
	List<Item> getStockableItems(String search, Integer limit, Integer startIndex, Item.Type type, Boolean stockable);
	
	List<Concept> getConceptStockableItems(String search, Integer limit, Integer startIndex, Item.Type type,
	        Boolean stockable);
	
	Prescription savePrescription(Prescription order, String status, String remarks);
	
	List<Visit> getVisitsByOrderType(String search, String orderTypeUuid, String encounterTypeUuid, String locationUuid,
	        OrderStatus.OrderStatusCode prescriptionStatus, Order.FulfillerStatus fulfillerStatus, Integer limit,
	        Integer startIndex, VisitWrapper.OrderBy orderBy, VisitWrapper.OrderByDirection orderByDirection,
	        String attributeValueReference, VisitWrapper.PaymentStatus paymentStatus, String visitAttributeTypeUuid,
	        String sampleCategory, String exclude, Boolean includeInactive, Boolean includeDeadPatients);
	
	List<Order> getOrdersByVisitAndOrderType(String visitUuid, String orderTypeUuid, Order.FulfillerStatus fulfillerStatus,
	        Integer limit, Integer startIndex);
	
	List<Object[]> getCommonlyOrderedItems(String visitUuid, String orderTypeUuid, Integer limit, Integer startIndex,
	        Boolean isDrug);
	
	Message sendMessage(Message message) throws MalformedURLException, IOException, Exception;
	
	List<Message> sendMessages(List<Message> messages) throws MalformedURLException, IOException, Exception;
	
	List<String> generatePatientIds();
	
	ListResult getConcepts(String q, String conceptClass, String searchTerm, Integer limit, Integer startIndex,
	        String searchTermOfConceptSetToExclude, String conceptSourceUuid, String referenceTermCode,
	        String attributeType, String attributeValue, Pager pager);
	
	List<ConceptReferenceTerm> getConceptReferenceTerms(String q, String source, Integer limit, Integer startIndex);
	
	List<ConceptSet> getConceptsSetsByConcept(String concept);
	
	String unRetireConcept(String uuid);
	
	List<Location> getLocations(String attributeType, String value, Integer limit, Integer startIndex);
	
	List<PatientWrapper> getPatients(String search, String patientUUID, PatientWrapper.VisitStatus visitStatus,
	        Integer startIndex, Integer limit, PatientWrapper.OrderByDirection orderByDirection);
	
	Patient savePatient(Patient patient);
	
	Message sendMessageRequest(Message message) throws Exception;
	
	Summary getSummary();
	
	List<Drug> getDrugs(String concept, Integer limit, Integer startIndex);
	
	String processEmail(Properties configuration) throws Exception;
	
	Map<String, Object> createWorkFlowState(ProgramWorkflowState state) throws Exception;
	
	Session getEmailSession() throws Exception;
	
	String getClientsFromExternalSystems(String identifier, String identifierReference, String basicAuthKey)
	        throws IOException, URISyntaxException;
	
	String createPimaCovidLabRequest(Map<String, Object> labRequest, String basicAuthKey) throws IOException,
	        URISyntaxException;
	
	String savePimaCovidLabResult(Map<String, Object> labResult) throws IOException, URISyntaxException;
	
	String verifyExternalSystemCredentials(String username, String password, String systemKey) throws IOException,
	        URISyntaxException;
	
	List<String> generateCode(String globalProperty, String metadataType, Integer count) throws Exception;
	
	OrderStatus saveOrderStatus(OrderStatus orderStatus);
	
	void updatePasswordHistory() throws Exception;
	
	PasswordHistory savePasswordHistory(User user, String newPassword) throws Exception;
	
	List<PasswordHistory> getUserPasswordHistory(String uuid);
	
	List<Role> getRoles(String q, Integer startIndex, Integer limit);
	
	List<Privilege> getPrivileges(String q, Integer startIndex, Integer limit);
	
	ProgramWorkflow saveProgramWorkflow(ProgramWorkflow programWorkflow);
	
	List<PatientProgram> getPatientProgram(String programUuid, String patientUuid, Integer startIndex, Integer limit,
	        Boolean includeDeadPatients) throws Exception;
	
	EncounterPatientState saveEncounterPatientState(EncounterPatientState encounterPatientState);
	
	List<Encounter> getEncountersByPatientState(String patientStateUuid);
	
	EncounterPatientProgram saveEncounterPatientProgram(EncounterPatientProgram encounterPatientProgram);
	
	List<Encounter> getEncountersByPatientProgram(String patientProgramUuid);
	
	List<Encounter> getEncountersByEncounterType(String search, String encounterTypeUuid, Integer limit, Integer startIndex);
	
	void saveAuditLog(AuditLog auditLog);
	
	String pushEventWithoutRegistrationDataToDHIS2Instance(String eventData);
	
	String pushDataToExternalMediator(String data, String mediatorKey, String mediatorUrl, String authenticationType);
	
	//EnvayaSMS methods declarations
	void processIncomingMessage(String from, String messageContent, String messageType);
	
	public Map<String, Object> error();
	
	String insertOutgoingMessages(String recipient, String message);
	
	Map<String, Object> handleOutgoingsms();
	
	// EnvayaSMS methods declaration ends
	Map<String, Object> generateVisitsData(Date startDate, Date endDate, Boolean sendToExternalMediator) throws Exception;
}
