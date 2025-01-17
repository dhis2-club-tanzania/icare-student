package org.openmrs.module.icare.auditlog.api;

import org.openmrs.annotation.Authorized;
import org.openmrs.api.OpenmrsService;
import org.openmrs.module.icare.auditlog.AuditLog;
import org.openmrs.module.icare.auditlog.strategy.AuditStrategy;
import org.openmrs.module.icare.auditlog.util.AuditLogConstants;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

public interface AuditLogService extends OpenmrsService {
	
	/**
	 * Checks if the specified type is audited
	 * 
	 * @param clazz the class to check
	 * @return true if the object is an audited one otherwise false
	 * @should return false for core exceptions
	 */
	@Authorized(AuditLogConstants.CHECK_FOR_AUDITED_ITEMS)
	public boolean isAudited(Class<?> clazz);
	
	//@Authorized(AuditLogConstants.PRIV_GET_AUDITLOGS)
	public List<AuditLog> getAuditLogs(List<Class<?>> clazzes, List<String> actions, Date startDate, Date endDate,
	        boolean excludeChildAuditLogs, Integer start, Integer length);
	
	/**
	 * Fetches a saved object with the specified objectId
	 * 
	 * @param id the id to match against
	 * @return the matching saved object
	 * @should get the saved object matching the specified arguments
	 */
	@Authorized(AuditLogConstants.PRIV_GET_ITEMS)
	public <T> T getObjectById(Class<T> clazz, Serializable id);
	
	/**
	 * Fetches a saved object with the specified uuid
	 * 
	 * @param uuid the uuid to match against
	 * @return the matching saved object
	 * @should get the saved object matching the specified arguments
	 */
	@Authorized(AuditLogConstants.PRIV_GET_ITEMS)
	public <T> T getObjectByUuid(Class<T> clazz, String uuid);
	
	@Authorized(AuditLogConstants.PRIV_GET_AUDIT_STRATEGY)
	public AuditStrategy getAuditingStrategy();
	
	/**
	 * Gets all audit logs for the object that matches the specified uuid and class that match the
	 * other specified arguments
	 * 
	 * @param id
	 * @param clazz the Class of the object to match against
	 * @param actions the actions to match against
	 * @param startDate the start date to match against
	 * @param endDate the end date to match against
	 * @param excludeChildAuditLogs specifies if AuditLogs for collection items should excluded or
	 *            not
	 * @return a list of audit logs
	 * @should get all logs for the object matching the specified uuid
	 * @should include logs for subclasses when getting by type
	 * @should exclude child logs for object if excludeChildAuditLogs is set to true
	 */
	//@Authorized(AuditLogConstants.PRIV_GET_AUDITLOGS)
	public List<AuditLog> getAuditLogs(Serializable id, Class<?> clazz, List<String> actions, Date startDate, Date endDate,
	        boolean excludeChildAuditLogs);
	
	/**
	 * Gets all audit logs for the object that match the other specified arguments
	 * 
	 * @param object the uuid of the object to match against
	 * @param actions the actions to match against
	 * @param startDate the start date to match against
	 * @param endDate the end date to match against
	 * @param excludeChildAuditLogs specifies if AuditLogs for collection items should excluded or
	 *            not
	 * @return a list of audit logs
	 * @should get all logs for the specified object
	 */
	//@Authorized(AuditLogConstants.PRIV_GET_AUDITLOGS)
	public List<AuditLog> getAuditLogs(Object object, List<String> actions, Date startDate, Date endDate,
	        boolean excludeChildAuditLogs);
}
