package org.openmrs.module.icare.billing.services.insurance.startegies;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.itextpdf.text.DocumentException;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.openmrs.*;
import org.openmrs.api.AdministrationService;
import org.openmrs.api.ConceptNameType;
import org.openmrs.api.ConceptService;
import org.openmrs.api.context.Context;
import org.openmrs.module.icare.ICareConfig;
import org.openmrs.module.icare.billing.services.insurance.*;
import org.openmrs.module.icare.billing.services.insurance.nhif.*;
import org.openmrs.module.icare.billing.services.insurance.nhif.claim.Folio;
import org.openmrs.module.icare.billing.services.insurance.nhif.claim.FolioDisease;
import org.openmrs.module.icare.billing.services.insurance.nhif.claim.FolioEntities;
import org.openmrs.module.icare.billing.services.insurance.nhif.claim.FolioItem;
import org.openmrs.module.icare.core.ICareService;
import org.openmrs.module.icare.core.utils.PatientWrapper;
import org.openmrs.module.icare.core.utils.ProviderWrapper;
import org.openmrs.module.icare.core.utils.VisitWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.*;
import java.net.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

public class StrategiesInsuranceImpl implements InsuranceService {
	
	private static final Logger log = LoggerFactory.getLogger(StrategiesInsuranceImpl.class);
	
	public void validate() {
		
	}
	
	public AuthToken getAuthToken(NHIFServer server) throws IOException {
		
		AdministrationService adminService = Context.getService(AdministrationService.class);
		String username = adminService.getGlobalProperty(NHIFConfig.USERNAME);
		if (username == null || username.trim().equals("")) {
			throw new VerificationException("NHIF Username is not set. Please set " + NHIFConfig.SERVER + ".");
		}
		String password = adminService.getGlobalProperty(NHIFConfig.PASSWORD);
		if (password == null || password.trim().equals("")) {
			throw new VerificationException("NHIF Password is not set. Please set " + NHIFConfig.PASSWORD + ".");
		}
		String serverUrl = adminService.getGlobalProperty(NHIFConfig.SERVER);
		if (serverUrl == null || serverUrl.trim().equals("")) {
			throw new VerificationException("NHIF Server url is not set. Please set " + NHIFConfig.SERVER + ".");
		}
		String tokenEndPoint = serverUrl + "/" + server.getEndPoint() + "/Token";
		CloseableHttpClient tokenClient = HttpClientBuilder.create().build();
		HttpPost request = new HttpPost(tokenEndPoint);
		request.addHeader("Content-Type", "application/x-www-formurlencoded");
		String entityBody = "username=" + username + "&password=" + password + "&grant_type=password";
		StringEntity entity = new StringEntity(entityBody);
		request.setEntity(entity);
		HttpResponse result = tokenClient.execute(request);
		String results = EntityUtils.toString(result.getEntity(), "UTF-8");
		return AuthToken.fromJSONString(results, server);
	}
	
