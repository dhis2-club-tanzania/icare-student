package org.openmrs.module.icare.laboratory.models;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.openmrs.BaseOpenmrsData;
import org.openmrs.Concept;
import org.openmrs.module.icare.core.utils.ChildIdOnlyDeserializer;
import org.openmrs.module.icare.core.utils.ChildIdOnlySerializer;

import javax.persistence.*;

import java.util.HashMap;
import java.util.Map;

import static javax.persistence.GenerationType.IDENTITY;

@Entity
@Table(name = "lb_test_ranges_configuration")
public class TestRangeConfig extends BaseOpenmrsData implements java.io.Serializable {
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "config_id", unique = true, nullable = false)
	private Integer id;
	
	@ManyToOne
	@JoinColumn(name = "concept_id")
	@JsonSerialize(using = ChildIdOnlySerializer.class)
	@JsonDeserialize(using = ChildIdOnlyDeserializer.class)
	private Concept concept;
	
	@Column(name = "gender")
	private String gender;
	
	@Column(name = "version")
	private String version;
	
	@Column(name = "absolute_high")
	private Double absoluteHigh;
	
	@Column(name = "critical_high")
	private Double criticalHigh;
	
	@Column(name = "normal_high")
	private Double normalHigh;
	
	@Column(name = "absolute_low")
	private Double absoluteLow;
	
	@Column(name = "critical_low")
	private Double criticalLow;
	
	@Column(name = "normal_low")
	private Double normalLow;
	
	@Override
	public Integer getId() {
		return id;
	}
	
	@Override
	public void setId(Integer id) {
		this.id = id;
	}
	
	public Double getNormalLow() {
		return normalLow;
	}
	
	public void setNormalLow(Double normalLow) {
		this.normalLow = normalLow;
	}
	
	public Double getCriticalLow() {
		return criticalLow;
	}
	
	public void setCriticalLow(Double criticalLow) {
		this.criticalLow = criticalLow;
	}
	
	public Double getAbsoluteLow() {
		return absoluteLow;
	}
	
	public void setAbsoluteLow(Double absoluteLow) {
		this.absoluteLow = absoluteLow;
	}
	
	public Double getNormalHigh() {
		return normalHigh;
	}
	
	public void setNormalHigh(Double normalHigh) {
		this.normalHigh = normalHigh;
	}
	
	public Double getCriticalHigh() {
		return criticalHigh;
	}
	
	public void setCriticalHigh(Double criticalHigh) {
		this.criticalHigh = criticalHigh;
	}
	
	public Double getAbsoluteHigh() {
		return absoluteHigh;
	}
	
	public void setAbsoluteHigh(Double absoluteHigh) {
		this.absoluteHigh = absoluteHigh;
	}
	
	public String getGender() {
		return gender;
	}
	
	public void setGender(String gender) {
		this.gender = gender;
	}
	
	public static TestRangeConfig fromMap(Map<String, Object> testRangeConfigMap) {
		
		//		sampleMap
		//		{
		//			concept: uuid,
		//			gender: "ME",
		//			absoluteHigh: 67875,
		//    		criticalHigh: 234,
		//			normalHigh: 9074093,
		//			absoluteLow: 982723,
		//			criticalLow: 12,
		//			normalLow: 0,
		//
		//		}
		
		TestRangeConfig testRangeConfig = new TestRangeConfig();
		if (testRangeConfigMap.get("uuid") == null) {
			
		} else {
			testRangeConfig.setUuid((String) testRangeConfigMap.get("uuid"));
		}
		testRangeConfig.setGender((String) testRangeConfigMap.get("gender"));
		testRangeConfig.setAbsoluteHigh(testRangeConfig.castToDouble(testRangeConfigMap.get("absoluteHigh")));
		testRangeConfig.setCriticalHigh(testRangeConfig.castToDouble(testRangeConfigMap.get("criticalHigh")));
		testRangeConfig.setNormalHigh(testRangeConfig.castToDouble(testRangeConfigMap.get("normalHigh")));
		testRangeConfig.setAbsoluteLow(testRangeConfig.castToDouble(testRangeConfigMap.get("absoluteLow")));
		testRangeConfig.setCriticalLow(testRangeConfig.castToDouble(testRangeConfigMap.get("criticalLow")));
		testRangeConfig.setNormalLow(testRangeConfig.castToDouble(testRangeConfigMap.get("normalLow")));
		testRangeConfig.setVersion((String) testRangeConfigMap.get("version"));
		
		Concept testConcept = new Concept();
		testConcept.setUuid((String) testRangeConfigMap.get("concept"));
		
		testRangeConfig.setConcept(testConcept);
		
		return testRangeConfig;
	}
	
	public Double castToDouble(Object value) {
		
		if (value instanceof Integer) {
			return (Double) ((Integer) value).doubleValue();
		} else {
			return (Double) value;
		}
	}
	
	public Map<String, Object> toMap() {
		
		HashMap<String, Object> testRangeConfigMap = new HashMap<String, Object>();
		
		HashMap<String, Object> conceptMap = new HashMap<String, Object>();
		
		conceptMap.put("display", this.getConcept().getDisplayString());
		conceptMap.put("uuid", this.getConcept().getUuid());
		conceptMap.put("name", this.getConcept().getName().getName());
		
		testRangeConfigMap.put("concept", conceptMap);
		
		testRangeConfigMap.put("uuid", this.getUuid());
		testRangeConfigMap.put("gender", this.getGender());
		testRangeConfigMap.put("absoluteHigh", this.getAbsoluteHigh());
		testRangeConfigMap.put("criticalHigh", this.getCriticalHigh());
		testRangeConfigMap.put("normalHigh", this.getNormalHigh());
		testRangeConfigMap.put("absoluteLow", this.getAbsoluteLow());
		testRangeConfigMap.put("criticalLow", this.getCriticalLow());
		testRangeConfigMap.put("normalLow", this.getNormalLow());
		testRangeConfigMap.put("version", this.getVersion());
		
		Map<String, Object> creatorObject = new HashMap<String, Object>();
		
		if (this.getCreator() != null) {
			creatorObject.put("uuid", this.getCreator().getUuid());
			creatorObject.put("display", this.getCreator().getDisplayString());
		}
		
		testRangeConfigMap.put("creator", creatorObject);
		
		testRangeConfigMap.put("created", this.getDateCreated());
		
		Map<String, Object> updatorObject = new HashMap<String, Object>();
		
		if (this.getChangedBy() != null) {
			updatorObject.put("uuid", this.getChangedBy().getUuid());
			updatorObject.put("display", this.getChangedBy().getDisplayString());
			updatorObject.put("display", this.getChangedBy().getName());
			
		}
		
		testRangeConfigMap.put("lastUpdatedBy", updatorObject);
		
		testRangeConfigMap.put("lastUpdated", this.getDateChanged());
		
		return testRangeConfigMap;
	}
	
	public Concept getConcept() {
		return concept;
	}
	
	public void setConcept(Concept concept) {
		this.concept = concept;
	}
	
	public String getVersion() {
		return version;
	}
	
	public void setVersion(String version) {
		this.version = version;
	}
}
