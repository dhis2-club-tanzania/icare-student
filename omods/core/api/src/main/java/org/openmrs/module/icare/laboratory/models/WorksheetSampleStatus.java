package org.openmrs.module.icare.laboratory.models;

import org.openmrs.BaseOpenmrsData;

import javax.persistence.*;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "lb_worksheet_sample_status")
public class WorksheetSampleStatus extends BaseOpenmrsData implements java.io.Serializable {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "worksheet_sample_status_id", unique = true, nullable = false)
	private Integer id;
	
	@ManyToOne
	@JoinColumn(name = "worksheet_sample_id", nullable = false)
	private WorksheetSample worksheetSample;
	
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
	
	public String getCategory() {
		return Category;
	}
	
	public void setCategory(String category) {
		Category = category;
	}
	
	public String getStatus() {
		return status;
	}
	
	public void setStatus(String status) {
		this.status = status;
	}
	
	public String getRemarks() {
		return remarks;
	}
	
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	
	public WorksheetSample getWorksheetSample() {
		return worksheetSample;
	}
	
	public void setWorksheetSample(WorksheetSample worksheetSample) {
		this.worksheetSample = worksheetSample;
	}
	
	public static WorksheetSampleStatus fromMap(Map<String, Object> worksheetSampleStatusMap) {
		
		WorksheetSampleStatus worksheetSampleStatus = new WorksheetSampleStatus();
		if (worksheetSampleStatusMap.get("category") != null) {
			worksheetSampleStatus.setCategory(worksheetSampleStatusMap.get("category").toString());
		}
		if (worksheetSampleStatusMap.get("status") != null) {
			worksheetSampleStatus.setStatus(worksheetSampleStatusMap.get("status").toString());
		}
		if (worksheetSampleStatusMap.get("remarks") != null) {
			worksheetSampleStatus.setRemarks(worksheetSampleStatusMap.get("remarks").toString());
		}
		if (worksheetSampleStatusMap.get("worksheetSample") != null) {
			WorksheetSample worksheetSample = new WorksheetSample();
			worksheetSample.setUuid(((Map) worksheetSampleStatusMap.get("worksheetSample")).get("uuid").toString());
			worksheetSampleStatus.setWorksheetSample(worksheetSample);
		}
		
		return worksheetSampleStatus;
	}
	
	public Map<String,Object> toMap(){

		HashMap<String,Object> worksheetSampleStatusObject = new HashMap<>();
		worksheetSampleStatusObject.put("category",this.getCategory());
		worksheetSampleStatusObject.put("status", this.getStatus());
		worksheetSampleStatusObject.put("uuid",this.getUuid());

		if(this.getCreator() != null){
			Map<String,Object> creatorObject = new HashMap<>();
			creatorObject.put("uuid",this.getCreator().getUuid());
			creatorObject.put("display",this.getCreator().getDisplayString());
		}
		if(this.getWorksheetSample() != null){
			Map<String,Object> worksheetObject  = new HashMap<>();
			worksheetObject.put("uuid",this.getWorksheetSample().getUuid());
			worksheetObject.put("display",this.getWorksheetSample().getCode());
		}
		if(this.getDateCreated() != null){
			worksheetSampleStatusObject.put("dateCreated",this.getDateCreated());
		}

		return worksheetSampleStatusObject;
	}
}
