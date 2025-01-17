package org.openmrs.module.icare.billing.services.insurance.nhif;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.openmrs.api.AdministrationService;
import org.openmrs.api.context.Context;
import org.openmrs.module.icare.core.utils.VisitWrapper;

import javax.naming.ConfigurationException;

public class Referral {
	
	@JsonProperty("CardNo")
	public String cardNo;
	
	@JsonProperty("AuthorizationNo")
	public String authorizationNo;
	
	@JsonProperty("PatientFullName")
	public String patientFullName;
	
	@JsonProperty("PhysicianMobileNo")
	public String physicianMobileNo;
	
	@JsonProperty("Gender")
	public String gender;
	
	@JsonProperty("PhysicianName")
	public String physicianName;
	
	@JsonProperty("PhysicianQualificationID")
	public int physicianQualificationID;
	
	@JsonProperty("ServiceIssuingFacilityCode")
	public String serviceIssuingFacilityCode;
	
	@JsonProperty("ReferringDiagnosis")
	public String referringDiagnosis;
	
	@JsonProperty("ReasonsForReferral")
	public String reasonsForReferral;
	
	public static Referral fromVisit(VisitWrapper visitWrapper) throws ConfigurationException {
		Referral referral = new Referral();
		referral.cardNo = visitWrapper.getInsuranceID();
		referral.authorizationNo = visitWrapper.getInsuranceAuthorizationNumber();
		referral.patientFullName = visitWrapper.getPatient().getFullName();
		referral.physicianMobileNo = visitWrapper.getConsultationProvider().getPhoneNumber();
		referral.gender = visitWrapper.getPatient().getPatient().getGender();
		referral.physicianName = visitWrapper.getConsultationProvider().getProvider().getName();
		//TODO set Qualification ID
		//referral.physicianQualificationID
		AdministrationService adminService = Context.getService(AdministrationService.class);
		String facilityCode = adminService.getGlobalProperty(NHIFConfig.FACILITY_CODE);
		if (facilityCode == null) {
			throw new ConfigurationException("Facility code is not configured. Please check " + NHIFConfig.FACILITY_CODE
			        + ".");
		}
		referral.serviceIssuingFacilityCode = facilityCode;
		referral.referringDiagnosis = visitWrapper.getFinalDiagnosisString();
		referral.reasonsForReferral = "Reason";
		return referral;
	}
}
