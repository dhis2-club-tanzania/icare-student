package org.openmrs.module.icare.auditlog.api.db.hibernate.interceptor;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections.MapUtils;
import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.*;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.collection.spi.PersistentCollection;
import org.hibernate.engine.spi.SessionImplementor;
import org.hibernate.metadata.ClassMetadata;
import org.hibernate.metamodel.Metadata;
import org.hibernate.metamodel.MetadataSources;
import org.hibernate.persister.entity.EntityPersister;
import org.hibernate.service.ServiceRegistry;
import org.hibernate.type.StringType;
import org.hibernate.type.TextType;
import org.hibernate.type.Type;
import org.openmrs.api.context.Context;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.api.db.hibernate.HibernateUtil;
import org.openmrs.module.icare.auditlog.AuditLog;
import org.openmrs.module.icare.auditlog.util.AuditLogConstants;
import org.openmrs.module.icare.auditlog.util.AuditLogUtil;
import org.openmrs.scheduler.TaskDefinition;
import org.openmrs.util.OpenmrsConstants;
import org.openmrs.util.OpenmrsUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate3.SessionFactoryUtils;
import org.springframework.stereotype.Component;

import java.awt.*;
import java.io.Serializable;
import java.nio.charset.StandardCharsets;
import java.sql.Blob;
import java.util.*;
import java.util.List;

@Component("zzz-auditLogInterceptor")
public class HibernateAuditLogInterceptor extends EmptyInterceptor {
	
	private static final long serialVersionUID = 1L;
	
	private static final Log log = LogFactory.getLog(HibernateAuditLogInterceptor.class);
	
	//Use stacks to take care of nested transactions to avoid NPE since on each transaction
	//completion the ThreadLocals get nullified, see code below, i.e a stack of two elements implies
	//the element at the top of the stack is the inserts made in the inner/nested transaction
	private ThreadLocal<Stack<HashSet<Object>>> inserts = new ThreadLocal<Stack<HashSet<Object>>>();
	
	private ThreadLocal<Stack<HashSet<Object>>> updates = new ThreadLocal<Stack<HashSet<Object>>>();
	
	private ThreadLocal<Stack<HashSet<Object>>> deletes = new ThreadLocal<Stack<HashSet<Object>>>();
	
	//Mapping between objects and maps of their changed property names and their older values,
	//the first item in the array is the old value while the the second is the new value
	private ThreadLocal<Stack<Map<Object, Map<String, Object[]>>>> objectChangesMap = new ThreadLocal<Stack<Map<Object, Map<String, Object[]>>>>();
	
	//Mapping between entities and lists of their Collections in the current session
	private ThreadLocal<Stack<Map<Object, List<Collection<?>>>>> entityCollectionsMap = new ThreadLocal<Stack<Map<Object, List<Collection<?>>>>>();
	
	//Mapping between parent entities and lists of AuditLogs for their collection elements
	private ThreadLocal<Stack<Map<Object, List<AuditLog>>>> ownerUuidChildLogsMap = new ThreadLocal<Stack<Map<Object, List<AuditLog>>>>();
	
	//Mapping between collection elements and their AuditLogs, will use
	//this to avoid creating logs for collections elements multiple times
	private ThreadLocal<Stack<Map<Object, AuditLog>>> childbjectUuidAuditLogMap = new ThreadLocal<Stack<Map<Object, AuditLog>>>();
	
	//Mapping between parent entities and sets of removed collection elements
	private ThreadLocal<Stack<Map<Object, HashSet<Object>>>> entityRemovedChildrenMap = new ThreadLocal<Stack<Map<Object, HashSet<Object>>>>();
	
	private ThreadLocal<Stack<Date>> date = new ThreadLocal<Stack<Date>>();
	
	//Ignore these properties because they match auditLog.user and auditLog.dateCreated
	private static final String[] IGNORED_PROPERTIES = new String[] { "changedBy", "dateChanged", "creator", "dateCreated",
	        "voidedBy", "dateVoided", "retiredBy", "dateRetired", "personChangedBy", "personDateChanged", "personCreator",
	        "personDateCreated" };
	
