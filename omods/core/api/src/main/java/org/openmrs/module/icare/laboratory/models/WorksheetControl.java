package org.openmrs.module.icare.laboratory.models;

import org.openmrs.BaseOpenmrsMetadata;
import org.openmrs.Concept;

import javax.persistence.*;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "lb_worksheet_control")
public class WorksheetControl extends BaseOpenmrsMetadata implements java.io.Serializable {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "worksheet_control_id", nullable = false, unique = true)
	private Integer id;
	
	@Column(name = "code")
	private String code;
	
	@ManyToOne
	@JoinColumn(name = "test_order_id")
	private Concept testOrder;
	
	@Override
	public Integer getId() {
		return id;
	}
	
	@Override
	public void setId(Integer id) {
		this.id = id;
	}
	
	public String getCode() {
		return code;
	}
	
	public void setCode(String code) {
		this.code = code;
	}
	
	public Concept getTestOrder() {
		return testOrder;
	}
	
	public void setTestOrder(Concept testOrder) {
		this.testOrder = testOrder;
	}
	
	public static WorksheetControl fromMap(Map<String, Object> worksheetMap) {
		
		WorksheetControl worksheetControl = new WorksheetControl();
		worksheetControl.setCode(worksheetMap.get("code").toString());
		if (worksheetMap.get("description") != null) {
			worksheetControl.setDescription(worksheetMap.get("description").toString());
		}
		worksheetControl.setName(worksheetMap.get("name").toString());
		
		return worksheetControl;
	}
	
	public Map<String,Object> toMap(){

		HashMap<String,Object> worksheetControlObject = new HashMap<>();

		worksheetControlObject.put("code",this.getCode());
		worksheetControlObject.put("uuid",this.getUuid());
		if(this.getDescription() != null){
			worksheetControlObject.put("description",this.getDescription());
		}
		worksheetControlObject.put("name",this.getName());

		Map<String,Object> testOrderObject = new HashMap<>();
		testOrderObject.put("uuid",this.getTestOrder().getUuid());
		testOrderObject.put("display",this.getTestOrder().getDisplayString());
		worksheetControlObject.put("testOrder",testOrderObject);

		if(this.getCreator() != null){
			Map<String,Object> creatorObject = new HashMap<>();
			creatorObject.put("uuid",this.getCreator().getUuid());
			creatorObject.put("display",this.getCreator().getDisplayString());
		}

		return worksheetControlObject;
	}
}
