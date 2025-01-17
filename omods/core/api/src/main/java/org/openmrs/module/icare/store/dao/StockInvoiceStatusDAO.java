package org.openmrs.module.icare.store.dao;

import org.hibernate.Query;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.module.icare.core.dao.BaseDAO;
import org.openmrs.module.icare.store.models.StockInvoiceStatus;

import java.util.List;

public class StockInvoiceStatusDAO extends BaseDAO<StockInvoiceStatus> {
	
	public List<StockInvoiceStatus> getStockInvoicesStatus(Integer startIndex, Integer limit, String search) {
		
		DbSession dbSession = this.getSession();
		
		String querStr = "SELECT stinvstatus FROM StockInvoiceStatus stinvstatus";
		
		if (search != null) {
			querStr += " WHERE lower(stinvstatus.status) LIKE lower(:search)";
		}
		
		Query query = dbSession.createQuery(querStr);
		
		query.setMaxResults(limit);
		query.setFirstResult(startIndex);
		
		if (search != null) {
			query.setParameter("search", "%" + search.replace(" ", "%") + "%");
		}
		
		return query.list();
		
	}
}
