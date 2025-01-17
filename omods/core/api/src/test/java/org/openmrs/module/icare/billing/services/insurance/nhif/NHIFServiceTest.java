package org.openmrs.module.icare.billing.services.insurance.nhif;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.hamcrest.MatcherAssert;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.openmrs.*;
import org.openmrs.api.*;
import org.openmrs.api.context.Context;
import org.openmrs.module.icare.ICareConfig;
import org.openmrs.module.icare.billing.BillingTestBase;
import org.openmrs.module.icare.billing.VisitInvalidException;
import org.openmrs.module.icare.billing.models.Invoice;
import org.openmrs.module.icare.billing.models.InvoiceItem;
import org.openmrs.module.icare.billing.models.ItemPrice;
import org.openmrs.module.icare.billing.services.BillingService;
import org.openmrs.module.icare.billing.services.insurance.*;
import org.openmrs.module.icare.billing.services.insurance.nhif.claim.Folio;
import org.openmrs.module.icare.billing.services.insurance.nhif.claim.FolioItem;
import org.openmrs.module.icare.core.ICareService;
import org.openmrs.module.icare.core.Item;
import org.openmrs.module.icare.core.utils.VisitWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.naming.ConfigurationException;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

@Service(value = "NHIF")
class NHIFServiceImplStab extends NHIFServiceImpl {
	
	protected String readFile(String file) throws IOException {
		URL url = this.getClass().getClassLoader().getResource(file);
		BufferedReader br = new BufferedReader(new FileReader(url.getPath()));
		StringBuilder sb = new StringBuilder();
		String line = br.readLine();
		
		while (line != null) {
			sb.append(line);
			sb.append(System.lineSeparator());
			line = br.readLine();
		}
		return sb.toString();
	}
	
	@Override
	public String getRequest(String urlString, AuthToken authToken) throws IOException {
		if (urlString.contains("AuthorizeCard")) {
			return readFile("nhif/accepted.json");
		} else if (urlString.contains("Test")) {
			return readFile("nhif/accepted.json");
		} else if (urlString.contains("GetPricePackageWithExcludedServices")) {
			return readFile("nhif/pricelist.json");
		}
		return null;
	}
	
	@Override
	public String postRequest(String urlString, Map<String, Object> data, AuthToken authToken) throws IOException {
		if (urlString.contains("AuthorizeCard")) {
			return readFile("nhif/accepted.json");
		} else if (urlString.contains("GetPricePackageWithExcludedServices")) {
			return readFile("nhif/pricelist.json");
		}
		return null;
	}
	
	@Override
	public AuthToken getAuthToken(NHIFServer server) throws IOException {
		return new AuthToken();
	}
	
	@Override
	public Concept getPaymentSchemePackages(Map<String, Object> pricePackage) {
		Concept paymentSchemeConcept = super.getPaymentSchemePackages(pricePackage);
		ConceptService conceptService = Context.getService(ConceptService.class);
		
		ConceptSource NHIFConceptSource = conceptService.getConceptSourceByName("NHIF");
		ConceptReferenceTerm conceptReferenceTerm = conceptService.getConceptReferenceTermByCode(
		    (String) pricePackage.get("ItemCode"), NHIFConceptSource);
		if (pricePackage.get("ItemName").equals("Registration Fee")) {
			Concept registrationFeeConcept = conceptService.getConceptByName("Registration Fee");
			ConceptMap conceptMap = new ConceptMap();
			conceptMap.setConceptReferenceTerm(conceptReferenceTerm);
			conceptMap.setConcept(registrationFeeConcept);
			conceptMap.setConceptMapType(conceptService.getConceptMapType(1));
			registrationFeeConcept.getConceptMappings().add(conceptMap);
			//conceptService.saveConcept(registrationFeeConcept);
		} else if (pricePackage.get("ItemName").equals("General Practitioner Consultation")) {
			Concept registrationFeeConcept = conceptService.getConceptByName("General OPD");
			ConceptMap conceptMap = new ConceptMap();
			conceptMap.setConceptReferenceTerm(conceptReferenceTerm);
			conceptMap.setConcept(registrationFeeConcept);
			conceptMap.setConceptMapType(conceptService.getConceptMapType(1));
			registrationFeeConcept.getConceptMappings().add(conceptMap);
			//conceptService.saveConcept(registrationFeeConcept);
		}
		return paymentSchemeConcept;
	}
}

public class NHIFServiceTest extends BillingTestBase {
	
	@InjectMocks
	NHIFServiceImplStab basicNHIFService;
	
	@Autowired
	public BillingService billingService;
	
	/*@Autowired
	@Qualifier("NHIF")
	InsuranceService insuranceService;*/
	
