package org.openmrs.module.icare.store.services;

import org.apache.commons.collections.IteratorUtils;
import org.openmrs.*;
import org.openmrs.api.*;
import org.openmrs.api.context.Context;
import org.openmrs.api.impl.BaseOpenmrsService;
import org.openmrs.module.icare.ICareConfig;
import org.openmrs.module.icare.billing.models.Prescription;
import org.openmrs.module.icare.core.ICareService;
import org.openmrs.module.icare.core.Item;
import org.openmrs.module.icare.core.ListResult;
import org.openmrs.module.icare.core.Pager;
import org.openmrs.module.icare.core.dao.ICareDao;
import org.openmrs.module.icare.core.models.EncounterPatientProgram;
import org.openmrs.module.icare.core.models.EncounterPatientState;
import org.openmrs.module.icare.store.dao.*;
import org.openmrs.module.icare.store.models.*;
import org.openmrs.module.icare.store.util.StockOutException;
import org.openmrs.module.icare.store.util.TransactionUtil;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

public class StoreServiceImpl extends BaseOpenmrsService implements StoreService {
	
	ICareDao dao;
	
	LedgerDAO ledgerDAO;
	
	RequisitionDAO requisitionDAO;
	
	RequisitionItemDAO requisitionItemDAO;
	
	IssueDAO issueDAO;
	
	ReceiptDAO receiptDAO;
	
	StockDAO stockDAO;
	
	LedgerTypeDAO ledgerTypeDAO;
	
	RequisitionStatusDAO requisitionStatusDAO;
	
	IssueStatusDAO issueStatusDAO;
	
	TransactionDAO transactionDAO;
	
	ReorderLevelDAO reorderLevelDAO;
	
	StockInvoiceDAO stockInvoiceDAO;
	
	SupplierDAO supplierDAO;
	
	EncounterPatientProgramDAO encounterPatientProgramDAO;
	
	EncounterPatientStateDAO encounterPatientStateDAO;
	
	StockInvoiceStatusDAO stockInvoiceStatusDAO;
	
	StockInvoiceItemDAO stockInvoiceItemDAO;
	
	StockInvoiceItemStatusDAO stockInvoiceItemStatusDAO;
	
	RequisitionItemStatusDAO requisitionItemStatusDAO;
	
	IssueItemStatusDAO issueItemStatusDAO;
	
	IssueItemDAO issueItemDAO;
	
	public void setLedgerDAO(LedgerDAO ledgerDAO) {
		this.ledgerDAO = ledgerDAO;
	}
	
	public void setRequisitionDAO(RequisitionDAO requisitionDAO) {
		this.requisitionDAO = requisitionDAO;
	}
	
	public void setIssueDAO(IssueDAO issueDAO) {
		this.issueDAO = issueDAO;
	}
	
	public void setReceiptDAO(ReceiptDAO receiptDAO) {
		this.receiptDAO = receiptDAO;
	}
	
	public void setStockDAO(StockDAO stockDAO) {
		this.stockDAO = stockDAO;
	}
	
	public void setLedgerTypeDAO(LedgerTypeDAO ledgerTypeDAO) {
		this.ledgerTypeDAO = ledgerTypeDAO;
	}
	
	public void setEncounterPatientStateDAO(EncounterPatientStateDAO encounterPatientStateDAO) {
		this.encounterPatientStateDAO = encounterPatientStateDAO;
	}
	
	public void setEncounterPatientProgramDAO(EncounterPatientProgramDAO encounterPatientProgramDAO) {
		this.encounterPatientProgramDAO = encounterPatientProgramDAO;
	}
	
	public void setDao(ICareDao dao) {
		this.dao = dao;
	}
	
	public void setRequisitionStatusDAO(RequisitionStatusDAO requisitionStatusDAO) {
		this.requisitionStatusDAO = requisitionStatusDAO;
	}
	
	public void setIssueStatusDAO(IssueStatusDAO issueStatusDAO) {
		this.issueStatusDAO = issueStatusDAO;
	}
	
	public void setTransactionDAO(TransactionDAO transactionDAO) {
		this.transactionDAO = transactionDAO;
	}
	
	public void setReorderLevelDAO(ReorderLevelDAO reorderLevelDAO) {
		this.reorderLevelDAO = reorderLevelDAO;
	}
	
	public void setStockInvoiceDAO(StockInvoiceDAO stockInvoiceDAO) {
		this.stockInvoiceDAO = stockInvoiceDAO;
	}
	
	public void setSupplierDAO(SupplierDAO supplierDAO) {
		this.supplierDAO = supplierDAO;
	}
	
	public void setStockInvoiceStatusDAO(StockInvoiceStatusDAO stockInvoiceStatusDAO) {
		this.stockInvoiceStatusDAO = stockInvoiceStatusDAO;
	}
	
	public void setStockInvoiceItemDAO(StockInvoiceItemDAO stockInvoiceItemDAO) {
		this.stockInvoiceItemDAO = stockInvoiceItemDAO;
	}
	
	public void setStockInvoiceItemStatusDAO(StockInvoiceItemStatusDAO stockInvoiceItemStatusDAO) {
		this.stockInvoiceItemStatusDAO = stockInvoiceItemStatusDAO;
	}
	
	public void setRequisitionItemDAO(RequisitionItemDAO requisitionItemDAO) {
		this.requisitionItemDAO = requisitionItemDAO;
	}
	
	public void setRequisitionItemStatusDAO(RequisitionItemStatusDAO requisitionItemStatusDAO) {
		this.requisitionItemStatusDAO = requisitionItemStatusDAO;
	}
	
	public void setIssueItemStatusDAO(IssueItemStatusDAO issueItemStatusDAO) {
		this.issueItemStatusDAO = issueItemStatusDAO;
	}
	
	public void setIssueItemDAO(IssueItemDAO issueItemDAO) {
		this.issueItemDAO = issueItemDAO;
	}
	
	@Override
	public ReorderLevel addReorderLevel(ReorderLevel reorderLevel) {
		
		reorderLevel.setItem(this.dao.findByUuid(reorderLevel.getItem().getUuid()));
		
		reorderLevel.setLocation(Context.getLocationService().getLocationByUuid(reorderLevel.getLocation().getUuid()));
		
		return this.reorderLevelDAO.save(reorderLevel);
	}
	
	@Override
	public List<ReorderLevel> getAllReorderLevels() {
		
		return IteratorUtils.toList(this.reorderLevelDAO.findAll().iterator());
	}
	
