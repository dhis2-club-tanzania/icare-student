package org.openmrs.module.icare.laboratory.dao;

import org.hibernate.Query;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.module.icare.core.dao.BaseDAO;
import org.openmrs.module.icare.laboratory.models.BatchSample;

import java.util.Date;
import java.util.List;

public class BatchSampleDAO extends BaseDAO<BatchSample> {
	
	public List<BatchSample> getBatchSamples(Date startDate, Date endDate, String q, Integer startIndex, Integer limit,
	        String batchUuid) {
		
		DbSession session = this.getSession();
		String queryStr = "SELECT bs FROM BatchSample bs INNER JOIN bs.batch bt";
		
		if (startDate != null && endDate != null) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			}
			queryStr += " (cast(bs.dateCreated as date) BETWEEN :startDate AND :endDate)";
		}
		
		if (batchUuid != null) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}
			queryStr += " bt.uuid = :batchUuid";
		}
		
		if (q != null) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}
			
			queryStr += "lower(bs.code) like lower(:q) ";
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
		if (batchUuid != null) {
			query.setParameter("batchUuid", batchUuid);
		}
		query.setFirstResult(startIndex);
		query.setMaxResults(limit);
		
		return query.list();
	}
}
