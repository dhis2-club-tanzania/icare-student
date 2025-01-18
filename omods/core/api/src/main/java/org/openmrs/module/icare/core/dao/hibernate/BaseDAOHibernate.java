package org.openmrs.module.icare.core.dao.hibernate;

import org.hibernate.Query;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.api.db.hibernate.DbSessionFactory;
import org.openmrs.module.icare.core.dao.IBaseDAO;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.List;

public class BaseDAOHibernate<T> implements IBaseDAO<T> {
	
	DbSessionFactory sessionFactory;
	
	protected DbSession getSession() {
		return sessionFactory.getCurrentSession();
	}
	
	public <S extends T> S save(S entity) {
		DbSession session = getSession();
		session.persist(this.getType(), entity);
		session.flush();
		return entity;
	}
	
	public Iterable<T> findAll() {
		DbSession session = getSession();
		return session.createQuery("SELECT a FROM " + this.getType() + " a").list();
	}
	
	public List<T> findByPatientUuid(String patientId) {
		DbSession session = this.getSession();
		//TODO write query which gets by patientUuid
		return session.createQuery("SELECT a FROM " + getType() + " a").list();
	}
	
	public T findByUuid(String uuid) {
		DbSession session = this.getSession();
		String queryStr = "SELECT i FROM " + getType() + " i WHERE i.uuid = :uuid";
		Query query = session.createQuery(queryStr);
		query.setParameter("uuid", uuid);
		List<T> invoices = query.list();
		if (invoices.size() > 0) {
			return invoices.get(0);
		} else {
			return null;
		}
	}
	
	protected String getType() {
		Type type = ((ParameterizedType) this.getClass().getGenericSuperclass()).getActualTypeArguments()[0];
		return type.toString().replace("class ", "");
	}
}
