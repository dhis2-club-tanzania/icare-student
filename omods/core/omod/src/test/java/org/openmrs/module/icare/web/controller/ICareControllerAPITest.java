package org.openmrs.module.icare.web.controller;

import org.codehaus.jackson.map.ObjectMapper;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.openmrs.*;
import org.openmrs.api.*;
import org.openmrs.api.context.Context;
import org.openmrs.module.icare.ICareConfig;
import org.openmrs.module.icare.billing.models.InvoiceItem;
import org.openmrs.module.icare.billing.services.BillingService;
import org.openmrs.module.icare.core.ICareService;
import org.openmrs.module.icare.core.Item;
import org.openmrs.module.icare.core.Message;
import org.openmrs.module.icare.report.dhis2.DHIS2Config;
import org.openmrs.module.icare.web.controller.core.BaseResourceControllerTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.web.bind.annotation.RequestMethod;

import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

import javax.servlet.http.HttpServletResponse;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.*;

public class ICareControllerAPITest extends BaseResourceControllerTest {
	
	//@Autowired
	//BillingService billingService;
	
	@Before
	public void setUp() throws SQLException, ClassNotFoundException {
		initializeInMemoryDatabase();
		executeDataSet("billing-data.xml");
		this.startUp();
	}
	
	@Test
	public void testIdGeneration() throws Exception {
		
		String dto = this.readFile("dto/core/id-generator.json");
		Map<String, Object> idDtop = (new ObjectMapper()).readValue(dto, Map.class);
		AdministrationService adminService = Context.getService(AdministrationService.class);
		adminService.setGlobalProperty(DHIS2Config.facilityCode, "987398345-6");
		
		adminService.setGlobalProperty(ICareConfig.PATIENT_ID_FORMAT, "GP{" + DHIS2Config.facilityCode
		        + "}/D{YYYYMMDD}/COUNT");
		MockHttpServletRequest newGetRequest = newPostRequest("icare/idgen", idDtop);
		MockHttpServletResponse handle = handle(newGetRequest);
		System.out.println("Date Wise:" + handle.getContentAsString());
		
		adminService
		        .setGlobalProperty(ICareConfig.PATIENT_ID_FORMAT, "GP{" + DHIS2Config.facilityCode + "}/D{YYYYMM}/COUNT");
		newGetRequest = newPostRequest("icare/idgen", idDtop);
		handle = handle(newGetRequest);
		System.out.println("Monthly ID:" + handle.getContentAsString());
		
		adminService.setGlobalProperty(ICareConfig.PATIENT_ID_FORMAT, "GP{" + DHIS2Config.facilityCode + "}/D{YYYY}/COUNT");
		newGetRequest = newPostRequest("icare/idgen", idDtop);
		handle = handle(newGetRequest);
		System.out.println("Yearly ID:" + handle.getContentAsString());
	}
	
	@Test
	public void generateCode() throws Exception {
		
		MockHttpServletRequest newGetRequest = newGetRequest("icare/codegen", new Parameter("count", "1"), new Parameter(
		        "metadataType", "requisition"), new Parameter("globalProperty", "iCARE110-TEST-OSDH-9beb-d30dcfc0c632"));
		MockHttpServletResponse response = handle(newGetRequest);
		System.out.println(response.getContentAsString());
		
	}
	
	@Test
	public void testCreatingItem() throws Exception {
		
		String dto = this.readFile("dto/item-create-dto.json");
		Map<String, Object> item = (new ObjectMapper()).readValue(dto, Map.class);
		
		MockHttpServletRequest newPostRequest = newPostRequest("icare/item", item);
		MockHttpServletResponse handle = handle(newPostRequest);
		
		Map<String, Object> map = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		assertThat("Should have item uuid", map.get("uuid") != null, is(true));
		MockHttpServletRequest newGetRequest = newGetRequest("icare/item");
		handle = handle(newGetRequest);
		Map<String, Object> results = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		List<Map<String, Object>> maps = (List) results.get("results");
		assertThat("Should return a 9 items", maps.size(), is(9));
		
		newGetRequest = newGetRequest("icare/item", new Parameter("q", "opd"));
		handle = handle(newGetRequest);
		results = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		maps = (List) results.get("results");
		assertThat("Should return a 3 items", maps.size(), is(3));
		
		newGetRequest = newGetRequest("icare/item", new Parameter("q", "asp"));
		handle = handle(newGetRequest);
		results = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		maps = (List) results.get("results");
		assertThat("Should return a 2 items", maps.size(), is(2));
		
		newGetRequest = newGetRequest("icare/item", new Parameter("q", "opd servi"));
		handle = handle(newGetRequest);
		String res = handle.getContentAsString();
		System.out.println(res);
		results = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		maps = (List) results.get("results");
		assertThat("Should return a 3 items", maps.size(), is(1));
	}
	
	@Test
	public void testCreatingDrugItem() throws Exception {
		String dto = this.readFile("dto/item-drug-create-dto.json");
		Map<String, Object> item = (new ObjectMapper()).readValue(dto, Map.class);
		MockHttpServletRequest newPostRequest = newPostRequest("icare/item", item);
		MockHttpServletResponse handle = handle(newPostRequest);
		
		Map<String, Object> map = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		assertThat("Should have item uuid", map.get("uuid") != null, is(true));
		MockHttpServletRequest newGetRequest = newGetRequest("icare/item");
		handle = handle(newGetRequest);
		String contentString = handle.getContentAsString();
		Map<String, Object> results = (new ObjectMapper()).readValue(contentString, Map.class);
		List<Map<String, Object>> maps = (List) results.get("results");
		assertThat("Should return a 8 items", maps.size(), is(9));
		boolean found = false;
		for (Map<String, Object> itemMap : maps) {
			if (itemMap.get("unit").equals("DrugUnits")) {
				found = true;
				assertThat("Should have drug", itemMap.get("drug") != null, is(true));
				assertThat("Should have drug uuid", (String) ((Map) itemMap.get("drug")).get("uuid"),
				    is("3cfcf118-931c-46f7-8ff6-7b876f0d4202"));
				assertThat("Should have drug name", (String) ((Map) itemMap.get("drug")).get("display"), is("Triomune-30"));
			}
		}
		assertThat("Drug was found in test", found, is(true));
		
		System.out.println(Context.getConceptService().getDrugByUuid("3cfcf118-931c-46f7-8ff6-7b876f0d4202").getConcept()
		        .getUuid());
		System.out.println(Context.getService(ICareService.class).getItems());
		for (Item i : Context.getService(ICareService.class).getItems()) {
			if (i.getDrug() != null) {
				System.out.println("Found Drug Concept:" + i.getDrug().getConcept().getUuid());
			}
		}
		newGetRequest = newGetRequest("icare/itemByConcept/15f83cd6-64e9-4e06-a5f9-364d3b14a43d");
		handle = handle(newGetRequest);
		contentString = handle.getContentAsString();
		System.out.println(contentString);
	}
	
