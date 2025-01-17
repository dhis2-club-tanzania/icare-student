package org.openmrs.module.icare.billing.dao;

// Generated Oct 7, 2020 12:49:21 PM by Hibernate Tools 5.2.10.Final

import org.hibernate.Query;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.api.db.hibernate.DbSessionFactory;
import org.openmrs.module.icare.billing.models.Payment;
import org.openmrs.module.icare.core.dao.BaseDAO;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Home object for domain model class BlPayment.
 * 
 * @see org.openmrs.module.icare.billing.models.Payment
 * @author Hibernate Tools
 */
@Repository
@Transactional
public class PaymentDAO extends BaseDAO<Payment> {
	
	DbSessionFactory sessionFactory;
	
	protected DbSession getSession() {
		return sessionFactory.getCurrentSession();
	}
	
	public void setSessionFactory(DbSessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}
	
	public Payment save(Payment entity) {
		DbSession session = getSession();
		session.persist(this.getType(), entity);
		session.flush();
		
		// this.sessionFactory.getCurrentSession().saveOrUpdate(entity);
		return entity;
	}
	
	public List<Payment> findByPatientUuid(String patientUuid) {
		DbSession session = this.getSession();
		String queryStr = "SELECT p FROM Payment p WHERE p.invoice.visit.patient.uuid = :patientUuid";
		Query query = session.createQuery(queryStr);
		query.setParameter("patientUuid", patientUuid);
		return query.list();
	}
	
	public String getReferenceNumberByRequestId(Integer requestId) {
		DbSession session = this.getSession();
		String queryStr = "SELECT p.referenceNumber FROM Payment p WHERE p.id = :requestId";
		Query query = session.createQuery(queryStr);
		query.setParameter("requestId", requestId);
		String referenceNumber = (String) query.uniqueResult();
		return referenceNumber;
	}
	
	//Get All Payments with its status
	public List<Payment> getAllPayments() {
		DbSession session = this.getSession();
		String queryStr = "SELECT p FROM Payment p";
		Query query = session.createQuery(queryStr);
		return query.list();
	}
	
	public Payment getPaymentByRequestId(Integer requestId) {
		DbSession session = this.getSession();
		String queryStr = "SELECT p FROM Payment p WHERE p.id = :requestId";
		Query query = session.createQuery(queryStr);
		query.setParameter("requestId", requestId);
		return (Payment) query.uniqueResult();
	}
	
	public int setReferenceNumberByPaymentId(Integer paymentId, String pyReference) {
		DbSession session = this.getSession();
		String queryStr = "UPDATE Payment p SET p.referenceNumber = :pyReference WHERE p.id = :paymentId";
		Query query = session.createQuery(queryStr);
		query.setParameter("pyReference", pyReference);
		query.setParameter("paymentId", paymentId);
		
		return query.executeUpdate();
		
	}
	
	public List<Payment> findByPaymentTypeId(Integer paymentTypeId) {
		DbSession session = this.getSession();
		String queryStr = "FROM Payment p WHERE p.paymentType.id = :paymentTypeId";
		Query query = session.createQuery(queryStr);
		query.setParameter("paymentTypeId", paymentTypeId);
		return query.list();
	}
	
	public void updatePayment(Payment payment) {
		DbSession session = getSession();
		session.update(payment);
		session.flush();
	}
	
}
