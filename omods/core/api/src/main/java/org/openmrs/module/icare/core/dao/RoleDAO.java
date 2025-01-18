package org.openmrs.module.icare.core.dao;

import org.hibernate.Query;
import org.openmrs.Role;
import org.openmrs.api.db.hibernate.DbSession;

import java.util.List;

public class RoleDAO extends BaseDAO<Role> {
	
	public List<Role> getRoles(String q, Integer startIndex, Integer limit) {
		
		DbSession session = getSession();
		String queryStr = "SELECT rl FROM Role rl WHERE lower(rl.role) LIKE lower(:q)";
		
		Query query = session.createQuery(queryStr);
		query.setParameter("q", "%" + q + "%");
		
		query.setFirstResult(startIndex);
		query.setMaxResults(limit);
		return query.list();
		
	}
}