	@Override
	public LedgerType addLedgerType(LedgerType ledgerType) {
		return this.ledgerTypeDAO.save(ledgerType);
	}
	
	@Override
	public List<LedgerType> getLedgerTypes() {
		return IteratorUtils.toList(this.ledgerTypeDAO.findAll().iterator());
	}
	
	@Override
	public List<Ledger> listLedgerEntries() {
		
		return IteratorUtils.toList(this.ledgerDAO.findAll().iterator());
		
	}
	
	@Override
	public Ledger saveLedger(Ledger ledger) throws StockOutException {
		
		Ledger ledgerToSave = ledger;
		
		if (ledger.getLedgerType() != null) {
			ledgerToSave.setLedgerType(this.ledgerTypeDAO.findByUuid(ledger.getLedgerType().getUuid()));
		}
		ledgerToSave.setRemarks(ledger.getRemarks());
		ledgerToSave.setExpiryDate(ledger.getExpiryDate());
		ledgerToSave.setBatchNo(ledger.getBatchNo());
		if (ledger.getSourceLocation() != null) {
			ledgerToSave.setSourceLocation(ledger.getSourceLocation());
		}
		if (ledger.getItem() != null) {
			ledgerToSave.setItem(this.dao.findByUuid(ledger.getItem().getUuid()));
		}
		TransactionUtil.operateOnStock(ledger.getLedgerType().getOperation(), ledger);
		return this.ledgerDAO.save(ledger);
		
	}
	
	@Override
	public Stock getStockByItemBatchLocation(Item item, String batchNo, Date expiryDate, Location location) {
		return this.stockDAO.getStockByItemBatchExpDateLocation(item.getUuid(), batchNo, expiryDate, location.getUuid());
	}
	
	@Override
	public List<Stock> getStockByItemLocation(Item item, Location location) {
		return this.stockDAO.getStockByItemLocation(item.getUuid(), location.getUuid());
	}
	
	@Override
	public Requisition saveRequest(Requisition requisition) {
		
		Requisition savedRequisition = this.requisitionDAO.save(requisition);
		
		if (requisition.getRequisitionStatuses() != null) {
			for (RequisitionStatus requisitionStatus : requisition.getRequisitionStatuses()) {
				requisitionStatus.setStatus(requisition.getRequisitionStatuses().get(0).getStatus());
				requisitionStatus.setRemarks(requisition.getRequisitionStatuses().get(0).getStatus().toString());
				requisitionStatus.setRequisition(savedRequisition);
				this.requisitionStatusDAO.save(requisitionStatus);
			}
		}
		
		return savedRequisition;
	}
	
	@Override
	public RequisitionStatus saveRequestStatus(RequisitionStatus requisitionStatus) {
		
		Requisition requisition = this.getRequestByUuid(requisitionStatus.getRequisition().getUuid());
		
		requisitionStatus.setRequisition(requisition);
		
		return this.requisitionStatusDAO.save(requisitionStatus);
		
	}
	
	@Override
	public List<RequisitionStatus> getRequisitionStatuses() {
		return IteratorUtils.toList(this.requisitionStatusDAO.findAll().iterator());
	}
	
	@Override
	public ListResult<Requisition> getRequestsByRequestingLocation(String requestingLocationUuid, Pager pager,
	        RequisitionStatus.RequisitionStatusCode status, Requisition.OrderByDirection orderByDirection, String q,
	        Date startDate, Date endDate) {
		
		ListResult<Requisition> requisitions = this.requisitionDAO.getRequisitionsByRequestingLocation(
		    requestingLocationUuid, pager, status, orderByDirection, q, startDate, endDate);
		
		for (Requisition requisition : requisitions.getResults()) {
			List<RequisitionStatus> requisitionStatuses = this.requisitionStatusDAO.getStatusesByRequisition(requisition
			        .getUuid());
			
			requisition.setRequisitionStatuses(requisitionStatuses);
		}
		
		return requisitions;
		
	}
	
	@Override
	public ListResult<Requisition> getRequestsForRequestedLocation(String requestedLocationUuid, Pager pager,
	        RequisitionStatus.RequisitionStatusCode status, Requisition.OrderByDirection orderByDirection, String q,
	        Date startDate, Date endDate) {
		
		ListResult<Requisition> requisitions = this.requisitionDAO.getRequisitionsByRequestedLocation(requestedLocationUuid,
		    pager, status, orderByDirection, q, startDate, endDate);
		
		for (Requisition requisition : requisitions.getResults()) {
			List<RequisitionStatus> requisitionStatuses = this.requisitionStatusDAO.getStatusesByRequisition(requisition
			        .getUuid());
			
			requisition.setRequisitionStatuses(requisitionStatuses);
		}
		
		return requisitions;
		
	}
	
	@Override
	public Requisition getRequestByUuid(String requisitionUuid) {
		
		Requisition requisition = this.requisitionDAO.findByUuid(requisitionUuid);
		
		List<RequisitionStatus> requisitionStatuses = this.requisitionStatusDAO.getStatusesByRequisition(requisition
		        .getUuid());
		
		requisition.setRequisitionStatuses(requisitionStatuses);
		
		return requisition;
	}
	
	@Override
	public Issue saveIssue(Issue issue) throws StockOutException {
		
		for (IssueItem issueItem : issue.getIssueItems()) {
			TransactionUtil.operateOnStock("-", issueItem);
		}
		Issue newIssue = this.issueDAO.save(issue);
		IssueStatus issueStatus = new IssueStatus();
		issueStatus.setIssue(newIssue);
		issueStatus.setRemarks("Items have been issued");
		issueStatus.setStatus(IssueStatus.IssueStatusCode.ISSUED);
		this.saveIssueStatus(issueStatus);
		if (newIssue != null) {
			for (IssueItem issueItem : newIssue.getIssueItems()) {
				IssueItemStatus issueItemStatus = new IssueItemStatus();
				issueItemStatus.setStatus(IssueItemStatus.IssueItemStatusCode.ISSUED.toString());
				issueItemStatus.setRemarks("Item has been issued");
				issueItemStatus.setIssueItem(issueItem);
				this.saveIssueItemStatus(issueItemStatus);
			}
		}
		if (newIssue.getRequisition() != null) {
			RequisitionStatus requisitionStatus = new RequisitionStatus();
			requisitionStatus.setRemarks("Items have been issued");
			requisitionStatus.setRequisition(newIssue.getRequisition());
			requisitionStatus.setStatus(RequisitionStatus.RequisitionStatusCode.ISSUED);
			this.saveRequestStatus(requisitionStatus);
		}
		return newIssue;
		
	}
	
