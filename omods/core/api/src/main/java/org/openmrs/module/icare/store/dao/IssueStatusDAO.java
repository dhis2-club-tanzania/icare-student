package org.openmrs.module.icare.store.dao;

// Generated Oct 7, 2020 12:49:21 PM by Hibernate Tools 5.2.10.Final

import org.hibernate.Query;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.module.icare.core.dao.BaseDAO;
import org.openmrs.module.icare.store.models.IssueStatus;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Home object for domain model class StIssueStatus.
 * 
 * @see org.openmrs.module.icare.core.dao.StIssueStatus
 * @author Hibernate Tools
 */

public class IssueStatusDAO extends BaseDAO<IssueStatus> {
	
	public List<IssueStatus> getAllByIssue(String issueUuid) {
		DbSession session = this.getSession();
		String queryStr = "SELECT ist \n" + "FROM IssueStatus ist \n"
		        + "WHERE ist.issue = (SELECT su FROM Issue su WHERE su.uuid = :issueUuid)";
		
		Query query = session.createQuery(queryStr);
		query.setParameter("issueUuid", issueUuid);
		
		return query.list();
	}
	
}
