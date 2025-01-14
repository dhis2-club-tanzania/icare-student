package org.openmrs.module.icare.laboratory.services;

import org.openmrs.Visit;
import org.openmrs.api.OpenmrsService;
import org.openmrs.module.icare.core.ListResult;
import org.openmrs.module.icare.core.Pager;
import org.openmrs.module.icare.laboratory.models.*;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Transactional
public interface LaboratoryService extends OpenmrsService {
	
	@Transactional
	Sample createSample(Sample sample);
	
	List<Sample> getSamplesByVisit(String id);
	
	List<Sample> getAllSamples();
	
	ListResult<Sample> getSamples(Date startDate, Date endDate, Pager pager, String location, String sampleCategory,
	        String testCategory, String q, String hasStatus, String acceptedByUuid, String testConceptUuid,
	        String departmentUuid, String specimenSourceUuid, String instrumentUuid, String visitUuid, String excludeStatus);
	
	List<Sample> getSampleByDates(Date startDate, Date endDate);
	
	SampleStatus updateSampleStatus(SampleStatus sampleStatus) throws Exception;
	
	@Transactional
	TestAllocation allocateTestWithSample(TestAllocation testAllocation) throws Exception;
	
	List<TestAllocation> createAllocationsForSample(List<TestAllocation> testAllocationList) throws Exception;
	
	SampleOrder updateSampleOrder(SampleOrder sampleOrder) throws Exception;
	
	List<SampleOrder> getSampleOrders();
	
	SampleOrder saveSampleOrder(SampleOrder sampleOrder);
	
	List<Sample> getSampleOrdersBySampleUuid(String sampleUuid);
	
	List<Sample> getAllocationsBySample(String sampleUuid);
	
	List<TestAllocation> getAllocationsByOrder(String orderUuid);
	
	List<TestAllocation> getAllAllocations();
	
	TestAllocation getAllocationByUuid(String allocationUuid);
	
	@Transactional
	Result recordTestAllocationResults(Result result) throws Exception;
	
	List<Map<String, Object>> saveMultipleResults(List<Result> results) throws Exception;
	
	Result deleteTestAllocationResults(Result result) throws Exception;
	
	Result updateTestAllocationResults(Result result) throws Exception;
	
	Result voidTestAllocationResults(Result result) throws Exception;
	
	List<Map<String, Object>> voidMultipleResults(Map<String, Object> resultsToVoid) throws Exception;
	
	Map<String, Object> saveResultsInstrument(Map<String, Object> resultsInstrumentObject) throws Exception;
	
	Sample getSampleByUuid(String sampleUuid);
	
	List<Result> getResults();
	
	TestAllocationStatus updateTestAllocationStatus(TestAllocationStatus testAllocationStatus) throws Exception;
	
	List<Map<String, Object>> updateTestAllocationStatuses(List<TestAllocationStatus> testAllocationStatuses)
	        throws Exception;
	
	Device getDeviceByUuid(String deviceUuid);
	
	TestRangeConfig createTestRangeConfig(TestRangeConfig testRangeConfig);
	
	TestRangeConfig updateTestRangeConfig(TestRangeConfig testRangeConfig);
	
	List<TestRangeConfig> getTestRangeConfigs();
	
	TestRangeConfig getTestRangeConfig(String uuid);
	
	List<TestRangeConfig> getTestRangeConfigByConcept(String testConceptUuid);
	
	List<TestRangeConfig> getTestRangeByConceptAndGender(String testConceptUuid, String gender);
	
	TestTimeConfig createTestTimeConfig(TestTimeConfig testTimeConfig);
	
	TestTimeConfig updateTestTimeConfig(TestTimeConfig testTimeConfig);
	
	List<TestTimeConfig> getTestTimeConfigs(String q);
	
	TestTimeConfig getTestTimeConfig(String uuid);
	
	List<TestTimeConfig> getTestTimeConfigByConcept(String testConceptUuid);
	
	List<SampleLable> getSampleLables();
	
	SampleLable addSampleLable(SampleLable sampleLable);
	
	SampleLable updateSampleLable(SampleLable sampleLable, Integer previousLable);
	
	String generateSampleLabel();
	
	List<String> generateLaboratoryIdLabels(String globalPropertyUuid, String metadataType, Integer count);
	
	List<Visit> getSamplePendingVisits(Integer limit, Integer startIndex);
	
