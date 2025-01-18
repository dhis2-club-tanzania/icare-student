package org.openmrs.module.icare.laboratory.dao;

// Generated Oct 7, 2020 12:49:21 PM by Hibernate Tools 5.2.10.Final

import org.hibernate.Query;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.module.icare.core.dao.BaseDAO;
import org.openmrs.module.icare.laboratory.models.Sample;
import org.openmrs.module.icare.laboratory.models.SampleOrder;
import org.openmrs.module.icare.laboratory.models.SampleOrderID;

import java.util.List;
import java.util.Map;

/**
 * Home object for domain model class LbSampleOrder.
 * 
 * @see org.openmrs.module.icare.core.dao
 * @author Hibernate Tools
 */
public class SampleOrderDAO extends BaseDAO<SampleOrder> {
	
	public SampleOrder get(SampleOrderID id) {
		DbSession session = getSession();
		return (SampleOrder) session.get(SampleOrder.class, id);
	}
	
	public List<Map<String, Object>> getSampleOrdersBySampleUuid(String sampleUuid) {
		DbSession session = getSession();
		String queryStr = "SELECT s \n" + "FROM Sample s WHERE uuid =:sampleUuid";
		//		+ "WHERE so.sampleId = ( SELECT s.sampleId FROM Sample s WHERE uuid =:sampleUuid)";
		Query query = session.createQuery(queryStr);
		query.setParameter("sampleUuid", sampleUuid);
		return query.list();
	}
}