	@Before
	public void initMockito() throws Exception {
		MockitoAnnotations.initMocks(this);
		super.initTestOnfile("nhif.xml");
		AdministrationService adminService = Context.getService(AdministrationService.class);
		adminService.setGlobalProperty(NHIFConfig.FACILITY_CODE, "01099");
		adminService.setGlobalProperty(NHIFConfig.SERVER, "http://196.13.105.15");
		adminService.setGlobalProperty(NHIFConfig.USERNAME, "integrationuser");
		adminService.setGlobalProperty(NHIFConfig.PASSWORD, "nhif@2018");
		adminService.setGlobalProperty(NHIFConfig.CLAIMANT_NAME, "Vincent Minde");
		adminService.setGlobalProperty(NHIFConfig.DOSING_UNIT_CONCEPT_UUID, "c9386d70-d9c5-11e3-9c1a-0800200c9a66");
		adminService.setGlobalProperty(NHIFConfig.PATIENT_FILENUMBER_IDENTIFIER, "Vincent Minde");
		adminService
		        .setGlobalProperty(
		            NHIFConfig.CLAIMANT_SIGNATURE,
		            "iVBORw0KGgoAAAANSUhEUgAABJ4AAAEYCAYAAAAdwjyIAAAgAElEQVR4Xu3dT+g9a54f9CcLTdSYO62iWQRuemUUoW2yiBCwp1e6ke4GF+qmpxlcCIY77SaCi06jCIJwp0lcidzpTXB3uyH7Ow0GspE7s3JjuDM6CwPKTW+igeDIu+c846drzjn1VJ2qOv9eBZfbv/urU/XUq57z+33r3Z/nU3+q2QgQIECAAAECBAgQIECAAAECBAjsIPCndjimQxIgQIAAAQIECBAgQIAAAQIECBBogieTgAABAgQIECBAgAABAgQIECBAYBcBwdMurA5KgAABAgQIECBAgAABAgQIECAgeDIHCBAgQIAAAQIECBAgQIAAAQIEdhEQPO3C6qAECBAgQIAAAQIECBAgQIAAAQKCJ3OAAAECBAgQIECAAAECBAgQIEBgFwHB0y6sDkqAAAECBAgQIECAAAECBAgQICB4MgcIECBAgAABAgQIECBAgAABAgR2ERA87cLqoAQIECBAgAABAgQIECBAgAABAoInc4AAAQIECBAgQIAAAQIECBAgQGAXAcHTLqwOSoAAAQIECBAgQIAAAQIECBAgIHgyBwgQIECAAAECBAgQIECAAAECBHYREDztwuqgBAgQIECAAAECBAgQIECAAAECgidzgAABAgQIECBAgAABAgQIECBAYBcBwdMurA5KgAABAgQIECBAgAABAgQIECAgeDIHCBAgQIAAAQIECBAgQIAAAQIEdhEQPO3C6qAECBAgQIAAAQIECBAgQIAAAQKCJ3OAAAECBAgQIECAAAECBAgQIEBgFwHB0y6sDkqAAAECBAgQIECAAAECBAgQICB4MgcIECBAgAABAgQIECBAgAABAgR2ERA87cLqoAQIECBAgAABAgQIECBAgAABAoInc4AAAQIECBAgQIAAAQIECBAgQGAXAcHTLqwOSoAAAQIECBAgQIAAAQIECBAgIHgyBwgQIECAAAECBAgQIECAAAECBHYREDztwuqgBAgQIECAAAECBAgQIECAAAECgidzgAABAgQIECBAgAABAgQIECBAYBcBwdMurA5KgAABAgQIECBAgAABAgQIECAgeDIHCBAgQIAAAQIECBAgQIAAAQIEdhEQPO3C6qAECBAgQIAAAQIECBAgQIAAAQKCJ3OAAAECBAgQIECAAAECBAgQIEBg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+pXW2peFZ9o8/Ldaa989/f73W2upkLIRIECAAAECBAgQIPBiAoKnF7uhLocAAQJF4J7BU4ZR+zxN+0t9cWp+nv2OXAJoghAgQIAAAQIECBAgcKCA4OlAbKciQIDAwQL3Dp5qn6cfttb+xun6NRY/eCI4HQECBAgQIECAAIF7CQie7iXvvAQIENhfoAZP93hz3KU+T+nn9Mnp8n/aWst+NgIECBAgQIAAAQIEXlBA8PSCN9UlESBA4CRw7zfHTfs89SV1lyqh3DgCBAgQIECAAAECBF5MQPD0YjfU5RAgQKAI3Dt4ylBqE/H+9rrfbq194zTOae8nN5AAAQIECBAgQIAAgRcSEDy90M10KQQIEJgIPELwVMfwD1trebudxuKmKgECBAgQIECAAIE3ERA8vcmNdpkECLylwCMET4H/vdbah6c78P3W2sflbvh76C2nposmQIAAAQIECBB4FwE/8L/LnXadBAi8o8CjBE95m90PztyAn7XWMkYbAQIECBAgQIAAAQIvKiB4etEb67IIECBwCnU+O0ncM+RJk/FUPX0wuSs/aq39hjtFgAABAgQIECBAgMDrCgieXvfeujICBAg8SsVT7sSvtdY+mdySH7bWUg1lI0CAAAECBAgQIEDgRQUETy96Y10WAQIEHqjiqd+M32mtfa3cma+31vLfbAQIECBAgAABAgQIvKiA4OlFb6zLIkCAwAMKZMndb5/CJ8vsHvAGGRIBAgQIECBAgACBrQUET1uLOh4BAgQIECBAgAABAgQIECBAgMAvBARPJgIBAgQIECBAgAABAgQIECBAgMAuAoKnXVgdlAABAgQIECBAgAABAgQIECBAQPBkDhAgQIAAAQIECBAgQIAAAQIECOwiIHjahdVBCRAgQIAAAQIECBAgQIAAAQIEBE/mAAECBAgQIECAAAECBAgQIECAwC4CgqddWB2UAAECBAgQIECAAAECBAgQIEBA8GQOECBAgAABAgQIECBAgAABAgQI7CIgeNqF1UEJECBAgAABAgQIECBAgAABAgQET+YAAQIECBAgQIAAAQIECBAgQIDALgKCp11YHZQAAQIECBAgQIAAAQIECBAgQEDwZA4QIECAAAECBAgQIECAAAECBAjsIiB42oXVQQkQIECAAAECBAgQIECAAAECBARP5gABAgQIECBAgAABAgQIECBAgMAuAoKnXVgdlAABAgQIECBAgAABAgQIECBAQPBkDhAgQIAAAQIECBAgQIAAAQIECOwiIHjahdVBCRAgQIAAAQIECBAgQIAAAQIEBE/mAAECBAgQIECAAAECBAgQIECAwC4CgqddWB2UAAECBAgQIECAAAECBAgQIEBA8GQOECBAgAABAgQIECBAgAABAgQI7CIgeNqF1UEJECBAgAABAgQIECBAgAABAgQET+YAAQIECBAgQIAAAQIECBAgQIDALgKCp11YHZQAAQIECBAgQIAAAQIECBAgQEDwZA4QIECAAAECBAgQIECAAAECBAjsIiB42oXVQQkQIECAAAECBAgQIECAAAECBARP5gABAgQIECBAgAABAgQIECBAgMAuAoKnXVgdlAABAgQIECBAgAABAgQIECBAQPBkDhAgQIAAAQIECBAgQIAAAQIECOwiIHjahdVBCRAgQIAAAQIECBAgQIAAAQIEBE/mAAECBAgQIECAAAECBAgQIECAwC4CgqddWB2UAAECBAgQIECAAAECBAgQIEBA8GQOECBAgAABAgQIECBAgAABAgQI7CIgeNqF1UEJECBAgAABAgQIECBAgAABAgQET+YAAQIECBAgQIAAAQIECBAgQIDALgKCp11YHZQAAQIECBAgQIAAAQIECBAgQEDwZA4QIECAAAECBAgQIECAAAECBAjsIiB42oXVQQkQIECAAAECBAgQIECAAAECBARP5gABAgQIECBAgAABAgQIECBAgMAuAoKnXVgdlAABAgQIECBAgAABAgQIECBAQPBkDhAgQIAAAQIECBAgQIAAAQIECOwiIHjahdVBCRAgQIAAAQIECBAgQIAAAQIEBE/mAAECBAgQIECAAAECBAgQIECAwC4CgqddWB2UAAECBAgQIECAAAECBAgQIEBA8GQOECBAgAABAgQIECBAgAABAgQI7CIgeNqF1UEJECBAgAABAgQIECBAgAABAgQET+YAAQIECBAgQIAAAQIECBAgQIDALgKCp11YHZQAAQIECBAgQIAAAQIECBAgQEDwZA4QIECAAAECBAgQIECAAAECBAjsIiB42oXVQQkQIECAAAECBAgQIECAAAECBARP5gABAgQIECBAgAABAgQIECBAgMAuAoKnXVgdlAABAgQIECBAgAABAgQIECBAQPBkDhAgQIAAAQIECBAgQIAAAQIECOwiIHjahdVBCRAgQIAAAQIECBAgQIAAAQIEBE/mAAECBAgQIECAAAECBAgQIECAwC4CgqddWB2UAAECBAgQIECAAAECBAgQIEBA8GQOECBAgAABAgQIECBAgAABAgQI7CIgeNqF1UEJECBAgAABAgQIECBAgAABAgQET+YAAQIECBAgQIAAAQIECBAgQIDALgKCp11YHZQAAQIECBAgQIAAAQIECBAgQEDwZA4QIECAAAECBAgQIECAAAECBAjsIiB42oXVQQkQIECAAAECBAgQIECAAAECBARP5gABAgQIECBAgAABAgQIECBAgMAuAoKnXVgdlAABAgQIECBAgAABAgQIECBAQPBkDhAgQIAAAQIECBAgQIAAAQIECOwiIHjahdVBCRAgQIAAAQIECBAgQIAAAQIEBE/mAAECBAgQIECAAAECBAgQIECAwC4CgqddWB2UAAECBAgQIECAAAECBAgQIEBA8GQOECBAgAABAgQIECBAgAABAgQI7CIgeNqF1UEJECBAgAABAgQIECBAgAABAgQET+YAAQIECBAgQIAAAQIECBAgQIDALgKCp11YHZQAAQIECBAgQIAAAQIECBAgQEDwZA4QIECAAAECBAgQIECAAAECBAjsIiB42oXVQQkQIECAAAECBAgQIECAAAECBARP5gABAgQIECBAgAABAgQIECBAgMAuAv8fTemz3J0JvF4AAAAASUVORK5CYII=");
		adminService.setGlobalProperty(ICareConfig.FACILITY_NAME, "Testing Facility");
		adminService.setGlobalProperty(ICareConfig.CONSULTATION_ENCOUNTER_TYPE, "2msir5eb-5345-11e8-9c7c-40b034c3cfee");
		adminService.setGlobalProperty(ICareConfig.FACILITY_ADDRESS, "Testing Facility Address");
		adminService.setGlobalProperty(ICareConfig.PHONE_NUMBER_ATTRIBUTE, "b3b6d540-a32e-44c7-91b3-292d97667518");
		adminService.setGlobalProperty(ICareConfig.PATIENT_SIGNATURE_ATTRIBUTE, "b3b6d540-a32e-44c7-91b3-292d97667518");
		adminService.setGlobalProperty(ICareConfig.PATIENT_OCCUPATION_ATTRIBUTE, "b3b6d540-a32e-44c7-91b3-292d97667518");
		
		adminService.setGlobalProperty(ICareConfig.PROVIDER_QUALIFICATION_ATTRIBUTE, "b3b6d540-a32e-44c7-91b3-292d97667518");
		adminService.setGlobalProperty(ICareConfig.PROVIDER_REGISTRATION_NUMBER_ATTRIBUTE,
		    "b3b6d540-a32e-44c7-91b3-292d97667518");
		adminService.setGlobalProperty(ICareConfig.PROVIDER_SIGNATURE_ATTRIBUTE, "b3b6d540-a32e-44c7-91b3-292d97667518");
		adminService.setGlobalProperty(ICareConfig.PROVIDER_PHONENUMBER_ATTRIBUTE, "b3b6d540-a32e-44c7-91b3-292d97667518");
		adminService.setGlobalProperty(ICareConfig.REGISTRATION_ENCOUNTER_ROLE, "a0b03050-c99b-11e0-9572-0800200c9a66");
		this.setUpAdvisors();
	}
	
