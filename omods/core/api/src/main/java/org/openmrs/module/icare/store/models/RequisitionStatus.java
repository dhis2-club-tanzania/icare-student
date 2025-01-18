package org.openmrs.module.icare.store.models;

// Generated Oct 7, 2020 12:48:40 PM by Hibernate Tools 5.2.10.Final

import org.openmrs.BaseOpenmrsData;

import javax.persistence.*;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * StRequisitionStatus generated by hbm2java
 */

@Entity
@Table(name = "st_requisition_status")
public class RequisitionStatus extends BaseOpenmrsData implements java.io.Serializable {
	
	@Id
	@GeneratedValue()
	@Column(name = "requisition_status_id", unique = true, nullable = false)
	private Integer id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "requisition_id")
	private Requisition requisition;
	
	@Column(name = "remarks", length = 65535)
	private String remarks;
	
	@Column(name = "status", length = 32)
	private RequisitionStatusCode status;
	
	public String getRemarks() {
		return this.remarks;
	}
	
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	
	public RequisitionStatusCode getStatus() {
		return this.status;
	}
	
	public void setStatus(RequisitionStatusCode status) {
		this.status = status;
	}
	
	public Requisition getRequisition() {
		return requisition;
	}
	
	public void setRequisition(Requisition requisition) {
		this.requisition = requisition;
	}
	
	public Integer getId() {
		return id;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}
	
	public static enum RequisitionStatusCode {
		REQUESTED, CANCELLED, REJECTED, ISSUED, RECEIVED, PENDING, DRAFT;
		
		private RequisitionStatusCode() {
		}
	}
	
	public Map<String, Object> toMap() {
		
		Map<String, Object> requisitionStatusObject = new HashMap<String, Object>();
		if(this.getUuid() != null){
			requisitionStatusObject.put("uuid", this.getUuid());
		}
		
//		Date date = this.getDateCreated();
//		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ");
		requisitionStatusObject.put("created", this.getDateCreated());
		requisitionStatusObject.put("remarks", this.getRemarks());
		requisitionStatusObject.put("status", this.getStatus());

		if(this.getRequisition() != null) {
			Map<String, Object> requsitionMap = new HashMap<>();
			requsitionMap.put("uuid", this.getRequisition().getUuid());
			requisitionStatusObject.put("requisition", requsitionMap);
		}
		
		Map<String, Object> creatorObject = new HashMap<String, Object>();
		if (this.getCreator() != null) {
			creatorObject.put("uuid", this.getCreator().getUuid());
			creatorObject.put("display", this.getCreator().getDisplayString());
		}
		requisitionStatusObject.put("creator", creatorObject);
		
		return requisitionStatusObject;
	}
	
	public static RequisitionStatus fromMap(Map<String, Object> requisitionStatusMap) {
		
		RequisitionStatus requisitionStatus = new RequisitionStatus();
		requisitionStatus.setRemarks(requisitionStatusMap.get("remarks").toString());
		requisitionStatus.setStatus(RequisitionStatusCode.valueOf(requisitionStatusMap.get("status").toString()));
		
		Requisition requisition = new Requisition();
		requisition.setUuid(((Map) requisitionStatusMap.get("requisition")).get("uuid").toString());
		requisitionStatus.setRequisition(requisition);
		
		return requisitionStatus;
	}
}
