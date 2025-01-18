package org.openmrs.module.icare.store.dao;

// Generated Oct 7, 2020 12:49:21 PM by Hibernate Tools 5.2.10.Final

import org.hibernate.Query;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.module.icare.core.dao.BaseDAO;
import org.openmrs.module.icare.store.models.IssueItem;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Home object for domain model class StIssueItem.
 * 
 * @see org.openmrs.module.icare.core.dao.StIssueItem
 * @author Hibernate Tools
 */

public class IssueItemDAO extends BaseDAO<IssueItem> {
	
	public List<IssueItem> getIssueItemByRequisition(String requisitionUuid) {
		DbSession dbSession = this.getSession();
		
		String querystr = " SELECT it FROM IssueItem it INNER JOIN it.id.issue is INNER JOIN is.requisition rq WHERE rq.uuid =:requisitionUuid ";
		
		Query query = dbSession.createQuery(querystr);
		query.setParameter("requisitionUuid", requisitionUuid);
		return query.list();
	}
	
}