	@Test
	public void testCreatingItemPrice() throws Exception {
		String dto = this.readFile("dto/item-price-create-dto.json");
		Map<String, Object> item = (new ObjectMapper()).readValue(dto, Map.class);
		
		MockHttpServletRequest newPostRequest = newPostRequest("icare/itemprice", item);
		MockHttpServletResponse handle = handle(newPostRequest);
		
		Map<String, Object> map = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		assertThat("Show Item UUID", ((Map) map.get("item")).get("uuid").toString(),
		    is("b21bhsld-9ab1-4b57-8a89-c0bf2580a68d"));
		assertThat("Show Item Name", ((Map) map.get("item")).get("display").toString(), is("OPD Service"));
		
		assertThat("Show Payment Type UUID", ((Map) map.get("paymentType")).get("uuid").toString(),
		    is("e7jnec30-5344-11e8-ie7c-40b6etw3cfee"));
		assertThat("Show Payment Type Name", ((Map) map.get("paymentType")).get("display").toString(), is("CASH"));
		
		assertThat("Show Payment Scheme UUID", ((Map) map.get("paymentScheme")).get("uuid").toString(),
		    is("e721ec30-5344-11e8-ie7c-40b6etw379ee"));
		assertThat("Show Payment Scheme Name", ((Map) map.get("paymentScheme")).get("display").toString(), is("Fast"));
		
		MockHttpServletRequest newGetRequest = newGetRequest("icare/itemprice");
		handle = handle(newGetRequest);
		Map<String, Object> results = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		List<Map<String, Object>> maps = (List) results.get("results");
		assertThat("Should return a 3 item Prices", maps.size(), is(4));
	}
	
	@Test
	@Ignore
	public void testSendMessage() throws Exception {
		AdministrationService adminService = Context.getService(AdministrationService.class);
		adminService.setGlobalProperty(ICareConfig.MESSAGE_PHONE_NUMBER, "0718026490");
		String dto = this.readFile("dto/send-message-single-dto.json");
		Map<String, Object> item = (new ObjectMapper()).readValue(dto, Map.class);
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ");
		item.put("dateTime", dateFormat.format(new Date()));
		item.put("id", UUID.randomUUID());
		System.out.println(item.get("dateTime"));
		
		ICareService iCareService = spy(Context.getService(ICareService.class));
		//ICareServiceImpl iCareServiceImpl = mock(ICareServiceImpl.class);
		when(iCareService.sendMessageRequest(new Message())).thenReturn(new Message());
		
		MockHttpServletRequest newPostRequest = newPostRequest("icare/message", item);
		MockHttpServletResponse handle = handle(newPostRequest);
		
		Map<String, Object> map = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		
	}
	
	@Test
	public void gettingDrugItemPrice() throws Exception {
		
		MockHttpServletRequest newGetRequest = newGetRequest("icare/itemprice", new Parameter("visitUuid",
		        "298b75eb-er45-12e8-9c7c-42b0yt63cfepj"), new Parameter("drugUuid", "c365e560-c3ec-11e3-9c1a-0800200c9a26"));
		MockHttpServletResponse handle = handle(newGetRequest);
		Map<String, Object> results = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		Map<String, Object> maps = (Map<String, Object>) results.get("results");
		
		System.out.println(maps.get("price"));
		
		assertThat("Should return a 3 item Prices", maps.get("price").equals(3000.0));
		
	}
	
	@Test
	@Ignore
	public void testSendMessages() throws Exception {
		AdministrationService adminService = Context.getService(AdministrationService.class);
		adminService.setGlobalProperty(ICareConfig.MESSAGE_PHONE_NUMBER, "0718026490");
		String dto = this.readFile("dto/send-message-double-dto.json");
		List<Map<String, Object>> items = (new ObjectMapper()).readValue(dto, List.class);
		for (Map item : items) {
			DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ");
			item.put("dateTime", dateFormat.format(new Date()));
			item.put("id", UUID.randomUUID());
			System.out.println(item.get("dateTime"));
		}
		
		MockHttpServletRequest newPostRequest = newPostRequest("icare/messages", items);
		MockHttpServletResponse handle = handle(newPostRequest);
		
		List<Map<String, Object>> map = (new ObjectMapper()).readValue(handle.getContentAsString(), List.class);
		
	}
	
	@Test
	//	@Ignore("Already testing using advice")
	public void testVisitCreation() throws Exception {
		
		//Given
		//Map<String, Object> result = getResourceDTOMap("visit-create-dto");
		Map<String, Object> result = getResourceDTOMap("lab-order-create-dto");
		PatientService patientService = Context.getService(PatientService.class);
		Patient patient = patientService.getPatientByUuid((String) result.get("patient"));
		Visit visit = this.getVisit(patient);
		visit = Context.getVisitService().getVisitByUuid(visit.getUuid());
		for (Encounter encounter : visit.getEncounters()) {
			System.out.println(encounter);
			for (Order order : encounter.getOrders()) {
				System.out.println("orderTypeUuid:" + order.getOrderType().getUuid());
			}
		}
		//When
		MockHttpServletRequest newGetRequest = newGetRequest("icare/visit", new Parameter("orderTypeUuid",
		        "2msir5eb-5345-11e8-9922-40b034c3cfee"));
		
		//Then
		MockHttpServletResponse handle = handle(newGetRequest);
		String visitData = handle.getContentAsString();
		Map visitMap = (new ObjectMapper()).readValue(visitData, Map.class);
		List<Map> visitDetails = (List<Map>) visitMap.get("results");
		System.out.println("visitDetails.size():" + visitDetails.size());
		
		//TODO Check if it is actually what is expected
		assertThat("Should return a visit", visitDetails.size() == 2);
		
		newGetRequest = newGetRequest("icare/visit", new Parameter("orderTypeUuid", "2msir5eb-5345-11e8-9922-40b034c3cfee"),
		    new Parameter("q", "hsdfhe"));
		
		//Then
		handle = handle(newGetRequest);
		visitData = handle.getContentAsString();
		visitMap = (new ObjectMapper()).readValue(visitData, Map.class);
		visitDetails = (List<Map>) visitMap.get("results");
		assertThat("Should not return a visit", visitDetails.size() == 0);
		
		newGetRequest = newGetRequest("icare/visit", new Parameter("orderTypeUuid", "2msir5eb-5345-11e8-9922-40b034c3cfee"),
		    new Parameter("q", "hermione"));
		handle = handle(newGetRequest);
		visitData = handle.getContentAsString();
		visitMap = (new ObjectMapper()).readValue(visitData, Map.class);
		visitDetails = (List<Map>) visitMap.get("results");
		assertThat("Should return a visit", visitDetails.size() == 1);
		
		newGetRequest = newGetRequest("icare/visit", new Parameter("orderTypeUuid", "2msir5eb-5345-11e8-9922-40b034c3cfee"),
		    new Parameter("q", "hermione jean"));
		handle = handle(newGetRequest);
		visitData = handle.getContentAsString();
		visitMap = (new ObjectMapper()).readValue(visitData, Map.class);
		visitDetails = (List<Map>) visitMap.get("results");
		System.out.println(visitDetails);
		assertThat("Should return a visit", visitDetails.size() == 1);
		
	}
	