	@After
	public void down() throws Exception {
		this.shutDowndvisors();
	}
	
	@Test
	public void testVerificationOfCard() throws Exception {
		//Given
		AdministrationService adminService = Context.getService(AdministrationService.class);
		adminService.setGlobalProperty(NHIFConfig.ALLOW_ONLINE_VERIFICATION, "true");
		VerificationRequest verificationRequest = new VerificationRequest();
		verificationRequest.setId("01-nhif241");
		verificationRequest.setComment("THis is the Comment");
		verificationRequest.setReferralNumber("");
		org.openmrs.VisitType visitType = new org.openmrs.VisitType();
		verificationRequest.setVisitType(Context.getVisitService().getAllVisitTypes().get(0));
		
		//DrugOrder
		//When
		VerificationResponse response = this.basicNHIFService.request(verificationRequest);
		
		//Then
		assertThat("The card is accepted", response.getAuthorizationStatus(), is(AuthorizationStatus.ACCEPTED));
		assertThat("The card is eligible", response.getEligibilityStatus(), is(EligibilityStatus.ACTIVE));
		assertThat("The card is legit", response.getId(), is(verificationRequest.getId()));
		assertThat("The card reference number is created", response.getAuthorizationNumber(), is("720002"));
		assertThat("The card remarks", response.getRemarks(), is("Verified OK"));
		//assertThat("The card scheme to be used", response.getScheme(), is("720002"));
		//assertThat("The card item", response.getItem(), is("720002"));
	}
	
