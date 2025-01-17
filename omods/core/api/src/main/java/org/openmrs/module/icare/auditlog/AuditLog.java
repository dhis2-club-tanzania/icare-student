package org.openmrs.module.icare.auditlog;

import org.apache.commons.lang.StringUtils;
import org.openmrs.*;
import org.openmrs.module.icare.core.JSONConverter;

import javax.persistence.*;
import javax.transaction.Transactional;
import java.io.Serializable;
import java.sql.Blob;
import java.util.*;

@Entity
@Table(name = "audit_log")
public class AuditLog implements Serializable, JSONConverter {
	
	private static final long serialVersionUID = 1L;
	
	@Column(name = "uuid", length = 38, nullable = false, unique = true)
	private String uuid = UUID.randomUUID().toString();
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "audit_log_id")
	private Integer auditLogId;
	
	//the fully qualified java class name of the create/updated/deleted object
	@Column(name = "type", length = 512, nullable = false)
	private Class<?> type;
	
	//the unique database id of the created/updated/deleted object
	//	@Column(name = "identifier", length = 255, nullable = false)
	//	private Serializable identifier;
	
	//the performed operation that which could be a create, update or delete
	@Column(name = "action", length = 50, nullable = false)
	private String action;
	
	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	private User user;
	
	@Column(name = "date_created", nullable = false)
	private Date dateCreated;
	
	@ManyToOne
	@JoinColumn(name = "parent_auditlog_id")
	private AuditLog parentAuditLog;
	
	@OneToMany(mappedBy = "parentAuditLog", cascade = CascadeType.ALL, orphanRemoval = true)
	private Set<AuditLog> childAuditLogs;
	
	/**
	 * Used to store Json for field new and old values for updated items or last properties values
	 * of deleted items
	 */
	@Lob
	@Column(name = "serialized_data")
	private Blob serializedData;
	
	public enum Action {
		CREATED, UPDATED, DELETED
	}
	
	/**
	 * Default constructor
	 */
	public AuditLog() {
	}
	
	public AuditLog(Class<?> type, String action, User user, Date dateCreated) {
		this();
		this.type = type;
		//this.identifier = identifier;
		this.action = action;
		this.user = user;
		this.dateCreated = dateCreated;
	}
	
	/**
	 * @return the auditLogId
	 */
	public Integer getAuditLogId() {
		return auditLogId;
	}
	
	/**
	 * @param auditLogId the auditLogId to set
	 */
	public void setAuditLogId(Integer auditLogId) {
		this.auditLogId = auditLogId;
	}
	
	/**
	 * @return the type
	 */
	public Class<?> getType() {
		return type;
	}
	
	/**
	 * @param type the type to set
	 */
	public void setType(Class<?> type) {
		this.type = type;
	}
	
	/**
	 * @return the identifier
	 */
	//	public Serializable getIdentifier() {
	//		return identifier;
	//	}
	
	/**
	 * @param identifier the identifier to set
	 */
	//	public void setIdentifier(Serializable identifier) {
	//		this.identifier = identifier;
	//	}
	
	/**
	 * @return the action
	 */
	public String getAction() {
		return action;
	}
	
	/**
	 * @param action the action to set
	 */
	public void setAction(String action) {
		this.action = action;
	}
	
	/**
	 * @return the user
	 */
	public User getUser() {
		return user;
	}
	
	/**
	 * @param user the user to set
	 */
	public void setUser(User user) {
		this.user = user;
	}
	
	/**
	 * @return the dateCreated
	 */
	public Date getDateCreated() {
		return dateCreated;
	}
	
	/**
	 * @param dateCreated the dateCreated to set
	 */
	public void setDateCreated(Date dateCreated) {
		this.dateCreated = dateCreated;
	}
	
	public String getUuid() {
		return uuid;
	}
	
	/**
	 * @param uuid the uuid to set
	 */
	public void setUuid(String uuid) {
		this.uuid = uuid;
	}
	
	/**
	 * @return the parentAuditLog
	 */
	public AuditLog getParentAuditLog() {
		return parentAuditLog;
	}
	
	/**
	 * @param parentAuditLog the parentAuditLog to set
	 */
	public void setParentAuditLog(AuditLog parentAuditLog) {
		this.parentAuditLog = parentAuditLog;
	}
	
	/**
	 * @return the childAuditLogs
	 */
	public Set<AuditLog> getChildAuditLogs() {
		if (childAuditLogs == null) {
			childAuditLogs = new LinkedHashSet<AuditLog>();
		}
		return childAuditLogs;
	}
	
	/**
	 * @param childAuditLogs the childAuditLogs to set
	 */
	public void setChildAuditLogs(Set<AuditLog> childAuditLogs) {
		this.childAuditLogs = childAuditLogs;
	}
	
	/**
	 * @return the serializedData
	 */
	public Blob getSerializedData() {
		return serializedData;
	}
	
	/**
	 * @param serializedData the serializedData to set
	 */
	public void setSerializedData(Blob serializedData) {
		this.serializedData = serializedData;
	}
	
	/**
	 * Returns the simple forms of the classname property e.g 'Concept Name' will be returned for
	 * ConceptName
	 * 
	 * @return the classname
	 */
	public String getSimpleTypeName() {
		String[] sections = StringUtils.splitByCharacterTypeCamelCase(getType().getSimpleName());
		return StringUtils.join(sections, " ");
	}
	
	/**
	 * Adds the specified auditLog as a child
	 * 
	 * @param auditLog the AuditLog to add
	 */
	public void addChildAuditLog(AuditLog auditLog) {
		if (auditLog == null) {
			return;
		}
		auditLog.setParentAuditLog(this);
		getChildAuditLogs().add(auditLog);
	}
	
	/**
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
	@Override
	public boolean equals(Object obj) {
		return this == obj
		        || (obj instanceof AuditLog && getUuid() != null && ((AuditLog) obj).getUuid().equals(this.getUuid()));
		
	}
	
	/**
	 * @see java.lang.Object#hashCode()
	 */
	@Override
	public int hashCode() {
		if (getUuid() == null) {
			return super.hashCode();
		}
		return getUuid().hashCode();
	}
	
	/**
	 * @see Object#toString() ()
	 */
	@Override
	public String toString() {
		return action + " " + type + " " + uuid;
	}
	
	public boolean hasChildLogs() {
		return getChildAuditLogs().size() > 0;
	}
	
	public Map<String, Object> toMap() {
		Map<String, Object> auditLogMap = new HashMap<>();
		if(this.getUuid() != null) {
			auditLogMap.put("uuid", this.uuid);
		}
		if(this.getDateCreated() != null) {
			auditLogMap.put("date_created", this.getDateCreated());
		}
		if(this.getAction() != null) {
			auditLogMap.put("action", this.getAction());
		}

		if(this.getType() != null){
			auditLogMap.put("type",this.getType());
		}

		if(this.getUser() != null){
			Map<String,Object> userObjectMap = new HashMap<>();
			userObjectMap.put("id",this.getUser().getId());
			userObjectMap.put("name", this.getUser().getPersonName().getFullName());
			userObjectMap.put("username",this.getUser().getUsername());
			auditLogMap.put("user",userObjectMap);
		}

		return auditLogMap;

	}
}
