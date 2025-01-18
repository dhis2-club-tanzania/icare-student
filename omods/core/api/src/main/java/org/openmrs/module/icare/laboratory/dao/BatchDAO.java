package org.openmrs.module.icare.laboratory.dao;

import org.hibernate.Query;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.module.icare.core.dao.BaseDAO;
import org.openmrs.module.icare.laboratory.models.Batch;
import org.openmrs.module.icare.laboratory.models.Device;

import java.util.Date;
import java.util.List;

import org.openmrs.module.icare.laboratory.models.Sample;
import org.springframework.stereotype.Repository;

public class BatchDAO extends BaseDAO<Batch> {
	
	public List<Batch> getBatches(Date startDate, Date endDate, String uuid, String q, Integer startIndex, Integer limit) {
		
		DbSession session = this.getSession();
		String queryStr = "SELECT bt FROM Batch bt";
		
		if (uuid != null) {
			queryStr += " WHERE bt.uuid =:uuid";
			Query query = session.createQuery(queryStr);
			query.setParameter("uuid", uuid);
			query.setFirstResult(startIndex);
			query.setMaxResults(limit);
			return query.list();
		} else {
			
			if (startDate != null && endDate != null) {
				if (!queryStr.contains("WHERE")) {
					queryStr += " WHERE ";
				}
				queryStr += " (cast(bt.dateCreated as date) BETWEEN :startDate AND :endDate)";
			}
			
			if (q != null) {
				if (!queryStr.contains("WHERE")) {
					queryStr += " WHERE ";
				} else {
					queryStr += " AND ";
				}
				
				queryStr += "lower(bt.batchName) like lower(:q) OR (bt.label) LIKE lower(:q)";
			}
			
			//Construct a query object
			Query query = session.createQuery(queryStr);
			
			//Attach arguments accordingly
			if (startDate != null) {
				query.setParameter("startDate", startDate);
			}
			if (endDate != null && startDate != null) {
				query.setParameter("endDate", endDate);
			}
			
			if (q != null) {
				query.setParameter("q", "%" + q.replace(" ", "%") + "%");
			}
			
			query.setFirstResult(startIndex);
			query.setMaxResults(limit);
			
			return query.list();
		}
	}
	
}