	@Override
	public IssueStatus saveIssueStatus(IssueStatus issueStatus) {
		
		return this.issueStatusDAO.save(issueStatus);
		
	}
	
	@Override
	public IssueItemStatus saveIssueItemStatus(IssueItemStatus issueItemStatus) {
		return this.issueItemStatusDAO.save(issueItemStatus);
	}
	
	@Override
	public List<Issue> getIssuesByIssueingLocation(String issueingLocationUuid) {
		
		List<Issue> issues = this.issueDAO.getIssuesByIssueingLocation(issueingLocationUuid);
		
		for (Issue issue : issues) {
			
			List<IssueStatus> issueStatuses = this.issueStatusDAO.getAllByIssue(issue.getUuid());
			
			issue.setIssueStatuses(issueStatuses);
		}
		
		return issues;
		
	}
	
	@Override
	public List<Issue> getIssuesForIssuedLocation(String issuedLocationUuid) {
		
		List<Issue> issues = this.issueDAO.getIssuesByIssuedLocation(issuedLocationUuid);
		for (Issue issue : issues) {
			
			List<IssueStatus> issueStatuses = this.issueStatusDAO.getAllByIssue(issue.getUuid());
			
			issue.setIssueStatuses(issueStatuses);
		}
		
		return issues;
	}
	
	@Override
	public List<IssueStatus> getIssueStatuses() {
		return IteratorUtils.toList(this.issueStatusDAO.findAll().iterator());
	}
	
	@Override
	public Receipt saveReceive(Receipt receipt) throws StockOutException {
		
		if (receipt.getIssue() != null) {
			receipt.setIssue(this.issueDAO.findByUuid(receipt.getIssue().getUuid()));
		}
		for (ReceiptItem receiptItem : receipt.getReceiptItems()) {
			TransactionUtil.operateOnStock("+", receiptItem);
		}
		Receipt newReceipt = this.receiptDAO.save(receipt);
		if (receipt.getIssue() != null) {
			IssueStatus issueStatus = new IssueStatus();
			issueStatus.setIssue(receipt.getIssue());
			issueStatus.setRemarks("Items have been received");
			issueStatus.setStatus(IssueStatus.IssueStatusCode.RECEIVED);
			this.saveIssueStatus(issueStatus);
			
			for (IssueItem issueItem : receipt.getIssue().getIssueItems()) {
				IssueItemStatus issueItemStatus = new IssueItemStatus();
				issueItemStatus.setStatus(IssueItemStatus.IssueItemStatusCode.RECEIVED.toString());
				issueItemStatus.setRemarks("Item has been received");
				issueItemStatus.setIssueItem(issueItem);
				this.saveIssueItemStatus(issueItemStatus);
			}
			
			if (receipt.getIssue().getRequisition() != null) {
				RequisitionStatus requisitionStatus = new RequisitionStatus();
				requisitionStatus.setRemarks("Items have been received");
				requisitionStatus.setRequisition(receipt.getIssue().getRequisition());
				requisitionStatus.setStatus(RequisitionStatus.RequisitionStatusCode.RECEIVED);
				this.saveRequestStatus(requisitionStatus);
			}
		}
		return newReceipt;
	}
	
	@Override
	public List<Receipt> getReceiptsByIssueingLocation(String issueingLocationUuid) {
		
		return this.receiptDAO.getReceiptsByIssueingLocation(issueingLocationUuid);
		
	}
	
	@Override
	public List<Receipt> getReceiptsForReceivingLocation(String receivingLocationUuid) {
		
		return this.receiptDAO.getReceiptsByReceivingLocation(receivingLocationUuid);
		
	}
	
	@Override
	public List<Stock> getAllStockStatusMetrics() {
		return IteratorUtils.toList(this.stockDAO.findAll().iterator());
	}
	
	@Override
	public ListResult<Stock> getAllStock(Pager pager) {
		return this.stockDAO.getStockByLocation(null, pager, null, null, null, null);
	}
	
	@Override
	public ListResult<Stock> getStockByLocation(String locationUuid, Pager pager, String search, Integer startIndex,
	        Integer limit, String conceptClassName) {
		
		return this.stockDAO.getStockByLocation(locationUuid, pager, search, startIndex, limit, conceptClassName);
	}
	
	@Override
	public ListResult<Item> getStockout(Pager pager) {
		return this.stockDAO.getStockedOut(pager);
	}
	
	@Override
	public List<Stock> getItemStockMetrics(String itemUuid) {
		return this.stockDAO.getStockByItemId(itemUuid);
	}
	
	@Override
	public List<Stock> getDrugStockMetrics(String drugUuid) {
		return this.stockDAO.getStockByDrugId(drugUuid);
	}
	
	@Override
	public OrderStatus dispense(String drugUuid, String locationUuid, String remarks) {
		OrderService orderService = Context.getOrderService();
		List<OrderStatus> orderStatuses = this.stockDAO.getOrderStatusByOrderUuid(drugUuid);
		for (OrderStatus orderStatus : orderStatuses) {
			if (orderStatus.getStatus() == OrderStatus.OrderStatusCode.DISPENSED) {
				throw new OrderEntryException("Order is already dispensed");
			}
		}
		Prescription savedOrder = (Prescription) orderService.getOrderByUuid(drugUuid);
		
		//Item item = orderMetaData.getItemPrice().getItem();
		ICareService iCareService = Context.getService(ICareService.class);
		Item item = iCareService.getItemByDrugUuid(savedOrder.getDrug().getUuid());
		
		List<Stock> stockList = this.getStockByItemAndLocation(item.getUuid(), locationUuid);
		AdministrationService administrationService = Context.getAdministrationService();
		String stockEnabled = administrationService.getGlobalProperty(ICareConfig.STOCK_ENABLE);
		
		if (!(stockEnabled != null && stockEnabled.equals("false"))) {
			
			if (stockList.get(0).getQuantity() < savedOrder.getQuantity()) {
				throw new StockOutException(item.getDisplayString() + " is stocked out.");
			}
			Double totalQuantity = savedOrder.getQuantity();
			for (Stock stock : stockList) {
				if (totalQuantity == 0.0) {
					break;
				}
				Double quantityToDeduct;
				if (totalQuantity > stock.getQuantity()) {
					quantityToDeduct = stock.getQuantity();
				} else {
					quantityToDeduct = totalQuantity;
				}
				StockableItem stockableItem = new StockableItem();
				stockableItem.setBatch(stock.getBatch());
				stockableItem.setExpiryDate(stock.getExpiryDate());
				stockableItem.setItem(item);
				stockableItem.setLocation(Context.getLocationService().getLocationByUuid(locationUuid));
				stockableItem.setSourceLocation(Context.getLocationService().getLocationByUuid(locationUuid));
				stockableItem.setQuantity(quantityToDeduct);
				TransactionUtil.deductStock(stockableItem);
				totalQuantity -= quantityToDeduct;
			}
		}
		OrderStatus orderStatus = new OrderStatus();
		orderStatus.setOrder(savedOrder);
		orderStatus.setStatus(OrderStatus.OrderStatusCode.DISPENSED);
		orderStatus.setRemarks(remarks);
		
		return this.stockDAO.saveOrderStatus(orderStatus);
	}
	
