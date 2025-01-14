//package org.openmrs.module.icare.auditlog.util;
//
//import org.junit.Test;
//import org.openmrs.Concept;
//import org.openmrs.ConceptName;
//import org.openmrs.ConceptNumeric;
//import org.openmrs.test.BaseModuleContextSensitiveTest;
//import org.openmrs.test.Verifies;
//
//import static org.junit.Assert.*;
//import static org.junit.Assert.assertEquals;
//
//public class AuditLogUtilTest extends BaseModuleContextSensitiveTest {
//
//	/**
//	 * @see {@link AuditLogUtil#getCollectionElementType(Class, String)}
//	 */
//	@Test
//	@Verifies(value = "should return the class of the property", method = "getCollectionElementType(Class<*>,String)")
//	public void getCollectionElementType_shouldReturnTheClassOfTheProperty() throws Exception {
//		assertEquals(AuditLogUtil.getCollectionElementType(Concept.class, "names"), ConceptName.class);
//		//should pass if the property is defined in a super class
//		assertEquals(ConceptName.class, AuditLogUtil.getCollectionElementType(ConceptNumeric.class, "names"));
//		assertNull(AuditLogUtil.getCollectionElementType(ConceptNumeric.class, "random"));
//	}
//
//	@Test
//	public void getCollectionPersister_shouldReturnTheCollectionPersister() throws Exception {
//		assertNotNull(AuditLogUtil.getCollectionPersister("names", Concept.class, null));
//	}
//
//	@Test
//	public void getCollectionPersister_shouldReturnTheCollectionPersisterIfThePropertyIsDeclaredInASuperClass()
//	        throws Exception {
//		assertEquals(Concept.class.getName() + ".names",
//		    AuditLogUtil.getCollectionPersister("names", ConceptNumeric.class, null).getRole());
//	}
//}
