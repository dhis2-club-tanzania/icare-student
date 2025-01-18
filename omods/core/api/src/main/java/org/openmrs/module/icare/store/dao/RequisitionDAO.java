package org.openmrs.module.icare.store.dao;

// Generated Oct 7, 2020 12:49:21 PM by Hibernate Tools 5.2.10.Final

import org.hibernate.Query;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.module.icare.core.ListResult;
import org.openmrs.module.icare.core.Pager;
import org.openmrs.module.icare.core.dao.BaseDAO;
import org.openmrs.module.icare.store.models.Requisition;
import org.openmrs.module.icare.store.models.RequisitionStatus;

import java.util.Date;

/**
 * Home object for domain model class StRequisition.
 * 
 * @see org.openmrs.module.icare.core.dao.StRequisition
 * @author Hibernate Tools
 */

public class RequisitionDAO extends BaseDAO<Requisition> {
	
	public ListResult<Requisition> getRequisitionsByRequestingLocation(String requestingLocationUuid, Pager pager,
	        RequisitionStatus.RequisitionStatusCode status, Requisition.OrderByDirection orderByDirection, String q,
	        Date startDate, Date endDate) {
		DbSession session = this.getSession();
		String queryStr = "SELECT rq \n"
		        + "FROM Requisition rq \n"
		        + "WHERE rq.requestingLocation = (SELECT l FROM Location l WHERE l.uuid = :requestingLocationUuid) AND rq.voided = false";
		
		if (status != null) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}
			if (status != RequisitionStatus.RequisitionStatusCode.PENDING) {
				queryStr += " rq IN ( SELECT rs.requisition FROM RequisitionStatus rs WHERE rs.status = :status)";
			}
			if (status == RequisitionStatus.RequisitionStatusCode.PENDING) {
				queryStr += "rq NOT IN (SELECT rs.requisition FROM RequisitionStatus rs)";
			}
		}
		
		if (startDate != null && endDate != null) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND";
			}
			queryStr += " (cast(rq.dateCreated as date) BETWEEN :startDate AND :endDate)";
		}
		
		if (q != null) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}
			
			queryStr += "lower(rq.code) like lower(:q) ";
		}
		
		if (orderByDirection != null) {
			if (orderByDirection == Requisition.OrderByDirection.DESC) {
				queryStr += " ORDER BY  rq.dateCreated DESC";
			}
			
			if (orderByDirection == Requisition.OrderByDirection.ASC) {
				queryStr += " ORDER BY  rq.dateCreated ASC";
			}
		}
		
		Query query = session.createQuery(queryStr);
		query.setParameter("requestingLocationUuid", requestingLocationUuid);
		if (status != null && status != RequisitionStatus.RequisitionStatusCode.PENDING) {
			query.setParameter("status", status);
		}
		
		if (startDate != null && endDate != null) {
			query.setParameter("startDate", startDate);
			query.setParameter("endDate", endDate);
		}
		
		if (q != null) {
			query.setParameter("q", "%" + q.replace(" ", "%") + "%");
		}
		
		if (pager.isAllowed()) {
			pager.setTotal(query.list().size());
			//pager.setPageCount(pager.getT);
			query.setFirstResult((pager.getPage() - 1) * pager.getPageSize());
			query.setMaxResults(pager.getPageSize());
		}
		
		ListResult<Requisition> listResults = new ListResult();
		listResults.setPager(pager);
		listResults.setResults(query.list());
		return listResults;
	}
	
	public ListResult<Requisition> getRequisitionsByRequestedLocation(String requestedLocationUuid, Pager pager,
	        RequisitionStatus.RequisitionStatusCode status, Requisition.OrderByDirection orderByDirection, String q,
	        Date startDate, Date endDate) {
		DbSession session = this.getSession();
		System.out.println(status);
		String queryStr = "SELECT rq \n"
		        + "FROM Requisition rq \n"
		        + "WHERE rq.requestedLocation = (SELECT l FROM Location l WHERE l.uuid = :requestedLocationUuid) AND rq.voided = false";
		
		if (status != null) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}
			
			if (status != RequisitionStatus.RequisitionStatusCode.PENDING) {
				queryStr += " rq IN ( SELECT rs.requisition FROM RequisitionStatus rs WHERE rs.status = :status)";
			}
			if (status == RequisitionStatus.RequisitionStatusCode.PENDING) {
				queryStr += "rq NOT IN (SELECT rs.requisition FROM RequisitionStatus rs)";
			}
		}
		
		if (startDate != null && endDate != null) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND";
			}
			queryStr += " (cast(rq.dateCreated as date) BETWEEN :startDate AND :endDate)";
		}
		
		if (q != null) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}
			
			queryStr += "lower(rq.code) like lower(:q) ";
		}
		
		if (orderByDirection != null) {
			if (orderByDirection == Requisition.OrderByDirection.DESC) {
				queryStr += " ORDER BY  rq.dateCreated DESC";
			}
			
			if (orderByDirection == Requisition.OrderByDirection.ASC) {
				queryStr += " ORDER BY  rq.dateCreated ASC";
			}
		}
		
		Query query = session.createQuery(queryStr);
		query.setParameter("requestedLocationUuid", requestedLocationUuid);
		if (status != null && status != RequisitionStatus.RequisitionStatusCode.PENDING) {
			query.setParameter("status", status);
		}
		
		if (startDate != null && endDate != null) {
			query.setParameter("startDate", startDate);
			query.setParameter("endDate", endDate);
		}
		
		if (q != null) {
			query.setParameter("q", "%" + q.replace(" ", "%") + "%");
		}
		
		if (pager.isAllowed()) {
			pager.setTotal(query.list().size());
			//pager.setPageCount(pager.getT);
			query.setFirstResult((pager.getPage() - 1) * pager.getPageSize());
			query.setMaxResults(pager.getPageSize());
		}
		
		ListResult<Requisition> listResults = new ListResult();
		listResults.setPager(pager);
		listResults.setResults(query.list());
		return listResults;
		
	}
	
	public Requisition updateRequisition(Requisition requisition) {
		DbSession dbSession = this.getSession();
		String queryStr = "UPDATE Requisition rq";
		
		if (requisition.getVoided() != null) {
			if (!queryStr.contains("SET")) {
				queryStr += " SET ";
			} else {
				queryStr += " ,";
			}
			queryStr += " rq.voided = :voided";
		}
		
		queryStr += " WHERE rq.uuid = :uuid";
		
		Query query = dbSession.createQuery(queryStr);
		
		query.setParameter("uuid", requisition.getUuid());
		
		if (requisition.getVoided() != null) {
			query.setParameter("voided", requisition.getVoided());
		}
		
		Integer success = query.executeUpdate();
		
		if (success == 1) {
			return requisition;
		} else {
			return null;
		}
		
	}
}
