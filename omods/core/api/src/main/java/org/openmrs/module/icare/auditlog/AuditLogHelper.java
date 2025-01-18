package org.openmrs.module.icare.auditlog;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.FlushMode;
import org.hibernate.SessionFactory;
import org.hibernate.metadata.ClassMetadata;
import org.openmrs.GlobalProperty;
import org.openmrs.api.APIException;
import org.openmrs.api.AdministrationService;
import org.openmrs.api.GlobalPropertyListener;
import org.openmrs.api.context.Context;
import org.openmrs.module.icare.auditlog.api.db.DAOUtils;
import org.openmrs.module.icare.auditlog.strategy.*;
import org.openmrs.module.icare.auditlog.util.AuditLogConstants;
import org.openmrs.module.icare.auditlog.util.AuditLogUtil;
import org.springframework.stereotype.Component;

import java.util.*;

@Component("auditLogHelper")
public class AuditLogHelper implements GlobalPropertyListener {
	
	protected final Log log = LogFactory.getLog(getClass());
	
	public static final List<Class<?>> CORE_EXCEPTIONS;
	static {
		CORE_EXCEPTIONS = new ArrayList<Class<?>>();
		CORE_EXCEPTIONS.add(AuditLog.class);
	}
	
	private static Set<Class<?>> exceptionsTypeCache;
	
	private static AuditStrategy auditingStrategyCache;
	
	private static Set<Class<?>> implicitlyAuditedTypeCache;
	
	public AuditStrategy getAuditingStrategy() {
		if (auditingStrategyCache == null) {
			String gpValue = Context.getAdministrationService().getGlobalProperty(AuditLogConstants.GP_AUDITING_STRATEGY);
			if (StringUtils.isBlank(gpValue)) {
				//Defaults to none, we can't cache this so sorry but we will have to hit the DB
				//for the GP value until it gets set so that we only cache a set value
				return AuditStrategy.NONE;
			} else {
				try {
					auditingStrategyCache = getAuditStrategyFromString(gpValue);
				}
				catch (Exception e) {
					throw new APIException("Failed to set the audit strategy", e);
				}
			}
		}
		
		return auditingStrategyCache;
	}
	
	public boolean isAudited(Class<?> clazz) {
		//We need to stop hibernate auto flushing which might happen as we fetch
		//the GP values, Otherwise if a flush happens, then the interceptor
		//logic will be called again which will result in an infinite loop/stack overflow
		if (exceptionsTypeCache == null || auditingStrategyCache == null) {
			SessionFactory sf = DAOUtils.getSessionFactory();
			FlushMode originalFlushMode = sf.getCurrentSession().getFlushMode();
			sf.getCurrentSession().setFlushMode(FlushMode.MANUAL);
			try {
				return isAuditedInternal(clazz);
			}
			finally {
				//reset
				sf.getCurrentSession().setFlushMode(originalFlushMode);
			}
		}
		
		return isAuditedInternal(clazz);
	}
	
	/**
	 * Checks if the specified type is implicitly audit
	 * 
	 * @should return true if a class is implicitly audited
	 * @should return false if a class is not implicitly marked as audited
	 * @should return false if a class is already explicitly marked already as audited
	 * @should return true if a class is implicitly audited and strategy is all except
	 * @should return false if a class is not implicitly audited and strategy is all except
	 * @should return false if a class is already explicitly audited and strategy is all except
	 */
	public boolean isImplicitlyAudited(Class<?> clazz) {
		//We need to stop hibernate auto flushing which might happen as we fetch
		//the GP values, Otherwise if a flush happens, then the interceptor
		//logic will be called again which will result in an infinite loop/stack overflow
		if (implicitlyAuditedTypeCache == null) {
			SessionFactory sf = DAOUtils.getSessionFactory();
			FlushMode originalFlushMode = sf.getCurrentSession().getFlushMode();
			sf.getCurrentSession().setFlushMode(FlushMode.MANUAL);
			try {
				return isImplicitlyAuditedInternal(clazz);
			}
			finally {
				//reset
				sf.getCurrentSession().setFlushMode(originalFlushMode);
			}
		}
		
		return isImplicitlyAuditedInternal(clazz);
	}
	