	@Test
	public void testGetVisitAttribute() throws Exception {
		
		//Get visits by attribute value references
		MockHttpServletRequest newGetRequest = newGetRequest("icare/visit", new Parameter("attributeValueReference", "123"));
		MockHttpServletResponse handle = handle(newGetRequest);
		String visitData = handle.getContentAsString();
		Map visitMap = (new ObjectMapper()).readValue(visitData, Map.class);
		List<Map> visitDetails = (List<Map>) visitMap.get("results");
		assertThat("Should return a visit", visitDetails.size() == 1);
		
		//Get searched patient with visit attribute reference
		newGetRequest = newGetRequest("icare/visit", new Parameter("attributeValueReference", "123"), new Parameter("q",
		        "Harry"));
		handle = handle(newGetRequest);
		visitData = handle.getContentAsString();
		visitMap = (new ObjectMapper()).readValue(visitData, Map.class);
		visitDetails = (List<Map>) visitMap.get("results");
		assertThat("Should return a visit", visitDetails.size() == 1);
		
	}
	
	@Test
	public void testGetPatientsByPaymentStatus() throws Exception {
		
		//Get visits by Payment Status
		//PAID
		MockHttpServletRequest newGetRequest = newGetRequest("icare/visit", new Parameter("orderTypeUuid",
		        "2msir5eb-5345-11e8-9922-40b034c3cfee"), new Parameter("attributeValueReference", "123"), new Parameter(
		        "OrderBy", "ENCOUNTER"), new Parameter("orderByDirection", "ASC"), new Parameter("paymentStatus", "PAID"),
		    new Parameter("q", "Harry"));
		
		MockHttpServletResponse handle = handle(newGetRequest);
		String visitData = handle.getContentAsString();
		Map visitMap = (new ObjectMapper()).readValue(visitData, Map.class);
		List<Map> visitDetails = (List<Map>) visitMap.get("results");
		System.out.println(visitDetails.size());
		assertThat("Should return a visit", visitDetails.size() == 1);
		
		//PENDING
		//		 When testing for pending will return 0 since there are no pending payments
		newGetRequest = newGetRequest("icare/visit", new Parameter("paymentStatus", "PENDING"));
		handle = handle(newGetRequest);
		visitData = handle.getContentAsString();
		visitMap = (new ObjectMapper()).readValue(visitData, Map.class);
		visitDetails = (List<Map>) visitMap.get("results");
		System.out.println(visitDetails.size());
		assertThat("Should return a visit", visitDetails.size() == 0);
		
	}
	
	@Test
	@Ignore(value = "Changed to Advice")
	public void testLabOrderCreation() throws Exception {
		
		//Given
		Map<String, Object> result = getResourceDTOMap("lab-order-create-dto");
		PatientService patientService = Context.getService(PatientService.class);
		Patient patient = patientService.getPatientByUuid((String) result.get("patient"));
		Visit visit = this.getVisit(patient);//createVisitWithBill(patient);
		
		EncounterService encounterService = Context.getService(EncounterService.class);
		Encounter encounter = encounterService.getEncountersByVisit(visit, true).get(0);
		result.put("encounter", encounter.getUuid());
		
		//When
		MockHttpServletRequest newGetRequest = newPostRequest("icare/laborder", result);
		MockHttpServletResponse handle = handle(newGetRequest);
		
		//Then
		Visit visit2 = (new ObjectMapper()).readValue(handle.getContentAsString(), Visit.class);
		assertThat("Should return a visit", visit2 != null);
	}
	
	@Test
	//	@Ignore(value = "Changed to Advice")
	public void testVisitDiagnosisCreation() throws Exception {
		
		//Given
		Map<String, Object> result = getResourceDTOMap("diagnosis-dto");
		System.out.println(result);
		//When
		MockHttpServletRequest newGetRequest = newPostRequest("icare/patientdiagnoses", result);
		MockHttpServletResponse handle = handle(newGetRequest);
		
		//Then
		Diagnosis diagnosis = (new ObjectMapper()).readValue(handle.getContentAsString(), Diagnosis.class);
		assertThat("Should create diagnosis", diagnosis != null);
	}
	
