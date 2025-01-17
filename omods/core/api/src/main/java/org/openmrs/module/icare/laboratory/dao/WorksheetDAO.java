package org.openmrs.module.icare.laboratory.dao;

import org.hibernate.Query;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.module.icare.core.dao.BaseDAO;
import org.openmrs.module.icare.laboratory.models.Batch;
import org.openmrs.module.icare.laboratory.models.Worksheet;

import java.util.Date;
import java.util.List;

public class WorksheetDAO extends BaseDAO<Worksheet> {
	
	public List<Worksheet> getWorksheets(Date startDate, Date endDate, String q, Integer startIndex, Integer limit) {
		
		DbSession session = this.getSession();
		String queryStr = "SELECT ws FROM Worksheet ws";
		
		if (startDate != null && endDate != null) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			}
			queryStr += " (cast(ws.dateCreated as date) BETWEEN :startDate AND :endDate)";
		}
		
		if (q != null) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}
			
			queryStr += "lower(ws.code) like lower(:q) OR lower(ws.name) like lower(:q)";
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
