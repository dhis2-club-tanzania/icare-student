package org.openmrs.module.icare.web.controller;

import org.openmrs.*;
import org.openmrs.api.*;
import org.openmrs.api.context.Context;
import org.openmrs.module.icare.core.ICareService;
import org.openmrs.module.icare.core.ListResult;
import org.openmrs.module.icare.core.Pager;
import org.openmrs.module.icare.core.utils.VisitWrapper;
import org.openmrs.module.icare.laboratory.models.*;
import org.openmrs.module.icare.laboratory.services.LaboratoryService;
import org.openmrs.module.icare.store.models.Requisition;
import org.openmrs.module.webservices.rest.web.RestConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Controller
@RequestMapping(value = "/rest/" + RestConstants.VERSION_1 + "/lab")
public class LaboratoryController {
	
	@Autowired
	LaboratoryService laboratoryService;
	
	@Autowired
	ICareService iCareService;
	
	@Autowired
	VisitService visitService;
	
	@Autowired
	ConceptService conceptService;
	
	@Autowired
	OrderService orderService;
	
	@Autowired
	ProviderService providerService;
	
	@Autowired
	UserService userService;
	
	@Autowired
	LocationService locationService;
	
	@RequestMapping(value = "visit", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> getPendingVisit(@RequestParam(defaultValue = "100") Integer limit,
	        @RequestParam(defaultValue = "0") Integer startIndex) {
		
		List<Visit> visits = laboratoryService.getSamplePendingVisits(limit, startIndex);
		
		List<Map<String, Object>> responseSamplesObject = new ArrayList<Map<String, Object>>();
		for (Visit visit : visits) {
			
			Map<String, Object> sampleObject = (new VisitWrapper(visit)).toMap();
			
			//add the sample after creating its object
			responseSamplesObject.add(sampleObject);
		}
		Map<String,Object> retults = new HashMap<>();
		retults.put("results", responseSamplesObject);
		return retults;
	}
	
	@RequestMapping(value = "sample", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Map<String, Object> createNewSample(@RequestBody Map<String, Object> sample) throws IOException {
		
		Sample newSample = new Sample();
		
		Visit existingVisit = visitService.getVisitByUuid(((Map) sample.get("visit")).get("uuid").toString());
		Concept concept = conceptService.getConceptByUuid(((Map) sample.get("concept")).get("uuid").toString());
		if(sample.get("specimenSource") != null) {
			Concept specimenSource = conceptService.getConceptByUuid(((Map) sample.get("specimenSource")).get("uuid").toString());
			newSample.setSpecimenSource(specimenSource);
		}
		if (sample.get("location") != null) {
			Location location = locationService.getLocationByUuid(((Map) sample.get("location")).get("uuid").toString());
			newSample.setLocation(location);
		}
		if (sample.get("batchSample") != null) {
			BatchSample batchSample = laboratoryService.getBatchSampleByUuid(((Map) sample.get("batchSample")).get("uuid").toString());
			newSample.setBatchSample(batchSample);
		}
		
		newSample.setVisit(existingVisit);
		newSample.setConcept(concept);

		
		newSample.setLabel((String) sample.get("label"));

		List<SampleOrder> sampleOrders = new ArrayList<SampleOrder>();
		
		for (Map order : (List<Map>) sample.get("orders")) {
			SampleOrder sampleOrder = new SampleOrder();
			sampleOrder.setOrder(orderService.getOrderByUuid(order.get("uuid").toString()));
			sampleOrder.setSample(newSample);
			
			sampleOrders.add(sampleOrder);
		}
		
		Date date = new Date();
		newSample.setDateTime(date);
		
		newSample.setSampleOrders(sampleOrders);
		
		Sample createdSample = laboratoryService.createSample(newSample);
		
		HashMap<String, Object> response = new HashMap<String, Object>();
		response.put("label", createdSample.getLabel());
		
		HashMap<String, Object> visitObject = new HashMap<String, Object>();
		visitObject.put("uuid", createdSample.getVisit().getUuid());
		visitObject.put("type", createdSample.getVisit().getVisitType().getUuid());
		response.put("visit", visitObject);
		
		HashMap<String, Object> conceptObject = new HashMap<String, Object>();
		conceptObject.put("uuid", createdSample.getConcept().getUuid());
		conceptObject.put("display", createdSample.getConcept().getDisplayString());
		response.put("concept", conceptObject);
		response.put("department", conceptObject);

		if(createdSample.getSpecimenSource() != null) {
			HashMap<String, Object> specimenSourceObject = new HashMap<String, Object>();
			specimenSourceObject.put("uuid", createdSample.getSpecimenSource().getUuid());
			specimenSourceObject.put("display", createdSample.getSpecimenSource().getDisplayString());
			response.put("specimenSource", specimenSourceObject);
		}
		
		List<Map<String, Object>> orders = new ArrayList<Map<String, Object>>();
		for (SampleOrder sampleOrder : createdSample.getSampleOrders()) {
			
			Map<String, Object> order = new HashMap<String, Object>();
			order.put("uuid", sampleOrder.getOrder().getUuid());
			order.put("orderNumber", sampleOrder.getOrder().getOrderNumber());
			orders.add(order);
		}
		response.put("orders", orders);
		
		List<HashMap<String, Object>> sampleStatusesList = new ArrayList<HashMap<String, Object>>();
		for (SampleStatus sampleStatus : createdSample.getSampleStatuses()) {
			HashMap<String, Object> statusesObject = new HashMap<String, Object>();
			statusesObject.put("status", sampleStatus.getStatus());
			statusesObject.put("changedAt", sampleStatus.getTimestamp());
			sampleStatusesList.add(statusesObject);
		}
		if(createdSample.getBatchSample() != null){
			HashMap<String,Object> batchSampleObject = new HashMap<>();
			batchSampleObject.put("uuid",createdSample.getBatchSample().getUuid());
			batchSampleObject.put("display",createdSample.getBatchSample().getCode());
			response.put("batchSample",batchSampleObject);
		}
		
		response.put("status", sampleStatusesList);
		response.put("uuid", createdSample.getUuid());
		return response;
	}
	
	@RequestMapping(value = "sample", method = RequestMethod.GET)
	@ResponseBody
	public List<Map<String, Object>> getSamplesByVisit(@RequestParam(value = "visit", required = false) String visitId,
	        @RequestParam(value = "patient", required = false) String patient,
	        @RequestParam(value = "startDate", required = false) String startDate,
	        @RequestParam(value = "endDate", required = false) String endDate) throws Exception {
		
		Date sampleCreatedStartDate = null;
		Date sampleCreatedEndDate = null;
		
		if ((startDate != null || endDate != null) && (startDate.length() > 0 || endDate.length() > 0)) {
			
			SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
			try {
				sampleCreatedStartDate = formatter.parse(startDate);
				if (endDate != null) {
					sampleCreatedEndDate = formatter.parse(endDate);
				}
			}
			catch (Exception e) {
				System.out
				        .println("Dates provided were not in correct format, please format in year-month-date e.g 1990-01-05");
			}
		}
		
		List<Sample> samples = laboratoryService.getSamplesByVisitOrPatientAndOrDates(visitId, patient,
		    sampleCreatedStartDate, sampleCreatedEndDate);
		
		List<Map<String, Object>> responseSamplesObject = new ArrayList<Map<String, Object>>();
		for (Sample sample : samples) {
			
			Map<String, Object> sampleObject = sample.toMap();
			
			//add the sample after creating its object
			responseSamplesObject.add(sampleObject);
			
		}
		
		return responseSamplesObject;
	}
	
	@RequestMapping(value = "sample/{sampleUuid}", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> getSamplesByUuid(@PathVariable String sampleUuid) throws Exception {
		Sample sample = laboratoryService.getSampleByUuid(sampleUuid);
		return sample.toMap();
	}
	
	@RequestMapping(value = "samples", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> getAllSamples(@RequestParam(value = "startDate", required = false) String startDate,
	        @RequestParam(value = "endDate", required = false) String endDate,
	        @RequestParam(defaultValue = "true", value = "paging", required = false) boolean paging,
	        @RequestParam(defaultValue = "50", value = "pageSize", required = false) Integer pageSize,
	        @RequestParam(defaultValue = "1", value = "page", required = false) Integer page,
	        @RequestParam(value = "location", required = false) String locationUuid,
	        @RequestParam(value = "sampleCategory", required = false) String sampleCategory,
	        @RequestParam(value = "testCategory", required = false) String testCategory,
	        @RequestParam(value = "hasStatus", required = false) String hasStatus,
	        @RequestParam(value = "q", required = false) String q,
	        @RequestParam(value = "excludeAllocations", required = false) boolean excludeAllocations,
	        @RequestParam(value = "acceptedBy", required = false) String acceptedByUuid,
	        @RequestParam(value = "test", required = false) String testConceptUuid,
	        @RequestParam(value = "department", required = false) String departmentUuid,
	        @RequestParam(value = "specimen", required = false) String specimenSourceUuid,
	        @RequestParam(value = "instrument", required = false) String instrumentUuid,
	        @RequestParam(value = "visit", required = false) String visitUuid,
	        @RequestParam(value = "excludeStatus", required = false) String excludeStatus) throws Exception {
		
		Date start = null;
		Date end = null;
		if (startDate != null && endDate != null) {
			
			SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
			
			start = formatter.parse(startDate);
			end = formatter.parse(endDate);
			
		}
		Pager pager = new Pager();
		pager.setAllowed(paging);
		pager.setPageSize(pageSize);
		pager.setPage(page);
		if (!excludeAllocations) {
			ListResult<Sample> sampleResults = laboratoryService.getSamples(start, end, pager, locationUuid, sampleCategory,
			    testCategory, q, hasStatus, acceptedByUuid, testConceptUuid, departmentUuid, specimenSourceUuid,
			    instrumentUuid, visitUuid, excludeStatus);
			return sampleResults.toMap();
		}
		if (excludeAllocations) {
			ListResult<SampleExt> sampleResults = laboratoryService.getSamplesWithoutAllocations(start, end, pager,
			    locationUuid, sampleCategory, testCategory, q, hasStatus, acceptedByUuid, testConceptUuid, departmentUuid,
			    specimenSourceUuid, instrumentUuid, visitUuid, excludeStatus);
			return sampleResults.toMap();
		}
		
		return null;
		
		/*List<Sample> samples;
		
		if (startDate != null && endDate != null) {
			
			SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
			
			Date start = formatter.parse(startDate);
			Date end = formatter.parse(endDate);
			
			samples = laboratoryService.getSampleByDates(start, end);
			
		} else {
			samples = laboratoryService.getAllSamples();
		}
		
		List<Map<String, Object>> responseSamplesObject = new ArrayList<Map<String, Object>>();
		for (Sample sample : samples) {
			
			Map<String, Object> sampleObject = sample.toMap();
			
			//add the sample after creating its object
			responseSamplesObject.add(sampleObject);
		}

		return responseSamplesObject;*/
		
	}
	
	@RequestMapping(value = "sampleaccept", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Map<String, Object> acceptSample(@RequestBody Map<String, Object> sampleStatusWithAllocations) throws Exception {
		
		Map<String, Object> sampleStatusMap = (Map<String, Object>) sampleStatusWithAllocations.get("status");
		SampleStatus sampleStatus = SampleStatus.fromMap(sampleStatusMap);
		SampleStatus savedSampleStatus = laboratoryService.updateSampleStatus(sampleStatus);
		
		List<Map<String, Object>> allocationsMapList = (List<Map<String, Object>>) sampleStatusWithAllocations.get("allocations");
		
		List<TestAllocation> allocationsToSave = new ArrayList<TestAllocation>();
		List<Concept> unretiredConcepts = new ArrayList<>();
		for (Map<String, Object> allocationMap : allocationsMapList) {
			Concept concept = Context.getConceptService().getConceptByUuid(((Map)allocationMap.get("concept")).get("uuid").toString());

			if(!concept.getRetired()) {
				unretiredConcepts.add(concept);
				TestAllocation testAllocation = TestAllocation.fromMap(allocationMap);
				allocationsToSave.add(testAllocation);
			}
			
		}
		if(unretiredConcepts.size() == 0){
			throw new Exception("All sample allocations are retired");
		}
		List<TestAllocation> savedAllocations = laboratoryService.createAllocationsForSample(allocationsToSave);
		
		Map<String, Object> response = new HashMap<String, Object>();
		List<Map<String, Object>> savedAllocationsListMap = new ArrayList<Map<String, Object>>();
		
		for (TestAllocation savedAllocation : savedAllocations) {
			savedAllocationsListMap.add((savedAllocation.toMap()));
		}
		
		response.put("status", savedSampleStatus.toMap());
		response.put("allocations", savedAllocationsListMap);
		return response;
	}
	
	@RequestMapping(value = "samplestatus", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> addSampleStatus(@RequestBody Map<String, Object> sampleStatusObject) throws Exception {
		
		SampleStatus sampleStatus = SampleStatus.fromMap(sampleStatusObject);
		
		SampleStatus savedSampleStatus = laboratoryService.updateSampleStatus(sampleStatus);
		
		return savedSampleStatus.toMap();//sampleStatusResponse;
	}
	
	@RequestMapping(value = "sampleorder", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Map<String, Object> createsampleorder(@RequestBody Map<String, Object> sampleOrderObject) throws Exception {
		//save a sample order with the technician
		//		System.out.println(sampleOrderObject);
		SampleOrder sampleOrder = SampleOrder.fromMap(sampleOrderObject);
		SampleOrder newSampleOrder = laboratoryService.saveSampleOrder(sampleOrder);
		//save the sampleorder
		return newSampleOrder.toMap(false);
	}
	
	@RequestMapping(value = "sample/{sampleUuid}/orders", method = RequestMethod.GET)
	@ResponseBody
	public List<Map<String, Object>> getSampleOrdersBySampleUuid(@PathVariable String sampleUuid) throws Exception {
		List<Map<String, Object>> orders = new ArrayList();
		List<Sample> samples = laboratoryService.getSampleOrdersBySampleUuid(sampleUuid);
		for (Sample sample : samples) {
			for (SampleOrder order : sample.getSampleOrders()) {
				orders.add(order.toMap(false));
			}
		}
		return orders;
	}
	
	@RequestMapping(value = "sampledorders/{visitUuid}", method = RequestMethod.GET)
	@ResponseBody
	public List<Map<String, Object>> getSampledOrdersByVisit(@PathVariable String visitUuid) throws Exception {
		List<Map<String, Object>> orders = new ArrayList();
		List<Sample> samples = laboratoryService.getSamplesByVisitOrPatientAndOrDates(visitUuid, null, null, null);
		for (Sample sample : samples) {
			for (SampleOrder sampleOrder : sample.getSampleOrders()) {
				orders.add(sampleOrder.toMap(true));
			}
		}
		return orders;
	}
	
	@RequestMapping(value = "assign", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> updateSampleOrder(@RequestBody Map<String, Object> sampleOrderObject) throws Exception {
		//save a sample order with the technician
		SampleOrder sampleOrder = SampleOrder.fromMap(sampleOrderObject);
		SampleOrder newSampleOrder = laboratoryService.updateSampleOrder(sampleOrder);
		//save the sampleorder
		return newSampleOrder.toMap(false);
	}
	
	@RequestMapping(value = "allocation", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> addTestAllocation(@RequestBody Map<String, Object> testAllocationObject) throws Exception {
		TestAllocation testAllocation = TestAllocation.fromMap(testAllocationObject);
		TestAllocation createdTestAllocation = laboratoryService.allocateTestWithSample(testAllocation);
		return createdTestAllocation.toMap();
	}
	
	@RequestMapping(value = "allocations", method = RequestMethod.GET)
	@ResponseBody
	public List<TestAllocation> getAllocation() {
		return laboratoryService.getAllAllocations();
		
	}
	
	@RequestMapping(value = "allocation", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> getAllocation(@RequestParam(value = "uuid", required = true) String uuid) {
		return laboratoryService.getAllocationByUuid(uuid).toMap();
	}
	
	@RequestMapping(value = "allocationsbyorder", method = RequestMethod.GET)
	@ResponseBody
	public List<TestAllocation> getAllocationsByOrder(@RequestParam(value = "uuid", required = true) String uuid) {
		return laboratoryService.getAllocationsByOrder(uuid);
	}
	
	@RequestMapping(value = "allocationsbysample", method = RequestMethod.GET)
	@ResponseBody
	public List<Map<String, Object>> getAllocationsBySample(@RequestParam(value = "uuid", required = true) String uuid) {
		List<Map<String, Object>> allocations = new ArrayList<>();
		 List<Sample> samplesResponse = laboratoryService.getAllocationsBySample(uuid);
		 if (samplesResponse.size() > 0) {
			 for(Sample sample: samplesResponse) {
				 if (sample.getSampleOrders().size() > 0) {
					 for (SampleOrder order: sample.getSampleOrders()) {
						 if (order.getTestAllocations().size() > 0 && order.getOrder().getVoided() == false) {
							 for (TestAllocation allocation: order.getTestAllocations()) {

								 //Getting concept sets for parameter headers
//								 List<ConceptSet> conceptSets = iCareService.getConceptsSetsByConcept(allocation.getTestConcept().getUuid());
//								 allocation.setConceptSets(conceptSets);
								 allocations.add(allocation.toMap());
							 }
						 }
					 }
				 }
			 }
		 }

		 return  allocations;
	}
	
	@RequestMapping(value = "results", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> addTestAllocationResult(@RequestBody Map<String, Object> resultObject) throws Exception {
		Result result = Result.fromMap(resultObject);
		result.setCreator(Context.getAuthenticatedUser());
		Result savedResults = laboratoryService.recordTestAllocationResults(result);
		return savedResults.toMap();
	}
	
	@RequestMapping(value = "multipleresults", method = RequestMethod.POST)
	@ResponseBody
	public List<Map<String, Object>> saveMultipleResults(@RequestBody List<Map<String, Object>> results) throws Exception {
		List<Result> formattedResults = new ArrayList<>();
		for(Map<String, Object> resultObject: results) {
			Result result = Result.fromMap(resultObject);
			result.setCreator(Context.getAuthenticatedUser());
			formattedResults.add(result);
		}
		List<Map<String, Object>> savedResultsResponse = laboratoryService.saveMultipleResults(formattedResults);
		return savedResultsResponse;
	}
	
	@RequestMapping(value = "voidmultipleresults", method = RequestMethod.PUT)
	@ResponseBody
	public List<Map<String, Object>> voidMultipleResults(@RequestBody Map<String, Object> resultsToVoid) throws Exception {
		List<Map<String, Object>> savedResultsResponse = laboratoryService.voidMultipleResults(resultsToVoid);
		return savedResultsResponse;
	}
	
	@RequestMapping(value = "resultsinstrument", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> saveResultsInstrument(@RequestBody Map<String, Object> resultsInstrument) throws Exception {
		Map<String, Object> savedResultsInstrumentResponse = laboratoryService.saveResultsInstrument(resultsInstrument);
		return savedResultsInstrumentResponse;
	}
	
	@RequestMapping(value = "results", method = RequestMethod.GET)
	@ResponseBody
	public List<Result> getResults() {
		return laboratoryService.getResults();
	}
	
	@RequestMapping(value = "allocationstatus", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> addTestAllocationStatus(@RequestBody HashMap<String, Object> testAllocationStatusObject)
	        throws Exception {
		TestAllocationStatus testAllocationStatus = TestAllocationStatus.fromMap(testAllocationStatusObject);
		TestAllocationStatus savedTestAllocationStatus = laboratoryService.updateTestAllocationStatus(testAllocationStatus);
		return savedTestAllocationStatus.toMap();
		
	}
	
	@RequestMapping(value = "allocationstatuses", method = RequestMethod.POST)
	@ResponseBody
	public List<Map<String, Object>> saveTestAllocationStatuses(
	        @RequestBody List<Map<String, Object>> testAllocationStatusesObject) throws Exception {
		List<TestAllocationStatus> testAllocationStatuses = new ArrayList<TestAllocationStatus>();
		for (Map<String, Object> testAllocationStatusObject : testAllocationStatusesObject) {
			System.out.println(testAllocationStatusesObject);
			TestAllocationStatus testAllocationStatus = TestAllocationStatus.fromMap(testAllocationStatusObject);
			testAllocationStatuses.add(testAllocationStatus);
		}
		
		return laboratoryService.updateTestAllocationStatuses(testAllocationStatuses);
		
	}
	
	@RequestMapping(value = "testtime", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> addTestTimeConfiguration(@RequestBody HashMap<String, Object> testTimeConfigurationMap) {
		
		TestTimeConfig testTimeConfig = TestTimeConfig.fromMap(testTimeConfigurationMap);
		
		Concept testConcept = conceptService.getConceptByUuid(testTimeConfig.getConcept().getUuid());
		
		testTimeConfig.setConcept(testConcept);
		
		TestTimeConfig savedTestTimeConfig = laboratoryService.createTestTimeConfig(testTimeConfig);
		
		return savedTestTimeConfig.toMap();
		
	}
	
	@RequestMapping(value = "testtime/{configUUid}", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> updateTestTimeConfiguration(@PathVariable String configUUid,
	        @RequestBody Map<String, Object> testTimeConfigurationMap) {
		
		TestTimeConfig testTimeConfig = TestTimeConfig.fromMap(testTimeConfigurationMap);
		
		TestTimeConfig oldTestTimeConfig = laboratoryService.getTestTimeConfig(configUUid);
		
		testTimeConfig.setDateCreated(oldTestTimeConfig.getDateCreated());
		
		testTimeConfig.setCreator(oldTestTimeConfig.getCreator());
		
		Concept testConcept = conceptService.getConceptByUuid(testTimeConfig.getConcept().getUuid());
		
		testTimeConfig.setConcept(testConcept);
		
		User userUpdating = Context.getAuthenticatedUser();
		
		testTimeConfig.setChangedBy(userUpdating);
		
		testTimeConfig.setDateChanged(new Date());
		
		TestTimeConfig savedTestTimeConfig = laboratoryService.updateTestTimeConfig(testTimeConfig);
		
		return savedTestTimeConfig.toMap();
		
	}
	
	@RequestMapping(value = "testtime", method = RequestMethod.GET)
	@ResponseBody
	public List<Map<String, Object>> getTestTimeConfigurations(
	        @RequestParam(value = "concept", required = false) String conceptUuid, @RequestParam(required = false) String q) {
		
		if (conceptUuid == null) {
			List<TestTimeConfig> testTimeConfigs = this.laboratoryService.getTestTimeConfigs(q);
			
			List<Map<String, Object>> configsMapList = new ArrayList<Map<String, Object>>();
			
			for (TestTimeConfig config : testTimeConfigs) {
				configsMapList.add(config.toMap());
			}
			return configsMapList;
			
		} else {
			List<TestTimeConfig> testTimeConfigs = this.laboratoryService.getTestTimeConfigByConcept(conceptUuid);
			
			List<Map<String, Object>> configsMapList = new ArrayList<Map<String, Object>>();
			
			for (TestTimeConfig config : testTimeConfigs) {
				configsMapList.add(config.toMap());
			}
			return configsMapList;
			
		}
		
	}
	
	@RequestMapping(value = "testtime/{testConfigUuid}", method = RequestMethod.DELETE)
	@ResponseBody
	public Map<String, Object> deletetestTimeConfiguration(@PathVariable("testConfigUuid") String testConfigUuid) {
		TestTimeConfig testTimeConfig = laboratoryService.deleteTestTimeConfiguration(testConfigUuid);
		return testTimeConfig.toMap();
	}
	
	@RequestMapping(value = "testrange", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> addTestRangeConfiguration(@RequestBody HashMap<String, Object> testRangeConfigurationMap) {
		
		TestRangeConfig testRangeConfig = TestRangeConfig.fromMap(testRangeConfigurationMap);
		
		List<TestRangeConfig> testRangeConfigs = laboratoryService.getTestRangeByConceptAndGender(testRangeConfig
		        .getConcept().getUuid(), testRangeConfig.getGender());
		
		//		if(testRangeConfigs.size() > 0){
		//
		//			Map<String, Object> configsExistNotification = new HashMap<>();
		//			configsExistNotification.put("message", "Range configurations for test concept ".concat(testRangeConfig.getConcept().getUuid()).concat(" for gender ").concat(testRangeConfig.getGender()).concat(" already exists"));
		//
		//			return configsExistNotification;
		//
		//		}
		
		Concept testConcept = conceptService.getConceptByUuid(testRangeConfig.getConcept().getUuid());
		
		testRangeConfig.setConcept(testConcept);
		
		TestRangeConfig savedTestRangeConfig = laboratoryService.createTestRangeConfig(testRangeConfig);
		
		return savedTestRangeConfig.toMap();
		
	}
	
	@RequestMapping(value = "testrange/{configUuid}", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> updateTestRangeConfiguration(@PathVariable String configUuid,
	        @RequestBody HashMap<String, Object> testRangeConfigurationMap) {
		
		TestRangeConfig testRangeConfig = TestRangeConfig.fromMap(testRangeConfigurationMap);
		
		TestRangeConfig oldTestRangeConfig = laboratoryService.getTestRangeConfig(configUuid);
		
		testRangeConfig.setDateCreated(oldTestRangeConfig.getDateCreated());
		
		testRangeConfig.setCreator(oldTestRangeConfig.getCreator());
		
		Concept testConcept = conceptService.getConceptByUuid(testRangeConfig.getConcept().getUuid());
		
		testRangeConfig.setConcept(testConcept);
		
		User userUpdating = Context.getAuthenticatedUser();
		
		testRangeConfig.setChangedBy(userUpdating);
		
		testRangeConfig.setDateChanged(new Date());
		
		TestRangeConfig updatedTestRangeConfig = laboratoryService.updateTestRangeConfig(testRangeConfig);
		
		return updatedTestRangeConfig.toMap();
		
	}
	
	@RequestMapping(value = "testrange", method = RequestMethod.GET)
	@ResponseBody
	public List<Map<String, Object>> getTestRangeConfigurations(
	        @RequestParam(value = "concept", required = false) String conceptUuid) {
		
		if (conceptUuid == null) {
			List<TestRangeConfig> testRangeConfigs = this.laboratoryService.getTestRangeConfigs();
			
			List<Map<String, Object>> configsMapList = new ArrayList<Map<String, Object>>();
			
			for (TestRangeConfig config : testRangeConfigs) {
				configsMapList.add(config.toMap());
			}
			return configsMapList;
			
		} else {
			List<TestRangeConfig> testRangeConfigs = this.laboratoryService.getTestRangeConfigByConcept(conceptUuid);
			
			List<Map<String, Object>> configsMapList = new ArrayList<Map<String, Object>>();
			
			for (TestRangeConfig config : testRangeConfigs) {
				configsMapList.add(config.toMap());
			}
			return configsMapList;
		}
	}
	
	@RequestMapping(value = "sampleidgen", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> generateSampleLabel() {
		String sampleLabel = (String) laboratoryService.generateSampleLabel();
		Map<String, Object> label = new HashMap<>();
		label.put("label", sampleLabel);
		return label;
	}
	
	@RequestMapping(value = "labidgen", method = RequestMethod.GET)
	@ResponseBody
	public List<String> generateLaboratoryIdLabels(
	        @RequestParam(value = "globalProperty", required = true) String globalProperty,
	        @RequestParam(value = "metadataType", required = true) String metadataType,
	        @RequestParam(value = "count", required = false) Integer count) {
		List<String> labLabels = laboratoryService.generateLaboratoryIdLabels(globalProperty, metadataType, count);
		return labLabels;
	}
	
	@RequestMapping(value = "samplelable", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> geenerateSampleLable() {
		
		//check if there is a lable existing
		List<SampleLable> sampleLables = laboratoryService.getSampleLables();
		
		if (sampleLables.size() > 0) {
			
			SampleLable existingSampleLable = sampleLables.get(0);
			Date lastDate = existingSampleLable.getTime();
			
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(lastDate);
			
			Integer existingMonth = calendar.get(Calendar.MONTH);
			Integer existingDate = calendar.get(Calendar.DATE);
			
			Date now = new Date();
			Calendar calendar1 = Calendar.getInstance();
			Integer currentMonth = calendar1.get(Calendar.MONTH);
			Integer currentDate = calendar1.get(Calendar.DATE);
			
			if (currentDate == existingDate && currentMonth == existingMonth) {
				SampleLable sampleLable = new SampleLable();
				sampleLable.setTime(now);
				sampleLable.setCurrentLable(existingSampleLable.getCurrentLable() + 1);
				sampleLable.setId(existingSampleLable.getId());
				
				SampleLable savedSampleLable = laboratoryService.updateSampleLable(sampleLable,
				    existingSampleLable.getCurrentLable());
				
				return savedSampleLable.toMap();
			} else {
				
				SampleLable sampleLable = new SampleLable();
				sampleLable.setTime(now);
				sampleLable.setCurrentLable(1);
				sampleLable.setId(existingSampleLable.getId());
				
				SampleLable savedSampleLable = laboratoryService.updateSampleLable(sampleLable,
				    existingSampleLable.getCurrentLable());
				
				return savedSampleLable.toMap();
				
			}
		} else {
			
			SampleLable sampleLable = new SampleLable();
			sampleLable.setCurrentLable(1);
			
			Date currentTime = new Date();
			sampleLable.setTime(currentTime);
			
			SampleLable savedSampleLable = laboratoryService.addSampleLable(sampleLable);
			
			return savedSampleLable.toMap();
			
		}
		
	}
	
	@RequestMapping(value = "testorderlocation", method = RequestMethod.POST)
	@ResponseBody
	public TestOrderLocation createTestOrderWithLocation(@RequestBody Map<String, Object> testOrderLocation) {
		
		return laboratoryService.addTestOrderWithLocation(TestOrderLocation.fromMap(testOrderLocation));
		
	}
	
	@RequestMapping(value = "workloadsummary", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> onGetWorkloadSummary(@RequestParam(value = "startDate", required = false) String startDate,
	        @RequestParam(value = "endDate", required = false) String endDate) throws ParseException {
		
		Date start = null;
		Date end = null;
		if (startDate != null && endDate != null) {
			
			SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
			
			start = formatter.parse(startDate);
			end = formatter.parse(endDate);
			
		}
		
		WorkloadSummary workloadSummary = laboratoryService.getWorkLoadSummary(start, end);
		
		return workloadSummary.toMap();
	}
	
	@RequestMapping(value = "batches", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public List<Map<String, Object>> addBatch(@RequestBody List<Map<String, Object>> batchesObject) throws Exception {
		
		Batch batch = new Batch();
		List<Map<String, Object>> newBatches = new ArrayList<Map<String, Object>>();
		
		for (Map<String, Object> batchObject : batchesObject) {
			
			batch = Batch.fromMap(batchObject);
			
			if ((batchObject.get("batchSet")) != null) {
				
				BatchSet batchSet = laboratoryService.getBatchSetByUuid(((Map) batchObject.get("batchSet")).get("uuid")
				        .toString());
				batch.setBatchSet(batchSet);
			}
			
			Batch newBatch = laboratoryService.addBatch(batch);
			newBatches.add(newBatch.toMap());
		}
		return newBatches;
	}
	
	@RequestMapping(value = "batches", method = RequestMethod.GET)
	@ResponseBody
	public List<Map<String, Object>> getbatches(@RequestParam(value = "startDate", required = false) String startDate,
	        @RequestParam(value = "endDate", required = false) String endDate,
	        @RequestParam(value = "uuid", required = false) String uuid,
	        @RequestParam(value = "q", required = false) String q, @RequestParam(defaultValue = "0") Integer startIndex,
	        @RequestParam(defaultValue = "100") Integer limit) throws ParseException {
		
		Date start = null;
		Date end = null;
		if (startDate != null && endDate != null) {
			
			SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
			start = formatter.parse(startDate);
			end = formatter.parse(endDate);
		}
		
		List<Batch> batches = laboratoryService.getBatches(start, end, uuid, q, startIndex, limit);
		
		List<Map<String, Object>> responseBatchesObject = new ArrayList<Map<String, Object>>();
		for (Batch batch : batches) {
			Map<String, Object> batchObject = batch.toMap();
			responseBatchesObject.add(batchObject);
		}
		return responseBatchesObject;
	}
	
	@RequestMapping(value = "batchSample", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> getBatchSampleByUuid(@RequestParam(value = "uuid", required = true) String uuid)
	        throws Exception {
		
		BatchSample batchSample = laboratoryService.getBatchSampleByUuid(uuid);
		return batchSample.toMap();
	}
	
	@RequestMapping(value = "batchsamples",method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public List<Map<String,Object>> addBatchSamples(@RequestBody List<Map<String,Object>> batchSamplesObject) throws Exception{

		BatchSample batchSample = new BatchSample();
		List<Map<String,Object>> newBatchSamples = new ArrayList<>();

		for(Map<String,Object> batchSampleObject : batchSamplesObject){

			batchSample = BatchSample.fromMap(batchSampleObject);
			BatchSample newBatchSample = laboratoryService.addBatchSamples(batchSample);
			newBatchSamples.add(newBatchSample.toMap());
		}

		return newBatchSamples;
	}
	
	@RequestMapping(value = "batchsamples",method = RequestMethod.GET)
	@ResponseBody
	public List<Map<String,Object>> getBatchSamples(@RequestParam(value = "startDate", required = false) String startDate, @RequestParam(value = "endDate", required = false) String endDate, @RequestParam(value = "q", required = false) String q, @RequestParam(defaultValue = "0") Integer startIndex, @RequestParam(defaultValue = "100") Integer limit, @RequestParam(value = "batchUuid", required = false) String batchUuid) throws Exception {

		Date start = null;
		Date end = null;
		if (startDate != null && endDate != null) {

			SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
			start = formatter.parse(startDate);
			end = formatter.parse(endDate);
		}

		List<BatchSample> batchSamples = laboratoryService.getBatchSamples(start, end, q, startIndex, limit, batchUuid);

		List<Map<String,Object>> responseBatchSampleObject = new ArrayList<>();
		for(BatchSample batchSample : batchSamples){
			Map<String,Object> batchSampleMap = batchSample.toMap();
			responseBatchSampleObject.add(batchSampleMap);
		}

		return  responseBatchSampleObject;

	}
	
	@RequestMapping(value = "batchsets", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public List<Map<String, Object>> addBatchSet(@RequestBody List<Map<String, Object>> batchSetsObject) {
		
		BatchSet batchSet = new BatchSet();
		List<Map<String, Object>> newBatchSets = new ArrayList<Map<String, Object>>();
		
		for (Map<String, Object> batchSetObject : batchSetsObject) {
			
			batchSet = BatchSet.fromMap(batchSetObject);
			BatchSet newBatchSet = laboratoryService.addBatchSet(batchSet);
			newBatchSets.add(newBatchSet.toMap());
		}
		
		return newBatchSets;
		
	}
	
	@RequestMapping(value = "batchstatus", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Map<String, Object> addBatchStatus(@RequestBody Map<String, Object> batchStatusObject) throws Exception {
		
		BatchStatus batchStatus = BatchStatus.fromMap(batchStatusObject);
		BatchStatus savedBatchStatus = laboratoryService.addBatchStatus(batchStatus);
		
		return savedBatchStatus.toMap();
	}
	
	@RequestMapping(value = "batchsets", method = RequestMethod.GET)
	@ResponseBody
	public List<Map<String, Object>> getbatchsets(@RequestParam(value = "startDate", required = false) String startDate,
	        @RequestParam(value = "endDate", required = false) String endDate,
	        @RequestParam(value = "q", required = false) String q, @RequestParam(defaultValue = "0") Integer startIndex,
	        @RequestParam(defaultValue = "100") Integer limit) throws ParseException {
		
		Date start = null;
		Date end = null;
		if (startDate != null && endDate != null) {
			
			SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
			start = formatter.parse(startDate);
			end = formatter.parse(endDate);
		}
		
		List<BatchSet> batchsets = laboratoryService.getBatchSets(start, end, q, startIndex, limit);
		
		List<Map<String, Object>> responseBatchSetsObject = new ArrayList<Map<String, Object>>();
		for (BatchSet batchSet : batchsets) {
			Map<String, Object> batchObject = batchSet.toMap();
			responseBatchSetsObject.add(batchObject);
		}
		return responseBatchSetsObject;
	}
	
	@RequestMapping(value = "batchsetstatus", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Map<String, Object> addBatchSetStatus(@RequestBody Map<String, Object> batchSetStatusObject) throws Exception {
		
		BatchSetStatus batchSetStatus = BatchSetStatus.fromMap(batchSetStatusObject);
		BatchSetStatus savedbatchSetStatus = laboratoryService.addBatchSetStatus(batchSetStatus);
		
		return savedbatchSetStatus.toMap();
		
	}
	
	@RequestMapping(value = "worksheets", method = RequestMethod.GET)
	@ResponseBody
	public List<Map<String, Object>> getWorkSheets(@RequestParam(value = "startDate", required = false) String startDate,
	        @RequestParam(value = "endDate", required = false) String endDate,
	        @RequestParam(value = "q", required = false) String q, @RequestParam(defaultValue = "0") Integer startIndex,
	        @RequestParam(defaultValue = "100") Integer limit) throws ParseException {
		
		Date start = null;
		Date end = null;
		if (startDate != null && endDate != null) {
			
			SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
			start = formatter.parse(startDate);
			end = formatter.parse(endDate);
		}
		
		List<Worksheet> worksheets = laboratoryService.getWorksheets(start, end, q, startIndex, limit);
		
		List<Map<String, Object>> responseWorkSheetsObject = new ArrayList<Map<String, Object>>();
		for (Worksheet worksheet : worksheets) {
			Map<String, Object> worksheetObject = worksheet.toMap();
			responseWorkSheetsObject.add(worksheetObject);
		}
		
		return responseWorkSheetsObject;
	}
	
	@RequestMapping(value = "worksheets",method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public List<Map<String,Object>> addWorksheet(@RequestBody List<Map<String,Object>> worksheetsObject){

		Worksheet worksheet = new Worksheet();
		List<Map<String,Object>> newWorksheets = new ArrayList<>();

		for(Map<String,Object> worksheetObject : worksheetsObject){

			worksheet = Worksheet.fromMap(worksheetObject);

			Concept testOrderConcept = conceptService.getConceptByUuid(((Map) worksheetObject.get("testorder")).get("uuid").toString());
			worksheet.setTestOrder(testOrderConcept);

			if(worksheetObject.get("instrument") != null){

				Concept instrumentconcept = conceptService.getConceptByUuid(((Map) worksheetObject.get("instrument")).get("uuid").toString());
				worksheet.setInstrument(instrumentconcept);
			}

			Worksheet newworksheet = laboratoryService.addWorksheet(worksheet);
			newWorksheets.add(newworksheet.toMap());


		}
		return newWorksheets;

	}
	
	@RequestMapping(value = "worksheetcontrols", method = RequestMethod.GET)
	@ResponseBody
	public List<Map<String, Object>> getWorkSheetControls(
	        @RequestParam(value = "startDate", required = false) String startDate,
	        @RequestParam(value = "endDate", required = false) String endDate,
	        @RequestParam(value = "q", required = false) String q, @RequestParam(defaultValue = "0") Integer startIndex,
	        @RequestParam(defaultValue = "100") Integer limit) throws ParseException {
		
		Date start = null;
		Date end = null;
		if (startDate != null && endDate != null) {
			
			SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
			start = formatter.parse(startDate);
			end = formatter.parse(endDate);
		}
		
		List<WorksheetControl> worksheetControls = laboratoryService.getWorksheetControls(start, end, q, startIndex, limit);
		
		List<Map<String, Object>> responseWorkSheetControlsObject = new ArrayList<Map<String, Object>>();
		for (WorksheetControl worksheetControl : worksheetControls) {
			Map<String, Object> worksheetControlObject = worksheetControl.toMap();
			responseWorkSheetControlsObject.add(worksheetControlObject);
		}
		
		return responseWorkSheetControlsObject;
	}
	
	@RequestMapping(value = "worksheetcontrols",method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public List<Map<String,Object>> addWorksheetControl(@RequestBody List<Map<String,Object>> worksheetControlsObject){

		WorksheetControl worksheetControl = new WorksheetControl();
		List<Map<String,Object>> newWorksheetControls = new ArrayList<>();

		for(Map<String,Object> worksheetControlObject : worksheetControlsObject){

			worksheetControl = WorksheetControl.fromMap(worksheetControlObject);

			Concept testOrderConcept = conceptService.getConceptByUuid(((Map) worksheetControlObject.get("testorder")).get("uuid").toString());
			worksheetControl.setTestOrder(testOrderConcept);


			WorksheetControl newworksheetControl = laboratoryService.addWorksheetControl(worksheetControl);
			newWorksheetControls.add(newworksheetControl.toMap());

		}
		return newWorksheetControls;

	}
	
	@RequestMapping(value = "worksheetdefinition", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> getWorksheetDefinitionByUuid(@RequestParam(value = "uuid", required = true) String uuid)
	        throws ParseException {
		
		Map<String, Object> worksheetDefinition = laboratoryService.getWorksheetDefinitionByUuid(uuid);
		return worksheetDefinition;
	}
	
	@RequestMapping(value = "worksheetdefinitions",method = RequestMethod.GET)
	@ResponseBody
	public List<Map<String,Object>> getWorksheetDefinitions(@RequestParam(value = "startDate", required = false) String startDate,
															@RequestParam(value = "endDate", required = false) String endDate,
															@RequestParam(value = "q", required = false) String q,
															@RequestParam(defaultValue = "0") Integer startIndex,
															@RequestParam(defaultValue = "100") Integer limit,
															@RequestParam(value = "expirationDate", required = false) String expirationDate,
															@RequestParam(value="instrument", required = false) String instrumentUuid) throws ParseException{

		Date start = null;
		Date end = null;
		Date expirationDateFormatted = null;
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
		if (startDate != null && endDate != null) {
			start = formatter.parse(startDate);
			end = formatter.parse(endDate);
		}

		if (expirationDate !=null) {
			expirationDateFormatted = formatter.parse(expirationDate);
		}

		List<WorksheetDefinition> worksheetDefinitions = laboratoryService.getWorksheetDefinitions(start, end, q, startIndex, limit,expirationDateFormatted,instrumentUuid);

		List<Map<String,Object>> worksheetDefinitionsObject = new ArrayList<>();
		for(WorksheetDefinition worksheetDefinition : worksheetDefinitions){

			Map<String,Object> worksheetDefinitionObject = worksheetDefinition.toMap();
			worksheetDefinitionsObject.add(worksheetDefinitionObject);
		}
		return  worksheetDefinitionsObject;
	}
	
	@RequestMapping(value="worksheetdefinitions",method = RequestMethod.POST,consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public List<Map<String,Object>> addWorksheetDefinitions(@RequestBody List<Map<String,Object>> worksheetDefinitionsObject) throws Exception{

		WorksheetDefinition worksheetDefinition = new WorksheetDefinition();
		List<Map<String,Object>> newWorksheetDefinitions = new ArrayList<>();

		for(Map<String,Object> worksheetDefinitionObject : worksheetDefinitionsObject){

			worksheetDefinition = WorksheetDefinition.fromMap(worksheetDefinitionObject);
			WorksheetDefinition newWorksheetDefinition = laboratoryService.addWorksheetDefinition(worksheetDefinition);
			newWorksheetDefinitions.add(newWorksheetDefinition.toMap());

		}
		return newWorksheetDefinitions;
	}
	
	@RequestMapping(value = "worksheetsamples", method = RequestMethod.GET)
	@ResponseBody
	public List<Map<String,Object>> getWorksheetSamples(@RequestParam(value = "startDate", required = false) String startDate, @RequestParam(value = "endDate", required = false) String endDate, @RequestParam(value = "q", required = false) String q, @RequestParam(defaultValue = "0") Integer startIndex, @RequestParam(defaultValue = "100") Integer limit) throws ParseException{

		Date start = null;
		Date end = null;
		if (startDate != null && endDate != null) {

			SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
			start = formatter.parse(startDate);
			end = formatter.parse(endDate);
		}

		List<WorksheetSample> worksheetSamples = laboratoryService.getWorksheetSamples(start, end, q, startIndex, limit);

		List<Map<String,Object>> worksheetSamplesObject = new ArrayList<>();

		for(WorksheetSample worksheetSample : worksheetSamples){
			Map<String,Object> worksheetSampleObject = worksheetSample.toMap();
			worksheetSamplesObject.add(worksheetSampleObject);

		}
		return worksheetSamplesObject;
	}
	
	@RequestMapping(value="worksheetsamples",method = RequestMethod.POST,consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public List<Map<String,Object>> addWorksheetSamples(@RequestBody List<Map<String,Object>> worksheetSamplesObject) throws Exception{

		WorksheetSample worksheetSample = new WorksheetSample();
		List<Map<String,Object>> newWorksheetSamples = new ArrayList<>();

		for(Map<String,Object> worksheetSampleObject : worksheetSamplesObject){

			worksheetSample = WorksheetSample.fromMap(worksheetSampleObject);
			WorksheetSample newWorksheetSample = laboratoryService.addWorksheetSample(worksheetSample);
			newWorksheetSamples.add(newWorksheetSample.toMap());

		}
		return newWorksheetSamples;
	}
	
	@RequestMapping(value = "worksheetstatus", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Map<String, Object> addWorksheetStatus(@RequestBody Map<String, Object> worksheetStatusObject) throws Exception {
		
		WorksheetStatus worksheetStatus = WorksheetStatus.fromMap(worksheetStatusObject);
		WorksheetStatus newWorksheetStatus = laboratoryService.addWorksheetStatus(worksheetStatus);
		return newWorksheetStatus.toMap();
		
	}
	
	@RequestMapping(value = "worksheetsamplestatus", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Map<String, Object> addWorksheetSampleStatus(@RequestBody Map<String, Object> worksheetSampleObject)
	        throws Exception {
		
		WorksheetSampleStatus worksheetSampleStatus = WorksheetSampleStatus.fromMap(worksheetSampleObject);
		WorksheetSampleStatus newWorksheetSampleStatus = laboratoryService.addWorksheetSampleStatus(worksheetSampleStatus);
		
		return newWorksheetSampleStatus.toMap();
	}
	
	@RequestMapping(value = "associatedfields", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public List<Map<String,Object>> addAssociatedFields(@RequestBody List<Map<String,Object>> associatedFieldListMap){

		List<Map<String,Object>> createdAssociatedFieldsListMap = new ArrayList<>();
		for( Map<String,Object> associatedFieldMap : associatedFieldListMap){

			AssociatedField associatedField = AssociatedField.fromMap(associatedFieldMap);

			AssociatedField createdAssociatedField = laboratoryService.addAssociatedField(associatedField);

			createdAssociatedFieldsListMap.add(createdAssociatedField.toMap());
		}

		return createdAssociatedFieldsListMap;

	}
	
	@RequestMapping(value = "associatedfields", method = RequestMethod.GET)
	@ResponseBody
	public List<Map<String,Object>> getAssociatedFields( @RequestParam(required = false, value = "q") String q, @RequestParam(defaultValue = "0") Integer startIndex, @RequestParam(defaultValue = "100") Integer limit){

		List<Map<String,Object>> responseAssociatedFields = new ArrayList<>();

		List<AssociatedField> associatedFields = laboratoryService.getAssociatedFields(q, startIndex, limit);

		for( AssociatedField associatedField : associatedFields){
			responseAssociatedFields.add(associatedField.toMap());
		}

		return  responseAssociatedFields;
	}
	
	@RequestMapping(value = "associatedfield/{associatedFieldUuid}", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> getAssociatedFieldByUuid(@PathVariable String associatedFieldUuid) {
		
		AssociatedField associatedField = laboratoryService.getAssociatedFieldByUuid(associatedFieldUuid);
		return associatedField.toMap();
	}
	
	@RequestMapping(value = "associatedfield/{associatedFieldUuid}", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Map<String, Object> updateAssociatedField(@PathVariable String associatedFieldUuid,
	        @RequestBody Map<String, Object> associatedFieldMap) {
		
		AssociatedField associatedField = AssociatedField.fromMap(associatedFieldMap);
		AssociatedField updatedAssociatedField = laboratoryService.updateAssociatedField(associatedFieldUuid,
		    associatedField);
		
		return updatedAssociatedField.toMap();
	}
	
	@RequestMapping(value = "testallocationassociatedfields", method = RequestMethod.POST,consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public List<Map<String,Object>> addTestAllocationAssociatedFields( @RequestBody List<Map<String,Object>> allocationAssociatedFieldListMap) throws Exception {

		List<Map<String,Object>> createdAllocationAssociatedField = new ArrayList<>();

		for(Map<String,Object> allocationAssociatedFieldMap : allocationAssociatedFieldListMap){

			TestAllocationAssociatedField testAllocationAssociatedField = TestAllocationAssociatedField.fromMap(allocationAssociatedFieldMap);

			TestAllocationAssociatedField savedTestAllocationAssociatedField = laboratoryService.addTestAllocationAssociatedField(testAllocationAssociatedField);

			createdAllocationAssociatedField.add(savedTestAllocationAssociatedField.toMap());
		}

		return createdAllocationAssociatedField;
	}
	
	@RequestMapping(value = "testallocationassociatedfields", method = RequestMethod.GET)
	@ResponseBody
	public List<Map<String,Object>> getTestAllocationAssociatedField(@RequestParam(value = "q" , required = false) String q, @RequestParam(value = "startIndex", defaultValue = "0") Integer startIndex, @RequestParam( value ="limit", defaultValue = "100") Integer limit, @RequestParam(value = "allocationUuid", required = false) String allocationUuid, @RequestParam(value = "associatedFieldUuid", required = false) String associatedFieldUuid){

		List<Map<String,Object>> testAllocationAssociatedFieldsListMap = new ArrayList<>();

		List<TestAllocationAssociatedField> testAllocationAssociatedFields = laboratoryService.getTestAllocationAssociatedFields(q,startIndex,limit,allocationUuid,associatedFieldUuid);

		for(TestAllocationAssociatedField testAllocationAssociatedField : testAllocationAssociatedFields){
			testAllocationAssociatedFieldsListMap.add(testAllocationAssociatedField.toMap());
		}

		return testAllocationAssociatedFieldsListMap;
	}
	
	@RequestMapping(value = "associatedfieldresults", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public List<Map<String,Object>> addAssociatedFieldResult(@RequestBody List<Map<String,Object>> associatedFieldResultListMap) throws Exception {

		List<Map<String,Object>> createdAssociatedFieldResultListMap = new ArrayList<>();

		for (Map<String,Object> associatedFieldResultMap : associatedFieldResultListMap){
			AssociatedFieldResult associatedFieldResult = AssociatedFieldResult.fromMap(associatedFieldResultMap);

			AssociatedFieldResult savedAssociatedFieldResult = laboratoryService.addAssociatedFieldResult(associatedFieldResult);
			createdAssociatedFieldResultListMap.add(savedAssociatedFieldResult.toMap());
		}
		return createdAssociatedFieldResultListMap;
	}
	
	@RequestMapping(value = "associatedfieldresults", method = RequestMethod.GET)
	@ResponseBody
	public List<Map<String,Object>> getAssociatedFieldResults(@RequestParam(value = "startIndex", defaultValue = "0") Integer startIndex, @RequestParam(value = "limit",defaultValue = "0") Integer limit, @RequestParam(value = "resultUuid", required = false) String resultUuid, @RequestParam(value = "associatedFieldUuid", required = false) String associatedFieldUuid){

		List<Map<String,Object>> associatedFieldResultListMap = new ArrayList<>();

		List<AssociatedFieldResult> associatedFieldResults = laboratoryService.getAssociatedFieldResults(startIndex,limit,resultUuid,associatedFieldUuid);

		for( AssociatedFieldResult associatedFieldResult : associatedFieldResults){
			associatedFieldResultListMap.add(associatedFieldResult.toMap());
		}

		return associatedFieldResultListMap;
	}
}