	@Test
	//@Ignore(value = "Changed to Advice")
	public void testDrugOrderRevision() throws Exception {
		//Given
		AdministrationService administrationService = Context.getAdministrationService();
		administrationService.setGlobalProperty(ICareConfig.ALLOW_NEGATIVE_STOCK, "true");
		OrderType orderType = new OrderType();
		orderType.setJavaClassName("org.openmrs.module.icare.billing.models.Prescription");
		orderType.setName("Prescription");
		Context.getOrderService().saveOrderType(orderType);
		
		Map<String, Object> result = getResourceDTOMap("core/ledger-add");
		MockHttpServletRequest newPostRequest = null;
		MockHttpServletResponse handle = null;
		newPostRequest = newPostRequest("store/ledger", result);
		handle = handle(newPostRequest);
		
		result = getResourceDTOMap("drug-create-dto");
		PatientService patientService = Context.getService(PatientService.class);
		Patient patient = patientService.getPatientByUuid((String) result.get("patient"));
		Visit visit = this.getVisit(patient);
		
		EncounterService encounterService = Context.getService(EncounterService.class);
		Encounter encounter = encounterService.getEncountersByVisit(visit, false).get(0);
		result.put("encounter", encounter.getUuid());
		
		//When
		MockHttpServletRequest newGetRequest = newPostRequest("icare/prescription", result);
		handle = handle(newGetRequest);
		
		//Then
		Map<String, Object> orderResult = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		BillingService billingService = Context.getService(BillingService.class);
		InvoiceItem invoiceItem = billingService.getInvoiceItemByOrder(Context.getOrderService().getOrderByUuid(
		    (String) orderResult.get("uuid")));
		//		System.out.println("Here:" + invoiceItem);
		assertThat("Should return a visit", orderResult != null);
		
		Map<String, Object> dispensing = new HashMap<String, Object>();
		System.out.println(orderResult);
		dispensing.put("location", "8d6c993e-c2cc-11de-8d13-0010c6dffd0f");
		dispensing.put("drugUuid", "05ec820a-d297-44e3-be6e-698531d9dd3f");
		dispensing.put("quantity", 2);
		newGetRequest = newPostRequest("store/drugOrder/" + orderResult.get("uuid") + "/dispense", dispensing);
		handle = handle(newGetRequest);
		
		orderResult = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		//		System.out.println("DISPENSED");
		//		System.out.println(orderResult);
		assertThat("Should return a visit", orderResult != null);
		assertThat("Should return a visit", orderResult.get("status").equals("DISPENSED"));
		
		newGetRequest = newGetRequest("store/orderStatus/" + visit.getUuid());
		handle = handle(newGetRequest);
		
		List<Map> orderStatus = (new ObjectMapper()).readValue(handle.getContentAsString(), List.class);
		assertThat("Should return a visit", orderStatus != null);
		assertThat("Should return a visit", orderStatus.size() == 1);
		assertThat("Should return a visit", orderStatus.get(0).get("status").equals("DISPENSED"));
		
		/*newGetRequest = newGetRequest("billing/invoice", new Parameter("patient", patient.getUuid()));
		handle = handle(newGetRequest);
		orderStatus = (new ObjectMapper()).readValue(handle.getContentAsString(), List.class);
		for(Map<String,Object> item:(List<Map>)orderStatus.get(0).get("items")){
			if(((Map)item.get("item")).get("name").equals("ASPIRIN")){

			}
		}*/
	}
	
	@Test
	//@Ignore(value = "Changed to Advice")
	public void testGettingVisits() throws Exception {
		
		//Given
		
		PatientService patientService = Context.getService(PatientService.class);
		Patient patient = patientService.getPatientByUuid("1f6959e5-d15a-4025-bb48-340ee9e2c58d");
		Visit newVisit = this.getVisit(patient);
		
		MockHttpServletRequest newGetRequest = newGetRequest("icare/visit", new Parameter("search", "110620-2/10891/21"));
		
		MockHttpServletResponse handle = handle(newGetRequest);
		Map<String, Object> patients = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		
		assertThat("Should return a patient visit ", ((List) patients.get("results")).size() > 0);
		
		newGetRequest = newGetRequest("icare/visit", new Parameter("orderTypeUuid", "2msir5eb-5345-11e8-9922-40b034c3cfee")
		//7bc34d5bde5d829d31cc8c22a455896a97085951
		//, new Parameter("fulfillerStatus","COMPL")
		);
		handle = handle(newGetRequest);
		
		Map<String, Object> orderResult = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		System.out.println((List) orderResult.get("results"));
		assertThat("Should return a visit", ((List) orderResult.get("results")).size() == 2);
		//Then
		
		for (Visit visit : Context.getVisitService().getAllVisits()) {
			if (visit.getStopDatetime() == null) {
				for (Encounter encounter : visit.getEncounters()) {
					for (Order order : encounter.getOrders()) {
						Context.getOrderService().updateOrderFulfillerStatus(order, Order.FulfillerStatus.COMPLETED,
						    "Completed");
					}
				}
			}
		}
		
		newGetRequest = newGetRequest("icare/visit", new Parameter("encounterTypeUuid",
		        "2msir5eb-5345-11e8-9c7c-40b034c3cfer"));
		handle = handle(newGetRequest);
		
		orderResult = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		assertThat("Should return one visit", ((List) orderResult.get("results")).size() == 1);
		
		newGetRequest = newGetRequest("icare/visit", new Parameter("orderTypeUuid", "2msir5eb-5345-11e8-9922-40b034c3cfee"),
		    new Parameter("fulfillerStatus", "COMPLETED"));
		handle = handle(newGetRequest);
		
		orderResult = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		assertThat("Should return a visit", ((List) orderResult.get("results")).size() > 0);
		
		newGetRequest = newGetRequest("icare/visit", new Parameter("visitAttributeTypeUuid",
		        "298b75eb-er45-12e8-9c7c-42b0yt63cfee"));
		handle = handle(newGetRequest);
		orderResult = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		assertThat("Should return a visit", ((List) orderResult.get("results")).size() == 1);
		
		newGetRequest = newGetRequest("icare/visit", new Parameter("sampleCategory", "RECEIVED"));
		handle = handle(newGetRequest);
		orderResult = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		assertThat("Should return a visit", ((List) orderResult.get("results")).size() == 1);
	}
	
	@Test
	public void testGettingVisitsBySample() throws Exception {
		
		MockHttpServletRequest newGetRequest = newGetRequest("icare/visit", new Parameter("sampleCategory", "RECEIVED"),
		    new Parameter("exclude", "List:[REJECTED,COMPLETED]"));
		MockHttpServletResponse handle = handle(newGetRequest);
		Map<String, Object> visit = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		assertThat("No visit is returned", ((List) visit.get("results")).size(), is(0));
		
	}
	
	@Test
	public void testGettingItemsByDepartment() throws Exception {
		
		MockHttpServletRequest newGetRequest = newGetRequest("icare/item", new Parameter("department",
		        "z8211c30-5e44-11e8-ie7c-50b6etwQqQee"));
		MockHttpServletResponse handle = handle(newGetRequest);
		Map<String, Object> results = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		List<Map<String, Object>> maps = (List) results.get("results");
		assertThat("Should return 1 item", maps.size(), is(1));
		
	}
	
	@Test
	public void testGettingItemsByDrug() throws Exception {
		
		MockHttpServletRequest newGetRequest = newGetRequest("icare/item", new Parameter("type", "DRUG"));
		MockHttpServletResponse handle = handle(newGetRequest);
		Map<String, Object> results = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		List<Map<String, Object>> maps = (List) results.get("results");
		assertThat("Should return 1 item", maps.size(), is(2));
	}
	
	@Test
	public void testGetConceptsWithItems() throws Exception {
		MockHttpServletRequest newGetRequest = newGetRequest("icare/conceptswithitems",
		    new Parameter("conceptClass", "test"), new Parameter("q", "t"));
		MockHttpServletResponse handle = handle(newGetRequest);
		Map<String, Object> results = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		List<Map<String, Object>> maps = (List) results.get("results");
		assertThat("Should return 1 item", maps.size(), is(2));
	}
	
