package org.openmrs.module.icare.store.dao;

import org.hibernate.Query;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.module.icare.core.ListResult;
import org.openmrs.module.icare.core.Pager;
import org.openmrs.module.icare.core.dao.BaseDAO;
import org.openmrs.module.icare.store.models.StockInvoice;
import org.openmrs.module.icare.store.models.StockInvoiceStatus;

import java.util.Date;

public class StockInvoiceDAO extends BaseDAO<StockInvoice> {
	
	public ListResult<StockInvoice> getStockInvoices(Pager pager, StockInvoiceStatus.Type status, String q, Date startDate,
	        Date endDate) {
		DbSession session = this.getSession();
		String queryStr = " SELECT stinv FROM StockInvoice stinv WHERE stinv.voided = false";
		
		if (status == StockInvoiceStatus.Type.DRAFT) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE";
			} else {
				queryStr += " AND";
			}
			queryStr += " stinv IN (SELECT stinvstatus.stockInvoice FROM StockInvoiceStatus stinvstatus WHERE stinvstatus.status LIKE 'DRAFT') AND stinv NOT IN( SELECT stinvstatus.stockInvoice FROM StockInvoiceStatus stinvstatus WHERE stinvstatus.status LIKE 'RECEIVED') ";
		}
		
		if (status == StockInvoiceStatus.Type.RECEIVED) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE";
			} else {
				queryStr += " AND";
			}
			queryStr += " stinv IN (SELECT stinvstatus.stockInvoice FROM StockInvoiceStatus stinvstatus WHERE stinvstatus.status LIKE 'RECEIVED') ";
		}
		
		if (startDate != null && endDate != null) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND";
			}
			queryStr += " (cast(stinv.receivingDate as date) BETWEEN :startDate AND :endDate)";
		}
		
		if (q != null) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}
			
			queryStr += "lower(stinv.invoiceNumber) like lower(:q) ";
		}
		
		Query query = session.createQuery(queryStr);
		if (startDate != null && endDate != null) {
			query.setParameter("startDate", startDate);
			query.setParameter("endDate", endDate);
		}
		
		if (q != null) {
			query.setParameter("q", "%" + q.replace(" ", "%") + "%");
		}
		
		if (pager.isAllowed()) {
			pager.setTotal(query.list().size());
			query.setFirstResult((pager.getPage() - 1) * pager.getPageSize());
			query.setMaxResults(pager.getPageSize());
		}
		
		ListResult<StockInvoice> listResults = new ListResult();
		listResults.setPager(pager);
		listResults.setResults(query.list());
		return listResults;
		
	}
	
	public StockInvoice updateStockInvoice(StockInvoice stockInvoice) {
		DbSession session = this.getSession();
		
		String queryStr = " UPDATE StockInvoice st";
		
		if (stockInvoice.getInvoiceNumber() != null) {
			
			if (!queryStr.contains("SET")) {
				queryStr += " SET ";
			} else {
				queryStr += " ,";
			}
			queryStr += " st.invoiceNumber = :invoiceNumber";
		}
		
		if (stockInvoice.getSupplier() != null) {
			if (!queryStr.contains("SET")) {
				queryStr += " SET ";
			} else {
				queryStr += " ,";
			}
			queryStr += " st.supplier = :supplier";
		}
		
		if (stockInvoice.getPurchaseOrder() != null) {
			
			if (!queryStr.contains("SET")) {
				queryStr += " SET ";
			} else {
				queryStr += " ,";
			}
			
			queryStr += " st.purchaseOrder = :purchaseOrder";
		}
		if (stockInvoice.getReceivingDate() != null) {
			
			if (!queryStr.contains("SET")) {
				queryStr += " SET ";
			} else {
				queryStr += " ,";
			}
			
			queryStr += " st.receivingDate = :receivingDate";
			
		}
		
		if (stockInvoice.getVoided() != null) {
			if (!queryStr.contains("SET")) {
				queryStr += " SET ";
			} else {
				queryStr += " ,";
			}
			
			queryStr += " st.voided = :voided";
		}
		
		queryStr += " WHERE uuid = :uuid";
		
		Query query = session.createQuery(queryStr);
		
		if (stockInvoice.getInvoiceNumber() != null) {
			query.setParameter("invoiceNumber", stockInvoice.getInvoiceNumber());
		}
		
		if (stockInvoice.getSupplier() != null) {
			query.setParameter("supplier", stockInvoice.getSupplier());
		}
		
		if (stockInvoice.getPurchaseOrder() != null) {
			query.setParameter("purchaseOrder", stockInvoice.getPurchaseOrder());
		}
		
		if (stockInvoice.getVoided() != null) {
			query.setParameter("voided", stockInvoice.getVoided());
		}
		
		if (stockInvoice.getReceivingDate() != null) {
			query.setParameter("receivingDate", stockInvoice.getReceivingDate());
		}
		
		query.setParameter("uuid", stockInvoice.getUuid());
		
		Integer success = query.executeUpdate();
		
		if (success == 1) {
			return stockInvoice;
		} else {
			return null;
		}
	}
	
	public Double getTotalStockItemsAmountByStockInvoice(StockInvoice stockInvoice) {
		
		DbSession session = this.getSession();
		String queryStr = "SELECT SUM(sti.amount) FROM StockInvoiceItem sti WHERE sti.stockInvoice = :stockInvoice";
		
		Query query = session.createQuery(queryStr);
		
		query.setParameter("stockInvoice", stockInvoice);
		if (query.list().get(0) != null) {
			return (double) query.list().get(0);
		} else {
			return null;
		}
	}
}
