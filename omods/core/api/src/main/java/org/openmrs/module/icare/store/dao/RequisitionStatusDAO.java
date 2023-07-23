package org.openmrs.module.icare.store.dao;

// Generated Oct 7, 2020 12:49:21 PM by Hibernate Tools 5.2.10.Final

import org.hibernate.Query;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.module.icare.core.dao.BaseDAO;
import org.openmrs.module.icare.store.models.IssueStatus;
import org.openmrs.module.icare.store.models.RequisitionStatus;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Home object for domain model class StRequisitionStatus.
 * 
 * @see org.openmrs.module.icare.core.dao.StRequisitionStatus
 * @author Hibernate Tools
 */

public class RequisitionStatusDAO extends BaseDAO<RequisitionStatus> {
	
	public List<RequisitionStatus> getStatusesByRequisition(String requisitionUuid) {
		
		DbSession session = this.getSession();
		String queryStr = "SELECT rqs \n" + "FROM RequisitionStatus rqs \n"
		        + "WHERE rqs.requisition = (SELECT rq FROM Requisition rq WHERE rq.uuid = :requisitionUuid)";
		
		Query query = session.createQuery(queryStr);
		query.setParameter("requisitionUuid", requisitionUuid);
		
		return query.list();
		
	}
	
}
