package org.openmrs.module.icare.auditlog.strategy;

import java.util.Set;

public class NoneExceptAuditStrategy extends ExceptionBasedAuditStrategy {
	
	/**
	 * @see ConfigurableAuditStrategy#startAuditing(java.util.Set)
	 * @should update the exception class names global property
	 * @should mark a class and its known subclasses as audited
	 * @should also mark association types as audited
	 * @should not mark association types for many to many collections as audited
	 */
	@Override
	public void startAuditing(Set<Class<?>> clazzes) {
		getHelper().updateGlobalProperty(clazzes, true);
	}
	
	/**
	 * @see ConfigurableAuditStrategy#stopAuditing(java.util.Set)
	 * @should update the exception class names global property
	 * @should mark a class and its known subclasses as un audited
	 * @should remove association types from audited classes
	 * @should not remove explicitly monitored association types when the parent is removed
	 */
	@Override
	public void stopAuditing(Set<Class<?>> clazzes) {
		getHelper().updateGlobalProperty(clazzes, false);
	}
	
	/**
	 * @see ConfigurableAuditStrategy#isAudited(Class)
	 * @should return true if the class is audited for none except strategy
	 * @should return false if the class is not audited for none except strategy
	 */
	@Override
	public boolean isAudited(Class<?> clazz) {
		return getExceptions().contains(clazz);
	}
}