	/**
	 * @see org.hibernate.EmptyInterceptor#afterTransactionBegin(org.hibernate.Transaction)
	 */
	@Override
	public void afterTransactionBegin(Transaction tx) {
		//System.out.println("tr1:");
		initializeStacksIfNecessary();
		inserts.get().push(new HashSet<Object>());
		updates.get().push(new HashSet<Object>());
		deletes.get().push(new HashSet<Object>());
		objectChangesMap.get().push(new HashMap<Object, Map<String, Object[]>>());
		entityCollectionsMap.get().push(new HashMap<Object, List<Collection<?>>>());
		ownerUuidChildLogsMap.get().push(new HashMap<Object, List<AuditLog>>());
		childbjectUuidAuditLogMap.get().push(new HashMap<Object, AuditLog>());
		entityRemovedChildrenMap.get().push(new HashMap<Object, HashSet<Object>>());
		date.get().push(new Date());
	}
	
	/**
	 * @see org.hibernate.EmptyInterceptor#onSave(Object, java.io.Serializable, Object[], String[],
	 *      org.hibernate.type.Type[])
	 */
	@Override
	public boolean onSave(Object entity, Serializable id, Object[] state, String[] propertyNames, Type[] types) {
		//System.out.println("tr2:");
		if (InterceptorUtil.isAudited(entity.getClass())) {
			if (log.isDebugEnabled()) {
				log.debug("Creating log entry for created object with id:" + id + " of type:" + entity.getClass().getName());
			}
			inserts.get().peek().add(entity);
		}
		
		return false;
	}
	
	/**
	 * @see org.hibernate.EmptyInterceptor#onFlushDirty(Object, java.io.Serializable, Object[],
	 *      Object[], String[], org.hibernate.type.Type[])
	 */
	@Override
	public boolean onFlushDirty(Object entity, Serializable id, Object[] currentState, Object[] previousState,
	        String[] propertyNames, Type[] types) {
		//System.out.println("tr3:");
		if (propertyNames != null && InterceptorUtil.isAudited(entity.getClass())) {
			if (previousState == null) {
				//This is a detached object, load the previous state in a separate session
				Session tmpSession = null;
				SessionFactory sf = InterceptorUtil.getSessionFactory();
				try {
					tmpSession = SessionFactoryUtils.getNewSession(sf);
					Object obj = tmpSession.get(entity.getClass(), id);
					EntityPersister ep = ((SessionImplementor) tmpSession).getEntityPersister(null, obj);
					previousState = ep.getPropertyValues(obj);
				}
				finally {
					if (tmpSession != null) {
						SessionFactoryUtils.closeSession(tmpSession);
					}
				}
				
			}
			Map<String, Object[]> propertyChangesMap = null;//Map<propertyName, Object[]{currentValue, PreviousValue}>
			for (int i = 0; i < propertyNames.length; i++) {
				//we need to ignore dateChanged and changedBy fields in any case they
				//are actually part of the Auditlog in form of user and dateCreated
				if (ArrayUtils.contains(IGNORED_PROPERTIES, propertyNames[i])) {
					continue;
				}
				
				Object previousValue = (previousState != null) ? previousState[i] : null;
				Object currentValue = (currentState != null) ? currentState[i] : null;
				if (!types[i].isCollectionType() && !OpenmrsUtil.nullSafeEquals(currentValue, previousValue)) {
					//For string properties, ignore changes from null to blank and vice versa
					//TODO This should be user configurable via a module GP
					if (StringType.class.getName().equals(types[i].getClass().getName())
					        || TextType.class.getName().equals(types[i].getClass().getName())) {
						String currentStateString = null;
						if (currentValue != null && !StringUtils.isBlank(currentValue.toString())) {
							currentStateString = currentValue.toString();
						}
						
						String previousValueString = null;
						if (previousValue != null && !StringUtils.isBlank(previousValue.toString())) {
							previousValueString = previousValue.toString();
						}
						
						//TODO Case sensibility here should be configurable via a GP
						if (OpenmrsUtil.nullSafeEqualsIgnoreCase(previousValueString, currentStateString)) {
							continue;
						}
					}
					
					if (propertyChangesMap == null) {
						propertyChangesMap = new HashMap<String, Object[]>();
					}
					
					String serializedPreviousValue = AuditLogUtil.serializeObject(previousValue);
					String serializedCurrentValue = AuditLogUtil.serializeObject(currentValue);
					
					propertyChangesMap.put(propertyNames[i],
					    new String[] { serializedCurrentValue, serializedPreviousValue });
				}
			}
			
			if (MapUtils.isNotEmpty(propertyChangesMap)) {
				if (log.isDebugEnabled()) {
					log.debug("Creating log entry for updated object with id:" + id + " of type:"
					        + entity.getClass().getName());
				}
				
				updates.get().peek().add(entity);
				objectChangesMap.get().peek().put(entity, propertyChangesMap);
			}
		}
		
		return false;
	}
	
