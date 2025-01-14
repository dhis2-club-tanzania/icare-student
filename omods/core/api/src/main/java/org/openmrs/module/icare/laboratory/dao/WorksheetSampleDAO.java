package org.openmrs.module.icare.laboratory.dao;

import org.hibernate.Query;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.module.icare.core.dao.BaseDAO;
import org.openmrs.module.icare.laboratory.models.WorksheetDefinition;
import org.openmrs.module.icare.laboratory.models.WorksheetSample;

import java.util.Date;
import java.util.List;

public class WorksheetSampleDAO extends BaseDAO<WorksheetSample> {
	
	public List<WorksheetSample> getWorksheetSamples(Date startDate, Date endDate, String q, Integer startIndex,
	        Integer limit) {
		
		DbSession session = this.getSession();
		String queryStr = "SELECT wsamples FROM WorksheetSample wsamples INNER JOIN wsamples.sample sp";
		
		if (startDate != null && endDate != null) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			}
			queryStr += " (cast(wsamples.dateCreated as date) BETWEEN :startDate AND :endDate)";
		}
		
		if (q != null) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}
			
			queryStr += "lower(sp.label) like lower(:q)";
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
	
	public List<WorksheetSample> getWorksheetSamplesByWorksheetDefinition(String uuid) {
		DbSession session = this.getSession();
		String queryStr = "SELECT wss FROM WorksheetSample wss INNER JOIN wss.worksheetDefinition wd WHERE wd.uuid =:uuid";
		//Construct a query object
		Query query = session.createQuery(queryStr);
		if (uuid != null) {
			query.setParameter("uuid", uuid);
		}
		return query.list();
	}
	
	public List<WorksheetSample> getWorksheetSampleBySample(String sampleUuid) {
		DbSession session = this.getSession();
		String queryStr = "SELECT wss FROM WorksheetSample wss INNER JOIN wss.sample s WHERE s.uuid =:sampleUuid ";
		Query query = session.createQuery(queryStr);
		if (sampleUuid != null) {
			query.setParameter("sampleUuid", sampleUuid);
		}
		return query.list();
	}
}