	@Test
	public void testFolio() throws Exception {
		//Given
		Folio folio = new Folio();
		folio.setFolioID("folioid");
		folio.setDateDischarged(new Date());
		
		//When
		ObjectMapper oMapper = new ObjectMapper();
		Map<String, Object> result = oMapper.convertValue(folio, Map.class);
		
		//Then
		assertThat("folioid", is(result.get("FolioID")));
	}
	
	@Test
	public void testVerificationOfCardOffline() throws Exception {
		//Given
		AdministrationService adminService = Context.getService(AdministrationService.class);
		adminService.setGlobalProperty(NHIFConfig.ALLOW_ONLINE_VERIFICATION, "false");
		VerificationRequest verificationRequest = new VerificationRequest();
		verificationRequest.setId("01-nhif241");
		verificationRequest.setComment("THis is the Comment");
		verificationRequest.setReferralNumber("");
		verificationRequest.setPaymentScheme(Context.getConceptService().getAllConcepts().get(0).getUuid());
		verificationRequest.setAuthorizationNumber("");
		verificationRequest.setVisitType(Context.getVisitService().getAllVisitTypes().get(0));
		
		//DrugOrder
		//When
		VerificationResponse response = this.basicNHIFService.request(verificationRequest);
		
		//Then
		assertThat("The card is accepted", response.getAuthorizationStatus(), is(AuthorizationStatus.ACCEPTED));
		assertThat("The card is eligible", response.getEligibilityStatus(), is(EligibilityStatus.ACTIVE));
		assertThat("The card is legit", response.getId(), is(verificationRequest.getId()));
		assertThat("The card reference number is created", response.getId(), is("01-nhif241"));
		assertThat("The card remarks", response.getRemarks(), is("Verified OK"));
		//assertThat("The card scheme to be used", response.getScheme(), is("720002"));
		//assertThat("The card item", response.getItem(), is("720002"));
	}
	
