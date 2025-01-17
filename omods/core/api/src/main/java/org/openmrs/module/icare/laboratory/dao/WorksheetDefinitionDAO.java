package org.openmrs.module.icare.laboratory.dao;

import org.hibernate.Query;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.module.icare.core.dao.BaseDAO;
import org.openmrs.module.icare.laboratory.models.SampleStatus;
import org.openmrs.module.icare.laboratory.models.Worksheet;
import org.openmrs.module.icare.laboratory.models.WorksheetDefinition;
import org.openmrs.module.icare.laboratory.models.WorksheetSample;

import java.util.Date;
import java.util.List;

public class WorksheetDefinitionDAO extends BaseDAO<WorksheetDefinition> {
	
	public List<WorksheetDefinition> getWorksheetDefinitions(Date startDate, Date endDate, String q, Integer startIndex,
	        Integer limit, Date expirationDate, String instrumentUuid) {
		
		DbSession session = this.getSession();
		String queryStr = "SELECT wd FROM WorksheetDefinition wd INNER JOIN wd.worksheet w";
		
		if (startDate != null && endDate != null) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			}
			queryStr += " (cast(wd.dateCreated as date) BETWEEN :startDate AND :endDate)";
		}
		
		if (q != null) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}
			
			queryStr += "lower(wd.code) like lower(:q)";
		}
		
		if (expirationDate != null) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}
			queryStr += " cast(wd.expirationDateTime as date) >= :expirationDate";
		}
		if (instrumentUuid != null) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}
			
			queryStr += " w.instrument.uuid = :instrumentUuid AND wd IN ( SELECT ws.worksheetDefinition FROM WorksheetSample ws WHERE ws.sample IN(SELECT sample FROM Sample sample WHERE sample NOT IN( SELECT st.sample FROM SampleStatus st WHERE st.category ='HAS_RESULTS' )))";
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
		
		if (expirationDate != null) {
			query.setParameter("expirationDate", expirationDate);
		}
		
		if (instrumentUuid != null) {
			query.setParameter("instrumentUuid", instrumentUuid);
		}
		
		query.setFirstResult(startIndex);
		query.setMaxResults(limit);
		
		return query.list();
		
	}
}