	@Test
	public void testGettingStockableItems() throws Exception {
		
		MockHttpServletRequest newGetRequest = newGetRequest("icare/item", new Parameter("stockable", "true"));
		MockHttpServletResponse handle = handle(newGetRequest);
		Map<String, Object> results = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		List<Map<String, Object>> maps = (List) results.get("results");
		assertThat("Should return 1 item", maps.size(), is(4));
		
	}
	
	@Test
	public void testSearchConcepts() throws Exception {
		MockHttpServletRequest newGetRequest = newGetRequest("icare/concept", new Parameter("q", "opd"), new Parameter(
		        "conceptClass", "Test"), new Parameter("searchTermOfConceptSetToExclude", "PARENT_ONE"));
		MockHttpServletResponse handle = handle(newGetRequest);
		Map<String, Object> results = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		List<Map<String, Object>> maps = (List) results.get("results");
		//		System.out.println(maps);
		assertThat("Should return 0 item", maps.size(), is(0));
		
		newGetRequest = newGetRequest("icare/concept", new Parameter("q", "opd"), new Parameter("searchTerm", "SERVICE"),
		    new Parameter("detailed", "true"));
		handle = handle(newGetRequest);
		results = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		maps = (List) results.get("results");
		System.out.println(results);
		assertThat("Should return 1 item", maps.size(), is(1));
		
		//TODO: This test case has to be reviewed
		newGetRequest = newGetRequest("icare/concept",
		    new Parameter("conceptSource", "8387bbb9-52b9-11zz-b60d-880027ae421s"), new Parameter("referenceTermCode",
		            "CODEONE"));
		handle = handle(newGetRequest);
		results = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		maps = (List) results.get("results");
		//		System.out.println(maps);
		assertThat("Should return 2 item", maps.size(), is(2));
		
		newGetRequest = newGetRequest("icare/concept", new Parameter("q", "count"));
		handle = handle(newGetRequest);
		results = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		maps = (List) results.get("results");
		assertThat("Should return 1 item", maps.size(), is(1));
		
		newGetRequest = newGetRequest("icare/concept", new Parameter("conceptClass", "Test"));
		handle = handle(newGetRequest);
		results = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		maps = (List) results.get("results");
		assertThat("Should return 14 item", maps.size(), is(14));
	}
	
	@Test
	public void testSearchConceptReferenceTerm() throws Exception {
		MockHttpServletRequest newGetRequest = newGetRequest("icare/conceptreferenceterm", new Parameter("q", "cd4 term2"),
		    new Parameter("source", "00001827-639f-4cb4-961f-1e025bf80000"));
		MockHttpServletResponse handle = handle(newGetRequest);
		Map<String, Object> results = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		List<Map<String, Object>> maps = (List) results.get("results");
		assertThat("Should return 0 reference term", maps.size(), is(0));
		
		newGetRequest = newGetRequest("icare/conceptreferenceterm", new Parameter("q", ""));
		handle = handle(newGetRequest);
		results = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		System.out.println(results);
		maps = (List) results.get("results");
		assertThat("Should return 11 reference terms", maps.size(), is(11));
	}
	
	@Test
	public void testGetConceptSetsByConcept() throws Exception {
		MockHttpServletRequest newGetRequest = newGetRequest("icare/conceptsets", new Parameter("concept",
		        "15f83cd6-64e9-4e06-a5f9-364d3b14a43d"));
		MockHttpServletResponse handle = handle(newGetRequest);
		Map<String, Object> results = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		List<Map<String, Object>> maps = (List) results.get("results");
		System.out.println(maps);
		assertThat("Should return 0 concept set", maps.size(), is(0));
	}
	
	@Test
	public void testRetireAndUnRetireConcept() throws Exception {
		String dto = this.readFile("dto/concept_retire.json");
		Map<String, Object> retireObject = (new ObjectMapper()).readValue(dto, Map.class);
		MockHttpServletRequest newPostRequest = newPostRequest("icare/concept/e721ec30-mfy4-11e8-ie7c-40b69mdy79et/retire",
		    retireObject);
		MockHttpServletResponse handle = handle(newPostRequest);
		Map<String, Object> returnedResponse = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		System.out.println(returnedResponse);
		assertThat("Should return retired status equal to false", returnedResponse.get("retired").toString(), is("false"));
	}
	
	@Test
	public void testSavingConceptAnswers() throws Exception {
		String dto = this.readFile("dto/concept_answers.json");
		List<String> answers = (new ObjectMapper()).readValue(dto, List.class);
		MockHttpServletRequest newPostRequest = newPostRequest("icare/concept/e721ec30-mfy4-11e8-ie7c-40b69mdy79et/answers",
		    answers);
		MockHttpServletResponse handle = handle(newPostRequest);
		Map<String, Object> returnedResponse = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		//		System.out.println(returnedResponse);
		assertThat("Should return answers count as one", (Integer) returnedResponse.get("answersCount"), is(2));
	}
	
	@Test
	public void testGetLocations() throws Exception {
		MockHttpServletRequest newGetRequest = newGetRequest("icare/location", new Parameter("attributeType",
		        "15f83cd6-64e9-4e06-a5f9-364d3b14a43d"), new Parameter("value", "HFR_CODE"));
		MockHttpServletResponse handle = handle(newGetRequest);
		Map<String, Object> results = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		List<Map<String, Object>> maps = (List) results.get("results");
		//		System.out.println(maps);
		assertThat("Should return 0 Location", maps.size(), is(0));
	}
	
	@Test
	public void getPatient() throws Exception {
		
		MockHttpServletRequest newGetRequest = newGetRequest("icare/patient", new Parameter("search", "james"));
		MockHttpServletResponse handle = handle(newGetRequest);
		String PatientData = handle.getContentAsString();
		System.out.println("data: " + PatientData);
		Map patientMap = (new ObjectMapper()).readValue(PatientData, Map.class);
		List<Map> visitDetails = (List<Map>) patientMap.get("results");
		assertThat("Should return a patient", visitDetails.size() == 1);
		
		newGetRequest = newGetRequest("icare/patient", new Parameter("patientUUID", "993c46d2-5007-45e8-9512-969300717761"));
		handle = handle(newGetRequest);
		String PatientData2 = handle.getContentAsString();
		System.out.println("data: " + PatientData2);
		Map patientMap2 = (new ObjectMapper()).readValue(PatientData2, Map.class);
		List<Map> visitDetails2 = (List<Map>) patientMap2.get("results");
		assertThat("Should return a patient", visitDetails2.size() == 1);
		
		newGetRequest = newGetRequest("icare/patient", new Parameter("limit", "1"), new Parameter("startIndex", "0"));
		handle = handle(newGetRequest);
		String PatientData3 = handle.getContentAsString();
		Map patientMap3 = (new ObjectMapper()).readValue(PatientData3, Map.class);
		List<Map> visitDetails3 = (List<Map>) patientMap3.get("results");
		assertThat("Should return a patient", visitDetails3.size() == 1);
		
	}
	
