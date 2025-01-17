package org.openmrs.module.icare.core.utils;

import org.openmrs.*;
import org.openmrs.api.AdministrationService;
import org.openmrs.api.VisitService;
import org.openmrs.api.context.Context;
import org.openmrs.attribute.Attribute;
import org.openmrs.attribute.AttributeType;
import org.openmrs.module.icare.ICareConfig;
import org.openmrs.module.icare.billing.VisitInvalidException;
import org.openmrs.module.icare.billing.services.insurance.ClaimStatus;
import org.openmrs.module.icare.billing.services.insurance.jubilee.JubileeInsuranceImpl;
import org.openmrs.module.icare.billing.services.insurance.InsuranceService;
import org.openmrs.module.icare.billing.services.insurance.nhif.NHIFServiceImpl;
import org.openmrs.module.icare.billing.services.insurance.startegies.StrategiesInsuranceImpl;

import javax.naming.ConfigurationException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class VisitWrapper {
	
	Visit visit;
	
	public VisitWrapper(Visit visit) {
		this.visit = visit;
	}
	
	public String getServiceConceptUuid() throws ConfigurationException {
		return this.getAttribute(ICareConfig.SERVICE_ATTRIBUTE);
	}
	
	public Concept getServiceConcept() throws ConfigurationException {
		return Context.getConceptService().getConceptByUuid(getServiceConceptUuid());
	}
	
	public Concept getInsuranceConcept() throws ConfigurationException {
		return Context.getConceptService().getConceptByUuid(getInsuranceConceptUuid());
	}
	
	public String getPaymentSchemeUuid() throws ConfigurationException {
		return this.getAttribute(ICareConfig.PAYMENT_SCHEME_ATTRIBUTE);
	}
	
	public Concept getPaymentScheme() throws ConfigurationException {
		String paymentSchemeUuid = getPaymentSchemeUuid();
		return Context.getConceptService().getConceptByUuid(paymentSchemeUuid);
	}
	
	public void setPaymentSchemeUuid(String uuid) throws ConfigurationException {
		this.setAttribute(ICareConfig.PAYMENT_SCHEME_ATTRIBUTE, uuid);
	}
	
	public Concept getPaymentType() throws ConfigurationException {
		return Context.getConceptService().getConceptByUuid(getPaymentTypeUuid());
	}
	
	public String getPaymentTypeUuid() throws ConfigurationException {
		String paymentTypeAttribute = this.getAttribute(ICareConfig.PAYMENT_TYPE_ATTRIBUTE);
		if (paymentTypeAttribute == null) {
			return null;
		}
		Concept paymentTypeConcept = Context.getConceptService().getConceptByUuid(paymentTypeAttribute);
		if (paymentTypeConcept.getName().getName().toLowerCase().equals("insurance")) {
			return getInsuranceConcept().getUuid();
		} else {
			return paymentTypeConcept.getUuid();
		}
	}
	
	public String getInsuranceConceptUuid() throws ConfigurationException {
		return this.getAttribute(ICareConfig.INSURANCE_ATTRIBUTE);
	}
	
	public String getInsuranceName() throws ConfigurationException {
		Concept concept = getInsuranceConcept();
		return concept.getName().getName();
	}
	
	public String getInsuranceID() throws ConfigurationException {
		return this.getAttribute(ICareConfig.INSURANCE_ID_ATTRIBUTE);
	}
	
	public String getInsuranceAuthorizationNumber() throws ConfigurationException {
		return this.getAttribute(ICareConfig.INSURANCE_AUTHORIZATION_ATTRIBUTE);
	}
	
	public String getInsuranceReferralNumber() throws ConfigurationException {
		return this.getAttribute(ICareConfig.INSURANCE_REFERRAL_NUMBER);
	}
	
	public String getInsuranceClaimStatus() throws ConfigurationException {
		return this.getAttribute(ICareConfig.INSURANCE_CLAIM_STATUS);
	}
	
	private String getAttribute(String attributeConfig) throws ConfigurationException {
		String attributeValue = null;
		AdministrationService adminService = Context.getService(AdministrationService.class);
		String insuranceAttributeUuid = adminService.getGlobalProperty(attributeConfig);
		if (insuranceAttributeUuid == null) {
			throw new ConfigurationException("Attribute ID is configured. Please set '" + attributeConfig + "'");
		}
		VisitService visitService = Context.getService(VisitService.class);
		List<VisitAttributeType> visitAttributeTypes = visitService.getAllVisitAttributeTypes();
		for (VisitAttribute attribute : this.visit.getAttributes()) {
			AttributeType attributeType = attribute.getAttributeType();
			for (VisitAttributeType visitAttributeType : visitAttributeTypes) {
				if (visitAttributeType.getUuid().equals(attributeType.getUuid())) {
					if (visitAttributeType.getUuid().equals(insuranceAttributeUuid)) { //CASH OR Insurance
						attributeValue = (String) attribute.getValue();
					}
				}
			}
		}
		return attributeValue;
	}
	
	private void setAttribute(String attributeConfig, String value) throws ConfigurationException {
		AdministrationService adminService = Context.getService(AdministrationService.class);
		String insuranceAttributeUuid = adminService.getGlobalProperty(attributeConfig);
		if (insuranceAttributeUuid == null) {
			throw new ConfigurationException("Attribute ID is configured. Please set '" + attributeConfig + "'");
		}
		VisitService visitService = Context.getService(VisitService.class);
		
		String attribute = this.getAttribute(attributeConfig);
		if (attribute == null) {
			VisitAttribute insuranceAuthorizationNumberAttribute = new VisitAttribute();
			insuranceAuthorizationNumberAttribute.setAttributeType(visitService
			        .getVisitAttributeTypeByUuid(insuranceAttributeUuid));
			insuranceAuthorizationNumberAttribute.setValue(value);
			insuranceAuthorizationNumberAttribute.setValueReferenceInternal(visit.getUuid());
			this.visit.addAttribute(insuranceAuthorizationNumberAttribute);
		}
	}
	
	public String getSignature() throws ConfigurationException {
		String signature = this.getAttribute(ICareConfig.PATIENT_SIGNATURE_ATTRIBUTE);
		if (signature != null) {
			System.out.println("Signature Found:" + signature);
			return signature;
		} else {
			return "";
		}
	}
	
	public String getUuid() {
		return this.getUuid();
	}
	
	public Visit getVisit() {
		return this.visit;
	}
	
	public ProviderWrapper getConsultationProvider() throws ConfigurationException {
		ProviderWrapper providerWrapper = null;
		AdministrationService adminService = Context.getService(AdministrationService.class);
		String consultationEncounter = adminService.getGlobalProperty(ICareConfig.CONSULTATION_ENCOUNTER_TYPE);
		if (consultationEncounter == null) {
			throw new ConfigurationException("Consultation encounter type is not configured. Please check "
			        + ICareConfig.CONSULTATION_ENCOUNTER_TYPE + ".");
		}
		for (Encounter encounter : visit.getEncounters()) {
			
			if (encounter.getEncounterType().getUuid().equals(consultationEncounter)) {
				if (encounter.getEncounterProviders().size() > 0) {
					EncounterProvider encounterProvider = (EncounterProvider) encounter.getEncounterProviders().toArray()[0];
					providerWrapper = new ProviderWrapper(encounterProvider.getProvider());
				}
			}
		}
		return providerWrapper;
	}
	
	public PatientWrapper getPatient() throws ConfigurationException {
		return new PatientWrapper(this.visit.getPatient());
	}
	
	public void setInsuranceAuthorizationNumber(String authorizationNumber) throws ConfigurationException {
		this.setAttribute(ICareConfig.INSURANCE_AUTHORIZATION_ATTRIBUTE, authorizationNumber);
	}
	
	public void setInsuranceClaimStatus(ClaimStatus status) throws ConfigurationException {
		this.setAttribute(ICareConfig.INSURANCE_CLAIM_STATUS, status.toString());
	}
	
	public List<String> getPreliminaryDiagnosis(){
		List<String> preliminaryDiagnosis = new ArrayList<>();
		for (Encounter encounter : visit.getEncounters()) {
			if (encounter.getDiagnoses() != null) {
				for (Diagnosis diagnosis : encounter.getDiagnoses()) {
					if (diagnosis.getCertainty() == ConditionVerificationStatus.PROVISIONAL) {
						if(diagnosis.getDiagnosis().getSpecificName() != null){
							preliminaryDiagnosis.add(diagnosis.getDiagnosis().getSpecificName().getName());
						}else{
							preliminaryDiagnosis.add(diagnosis.getDiagnosis().getCoded().getName().getName());
						}
					}
				}
			}
		}
		return preliminaryDiagnosis;
	}
	
	public String getPreliminaryDiagnosisString() {
		String preliminaryDiagnosis = "";
		for (String diagnosis : getPreliminaryDiagnosis()) {
			if (!preliminaryDiagnosis.equals("")) {
				preliminaryDiagnosis += ", ";
			}
			preliminaryDiagnosis += diagnosis + " ";
		}
		return preliminaryDiagnosis;
	}
	
	public List<String> getFinalDiagnosis(){
		List<String> preliminaryDiagnosis = new ArrayList<>();
		for (Encounter encounter : visit.getEncounters()) {
			if (encounter.getDiagnoses() != null) {
				for (Diagnosis diagnosis : encounter.getDiagnoses()) {
					if (diagnosis.getCertainty() == ConditionVerificationStatus.CONFIRMED) {
						if(diagnosis.getDiagnosis().getSpecificName() != null){
							preliminaryDiagnosis.add(diagnosis.getDiagnosis().getSpecificName().getName());
						}else{
							preliminaryDiagnosis.add(diagnosis.getDiagnosis().getCoded().getName().getName());
						}
					}
				}
			}
		}
		return preliminaryDiagnosis;
	}
	
	public String getFinalDiagnosisString() {
		String preliminaryDiagnosis = "";
		for (String diagnosis : getFinalDiagnosis()) {
			if (!preliminaryDiagnosis.equals("")) {
				preliminaryDiagnosis += ", ";
			}
			preliminaryDiagnosis += diagnosis + " ";
		}
		return preliminaryDiagnosis;
	}
	
	public boolean isInsurance() throws ConfigurationException {
		String paymentTypeAttribute = this.getAttribute(ICareConfig.PAYMENT_TYPE_ATTRIBUTE);
		if (paymentTypeAttribute == null) {
			return false;
		}
		Concept paymentTypeConcept = Context.getConceptService().getConceptByUuid(paymentTypeAttribute);
		if (paymentTypeConcept.getName().getName().toLowerCase().equals("insurance")) {
			return true;
		} else {
			return false;
		}
	}
	
	public InsuranceService getInsuranceService() throws ConfigurationException {
		Concept insuranceConcept = this.getInsuranceConcept();
		if (insuranceConcept == null) {
			throw new VisitInvalidException("Insurance Concept '" + this.getInsuranceConceptUuid() + "' does not exist.");
		}
		InsuranceService insuranceService = null;
		
		try {
			insuranceService = Context.getService(InsuranceService.class);
		}
		catch (Exception e) {}
		if (insuranceService == null) {
			insuranceService = InsuranceService.getInsuranceInstance(this.getInsuranceName());
		}
		return insuranceService;
	}
	
	public Map<String, Object> toMap() {
		Map<String, Object> visitMap = new HashMap<>();
		visitMap.put("uuid",visit.getUuid());
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ");

		visitMap.put("startDatetime", dateFormat.format(visit.getStartDatetime()));
		visitMap.put("stopDatetime", null);
		visitMap.put("patient", (new PatientWrapper(visit.getPatient())).toMap());

		List<Map<String, Object>> attributesMap = new ArrayList<>();
		for(VisitAttribute attribute:visit.getAttributes()){
			Map<String, Object> attributeMap = new HashMap<>();
			attributeMap.put("uuid", attribute.getUuid());
			attributeMap.put("display", attribute.getValue());
			attributesMap.add(attributeMap);
		}
		visitMap.put("attributes", attributesMap);

		Map<String,Object> locationMap = new HashMap<>();
		List<Map<String,Object>> locationTagsMap = new ArrayList();
		Location location = visit.getLocation();
		if(location != null){
			locationMap.put("uuid", location.getUuid());
			locationMap.put("display", location.getDisplayString());
			for(LocationTag locationTag:location.getTags()){
				Map<String,Object> locationTagMap = new HashMap<>();
				locationTagMap.put("uuid", locationTag.getUuid());
				locationTagMap.put("display", locationTag.getName());
				locationTagsMap.add(locationTagMap);
			}
			Location parentLocation = location.getParentLocation();
			if(parentLocation != null){
				Map<String,Object> parentLocationMap = new HashMap<>();
				parentLocationMap.put("uuid", parentLocation.getUuid());
				parentLocationMap.put("display", parentLocation.getDisplayString());
				locationMap.put("parentLocation", parentLocationMap);
			}
		}
		locationMap.put("tags", locationTagsMap);
		visitMap.put("location", locationMap);

		List<Map<String,Object>> encountersMap = new ArrayList<>();
		for(Encounter encounter:visit.getEncounters()){
			Map<String,Object> encounterMap = new HashMap<>();
			encounterMap.put("uuid",encounter.getUuid());
			encounterMap.put("id",encounter.getEncounterId());
			encounterMap.put("encounterDateTime",encounter.getEncounterDatetime());
			encounterMap.put("voidedReason",encounter.getVoidReason());
			encounterMap.put("voided",encounter.getVoided());
			encounterMap.put("dateVoided",encounter.getDateVoided());
			encounterMap.put("createdOn",encounter.getDateCreated());
			encounterMap.put("changedOn",encounter.getDateChanged());

			List<Map<String,Object>> encountersOrdersMap = new ArrayList<>();
			for (Order order: encounter.getOrders()){
				Map<String,Object> encounterOrdersMap = new HashMap<>();
				encounterOrdersMap.put("uuid",order.getUuid());
				encounterOrdersMap.put("id",order.getId());
				encounterOrdersMap.put("voided",order.getVoided());
				encounterOrdersMap.put("voidedReason",order.getVoidReason());
				encountersOrdersMap.add(encounterOrdersMap);
			}
			encounterMap.put("orders",encountersOrdersMap);


			//encounterMap.put("diagnoses",encounter.getDiagnoses());

			encountersMap.add(encounterMap);
		}
		visitMap.put("encounters",encountersMap);

		return visitMap;
	}
	
	public enum OrderBy {
		VISIT, ENCOUNTER, ORDER, OBSERVATION;
	}
	
	public enum OrderByDirection {
		ASC, DESC;
	}
	
	public enum PaymentStatus {
		PAID, PENDING;
	}
}
