//package org.openmrs.module.icare.auditlog;
//
//import org.apache.commons.lang.StringUtils;
//import org.junit.Before;
//import org.openmrs.*;
//import org.openmrs.api.context.Context;
//import org.openmrs.module.icare.auditlog.api.AuditLogService;
//import org.openmrs.module.icare.auditlog.strategy.AuditStrategy;
//import org.openmrs.module.icare.auditlog.strategy.ConfigurableAuditStrategy;
//import org.openmrs.module.icare.auditlog.strategy.ExceptionBasedAuditStrategy;
//import org.openmrs.module.icare.auditlog.util.AuditLogConstants;
//import org.openmrs.module.icare.auditlog.util.AuditLogUtil;
//import org.openmrs.test.BaseModuleContextSensitiveTest;
//import org.openmrs.util.OpenmrsUtil;
//
//import java.util.HashSet;
//import java.util.Set;
//
//import static junit.framework.Assert.assertEquals;
//import static junit.framework.Assert.assertTrue;
//
//public class BaseAuditLogTest extends BaseModuleContextSensitiveTest {
//
//	protected static final String MODULE_TEST_DATA = "audit-log.xml";
//
//	protected AuditLogService auditLogService;
//
//	protected AuditLogHelper helper;
//
//	@Before
//	public void before() throws Exception {
//		auditLogService = Context.getService(AuditLogService.class);
//		helper = Context.getRegisteredComponents(AuditLogHelper.class).get(0);
//		executeDataSet(MODULE_TEST_DATA);
//		String exceptionsGpValue = "org.openmrs.Concept,org.openmrs.EncounterType,org.openmrs.PatientIdentifierType";
//		setAuditConfiguration(AuditStrategy.NONE_EXCEPT, exceptionsGpValue, false);
//		ExceptionBasedAuditStrategy strategy = (ExceptionBasedAuditStrategy) auditLogService.getAuditingStrategy();
//		assertEquals(AuditStrategy.NONE_EXCEPT, strategy);
//		Set<Class<?>> exceptions = strategy.getExceptions();
//		System.out.println("size: " + exceptions.getClass().getName());
//		assertEquals(5, exceptions.size());
//		assertTrue(OpenmrsUtil.collectionContains(exceptions, Concept.class));
//		assertTrue(OpenmrsUtil.collectionContains(exceptions, ConceptNumeric.class));
//		assertTrue(OpenmrsUtil.collectionContains(exceptions, ConceptComplex.class));
//		assertTrue(OpenmrsUtil.collectionContains(exceptions, EncounterType.class));
//		assertTrue(OpenmrsUtil.collectionContains(exceptions, PatientIdentifierType.class));
//	}
//
//	protected void setAuditConfiguration(AuditStrategy strategy, String exceptionsString,
//	        boolean storeLastStateOfDeletedItems) throws Exception {
//
//		AuditLogUtil.setGlobalProperty(AuditLogConstants.GP_AUDITING_STRATEGY, strategy.getClass().getName());
//		assertEquals(strategy, auditLogService.getAuditingStrategy());
//		if (exceptionsString != null) {
//			AuditLogUtil.setGlobalProperty(ExceptionBasedAuditStrategy.GLOBAL_PROPERTY_EXCEPTION, exceptionsString);
//		}
//		String value = storeLastStateOfDeletedItems ? "true" : "false";
//		AuditLogUtil.setGlobalProperty(AuditLogConstants.GP_STORE_LAST_STATE_OF_DELETED_ITEMS, value);
//		if (!ExceptionBasedAuditStrategy.class.isAssignableFrom(strategy.getClass())) {
//			String exceptionsGpValue = Context.getAdministrationService().getGlobalProperty(
//			    ExceptionBasedAuditStrategy.GLOBAL_PROPERTY_EXCEPTION);
//			assertEquals(true, StringUtils.isBlank(exceptionsGpValue));
//		}
//	}
//
//	protected void startAuditing(Class<?> clazz) throws Exception {
//		Set<Class<?>> classes = new HashSet<Class<?>>();
//		classes.add(clazz);
//		startAuditing(classes);
//	}
//
//	protected void startAuditing(Set<Class<?>> classes) throws Exception {
//		((ConfigurableAuditStrategy) auditLogService.getAuditingStrategy()).startAuditing(classes);
//	}
//
//	protected void stopAuditing(Class<?> clazz) throws Exception {
//		Set<Class<?>> classes = new HashSet<Class<?>>();
//		classes.add(clazz);
//		stopAuditing(classes);
//	}
//
//	protected void stopAuditing(Set<Class<?>> classes) throws Exception {
//		((ConfigurableAuditStrategy) auditLogService.getAuditingStrategy()).stopAuditing(classes);
//	}
//}
