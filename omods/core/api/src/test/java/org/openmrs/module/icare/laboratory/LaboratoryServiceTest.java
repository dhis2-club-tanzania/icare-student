package org.openmrs.module.icare.laboratory;

import org.hamcrest.MatcherAssert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openmrs.Order;
import org.openmrs.Visit;
import org.openmrs.api.AdministrationService;
import org.openmrs.api.OrderService;
import org.openmrs.api.UserService;
import org.openmrs.api.VisitService;
import org.openmrs.api.context.Context;
import org.openmrs.module.icare.ICareConfig;
import org.openmrs.module.icare.laboratory.models.*;
import org.openmrs.module.icare.laboratory.services.LaboratoryService;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.junit.Assert.assertThat;

@RunWith(SpringJUnit4ClassRunner.class)
public class LaboratoryServiceTest extends LaboratoryTestBase {
	
	public LaboratoryService laboratoryService;
	
	@Before
	public void initMockito() throws Exception {
		super.initTestData();
		laboratoryService = Context.getService(LaboratoryService.class);
	}
	
	@Test
	public void testInitialTest() {
		assertThat(laboratoryService, is(notNullValue()));
		
	}
	
	@Test
	public void testCreatingSampleAndAllocatingTest() throws Exception {
		
		AdministrationService adminService = Context.getService(AdministrationService.class);
		adminService.setGlobalProperty(ICareConfig.LAB_RESULT_APPROVAL_CONFIGURATION, "2");
		
		//add sample
		//Given
		VisitService visitService = Context.getService(VisitService.class);
		OrderService orderService = Context.getService(OrderService.class);
		UserService userService = Context.getService(UserService.class);
		
		Visit visit = visitService.getVisitByUuid("d9c1d8ac-2b8e-427f-804d-b858c52e6f11");
		Order order = orderService.getOrderByUuid("6746395c-1117-4abd-8fd7-a748c9575abcd");
		
		Sample sample = new Sample();
		sample.setVisit(visit);
		sample.setLabel("label1");
		
		List<SampleOrder> orders = new ArrayList<SampleOrder>();
		SampleOrder sampleOrder = new SampleOrder();
		sampleOrder.setSample(sample);
		sampleOrder.setOrder(order);
		orders.add(sampleOrder);
		
		sample.setSampleOrders(orders);
		
		//when
		Sample createdSample = laboratoryService.createSample(sample);
		
		//Then
		MatcherAssert.assertThat("Sample ID was created", createdSample.getId() == sample.getId());
		
		MatcherAssert.assertThat("Sample List is greater than 0",
		    laboratoryService.getSamplesByVisit("d9c1d8ac-2b8e-427f-804d-b858c52e6f11").size() > 0);
		
		//test get methods
		
		//allocate test
		
		sampleOrder.setSample(laboratoryService.getSamplesByVisit("d9c1d8ac-2b8e-427f-804d-b858c52e6f11").get(0));
		
		TestAllocation allocation = new TestAllocation();
		allocation.setLabel("allocation1");
		allocation.setSampleOrder(sampleOrder);
		allocation.setContainer(Context.getConceptService().getConceptByUuid("0cbe2ed3-cd5f-4f46-9459-26127c9265ab"));
		allocation.setTestConcept(Context.getConceptService().getConceptByUuid("0cbe2ed3-cd5f-4f46-9459-26127c9265ab"));
		
		//when
		TestAllocation allocatedTest = laboratoryService.allocateTestWithSample(allocation);
		
		//then
		MatcherAssert.assertThat("Allocation label was created", allocatedTest.getLabel() == allocation.getLabel());
		
		//test adding results
		//given
		Result result = new Result();
		result.setValueText("value");
		result.setTestAllocation(allocatedTest);
		result.setConcept(order.getConcept());
		
		//when
		Result addedResult = laboratoryService.recordTestAllocationResults(result);
		
		//then
		MatcherAssert.assertThat("result was created", addedResult.getId() == result.getId());
		
		//test updating status
		//given
		TestAllocationStatus status = new TestAllocationStatus();
		//status.setId(1);
		status.setUser(userService.getAllUsers().get(0));
		status.setTimestamp(new Timestamp(new Date().getTime()));
		status.setStatus("1st sign off");
		status.setRemarks("waiting for first sign off");
		status.setTestAllocation(allocatedTest);
		
		//when
		TestAllocationStatus updatedStatus = laboratoryService.updateTestAllocationStatus(status);
		
		//then
		MatcherAssert.assertThat("test allocation status was created", updatedStatus.getId() == status.getId());
		
	}
	
	@Test
	public void testUpdatingSampleStatus() {
		
	}
	
	@Test
	public void testUpdatingResults() {
		
	}
	
}
