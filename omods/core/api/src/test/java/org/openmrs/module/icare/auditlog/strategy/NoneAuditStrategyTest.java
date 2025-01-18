//package org.openmrs.module.icare.auditlog.strategy;
//
//import org.junit.Test;
//import org.openmrs.EncounterType;
//import org.openmrs.module.icare.auditlog.BaseAuditLogTest;
//
//import static junit.framework.Assert.assertEquals;
//
//public class NoneAuditStrategyTest extends BaseAuditLogTest {
//
//	/**
//	 * @verifies always return false
//	 * @see NoneAuditStrategy#isAudited(Class)
//	 */
//	@Test
//	public void isAudited_shouldAlwaysReturnFalse() throws Exception {
//		assertEquals(true, auditLogService.isAudited(EncounterType.class));
//		setAuditConfiguration(AuditStrategy.NONE, null, false);
//		assertEquals(AuditStrategy.NONE, auditLogService.getAuditingStrategy());
//		assertEquals(false, auditLogService.isAudited(EncounterType.class));
//	}
//}
