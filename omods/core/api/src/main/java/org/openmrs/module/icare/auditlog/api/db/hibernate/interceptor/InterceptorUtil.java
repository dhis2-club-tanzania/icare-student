package org.openmrs.module.icare.auditlog.api.db.hibernate.interceptor;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.EntityMode;
import org.hibernate.SessionFactory;
import org.hibernate.metadata.ClassMetadata;
import org.openmrs.api.context.Context;
import org.openmrs.module.icare.auditlog.AuditLog;
import org.openmrs.module.icare.auditlog.AuditLogHelper;
import org.openmrs.module.icare.auditlog.api.db.AuditLogDAO;
import org.openmrs.module.icare.auditlog.api.db.DAOUtils;
import org.openmrs.module.icare.auditlog.util.AuditLogUtil;
import java.io.Serializable;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

final class InterceptorUtil {
	
	private static final Log log = LogFactory.getLog(InterceptorUtil.class);
	
	private static AuditLogDAO auditLogDao;
	
	private static AuditLogHelper helper;
	
	/**
	 * @return the dao
	 */
	static AuditLogDAO getAuditLogDao() {
		if (auditLogDao == null) {
			auditLogDao = Context.getRegisteredComponents(AuditLogDAO.class).get(0);
		}
		return auditLogDao;
	}
	
	/**
	 * @return the helper
	 */
	static AuditLogHelper getHelper() {
		if (helper == null) {
			helper = Context.getRegisteredComponents(AuditLogHelper.class).get(0);
		}
		return helper;
	}
	
	static void saveAuditLog(AuditLog auditLog) {
		getAuditLogDao().save(auditLog);
	}
	
	/**
	 * Checks if a class is marked as audited or is explicitly audited
	 * 
	 * @param clazz the clazz to check
	 * @return true if is audited or implicitly audited otherwise false
	 */
	static boolean isAudited(Class<?> clazz) {
		return getHelper().isAudited(clazz) || getHelper().isImplicitlyAudited(clazz);
	}
	
	/**
	 * Serializes mapped hibernate objects
	 * 
	 * @param object the object to serialize
	 * @return the serialized JSON text
	 */
	static String serializePersistentObject(Object object) {
		//TODO Might be better to use xstream
		Map<String, Object> propertyNameValueMap = null;
		ClassMetadata cmd = DAOUtils.getClassMetadata(AuditLogUtil.getActualType(object));
		if (cmd != null) {
			propertyNameValueMap = new HashMap<String, Object>();
			propertyNameValueMap.put(cmd.getIdentifierPropertyName(), cmd.getIdentifier(object));
			for (String propertyName : cmd.getPropertyNames()) {
				Object value = cmd.getPropertyValue(object, propertyName);
				if (value != null) {
					Object serializedValue = null;
					if (cmd.getPropertyType(propertyName).isCollectionType()) {
						if (Collection.class.isAssignableFrom(value.getClass())) {
							serializedValue = AuditLogUtil.serializeCollectionItems((Collection) value);
						} else if (Map.class.isAssignableFrom(value.getClass())) {
							serializedValue = AuditLogUtil.serializeMapItems((Map) value);
						}
					} else {
						serializedValue = AuditLogUtil.serializeObject(value);
					}
					if (serializedValue != null) {
						propertyNameValueMap.put(propertyName, serializedValue);
					}
				}
			}
		}
		
		return AuditLogUtil.serializeToJson(propertyNameValueMap);
	}
	
	static SessionFactory getSessionFactory() {
		return Context.getRegisteredComponents(SessionFactory.class).get(0);
	}
	
	static boolean storeLastStateOfDeletedItems() {
		return getAuditLogDao().storeLastStateOfDeletedItems();
	}
	
	static Serializable getId(Object object) {
		return getAuditLogDao().getId(object);
	}
}
