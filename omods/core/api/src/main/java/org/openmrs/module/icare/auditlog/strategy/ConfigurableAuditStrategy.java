package org.openmrs.module.icare.auditlog.strategy;

import java.util.Set;

public abstract class ConfigurableAuditStrategy extends BaseAuditStrategy {
	
	/**
	 * Implementing classes should mark the specified classes as audited
	 * 
	 * @param clazzes the classes to audit
	 */
	public abstract void startAuditing(Set<Class<?>> clazzes);
	
	/**
	 * Implementing classes should un mark the specified classes as audited
	 * 
	 * @param clazzes the classes to stop auditing
	 */
	public abstract void stopAuditing(Set<Class<?>> clazzes);
}
