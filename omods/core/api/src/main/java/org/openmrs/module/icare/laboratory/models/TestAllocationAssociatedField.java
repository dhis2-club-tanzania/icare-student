package org.openmrs.module.icare.laboratory.models;

import org.openmrs.BaseOpenmrsData;
import org.openmrs.module.icare.core.JSONConverter;

import javax.persistence.*;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "lb_test_allocation_associated_field")
public class TestAllocationAssociatedField extends BaseOpenmrsData implements JSONConverter, java.io.Serializable {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "test_allocation_associated_field_id", nullable = false, unique = true)
	private Integer id;
	
	@ManyToOne
	@JoinColumn(name = "test_allocation_id", nullable = false)
	private TestAllocation testAllocation;
	
	@ManyToOne
	@JoinColumn(name = "associated_field_id", nullable = false)
	private AssociatedField associatedField;
	
	public AssociatedField getAssociatedField() {
		return associatedField;
	}
	
	public void setAssociatedField(AssociatedField associatedField) {
		this.associatedField = associatedField;
	}
	
	public TestAllocation getTestAllocation() {
		return testAllocation;
	}
	
	public void setTestAllocation(TestAllocation testAllocation) {
		this.testAllocation = testAllocation;
	}
	
	@Override
	public Integer getId() {
		return id;
	}
	
	@Override
	public void setId(Integer id) {
		this.id = id;
	}
	
	public static TestAllocationAssociatedField fromMap(Map<String, Object> testAllocationAssociatedFieldMap) {
		
		TestAllocationAssociatedField testAllocationAssociatedField = new TestAllocationAssociatedField();
		
		if (testAllocationAssociatedFieldMap.get("testAllocation") != null) {
			TestAllocation testAllocation = new TestAllocation();
			testAllocation.setUuid(((Map) testAllocationAssociatedFieldMap.get("testAllocation")).get("uuid").toString());
			testAllocationAssociatedField.setTestAllocation(testAllocation);
		}
		
		if (testAllocationAssociatedFieldMap.get("associatedField") != null) {
			AssociatedField associatedField = new AssociatedField();
			associatedField.setUuid(((Map) testAllocationAssociatedFieldMap.get("associatedField")).get("uuid").toString());
			testAllocationAssociatedField.setAssociatedField(associatedField);
		}
		
		return testAllocationAssociatedField;
		
	}
	
	@Override
    public Map<String, Object> toMap() {

        Map<String,Object> testAllocationAssociatedFieldMap = new HashMap<>();

        if(this.getAssociatedField() != null){
            Map<String,Object> associatedFieldMap = new HashMap<>();
            associatedFieldMap.put("uuid", this.getAssociatedField().getUuid());
            associatedFieldMap.put("display",this.getAssociatedField().getName());
            testAllocationAssociatedFieldMap.put("associatedField",associatedFieldMap);
        }

        if(this.getTestAllocation() != null){
            Map<String,Object> testAllocationMap = new HashMap<>();
            testAllocationMap.put("uuid", this.getTestAllocation().getUuid());
            testAllocationMap.put("display",this.getTestAllocation().getLabel());
            testAllocationAssociatedFieldMap.put("testAllocation",testAllocationMap);
        }

        if(this.getUuid() != null){
            testAllocationAssociatedFieldMap.put("uuid", this.getUuid());
        }

        if (this.getDateCreated() != null) {
            testAllocationAssociatedFieldMap.put("dateCreated", this.getDateCreated());
        }

        if (this.getCreator() != null) {
            Map<String, Object> creatorObject = new HashMap<String, Object>();
            creatorObject.put("uuid", this.getCreator().getUuid());
            creatorObject.put("display", this.getCreator().getDisplayString());
            testAllocationAssociatedFieldMap.put("creator", creatorObject);
        }

        return testAllocationAssociatedFieldMap;
    }
}
