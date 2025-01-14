//package org.openmrs.module.icare.auditlog.strategy;
//
//import org.hibernate.persister.collection.CollectionPersister;
//import org.junit.Test;
//import org.openmrs.*;
//import org.openmrs.module.icare.auditlog.BaseAuditLogTest;
//import org.openmrs.module.icare.auditlog.util.AuditLogConstants;
//import org.openmrs.module.icare.auditlog.util.AuditLogUtil;
//import org.openmrs.util.OpenmrsUtil;
//
//import java.util.HashSet;
//import java.util.Set;
//
//import static junit.framework.Assert.*;
//import static junit.framework.Assert.assertFalse;
//
//public class AllExceptAuditStrategyTest extends BaseAuditLogTest {
//
//	private static final String EXCEPTIONS_FOR_ALL_EXCEPT = "org.openmrs.Concept, org.openmrs.EncounterType";
//
//	/**
//	 * @verifies update the exception class names global property
//	 * @see AllExceptAuditStrategy#startAuditing(java.util.Set>)
//	 */
//	@Test
//	public void startAuditing_shouldUpdateTheExceptionClassNamesGlobalProperty() throws Exception {
//		setAuditConfiguration(AuditStrategy.ALL_EXCEPT, EXCEPTIONS_FOR_ALL_EXCEPT, false);
//		Set<Class<?>> exceptions = helper.getExceptions();
//		int originalCount = exceptions.size();
//		assertTrue(OpenmrsUtil.collectionContains(exceptions, EncounterType.class));
//		assertTrue(OpenmrsUtil.collectionContains(exceptions, Concept.class));
//		assertTrue(OpenmrsUtil.collectionContains(exceptions, ConceptNumeric.class));
//		assertTrue(OpenmrsUtil.collectionContains(exceptions, ConceptComplex.class));
//		assertEquals(false, auditLogService.isAudited(EncounterType.class));
//		assertEquals(false, auditLogService.isAudited(Concept.class));
//		assertEquals(false, auditLogService.isAudited(ConceptNumeric.class));
//		assertEquals(false, auditLogService.isAudited(ConceptComplex.class));
//		startAuditing(Concept.class);
//		exceptions = helper.getExceptions();
//		assertEquals(originalCount -= 3, exceptions.size());
//		//Should have removed it and maintained the existing ones
//		assertTrue(OpenmrsUtil.collectionContains(exceptions, EncounterType.class));
//		assertFalse(OpenmrsUtil.collectionContains(exceptions, Concept.class));
//		assertFalse(OpenmrsUtil.collectionContains(exceptions, ConceptNumeric.class));
//		assertFalse(OpenmrsUtil.collectionContains(exceptions, ConceptComplex.class));
//		assertEquals(false, auditLogService.isAudited(EncounterType.class));
//		assertEquals(true, auditLogService.isAudited(Concept.class));
//		assertEquals(true, auditLogService.isAudited(ConceptNumeric.class));
//		assertEquals(true, auditLogService.isAudited(ConceptComplex.class));
//	}
//
//	/**
//	 * @verifies mark a class and its known subclasses as audited
//	 * @see AllExceptAuditStrategy#startAuditing(java.util.Set>)
//	 */
//	@Test
//	public void startAuditing_shouldMarkAClassAndItsKnownSubclassesAsAudited() throws Exception {
//		setAuditConfiguration(AuditStrategy.ALL_EXCEPT, EXCEPTIONS_FOR_ALL_EXCEPT, false);
//		Set<Class<?>> exceptions = helper.getExceptions();
//		assertTrue(exceptions.contains(Concept.class));
//		assertTrue(exceptions.contains(ConceptNumeric.class));
//		assertTrue(exceptions.contains(ConceptComplex.class));
//		assertEquals(false, auditLogService.isAudited(Concept.class));
//		assertEquals(false, auditLogService.isAudited(ConceptNumeric.class));
//		assertEquals(false, auditLogService.isAudited(ConceptComplex.class));
//		startAuditing(Concept.class);
//		exceptions = helper.getExceptions();
//		assertFalse(exceptions.contains(Concept.class));
//		assertFalse(exceptions.contains(ConceptNumeric.class));
//		assertFalse(exceptions.contains(ConceptComplex.class));
//		assertEquals(true, auditLogService.isAudited(Concept.class));
//		assertEquals(true, auditLogService.isAudited(ConceptNumeric.class));
//		assertEquals(true, auditLogService.isAudited(ConceptComplex.class));
//	}
//
//	/**
//	 * @verifies also mark association types as audited
//	 * @see AllExceptAuditStrategy#startAuditing(java.util.Set>)
//	 */
//	@Test
//	public void startAuditing_shouldAlsoMarkAssociationTypesAsAudited() throws Exception {
//		setAuditConfiguration(AuditStrategy.ALL_EXCEPT, "org.openmrs.Person,org.openmrs.PersonName", false);
//		assertFalse(auditLogService.isAudited(Person.class));
//		assertFalse(auditLogService.isAudited(PersonName.class));
//		assertFalse(helper.isImplicitlyAudited(PersonName.class));
//		startAuditing(Person.class);
//		assertTrue(auditLogService.isAudited(Person.class));
//		assertFalse(auditLogService.isAudited(PersonName.class));
//		assertTrue(helper.isImplicitlyAudited(PersonName.class));
//	}
//
//	/**
//	 * @verifies not mark association types for many to many collections as audited
//	 * @see AllExceptAuditStrategy#startAuditing(java.util.Set>)
//	 */
//	@Test
//	public void startAuditing_shouldNotMarkAssociationTypesForManyToManyCollectionsAsAudited() throws Exception {
//		setAuditConfiguration(AuditStrategy.ALL_EXCEPT, "org.openmrs.Location,org.openmrs.LocationTag", false);
//		assertFalse(auditLogService.isAudited(Location.class));
//		assertFalse(auditLogService.isAudited(LocationTag.class));
//		assertFalse(helper.isImplicitlyAudited(LocationTag.class));
//		CollectionPersister cp = AuditLogUtil.getCollectionPersister("tags", Location.class, null);
//		assertTrue(cp.isManyToMany());
//		startAuditing(Location.class);
//		assertTrue(auditLogService.isAudited(Location.class));
//		assertFalse(auditLogService.isAudited(LocationTag.class));
//		assertFalse(helper.isImplicitlyAudited(LocationTag.class));
//	}
//
//	/**
//	 * @verifies update the exception class names global property
//	 * @see AllExceptAuditStrategy#stopAuditing(java.util.Set>)
//	 */
//	@Test
//	public void stopAuditing_shouldUpdateTheExceptionClassNamesGlobalProperty() throws Exception {
//		setAuditConfiguration(AuditStrategy.ALL_EXCEPT, null, false);
//		Set<Class<?>> exceptions = helper.getExceptions();
//		int originalCount = exceptions.size();
//		assertFalse(OpenmrsUtil.collectionContains(exceptions, Concept.class));
//		assertTrue(auditLogService.isAudited(Concept.class));
//		assertTrue(auditLogService.isAudited(EncounterType.class));
//		assertTrue(auditLogService.isAudited(PatientIdentifierType.class));
//		stopAuditing(Concept.class);
//		exceptions = helper.getExceptions();
//		assertTrue(OpenmrsUtil.collectionContains(exceptions, Concept.class));
//		assertEquals(originalCount += 3, exceptions.size());
//		//Should have added it and maintained the existing ones
//		assertFalse(auditLogService.isAudited(Concept.class));
//		assertTrue(auditLogService.isAudited(EncounterType.class));
//		assertTrue(auditLogService.isAudited(PatientIdentifierType.class));
//	}
//
//	/**
//	 * @verifies mark a class and its known subclasses as un audited
//	 * @see AllExceptAuditStrategy#stopAuditing(java.util.Set>)
//	 */
//	@Test
//	public void stopAuditing_shouldMarkAClassAndItsKnownSubclassesAsUnAudited() throws Exception {
//		setAuditConfiguration(AuditStrategy.ALL_EXCEPT, null, false);
//		Set<Class<?>> exceptions = helper.getExceptions();
//		assertFalse(exceptions.contains(Concept.class));
//		assertFalse(exceptions.contains(ConceptNumeric.class));
//		assertFalse(exceptions.contains(ConceptComplex.class));
//		assertEquals(true, auditLogService.isAudited(Concept.class));
//		assertEquals(true, auditLogService.isAudited(ConceptNumeric.class));
//		assertEquals(true, auditLogService.isAudited(ConceptComplex.class));
//		Set<Class<?>> classes = new HashSet<Class<?>>();
//		classes.add(Concept.class);
//		stopAuditing(classes);
//		assertTrue(exceptions.contains(Concept.class));
//		//assertTrue(exceptions.contains(ConceptNumeric.class));
//		//assertTrue(exceptions.contains(ConceptComplex.class));
//		assertEquals(false, auditLogService.isAudited(Concept.class));
//		assertEquals(false, auditLogService.isAudited(ConceptNumeric.class));
//		assertEquals(false, auditLogService.isAudited(ConceptComplex.class));
//	}
//
//	/**
//	 * @verifies not remove explicitly monitored association types when the parent is removed
//	 * @see AllExceptAuditStrategy#stopAuditing(java.util.Set>)
//	 */
//	@Test
//	public void stopAuditing_shouldNotRemoveExplicitlyMonitoredAssociationTypesWhenTheParentIsRemoved() throws Exception {
//		setAuditConfiguration(AuditStrategy.ALL_EXCEPT, "org.openmrs.ConceptName", false);
//		assertTrue(auditLogService.isAudited(Concept.class));
//		assertFalse(auditLogService.isAudited(ConceptName.class));
//		assertTrue(helper.isImplicitlyAudited(ConceptName.class));
//		stopAuditing(Concept.class);
//		assertFalse(auditLogService.isAudited(Concept.class));
//		assertFalse(auditLogService.isAudited(ConceptName.class));
//		assertFalse(helper.isImplicitlyAudited(ConceptName.class));
//	}
//
//	/**
//	 * @verifies return true if the class is audited for all except strategy
//	 * @see AllExceptAuditStrategy#isAudited(Class)
//	 */
//	@Test
//	public void isAudited_shouldReturnTrueIfTheClassIsAuditedForAllExceptStrategy() throws Exception {
//		assertFalse(auditLogService.isAudited(Cohort.class));
//		AuditStrategy newStrategy = AuditStrategy.ALL_EXCEPT;
//		AuditLogUtil.setGlobalProperty(AuditLogConstants.GP_AUDITING_STRATEGY, newStrategy.getClass().getName());
//		assertEquals(newStrategy, auditLogService.getAuditingStrategy());
//		assertTrue(auditLogService.isAudited(Cohort.class));
//		assertTrue(auditLogService.isAudited(Concept.class));
//		assertTrue(auditLogService.isAudited(ConceptNumeric.class));
//		assertTrue(auditLogService.isAudited(ConceptComplex.class));
//		assertTrue(auditLogService.isAudited(EncounterType.class));
//		assertTrue(auditLogService.isAudited(PatientIdentifierType.class));
//	}
//
//	/**
//	 * @verifies return false if the class is not audited for all except strategy
//	 * @see AllExceptAuditStrategy#isAudited(Class)
//	 */
//	@Test
//	public void isAudited_shouldReturnFalseIfTheClassIsNotAuditedForAllExceptStrategy() throws Exception {
//		assertFalse(auditLogService.isAudited(Cohort.class));
//		AuditStrategy newStrategy = AuditStrategy.ALL_EXCEPT;
//		AuditLogUtil.setGlobalProperty(AuditLogConstants.GP_AUDITING_STRATEGY, newStrategy.getClass().getName());
//		AuditLogUtil.setGlobalProperty(ExceptionBasedAuditStrategy.GLOBAL_PROPERTY_EXCEPTION, EncounterType.class.getName()
//		        + "," + Location.class.getName());
//		assertEquals(newStrategy, auditLogService.getAuditingStrategy());
//		assertFalse(auditLogService.isAudited(EncounterType.class));
//		assertFalse(auditLogService.isAudited(Location.class));
//	}
//}
