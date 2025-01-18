package org.openmrs.module.icare.core.dao;

import org.hibernate.Query;
import org.openmrs.Privilege;
import org.openmrs.api.db.hibernate.DbSession;

import java.util.List;

public class PrivilegeDAO extends BaseDAO<Privilege> {
	
	public List<Privilege> getPrivileges(String q, Integer startIndex, Integer limit) {
		
		DbSession session = getSession();
		String queryStr = "SELECT pv FROM Privilege pv WHERE lower(pv.privilege) LIKE lower(:q)";
		
		Query query = session.createQuery(queryStr);
		query.setParameter("q", "%" + q + "%");
		
		query.setFirstResult(startIndex);
		query.setMaxResults(limit);
		return query.list();
	}
}
