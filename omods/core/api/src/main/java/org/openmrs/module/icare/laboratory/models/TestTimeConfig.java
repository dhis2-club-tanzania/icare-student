package org.openmrs.module.icare.laboratory.models;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.openmrs.BaseOpenmrsData;
import org.openmrs.Concept;
import org.openmrs.module.icare.core.utils.ChildIdOnlyDeserializer;
import org.openmrs.module.icare.core.utils.ChildIdOnlySerializer;
import javax.persistence.*;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static javax.persistence.GenerationType.IDENTITY;

@Entity
@Table(name = "lb_test_time_configuration")
public class TestTimeConfig extends BaseOpenmrsData implements java.io.Serializable {
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "config_id", unique = true, nullable = false)
	private Integer id;
	
	@ManyToOne
	@JoinColumn(name = "concept_id")
	@JsonSerialize(using = ChildIdOnlySerializer.class)
	@JsonDeserialize(using = ChildIdOnlyDeserializer.class)
	private Concept concept;
	
	@Column(name = "version")
	private String version;
	
	@Column(name = "standard_tat")
	private Long standardTAT;
	
	@Column(name = "urgent_tat")
	private Long urgentTAT;
	
	@Column(name = "referral_tat")
	private Long referralTAT;
	
	@Column(name = "additional_request_time_limit")
	private Integer addReqTimeLimit;
	
	@Column(name = "urgent_config_type")
	private String urgentConfigType;
	
	@Column(name = "routine_config_type")
	private String routineConfigType;
	
	@Column(name = "referral_config_type")
	private String referralConfigType;
	
	public TestTimeConfig() {
		
	}
	
	public void setStandardTAT(Long stdTAT) {
		this.standardTAT = stdTAT;
	}
	
	public Long getStandardTAT() {
		return standardTAT;
	}
	
	public void setUrgentTAT(Long urgTAT) {
		this.urgentTAT = urgTAT;
	}
	
	public Long getUrgentTAT() {
		return urgentTAT;
	}
	
	public void setReferralTAT(Long referralTAT) {
		this.referralTAT = referralTAT;
	}
	
	public Long getReferralTAT() {
		return referralTAT;
	}
	
	public void setAddReqTimeLimit(Integer addReqTimeLimit) {
		this.addReqTimeLimit = addReqTimeLimit;
	}
	
	public Integer getAddReqTimeLimit() {
		return addReqTimeLimit;
	}
	
	public void setUrgentConfigType(String urgentConfigType) {
		this.urgentConfigType = urgentConfigType;
	}
	
	public String getUrgentConfigType() {
		return urgentConfigType;
	}
	
	public void setRoutineConfigType(String routineConfigType) {
		this.routineConfigType = routineConfigType;
	}
	
	public String getRoutineConfigType() {
		return routineConfigType;
	}
	
	public void setReferralConfigType(String referralConfigType) {
		this.referralConfigType = referralConfigType;
	}
	
	public String getReferralConfigType() {
		return referralConfigType;
	}
	
	@Override
	public Integer getId() {
		return id;
	}
	
	@Override
	public void setId(Integer id) {
		this.id = id;
	}
	
	public static TestTimeConfig fromMap(Map<String, Object> testTimeConfigMap) {
		
		//		samplemap
		//		{
		//			concept: uuid,
		//			standardTAT: 182681,
		//			urgentTAT: 912739,
		//			additionalReqTimeLimit: 6328763
		//
		//		}
		
		TestTimeConfig testTimeConfig = new TestTimeConfig();
		
		if (testTimeConfigMap.get("additionalReqTimeLimit") != null) {
			testTimeConfig.setAddReqTimeLimit((Integer) testTimeConfigMap.get("additionalReqTimeLimit"));
		}
		//		testTimeConfig.setStandardTAT(((Integer) testTimeConfigMap.get("standardTAT")).longValue());
		//		testTimeConfig.setUrgentTAT(((Integer) testTimeConfigMap.get("urgentTAT")).longValue());
		//		testTimeConfig.setReferralTAT(((Integer) testTimeConfigMap.get("referralTAT")).longValue());
		if (testTimeConfigMap.get("standardTAT") != null) {
			testTimeConfig.setStandardTAT(Long.parseLong(testTimeConfigMap.get("standardTAT").toString()));
		}
		if (testTimeConfigMap.get("referralTAT") != null) {
			testTimeConfig.setReferralTAT(Long.parseLong(testTimeConfigMap.get("referralTAT").toString()));
		}
		if (testTimeConfigMap.get("urgentTAT") != null) {
			testTimeConfig.setUrgentTAT(Long.parseLong(testTimeConfigMap.get("urgentTAT").toString()));
		}
		if (testTimeConfigMap.get("version") != null) {
			testTimeConfig.setVersion((String) testTimeConfigMap.get("version"));
		}
		if (testTimeConfigMap.get("urgentConfigType") != null) {
			testTimeConfig.setUrgentConfigType((String) testTimeConfigMap.get("urgentConfigType"));
		}
		if (testTimeConfigMap.get("routineConfigType") != null) {
			testTimeConfig.setRoutineConfigType((String) testTimeConfigMap.get("routineConfigType"));
		}
		if (testTimeConfigMap.get("referralConfigType") != null) {
			testTimeConfig.setReferralConfigType((String) testTimeConfigMap.get("referralConfigType"));
		}
		
		if (testTimeConfigMap.get("uuid") == null) {
			
		} else {
			testTimeConfig.setUuid((String) testTimeConfigMap.get("uuid"));
		}
		
		Concept testConcept = new Concept();
		testConcept.setUuid((String) testTimeConfigMap.get("concept"));
		
		testTimeConfig.setConcept(testConcept);
		
		return testTimeConfig;
	}
	
	public Map<String, Object> toMap() {
		
		HashMap<String, Object> testTimeConfigMap = new HashMap<String, Object>();
		
		HashMap<String, Object> conceptMap = new HashMap<String, Object>();
		
		conceptMap.put("display", this.getConcept().getDisplayString());
		conceptMap.put("uuid", this.getConcept().getUuid());
		
		testTimeConfigMap.put("concept", conceptMap);
		
		testTimeConfigMap.put("uuid", this.getUuid());
		if (this.getStandardTAT() != null) {
			testTimeConfigMap.put("standardTAT", this.getStandardTAT());
		}
		if (this.getUrgentTAT() != null) {
			testTimeConfigMap.put("urgentTAT", this.getUrgentTAT());
		}
		if (this.getReferralTAT() != null) {
			testTimeConfigMap.put("referralTAT", this.getReferralTAT());
		}
		if (this.getUrgentConfigType() != null) {
			testTimeConfigMap.put("urgentConfigType", this.getUrgentConfigType());
		}
		if (this.getRoutineConfigType() != null) {
			testTimeConfigMap.put("routineConfigType", this.getRoutineConfigType());
		}
		if (this.getReferralConfigType() != null) {
			testTimeConfigMap.put("referralConfigType", this.getReferralConfigType());
		}
		
		if (this.version != null) {
			testTimeConfigMap.put("version", this.getVersion());
		}
		if (this.getAddReqTimeLimit() != null) {
			testTimeConfigMap.put("additionalReqTimeLimit", this.getAddReqTimeLimit());
		}
		Map<String, Object> creatorObject = new HashMap<String, Object>();
		
		if (this.getCreator() != null) {
			creatorObject.put("uuid", this.getCreator().getUuid());
			creatorObject.put("display", this.getCreator().getDisplayString());
			creatorObject.put("name", this.getCreator().getName());
		}
		
		testTimeConfigMap.put("creator", creatorObject);
		
		testTimeConfigMap.put("created", this.getDateCreated());
		
		Map<String, Object> updatorObject = new HashMap<String, Object>();
		
		if (this.getChangedBy() != null) {
			updatorObject.put("uuid", this.getChangedBy().getUuid());
			updatorObject.put("display", this.getChangedBy().getDisplayString());
			updatorObject.put("display", this.getChangedBy().getName());
			
		}
		
		testTimeConfigMap.put("lastUpdatedBy", updatorObject);
		
		testTimeConfigMap.put("lastUpdated", this.getDateChanged());
		
		return testTimeConfigMap;
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