	@Test
	public void testFolioConversion() throws Exception {
		//Given
		AdministrationService adminService = Context.getService(AdministrationService.class);
		adminService.setGlobalProperty(NHIFConfig.ALLOW_ONLINE_VERIFICATION, "true");
		
		InsuranceService insuranceService = Context.getService(InsuranceService.class);
		insuranceService.syncPriceList();
		ConceptService conceptService = Context.getService(ConceptService.class);
		Concept concept = conceptService.getConceptByName("NHIF:1001");
		addInitialPricing();
		Visit visit = getNHIFVisit(concept.getUuid());
		//visit.setStopDatetime(new Date());
		//VisitService visitService = Context.getVisitService();
		//Visit visit2 = visitService.getVisitByUuid(visit.getUuid());
		//visitService.saveVisit(visit);
		
		//When
		Folio folio = this.basicNHIFService.getFolioFromVisit(visit);
		
		//Then
		SimpleDateFormat dt = new SimpleDateFormat("MM\\yyyy");
		assertThat("Check Set Folio ID", folio.getFolioID(), is(visit.getUuid()));
		String facilityCode = adminService.getGlobalProperty(NHIFConfig.FACILITY_CODE);
		assertThat("Check Set Folio Facility Code", folio.getFacilityCode(), is(facilityCode));
		
		assertThat("Check Set Serial Number", folio.getSerialNo(), is("01099\\" + dt.format(visit.getStartDatetime())
		        + "\\00" + visit.getId()));
		assertThat("Check Set Folio Claim Year", folio.getClaimYear(), is(2022));
		assertThat("Check Set Folio Claim Month", folio.getClaimMonth(), is(visit.getStartDatetime().getMonth() + 1));
		assertThat("Check Set Folio Number", folio.getFolioNo(), is(visit.getId().longValue()));
		assertThat("Check the start Date", folio.getAttendanceDate(), is(visit.getStartDatetime()));
		assertThat("Check Set Card Number", folio.getCardNo(), is("103701630289"));
		assertThat("Check Set First Name", folio.getFirstName(), is(visit.getPatient().getGivenName()));
		assertThat("Check Set Last Name", folio.getLastName(), is(visit.getPatient().getFamilyName()));
		assertThat("Check Set Gender", folio.getGender().substring(0, 1), is(visit.getPatient().getGender()));
		assertThat("Check Date of Birth", folio.getDateOfBirth(), is(visit.getPatient().getBirthdate()));
		
		assertThat("Check Set Age", folio.getAge(), is(visit.getPatient().getAge()));
		assertThat("Check Set Authorization Number", folio.getAuthorizationNo() != null, is(true));
		assertThat("Check Set PatientTypeCode", folio.getPatientTypeCode(), is("OUT"));
		assertThat("Check Set Date Admitted", folio.getDateAdmitted() == null, is(true));
		assertThat("Check Set Date Discharged", folio.getDateDischarged() == null, is(true));
		assertThat("Check Set Creator", folio.getCreatedBy(), is(visit.getCreator().getDisplayString()));
		assertThat("Check Set Created Date", folio.getDateCreated(), is(visit.getDateCreated()));
		//assertThat("Check Last Modified By", folio.getLastModifiedBy() != null, is(true));
		//assertThat("Check Last Modified Date", folio.getLastModified() != null, is(true));
		/**
		 * TODO Pending Tests - Phone Number - Patient File - Patient File Number - Approval
		 * Refference Number - Practitioner No as registered by the Medical Council Of Tanganyika
		 */
		
		//Test Phone Number
		//assertThat("Check Phone Number", folio.getTelephoneNo(), is(visit.getPatient()));
		
		//Test Patient File
		
		//Test Claim File
		
		//Test Attendance Date
		
		//Test Practitioner number
		
		assertThat("Two folio Items", folio.getFolioItems().size(), is(2));
		
		FolioItem folioItem1 = null;
		FolioItem folioItem2 = null;
		for (FolioItem folioItem : folio.getFolioItems()) {
			if (folioItem.getItemCode().equals("10099")) {
				folioItem1 = folioItem;
			} else if (folioItem.getItemCode().equals("10001")) {
				folioItem2 = folioItem;
			}
		}
		assertThat("Check Set Folio ID", folioItem1.getFolioID(), is(visit.getUuid()));
		assertThat("Check Set Item ID", folioItem1.getFolioItemID() != null, is(true));
		assertThat("Check Set Folio Item Code", folioItem1.getItemCode(), is("10099"));
		assertThat("Check Set Item Quantity", folioItem1.getItemQuantity(), is(1));
		assertThat("Check the Item Unit Price", folioItem1.getUnitPrice(), is((float) 5000.0));
		assertThat("Check Set Amount Claimed", folioItem1.getAmountClaimed(), is((float) 5000.0));
		//assertThat("Check Set Approval Refference Number", folioItem1.getApprovalRefNo(), is(visit.getPatient().getGivenName()));
		
		assertThat("Check Set Creator", folioItem1.getCreatedBy(), is(visit.getCreator().getDisplayString()));
		assertThat("Check Set Created Date", folioItem1.getDateCreated() != null, is(true));
		assertThat("Check Last Modified By", folioItem1.getLastModifiedBy(), is(visit.getCreator().getDisplayString()));
		assertThat("Check Last Modified Date", folioItem1.getLastModified() != null, is(true));
		
		assertThat("Check Set Folio ID", folioItem2.getFolioID(), is(visit.getUuid()));
		assertThat("Check Set Item ID", folioItem2.getFolioItemID() != null, is(true));
		assertThat("Check Set Folio Item Code", folioItem2.getItemCode(), is("10001"));
		assertThat("Check Set Item Quantity", folioItem2.getItemQuantity(), is(1));
		assertThat("Check the Item Unit Price", folioItem2.getUnitPrice(), is((float) 10000));
		assertThat("Check Set Amount Claimed", folioItem2.getAmountClaimed(), is((float) 10000));
		//assertThat("Check Set Approval Refference Number", folioItem1.getApprovalRefNo(), is(visit.getPatient().getGivenName()));
		
		assertThat("Check Set Creator", folioItem2.getCreatedBy(), is(visit.getCreator().getDisplayString()));
		assertThat("Check Set Created Date", folioItem2.getDateCreated() != null, is(true));
		assertThat("Check Last Modified By", folioItem2.getLastModifiedBy(), is(visit.getCreator().getDisplayString()));
		assertThat("Check Last Modified Date", folioItem2.getLastModified() != null, is(true));
		
	}
	
	@Test
	public void testInsuranceBillCreation() throws Exception {
		//Given
		AdministrationService adminService = Context.getService(AdministrationService.class);
		adminService.setGlobalProperty(NHIFConfig.ALLOW_ONLINE_VERIFICATION, "true");
		
		InsuranceService insuranceService = Context.getService(InsuranceService.class);
		insuranceService.syncPriceList();
		ConceptService conceptService = Context.getService(ConceptService.class);
		Concept concept = conceptService.getConceptByName("NHIF:1001");
		addInitialPricing();
		Visit visit = getNHIFVisit(concept.getUuid());
		visit.setStopDatetime(new Date());
		VisitService visitService = Context.getVisitService();
		visitService.saveVisit(visit);
		
		//When
		List<Invoice> invoices = billingService.getPatientsInvoices(visit.getPatient().getUuid());
		Invoice invoice = invoices.get(0);
		
		//Then
		assertThat("Should be Insurance", invoice.getPaymentMode().getName().getName(), is("INSURANCE"));
	}
	