	/**
	 * @see org.hibernate.EmptyInterceptor#onDelete(Object, java.io.Serializable, Object[],
	 *      String[], org.hibernate.type.Type[])
	 */
	@Override
	public void onDelete(Object entity, Serializable id, Object[] state, String[] propertyNames, Type[] types) {
		//System.out.println("tr4:");
		if (InterceptorUtil.isAudited(entity.getClass())) {
			if (log.isDebugEnabled()) {
				log.debug("Creating log entry for deleted object with id:" + id + " of type:" + entity.getClass().getName());
			}
			for (int i = 0; i < types.length; i++) {
				if (types[i].isCollectionType()) {
					//Avoids LazyInitializationException since the parent is already purged
					Hibernate.initialize(state[i]);
				}
			}
			deletes.get().peek().add(entity);
		}
	}
	
	/**
	 * @see org.hibernate.EmptyInterceptor#onCollectionUpdate(Object, java.io.Serializable)
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public void onCollectionUpdate(Object collection, Serializable key) throws CallbackException {
		if (collection != null) {
			//System.out.println("tr5:");
			PersistentCollection persistentColl = ((PersistentCollection) collection);
			if (InterceptorUtil.isAudited(persistentColl.getOwner().getClass())) {
				Object owningObject = persistentColl.getOwner();
				System.out.println("class: " + persistentColl.getOwner().getClass());
				System.out.println("owner: " + persistentColl.getOwner());
				System.out.println("snapshot: " + persistentColl.getStoredSnapshot().toString());
				if (persistentColl.getStoredSnapshot().getClass().isArray()) {
					List<Map> previousStoredSnapshotMap = (List<Map>) persistentColl.getStoredSnapshot();
					for (Map previousStoredSnapshotMap2 : previousStoredSnapshotMap) {
						Object previousCollOrMap;
						if (Collection.class.isAssignableFrom(collection.getClass())) {
							
							previousCollOrMap = previousStoredSnapshotMap2.values();
							
						} else {
							previousCollOrMap = previousStoredSnapshotMap;
						}
						
						handleUpdatedCollection(collection, previousCollOrMap, owningObject, persistentColl.getRole());
					}
				}
			}
		}
	}
	
	@Override
	public void onCollectionRemove(Object collection, Serializable key) throws CallbackException {
		//We need to get all collection elements and link their childlogs to the parent's
		//System.out.println("tr6:");
		if (collection != null) {
			PersistentCollection persistentColl = (PersistentCollection) collection;
			if (InterceptorUtil.isAudited(persistentColl.getOwner().getClass())) {
				Object owningObject = persistentColl.getOwner();
				String role = persistentColl.getRole();
				String propertyName = role.substring(role.lastIndexOf('.') + 1);
				ClassMetadata cmd = AuditLogUtil.getClassMetadata(AuditLogUtil.getActualType(owningObject));
				Object currentCollection = cmd.getPropertyValue(owningObject, propertyName);
				
				//Hibernate calls onCollectionRemove whenever the underlying collection is replaced with a
				//new instance i.e one calls the collection's setter and passes in a new instance even if the
				//new collection contains some elements, we want to treat this as regular collection update,
				//Except if onCollectionRemove is called because the owner got purged from the DB.
				//I believe hibernate calls onDelete for the owner before onCollectionRemove for all its
				//collections so we can guarantee that the owner is already in the 'deletes' thread local
				boolean isOwnerDeleted = OpenmrsUtil.collectionContains(deletes.get().peek(), owningObject);
				if (Collection.class.isAssignableFrom(collection.getClass())) {
					Collection coll = (Collection) collection;
					if (!coll.isEmpty()) {
						if (isOwnerDeleted) {
							if (entityRemovedChildrenMap.get().peek().get(owningObject) == null) {
								entityRemovedChildrenMap.get().peek().put(owningObject, new HashSet<Object>());
							}
							for (Object removedItem : coll) {
								entityRemovedChildrenMap.get().peek().get(owningObject).add(removedItem);
							}
						} else if (!isOwnerDeleted && currentCollection == null) {
							Class<?> propertyClass = cmd.getPropertyType(propertyName).getReturnedClass();
							if (Set.class.isAssignableFrom(propertyClass)) {
								currentCollection = Collections.EMPTY_SET;
							} else if (List.class.isAssignableFrom(propertyClass)) {
								currentCollection = Collections.EMPTY_LIST;
							}
						}
					}
				} else if (Map.class.isAssignableFrom(collection.getClass())) {
					Map map = (Map) collection;
					if (!map.isEmpty() && !isOwnerDeleted && currentCollection == null) {
						currentCollection = Collections.EMPTY_MAP;
					}
				} else {
					//TODO: Handle other persistent collections types e.g bags
				}
				
				if (!isOwnerDeleted) {
					handleUpdatedCollection(currentCollection, collection, owningObject, role);
				}
			}
		}
	}
	
	/**
	 * This is a hacky way to find all loaded persistent objects in this session that have
	 * collections
	 * 
	 * @see org.hibernate.EmptyInterceptor#findDirty(Object, java.io.Serializable, Object[],
	 *      Object[], String[], org.hibernate.type.Type[])
	 */
	@Override
	public int[] findDirty(Object entity, Serializable id, Object[] currentState, Object[] previousState,
	        String[] propertyNames, Type[] types) {
		//System.out.println("tr7:");
		if (InterceptorUtil.isAudited(entity.getClass())) {
			
			//			if (entityCollectionsMap.get().peek().get(entity) == null) {
			//				//This is the first time we are trying to find collection elements for this object
			//				if (log.isDebugEnabled()) {
			//					log.debug("Finding collections for object:" + entity.getClass() + " #" + id);
			//				}
			//
			//				for (int i = 0; i < propertyNames.length; i++) {
			//					if (types[i].isCollectionType()) {
			//						Object coll = currentState[i];
			//						//For now ignore maps because still cant imagine a logical case where the
			//						//keys or values are Persistent objects that can't exist on their own
			//						if (coll != null && Collection.class.isAssignableFrom(coll.getClass())) {
			//							Collection<?> collection = (Collection<?>) coll;
			//							if (!collection.isEmpty()) {
			//								if (entityCollectionsMap.get().peek().get(entity) == null) {
			//									entityCollectionsMap.get().peek().put(entity, new ArrayList<Collection<?>>());
			//								}
			//								if (!AuditLogUtil.getCollectionPersister(propertyNames[i], entity.getClass(), null)
			//								        .isManyToMany()) {
			//									entityCollectionsMap.get().peek().get(entity).add(collection);
			//								}
			//							}
			//						} //else {
			//						  //TODO handle maps too because hibernate treats maps to be of CollectionType
			//						  //}
			//					}
			//				}
			//			}
		}
		
		return super.findDirty(entity, id, currentState, previousState, propertyNames, types);
	}
	
