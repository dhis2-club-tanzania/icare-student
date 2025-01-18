package org.openmrs.module.icare.laboratory.models;

import org.openmrs.BaseOpenmrsData;
import org.openmrs.User;

import javax.persistence.*;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "lb_worksheet_status")
public class WorksheetStatus extends BaseOpenmrsData implements java.io.Serializable {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "worksheet_status_id", unique = true, nullable = false)
	private Integer id;
	
	@ManyToOne
	@JoinColumn(name = "worksheet_id", nullable = false)
	private Worksheet worksheet;
	
	@Column(name = "category", length = 32)
	private String Category;
	
	@Column(name = "status", length = 65535)
	private String status;
	
	@Column(name = "remarks", length = 65535)
	private String remarks;
	
	@Override
	public Integer getId() {
		return id;
	}
	
	@Override
	public void setId(Integer id) {
		this.id = id;
	}
	
	public Worksheet getWorksheet() {
		return worksheet;
	}
	
	public void setWorksheet(Worksheet worksheet) {
		this.worksheet = worksheet;
	}
	
	public String getCategory() {
		return Category;
	}
	
	public void setCategory(String category) {
		Category = category;
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
	
	public static WorksheetStatus fromMap(Map<String, Object> worksheetStatusMap) {
		
		WorksheetStatus worksheetStatus = new WorksheetStatus();
		if (worksheetStatusMap.get("category") != null) {
			worksheetStatus.setCategory(worksheetStatusMap.get("category").toString());
		}
		if (worksheetStatusMap.get("status") != null) {
			worksheetStatus.setStatus(worksheetStatusMap.get("status").toString());
		}
		if (worksheetStatusMap.get("remarks") != null) {
			worksheetStatus.setRemarks(worksheetStatusMap.get("remarks").toString());
		}
		
		if (worksheetStatusMap.get("worksheet") != null) {
			Worksheet worksheet = new Worksheet();
			worksheet.setUuid(((Map) worksheetStatusMap.get("worksheet")).get("uuid").toString());
			worksheetStatus.setWorksheet(worksheet);
		}
		
		return worksheetStatus;
	}
	
	public Map<String,Object> toMap(){

		HashMap<String,Object> worksheetStatusObject = new HashMap<>();
		worksheetStatusObject.put("category",this.getCategory());
		worksheetStatusObject.put("status", this.getStatus());
		worksheetStatusObject.put("uuid",this.getUuid());

		if(this.getCreator() != null){
			Map<String,Object> creatorObject = new HashMap<>();
			creatorObject.put("uuid",this.getCreator().getUuid());
			creatorObject.put("display",this.getCreator().getDisplayString());
		}
		if(this.getWorksheet() != null){
			Map<String,Object> worksheetObject  = new HashMap<>();
			worksheetObject.put("uuid",this.getWorksheet().getUuid());
			worksheetObject.put("display",this.getWorksheet().getName());
		}
		if(this.getDateCreated() != null){
			worksheetStatusObject.put("dateCreated",this.getDateCreated());
		}

		return worksheetStatusObject;
	}
}
