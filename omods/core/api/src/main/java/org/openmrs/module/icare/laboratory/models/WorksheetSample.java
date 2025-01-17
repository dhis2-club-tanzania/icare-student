package org.openmrs.module.icare.laboratory.models;

import org.hibernate.annotations.Type;
import org.openmrs.BaseOpenmrsData;

import javax.persistence.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static javax.persistence.GenerationType.IDENTITY;

@Entity
@Table(name = "lb_worksheet_sample")
public class WorksheetSample extends BaseOpenmrsData implements java.io.Serializable {
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "worksheet_sample_id", unique = true, nullable = false)
	private Integer id;
	
	@Column(name = "code")
	private String code;
	
	@ManyToOne
	@JoinColumn(name = "worksheet_definition_id")
	private WorksheetDefinition worksheetDefinition;
	
	@Column(name = "rows", columnDefinition = "TINYINT")
	@Type(type = "org.hibernate.type.IntegerType")
	private Integer row;
	
	@Column(name = "columns", columnDefinition = "TINYINT")
	@Type(type = "org.hibernate.type.IntegerType")
	private Integer column;
	
	@ManyToOne
	@JoinColumn(name = "sample_id", nullable = true)
	private Sample sample;
	
	@ManyToOne
	@JoinColumn(name = "control_id", nullable = true)
	private WorksheetControl worksheetControl;
	
	@Column(name = "type")
	private String type;
	
	@Override
	public Integer getId() {
		return id;
	}
	
	@Override
	public void setId(Integer id) {
		this.id = id;
	}
	
	public WorksheetDefinition getWorksheetDefinition() {
		return worksheetDefinition;
	}
	
	public void setWorksheetDefinition(WorksheetDefinition worksheetDefinition) {
		this.worksheetDefinition = worksheetDefinition;
	}
	
	public Integer getRow() {
		return row;
	}
	
	public void setRow(Integer row) {
		this.row = row;
	}
	
	public Integer getColumn() {
		return column;
	}
	
	public void setColumn(Integer column) {
		this.column = column;
	}
	
	public Sample getSample() {
		return sample;
	}
	
	public void setSample(Sample sample) {
		this.sample = sample;
	}
	
	public WorksheetControl getWorksheetControl() {
		return worksheetControl;
	}
	
	public void setWorksheetControl(WorksheetControl worksheetControl) {
		this.worksheetControl = worksheetControl;
	}
	
	public String getType() {
		return type;
	}
	
	public void setType(String type) {
		this.type = type;
	}
	
	public String getCode() {
		return code;
	}
	
	public void setCode(String code) {
		this.code = code;
	}
	
	public static WorksheetSample fromMap(Map<String, Object> worksheetSampleMap) {
		
		WorksheetSample worksheetSample = new WorksheetSample();
		
		worksheetSample.setRow((Integer) worksheetSampleMap.get("row"));
		worksheetSample.setColumn((Integer) worksheetSampleMap.get("column"));
		worksheetSample.setType(worksheetSampleMap.get("type").toString());
		
		if (worksheetSampleMap.get("sample") != null) {
			Sample sample = new Sample();
			sample.setUuid(((Map) worksheetSampleMap.get("sample")).get("uuid").toString());
			worksheetSample.setSample(sample);
		}
		WorksheetDefinition worksheetDefinition = new WorksheetDefinition();
		worksheetDefinition.setUuid(((Map) worksheetSampleMap.get("worksheetDefinition")).get("uuid").toString());
		worksheetSample.setWorksheetDefinition(worksheetDefinition);
		
		if (worksheetSampleMap.get("worksheetControl") != null) {
			WorksheetControl worksheetControl = new WorksheetControl();
			worksheetControl.setUuid(((Map) worksheetSampleMap.get("worksheetControl")).get("uuid").toString());
			worksheetSample.setWorksheetControl(worksheetControl);
		}
		
		return worksheetSample;
	}
	
	public Map<String,Object> toMap(){

		Map<String,Object> worksheetSampleObject = new HashMap<>();

		worksheetSampleObject.put("row",this.getRow());
		worksheetSampleObject.put("column",this.getColumn());
		worksheetSampleObject.put("type",this.getType());
		worksheetSampleObject.put("uuid",this.getUuid());

		Map<String,Object> worksheetDefinitionObject = new HashMap<>();
		worksheetDefinitionObject.put("uuid",this.getWorksheetDefinition().getUuid());
		worksheetDefinitionObject.put("display",this.getWorksheetDefinition().getCode());
		worksheetSampleObject.put("worksheetDefinition",worksheetDefinitionObject);
		if( this.getSample() != null) {
			Map<String, Object> sampleObject = new HashMap<>();
			sampleObject.put("uuid", this.getSample().getUuid());
			sampleObject.put("display", this.getSample().getLabel());
			List<Map<String, Object>> allocations = new ArrayList<>();
			if (this.getSample().getSampleOrders().size() > 0) {
				for (SampleOrder order: sample.getSampleOrders()) {
					if (order.getTestAllocations().size() > 0) {
						for (TestAllocation allocation: order.getTestAllocations()) {
							allocations.add(allocation.toMap());
						}
					}
				}
			}

			List<Map<String, Object>> sampleStatuses = new ArrayList<>();
			if (this.getSample().getSampleStatuses().size() > 0) {
				for (SampleStatus sampleStatus: this.getSample().getSampleStatuses()) {
					sampleStatuses.add(sampleStatus.toMap());
				}
			}
			Map<String, Object> patient = new HashMap<>();
			if (this.getSample().getVisit() != null && this.getSample().getVisit().getPatient() != null) {
				if (this.getSample().getVisit().getPatient().getAge() != null) {
					patient.put("age", this.getSample().getVisit().getPatient().getAge().toString());
				}

				if (this.getSample().getVisit().getPatient().getGender() != null) {
					patient.put("gender", this.getSample().getVisit().getPatient().getGender().toString());
				}
			}

			sampleObject.put("allocations", allocations);
			sampleObject.put("statuses",sampleStatuses);
			sampleObject.put("patient",patient);
			worksheetSampleObject.put("sample", sampleObject);
		}

		if( this.getWorksheetControl() != null){
			Map<String,Object> worksheetControlObject = new HashMap<>();
			worksheetControlObject.put("uuid",this.getWorksheetControl().getUuid());
			worksheetControlObject.put("display",this.getWorksheetControl().getCode());
			worksheetSampleObject.put("worksheetControl",worksheetControlObject);
		}

		if (this.creator != null){
			Map<String,Object> userObject = new HashMap<>();
			userObject.put("uuid",this.getCreator().getUuid());
			userObject.put("display",this.getCreator().getDisplayString());
			worksheetDefinitionObject.put("creator",userObject);
		}
		return worksheetSampleObject;
	}
}
