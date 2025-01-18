package org.openmrs.module.icare.auditlog.api.db;

import org.openmrs.module.icare.auditlog.AuditLog;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

public interface AuditLogDAO {
	
	public List<AuditLog> getAuditLogs(Serializable id, List<Class<?>> types, List<String> actions, Date startDate,
	        Date endDate, boolean excludeChildAuditLogs, Integer start, Integer length);
	
	/**
	 * Saves the specified object to the database
	 * 
	 * @param object the object to save
	 * @return the saved audit log
	 */
	public <T> T save(T object);
	
	public void delete(Object object);
	
	public <T> T getObjectById(Class<T> clazz, Serializable id);
	
	public <T> T getObjectByUuid(Class<T> clazz, String uuid);
	
	/**
	 * Returns true or false depending on the value of the
	 * AuditLogConstants#GP_STORE_LAST_STATE_OF_DELETED_ITEMS global property
	 * 
	 * @return true is allowed otherwise false
	 */
	public boolean storeLastStateOfDeletedItems();
	
	/**
	 * Returns unique database identifier for the specified persistent object
	 * 
	 * @return the unique identifier
	 * @should return the database id of the object
	 */
	public Serializable getId(Object object);
}