	@Test
	public void testPriceListSyncing() throws Exception {
		//Given
		
		//When
		SyncResult syncResults = this.basicNHIFService.syncPriceList();
		//Then
		assertThat("Should Ignore 1", syncResults.getIgnored().size(), is(0));
		assertThat("Should Create 3", syncResults.getCreated().size(), is(10));
		ICareService iCareService = Context.getService(ICareService.class);
		List<ItemPrice> itemPrices = iCareService.getItemPrices();
		assertThat("Should Contain item prices", itemPrices.size(), is(13));
		for (ItemPrice itemPrice : itemPrices) {
			if (itemPrice.getPaymentScheme().getName().getName().equals("NHIF:1003") && itemPrice.getItem().getId() == 2) {
				assertThat("Should Have Payable", itemPrice.getPayable(), is(30000.0));
			}
			if (itemPrice.getPaymentScheme().getName().getName().equals("NHIF:1004") && itemPrice.getItem().getId() == 2) {
				assertThat("Should Have Payable", itemPrice.getPayable(), is(20000.0));
			}
		}
		
		ConceptService conceptService = Context.getService(ConceptService.class);
		Concept concept = conceptService.getConceptByName("NHIF:1001");
		assertThat("Should Have Scheme", concept != null, is(true));
		Concept concept2 = conceptService.getConceptByName("NHIF:1002");
		assertThat("Should Have Scheme", concept != null, is(true));
		
		NHIFDrug dignocaine = null;
		for (Drug drug : conceptService.getAllDrugs()) {
			if (drug.getName().equals("Lignocaine 20gm")) {
				dignocaine = new NHIFDrug(drug);
			}
		}
		assertThat("Should Have Scheme", dignocaine != null, is(true));
		assertThat("Should Have Item Code", dignocaine.hasItemCode(), is(true));
		//assertThat("Should Have Dose Unit", dignocaine.hasDosageForm(), is(true));
		
		//assertThat("Should Have Dose Unit", dignocaine.getDrug().getDosageForm() != null, is(true));
	}
	
	@Test
	public void testClaim() throws Exception {
		//Given
		AdministrationService adminService = Context.getService(AdministrationService.class);
		adminService.setGlobalProperty(NHIFConfig.ALLOW_ONLINE_VERIFICATION, "true");
		adminService.setGlobalProperty(NHIFConfig.ALLOW_ONLINE_CLAIM, "true");
		
		VisitService visitService = Context.getVisitService();
		VisitAttributeType visitAttributeType = new VisitAttributeType();
		visitAttributeType.setName("Insurance Claim Status");
		visitAttributeType.setMaxOccurs(5);
		visitAttributeType.setDatatypeClassname("org.openmrs.customdatatype.datatype.FreeTextDatatype");
		visitService.saveVisitAttributeType(visitAttributeType);
		adminService.setGlobalProperty(ICareConfig.INSURANCE_CLAIM_STATUS, visitAttributeType.getUuid());
		
		InsuranceService insuranceService = Context.getService(InsuranceService.class);
		insuranceService.syncPriceList();
		ConceptService conceptService = Context.getService(ConceptService.class);
		Concept concept = conceptService.getConceptByName("NHIF:1001");
		
		addInitialPricing();
		Visit visit = getNHIFVisit(concept.getUuid());
		visit.setStopDatetime(new Date());
		
		visitService.saveVisit(visit);
		
		//When
		insuranceService.claim(visit);
		
		//Then
		VisitWrapper visitWrapper = new VisitWrapper(visitService.getVisitByUuid(visit.getUuid()));
		
		//String claimStatus = visitWrapper.getInsuranceClaimStatus();
		assertThat("Should be Claimed", visitWrapper.getInsuranceClaimStatus(), is("CLAIMED"));
	}
	
	@Test
	public void testOfflineClaim() throws Exception {
		//Given
		AdministrationService adminService = Context.getService(AdministrationService.class);
		adminService.setGlobalProperty(NHIFConfig.ALLOW_ONLINE_VERIFICATION, "false");
		adminService.setGlobalProperty(NHIFConfig.ALLOW_ONLINE_CLAIM, "false");
		
		VisitService visitService = Context.getVisitService();
		VisitAttributeType visitAttributeType = new VisitAttributeType();
		visitAttributeType.setName("Insurance Claim Status");
		visitAttributeType.setMaxOccurs(5);
		visitAttributeType.setDatatypeClassname("org.openmrs.customdatatype.datatype.FreeTextDatatype");
		visitService.saveVisitAttributeType(visitAttributeType);
		adminService.setGlobalProperty(ICareConfig.INSURANCE_CLAIM_STATUS, visitAttributeType.getUuid());
		
		InsuranceService insuranceService = Context.getService(InsuranceService.class);
		insuranceService.syncPriceList();
		ConceptService conceptService = Context.getService(ConceptService.class);
		Concept concept = conceptService.getConceptByName("NHIF:1001");
		
		addInitialPricing();
		Visit visit = getNHIFVisit(concept.getUuid());
		visit.setStopDatetime(new Date());
		
		visitService.saveVisit(visit);
		
		//When
		insuranceService.claim(visit);
		
		//Then
		Visit newVisit = visitService.getVisitByUuid(visit.getUuid());
		
		//String claimStatus = visitWrapper.getInsuranceClaimStatus();
		assertThat("Should be Claimed", newVisit.getStopDatetime() != null, is(true));
	}
	