	@Test
	public void testSummary() throws Exception {
		
		//Get visits by attribute value references
		MockHttpServletRequest newGetRequest = newGetRequest("icare/summary");
		MockHttpServletResponse handle = handle(newGetRequest);
		String summaryData = handle.getContentAsString();
		Map summaryMap = (new ObjectMapper()).readValue(summaryData, Map.class);
		
		List<Map> summaryDetails = (List<Map>) summaryMap.get("results");
		//assertThat("Should return a visit", visitDetails.size() == 1);
		
		assertThat("Has 8 patient", summaryMap.get("allPatients").equals(8));
		assertThat("Has 8 activeVisits", summaryMap.get("activeVisits").equals(9));
		assertThat("Has 1 location", ((List) summaryMap.get("locations")).size() == 1);
		
	}
	
	@Test
	public void testDrug() throws Exception {
		
		//Get visits by attribute value references
		Drug drug = Context.getConceptService().getAllDrugs().get(0);
		//System.out.println(drug.getConcept().getUuid());
		
		MockHttpServletRequest newGetRequest = newGetRequest("icare/drug", new Parameter("concept", drug.getConcept()
		        .getUuid()));
		MockHttpServletResponse handle = handle(newGetRequest);
		String drugData = handle.getContentAsString();
		//System.out.println(drugData);
		Map drugMap = (new ObjectMapper()).readValue(drugData, Map.class);
		List<Map> drugDetails = (List<Map>) drugMap.get("results");
		//drugDetails.get(0).
		assertThat("Should have drug with display", drug.getDisplayName().equals(drugDetails.get(0).get("display")));
		assertThat("Should have drug with name", drug.getName().equals(drugDetails.get(0).get("name")));
		assertThat("Should have drug with same uuid", drug.getUuid().equals(drugDetails.get(0).get("uuid")));
	}
	
	@Test
	public void testGetClientsFromExternalSystem() throws Exception {
		AdministrationService administrationService = Context.getService(AdministrationService.class);
		
		administrationService.setGlobalProperty("iCare.externalSystems.integrated.pimaCovid.baseUrl",
		    "https://covid19-dev.moh.go.tz");
		administrationService.setGlobalProperty("iCare.externalSystems.integrated.pimaCovid.username", "josephatjulius");
		administrationService.setGlobalProperty("iCare.externalSystems.integrated.pimaCovid.password", "Dhis@2023");
		administrationService.setGlobalProperty("iCare.externalSystems.integrated.pimaCovid.referenceOuUid", "m0frOspS7JY");
		administrationService.setGlobalProperty("iCare.externalSystems.integrated.pimaCovid.programUid", "MNhYWMkR0Z7");
		MockHttpServletRequest newGetRequest = newGetRequest("icare/client/externalsystems", new Parameter("identifier",
		        "20224"), new Parameter("identifierReference", "zxdIGVIuhWU"), new Parameter("basicAuth",
		        "am9zZXBoYXRqdWxpdXM6RGhpc0AyMDIz"));
		MockHttpServletResponse handle = handle(newGetRequest);
		String patientData = handle.getContentAsString();
		System.out.println(patientData);
		//		Map clientDataMap = (new ObjectMapper()).readValue(patientData, Map.class);
		//		System.out.println(clientDataMap.get("trackedEntityInstances"));
		//		System.out.println(patientData);
		//		Map patientDataMap = (new ObjectMapper()).readValue(patientData, Map.class);
		//		List<Map> patientDataDetails = (List<Map>) patientDataMap;
		//		System.out.println(patientDataDetails);
	}
	
	@Test
	public void testPimaCovidLabRequest() throws Exception {
		AdministrationService administrationService = Context.getService(AdministrationService.class);
		
		administrationService.setGlobalProperty("iCare.externalSystems.integrated.pimaCovid.baseUrl",
		    "https://covid19-dev.moh.go.tz");
		administrationService.setGlobalProperty("iCare.externalSystems.integrated.pimaCovid.username", "lisintegration");
		administrationService.setGlobalProperty("iCare.externalSystems.integrated.pimaCovid.password", "Dhis@2022");
		administrationService.setGlobalProperty("iCare.externalSystems.integrated.pimaCovid.referenceOuUid", "m0frOspS7JY");
		administrationService.setGlobalProperty("iCare.externalSystems.integrated.pimaCovid.programUid", "MNhYWMkR0Z7");
		String dto = this.readFile("dto/lab-request-data.json");
		Map<String, Object> labRequest = (new ObjectMapper()).readValue(dto, Map.class);
		MockHttpServletRequest newGetRequest = newPostRequest("icare/externalsystems/labrequest", labRequest);
		MockHttpServletResponse handle = handle(newGetRequest);
		String data = handle.getContentAsString();
		System.out.println(data);
	}
	
	@Test
	public void testPimaCovidLabResult() throws Exception {
		AdministrationService administrationService = Context.getService(AdministrationService.class);
		
		administrationService.setGlobalProperty("iCare.externalSystems.integrated.pimaCovid.baseUrl",
		    "https://covid19-dev.moh.go.tz");
		administrationService.setGlobalProperty("iCare.externalSystems.integrated.pimaCovid.username", "lisintegration");
		administrationService.setGlobalProperty("iCare.externalSystems.integrated.pimaCovid.password", "Dhis@2022");
		administrationService.setGlobalProperty("iCare.externalSystems.integrated.pimaCovid.referenceOuUid", "m0frOspS7JY");
		administrationService.setGlobalProperty("iCare.externalSystems.integrated.pimaCovid.programUid", "MNhYWMkR0Z7");
		String dto = this.readFile("dto/lab-request-data.json");
		Map<String, Object> labRequest = (new ObjectMapper()).readValue(dto, Map.class);
		MockHttpServletRequest newGetRequest = newPostRequest("icare/externalsystems/labresult", labRequest);
		MockHttpServletResponse handle = handle(newGetRequest);
		String data = handle.getContentAsString();
		System.out.println(data);
	}
	
