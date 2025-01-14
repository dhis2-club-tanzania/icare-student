package org.openmrs.module.icare.core.dao;

// Generated Oct 7, 2020 12:49:21 PM by Hibernate Tools 5.2.10.Final

import org.hibernate.Query;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.api.db.hibernate.DbSessionFactory;
import org.openmrs.module.icare.core.utils.OutgoingSMS;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.List;

public abstract class BaseDAO<T> {
	
	DbSessionFactory sessionFactory;
	
	protected DbSession getSession() {
		return sessionFactory.getCurrentSession();
	}
	
	public void setSessionFactory(DbSessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
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
		List<T> list = query.list();
		if (list.size() > 0) {
			return list.get(0);
		} else {
			return null;
		}
	}
	
	protected String getType() {
		Type type = ((ParameterizedType) this.getClass().getGenericSuperclass()).getActualTypeArguments()[0];
		return type.toString().replace("class ", "");
	}
}