	@Override
	public OrderStatus dispenseDrug(String drugOrderUuid, String drugUuid, Integer quantity, String locationUuid,
	        String remarks) {
		OrderService orderService = Context.getOrderService();
		List<OrderStatus> orderStatuses = this.stockDAO.getOrderStatusByOrderUuid(drugOrderUuid);
		for (OrderStatus orderStatus : orderStatuses) {
			if (orderStatus.getStatus() == OrderStatus.OrderStatusCode.DISPENSED) {
				throw new OrderEntryException("Order is already dispensed");
			}
		}
		Order savedOrder = orderService.getOrderByUuid(drugOrderUuid);
		ICareService iCareService = Context.getService(ICareService.class);
		Item item = iCareService.getItemByDrugUuid(drugUuid);
		
		List<Stock> stockList = this.getStockByItemAndLocation(item.getUuid(), locationUuid);
		AdministrationService administrationService = Context.getAdministrationService();
		String stockEnabled = administrationService.getGlobalProperty(ICareConfig.STOCK_ENABLE);
		if (!(stockEnabled != null && stockEnabled.equals("false"))) {
			Double totalQuantity = new Double(quantity);
			for (Stock stock : stockList) {
				if (totalQuantity == 0.0) {
					break;
				}
				Double quantityToDeduct;
				if (totalQuantity > stock.getQuantity()) {
					quantityToDeduct = stock.getQuantity();
				} else {
					quantityToDeduct = totalQuantity;
				}
				StockableItem stockableItem = new StockableItem();
				stockableItem.setBatch(stock.getBatch());
				stockableItem.setExpiryDate(stock.getExpiryDate());
				stockableItem.setItem(item);
				stockableItem.setLocation(Context.getLocationService().getLocationByUuid(locationUuid));
				stockableItem.setSourceLocation(Context.getLocationService().getLocationByUuid(locationUuid));
				stockableItem.setQuantity(quantityToDeduct);
				stockableItem.setOrder(savedOrder);
				TransactionUtil.deductStock(stockableItem);
				totalQuantity -= quantityToDeduct;
			}
		}
		
		OrderStatus orderStatus = new OrderStatus();
		orderStatus.setOrder(savedOrder);
		orderStatus.setStatus(OrderStatus.OrderStatusCode.DISPENSED);
		orderStatus.setRemarks(remarks);
		return this.stockDAO.saveOrderStatus(orderStatus);
	}
	
	@Override
	public OrderStatus dispenseNonDrug(Order order, Double quantity, String locationUuid, String remarks) {
		OrderService orderService = Context.getOrderService();
		List<OrderStatus> orderStatuses = this.stockDAO.getOrderStatusByOrderUuid(order.getUuid());
		for (OrderStatus orderStatus : orderStatuses) {
			if (orderStatus.getStatus() == OrderStatus.OrderStatusCode.DISPENSED) {
				throw new OrderEntryException("Order is already dispensed");
			}
		}
		ICareService iCareService = Context.getService(ICareService.class);
		Item item = iCareService.getItemByConceptUuid(order.getConcept().getUuid());
		
		List<Stock> stockList = this.getStockByItemAndLocation(item.getUuid(), locationUuid);
		AdministrationService administrationService = Context.getAdministrationService();
		String stockEnabled = administrationService.getGlobalProperty(ICareConfig.STOCK_ENABLE);
		if (!(stockEnabled != null && stockEnabled.equals("false"))) {
			Double totalQuantity = new Double(quantity);
			for (Stock stock : stockList) {
				if (totalQuantity == 0.0) {
					break;
				}
				Double quantityToDeduct;
				if (totalQuantity > stock.getQuantity()) {
					quantityToDeduct = stock.getQuantity();
				} else {
					quantityToDeduct = totalQuantity;
				}
				StockableItem stockableItem = new StockableItem();
				stockableItem.setBatch(stock.getBatch());
				stockableItem.setExpiryDate(stock.getExpiryDate());
				stockableItem.setItem(item);
				stockableItem.setLocation(Context.getLocationService().getLocationByUuid(locationUuid));
				stockableItem.setSourceLocation(Context.getLocationService().getLocationByUuid(locationUuid));
				stockableItem.setQuantity(quantityToDeduct);
				stockableItem.setOrder(order);
				TransactionUtil.deductStock(stockableItem);
				totalQuantity -= quantityToDeduct;
			}
		}
		
		OrderStatus orderStatus = new OrderStatus();
		orderStatus.setOrder(order);
		orderStatus.setStatus(OrderStatus.OrderStatusCode.DISPENSED);
		orderStatus.setRemarks(remarks);
		return this.stockDAO.saveOrderStatus(orderStatus);
	}
	
	@Override
	public OrderStatus setDrugOrderStatus(String drugUuid, String status, String remarks) {
		OrderService orderService = Context.getOrderService();
		List<OrderStatus> orderStatuses = this.stockDAO.getOrderStatusByOrderUuid(drugUuid);
		for (OrderStatus orderStatus : orderStatuses) {
			if (orderStatus.getStatus().toString().equals(status)) {
				throw new OrderEntryException("Order is already set the status: " + status);
			}
		}
		Order savedOrder = orderService.getOrderByUuid(drugUuid);
		
		OrderStatus orderStatus = new OrderStatus();
		
		orderStatus.setOrder(savedOrder);
		
		if (status.equals(OrderStatus.OrderStatusCode.EMPTY.toString())) {
			orderStatus.setStatus(OrderStatus.OrderStatusCode.EMPTY);
		}
		if (status.equals(OrderStatus.OrderStatusCode.CANCELLED.toString())) {
			orderStatus.setStatus(OrderStatus.OrderStatusCode.CANCELLED);
		}
		if (status.equals(OrderStatus.OrderStatusCode.ISSUED.toString())) {
			orderStatus.setStatus(OrderStatus.OrderStatusCode.ISSUED);
		}
		if (status.equals(OrderStatus.OrderStatusCode.REJECTED.toString())) {
			orderStatus.setStatus(OrderStatus.OrderStatusCode.REJECTED);
		}
		if (status.equals(OrderStatus.OrderStatusCode.DISPENSED.toString())) {
			orderStatus.setStatus(OrderStatus.OrderStatusCode.DISPENSED);
		}
		orderStatus.setRemarks(remarks);
		return this.stockDAO.saveOrderStatus(orderStatus);
	}
	
