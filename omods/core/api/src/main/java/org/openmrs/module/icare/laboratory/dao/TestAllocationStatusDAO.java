package org.openmrs.module.icare.laboratory.dao;

// Generated Oct 7, 2020 12:49:21 PM by Hibernate Tools 5.2.10.Final

import org.hibernate.Query;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.module.icare.core.dao.BaseDAO;
import org.openmrs.module.icare.laboratory.models.TestAllocation;
import org.openmrs.module.icare.laboratory.models.TestAllocationStatus;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Home object for domain model class LbTestAllocationStatus.
 * 
 * @see org.openmrs.module.icare.core.dao.LbTestAllocationStatus
 * @author Hibernate Tools
 */

public class TestAllocationStatusDAO extends BaseDAO<TestAllocationStatus> {
	
	public List<TestAllocationStatus> findTestAllocationStatusByStatusAndTestAllocation(String testAllocationUuid) {
		DbSession session = this.getSession();
		String queryStr = "SELECT tas \n" + "FROM TestAllocationStatus tas \n"
		        + "WHERE tas.testAllocation = (SELECT ta FROM TestAllocation ta WHERE ta.uuid = :testAllocationUuid)"
		        + "AND tas.status = 'APPROVED'";
		
		Query query = session.createQuery(queryStr);
		query.setParameter("testAllocationUuid", testAllocationUuid);
		
		return query.list();
	}
}
