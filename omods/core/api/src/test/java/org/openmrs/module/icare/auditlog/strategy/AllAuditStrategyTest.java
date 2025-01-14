//package org.openmrs.module.icare.auditlog.strategy;
//
//import org.junit.Test;
//import org.openmrs.Location;
//import org.openmrs.module.icare.auditlog.BaseAuditLogTest;
//
//import static junit.framework.Assert.assertEquals;
//
//public class AllAuditStrategyTest extends BaseAuditLogTest {
//
//	/**
//	 * @verifies always return true
//	 * @see AllAuditStrategy#isAudited(Class)
//	 */
//	@Test
//	public void isAudited_shouldAlwaysReturnTrue() throws Exception {
//		assertEquals(false, auditLogService.isAudited(Location.class));
//		setAuditConfiguration(AuditStrategy.ALL, null, false);
//		assertEquals(AuditStrategy.ALL, auditLogService.getAuditingStrategy());
//		assertEquals(true, auditLogService.isAudited(Location.class));
//	}
//}
