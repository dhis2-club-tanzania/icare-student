package org.openmrs.module.icare.auditlog.strategy;

public abstract class BaseAuditStrategy implements AuditStrategy {
	
	@Override
	public boolean equals(Object o) {
		if (o == null) {
			return false;
		}
		return getClass().equals(o.getClass());
	}
	
	@Override
	public int hashCode() {
		return getClass().hashCode();
	}
}