	public Supplier getSupplierByUuid(String supplierUuid) {
		return supplierDAO.findByUuid(supplierUuid);
	}
	
	@Override
	public ListResult<StockInvoice> getStockInvoices(Pager pager, StockInvoiceStatus.Type status, String q, Date startDate,
	        Date endDate) {
		
		ListResult<StockInvoice> stockInvoices = stockInvoiceDAO.getStockInvoices(pager, status, q, startDate, endDate);
		for (StockInvoice stockInvoice : stockInvoices.getResults()) {
			Double totalAmount = stockInvoiceDAO.getTotalStockItemsAmountByStockInvoice(stockInvoice);
			stockInvoice.setTotalAmount(totalAmount);
		}
		return stockInvoices;
	}
	
	@Override
	public Supplier saveSupplier(Supplier supplier) throws Exception {
		
		if (supplier.getLocation() != null) {
			Location location = Context.getLocationService().getLocationByUuid(supplier.getLocation().getUuid());
			if (location == null) {
				throw new Exception("Location with uuid " + supplier.getLocation().getUuid() + " does not exist");
			}
			supplier.setLocation(location);
		}
		return supplierDAO.save(supplier);
	}
	
	@Override
	public List<Supplier> getSuppliers(Integer startIndex, Integer limit) {
		return supplierDAO.getSuppliers(startIndex, limit);
	}
	
	public StockInvoice getStockInvoicebyUuid(String stockInvoiceUuid) {
		return stockInvoiceDAO.findByUuid(stockInvoiceUuid);
	}
	
	@Override
	public StockInvoiceStatus saveStockInvoiceStatus(StockInvoiceStatus stockInvoiceStatus) throws Exception {
		StockInvoice stockInvoice = this.getStockInvoicebyUuid(stockInvoiceStatus.getStockInvoice().getUuid());
		if (stockInvoice == null) {
			throw new Exception(" The stock invoice with uuid " + stockInvoiceStatus.getStockInvoice().getUuid()
			        + " does not exist");
		}
		stockInvoiceStatus.setStockInvoice(stockInvoice);
		return stockInvoiceStatusDAO.save(stockInvoiceStatus);
	}
	
	@Override
	public List<StockInvoiceStatus> getStockInvoicesStatus(Integer startIndex, Integer limit, String q) {
		return stockInvoiceStatusDAO.getStockInvoicesStatus(startIndex, limit, q);
	}
	
	@Override
	public StockInvoice updateStockInvoice(StockInvoice stockInvoice) throws Exception {
		
		if (stockInvoice.getSupplier() != null) {
			Supplier supplier = this.getSupplierByUuid(stockInvoice.getSupplier().getUuid());
			if (supplier == null) {
				throw new Exception("The supplier with uuid " + stockInvoice.getSupplier().getUuid() + " does not exist");
			}
			stockInvoice.setSupplier(supplier);
		}
		StockInvoice existingStockInvoice = new StockInvoice();
		if (stockInvoice.getInvoiceNumber() != null || stockInvoice.getSupplier() != null) {
			existingStockInvoice = this.stockInvoiceDAO.updateStockInvoice(stockInvoice);
		}
		if (stockInvoice.getStockInvoiceItems() != null) {
			existingStockInvoice = this.stockInvoiceDAO.findByUuid(stockInvoice.getUuid());
			for (StockInvoiceItem stockInvoiceItem : stockInvoice.getStockInvoiceItems()) {
				stockInvoiceItem.setStockInvoice(existingStockInvoice);
				this.saveStockInvoiceItem(stockInvoiceItem);
			}
			List<StockInvoiceItem> savedStockInvoiceItems = stockInvoice.getStockInvoiceItems();
			existingStockInvoice.setStockInvoiceItems(savedStockInvoiceItems);
		}
		if (stockInvoice.getStockInvoiceStatuses() != null) {
			for (StockInvoiceStatus stockInvoiceStatus : stockInvoice.getStockInvoiceStatuses()) {
				//TODO Limit status to check the ones available in enums
				existingStockInvoice = this.stockInvoiceDAO.findByUuid(stockInvoice.getUuid());
				stockInvoiceStatus.setRemarks(stockInvoiceStatus.getStatus());
				stockInvoiceStatus.setStockInvoice(existingStockInvoice);
				this.saveStockInvoiceStatus(stockInvoiceStatus);
				
								if (stockInvoiceStatus.status.equals(StockInvoiceItemStatus.Type.RECEIVED.toString())) {
									List<StockInvoiceItem> stockInvoiceItemsList = this.stockInvoiceItemDAO.getStockInvoiceItemByInvoice(existingStockInvoice);
									for(StockInvoiceItem stockInvoiceItem : stockInvoiceItemsList){
										boolean isStatusReceieved = false;
										for(StockInvoiceItemStatus stockInvoiceItemStatus : stockInvoiceItem.getStockInvoiceItemStatuses()){
											if(stockInvoiceItemStatus.getStatus().equals(StockInvoiceItemStatus.Type.RECEIVED.toString())){
												isStatusReceieved = true;
											}

										}
										if(isStatusReceieved == false){
											List<StockInvoiceItemStatus> stockInvoiceItemStatusList = new ArrayList<>();
											StockInvoiceItemStatus stockInvoiceItemStatus = new StockInvoiceItemStatus();
											stockInvoiceItemStatus.setStatus(StockInvoiceItemStatus.Type.RECEIVED.toString());
											stockInvoiceItemStatus.setRemarks(StockInvoiceItemStatus.Type.RECEIVED.toString());
											stockInvoiceItemStatusList.add(stockInvoiceItemStatus);
											stockInvoiceItem.setStockInvoiceItemStatuses(stockInvoiceItemStatusList);
											this.updateStockInvoiceItem(stockInvoiceItem);
										}
									}
								}
				
			}
		}
		return existingStockInvoice;
	}
	
