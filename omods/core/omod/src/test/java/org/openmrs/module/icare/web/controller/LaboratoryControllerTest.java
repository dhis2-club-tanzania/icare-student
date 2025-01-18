package org.openmrs.module.icare.web.controller;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.openmrs.module.icare.laboratory.services.LaboratoryService;

public class LaboratoryControllerTest {
	
	@Mock
	LaboratoryService billingService;
	
	@InjectMocks
	LaboratoryController billingController;
	
	@Before
	public void setUp() {
		MockitoAnnotations.initMocks(this);
	}
	
	@Test
	//@DisplayName("creating a sample")
	public void testCreatingASample() {
		
	}
	
}