	@Test
	public void testExternalSystemsAuthenticationVerification() throws Exception {
		AdministrationService administrationService = Context.getService(AdministrationService.class);
		String systemKey = "pimaCovid";
		administrationService.setGlobalProperty("iCare.externalSystems.integrated." + systemKey + ".baseUrl",
		    "https://covid19-dev.moh.go.tz");
		MockHttpServletRequest newGetRequest = newGetRequest("icare/externalsystems/verifycredentials", new Parameter(
		        "username", "lisintegration"), new Parameter("password", "Dhis@2022"), new Parameter("systemKey", systemKey));
		MockHttpServletResponse handle = handle(newGetRequest);
		String userDetails = handle.getContentAsString();
		System.out.println(userDetails);
	}
	
	@Test
	public void testVoidOrder() throws Exception {
		String dto = this.readFile("dto/order-void-object-dto.json");
		Map<String, Object> orderVoidDetails = (new ObjectMapper()).readValue(dto, Map.class);
		MockHttpServletRequest voidOrderRequest = newPostRequest("icare/voidorder", orderVoidDetails);
		
		MockHttpServletResponse returnResponse = handle(voidOrderRequest);
		
		OrderService orderService = Context.getService(OrderService.class);
		Order voidedOrder = orderService.getOrderByUuid(orderVoidDetails.get("uuid").toString());
		
		assertThat("The order is voided", voidedOrder.getVoided() == true);
		
	}
	
	@Test
	public void testVoidEncounter() throws Exception {
		String dto = this.readFile("dto/encounter-void-object-dto.json");
		Map<String, Object> encounterVoidDetails = (new ObjectMapper()).readValue(dto, Map.class);
		MockHttpServletRequest voidEncounterRequest = newPostRequest("icare/voidencounter", encounterVoidDetails);
		
		MockHttpServletResponse returnResponse = handle(voidEncounterRequest);
		
		EncounterService encounterService = Context.getService(EncounterService.class);
		Encounter voidedEncounter = encounterService.getEncounterByUuid(encounterVoidDetails.get("uuid").toString());
		
		assertThat("The encounter is voided", voidedEncounter.getVoided() == true);
	}
	
	@Test
	public void testGetEmailSession() throws Exception {
		MockHttpServletRequest emailSessionRequest = newGetRequest("icare/emailsession");
		MockHttpServletResponse returnResponse = handle(emailSessionRequest);
		System.out.println(returnResponse);
	}
	
	@Test
	public void testProcessEmail() throws Exception {
		Properties emailProperties = new Properties();
		AdministrationService administrationService = Context.getAdministrationService();
		
		//		File attachmentFile = new File("/home/kiba/Downloads/Docker+Slides.pdf");
		//		byte[] attachmentBytes = Files.readAllBytes(attachmentFile.toPath());
		//		String attachmentBase64 = DatatypeConverter.printBase64Binary(bytes);
		
		String fromMail = administrationService.getGlobalProperty("mail.from");
		emailProperties.setProperty("to", "kibahiladennis@gmail.com");
		emailProperties.setProperty("cc", "josephatjulius24@gmail.com");
		emailProperties.setProperty("from", fromMail);
		emailProperties.setProperty("content", "<b>TESTING EMAIL HALOL</b>");
		emailProperties.setProperty("subject", "TESTING");
		emailProperties.setProperty("attachmentFile", "<b>HELLO</b>");
		emailProperties.setProperty("attachmentFileName", "AttachmentFile");
		
		//put your local file path for testing
		//emailProperties.setProperty("attachment","/home/kiba/Downloads/Docker+Slides.pdf");
		MockHttpServletRequest emailRequest = newPostRequest("icare/processemail", emailProperties);
		MockHttpServletResponse returnResponse = handle(emailRequest);
		System.out.println(returnResponse);
	}
	
	@Test
	public void getAuditLogs() throws Exception {
		MockHttpServletRequest auditlogs = newGetRequest("icare/auditlogs");
		MockHttpServletResponse returnResponse = handle(auditlogs);
		List<Map<String, Object>> stockInvoicesStatusListMap = (new ObjectMapper()).readValue(
		    returnResponse.getContentAsString(), List.class);
		
		System.out.println(returnResponse.getContentAsString());
	}
	
	@Test
	public void getUsersPasswordHistory() throws Exception {
		MockHttpServletRequest passwordHistories = newGetRequest("icare/passwordhistory/e4ef4d4d-5cf2-47ff-af6b-bb9abdabdd60");
		MockHttpServletResponse response = handle(passwordHistories);
		List<Map<String, Object>> passwordHistoriesMap = (new ObjectMapper()).readValue(response.getContentAsString(),
		    List.class);
		System.out.println(response.getContentAsString());
		
	}
	
	@Test
	public void getRolesAndPrivileges() throws Exception {
		MockHttpServletRequest roles = newGetRequest("icare/roles", new Parameter("q", "role 1"));
		MockHttpServletResponse response = handle(roles);
		List<Map<String, Object>> rolesMap = (new ObjectMapper()).readValue(response.getContentAsString(), List.class);
		assertThat("There is one role", rolesMap.size(), is(1));
		
		MockHttpServletRequest privileges = newGetRequest("icare/privileges", new Parameter("q", "priv 1"));
		response = handle(privileges);
		List<Map<String, Object>> privilegesMap = (new ObjectMapper()).readValue(response.getContentAsString(), List.class);
		System.out.println(response.getContentAsString());
		//assertThat("There is one role", rolesMap.size(),is(1));
	}
	
	@Test
	public void testCreateProgramWorkflow() throws Exception {
		String dto = this.readFile("dto/core/program-workflow-create.json");
		List<Map<String, Object>> programWorkflowDetails = (new ObjectMapper()).readValue(dto, List.class);
		MockHttpServletRequest workflowCreateRequest = newPostRequest("icare/workflow", programWorkflowDetails);
		
		MockHttpServletResponse returnResponse = handle(workflowCreateRequest);
		List<Map<String, Object>> createadWorkflows = (new ObjectMapper()).readValue(returnResponse.getContentAsString(),
		    List.class);
		
		assertThat("created 1 workflow", createadWorkflows.size(), is(1));
		
	}
	
	@Test
	public void testCreateEncounterWorkflowState() throws Exception {
		String dto = this.readFile("dto/core/encounter-patient-state-create.json");
		Map<String, Object> encounterWorkflowStateDetails = (new ObjectMapper()).readValue(dto, Map.class);
		MockHttpServletRequest encounterworkflowStateCreateRequest = newPostRequest("icare/encounterpatientstate",
		    encounterWorkflowStateDetails);
		
		MockHttpServletResponse returnResponse = handle(encounterworkflowStateCreateRequest);
		List<Map<String, Object>> createadWorkflowState = (new ObjectMapper()).readValue(
		    returnResponse.getContentAsString(), List.class);
		
		assertThat("created 2 workflow", createadWorkflowState.size(), is(2));
		
		MockHttpServletRequest encounters = newGetRequest("icare/encounterpatientstate/iCARE110-TEST-OSDH-9beb-d30dcfc0c992");
		MockHttpServletResponse response = handle(encounters);
		List<Map<String, Object>> encountersMap = (new ObjectMapper()).readValue(response.getContentAsString(), List.class);
		System.out.println(response.getContentAsString());
	}
	
