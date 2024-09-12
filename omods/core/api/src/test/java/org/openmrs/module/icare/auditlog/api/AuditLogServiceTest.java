//package org.openmrs.module.icare.auditlog.api;
//
//import org.apache.commons.lang.ArrayUtils;
//import org.junit.Rule;
//import org.junit.Test;
//import org.junit.rules.ExpectedException;
//import org.openmrs.*;
//import org.openmrs.api.APIException;
//import org.openmrs.api.context.Context;
//import org.openmrs.module.icare.auditlog.AuditLog;
//import org.openmrs.module.icare.auditlog.BaseAuditLogTest;
//import org.openmrs.module.icare.auditlog.api.db.AuditLogDAO;
//import org.openmrs.module.icare.auditlog.strategy.AuditStrategy;
//import org.openmrs.test.Verifies;
//import org.openmrs.util.OpenmrsUtil;
//import java.util.ArrayList;
//import java.util.Calendar;
//import java.util.Date;
//import java.util.List;
//import static junit.framework.Assert.*;
//import static junit.framework.Assert.assertEquals;
//
//public class AuditLogServiceTest extends BaseAuditLogTest {
//
//	private static final String MODULE_TEST_DATA_AUDIT_LOGS = "initial-audit-logs.xml";
//
//	private static final String EXCEPTIONS_FOR_ALL_EXCEPT = "org.openmrs.Concept, org.openmrs.EncounterType";
//
//	@Rule
//	public ExpectedException expectedException = ExpectedException.none();
//
//	private List<AuditLog> getAllAuditLogs() {
//		return auditLogService.getAuditLogs(null, null, null, null, false, null, null);
//	}
//
//	private AuditLogDAO getAuditLogDAO() {
//		return Context.getRegisteredComponents(AuditLogDAO.class).get(0);
//	}
//
//	private void setAuditConfiguration(AuditStrategy strategy) throws Exception {
//		setAuditConfiguration(strategy, null, false);
//	}
//
//	/**
//	 * @see {@link AuditLogService#getObjectById(Class, java.io.Serializable)}
//	 */
//	@Test
//	@Verifies(value = "should get the saved object matching the specified arguments", method = "get(Class<T>,Integer)")
//	public void getObjectById_shouldGetTheSavedObjectMatchingTheSpecifiedArguments() throws Exception {
//		executeDataSet(MODULE_TEST_DATA_AUDIT_LOGS);
//		AuditLog al = auditLogService.getObjectById(AuditLog.class, 1);
//		assertEquals("4f7d57f0-9077-11e1-aaa4-00248140a5eb", al.getUuid());
//
//		//check the child logs
//		assertEquals(2, al.getChildAuditLogs().size());
//		String[] childUuids = new String[2];
//		int index = 0;
//		for (AuditLog child : al.getChildAuditLogs()) {
//			childUuids[index] = child.getUuid();
//			assertEquals(al, child.getParentAuditLog());
//			index++;
//		}
//		assertTrue(ArrayUtils.contains(childUuids, "5f7d57f0-9077-11e1-aaa4-00248140a5ef"));
//		assertTrue(ArrayUtils.contains(childUuids, "6f7d57f0-9077-11e1-aaa4-00248140a5ef"));
//	}
//
//	/**
//	 * @see {@link AuditLogService#getAuditLogs(java.util.List, java.util.List, java.util.Date, java.util.Date, boolean, Integer, Integer)}
//	 */
//	@Test
//	@Verifies(value = "should match on the specified audit log actions", method = "getAuditLogs(Class<*>,List<Action>,Date,Date,Integer,Integer)")
//	public void getAuditLogs_shouldMatchOnTheSpecifiedAuditLogActions() throws Exception {
//		executeDataSet(MODULE_TEST_DATA_AUDIT_LOGS);
//		List<String> actions = new ArrayList<String>();
//		actions.add("CREATED");//get only inserts
//		assertEquals(3, auditLogService.getAuditLogs(null, actions, null, null, false, null, null).size());
//
//		actions.add("UPDATED");//get both insert and update logs
//		assertEquals(5, auditLogService.getAuditLogs(null, actions, null, null, false, null, null).size());
//
//		actions.clear();
//		actions.add("UPDATED");//get only updates
//		assertEquals(2, auditLogService.getAuditLogs(null, actions, null, null, false, null, null).size());
//
//		actions.clear();
//		actions.add("DELETED");//get only deletes
//		assertEquals(1, auditLogService.getAuditLogs(null, actions, null, null, false, null, null).size());
//	}
//
//	/**
//	 * @see {@link AuditLogService#getAuditLogs(java.util.List, java.util.List, java.util.Date, java.util.Date, boolean, Integer, Integer)}
//	 */
//	@Test
//	@Verifies(value = "should return all audit logs in the database if all args are null", method = "getAuditLogs(Class<*>,List<Action>,Date,Date,Integer,Integer)")
//	public void getAuditLogs_shouldReturnAllAuditLogsInTheDatabaseIfAllArgsAreNull() throws Exception {
//		executeDataSet(MODULE_TEST_DATA_AUDIT_LOGS);
//		assertEquals(6, getAllAuditLogs().size());
//	}
//
//	/**
//	 * @see {@link AuditLogService#getAuditLogs(java.util.List, java.util.List, java.util.Date, java.util.Date, boolean, Integer, Integer)}
//	 */
//	@Test
//	@Verifies(value = "should match on the specified classes", method = "getAuditLogs(List<Class<?>>,List<Action>,Date,Date,Integer,Integer)")
//	public void getAuditLogs_shouldMatchOnTheSpecifiedClasses() throws Exception {
//		executeDataSet(MODULE_TEST_DATA_AUDIT_LOGS);
//		List<Class<?>> clazzes = new ArrayList<Class<?>>();
//		clazzes.add(Concept.class);
//		assertEquals(3, auditLogService.getAuditLogs(clazzes, null, null, null, false, null, null).size());
//		clazzes.add(ConceptName.class);
//		assertEquals(4, auditLogService.getAuditLogs(clazzes, null, null, null, false, null, null).size());
//	}
//
//	/**
//	 * @see {@link AuditLogService#getAuditLogs(java.util.List, java.util.List, java.util.Date, java.util.Date, boolean, Integer, Integer)}
//	 */
//	@Test
//	@Verifies(value = "should return logs created on or after the specified startDate", method = "getAuditLogs(List<Class<?>>,List<Action>,Date,Date,Integer,Integer)")
//	public void getAuditLogs_shouldReturnLogsCreatedOnOrAfterTheSpecifiedStartDate() throws Exception {
//		executeDataSet(MODULE_TEST_DATA_AUDIT_LOGS);
//		Calendar cal = Calendar.getInstance();
//		cal.set(2012, Calendar.APRIL, 1, 0, 1, 0);
//		cal.set(Calendar.MILLISECOND, 0);
//		Date startDate = cal.getTime();
//		assertEquals(3, auditLogService.getAuditLogs(null, null, startDate, null, false, null, null).size());
//	}
//
//	/**
//	 * @see {@link AuditLogService#getAuditLogs(java.util.List, java.util.List, java.util.Date, java.util.Date, boolean, Integer, Integer)}
//	 */
//	@Test
//	@Verifies(value = "should return logs created on or before the specified endDate", method = "getAuditLogs(List<Class<?>>,List<Action>,Date,Date,Integer,Integer)")
//	public void getAuditLogs_shouldReturnLogsCreatedOnOrBeforeTheSpecifiedEndDate() throws Exception {
//		executeDataSet(MODULE_TEST_DATA_AUDIT_LOGS);
//		Calendar cal = Calendar.getInstance();
//		cal.set(2012, Calendar.APRIL, 1, 0, 3, 0);
//		cal.set(Calendar.MILLISECOND, 0);
//		Date endDate = cal.getTime();
//		assertEquals(5, auditLogService.getAuditLogs(null, null, null, endDate, false, null, null).size());
//	}
//
//	/**
//	 * @see {@link AuditLogService#getAuditLogs(java.util.List, java.util.List, java.util.Date, java.util.Date, boolean, Integer, Integer)}
//	 */
//	@Test
//	@Verifies(value = "should return logs created within the specified start and end dates", method = "getAuditLogs(List<Class<?>>,List<Action>,Date,Date,Integer,Integer)")
//	public void getAuditLogs_shouldReturnLogsCreatedWithinTheSpecifiedStartAndEndDates() throws Exception {
//		executeDataSet(MODULE_TEST_DATA_AUDIT_LOGS);
//		Calendar cal = Calendar.getInstance();
//		cal.set(Calendar.MILLISECOND, 0);
//		cal.set(2012, Calendar.APRIL, 1, 0, 0, 1);
//		Date startDate = cal.getTime();
//		cal.set(2012, Calendar.APRIL, 1, 0, 3, 1);
//		Date endDate = cal.getTime();
//		assertEquals(2, auditLogService.getAuditLogs(null, null, startDate, endDate, false, null, null).size());
//	}
//
//	/**
//	 * @see {@link AuditLogService#getAuditLogs(java.util.List, java.util.List, java.util.Date, java.util.Date, boolean, Integer, Integer)}
//	 */
//	@Test(expected = APIException.class)
//	@Verifies(value = "should reject a start date that is in the future", method = "getAuditLogs(List<Class<?>>,List<Action>,Date,Date,Integer,Integer)")
//	public void getAuditLogs_shouldRejectAStartDateThatIsInTheFuture() throws Exception {
//		Calendar cal = Calendar.getInstance();
//		cal.add(Calendar.MINUTE, 1);
//		Date startDate = cal.getTime();
//		auditLogService.getAuditLogs(null, null, startDate, null, false, null, null);
//	}
//
//	/**
//	 * @see {@link AuditLogService#getAuditLogs(java.util.List, java.util.List, java.util.Date, java.util.Date, boolean, Integer, Integer)}
//	 */
//	@Test
//	@Verifies(value = "should ignore end date it it is in the future", method = "getAuditLogs(List<Class<?>>,List<Action>,Date,Date,Integer,Integer)")
//	public void getAuditLogs_shouldIgnoreEndDateItItIsInTheFuture() throws Exception {
//		executeDataSet(MODULE_TEST_DATA_AUDIT_LOGS);
//		Calendar cal = Calendar.getInstance();
//		cal.add(Calendar.MINUTE, 1);
//		Date endDate = cal.getTime();
//		assertEquals(6, auditLogService.getAuditLogs(null, null, null, endDate, false, null, null).size());
//	}
//
//	/**
//	 * @see {@link AuditLogService#getAuditLogs(java.util.List, java.util.List, java.util.Date, java.util.Date, boolean, Integer, Integer)}
//	 */
//	@Test
//	@Verifies(value = "should sort the logs by date of creation starting with the latest", method = "getAuditLogs(List<Class<?>>,List<Action>,Date,Date,Integer,Integer)")
//	public void getAuditLogs_shouldSortTheLogsByDateOfCreationStartingWithTheLatest() throws Exception {
//		executeDataSet(MODULE_TEST_DATA_AUDIT_LOGS);
//		List<AuditLog> auditLogs = getAllAuditLogs();
//		assertFalse(auditLogs.isEmpty());
//		Date currMaxDate = auditLogs.get(0).getDateCreated();
//		for (AuditLog auditLog : auditLogs) {
//			assertTrue(OpenmrsUtil.compare(currMaxDate, auditLog.getDateCreated()) >= 0);
//		}
//	}
//
//	/**
//	 * @see {@link AuditLogService#getObjectByUuid(Class, String)}
//	 */
//	@Test
//	@Verifies(value = "should get the saved object matching the specified arguments", method = "getObjectByUuid(Class<T>,String)")
//	public void getObjectByUuid_shouldGetTheSavedObjectMatchingTheSpecifiedArguments() throws Exception {
//		assertNull(auditLogService.getObjectByUuid(Location.class, "Unknown uuid"));
//		Location description = auditLogService.getObjectByUuid(Location.class, "dc5c1fcc-0459-4201-bf70-0b90535ba362");
//		assertNotNull(description);
//		assertEquals(1, description.getId().intValue());
//
//	}
//
//	/**
//	 * @see {@link AuditLogService#getAuditLogs(java.util.List, java.util.List, java.util.Date, java.util.Date, boolean, Integer, Integer)}
//	 */
//	@Test
//	@Verifies(value = "should include logs for subclasses when getting logs by type", method = "getAuditLogs(List<Class<?>>,List<Action>,Date,Date,Integer,Integer)")
//	public void getAuditLogs_shouldIncludeLogsForSubclassesWhenGettingLogsByType() throws Exception {
//		executeDataSet(MODULE_TEST_DATA_AUDIT_LOGS);
//		List<Class<?>> clazzes = new ArrayList<Class<?>>();
//		clazzes.add(OpenmrsObject.class);
//		assertEquals(6, auditLogService.getAuditLogs(clazzes, null, null, null, false, null, null).size());
//		clazzes.clear();
//		clazzes.add(Concept.class);
//		assertEquals(3, auditLogService.getAuditLogs(clazzes, null, null, null, false, null, null).size());
//	}
//
//	/**
//	 * @see {@link AuditLogService#getAuditLogs(java.util.List, java.util.List, java.util.Date, java.util.Date, boolean, Integer, Integer)}
//	 */
//	@Test
//	@Verifies(value = "should get all logs for the object matching the specified uuid", method = "getAuditLogs(String,Class<?>,List<Action>,Date,Date)")
//	public void getAuditLogs_shouldGetAllLogsForTheObjectMatchingTheSpecifiedUuid() throws Exception {
//		executeDataSet(MODULE_TEST_DATA_AUDIT_LOGS);
//		assertEquals(2, auditLogService.getAuditLogs(5089, ConceptNumeric.class, null, null, null, false).size());
//	}
//
//	/**
//	 * @see {@link AuditLogService#getAuditLogs(java.io.Serializable, Class, java.util.List, java.util.Date, java.util.Date, boolean)}
//	 */
//	@Test
//	@Verifies(value = "should include logs for subclasses when getting by type", method = "getAuditLogs(String,Class<?>,List<Action>,Date,Date)")
//	public void getAuditLogs_shouldIncludeLogsForSubclassesWhenGettingByType() throws Exception {
//		executeDataSet(MODULE_TEST_DATA_AUDIT_LOGS);
//		assertEquals(2, auditLogService.getAuditLogs(5089, Concept.class, null, null, null, false).size());
//	}
//
//	/**
//	 * @see {@link AuditLogService#getAuditLogs(java.util.List, java.util.List, java.util.Date, java.util.Date, boolean, Integer, Integer)}
//	 */
//	@Test
//	@Verifies(value = "should exclude child logs if excludeChildAuditLogsis set to true", method = "getAuditLogs(List<Class<?>>,List<Action>,Date,Date,null,Integer,Integer)")
//	public void getAuditLogs_shouldExcludeChildLogsIfExcludeChildAuditLogsisSetToTrue() throws Exception {
//		executeDataSet(MODULE_TEST_DATA_AUDIT_LOGS);
//		assertEquals(4, auditLogService.getAuditLogs(null, null, null, null, true, null, null).size());
//	}
//
//	/**
//	 * @verifies exclude child logs for object if excludeChildAuditLogs is set to true
//	 * @see AuditLogService#getAuditLogs(java.io.Serializable, Class, java.util.List,
//	 *      java.util.Date, java.util.Date, boolean)
//	 */
//	@Test
//	public void getAuditLogs_shouldExcludeChildLogsForObjectIfExcludeChildAuditLogsIsSetToTrue() throws Exception {
//		executeDataSet(MODULE_TEST_DATA_AUDIT_LOGS);
//		assertEquals(0, auditLogService.getAuditLogs(3000, ConceptDescription.class, null, null, null, true).size());
//	}
//
//	/**
//	 * @verifies get all logs for the specified object
//	 * @see AuditLogService#getAuditLogs(Object, java.util.List, java.util.Date, java.util.Date,
//	 *      boolean)
//	 */
//	@Test
//	public void getAuditLogs_shouldGetAllLogsForTheSpecifiedObject() throws Exception {
//		executeDataSet(MODULE_TEST_DATA_AUDIT_LOGS);
//		Object obj = auditLogService.getObjectByUuid(ConceptNumeric.class, "c607c80f-1ea9-4da3-bb88-6276ce8868dd");
//		assertNotNull(obj);
//		assertEquals(2, auditLogService.getAuditLogs(obj, null, null, null, false).size());
//	}
//
//	/**
//	 * @verifies return false for core exceptions
//	 * @see AuditLogService#isAudited(Class)
//	 */
//	@Test
//	public void isAudited_shouldReturnFalseForCoreExceptions() throws Exception {
//		startAuditing(AuditLog.class);
//		assertEquals(false, auditLogService.isAudited(AuditLog.class));
//	}
//}
