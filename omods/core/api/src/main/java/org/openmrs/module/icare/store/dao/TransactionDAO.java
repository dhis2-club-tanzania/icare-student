package org.openmrs.module.icare.store.dao;

// Generated Oct 7, 2020 12:49:21 PM by Hibernate Tools 5.2.10.Final

import org.hibernate.Query;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.module.icare.core.dao.BaseDAO;
import org.openmrs.module.icare.store.models.Transaction;

import java.util.List;

/**
 * Home object for domain model class StTransaction.
 * 
 * @see org.openmrs.module.icare.core.dao.StTransaction
 * @author Hibernate Tools
 */

public class TransactionDAO extends BaseDAO<Transaction> {
	
	public List<Transaction> getTransactionsByLocationUuid(String locationUuid) {
		DbSession session = this.getSession();
		String queryStr = "SELECT t \n" + "FROM Transaction t \n" + "WHERE t.location.uuid = :locationUuid";
		
		Query query = session.createQuery(queryStr);
		query.setParameter("locationUuid", locationUuid);
		
		return query.list();
	}
}
