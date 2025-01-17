package org.openmrs.module.icare.store.dao;

import org.openmrs.Concept;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.module.icare.billing.models.ItemPrice;
import org.openmrs.module.icare.core.Item;
import org.openmrs.module.icare.core.ListResult;
import org.openmrs.module.icare.core.Pager;
import org.openmrs.module.icare.core.dao.BaseDAO;
import org.openmrs.module.icare.laboratory.models.Sample;
import org.openmrs.module.icare.store.models.StockInvoice;
import org.openmrs.module.icare.store.models.StockInvoiceItem;
import org.hibernate.Query;
import org.openmrs.module.icare.store.models.StockInvoiceItemStatus;

import java.util.Date;
import java.util.List;

public class StockInvoiceItemDAO extends BaseDAO<StockInvoiceItem> {
	
	public StockInvoiceItem updateStockInvoiceItem(StockInvoiceItem stockInvoiceItem) {
		
		DbSession session = this.getSession();
		
		String queryStr = " UPDATE StockInvoiceItem sti";
		
		if (stockInvoiceItem.getItem() != null) {
			queryStr += " SET sti.item = :item";
		}
		
		if (stockInvoiceItem.getAmount() != null) {
			if (!queryStr.contains("SET")) {
				queryStr += " SET ";
			} else {
				queryStr += " ,";
			}
			queryStr += "  sti.amount = :amount";
		}
		
		if (stockInvoiceItem.getLocation() != null) {
			if (!queryStr.contains("SET")) {
				queryStr += " SET ";
			} else {
				queryStr += " ,";
			}
			queryStr += "  sti.location = :location";
		}
		
		if (stockInvoiceItem.getBatchNo() != null) {
			if (!queryStr.contains("SET")) {
				queryStr += " SET ";
			} else {
				queryStr += " ,";
			}
			queryStr += " sti.batchNo = :batchNo";
		}
		
		if (stockInvoiceItem.getBatchQuantity() != null) {
			if (!queryStr.contains("SET")) {
				queryStr += " SET ";
			} else {
				queryStr += " ,";
			}
			queryStr += " sti.batchQuantity = :batchQuantity";
		}
		
		if (stockInvoiceItem.getOrderQuantity() != null) {
			if (!queryStr.contains("SET")) {
				queryStr += " SET ";
			} else {
				queryStr += " ,";
			}
			queryStr += " sti.orderQuantity = :orderQuantity";
		}
		
		if (stockInvoiceItem.getUnitPrice() != null) {
			if (!queryStr.contains("SET")) {
				queryStr += " SET ";
			} else {
				queryStr += " ,";
			}
			queryStr += " sti.unitPrice = :unitPrice";
		}
		
		if (stockInvoiceItem.getExpiryDate() != null) {
			if (!queryStr.contains("SET")) {
				queryStr += " SET ";
			} else {
				queryStr += " ,";
			}
			queryStr += " sti.expiryDate = :expiryDate";
		}
		
		if (stockInvoiceItem.getVoided() != null) {
			if (!queryStr.contains("SET")) {
				queryStr += " SET ";
			} else {
				queryStr += " ,";
			}
			queryStr += " sti.voided = :voided";
		}
		
		queryStr += " WHERE uuid = :uuid";
		
		Query query = session.createQuery(queryStr);
		
		if (stockInvoiceItem.getItem() != null) {
			query.setParameter("item", stockInvoiceItem.getItem());
		}
		
		if (stockInvoiceItem.getAmount() != null) {
			query.setParameter("amount", stockInvoiceItem.getAmount());
		}
		
		if (stockInvoiceItem.getBatchNo() != null) {
			query.setParameter("batchNo", stockInvoiceItem.getBatchNo());
		}
		
		if (stockInvoiceItem.getBatchQuantity() != null) {
			query.setParameter("batchQuantity", stockInvoiceItem.getBatchQuantity());
		}
		
		if (stockInvoiceItem.getOrderQuantity() != null) {
			query.setParameter("orderQuantity", stockInvoiceItem.getOrderQuantity());
		}
		
		if (stockInvoiceItem.getUnitPrice() != null) {
			query.setParameter("unitPrice", stockInvoiceItem.getUnitPrice());
		}
		
		if (stockInvoiceItem.getExpiryDate() != null) {
			query.setParameter("expiryDate", stockInvoiceItem.getExpiryDate());
		}
		
		if (stockInvoiceItem.getLocation() != null) {
			query.setParameter("location", stockInvoiceItem.getLocation());
		}
		if (stockInvoiceItem.getVoided() != null) {
			query.setParameter("voided", stockInvoiceItem.getVoided());
		}
		
		query.setParameter("uuid", stockInvoiceItem.getUuid());
		
		Integer success = query.executeUpdate();
		
		if (success == 1) {
			return stockInvoiceItem;
		} else {
			return null;
		}
	}
	
	public List<StockInvoiceItem> getStockInvoiceItemByInvoice(StockInvoice stockInvoice) {
		
		DbSession session = this.getSession();
		
		String queryStr = " SELECT stinvi FROM StockInvoiceItem stinvi WHERE stinvi.stockInvoice = :stockinvoice";
		
		Query query = session.createQuery(queryStr);
		
		query.setParameter("stockinvoice", stockInvoice);
		
		return query.list();
	}
	
	public ListResult getStockInvoiceItems(Pager pager, String stockInvoiceUuid, Date startDate, Date endDate,
	        String providerUuid, String paymentScheme) {
		
		DbSession session = this.getSession();
		
		String queryStr = " SELECT SUM(siitem.amount*siitem.unitPrice) as totalPriceAmount," + " siitem.item, "
		        + " siitem.stockInvoice," + " SUM(siitem.amount) as totalItems ";
		
		if (paymentScheme != null) {
			queryStr += ",SUM(prices.price*siitem.amount) as totalItems ";
		}
		
		queryStr += " FROM StockInvoiceItem siitem ";
		if (paymentScheme != null) {
			new ItemPrice();
			new Item();
			queryStr += " JOIN siitem.item.prices prices WHERE prices.id.paymentScheme.uuid =:paymentScheme";
		}
		
		if (stockInvoiceUuid != null) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}
			queryStr += " siitem.stockInvoice.uuid = :stockInvoiceUuid ";
		}
		queryStr += " GROUP BY siitem.item";
		
		Query query = session.createQuery(queryStr);
		
		if (paymentScheme != null) {
			query.setParameter("paymentScheme", paymentScheme);
		}
		if (stockInvoiceUuid != null) {
			query.setParameter("stockInvoiceUuid", stockInvoiceUuid);
		}
		
		if (pager.isAllowed()) {
			pager.setTotal(query.list().size());
			query.setFirstResult((pager.getPage() - 1) * pager.getPageSize());
			query.setMaxResults(pager.getPageSize());
		}
		ListResult<Sample> listResults = new ListResult();
		listResults.setPager(pager);
		listResults.setResults(query.list());
		
		return listResults;
	}
}