	@Test
	public void testReconsiliation() throws Exception {
		//Given
		AdministrationService adminService = Context.getService(AdministrationService.class);
		adminService.setGlobalProperty(NHIFConfig.ALLOW_ONLINE_VERIFICATION, "true");
		adminService.setGlobalProperty(NHIFConfig.ALLOW_ONLINE_CLAIM, "true");
		
		VisitService visitService = Context.getVisitService();
		VisitAttributeType visitAttributeType = new VisitAttributeType();
		visitAttributeType.setName("Insurance Claim Status");
		visitAttributeType.setMaxOccurs(5);
		visitAttributeType.setDatatypeClassname("org.openmrs.customdatatype.datatype.FreeTextDatatype");
		visitService.saveVisitAttributeType(visitAttributeType);
		adminService.setGlobalProperty(ICareConfig.INSURANCE_CLAIM_STATUS, visitAttributeType.getUuid());
		
		InsuranceService insuranceService = Context.getService(InsuranceService.class);
		insuranceService.syncPriceList();
		ConceptService conceptService = Context.getService(ConceptService.class);
		Concept concept = conceptService.getConceptByName("NHIF:1001");
		
		addInitialPricing();
		Visit visit = getNHIFVisit(concept.getUuid());
		visit.setStopDatetime(new Date());
		
		visitService.saveVisit(visit);
		
		//When
		insuranceService.claim(visit);
		
		//Then
		VisitWrapper visitWrapper = new VisitWrapper(visitService.getVisitByUuid(visit.getUuid()));
		
		//String claimStatus = visitWrapper.getInsuranceClaimStatus();
		assertThat("Should be Claimed", visitWrapper.getInsuranceClaimStatus(), is("CLAIMED"));
	}
	
	@Test
	public void testGettingClaim() throws Exception {
		//Given
		AdministrationService adminService = Context.getService(AdministrationService.class);
		adminService.setGlobalProperty(NHIFConfig.ALLOW_ONLINE_VERIFICATION, "false");
		
		InsuranceService insuranceService = Context.getService(InsuranceService.class);
		insuranceService.syncPriceList();
		ConceptService conceptService = Context.getService(ConceptService.class);
		Concept concept = conceptService.getConceptByName("NHIF:1001");
		
		addInitialPricing();
		Visit visit = getNHIFVisit(concept.getUuid());
		visit.setStopDatetime(new Date());
		VisitService visitService = Context.getVisitService();
		visitService.saveVisit(visit);
		
		//When
		Claim claim = insuranceService.getClaim(visit);
	}
	
	public void addInitialPricing() {
		ConceptService conceptService = Context.getService(ConceptService.class);
		Concept concept = conceptService.getConceptByName("NHIF:1001");
		
		ICareService iCareService = Context.getService(ICareService.class);
		ItemPrice itemPrice = new ItemPrice();
		itemPrice.setPaymentScheme(concept);
		Item item = iCareService.getItemByConceptUuid(conceptService.getConceptByName("Registration Fee").getUuid());
		itemPrice.setItem(item);
		itemPrice.setPaymentScheme(concept);
		itemPrice.setPaymentType(conceptService.getConceptByName("INSURANCE"));
		itemPrice.setPrice(5000.0);
		iCareService.saveItemPrice(itemPrice);
		
		ItemPrice itemPrice2 = new ItemPrice();
		itemPrice2.setPaymentScheme(concept);
		Item item2 = iCareService.getItemByConceptUuid(conceptService.getConceptByName("General OPD").getUuid());
		itemPrice2.setItem(item2);
		itemPrice2.setPaymentScheme(concept);
		itemPrice2.setPaymentType(conceptService.getConceptByName("INSURANCE"));
		itemPrice2.setPrice(10000.0);
		iCareService.saveItemPrice(itemPrice2);
	}
	
