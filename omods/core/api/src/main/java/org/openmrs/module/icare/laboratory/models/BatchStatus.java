package org.openmrs.module.icare.laboratory.models;

import org.openmrs.User;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static javax.persistence.GenerationType.IDENTITY;

@Entity
@Table(name = "lb_batch_status")
public class BatchStatus implements java.io.Serializable {
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "batch_status_id", unique = true, nullable = false)
	private int id;
	
	@ManyToOne
	@JoinColumn(name = "batch_set_id", nullable = false)
	private Batch batch;
	
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
	
	public Batch getBatch() {
		return batch;
	}
	
	public void setBatch(Batch batch) {
		this.batch = batch;
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
	
	public static BatchStatus fromMap(Map<String, Object> map) {
		BatchStatus batchStatus = new BatchStatus();
		
		Batch batch = new Batch();
		batch.setUuid(((Map) map.get("batch")).get("uuid").toString());
		batchStatus.setBatch(batch);
		
		User user = new User();
		user.setUuid(((Map) map.get("user")).get("uuid").toString());
		batchStatus.setUser(user);
		
		batchStatus.setRemarks(((map.get("remarks")).toString()));
		batchStatus.setStatus((map.get("status")).toString());
		if (map.get("category") != null) {
			batchStatus.setCategory((map.get("category")).toString());
		}
		if (map.get("retired") != null) {
			batchStatus.setRetired((Boolean) map.get("retired"));
		}
		batchStatus.setTimestamp(new Timestamp(new Date().getTime()));
		batchStatus.setUser(user);
		return batchStatus;
	}
	
	public Map<String, Object> toMap() {
		Map<String, Object> batchStatusObject = new HashMap<String, Object>();
		batchStatusObject.put("status", this.getStatus());
		batchStatusObject.put("remarks", this.getRemarks());
		batchStatusObject.put("timestamp", this.getTimestamp());
		//allocationStatusesObject.put("uuid", this.getUuid());
		if (this.getCategory() != null) {
			batchStatusObject.put("category", this.getCategory());
		}
		if (this.retired != null) {
			batchStatusObject.put("retired", this.getRetired());
		}
		Map<String, Object> batchStatusUserObject = new HashMap<String, Object>();
		batchStatusUserObject.put("uuid", this.getUser().getUuid());
		batchStatusUserObject.put("display", this.getUser().getDisplayString());
		batchStatusObject.put("user", batchStatusUserObject);

		Map<String,Object> batchStatusBatchObject = new HashMap<>();
		batchStatusBatchObject.put("uuid",this.getBatch().getUuid());
		batchStatusBatchObject.put("display", this.getBatch().getBatchName());
		batchStatusObject.put("batchset",batchStatusBatchObject);
		
		return batchStatusObject;
	}
}
