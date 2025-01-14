//package org.openmrs.module.icare.auditlog.api.db;
//
//import org.junit.Test;
//import org.openmrs.Concept;
//import org.openmrs.ConceptComplex;
//import org.openmrs.ConceptNumeric;
//import org.openmrs.OpenmrsObject;
//import java.lang.reflect.Modifier;
//import java.util.Set;
//import static org.junit.Assert.*;
//import static org.junit.Assert.assertTrue;
//
//public class DAOUtilsTest {
//
//	/**
//	 * @verifies exclude interfaces and abstract classes
//	 * @see DAOUtils#getPersistentConcreteSubclasses(Class)
//	 */
//	@Test
//	public void getPersistentConcreteSubclasses_shouldExcludeInterfacesAndAbstractClasses() throws Exception {
//		Set<Class<?>> subclasses = DAOUtils.getPersistentConcreteSubclasses(OpenmrsObject.class);
//		for (Class<?> clazz : subclasses) {
//			assertFalse("Found interface:" + clazz.getName() + ", interfaces should be excluded",
//			    Modifier.isInterface(clazz.getModifiers()));
//			assertFalse("Found abstract class:" + clazz.getName() + ", abstract classes should be excluded",
//			    Modifier.isAbstract(clazz.getModifiers()));
//		}
//	}
//
//	/**
//	 * @verifies return a list of subclasses for the specified type
//	 * @see DAOUtils#getPersistentConcreteSubclasses(Class)
//	 */
//	@Test
//	public void getPersistentConcreteSubclasses_shouldReturnAListOfSubclassesForTheSpecifiedType() throws Exception {
//		Set<Class<?>> subclasses = DAOUtils.getPersistentConcreteSubclasses(Concept.class);
//		assertEquals(2, subclasses.size());
//		assertTrue(subclasses.contains(ConceptNumeric.class));
//		assertTrue(subclasses.contains(ConceptComplex.class));
//	}
//}
