package org.openmrs.module.icare.store.dao;

// Generated Oct 7, 2020 12:49:21 PM by Hibernate Tools 5.2.10.Final

import org.hibernate.Query;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.module.icare.core.dao.BaseDAO;
import org.openmrs.module.icare.laboratory.models.Sample;
import org.openmrs.module.icare.store.models.Issue;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Home object for domain model class StIssue.
 * 
 * @see org.openmrs.module.icare.core.dao.StIssue
 * @author Hibernate Tools
 */

public class IssueDAO extends BaseDAO<Issue> {
	
	public List<Issue> getIssuesByIssueingLocation(String issueingLocationUuid) {
		
		DbSession session = this.getSession();
		String queryStr = "SELECT rq \n" + "FROM Issue rq \n"
		        + "WHERE rq.issueingLocation = (SELECT l FROM Location l WHERE l.uuid = :issueingLocationUuid)";
		
		Query query = session.createQuery(queryStr);
		query.setParameter("issueingLocationUuid", issueingLocationUuid);
		
		return query.list();
		
	}
	
	public List<Issue> getIssuesByIssuedLocation(String issuedLocationUuid) {
		
		DbSession session = this.getSession();
		String queryStr = "SELECT rq \n" + "FROM Issue rq \n"
		        + "WHERE rq.issuedLocation = (SELECT l FROM Location l WHERE l.uuid = :issuedLocationUuid)";
		
		Query query = session.createQuery(queryStr);
		query.setParameter("issuedLocationUuid", issuedLocationUuid);
		
		return query.list();
		
	}
	
}