	@Override
	public StockInvoice getStockInvoice(String stockInvoiceUuid) {
		return stockInvoiceDAO.findByUuid(stockInvoiceUuid);
	}
	
	@Override
	public StockInvoiceItem updateStockInvoiceItem(StockInvoiceItem stockInvoiceItem) throws Exception {
		if (stockInvoiceItem.getItem() != null) {
			ICareService iCareService = Context.getService(ICareService.class);
			Item item = iCareService.getItemByUuid(stockInvoiceItem.getItem().getUuid());
			if (item == null) {
				throw new Exception("The item with uuid " + stockInvoiceItem.getItem().getUuid() + " does not exist");
			}
			stockInvoiceItem.setItem(item);
		}
		
		if (stockInvoiceItem.getLocation() != null) {
			Location location = Context.getLocationService().getLocationByUuid(stockInvoiceItem.getLocation().getUuid());
			if (location == null) {
				throw new Exception("The location with uuid " + stockInvoiceItem.getLocation().getUuid() + " does not exist");
			}
			stockInvoiceItem.setLocation(location);
		}
		// Saving stock invoice status
		if (stockInvoiceItem.getStockInvoiceItemStatuses() != null) {
			for (StockInvoiceItemStatus stockInvoiceItemStatus : stockInvoiceItem.getStockInvoiceItemStatuses()) {
				StockInvoiceItem existingStockInvoiceItem = this.getStockInvoiceItemByUuid(stockInvoiceItem.getUuid());
				stockInvoiceItemStatus.setStockInvoiceItem(existingStockInvoiceItem);
				this.saveStockInvoiceItemStatus(stockInvoiceItemStatus);
				
				if (stockInvoiceItemStatus.status.equals(StockInvoiceItemStatus.Type.RECEIVED.toString())) {
					stockInvoiceItem.setDateCreated(stockInvoiceItem.getStockInvoice().getReceivingDate());
					TransactionUtil.operateOnStock("+", stockInvoiceItem);
				}
			}
		}
		
		return stockInvoiceItemDAO.updateStockInvoiceItem(stockInvoiceItem);
	}
	
	@Override
	public StockInvoiceItem getStockInvoiceItemByUuid(String stockInvoiceItemUuid) {
		return stockInvoiceItemDAO.findByUuid(stockInvoiceItemUuid);
	}
	
	@Override
	public StockInvoiceItem saveStockInvoiceItem(StockInvoiceItem stockInvoiceItem) throws Exception {
		Item item = dao.findByUuid(stockInvoiceItem.getItem().getUuid());
		if (item == null) {
			throw new Exception("The item with uuid" + stockInvoiceItem.getItem().getUuid() + " does not exist");
		}
		
		ConceptService conceptService = Context.getService(ConceptService.class);
		Concept uom = conceptService.getConceptByUuid(stockInvoiceItem.getUom().getUuid());
		if (uom == null) {
			throw new Exception("The unit of measurement with uuid" + stockInvoiceItem.getUom().getUuid()
			        + " does not exist");
		}
		
		Location location = Context.getLocationService().getLocationByUuid(stockInvoiceItem.getLocation().getUuid());
		if (location == null) {
			throw new Exception(" The location with uuid" + stockInvoiceItem.getLocation().getUuid() + " does not exist");
		}
		
		stockInvoiceItem.setItem(item);
		stockInvoiceItem.setUom(uom);
		stockInvoiceItem.setLocation(location);
		
		StockInvoiceItem savedStockInvoiceItem = stockInvoiceItemDAO.save(stockInvoiceItem);
		
		for (StockInvoiceItemStatus stockInvoiceItemStatus : stockInvoiceItem.getStockInvoiceItemStatuses()) {
			stockInvoiceItemStatus.setStockInvoiceItem(savedStockInvoiceItem);
			this.saveStockInvoiceItemStatus(stockInvoiceItemStatus);
		}
		
		return savedStockInvoiceItem;
	}
	
	@Override
	public StockInvoiceItemStatus saveStockInvoiceItemStatus(StockInvoiceItemStatus stockInvoiceItemStatus) {
		return this.stockInvoiceItemStatusDAO.save(stockInvoiceItemStatus);
	}
	
	@Override
	public Supplier updateSupplier(Supplier supplier) throws Exception {
		Supplier existingSupplier = this.supplierDAO.findByUuid(supplier.getUuid());
		if (supplier == null) {
			throw new Exception(" The supplier with uuid " + supplier.getUuid() + " does not exist");
		}
		if (supplier.getLocation() != null) {
			Location location = Context.getLocationService().getLocationByUuid(supplier.getLocation().getUuid());
			if (location == null) {
				throw new Exception("The location with uuid " + supplier.getLocation().getUuid() + " does not exist");
			}
			supplier.setLocation(location);
		}
		return supplierDAO.updateSupplier(supplier);
	}
	
	@Override
	public Requisition updateRequisition(Requisition requisition) throws Exception {
		Requisition existingRequisition = this.requisitionDAO.findByUuid(requisition.getUuid());
		if (existingRequisition == null) {
			throw new Exception(" The requisition with uuid " + requisition.getUuid() + " does not exist");
		}
		if (requisition.getRequisitionStatuses().size() > 0) {
			for (RequisitionStatus requisitionStatus : requisition.getRequisitionStatuses()) {
				requisitionStatus.setRequisition(existingRequisition);
				requisitionStatus.setRemarks(requisitionStatus.getRemarks());
				this.saveRequestStatus(requisitionStatus);
				
				if (requisitionStatus.getStatus().equals(RequisitionStatus.RequisitionStatusCode.PENDING)) {
					List<RequisitionItem> requisitionItems = requisitionItemDAO
					        .getStockRequisitionItemsByRequisition(existingRequisition);
					for (RequisitionItem requisitionItem : requisitionItems) {
						RequisitionItemStatus requisitionItemStatus = new RequisitionItemStatus();
						requisitionItemStatus.setStatus(RequisitionItemStatus.RequisitionItemStatusCode.PENDING.toString());
						requisitionItemStatus.setRemarks(RequisitionItemStatus.RequisitionItemStatusCode.PENDING.toString());
						requisitionItemStatus.setRequisitionItem(requisitionItem);
						this.saveRequisitionItemStatus(requisitionItemStatus);
					}
				}
				
			}
		}
		return this.requisitionDAO.updateRequisition(requisition);
	}
	