	/**
	 * @see org.hibernate.EmptyInterceptor#beforeTransactionCompletion(org.hibernate.Transaction)
	 */
	@Override
	public void beforeTransactionCompletion(Transaction tx) {
		//System.out.println("tr8:");
		//System.out.println("transaction class name: " + tx.getClass().getName());
		//System.out.println("beforetr");
		try {
			if (inserts.get().peek().isEmpty() && updates.get().peek().isEmpty() && deletes.get().peek().isEmpty()) {
				return;
			}
			
			try {
				//TODO handle daemon or un authenticated operations
				
				//If we have any entities in the session that have child collections and there were some updates,
				//check all collection items to find dirty ones so that we can mark the the owners as dirty too
				//I.e if a ConceptName/Mapping/Description was edited, mark the the Concept as dirty too
				for (Map.Entry<Object, List<Collection<?>>> entry : entityCollectionsMap.get().peek().entrySet()) {
					//System.out.println("entry: " + entry);
					for (Collection<?> coll : entry.getValue()) {
						//System.out.println("coll: " + coll);
						for (Object obj : coll) {
							//System.out.println("object: " + obj);
							boolean isInsert = OpenmrsUtil.collectionContains(inserts.get().peek(), obj);
							boolean isUpdate = OpenmrsUtil.collectionContains(updates.get().peek(), obj);
							
							//We handle the removed collections items below because either way they
							//are nolonger in the current collection
							if (isInsert || isUpdate) {
								Object owner = entry.getKey();
								boolean ownerHasUpdates = OpenmrsUtil.collectionContains(updates.get().peek(), owner);
								boolean isOwnerNew = OpenmrsUtil.collectionContains(inserts.get().peek(), owner);
								if (ownerHasUpdates) {
									if (log.isDebugEnabled()) {
										log.debug("There is already an auditlog for owner:" + owner.getClass() + " - "
										        + InterceptorUtil.getId(owner));
									}
								} else if (!isOwnerNew) {
									//A collection item was updated and no other update had been made on the owner
									if (log.isDebugEnabled()) {
										log.debug("Creating log entry for edited owner object with id:"
										        + InterceptorUtil.getId(owner) + " of type:" + owner.getClass().getName()
										        + " due to an update for a item in a child collection");
									}
									updates.get().peek().add(owner);
								}
								
								if (InterceptorUtil.isAudited(obj.getClass())) {
									if (ownerUuidChildLogsMap.get().peek().get(owner) == null) {
										ownerUuidChildLogsMap.get().peek().put(owner, new ArrayList<AuditLog>());
									}
									
									AuditLog childLog = instantiateAuditLog(obj, isInsert ? "CREATED" : "UPDATED");
									
									childbjectUuidAuditLogMap.get().peek().put(obj, childLog);
									ownerUuidChildLogsMap.get().peek().get(owner).add(childLog);
								}
								
								//TODO add this collection to the list of changes properties
								/*Map<String, Object[]> propertyValuesMap = objectChangesMap.get().peek().get(owner);
								if(propertyValuesMap == null)
									propertyValuesMap = new HashMap<String, Object[]>();
									propertyValuesMap.put(arg0, arg1);*/
							}
						}
					}
				}
				
				for (Map.Entry<Object, HashSet<Object>> entry : entityRemovedChildrenMap.get().peek().entrySet()) {
					Object removedItemsOwner = entry.getKey();
					for (Object removed : entry.getValue()) {
						//TODO add test to ensure that this should fail for collections
						//that don't have all-delete-orphan cascade
						boolean isDelete = OpenmrsUtil.collectionContains(deletes.get().peek(), removed);
						if (isDelete) {
							if (InterceptorUtil.isAudited(removed.getClass())) {
								if (ownerUuidChildLogsMap.get().peek().get(removedItemsOwner) == null)
									ownerUuidChildLogsMap.get().peek().put(removedItemsOwner, new ArrayList<AuditLog>());
								
								AuditLog childLog = instantiateAuditLog(removed, "DELETED");
								
								childbjectUuidAuditLogMap.get().peek().put(removed, childLog);
								ownerUuidChildLogsMap.get().peek().get(removedItemsOwner).add(childLog);
							}
						}
					}
				}
				
				List<AuditLog> logs = new ArrayList<AuditLog>();
				for (Object insert : inserts.get().peek()) {
					System.out.println("insert");
					logs.add(createAuditLogIfNecessary(insert, "CREATED"));
				}
				
				for (Object delete : deletes.get().peek()) {
					System.out.println("delete");
					logs.add(createAuditLogIfNecessary(delete, "DELETED"));
				}
				
				for (Object update : updates.get().peek()) {
					System.out.println("update");
					logs.add(createAuditLogIfNecessary(update, "UPDATED"));
				}
				
				for (AuditLog al : logs) {
					System.out.println("saved-action: " + al.getAction());
					System.out.println("class: " + al.getSimpleTypeName());
					System.out.println("username: " + al.getUser().getName());
					System.out.println(al);
					InterceptorUtil.saveAuditLog(al);
				}
			}
			catch (Exception e) {
				//error should not bubble out of the interceptor
				log.error("An error occured while creating audit log(s):", e);
			}
		}
		finally {
			//cleanup
			inserts.get().pop();
			updates.get().pop();
			deletes.get().pop();
			objectChangesMap.get().pop();
			entityCollectionsMap.get().pop();
			ownerUuidChildLogsMap.get().pop();
			childbjectUuidAuditLogMap.get().pop();
			entityRemovedChildrenMap.get().pop();
			date.get().pop();
			
			removeStacksIfEmpty();
		}
	}
	
