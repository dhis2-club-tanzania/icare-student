/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
package org.openmrs.module.icare.web.controller;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.codehaus.jackson.JsonParser;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONObject;
import org.openmrs.*;
import org.openmrs.api.*;
import org.openmrs.api.context.Context;
import org.openmrs.module.icare.ICareConfig;
import org.openmrs.module.icare.auditlog.AuditLog;
import org.openmrs.module.icare.auditlog.api.AuditLogService;
import org.openmrs.module.icare.auditlog.api.db.AuditLogDAO;
import org.openmrs.module.icare.billing.ItemNotPayableException;
import org.openmrs.module.icare.billing.OrderMetaData;
import org.openmrs.module.icare.billing.models.ItemPrice;
import org.openmrs.module.icare.billing.models.Prescription;
import org.openmrs.module.icare.billing.services.BillingService;
import org.openmrs.module.icare.billing.services.insurance.Claim;
import org.openmrs.module.icare.billing.services.insurance.ClaimResult;
import org.openmrs.module.icare.core.*;
import org.openmrs.module.icare.core.models.CommonlyOrderedDrugs;
import org.openmrs.module.icare.core.models.EncounterPatientProgram;
import org.openmrs.module.icare.core.models.EncounterPatientState;
import org.openmrs.module.icare.core.models.MessagePayload;
import org.openmrs.module.icare.core.models.PasswordHistory;
import org.openmrs.module.icare.core.utils.EncounterWrapper;
import org.openmrs.module.icare.core.utils.PatientWrapper;
import org.openmrs.module.icare.core.utils.VisitWrapper;
import org.openmrs.module.icare.store.models.OrderStatus;
import org.openmrs.module.icare.store.models.Stock;
import org.openmrs.module.icare.store.services.StoreService;
import org.openmrs.module.webservices.rest.web.RestConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.mail.Session;
import javax.naming.ConfigurationException;
import javax.transaction.Transactional;
import java.io.IOException;
import java.net.URISyntaxException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * This class configured as controller using annotation and mapped with the URL of
 * 'module/${rootArtifactid}/${rootArtifactid}Link.form'.
 */
@Controller
@RequestMapping(value = "/rest/" + RestConstants.VERSION_1 + "/icare")
public class ICareController {
	
	@Autowired
	ICareService iCareService;
	
	@Autowired
	StoreService storeService;
	
	@Autowired
	BillingService billingService;
	
	@Autowired
	OrderService orderService;
	
	@Autowired
	EncounterService encounterService;
	
	@Autowired
	ConceptService conceptService;
	
	/** Logger for this class and subclasses */
	protected final Log log = LogFactory.getLog(getClass());
	
