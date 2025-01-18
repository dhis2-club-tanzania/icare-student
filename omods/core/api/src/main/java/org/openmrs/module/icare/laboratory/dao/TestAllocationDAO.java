package org.openmrs.module.icare.laboratory.dao;

// Generated Oct 7, 2020 12:49:21 PM by Hibernate Tools 5.2.10.Final

import org.hibernate.Query;
import org.openmrs.Order;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.module.icare.core.dao.BaseDAO;
import org.openmrs.module.icare.laboratory.models.Result;
import org.openmrs.module.icare.laboratory.models.Sample;
import org.openmrs.module.icare.laboratory.models.SampleOrder;
import org.openmrs.module.icare.laboratory.models.TestAllocation;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Home object for domain model class LbTestAllocation.
 * 
 * @see org.openmrs.module.icare.laboratory.models.TestAllocation
 * @author Hibernate Tools
 */
public class TestAllocationDAO extends BaseDAO<TestAllocation> {
	
	public List<Sample> getAllocationsBySample(String sampleUuid) {
		DbSession session = this.getSession();
		//		TODO: Review the HQL
		String queryStr = "SELECT al \n" + "FROM TestAllocation al \n"
		        + " INNER JOIN SampleOrder so INNER JOIN Sample s WHERE s.uuid = :sampleUuid";
		queryStr = "SELECT s FROM Sample s WHERE s.uuid = :sampleUuid";
		Query query = session.createQuery(queryStr);
		query.setParameter("sampleUuid", sampleUuid);
		return query.list();
	}
	
	public List<TestAllocation> getAllocationsByOrder(String orderUuid) {
		//		TODO: Review the HQL
		DbSession session = this.getSession();
		String queryStr = "SELECT al \n" + "FROM TestAllocation al \n" + " INNER JOIN al.order o \n"
		        + " WHERE o.uuid = :orderUuid";
		Query query = session.createQuery(queryStr);
		query.setParameter("orderUuid", orderUuid);
		return query.list();
	}
}
