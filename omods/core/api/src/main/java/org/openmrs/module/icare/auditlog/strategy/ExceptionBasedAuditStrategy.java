package org.openmrs.module.icare.auditlog.strategy;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.api.context.Context;
import org.openmrs.module.icare.auditlog.AuditLogHelper;
import org.openmrs.module.icare.auditlog.util.AuditLogConstants;

import java.util.Set;

public abstract class ExceptionBasedAuditStrategy extends ConfigurableAuditStrategy {
	
	protected final Log log = LogFactory.getLog(getClass());
	
	public static final String GLOBAL_PROPERTY_EXCEPTION = AuditLogConstants.MODULE_ID + ".exceptions";
	
	private AuditLogHelper helper = null;
	
	/**
	 * Gets the AuditLogHelper instance
	 * 
	 * @return
	 */
	public AuditLogHelper getHelper() {
		
		if (helper == null) {
			helper = Context.getRegisteredComponents(AuditLogHelper.class).get(0);
		}
		System.out.println("exceptions: " + helper.getExceptions());
		return helper;
	}
	
	/**
	 * Returns a set of exception classes as specified by the {@link org.openmrs.GlobalProperty}
	 * GLOBAL_PROPERTY_EXCEPTION
	 * 
	 * @return a set of audited classes
	 * @should return a set of exception classes
	 */
	public Set<Class<?>> getExceptions() {
		return getHelper().getExceptions();
	}
}
