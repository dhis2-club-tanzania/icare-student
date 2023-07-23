package org.openmrs.module.icare.store.services;

import org.openmrs.Location;
import org.openmrs.api.OpenmrsService;
import org.openmrs.module.icare.core.Item;
import org.openmrs.module.icare.core.ListResult;
import org.openmrs.module.icare.core.Pager;
import org.openmrs.module.icare.store.models.*;
import org.openmrs.module.icare.store.util.StockOutException;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Transactional
public interface StoreService extends OpenmrsService {
	
	public ReorderLevel addReorderLevel(ReorderLevel reorderLevel);
	
	public List<ReorderLevel> getAllReorderLevels();
	
	public LedgerType addLedgerType(LedgerType ledgerType);
	
	public List<LedgerType> getLedgerTypes();
	
	public List<Ledger> listLedgerEntries();
	
	public Ledger saveLedger(Ledger ledger) throws StockOutException;
	
	Stock getStockByItemBatchLocation(Item item, String batchNo, Date expiryDate, Location location);
	
	List<Stock> getStockByItemLocation(Item item, Location location);
	
	public Requisition saveRequest(Requisition requisition);
	
	public RequisitionStatus saveRequestStatus(RequisitionStatus requisitionStatus);
	
	public List<RequisitionStatus> getRequisitionStatuses();
	
	public ListResult<Requisition> getRequestsByRequestingLocation(String requestingLocationUuid, Pager pager,
	        RequisitionStatus.RequisitionStatusCode status, Requisition.OrderByDirection orderByDirection);
	
	public ListResult<Requisition> getRequestsForRequestedLocation(String requestedLocationUuid, Pager pager,
	        RequisitionStatus.RequisitionStatusCode status, Requisition.OrderByDirection orderByDirection);
	
	public Requisition getRequestByUuid(String requisitionUuid);
	
	public Issue saveIssue(Issue issue) throws StockOutException;
	
	public IssueStatus saveIssueStatus(IssueStatus issueStatus);
	
	public IssueItemStatus saveIssueItemStatus(IssueItemStatus issueItemStatus);
	
	public List<Issue> getIssuesByIssueingLocation(String issueingLocationUuid);
	
	public List<Issue> getIssuesForIssuedLocation(String issuedLocationUuid);
	
	public List<IssueStatus> getIssueStatuses();
	
	public Receipt saveReceive(Receipt receipt) throws StockOutException;
	
	public List<Receipt> getReceiptsByIssueingLocation(String issueingLocationUuid);
	
	public List<Receipt> getReceiptsForReceivingLocation(String receivingLocationUuid);
	
	public List<Stock> getAllStockStatusMetrics();
	
	List<OrderStatus> getOrderStatusByOrderUuid(String orderUuid);
	
	public List<Stock> getStockByItemAndLocation(String itemUuid, String locationUuid);
	
	public List<Stock> getStockByLocation(String locationUuid, String search, Integer startIndex, Integer limit,
	        String conceptClassName);
	
	public List<Item> getStockout();
	
	public List<Stock> getItemStockMetrics(String itemUuid);
	
	public LedgerType getLedgerTypeByUuid(String ledgerTypeUuid);
	
	public Ledger getLedgerByUuid(String ledgerUuid);
	
	public Issue getIssueByUuid(String issueUuid);
	
	List<Item> getStockoutByLocation(String locationUuid, String q, Integer startIndex, Integer limit,
	        String conceptClassName);
	
	Stock saveStock(Stock stock);
	
	Transaction saveTransaction(Transaction transaction);
	
	List<Transaction> getTransactionsByLocationUuid(String uuid);
	
	public Map<String, Object> getLocationStockMetrics(String locationUuid);
	
	List<Stock> getStockByItemAndLocations(String itemUuid, List<String> locationUuids);
	
	List<Stock> getStockByDrugAndLocation(String drugUuid, String locationUuid);
	
	List<Stock> getDrugStockMetrics(String drugUuid);
	
	OrderStatus dispense(String drugOrderUuid, String locationUuid, String remarks);
	
	List<OrderStatus> getOrderStatus(String visitUuid);
	
	OrderStatus dispenseDrug(String drugOrderUuid, String location, String location1);
	
	StockInvoice saveStockInvoice(StockInvoice stockInvoice) throws Exception;
	
	public Supplier getSupplierByUuid(String supplierUuid);
	
	ListResult<StockInvoice> getStockInvoices(Pager pager, StockInvoiceStatus.Type status);
	
	Supplier saveSupplier(Supplier supplier) throws Exception;
	
	List<Supplier> getSuppliers(Integer startIndex, Integer limit);
	
	StockInvoiceStatus saveStockInvoiceStatus(StockInvoiceStatus stockInvoiceStatus) throws Exception;
	
	List<StockInvoiceStatus> getStockInvoicesStatus(Integer startIndex, Integer limit, String q);
	
	StockInvoice updateStockInvoice(StockInvoice stockInvoice) throws Exception;
	
	StockInvoice getStockInvoice(String stockInvoiceUuid);
	
	StockInvoiceItem updateStockInvoiceItem(StockInvoiceItem stockInvoiceItem) throws Exception;
	
	StockInvoiceItem getStockInvoiceItemByUuid(String stockInvoiceItemUuid);
	
	StockInvoiceItem saveStockInvoiceItem(StockInvoiceItem stockInvoiceItem) throws Exception;
	
	StockInvoiceItemStatus saveStockInvoiceItemStatus(StockInvoiceItemStatus stockInvoiceItemStatus);
	
	Supplier updateSupplier(Supplier supplier) throws Exception;
	
	Requisition updateRequisition(Requisition requisition) throws Exception;
	
	RequisitionItem saveRequisitionItem(RequisitionItem requisitionItem) throws Exception;
	
	RequisitionItemStatus saveRequisitionItemStatus(RequisitionItemStatus requisitionItemStatus);
	
	RequisitionItem updateRequisitionItem(RequisitionItem requisitionItem) throws Exception;
	
	public IssueItem getIssueItemByUuid(String IssueItemUuid);
}
