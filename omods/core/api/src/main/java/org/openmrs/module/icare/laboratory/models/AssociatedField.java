package org.openmrs.module.icare.laboratory.models;

import org.openmrs.BaseOpenmrsData;
import org.openmrs.module.icare.core.JSONConverter;

import javax.persistence.*;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "lb_associated_field")
public class AssociatedField extends BaseOpenmrsData implements java.io.Serializable, JSONConverter {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "associated_field_id", unique = true, nullable = false)
	private Integer id;
	
	@Column(name = "name", length = 30)
	private String name;
	
	@Column(name = "description", length = 65535)
	private String description;
	
	@Column(name = "field_type", length = 30)
	private String fieldType;
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getDescription() {
		return description;
	}
	
	public void setDescription(String description) {
		this.description = description;
	}
	
	public String getFieldType() {
		return fieldType;
	}
	
	public void setFieldType(String fieldType) {
		this.fieldType = fieldType;
	}
	
	@Override
	public Integer getId() {
		return id;
	}
	
	@Override
	public void setId(Integer id) {
		this.id = id;
	}
	
	public static AssociatedField fromMap(Map<String, Object> associatedFieldMap) {
		
		AssociatedField associatedField = new AssociatedField();
		
		if (associatedFieldMap.get("name") != null) {
			associatedField.setName(associatedFieldMap.get("name").toString());
		}
		
		if (associatedFieldMap.get("description") != null) {
			associatedField.setDescription(associatedFieldMap.get("description").toString());
		}
		
		if (associatedFieldMap.get("fieldType") != null) {
			associatedField.setFieldType(associatedFieldMap.get("fieldType").toString());
		}
		
		if (associatedFieldMap.get("voided") != null) {
			associatedField.setVoided((Boolean) associatedFieldMap.get("voided"));
		}
		
		return associatedField;
	}
	
	public  Map<String,Object> toMap(){

        Map<String,Object> associatedFieldMap = new HashMap<>();

        if(this.getName() != null){
            associatedFieldMap.put("name",this.getName());
        }

        if(this.getDescription() != null){
            associatedFieldMap.put("description",this.getDescription());
        }

        if(this.getFieldType() != null){
            associatedFieldMap.put("fieldType",this.getFieldType());
        }

        if (this.getDateCreated() != null) {
            associatedFieldMap.put("dateCreated", this.getDateCreated());
        }

        if (this.getCreator() != null) {
            Map<String, Object> creatorObject = new HashMap<String, Object>();
            creatorObject.put("uuid", this.getCreator().getUuid());
            creatorObject.put("display", this.getCreator().getDisplayString());
            associatedFieldMap.put("creator", creatorObject);
        }

        if(this.getUuid() != null){
            associatedFieldMap.put("uuid",this.getUuid());
        }

        if(this.getVoided() != null){
            associatedFieldMap.put("voided", this.getVoided());
        }

        return  associatedFieldMap;

    }
}