	private AuditLog createAuditLogIfNecessary(Object object, String action) {
		System.out.println("tr9:");
		//If this is a collection element, we already created a log for it
		AuditLog auditLog = childbjectUuidAuditLogMap.get().peek().get(object);
		if (auditLog == null) {
			auditLog = instantiateAuditLog(object, action);
		}
		
		if ((ownerUuidChildLogsMap != null && ownerUuidChildLogsMap.get().peek().containsKey(object))) {
			for (AuditLog child : ownerUuidChildLogsMap.get().peek().get(object)) {
				auditLog.addChildAuditLog(child);
			}
		}
		return auditLog;
	}
	
	private AuditLog instantiateAuditLog(Object object, String action) {
		//System.out.println("tr10:");
		Serializable id = InterceptorUtil.getId(object);
		String serializedId = AuditLogUtil.serializeObject(id);
		AuditLog auditLog = new AuditLog(object.getClass(), action, Context.getAuthenticatedUser(), date.get().peek());
		SessionFactory sessionFactory = InterceptorUtil.getSessionFactory();
		if (action == "UPDATED" || action == "DELETED") {
			Map<String, Object[]> propertyValuesMap = null;
			System.out.println("action-action: " + action);
			if (action == "UPDATED") {
				propertyValuesMap = objectChangesMap.get().peek().get(object);
				if (propertyValuesMap != null) {
					
					String serializedData = AuditLogUtil.serializeToJson(propertyValuesMap);
					byte[] serializedDataBytes = serializedData.getBytes(StandardCharsets.UTF_8);
					Blob blob = Hibernate.getLobCreator(sessionFactory.getCurrentSession()).createBlob(serializedDataBytes);
					auditLog.setSerializedData(blob);
				}
			} else if (InterceptorUtil.storeLastStateOfDeletedItems()) {
				//TODO if one edits and deletes an object in the same API call, the property
				//value that gets serialized is the new one but actually was never saved
				//Should we store the value in the DB or the one in the current session?
				
				String serializedData = AuditLogUtil.serializeToJson(propertyValuesMap);
				byte[] serializedDataBytes = serializedData.getBytes(StandardCharsets.UTF_8);
				Blob blob = Hibernate.getLobCreator(sessionFactory.getCurrentSession()).createBlob(serializedDataBytes);
				auditLog.setSerializedData(blob);
			}
		}
		return auditLog;
	}
	
