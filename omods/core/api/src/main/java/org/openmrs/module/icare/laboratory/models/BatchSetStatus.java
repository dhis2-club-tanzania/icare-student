package org.openmrs.module.icare.laboratory.models;

import org.openmrs.User;

import javax.persistence.*;

import java.sql.Timestamp;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static javax.persistence.GenerationType.IDENTITY;

@Entity
@Table(name = "lb_batch_set_status")
public class BatchSetStatus implements java.io.Serializable {
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "batch_set_status_id", unique = true, nullable = false)
	private int id;
	
	@ManyToOne
	@JoinColumn(name = "batch_set_id", nullable = false)
	private BatchSet batchSet;
	
	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	private User user;
	
	@Column(name = "status", length = 65535)
	private String status;
	
	@Column(name = "remarks", length = 65535)
	private String remarks;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "timestamp", length = 19)
	private Date timestamp;
	
	@Column(name = "category", length = 32)
	private String category;
	
	@Column(name = "retired")
	private Boolean retired;
	
	public int getId() {
		return id;
	}
	
	public void setId(int id) {
		this.id = id;
	}
	
	public Boolean getRetired() {
		return retired;
	}
	
	public void setRetired(Boolean retired) {
		this.retired = retired;
	}
	
	public String getCategory() {
		return category;
	}
	
	public void setCategory(String category) {
		this.category = category;
	}
	
	public Date getTimestamp() {
		return timestamp;
	}
	
	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
	}
	
	public BatchSet getBatchSet() {
		return batchSet;
	}
	
	public void setBatchSet(BatchSet batchSet) {
		this.batchSet = batchSet;
	}
	
	public String getRemarks() {
		return remarks;
	}
	
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	
	public String getStatus() {
		return status;
	}
	
	public void setStatus(String status) {
		this.status = status;
	}
	
	public User getUser() {
		return user;
	}
	
	public void setUser(User user) {
		this.user = user;
	}
	
	public static BatchSetStatus fromMap(Map<String, Object> map) {
		BatchSetStatus batchSetStatus = new BatchSetStatus();
		
		BatchSet batchSet = new BatchSet();
		batchSet.setUuid(((Map) map.get("batchSet")).get("uuid").toString());
		batchSetStatus.setBatchSet(batchSet);
		
		User user = new User();
		user.setUuid(((Map) map.get("user")).get("uuid").toString());
		batchSetStatus.setUser(user);
		
		batchSetStatus.setRemarks(((map.get("remarks")).toString()));
		batchSetStatus.setStatus((map.get("status")).toString());
		if (map.get("category") != null) {
			batchSetStatus.setCategory((map.get("category")).toString());
		}
		if (map.get("retired") != null) {
			batchSetStatus.setRetired((Boolean) map.get("retired"));
		}
		batchSetStatus.setTimestamp(new Timestamp(new Date().getTime()));
		batchSetStatus.setUser(user);
		return batchSetStatus;
	}
	
	public Map<String, Object> toMap() {
		Map<String, Object> batchSetStatusObject = new HashMap<String, Object>();
		batchSetStatusObject.put("status", this.getStatus());
		batchSetStatusObject.put("remarks", this.getRemarks());
		batchSetStatusObject.put("timestamp", this.getTimestamp());


		if (this.getCategory() != null) {
			batchSetStatusObject.put("category", this.getCategory());
		}
		if (this.retired != null) {
			batchSetStatusObject.put("retired", this.getRetired());
		}
		Map<String, Object> batchSetStatusUserObject = new HashMap<String, Object>();
		batchSetStatusUserObject.put("uuid", this.getUser().getUuid());
		batchSetStatusUserObject.put("display", this.getUser().getDisplayString());
		batchSetStatusObject.put("user", batchSetStatusUserObject);

		Map<String,Object> batchSetStatusBatchSetObject = new HashMap<>();
		batchSetStatusBatchSetObject.put("uuid",this.getBatchSet().getUuid());
		batchSetStatusBatchSetObject.put("display", this.getBatchSet().getBatchSetName());
		batchSetStatusObject.put("batchset",batchSetStatusBatchSetObject);
		
		return batchSetStatusObject;
	}
}
