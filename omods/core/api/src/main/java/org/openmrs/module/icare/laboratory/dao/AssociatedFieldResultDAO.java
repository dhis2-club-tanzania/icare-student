package org.openmrs.module.icare.laboratory.dao;

import org.hibernate.Query;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.module.icare.core.dao.BaseDAO;
import org.openmrs.module.icare.laboratory.models.AssociatedFieldResult;

import java.util.List;

public class AssociatedFieldResultDAO extends BaseDAO<AssociatedFieldResult> {
	
	public List<AssociatedFieldResult> getAssociatedFieldResult(Integer startIndex, Integer limit, String resultUuid,
	        String associatedFieldUuid) {
		
		DbSession session = this.getSession();
		
		String queryStr = " SELECT afr FROM AssociatedFieldResult afr";
		
		if (resultUuid != null) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}
			queryStr += " afr.result IN ( SELECT result FROM Result result WHERE result.uuid = :resultUuid)";
			
		}
		
		if (associatedFieldUuid != null) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}
			
			queryStr += " afr.associatedField IN( SELECT assoc FROM AssociatedField assoc WHERE assoc.uuid = :associatedFieldUuid)";
		}
		
		Query query = session.createQuery(queryStr);
		
		if (resultUuid != null) {
			query.setParameter("resultUuid", resultUuid);
		}
		
		if (associatedFieldUuid != null) {
			query.setParameter("associatedFieldUuid", associatedFieldUuid);
		}
		
		query.setFirstResult(startIndex);
		query.setMaxResults(limit);
		
		return query.list();
		
	}
}
