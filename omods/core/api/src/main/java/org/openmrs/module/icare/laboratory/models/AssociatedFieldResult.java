package org.openmrs.module.icare.laboratory.models;

import org.openmrs.BaseOpenmrsData;
import org.openmrs.module.icare.core.JSONConverter;

import javax.persistence.*;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "lb_associated_field_result")
public class AssociatedFieldResult extends BaseOpenmrsData implements java.io.Serializable, JSONConverter {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "associated_field_result_id", nullable = false, unique = true)
	private Integer id;
	
	@ManyToOne
	@JoinColumn(name = "associated_field_id", nullable = false)
	private AssociatedField associatedField;
	
	@ManyToOne
	@JoinColumn(name = "test_result_id", nullable = false)
	private Result result;
	
	@Column(name = "value", length = 100)
	private String value;
	
	public AssociatedField getAssociatedField() {
		return associatedField;
	}
	
	public void setAssociatedField(AssociatedField associatedField) {
		this.associatedField = associatedField;
	}
	
	public Result getResult() {
		return result;
	}
	
	public void setResult(Result result) {
		this.result = result;
	}
	
	public String getValue() {
		return value;
	}
	
	public void setValue(String value) {
		this.value = value;
	}
	
	@Override
	public Integer getId() {
		return id;
	}
	
	@Override
	public void setId(Integer id) {
		this.id = id;
	}
	
	public static AssociatedFieldResult fromMap(Map<String, Object> associatedFieldResultMap) {
		
		AssociatedFieldResult associatedFieldResult = new AssociatedFieldResult();
		
		if (associatedFieldResultMap.get("associatedField") != null) {
			AssociatedField associatedField = new AssociatedField();
			associatedField.setUuid(((Map) associatedFieldResultMap.get("associatedField")).get("uuid").toString());
			associatedFieldResult.setAssociatedField(associatedField);
		}
		
		if (associatedFieldResultMap.get("result") != null) {
			Result result = new Result();
			result.setUuid(((Map) associatedFieldResultMap.get("result")).get("uuid").toString());
			associatedFieldResult.setResult(result);
		}
		
		if (associatedFieldResultMap.get("value") != null) {
			associatedFieldResult.setValue(associatedFieldResultMap.get("value").toString());
		}
		
		return associatedFieldResult;
	}
	
	@Override
    public Map<String, Object> toMap() {

        Map<String,Object> associatedFieldResultMap = new HashMap<>();

        if(this.getAssociatedField() != null){
            Map<String,Object> associatedFieldMap = new HashMap<>();
            associatedFieldMap.put("uuid", this.getAssociatedField().getUuid());
            associatedFieldMap.put("display",this.getAssociatedField().getName());
            associatedFieldResultMap.put("associatedField",associatedFieldMap);
        }

        if(this.getResult() != null){
            Map<String,Object> resultMap = new HashMap<>();
            resultMap.put("uuid", this.getResult().getUuid());
            resultMap.put("display", this.getResult().getValueCodedName());
            associatedFieldResultMap.put("result",resultMap);
        }

        if(this.getValue() != null){
            associatedFieldResultMap.put("value",this.getValue());
        }

        if (this.getDateCreated() != null) {
            associatedFieldResultMap.put("dateCreated", this.getDateCreated());
        }

        if (this.getCreator() != null) {
            Map<String, Object> creatorObject = new HashMap<String, Object>();
            creatorObject.put("uuid", this.getCreator().getUuid());
            creatorObject.put("display", this.getCreator().getDisplayString());
            associatedFieldResultMap.put("creator", creatorObject);
        }

        return associatedFieldResultMap;
    }
}
