package org.openmrs.module.icare.auditlog.api.db;

import org.hibernate.EntityMode;
import org.hibernate.SessionFactory;
import org.hibernate.engine.spi.SessionFactoryImplementor;
import org.hibernate.metadata.ClassMetadata;
import org.hibernate.type.CollectionType;
import org.hibernate.type.OneToOneType;
import org.hibernate.type.Type;
import org.openmrs.api.context.Context;

import java.lang.reflect.Modifier;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

public class DAOUtils {
	
	/**
	 * Finds all the types for associations to audit in as recursive way i.e if a Persistent type is
	 * found, then we also find its collection element types and types for fields mapped as one to
	 * one.
	 * 
	 * @param clazz the Class to match against
	 * @return a set of found class names
	 */
	public static Set<Class<?>> getAssociationTypesToAudit(Class<?> clazz) {
		return getAssociationTypesToAuditInternal(clazz, null);
	}
	
	/**
	 * Finds all the types for associations to audit in as recursive way i.e if a Persistent type is
	 * found, then we also find its collection element types and types for fields mapped as one to
	 * one.
	 * 
	 * @param clazz the Class to match against
	 * @param foundAssocTypes the found association types
	 * @return a set of found class names
	 */
	private static Set<Class<?>> getAssociationTypesToAuditInternal(Class<?> clazz, Set<Class<?>> foundAssocTypes) {
		if (foundAssocTypes == null) {
			foundAssocTypes = new HashSet<Class<?>>();
		}
		
		ClassMetadata cmd = getSessionFactory().getClassMetadata(clazz);
		if (cmd != null) {
			for (Type type : cmd.getPropertyTypes()) {
				//If this is a OneToOne or a collection type
				if (type.isCollectionType() || OneToOneType.class.isAssignableFrom(type.getClass())) {
					CollectionType collType = (CollectionType) type;
					boolean isManyToManyColl = false;
					if (collType.isCollectionType()) {
						collType = (CollectionType) type;
						isManyToManyColl = ((SessionFactoryImplementor) getSessionFactory()).getCollectionPersister(
						    collType.getRole()).isManyToMany();
					}
					Class<?> assocType = type.getReturnedClass();
					if (type.isCollectionType()) {
						assocType = collType.getElementType((SessionFactoryImplementor) getSessionFactory())
						        .getReturnedClass();
					}
					
					//Ignore non persistent types
					if (getSessionFactory().getClassMetadata(assocType) == null) {
						continue;
					}
					
					if (!foundAssocTypes.contains(assocType)) {
						//Don't implicitly audit types for many to many collections items
						if (!type.isCollectionType() || (type.isCollectionType() && !isManyToManyColl)) {
							foundAssocTypes.add(assocType);
							//Recursively inspect each association type
							foundAssocTypes.addAll(getAssociationTypesToAuditInternal(assocType, foundAssocTypes));
						}
					}
				}
			}
		}
		return foundAssocTypes;
	}
	
	/**
	 * Gets a set of concrete subclasses for the specified class recursively, note that interfaces
	 * and abstract classes are excluded
	 * 
	 * @param clazz the Super Class
	 * @return a set of subclasses
	 * @should return a list of subclasses for the specified type
	 * @should exclude interfaces and abstract classes
	 */
	public static Set<Class<?>> getPersistentConcreteSubclasses(Class<?> clazz) {
		return getPersistentConcreteSubclassesInternal(clazz, null, null);
	}
	
	/**
	 * Gets a set of concrete subclasses for the specified class recursively, note that interfaces
	 * and abstract classes are excluded
	 * 
	 * @param clazz the Super Class
	 * @param foundSubclasses the list of subclasses found in previous recursive calls, should be
	 *            null for the first call
	 * @param mappedClasses the ClassMetadata Collection
	 * @return a set of subclasses
	 */
	@SuppressWarnings("unchecked")
	private static Set<Class<?>> getPersistentConcreteSubclassesInternal(Class<?> clazz, Set<Class<?>> foundSubclasses,
	        Collection<ClassMetadata> mappedClasses) {
		if (foundSubclasses == null) {
			foundSubclasses = new HashSet<Class<?>>();
		}
		if (mappedClasses == null) {
			mappedClasses = getSessionFactory().getAllClassMetadata().values();
		}
		
		if (clazz != null) {
			for (ClassMetadata cmd : mappedClasses) {
				Class<?> possibleSubclass = cmd.getMappedClass();
				if (!clazz.equals(possibleSubclass) && clazz.isAssignableFrom(possibleSubclass)) {
					if (!Modifier.isAbstract(possibleSubclass.getModifiers()) && !possibleSubclass.isInterface()) {
						foundSubclasses.add(possibleSubclass);
					}
					foundSubclasses.addAll(getPersistentConcreteSubclassesInternal(possibleSubclass, foundSubclasses,
					    mappedClasses));
				}
			}
		}
		
		return foundSubclasses;
	}
	
	public static ClassMetadata getClassMetadata(Class<?> clazz) {
		return getSessionFactory().getClassMetadata(clazz);
	}
	
	public static SessionFactory getSessionFactory() {
		return Context.getRegisteredComponents(SessionFactory.class).get(0);
	}
}