	TestOrderLocation addTestOrderWithLocation(TestOrderLocation testOrderLocation);
	
	List<Sample> getSamplesByVisitOrPatientAndOrDates(String visitId, String patient, Date startDate, Date endDate);
	
	WorkloadSummary getWorkLoadSummary(Date startDate, Date endDate);
	
	List<Batch> getBatches(Date start, Date end, String uuid, String q, Integer startIndex, Integer limit);
	
	Batch getBatchByUuid(String batchUuid);
	
	List<Sample> getSamplesByBatchSampleUuid(String batchUuid);
	
	Batch addBatch(Batch batch);
	
	BatchSample addBatchSamples(BatchSample batchSample) throws Exception;
	
	BatchSample getBatchSampleByUuid(String batchSampleUuid);
	
	BatchSet addBatchSet(BatchSet batchSet);
	
	List<BatchSet> getBatchSets(Date start, Date end, String q, Integer startIndex, Integer limit);
	
	BatchSet getBatchSetByUuid(String batchSetUuid);
	
	BatchSetStatus addBatchSetStatus(BatchSetStatus batchSetStatus) throws Exception;
	
	BatchStatus addBatchStatus(BatchStatus batchStatus) throws Exception;
	
	List<Worksheet> getWorksheets(Date start, Date end, String q, Integer startIndex, Integer limit);
	
	Worksheet getWorksheetByUuid(String worksheetUuid);
	
	Worksheet addWorksheet(Worksheet worksheet);
	
	List<WorksheetControl> getWorksheetControls(Date start, Date end, String q, Integer startIndex, Integer limit);
	
	WorksheetControl getWorksheetControlByUuid(String worksheetControlUuid);
	
	WorksheetControl addWorksheetControl(WorksheetControl worksheetControl);
	
	List<WorksheetDefinition> getWorksheetDefinitions(Date start, Date end, String q, Integer startIndex, Integer limit,
	        Date expirationDate, String instrumentUuid);
	
	Map<String, Object> getWorksheetDefinitionByUuid(String worksheetDefinitionUuid);
	
	WorksheetDefinition getDefaultWorksheetDefinitionByUuid(String worksheetDefinitionUuid);
	
	WorksheetDefinition addWorksheetDefinition(WorksheetDefinition worksheetDefinition) throws Exception;
	
	List<WorksheetSample> getWorksheetSamples(Date start, Date end, String q, Integer startIndex, Integer limit);
	
	WorksheetSample getWorksheetSampleByUuid(String worksheetSampleUuid);
	
	WorksheetSample addWorksheetSample(WorksheetSample worksheetSample) throws Exception;
	
	WorksheetStatus addWorksheetStatus(WorksheetStatus worksheetStatus) throws Exception;
	
	WorksheetSampleStatus addWorksheetSampleStatus(WorksheetSampleStatus worksheetSampleStatus) throws Exception;
	
	List<BatchSample> getBatchSamples(Date start, Date end, String q, Integer startIndex, Integer limit, String batchUuid);
	
	ListResult<SampleExt> getSamplesWithoutAllocations(Date start, Date end, Pager pager, String locationUuid,
	        String sampleCategory, String testCategory, String q, String hasStatus, String acceptedByUuid,
	        String testConceptUuid, String departmentUuid, String specimenSourceUuid, String instrumentUuid,
	        String visitUuid, String excludeStatus);
	
	AssociatedField addAssociatedField(AssociatedField associatedField);
	
	List<AssociatedField> getAssociatedFields(String q, Integer startIndex, Integer limit);
	
	TestAllocationAssociatedField addTestAllocationAssociatedField(
	        TestAllocationAssociatedField testAllocationAssociatedField) throws Exception;
	
	List<TestAllocationAssociatedField> getTestAllocationAssociatedFields(String q, Integer startIndex, Integer limit,
	        String allocationUuid, String associatedFieldUuid);
	
	AssociatedFieldResult addAssociatedFieldResult(AssociatedFieldResult associatedFieldResult) throws Exception;
	
	List<AssociatedFieldResult> getAssociatedFieldResults(Integer startIndex, Integer limit, String resultUuid,
	        String associatedFieldUuid);
	
	AssociatedField getAssociatedFieldByUuid(String associatedFieldUuid);
	
	AssociatedField updateAssociatedField(String associatedFieldUuid, AssociatedField associatedField);
	
	TestTimeConfig deleteTestTimeConfiguration(String testConfigUuid);
}
