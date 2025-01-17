package org.openmrs.module.icare.web.controller;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.DrugOrder;
import org.openmrs.Encounter;
import org.openmrs.Location;
import org.openmrs.PatientProgram;
import org.openmrs.api.context.Context;
import org.openmrs.module.icare.billing.models.InvoiceItem;
import org.openmrs.module.icare.billing.models.ItemPrice;
import org.openmrs.module.icare.core.ICareService;
import org.openmrs.module.icare.core.Item;
import org.openmrs.module.icare.core.ListResult;
import org.openmrs.module.icare.core.Pager;
import org.openmrs.module.icare.core.models.EncounterPatientProgram;
import org.openmrs.module.icare.laboratory.models.Sample;
import org.openmrs.module.icare.store.models.*;
import org.openmrs.module.icare.store.services.StoreService;
import org.openmrs.module.icare.store.util.StockOutException;
import org.openmrs.module.webservices.rest.web.RestConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Controller
@RequestMapping(value = "/rest/" + RestConstants.VERSION_1 + "/store")
public class StoreController {
	
	protected final Log log = LogFactory.getLog(getClass());
	
	@Autowired
	StoreService storeService;
	
	@Autowired
	ICareService iCareService;
	
	@RequestMapping(value = "reorderlevel", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> addReorderLevel(@RequestBody Map<String, Object> reorderLevelMap) {
		
		ReorderLevel reorderLevel = new ReorderLevel().fromMap(reorderLevelMap);
		
		ReorderLevel createdReorderLevel = storeService.addReorderLevel(reorderLevel);
		
		return createdReorderLevel.toMap();
	}
	
	@RequestMapping(value = "reorderlevels", method = RequestMethod.GET)
	@ResponseBody
	public List<Map<String, Object>> getAllReorderLevels() {
		
		List<ReorderLevel> reorderLevels = storeService.getAllReorderLevels();
		
		List<Map<String, Object>> reorderLevelsMapList = new ArrayList<Map<String, Object>>();
		for (ReorderLevel reorderLevel : reorderLevels) {
			reorderLevelsMapList.add(reorderLevel.toMap());
		}
		
		return reorderLevelsMapList;
		
	}
	
	@RequestMapping(value = "reorderlevel/{reorderLevelUuid}", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> updateReorderLevel(@RequestBody Map<String, Object> reorderLevelObjectMap,
	        @PathVariable String reorderLevelUuid) {
		
		ReorderLevel reorderLevel = ReorderLevel.fromMap(reorderLevelObjectMap);
		if (reorderLevel.getLocation().getUuid() != null) {
			Location location = Context.getLocationService().getLocationByUuid(reorderLevel.getLocation().getUuid());
			reorderLevel.setLocation(location);
		}
		
		if (reorderLevel.getItem().getUuid() != null) {
			Item item = iCareService.getItemByUuid(reorderLevel.getItem().getUuid());
			reorderLevel.setItem(item);
		}
		
		reorderLevel.setUuid(reorderLevelUuid);
		ReorderLevel updatedReorderLevel = storeService.updateReorderLevel(reorderLevel);
		
		return updatedReorderLevel.toMap();
		
	}
	
	@RequestMapping(value = "ledgertype", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> addLedgerType(@RequestBody Map<String, Object> ledgerTypeMap) {
		
		LedgerType ledgerType = new LedgerType().fromMap(ledgerTypeMap);
		
		LedgerType createdLedgerType = storeService.addLedgerType(ledgerType);
		
		return createdLedgerType.toMap();
	}
	
	@RequestMapping(value = "ledgertypes", method = RequestMethod.GET)
	@ResponseBody
	public List<Map<String, Object>> listLedgerTypes() {
		
		List<LedgerType> ledgerTypes = storeService.getLedgerTypes();
		
		List<Map<String, Object>> ledgerTypesMapList = new ArrayList<Map<String, Object>>();
		for (LedgerType ledgerType : ledgerTypes) {
			ledgerTypesMapList.add(ledgerType.toMap());
		}
		
		return ledgerTypesMapList;
	}
	
	@RequestMapping(value = "ledgers", method = RequestMethod.GET)
	@ResponseBody
	public List<Map<String, Object>> listLedgerEntries() {
		
		List<Ledger> ledgers = storeService.listLedgerEntries();
		
		List<Map<String, Object>> ledgersMapList = new ArrayList<Map<String, Object>>();
		for (Ledger ledger : ledgers) {
			ledgersMapList.add(ledger.toMap());
		}
		
		return ledgersMapList;
	}
	
	@RequestMapping(value = "ledger", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> addLedgerEntry(@RequestBody Map<String, Object> ledgerMap) throws ParseException,
	        StockOutException {
		
		Ledger ledger = Ledger.fromMap(ledgerMap);
		
		if (ledger.getLocation() != null) {
			ledger.setLocation(Context.getLocationService().getLocationByUuid(ledger.getLocation().getUuid()));
		}
		
		if (ledger.getItem() != null) {
			ledger.setItem(iCareService.getItemByUuid(ledger.getItem().getUuid()));
		}
		
		if (ledger.getLedgerType() != null) {
			ledger.setLedgerType(storeService.getLedgerTypeByUuid(ledger.getLedgerType().getUuid()));
		}
		
		Ledger createdLedger = storeService.saveLedger(ledger);
		
		return createdLedger.toMap();
	}
	
	@RequestMapping(value = "request", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> postRequisition(@RequestBody Map<String, Object> requisitionMap) {
		
		Requisition requisition = Requisition.fromMap(requisitionMap);
		
		if (requisition.getRequestingLocation() != null) {
			requisition.setRequestingLocation(Context.getLocationService().getLocationByUuid(
			    requisition.getRequestingLocation().getUuid()));
		}
		
		if (requisition.getRequestedLocation() != null) {
			requisition.setRequestedLocation(Context.getLocationService().getLocationByUuid(
			    requisition.getRequestedLocation().getUuid()));
		}
		
		List<RequisitionItem> requisitionItems = new ArrayList<RequisitionItem>();
		for (Map<String, Object> requisitionItemObject : (List<Map<String, Object>>) requisitionMap.get("requisitionItems")) {
			
			RequisitionItem requisitionItem = new RequisitionItem();
			requisitionItem.setItem(iCareService.getItemByUuid(((Map) requisitionItemObject.get("item")).get("uuid")
			        .toString()));
			requisitionItem.setQuantity((Integer) requisitionItemObject.get("quantity"));
			requisitionItem.setRequisition(requisition);
			
			requisitionItems.add(requisitionItem);
			
		}
		
		requisition.setRequisitionItems(requisitionItems);
		
		Requisition createdRequisition = storeService.saveRequest(requisition);
		
		return createdRequisition.toMapWithItems();
	}
	
	@RequestMapping(value = "request/{requisitionUuid}", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> updateRequisition(@PathVariable("requisitionUuid") String requisitionUuid,
	        @RequestBody Map<String, Object> requisitionMap) throws Exception {
		
		Requisition requisition = Requisition.fromMap(requisitionMap);
		requisition.setUuid(requisitionUuid);
		Requisition updateRequisition = storeService.updateRequisition(requisition);
		
		return requisition.toMapWithItems();
		
	}
	
	@RequestMapping(value = "request/{requisitionUuid}", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> getRequisitionByUuid(@PathVariable("requisitionUuid") String requisitionUuid) {
		
		Requisition requisition = storeService.getRequestByUuid(requisitionUuid);
		
		return requisition.toMapWithItems();
	}
	
	@RequestMapping(value = "request/{requisitionUuid}", method = RequestMethod.DELETE)
	@ResponseBody
	public Map<String, Object> deleteRequisition(@PathVariable("requisitionUuid") String requisitionUuid) {
		Requisition requisition = storeService.deleteRequisition(requisitionUuid);
		return requisition.toMap();
	}
	
	@RequestMapping(value = "requestitem", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> addRequisitionItem(@RequestBody Map<String, Object> requisitionItemMap) throws Exception {
		RequisitionItem requisitionItem = RequisitionItem.fromMap(requisitionItemMap);
		
		RequisitionItem savedRequisitionItem = storeService.saveRequisitionItem(requisitionItem);
		
		return savedRequisitionItem.toMap();
	}
	
	@RequestMapping(value = "requestitem/{requestItemUuid}", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> getRequisition(@PathVariable(value = "requestItemUuid") String requestItemUuid) {
		
		RequisitionItem requisitionItem = storeService.getRequisitionItem(requestItemUuid);
		
		return requisitionItem.toMap();
	}
	
	@RequestMapping(value = "requestitem/{requestItemUuid}", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> updateRequisitionItem(@PathVariable(value = "requestItemUuid") String requestItemUuid,
	        @RequestBody Map<String, Object> requestItemObjectMap) throws Exception {
		
		RequisitionItem requisitionItem = RequisitionItem.fromMap(requestItemObjectMap);
		requisitionItem.setUuid(requestItemUuid);
		RequisitionItem updatedRequisitionItem = storeService.updateRequisitionItem(requisitionItem);
		
		return updatedRequisitionItem.toMap();
	}
	
	@RequestMapping(value = "requestitem/{requestItemUuid}", method = RequestMethod.DELETE)
	@ResponseBody
	public Map<String, Object> deleteRequisitionItem(@PathVariable(value = "requestItemUuid") String requestItemUuid) {
		
		RequisitionItem requisitionItem = storeService.deleteRequisitionItem(requestItemUuid);
		
		return requisitionItem.toMap();
	}
	
	@RequestMapping(value = "requestitemstatus/{requestItemStatusUuid}", method = RequestMethod.DELETE)
	@ResponseBody
	public Map<String, Object> deleteRequisitionItemStatus(
	        @PathVariable(value = "requestItemStatusUuid") String requestItemStatusUuid) {
		
		RequisitionItemStatus requisitionItemStatus = storeService.deleteRequisitionItemStatus(requestItemStatusUuid);
		
		return requisitionItemStatus.toMap();
	}
	
	@RequestMapping(value = "requeststatus", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> addRequisitionStatus(@RequestBody Map<String, Object> requisitionStatusMap) {
		
		RequisitionStatus requisitionStatus = new RequisitionStatus().fromMap(requisitionStatusMap);
		
		return storeService.saveRequestStatus(requisitionStatus).toMap();
	}
	
	@RequestMapping(value = "requeststatus/{requestStatusUuid}", method = RequestMethod.DELETE)
	@ResponseBody
	public Map<String, Object> deleteRequisitionStatus(@PathVariable(value = "requestStatusUuid") String requestStatusUuid) {
		RequisitionStatus requisitionStatus = storeService.deleteRequisitionStatus(requestStatusUuid);
		return requisitionStatus.toMap();
	}
	
	@RequestMapping(value = "requests", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> getRequisitionsByLocation(@RequestParam(required = false) String requestingLocationUuid,
	        @RequestParam(required = false) String requestedLocationUuid,
	        @RequestParam(defaultValue = "true", value = "paging", required = false) boolean paging,
	        @RequestParam(defaultValue = "50", value = "pageSize", required = false) Integer pageSize,
	        @RequestParam(defaultValue = "1", value = "page", required = false) Integer page,
	        @RequestParam(value = "status", required = false) RequisitionStatus.RequisitionStatusCode status,
	        @RequestParam(value = "orderByDirection", required = false) Requisition.OrderByDirection orderByDirection,
	        @RequestParam(required = false) String q, @RequestParam(value = "startDate", required = false) String startDate,
	        @RequestParam(value = "endDate", required = false) String endDate) throws Exception {
		
		Pager pager = new Pager();
		pager.setAllowed(paging);
		pager.setPageSize(pageSize);
		pager.setPage(page);
		
		Date start = null;
		Date end = null;
		if (startDate != null && endDate != null) {
			
			SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
			start = formatter.parse(startDate);
			end = formatter.parse(endDate);
		}
		
		if (requestedLocationUuid != null && requestingLocationUuid == null) {
			ListResult<Requisition> requisitions = this.storeService.getRequestsForRequestedLocation(requestedLocationUuid,
			    pager, status, orderByDirection, q, start, end);
			
			//			List<Map<String, Object>> requisitionsList = new ArrayList<Map<String, Object>>();
			//
			//			for (Requisition requisition : requisitions.getResults()) {
			//				requisitionsList.add(requisition.toMap());
			//			}
			
			return requisitions.toMap();
			
		}
		
		if (requestingLocationUuid != null && requestedLocationUuid == null) {
			ListResult<Requisition> requisitions = this.storeService.getRequestsByRequestingLocation(requestingLocationUuid,
			    pager, status, orderByDirection, q, start, end);
			
			//			List<Map<String, Object>> requisitionsList = new ArrayList<Map<String, Object>>();
			//
			//			for (Requisition requisition : requisitions.getResults()) {
			//				requisitionsList.add(requisition.toMap());
			//			}
			
			return requisitions.toMap();
		}
		
		return null;
		
	}
	
	@RequestMapping(value = "issue", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> postAnIssue(@RequestBody Map<String, Object> issueMap) throws StockOutException,
	        ParseException {
		
		Issue issue = Issue.fromMap(issueMap);
		
		if (issue.getRequisition() != null) {
			issue.setRequisition(storeService.getRequestByUuid(issue.getRequisition().getUuid()));
		}
		
		if (issue.getIssueingLocation() != null) {
			issue.setIssueingLocation(Context.getLocationService().getLocationByUuid(issue.getIssueingLocation().getUuid()));
		}
		
		if (issue.getIssuedLocation() != null) {
			issue.setIssuedLocation(Context.getLocationService().getLocationByUuid(issue.getIssuedLocation().getUuid()));
		}
		
		List<IssueItem> issueItems = new ArrayList<IssueItem>();
		for (Map<String, Object> issueItemObject : (List<Map<String, Object>>) issueMap.get("issueItems")) {
			IssueItem issueItem = new IssueItem();
			issueItem.setItem(iCareService.getItemByUuid(((Map) issueItemObject.get("item")).get("uuid").toString()));
			if (issueItemObject.get("quantity") instanceof Integer) {
				issueItem.setQuantity(((Integer) issueItemObject.get("quantity")).doubleValue());
			}
			if (issueItemObject.get("quantity") instanceof Double) {
				issueItem.setQuantity((Double) issueItemObject.get("quantity"));
			}
			
			if (issueItemObject.get("batch") instanceof String) {
				issueItem.setBatchNo((String) issueItemObject.get("batch"));
			}
			
			if (issueItemObject.get("expiryDate") instanceof String) {
				SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
				if (issueItemObject.get("expiryDate").toString().length() == 10) {
					issueItem.setExpiryDate(dateFormat.parse(issueItemObject.get("expiryDate").toString()));
				} else {
					issueItem.setExpiryDate(dateFormat.parse(issueItemObject.get("expiryDate").toString()
					        .substring(0, issueItemObject.get("expiryDate").toString().indexOf("T"))));
				}
			}
			
			issueItem.setIssue(issue);
			
			issueItems.add(issueItem);
			
		}
		
		issue.setIssueItems(issueItems);
		
		Issue createdIssue = storeService.saveIssue(issue);
		
		return createdIssue.toMap();
	}
	
	@RequestMapping(value = "issuestatus", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> addIssueStatus(@RequestBody Map<String, Object> issueStatusMap) {
		
		IssueStatus issueStatus = new IssueStatus().fromMap(issueStatusMap);
		
		issueStatus.setIssue(storeService.getIssueByUuid(issueStatus.getIssue().getUuid()));
		
		return storeService.saveIssueStatus(issueStatus).toMap();
	}
	
	@RequestMapping(value = "issueitemstatus", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> addIssueItemStatus(@RequestBody Map<String, Object> issueItemStatusMap) {
		
		IssueItemStatus issueItemStatus = new IssueItemStatus().fromMap(issueItemStatusMap);
		
		issueItemStatus.setIssueItem(storeService.getIssueItemByUuid(issueItemStatus.getIssueItem().getUuid()));
		
		return storeService.saveIssueItemStatus(issueItemStatus).toMap();
	}
	
	@RequestMapping(value = "issues", method = RequestMethod.GET)
	@ResponseBody
	public List<Map<String, Object>> getIssuesByLocation(@RequestParam(required = false) String issueingLocationUuid,
	        @RequestParam(required = false) String issuedLocationUuid) {
		if (issuedLocationUuid != null && issueingLocationUuid == null) {
			List<Issue> issues = this.storeService.getIssuesForIssuedLocation(issuedLocationUuid);
			
			List<Map<String, Object>> issuesList = new ArrayList<Map<String, Object>>();
			
			for (Issue issue : issues) {
				issuesList.add(issue.toMap());
			}
			
			return issuesList;
			
		}
		
		if (issueingLocationUuid != null && issuedLocationUuid == null) {
			List<Issue> issues = this.storeService.getIssuesByIssueingLocation(issueingLocationUuid);
			
			List<Map<String, Object>> issuesList = new ArrayList<Map<String, Object>>();
			
			for (Issue issue : issues) {
				issuesList.add(issue.toMap());
			}
			
			return issuesList;
		}
		
		return null;
	}
	
	@RequestMapping(value = "receive", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> postAReceipt(@RequestBody Map<String, Object> receiptMap) throws StockOutException,
	        ParseException {
		
		Receipt receipt = new Receipt().fromMap(receiptMap);
		
		if (receipt.getIssue() != null) {
			receipt.setIssue(storeService.getIssueByUuid(receipt.getIssue().getUuid()));
		}
		
		if (receipt.getIssueingLocation() != null) {
			receipt.setIssueingLocation(Context.getLocationService().getLocationByUuid(
			    receipt.getIssueingLocation().getUuid()));
		}
		
		if (receipt.getReceivingLocation() != null) {
			receipt.setReceivingLocation(Context.getLocationService().getLocationByUuid(
			    receipt.getReceivingLocation().getUuid()));
		}
		
		List<ReceiptItem> receiptItems = new ArrayList<ReceiptItem>();
		for (Map<String, Object> receiptItemObject : (List<Map<String, Object>>) receiptMap.get("receiptItems")) {
			
			ReceiptItem receiptItem = new ReceiptItem();
			receiptItem.setItem(iCareService.getItemByUuid(((Map) receiptItemObject.get("item")).get("uuid").toString()));
			if (receiptItemObject.get("quantity") instanceof Integer) {
				receiptItem.setQuantity(((Integer) receiptItemObject.get("quantity")).doubleValue());
			} else if (receiptItemObject.get("quantity") instanceof Integer) {
				receiptItem.setQuantity((Double) receiptItemObject.get("quantity"));
			}
			
			if (receiptItemObject.get("batch") instanceof String) {
				receiptItem.setBatchNo((String) receiptItemObject.get("batch"));
			}
			
			if (receiptItemObject.get("expiryDate") instanceof String) {
				SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
				if (receiptItemObject.get("expiryDate").toString().length() == 10) {
					receiptItem.setExpiryDate(dateFormat.parse(receiptItemObject.get("expiryDate").toString()));
				} else {
					receiptItem.setExpiryDate(dateFormat.parse(receiptItemObject.get("expiryDate").toString()
					        .substring(0, receiptItemObject.get("expiryDate").toString().indexOf("T"))));
				}
			}
			
			receiptItem.setReceipt(receipt);
			receiptItems.add(receiptItem);
		}
		
		receipt.setIssueingLocation(Context.getLocationService().getLocationByUuid(receipt.getIssueingLocation().getUuid()));
		
		receipt.setReceivingLocation(Context.getLocationService()
		        .getLocationByUuid(receipt.getReceivingLocation().getUuid()));
		
		receipt.setReceiptItems(receiptItems);
		
		Receipt createdReceipt = storeService.saveReceive(receipt);
		
		return createdReceipt.toMap();
	}
	
	@RequestMapping(value = "receipts", method = RequestMethod.GET)
	@ResponseBody
	public List<Map<String, Object>> getReceiptsByLocation(@RequestParam(required = false) String issueingLocationUuid,
	        @RequestParam(required = false) String receivingLocationUuid) {
		if (issueingLocationUuid != null && receivingLocationUuid == null) {
			List<Receipt> receipts = this.storeService.getReceiptsByIssueingLocation(issueingLocationUuid);
			
			List<Map<String, Object>> receiptsList = new ArrayList<Map<String, Object>>();
			
			for (Receipt receipt : receipts) {
				receiptsList.add(receipt.toMap());
			}
			
			return receiptsList;
			
		}
		
		if (receivingLocationUuid != null && issueingLocationUuid == null) {
			List<Receipt> receipts = this.storeService.getReceiptsForReceivingLocation(receivingLocationUuid);
			
			List<Map<String, Object>> receiptsList = new ArrayList<Map<String, Object>>();
			
			for (Receipt receipt : receipts) {
				receiptsList.add(receipt.toMap());
			}
			
			return receiptsList;
		}
		
		return null;
	}
	
	@RequestMapping(value = "pendingrequisition", method = RequestMethod.GET)
	@ResponseBody
	public Boolean isPendingRequisition(@RequestParam(required = false, value = "item") String itemUuid,
	        @RequestParam(required = false, value = "location") String locationUuid) {
		
		Boolean IsPendingRequisition = this.storeService.isPendingRequisition(itemUuid, locationUuid);
		
		return IsPendingRequisition;
	}
	
	@RequestMapping(value = "stock", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> listAllStockStatus(@RequestParam(required = false) String locationUuid,
	        @RequestParam(required = false) String q, @RequestParam(defaultValue = "100000") Integer limit,
	        @RequestParam(defaultValue = "0") Integer startIndex, @RequestParam(required = false) String conceptClassName,
	        @RequestParam(defaultValue = "true", value = "paging", required = false) boolean paging,
	        @RequestParam(defaultValue = "50", value = "pageSize", required = false) Integer pageSize,
	        @RequestParam(defaultValue = "1", value = "page", required = false) Integer page) throws Exception {
		
		Pager pager = new Pager();
		pager.setAllowed(paging);
		pager.setPageSize(pageSize);
		pager.setPage(page);
		
		ListResult<Stock> stocklist;
		
		if (locationUuid != null) {
			stocklist = this.storeService.getStockByLocation(locationUuid, pager, q, startIndex, limit, conceptClassName);
		} else {
			//			stocksStatus = this.storeService.getAllStockStatusMetrics();
			stocklist = this.storeService.getAllStock(pager);
			
		}
		
		//		List<Map<String, Object>> stockStatusResponse = new ArrayList<Map<String, Object>>();
		//		for (Stock stock : stocksStatus) {
		//			stockStatusResponse.add(stock.toMap());
		//		}
		return stocklist.toMap();
	}
	
	@RequestMapping(value = "item/{itemUuid}/stock", method = RequestMethod.GET)
	@ResponseBody
	public List<Map<String, Object>> getItemStockStatus(@PathVariable("itemUuid") String itemUuid,
	        @RequestParam(required = false) String locationUuid) {
		
		List<Stock> stockStatus;
		if (locationUuid != null) {
			stockStatus = storeService.getStockByItemAndLocation(itemUuid, locationUuid);
		} else {
			stockStatus = storeService.getItemStockMetrics(itemUuid);
		}
		
		List<Map<String, Object>> stockStatusResponse = new ArrayList<Map<String, Object>>();
		for (Stock stock : stockStatus) {
			stockStatusResponse.add(stock.toMap());
		}
		return stockStatusResponse;
	}
	
	@RequestMapping(value = "prescription/{drugOrderUuid}/dispense", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> dispense(@PathVariable("drugOrderUuid") String drugOrderUuid,
	        @RequestBody Map<String, Object> orderObject) {
		OrderStatus orderStatus = storeService.dispense(drugOrderUuid, (String) orderObject.get("location"),
		    (String) orderObject.get("location"));
		return orderStatus.toMap();
	}
	
	@RequestMapping(value = "drugOrder/{drugOrderUuid}/dispense", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> dispenseDrug(@PathVariable("drugOrderUuid") String drugOrderUuid,
	        @RequestBody Map<String, Object> orderObject) {
		OrderStatus orderStatus = storeService
		        .dispenseDrug(drugOrderUuid, (String) orderObject.get("drugUuid"), (Integer) orderObject.get("quantity"),
		            (String) orderObject.get("location"), (String) orderObject.get("remarks"));
		return orderStatus.toMap();
	}
	
	@RequestMapping(value = "orderStatus/{visitUuid}", method = RequestMethod.GET)
	@ResponseBody
	public List<Map<String, Object>> orderStatus(@PathVariable("visitUuid") String visitUuid) {
		List<OrderStatus> orderStatuses = storeService.getOrderStatus(visitUuid);
		List<Map<String, Object>> stockStatusResponse = new ArrayList<Map<String, Object>>();
		for (OrderStatus orderStatus : orderStatuses) {
			stockStatusResponse.add(orderStatus.toMap());
		}
		return stockStatusResponse;
	}
	
	@RequestMapping(value = "drug/{drugUuid}/stock", method = RequestMethod.GET)
	@ResponseBody
	public List<Map<String, Object>> getDrugStockStatus(@PathVariable("drugUuid") String drugUuid,
	        @RequestParam(required = false) String locationUuid) {
		
		List<Stock> stockStatus;
		if (locationUuid != null) {
			stockStatus = storeService.getStockByDrugAndLocation(drugUuid, locationUuid);
		} else {
			stockStatus = storeService.getDrugStockMetrics(drugUuid);
		}
		
		List<Map<String, Object>> stockStatusResponse = new ArrayList<Map<String, Object>>();
		for (Stock stock : stockStatus) {
			stockStatusResponse.add(stock.toMap());
		}
		return stockStatusResponse;
	}
	
	@RequestMapping(value = "stockout", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> getItemsStockedOut(@RequestParam(required = false, value = "location") String locationUuid,
	        @RequestParam(defaultValue = "true", value = "paging", required = false) boolean paging,
	        @RequestParam(defaultValue = "50", value = "pageSize", required = false) Integer pageSize,
	        @RequestParam(defaultValue = "1", value = "page", required = false) Integer page,
	        @RequestParam(required = false) String q, @RequestParam(required = false) String conceptClassName)
	        throws Exception {
		
		Pager pager = new Pager();
		pager.setAllowed(paging);
		pager.setPageSize(pageSize);
		pager.setPage(page);
		
		ListResult<Item> stockObjects = null;
		if (locationUuid != null) {
			stockObjects = storeService.getStockoutByLocation(locationUuid, pager, q, conceptClassName);
		} else {
			stockObjects = storeService.getStockout(pager);
		}
		//		List<Map<String, Object>> stockStatusResponse = new ArrayList<Map<String, Object>>();
		//		for (Item item : stockObjects) {
		//			stockStatusResponse.add(item.toMap());
		//		}
		return stockObjects.toMap();
	}
	
	@RequestMapping(value = "nearlystockoutitems", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> getNearlyStockedOutItems(
	        @RequestParam(required = false, value = "location") String locationUuid,
	        @RequestParam(defaultValue = "true", value = "paging", required = false) boolean paging,
	        @RequestParam(defaultValue = "50", value = "pageSize", required = false) Integer pageSize,
	        @RequestParam(defaultValue = "1", value = "page", required = false) Integer page,
	        @RequestParam(required = false) String q) throws Exception {
		
		Pager pager = new Pager();
		pager.setAllowed(paging);
		pager.setPageSize(pageSize);
		pager.setPage(page);
		
		ListResult<Item> nearlyStockedItems = storeService.getNearlyStockedOutByLocation(locationUuid, pager, q);
		
		return nearlyStockedItems.toMap();
	}
	
	@RequestMapping(value = "nearlyexpireditems", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> getNearlyExpiredItems(
	        @RequestParam(required = false, value = "location") String locationUuid,
	        @RequestParam(defaultValue = "true", value = "paging", required = false) boolean paging,
	        @RequestParam(defaultValue = "50", value = "pageSize", required = false) Integer pageSize,
	        @RequestParam(defaultValue = "1", value = "page", required = false) Integer page,
	        @RequestParam(required = false) String q) throws Exception {
		
		Pager pager = new Pager();
		pager.setAllowed(paging);
		pager.setPageSize(pageSize);
		pager.setPage(page);
		
		ListResult<Item> nearlyExpiredItems = storeService.getNearlyExpiredByLocation(locationUuid, pager, q);
		
		return nearlyExpiredItems.toMap();
	}
	
	@RequestMapping(value = "expireditems", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> getExpiredItems(@RequestParam(required = false, value = "location") String locationUuid,
	        @RequestParam(defaultValue = "true", value = "paging", required = false) boolean paging,
	        @RequestParam(defaultValue = "50", value = "pageSize", required = false) Integer pageSize,
	        @RequestParam(defaultValue = "1", value = "page", required = false) Integer page,
	        @RequestParam(required = false) String q) throws Exception {
		
		Pager pager = new Pager();
		pager.setAllowed(paging);
		pager.setPageSize(pageSize);
		pager.setPage(page);
		
		ListResult<Item> expiredItems = storeService.getExpiredItemsByLocation(locationUuid, pager, q);
		
		return expiredItems.toMap();
	}
	
	@RequestMapping(value = "metrics", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> getLocationStockMetrics(
	        @RequestParam(required = false, value = "location") String locationUuid) throws Exception {
		
		if (locationUuid != null) {
			return storeService.getLocationStockMetrics(locationUuid);
		} else {
			throw new Exception("location is not provided");
		}
		
	}
	
	@RequestMapping(value = "stockinvoices",method = RequestMethod.POST)
	@ResponseBody
	public List<Map<String,Object>> addStockInvoices(@RequestBody List<Map<String,Object>> stockInvoicesMap) throws Exception {

		StockInvoice stockInvoice = new StockInvoice();
		List<Map<String,Object>> newStockInvoicesObject = new ArrayList<>();

		for(Map<String,Object> stockInvoiceMap : stockInvoicesMap){

			stockInvoice = StockInvoice.fromMap(stockInvoiceMap);

			List<StockInvoiceItem> stockInvoiceItems = new ArrayList<>();
			for (Map<String, Object> invoiceItemMap : (List<Map<String, Object>>) stockInvoiceMap.get("invoiceItems")){
				StockInvoiceItem stockInvoiceItem = StockInvoiceItem.fromMap(invoiceItemMap);
				stockInvoiceItem.setStockInvoice(stockInvoice);
				stockInvoiceItems.add(stockInvoiceItem);
			}

			stockInvoice.setStockInvoiceItems(stockInvoiceItems);

			StockInvoice savedStockInvoice = storeService.saveStockInvoice(stockInvoice);
			newStockInvoicesObject.add(savedStockInvoice.toMap());

		}
		return newStockInvoicesObject;

	}
	
	@RequestMapping(value = "stockinvoice/{stockInvoiceUuid}",method = RequestMethod.POST)
	@ResponseBody
	public Map<String,Object> updateStockInvoice(@PathVariable String stockInvoiceUuid, @RequestBody Map<String,Object> stockInvoiceMap) throws Exception {

		StockInvoice stockInvoice = StockInvoice.fromMap(stockInvoiceMap);
		stockInvoice.setUuid(stockInvoiceUuid);
		if(stockInvoiceMap.get("invoiceItems") != null) {
			List<StockInvoiceItem> stockInvoiceItems = new ArrayList<>();
			for (Map<String, Object> invoiceItemMap : (List<Map<String, Object>>) stockInvoiceMap.get("invoiceItems")) {
				StockInvoiceItem stockInvoiceItem = StockInvoiceItem.fromMap(invoiceItemMap);
				stockInvoiceItem.setStockInvoice(stockInvoice);
				stockInvoiceItems.add(stockInvoiceItem);
			}

			stockInvoice.setStockInvoiceItems(stockInvoiceItems);
		}
		StockInvoice updatedStockInvoice = storeService.updateStockInvoice(stockInvoice);

		return updatedStockInvoice.toMap();
	}
	
	@RequestMapping(value = "stockinvoices", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> getStockInvoices(
	        @RequestParam(defaultValue = "true", value = "paging", required = false) boolean paging,
	        @RequestParam(defaultValue = "50", value = "pageSize", required = false) Integer pageSize,
	        @RequestParam(defaultValue = "1", value = "page", required = false) Integer page,
	        @RequestParam(required = false, value = "status") StockInvoiceStatus.Type status,
	        @RequestParam(required = false) String q, @RequestParam(value = "startDate", required = false) String startDate,
	        @RequestParam(value = "endDate", required = false) String endDate) throws Exception {
		
		Pager pager = new Pager();
		pager.setAllowed(paging);
		pager.setPageSize(pageSize);
		pager.setPage(page);
		
		Date start = null;
		Date end = null;
		if (startDate != null && endDate != null) {
			
			SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
			start = formatter.parse(startDate);
			end = formatter.parse(endDate);
		}
		
		ListResult<StockInvoice> stockInvoices = this.storeService.getStockInvoices(pager, status, q, start, end);
		return stockInvoices.toMap();
	}
	
	@RequestMapping(value = "stockinvoice/{stockInvoiceUuid}", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> getStockInvoiceByUuid(@PathVariable String stockInvoiceUuid) {
		
		StockInvoice stockInvoice = storeService.getStockInvoice(stockInvoiceUuid);
		return stockInvoice.toMapWithItems();
	}
	
	@RequestMapping(value = "stockinvoice/{stockInvoiceUuid}", method = RequestMethod.DELETE)
	@ResponseBody
	public Map<String, Object> deleteStockInvoice(@PathVariable String stockInvoiceUuid) {
		
		StockInvoice stockInvoice = storeService.deleteStockInvoice(stockInvoiceUuid);
		
		return stockInvoice.toMap();
		
	}
	
	@RequestMapping(value = "suppliers",method = RequestMethod.POST)
	@ResponseBody
	public List<Map<String,Object>> addSuppliers(@RequestBody List<Map<String,Object>> suppliersMap) throws Exception {

		Supplier supplier = new Supplier();
		List<Map<String,Object>> newSuppliersMapList = new ArrayList<>();

		for(Map<String,Object> supplierMap : suppliersMap){
			supplier = Supplier.fromMap(supplierMap);

			Supplier savedSupplier = storeService.saveSupplier(supplier);
			newSuppliersMapList.add(savedSupplier.toMap());
		}

		return newSuppliersMapList;
	}
	
	@RequestMapping(value = "supplier/{supplierUuid}", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> updateSupplier(@PathVariable String supplierUuid, @RequestBody Map<String, Object> supplierMap)
	        throws Exception {
		Supplier supplier = Supplier.fromMap(supplierMap);
		supplier.setUuid(supplierUuid);
		Supplier updatedSupplier = storeService.updateSupplier(supplier);
		
		return updatedSupplier.toMap();
	}
	
	@RequestMapping(value="suppliers",method = RequestMethod.GET)
	@ResponseBody
	public List<Map<String,Object>> getSuppliers(@RequestParam(value = "startIndex",required = false,defaultValue = "0") Integer startIndex,@RequestParam(value="limit" ,required=false,defaultValue = "100") Integer limit){

		List<Supplier> suppliers = storeService.getSuppliers(startIndex,limit);
		List<Map<String,Object>> suppliersMap = new ArrayList<>();
		for (Supplier supplier : suppliers){
			suppliersMap.add(supplier.toMap());
		}
		return suppliersMap;

	}
	
	@RequestMapping(value = "stockinvoicesstatus",method = RequestMethod.POST)
	@ResponseBody
	public List<Map<String,Object>> addStockInvoiceStatuses(@RequestBody List<Map<String,Object>> stockInvoicesStatusMap) throws Exception {

		List<Map<String,Object>> newStockInvoiceStatusMapList = new ArrayList<>();
		for(Map<String,Object> stockInvoiceStatusMap : stockInvoicesStatusMap){
			StockInvoiceStatus stockInvoiceStatus = StockInvoiceStatus.fromMap(stockInvoiceStatusMap);

			StockInvoiceStatus savedStockInvoiceStatus = storeService.saveStockInvoiceStatus(stockInvoiceStatus);
			newStockInvoiceStatusMapList.add(savedStockInvoiceStatus.toMap());
		}

		return newStockInvoiceStatusMapList;
	}
	
	@RequestMapping(value ="stockinvoicesstatus", method = RequestMethod.GET)
	@ResponseBody
	public List<Map<String,Object>> getStockInvoicesStatus(@RequestParam(value = "startIndex",defaultValue = "0", required = false) Integer startIndex,@RequestParam(value="limit",required = false,defaultValue = "100") Integer limit, @RequestParam(required = false) String q){

		List<StockInvoiceStatus> stockInvoiceStatusList = storeService.getStockInvoicesStatus(startIndex,limit,q);
		List<Map<String,Object>> stockInvoiceStatusMapList = new ArrayList<>();
		for(StockInvoiceStatus stockInvoiceStatus : stockInvoiceStatusList){
			stockInvoiceStatusMapList.add(stockInvoiceStatus.toMap());
		}

		return stockInvoiceStatusMapList;
	}
	
	@RequestMapping(value = "stockinvoiceitem/{stockInvoiceItemUuid}", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> updateStockInvoiceItems(@PathVariable String stockInvoiceItemUuid,
	        @RequestBody Map<String, Object> stockInvoiceItemsMap) throws Exception {
		
		StockInvoiceItem stockInvoiceItem = StockInvoiceItem.fromMap(stockInvoiceItemsMap);
		stockInvoiceItem.setUuid(stockInvoiceItemUuid);
		StockInvoiceItem updatedStockInvoiceItem = storeService.updateStockInvoiceItem(stockInvoiceItem);
		return updatedStockInvoiceItem.toMap();
		
	}
	
	@RequestMapping(value = "stockinvoiceitem/{stockInvoiceItemUuid}", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> getStockInvoiceItemByUuid(@PathVariable String stockInvoiceItemUuid) {
		StockInvoiceItem stockInvoiceItem = storeService.getStockInvoiceItemByUuid(stockInvoiceItemUuid);
		return stockInvoiceItem.toMap();
	}
	
	@RequestMapping(value = "reports/summarycost", method = RequestMethod.GET)
	@ResponseBody
	public Map<String,Object> getStockItemsSummaryCost(
			@RequestParam(value = "stockInvoice", required = false) String stockInvoice,
			@RequestParam(value = "startDate", required = false) String startDate,
			@RequestParam(value = "endDate", required = false) String endDate,
			@RequestParam(defaultValue = "true", value = "paging", required = false) boolean paging,
			@RequestParam(defaultValue = "50", value = "pageSize", required = false) Integer pageSize,
			@RequestParam(defaultValue = "1", value = "page", required = false) Integer page,
			@RequestParam(value = "provider", required = false) String provider,
			@RequestParam(value = "paymentScheme", required = false) String paymentScheme
	) throws Exception {
		try {
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
			System.out.println(paymentScheme);
			ListResult response = storeService.getStockInvoiceItems(
					pager,
					stockInvoice,
					start,
					end,
					provider,
					paymentScheme);
			Pager pagerInfo = response.getPager();
			List<Object[]> results = response.getResults();
			Map<String,Object> outputData = new HashMap<>();
			for (Object[] result: results) {
				double totalBuyingAmount = Double.parseDouble(result[0].toString());
				Item item =  (Item) result[1];
				StockInvoice stockInvoiceData = (StockInvoice) result[2];
				double totalItemAmount = Double.parseDouble(result[3].toString());
				double totalItemIncomeExpected = 0.0;
				if (paymentScheme != null) {
					totalItemIncomeExpected = Double.parseDouble(result[4].toString());
				}
				Map<String,Object> itemBuyAndSellDetails = item.toMap();
				if (!item.getPrices().isEmpty()) {
					List<Map<String,Object>> pricesBuyAndSellingAmount = new ArrayList<>();
					for (ItemPrice itemPrice: item.getPrices()) {
						Map<String,Object> priceDetails = new HashMap<>();
						priceDetails.put("price", itemPrice.getPrice());
						priceDetails.put("totalBuyAmount", totalBuyingAmount);
						priceDetails.put("totalExpectedSellAmount", itemPrice.getPrice().doubleValue() * totalItemAmount);
						pricesBuyAndSellingAmount.add(priceDetails);
					}
					itemBuyAndSellDetails.put("itemBuyAndSellDetails", pricesBuyAndSellingAmount);
				}
				outputData.put("totalBuyingAmount", totalBuyingAmount);
				outputData.put("totalItemIncomeExpected",totalItemIncomeExpected);
				outputData.put("itemBuyAndSellDetails", itemBuyAndSellDetails);
			}
			outputData.put("pager", pagerInfo);
			return outputData;
		} catch (Exception e) {
			throw  new Exception(e.getMessage());
		}
	}
	
	@RequestMapping(value = "encounterpatientprogram", method = RequestMethod.POST)
	@ResponseBody
	public List<Map<String, Object>> createEncounterPatientProgram(@RequestBody Map<String, Object> encounterPatientProgramMap) {

		List<Map<String, Object>> encounterWorkflowStateListMap = new ArrayList<>();
		if (encounterPatientProgramMap.get("encounters") != null) {
			for (Map<String, Object> encounterMap : (List<Map<String, Object>>) encounterPatientProgramMap.get("encounters")) {

				EncounterPatientProgram encounterPatientProgram = new EncounterPatientProgram();
				Encounter encounter = Context.getEncounterService().getEncounterByUuid(encounterMap.get("uuid").toString());
				encounterPatientProgram.setEncounter(encounter);

				if (encounterPatientProgramMap.get("patientProgram") != null) {

					PatientProgram patientProgram = Context.getProgramWorkflowService().getPatientProgramByUuid(((Map) encounterPatientProgramMap.get("patientProgram")).get("uuid").toString());
					encounterPatientProgram.setPatientProgram(patientProgram);
				}
				EncounterPatientProgram savedEncounterPatientProgram = iCareService.saveEncounterPatientProgram(encounterPatientProgram);
				encounterWorkflowStateListMap.add(savedEncounterPatientProgram.toMap());
			}
		}

		return encounterWorkflowStateListMap;
	}
}