	@Override
	public RequisitionItem saveRequisitionItem(RequisitionItem requisitionItem) throws Exception {
		
		Item item = this.dao.findByUuid(requisitionItem.getItem().getUuid());
		if (item == null) {
			throw new Exception(" The item with uuid" + requisitionItem.getItem().getUuid() + " does not exist");
		}
		requisitionItem.setItem(item);
		
		Requisition requisition = this.requisitionDAO.findByUuid(requisitionItem.getRequisition().getUuid());
		if (requisition == null) {
			throw new Exception(" The requisition with uuid " + requisitionItem.getRequisition().getUuid()
			        + " does not exist");
		}
		requisitionItem.setRequisition(requisition);
		
		RequisitionItem saveRequisitionItem = requisitionItemDAO.save(requisitionItem);
		
		if (requisitionItem.getRequisitionItemStatuses().size() > 0) {
			for (RequisitionItemStatus requisitionItemStatus : requisitionItem.getRequisitionItemStatuses()) {
				//requisitionItemStatus.setRequisition(requisitionItem.getRequisition());
				//requisitionItemStatus.setItem(requisitionItem.getItem());
				//requisitionItemStatus.setStatus(requisitionItemStatus.getStatus());
				requisitionItemStatus.setRequisitionItem(saveRequisitionItem);
				requisitionItemStatus.setRemarks(requisitionItemStatus.getStatus().toString());
				this.requisitionItemStatusDAO.save(requisitionItemStatus);
			}
		}
		
		return saveRequisitionItem;
	}
	
	@Override
	public RequisitionItemStatus saveRequisitionItemStatus(RequisitionItemStatus requisitionItemStatus) {
		return requisitionItemStatusDAO.save(requisitionItemStatus);
	}
	
	@Override
	public RequisitionItem updateRequisitionItem(RequisitionItem requisitionItem) throws Exception {
		
		if (requisitionItem.getItem() != null) {
			Item item = dao.findByUuid(requisitionItem.getItem().getUuid());
			if (item == null) {
				throw new Exception("The item with uuid " + requisitionItem.getItem().getUuid() + " does not exist");
			}
			
			requisitionItem.setItem(item);
		}
		
		if (requisitionItem.getRequisition() != null) {
			Requisition requisition = this.requisitionDAO.findByUuid(requisitionItem.getRequisition().getUuid());
			if (requisition == null) {
				throw new Exception(" The requisition with uuid " + requisitionItem.getRequisition().getUuid()
				        + " does not exist");
			}
			requisitionItem.setRequisition(requisition);
		}
		
		if (requisitionItem.getRequisitionItemStatuses().size() > 0) {
			
			for (RequisitionItemStatus requisitionItemStatus : requisitionItem.getRequisitionItemStatuses()) {
				RequisitionItem existingRequisitionItem = this.requisitionItemDAO.findByUuid(requisitionItem.getUuid());
				//requisitionItemStatus.setRequisition(requisitionItem.getRequisition());
				//requisitionItemStatus.setItem(requisitionItem.getItem());
				requisitionItemStatus.setRemarks(requisitionItemStatus.getStatus().toString());
				requisitionItemStatus.setRequisitionItem(existingRequisitionItem);
				this.requisitionItemStatusDAO.save(requisitionItemStatus);
			}
			
		}
		
		return requisitionItemDAO.updateRequisitionItem(requisitionItem);
	}
	
	@Override
	public IssueItem getIssueItemByUuid(String issueItemUuid) {
		return issueItemDAO.findByUuid(issueItemUuid);
	}
	
	@Override
	public ListResult<Item> getNearlyStockedOutByLocation(String locationUuid, Pager pager, String q) {
		
		ListResult<Item> items = stockDAO.getNearlyStockedOut(locationUuid, pager, q);
		
		return items;
	}
	
	@Override
	public ListResult<Item> getNearlyExpiredByLocation(String locationUuid, Pager pager, String q) {
		
		ListResult<Item> items = stockDAO.getNearlyExpiredByLocation(locationUuid, pager, q);
		return items;
	}
	
	@Override
	public ListResult<Item> getExpiredItemsByLocation(String locationUuid, Pager pager, String q) {
		
		ListResult<Item> items = stockDAO.getExpiredItemsByLocation(locationUuid, pager, q);
		return items;
	}
	
	@Override
	public ReorderLevel updateReorderLevel(ReorderLevel reorderLevel) {
		return stockDAO.updateReorderLevel(reorderLevel);
	}
	
	@Override
	public Boolean isPendingRequisition(String itemUuid, String locationUuid) {
		
		Boolean isPendingRequisition = stockDAO.isPendingRequisition(itemUuid, locationUuid);
		
		return isPendingRequisition;
	}
	
	@Override
	public Requisition deleteRequisition(String requisitionUuid) {
		
		Requisition requisitionToDelete = this.getRequestByUuid(requisitionUuid);
		
		if (requisitionToDelete != null) {
			if (requisitionToDelete.getRequisitionItems().size() > 0) {
				
				for (RequisitionItem requisitionItem : requisitionToDelete.getRequisitionItems()) {
					this.deleteRequisitionItem(requisitionItem.getUuid());
				}
			}
			
			if (requisitionToDelete.getRequisitionStatuses().size() > 0) {
				for (RequisitionStatus requisitionStatus : requisitionToDelete.getRequisitionStatuses()) {
					this.deleteRequisitionStatus(requisitionStatus.getUuid());
				}
			}
		}
		
		Requisition requisition = stockDAO.deleteRequisition(requisitionUuid);
		
		return requisition;
	}
	
	@Override
	public RequisitionItem deleteRequisitionItem(String requestItemUuid) {
		
		RequisitionItem requisitionItemToDelete = this.getRequisitionItem(requestItemUuid);
		
		if (requisitionItemToDelete != null) {
			if (requisitionItemToDelete.getRequisitionItemStatuses().size() > 1) {
				for (RequisitionItemStatus requisitionItemStatus : requisitionItemToDelete.getRequisitionItemStatuses()) {
					this.deleteRequisitionItemStatus(requisitionItemStatus.getUuid());
				}
			}
		}
		
		RequisitionItem requisitionItem = stockDAO.deleteRequisitionItem(requestItemUuid);
		
		return requisitionItem;
	}
	
	@Override
	public RequisitionStatus deleteRequisitionStatus(String requestStatusUuid) {
		
		RequisitionStatus requisitionStatus = stockDAO.deleteRequisitionStatus(requestStatusUuid);
		return requisitionStatus;
	}
	
	@Override
	public RequisitionItemStatus deleteRequisitionItemStatus(String requestItemStatusUuid) {
		
		RequisitionItemStatus requisitionItemStatus = stockDAO.deleteRequisitionItemStatus(requestItemStatusUuid);
		return requisitionItemStatus;
	}
	