	@Test
	public void testGetEncountersByEncounterType() throws Exception {
		MockHttpServletRequest encounters = newGetRequest("icare/encounters", new Parameter("encounterTypeUuid",
		        "787655eb-5345-11e8-9c7c-40b034c3cfer"));
		MockHttpServletResponse response = handle(encounters);
		Map<String, Object> encountersMap = (new ObjectMapper()).readValue(response.getContentAsString(), Map.class);
		System.out.println(encountersMap.get("results"));
		List<Map<String, Object>> results = (List) encountersMap.get("results");
		assertThat("There is one encounter", results.size(), is(1));
		
	}
	
	@Test
	public void testGetCommonlyOrderedItems() throws Exception {
		MockHttpServletRequest drugs = newGetRequest("icare/commonlyordereditems", new Parameter("locationUuid",
		        "44939999-d333-fff2-9bff-61d11117c22e"));
		MockHttpServletResponse response = handle(drugs);
		Map<String, Object> drugsMap = (new ObjectMapper()).readValue(response.getContentAsString(), Map.class);
		List<Map<String, Object>> results = (List) drugsMap.get("results");
		assertThat("Count of drugs ordered", results.size(), is(0));
		
		//		TODO: Add test for normal orders
	}
	
	//EnvayaSMS tests class
	
	//for incoming sms
	@Test
	public void testProcessIncomingAction() throws Exception {
		String from = "+255717611117";
		String message = "EnvayaSMS Message";
		String messageType = "sms";
		
		MockHttpServletRequest request = newPostRequest("icare/envayasms/handle-actions", "");
		request.addParameter("action", ICareConfig.ACTION_INCOMING);
		request.addParameter("from", from);
		request.addParameter("messageContent", message);
		request.addParameter("messageType", messageType);
		
		MockHttpServletResponse response = handle(request);
		
		Map<String, Object> responseMap = (new ObjectMapper()).readValue(response.getContentAsString(), Map.class);
		
		assertNotNull(responseMap);
		System.out.println(responseMap);
	}
	
	//for outgoing sms
	@Test
    public void testHandleOutgoingSMS() throws Exception {
    List<Map<String, Object>> eventJson = new ArrayList<>();

    // Create the request using newPostRequest
    MockHttpServletRequest request = newPostRequest("icare/envayasms/handle-actions", "");
    
    // Add the 'action' parameter manually
    request.addParameter("action", ICareConfig.ACTION_OUTGOING);

    MockHttpServletResponse response = handle(request);

    Map<String, Object> responseMap = new ObjectMapper().readValue(response.getContentAsString(), Map.class);
    assertThat(responseMap.containsKey("events"), is(true));
    List<Map<String, Object>> returnedEvents = (List<Map<String, Object>>) responseMap.get("events");
    assertThat(returnedEvents, is(eventJson));
    System.out.println(returnedEvents);
    }
	
	//for invalid actions
	@Test
	public void testHandleInvalidAction() throws Exception {
		MockHttpServletRequest request = newPostRequest("icare/envayasms/handle-actions", "invalid action");
		request.addParameter("action", "invalid action");
		
		MockHttpServletResponse response = handle(request);
		Map<String, Object> responseMap = new ObjectMapper().readValue(response.getContentAsString(), Map.class);
		assertThat(responseMap.containsKey("Error"), is(true));
		System.out.println(responseMap);
	}
	
	@Test
	public void testInsertingOutgoingMessages() throws Exception {
		List<String> recipients = Arrays.asList("+255717611117", "+1234567890", "+0987654321");
		String message = "Hello, it's me for Envaya SMS";
		
		String jsonPayload = "{ \"recipients\": [";
		for (int i = 0; i < recipients.size(); i++) {
			jsonPayload += "\"" + recipients.get(i) + "\"";
			if (i < recipients.size() - 1) {
				jsonPayload += ", ";
			}
		}
		jsonPayload += "], \"message\": \"" + message + "\" }";
		
		MockHttpServletRequest request = newPostRequest("icare/envayasms/outgoing-message", jsonPayload);
		request.setContentType(MediaType.APPLICATION_JSON_VALUE);
		
		MockHttpServletResponse response = handle(request);
		
		assertEquals(HttpServletResponse.SC_OK, response.getStatus());
		
		assertEquals("Saved successfully", response.getContentAsString());
		
		System.out.println(response);
	}
	
	@Test
	public void testNonDrugOrderBillAndDispensing() throws Exception {
		AdministrationService administrationService = Context.getAdministrationService();
		administrationService.setGlobalProperty(ICareConfig.ORDER_TO_SKIP_BILLING_ADVISOR,
		    "2msir5eb-5345-11e8-9922-40b034c3cfee");
		String dto = this.readFile("dto/core/non-drug-dispensing-with-billing.json");
		Map<String, Object> nonDrugOrderData = (new ObjectMapper()).readValue(dto, Map.class);
		MockHttpServletRequest order = newPostRequest("icare/nondrugorderbillanddispensing", nonDrugOrderData);
		MockHttpServletResponse response = handle(order);
		
		Map<String, Object> responseMap = (new ObjectMapper()).readValue(response.getContentAsString(), Map.class);
		assertThat("Order status shows drug dispensed", responseMap.get("orderStockStatus"), is("DISPENSED"));
	}
	
	@Test
	public void testSaveNonDrugOrderWithDispensing() throws Exception {
		AdministrationService administrationService = Context.getAdministrationService();
		administrationService.setGlobalProperty(ICareConfig.ORDER_TO_SKIP_BILLING_ADVISOR,
		    "2msir5eb-5345-11e8-9922-40b034c3cfee");
		String dto = this.readFile("dto/core/nondrugorderwithdispensing.json");
		Map<String, Object> nonDrugOrderData = (new ObjectMapper()).readValue(dto, Map.class);
		MockHttpServletRequest order = newPostRequest("icare/nondrugorderwithdispensing", nonDrugOrderData);
		MockHttpServletResponse response = handle(order);
		Map<String, Object> responseMap = (new ObjectMapper()).readValue(response.getContentAsString(), Map.class);
		System.out.println(responseMap);
		// TODO: Make sure test is running sucessfully beforing using the API
		assertThat("Order status shows drug dispensed", responseMap.get("orderStockStatus"), is("DISPENSED"));
	}
}
