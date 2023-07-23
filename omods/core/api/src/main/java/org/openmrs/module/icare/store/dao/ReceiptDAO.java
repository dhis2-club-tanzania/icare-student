package org.openmrs.module.icare.store.dao;

// Generated Oct 7, 2020 12:49:21 PM by Hibernate Tools 5.2.10.Final

import org.hibernate.Query;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.module.icare.core.dao.BaseDAO;
import org.openmrs.module.icare.laboratory.models.Sample;
import org.openmrs.module.icare.store.models.Receipt;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Home object for domain model class StReceipt.
 * 
 * @see org.openmrs.module.icare.core.dao.StReceipt
 * @author Hibernate Tools
 */

public class ReceiptDAO extends BaseDAO<Receipt> {
	
	public List<Receipt> getReceiptsByIssueingLocation(String issueingLocationUuid) {
		DbSession session = this.getSession();
		String queryStr = "SELECT rc \n" + "FROM Receipt rc \n"
		        + "WHERE rc.issueingLocation = (SELECT l FROM Location l WHERE l.uuid = :issueingLocationUuid)";
		
		Query query = session.createQuery(queryStr);
		query.setParameter("issueingLocationUuid", issueingLocationUuid);
		
		return query.list();
	}
	
	public List<Receipt> getReceiptsByReceivingLocation(String receivingLocationUuid) {
		DbSession session = this.getSession();
		String queryStr = "SELECT rc \n" + "FROM Receipt rc \n"
		        + "WHERE rc.receivingLocation = (SELECT l FROM Location l WHERE l.uuid = :receivingLocationUuid)";
		
		Query query = session.createQuery(queryStr);
		query.setParameter("receivingLocationUuid", receivingLocationUuid);
		
		return query.list();
	}
	
}
