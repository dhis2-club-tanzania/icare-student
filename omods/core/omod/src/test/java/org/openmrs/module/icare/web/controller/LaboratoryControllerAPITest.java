package org.openmrs.module.icare.web.controller;

import org.apache.commons.collections.IteratorUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.mockito.Mock;
import org.openmrs.*;
import org.openmrs.api.AdministrationService;
import org.openmrs.api.context.Context;
import org.openmrs.module.icare.ICareConfig;
import org.openmrs.module.icare.laboratory.dao.TestOrderLocationDAO;
import org.openmrs.module.icare.laboratory.services.LaboratoryService;
import org.openmrs.module.icare.web.controller.core.BaseResourceControllerTest;
import org.openmrs.module.webservices.rest.SimpleObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.sql.SQLException;
import java.util.*;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class LaboratoryControllerAPITest extends BaseResourceControllerTest {
	
	@Autowired
	LaboratoryService laboratoryService;
	
	@Mock
	TestOrderLocationDAO testOrderLocationDAO;
	
	@Before
	public void setUp() throws SQLException {
		initializeInMemoryDatabase();
		executeDataSet("lab-data.xml");
		AdministrationService adminService = Context.getService(AdministrationService.class);
		adminService.setGlobalProperty(ICareConfig.LAB_RELATED_METADATA_ATTRIBUTE_TYPE,
		    "8987bbb9-52b9-11zz-b60d-880027ae421d1");
		adminService.setGlobalProperty(ICareConfig.LAB_UNIFIED_CODING_REFERENCE_CONCEPT_SOURCE,
		    "8987bbb9-52b9-11zz-b60d-880027ae421s");
		adminService.setGlobalProperty(ICareConfig.LAB_RESULTS_SHOULD_SEND_EMAIL_FOR_AUTHORIZED_RESULTS, "false");
	}
	
	@Test
	public void testGenerateSampleLabel() throws Exception {
		AdministrationService adminService = Context.getService(AdministrationService.class);
		adminService.setGlobalProperty(ICareConfig.SAMPLE_ID_FORMAT, "NPHL/D{YYYY}/COUNT");
		MockHttpServletRequest newGetRequest = newGetRequest("lab/sampleidgen");
		MockHttpServletResponse handle = handle(newGetRequest);
		String label = handle.getContentAsString();
		System.out.println(label);
	}
	
	@Test
	public void testGenerateLaboratoryIdLabels() throws Exception {
		MockHttpServletRequest newGetRequest = newGetRequest("lab/labidgen", new Parameter("globalProperty",
		        "iCARE110-TEST-OSDH-9beb-d30dcfc0c631"), new Parameter("metadataType", "sample"),
		    new Parameter("count", "3"));
		MockHttpServletResponse getReqHandle = handle(newGetRequest);
		List<String> labels = (new ObjectMapper()).readValue(getReqHandle.getContentAsString(), List.class);
		System.out.println(labels);
		assertThat("IDS generated equals to 3", labels.size(), is(3));
	}
	
	@Test
	public void testConversion() {
		SimpleObject sample = new SimpleObject();
		sample.add("visit", (new SimpleObject().add("uuid", "d9c1d8ac-2b8e-427f-804d-b858c52e6f11")));
		sample.add("label", "Test Label X");
		sample.add("concept", (new SimpleObject().add("uuid", "a8102d6d-c528-477a-80bd-acc38ebc6252")));
		sample.add("technician", (new SimpleObject().add("uuid", "1a61a0b5-d271-4b00-a803-5cef8b06ba8f")));
		
		List<SimpleObject> orders = new ArrayList<SimpleObject>();
		SimpleObject order = new SimpleObject().add("uuid", "6746395c-1117-4abd-8fd7-a748c9575abcd");
		orders.add(order);
		
		sample.add("orders", orders);
	}
	
	@Test
	public void testCreatingASampleAndGettingSampleByVisitIdThenUpdateSampleOrder() throws Exception {
		//Given
		MockHttpServletRequest newGetRequest = newGetRequest("lab/visit");
		MockHttpServletResponse handle = handle(newGetRequest);
		String res = handle.getContentAsString();
		Map<String, Object> visitResults = (new ObjectMapper()).readValue(res, Map.class);
		
		List<Map<String, Object>> visits = (List<Map<String, Object>>) visitResults.get("results");
		System.out.println("Res:" + res);
		System.out.println("Testing:" + visits.size());
		String dto = this.readFile("dto/sample-create-dto.json");
		Map<String, Object> sample = (new ObjectMapper()).readValue(dto, Map.class);
		
		//When
		MockHttpServletRequest newPostRequest = newPostRequest("lab/sample", sample);
		handle = handle(newPostRequest);
		Map<String, Object> createsample = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		System.out.println(createsample);
		
		//Then
		//TODO put test for the results that should be returned to the client
		newGetRequest = newGetRequest("lab/sample", new Parameter("visit", "d9c1d8ac-2b8e-427f-804d-b858c52e6f11"));
		MockHttpServletResponse handleGet = handle(newGetRequest);
		List<Map<String, Object>> createdsample = (new ObjectMapper()).readValue(handleGet.getContentAsString(), List.class);
		
		assertThat("Samples are added to total 6:", createdsample.size(), is(6));
		boolean found = false;
		for (Map<String, Object> sampleMap : createdsample) {
			if (sampleMap.get("label").equals("Create Sample Test")) {
				found = true;
				List<Map<String, Object>> sampleOrders = (List<Map<String, Object>>) sampleMap.get("orders");
				assertThat("Sample order has been created:", sampleOrders.size(), is(1));
				assertThat("Sample order has legit order number:",
				    (((Map) ((Map) sampleOrders.get(0)).get("order"))).get("orderNumber").toString(), is("123"));
				assertThat("Sample order has legit order:", (((Map) ((Map) sampleOrders.get(0)).get("order"))).get("uuid")
				        .toString(), is("6746395c-1117-4abd-8fd7-a748c9575abcd"));
				
			}
		}
		assertThat("Created sample is found:", found, is(true));
	}
	
	@Test
	public void testAddSampleOrder() throws Exception {
		//Given
		String dto = this.readFile("dto/sample-order-create-dto2.json");
		Map<String, Object> sampleOrder = (new ObjectMapper()).readValue(dto, Map.class);
		MockHttpServletRequest newSampleOrderCreateRequest = newPostRequest("lab/sampleorder", sampleOrder);
		
		MockHttpServletResponse handleSampleOrder = handle(newSampleOrderCreateRequest);
		String response = handleSampleOrder.getContentAsString();
		System.out.println(response);
		
		MockHttpServletRequest newGetRequest = newGetRequest("lab/sample", new Parameter("uuid",
		        "ec2c9ec1-e742-4f89-979a-01560a607d01"));
		
		MockHttpServletResponse handleGet = handle(newGetRequest);
		
		System.out.println(handleGet.getContentAsString());
	}
	
	@Test
	public void testGetSampleOrdersBySampleUuid() throws Exception {
		MockHttpServletRequest sampleRequest = newGetRequest("lab/sample/x311y666-zz77-11e3-1111-08002007777/orders");
		MockHttpServletResponse response = handle(sampleRequest);
		String data = response.getContentAsString();
		System.out.println(data);
	}
	
	@Test
	public void testGetSampledOrders() throws Exception {
		// Given visit uuid
		//When
		MockHttpServletRequest getRequest = newGetRequest("lab/sampledorders/d9c1d8ac-2b8e-427f-804d-b858c52e6f11");
		MockHttpServletResponse handle = handle(getRequest);
		List<Map<String, Object>> orders = (new ObjectMapper()).readValue(handle.getContentAsString(), List.class);
		System.out.println(handle.getContentAsString());
		
		//Then
		assertThat("Samples orders available is 4:", orders.size(), is(4));
	}
	
	@Test
	public void testUpdateSampleOrder() throws Exception {
		//Given
		String dto = this.readFile("dto/sample-order-create-dto.json");
		Map<String, Object> sampleOrder = (new ObjectMapper()).readValue(dto, Map.class);
		
		//When
		MockHttpServletRequest newSampleOrderUpdateRequest = newPostRequest("lab/assign", sampleOrder);
		
		MockHttpServletResponse handleSampleOrder = handle(newSampleOrderUpdateRequest);
		
		//Then
		MockHttpServletRequest newGetRequest = newGetRequest("lab/sample", new Parameter("visit",
		        "d9c1d8ac-2b8e-427f-804d-b858c52e6f11"));
		MockHttpServletResponse handleGet = handle(newGetRequest);
		List<Map<String, Object>> createdsample = (new ObjectMapper()).readValue(handleGet.getContentAsString(), List.class);
		boolean found = false;
		for (Map<String, Object> sampleMap : createdsample) {
			if (sampleMap.get("uuid").equals("x311y666-zz77-11e3-1111-08002007777")) {
				found = true;
				
				List<Map<String, Object>> sampleOrders = (List<Map<String, Object>>) sampleMap.get("orders");
				assertThat("Sample order has been created:", sampleOrders.size(), is(1));
				Map technician = (Map) (sampleOrders.get(0)).get("technician");
				assertThat("Should contain technician:", technician != null, is(true));
				assertThat("Should contain technician uuid:", technician.get("uuid").toString(),
				    is("36b071d8-d5ea-4703-8e56-5b066420b569"));
			}
		}
		assertThat("Updated sample is found:", found, is(true));
	}
	
	@Test
	public void testAddingSampleStatusAndGettingSampleWithStatus() throws Exception {
		
		String dto = this.readFile("dto/sample-status-create-dto.json");
		Map<String, Object> sampleStatus = (new ObjectMapper()).readValue(dto, Map.class);
		
		MockHttpServletRequest newPostRequest = newPostRequest("lab/samplestatus", sampleStatus);
		
		MockHttpServletResponse handle = handle(newPostRequest);
		
		MockHttpServletRequest newGetRequest = newGetRequest("lab/sample", new Parameter("visit",
		        "d9c1d8ac-2b8e-427f-804d-b858c52e6f11"));
		
		MockHttpServletResponse handleGet = handle(newGetRequest);
		
		List<Map<String, Object>> sampleWithStatus = (new ObjectMapper()).readValue(handleGet.getContentAsString(),
		    List.class);
		boolean sampleFound = false;
		for (Map sample : sampleWithStatus) {
			if (sample.get("uuid").equals("d365e560-zz77-11e3-1111-08002007777")) {
				
				System.out.println(((List<Map>) sample.get("statuses")).get(0));
				
				sampleFound = true;
				assertThat("list of statuses is greater than 0", ((List<Map>) sample.get("statuses")).size(), is(3));
				Map<String, Object> status = ((List<Map>) sample.get("statuses")).get(0);
				assertThat("list of statuses is greater than 0", (String) status.get("status"), is("RECEIVED"));
			}
		}
		assertThat("Sample should be found", sampleFound, is(true));
		//assertThat("", sampleWithStatus.size() > 0));
		//assertThat("list of statuses is greater than 0", ((List<Map>)sampleWithStatus.get(0).get("statuses")).size(), is(1));
		
	}
	
	@Test
	public void testAcceptAndCreatingAllocations() throws Exception {
		
		String dto = this.readFile("dto/accept-allocations.json");
		Map<String, Object> sampleStatusAndAllocations = (new ObjectMapper()).readValue(dto, Map.class);
		
		MockHttpServletRequest newPostRequest = newPostRequest("lab/sampleaccept", sampleStatusAndAllocations);
		
		MockHttpServletResponse handle = handle(newPostRequest);
		
		MockHttpServletRequest sampleGetRequest = newGetRequest("lab/sample/x311y666-zz77-11e3-1111-08002007777");
		
		MockHttpServletResponse handleSampleGet = handle(sampleGetRequest);
		
	}
	
	@Test
	public void testGetAllocationByUuid() throws Exception {
		MockHttpServletRequest getAllocationRequest = newGetRequest("lab/allocation", new Parameter("uuid",
		        "111xxx60-7777-11e3-1111-0sndiu87hsju"));
		MockHttpServletResponse allocationByAllocation = handle(getAllocationRequest);
		String data = allocationByAllocation.getContentAsString();
		System.out.println(data);
	}
	
	@Test
	@Ignore
	public void testGetAllocationsByOrderUuid() throws Exception {
		MockHttpServletRequest getAllocationsRequest = newGetRequest("lab/allocationsbyorder", new Parameter("uuid",
		        "7634gd66-3333-4abd-8fd7-a748c9575abcd"));
		MockHttpServletResponse allocationByOrder = handle(getAllocationsRequest);
		System.out.println(allocationByOrder.getContentAsString());
	}
	
	@Test
	public void testGetAllocationsBySampleUuid() throws Exception {
		MockHttpServletRequest getAllocationsRequest = newGetRequest("lab/allocationsbysample", new Parameter("uuid",
		        "x311y666-zz77-11e3-1111-08002007777"));
		MockHttpServletResponse allocationByOrder = handle(getAllocationsRequest);
		System.out.println(allocationByOrder.getContentAsString());
	}
	
	@Test
	public void testGettingSampleByVisitOrPatientUuidAndOrDates() throws Exception {
		
		MockHttpServletRequest newSampleGetByPatientRequest = newGetRequest("lab/sample");
		
		newSampleGetByPatientRequest.addParameter("patient", "660484f6-0d02-4e2a-8e0e-fd2f71906f81");
		MockHttpServletResponse handleGet = handle(newSampleGetByPatientRequest);
		System.out.println("Done testing with patient \n");
		newSampleGetByPatientRequest.removeParameter("patient");
		
		newSampleGetByPatientRequest.addParameter("visit", "d9c1d8ac-2b8e-427f-804d-b858c52e6f11");
		
		handle(newSampleGetByPatientRequest);
		System.out.println("Done testing with visit \n");
		newSampleGetByPatientRequest.removeParameter("visit");
		
		newSampleGetByPatientRequest.addParameter("startDate", "2022-01-01");
		
		handle(newSampleGetByPatientRequest);
		System.out.println("Done testing with start date only \n");
		
		newSampleGetByPatientRequest.addParameter("endDate", "2022-07-29");
		
		handle(newSampleGetByPatientRequest);
		System.out.println("Done testing with start date and end date only \n");
		
		newSampleGetByPatientRequest.addParameter("patient", "660484f6-0d02-4e2a-8e0e-fd2f71906f81");
		
		handle(newSampleGetByPatientRequest);
		System.out.println("Done testing with start , end date and patient \n");
		newSampleGetByPatientRequest.removeParameter("patient");
		
		newSampleGetByPatientRequest.addParameter("visit", "d9c1d8ac-2b8e-427f-804d-b858c52e6f11");
		
		handle(newSampleGetByPatientRequest);
		System.out.println("Done testing with start , end date and visit \n");
		
	}
	
	@Test
	public void testGettingSamples() throws Exception {
		
		MockHttpServletRequest newGetRequest = newGetRequest("lab/samples", new Parameter("page", "2"), new Parameter(
		        "pageSize", "2"), new Parameter("hasStatus", "NO"), new Parameter("excludeAllocations", "true"));
		
		//System.out.println(Context.getVisitService().getVisitByUuid("d9c1d8ac-2b8e-427f-804d-b858c52e6f11").getLocation().getUuid());
		MockHttpServletResponse handleGet = handle(newGetRequest);
		
		//System.out.println(Context.getVisitService().getVisitByUuid("d9c1d8ac-2b8e-427f-804d-b858c52e6f11").getLocation().getUuid());
		Map<String, Object> sampleResults = (new ObjectMapper()).readValue(handleGet.getContentAsString(), Map.class);
		//		System.out.println(((List) sampleResults.get("results")));
		Map<String, Object> pagerObject = (Map<String, Object>) sampleResults.get("pager");
		assertThat("Page Count is 2", (Integer) pagerObject.get("pageCount") == 2, is(true));
		assertThat("Total is 3", (Integer) pagerObject.get("total") == 3, is(true));
		assertThat("Page Size is 2", (Integer) pagerObject.get("pageSize") == 2, is(true));
		assertThat("Page is 2", (Integer) pagerObject.get("page") == 2, is(true));
		assertThat("List count is 1", ((List) sampleResults.get("results")).size() == 1, is(true));
		assertThat(
		    "There is atleast 1 sample for the visit from lab-data.xml with visit id = d9c1d8ac-2b8e-427f-804d-b858c52e6f11",
		    handleGet.getContentAsString().contains("d9c1d8ac-2b8e-427f-804d-b858c52e6f11"));
		//
		newGetRequest = newGetRequest("lab/samples", new Parameter("location", "58c57d25-8d39-41ab-8422-108a0c277d98"));
		
		//System.out.println(Context.getVisitService().getVisitByUuid("d9c1d8ac-2b8e-427f-804d-b858c52e6f11").getLocation().getUuid());
		handleGet = handle(newGetRequest);
		
		//System.out.println(Context.getVisitService().getVisitByUuid("d9c1d8ac-2b8e-427f-804d-b858c52e6f11").getLocation().getUuid());
		sampleResults = (new ObjectMapper()).readValue(handleGet.getContentAsString(), Map.class);
		//System.out.println("aaaa "+sampleResults);
		
		pagerObject = (Map<String, Object>) sampleResults.get("pager");
		assertThat("Page Count is 2", (Integer) pagerObject.get("pageCount") == 0, is(true));
		assertThat("Total is 3", (Integer) pagerObject.get("total") == 0, is(true));
		assertThat("Page Size is 2", (Integer) pagerObject.get("pageSize") == 50, is(true));
		assertThat("Page is 2", (Integer) pagerObject.get("page") == 1, is(true));
		assertThat("List by location count is 1", ((List) sampleResults.get("results")).size() == 0, is(true));
		
		//	Search test section
		newGetRequest = newGetRequest("lab/samples", new Parameter("page", "1"), new Parameter("pageSize", "2"),
		    new Parameter("q", "x"));
		handleGet = handle(newGetRequest);
		Map<String, Object> response = (new ObjectMapper()).readValue(handleGet.getContentAsString(), Map.class);
		assertThat("List by search q count is 1", ((List) response.get("results")).size() == 1, is(true));
		
		MockHttpServletRequest newGetRequest2 = newGetRequest("lab/samples", new Parameter("acceptedBy",
		        "e4ef4d4d-5cf2-47ff-af6b-bb9abdabdd60"), new Parameter("hasStatus", "YES"), new Parameter(
		        "excludeAllocations", "TRUE"));
		MockHttpServletResponse handle2 = handle(newGetRequest2);
		Map<String, Object> samples = (new ObjectMapper()).readValue(handle2.getContentAsString(), Map.class);
		assertThat("There is 2 sample", ((List<Map>) samples.get("results")).size(), is(2));
		
		MockHttpServletRequest instrumentRequest = newGetRequest("lab/samples", new Parameter("instrument",
		        "123111zz-0011-477v-8y8y-acc38ebc6252"), new Parameter("excludeAllocations", "TRUE"));
		MockHttpServletResponse instrumentResponse = handle(instrumentRequest);
		Map<String, Object> samplesByInstrument = (new ObjectMapper()).readValue(instrumentResponse.getContentAsString(),
		    Map.class);
		assertThat("There is 1 sample with instrument used", ((List<Map>) samplesByInstrument.get("results")).size(), is(1));
		
		MockHttpServletRequest newGetRequest3 = newGetRequest("lab/samples", new Parameter("excludeAllocations", "true"),
		    new Parameter("sampleCategory", "NOT ACCEPTED"), new Parameter("hasStatus", "yes"));
		
		//System.out.println(Context.getVisitService().getVisitByUuid("d9c1d8ac-2b8e-427f-804d-b858c52e6f11").getLocation().getUuid());
		MockHttpServletResponse handleGet3 = handle(newGetRequest3);
		
		//System.out.println(Context.getVisitService().getVisitByUuid("d9c1d8ac-2b8e-427f-804d-b858c52e6f11").getLocation().getUuid());
		Map<String, Object> sampleResults3 = (new ObjectMapper()).readValue(handleGet3.getContentAsString(), Map.class);
		
		newGetRequest = newGetRequest("lab/samples", new Parameter("page", "1"), new Parameter("pageSize", "2"),
		    new Parameter("hasStatus", "NO"), new Parameter("excludeAllocations", "true"), new Parameter("test",
		            "a8102d6d-c528-477a-80bd-acc38ebc6252"), new Parameter("q", "LIS/23/0221"));
		
		//System.out.println(Context.getVisitService().getVisitByUuid("d9c1d8ac-2b8e-427f-804d-b858c52e6f11").getLocation().getUuid());
		handleGet = handle(newGetRequest);
		
		//System.out.println(Context.getVisitService().getVisitByUuid("d9c1d8ac-2b8e-427f-804d-b858c52e6f11").getLocation().getUuid());
		sampleResults = (new ObjectMapper()).readValue(handleGet.getContentAsString(), Map.class);
		
		// SEARCH BY DEPARTMENT
		newGetRequest = newGetRequest("lab/samples", new Parameter("page", "1"), new Parameter("pageSize", "2"),
		    new Parameter("excludeAllocations", "true"), new Parameter("department", "123111zz-0011-477v-8y8y-acc38ebc6222"));
		
		handleGet = handle(newGetRequest);
		sampleResults = (new ObjectMapper()).readValue(handleGet.getContentAsString(), Map.class);
		
		// SEARCH BY SPECIMEN SOURCE
		newGetRequest = newGetRequest("lab/samples", new Parameter("page", "1"), new Parameter("pageSize", "2"),
		    new Parameter("excludeAllocations", "true"), new Parameter("specimen", "323111zz-0011-477v-8y8y-acc38ebc6215"));
		
		handleGet = handle(newGetRequest);
		Map<String, Object> sampleResultsFilteredBySpecimen = (new ObjectMapper()).readValue(handleGet.getContentAsString(),
		    Map.class);
		//		System.out.println(((List<Map>) samples.get("results")).size());
		//		for(Map<String, Object> sample: ((List<Map>) samples.get("results"))) {
		//			System.out.println(sample.get("label"));
		//		}
		assertThat("There is 2 sample", ((List<Map>) samples.get("results")).size(), is(2));
		
		newGetRequest = newGetRequest("lab/samples", new Parameter("q", "Gilbert"));
		handleGet = handle(newGetRequest);
		sampleResults = (new ObjectMapper()).readValue(handleGet.getContentAsString(), Map.class);
		assertThat("There are 5 samples", ((List<Map<String, Object>>) sampleResults.get("results")).size(), is(5));
		
		newGetRequest = newGetRequest("lab/samples", new Parameter("sampleCategory", "rejected"));
		handleGet = handle(newGetRequest);
		Map<String, Object> samplesRejected = (new ObjectMapper()).readValue(handleGet.getContentAsString(), Map.class);
		System.out.println("rejected samples: " + samplesRejected);
		
		newGetRequest = newGetRequest("lab/samples", new Parameter("visit", "d9c1d8ac-2b8e-427f-804d-b858c52e6f11"),
		    new Parameter("excludeAllocations", "true"));
		handleGet = handle(newGetRequest);
		Map<String, Object> samplesVisit = (new ObjectMapper()).readValue(handleGet.getContentAsString(), Map.class);
		assertThat("There are 5 samples", ((List<Map<String, Object>>) sampleResults.get("results")).size(), is(5));
	}
	
	@Test
	public void testGettingSamplesBySamplesbyCategory() throws Exception {
		
		AdministrationService adminService = Context.getService(AdministrationService.class);
		adminService.setGlobalProperty(ICareConfig.LAB_RESULT_APPROVAL_CONFIGURATION, "2");
		String bodyAttachmentHtml = this.readFile("dto/laboratory/body-attachment.html");
		String bodySummaryHtml = this.readFile("dto/laboratory/body-summary.html");
		adminService.setGlobalProperty(ICareConfig.LAB_RESULTS_BODY_ATTACHMENT_CONFIGURATION_HTML, bodyAttachmentHtml);
		adminService.setGlobalProperty(ICareConfig.LAB_RESULTS_BODY_SUMMARY_CONFIGURATION_HTML, bodySummaryHtml);
		adminService.setGlobalProperty(ICareConfig.ICARE_VISIT_EMAIL_ATTRIBUTE_TYPE, "36b071d8-d5ea-0000-8e56-5b066420aaa1");
		adminService.setGlobalProperty(ICareConfig.LAB_RESULTS_SHOULD_SEND_EMAIL_FOR_AUTHORIZED_RESULTS, "true");
		// creating sample status
		String dto = this.readFile("dto/sample-status-create-dto.json");
		Map<String, Object> sampleStatus = (new ObjectMapper()).readValue(dto, Map.class);
		
		MockHttpServletRequest newPostRequest = newPostRequest("lab/samplestatus", sampleStatus);
		MockHttpServletResponse handle = handle(newPostRequest);
		
		//Creating allocation status
		//Given
		String dto2 = this.readFile("dto/test-allocation-status-create.json");
		Map<String, Object> testAllocationStatus = (new ObjectMapper()).readValue(dto2, Map.class);
		
		//When
		MockHttpServletRequest newPostRequest2 = newPostRequest("lab/allocationstatus", testAllocationStatus);
		MockHttpServletResponse handle2 = handle(newPostRequest2);
		
		MockHttpServletRequest newGetRequest = newGetRequest("lab/samples", new Parameter("sampleCategory", "RECEIVED"),
		    new Parameter("startDate", "2020-12-27"), new Parameter("endDate", "2022-10-10"));
		MockHttpServletResponse handleGet = handle(newGetRequest);
		Map<String, Object> sampleResults = (new ObjectMapper()).readValue(handleGet.getContentAsString(), Map.class);
		
		MockHttpServletRequest newGetRequest2 = newGetRequest("lab/samples", new Parameter("testCategory", "RESULTS"),
		    new Parameter("startDate", "2020-12-27"), new Parameter("endDate", "2022-10-10"));
		MockHttpServletResponse handleGet2 = handle(newGetRequest2);
		Map<String, Object> sampleResults2 = (new ObjectMapper()).readValue(handleGet2.getContentAsString(), Map.class);
		
		MockHttpServletRequest newGetRequest3 = newGetRequest("lab/samples", new Parameter("testCategory", "Completed"),
		    new Parameter("startDate", "2020-12-27"));
		MockHttpServletResponse handleGet3 = handle(newGetRequest3);
		Map<String, Object> sampleResults3 = (new ObjectMapper()).readValue(handleGet3.getContentAsString(), Map.class);
		
		assertThat("Should return a sample", ((List) sampleResults.get("results")).size() == 1);
		assertThat("Should return a sample", ((List) sampleResults2.get("results")).size() == 1);
		
		newGetRequest = newGetRequest("lab/samples", new Parameter("excludeStatus", "RECEIVED"));
		handleGet = handle(newGetRequest);
		sampleResults = (new ObjectMapper()).readValue(handleGet.getContentAsString(), Map.class);
		//		System.out.println("aa: " + handleGet.getContentAsString());
		
	}
	
	@Test
	public void testUpdatingSampleOrder() throws Exception {
		
		SimpleObject sampleOrder = new SimpleObject();
		//testAllocation.add("label", "Test Label Y");
		sampleOrder.add("order", new SimpleObject().add("uuid", "7634gd66-3333-4abd-8fd7-a748c9575abcd"));
		//testAllocation.add("container", new SimpleObject().add("uuid", "d365e560-zz77-11e3-1111-0sndiu87hsju"));
		sampleOrder.add("sample", new SimpleObject().add("uuid", "x311y666-zz77-11e3-1111-08002007777"));
		sampleOrder.add("technician", new SimpleObject().add("uuid", "36b071d8-d5ea-4703-8e56-5b066420b569"));
		
		MockHttpServletRequest newPostRequest = newPostRequest("lab/assign", sampleOrder);
		
		MockHttpServletResponse handle = handle(newPostRequest);
		
		MockHttpServletRequest newGetResquest = newGetRequest("lab/samples");
		
		MockHttpServletResponse handleGet = handle(newGetResquest);
		
	}
	
	@Test
	public void testGeneratingSampleLabel() throws Exception {
		MockHttpServletRequest newGetRequest = newGetRequest("lab/samplelable");
		MockHttpServletResponse handleGet = handle(newGetRequest);
		System.out.println(handleGet.getContentAsString());
	}
	
	@Test
	public void testAddingAnAllocation() throws Exception {
		//Given
		String dto = this.readFile("dto/test-allocation-create.json");
		Map<String, Object> testAllocation = (new ObjectMapper()).readValue(dto, Map.class);
		
		//When
		MockHttpServletRequest newPostRequest = newPostRequest("lab/allocation", testAllocation);
		MockHttpServletResponse handle = handle(newPostRequest);
		
		//Then
		Map<String, Object> newAllocation = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		
		assertThat("allocation should exist", newAllocation != null);
		assertThat("allocation label should be allocation u", newAllocation.get("label").toString(),
		    is(testAllocation.get("label").toString()));
		assertThat("allocation container uuid should be 333111zz-0011-477v-8y8y-acc38ebc6252",
		    ((Map) newAllocation.get("container")).get("uuid").toString(), is("333111zz-0011-477v-8y8y-acc38ebc6252"));
		
	}
	
	@Test
	public void testigAddingResults() throws Exception {
		
		//Given
		String dto = this.readFile("dto/result-create.json");
		Map<String, Object> resultObject = (new ObjectMapper()).readValue(dto, Map.class);
		
		MockHttpServletRequest newPostRequest = newPostRequest("lab/results", resultObject);
		
		MockHttpServletResponse handle = handle(newPostRequest);
		
		Map<String, Object> newResultsObject = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		
		assertThat("result should exist", newResultsObject != null);
		assertThat("result valueText should be 5.88", newResultsObject.get("valueText").toString(), is("5.88"));
		assertThat("result concept uuid should be 111111xx-0000-477a-8u8u-acc38ebc6252",
		    ((Map) newResultsObject.get("concept")).get("uuid").toString(), is("111111xx-0000-477a-8u8u-acc38ebc6252"));
	}
	
	@Test
	public void testCreateMultipleResults() throws Exception {
		//Given
		String dto = this.readFile("dto/lab-related-results-create.json");
		
		AdministrationService administrationService = Context.getService(AdministrationService.class);
		
		administrationService.setGlobalProperty(ICareConfig.LAB_INSTRUMENT_CLASS_UUID,
		    "YUsir5eb-5345-11e8-9c7c-40b034cCOBAS");
		
		List<Map<String, Object>> results = (new ObjectMapper()).readValue(dto, List.class);
		
		MockHttpServletRequest newPostRequest = newPostRequest("lab/multipleresults", results);
		
		MockHttpServletResponse handle = handle(newPostRequest);
		
		List<Map<String, Object>> resultsObject = (new ObjectMapper()).readValue(handle.getContentAsString(),
		    ArrayList.class);
	}
	
	@Test
	public void testVoidMultipleResults() throws Exception {
		//Given
		String dto = this.readFile("dto/results-void.json");
		
		Map<String, Object> resultsToVoid = (new ObjectMapper()).readValue(dto, Map.class);
		MockHttpServletRequest newPutRequest = newPutRequest("lab/voidmultipleresults", resultsToVoid);
		MockHttpServletResponse updateHandle = handle(newPutRequest);
		
		List<Map<String, Object>> updateResponse = (new ObjectMapper()).readValue(updateHandle.getContentAsString(),
		    ArrayList.class);
		assertThat("Count of voided results", updateResponse.size(), is(1));
	}
	
	@Test
	public void testSaveResultsInstrument() throws Exception {
		//Given
		String dto = this.readFile("dto/results-instrument-create.json");
		Map<String, Object> resultsInstrument = (new ObjectMapper()).readValue(dto, Map.class);
		// When
		MockHttpServletRequest newPostRequest = newPostRequest("lab/resultsinstrument", resultsInstrument);
		
		MockHttpServletResponse handle = handle(newPostRequest);
		
		// Then
		Map<String, Object> instrumentResponse = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		System.out.println(instrumentResponse);
		assertThat("Instrument should match",
		    ((Map) ((Map) ((ArrayList) instrumentResponse.get("results")).get(0)).get("instrument")).get("uuid"),
		    is(((Map) resultsInstrument.get("instrument")).get("uuid")));
	}
	
	@Test
	public void testAddingTestAllocationStatus() throws Exception {
		
		AdministrationService adminService = Context.getService(AdministrationService.class);
		adminService.setGlobalProperty(ICareConfig.LAB_RESULT_APPROVAL_CONFIGURATION, "2");
		
		//Given
		String dto = this.readFile("dto/test-allocation-status-create.json");
		Map<String, Object> testAllocationStatus = (new ObjectMapper()).readValue(dto, Map.class);
		
		//When
		MockHttpServletRequest newPostRequest = newPostRequest("lab/allocationstatus", testAllocationStatus);
		MockHttpServletResponse handle = handle(newPostRequest);
		
		//Then
		Map<String, Object> testAllocationStatusResult = (new ObjectMapper()).readValue(handle.getContentAsString(),
		    Map.class);
		assertThat("Remarks are set", testAllocationStatusResult.get("remarks"), is(testAllocationStatus.get("remarks")));
		assertThat("Status are set", testAllocationStatusResult.get("status"), is(testAllocationStatus.get("status")));
		assertThat("User is legit", ((Map) testAllocationStatusResult.get("user")).get("uuid"),
		    is(((Map) testAllocationStatus.get("user")).get("uuid")));
		
		MockHttpServletRequest newGetRequest = newGetRequest("lab/sample", new Parameter("visit",
		        "d9c1d8ac-2b8e-427f-804d-b858c52e6f11"));
		
		MockHttpServletResponse handleGet = handle(newGetRequest);
		
		List<Map<String, Object>> sampleWithAllocations = (new ObjectMapper()).readValue(handleGet.getContentAsString(),
		    List.class);
		boolean sampleFound = false;
		for (Map sample : sampleWithAllocations) {
			if (sample.get("uuid").equals("x311y666-zz77-11e3-1111-08002007777")) {
				sampleFound = true;
				assertThat("list of statuses is greater than 0", ((List<Map>) sample.get("orders")).size(), is(1));
				Map<String, Object> order = ((List<Map>) sample.get("orders")).get(0);
				Map<String, Object> testAllocation = (Map<String, Object>) ((List) order.get("testAllocations")).get(0);
				Map<String, Object> status = (Map<String, Object>) ((List) testAllocation.get("statuses")).get(0);
				assertThat("Remarks are set", status.get("remarks"), is(testAllocationStatus.get("remarks")));
				assertThat("Status are set", status.get("status"), is(testAllocationStatus.get("status")));
				assertThat("User is legit", ((Map) status.get("user")).get("uuid"),
				    is(((Map) testAllocationStatus.get("user")).get("uuid")));
			}
		}
		assertThat("Sample should be found", sampleFound, is(true));
	}
	
	@Test
	public void testAddingTestAllocationStatuses() throws Exception {
		
		AdministrationService adminService = Context.getService(AdministrationService.class);
		adminService.setGlobalProperty(ICareConfig.LAB_RESULT_APPROVAL_CONFIGURATION, "2");
		
		//Given
		String dto = this.readFile("dto/test-allocation-statuses-create.json");
		List<Map<String, Object>> testAllocationStatuses = (new ObjectMapper()).readValue(dto, ArrayList.class);
		
		//When
		MockHttpServletRequest newPostRequest = newPostRequest("lab/allocationstatuses", testAllocationStatuses);
		MockHttpServletResponse handle = handle(newPostRequest);
		
		//Then
		List<Map<String, Object>> testAllocationStatusesResult = (new ObjectMapper()).readValue(handle.getContentAsString(),
		    ArrayList.class);
		System.out.println(testAllocationStatusesResult);
	}
	
	@Test
	public void testSavingObservationAfterApprovalIsComplete() throws Exception {
		
		AdministrationService adminService = Context.getService(AdministrationService.class);
		adminService.setGlobalProperty(ICareConfig.LAB_RESULT_APPROVAL_CONFIGURATION, "2");
		
		//Given
		String dto = this.readFile("dto/test-allocation-approve.json");
		Map<String, Object> testAllocationStatus = (new ObjectMapper()).readValue(dto, Map.class);
		//Context.getObsService().get
		//When
		MockHttpServletRequest newPostRequest = newPostRequest("lab/allocationstatus", testAllocationStatus);
		MockHttpServletResponse handle = handle(newPostRequest);
		
		//get encounter
		Encounter encounter = Context.getEncounterService().getEncounterByUuid("444395c-dd07-488d-8fd7-a748c9570000");
		
		//check for the results observation
		List<Obs> observations = (List<Obs>) IteratorUtils.toList(encounter.getObs().iterator());
		
		//Then
		assertThat("The encounter should one observation", observations.size(), is(1));
		//		assertThat("The observation concept name is mrdt result", observations.get(0).getConcept().getName().getName(),
		//		    is("mrdt result"));
		assertThat("The observation value text should be positive", observations.get(0).getValueText(), is("positive"));
		//
	}
	
	@Test
	public void testUpdateMultipleTestAllocations() throws Exception {
		// Given
		String dataReference = this.readFile("dto/approve-test-results.json");
		Map<String, Object> testAllocationStatuses = (new ObjectMapper()).readValue(dataReference, Map.class);
		//When
		MockHttpServletRequest newPostRequest = newPostRequest("lab/allocationstatuses", testAllocationStatuses);
		MockHttpServletResponse handle = handle(newPostRequest);
		
	}
	
	@Test
	public void testGettingSummaryWorkload() throws Exception {
		
		AdministrationService adminService = Context.getService(AdministrationService.class);
		adminService.setGlobalProperty(ICareConfig.LAB_RESULT_APPROVAL_CONFIGURATION, "2");
		
		//Given
		String dto = this.readFile("dto/test-allocation-reject.json");
		Map<String, Object> testAllocationStatus = (new ObjectMapper()).readValue(dto, Map.class);
		
		//When
		MockHttpServletRequest newPostRequest = newPostRequest("lab/allocationstatus", testAllocationStatus);
		MockHttpServletResponse handle = handle(newPostRequest);
		
		//When
		MockHttpServletRequest newGetRequest = newGetRequest("lab/workloadsummary",
		    new Parameter("startDate", "2020-12-27"), new Parameter("endDate", "2022-10-10"));
		handle = handle(newGetRequest);
		
		String workloadsummaryData = handle.getContentAsString();
		Map summaryMap = (new ObjectMapper()).readValue(workloadsummaryData, Map.class);
		
		List<Map> summaryDetails = (List<Map>) summaryMap.get("results");
		
		System.out.println(summaryMap);
		
		assertThat("Has 1 rejected sample", summaryMap.get("samplesWithRejectedResults").equals(1));
		assertThat("Has 1 authorized sample", summaryMap.get("samplesAuthorized").equals(1));
		assertThat("Has 2  no completeresult sample", summaryMap.get("samplesWithNoResults").equals(2));
		assertThat("Has Atleast 1 result sample", summaryMap.get("samplesWithResults").equals(1));
		
	}
	
	@Test
	public void CreatingAndGettingBatches() throws Exception {
		
		//1. Creating batches
		//Given
		String dto = this.readFile("dto/batch-create-dto.json");
		List<Map<String, Object>> batchObject = (new ObjectMapper()).readValue(dto, List.class);
		
		//When
		MockHttpServletRequest newPostRequest = newPostRequest("lab/batches", batchObject);
		MockHttpServletResponse handle = handle(newPostRequest);
		List<Map<String, Object>> createdbatches = (new ObjectMapper()).readValue(handle.getContentAsString(), List.class);
		
		assertThat("created 2 batches", createdbatches.size(), is(2));
		
		//2. Getting batches
		//When
		MockHttpServletRequest newGetRequest = newGetRequest("lab/batches", new Parameter("startDate", "2022-12-10"),
		    new Parameter("endDate", "2022-12-10"), new Parameter("q", "batch-lab"));
		MockHttpServletResponse handle2 = handle(newGetRequest);
		
		List<Map<String, Object>> batches = (new ObjectMapper()).readValue(handle2.getContentAsString(), List.class);
		
		assertThat("Has 1 batch", batches.size(), is(1));
		
	}
	
	@Test
	public void testCreatingAndGettingBatchSamples() throws Exception {
		//1. Creating batchSamples
		//Given
		String dto = this.readFile("dto/batch-sample-create-dto.json");
		List<Map<String, Object>> batchSampleObject = (new ObjectMapper()).readValue(dto, List.class);
		
		//When
		MockHttpServletRequest newPostRequest = newPostRequest("lab/batchsamples", batchSampleObject);
		MockHttpServletResponse handle = handle(newPostRequest);
		List<Map<String, Object>> createdBatchSamples = (new ObjectMapper()).readValue(handle.getContentAsString(),
		    List.class);
		
		assertThat("created 2 batch samples", createdBatchSamples.size(), is(2));
		
		//2. Getting batchSamples
		//when
		MockHttpServletRequest newGetRequest = newGetRequest("lab/batchsamples", new Parameter("startDate", "2022-12-10"),
		    new Parameter("endDate", "2022-12-10"), new Parameter("q", "BS01"), new Parameter("batchUuid",
		            "iCARE890-TEST-MOTR-9beb-d30dcfc0c635"));
		
		MockHttpServletResponse handle2 = handle(newGetRequest);
		List<Map<String, Object>> batchsamples = (new ObjectMapper()).readValue(handle2.getContentAsString(), List.class);
		System.out.println("aa " + handle2.getContentAsString());
		assertThat("Has 1 batch sample", batchsamples.size(), is(1));
		
		//3. Getting a single batchSample
		MockHttpServletRequest newGetRequest2 = newGetRequest("lab/batchSample", new Parameter("uuid",
		        "iCARE890-TEST-GGGH-9beb-d30dcfc0cd35"));
		MockHttpServletResponse handle3 = handle(newGetRequest2);
		System.out.println(handle3.getContentAsString());
		Map<String, Object> batchSample = new ObjectMapper().readValue(handle3.getContentAsString(), Map.class);
		assertThat("Has 1 sample", ((Map) ((List) batchSample.get("samples")).get(0)).get("label").equals("Sample Label y"));
	}
	
	@Test
	public void testCreatingAndGettingBatchSets() throws Exception {
		
		//1. Creating batchSets
		//Given
		String dto = this.readFile("dto/batch-set-create-dto.json");
		List<Map<String, Object>> batchObject = (new ObjectMapper()).readValue(dto, List.class);
		
		//When
		MockHttpServletRequest newPostRequest = newPostRequest("lab/batchsets", batchObject);
		MockHttpServletResponse handle = handle(newPostRequest);
		List<Map<String, Object>> createdbatchSets = (new ObjectMapper()).readValue(handle.getContentAsString(), List.class);
		
		assertThat("created 2 batchSet", createdbatchSets.size(), is(2));
		
		//2. Getting batchSets
		//When
		MockHttpServletRequest newGetRequest = newGetRequest("lab/batchsets", new Parameter("startDate", "2022-12-09"),
		    new Parameter("endDate", "2022-12-09"), new Parameter("q", "My batch set"));
		MockHttpServletResponse handle2 = handle(newGetRequest);
		
		List<Map<String, Object>> batchSets = (new ObjectMapper()).readValue(handle2.getContentAsString(), List.class);
		
		assertThat("Has 1 batchSet", batchSets.size(), is(1));
		
	}
	
	@Test
	public void testCreatingBatchStatusAndBatchSetStatus() throws Exception {
		
		//1.Creating BatchSetStatus
		//Given
		String dto = this.readFile("dto/batch-set-status-create-dto.json");
		Map<String, Object> batchSetStatusObject = (new ObjectMapper()).readValue(dto, Map.class);
		
		MockHttpServletRequest newPostRequest = newPostRequest("lab/batchsetstatus", batchSetStatusObject);
		MockHttpServletResponse handle = handle(newPostRequest);
		Map<String, Object> createdBatchSetStatus = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		
		assertThat("created batchSet status", createdBatchSetStatus.get("status") != null);
		
		//2. Creating BatchStatus
		//Given
		String dto1 = this.readFile("dto/batch-status-create-dto.json");
		Map<String, Object> batchStatusObject = (new ObjectMapper()).readValue(dto1, Map.class);
		
		MockHttpServletRequest newPostRequest1 = newPostRequest("lab/batchstatus", batchStatusObject);
		MockHttpServletResponse handle1 = handle(newPostRequest1);
		Map<String, Object> createdBatchStatus = (new ObjectMapper()).readValue(handle1.getContentAsString(), Map.class);
		
		assertThat("created batch status", createdBatchStatus.get("status") != null);
	}
	
	@Test
	public void testCreatingAndGettingWorksheets() throws Exception {
		
		//1. Creating worksheets
		//Given
		String dto = this.readFile("dto/worksheet-create-dto.json");
		List<Map<String, Object>> worksheetObject = (new ObjectMapper()).readValue(dto, List.class);
		
		//When
		MockHttpServletRequest newPostRequest = newPostRequest("lab/worksheets", worksheetObject);
		MockHttpServletResponse handle = handle(newPostRequest);
		List<Map<String, Object>> createdWorksheets = (new ObjectMapper())
		        .readValue(handle.getContentAsString(), List.class);
		
		assertThat("created 2 worksheets", createdWorksheets.size(), is(2));
		
		//2. Getting worksheets
		//When
		MockHttpServletRequest newGetRequest = newGetRequest("lab/worksheets", new Parameter("startDate", "2022-12-10"),
		    new Parameter("endDate", "2022-12-11"), new Parameter("q", "worksheet3"));
		MockHttpServletResponse handle2 = handle(newGetRequest);
		
		List<Map<String, Object>> worksheets = (new ObjectMapper()).readValue(handle2.getContentAsString(), List.class);
		
		assertThat("Has 1 worksheet", worksheets.size(), is(1));
		
	}
	
	@Test
	public void testCreatingAndGettingWorksheetControls() throws Exception {
		
		//1. Creating worksheetControls
		//Given
		String dto = this.readFile("dto/worksheet-control-create-dto.json");
		List<Map<String, Object>> worksheetControlObject = (new ObjectMapper()).readValue(dto, List.class);
		
		//When
		MockHttpServletRequest newPostRequest = newPostRequest("lab/worksheetcontrols", worksheetControlObject);
		MockHttpServletResponse handle = handle(newPostRequest);
		List<Map<String, Object>> createdWorksheetControls = (new ObjectMapper()).readValue(handle.getContentAsString(),
		    List.class);
		
		assertThat("created 2 worksheet controls", createdWorksheetControls.size(), is(2));
		
		//2. Getting worksheetControls
		//When
		MockHttpServletRequest newGetRequest = newGetRequest("lab/worksheetcontrols", new Parameter("startDate",
		        "2022-12-10"), new Parameter("endDate", "2022-12-11"), new Parameter("q", "worksheetControl3"));
		MockHttpServletResponse handle2 = handle(newGetRequest);
		
		List<Map<String, Object>> worksheetControls = (new ObjectMapper()).readValue(handle2.getContentAsString(),
		    List.class);
		
		assertThat("Has 1 worksheet control", worksheetControls.size(), is(1));
		
	}
	
	@Test
	public void testCreatingAndGettingWorksheetDefinitions() throws Exception {
		
		//1. Creating worksheet definitions
		//Given
		String dto = this.readFile("dto/worksheet-definition-create-dto.json");
		List<Map<String, Object>> worksheetDefinitionObject = (new ObjectMapper()).readValue(dto, List.class);
		
		//When
		MockHttpServletRequest newPostRequest = newPostRequest("lab/worksheetdefinitions", worksheetDefinitionObject);
		MockHttpServletResponse handle = handle(newPostRequest);
		List<Map<String, Object>> createdWorksheetDefinitions = (new ObjectMapper()).readValue(handle.getContentAsString(),
		    List.class);
		assertThat("created 2 worksheets definitions", createdWorksheetDefinitions.size(), is(2));
		
		//2. Getting worksheet definitions
		//When
		MockHttpServletRequest newGetRequest = newGetRequest("lab/worksheetdefinitions", new Parameter("startDate",
		        "2022-12-10"), new Parameter("endDate", "2022-12-11"), new Parameter("q", "WD"), new Parameter(
		        "expirationDate", "2023-01-18 00:12:22"));
		MockHttpServletResponse handle2 = handle(newGetRequest);
		
		List<Map<String, Object>> worksheetdefinitions = (new ObjectMapper()).readValue(handle2.getContentAsString(),
		    List.class);
		System.out.println(worksheetdefinitions);
		
		assertThat("Has 1 worksheet definition", worksheetdefinitions.size(), is(1));
		
		//3. Getting worksheet by instrument
		//When
		newGetRequest = newGetRequest("lab/worksheetdefinitions", new Parameter("instrument",
		        "123111zz-0011-477v-8y8y-acc38ebc6252"));
		handle = handle(newGetRequest);
		worksheetdefinitions = (new ObjectMapper()).readValue(handle.getContentAsString(), List.class);
		System.out.println(worksheetdefinitions);
		
	}
	
	@Test
	public void TestGettingWorksheetDefinitionByUuid() throws Exception {
		
		//1. Creating worksheet definitions
		//Given
		String dto = this.readFile("dto/worksheet-definition-create-dto.json");
		List<Map<String, Object>> worksheetDefinitionObject = (new ObjectMapper()).readValue(dto, List.class);
		//When
		MockHttpServletRequest newPostRequest = newPostRequest("lab/worksheetdefinitions", worksheetDefinitionObject);
		MockHttpServletResponse handle = handle(newPostRequest);
		List<Map<String, Object>> createdWorksheetDefinitions = (new ObjectMapper()).readValue(handle.getContentAsString(),
		    List.class);
		
		assertThat("created 2 worksheets definitions", createdWorksheetDefinitions.size(), is(2));
		String uuid = ((Map<String, Object>) createdWorksheetDefinitions.get(0)).get("uuid").toString();
		
		//2. Getting worksheet definitions
		//When
		MockHttpServletRequest newGetRequest = newGetRequest("lab/worksheetdefinition", new Parameter("uuid", uuid));
		MockHttpServletResponse handle2 = handle(newGetRequest);
		
		Map<String, Object> worksheetDefinition = (new ObjectMapper()).readValue(handle2.getContentAsString(), Map.class);
		assertThat("Worksheet definition matches", worksheetDefinition.get("uuid").toString(), is(uuid));
	}
	
	@Test
	public void testCreatingAndGettingWorksheetSamples() throws Exception {
		
		//1. Creating worksheet definitions
		//Given
		String dto = this.readFile("dto/worksheet-sample-create-dto.json");
		List<Map<String, Object>> worksheetSampleObject = (new ObjectMapper()).readValue(dto, List.class);
		
		//When
		MockHttpServletRequest newPostRequest = newPostRequest("lab/worksheetsamples", worksheetSampleObject);
		MockHttpServletResponse handle = handle(newPostRequest);
		List<Map<String, Object>> createdWorksheetSamples = (new ObjectMapper()).readValue(handle.getContentAsString(),
		    List.class);
		
		assertThat("created 2 worksheets samples", createdWorksheetSamples.size(), is(2));
		
		//2. Getting worksheet definitions
		//When
		MockHttpServletRequest newGetRequest = newGetRequest("lab/worksheetsamples",
		    new Parameter("startDate", "2022-12-10"), new Parameter("endDate", "2022-12-11"), new Parameter("q",
		            "Sample Label y"));
		MockHttpServletResponse handle2 = handle(newGetRequest);
		
		List<Map<String, Object>> worksheetsamples = (new ObjectMapper())
		        .readValue(handle2.getContentAsString(), List.class);
		
		assertThat("Has 1 worksheet sample", worksheetsamples.size(), is(1));
		
	}
	
	@Test
	public void testCreatingWorksheetStatusAndWorksheetSampleStatus() throws Exception {
		
		//1.Creating BatchSetStatus
		//Given
		String dto = this.readFile("dto/worksheet-status-create-dto.json");
		Map<String, Object> worksheetStatusObject = (new ObjectMapper()).readValue(dto, Map.class);
		
		MockHttpServletRequest newPostRequest = newPostRequest("lab/worksheetstatus", worksheetStatusObject);
		MockHttpServletResponse handle = handle(newPostRequest);
		Map<String, Object> createdWorksheetStatus = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		
		assertThat("created worksheet status", createdWorksheetStatus.get("status") != null);
		
		//2. Creating BatchStatus
		//Given
		String dto1 = this.readFile("dto/worksheet-sample-status-create-dto.json");
		Map<String, Object> worksheetSampleStatusObject = (new ObjectMapper()).readValue(dto1, Map.class);
		
		MockHttpServletRequest newPostRequest1 = newPostRequest("lab/worksheetsamplestatus", worksheetSampleStatusObject);
		MockHttpServletResponse handle1 = handle(newPostRequest1);
		Map<String, Object> createdWorksheetSampleStatus = (new ObjectMapper()).readValue(handle1.getContentAsString(),
		    Map.class);
		
		assertThat("created worksheet sample status", createdWorksheetSampleStatus.get("status") != null);
	}
	
	@Test
	public void createAndGetAssociatedFields() throws Exception {
		
		// Create associated fields
		String dto = this.readFile("dto/associated-fields-dto.json");
		List<Map<String, Object>> associatedFieldListMap = (new ObjectMapper()).readValue(dto, List.class);
		
		MockHttpServletRequest newPostRequest = newPostRequest("lab/associatedfields", associatedFieldListMap);
		MockHttpServletResponse handle = handle(newPostRequest);
		List<Map<String, Object>> createdAssociatedFields = (new ObjectMapper()).readValue(handle.getContentAsString(),
		    List.class);
		assertThat("Created two associated fields", createdAssociatedFields.size(), is(2));
		
		// Get associated fields
		MockHttpServletRequest newGetRequest = newGetRequest("lab/associatedfields", new Parameter("q", "first"));
		MockHttpServletResponse handle2 = handle(newGetRequest);
		List<Map<String, Object>> associatedfields = (new ObjectMapper())
		        .readValue(handle2.getContentAsString(), List.class);
		assertThat("There is one searched associated field", associatedfields.size(), is(1));
		
		//update associated field
		String dto2 = this.readFile("dto/associated-field-update.json");
		Map<String, Object> associatedFieldMap = (new ObjectMapper()).readValue(dto2, Map.class);
		
		MockHttpServletRequest newPostRequest2 = newPostRequest("lab/associatedfield/iCARE110-TEST-OSDH-9beb-d30dcfc0c636",
		    associatedFieldMap);
		MockHttpServletResponse handle3 = handle(newPostRequest2);
		Map<String, Object> updatedAssociatedField = (new ObjectMapper()).readValue(handle3.getContentAsString(), Map.class);
		System.out.println(handle3.getContentAsString());
		//assertThat("The associated field has been updated",);
		
	}
	
	@Test
	public void createAndGetTestAllocationAssociatedField() throws Exception {
		
		//Create test allocation associated fields
		String dto = this.readFile("dto/allocation-associated-fields-dto.json");
		List<Map<String, Object>> allocationFieldListMap = (new ObjectMapper()).readValue(dto, List.class);
		
		MockHttpServletRequest newPostRequest = newPostRequest("lab/testallocationassociatedfields", allocationFieldListMap);
		MockHttpServletResponse handle = handle(newPostRequest);
		List<Map<String, Object>> createdAllocationAssociatedFields = (new ObjectMapper()).readValue(
		    handle.getContentAsString(), List.class);
		assertThat("Created two allocation associated fields", createdAllocationAssociatedFields.size(), is(2));
		
		//Get allocation associated field
		MockHttpServletRequest newGetRequest = newGetRequest("lab/testallocationassociatedfields", new Parameter(
		        "allocationUuid", "111xxx60-7777-11e3-1111-0sndiu87hsju"), new Parameter("associatedFieldUuid",
		        "iCARE110-TEST-OSDH-9beb-d30dcfc0c636"));
		MockHttpServletResponse handle2 = handle(newGetRequest);
		List<Map<String, Object>> allocationAssociatedFields = (new ObjectMapper()).readValue(handle2.getContentAsString(),
		    List.class);
		assertThat("Get two allocation associated fields", allocationAssociatedFields.size(), is(2));
	}
	
	@Test
	public void createAndGetAssociatedFieldResult() throws Exception {
		
		String dto = this.readFile("dto/associated-field-result-create-dto.json");
		List<Map<String, Object>> associatedFieldResultMap = (new ObjectMapper()).readValue(dto, List.class);
		
		MockHttpServletRequest newPostRequest = newPostRequest("lab/associatedfieldresults", associatedFieldResultMap);
		MockHttpServletResponse handle = handle(newPostRequest);
		List<Map<String, Object>> associatedFieldResults = (new ObjectMapper()).readValue(handle.getContentAsString(),
		    List.class);
		assertThat("Created two associated field results", associatedFieldResults.size(), is(2));
		
		//Get  associated field results
		MockHttpServletRequest newGetRequest = newGetRequest("lab/associatedfieldresults", new Parameter("resultUuid",
		        "222yyy70-7777-11e3-1221-0sndiu87hsj3"), new Parameter("associatedFieldUuid",
		        "iCARE110-TEST-OSDH-9beb-d30dcfc0c636"));
		MockHttpServletResponse handle2 = handle(newGetRequest);
		List<Map<String, Object>> AssociatedFieldResults = (new ObjectMapper()).readValue(handle2.getContentAsString(),
		    List.class);
		assertThat("Get two allocation associated fields", AssociatedFieldResults.size(), is(2));
		
	}
	
	@Override
	public String getURI() {
		return null;
	}
	
	@Override
	public String getUuid() {
		return null;
	}
	
	@Override
	public long getAllCount() {
		return 0;
	}
	
}
