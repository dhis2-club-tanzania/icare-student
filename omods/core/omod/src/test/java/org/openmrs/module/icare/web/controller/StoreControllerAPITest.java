package org.openmrs.module.icare.web.controller;

import org.codehaus.jackson.map.ObjectMapper;
import org.junit.Before;
import org.junit.Test;
import org.openmrs.api.AdministrationService;
import org.openmrs.api.LocationService;
import org.openmrs.api.context.Context;
import org.openmrs.module.icare.ICareConfig;
import org.openmrs.module.icare.billing.models.ItemPrice;
import org.openmrs.module.icare.store.models.IssueStatus;
import org.openmrs.module.icare.store.models.RequisitionStatus;
import org.openmrs.module.icare.store.services.StoreService;
import org.openmrs.module.icare.web.controller.core.BaseResourceControllerTest;
import org.powermock.core.classloader.annotations.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class StoreControllerAPITest extends BaseResourceControllerTest {
	
	@Autowired
	StoreService storeService;
	
	@Before
	public void setUp() throws SQLException {
		initializeInMemoryDatabase();
		executeDataSet("store-data.xml");
		AdministrationService adminService = Context.getService(AdministrationService.class);
		adminService.setGlobalProperty(ICareConfig.ALLOW_NEGATIVE_STOCK, "false");
	}
	
	@Test
	public void testCreatingReorderLevelAndGettingAllReorderLevels() throws Exception {
		
		//gien
		String dto = this.readFile("dto/store/reorder-level-create.json");
		Map<String, Object> reorderLevel = (new ObjectMapper()).readValue(dto, Map.class);
		
		//when
		MockHttpServletRequest newPostRequest = newPostRequest("store/reorderlevel", reorderLevel);
		MockHttpServletResponse handle = handle(newPostRequest);
		
		//then
		
		Map<String, Object> createdReorderLevelMap = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		assertThat("created reorder level location uuid is 44939999-d333-fff2-9bff-61d11117c22e",
		    ((Map) createdReorderLevelMap.get("location")).get("uuid").toString(),
		    is("44939999-d333-fff2-9bff-61d11117c22e"));
		assertThat("created reorder level quantity is 44939999-d333-fff2-9bff-61d11117c22e",
		    createdReorderLevelMap.get("quantity").toString(), is(Double.valueOf(30).toString()));
		assertThat("created reorder level item uuid is 8777d43571-yy77-11ff-2244-08002007777",
		    ((Map) createdReorderLevelMap.get("item")).get("uuid").toString(), is("8777d43571-yy77-11ff-2244-08002007777"));
		
		//test by fetching
		//given
		MockHttpServletRequest newGetRequest = newGetRequest("store/reorderlevels");
		MockHttpServletResponse handleGet = handle(newGetRequest);
		
		List<Map<String, Object>> reorderLevelsList = (new ObjectMapper()).readValue(handleGet.getContentAsString(),
		    List.class);
		
		assertThat("List of reorderlevel has one reorderlevel:", reorderLevelsList.size(), is(2));
		
		boolean found = false;
		for (Map<String, Object> reorderlevel : reorderLevelsList) {
			
			if (reorderlevel.get("quantity").toString().equals(Double.valueOf(30).toString())) {
				found = true;
				
				assertThat("created reorder level location uuid is 44939999-d333-fff2-9bff-61d11117c22e",
				    ((Map) reorderlevel.get("location")).get("uuid").toString(), is("44939999-d333-fff2-9bff-61d11117c22e"));
				assertThat("created reorder level quantity is 44939999-d333-fff2-9bff-61d11117c22e",
				    reorderlevel.get("quantity").toString(), is(Double.valueOf(30).toString()));
				assertThat("created reorder level item uuid is 8777d43571-yy77-11ff-2244-08002007777",
				    ((Map) reorderlevel.get("item")).get("uuid").toString(), is("8777d43571-yy77-11ff-2244-08002007777"));
			}
			
		}
		
		assertThat("reorder level found", found, is(true));
		
	}
	
	@Test
	public void testCreatingALedgerTypeAndGettingAllLedgerTypess() throws Exception {
		
		String dto = this.readFile("dto/store/ledger-type-create.json");
		Map<String, Object> ledgerType = (new ObjectMapper()).readValue(dto, Map.class);
		
		MockHttpServletRequest newPostRequest = newPostRequest("store/ledgertype", ledgerType);
		MockHttpServletResponse handle = handle(newPostRequest);
		
		MockHttpServletRequest newGetRequest = newGetRequest("store/ledgertypes");
		MockHttpServletResponse handleGet = handle(newGetRequest);
		
		List<Map<String, Object>> ledgerTypes = (new ObjectMapper()).readValue(handleGet.getContentAsString(), List.class);
		
		assertThat("List of ledgertypes has two ledgertypes:", ledgerTypes.size(), is(2));
		
		Boolean found = false;
		for (Map<String, Object> ledgerTypeMap : ledgerTypes) {
			if (ledgerTypeMap.get("name").toString().equals("transfer-in")) {
				found = true;
				assertThat("The leger type operation is +", ledgerTypeMap.get("operation").toString(), is("+"));
				
			}
		}
		
		assertThat("The leger type added is found", found, is(true));
		
	}
	
	@Test
	public void testCreatingALedgerEntryAndGettingAllLedgers() throws Exception {
		
		//Given
		String dto = this.readFile("dto/store/ledger-add.json");
		Map<String, Object> ledgerEntry = (new ObjectMapper()).readValue(dto, Map.class);
		
		//When
		MockHttpServletRequest newPostRequest = newPostRequest("store/ledger", ledgerEntry);
		MockHttpServletResponse handle = handle(newPostRequest);
		
		//Then
		Map<String, Object> ledger = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		MockHttpServletRequest newGetRequest = newGetRequest("store/ledgers");
		MockHttpServletResponse handleGet = handle(newGetRequest);
		
		List<Map<String, Object>> ledgers = (new ObjectMapper()).readValue(handleGet.getContentAsString(), List.class);
		
		assertThat("Listing of requests has one request:", ledgers.size(), is(1));
		
		assertThat("The location is store A", ((Map) ledgers.get(0).get("location")).get("display").toString(),
		    is("store A"));
		
		assertThat("The quantity is 35", (ledgers.get(0).get("quantity")).toString(), is("35.0"));
		
		assertThat("The quantity is 35", (ledgers.get(0).get("buyingPrice")).toString(), is("100.5"));
		
	}
	
	@Test
	public void testCreatingALedgerEntrySameBatch() throws Exception {
		
		//Given
		String dto = this.readFile("dto/store/ledger-add.json");
		Map<String, Object> ledgerEntry = (new ObjectMapper()).readValue(dto, Map.class);
		MockHttpServletRequest newPostRequest = newPostRequest("store/ledger", ledgerEntry);
		MockHttpServletResponse handle = handle(newPostRequest);
		
		//When
		ledgerEntry.put("expiryDate", "2021-07-27");
		ledgerEntry.put("buyingPrice", 0);
		newPostRequest = newPostRequest("store/ledger", ledgerEntry);
		handle = handle(newPostRequest);
		
		//Then
		Map<String, Object> ledger = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		MockHttpServletRequest newGetRequest = newGetRequest("store/ledgers");
		MockHttpServletResponse handleGet = handle(newGetRequest);
		
		List<Map<String, Object>> ledgers = (new ObjectMapper()).readValue(handleGet.getContentAsString(), List.class);
		
		assertThat("Listing of requests has one request:", ledgers.size(), is(2));
		
		assertThat("The location is store A", ((Map) ledgers.get(0).get("location")).get("display").toString(),
		    is("store A"));
		
		assertThat("The quantity is 35", (ledgers.get(0).get("quantity")).toString(), is("35.0"));
		
		assertThat("The  buying price is 100.5", (ledgers.get(0).get("buyingPrice")).toString(), is("100.5"));
		
		MockHttpServletRequest newGetRequest1 = newGetRequest("store/stock", new Parameter("locationUuid",
		        ((Map) ledgerEntry.get("location")).get("uuid").toString()));
		MockHttpServletResponse handleGet1 = handle(newGetRequest1);
		
		Map<String, Object> stocks = (new ObjectMapper()).readValue(handleGet1.getContentAsString(), Map.class);
		assertThat("Only 6 stock items", ((List) stocks.get("results")).size(), is(6));
		System.out.println(stocks);
		System.out.println(handleGet1.getContentAsString());
		assertThat("Only two stock items", ((Map) ((List) stocks.get("results")).get(3)).get("quantity").toString(),
		    is("100.0"));
		//		assertThat("Only two stock items", stocks.get(3).get("quantity").toString(), is("10.0"));
		
	}
	
	@Test
	public void testCreatingARequestAndGetReqByRequestingLocation() throws Exception {
		
		String dto = this.readFile("dto/store/requisition-create.json");
		Map<String, Object> requisition = (new ObjectMapper()).readValue(dto, Map.class);
		
		MockHttpServletRequest newPostRequest = newPostRequest("store/request", requisition);
		MockHttpServletResponse handle = handle(newPostRequest);
		
		MockHttpServletRequest newGetRequest = newGetRequest("store/requests", new Parameter("requestingLocationUuid",
		        "44938888-e444-ggg3-8aee-61d22227c22e"));
		MockHttpServletResponse handleGet = handle(newGetRequest);
		
		Map<String, Object> requests = (new ObjectMapper()).readValue(handleGet.getContentAsString(), Map.class);
		
		List<Map<String, Object>> requestObject = ((List<Map<String, Object>>) requests.get("results"));
		
		assertThat("Listing of requests has one request:", requestObject.size(), is(1));
		
		assertThat("The requested location id store A", ((Map) requestObject.get(0).get("requestedLocation")).get("display")
		        .toString(), is("store A"));
		
		//assertThat("The request has one request item", ((List) requestObject.get(0).get("requisitionItems")).size(), is(1));
		
		assertThat("The requesting location id store B",
		    ((Map) requestObject.get(0).get("requestingLocation")).get("display").toString(), is("store B"));
		
		// filter by status
		MockHttpServletRequest newGetRequest2 = newGetRequest("store/requests", new Parameter("status", "RECEIVED"),
		    new Parameter("requestingLocationUuid", "44939999-d333-fff2-9bff-61d11117c22e"));
		
		MockHttpServletResponse handleGet2 = handle(newGetRequest2);
		Map<String, Object> requests2 = (new ObjectMapper()).readValue(handleGet2.getContentAsString(), Map.class);
		
		List<Map<String, Object>> requestObject2 = ((List<Map<String, Object>>) requests2.get("results"));
		
		assertThat("The requesting location id store B", ((List) requestObject2.get(0).get("requisitionStatuses")).size(),
		    is(1));
		
		newGetRequest = newGetRequest("store/requests", new Parameter("requestingLocationUuid",
		        "44939999-d333-fff2-9bff-61d11117c22e"), new Parameter("q", "RQ124"), new Parameter("startDate",
		        "2022-12-30"), new Parameter("endDate", "2023-11-30"));
		handleGet = handle(newGetRequest);
		requests = (new ObjectMapper()).readValue(handleGet.getContentAsString(), Map.class);
		List<Map<String, Object>> requestObject3 = ((List<Map<String, Object>>) requests.get("results"));
		assertThat("Listing of requests has one request:", requestObject3.size(), is(1));
		
	}
	
	@Test
	public void testIssueingAnItemAndViewingIssues() throws Exception {
		
		//Given request
		Map<String, Object> requisitionMap = createRequisition();
		
		String dto = this.readFile("dto/store/issue-create.json");
		Map<String, Object> issue = (new ObjectMapper()).readValue(dto, Map.class);
		
		Map<String, Object> requsition = new HashMap<String, Object>();
		requsition.put("uuid", requisitionMap.get("uuid").toString());
		
		issue.put("requisition", requsition);
		
		//When post an issue
		MockHttpServletRequest newPostRequest = newPostRequest("store/issue", issue);
		MockHttpServletResponse handle = handle(newPostRequest);
		
		System.out.println("the output");
		System.out.println(handle.getContentAsString());
		
		//Then get issues
		MockHttpServletRequest newGetRequest = newGetRequest("store/issues", new Parameter("issuedLocationUuid",
		        "44938888-e444-ggg3-8aee-61d22227c22e"));
		MockHttpServletResponse handleGet = handle(newGetRequest);
		
		List<Map<String, Object>> issues = (new ObjectMapper()).readValue(handleGet.getContentAsString(), List.class);
		
		assertThat("Listing of receipts has one receipt:", issues.size(), is(1));
		
		assertThat("The receiving location is store A", ((Map) issues.get(0).get("issuedLocation")).get("display")
		        .toString(), is("store B"));
		
		assertThat("The issuing location is store B", ((Map) issues.get(0).get("issueingLocation")).get("display")
		        .toString(), is("store A"));
		
	}
	
	@Test
	public void testIssueingMoreThanAvailableStock() throws Exception {
		//Given request
		Map<String, Object> requisitionMap = createRequisition();
		
		String dto = this.readFile("dto/store/issue-create-30.json");
		Map<String, Object> issue = (new ObjectMapper()).readValue(dto, Map.class);
		
		Map<String, Object> requsition = new HashMap<String, Object>();
		requsition.put("uuid", requisitionMap.get("uuid").toString());
		
		issue.put("requisition", requsition);
		
		//When post an issue
		MockHttpServletRequest newPostRequest = newPostRequest("store/issue", issue);
		
		MockHttpServletResponse handle;
		String response;
		//The request should throw an exception
		try {
			handle = handle(newPostRequest);
			response = handle.getContentAsString();
		}
		catch (Exception e) {
			System.out.println(e.getMessage());
			response = e.getMessage();
		}
		assertThat("The request threw a Negative stock exception", response, is("Negative Stock is not allowed"));
		
	}
	
	@Test
	public void testIssueingFromSeveralBatches() throws Exception {
		
		//Given request
		Map<String, Object> requisitionMap = createRequisition();
		
		String dto = this.readFile("dto/store/issue-create-15.json");
		Map<String, Object> issue = (new ObjectMapper()).readValue(dto, Map.class);
		
		Map<String, Object> requsition = new HashMap<String, Object>();
		requsition.put("uuid", requisitionMap.get("uuid").toString());
		
		issue.put("requisition", requsition);
		
		//When post an issue
		MockHttpServletRequest newPostRequest = newPostRequest("store/issue", issue);
		
		MockHttpServletResponse handle = handle(newPostRequest);
		
		// get stock from the same location for the same item
		MockHttpServletRequest getStockRequest = newGetRequest("store/stock");
		getStockRequest.addParameter("locationUuid",
		    (String) ((Map<String, Object>) issue.get("issueingLocation")).get("uuid"));
		MockHttpServletResponse handleGetStock = handle(getStockRequest);
		
		System.out.println(handleGetStock.getContentAsString());
	}
	
	@Test
	public void testIssueingFromOneOutOfManyAvailableBatches() {
		
	}
	
	@Test
	public void testReceivingAnItemAndViewingReceipts() throws Exception {
		
		Map<String, Object> issueMap = createRequisitionAndIssue();
		
		String dto = this.readFile("dto/receipt-create.json");
		Map<String, Object> receipt = (new ObjectMapper()).readValue(dto, Map.class);
		
		Map<String, Object> issue = new HashMap<String, Object>();
		issue.put("uuid", issueMap.get("uuid").toString());
		
		receipt.put("issue", issue);
		
		//post receipt
		MockHttpServletRequest newPostRequest = newPostRequest("store/receive", receipt);
		MockHttpServletResponse handle = handle(newPostRequest);
		
		//get receipts
		MockHttpServletRequest newGetRequest = newGetRequest("store/receipts", new Parameter("issueingLocationUuid",
		        "44939999-d333-fff2-9bff-61d11117c22e"));
		MockHttpServletResponse handleGet = handle(newGetRequest);
		
	}
	
	@Test
	public void testAddingStatusToRequest() throws Exception {
		
		//create a request
		Map<String, Object> createdRequistionMap = createRequisition();
		
		//add status
		String dto = this.readFile("dto/store/requisition-status-create.json");
		Map<String, Object> requisitionStatus = (new ObjectMapper()).readValue(dto, Map.class);
		
		Map<String, Object> requsition = new HashMap<String, Object>();
		requsition.put("uuid", createdRequistionMap.get("uuid").toString());
		
		requisitionStatus.put("requisition", requsition);
		requisitionStatus.put("status", RequisitionStatus.RequisitionStatusCode.REQUESTED);
		
		MockHttpServletRequest newPostRequest = newPostRequest("store/requeststatus", requisitionStatus);
		MockHttpServletResponse handle = handle(newPostRequest);
		
		StoreService storeService = Context.getService(StoreService.class);
		List<RequisitionStatus> list = storeService.getRequisitionStatuses();
		
		//List<Requisition> reqs = storeService.getRequestsByRequestingLocation("44938888-e444-ggg3-8aee-61d22227c22e");
		
		//get the requests
		
		MockHttpServletRequest newGetRequest = newGetRequest("store/requests", new Parameter("requestingLocationUuid",
		        "44938888-e444-ggg3-8aee-61d22227c22e"), new Parameter("page", "1"), new Parameter("pageSize", "1"));
		MockHttpServletResponse handleGet = handle(newGetRequest);
		Map<String, Object> requests = (new ObjectMapper()).readValue(handleGet.getContentAsString(), Map.class);
		System.out.println(requests);
		Map<String, Object> pagerObject = (Map<String, Object>) requests.get("pager");
		assertThat("Page Count is 1", (Integer) pagerObject.get("pageCount") == 1, is(true));
		assertThat("Total is 1", (Integer) pagerObject.get("total") == 1, is(true));
		assertThat("Page Size is 1", (Integer) pagerObject.get("pageSize") == 1, is(true));
		assertThat("Page is 1", (Integer) pagerObject.get("page") == 1, is(true));
		assertThat("List count is 1", ((List) requests.get("results")).size() == 1, is(true));
		
		//		assertThat("requisition statuses are more than one for the request",
		//		    ((List) requests.get("requisitionStatuses")).size(), is(1));
		
	}
	
	@Test
	public void testAddingStatusToIssue() throws Exception {
		//request
		Map<String, Object> requisitionMap = createRequisition();
		
		String dto = this.readFile("dto/store/issue-create.json");
		Map<String, Object> issue = (new ObjectMapper()).readValue(dto, Map.class);
		
		Map<String, Object> requsition = new HashMap<String, Object>();
		requsition.put("uuid", requisitionMap.get("uuid").toString());
		
		issue.put("requisition", requsition);
		
		//post an issue
		MockHttpServletRequest newPostRequest = newPostRequest("store/issue", issue);
		MockHttpServletResponse handle = handle(newPostRequest);
		
		List<Map<String, Object>> issues = getIssuesIssuedFromStoreA();
		Map<String, Object> issueMap = issues.get(0);
		
		String dtoIssueStatus = this.readFile("dto/store/issue-status-create.json");
		Map<String, Object> issueStatus = (new ObjectMapper()).readValue(dtoIssueStatus, Map.class);
		
		Map<String, Object> issueObject = new HashMap<String, Object>();
		issueObject.put("uuid", issueMap.get("uuid").toString());
		
		issueStatus.put("issue", issueObject);
		issueStatus.put("status", IssueStatus.IssueStatusCode.ISSUED);
		
		//post an issue status
		MockHttpServletRequest issueStatusPostRequest = newPostRequest("store/issuestatus", issueStatus);
		MockHttpServletResponse handleIssueStatusPostRequest = handle(issueStatusPostRequest);
		
		StoreService storeService = Context.getService(StoreService.class);
		List<IssueStatus> issueStatuses = storeService.getIssueStatuses();
		
		issues = getIssuesIssuedFromStoreA();
		
		Map<String, Object> issueObjectMap = issues.get(0);
		
		assertThat("issues statuses are more than one for the request", ((List) issueObjectMap.get("issueStatuses")).size(),
		    is(2));
		
	}
	
	@Test
	public void testGettingAllStock() throws Exception {
		
		//get stock status
		MockHttpServletRequest newGetRequest = newGetRequest("store/stock");
		MockHttpServletResponse handleGet = handle(newGetRequest);
		
		Map<String, Object> stockList = (new ObjectMapper()).readValue(handleGet.getContentAsString(), Map.class);
		
		assertThat("stock listing has 6 entries:", ((List) stockList.get("results")).size(), is(5));
		
		//assertThat("The stock quantity is 100", (stockList.get(0).get("quantity")).toString(), is("100.0"));
		
	}
	
	@Test
	public void testGettingStockByLocation() throws Exception {
		
		//get stock status
		MockHttpServletRequest newGetRequest = newGetRequest("store/stock", new Parameter("locationUuid",
		        "44939999-d333-fff2-9bff-61d11117c22e"), new Parameter("paging", "true"));
		MockHttpServletResponse handleGet = handle(newGetRequest);
		
		Map<String, Object> stockList = (new ObjectMapper()).readValue(handleGet.getContentAsString(), Map.class);
		
		System.out.println(stockList);
		
		assertThat("stock listing has 6 entries:", ((List) stockList.get("results")).size(), is(5));
		
		//assertThat("The stock quantity is 100", (stockList.get(0).get("quantity")).toString(), is("100.0"));
		
	}
	
	@Test
	public void testGettingStockByUnknownLocation() throws Exception {
		
		//get stock status
		MockHttpServletRequest newGetRequest = newGetRequest("store/stock", new Parameter("locationUuid",
		        "55555999-d333-fff2-9bff-61d11117c22e"));
		MockHttpServletResponse handleGet = handle(newGetRequest);
		
		Map<String, Object> stockList = (new ObjectMapper()).readValue(handleGet.getContentAsString(), Map.class);
		
		assertThat("stock listing has no entry:", ((List) stockList.get("results")).size(), is(0));
		
	}
	
	@Test
	public void testGettingStockByItemAndLocation() throws Exception {
		//get stock status
		MockHttpServletRequest newGetRequest = newGetRequest("store/item/8o00d43570-8y37-11f3-1234-08002007777/stock",
		    new Parameter("locationUuid", "44939999-d333-fff2-9bff-61d11117c22e"));
		MockHttpServletResponse handleGet = handle(newGetRequest);
		
		List<Map<String, Object>> stockList = (new ObjectMapper()).readValue(handleGet.getContentAsString(), List.class);
		
		assertThat("stock listing has 4 entries:", stockList.size(), is(4));
		
		//assertThat("The stock quantity is 100", (stockList.get(0).get("quantity")).toString(), is("100.0"));
		
	}
	
	@Test
	public void testGettingStockByItem() throws Exception {
		//get stock status
		MockHttpServletRequest newGetRequest = newGetRequest("store/item/8o00d43570-8y37-11f3-1234-08002007777/stock");
		MockHttpServletResponse handleGet = handle(newGetRequest);
		
		List<Map<String, Object>> stockList = (new ObjectMapper()).readValue(handleGet.getContentAsString(), List.class);
		
		assertThat("stock listing has 4 entries:", stockList.size(), is(4));
		
		boolean found = false;
		
		for (Map<String, Object> stockMap : stockList) {
			if (stockMap.get("quantity").toString().equals("100.0")) {
				found = true;
				assertThat("The stock quantity is 100", (stockMap.get("quantity")).toString(), is("100.0"));
			}
		}
		
		assertThat("The stock is found", found, is(true));
		
	}
	
	@Test
	public void testGettingStockout() throws Exception {
		// Given
		
		//get stock status
		MockHttpServletRequest newGetRequest = newGetRequest("store/stockout");
		MockHttpServletResponse handleGet = handle(newGetRequest);
		
		Map<String, Object> stockoutList = (new ObjectMapper()).readValue(handleGet.getContentAsString(), Map.class);
		System.out.println(stockoutList);
		
		assertThat("stockOut listing has one entry:", ((List) stockoutList.get("results")).size(), is(2));
	}
	
	@Test
	public void testGettingNearlyStockedOutItems() throws Exception {
		
	}
	
	@Test
	public void testGettingStockoutByLocationWithStock() throws Exception {
		//Given
		LocationService locationService = Context.getLocationService();
		//When
		MockHttpServletRequest newGetRequest = newGetRequest("store/stockout", new Parameter("location",
		        "44939999-d333-fff2-9bff-61d11117c22e"));
		MockHttpServletResponse handleGet = handle(newGetRequest);
		
		//Then
		String result = handleGet.getContentAsString();
		Map<String, Object> stockoutList = (new ObjectMapper()).readValue(result, Map.class);
		System.out.println(stockoutList);
		assertThat("stockOut listing has two entry:", ((List) stockoutList.get("results")).size(), is(2));
	}
	
	@Test
	public void testGettingStockoutByLocationWithoutStock() throws Exception {
		//Given
		LocationService locationService = Context.getLocationService();
		//When
		MockHttpServletRequest newGetRequest = newGetRequest("store/stockout", new Parameter("location",
		        "44938888-e444-ggg3-8aee-61d22227c22e"));
		MockHttpServletResponse handleGet = handle(newGetRequest);
		
		//Then
		Map<String, Object> stockoutList = (new ObjectMapper()).readValue(handleGet.getContentAsString(), Map.class);
		
		System.out.println(stockoutList);
		
		assertThat("stockOut listing has no entry:", ((List) stockoutList.get("results")).size(), is(1));
		
		newGetRequest = newGetRequest("store/stockout", new Parameter("location", "44939999-d333-fff2-9bff-61d11117c22e"),
		    new Parameter("q", "spirit"));
		handleGet = handle(newGetRequest);
		//Then
		Map<String, Object> stockoutListBySearch = (new ObjectMapper()).readValue(handleGet.getContentAsString(), Map.class);
		
		System.out.println(stockoutListBySearch);
		
		assertThat("stockOut Searched by q:", ((List) stockoutListBySearch.get("results")).size(), is(1));
	}
	
	@Test
	public void testStockMetricsEndpoint() throws Exception {
		//Give
		
		//When
		
		MockHttpServletRequest newGetRequest = newGetRequest("store/metrics", new Parameter("location",
		        "44939999-d333-fff2-9bff-61d11117c22e"));
		MockHttpServletResponse handleGet = handle(newGetRequest);
		
		//Then
		
	}
	
	public Map<String, Object> createRequisition() throws Exception {
		String dto = this.readFile("dto/store/requisition-create.json");
		Map<String, Object> requisition = (new ObjectMapper()).readValue(dto, Map.class);
		
		MockHttpServletRequest newPostRequest = newPostRequest("store/request", requisition);
		MockHttpServletResponse handle = handle(newPostRequest);
		
		return (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
	}
	
	public Map<String, Object> createRequisitionAndIssue() throws Exception {
		String dto = this.readFile("dto/store/requisition-create.json");
		Map<String, Object> requisition = (new ObjectMapper()).readValue(dto, Map.class);
		
		MockHttpServletRequest postRequest = newPostRequest("store/request", requisition);
		MockHttpServletResponse handle = handle(postRequest);
		
		Map<String, Object> requisitionMap = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		
		String dtoIssue = this.readFile("dto/store/issue-create.json");
		Map<String, Object> issue = (new ObjectMapper()).readValue(dtoIssue, Map.class);
		
		Map<String, Object> requsition = new HashMap<String, Object>();
		requsition.put("uuid", requisitionMap.get("uuid").toString());
		
		issue.put("requisition", requsition);
		
		//post an issue
		MockHttpServletRequest newPostRequest = newPostRequest("store/issue", issue);
		MockHttpServletResponse handleIssue = handle(newPostRequest);
		
		return (new ObjectMapper()).readValue(handleIssue.getContentAsString(), Map.class);
		
	}
	
	public List<Map<String, Object>> getIssuesIssuedFromStoreA() throws Exception {
		//get issues
		MockHttpServletRequest newGetRequest = newGetRequest("store/issues", new Parameter("issuedLocationUuid",
		        "44938888-e444-ggg3-8aee-61d22227c22e"));
		MockHttpServletResponse handleGet = handle(newGetRequest);
		
		List<Map<String, Object>> issues = (new ObjectMapper()).readValue(handleGet.getContentAsString(), List.class);
		
		return issues;
	}
	
	@Test
	public void getStockByConceptClassName() throws Exception {
		MockHttpServletRequest newGetRequest = newGetRequest("store/stock", new Parameter("locationUuid",
		        "44939999-d333-fff2-9bff-61d11117c22e"), new Parameter("conceptClassName", "Test"));
		MockHttpServletResponse handleGet = handle(newGetRequest);
		
		Map<String, Object> stockList = (new ObjectMapper()).readValue(handleGet.getContentAsString(), Map.class);
		
		System.out.println((List) stockList.get("results"));
		assertThat("stock listing has 4 entries:", ((List) stockList.get("results")).size(), is(4));
	}
	
	@Test
	public void creatingAndGettingStockInvoices() throws Exception {
		
		String dto = this.readFile("dto/store/stock-invoice-create.json");
		List<Map<String, Object>> stockInvoice = (new ObjectMapper()).readValue(dto, List.class);
		
		//post stock invoice
		MockHttpServletRequest newPostRequest = newPostRequest("store/stockinvoices", stockInvoice);
		MockHttpServletResponse handle = handle(newPostRequest);
		
		List<Map<String, Object>> createdStockInvoices = (new ObjectMapper()).readValue(handle.getContentAsString(),
		    List.class);
		System.out.println(createdStockInvoices);
		
		assertThat("created 1 stock invoice", createdStockInvoices.size(), is(1));
		
		//Get stock invoices
		MockHttpServletRequest newGetRequest = newGetRequest("store/stockinvoices", new Parameter("page", "1"),
		    new Parameter("pageSize", "1"));
		MockHttpServletResponse handleGet = handle(newGetRequest);
		Map<String, Object> stockInvoices = (new ObjectMapper()).readValue(handleGet.getContentAsString(), Map.class);
		System.out.println(stockInvoices);
		
		Map<String, Object> pagerObject = (Map<String, Object>) stockInvoices.get("pager");
		assertThat("page is 1", (Integer) pagerObject.get("page") == 1, is(true));
		assertThat("Total is 2", (Integer) pagerObject.get("total") == 2, is(true));
		assertThat("List count is 1", ((List) stockInvoices.get("results")).size() == 1, is(true));
		
		//getting specific stock invoice
		MockHttpServletRequest newGetRequest3 = newGetRequest("store/stockinvoice/8800zx3570-8z37-11ff-2234-01102007811");
		MockHttpServletResponse handle3 = handle(newGetRequest3);
		Map<String, Object> stockInvoiceGet = (new ObjectMapper()).readValue(handle3.getContentAsString(), Map.class);
		assertThat("There is 1 stock invoice present",
		    stockInvoiceGet.get("uuid").equals("8800zx3570-8z37-11ff-2234-01102007811"));
		
		//Getting stock invoice by status
		MockHttpServletRequest newGetRequest4 = newGetRequest("store/stockinvoices", new Parameter("status", "RECEIVED"));
		MockHttpServletResponse handle4 = handle(newGetRequest4);
		System.out.println(handle4.getContentAsString());
		Map<String, Object> stockInvoiceGet2 = (new ObjectMapper()).readValue(handle4.getContentAsString(), Map.class);
		assertThat(
		    "There is one received item",
		    ((Map) ((List) stockInvoiceGet2.get("results")).get(0)).get("uuid").equals(
		        "8800zx3570-8z37-11ff-2234-01102007811"));
		
		//Getting stock invoice by invoiceNumber
		newGetRequest4 = newGetRequest("store/stockinvoices", new Parameter("q", "inv-101"), new Parameter("startDate",
		        "2023-01-24"), new Parameter("endDate", "2023-01-26"));
		handle4 = handle(newGetRequest4);
		System.out.println(handle4.getContentAsString());
		stockInvoiceGet2 = (new ObjectMapper()).readValue(handle4.getContentAsString(), Map.class);
		assertThat("There is one stock invoice", ((List) stockInvoiceGet2.get("results")).size() == 1, is(true));
		
	}
	
	@Test
	public void creatingAndgettingSuppliers() throws Exception {
		String dto = this.readFile("dto/store/supplier-create.json");
		List<Map<String, Object>> suppliers = (new ObjectMapper()).readValue(dto, List.class);
		
		//post stock invoice
		MockHttpServletRequest newPostRequest = newPostRequest("store/suppliers", suppliers);
		MockHttpServletResponse handle = handle(newPostRequest);
		
		List<Map<String, Object>> createdSuppliers = (new ObjectMapper()).readValue(handle.getContentAsString(), List.class);
		
		assertThat("created 1 supplier", createdSuppliers.size(), is(1));
		
		//Getsuppliers
		MockHttpServletRequest newGetRequest = newGetRequest("store/suppliers", new Parameter("startIndex", "1"),
		    new Parameter("limit", "10"));
		MockHttpServletResponse handleGet = handle(newGetRequest);
		List<Map<String, Object>> suppliersObjectMap = (new ObjectMapper()).readValue(handleGet.getContentAsString(),
		    List.class);
		System.out.println(suppliersObjectMap);
		assertThat("get 1 supplier", suppliersObjectMap.size(), is(1));
		
		//update suppliers
		String dto2 = this.readFile("dto/store/supplier-update.json");
		Map<String, Object> supplierUpdate = (new ObjectMapper()).readValue(dto2, Map.class);
		
		MockHttpServletRequest newPostRequest2 = newPostRequest("store/supplier/8800zx3570-8z37-11ff-2234-01102007810",
		    supplierUpdate);
		MockHttpServletResponse handle3 = handle(newPostRequest2);
		Map<String, Object> supplierUpdatedMap = (new ObjectMapper()).readValue(handle3.getContentAsString(), Map.class);
		System.out.println("==>" + handle3.getContentAsString());
		
	}
	
	@Test
	public void creatingAndGettingStockInvoicesStatus() throws Exception {
		String dto = this.readFile("dto/store/stock-invoice-status-create.json");
		List<Map<String, Object>> stockInvoiceStatusMapList = (new ObjectMapper()).readValue(dto, List.class);
		
		//post stock invoices status
		MockHttpServletRequest newPostRequest = newPostRequest("store/stockinvoicesstatus", stockInvoiceStatusMapList);
		MockHttpServletResponse handle = handle(newPostRequest);
		List<Map<String, Object>> createdStockInvoicesStatus = (new ObjectMapper()).readValue(handle.getContentAsString(),
		    List.class);
		assertThat("Created 1 stock invoice status", createdStockInvoicesStatus.size() == 1);
		
		// get stock invoices status
		MockHttpServletRequest newGetRequest = newGetRequest("store/stockinvoicesstatus", new Parameter("startIndex", "1"),
		    new Parameter("limit", "100"), new Parameter("q", "DRAFT"));
		MockHttpServletResponse handle2 = handle((newGetRequest));
		List<Map<String, Object>> stockInvoicesStatusListMap = (new ObjectMapper()).readValue(handle2.getContentAsString(),
		    List.class);
		assertThat("There is one drafted stock invoice", stockInvoicesStatusListMap.size(), is(1));
		
	}
	
	@Test
	public void gettingRequesitionsbyOrder() throws Exception {
		
		MockHttpServletRequest newGetRequest = newGetRequest("store/requests", new Parameter("requestingLocationUuid",
		        "44939999-d333-fff2-9bff-61d11117c22e"), new Parameter("orderByDirection", "DESC"));
		MockHttpServletResponse handleGet = handle(newGetRequest);
		System.out.println(handleGet.getContentAsString());
		Map<String, Object> requests = (new ObjectMapper()).readValue(handleGet.getContentAsString(), Map.class);
		
		MockHttpServletRequest newGetRequest2 = newGetRequest("store/requests", new Parameter("requestingLocationUuid",
		        "44939999-d333-fff2-9bff-61d11117c22e"), new Parameter("orderByDirection", "ASC"));
		MockHttpServletResponse handleGet2 = handle(newGetRequest2);
		System.out.println(handleGet2.getContentAsString());
		Map<String, Object> requests2 = (new ObjectMapper()).readValue(handleGet2.getContentAsString(), Map.class);
	}
	
	@Test
	public void creatingAndGettingStockInvoiceItems() throws Exception {
		
		//getting specific stock invoice
		MockHttpServletRequest newGetRequest3 = newGetRequest("store/stockinvoiceitem/8800zx3570-8z37-11ff-2234-01102007812");
		MockHttpServletResponse handle3 = handle(newGetRequest3);
		Map<String, Object> stockInvoiceItemGet = (new ObjectMapper()).readValue(handle3.getContentAsString(), Map.class);
		assertThat("There is 1 stock invoice item present",
		    stockInvoiceItemGet.get("uuid").equals("8800zx3570-8z37-11ff-2234-01102007812"));
		
	}
	
	@Test
	public void updatingStockInvoice() throws Exception {
		String dto = this.readFile("dto/store/stock-invoice-update.json");
		Map<String, Object> stockInvoiceMap = (new ObjectMapper()).readValue(dto, Map.class);
		
		MockHttpServletRequest newPostRequest = newPostRequest("store/stockinvoice/8800zx3570-8z37-11ff-2234-01102007811",
		    stockInvoiceMap);
		MockHttpServletResponse handle = handle(newPostRequest);
		
		Map<String, Object> updatedInvoice = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		assertThat("stock invoice has been updated", updatedInvoice.get("invoiceNumber").equals("StInvoice3"));
		
		Map<String, Object> invoiceItemMap = (Map) (((List) stockInvoiceMap.get("invoiceItems")).get(0));
		
		//updating stock invoice status
		MockHttpServletRequest newGetRequest = newGetRequest("store/stock", new Parameter("locationUuid",
		        ((Map) invoiceItemMap.get("location")).get("uuid").toString()));
		MockHttpServletResponse handle2 = handle(newGetRequest);
		Map<String, Object> stockItemGet = (new ObjectMapper()).readValue(handle2.getContentAsString(), Map.class);
		System.out.println(handle2.getContentAsString());
		
	}
	
	@Test
	public void updateStockInvoiceItem() throws Exception {
		String dto = this.readFile("dto/store/stock-invoice-item-update.json");
		Map<String, Object> stockInvoiceItemMap = (new ObjectMapper()).readValue(dto, Map.class);
		MockHttpServletRequest newPostRequest = newPostRequest(
		    "store/stockinvoiceitem/8800zx3570-8z37-11ff-2234-01102007812", stockInvoiceItemMap);
		MockHttpServletResponse handle = handle(newPostRequest);
		Map<String, Object> updateInvoiceItem = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		assertThat(" The stock invoice item has been updated", updateInvoiceItem.get("batchNo").equals("batch-9"));
		
		//updating stock invoice item status and saving stock
		
		MockHttpServletRequest newGetRequest = newGetRequest("store/stock", new Parameter("locationUuid",
		        ((Map) stockInvoiceItemMap.get("location")).get("uuid").toString()));
		MockHttpServletResponse handle2 = handle(newGetRequest);
		Map<String, Object> stockItemGet = (new ObjectMapper()).readValue(handle2.getContentAsString(), Map.class);
		boolean newBatchexist = false;
		for (Object stockItem : (List) stockItemGet.get("results")) {
			if (stockItem.toString().contains("batch-9")) {
				newBatchexist = true;
			}
		}
		assertThat("The stock is created from the stock invoice item", newBatchexist, is(true));
		
	}
	
	@Test
	public void addRequisitionItem() throws Exception {
		
		String dto = this.readFile("dto/store/requisition-item-create.json");
		Map<String, Object> requisitionMap = (new ObjectMapper()).readValue(dto, Map.class);
		MockHttpServletRequest newPostRequest = newPostRequest("store/requestitem", requisitionMap);
		MockHttpServletResponse handle = handle(newPostRequest);
		Map<String, Object> createdRequisition = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		assertThat("There is one created requisition item",
		    ((Map) createdRequisition.get("item")).get("uuid").equals("8o00d43570-8y37-11f3-1234-08002007777"));
		
		//Update requisition Item
		String dto2 = this.readFile("dto/store/requisition-item-update.json");
		Map<String, Object> requisitionMap2 = (new ObjectMapper()).readValue(dto2, Map.class);
		MockHttpServletRequest newPostRequest2 = newPostRequest("store/requestitem/8800zx3570-8z37-11ff-2234-01102007815",
		    requisitionMap2);
		MockHttpServletResponse handle2 = handle(newPostRequest2);
		Map<String, Object> updateRequisition = (new ObjectMapper()).readValue(handle2.getContentAsString(), Map.class);
		System.out.println(updateRequisition);
		
	}
	
	@Test
	public void updateRequisition() throws Exception {
		String dto = this.readFile("dto/store/requisition-update.json");
		Map<String, Object> requisitionMap = (new ObjectMapper()).readValue(dto, Map.class);
		MockHttpServletRequest newPostRequest = newPostRequest("store/request/8800zx3570-8z37-11ff-2234-01102007813",
		    requisitionMap);
		MockHttpServletResponse handle = handle(newPostRequest);
		Map<String, Object> updateRequisition = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		assertThat("There is 1 requisition updated",
		    updateRequisition.get("uuid").equals("8800zx3570-8z37-11ff-2234-01102007813"));
		
		//updating statuses of requisition items
		MockHttpServletRequest newGetRequest = newGetRequest("store/request/8800zx3570-8z37-11ff-2234-01102007813");
		MockHttpServletResponse handleGet = handle(newGetRequest);
		Map<String, Object> handleGetObject = new ObjectMapper().readValue(handleGet.getContentAsString(), Map.class);
		//System.out.println(((List)handleGetObject.get("requisitionItems")).get("requisitionItemStatuses"));
		assertThat("There is a pending requisition item status",
		    (((Map) ((List) ((Map) ((List) handleGetObject.get("requisitionItems")).get(0)).get("requisitionItemStatuses"))
		            .get(0)).get("status")).equals("PENDING"));
		
	}
	
	@Test
	public void getStockMetricsList() throws Exception {
		
		//expired items
		MockHttpServletRequest newGetRequest = newGetRequest("store/expireditems", new Parameter("location",
		        "44939999-d333-fff2-9bff-61d11117c22e"));
		MockHttpServletResponse handleGet = handle(newGetRequest);
		Map<String, Object> handleGetObject = new ObjectMapper().readValue(handleGet.getContentAsString(), Map.class);
		System.out.println("expired " + handleGet.getContentAsString());
		assertThat("The list of expired drugs", ((List) handleGetObject.get("results")).size() == 3);
		
		//nearly stockout items
		MockHttpServletRequest newGetRequest1 = newGetRequest("store/nearlystockoutitems", new Parameter("location",
		        "44939999-d333-fff2-9bff-61d11117c22e"));
		MockHttpServletResponse handleGet1 = handle(newGetRequest1);
		Map<String, Object> handleGetObject1 = new ObjectMapper().readValue(handleGet1.getContentAsString(), Map.class);
		System.out.println("nearlystockout " + handleGet1.getContentAsString());
		assertThat("The list of nearly stockout items", ((List) handleGetObject1.get("results")).size() == 1);
		
		//nearly expired items
		MockHttpServletRequest newGetRequest2 = newGetRequest("store/nearlyexpireditems", new Parameter("location",
		        "44939999-d333-fff2-9bff-61d11117c22e"));
		MockHttpServletResponse handleGet2 = handle(newGetRequest2);
		Map<String, Object> handleGetObject2 = new ObjectMapper().readValue(handleGet2.getContentAsString(), Map.class);
		System.out.println("nearly exp " + handleGet2.getContentAsString());
		assertThat("The list of nearly expired items", ((List) handleGetObject2.get("results")).size() == 0);
		
	}
	
	@Test
	public void updateReorderLevel() throws Exception {
		
		String dto = this.readFile("dto/store/reorder-level-update.json");
		Map<String, Object> reorderLevelMap = (new ObjectMapper()).readValue(dto, Map.class);
		
		MockHttpServletRequest newPostRequest = newPostRequest("store/reorderlevel/8800zx3570-8z37-11ff-2234-01102007896",
		    reorderLevelMap);
		MockHttpServletResponse handle = handle(newPostRequest);
		Map<String, Object> updatedReorderLevel = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		System.out.println(handle.getContentAsString());
	}
	
	@Test
	public void getReceivedItem() throws Exception {
		
		MockHttpServletRequest newGetRequest = newGetRequest("store/receiveditem", new Parameter("location",
		        "44939999-d333-fff2-9bff-61d11117c22e"), new Parameter("item", "8o00d43570-8y37-11f3-1234-08002007777"));
		MockHttpServletResponse handleGet = handle(newGetRequest);
		Boolean handleGetObject = new ObjectMapper().readValue(handleGet.getContentAsString(), Boolean.class);
		assertThat("The item is in pending requisition", (handleGet.getContentAsString()), is("true"));
	}
	
	@Test
	public void testGetSummaryCost() throws Exception {
		MockHttpServletRequest newGetRequest = newGetRequest("store/reports/summarycost", new Parameter("paymentScheme",
		        "111xb1yz-1011-487z-868y-acc38ebc6252"));
		MockHttpServletResponse handleGet = handle(newGetRequest);
		Map<String, Object> reportCost = (new ObjectMapper()).readValue(handleGet.getContentAsString(), Map.class);
		Double totalAmount = (Double) reportCost.get("totalBuyingAmount");
		assertThat("The amount used to buy the items at stock is ", totalAmount, is(1000000.0));
	}
}
