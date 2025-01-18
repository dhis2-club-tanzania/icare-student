package org.openmrs.module.icare.auditlog.strategy;

public final class NoneAuditStrategy extends BaseAuditStrategy {
	
	/**
	 * @see AuditStrategy#isAudited(Class)
	 * @should always return false
	 */
	@Override
	public final boolean isAudited(Class<?> clazz) {
		return false;
	}
}