	public String getRequest(String urlString, AuthToken authToken) throws IOException, URISyntaxException {
		AdministrationService adminService = Context.getService(AdministrationService.class);
		String serverUrl = adminService.getGlobalProperty(NHIFConfig.SERVER);
		if (serverUrl == null || serverUrl.trim().equals("")) {
			throw new VerificationException("Verification server url is not set. Please set " + NHIFConfig.SERVER + ".");
		}
		urlString = serverUrl + "/" + authToken.getServer().getEndPoint() + urlString;
		URL url = new URL(urlString);
		HttpURLConnection con = (HttpURLConnection) url.openConnection();
		con.setRequestMethod("GET");
		String bearer = String.format("Bearer %1s", authToken.getAccessToken());
		con.addRequestProperty("Authorization", bearer);
		try {
			BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
			String inputLine;
			StringBuffer content = new StringBuffer();
			while ((inputLine = in.readLine()) != null) {
				content.append(inputLine);
			}
			in.close();
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
	
	public String postRequest(String urlString, Map<String, Object> data, AuthToken authToken) throws IOException {
		
		AdministrationService adminService = Context.getService(AdministrationService.class);
		String serverUrl = adminService.getGlobalProperty(NHIFConfig.SERVER);
		if (serverUrl == null || serverUrl.trim().equals("")) {
			throw new VerificationException("Verification server url is not set. Please set " + NHIFConfig.SERVER + ".");
		}
		urlString = serverUrl + "/" + authToken.getServer().getEndPoint() + urlString;
		URL url = new URL(urlString);
		HttpURLConnection con = (HttpURLConnection) url.openConnection();
		//con.setReadTimeout(15000);
		//con.setConnectTimeout(15000);
		con.setRequestMethod("POST");
		String bearer = String.format("Bearer %1s", authToken.getAccessToken());
		con.addRequestProperty("Authorization", bearer);
		con.addRequestProperty("Content-Type", "application/json");
		con.setDoInput(true);
		con.setDoOutput(true);
		
		OutputStream os = con.getOutputStream();
		BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(os, "UTF-8"));
		String json = new ObjectMapper().writeValueAsString(data);
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
			return String.valueOf(content);
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
	public VerificationResponse request(VerificationRequest verificationRequest) throws Exception {
		ConceptService conceptService = Context.getService(ConceptService.class);
		if (verificationRequest.getAuthorizationNumber() == null) {
			throw new VerificationException("Authorization Number is not provided.");
		}
		if (verificationRequest.getPaymentScheme() == null) {
			throw new VerificationException("NHIF Payment Scheme is not provided.");
		}
		VerificationResponse verificationResponse = new VerificationResponse();
		verificationResponse.setAuthorizationStatus(AuthorizationStatus.ACCEPTED);
		verificationResponse.setEligibilityStatus(EligibilityStatus.ACTIVE);
		verificationResponse.setId(verificationRequest.getId());
		verificationResponse.setAuthorizationNumber(verificationRequest.getAuthorizationNumber());
		verificationResponse.setRemarks("Verified OK");
		//TODO Should be provided by the user
		verificationResponse.setPaymentScheme(conceptService.getConceptByUuid(verificationRequest.getPaymentScheme()));
		return verificationResponse;
	}
	
	public Concept getPaymentSchemePackages(Map<String, Object> pricePackage) {
		//Get Scheme for this product
		ConceptService conceptService = Context.getService(ConceptService.class);
		ConceptSource NHIFConceptSource = conceptService.getConceptSourceByName("NHIF");
		ConceptReferenceTerm conceptReferenceTerm = conceptService.getConceptReferenceTermByCode(
		    (String) pricePackage.get("ItemCode"), NHIFConceptSource);
		ConceptReferenceTerm conceptReferenceTerm2 = conceptService.getConceptReferenceTermByCode(
		    (String) pricePackage.get("PriceCode"), NHIFConceptSource);
		if (conceptReferenceTerm2 != null) {
			conceptReferenceTerm2.getConceptReferenceTermMaps();
			for (Concept concept : conceptService.getConceptsByMapping(conceptReferenceTerm2.getCode(),
			    conceptReferenceTerm2.getConceptSource().getName())) {
				for (ConceptMap conceptMap : concept.getConceptMappings()) {
					if (conceptMap.getConceptReferenceTerm().getCode().equals(conceptReferenceTerm2.getCode())) {
						concept.removeConceptMapping(conceptMap);
					}
				}
				conceptService.saveConcept(concept);
			}
			conceptService.purgeConceptReferenceTerm(conceptReferenceTerm2);
		}
		if (conceptReferenceTerm == null) {
			conceptReferenceTerm = new ConceptReferenceTerm();
			conceptReferenceTerm.setCode((String) pricePackage.get("ItemCode"));
			conceptReferenceTerm.setConceptSource(NHIFConceptSource);
			conceptReferenceTerm.setName((String) pricePackage.get("ItemName"));
			conceptService.saveConceptReferenceTerm(conceptReferenceTerm);
		}
		
		Concept concept = conceptService.getConceptByName("NHIF:" + pricePackage.get("SchemeID"));
		if (concept == null) {
			concept = new Concept();
			concept.setSet(false);
			concept.setDatatype(conceptService.getConceptDatatypeByUuid(ConceptDatatype.TEXT_UUID));
			ConceptClass pSchemeConceptClass = conceptService.getConceptClassByName("Payment Scheme");
			if (pSchemeConceptClass == null) {
				return null;
			}
			concept.setConceptClass(pSchemeConceptClass);
			
			ConceptName conceptName = new ConceptName();
			conceptName.setName("NHIF:" + pricePackage.get("SchemeID"));
			conceptName.setConceptNameType(ConceptNameType.FULLY_SPECIFIED);
			conceptName.setLocale(Locale.ENGLISH);
			concept.setPreferredName(conceptName);
			
			conceptService.saveConcept(concept);
			
			Concept NHIFconcept = conceptService.getConceptByName("NHIF");
			NHIFconcept.addSetMember(concept);
			conceptService.saveConcept(NHIFconcept);
		}
		return concept;
	}
	
	@Override
	public SyncResult syncPriceList() throws Exception {
		return null;
	}
	
	private Drug getDrugItemConcept(Concept itemConcept, Map<String, Object> pricePackage) {
		ConceptService conceptService = Context.getService(ConceptService.class);
		
		if (itemConcept == null) {
			itemConcept = new Concept();
			itemConcept.setSet(false);
			itemConcept.setConceptClass(conceptService.getConceptClassByName("Drug"));
			itemConcept.setDatatype(conceptService.getConceptDatatypeByName("N/A"));
			
			ConceptName conceptName = new ConceptName();
			conceptName.setName((String) pricePackage.get("ItemName"));
			conceptName.setConceptNameType(ConceptNameType.FULLY_SPECIFIED);
			conceptName.setLocale(Locale.ENGLISH);
			itemConcept.setPreferredName(conceptName);
			conceptService.saveConcept(itemConcept);
		} else {
			ConceptSource NHIFConceptSource = conceptService.getConceptSourceByName("NHIF");
			ConceptReferenceTerm conceptReferenceTerm = conceptService.getConceptReferenceTermByCode(
			    (String) pricePackage.get("ItemCode"), NHIFConceptSource);
			if (conceptReferenceTerm == null) {
				conceptReferenceTerm = new ConceptReferenceTerm();
				conceptReferenceTerm.setCode((String) pricePackage.get("ItemCode"));
				conceptReferenceTerm.setConceptSource(NHIFConceptSource);
				conceptReferenceTerm.setName((String) pricePackage.get("ItemName"));
				conceptService.saveConceptReferenceTerm(conceptReferenceTerm);
			}
			
			ConceptMap conceptMap = new ConceptMap();
			conceptMap.setConceptReferenceTerm(conceptReferenceTerm);
			itemConcept.addConceptMapping(conceptMap);
			conceptService.saveConcept(itemConcept);
		}
		
		List<Drug> drugs = conceptService.getDrugsByConcept(itemConcept);
		Drug drug = null;
		for (Drug d : drugs) {
			if (d.getName().equals(pricePackage.get("ItemName") + " " + pricePackage.get("Strength"))) {
				drug = d;
			}
		}
		if (drug == null) {
			drug = new Drug();
			drug.setConcept(itemConcept);
			drug.setName(pricePackage.get("ItemName") + " " + pricePackage.get("Strength"));
			drug.setStrength((String) pricePackage.get("Strength"));
			conceptService.saveDrug(drug);
		}
		return drug;
	}
	
	private boolean isServiceExcluded(List<Map<String, Object>> excludedServices, Map<String, Object> pricePackage) {
		for (Map<String, Object> excludedService : excludedServices) {
			if (excludedService.get("SchemeID").equals(pricePackage.get("SchemeID"))
			        && excludedService.get("ItemCode").equals(pricePackage.get("ItemCode"))) {
				return true;
			}
		}
		return false;
	}
	
	@Override
	public ClaimResult claim(Visit visit) throws Exception {
		ClaimResult result = new ClaimResult();
		AdministrationService adminService = Context.getService(AdministrationService.class);
		String facilityCode = adminService.getGlobalProperty(NHIFConfig.FACILITY_CODE);
		if (facilityCode == null) {
			result.setStatus("ERROR");
			result.setMessage("Facility code not configured. Please Configure " + NHIFConfig.FACILITY_CODE + ".");
			return result;
		}
		
		String allowOnlineVerification = adminService.getGlobalProperty(NHIFConfig.ALLOW_ONLINE_VERIFICATION);
		if (allowOnlineVerification == null || allowOnlineVerification.trim().equals("")) {
			throw new VerificationException("Allowing Online Verification is not set. Please set "
			        + NHIFConfig.ALLOW_ONLINE_VERIFICATION + ".");
		}
		if (allowOnlineVerification.equals("true")) {
			String urlString = "/api/v1/Claims/SubmitFolios";
			Folio folio = getFolioFromVisit(visit);
			FolioEntities folioEntities = new FolioEntities();
			folioEntities.getEntities().add(folio);
			ObjectMapper oMapper = new ObjectMapper();
			final DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
			//final DateFormat df = new SimpleDateFormat("dd/MM/yyyy");
			oMapper.setDateFormat(df);
			//oMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
			AuthToken authToken = getAuthToken(NHIFServer.CLAIM);
			String results = this.postRequest(urlString, oMapper.convertValue(folioEntities, Map.class), authToken);
			ObjectMapper mapper = new ObjectMapper();
			Map<String, Object> resultMap = mapper.readValue(String.valueOf(results), Map.class);
			//TODO add status to invoice on whether is claimed
			VisitWrapper visitWrapper = new VisitWrapper(visit);
			visitWrapper.setInsuranceClaimStatus(ClaimStatus.CLAIMED);
		} else {
			visit.setStopDatetime(new Date());
			Context.getVisitService().saveVisit(visit);
		}
		/*VisitService visitService = Context.getVisitService();
		VisitAttribute serviceVisitAttribute = new VisitAttribute();
		serviceVisitAttribute.setAttributeType(visitService.getVisitAttributeTypeByUuid(adminService
		        .getGlobalProperty(ICareConfig.INSURANCE_CLAIM_STATUS)));
		serviceVisitAttribute.setValue("CLAIMED");
		serviceVisitAttribute.setValueReferenceInternal(visit.getUuid());
		serviceVisitAttribute.setVisit(visit);
		visit.addAttribute(serviceVisitAttribute);*/
		//visitService..saveVisit(visit);
		return result;
	}
	
	public Folio getFolioFromVisit(Visit visit) throws Exception {
		VisitWrapper visitWrapper = new VisitWrapper(visit);
		AdministrationService adminService = Context.getService(AdministrationService.class);
		String facilityCode = adminService.getGlobalProperty(NHIFConfig.FACILITY_CODE);
		if (facilityCode == null) {
			throw new Exception("Facility code is not configured. Please check " + NHIFConfig.FACILITY_CODE + ".");
		}
		
		Folio folio = new Folio();
		//TODO set the actual phone number
		folio.setTelephoneNo(visitWrapper.getPatient().getPhoneNumber());
		folio.setPatientFileNo(visitWrapper.getPatient().getFileNumber());
		ProviderWrapper providerWrapper = visitWrapper.getConsultationProvider();
		if (providerWrapper != null) {
			folio.setPractitionerNo(providerWrapper.getPhoneNumber());
		}
		folio.setFacilityCode(facilityCode);
		folio.setFolioID(visit.getUuid());
		/*if (visit.getStopDatetime() == null) {
			throw new Exception("To Claim the visit has to be closed");
		}*/
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(visit.getStartDatetime());
		folio.setClaimYear(calendar.get(Calendar.YEAR));
		folio.setClaimMonth(calendar.get(Calendar.MONTH) + 1);
		
		ICareService iCareService = Context.getService(ICareService.class);
		//folio.setFolioNo(iCareService.getVisitSerialNumber(visit));
		folio.setFolioNo(visit.getId());
		String serialString = "00000";
		serialString = serialString.substring(String.valueOf(folio.getFolioNo()).length()) + folio.getFolioNo();
		folio.setAttendanceDate(visit.getStartDatetime());
		
		folio.setSerialNo(facilityCode + "\\" + (folio.getClaimMonth() < 10 ? "0" : "") + folio.getClaimMonth() + "\\"
		        + calendar.get(Calendar.YEAR) + "\\" + serialString);
		folio.setAuthorizationNo(visitWrapper.getInsuranceAuthorizationNumber());
		folio.setCardNo(visitWrapper.getInsuranceID());
		folio.setPatientFileNo(visitWrapper.getPatient().getFileNumber());
		folio.setFirstName(visit.getPatient().getGivenName());
		folio.setLastName(visit.getPatient().getFamilyName());
		if (visit.getPatient().getGender().equals("M")) {
			folio.setGender("Male");
		} else if (visit.getPatient().getGender().equals("F")) {
			folio.setGender("Female");
		}
		folio.setDateOfBirth(visit.getPatient().getBirthdate());
		folio.setAge(visit.getPatient().getAge());
		
		folio.setPatientTypeCode("OUT");
		
		folio.setCreatedBy(visit.getCreator().getDisplayString());
		folio.setDateCreated(visit.getDateCreated());
		if (visit.getChangedBy() != null) {
			folio.setLastModifiedBy(visit.getChangedBy().getDisplayString());
		} else {
			folio.setLastModifiedBy(visit.getCreator().getDisplayString());
		}
		if (visit.getDateChanged() != null) {
			folio.setLastModified(visit.getDateChanged());
		} else {
			folio.setLastModified(visit.getDateCreated());
		}
		
		String bedOrderType = adminService.getGlobalProperty(ICareConfig.BED_ORDER_TYPE);
		String patientFile = new String(Files.readAllBytes(Paths.get(getClass().getClassLoader()
		        .getResource("nhif/patientFile.html").toURI())));
		String observations = "";
		SimpleDateFormat dt = new SimpleDateFormat("dd-MM-yyyy HH:MM");
		for (Encounter encounter : visit.getEncounters()) {
			for (Obs obs : encounter.getObs()) {
				observations += "<tr><td>" + dt.format(obs.getObsDatetime()) + "</td><td>" + dt.format(obs.getObsDatetime())
				        + "</td><td>" + obs.getConcept().getName().getName() + "</td><td>"
				        + obs.getValueAsString(Locale.ENGLISH) + "</td><td>" + obs.getComment() + "</td></tr>";
				
			}
			
			if (encounter.getDiagnoses() != null) {
				for (Diagnosis diagnosis : encounter.getDiagnoses()) {
					FolioDisease folioDisease = FolioDisease.fromDiagnosis(folio, diagnosis);
					folio.getFolioDiseases().add(folioDisease);
				}
			}
			for (Order order : encounter.getOrders()) {
				FolioItem folioItem = FolioItem.fromOrder(order);
				if (folioItem != null) {
					folio.getFolioItems().add(folioItem);
					if (order.getOrderType().getUuid().equals(bedOrderType)) {
						folio.setPatientTypeCode("IN");
						folio.setDateAdmitted(order.getEffectiveStartDate());
						if (visit.getStopDatetime() == null) {
							folio.setDateDischarged(new Date());
						} else {
							folio.setDateDischarged(visit.getStopDatetime());
						}
					}
				}
			}
		}
		if (observations.equals("")) {
			observations = "<tr><td colspan='5' align='center'>There are no observations</td></tr>";
		}
		patientFile = patientFile.replace("{Observation}", observations);
		patientFile = patientFile.replace("{Name}", visit.getPatient().getPersonName().getFullName());
		String content = getForm2B_A(visit, folio);
		folio.setClaimFile(convertToPDFEncodedString("claim", content));
		
		folio.setPatientFile(convertToPDFEncodedString("file", patientFile));
		
		return folio;
	}
	
	public void getReferral(Visit visit) throws Exception {
		
		Referral referral = Referral.fromVisit(new VisitWrapper(visit));
		String urlString = "/breeze/verification/AddReferral";
		ObjectMapper oMapper = new ObjectMapper();
		AuthToken authToken = getAuthToken(NHIFServer.SERVICE);
		String results = this.postRequest(urlString, oMapper.convertValue(referral, Map.class), authToken);
		ObjectMapper mapper = new ObjectMapper();
		Map<String, Object> resultMap = mapper.readValue(String.valueOf(results), Map.class);
	}
	
	public String getForm2B_A(Visit visit, Folio folio) throws Exception {
		VisitWrapper visitWrapper = new VisitWrapper(visit);
		PatientWrapper patientWrapper = visitWrapper.getPatient();
		AdministrationService adminService = Context.getService(AdministrationService.class);
		String consultationEncounter = adminService.getGlobalProperty(ICareConfig.CONSULTATION_ENCOUNTER_TYPE);
		if (consultationEncounter == null) {
			throw new Exception("Consultation encounter type is not configured. Please check "
			        + ICareConfig.CONSULTATION_ENCOUNTER_TYPE + ".");
		}
		
		SimpleDateFormat dt = new SimpleDateFormat("dd-MM-yyyy");
		String consultation = "";
		String medicine = "";
		String tests = "";
		String billingOrderType = adminService.getGlobalProperty(ICareConfig.CONSULTATION_ORDER_TYPE);
		float consultationsubtotal = 0;
		float medicinesubtotal = 0;
		float testssubtotal = 0;
		float grandtotal = 0;
		String consultationFees = "";
		for (Encounter encounter : visit.getEncounters()) {
			for (Order order : encounter.getOrders()) {
				FolioItem folioItem = FolioItem.fromOrder(order);
				if (folioItem != null) {
					if (order.getOrderType().getUuid().equals(billingOrderType)) {
						for (ConceptMap conceptMap : order.getConcept().getConceptMappings()) {
							if (conceptMap.getConceptReferenceTerm().getConceptSource().getName().equals("NHIF")
							        && Integer.valueOf(conceptMap.getConceptReferenceTerm().getCode()) > 10000
							        && Integer.valueOf(conceptMap.getConceptReferenceTerm().getCode()) < 10006) {
								if (!consultationFees.contains(conceptMap.getConceptReferenceTerm().getName())) {
									consultationFees += conceptMap.getConceptReferenceTerm().getName();
								}
							}
						}
						consultation += "<tr><td class='blue'>" + folioItem.getItemName() + "</td><td class='blue'>"
						        + folioItem.getItemCode() + "</td><td class='blue' align='right'>"
						        + folioItem.getItemQuantity() + "</td><td class='blue' align='right'>"
						        + folioItem.getUnitPrice() + "</td><td class='blue' align='right'>"
						        + folioItem.getAmountClaimed() + "</td></tr>";
						consultationsubtotal += folioItem.getAmountClaimed();
					} else if (order instanceof DrugOrder) {
						medicine += "<tr><td class='blue'>" + folioItem.getItemName() + "</td><td class='blue'>"
						        + folioItem.getItemCode() + "</td><td class='blue' align='right'>"
						        + folioItem.getItemQuantity() + "</td><td class='blue' align='right'>"
						        + folioItem.getUnitPrice() + "</td><td class='blue' align='right'>"
						        + folioItem.getAmountClaimed() + "</td></tr>";
						medicinesubtotal += folioItem.getAmountClaimed();
					} else if (order instanceof TestOrder) {
						tests += "<tr><td class='blue'>" + folioItem.getItemName() + "</td><td class='blue'>"
						        + folioItem.getItemCode() + "</td><td class='blue' align='right'>"
						        + folioItem.getItemQuantity() + "</td><td class='blue' align='right'>"
						        + folioItem.getUnitPrice() + "</td><td class='blue' align='right'>"
						        + folioItem.getAmountClaimed() + "</td></tr>";
						testssubtotal += folioItem.getAmountClaimed();
					}
				}
			}
		}
		
		if (!medicine.equals("")) {
			medicine = "<tr class='headings table-header'><td colspan='5'>Medicine</td></tr>" + medicine;
			medicine += "<tr><td colspan='4'>SUB TOTAL</td><td class='blue' align='right' style='font-weight:bold'>"
			        + medicinesubtotal + "</td></tr>";
		}
		
		if (!tests.equals("")) {
			tests = "<tr class='headings table-header'><td colspan='5'>Tests</td></tr>" + tests;
			tests += "<tr><td colspan='4'>SUB TOTAL</td><td class='blue' align='right' style='font-weight:bold'>"
			        + testssubtotal + "</td></tr>";
		}
		grandtotal += consultationsubtotal + medicinesubtotal + testssubtotal;
		
		//consultation += "<tr><td colspan='4'>GRAND TOTAL</td><td class='blue' align='right' style='font-weight:bold'>" + grandtotal + "</td></tr>";
		String content = new String(Files.readAllBytes(Paths.get(getClass().getClassLoader()
		        .getResource("nhif/form2B-A.html").toURI())));
		content = content.replace("{ConsultationFees}", consultationFees);
		content = content.replace("{GrandTotal}", String.valueOf(grandtotal));
		content = content.replace("{AuthNo}", folio.getAuthorizationNo());
		content = content.replace("{SerialNumber}", folio.getSerialNo());
		content = content.replace("{Consultation}", consultation);
		content = content.replace("{Tests}", tests);
		content = content.replace("{Medicine}", medicine);
		content = content.replace("{FacilityName}", adminService.getGlobalProperty(ICareConfig.FACILITY_NAME));
		content = content.replace("{Address}", "");
		//TODO Add consulation fee {ConsultationFees}
		
		content = content.replace("{DateOfAttendance}", dt.format(visit.getStartDatetime()));
		content = content.replace("{Department}", visit.getVisitType().getName());
		if (folio.getPatientFileNo() != null) {
			content = content.replace("{PatientFileNo}", folio.getPatientFileNo());
		} else {
			content = content.replace("{PatientFileNo}", "[Not Set]");
		}
		content = content.replace("{PatientName}", visit.getPatient().getPersonName().getFullName());
		if (visit.getPatient().getPerson().getBirthdate() != null) {
			content = content.replace("{DOB}", dt.format(visit.getPatient().getPerson().getBirthdate()));
		} else {
			content = content.replace("{DOB}", "[Not Set]");
		}
		content = content.replace("{Sex}", visit.getPatient().getGender());
		if (patientWrapper.getAddress() != null) {
			content = content.replace("{PatientPhysicalAddress}", patientWrapper.getAddress());
		} else {
			content = content.replace("{PatientPhysicalAddress}", "[Not Set]");
		}
		content = content.replace("{PatientCardNo}", folio.getCardNo());
		
		content = content.replace("{PatientMobileNo}", patientWrapper.getPhoneNumber());
		
		content = content.replace("{PatientSignature}", visitWrapper.getSignature());
		
		//Signature
		String claimantName = adminService.getGlobalProperty(NHIFConfig.CLAIMANT_NAME);
		if (claimantName != null) {
			content = content.replace("{ClaimantName}", claimantName);
		} else {
			content = content.replace("{ClaimantName}", "[Not Set]");
		}
		
		//Claimant Name
		String claimantSignature = adminService.getGlobalProperty(NHIFConfig.CLAIMANT_SIGNATURE);
		if (claimantSignature != null) {
			content = content.replace("{ClaimantSignature}", claimantSignature);
		} else {
			content = content.replace("{ClaimantSignature}", "[Not Set]");
		}
		
		content = content.replace("{Occupation}", patientWrapper.getOccupation());
		
		ProviderWrapper providerWrapper = visitWrapper.getConsultationProvider();
		if (providerWrapper != null) {
			content = content.replace("{Qualification}",
			    providerWrapper.getQualification() != null ? providerWrapper.getQualification() : "");
			
			content = content.replace("{RegNo}",
			    providerWrapper.getRegistrationNumber() != null ? providerWrapper.getRegistrationNumber() : "");
			
			content = content.replace("{ClinicianSignature}",
			    providerWrapper.getSignature() != null ? providerWrapper.getSignature() : "");
			
			content = content.replace("{ClinicianNumber}",
			    providerWrapper.getPhoneNumber() != null ? providerWrapper.getPhoneNumber() : "");
			
			content = content.replace("{AttendingClinician}",
			    providerWrapper.getProvider().getName() != null ? providerWrapper.getProvider().getName() : "");
		}
		content = content.replace("{PreliminaryDiagnosis}", visitWrapper.getPreliminaryDiagnosisString());
		content = content.replace("{FinalDiagnosis}", visitWrapper.getFinalDiagnosisString());
		return content;
	}
	
	@Override
	public Claim getClaim(Visit visit) throws Exception {
		return getFolioFromVisit(visit);
	}
	
	String convertToPDFEncodedString(String fileName, String template) throws IOException, DocumentException,
	        URISyntaxException {
		String tempPDFFile = "/tmp/" + fileName + ".html.pdf";
		String tempHTMLFile = "/tmp/" + fileName + ".pdf.html";
		BufferedWriter fwriter = new BufferedWriter(new FileWriter(tempHTMLFile));
		fwriter.write(template);
		fwriter.close();
		
		File output = new File(tempPDFFile);
		ITextRenderer renderer = new ITextRenderer();
		//renderer.setDocument(input);
		renderer.setDocumentFromString(template);
		
		renderer.layout();
		
		OutputStream outputStream = new FileOutputStream(output);
		renderer.createPDF(outputStream);
		outputStream.close();
		/*
		Document document = new Document(new Rectangle(Utilities.millimetersToPoints(470),
		        Utilities.millimetersToPoints(288)), 0, 0, 0, 0);
		PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(tempFile));
		document.open();
		XMLWorkerHelper.getInstance().parseXHtml(writer, document, new ByteArrayInputStream(template.getBytes()));
		document.close();*/
		byte[] inFileBytes = Files.readAllBytes(Paths.get(tempPDFFile));
		return new String(org.apache.commons.codec.binary.Base64.encodeBase64(inFileBytes));
	}
}