	/**
	 * Gets implicitly audited classes, this are generated as a result of their owning entity types
	 * being marked as audited if they are not explicitly marked as audited themselves, i.e if
	 * Concept is marked as audited, then ConceptName, ConceptDescription, ConceptMapping etc
	 * implicitly get marked as audited
	 * 
	 * @return a set of implicitly audited classes
	 * @should return a set of implicitly audited classes for none except strategy
	 * @should return a set of implicitly audited classes for all except strategy
	 * @should return an empty set for none strategy
	 * @should return an empty set for all strategy
	 */
	public Set<Class<?>> getImplicitlyAuditedClasses() {
		if (implicitlyAuditedTypeCache == null) {
			implicitlyAuditedTypeCache = new HashSet<Class<?>>();
			if (getAuditingStrategy().equals(AuditStrategy.NONE_EXCEPT)) {
				for (Class<?> auditedClass : getExceptions()) {
					if (!AuditLogHelper.CORE_EXCEPTIONS.contains(auditedClass)) {
						addAssociationTypes(auditedClass);
					}
				}
			} else if (getAuditingStrategy().equals(AuditStrategy.ALL_EXCEPT) && getExceptions().size() > 0) {
				//generate implicitly audited classes so we can track them. The reason behind
				//this is: Say Concept is marked as audited and strategy is set to All Except
				//and say ConceptName is for some reason marked as un audited we should still audit
				//concept names otherwise it poses inconsistencies
				Collection<ClassMetadata> allClassMetadata = DAOUtils.getSessionFactory().getAllClassMetadata().values();
				for (ClassMetadata classMetadata : allClassMetadata) {
					Class<?> mappedClass = classMetadata.getMappedClass();
					if (!getExceptions().contains(mappedClass)) {
						if (!AuditLogHelper.CORE_EXCEPTIONS.contains(mappedClass)) {
							addAssociationTypes(mappedClass);
						}
					}
				}
			}
		}
		
		return implicitlyAuditedTypeCache;
	}
	
	/**
	 * Returns a set of exception classes as specified by the {@link org.openmrs.GlobalProperty}
	 * GLOBAL_PROPERTY_EXCEPTION
	 * 
	 * @return a set of audited classes
	 * @should return a set of exception classes
	 * @should fail for non exception based audit strategies
	 */
	public Set<Class<?>> getExceptions() {
		if (!(getAuditingStrategy() instanceof ExceptionBasedAuditStrategy)) {
			throw new APIException("Not supported by the configured audit strategy");
		}
		
		if (exceptionsTypeCache == null) {
			exceptionsTypeCache = new HashSet<Class<?>>();
			GlobalProperty gp = Context.getAdministrationService().getGlobalPropertyObject(
			    ExceptionBasedAuditStrategy.GLOBAL_PROPERTY_EXCEPTION);
			
			if (gp != null && StringUtils.isNotBlank(gp.getPropertyValue())) {
				String[] classnameArray = StringUtils.split(gp.getPropertyValue(), ",");
				for (String classname : classnameArray) {
					classname = classname.trim();
					try {
						Class<?> auditedClass = Context.loadClass(classname);
						exceptionsTypeCache.add(auditedClass);
						
						Set<Class<?>> subclasses = DAOUtils.getPersistentConcreteSubclasses(auditedClass);
						for (Class<?> subclass : subclasses) {
							exceptionsTypeCache.add(subclass);
						}
					}
					catch (ClassNotFoundException e) {
						log.error("Failed to load class:" + classname);
					}
				}
			}
		}
		
		return exceptionsTypeCache;
	}
	
