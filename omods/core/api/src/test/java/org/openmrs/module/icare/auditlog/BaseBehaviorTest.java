//package org.openmrs.module.icare.auditlog;
//
//import junit.framework.Assert;
//import org.junit.Before;
//import org.openmrs.api.ConceptService;
//import org.openmrs.api.EncounterService;
//import org.openmrs.api.context.Context;
//import java.io.Serializable;
//import java.util.List;
//
//public class BaseBehaviorTest extends BaseAuditLogTest {
//
//	protected ConceptService conceptService;
//
//	protected EncounterService encounterService;
//
//	@Before
//	public void setup() throws Exception {
//		conceptService = Context.getConceptService();
//		encounterService = Context.getEncounterService();
//		//No log entries should be existing
//		Assert.assertTrue(getAllLogs().isEmpty());
//	}
//
//	/**
//	 * Utility method to get all logs
//	 *
//	 * @return a list of {@link AuditLog}s
//	 */
//	protected List<AuditLog> getAllLogs() {
//		return auditLogService.getAuditLogs(null, null, null, null, false, null, null);
//	}
//
//	/**
//	 * Utility method to get all logs for a specific object
//	 *
//	 * @return a list of {@link AuditLog}s
//	 */
//	protected List<AuditLog> getAllLogs(Serializable id, Class<?> clazz, List<String> actions) {
//		return auditLogService.getAuditLogs(id, clazz, actions, null, null, false);
//	}
//}
