package org.openmrs.module.icare.laboratory.dao;

import org.hibernate.Query;
import org.openmrs.Concept;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.module.icare.core.dao.BaseDAO;
import org.openmrs.module.icare.laboratory.models.TestRangeConfig;

import java.util.List;

public class TestRangeConfigDAO extends BaseDAO<TestRangeConfig> {
	
	public List<TestRangeConfig> getConfigsByConcept(String conceptUuid) {
		DbSession session = this.getSession();
		
		String queryStr = "SELECT ttc \n" + "FROM TestRangeConfig ttc \n"
		        + "WHERE ttc.concept = (SELECT c FROM Concept c WHERE c.uuid = :conceptUuid)";
		
		Query query = session.createQuery(queryStr);
		query.setParameter("conceptUuid", conceptUuid);
		
		return query.list();
	}
	
	public List<TestRangeConfig> getConfigsByConceptAndGender(String conceptUuid, String gender) {
		DbSession session = this.getSession();
		
		String queryStr = "SELECT ttc \n" + "FROM TestRangeConfig ttc \n"
		        + "WHERE ttc.concept = (SELECT c FROM Concept c WHERE c.uuid = :conceptUuid) \n"
		        + " AND ttc.gender = :gender";
		
		Query query = session.createQuery(queryStr);
		query.setParameter("conceptUuid", conceptUuid);
		query.setParameter("gender", gender);
		
		return query.list();
	}
	
	public TestRangeConfig updateRangeConfigs(TestRangeConfig testRangeConfig) {
		DbSession session = this.getSession();
		
		String queryStr = "UPDATE TestRangeConfig set " + "absoluteHigh = :absoluteHigh," + "criticalHigh = :criticalHigh,"
		        + "normalHigh = :normalHigh," + "absoluteLow = :absoluteLow, " + "criticalLow = :criticalLow, "
		        + "normalLow = :normalLow, " + "creator = :creator," + "dateCreated = :dateCreated,"
		        + "changedBy = :changedBy, " + "dateChanged = :dateChanged " + "where uuid = :uuid";
		
		Query query = session.createQuery(queryStr);
		query.setParameter("absoluteHigh", testRangeConfig.getAbsoluteHigh());
		query.setParameter("criticalHigh", testRangeConfig.getCriticalHigh());
		query.setParameter("normalHigh", testRangeConfig.getNormalHigh());
		query.setParameter("absoluteLow", testRangeConfig.getAbsoluteLow());
		query.setParameter("criticalLow", testRangeConfig.getCriticalLow());
		query.setParameter("normalLow", testRangeConfig.getNormalLow());
		query.setParameter("uuid", testRangeConfig.getUuid());
		query.setParameter("changedBy", testRangeConfig.getChangedBy());
		query.setParameter("dateChanged", testRangeConfig.getDateChanged());
		query.setParameter("creator", testRangeConfig.getCreator());
		query.setParameter("dateCreated", testRangeConfig.getDateCreated());
		
		Integer success = query.executeUpdate();
		
		if (success == 1) {
			
			return testRangeConfig;
			
		} else {
			
			return null;
			
		}
	}
}