	/**
	 * @see org.openmrs.api.GlobalPropertyListener#supportsPropertyName(java.lang.String)
	 */
	@Override
	public boolean supportsPropertyName(String gpName) {
		return AuditLogConstants.GP_AUDITING_STRATEGY.equals(gpName)
		        || ExceptionBasedAuditStrategy.GLOBAL_PROPERTY_EXCEPTION.equals(gpName);
	}
	
	/**
	 * @see org.openmrs.api.GlobalPropertyListener#globalPropertyChanged(org.openmrs.GlobalProperty)
	 */
	@Override
	public void globalPropertyChanged(GlobalProperty gp) {
		implicitlyAuditedTypeCache = null;
		exceptionsTypeCache = null;
		if (AuditLogConstants.GP_AUDITING_STRATEGY.equals(gp.getProperty())) {
			AuditStrategy oldStrategy = null;
			if (auditingStrategyCache != null) {
				oldStrategy = auditingStrategyCache;
			}
			auditingStrategyCache = null;
			if (StringUtils.isBlank(gp.getPropertyValue())) {
				AuditLogUtil.setGlobalProperty(ExceptionBasedAuditStrategy.GLOBAL_PROPERTY_EXCEPTION, "");
			} else {
				//If both GPS for strategy and exceptions are saved together in one call, we need
				//to be able to avoid clearing the exceptions GP in case the strategy hasn't changed
				try {
					AuditStrategy newStrategy = getAuditStrategyFromString(gp.getPropertyValue());
					if (!newStrategy.equals(oldStrategy)) {
						AuditLogUtil.setGlobalProperty(ExceptionBasedAuditStrategy.GLOBAL_PROPERTY_EXCEPTION, "");
					}
				}
				catch (Exception e) {
					throw new APIException("Failed to create an AuditStrategy instance from the String:"
					        + gp.getPropertyValue(), e);
				}
			}
		}
	}
	
	/**
	 * @see org.openmrs.api.GlobalPropertyListener#globalPropertyDeleted(java.lang.String)
	 */
	@Override
	public void globalPropertyDeleted(String gpName) {
		implicitlyAuditedTypeCache = null;
		exceptionsTypeCache = null;
		if (AuditLogConstants.GP_AUDITING_STRATEGY.equals(gpName)) {
			auditingStrategyCache = null;
			AuditLogUtil.setGlobalProperty(ExceptionBasedAuditStrategy.GLOBAL_PROPERTY_EXCEPTION, "");
		}
	}
	
	public void updateGlobalProperty(Set<Class<?>> clazzes, boolean startAuditing) {
		AdministrationService as = Context.getAdministrationService();
		GlobalProperty gp = as.getGlobalPropertyObject(ExceptionBasedAuditStrategy.GLOBAL_PROPERTY_EXCEPTION);
		if (gp == null) {
			String description = "Specifies the class names of objects to audit or not depending on the auditing strategy";
			gp = new GlobalProperty(ExceptionBasedAuditStrategy.GLOBAL_PROPERTY_EXCEPTION, null, description);
		}
		
		if (getAuditingStrategy().equals(AuditStrategy.NONE_EXCEPT)) {
			for (Class<?> clazz : clazzes) {
				if (startAuditing) {
					getExceptions().add(clazz);
				} else {
					getExceptions().remove(clazz);
					//remove subclasses too
					Set<Class<?>> subclasses = DAOUtils.getPersistentConcreteSubclasses(clazz);
					for (Class<?> subclass : subclasses) {
						getExceptions().remove(subclass);
					}
				}
			}
		} else if (getAuditingStrategy().equals(AuditStrategy.ALL_EXCEPT)) {
			for (Class<?> clazz : clazzes) {
				if (startAuditing) {
					getExceptions().remove(clazz);
					Set<Class<?>> subclasses = DAOUtils.getPersistentConcreteSubclasses(clazz);
					for (Class<?> subclass : subclasses) {
						getExceptions().remove(subclass);
					}
				} else {
					getExceptions().add(clazz);
				}
			}
		} else {
			throw new APIException("Un supported audit strategy type:" + getAuditingStrategy().getClass());
		}
		
		gp.setPropertyValue(StringUtils.join(AuditLogUtil.getAsListOfClassnames(getExceptions()), ","));
		
		try {
			as.saveGlobalProperty(gp);
		}
		catch (Exception e) {
			//The cache needs to be rebuilt since we already updated the
			//cached above but the GP value didn't get updated in the DB
			exceptionsTypeCache = null;
			implicitlyAuditedTypeCache = null;
			
			throw new APIException("Failed to " + ((startAuditing) ? "start" : "stop") + " auditing " + clazzes, e);
		}
	}
	
