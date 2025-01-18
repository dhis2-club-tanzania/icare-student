package org.openmrs.module.icare.store.services;

import org.openmrs.Location;
import org.openmrs.Order;
import org.openmrs.api.OpenmrsService;
import org.openmrs.module.icare.core.Item;
import org.openmrs.module.icare.core.ListResult;
import org.openmrs.module.icare.core.Pager;
import org.openmrs.module.icare.core.models.EncounterPatientProgram;
import org.openmrs.module.icare.core.models.EncounterPatientState;
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
	        RequisitionStatus.RequisitionStatusCode status, Requisition.OrderByDirection orderByDirection, String q,
	        Date start, Date end);
	
	public ListResult<Requisition> getRequestsForRequestedLocation(String requestedLocationUuid, Pager pager,
	        RequisitionStatus.RequisitionStatusCode status, Requisition.OrderByDirection orderByDirection, String q,
	        Date start, Date end);
	
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
	
	public ListResult<Stock> getAllStock(Pager pager);
	
	List<OrderStatus> getOrderStatusByOrderUuid(String orderUuid);
	
	public List<Stock> getStockByItemAndLocation(String itemUuid, String locationUuid);
	
	public ListResult<Stock> getStockByLocation(String locationUuid, Pager pager, String search, Integer startIndex,
	        Integer limit, String conceptClassName);
	
	public ListResult<Item> getStockout(Pager pager);
	
	public List<Stock> getItemStockMetrics(String itemUuid);
	
	public LedgerType getLedgerTypeByUuid(String ledgerTypeUuid);
	
	public Ledger getLedgerByUuid(String ledgerUuid);
	
	public Issue getIssueByUuid(String issueUuid);
	
	ListResult<Item> getStockoutByLocation(String locationUuid, Pager pager, String q, String conceptClassName);
	
	Stock saveStock(Stock stock);
	
	Transaction saveTransaction(Transaction transaction);
	
	List<Transaction> getTransactionsByLocationUuid(String uuid);
	
	public Map<String, Object> getLocationStockMetrics(String locationUuid);
	
	List<Stock> getStockByItemAndLocations(String itemUuid, List<String> locationUuids);
	
	List<Stock> getStockByDrugAndLocation(String drugUuid, String locationUuid);
	
	List<Stock> getDrugStockMetrics(String drugUuid);
	
	OrderStatus dispense(String drugOrderUuid, String locationUuid, String remarks);
	
	OrderStatus dispenseNonDrug(Order order, Double quantity, String locationUuid, String remarks);
	
	List<OrderStatus> getOrderStatus(String visitUuid);
	
	OrderStatus dispenseDrug(String drugOrderUuid, String drugUuid, Integer quantity, String location, String remarks);
	
	OrderStatus setDrugOrderStatus(String orderUuid, String status, String remarks);
	
	StockInvoice saveStockInvoice(StockInvoice stockInvoice) throws Exception;
	
	public Supplier getSupplierByUuid(String supplierUuid);
	
	ListResult<StockInvoice> getStockInvoices(Pager pager, StockInvoiceStatus.Type status, String q, Date start, Date end);
	
	Supplier saveSupplier(Supplier supplier) throws Exception;
	
	List<Supplier> getSuppliers(Integer startIndex, Integer limit);
	
	StockInvoiceStatus saveStockInvoiceStatus(StockInvoiceStatus stockInvoiceStatus) throws Exception;
	
	List<StockInvoiceStatus> getStockInvoicesStatus(Integer startIndex, Integer limit, String q);
	
	StockInvoice updateStockInvoice(StockInvoice stockInvoice) throws Exception;
	
	StockInvoice getStockInvoice(String stockInvoiceUuid);
	
	StockInvoiceItem updateStockInvoiceItem(StockInvoiceItem stockInvoiceItem) throws Exception;
	
	ListResult getStockInvoiceItems(Pager pager, String stockInvoice, Date startDate, Date endDate, String provider,
	        String paymentScheme) throws Exception;
	
	StockInvoiceItem getStockInvoiceItemByUuid(String stockInvoiceItemUuid);
	
	StockInvoiceItem saveStockInvoiceItem(StockInvoiceItem stockInvoiceItem) throws Exception;
	
	StockInvoiceItemStatus saveStockInvoiceItemStatus(StockInvoiceItemStatus stockInvoiceItemStatus);
	
	Supplier updateSupplier(Supplier supplier) throws Exception;
	
	Requisition updateRequisition(Requisition requisition) throws Exception;
	
	RequisitionItem saveRequisitionItem(RequisitionItem requisitionItem) throws Exception;
	
	RequisitionItemStatus saveRequisitionItemStatus(RequisitionItemStatus requisitionItemStatus);
	
	RequisitionItem updateRequisitionItem(RequisitionItem requisitionItem) throws Exception;
	
	public IssueItem getIssueItemByUuid(String IssueItemUuid);
	
	ListResult<Item> getNearlyStockedOutByLocation(String locationUuid, Pager pager, String q);
	
	ListResult<Item> getNearlyExpiredByLocation(String locationUuid, Pager pager, String q);
	
	ListResult<Item> getExpiredItemsByLocation(String locationUuid, Pager pager, String q);
	
	ReorderLevel updateReorderLevel(ReorderLevel reorderLevel);
	
	Boolean isPendingRequisition(String itemUuid, String locationUuid);
	
	Requisition deleteRequisition(String requisitionUuid);
	
	RequisitionItem deleteRequisitionItem(String requestItemUuid);
	
	RequisitionStatus deleteRequisitionStatus(String requestStatusUuid);
	
	RequisitionItemStatus deleteRequisitionItemStatus(String requestItemStatusUuid);
	
	RequisitionItem getRequisitionItem(String requestItemUuid);
	
	StockInvoice deleteStockInvoice(String stockInvoiceUuid);
	
	StockInvoiceStatus deleteStockInvoiceStatus(String stockInvoiceStatusUuid);
	
	StockInvoiceItem deleteStockInvoiceItem(String stockInvoiceItemUuid);
	
	StockInvoiceItemStatus deleteStockInvoiceItemStatus(String stockInvoiceItemStatusUuid);
	
	EncounterPatientProgram saveEncounterPatientProgram(EncounterPatientProgram encounterPatientProgram);
	
	EncounterPatientState saveEncounterPatientState(EncounterPatientState encounterPatientState);
}
