package org.openmrs.module.icare.auditlog.strategy;

public interface AuditStrategy {
	
	AuditStrategy ALL = new AllAuditStrategy();
	
	AuditStrategy NONE = new NoneAuditStrategy();
	
	AuditStrategy NONE_EXCEPT = new NoneExceptAuditStrategy();
	
	AuditStrategy ALL_EXCEPT = new AllExceptAuditStrategy();
	
	String SHORT_NAME_ALL = "ALL";
	
	String SHORT_NAME_ALL_EXCEPT = "ALL_EXCEPT";
	
	String SHORT_NAME_NONE = "NONE";
	
	String SHORT_NAME_NONE_EXCEPT = "NONE_EXCEPT";
	
	/**
	 * Implementations of this method should return true if the specified type is audited otherwise
	 * false
	 * 
	 * @param clazz the class to check
	 */
	boolean isAudited(Class<?> clazz);
	
}
