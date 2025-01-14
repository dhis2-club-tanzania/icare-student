package org.openmrs.module.icare.store;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openmrs.Location;
import org.openmrs.api.context.Context;
import org.openmrs.module.icare.core.ICareService;
import org.openmrs.module.icare.core.ListResult;
import org.openmrs.module.icare.core.Pager;
import org.openmrs.module.icare.store.models.Ledger;
import org.openmrs.module.icare.store.models.Stock;
import org.openmrs.module.icare.store.models.Transaction;
import org.openmrs.module.icare.store.services.StoreService;
import org.openmrs.module.icare.store.util.StockOutException;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.Date;
import java.util.List;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.junit.Assert.assertThat;

@RunWith(SpringJUnit4ClassRunner.class)
public class StoreServiceTestE2E extends StoreTestBase {
	
	//public StoreService storeService;
	public StoreService storeService;
	
	@Before
	public void initMockito() throws Exception {
		super.initTestData();
		storeService = Context.getService(StoreService.class);
	}
	
	@Test
	public void testInitialTest() {
		assertThat(storeService, is(notNullValue()));
		
	}
	
	@Test
	public void testCreatingALedgerEntry() throws StockOutException {
		
		//Given
		Ledger ledger = new Ledger();
		ICareService iCareService = Context.getService(ICareService.class);
		ledger.setItem(iCareService.getItemByUuid("b21bhsld-9ab1-4b57-8a89-c0bf2580a68d"));
		ledger.setBatchNo("BATCH-XX1");
		Location location = Context.getLocationService().getAllLocations().get(0);
		ledger.setLocation(location);
		ledger.setExpiryDate(new Date());
		ledger.setRemarks("this is a test batch");
		ledger.setQuantity(5.0);
		
		StoreService storeService = Context.getService(StoreService.class);
		ledger.setLedgerType(storeService.getLedgerTypeByUuid("8800zx3570-8z37-11ff-2234-01102007887"));
		
		//When
		storeService.saveLedger(ledger);
		
		//Then
		Ledger newLedger = storeService.getLedgerByUuid(ledger.getUuid());
		assertThat("Ledger is created", newLedger != null, is(true));
		Pager pager = new Pager();
		//pager.setAllowed(false);
		ListResult<Stock> stocks = storeService.getStockByLocation(location.getUuid(), pager, null, 0, 100, null);
		assertThat("Stock size added", stocks.getResults().size(), is(1));
		Stock stock = stocks.getResults().get(0);
		assertThat("Stock is created with batch", stock.getBatch(), is(ledger.getBatchNo()));
		assertThat("Stock is created with expiry", stock.getExpiryDate(), is(ledger.getExpiryDate()));
		assertThat("Stock is created with quantity", stock.getQuantity(), is(ledger.getQuantity()));
		
		List<Transaction> transactions = storeService.getTransactionsByLocationUuid(location.getUuid());
		assertThat("Transaction size added", transactions.size(), is(1));
	}
}