	@RequestMapping(value = "idgen", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> onGenerateId() {
        Map<String, Object> results = new HashMap<>();
        List<String> ids = iCareService.generatePatientIds();
        results.put("identifiers", ids);
        return results;

    }
	
	@RequestMapping(value = "codegen", method = RequestMethod.GET)
	@ResponseBody
	public List<String> onGenerateCode(@RequestParam(value = "globalProperty", required = true) String globalProperty,
	        @RequestParam(value = "metadataType", required = true) String metadataType,
	        @RequestParam(value = "count", defaultValue = "1", required = false) Integer count) throws Exception {
		
		List<String> generatedCode = iCareService.generateCode(globalProperty, metadataType, count);
		return generatedCode;
	}
	
	/**
	 * Initially called after the getUsers method to get the landing form name
	 * 
	 * @return String form view name
	 */
	@RequestMapping(value = "summary", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> onGetSummary() {
		Summary summary = iCareService.getSummary();
		return summary.toMap();
	}
	
	/**
	 * Initially called after the getUsers method to get the landing form name
	 * 
	 * @return String form view name
	 */
	@RequestMapping(value = "item", method = RequestMethod.GET)
    @ResponseBody
    public Map<String, Object> onGetItem(@RequestParam(required = false) String q, @RequestParam(defaultValue = "100") Integer limit, @RequestParam(defaultValue = "0") Integer startIndex, @RequestParam(required = false) String department, @RequestParam(required = false) Item.Type type, @RequestParam(required = false) Boolean stockable) {
        List<Map<String, Object>> items = new ArrayList<Map<String, Object>>();
        for (Item item : iCareService.getItems(q, limit, startIndex, department, type,stockable)) {
            items.add(item.toMap());
        }
        Map<String, Object> results = new HashMap<>();
        results.put("results", items);
        return results;
    }
	
	@RequestMapping(value = "stockableitems", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> onGetStockableItems(@RequestParam(required = false) String q,
												   @RequestParam(defaultValue = "100") Integer limit,
												   @RequestParam(defaultValue = "0") Integer startIndex,
												   @RequestParam(required = false) Item.Type type,
												   @RequestParam(required = false) Boolean stockable) {
		List<Map<String, Object>> items = new ArrayList<Map<String, Object>>();
		for (Item item : iCareService.getStockableItems(q, limit, startIndex, type, stockable)) {
			items.add(item.toMap());
		}
		Map<String, Object> results = new HashMap<>();
		results.put("results", items);
		return results;
	}
	
	@RequestMapping(value = "item", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> onPostItemJSON(@RequestBody Item item) {
		
		Item newItem = iCareService.saveItem(item);
		return newItem.toMap();
	}
	
	@RequestMapping(value = "item", method = RequestMethod.PUT)
	@ResponseBody
	public Map<String, Object> onUpdateItem(@RequestBody Item itemToUpdate) throws Exception {
		if (itemToUpdate.getUuid() == null) {
			throw new RuntimeException("Key `uuid` is Missing");
		}
		Item item = iCareService.getItemByUuid(itemToUpdate.getUuid());
		if (itemToUpdate.getStockable() != null) {
			item.setStockable(itemToUpdate.getStockable());
		}
		// TODO: Add support to handle update as per parameters updated and ensure return resemble action happened
		Item updatedItem = iCareService.saveItem(item);
		return updatedItem.toMap();
	}
	
	@RequestMapping(value = "conceptswithitems", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> onGetConceptItems(@RequestParam(required = false) String q,
												 @RequestParam(defaultValue = "100") Integer limit,
												 @RequestParam(defaultValue = "0") Integer startIndex,
												 @RequestParam(required = false) Boolean stockable,
												 @RequestParam(required = false) String conceptClass) {
		List<Map<String, Object>> conceptItems = new ArrayList<Map<String, Object>>();
		Pager pager = new Pager();
		pager.setAllowed(true);
		pager.setPageSize(limit);
		pager.setPage((startIndex/limit));
		for (Object conceptItem : iCareService.getConceptItems(q, limit, startIndex, Item.Type.valueOf("CONCEPT"), stockable, conceptClass)) {
//			items.add(concept);
			Map<String, Object> conceptItemObject = new HashMap<>();
			Concept concept= ((Item) conceptItem).getConcept();

			Map<String, Object> item = new HashMap<>();
			if (conceptItem != null) {
				item = ((Item) conceptItem).toMap();
			}
			conceptItemObject.put("item", item);
			conceptItemObject.put("uuid", concept.getUuid());
			conceptItemObject.put("display", concept.getDisplayString());
			conceptItemObject.put("dateCreated", concept.getDateCreated());
			conceptItemObject.put("dateChanged", concept.getDateChanged());
			Map<String, Object> conceptClassDetails = new HashMap<>();
			conceptClassDetails.put("name", concept.getConceptClass().getName());
			conceptClassDetails.put("display", concept.getConceptClass().getName());
			conceptClassDetails.put("uuid", concept.getConceptClass().getUuid());
			conceptItemObject.put("dateChanged", concept.getDateChanged());
			conceptItemObject.put("class", conceptClassDetails);
			List<Map<String, Object>> mappings = new ArrayList<>();
			// TODO: Add support to load mappings
			for (ConceptMap conceptMap: concept.getConceptMappings()) {
				Map<String, Object> mapping = new HashMap<>();
			}
			conceptItemObject.put("retired", concept.getRetired());
			conceptItemObject.put("retiredOn", concept.getDateRetired());
			conceptItemObject.put("mappings", mappings);
			conceptItems.add(conceptItemObject);
		}
		Map<String, Object> results = new HashMap<>();
		results.put("results", conceptItems);
		results.put("pager",pager);
		return results;
	}
	
	@RequestMapping(value = "itemByConcept/{conceptUuid}", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> onGetItemByConcept(@PathVariable("conceptUuid") String conceptUuid) {
		
		Item newItem = iCareService.getItemByConceptUuid(conceptUuid);
		return newItem.toMap();
	}
	
	@RequestMapping(value = "itemByDrugConcept/{conceptUuid}", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> onGetItemByDrugConcept(@PathVariable("conceptUuid") String conceptUuid) {
		
		Item newItem = iCareService.getItemByDrugConceptUuid(conceptUuid);
		return newItem.toMap();
	}
	
	public Item onPostItem(Item item) {
		return iCareService.saveItem(item);
	}
	
	@RequestMapping(value = "itemprice", method = RequestMethod.GET)
    @ResponseBody
    public Map<String, Object> onGet(@RequestParam(defaultValue = "100") Integer limit, @RequestParam(defaultValue = "0") Integer startIndex, @RequestParam(required = false) String paymentType, @RequestParam(required = false) String visitUuid, @RequestParam(required = false) String drugUuid , @RequestParam(required = false) String conceptUuid ) throws ConfigurationException {
		Map<String, Object> results = new HashMap<>();
		if (visitUuid == null && drugUuid ==null && conceptUuid == null) {
			List<Map<String, Object>> items = new ArrayList<Map<String, Object>>();
			for (ItemPrice item : iCareService.getItemPrices(paymentType, limit, startIndex)) {
				items.add(item.toMap());
			}
			results.put("results", items);
		}

		if (visitUuid != null && drugUuid !=null){
			Visit visit = Context.getService(VisitService.class).getVisitByUuid(visitUuid);
			Drug drug = Context.getService(ConceptService.class).getDrugByUuid(drugUuid);
			ItemPrice item = iCareService.getItemPrice(visit,drug);
			if (item != null) {
				results.put("results",item.toMap());
			} else {
				results.put("results", new ArrayList<>());
			}
		}

		if (visitUuid != null && conceptUuid !=null){
			Visit visit = Context.getService(VisitService.class).getVisitByUuid(visitUuid);
			Concept concept = Context.getService(ConceptService.class).getConceptByUuid(conceptUuid);
			ItemPrice item = iCareService.getItemPriceByConceptAndVisit(visit, concept);
			if (item != null) {
				results.put("results",item.toMap());
			} else {
				results.put("results", new ArrayList<>());
			}
		}

        return results;
    }
	
	@RequestMapping(value = "itemprice", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> onPostItemPrice(@RequestBody ItemPrice itemPrice) {
		ItemPrice newItemPrice = iCareService.saveItemPrice(itemPrice);
		return newItemPrice.toMap();
	}
	
	/**
	 * This class returns the form backing object. This can be a string, a boolean, or a normal java
	 * pojo. The bean name defined in the ModelAttribute annotation and the type can be just defined
	 * by the return type of this method
	 */
	@RequestMapping(method = RequestMethod.POST)
	@ResponseBody
	protected List<User> getUsers() throws Exception {
		
		// this object will be made available to the jsp page under the variable name
		// that is defined in the @ModuleAttribute tag
		return new ArrayList<User>();
	}
	
	@RequestMapping(value = "laborder", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Order onPostLabOrderCreation(@RequestBody Map<String, Object> orderObject) throws Exception {
		PatientService patientService = Context.getService(PatientService.class);
		Patient patient = patientService.getPatientByUuid((String) orderObject.get("patient"));
		
		TestOrder order = new TestOrder();
		order.setAction(Order.Action.valueOf((String) orderObject.get("action")));
		order.setUrgency(Order.Urgency.valueOf((String) orderObject.get("urgency")));
		order.setPatient(patient);
		
		ProviderService providerService = Context.getProviderService();
		Provider provider = providerService.getProviderByUuid((String) orderObject.get("orderer"));
		order.setOrderer(provider);
		
		Concept concept = new Concept();
		concept.setUuid((String) orderObject.get("concept"));
		order.setConcept(Context.getConceptService().getConceptByUuid((String) orderObject.get("concept")));
		
		OrderService orderService = Context.getOrderService();
		order.setCareSetting(orderService.getCareSetting(1));
		
		Encounter encounter = new Encounter();
		encounter.setUuid((String) orderObject.get("encounter"));
		encounter.setPatient(patient);
		order.setEncounter(Context.getEncounterService().getEncounterByUuid((String) orderObject.get("encounter")));
		
		//Order newOrder = billingService.createLabOrder(order);
		//return newOrder;
		return null;
	}
	
	@RequestMapping(value = "patientdiagnoses", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Diagnosis onPostDiagnosisCreation(@RequestBody Map<String, Object> diagnosisObject) throws Exception {
		PatientService patientService = Context.getService(PatientService.class);
		EncounterService encounterService = Context.getService(EncounterService.class);
		Patient patient = patientService.getPatientByUuid((String) diagnosisObject.get("patient"));
		
		Diagnosis diagnosis = new Diagnosis();
		CodedOrFreeText diagnosisDetail = new CodedOrFreeText();
		Concept concept = new Concept();
		ConceptService conceptService = Context.getService(ConceptService.class);
		concept = conceptService.getConceptByUuid(diagnosisObject.get("conceptUuid").toString());
		diagnosisDetail.setCoded(concept);
		diagnosisDetail.setNonCoded("Cholera");
		//		diagnosisDetail.setSpecificName(new ConceptName());
		diagnosis.setDiagnosis(diagnosisDetail);
		Encounter encounter = encounterService.getEncounterByUuid(diagnosisObject.get("encounter").toString());
		//		diagnosis.setEncounter(encounter);
		diagnosis.setCertainty(ConditionVerificationStatus.CONFIRMED);
		diagnosis.setPatient(patient);
		return diagnosis;
	}
	
	@RequestMapping(value = "message", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Map<String, Object> sendMessage(@RequestBody Map<String, Object> messageObject) throws Exception {
		
		Message message = Message.fromMap(messageObject);
		message = iCareService.sendMessage(message);
		return message.toMap();
	}
	
	@RequestMapping(value = "messages", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public List<Map<String, Object>> sendMessages(@RequestBody List<Map<String, Object>> messageList) throws Exception {

        List<Message> messages = new ArrayList<>();

        for (Map<String, Object> messageObject : messageList) {
            Message message = Message.fromMap(messageObject);
            messages.add(message);
        }
        messages = iCareService.sendMessages(messages);
        messageList = new ArrayList<>();

        for (Message message : iCareService.sendMessages(messages)) {
            messageList.add(message.toMap());
        }
        return messageList;
    }
	
	@RequestMapping(value = "orderstatus", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Map<String, Object> onPostOrderStatus(@RequestBody Map<String, Object> orderStatusObject) {
		OrderStatus orderStatus = OrderStatus.fromMap(orderStatusObject);
		orderStatus = iCareService.saveOrderStatus(orderStatus);
		
		return orderStatus.toMap();
	}
	
	@RequestMapping(value = "prescription", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Map<String, Object> onPostDrugOrderCreation(@RequestBody Map<String, Object> orderObject) throws Exception {
		Prescription prescription = Prescription.fromMap(orderObject);
		
		String previousOrderUuid = null;
		if (orderObject.get("previousOrder") != null) {
			previousOrderUuid = orderObject.get("previousOrder").toString();
		}
		
		ConceptService conceptService = Context.getConceptService();
		OrderService orderService = Context.getOrderService();
		PatientService patientService = Context.getPatientService();
		
		prescription.setDoseUnits(conceptService.getConceptByUuid(prescription.getDoseUnits().getUuid()));
		prescription.setDurationUnits(conceptService.getConceptByUuid(prescription.getDurationUnits().getUuid()));
		prescription.setRoute(conceptService.getConceptByUuid(prescription.getRoute().getUuid()));
		prescription.setFrequency(orderService.getOrderFrequencyByUuid(prescription.getFrequency().getUuid()));
		prescription.setQuantityUnits(conceptService.getConceptByUuid(prescription.getQuantityUnits().getUuid()));
		//order.setNumRefills((Integer) orderObject.get("numRefills"));
		
		if (prescription.getDrug().getUuid() != null) {
			prescription.setDrug(conceptService.getDrugByUuid(prescription.getDrug().getUuid()));
		}
		
		prescription.setPatient(patientService.getPatientByUuid(prescription.getPatient().getUuid()));
		//order.setId(33009);
		
		ProviderService providerService = Context.getProviderService();
		Provider provider = providerService.getProviderByUuid(prescription.getOrderer().getUuid());
		prescription.setOrderer(provider);
		
		//Concept concept = new Concept();
		//concept.setUuid((String) orderObject.get("concept"));
		prescription.setConcept(conceptService.getConceptByUuid(prescription.getConcept().getUuid()));
		prescription.setCareSetting(orderService.getCareSetting(1));
		
		prescription.setEncounter(Context.getEncounterService().getEncounterByUuid(prescription.getEncounter().getUuid()));
		
		OrderType orderType = Context.getOrderService().getOrderTypeByName("Prescription");
		if (orderType == null) {
			throw new ConfigurationException("Prescription Order Type is not configured.");
		}
		prescription.setOrderType(orderType);
		String orderStatus = null;
		if (orderObject.get("status") != null) {
			orderStatus = orderObject.get("status").toString();
		}
		String orderRemarks = null;
		if (orderObject.get("remarks") != null) {
			orderRemarks = orderObject.get("remarks").toString();
		}
		if (previousOrderUuid != null) {
			prescription.setPreviousOrder(orderService.getOrderByUuid(previousOrderUuid));
		}
		prescription = iCareService.savePrescription(prescription, orderStatus, orderRemarks);
		return prescription.toMap();
	}
	
	@RequestMapping(value = "visit", method = RequestMethod.GET)
    @ResponseBody
    public Map<String, Object> getPendingVisit(@RequestParam(defaultValue = "100") Integer limit,
                                               @RequestParam(defaultValue = "0") Integer startIndex,
                                               @RequestParam(required = false) String orderTypeUuid,
											   @RequestParam(required = false) String encounterTypeUuid,
                                               @RequestParam(required = false) String q,
                                               @RequestParam(required = false) String locationUuid,
                                               @RequestParam(required = false) OrderStatus.OrderStatusCode orderStatusCode,
                                               @RequestParam(defaultValue = "VISIT") VisitWrapper.OrderBy orderBy,
                                               @RequestParam(defaultValue = "DESC") VisitWrapper.OrderByDirection orderByDirection,
                                               @RequestParam(required = false) Order.FulfillerStatus fulfillerStatus,
											   @RequestParam(required = false) String attributeValueReference,
											   @RequestParam(required = false) VisitWrapper.PaymentStatus paymentStatus,
											   @RequestParam(required = false) String visitAttributeTypeUuid,
											   @RequestParam(required = false) String sampleCategory,
											   @RequestParam(required = false) String exclude,
											   @RequestParam(defaultValue = "false") Boolean includeInactive,
											   @RequestParam(defaultValue = "false") Boolean includeDeadPatients
											   ) {

        List<Visit> visits = iCareService.getVisitsByOrderType(q, orderTypeUuid, encounterTypeUuid, locationUuid, orderStatusCode, fulfillerStatus, limit, startIndex, orderBy, orderByDirection, attributeValueReference, paymentStatus, visitAttributeTypeUuid, sampleCategory,exclude,includeInactive,includeDeadPatients);

        List<Map<String, Object>> responseSamplesObject = new ArrayList<Map<String, Object>>();
        for (Visit visit : visits) {

            Map<String, Object> sampleObject = (new VisitWrapper(visit)).toMap();

            //add the sample after creating its object
            responseSamplesObject.add(sampleObject);

        }
        Map<String, Object> results = new HashMap<>();
        results.put("results", responseSamplesObject);
        return results;
    }
	
	@RequestMapping(value = "order", method = RequestMethod.GET)
    @ResponseBody
    public Map<String, Object> getOrdersByVisit(@RequestParam(defaultValue = "100") Integer limit,
                                                @RequestParam(defaultValue = "0") Integer startIndex,
                                                @RequestParam String orderTypeUuid,
                                                @RequestParam String visitUuid,
                                                @RequestParam(required = false) Order.FulfillerStatus fulfillerStatus,
												@RequestParam(required = false) boolean includeInActive) {

        List<Order> orders = iCareService.getOrdersByVisitAndOrderType(visitUuid, orderTypeUuid, fulfillerStatus, limit, startIndex);

        List<Map<String, Object>> responseSamplesObject = new ArrayList<Map<String, Object>>();
        for (Order order : orders) {

            if (order instanceof Prescription) {
                Map<String, Object> sampleObject = ((Prescription) order).toMap();
                responseSamplesObject.add(sampleObject);
            }

        }
        Map<String, Object> retults = new HashMap<>();
        retults.put("results", responseSamplesObject);
        return retults;
    }
	
	@RequestMapping(value = "visit/{visitUuid}/claimForm", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> getClaim(@PathVariable("visitUuid") String visitUuid) throws Exception {
		Claim claim = iCareService.getClaimByVisitUuid(visitUuid);
		return claim.toMap();
	}
	
	@RequestMapping(value = "visit/{visitUuid}/claim", method = RequestMethod.GET)
	@ResponseBody
	public ClaimResult claim(@PathVariable("visitUuid") String visitUuid) throws Exception {
		ClaimResult claim = iCareService.claimByVisitUuid(visitUuid);
		return claim;
	}
	
	@RequestMapping(value = "concept", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> getIcareConcepts(@RequestParam(value = "q", required = false) String q,
												@RequestParam(value = "conceptClass", required = false) String conceptClass,
												@RequestParam(value = "searchTerm", required = false) String searchTerm,
												@RequestParam(defaultValue = "50") Integer limit,
												@RequestParam(defaultValue = "0") Integer startIndex,
												@RequestParam(value="searchTermOfConceptSetToExclude", required = false) String searchTermOfConceptSetToExclude,
												@RequestParam(value="conceptSource", required = false) String conceptSourceUuid,
												@RequestParam(value="referenceTermCode", required = false) String referenceTermCode,
												@RequestParam(value="attributeType", required = false) String attributeType,
												@RequestParam(value="attributeValue", required = false) String attributeValue,
												@RequestParam(value="detailed", required = false) Boolean detailed,
												@RequestParam(defaultValue = "true", value = "paging", required = false) boolean paging,
												@RequestParam(defaultValue = "50", value = "pageSize", required = false) Integer pageSize,
												@RequestParam(defaultValue = "1", value = "page", required = false) Integer page) {
		List<Map<String, Object>> conceptsList = new ArrayList<>();
		Pager pager = new Pager();
		pager.setAllowed(paging);
		pager.setPageSize(pageSize);
		pager.setPage(page);
		ListResult listResult = iCareService.getConcepts(q, conceptClass, searchTerm, limit, startIndex,
				searchTermOfConceptSetToExclude,conceptSourceUuid, referenceTermCode,attributeType,attributeValue, pager);
		for (Concept conceptItem: (List<Concept>) listResult.getResults()) {
			Map<String, Object> conceptMap = new HashMap<String, Object>();
			conceptMap.put("dateCreated", conceptItem.getDateCreated());
			conceptMap.put("uuid", conceptItem.getUuid().toString());
			conceptMap.put("display", conceptItem.getDisplayString());
			conceptMap.put("systemName", conceptItem.getDisplayString());
			conceptMap.put("retired", conceptItem.getRetired().booleanValue());
			conceptMap.put("retiredOn", conceptItem.getDateRetired());
			conceptMap.put("retiredReason", conceptItem.getRetireReason());
			conceptMap.put("billableItem", iCareService.getItemPricesByConceptId(conceptItem.getConceptId()).size() > 0 ? true : false);

//			Creator
			Map<String, Object> creator = new HashMap<>();
			creator.put("uuid", conceptItem.getCreator().getUuid());
			creator.put("display", conceptItem.getCreator().getDisplayString());
			conceptMap.put("createdBy", creator);
//			Changed By
			Map<String, Object> changedBy = new HashMap<>();
			changedBy.put("uuid", conceptItem.getChangedBy().getUuid());
			changedBy.put("display", conceptItem.getChangedBy().getDisplayString());
			conceptMap.put("dateChanged", conceptItem.getDateChanged());
			conceptMap.put("changedBy", changedBy);

//			Class details
			Map<String, Object> classDetails = new HashMap<String, Object>();
			classDetails.put("uuid", conceptItem.getConceptClass().getUuid() );
			classDetails.put("name", conceptItem.getConceptClass().getName() );
			conceptMap.put("class",  classDetails );
//			Mappings
			List<Map<String, Object>> mappings = new ArrayList<>();
			for(ConceptMap mapping: conceptItem.getConceptMappings()) {
				Map<String, Object> conceptMapping = new HashMap<>();
				conceptMapping.put("uuid", mapping.getUuid());
				conceptMapping.put("code", mapping.getConceptReferenceTerm().getCode());
				conceptMapping.put("conceptSourceUuid", mapping.getConceptReferenceTerm().getConceptSource().getUuid());
				mappings.add(conceptMapping);
			}
			conceptMap.put("mappings",  mappings );
			// TODO: Change logic to use query parameters instead of detailed
			if (detailed != null && detailed) {
				// Set members
				List<Map<String, Object>> setMembers = new ArrayList<>();
				for(Concept setMember: conceptItem.getSetMembers()) {
					Map<String, Object> member = new HashMap<>();
					member.put("uuid", setMember.getUuid());
					member.put("display", setMember.getFullySpecifiedName(null));
					member.put("displayName", setMember.getDisplayString());
					List<Map<String, Object>> answers = new ArrayList<>();
					if (setMember.getDatatype().isCoded() == true) {
						for(ConceptAnswer conceptAnswer: setMember.getAnswers()) {
							if (!conceptAnswer.getAnswerConcept().isRetired()) {
								Map<String, Object> answer = new HashMap<>();
								answer.put("answerUuid", conceptAnswer.getUuid());
								answer.put("uuid", conceptAnswer.getAnswerConcept().getUuid());
								answer.put("display", conceptAnswer.getAnswerConcept().getDisplayString());
								answer.put("retired", conceptAnswer.getAnswerConcept().isRetired());
								answers.add(answer);
							}
						}
					}
					member.put("answers", answers);
					Map<String, Object> datatype = new HashMap<>();
					datatype.put("coded", setMember.getDatatype().isCoded());
					datatype.put("text", setMember.getDatatype().isText());
					datatype.put("boolean", setMember.getDatatype().isBoolean());
					datatype.put("date", setMember.getDatatype().isDate());
					datatype.put("datetime", setMember.getDatatype().isDateTime());
					member.put("dataType", datatype);
					setMembers.add(member);
				}
				conceptMap.put("setMembers", setMembers);
			}
			conceptsList.add(conceptMap);
		}
		Map<String, Object> results = new HashMap<>();
		results.put("results", conceptsList);
		results.put("pager", listResult.getPager());
		return results;
	}
	
	@RequestMapping(value = "conceptreferenceterm", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> getIcareConceptReferenceTerms(@RequestParam(value = "q", required = false) String q,
															 @RequestParam(value = "source", required = false) String source,
															 @RequestParam(defaultValue = "50") Integer limit,
															 @RequestParam(defaultValue = "0") Integer startIndex) {
		List<Map<String, Object>> conceptReferenceTermsList = new ArrayList<>();
		for (ConceptReferenceTerm conceptReferenceTerm: iCareService.getConceptReferenceTerms(q, source, limit, startIndex)) {
			Map<String, Object> conceptReferenceTermMap = new HashMap<String, Object>();
			conceptReferenceTermMap.put("uuid", conceptReferenceTerm.getUuid().toString());
			conceptReferenceTermMap.put("display", conceptReferenceTerm.getName().toString());
			conceptReferenceTermMap.put("retired", conceptReferenceTerm.getRetired().booleanValue());
			conceptReferenceTermMap.put("code", conceptReferenceTerm.getCode());
			conceptReferenceTermMap.put("name", conceptReferenceTerm.getName());

//			Source details
			Map<String, Object> sourceDetails = new HashMap<String, Object>();
			sourceDetails.put("uuid", conceptReferenceTerm.getConceptSource().getUuid().toString() );
			sourceDetails.put("name", conceptReferenceTerm.getConceptSource().getName().toString() );
			sourceDetails.put("retired", conceptReferenceTerm.getConceptSource().getRetired().booleanValue() );
			conceptReferenceTermMap.put("source", sourceDetails);
			conceptReferenceTermsList.add(conceptReferenceTermMap);
		}
		Map<String, Object> results = new HashMap<>();
		results.put("results", conceptReferenceTermsList);
		return results;
	}
	
	@RequestMapping(value = "conceptsets", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> getConceptSetsByConcept(@RequestParam(value = "concept", required = false) String concept) {
		List<Map<String, Object>> conceptSetsList = new ArrayList<>();
		for (ConceptSet conceptSets: iCareService.getConceptsSetsByConcept(concept)) {
			Map<String, Object> conceptSet = new HashMap<String, Object>();
			conceptSet.put("uuid", conceptSets.getConceptSet().getUuid());
			conceptSet.put("display", conceptSets.getConceptSet().getDisplayString());
			conceptSet.put("systemName", conceptSets.getConceptSet().getDisplayString());
			conceptSet.put("retired", conceptSets.getConceptSet().getRetired().booleanValue());
			conceptSetsList.add(conceptSet);
		}
		Map<String, Object> results = new HashMap<>();
		results.put("results", conceptSetsList);
		return results;
	}
	
	@RequestMapping(value = "location", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> getLocations(@RequestParam(value = "attributeType", required = false) String attributeType,
										   @RequestParam(value = "value", required = false) String value,
										   @RequestParam(defaultValue = "50") Integer limit,
										   @RequestParam(defaultValue = "0") Integer startIndex) {
		List<Map<String, Object>> locationList = new ArrayList<>();
		for(Location location: iCareService.getLocations(attributeType, value, limit, startIndex)) {
			Map<String, Object> locationData = new HashMap<>();
			locationData.put("uuid", location.getUuid());
			locationData.put("name", location.getName());
			locationData.put("display", location.getDisplayString());
			locationList.add(locationData);
		}
		Map<String, Object> results = new HashMap<>();
		results.put("results", locationList);
		return results;
	}
	
	@RequestMapping(value = "drug", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> getDrugs(@RequestParam(value = "concept", required = false) String concept, @RequestParam(defaultValue = "50") Integer limit, @RequestParam(defaultValue = "0") Integer startIndex) {
		List<Map<String, Object>> drugsList = new ArrayList<>();
		for (Drug drug: iCareService.getDrugs(concept, limit, startIndex)) {
			Map<String, Object> drugMap = new HashMap<String, Object>();
			drugMap.put("uuid", drug.getUuid());
			drugMap.put("display", drug.getDisplayName());
			drugMap.put("name", drug.getName());
			drugMap.put("description", drug.getDescription());
			drugMap.put("retired", drug.getRetired());
			drugMap.put("strength", drug.getStrength());

			Map<String, Object> conceptMap = new HashMap<String, Object>();
			conceptMap.put("uuid",drug.getConcept().getUuid());
			conceptMap.put("display",drug.getConcept().getDisplayString());
			drugMap.put("concept", conceptMap);
			drugsList.add(drugMap);
		}
		Map<String, Object> results = new HashMap<>();
		results.put("results", drugsList);
		return results;
	}
	
	@RequestMapping(value ="patient", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> getPatient(@RequestParam(required = false) String search,@RequestParam(required = false) String patientUUID,@RequestParam(required = false) PatientWrapper.VisitStatus visitStatus,@RequestParam(defaultValue = "100") Integer limit,
										  @RequestParam(defaultValue = "0") Integer startIndex,@RequestParam(defaultValue = "DESC") PatientWrapper.OrderByDirection orderByDirection){

		List<PatientWrapper> patients = iCareService.getPatients(search,patientUUID,visitStatus,startIndex,limit,orderByDirection);

		List<Map<String, Object>> responseSamplesObject = new ArrayList<Map<String, Object>>();
		for (PatientWrapper patient: patients){
			responseSamplesObject.add((Map<String, Object>) patient.toMap());
		}
		Map<String, Object> results = new HashMap<>();
		results.put("results",responseSamplesObject);

		return results;
	}
	
	@RequestMapping(value = "patient", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Map<String, Object> createPatient(@RequestBody Map<String, Object> patientObject) throws Exception {
		
		Patient patient = new Patient();
		patient.setIdentifiers((Set<PatientIdentifier>) patientObject.get("identifiers"));
		patient.setBirthdate((Date) patientObject.get("birthdate"));
		patient.setAddresses((Set<PersonAddress>) patientObject.get("addresses"));
		patient.setNames((Set<PersonName>) patientObject.get("names"));
		patient.setDead((Boolean) patientObject.get("dead"));
		patient.setGender((String) patientObject.get("gender"));
		
		patient = iCareService.savePatient(patient);
		
		Map<String, Object> patientcreated = new HashMap<String, Object>();
		patientcreated.put("identifiers", patient.getIdentifiers());
		patientcreated.put("names", patient.getNames());
		patientcreated.put("addresses", patient.getAddresses());
		patientcreated.put("gender", patient.getGender());
		
		return patientcreated;
		
	}
	
	@RequestMapping(value = "client/externalsystems", method = RequestMethod.GET)
	@ResponseBody
	public List<Object> getClientsFromExternalSystems(@RequestParam(value = "identifier", required = false) String identifier,
	        @RequestParam(value = "identifierReference", required = false) String identifierReference,
			@RequestParam(value = "basicAuth", required = false) String basicAuth) {
//		Object patientData = new Object();
		List<Object> formattedTrackedEntityInstances = new ArrayList<>();
		try {
			String patientFromExternalSystem = iCareService.getClientsFromExternalSystems(identifier, identifierReference, basicAuth);

			AdministrationService administrationService = Context.getService(AdministrationService.class);

//			Get Attributes for extracting attribute values
			String firstNameAttributeUid = administrationService.getGlobalProperty("iCare.externalSystems.integrated.pimaCovid.attributes.firstName");
			String middleNameAttributeUid = administrationService.getGlobalProperty("iCare.externalSystems.integrated.pimaCovid.attributes.middleName");
			String lastNameAttributeUid = administrationService.getGlobalProperty("iCare.externalSystems.integrated.pimaCovid.attributes.lastName");
			String genderAttributeUid = administrationService.getGlobalProperty("iCare.externalSystems.integrated.pimaCovid.attributes.gender");
			String nationalityAttributeUid = administrationService.getGlobalProperty("iCare.externalSystems.integrated.pimaCovid.attributes.nationality");
			String dobAttributeUid = administrationService.getGlobalProperty("iCare.externalSystems.integrated.pimaCovid.attributes.dob");
			String passportNumberAttributeUid = administrationService.getGlobalProperty("iCare.externalSystems.integrated.pimaCovid.attributes.passportNumber");
			String phoneNumberAttributeUid = administrationService.getGlobalProperty("iCare.externalSystems.integrated.pimaCovid.attributes.phoneNumber");
			String emailAttributeUid = administrationService.getGlobalProperty("iCare.externalSystems.integrated.pimaCovid.attributes.email");

//			Get results stage uid
			String resultsStageId = administrationService.getGlobalProperty("iCare.externalSystems.integrated.pimaCovid.programStages.resultsStage");

//			Get test request stage uid
			String testRequestStageId = administrationService.getGlobalProperty("iCare.externalSystems.integrated.pimaCovid.programStages.testRequestStage");

//			patientData = (Object) patientFromExternalSystem;
			JSONObject test = new JSONObject(patientFromExternalSystem);
			Map trackedEntityInstancesMap = (new ObjectMapper()).readValue(patientFromExternalSystem, Map.class);
//			patientData = trackedEntityInstancesMap.get("trackedEntityInstances");
			if (trackedEntityInstancesMap != null && trackedEntityInstancesMap.get("trackedEntityInstances") != null) {
				List<Object> trackedEntityInstances = (List<Object>)trackedEntityInstancesMap.get("trackedEntityInstances");
				if (trackedEntityInstances.size() > 0) {
					for (int count =0; count < trackedEntityInstances.size(); count++) {
						Map<String, Object> clientFormattedData = new HashMap<>();
						Map<String, Object> currentTrackedEntityInstance = new HashMap<>();
						currentTrackedEntityInstance = (Map<String, Object> )trackedEntityInstances.get(count);
						List<Object> enrollments = (List<Object>)currentTrackedEntityInstance.get("enrollments");
						Map<String, Object> eventData = new HashMap<>();
						Map<String, Object> currentEnrollment = (Map<String, Object> )enrollments.get(0);  // Expected to have only one enrollment
						List<Object> events = (List<Object>)currentEnrollment.get("events");
						eventData.put("hasResults", events.size() == 2);
						clientFormattedData.put("events", events);
						for (int eventCount =0; eventCount< events.size(); eventCount ++) {
							Map<String, Object> event =(Map<String, Object>) events.get(eventCount);
							if (event.get("programStage").equals(resultsStageId)) {
								clientFormattedData.put("hasResults", true);
							}

							if (event.get("programStage").equals(testRequestStageId)) {
								clientFormattedData.put("testRequestData", event);
							}
						}
						clientFormattedData.put("trackedEntityInstance", currentTrackedEntityInstance.get("trackedEntityInstance"));
						clientFormattedData.put("enrollment", currentEnrollment.get("enrollment"));
						clientFormattedData.put("enrollmentDate", currentEnrollment.get("enrollmentDate"));
						clientFormattedData.put("orgUnitName", currentEnrollment.get("orgUnitName"));
						clientFormattedData.put("orgUnit", currentEnrollment.get("orgUnit"));
						clientFormattedData.put("status", currentEnrollment.get("status"));
						clientFormattedData.put("program", currentEnrollment.get("program"));
						List<Object> attributes = (List<Object>) currentTrackedEntityInstance.get("attributes");
						for (int attributeCount =0; attributeCount < attributes.size(); attributeCount ++) {
							Map<String, Object> attribute = (Map<String, Object> )attributes.get(attributeCount);
							if (attribute.get("attribute").equals(firstNameAttributeUid)) {
								clientFormattedData.put("firstName",attribute.get("value"));
							}
							if (attribute.get("attribute").equals(middleNameAttributeUid)) {
								clientFormattedData.put("middleName",attribute.get("value"));
							}
							if (attribute.get("attribute").equals(lastNameAttributeUid)) {
								clientFormattedData.put("lastName",attribute.get("value"));
							}
							if (attribute.get("attribute").equals(genderAttributeUid)) {
								clientFormattedData.put("gender",attribute.get("value"));
							}
							if (attribute.get("attribute").equals(nationalityAttributeUid)) {
								clientFormattedData.put("nationality",attribute.get("value"));
							}
							if (attribute.get("attribute").equals(dobAttributeUid)) {
								clientFormattedData.put("dob",attribute.get("value"));
							}
							if (attribute.get("attribute").equals(passportNumberAttributeUid)) {
								clientFormattedData.put("passportNumber",attribute.get("value"));
							}
							if (attribute.get("attribute").equals(phoneNumberAttributeUid)) {
								clientFormattedData.put("phoneNumber",attribute.get("value"));
							}
							if (attribute.get("attribute").equals(emailAttributeUid)) {
								clientFormattedData.put("email",attribute.get("value"));
							}
						}
						clientFormattedData.put("attributes", currentTrackedEntityInstance.get("attributes"));
//				formattedTrackedEntityInstance.put("orgUnitName", (new ObjectMapper()).readValue(trackedEntityInstances[count], Map.class));
						formattedTrackedEntityInstances.add(count,clientFormattedData);
					}
				}
			}
		}
		catch (IOException e) {
			throw new RuntimeException(e);
		}
		catch (URISyntaxException e) {
			throw new RuntimeException(e);
		}
		return formattedTrackedEntityInstances;
	}
	
	@RequestMapping(value = "externalsystems/labrequest", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public String createLabRequest(@RequestBody Map<String, Object> labRequestObject) throws ParseException {
		
		Map<String, Object> labRequest = labRequestObject;
		String response;
		try {
			response = iCareService.createPimaCovidLabRequest(labRequest, "");
		}
		catch (IOException e) {
			throw new RuntimeException(e);
		}
		catch (URISyntaxException e) {
			throw new RuntimeException(e);
		}
		return response;
	}
	
	@RequestMapping(value = "externalsystems/labresult", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public String saveLabResults(@RequestBody Map<String, Object> labResultObject) throws ParseException {
		
		Map<String, Object> labResult = labResultObject;
		String response;
		try {
			response = iCareService.savePimaCovidLabResult(labResult);
		}
		catch (IOException e) {
			throw new RuntimeException(e);
		}
		catch (URISyntaxException e) {
			throw new RuntimeException(e);
		}
		return response;
	}
	
	@RequestMapping(value = "externalsystems/verifycredentials", method = RequestMethod.GET)
	@ResponseBody
	public String verifyExternalSystemCredentials(@RequestParam(value = "username", required = true) String username,
	        @RequestParam(value = "password", required = true) String password,
	        @RequestParam(value = "systemKey", required = true) String systemKey) throws ParseException {
		
		String verificationInfo = new String();
		try {
			verificationInfo = iCareService.verifyExternalSystemCredentials(username, password, systemKey);
		}
		catch (IOException e) {
			throw new RuntimeException(e);
		}
		catch (URISyntaxException e) {
			throw new RuntimeException(e);
		}
		return verificationInfo;
	}
	
	@RequestMapping(value = "concept/{uuid}/retire", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> retireConcept(@PathVariable("uuid") String uuid, @RequestBody Map<String, Object> retireObject) {
		Map<String, Object> returnResponse = new HashMap<>();
		Concept concept = conceptService.getConceptByUuid((String) uuid);
		if (concept == null){
			throw new APIException("The concept with " + uuid+ " does not exist");
		}
		Concept changedConcept = new Concept();
		if (retireObject.get("retire") == null) {
			throw new APIException("The retire keyword is missing");
		}

		if ( retireObject.get("reason") == null &&  retireObject.get("retire").toString() == "true") {
			throw new APIException("The retire reason is missing");
		}
		if ( retireObject.get("retire").toString() == "true") {
			changedConcept =conceptService.retireConcept(concept, retireObject.get("reason").toString());
		} else {
			Concept conceptToUnRetire = conceptService.getConceptByUuid(uuid);
			conceptToUnRetire.setRetired(false);
			conceptService.saveConcept(conceptToUnRetire);
			changedConcept = conceptService.getConceptByUuid(uuid);
		}

		returnResponse.put("uuid", changedConcept.getUuid());
		returnResponse.put("display", changedConcept.getDisplayString());
		returnResponse.put("retired", changedConcept.getRetired().booleanValue());
		return returnResponse;
	}
	
	@RequestMapping(value = "concept/{uuid}/answers", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> saveConceptAnswers(@PathVariable("uuid") String uuid, @RequestBody List<String> answers) {
		Map<String, Object> returnResponse = new HashMap<>();
		Concept concept = conceptService.getConceptByUuid(uuid);
		if (answers.size() == 0){
			throw new APIException("No answers to update ");
		}

		// Identify if the provided answers exist
		List<String> conceptUuidForAnswers = answers;


		if (concept.getAnswers().size() > 0) {

			for (Iterator<ConceptAnswer> iterator = concept.getAnswers().iterator(); iterator.hasNext();) {
				ConceptAnswer conceptAnswer = iterator.next();
				iterator.remove(); // Remove the current element from the original list
			}

		}

		if (conceptUuidForAnswers.size() > 0 ) {
			for(String conceptForAnswerUuid: conceptUuidForAnswers) {
				ConceptAnswer conceptAnswer = new ConceptAnswer();
				conceptAnswer.setAnswerConcept(conceptService.getConceptByUuid(conceptForAnswerUuid));
				concept.addAnswer(conceptAnswer);
			}
		}

		Concept changedConcept = conceptService.saveConcept(concept);


		returnResponse.put("uuid", changedConcept.getUuid());
		returnResponse.put("display", changedConcept.getDisplayString());
		returnResponse.put("answersCount", changedConcept.getAnswers().size());
		return returnResponse;
	}
	
	@RequestMapping(value = "voidorder", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> voidOrder(@RequestBody Map<String, Object> voidObj) {
		Map<String, Object> returnResponse = new HashMap<>();
//		String response;
//		try {
//			response = iCareService.voidOrder((String) voidObj.get("uuid"), (String) voidObj.get("voidReason"));
//		}
//		catch (IOException e) {
//			throw new RuntimeException(e);
//		}

		Order order = orderService.getOrderByUuid((String) voidObj.get("uuid"));
		if (order == null){
			throw new APIException("The order uuid does not exist");
		}
		Order voidedorder =orderService.voidOrder(order,(String) voidObj.get("voidReason"));

		returnResponse.put("uuid", voidedorder.getUuid());
		return returnResponse;
	}
	
	@RequestMapping(value = "voidencounter", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> voidEncounter(@RequestBody Map<String, Object> voidObj) {
		Map<String, Object> returnResponse = new HashMap<>();
		Encounter encounter = encounterService.getEncounterByUuid((String) voidObj.get("uuid"));
		if (encounter == null){
			throw new APIException("This encounter uuid does not exist");
		}
		Encounter voidedEncounter =encounterService.voidEncounter(encounter,(String) voidObj.get("voidReason"));

		returnResponse.put("encounter", voidedEncounter.getUuid());
		return returnResponse;
	}
	
	@RequestMapping(value = "emailsession", method = RequestMethod.GET)
	@ResponseBody
	public Session getEmailSession() {
		Session response;
		try {
			response = iCareService.getEmailSession();
		}
		catch (Exception e) {
			throw new RuntimeException(e);
		}
		return response;
	}
	
	@RequestMapping(value = "processemail", method = RequestMethod.POST)
	@ResponseBody
	public String processEmail(@RequestBody Properties emailProperties) {
		
		System.out.println(emailProperties);
		
		String response;
		try {
			response = iCareService.processEmail(emailProperties);
		}
		catch (Exception e) {
			throw new RuntimeException(e);
		}
		System.out.println(response);
		return response;
	}
	
	@RequestMapping(value="auditlogs", method = RequestMethod.GET)
	@ResponseBody
	public List<Map<String,Object>> getAuditLogs(@RequestParam(required = false) List<Class<?>> clazzes, @RequestParam(required = false) List<String> actions, @RequestParam(required = false)  Date startDate, @RequestParam(required = false) Date endDate, @RequestParam(required = false)  boolean excludeChildAuditLogs, @RequestParam(required = false)  Integer start, @RequestParam(required = false)  Integer length){

		List<Map<String,Object>> auditLogMapList = new ArrayList<>();

		AuditLogService auditLogService = Context.getService(AuditLogService.class);

		List<AuditLog> auditLogs = auditLogService.getAuditLogs(clazzes,actions,startDate,endDate,excludeChildAuditLogs,start,length);
		for(AuditLog auditLog : auditLogs){
			auditLogMapList.add(auditLog.toMap());
		}

		return auditLogMapList;

	}
	
	@RequestMapping(value="passwordhistory/{uuid}", method = RequestMethod.GET)
	@ResponseBody
	public List<Map<String,Object>> getUserPasswordHistory(@PathVariable("uuid") String uuid){

		List<Map<String,Object>> passwordHistoriesList = new ArrayList<>();
		List<PasswordHistory> passwordHistories = iCareService.getUserPasswordHistory(uuid);
		for(PasswordHistory passwordHistory : passwordHistories){
			passwordHistoriesList.add(passwordHistory.toMap());
		}
		return passwordHistoriesList;
	}
	
	@RequestMapping(value="roles", method = RequestMethod.GET)
	@ResponseBody
	public List<Map<String, Object>> getRoles(@RequestParam(required = true) String q,@RequestParam(required = false, defaultValue = "0") Integer startIndex, @RequestParam(required = false, defaultValue = "10") Integer limit){
		List<Map<String, Object>> rolesMapList = new ArrayList<>();
		List<Role> roles = iCareService.getRoles(q, startIndex, limit);
		for(Role role : roles){
			Map<String, Object> rolesMap = new HashMap<>();
			rolesMap.put("display", role.getRole());
			rolesMap.put("description", role.getDescription());
			rolesMap.put("uuid", role.getUuid());
			rolesMapList.add(rolesMap);
		}
		return rolesMapList;
	}
	
	@RequestMapping(value="privileges", method = RequestMethod.GET)
	@ResponseBody
	public List<Map<String, Object>> getPrivileges(@RequestParam(required = true) String q,@RequestParam(required = false, defaultValue = "0") Integer startIndex, @RequestParam(required = false, defaultValue = "10") Integer limit){
		List<Map<String, Object>> privilegesMapList = new ArrayList<>();
		List<Privilege> privileges = iCareService.getPrivileges(q, startIndex, limit);
		for(Privilege privilege: privileges ){
			Map<String, Object> privilegesMap = new HashMap<>();
			privilegesMap.put("display", privilege.getPrivilege());
			privilegesMap.put("description", privilege.getDescription());
			privilegesMap.put("uuid", privilege.getUuid());
			privilegesMapList.add(privilegesMap);
		}
		return privilegesMapList;
	}
	
	@RequestMapping(value = "patientprogramenrollment", method = RequestMethod.GET)
	@ResponseBody
	public List<Map<String,Object>> getPatientPrograms(@RequestParam(required = false, value = "program") String programUuid,
	        @RequestParam(required = false, value = "patient") String patientUuid,
	        @RequestParam(required = false, defaultValue = "0") Integer startIndex,
	        @RequestParam(required = false, defaultValue = "10") Integer limit,
			@RequestParam(defaultValue = "false") Boolean includeDeadPatients) throws Exception {
		
				List<Map<String,Object>> programMapList = new ArrayList<>();
				List<PatientProgram> patientPrograms= iCareService.getPatientProgram(programUuid,patientUuid,startIndex,limit,includeDeadPatients);
				for(PatientProgram patientProgram : patientPrograms){
					Map<String,Object> patientProgramMap = new HashMap<>();
					if(programUuid != null) {
						PatientWrapper patientWrapper = new PatientWrapper(patientProgram.getPatient());
						patientProgramMap.put("patient", patientWrapper.toMap());
					}
					if(patientUuid != null) {
						Map<String, Object> programMap = new HashMap<>();
						programMap.put("uuid", patientProgram.getProgram().getUuid());
						programMap.put("name", patientProgram.getProgram().getName());
						patientProgramMap.put("program", programMap);
					}
					patientProgramMap.put("uuid",patientProgram.getUuid());
					programMapList.add(patientProgramMap);

				}

		return programMapList.subList(startIndex,programMapList.size() > limit? limit : programMapList.size());
		
	}
	
	@RequestMapping(value = "workflow", method = RequestMethod.POST)
	@ResponseBody
	public List<Map<String, Object>> createWorkflows(@RequestBody List<Map<String, Object>> workflowList) throws Exception {

		List<Map<String, Object>> workFlowList = new ArrayList<>();
		for(Map<String, Object> workflowObject : workflowList){
			ProgramWorkflow programWorkflow = new ProgramWorkflow();
			Map<String, Object> programWorkflowMap = new HashMap<>();
			Concept concept = Context.getConceptService().getConceptByUuid(workflowObject.get("concept").toString());
			Program program = Context.getProgramWorkflowService().getProgramByUuid(workflowObject.get("program").toString());
			if(concept == null){
				throw new Exception(" The concept with this uuid does not exist");
			}
			if(program == null){
				throw new Exception(" The program with this uuid does not exist");
			}
			programWorkflow.setConcept(Context.getConceptService().getConceptByUuid(workflowObject.get("concept").toString()));
			programWorkflow.setProgram(Context.getProgramWorkflowService().getProgramByUuid(workflowObject.get("program").toString()));

			ProgramWorkflow savedProgramWorkflow = iCareService.saveProgramWorkflow(programWorkflow);

			Map<String, Object> conceptMap = new HashMap<>();
			conceptMap.put("uuid",savedProgramWorkflow.getConcept().getUuid());
			conceptMap.put("name",savedProgramWorkflow.getConcept().getName().getName());

			Map<String, Object> programMap = new HashMap<>();
			programMap.put("uuid",savedProgramWorkflow.getProgram().getUuid());
			programMap.put("name",savedProgramWorkflow.getProgram().getName());

			programWorkflowMap.put("concept",conceptMap);
			programWorkflowMap.put("program",programMap);

			workFlowList.add(programWorkflowMap);
		}

		return workflowList;

	}
	
	@RequestMapping(value = "encounterpatientstate", method = RequestMethod.POST)
	@ResponseBody
	public List<Map<String, Object>> createEncounterPatientState(@RequestBody Map<String, Object> encounterPatientStateMap) {

		List<Map<String, Object>> encounterWorkflowStateListMap = new ArrayList<>();
		if (encounterPatientStateMap.get("encounters") != null) {
			for (Map<String, Object> encounterMap : (List<Map<String, Object>>) encounterPatientStateMap.get("encounters")) {

				EncounterPatientState encounterPatientState = new EncounterPatientState();
				Encounter encounter = Context.getEncounterService().getEncounterByUuid(encounterMap.get("uuid").toString());
				encounterPatientState.setEncounter(encounter);

				if (encounterPatientStateMap.get("patientState") != null) {

					PatientState patientState = Context.getProgramWorkflowService().getPatientStateByUuid(((Map) encounterPatientStateMap.get("patientState")).get("uuid").toString());
					encounterPatientState.setPatientState(patientState);
				}
				EncounterPatientState savedEncounterPatientState = storeService.saveEncounterPatientState(encounterPatientState);
				encounterWorkflowStateListMap.add(savedEncounterPatientState.toMap());
			}
		}

		return encounterWorkflowStateListMap;

	}
	
	@RequestMapping(value = "encounterpatientstate/{patientStateUuid}",method = RequestMethod.GET)
	@ResponseBody
	public List<Map<String, Object>> getEncountersByPatientState(@PathVariable("patientStateUuid") String patientStateUuid){

		List<Map<String,Object>> encountersListMap = new ArrayList<>();
		List<Encounter> encounters = iCareService.getEncountersByPatientState(patientStateUuid);
		for( Encounter encounter : encounters){
			Map<String, Object> encounterMap = new HashMap<>();

			encounterMap.put("uuid", encounter.getUuid());

			Map<String, Object> patientMap = new HashMap<>();
			patientMap.put("uuid", encounter.getPatient().getUuid());
			patientMap.put("name", encounter.getPatient().getPerson().getPersonName().getFullName());
			encounterMap.put("patient",patientMap);

			Map<String, Object> encounterTypeMap = new HashMap<>();
			if(encounter.getEncounterType() != null) {
				encounterTypeMap.put("uuid", encounter.getEncounterType().getUuid());
				encounterTypeMap.put("name", encounter.getEncounterType().getName());
			}
			encounterMap.put("encounterType",encounterTypeMap);

			List<Map<String,Object>> obsMapList = new ArrayList<>();
			for(Obs obs : encounter.getObs()){
				Map<String, Object> obsMap = new HashMap<>();
				obsMap.put("uuid",obs.getUuid());
				obsMap.put("obsDatetime",obs.getObsDatetime().toString());
				Map<String, Object> conceptMap = new HashMap<>();
				conceptMap.put("uuid",obs.getConcept().getUuid());
				conceptMap.put("display",obs.getConcept().getDisplayString());
				obsMap.put("concept", conceptMap);
				if(obs.getValueNumeric() != null) {
					obsMap.put("valuenumeric", obs.getValueNumeric());
				}
				if(obs.getValueCoded() != null) {
					Map<String, Object> valueCodedMap = new HashMap<>();
					valueCodedMap.put("uuid",obs.getValueCoded().getUuid());
					valueCodedMap.put("display",obs.getValueCoded().getDisplayString());
					obsMap.put("value", valueCodedMap);
				}
				if(obs.getValueText() != null) {
					obsMap.put("valuetext", obs.getValueText());
				}
				obsMapList.add(obsMap);
			}
			encounterMap.put("obs",obsMapList);

			Map<String, Object> formMap = new HashMap<>();
			if(encounter.getForm() != null) {
				formMap.put("uuid", encounter.getForm().getUuid());
				formMap.put("name", encounter.getForm().getName());
			}
			encounterMap.put("form", formMap);

			if(encounter.getDateCreated() != null) {
				Date date = encounter.getDateCreated();
				DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ");
				encounterMap.put("created", dateFormat.format(date));
			}

			Map<String, Object> locationMap = new HashMap<>();
			if(encounter.getLocation() != null) {
				locationMap.put("uuid", encounter.getLocation().getUuid());
				locationMap.put("name", encounter.getLocation().getDisplayString());
			}
			encounterMap.put("location",locationMap);

			Map<String,Object> userMap = new HashMap<>();
			if(encounter.getCreator() != null) {
				userMap.put("uuid", encounter.getCreator().getUuid());
				userMap.put("name", encounter.getCreator().getDisplayString());
			}
			encounterMap.put("creator",userMap);

			encountersListMap.add(encounterMap);

		}
		return encountersListMap;

	}
	
	@RequestMapping(value = "encounterpatientprogram", method = RequestMethod.POST)
	@ResponseBody
	public List<Map<String, Object>> createEncounterPatientProgram(@RequestBody Map<String, Object> encounterPatientProgramMap) {

		List<Map<String, Object>> encounterPatientProgramListMap = new ArrayList<>();
		if (encounterPatientProgramMap.get("encounters") != null) {
			for (Map<String, Object> encounterMap : (List<Map<String, Object>>) encounterPatientProgramMap.get("encounters")) {

				EncounterPatientProgram encounterPatientProgram = new EncounterPatientProgram();
				Encounter encounter = Context.getEncounterService().getEncounterByUuid(encounterMap.get("uuid").toString());
				encounterPatientProgram.setEncounter(encounter);

				if (encounterPatientProgramMap.get("patientProgram") != null) {

					PatientProgram patientProgram = Context.getProgramWorkflowService().getPatientProgramByUuid(((Map) encounterPatientProgramMap.get("patientProgram")).get("uuid").toString());
					encounterPatientProgram.setPatientProgram(patientProgram);
				}
				EncounterPatientProgram savedEncounterPatientProgram = storeService.saveEncounterPatientProgram(encounterPatientProgram);
				encounterPatientProgramListMap.add(savedEncounterPatientProgram.toMap());
			}
		}

		return encounterPatientProgramListMap;

	}
	
	@RequestMapping(value = "encounterpatientprogram/{patientProgramUuid}",method = RequestMethod.GET)
	@ResponseBody
	public List<Map<String, Object>> getEncountersByPatientProgram(@PathVariable("patientProgramUuid") String patientProgramUuid){

		List<Map<String,Object>> encountersListMap = new ArrayList<>();
		List<Encounter> encounters = iCareService.getEncountersByPatientProgram(patientProgramUuid);
		for( Encounter encounter : encounters){
			Map<String, Object> encounterMap = new HashMap<>();

			encounterMap.put("uuid", encounter.getUuid());

			Map<String, Object> patientMap = new HashMap<>();
			patientMap.put("uuid", encounter.getPatient().getUuid());
			patientMap.put("name", encounter.getPatient().getPerson().getPersonName().getFullName());
			encounterMap.put("patient",patientMap);

			Map<String, Object> encounterTypeMap = new HashMap<>();
			if(encounter.getEncounterType() != null) {
				encounterTypeMap.put("uuid", encounter.getEncounterType().getUuid());
				encounterTypeMap.put("name", encounter.getEncounterType().getName());
			}
			encounterMap.put("encounterType",encounterTypeMap);

			List<Map<String,Object>> obsMapList = new ArrayList<>();
			for(Obs obs : encounter.getObs()){
				Map<String, Object> obsMap = new HashMap<>();
				obsMap.put("uuid",obs.getUuid());
				obsMap.put("obsDatetime",obs.getObsDatetime().toString());
				Map<String, Object> conceptMap = new HashMap<>();
				conceptMap.put("uuid",obs.getConcept().getUuid());
				conceptMap.put("display",obs.getConcept().getDisplayString());
				obsMap.put("concept", conceptMap);
				if(obs.getValueNumeric() != null) {
					obsMap.put("valuenumeric", obs.getValueNumeric());
				}
				if(obs.getValueCoded() != null) {
					Map<String, Object> valueCodedMap = new HashMap<>();
					valueCodedMap.put("uuid",obs.getValueCoded().getUuid());
					valueCodedMap.put("display",obs.getValueCoded().getDisplayString());
					obsMap.put("value", valueCodedMap);
				}
				if(obs.getValueText() != null) {
					obsMap.put("valuetext", obs.getValueText());
				}
				obsMapList.add(obsMap);
			}
			encounterMap.put("obs",obsMapList);

			Map<String, Object> formMap = new HashMap<>();
			if(encounter.getForm() != null) {
				formMap.put("uuid", encounter.getForm().getUuid());
				formMap.put("name", encounter.getForm().getName());
			}
			encounterMap.put("form", formMap);

			if(encounter.getDateCreated() != null) {
				Date date = encounter.getDateCreated();
				DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ");
				encounterMap.put("created", dateFormat.format(date));
			}

			Map<String, Object> locationMap = new HashMap<>();
			if(encounter.getLocation() != null) {
				locationMap.put("uuid", encounter.getLocation().getUuid());
				locationMap.put("name", encounter.getLocation().getDisplayString());
			}
			encounterMap.put("location",locationMap);

			Map<String,Object> userMap = new HashMap<>();
			if(encounter.getCreator() != null) {
				userMap.put("uuid", encounter.getCreator().getUuid());
				userMap.put("name", encounter.getCreator().getDisplayString());
			}
			encounterMap.put("creator",userMap);

			encountersListMap.add(encounterMap);

		}
		return encountersListMap;

	}
	
	@RequestMapping(value = "encounters",method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> getPendingVisit(@RequestParam(defaultValue = "100") Integer limit,
											   @RequestParam(defaultValue = "0") Integer startIndex,
											   @RequestParam(required = false) String encounterTypeUuid,
											   @RequestParam(required = false) String q
	) {

		List<Encounter> encounters = iCareService.getEncountersByEncounterType(q, encounterTypeUuid, limit, startIndex);

		List<Map<String, Object>> responseSamplesObject = new ArrayList<Map<String, Object>>();
		for (Encounter encounter : encounters) {

			Map<String, Object> sampleObject = (new EncounterWrapper(encounter)).toMap();

			//add the sample after creating its object
			responseSamplesObject.add(sampleObject);
		}
		Map<String, Object> results = new HashMap<>();
		results.put("results", responseSamplesObject);
		return results;
	}
	
	@RequestMapping(value = "commonlyordereditems", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> getOrdersByVisit(@RequestParam(required = false) String orderTypeUuid,
												@RequestParam(required = false) String visitUuid,
												@RequestParam(required = false) String locationUuid,
												@RequestParam(defaultValue = "10") Integer limit,
												@RequestParam(defaultValue = "0") Integer startIndex,
												@RequestParam(required = false) Boolean isDrug) {

		List<Map<String, Object>> commonlyUsedItems = new ArrayList<>();
		List<Object[]> orderedItems = iCareService.getCommonlyOrderedItems(visitUuid, orderTypeUuid, limit, startIndex, isDrug);
		for (Object[] orderedItemsRowInfo: orderedItems) {
			Long count = Long.valueOf(orderedItemsRowInfo[1].toString());
			Drug drugDetails = new Drug();
			Concept orderedItemConcept = new Concept();
			if (isDrug == null || isDrug == true) {
				drugDetails = (Drug) orderedItemsRowInfo[0];
			} else {
				orderedItemConcept = (Concept)  orderedItemsRowInfo[0];
			}

			Map<String, Object> returnObj = new HashMap<>();
			Map<String, Object> orderedItemData = new HashMap<>();
			if (isDrug == null || isDrug == true) {
				orderedItemData.put("uuid", drugDetails.getUuid());
				orderedItemData.put("display", drugDetails.getDisplayName());
			} else {
				orderedItemData.put("uuid", orderedItemConcept.getUuid());
				orderedItemData.put("display", orderedItemConcept.getDisplayString());
			}

			Map<String, Object> concept = new HashMap<>();
			if (isDrug == null || isDrug == true) {
				concept.put("uuid", drugDetails.getConcept().getUuid());
				concept.put("display", drugDetails.getConcept().getDisplayString());
				orderedItemData.put("concept", concept);
			}
			List<Map<String, Object>> stockList = new ArrayList<>();
			if (locationUuid != null) {
				List<Stock> stockStatus;
				if (isDrug == null || isDrug == true) {
					stockStatus = storeService.getStockByDrugAndLocation(drugDetails.getUuid(),locationUuid);
				} else {
					stockStatus = storeService.getStockByDrugAndLocation(orderedItemConcept.getUuid(),locationUuid);
				}
				for(Stock stock: stockStatus) {
					stockList.add(stock.toMap());
				}
			}
			orderedItemData.put("stock", stockList);
			returnObj.put("drug", orderedItemData);
			returnObj.put("count",count);
			commonlyUsedItems.add(returnObj);
		}
		Map<String, Object> results = new HashMap<>();
		results.put("results", commonlyUsedItems);
		return results;
	}
	
	// EnvayaSMS implementation starts
	
	@RequestMapping(value = "envayasms/handle-actions", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> handleRequest(
         @RequestParam(value = "action") String action,
		 @RequestParam(value = "from", required = false) String from,
		 @RequestParam(value = "messageContent", required = false) String messageContent,
		 @RequestParam(value = "messageType", required = false) String messageType
	)throws Exception{
		Map<String, Object> response = new HashMap<>();
        //AdministrationService administrationService = Context.getAdministrationService();
		if (ICareConfig.ACTION_INCOMING.equals(action)) {
			iCareService.processIncomingMessage(from, messageContent, messageType);
			System.out.println("Processed successfully");
		}
		else if (ICareConfig.ACTION_OUTGOING.equals(action)) {
			return iCareService.handleOutgoingsms();
		}
		else{
           response.put("Error", iCareService.error());
		}

       return response;
	}
	
	@RequestMapping(value = "envayasms/outgoing-message", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public String insertOutgoingMessages(@RequestBody Map<String, Object> messagePayload) throws Exception {
		List<String> recipients = (List<String>) messagePayload.get("recipients");
		String message = (String) messagePayload.get("message");
		
		if (recipients == null || recipients.isEmpty()) {
			throw new IllegalArgumentException("Recipients list cannot be null or empty");
		}
		
		String response = null;
		for (String recipient : recipients) {
			try {
				response = iCareService.insertOutgoingMessages(recipient, message);
			}
			catch (Exception e) {
				throw new RuntimeException("Error saving message for " + recipient + ": " + e.getMessage());
			}
		}
		return response;
	}
	
	//EnvayaSMS implementation ends 
	@RequestMapping(value = "nondrugorderbillanddispensing", method = RequestMethod.POST,consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Map<String, Object> dispenseAndCreateBillForNonDrug(@RequestBody Map<String, Object> nonDrugObject) throws Exception {
		Double quantity;
		String locationUuid;
		String remarks = "";
		String orderUuid;
		Order savedOrder;
		if (nonDrugObject.get("order") == null) {
			throw new Exception("Order is not set");
		} else {
			orderUuid = nonDrugObject.get("order").toString();
		}
		if (nonDrugObject.get("quantity") == null) {
			throw new Exception("Quantity is not set");
		} else {
			quantity = ((Integer) nonDrugObject.get("quantity")).doubleValue();
		}
		if (nonDrugObject.get("location") == null) {
			throw new Exception("Location is not set");
		} else {
			locationUuid = nonDrugObject.get("location").toString();
		}
		savedOrder = orderService.getOrderByUuid(orderUuid);
		ItemPrice itemPrice = Context.getService(ICareService.class).getItemPriceByConceptAndVisit(savedOrder.getEncounter().getVisit(), savedOrder.getConcept());
		if (itemPrice == null) {
			throw new ItemNotPayableException(savedOrder.getConcept().getName() + " is not a billable item.");
		}
		OrderStatus orderStatus = new OrderStatus();
		Double price = itemPrice.getPrice();
		itemPrice.setPrice(price*quantity);
		OrderMetaData<Order> orderMetaData = new OrderMetaData();
		orderMetaData.setItemPrice(itemPrice);
		orderMetaData.setOrder(savedOrder);
		billingService.processOrder(orderMetaData, quantity);
		orderStatus = storeService.dispenseNonDrug(savedOrder, quantity, locationUuid, remarks );
		Map<String, Object> orderResponse = new HashMap<>();
		orderResponse.put("uuid", savedOrder.getUuid());
		orderResponse.put("orderStockStatus", orderStatus.getStatus().toString());
		orderResponse.put("orderNumber", savedOrder.getOrderNumber());
		return orderResponse;
	}
	
	@RequestMapping(value = "nondrugorderwithdispensing", method = RequestMethod.POST,consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Map<String, Object> createNonDrugOrder(@RequestBody Map<String, Object> nonDrugOrder) throws Exception{
		// TODO: This has issues with creating order. Review is necessary
		Order order = new Order();
		Map<String, Object> orderObject = (Map<String, Object>) nonDrugOrder.get("order");
		OrderService orderService = Context.getOrderService();
		EncounterService encounterService = Context.getEncounterService();
		ConceptService conceptService = Context.getConceptService();
		PatientService patientService = Context.getPatientService();
		ProviderService providerService = Context.getProviderService();
		Encounter encounter = encounterService.getEncounterByUuid(orderObject.get("encounter").toString());
		OrderType orderType = orderService.getOrderTypeByUuid(orderObject.get("orderType").toString());
		Patient patient = patientService.getPatientByUuid(orderObject.get("patient").toString());
		Concept concept = conceptService.getConceptByUuid(orderObject.get("concept").toString());
		Provider orderer = providerService.getProviderByUuid(orderObject.get("orderer").toString());
		OrderContext orderContext = new OrderContext();
		order.setOrderType(orderType);
		order.setEncounter(encounter);
		order.setPatient(patient);
		CareSetting careSetting = new CareSetting();
		if (orderObject.get("careSetting").toString().toLowerCase().equals("outpatient")) {
			careSetting.setCareSettingType(CareSetting.CareSettingType.OUTPATIENT);
			orderContext.setCareSetting(careSetting);
		} else {
			careSetting.setCareSettingType(CareSetting.CareSettingType.INPATIENT);
			orderContext.setCareSetting(careSetting);
		}
		order.setConcept(concept);
		order.setOrderer(orderer);
		order.setUrgency(Order.Urgency.valueOf((String) orderObject.get("urgency")));
		order.setAction(Order.Action.valueOf((String) orderObject.get("action")));
		OrderStatus orderStatus = new OrderStatus();
		Order savedOrder = new Order();
		if (order != null) {
			savedOrder = orderService.saveOrder(order, orderContext);
			Double quantity;
			String locationUuid;
			String remarks = "";
			if (nonDrugOrder.get("quantity") == null) {
				throw new Exception("Quantity is not set");
			} else {
				quantity = ((Integer) nonDrugOrder.get("quantity")).doubleValue();
			}
			if (nonDrugOrder.get("location") == null) {
				throw new Exception("Location is not set");
			} else {
				locationUuid = nonDrugOrder.get("location").toString();
			}
			ItemPrice itemPrice = Context.getService(ICareService.class).getItemPriceByConceptAndVisit(savedOrder.getEncounter().getVisit(), savedOrder.getConcept());
			if (itemPrice == null) {
				throw new ItemNotPayableException(order.getConcept().getName() + " is not a billable item.");
			}
			//Set the metadata
			Double price = itemPrice.getPrice();
			itemPrice.setPrice(price*quantity);
			OrderMetaData<Order> orderMetaData = new OrderMetaData();
			orderMetaData.setItemPrice(itemPrice);
			orderMetaData.setOrder(savedOrder);
			billingService.processOrder(orderMetaData, quantity);
			orderStatus = storeService.dispenseNonDrug(savedOrder, quantity, locationUuid, remarks );
		}

		Map<String, Object> orderResponse = new HashMap<>();
		orderResponse.put("uuid", savedOrder.getUuid());
		orderResponse.put("orderStockStatus", orderStatus.getStatus().toString());
		orderResponse.put("orderNumber", savedOrder.getOrderNumber());
		return orderResponse;
	}
	
	@RequestMapping(value = "generatehduapidatatemplate", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Map<String, Object> onPGenerateReportForHDUAPI(@RequestBody Map<String, Object> visitParameters) throws Exception {
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
		Date startDate = formatter.parse(visitParameters.get("startDate").toString());
		Date endDate = formatter.parse(visitParameters.get("endDate").toString());
		Map<String, Object> response = iCareService.generateVisitsData(startDate, endDate,
		    (Boolean) visitParameters.get("sendToExternal"));
		return response;
	}
}