	@Override
	public RequisitionItem getRequisitionItem(String requestItemUuid) {
		RequisitionItem requisitionItem = stockDAO.getRequisitionItemByUuid(requestItemUuid);
		return requisitionItem;
	}
	
	@Override
	public StockInvoice deleteStockInvoice(String stockInvoiceUuid) {
		StockInvoice stockInvoiceToDelete = this.getStockInvoicebyUuid(stockInvoiceUuid);
		if (stockInvoiceToDelete != null) {
			if (stockInvoiceToDelete.getStockInvoiceItems().size() > 0) {
				for (StockInvoiceItem stockInvoiceItem : stockInvoiceToDelete.getStockInvoiceItems()) {
					this.deleteStockInvoiceItem(stockInvoiceItem.getUuid());
				}
			}
			
			if (stockInvoiceToDelete.getStockInvoiceStatuses().size() > 0) {
				for (StockInvoiceStatus stockInvoiceStatus : stockInvoiceToDelete.getStockInvoiceStatuses()) {
					this.deleteStockInvoiceStatus(stockInvoiceStatus.getUuid());
				}
			}
		}
		return stockDAO.deleteStockInvoice(stockInvoiceUuid);
	}
	
	@Override
	public StockInvoiceStatus deleteStockInvoiceStatus(String stockInvoiceStatusUuid) {
		return stockDAO.deleteStockInvoiceStatus(stockInvoiceStatusUuid);
	}
	
	@Override
	public StockInvoiceItem deleteStockInvoiceItem(String stockInvoiceItemUuid) {
		StockInvoiceItem stockInvoiceItem = this.getStockInvoiceItemByUuid(stockInvoiceItemUuid);
		if (stockInvoiceItem != null) {
			if (stockInvoiceItem.getStockInvoiceItemStatuses().size() > 0) {
				for (StockInvoiceItemStatus stockInvoiceItemStatus : stockInvoiceItem.getStockInvoiceItemStatuses()) {
					this.deleteStockInvoiceItemStatus(stockInvoiceItemStatus.getUuid());
				}
			}
		}
		return stockDAO.deleteStockInvoiceItem(stockInvoiceItemUuid);
	}
	
	@Override
	public StockInvoiceItemStatus deleteStockInvoiceItemStatus(String stockInvoiceItemStatusUuid) {
		return stockDAO.deleteStockInvoiceItemStatus(stockInvoiceItemStatusUuid);
	}
	
	@Override
	public EncounterPatientState saveEncounterPatientState(EncounterPatientState encounterPatientState) {
		return encounterPatientStateDAO.save(encounterPatientState);
	}
	
	@Override
	public EncounterPatientProgram saveEncounterPatientProgram(EncounterPatientProgram encounterPatientProgram) {
		return encounterPatientProgramDAO.save(encounterPatientProgram);
	}
	
	@Override
	public StockInvoice saveStockInvoice(StockInvoice stockInvoice) throws Exception {
		
		Supplier supplier = this.getSupplierByUuid(stockInvoice.getSupplier().getUuid());
		if (supplier == null) {
			throw new Exception("The supplier with uuid " + stockInvoice.getSupplier().getUuid() + " does not exist");
		}
		stockInvoice.setSupplier(supplier);
		StockInvoice savedStockInvoice = this.stockInvoiceDAO.save(stockInvoice);
		
		for (StockInvoiceItem stockInvoiceItem : savedStockInvoice.getStockInvoiceItems()) {
			this.saveStockInvoiceItem(stockInvoiceItem);
		}
		
		for (StockInvoiceStatus stockInvoiceStatus : stockInvoice.getStockInvoiceStatuses()) {
			//TODO Limit status to check the ones available in enums
			
			stockInvoiceStatus.setRemarks(stockInvoiceStatus.getStatus());
			stockInvoiceStatus.setStockInvoice(savedStockInvoice);
			this.saveStockInvoiceStatus(stockInvoiceStatus);
		}
		return savedStockInvoice;
	}
	
	@Override
	public List<OrderStatus> getOrderStatus(String visitUuid) {
		return this.stockDAO.getOrderStatusByVisit(visitUuid);
	}
	
	@Override
	public List<OrderStatus> getOrderStatusByOrderUuid(String orderUuid) {
		return this.stockDAO.getOrderStatusByOrderUuid(orderUuid);
	}
	
	@Override
	public List<Stock> getStockByItemAndLocation(String itemUuid, String locationUuid) {
		return this.stockDAO.getStockByItemAndLocation(itemUuid, locationUuid);
	}
	
	@Override
	public List<Stock> getStockByItemAndLocations(String itemUuid, List<String> locationUuids) {
		return this.stockDAO.getStockByItemAndLocations(itemUuid, locationUuids);
	}
	
	@Override
	public List<Stock> getStockByDrugAndLocation(String itemUuid, String locationUuid) {
		return this.stockDAO.getStockByDrugAndLocation(itemUuid, locationUuid);
	}
	
	@Override
	public LedgerType getLedgerTypeByUuid(String ledgerTypeUuid) {
		return this.ledgerTypeDAO.findByUuid(ledgerTypeUuid);
	}
	
	@Override
	public Ledger getLedgerByUuid(String ledgerUuid) {
		return this.ledgerDAO.findByUuid(ledgerUuid);
	}
	
	@Override
	public Issue getIssueByUuid(String issueUuid) {
		return this.issueDAO.findByUuid(issueUuid);
	}
	
	@Override
	public ListResult<Item> getStockoutByLocation(String locationUuid, Pager pager, String q, String conceptClassName) {
		ListResult<Item> items = this.stockDAO.getStockedOutByLocation(locationUuid, pager, q, conceptClassName);
		
		return items;
	}
	
	@Override
	public Stock saveStock(Stock stock) {
		return this.stockDAO.save(stock);
	}
	
	@Override
	public Transaction saveTransaction(Transaction transaction) {
		return this.transactionDAO.save(transaction);
	}
	
	@Override
	public List<Transaction> getTransactionsByLocationUuid(String locationUuid) {
		return this.transactionDAO.getTransactionsByLocationUuid(locationUuid);
	}
	
	@Override
	public Map<String, Object> getLocationStockMetrics(String locationUuid) {
		return this.stockDAO.getStockMetricsByLocation(locationUuid);
	}
	
	@Override
	public void onStartup() {
		
	}
	
	@Override
	public void onShutdown() {
		
	}
}