	private void initializeStacksIfNecessary() {
		//System.out.println("tr11:");
		if (inserts.get() == null) {
			inserts.set(new Stack<HashSet<Object>>());
		}
		if (updates.get() == null) {
			updates.set(new Stack<HashSet<Object>>());
		}
		if (deletes.get() == null) {
			deletes.set(new Stack<HashSet<Object>>());
		}
		if (objectChangesMap.get() == null) {
			objectChangesMap.set(new Stack<Map<Object, Map<String, Object[]>>>());
		}
		if (entityCollectionsMap.get() == null) {
			entityCollectionsMap.set(new Stack<Map<Object, List<Collection<?>>>>());
		}
		if (ownerUuidChildLogsMap.get() == null) {
			ownerUuidChildLogsMap.set(new Stack<Map<Object, List<AuditLog>>>());
		}
		if (childbjectUuidAuditLogMap.get() == null) {
			childbjectUuidAuditLogMap.set(new Stack<Map<Object, AuditLog>>());
		}
		if (entityRemovedChildrenMap.get() == null) {
			entityRemovedChildrenMap.set(new Stack<Map<Object, HashSet<Object>>>());
		}
		if (date.get() == null) {
			date.set(new Stack<Date>());
		}
	}
	
	private void removeStacksIfEmpty() {
		if (inserts.get().empty()) {
			inserts.remove();
		}
		if (updates.get().empty()) {
			updates.remove();
		}
		if (deletes.get().empty()) {
			deletes.remove();
		}
		if (objectChangesMap.get().empty()) {
			objectChangesMap.remove();
		}
		if (entityCollectionsMap.get().empty()) {
			entityCollectionsMap.remove();
		}
		if (ownerUuidChildLogsMap.get().empty()) {
			ownerUuidChildLogsMap.remove();
		}
		if (childbjectUuidAuditLogMap.get().empty()) {
			childbjectUuidAuditLogMap.remove();
		}
		if (entityRemovedChildrenMap.get().empty()) {
			entityRemovedChildrenMap.remove();
		}
		if (date.get().empty()) {
			date.remove();
		}
	}
	