	/**
	 * Checks if specified object is among the ones that are audited
	 * 
	 * @param clazz the class to check against
	 * @return true if it is audited otherwise false
	 */
	private boolean isAuditedInternal(Class<?> clazz) {
		if (CORE_EXCEPTIONS.contains(clazz) || getAuditingStrategy() == null) {
			return false;
		}
		return getAuditingStrategy().isAudited(clazz);
	}
	
	/**
	 * @param clazz the class whose association types to add
	 */
	private void addAssociationTypes(Class<?> clazz) {
		for (Class<?> assocType : DAOUtils.getAssociationTypesToAudit(clazz)) {
			//If this type is not explicitly marked as audited
			if (!isAudited(assocType)) {
				if (implicitlyAuditedTypeCache == null) {
					implicitlyAuditedTypeCache = new HashSet<Class<?>>();
				}
				implicitlyAuditedTypeCache.add(assocType);
			}
		}
	}
	
	/**
	 * Checks if specified object is among the ones that are implicitly audited
	 * 
	 * @param clazz the class to check against
	 * @return true if it is implicitly audited otherwise false
	 */
	private boolean isImplicitlyAuditedInternal(Class<?> clazz) {
		if (CORE_EXCEPTIONS.contains(clazz)) {
			return false;
		}
		if (getAuditingStrategy() == null || getAuditingStrategy().equals(AuditStrategy.NONE)) {
			return false;
		}
		
		return getImplicitlyAuditedClasses().contains(clazz);
	}
	
	private AuditStrategy getAuditStrategyFromString(String value) throws Exception {
		AuditStrategy strategy;
		//We should allow short values like all, all_except, none, none_except
		if (AuditStrategy.SHORT_NAME_NONE.equalsIgnoreCase(value)) {
			strategy = AuditStrategy.NONE;
		} else if (AuditStrategy.SHORT_NAME_NONE_EXCEPT.equalsIgnoreCase(value)) {
			strategy = AuditStrategy.NONE_EXCEPT;
		} else if (AuditStrategy.SHORT_NAME_ALL.equalsIgnoreCase(value)) {
			strategy = AuditStrategy.ALL;
		} else if (AuditStrategy.SHORT_NAME_ALL_EXCEPT.equalsIgnoreCase(value)) {
			strategy = AuditStrategy.ALL_EXCEPT;
		} else {
			Class<AuditStrategy> clazz = (Class<AuditStrategy>) Context.loadClass(value);
			if (NoneAuditStrategy.class.equals(clazz)) {
				strategy = AuditStrategy.NONE;
			} else if (NoneExceptAuditStrategy.class.equals(clazz)) {
				strategy = AuditStrategy.NONE_EXCEPT;
			} else if (AllAuditStrategy.class.equals(clazz)) {
				strategy = AuditStrategy.ALL;
			} else if (AllExceptAuditStrategy.class.equals(clazz)) {
				strategy = AuditStrategy.ALL_EXCEPT;
			} else {
				strategy = clazz.newInstance();
			}
		}
		
		return strategy;
	}
}
