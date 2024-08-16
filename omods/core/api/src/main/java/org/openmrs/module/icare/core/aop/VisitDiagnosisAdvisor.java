package org.openmrs.module.icare.core.aop;

import org.aopalliance.aop.Advice;
import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.JSONArray;
import org.json.JSONObject;
import org.openmrs.Diagnosis;
import org.openmrs.GlobalProperty;
import org.openmrs.PatientIdentifier;
import org.openmrs.api.AdministrationService;
import org.openmrs.api.context.Context;
import org.openmrs.module.icare.ICareConfig;
import org.openmrs.module.icare.core.ICareService;
import org.openmrs.module.icare.core.utils.Dhis2EventWrapper;
import org.openmrs.module.icare.core.utils.EidsrWrapper;
import org.springframework.aop.Advisor;
import org.springframework.aop.support.StaticMethodMatcherPointcutAdvisor;

import java.lang.reflect.Method;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class VisitDiagnosisAdvisor extends StaticMethodMatcherPointcutAdvisor implements Advisor {
	
	protected final Log log = LogFactory.getLog(getClass());
	
	@Override
	public boolean matches(Method method, Class<?> aClass) {
		log.info("ICareAdvice Matching:" + method.getName());
		if (method.getName().equals("saveDiagnosis")) {
			return true;
		} else if (method.getName().equals("save")) {
			return true;
		}
		return false;
	}
	
	@Override
	public Advice getAdvice() {
		log.debug("Getting Diagnosis Advice");
		return new VisitDiagnosisAdvice();
	}
	
	private class VisitDiagnosisAdvice implements MethodInterceptor {
		
		public Object invoke(MethodInvocation invocation) throws Throwable {
            log.debug("Checking the method of the invoke. Method:: " + invocation.getMethod().getName() + ".");

            if (invocation.getArguments()[0] instanceof Diagnosis) {
				Diagnosis diagnosis = (Diagnosis) invocation.getArguments()[0];
				Dhis2EventWrapper dhis2EventWrapper = new Dhis2EventWrapper();
				String shouldCaptureDiagnosis =  dhis2EventWrapper.getGlobalPropertyValueByKey(ICareConfig.SURVEILLANCE_CAPTURE_DIAGNOSIS_DATA);
				String icdCodeReferences = dhis2EventWrapper.getGlobalPropertyValueByKey(ICareConfig.SURVEILLANCE_DIAGNOSES_CODES_REFERENCE);
				JSONArray codesReferenceArray = new JSONArray();
				if (icdCodeReferences != null && icdCodeReferences !=null) {
					codesReferenceArray = new JSONArray(icdCodeReferences);
				}
                if (diagnosis.getDateCreated() == null && shouldCaptureDiagnosis.equals("true") && codesReferenceArray.length() > 0) {
						// Logics to push data to external system
						Date todayDate = new Date();
						String diagnosisName = diagnosis.getDiagnosis().getCoded().getDisplayString();
						String icdCode = "";
						Matcher matches = Pattern.compile("\\((.*?)\\)").matcher(diagnosisName);
						while (matches.find()) {
							icdCode = matches.group(1).toString().trim();
						}
						Boolean isCodeAmongDefinedCodes = false;
						for (int count = 0; count < codesReferenceArray.length(); count++) {
							String code = codesReferenceArray.getString(count);
							if (code.equals(icdCode)) {
								isCodeAmongDefinedCodes = true;
							}
						}
						if (isCodeAmongDefinedCodes) {
							Map<String, Object> capturedEventData = new HashMap<>();
							String patientIdentifier = "";
							for (PatientIdentifier identifier: diagnosis.getPatient().getIdentifiers()) {
								if (identifier.getPreferred().booleanValue() == true) {
									patientIdentifier = identifier.getIdentifier().toString();
								}
							}
							capturedEventData.put("identifier", patientIdentifier);
							capturedEventData.put("gender",diagnosis.getPatient().getGender().toString());
							capturedEventData.put("reportingDate",dhis2EventWrapper.formatDateToYYYYMMDD(todayDate));
							capturedEventData.put("eventDate",dhis2EventWrapper.formatDateToYYYYMMDD(todayDate));
							capturedEventData.put("visitNumber",diagnosis.getEncounter().getVisit().getVisitId());
							if (diagnosis.getPatient().getPerson().getDead().booleanValue() == true ) {
								capturedEventData.put("isPatientAlive", "No");
							} else {
								capturedEventData.put("isPatientAlive", "Yes");
							}

							capturedEventData.put("dob",dhis2EventWrapper.formatDateToYYYYMMDD(diagnosis.getPatient().getPerson().getBirthdate()));
							capturedEventData.put("firstName",diagnosis.getPatient().getGivenName().toString());
							capturedEventData.put("certainty", diagnosis.getCertainty().toString());
							capturedEventData.put("surname",diagnosis.getPatient().getFamilyName().toString());
							capturedEventData.put("diagnosis", diagnosisName);
							capturedEventData.put("diseaseCode", icdCode);
							String facilityCode = dhis2EventWrapper.getHFRCode();
							capturedEventData.put("facilityCode", facilityCode);
							ICareService iCareService = Context.getService(ICareService.class);
							AdministrationService adminService = Context.getService(AdministrationService.class);
							String mediatorsConfigs = adminService.getGlobalProperty(ICareConfig.INTEROPERABILITY_MEDIATORS_LIST);
							JSONArray mediatorsList = new JSONArray(mediatorsConfigs);
							for (int count = 0; count < mediatorsList.length(); count++) {
								JSONObject mediator = mediatorsList.getJSONObject(count);
								if (mediator.has("isActive") && mediator.getBoolean("isActive")) {
									if (mediator.has("mediatorKey") && mediator.getString("mediatorKey").equals("HDUAPI")) {
										// For HDU API
										Map<String, Object> dataTemplateData = new HashMap<>();
										String workflowUuid = adminService.getGlobalProperty(ICareConfig.HDU_API_WORKFLOW_UUID_FOR_OPD);
										Map<String, Object> templateDetails = new HashMap<>();
										Map<String, Object> workflow = new HashMap<>();
										workflow.put("uuid", workflowUuid);
										templateDetails.put("id", "general");
										templateDetails.put("code", "GENERAL");
										templateDetails.put("name", "General");
										templateDetails.put("workflow", workflow);

										// Formulate HDU API data template
										List<Map<String, Object>> listGrid = new ArrayList<>();
										Map<String, Object> reportDetails = new HashMap<>();
										reportDetails.put("reportingDate", capturedEventData.get("reportingDate"));

										Map<String, Object> facilityDetails = new HashMap<>();
										facilityDetails.put("HFCode", capturedEventData.get("facilityCode"));

										Map<String, Object> demographicDetails = new HashMap<>();
										demographicDetails.put("dateOfBirth",capturedEventData.get("dob"));
										demographicDetails.put("firstName", capturedEventData.get("firstName"));
										demographicDetails.put("middleName", "");
										demographicDetails.put("lastName", capturedEventData.get("surname"));
										demographicDetails.put("gender", capturedEventData.get("gender"));
										demographicDetails.put("mrn", capturedEventData.get("identifier"));
										demographicDetails.put("identifier", capturedEventData.get("identifier"));

										Map<String, Object> visitDetails = new HashMap<>();
										visitDetails.put("visitId", capturedEventData.get("visitNumber"));
										visitDetails.put("visitDate", capturedEventData.get("eventDate"));

										List<Map<String, Object>> diagnosisDetails = new ArrayList<>();
										Map<String, Object> diagnosisData = new HashMap<>();
										diagnosisData.put("diagnosisCode", capturedEventData.get("diseaseCode"));
										diagnosisData.put("diagnosisDate", capturedEventData.get("eventDate"));
										diagnosisData.put("certainty", capturedEventData.get("certainty"));
										diagnosisData.put("diagnosisDescription", capturedEventData.get("certainty"));
										diagnosisDetails.add(diagnosisData);

										Map<String, Object> listGridItem = new HashMap<>();
										listGridItem.put("visitDetails", visitDetails);
										listGridItem.put("demographicDetails", demographicDetails);
										listGridItem.put("diagnosisDetails", diagnosisDetails);
										listGrid.add(listGridItem);

										Map<String, Object> dataSection = new HashMap<>();
										dataSection.put("reportDetails", reportDetails);
										dataSection.put("facilityDetails", facilityDetails);
										dataSection.put("listGrid", listGrid);
										dataTemplateData.put("templateDetails", templateDetails);
										dataTemplateData.put("data",dataSection);

										String mediatorMappingReferenceKey = mediator.getString("mediatorMappingReferenceKey");
										String mediatorKey = mediator.getString("mediatorKey");
										String mediatorUrlPath = mediator.getString("mediatorUrlPath");
										String authenticationType = mediator.getString("authenticationType");
										String mappings = adminService.getGlobalProperty(mediatorMappingReferenceKey);

										if (mediatorUrlPath != null && mappings != null) {
											EidsrWrapper eidsrWrapper = new EidsrWrapper();
											Map<String, Object> data = eidsrWrapper.formatData(mappings,capturedEventData);

											if (new JSONObject(templateDetails).toString() != null) {
												String response = iCareService.pushDataToExternalMediator(new JSONObject(dataTemplateData).toString(),mediatorKey,mediatorUrlPath,authenticationType);
//												GlobalProperty globalProperty2 = new GlobalProperty();
//												globalProperty2.setProperty("HDUAPI.test.response");
//												globalProperty2.setPropertyValue(response);
//												adminService.saveGlobalProperty(globalProperty2);
											}
										}
									} else if (mediator.has("mediatorKey") && mediator.getString("mediatorKey").equals("dhis2")) {
										String mappings = adminService.getGlobalProperty(ICareConfig.SURVEILLANCE_SINGLE_EVENT_PROGRAM_MAPPINGS);
										Map<String, Object> event = new HashMap<>();
										event.put("orgUnit", facilityCode);
										event.put("programStage", dhis2EventWrapper.getEventProgramStage());
										event.put("program", dhis2EventWrapper.getEventProgram());
										event.put("occurredAt", dhis2EventWrapper.formatDateToYYYYMMDD(todayDate));
										event.put("dataValues", dhis2EventWrapper.formulateDataValuesObject(capturedEventData,mappings));
										//			eventData.put("residence",diagnosis.getPatient().getAddresses());
										Map<String, Object> eventsPayload = new HashMap<>();
										List<Map<String, Object>> events = new ArrayList<>();
										events.add(event);
										eventsPayload.put("events", events);

										String response = iCareService.pushEventWithoutRegistrationDataToDHIS2Instance(new JSONObject(eventsPayload).toString());

										GlobalProperty globalProperty = new GlobalProperty();
										globalProperty.setProperty("surveillance.test.dhis");
										globalProperty.setPropertyValue(response);
										adminService.saveGlobalProperty(globalProperty);
									} else if (mediator.has("mediatorKey") && mediator.getString("mediatorKey").equals("eidsr") && mediator.has("mediatorMappingReferenceKey") && mediator.has("mediatorUrlPath")) {

										String mediatorMappingReferenceKey = mediator.getString("mediatorMappingReferenceKey");
										String mediatorKey = mediator.getString("mediatorKey");
										String mediatorUrlPath = mediator.getString("mediatorUrlPath");
										String authenticationType = mediator.getString("authenticationType");
										String mappings = adminService.getGlobalProperty(mediatorMappingReferenceKey);

										if (mediatorUrlPath != null && mappings != null) {
											EidsrWrapper eidsrWrapper = new EidsrWrapper();
											Map<String, Object> data = eidsrWrapper.formatData(mappings,capturedEventData);

											if (new JSONObject(data).toString() != null) {
												String response = iCareService.pushDataToExternalMediator(new JSONObject(data).toString(),mediatorKey,mediatorUrlPath,authenticationType);
												GlobalProperty globalProperty2 = new GlobalProperty();
												globalProperty2.setProperty("surveillance.test.eidsrMediator.response");
												globalProperty2.setPropertyValue(response);
												adminService.saveGlobalProperty(globalProperty2);
											}
										}
									}
								}
							}

						}
					}
				}
            return invocation.proceed();
        }
	}
}
