package org.openmrs.module.icare.dhis.dao;

import org.hibernate.Query;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.api.db.hibernate.DbSessionFactory;
import org.openmrs.module.icare.core.dao.BaseDAO;
import org.openmrs.module.icare.dhis.models.DhisDatasetTransaction;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class DhisDatasetTransactionDAO extends BaseDAO<DhisDatasetTransaction> {
	
	public List<DhisDatasetTransaction> getDhisTransactionByReport(String period) {
		DbSession session = this.getSession();
		String queryStr = "SELECT dt \n" + "FROM DhisDatasetTransaction dt \n" + "WHERE dt.reportPeriod = :period";
		
		Query query = session.createQuery(queryStr);
		query.setParameter("period", period);
		
		return query.list();
	}
	
	public List<DhisDatasetTransaction> getDhisTransactionByPeriod(String reportId) {
		DbSession session = this.getSession();
		String queryStr = "SELECT dt \n" + "FROM DhisDatasetTransaction dt \n" + "WHERE dt.reportId = :reportId";
		
		Query query = session.createQuery(queryStr);
		query.setParameter("reportId", reportId);
		
		return query.list();
	}
	
	public List<DhisDatasetTransaction> getDhisTransactionByPeriodAndReport(String reportId, String reportPeriod) {
		DbSession session = this.getSession();
		String queryStr = "SELECT dt \n" + "FROM DhisDatasetTransaction dt \n"
		        + "WHERE dt.reportId = :reportId AND dt.reportPeriod = :reportPeriod";
		
		Query query = session.createQuery(queryStr);
		query.setParameter("reportId", reportId);
		query.setParameter("reportPeriod", reportPeriod);
		
		return query.list();
	}
}