	private void handleUpdatedCollection(Object currentCollOrMap, Object previousCollOrMap, Object owningObject, String role) {
		//System.out.println("tr12:");
		if (currentCollOrMap != null || previousCollOrMap != null) {
			String propertyName = role.substring(role.lastIndexOf('.') + 1);
			
			if (objectChangesMap.get().peek().get(owningObject) == null) {
				objectChangesMap.get().peek().put(owningObject, new HashMap<String, Object[]>());
			}
			
			Object previousSerializedItems = null;
			Object newSerializedItems = null;
			Class<?> collectionOrMapType;
			if (currentCollOrMap != null) {
				collectionOrMapType = currentCollOrMap.getClass();
			} else {
				collectionOrMapType = previousCollOrMap.getClass();
			}
			
			if (Collection.class.isAssignableFrom(collectionOrMapType)) {
				Collection cColl = (Collection) currentCollOrMap;
				Collection pColl = (Collection) previousCollOrMap;
				if (List.class.isAssignableFrom(collectionOrMapType)) {
					if (cColl == null) {
						cColl = Collections.EMPTY_LIST;
					}
					if (pColl == null) {
						pColl = Collections.EMPTY_LIST;
					}
				} else if (Set.class.isAssignableFrom(collectionOrMapType)) {
					if (cColl == null) {
						cColl = Collections.EMPTY_SET;
					}
					if (pColl == null) {
						pColl = Collections.EMPTY_SET;
					}
				}
				
				previousSerializedItems = AuditLogUtil.serializeCollectionItems(pColl);
				newSerializedItems = AuditLogUtil.serializeCollectionItems(cColl);
				
				//Track removed items so that when we create logs for them,
				//and link them to the parent's log
				Set<Object> removedItems = new HashSet<Object>();
				removedItems.addAll(CollectionUtils.subtract(pColl, cColl));
				if (!removedItems.isEmpty()) {
					if (entityRemovedChildrenMap.get().peek().get(owningObject) == null) {
						entityRemovedChildrenMap.get().peek().put(owningObject, new HashSet<Object>());
					}
					for (Object removedItem : removedItems) {
						entityRemovedChildrenMap.get().peek().get(owningObject).add(removedItem);
					}
				}
			} else if (Map.class.isAssignableFrom(collectionOrMapType)) {
				//For some reason hibernate ends calling onCollectionUpdate even when the map has
				//no changes. I think it uses object equality for the map entries and assumes the map has
				//changes. Noticed this happens for user.userProperties and added a unit test to prove it
				if (previousCollOrMap.equals(currentCollOrMap)) {
					return;
				}
				
				previousSerializedItems = AuditLogUtil.serializeMapItems((Map) previousCollOrMap);
				newSerializedItems = AuditLogUtil.serializeMapItems((Map) currentCollOrMap);
			}
			
			updates.get().peek().add(owningObject);
			objectChangesMap.get().peek().get(owningObject)
			        .put(propertyName, new Object[] { newSerializedItems, previousSerializedItems });
		}
	}
}
