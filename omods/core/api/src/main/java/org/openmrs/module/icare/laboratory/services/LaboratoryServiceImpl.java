package org.openmrs.module.icare.laboratory.services;

import org.apache.commons.collections.IteratorUtils;
import org.openmrs.*;
//import org.openmrs.api.ObsService;
import org.openmrs.api.AdministrationService;
import org.openmrs.api.ObsService;
import org.openmrs.api.context.Context;
import org.openmrs.api.impl.BaseOpenmrsService;
import org.openmrs.module.icare.ICareConfig;
import org.openmrs.module.icare.core.ICareService;
import org.openmrs.module.icare.core.ListResult;
import org.openmrs.module.icare.core.Pager;
import org.openmrs.module.icare.laboratory.dao.*;
import org.openmrs.module.icare.laboratory.models.*;

import javax.naming.ConfigurationException;
import java.util.*;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class LaboratoryServiceImpl extends BaseOpenmrsService implements LaboratoryService {
	
	SampleDAO sampleDAO;
	
	SampleStatusDAO sampleStatusDAO;
	
	TestAllocationDAO testAllocationDAO;
	
	ResultDAO resultDAO;
	
	TestAllocationStatusDAO testAllocationStatusDAO;
	
	DeviceDAO deviceDAO;
	
	SampleOrderDAO sampleOrderDAO;
	
	TestRangeConfigDAO testRangeConfigDAO;
	
	TestTimeConfigDAO testTimeConfigDAO;
	
	SampleLableDAO sampleLableDAO;
	
	TestOrderLocationDAO testOrderLocationDAO;
	
	BatchDAO batchDAO;
	
	BatchSetDAO batchSetDAO;
	
	BatchSetStatusDAO batchSetStatusDAO;
	
	BatchStatusDAO batchStatusDAO;
	
	WorksheetDAO worksheetDAO;
	
	WorksheetControlDAO worksheetControlDAO;
	
	WorksheetDefinitionDAO worksheetDefinitionDAO;
	
	WorksheetSampleDAO worksheetSampleDAO;
	
	WorksheetStatusDAO worksheetStatusDAO;
	
	WorksheetSampleStatusDAO worksheetSampleStatusDAO;
	
	BatchSampleDAO batchSampleDAO;
	
	AssociatedFieldDAO associatedFieldDAO;
	
	TestAllocationAssociatedFieldDAO testAllocationAssociatedFieldDAO;
	
	AssociatedFieldResultDAO associatedFieldResultDAO;
	
	public void setSampleDAO(SampleDAO sampleDAO) {
		this.sampleDAO = sampleDAO;
	}
	
	public void setSampleStatusDAO(SampleStatusDAO sampleStatusDAO) {
		this.sampleStatusDAO = sampleStatusDAO;
	}
	
	public void setTestAllocationDAO(TestAllocationDAO testAllocationDAO) {
		this.testAllocationDAO = testAllocationDAO;
	}
	
	public void setResultDAO(ResultDAO resultDAO) {
		this.resultDAO = resultDAO;
	}
	
	public void setDeviceDAO(DeviceDAO deviceDAO) {
		this.deviceDAO = deviceDAO;
	}
	
	public void setSampleOrderDAO(SampleOrderDAO sampleOrderDAO) {
		this.sampleOrderDAO = sampleOrderDAO;
	}
	
	public void setTestAllocationStatusDAO(TestAllocationStatusDAO testAllocationStatusDAO) {
		this.testAllocationStatusDAO = testAllocationStatusDAO;
	}
	
	public void setTestRangeConfigDAO(TestRangeConfigDAO testRangeConfigDAO) {
		this.testRangeConfigDAO = testRangeConfigDAO;
	}
	
	public void setTestTimeConfigDAO(TestTimeConfigDAO testTimeConfigDAO) {
		this.testTimeConfigDAO = testTimeConfigDAO;
	}
	
	public void setSampleLableDAO(SampleLableDAO sampleLableDAO) {
		this.sampleLableDAO = sampleLableDAO;
	}
	
	public void setBatchSetDAO(BatchSetDAO batchSetDAO) {
		this.batchSetDAO = batchSetDAO;
	}
	
	public void setBatchDAO(BatchDAO batchDAO) {
		this.batchDAO = batchDAO;
	}
	
	public void setBatchSampleDAO(BatchSampleDAO batchSampleDAO) {
		this.batchSampleDAO = batchSampleDAO;
	}
	
	public void setBatchSetStatusDAO(BatchSetStatusDAO batchSetStatusDAO) {
		this.batchSetStatusDAO = batchSetStatusDAO;
	}
	
	public void setBatchStatusDAO(BatchStatusDAO batchStatusDAO) {
		this.batchStatusDAO = batchStatusDAO;
	}
	
	public void setWorksheetDAO(WorksheetDAO worksheetDAO) {
		this.worksheetDAO = worksheetDAO;
	}
	
	public void setWorksheetControlDAO(WorksheetControlDAO worksheetControlDAO) {
		this.worksheetControlDAO = worksheetControlDAO;
	}
	
	public void setWorksheetDefinitionDAO(WorksheetDefinitionDAO worksheetDefinitionDAO) {
		this.worksheetDefinitionDAO = worksheetDefinitionDAO;
	}
	
	public void setWorksheetSampleDAO(WorksheetSampleDAO worksheetSampleDAO) {
		this.worksheetSampleDAO = worksheetSampleDAO;
	}
	
	public void setWorksheetStatusDAO(WorksheetStatusDAO worksheetStatusDAO) {
		this.worksheetStatusDAO = worksheetStatusDAO;
	}
	
	public void setWorksheetSampleStatusDAO(WorksheetSampleStatusDAO worksheetSampleStatusDAO) {
		this.worksheetSampleStatusDAO = worksheetSampleStatusDAO;
	}
	
	public void setAssociatedFieldDAO(AssociatedFieldDAO associatedFieldDAO) {
		this.associatedFieldDAO = associatedFieldDAO;
	}
	
	public void setTestAllocationAssociatedFieldDAO(TestAllocationAssociatedFieldDAO testAllocationAssociatedFieldDAO) {
		this.testAllocationAssociatedFieldDAO = testAllocationAssociatedFieldDAO;
	}
	
	public void setAssociatedFieldResultDAO(AssociatedFieldResultDAO associatedFieldResultDAO) {
		this.associatedFieldResultDAO = associatedFieldResultDAO;
	}
	
	@Override
	public Sample createSample(Sample sample) {
		this.sampleDAO.save(sample);
		return sample;
	}
	
	@Override
	public List<Sample> getSamplesByVisit(String id) {
		return this.sampleDAO.getSamplesByVisit(id);
	}
	
	@Override
	public List<Sample> getAllSamples() {
		return IteratorUtils.toList(this.sampleDAO.findAll().iterator());
	}
	
	@Override
	public ListResult<Sample> getSamples(Date startDate, Date endDate, Pager pager, String location, String sampleCategory,
	        String testCategory, String q, String hasStatus, String acceptedByUuid, String testConceptUuid,
	        String departmentUuid, String specimenSourceUuid, String instrumentUuid, String visitUuid, String excludeStatus) {
		return this.sampleDAO.getSamples(startDate, endDate, pager, location, sampleCategory, testCategory, q, hasStatus,
		    acceptedByUuid, testConceptUuid, departmentUuid, specimenSourceUuid, instrumentUuid, visitUuid, excludeStatus);
	}
	
	@Override
	public List<Sample> getSampleByDates(Date startDate, Date endDate) {
		return this.sampleDAO.getSamplesByDates(startDate, endDate);
	}
	
	@Override
	public SampleStatus updateSampleStatus(SampleStatus sampleStatus) throws Exception {
		
		Sample sample = this.getSampleByUuid(sampleStatus.getSample().getUuid());
		if (sample == null) {
			throw new Exception("Sample with ID '" + sampleStatus.getSample().getUuid() + "' does not exist.");
		}
		User user = Context.getUserService().getUserByUuid(sampleStatus.getUser().getUuid());
		if (user == null) {
			throw new Exception("The user is not authenticated.");
		}
		sampleStatus.setSample(sample);
		sampleStatus.setUser(user);
		return this.sampleStatusDAO.save(sampleStatus);
	}
	
	@Override
	public TestAllocation allocateTestWithSample(TestAllocation testAllocation) throws Exception {
		//Check preconditions
		if (testAllocation.getContainer().getUuid() == null) {
			throw new Exception("Container UUID does not exist. Container uuid must be specified");
		}
		if (testAllocation.getSampleOrder().getSample().getUuid() == null) {
			throw new Exception("Sample UUID does not exist. Sample uuid must be specified");
		}
		if (testAllocation.getSampleOrder().getOrder().getUuid() == null) {
			throw new Exception("Order UUID does not exist. Order uuid must be specified");
		}
		
		//Setting Values
		Order order = Context.getOrderService().getOrderByUuid(testAllocation.getSampleOrder().getOrder().getUuid());
		if (order == null) {
			throw new Exception("Order with ID '" + testAllocation.getSampleOrder().getOrder().getUuid()
			        + "' does not exist.");
		}
		
		Sample sample = this.getSampleByUuid(testAllocation.getSampleOrder().getSample().getUuid());
		if (sample == null) {
			throw new Exception("Sample with ID '" + testAllocation.getSampleOrder().getSample().getUuid()
			        + "' does not exist.");
		}
		
		Concept containerConcept = Context.getConceptService().getConceptByUuid(testAllocation.getContainer().getUuid());
		if (containerConcept == null) {
			throw new Exception("Container Concept with ID '" + testAllocation.getContainer().getUuid()
			        + "' does not exist.");
		}
		
		Concept testConcept = Context.getConceptService().getConceptByUuid(testAllocation.getTestConcept().getUuid());
		if (testConcept == null) {
			throw new Exception("Test Concept with ID '" + testAllocation.getTestConcept().getUuid() + "' does not exist.");
		}
		String sampleUuid = testAllocation.getSample().getUuid();
		Sample sampleData = testAllocationDAO.getAllocationsBySample(sampleUuid).get(0);
		TestAllocation matchedAllocation = new TestAllocation();
		Boolean allocationAlreadySet = false;
		if (sampleData != null) {
			if (sample.getSampleOrders().size() > 0) {
				for (SampleOrder sampleOrder : sample.getSampleOrders()) {
					if (sampleOrder.getTestAllocations().size() > 0) {
						for (TestAllocation allocation : sampleOrder.getTestAllocations()) {
							if (allocation.getTestConcept().getUuid().toString() == testConcept.getUuid().toString()) {
								allocationAlreadySet = true;
								matchedAllocation = allocation;
							}
						}
					}
				}
			}
		}
		if (!allocationAlreadySet) {
			testAllocation.setTestConcept(testConcept);
			testAllocation.setContainer(containerConcept);
			testAllocation.getSampleOrder().setSample(sample);
			testAllocation.getSampleOrder().setOrder(order);
			return this.testAllocationDAO.save(testAllocation);
		} else {
			return testAllocationDAO.findByUuid(matchedAllocation.getUuid().toString());
		}
		
	}
	
	@Override
	public List<TestAllocation> createAllocationsForSample(List<TestAllocation> testAllocationList) throws Exception {
		
		List<TestAllocation> testAllocationsListToReturn = new ArrayList<TestAllocation>();
		
		for (TestAllocation testAllocation : testAllocationList) {
			
			if (testAllocation.getContainer().getUuid() == null) {
				throw new Exception("Container UUID does not exist. Container uuid must be specified");
			}
			if (testAllocation.getSampleOrder().getSample().getUuid() == null) {
				throw new Exception("Sample UUID does not exist. Sample uuid must be specified");
			}
			if (testAllocation.getSampleOrder().getOrder().getUuid() == null) {
				throw new Exception("Order UUID does not exist. Order uuid must be specified");
			}
			
			//Setting Values
			Order order = Context.getOrderService().getOrderByUuid(testAllocation.getSampleOrder().getOrder().getUuid());
			if (order == null) {
				throw new Exception("Order with ID '" + testAllocation.getSampleOrder().getOrder().getUuid()
				        + "' does not exist.");
			}
			
			Sample sample = this.getSampleByUuid(testAllocation.getSampleOrder().getSample().getUuid());
			if (sample == null) {
				throw new Exception("Sample with ID '" + testAllocation.getSampleOrder().getSample().getUuid()
				        + "' does not exist.");
			}
			
			Concept containerConcept = Context.getConceptService().getConceptByUuid(testAllocation.getContainer().getUuid());
			if (containerConcept == null) {
				throw new Exception("Container Concept with ID '" + testAllocation.getContainer().getUuid()
				        + "' does not exist.");
			}
			
			Concept testConcept = Context.getConceptService().getConceptByUuid(testAllocation.getTestConcept().getUuid());
			if (testConcept == null) {
				throw new Exception("Test Concept with ID '" + testAllocation.getTestConcept().getUuid()
				        + "' does not exist.");
			}
			
			testAllocation.setTestConcept(testConcept);
			testAllocation.setContainer(containerConcept);
			testAllocation.getSampleOrder().setSample(sample);
			testAllocation.getSampleOrder().setOrder(order);
			
			TestAllocation savedTestAllocation = this.testAllocationDAO.save(testAllocation);
			
			testAllocationsListToReturn.add(savedTestAllocation);
			
		}
		
		return testAllocationsListToReturn;
	}
	
	@Override
	public SampleOrder saveSampleOrder(SampleOrder sampleOrder) {
		
		Order order = Context.getOrderService().getOrderByUuid(sampleOrder.getOrder().getUuid());
		Sample sample = this.sampleDAO.findByUuid(sampleOrder.getSample().getUuid());
		User technician = null;
		if (sampleOrder.getTechnician().getUuid() != null) {
			technician = Context.getUserService().getUserByUuid(sampleOrder.getTechnician().getUuid());
		}
		
		sampleOrder.setSample(sample);
		sampleOrder.setOrder(order);
		if (technician != null) {
			sampleOrder.setTechnician(technician);
		}
		
		return this.sampleOrderDAO.save(sampleOrder);
	}
	
	@Override
	public SampleOrder updateSampleOrder(SampleOrder sampleOrder) throws Exception {
		Order order = Context.getOrderService().getOrderByUuid(sampleOrder.getOrder().getUuid());
		sampleOrder.setOrder(order);
		
		Sample sample = this.sampleDAO.findByUuid(sampleOrder.getSample().getUuid());
		sampleOrder.setSample(sample);
		SampleOrder savedSampleOrder = this.sampleOrderDAO.get(sampleOrder.getId());
		
		User user = Context.getUserService().getUserByUuid(sampleOrder.getTechnician().getUuid());
		if (user == null) {
			throw new Exception("The user with uuid '" + sampleOrder.getTechnician().getUuid() + "' does not exists");
		}
		savedSampleOrder.setTechnician(user);
		return this.sampleOrderDAO.save(savedSampleOrder);
	}
	
	@Override
	public List<SampleOrder> getSampleOrders() {
		return IteratorUtils.toList(this.sampleOrderDAO.findAll().iterator());
	}
	
	@Override
	public List<Sample> getSampleOrdersBySampleUuid(String sampleUuid) {
		return IteratorUtils.toList(this.sampleOrderDAO.getSampleOrdersBySampleUuid(sampleUuid).iterator());
	}
	
	@Override
	public List<Sample> getAllocationsBySample(String sampleUuid) {
		//		Sample sample = this.sampleDAO.findByUuid(sampleUuid);
		//		List<Map<String, Object>> allocations = new ArrayList<>();
		//		if (sample.getSampleOrders().size() > 0) {
		//			for (SampleOrder order: sample.getSampleOrders()) {
		//				if (order.getTestAllocations().size() > 0) {
		//					for (TestAllocation allocation: order.getTestAllocations()) {
		//						allocations.add(allocation.toMap());
		//					}
		//				}
		//			}
		//		}
		return this.testAllocationDAO.getAllocationsBySample(sampleUuid);
	}
	
	@Override
	public List<TestAllocation> getAllocationsByOrder(String orderUuid) {
		return this.testAllocationDAO.getAllocationsByOrder(orderUuid);
	}
	
	@Override
	public List<TestAllocation> getAllAllocations() {
		return IteratorUtils.toList(this.testAllocationDAO.findAll().iterator());
	}
	
	@Override
	public TestAllocation getAllocationByUuid(String allocationUuid) {
		return this.testAllocationDAO.findByUuid(allocationUuid);
	}
	
	@Override
	public Result recordTestAllocationResults(Result result) throws Exception {
		if (result.getConcept().getUuid() == null) {
			throw new Exception("Concept is null. Concept for the result must be provided");
		}
		if (result.getTestAllocation().getUuid() == null) {
			throw new Exception("Test Allocation is null. Test allocation uuid must be provided");
		}
		
		Concept concept = Context.getConceptService().getConceptByUuid(result.getConcept().getUuid());
		if (concept == null) {
			throw new Exception("Concept with id '" + result.getConcept().getUuid() + "' does not exist");
		}
		
		if (result.getTestedBy() != null) {
			User testedBy = Context.getUserService().getUserByUuid(result.getTestedBy().getUuid());
			result.setTestedBy(testedBy);
		}
		
		result.setConcept(concept);
		
		TestAllocation testAllocation = this.testAllocationDAO.findByUuid(result.getTestAllocation().getUuid());
		if (testAllocation == null) {
			throw new Exception("Test Allocation with id '" + result.getTestAllocation().getUuid() + "' does not exist");
		}
		result.setTestAllocation(testAllocation);
		
		if (result.getValueCoded() != null) {
			Concept valueCoded = Context.getConceptService().getConceptByUuid(result.getValueCoded().getUuid());
			result.setValueCoded(valueCoded);
		}
		
		if (result.getValueDrug() != null) {
			Drug drug = Context.getConceptService().getDrugByUuid(result.getValueDrug().getUuid());
			result.setValueDrug(drug);
		}
		
		if (result.getValueGroup() != null && result.getValueGroup().getUuid() != null) {
			Result valueGroup = this.resultDAO.findByUuid(result.getValueGroup().getUuid());
			result.setValueGroup(valueGroup);
		}
		
		if (result.getInstrument() != null) {
			
			Concept instrument = Context.getConceptService().getConceptByUuid(result.getInstrument().getUuid());
			result.setInstrument(instrument);
		}
		
		if (result.getInstrumentCode() != null) {
			String code = result.getInstrumentCode().toString();
			String conceptClassUuid = "";
			AdministrationService administrationService = Context.getAdministrationService();
			conceptClassUuid = administrationService.getGlobalProperty(ICareConfig.LAB_INSTRUMENT_CLASS_UUID);
			List<Concept> instruments = resultDAO.getInstrumentsByCode(code, conceptClassUuid);
			if (instruments.size() > 0) {
				result.setInstrument(instruments.get(0));
			}
		}
		
		Date date = new Date();
		result.setDateCreated(date);
		
		Result response = this.resultDAO.save(result);
		
		/*
		Save status via results
		* */
		TestAllocationStatus resultStatus = new TestAllocationStatus();
		resultStatus.setStatus(result.getStatus());
		resultStatus.setCategory(result.getStatusCategory());
		resultStatus.setRemarks(result.getStatusRemarks());
		resultStatus.setTestResult(response);
		resultStatus.setUser(response.getCreator());
		resultStatus.setTestAllocation(response.getTestAllocation());
		this.testAllocationStatusDAO.save(resultStatus);
		
		//Save associated field via result
		if (result.getAssociatedFieldResults().size() > 0) {
			AssociatedFieldResult associatedFieldResult = new AssociatedFieldResult();
			AssociatedField associatedField = this.associatedFieldDAO.findByUuid(result.getAssociatedFieldResults().get(0)
			        .getAssociatedField().getUuid());
			
			if (associatedField == null) {
				throw new Exception("The associated field with uuid "
				        + result.getAssociatedFieldResults().get(0).getAssociatedField().getUuid() + " does not exist");
			}
			
			associatedFieldResult.setValue(result.getAssociatedFieldResults().get(0).getValue());
			associatedFieldResult.setAssociatedField(associatedField);
			associatedFieldResult.setResult(response);
			this.associatedFieldResultDAO.save(associatedFieldResult);
		}
		return result;
	}
	
	public List<Map<String, Object>> saveMultipleResults(List<Result> results) throws Exception {
		List<Map<String, Object>> resultResponses = new ArrayList<>();
		for (Result result: results) {

			Result response = this.recordTestAllocationResults(result);
            /*
			End of save status via results
			* */
//			TODO: Add support to accommodate new status on the allocation response
			resultResponses.add(response.toMap());
		}
		return  resultResponses;
	}
	
	@Override
	public Result deleteTestAllocationResults(Result result) throws Exception {
		return null;
	}
	
	@Override
	public Result updateTestAllocationResults(Result result) throws Exception {
		Result response = this.resultDAO.update(result);
		return response;
	}
	
	@Override
	public Result voidTestAllocationResults(Result result) throws Exception {
		Result response = this.resultDAO.update(result);
		return response;
	}
	
	public List<Map<String, Object>> voidMultipleResults(Map<String, Object> resultsToVoid) throws Exception {
		List<Map<String, Object>> resultResponses = new ArrayList<>();
		for (Map<String, Object> result: (List<Map<String, Object>>) resultsToVoid.get("results")) {
			Result resultData = resultDAO.findByUuid(result.get("uuid").toString());
			resultData.setVoidReason(resultsToVoid.get("voidReason").toString());
			resultData.setVoided((Boolean) resultsToVoid.get("voided"));
			Result response = this.voidTestAllocationResults(resultData);
			// retire corresponding sample status for results
			String sampleUuid = resultsToVoid.get("sample").toString();
			Sample sample = sampleDAO.findByUuid(sampleUuid);
			for (SampleStatus sampleStatus: sample.getSampleStatuses()) {
				if (sampleStatus.getCategory().equals("HAS_RESULTS")) {
					sampleStatus.setRetired(true);
					SampleStatus statusUpdateResponse = sampleStatusDAO.update(sampleStatus);

					SampleStatus newSampleStatus = new SampleStatus();
					newSampleStatus.setSample(sample);
					newSampleStatus.setCategory("RESULTS_DELETED");
					newSampleStatus.setStatus("DELETED RESULTS");
					newSampleStatus.setRemarks("Auto saved status");
					User user = Context.getAuthenticatedUser();
					newSampleStatus.setUser(user);
					Date date = new Date();
					newSampleStatus.setTimestamp(date);
					SampleStatus newStatusResponse = sampleStatusDAO.save(newSampleStatus);
				}
			}
            /*
			End of save status via results
			* */
//			TODO: Add support to accommodate new status on the allocation response
			resultResponses.add(response.toMap());
		}
		return  resultResponses;
	}
	
	public Map<String, Object> saveResultsInstrument(Map<String, Object> resultsInstrumentObject)throws Exception  {
		Concept instrument = new Concept();
		List responses = new ArrayList();
		if (resultsInstrumentObject.get("instrument") == null || ((Map) resultsInstrumentObject.get("instrument")).get("uuid") == null) {
			throw new Exception("Instrument is not set");
		} else {
//			instrument.setUuid(((Map) resultsInstrumentObject.get("instrument")).get("uuid").toString());
		}

		for (Map<String, Object> resultObject: (ArrayList<Map<String, Object>>) resultsInstrumentObject.get("results")) {
			Result result = new Result();
			result = resultDAO.findByUuid(resultObject.get("uuid").toString());
			String instrumentUuid = ((Map<?, ?>) resultsInstrumentObject.get("instrument")).get("uuid").toString();
			instrument = Context.getConceptService().getConceptByUuid(instrumentUuid);
			Result response = this.resultDAO.updateResultsBySettingInstrument(result, instrument);
			responses.add(response.toMap());
		}
		Map<String, Object> returnResponse = new HashMap<>();
		returnResponse.put("results", responses);
		return returnResponse;
	}
	
	@Override
	public Sample getSampleByUuid(String sampleUuid) {
		return this.sampleDAO.findByUuid(sampleUuid);
	}
	
	@Override
	public List<Result> getResults() {
		return IteratorUtils.toList(this.resultDAO.findAll().iterator());
	}
	
	private Result getResultsByUuid(String uuid) {
		return this.resultDAO.findByUuid(uuid);
	}
	
	private Integer getResultsId(String uuid) {
		return this.resultDAO.findByUuid(uuid).getId();
	}
	
	@Override
	public TestAllocationStatus updateTestAllocationStatus(TestAllocationStatus testAllocationStatus) throws Exception {
		TestAllocation testAllocation = this.testAllocationDAO
		        .findByUuid(testAllocationStatus.getTestAllocation().getUuid());
		if (testAllocation == null) {
			throw new Exception("Test Allocation with ID '" + testAllocationStatus.getTestAllocation().getUuid()
			        + "' does not exist.");
		}
		
		TestAllocationStatus createdStatus = new TestAllocationStatus();
		User user = Context.getUserService().getUserByUuid(testAllocationStatus.getUser().getUuid());
		if (user == null) {
			throw new Exception("The user is not authenticated.");
		}
		Result testResult = new Result();
		if (testAllocationStatus.getTestResult() != null && testAllocationStatus.getTestResult().getUuid() != null) {
			testResult = this.resultDAO.findByUuid(testAllocationStatus.getTestResult().getUuid());
			testAllocationStatus.setTestAllocation(testAllocation);
			testAllocationStatus.setUser(user);
			if (testResult != null) {
				testAllocationStatus.setTestResult(testResult);
			}
			createdStatus = this.testAllocationStatusDAO.save(testAllocationStatus);
			
			//		if (countTestAllocationApprovedStatuses(testAllocation.getUuid()) == 2) {
			
			AdministrationService administrationService = Context.getAdministrationService();
			String labResultApprovalConfig = administrationService
			        .getGlobalProperty(ICareConfig.LAB_RESULT_APPROVAL_CONFIGURATION);
			if (labResultApprovalConfig == null) {
				throw new ConfigurationException("Lab result approval configuration is not set. Please set '"
				        + ICareConfig.LAB_RESULT_APPROVAL_CONFIGURATION + "'");
			}
			if ((testAllocationStatus.getStatus().equals("AUTHORIZED")) && testResult != null) {
				Sample sample = testResult.getTestAllocation().getSample();
				List<Result> resList = testAllocation.getTestAllocationResults();
				
				resList.sort(new Comparator<Result>() {

                    @Override
                    public int compare(Result r1, Result r2) {
                        return r2.getDateCreated().compareTo(r1.getDateCreated());
                    }
                });

				Result allocationResults = testResult;
				//					resList.get(resList.size() - 1);
				//			for (Result allocationResults : testAllocation.getTestAllocationResults()) {

					ObsService observationService = Context.getObsService();

					Encounter encounter = testAllocation.getSampleOrder().getOrder().getEncounter();

					//						testAllocation.getSampleOrder().getOrder().getEncounter();

					Order order = testAllocation.getSampleOrder().getOrder();

					Concept concept = Context.getConceptService().getConceptByUuid(allocationResults.getConcept().getUuid());

					Person person = testAllocation.getSampleOrder().getOrder().getPatient().getPerson();

					List<TestAllocationStatus> testAllocationStatuses = testAllocation.getTestAllocationStatuses();

					List<TestAllocationStatus> resultsRemarks = new ArrayList<TestAllocationStatus>();
					for (TestAllocationStatus status : testAllocationStatuses) {
						if (status.getStatus() != null && status.getCategory() != null && status.getTestResult().getUuid().equals(testResult.getUuid())
						        && (status.getCategory().equals("RESULT_REMARKS"))) {
							resultsRemarks.add(status);
						}
					}

					List<TestAllocationStatus> resultStatuses = new ArrayList<TestAllocationStatus>();
					for (TestAllocationStatus status : testAllocationStatuses) {
						if (status.getStatus() != null && status.getCategory() != null && status.getTestResult().getUuid().equals(testResult.getUuid())
						        && (status.getCategory().equals("RESULT_AMENDMENT"))) {
							resultStatuses.add(status);
						}
					}

					Obs observation = new Obs();
					observation.setConcept(concept);
					observation.setEncounter(encounter);
					observation.setCreator(user);
					observation.setOrder(order);
					observation.setPerson(person);
					observation.setObsDatetime(new Date());
					observation.setDateCreated(new Date());
					observation.setVoided(false);
					if (!resultsRemarks.isEmpty()) {
						observation.setComment(resultsRemarks.get(0).getRemarks());
					}
					if (!resultStatuses.isEmpty()) {
						if (resultStatuses.get(0) != null && resultStatuses.get(0).getStatus() != null) {
							if (resultStatuses.get(0).getStatus().equals("AMENDED")) {
								observation.setStatus(Obs.Status.AMENDED);
							}
						}
					} else {
						observation.setStatus(Obs.Status.FINAL);
					}

					//quick fix for lab - to capture coded results
					Concept codedAnswer = Context.getConceptService().getConceptByUuid(allocationResults.getValueText());
					if (codedAnswer != null) {
						observation.setValueCoded(codedAnswer);
					} else {
						if (allocationResults.getValueText() != null) {
							observation.setValueText(allocationResults.getValueText());
						}

						if (allocationResults.getValueCoded() != null) {
							observation.setValueCoded(Context.getConceptService().getConceptByUuid(
							    allocationResults.getValueCoded().getUuid()));
						}

						if (allocationResults.getValueDrug() != null) {
							observation.setValueDrug(Context.getConceptService().getDrugByUuid(
							    allocationResults.getValueDrug().getUuid()));
						}

						if (allocationResults.getValueBoolean() != null) {
							observation.setValueBoolean(allocationResults.getValueBoolean());
						}

						if (allocationResults.getValueNumeric() != null) {
							observation.setValueNumeric(allocationResults.getValueNumeric());
						}
					}
					//					System.out.println(observation);
					observationService.saveObs(observation, "");
				// Add logic to send email
				// 1. The subject of the email should be stored on a global property.
				// 2. The body of the email should also be stored on a global property
				// 3. Results structure html should be stored on a global property
				
				String shouldSendEmail = administrationService
				        .getGlobalProperty(ICareConfig.LAB_RESULTS_SHOULD_SEND_EMAIL_FOR_AUTHORIZED_RESULTS);
				
//				if (shouldSendEmail == null) {
//					throw new Exception("The configuration of "
//					        + ICareConfig.LAB_RESULTS_SHOULD_SEND_EMAIL_FOR_AUTHORIZED_RESULTS
//					        + " is missing please configure");
//				}
				
				if (shouldSendEmail.equals("true")
				        && administrationService.getGlobalProperty(ICareConfig.LAB_RESULTS_SUBJECT_CONFIGURATION_HTML) != null
				        && administrationService
				                .getGlobalProperty(ICareConfig.LAB_RESULTS_BODY_ATTACHMENT_CONFIGURATION_HTML) != null
				        && administrationService.getGlobalProperty(ICareConfig.LAB_RESULTS_BODY_SUMMARY_CONFIGURATION_HTML) != null
				        && (administrationService.getGlobalProperty(ICareConfig.ICARE_PERSON_EMAIL_ATTRIBUTE_TYPE) != null || administrationService.getGlobalProperty(ICareConfig.ICARE_VISIT_EMAIL_ATTRIBUTE_TYPE) != null)) {
					String attchmentHtml = "";

					List<String> emailsToSendResults = new ArrayList<>();
					Properties emailProperties = new Properties();
					String subject = administrationService.getGlobalProperty(
					    ICareConfig.LAB_RESULTS_SUBJECT_CONFIGURATION_HTML);
					String attachmentHtml = administrationService.getGlobalProperty(
					    ICareConfig.LAB_RESULTS_BODY_ATTACHMENT_CONFIGURATION_HTML);
					String bodySummaryHtml = administrationService.getGlobalProperty(
					    ICareConfig.LAB_RESULTS_BODY_SUMMARY_CONFIGURATION_HTML);
					String bodyFooterHtml = "";
					if (administrationService.getGlobalProperty(ICareConfig.LAB_RESULTS_BODY_FOOTER_CONFIGURATION_HTML) != null) {
						bodyFooterHtml = administrationService.getGlobalProperty(
						    ICareConfig.LAB_RESULTS_BODY_FOOTER_CONFIGURATION_HTML);
					}
					String clientEmailAttributeTypeUuid = administrationService.getGlobalProperty(
					    ICareConfig.ICARE_PERSON_EMAIL_ATTRIBUTE_TYPE);
					String visitEmailAttributeTypeUuid = administrationService.getGlobalProperty(
							ICareConfig.ICARE_VISIT_EMAIL_ATTRIBUTE_TYPE);
					attchmentHtml = attachmentHtml;
					Date date = new Date();
					bodySummaryHtml = bodySummaryHtml.replace("{sampleCollectionDate}", sample.getDateTime().toString());
					bodySummaryHtml = bodySummaryHtml + "<br />" + bodyFooterHtml;
					
					attchmentHtml = attchmentHtml.replace("{date}", date.getDate() + "-" + (date.getMonth() + 1) + "-"
					        + date.getYear());
					
					String regex = "<tbody>(.*?)</tbody>";
					Pattern pattern = Pattern.compile(regex, Pattern.DOTALL);
					Matcher matcher = pattern.matcher(attchmentHtml);
					String tbodyContent = "";
					String fromMail = administrationService.getGlobalProperty("mail.from");
					emailProperties.setProperty("from", fromMail);
					emailProperties.setProperty("subject", subject);
					Visit visit = sample.getVisit();
					Set<VisitAttribute> visitAttributes = visit.getAttributes();
					Set<PersonAttribute> personAttributes = visit.getPatient().getPerson().getAttributes();
					if (clientEmailAttributeTypeUuid != null) {
						for (PersonAttribute personAttribute : personAttributes) {
							if (personAttribute.getAttributeType().getUuid().equals(clientEmailAttributeTypeUuid)) {
								// TODO: Validate the email address
								emailsToSendResults.add(personAttribute.getValue());
							}
						}
					}

					if (visitEmailAttributeTypeUuid != null) {
						for (VisitAttribute visitAttribute : visitAttributes) {
							if (visitAttribute.getAttributeType().getUuid().equals(visitEmailAttributeTypeUuid)) {
								// TODO: Validate the email address
								emailsToSendResults.add(visitAttribute.getValue().toString());
							}
						}
					}
					// Process results for each of the order with
					if (matcher.find()) {
						tbodyContent = matcher.group(1);
						String newTableBodies = "";
						for (SampleOrder sampleOrder : sample.getSampleOrders()) {
							newTableBodies = newTableBodies
							        + tbodyContent.replace("{test}", sampleOrder.getOrder().getConcept().getDisplayString());
							String regExpForParameterRow = "<tr parameterrepeatable>.*?</tr>";
							Pattern parameterPattern = Pattern.compile(regExpForParameterRow, Pattern.DOTALL);
							Matcher parameterRowMatcher = parameterPattern.matcher(tbodyContent.toString());
							String parameterRow = "";
							String newRows = "";
							
							if (parameterRowMatcher.find() && !sampleOrder.getOrder().getConcept().getSetMembers().isEmpty()) {
								parameterRow = parameterRowMatcher.group(0);
								int count = 1;
								for (Concept conceptSetMember : sampleOrder.getOrder().getConcept().getSetMembers()) {
									String resultValue = "Processing ....";
									String comment = " - ";
									for (TestAllocation testAllocationRef : sampleOrder.getTestAllocations()) {
										if (testAllocationRef.getTestConcept().getUuid().equals(conceptSetMember.getUuid())) {
											resultValue = getTestResultsValueFromTestAllocation(testAllocationRef);
											Result result = new Result();
											if (!testAllocationRef.getTestAllocationResults().isEmpty()) {
												result =testAllocationRef.getTestAllocationResults().get(
														testAllocationRef.getTestAllocationResults().size() - 1);
											}
											for (TestAllocationStatus allocationStatus : testAllocationRef
											        .getTestAllocationStatuses()) {
												if (result != null && allocationStatus != null && allocationStatus.getTestResult() != null && allocationStatus.getTestResult().getUuid().equals(result.getUuid())
												        && allocationStatus.getCategory() != null && allocationStatus.getCategory()
												                .equalsIgnoreCase("result_remarks") && allocationStatus.getRemarks() != null) {
													comment = allocationStatus.getRemarks();
												}
											}
											;
										}
									}
									newRows = newRows
									        + parameterRow.replace("{sn}", Integer.toString(count))
									                .replace("{parameter}", conceptSetMember.getDisplayString())
									                .replace("{result}", resultValue)
													.replace("{comment}", comment);
									newTableBodies = newTableBodies.replace(parameterRow, newRows);
									count = count + 1;
								}
							} else if (sampleOrder.getOrder().getConcept().getSetMembers().isEmpty()) {
								String resultValue = "Processing";
								String comment = " - ";
								Concept orderConcept = sampleOrder.getOrder().getConcept();
								for (TestAllocation testAllocationRef : sampleOrder.getTestAllocations()) {
									if (testAllocationRef.getTestConcept().getUuid().equals(orderConcept.getUuid())) {
										resultValue = getTestResultsValueFromTestAllocation(testAllocationRef);
										Result result = new Result();
										if (testAllocationRef.getTestAllocationResults() != null && !testAllocationRef.getTestAllocationResults().isEmpty()) {
											result = testAllocationRef.getTestAllocationResults().get(
													testAllocationRef.getTestAllocationResults().size() - 1);
										}
										for (TestAllocationStatus allocationStatus : testAllocationRef
										        .getTestAllocationStatuses()) {
											if (result != null && allocationStatus != null && allocationStatus.getTestResult() != null && allocationStatus.getTestResult().getUuid().equals(result.getUuid())
											        && allocationStatus.getCategory() != null && allocationStatus.getCategory().equalsIgnoreCase("result_remarks")) {
												comment = allocationStatus.getRemarks();
											}
										}
										;
									}
								}
								newRows = newRows
								        + parameterRow.replace("{sn}", "1")
								                .replace("{parameter}", orderConcept.getDisplayString())
								                .replace("{result}", resultValue).replace("{comment}", comment);
								newTableBodies = newTableBodies.replace(parameterRow, newRows);
							}
							attchmentHtml = attchmentHtml.replace(matcher.group(0), newTableBodies);
							//						System.out.println(content);
						}
					}
					emailProperties.setProperty("content", bodySummaryHtml);
					emailProperties.setProperty("attachmentFile", attchmentHtml);
					emailProperties.setProperty("attachmentFileName", "NPHL_results.pdf");
					ICareService iCareService = Context.getService(ICareService.class);
					for(String email: emailsToSendResults) {
						emailProperties.setProperty("to", email);
						iCareService.processEmail(emailProperties);
					}
				}
			}
		}
		return createdStatus;
	}
	
	private String getTestResultsValueFromTestAllocation(TestAllocation testAllocation) throws Exception {
		String resultValue = "Processing ....";
		// TODO: Add support for all concept data types supported
		if (testAllocation != null && testAllocation.getTestAllocationResults() != null
		        && !testAllocation.getTestAllocationResults().isEmpty()) {
			if (testAllocation.getTestConcept().getDatatype().isText()) {
				resultValue = testAllocation.getTestAllocationResults()
				        .get(testAllocation.getTestAllocationResults().size() - 1).getValueText();
			} else if (testAllocation.getTestConcept().getDatatype().isCoded()) {
				if (testAllocation.getTestAllocationResults().get(testAllocation.getTestAllocationResults().size() - 1) != null
				        && testAllocation.getTestAllocationResults()
				                .get(testAllocation.getTestAllocationResults().size() - 1).getValueCodedName() != null) {
					resultValue = testAllocation.getTestAllocationResults()
					        .get(testAllocation.getTestAllocationResults().size() - 1).getValueCodedName().getName();
				}
			} else if (testAllocation.getTestConcept().getDatatype().isNumeric()) {
				if (testAllocation.getTestAllocationResults().get(testAllocation.getTestAllocationResults().size() - 1) != null
				        && testAllocation.getTestAllocationResults()
				                .get(testAllocation.getTestAllocationResults().size() - 1).getValueNumeric() != null) {
					resultValue = testAllocation.getTestAllocationResults()
					        .get(testAllocation.getTestAllocationResults().size() - 1).getValueNumeric().toString();
				}
			} else if (testAllocation.getTestConcept().getDatatype().isBoolean()) {
				if (testAllocation.getTestAllocationResults().get(testAllocation.getTestAllocationResults().size() - 1) != null
				        && testAllocation.getTestAllocationResults()
				                .get(testAllocation.getTestAllocationResults().size() - 1).getValueBoolean() != null) {
					resultValue = testAllocation.getTestAllocationResults()
					        .get(testAllocation.getTestAllocationResults().size() - 1).getValueBoolean().toString();
				}
			} else {
				resultValue = "NA";
			}
		}
		return resultValue;
	}
	
	public List<Map<String, Object>> updateTestAllocationStatuses(List<TestAllocationStatus> testAllocationStatuses) throws Exception {
		List<Map<String, Object>> responses = new ArrayList<>();
		for(TestAllocationStatus testAllocationStatus: testAllocationStatuses) {
			TestAllocationStatus response = this.updateTestAllocationStatus(testAllocationStatus);
			responses.add(response.toMap());
		}
		return responses;
	}
	
	@Override
	public Device getDeviceByUuid(String deviceUuid) {
		return this.deviceDAO.findByUuid(deviceUuid);
	}
	
	@Override
	public TestRangeConfig createTestRangeConfig(TestRangeConfig testRangeConfig) {
		TestRangeConfig savedTestRangeConfig = this.testRangeConfigDAO.save(testRangeConfig);
		
		return savedTestRangeConfig;
	}
	
	@Override
	public TestRangeConfig updateTestRangeConfig(TestRangeConfig testRangeConfig) {
		
		TestRangeConfig updatedTestRangeConfig = this.testRangeConfigDAO.updateRangeConfigs(testRangeConfig);
		
		return updatedTestRangeConfig;
	}
	
	@Override
	public List<TestRangeConfig> getTestRangeConfigs() {
		return IteratorUtils.toList(this.testRangeConfigDAO.findAll().iterator());
	}
	
	@Override
	public TestRangeConfig getTestRangeConfig(String uuid) {
		return this.testRangeConfigDAO.findByUuid(uuid);
	}
	
	@Override
	public List<TestRangeConfig> getTestRangeConfigByConcept(String testConceptUuid) {
		return this.testRangeConfigDAO.getConfigsByConcept(testConceptUuid);
	}
	
	@Override
	public List<TestRangeConfig> getTestRangeByConceptAndGender(String testConceptUuid, String gender) {
		return this.testRangeConfigDAO.getConfigsByConceptAndGender(testConceptUuid, gender);
	}
	
	@Override
	public TestTimeConfig createTestTimeConfig(TestTimeConfig testTimeConfig) {
		
		TestTimeConfig savedTestTimeConfig = this.testTimeConfigDAO.save(testTimeConfig);
		
		return savedTestTimeConfig;
	}
	
	@Override
	public TestTimeConfig updateTestTimeConfig(TestTimeConfig testTimeConfig) {
		
		TestTimeConfig updatedTestTimeConfig = this.testTimeConfigDAO.updateConfig(testTimeConfig);
		
		return updatedTestTimeConfig;
	}
	
	@Override
	public List<TestTimeConfig> getTestTimeConfigs(String q) {
		//return IteratorUtils.toList(this.testTimeConfigDAO.findAll().iterator());
		return this.testTimeConfigDAO.getConfig(q);
	}
	
	@Override
	public TestTimeConfig getTestTimeConfig(String uuid) {
		return this.testTimeConfigDAO.findByUuid(uuid);
	}
	
	@Override
	public List<TestTimeConfig> getTestTimeConfigByConcept(String testConceptUuid) {
		
		List<TestTimeConfig> configsList = this.testTimeConfigDAO.getConfigsByConcept(testConceptUuid);
		
		return configsList;
	}
	
	@Override
	public List<SampleLable> getSampleLables() {
		return IteratorUtils.toList(this.sampleLableDAO.findAll().iterator());
	}
	
	@Override
	public String generateSampleLabel() {
		return this.sampleLableDAO.generateSampleLabel();
	}
	
	@Override
	public List<String> generateLaboratoryIdLabels(String globalPropertyUuid, String metadataType, Integer count) {
		return this.sampleLableDAO.generateLaboratoryIdLabels(globalPropertyUuid, metadataType, count);
	}
	
	@Override
	public SampleLable addSampleLable(SampleLable sampleLable) {
		return this.sampleLableDAO.save(sampleLable);
	}
	
	@Override
	public SampleLable updateSampleLable(SampleLable sampleLable, Integer previousLable) {
		return this.sampleLableDAO.updateSampleLable(sampleLable, previousLable);
	}
	
	@Override
	public List<Visit> getSamplePendingVisits(Integer limit, Integer startIndex) {
		return this.sampleDAO.getPendingSampleCollectionVisits(limit, startIndex);
	}
	
	Integer countTestAllocationApprovedStatuses(String testAllocationUuid) {
		
		List<TestAllocationStatus> testAllocationsStatuses = this.testAllocationStatusDAO
		        .findTestAllocationStatusByStatusAndTestAllocation(testAllocationUuid);
		
		return testAllocationsStatuses.size();
		
	}
	
	@Override
	public List<Sample> getSamplesByVisitOrPatientAndOrDates(String visitId, String patient, Date startDate, Date endDate) {
		return this.sampleDAO.getSamplesByVisitOrPatientAndOrDates(visitId, patient, startDate, endDate);
	}
	
	@Override
	public TestOrderLocation addTestOrderWithLocation(TestOrderLocation testOrderLocation) {
		
		Concept concept = Context.getConceptService().getConceptByUuid(testOrderLocation.getConcept().getUuid());
		Location location = Context.getLocationService().getLocationByUuid(testOrderLocation.getLocation().getUuid());
		//User user = Context.getUserService().getUserByUuid(testOrderLocation.getUser().getUuid());
		User user = Context.getAuthenticatedUser();
		
		Date date = new Date();
		
		testOrderLocation.setConcept(concept);
		testOrderLocation.setLocation(location);
		testOrderLocation.setUser(user);
		testOrderLocation.setDateTime(date);
		
		testOrderLocationDAO.save(testOrderLocation);
		
		return testOrderLocation;
	}
	
	public WorkloadSummary getWorkLoadSummary(Date startDate, Date endDate) {
		return sampleDAO.getWorkloadSummary(startDate, endDate);
	}
	
	@Override
	public List<Batch> getBatches(Date startDate, Date endDate, String uuid, String q, Integer startIndex, Integer limit) {
		return batchDAO.getBatches(startDate, endDate, uuid, q, startIndex, limit);
	}
	
	@Override
	public Batch getBatchByUuid(String batchUuid) {
		return batchDAO.findByUuid(batchUuid);
	}
	
	@Override
	public List<Sample> getSamplesByBatchSampleUuid(String batchUuid) {
		
		return sampleDAO.getSamplesByBatchSampleUuid(batchUuid);
	}
	
	@Override
	public Batch addBatch(Batch batch) {
		return batchDAO.save(batch);
	}
	
	@Override
	public BatchSample addBatchSamples(BatchSample batchSample) throws Exception {
		Batch batch = batchDAO.findByUuid(batchSample.getBatch().getUuid());
		if (batch == null) {
			throw new Exception("The batch with uuid " + batchSample.getBatch().getUuid() + " does not exist");
		}
		
		batchSample.setBatch(batch);
		return batchSampleDAO.save(batchSample);
	}
	
	@Override
	public BatchSample getBatchSampleByUuid(String batchSampleUuid) {
		return batchSampleDAO.findByUuid(batchSampleUuid);
	}
	
	@Override
	public List<BatchSample> getBatchSamples(Date startDate, Date endDate, String q, Integer startIndex, Integer limit,
	        String batchUuid) {
		
		List<BatchSample> batchSamples = batchSampleDAO.getBatchSamples(startDate, endDate, q, startIndex, limit, batchUuid);
		
		for (BatchSample batchSample : batchSamples) {
			for (Sample sample : batchSample.getSamples()) {
				List<WorksheetSample> worksheetSamples = this.worksheetSampleDAO
				        .getWorksheetSampleBySample(sample.getUuid());
				if (worksheetSamples.size() > 0) {
					sample.setWorksheetSample(worksheetSamples.get(0));
				}
			}
		}
		return batchSamples;
	}
	
	@Override
	public ListResult<SampleExt> getSamplesWithoutAllocations(Date startDate, Date endDate, Pager pager, String location,
	        String sampleCategory, String testCategory, String q, String hasStatus, String acceptedByUuid,
	        String testConceptUuid, String departmentUuid, String specimenSourceUuid, String instrumentUuid,
	        String visitUuid, String excludeStatus) {
		return sampleDAO.getSamplesWithoutAllocations(startDate, endDate, pager, location, sampleCategory, testCategory, q,
		    hasStatus, acceptedByUuid, testConceptUuid, departmentUuid, specimenSourceUuid, instrumentUuid, visitUuid,
		    excludeStatus);
	}
	
	@Override
	public AssociatedField addAssociatedField(AssociatedField associatedField) {
		return associatedFieldDAO.save(associatedField);
	}
	
	@Override
	public List<AssociatedField> getAssociatedFields(String q, Integer startIndex, Integer limit) {
		return associatedFieldDAO.getAssociatedFields(q, startIndex, limit);
	}
	
	@Override
	public TestAllocationAssociatedField addTestAllocationAssociatedField(
	        TestAllocationAssociatedField testAllocationAssociatedField) throws Exception {
		
		if (testAllocationAssociatedField.getTestAllocation() != null) {
			TestAllocation testAllocation = this.testAllocationDAO.findByUuid(testAllocationAssociatedField
			        .getTestAllocation().getUuid());
			
			if (testAllocation == null) {
				throw new Exception("The test allocation with uuid "
				        + testAllocationAssociatedField.getTestAllocation().getUuid() + " does not exist");
			}
			testAllocationAssociatedField.setTestAllocation(testAllocation);
		}
		
		if (testAllocationAssociatedField.getAssociatedField() != null) {
			AssociatedField associatedField = this.associatedFieldDAO.findByUuid(testAllocationAssociatedField
			        .getAssociatedField().getUuid());
			
			if (associatedField == null) {
				throw new Exception(" The associated field with uuid "
				        + testAllocationAssociatedField.getAssociatedField().getUuid() + " does not exist");
			}
			testAllocationAssociatedField.setAssociatedField(associatedField);
		}
		return testAllocationAssociatedFieldDAO.save(testAllocationAssociatedField);
	}
	
	@Override
	public List<TestAllocationAssociatedField> getTestAllocationAssociatedFields(String q, Integer startIndex,
	        Integer limit, String allocationUuid, String associatedFieldUuid) {
		return testAllocationAssociatedFieldDAO.getTestAllocationAssociatedField(q, startIndex, limit, allocationUuid,
		    associatedFieldUuid);
	}
	
	@Override
	public AssociatedFieldResult addAssociatedFieldResult(AssociatedFieldResult associatedFieldResult) throws Exception {
		
		if (associatedFieldResult.getAssociatedField() != null) {
			
			AssociatedField associatedField = this.associatedFieldDAO.findByUuid(associatedFieldResult.getAssociatedField()
			        .getUuid());
			if (associatedField == null) {
				throw new Exception(" The associated field with uuid "
				        + associatedFieldResult.getAssociatedField().getUuid() + " does not exist");
			}
			associatedFieldResult.setAssociatedField(associatedField);
		}
		
		if (associatedFieldResult.getResult() != null) {
			Result result = this.resultDAO.findByUuid(associatedFieldResult.getResult().getUuid());
			if (result == null) {
				throw new Exception(" The result with uuid" + associatedFieldResult.getResult().getUuid()
				        + " does not exist");
			}
			associatedFieldResult.setResult(result);
		}
		
		return associatedFieldResultDAO.save(associatedFieldResult);
	}
	
	@Override
	public List<AssociatedFieldResult> getAssociatedFieldResults(Integer startIndex, Integer limit, String resultUuid,
	        String associatedFieldUuid) {
		return associatedFieldResultDAO.getAssociatedFieldResult(startIndex, limit, resultUuid, associatedFieldUuid);
	}
	
	@Override
	public AssociatedField getAssociatedFieldByUuid(String associatedFieldUuid) {
		return associatedFieldDAO.findByUuid(associatedFieldUuid);
	}
	
	@Override
	public AssociatedField updateAssociatedField(String associatedFieldUuid, AssociatedField associatedField) {
		return associatedFieldDAO.updateAssociatedField(associatedFieldUuid, associatedField);
	}
	
	@Override
	public TestTimeConfig deleteTestTimeConfiguration(String testConfigUuid) {
		return testTimeConfigDAO.deleteTestConfig(testConfigUuid);
	}
	
	public BatchSet addBatchSet(BatchSet batchSet) {
		return batchSetDAO.save(batchSet);
	}
	
	@Override
	public BatchStatus addBatchStatus(BatchStatus batchStatus) throws Exception {
		
		Batch batch = this.getBatchByUuid(batchStatus.getBatch().getUuid());
		
		if (batch == null) {
			throw new Exception("The batch with id " + batchStatus.getBatch().getUuid() + " does not exist");
		}
		User user = Context.getUserService().getUserByUuid(batchStatus.getUser().getUuid());
		if (user == null) {
			throw new Exception("The user with id " + batchStatus.getUser().getUuid() + " does not exist");
		}
		
		batchStatus.setBatch(batch);
		batchStatus.setUser(user);
		return batchStatusDAO.save(batchStatus);
	}
	
	@Override
	public List<BatchSet> getBatchSets(Date startDate, Date endDate, String q, Integer startIndex, Integer limit) {
		return batchSetDAO.getBatchSets(startDate, endDate, q, startIndex, limit);
	}
	
	@Override
	public BatchSet getBatchSetByUuid(String batchSetUuid) {
		return batchSetDAO.findByUuid(batchSetUuid);
	}
	
	@Override
	public BatchSetStatus addBatchSetStatus(BatchSetStatus batchSetStatus) throws Exception {
		
		BatchSet batchSet = this.getBatchSetByUuid(batchSetStatus.getBatchSet().getUuid());
		if (batchSet == null) {
			throw new Exception("The batchSet with id " + batchSetStatus.getBatchSet().getUuid() + " does not exist");
		}
		
		User user = Context.getUserService().getUserByUuid(batchSetStatus.getUser().getUuid());
		if (user == null) {
			throw new Exception(" The user with id " + batchSetStatus.getUser().getUuid() + " does not exist");
		}
		
		batchSetStatus.setBatchSet(batchSet);
		batchSetStatus.setUser(user);
		
		BatchSetStatus savedBatchSetStatus = batchSetStatusDAO.save(batchSetStatus);
		
		return savedBatchSetStatus;
	}
	
	@Override
	public List<Worksheet> getWorksheets(Date startDate, Date endDate, String q, Integer startIndex, Integer limit) {
		return worksheetDAO.getWorksheets(startDate, endDate, q, startIndex, limit);
	}
	
	@Override
	public Worksheet getWorksheetByUuid(String worksheetUuid) {
		return worksheetDAO.findByUuid(worksheetUuid);
	}
	
	@Override
	public Worksheet addWorksheet(Worksheet worksheet) {
		return worksheetDAO.save(worksheet);
	}
	
	@Override
	public List<WorksheetControl> getWorksheetControls(Date startDate, Date endDate, String q, Integer startIndex,
	        Integer limit) {
		return worksheetControlDAO.getWorksheetControls(startDate, endDate, q, startIndex, limit);
	}
	
	@Override
	public WorksheetControl getWorksheetControlByUuid(String worksheetControlUuid) {
		return worksheetControlDAO.findByUuid(worksheetControlUuid);
	}
	
	@Override
	public WorksheetControl addWorksheetControl(WorksheetControl worksheetControl) {
		return worksheetControlDAO.save(worksheetControl);
	}
	
	@Override
	public List<WorksheetDefinition> getWorksheetDefinitions(Date startDate, Date endDate, String q, Integer startIndex,
	        Integer limit, Date expirationDate, String instrumentUuid) {
		return worksheetDefinitionDAO.getWorksheetDefinitions(startDate, endDate, q, startIndex, limit, expirationDate,
		    instrumentUuid);
	}
	
	@Override
	public Map<String, Object> getWorksheetDefinitionByUuid(String worksheetDefinitionUuid) {
		WorksheetDefinition worksheetDefinition = worksheetDefinitionDAO.findByUuid(worksheetDefinitionUuid);
		List<WorksheetSample> worksheetSamples = worksheetSampleDAO.getWorksheetSamplesByWorksheetDefinition(worksheetDefinition.getUuid().toString());

		Map<String, Object> worksheetDefinitionModified = new HashMap<>();
		worksheetDefinitionModified.put("uuid", worksheetDefinition.getUuid());
		worksheetDefinitionModified.put("code", worksheetDefinition.getCode());
		worksheetDefinitionModified.put("display", worksheetDefinition.getCode());
		worksheetDefinitionModified.put("additionFields", worksheetDefinition.getAdditionalFields());

		List<Map<String, Object>> worksheetSamplesList = new ArrayList<>();
		for (WorksheetSample wSample: worksheetSamples) {
			worksheetSamplesList.add(wSample.toMap());
		}
		worksheetDefinitionModified.put("worksheetSamples", worksheetSamplesList);
		worksheetDefinitionModified.put("worksheet", worksheetDefinition.getWorksheet().toMap());
		return worksheetDefinitionModified;
	}
	
	@Override
	public WorksheetDefinition getDefaultWorksheetDefinitionByUuid(String worksheetDefinitionUuid) {
		WorksheetDefinition worksheetDefinition = worksheetDefinitionDAO.findByUuid(worksheetDefinitionUuid);
		return worksheetDefinition;
	}
	
	@Override
	public WorksheetDefinition addWorksheetDefinition(WorksheetDefinition worksheetDefinition) throws Exception {
		
		Worksheet worksheet = this.getWorksheetByUuid(worksheetDefinition.getWorksheet().getUuid());
		if (worksheet == null) {
			throw new Exception("The worksheet definition with id " + worksheetDefinition.getWorksheet().getUuid()
			        + " does not exist");
		}
		worksheetDefinition.setWorksheet(worksheet);
		return worksheetDefinitionDAO.save(worksheetDefinition);
	}
	
	@Override
	public List<WorksheetSample> getWorksheetSamples(Date startDate, Date endDate, String q, Integer startIndex,
	        Integer limit) {
		return worksheetSampleDAO.getWorksheetSamples(startDate, endDate, q, startIndex, limit);
	}
	
	@Override
	public WorksheetSample getWorksheetSampleByUuid(String worksheetSampleUuid) {
		return worksheetSampleDAO.findByUuid(worksheetSampleUuid);
	}
	
	@Override
	public WorksheetSample addWorksheetSample(WorksheetSample worksheetSample) throws Exception {
		
		if (worksheetSample.getSample() != null) {
			Sample sample = this.getSampleByUuid(worksheetSample.getSample().getUuid());
			if (sample == null) {
				throw new Exception("The sample with id " + worksheetSample.getSample().getUuid() + " does not exist");
			}
			worksheetSample.setSample(sample);
		}
		
		WorksheetDefinition worksheetDefinition = this.getDefaultWorksheetDefinitionByUuid(worksheetSample
		        .getWorksheetDefinition().getUuid());
		if (worksheetDefinition == null) {
			throw new Exception("The worksheet definition with id " + worksheetSample.getWorksheetDefinition().getUuid()
			        + " does not exist");
		}
		
		if (worksheetSample.getWorksheetControl() != null) {
			WorksheetControl worksheetControl = this.getWorksheetControlByUuid(worksheetSample.getWorksheetControl()
			        .getUuid());
			if (worksheetControl == null) {
				throw new Exception("The worksheet control with id " + worksheetSample.getWorksheetControl().getUuid()
				        + " does not exist");
			}
			worksheetSample.setWorksheetControl(worksheetControl);
		}
		worksheetSample.setWorksheetDefinition(worksheetDefinition);
		return worksheetSampleDAO.save(worksheetSample);
	}
	
	public WorksheetStatus addWorksheetStatus(WorksheetStatus worksheetStatus) throws Exception {
		
		Worksheet worksheet = this.getWorksheetByUuid(worksheetStatus.getWorksheet().getUuid());
		if (worksheet == null) {
			throw new Exception("The worksheet with id " + worksheetStatus.getWorksheet().getUuid() + " does not exist");
		}
		worksheetStatus.setWorksheet(worksheet);
		return worksheetStatusDAO.save(worksheetStatus);
		
	}
	
	@Override
	public WorksheetSampleStatus addWorksheetSampleStatus(WorksheetSampleStatus worksheetSampleStatus) throws Exception {
		
		WorksheetSample worksheetSample = this
		        .getWorksheetSampleByUuid(worksheetSampleStatus.getWorksheetSample().getUuid());
		if (worksheetSample == null) {
			throw new Exception("The worksheet sample with uuid " + worksheetSampleStatus.getWorksheetSample().getUuid()
			        + " does not exist");
		}
		worksheetSampleStatus.setWorksheetSample(worksheetSample);
		return worksheetSampleStatusDAO.save(worksheetSampleStatus);
	}
	
}