	public Visit getInsuranceVisit() {
		VisitService visitService = Context.getService(VisitService.class);
		AdministrationService adminService = Context.getAdministrationService();
		PatientService patientService = Context.getService(PatientService.class);
		Patient patient = patientService.getPatientByUuid("993c46d2-5007-45e8-9512-969300717761");
		patient.setDateCreated(new Date());
		//Given
		Visit visit = new Visit();
		visit.setPatient(patient);
		visit.setStartDatetime(new Date());
		visit.setVisitType(visitService.getAllVisitTypes().get(0));
		
		//Setting Service visit attribute
		VisitAttribute serviceVisitAttribute = new VisitAttribute();
		serviceVisitAttribute.setAttributeType(visitService
		        .getVisitAttributeTypeByUuid("298b75eb-5345-11e8-9c7c-40b0yt63cfee"));
		serviceVisitAttribute.setValue("e721ec30-5344-11e8-9c7c-40b6etw3cfee");
		visit.addAttribute(serviceVisitAttribute);
		
		//Setting Payment Scheme visit attribute
		VisitAttribute schemeVisitAttribute = new VisitAttribute();
		schemeVisitAttribute.setAttributeType(visitService.getVisitAttributeTypeByUuid(adminService
		        .getGlobalProperty(ICareConfig.PAYMENT_SCHEME_ATTRIBUTE)));
		schemeVisitAttribute.setValue(Context.getConceptService().getConceptByName("NHIF:1001").getUuid());
		visit.addAttribute(schemeVisitAttribute);
		
		//Setting Payment Type visit attribute
		VisitAttribute paymentTypeVisitAttribute = new VisitAttribute();
		paymentTypeVisitAttribute.setAttributeType(visitService
		        .getVisitAttributeTypeByUuid("298b75eb-er45-12e8-9c7c-40b0yt63cfee"));
		paymentTypeVisitAttribute.setValue("e721ec30-mfy4-11e8-ie7c-40b6etw379ee");
		visit.addAttribute(paymentTypeVisitAttribute);
		
		//AdministrationService adminService = Context.getService(AdministrationService.class);
		//adminService.setGlobalProperty(ICareConfig.INSRURANCE_ATTRIBUTE, "01099");
		
		//Setting Insurance visit attribute
		VisitAttribute insuranceVisitAttribute = new VisitAttribute();
		insuranceVisitAttribute.setAttributeType(visitService.getVisitAttributeTypeByUuid(adminService
		        .getGlobalProperty(ICareConfig.INSURANCE_ATTRIBUTE)));
		insuranceVisitAttribute.setValue("e721ec30-m1y4-11e8-ie7c-40b69mdy79ee");
		visit.addAttribute(insuranceVisitAttribute);
		
		//Setting Insurance ID visit attribute
		VisitAttribute insuranceIDVisitAttribute = new VisitAttribute();
		insuranceIDVisitAttribute.setAttributeType(visitService.getVisitAttributeTypeByUuid(adminService
		        .getGlobalProperty(ICareConfig.INSURANCE_ID_ATTRIBUTE)));
		insuranceIDVisitAttribute.setValue("102687123000");
		visit.addAttribute(insuranceIDVisitAttribute);
		
		//Setting Insurance Authorization Number visit attribute
		VisitAttribute insuranceAuthNumberVisitAttribute = new VisitAttribute();
		insuranceAuthNumberVisitAttribute.setAttributeType(visitService.getVisitAttributeTypeByUuid(adminService
		        .getGlobalProperty(ICareConfig.INSURANCE_AUTHORIZATION_ATTRIBUTE)));
		insuranceAuthNumberVisitAttribute.setValue("102687123000");
		visit.addAttribute(insuranceAuthNumberVisitAttribute);
		
		adminService.setGlobalProperty(NHIFConfig.ALLOW_ONLINE_VERIFICATION, "false");
		
		return visitService.saveVisit(visit);
	}
	
	public void generatePaymentScheme() {
		ConceptService conceptService = Context.getService(ConceptService.class);
		Concept concept = new Concept();
		concept.setSet(false);
		concept.setDatatype(conceptService.getConceptDatatypeByUuid(ConceptDatatype.TEXT_UUID));
		ConceptClass pSchemeConceptClass = conceptService.getConceptClassByName("Payment Scheme");
		
		concept.setConceptClass(pSchemeConceptClass);
		
		ConceptName conceptName = new ConceptName();
		conceptName.setName("NHIF:1001");
		conceptName.setConceptNameType(ConceptNameType.FULLY_SPECIFIED);
		conceptName.setLocale(Locale.ENGLISH);
		concept.setPreferredName(conceptName);
		
		conceptService.saveConcept(concept);
		
		Concept NHIFconcept = conceptService.getConceptByName("NHIF");
		NHIFconcept.addSetMember(concept);
		conceptService.saveConcept(NHIFconcept);
		
		ICareService iCareService = Context.getService(ICareService.class);
		Item item = new Item();
		item.setConcept(conceptService.getConceptByUuid("e721ec30-5344-11e8-9c7c-40b6etw3cfee"));
		item = iCareService.saveItem(item);
		
		ItemPrice itemPrice = new ItemPrice();
		itemPrice.setPaymentScheme(concept);
		itemPrice.setPaymentType(conceptService.getConceptByUuid("e721ec30-m1y4-11e8-ie7c-40b69mdy79ee"));
		itemPrice.setItem(item);
		itemPrice.setPrice(10000.0);
		iCareService.saveItemPrice(itemPrice);
		
		Item item2 = new Item();
		item2.setConcept(conceptService.getConceptByUuid("e721ec30-mfy4-11e8-ie7c-40b69mdy79ee"));
		iCareService.saveItem(item2);
		
		ItemPrice itemPrice2 = new ItemPrice();
		itemPrice2.setPaymentScheme(concept);
		itemPrice2.setPaymentType(conceptService.getConceptByUuid("e721ec30-m1y4-11e8-ie7c-40b69mdy79ee"));
		itemPrice2.setItem(item2);
		itemPrice2.setPrice(10000.0);
		iCareService.saveItemPrice(itemPrice2);
	}
	
	@Test
	public void testACreatingInvoiceOnVisit() throws VisitInvalidException, ConfigurationException {
		/**
		 * Testing creation of invoice
		 */
		
		//Given
		generatePaymentScheme();
		Visit visit = getInsuranceVisit();
		
		//When
		List<Invoice> invoices = billingService.getPendingInvoices(visit.getPatient().getUuid());
		
		//Then
		
		Invoice invoice = invoices.get(0);
		MatcherAssert.assertThat("Invoice items have been created", invoice.getInvoiceItems().size(), is(2));
		int countItems = 0;
		for (InvoiceItem invoiceItem : invoice.getInvoiceItems()) {
			if (invoiceItem.getItem().getConcept().getDisplayString().equals("Registration Fee")) {
				MatcherAssert.assertThat("Registration Fee is 10000", invoiceItem.getPrice(), is(10000.0));
				countItems++;
			} else if (invoiceItem.getItem().getConcept().getDisplayString().equals("OPD Service")) {
				MatcherAssert.assertThat("OPD Service Fee is 10000", invoiceItem.getPrice(), is(10000.0));
				countItems++;
			}
			MatcherAssert.assertThat("Invoice quantity is 1", invoiceItem.getQuantity(), is(1.0));
		}
		MatcherAssert.assertThat("Two items have been found", countItems, is(2));
	}
}
