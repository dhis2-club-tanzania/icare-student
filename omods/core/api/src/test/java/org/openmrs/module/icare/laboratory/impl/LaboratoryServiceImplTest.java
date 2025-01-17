package org.openmrs.module.icare.laboratory.impl;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.openmrs.Concept;
import org.openmrs.Location;
import org.openmrs.User;
import org.openmrs.api.UserService;
import org.openmrs.module.icare.laboratory.LaboratoryTestBase;
import org.openmrs.module.icare.laboratory.dao.SampleDAO;
import org.openmrs.module.icare.laboratory.dao.SampleStatusDAO;
import org.openmrs.module.icare.laboratory.dao.TestOrderLocationDAO;
import org.openmrs.module.icare.laboratory.models.Sample;
import org.openmrs.module.icare.laboratory.models.TestOrderLocation;
import org.openmrs.module.icare.laboratory.models.SampleStatus;
import org.openmrs.module.icare.laboratory.services.LaboratoryServiceImpl;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class LaboratoryServiceImplTest extends LaboratoryTestBase {
	
	@Mock
	SampleDAO sampleDAO;
	
	@Mock
	TestOrderLocationDAO testOrderLocationDAO;
	
	@Mock
	SampleStatusDAO sampleStatusDAO;
	
	@Mock
	UserService userService;
	
	@InjectMocks
	LaboratoryServiceImpl laboratoryService;
	
	@Before
	public void setUp() {
		MockitoAnnotations.initMocks(this);
	}
	
	@Test
	//@DisplayName("Creating A Sample")
	public void testingCreatingSample() {
		
		//Given
		Sample sample = new Sample();
		sample.setId(1);
		
		Sample newSample = sample;
		
		//When
		Sample createdSample = laboratoryService.createSample(sample);
		
		//Then
		verify(sampleDAO).save(sample);
		assertThat("ID was created", createdSample.getId() == newSample.getId());
	}
	
	@Test
	//@DisplayName("Updating A Sample Status")
	public void testingUpdateTestStatus() throws Exception {
		
		//Given
		SampleStatus sampleStatus = new SampleStatus();
		sampleStatus.setId(1);
		
		Sample sample = new Sample();
		sample.setUuid("sampleuuid");
		sampleStatus.setSample(sample);
		when(sampleDAO.findByUuid(sample.getUuid())).thenReturn(sample);
		
		User user = new User();
		user.setUuid("sampleuuid");
		sampleStatus.setUser(user);
		when(userService.getUserByUuid(user.getUuid())).thenReturn(user);
		
		//When
		laboratoryService.updateSampleStatus(sampleStatus);
		
		//Then
		verify(sampleStatusDAO).save(sampleStatus);
		//assertThat("ID was created", createdSampleStatus.getId() == sampleStatus.getId());
	}
	
	//	@Test
	//	//@DisplayName("Creating A TestOrderLocation")
	//	public void testingTestOrderLocation() {
	//
	//		//Given
	//		TestOrderLocation testOrderLocation = new TestOrderLocation();
	//		//testOrderLocation.setId(1);
	//
	//		Concept cnConcept = new Concept();
	//		cnConcept.setUuid("00000003IIIIIIIIIIIIIIIIIIIIIIIIIIII");
	//
	//		Location location = new Location();
	//		location.setUuid("4748646b-81b0-4d76-81e5-7957469d4ab5");
	//
	//		testOrderLocation.setConcept(cnConcept);
	//		testOrderLocation.setLocation(location);
	//
	//		//TestOrderLocation newTestOrderLocation = testOrderLocation;
	//
	//		//When
	//		TestOrderLocation createdTestOrderLocation = laboratoryService.addTestOrderWithLocation(testOrderLocation);
	//
	//		//Then
	//		verify(testOrderLocationDAO).save(testOrderLocation);
	//		assertThat("Test Order was created", location.getUuid() == createdTestOrderLocation.getLocation().getUuid());
	//	}
	
	/*testOrderLocationDAO
	@Test
	//@DisplayName("Allocating a tes")
	public void testingAllocatingATest(){

		//Given
		TestAllocation testAllocation = new TestAllocation();
		Sample sample = new Sample();
		sample.setId(1);
		SampleOrder sampleOrder = new SampleOrder();
		sampleOrder.setSample(sample);
		testAllocation.setSampleOrder(sampleOrder);

		//When
		TestAllocation createdAllocation = laboratoryService.allocateTestWithSample(testAllocation);

		//Then
		assertThat("Allocation was created", createdAllocation.getSampleOrder() == testAllocation.getSampleOrder());
	}*/
}
