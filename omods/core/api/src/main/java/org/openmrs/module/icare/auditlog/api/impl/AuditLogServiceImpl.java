package org.openmrs.module.icare.auditlog.api.impl;

import org.apache.commons.lang.StringUtils;
import org.openmrs.api.APIException;
import org.openmrs.api.context.Context;
import org.openmrs.api.impl.BaseOpenmrsService;
import org.openmrs.module.icare.auditlog.AuditLog;
import org.openmrs.module.icare.auditlog.AuditLogHelper;
import org.openmrs.module.icare.auditlog.api.AuditLogService;
import org.openmrs.module.icare.auditlog.api.db.AuditLogDAO;
import org.openmrs.module.icare.auditlog.api.db.DAOUtils;
import org.openmrs.module.icare.auditlog.strategy.AuditStrategy;
import org.openmrs.module.icare.auditlog.util.AuditLogConstants;
import org.openmrs.util.OpenmrsUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Transactional
public class AuditLogServiceImpl extends BaseOpenmrsService implements AuditLogService {
	
	private AuditLogDAO dao;
	
	@Autowired
	private AuditLogHelper helper;
	
	/**
	 * @param dao the dao to set
	 */
	public void setDao(AuditLogDAO dao) {
		this.dao = dao;
	}
	
	/**
	 * @param helper the helper to set
	 */
	public void setHelper(AuditLogHelper helper) {
		this.helper = helper;
	}
	
	/**
	 * @see AuditLogService#isAudited(Class)
	 * @param clazz
	 */
	@Transactional(readOnly = true)
	public boolean isAudited(Class<?> clazz) {
		return helper.isAudited(clazz);
	}
	
	@SuppressWarnings({ "rawtypes" })
	@Override
	@Transactional(readOnly = true)
	public List<AuditLog> getAuditLogs(List<Class<?>> clazzes, List<String> actions, Date startDate, Date endDate,
	        boolean excludeChildAuditLogs, Integer start, Integer length) {
		if (OpenmrsUtil.compareWithNullAsEarliest(startDate, new Date()) > 0) {
			throw new APIException(Context.getMessageSourceService().getMessage(
			    AuditLogConstants.MODULE_ID + ".exception.startDateInFuture"));
		}
		
		List<Class<?>> classesToMatch = null;
		if (clazzes != null) {
			classesToMatch = new ArrayList<Class<?>>();
			for (Class clazz : clazzes) {
				classesToMatch.add(clazz);
				for (Class subclass : DAOUtils.getPersistentConcreteSubclasses(clazz)) {
					classesToMatch.add(subclass);
				}
			}
			
		}
		
		return dao.getAuditLogs(null, classesToMatch, actions, startDate, endDate, excludeChildAuditLogs, start, length);
	}
	
	/**
	 * @see AuditLogService#getObjectById(Class, java.io.Serializable)
	 */
	@Override
	@Transactional(readOnly = true)
	public <T> T getObjectById(Class<T> clazz, Serializable id) {
		return dao.getObjectById(clazz, id);
	}
	
	@Override
	@Transactional(readOnly = true)
	public <T> T getObjectByUuid(Class<T> clazz, String uuid) {
		if (StringUtils.isBlank(uuid)) {
			return null;
		}
		
		return dao.getObjectByUuid(clazz, uuid);
	}
	
	@Override
	@Transactional(readOnly = true)
	public AuditStrategy getAuditingStrategy() {
		return helper.getAuditingStrategy();
	}
	
	@Override
	@Transactional(readOnly = true)
	public List<AuditLog> getAuditLogs(Serializable id, Class<?> clazz, List<String> actions, Date startDate, Date endDate,
	        boolean excludeChildAuditLogs) {
		
		if (id == null || clazz == null) {
			throw new APIException("class and uuid are required when fetching AuditLogs for an object");
		}
		
		List<Class<?>> clazzes = new ArrayList<Class<?>>();
		clazzes.add(clazz);
		for (Class subclass : DAOUtils.getPersistentConcreteSubclasses(clazz)) {
			clazzes.add(subclass);
		}
		System.out.println("a" + clazzes);
		return dao.getAuditLogs(id, clazzes, actions, startDate, endDate, excludeChildAuditLogs, null, null);
	}
	
	/**
	 * @see AuditLogService#getAuditLogs(Object, java.util.List, java.util.Date, java.util.Date,
	 *      boolean)
	 */
	@Override
	@Transactional(readOnly = true)
	public List<AuditLog> getAuditLogs(Object object, List<String> actions, Date startDate, Date endDate,
	        boolean excludeChildAuditLogs) {
		System.out.println("b");
		return getAuditLogs(dao.getId(object), object.getClass(), actions, startDate, endDate, excludeChildAuditLogs);
	}
}
