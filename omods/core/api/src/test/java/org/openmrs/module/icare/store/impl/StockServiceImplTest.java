package org.openmrs.module.icare.store.impl;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.openmrs.module.icare.store.dao.*;
import org.openmrs.module.icare.store.models.Requisition;
import org.openmrs.module.icare.store.services.StoreServiceImpl;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.Mockito.verify;

public class StockServiceImplTest {
	
	@Mock
	LedgerDAO ledgerDAO;
	
	@Mock
	RequisitionDAO requisitionDAO;
	
	@Mock
	IssueDAO issueDAO;
	
	@Mock
	ReceiptDAO receiptDAO;
	
	@Mock
	IssueStatusDAO issueStatusDAO;
	
	@InjectMocks
	StoreServiceImpl storeService;
	
	@Before
	public void setUp() {
		MockitoAnnotations.initMocks(this);
	}
	
	@Test
	//@DisplayName("Creating a requisition")
	public void testingCreatingARequisition() {
		
		//Given
		Requisition requisition = new Requisition();
		requisition.setId(1);
		
		//when
		Requisition createdRequisition = storeService.saveRequest(requisition);
		
		//then
		verify(requisitionDAO).save(requisition);
		assertThat("Requisition id was created", createdRequisition.getId() == requisition.getId());
	}
	
}
