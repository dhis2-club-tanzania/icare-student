package org.openmrs.module.icare.auditlog.strategy;

import org.openmrs.api.context.Context;
import org.openmrs.module.icare.auditlog.AuditLogHelper;

public final class AllAuditStrategy extends BaseAuditStrategy {
	
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
		return helper;
	}
	
	/**
	 * @see AuditStrategy#isAudited(Class)
	 * @should always return true
	 */
	@Override
	public boolean isAudited(Class<?> clazz) {
		return true;
	}
}
