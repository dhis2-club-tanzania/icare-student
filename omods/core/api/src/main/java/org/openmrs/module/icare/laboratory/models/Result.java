package org.openmrs.module.icare.laboratory.models;

import org.openmrs.*;

import javax.naming.Context;
import javax.persistence.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import static javax.persistence.GenerationType.IDENTITY;

@Entity
@Table(name = "lb_test_result")
public class Result extends BaseOpenmrsData implements java.io.Serializable {
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "test_result_id", unique = true, nullable = false)
	private Integer id;
	
	@Column(name = "value_text", length = 65535)
	private String valueText;
	
	@Column(name = "value_boolean")
	private Boolean valueBoolean;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "value_coded_concept_id")
	private Concept valueCoded;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "value_drug_id")
	private Drug valueDrug;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "value_coded_name_id")
	private ConceptName valueCodedName;
	
	@Column(name = "value_numeric")
	private Double valueNumeric;
	
	@Column(name = "abnormal")
	private Boolean abnormal;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "value_group_id", nullable = true)
	private Result valueGroup;
	
	@Column(name = "value_date_time")
	private Date valueDatetime;
	
	@Column(name = "value_modifier")
	private String valueModifier;
	
	@Column(name = "value_complex")
	private String valueComplex;
	
	@Column(name = "standard_tat")
	private Integer standardTAT;
	
	@Column(name = "urgent_tat")
	private Integer urgentTAT;
	
	@Column(name = "additional_request_time_limit")
	private Integer addReqTimeLimit;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "test_allocation_id")
	private TestAllocation testAllocation;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "concept_id", unique = true, nullable = false)
	private Concept concept;
	
	//	@ManyToOne(fetch = FetchType.LAZY)
	//	TODO: Add relationship with instrument provided is alread set
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "instrument_id", nullable = true)
	private Concept instrument;

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "result")
	private List<AssociatedFieldResult> associatedFieldResults = new ArrayList<>(0);

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "tested_by", nullable = true)
	private User testedBy;

	@Column(name = "date_tested")
	private Date testedDate;

	@Transient
	private String instrumentCode;
	public Integer getId() {
		return id;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}
	
	public Boolean getAbnormal() {
		return this.abnormal;
	}
	
	public void setAbnormal(Boolean abnormalResults) {
		this.abnormal = abnormalResults;
	}
	
	public TestAllocation getTestAllocation() {
		return testAllocation;
	}
	
	public void setTestAllocation(TestAllocation testAllocation) {
		this.testAllocation = testAllocation;
	}
	
	public Concept getConcept() {
		return concept;
	}
	
	public void setConcept(Concept concept) {
		this.concept = concept;
	}
	
	public String getValueText() {
		return valueText;
	}
	
	public void setValueText(String valueText) {
		this.valueText = valueText;
	}
	
	public Boolean getValueBoolean() {
		return valueBoolean;
	}
	
	public void setValueBoolean(Boolean valueBoolean) {
		this.valueBoolean = valueBoolean;
	}
	
	public Concept getValueCoded() {
		return valueCoded;
	}
	
	public void setValueCoded(Concept valueCoded) {
		this.valueCoded = valueCoded;
	}
	
	public Drug getValueDrug() {
		return valueDrug;
	}
	
	public void setValueDrug(Drug valueDrug) {
		this.valueDrug = valueDrug;
	}
	
	public ConceptName getValueCodedName() {
		return valueCodedName;
	}
	
	public void setValueCodedName(ConceptName valueCodedName) {
		this.valueCodedName = valueCodedName;
	}
	
	public Double getValueNumeric() {
		return valueNumeric;
	}
	
	public void setValueNumeric(Double valueNumeric) {
		this.valueNumeric = valueNumeric;
	}
	
	public Result getValueGroup() {
		return valueGroup;
	}
	
	public void setValueGroup(Result valueGroup) {
		this.valueGroup = valueGroup;
	}
	
	public Date getValueDatetime() {
		return valueDatetime;
	}
	
	public void setValueDatetime(Date valueDatetime) {
		this.valueDatetime = valueDatetime;
	}
	
	public String getValueModifier() {
		return valueModifier;
	}
	
	public void setValueModifier(String valueModifier) {
		this.valueModifier = valueModifier;
	}
	
	public String getValueComplex() {
		return valueComplex;
	}
	
	public void setValueComplex(String valueComplex) {
		this.valueComplex = valueComplex;
	}

	public List<AssociatedFieldResult> getAssociatedFieldResults() {
		return associatedFieldResults;
	}

	public void setAssociatedFieldResults(List<AssociatedFieldResult> associatedFieldResults) {
		this.associatedFieldResults = associatedFieldResults;
	}

	public void setTestedBy(User testedBy) {
		this.testedBy = testedBy;
	}

	public User getTestedBy() {
		return testedBy;
	}

	public void setTestedDate(Date testedDate) {
		this.testedDate = testedDate;
	}

	public Date getTestedDate() {
		return testedDate;
	}

	public static Result fromMap(Map<String, Object> map) throws ParseException {
		Result result = new Result();

		if ((map.get("uuid")) != null) {
			result.setUuid((map.get("uuid").toString()));
		}
		if ((map.get("valueText")) != null) {
			result.setValueText((map.get("valueText").toString()));
		}
		
		if ((map.get("valueNumeric")) != null) {
			result.setValueNumeric(Double.valueOf(map.get("valueNumeric").toString()));
		}
		
		if ((map.get("valueBoolean")) != null) {
			result.setValueBoolean((Boolean) map.get("valueBoolean"));
		}
		
		if ((map.get("valueModifier")) != null) {
			result.setValueModifier(((map.get("valueModifier")).toString()));
		}
		
		if ((map.get("resultGroup")) != null && ((Map) map.get("resultGroup")).get("uuid") != null) {
			Result resultGroup = new Result();
			resultGroup.setUuid(((Map) map.get("resultGroup")).get("uuid").toString());
			result.setValueGroup(resultGroup);
		}
		
		if ((map.get("valueDateTime")) != null) {
			result.setValueDatetime((Date) map.get("valueDateTime"));
		}
		
		if ((map.get("valueCoded")) != null) {
			if(((Map) map.get("valueCoded")).get("uuid") != null ) {
				Concept valueCoded = new Concept();
				valueCoded.setUuid(((Map) map.get("valueCoded")).get("uuid").toString());
				result.setValueCoded(valueCoded);
			}
		}
		
		if ((map.get("valueDrug")) != null) {
			Drug valueDrug = new Drug();
			valueDrug.setUuid(((Map) map.get("valueDrug")).get("uuid").toString());
			result.setValueDrug(valueDrug);
		}
		
		if (map.get("abnormal") != null) {
			if ((Boolean) map.get("abnormal")) {
				result.abnormal = true;
			} else {
				result.abnormal = false;
			}
		}

		if (map.get("voided") != null) {
			if ((Boolean) map.get("voided")) {
				result.setVoided(true);
				if (map.get("voidReason") != null) {
					result.setVoidReason(map.get("voidReason").toString());
				}
				if (map.get("voidedBy") != null) {
					User voidedBy = new User();
					voidedBy.setUuid(map.get("voidedBy").toString());
					result.setVoidedBy(voidedBy);
				}
			} else {
				result.setVoided(false);
			}
		}
		
		if (map.get("standardTAT") != null) {
			result.setStandardTAT((Integer) map.get("standardTAT"));
		}
		
		if (map.get("urgentTAT") != null) {
			result.setUrgentTAT((Integer) map.get("urgentTAT"));
		}
		
		if (map.get("additionalReqTimeLimit") != null) {
			result.setAddReqTimeLimit((Integer) map.get("additionalReqTimeLimit"));
		}
		
		if (map.get("status") != null && ((Map) map.get("status")).get("status") != null) {
			result.setStatusCategory(((Map) map.get("status")).get("category").toString());
			result.setStatus(((Map) map.get("status")).get("status").toString());
			result.setStatusRemarks(((Map) map.get("status")).get("remarks").toString());
		}
		
		if (map.get("instrument") != null && ((Map) map.get("instrument")).get("uuid") != null) {
			Concept instrument = new Concept();
			instrument.setUuid(((Map) map.get("instrument")).get("uuid").toString());
			result.setInstrument(instrument);
		}

		if (map.get("instrument") != null && ((Map) map.get("instrument")).get("code") != null) {
			String instrumentCode = instrumentCode = ((Map) map.get("instrument")).get("code").toString();
			result.setInstrumentCode(instrumentCode);
		}
		
		if (map.get("resultStatus") != null) {
			result.setResultStatus(map.get("resultStatus").toString());
		}

		if(map.get("associatedFieldResult") != null){
			List<AssociatedFieldResult> associatedFieldResultsList = new ArrayList<>();

			AssociatedField associatedField = new AssociatedField();
			associatedField.setUuid(((Map)((Map) map.get("associatedFieldResult")).get("associatedField")).get("uuid").toString());

			AssociatedFieldResult associatedFieldResult = new AssociatedFieldResult();
			associatedFieldResult.setValue(((Map) map.get("associatedFieldResult")).get("value").toString());
			associatedFieldResult.setAssociatedField(associatedField);

			associatedFieldResultsList.add(associatedFieldResult);
			result.setAssociatedFieldResults(associatedFieldResultsList);
		}

		if(map.get("testedBy") != null){
			User user = new User();
			user.setUuid(map.get("testedBy").toString());
			result.setTestedBy(user);
		}

		if(map.get("testedDate") != null){
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
			if (map.get("testedDate").toString().length() == 10) {
				result.setTestedDate(dateFormat.parse(map.get("testedDate").toString()));
			} else {
				result.setTestedDate(dateFormat.parse(map.get("testedDate").toString().substring(0, map.get("testedDate").toString().indexOf("T"))));
			}
		}
		
		Concept concept = new Concept();
		concept.setUuid(((Map) map.get("concept")).get("uuid").toString());
		result.setConcept(concept);
		
		TestAllocation testAllocation = new TestAllocation();
		testAllocation.setUuid(((Map) map.get("testAllocation")).get("uuid").toString());
		result.setTestAllocation(testAllocation);
		
		return result;
	}
	
	public Map<String, Object> toMap() {
		Map<String, Object> resultsObject = new HashMap<String, Object>();
		resultsObject.put("uuid", this.getUuid());
		resultsObject.put("dateCreated", this.getDateCreated());
		resultsObject.put("valueText", this.getValueText());
		resultsObject.put("valueNumeric", this.getValueNumeric());
		resultsObject.put("valueBoolean", this.getValueBoolean());
		resultsObject.put("valueComplex", this.getValueComplex());
		resultsObject.put("valueModifier", this.getValueModifier());
		resultsObject.put("valueDateTime", this.getValueDatetime());
		if(this.getTestedBy() != null){
			Map<String, Object> testedByObject = new HashMap<String, Object>();
			testedByObject.put("uuid",this.getTestedBy().getUuid());
			testedByObject.put("name",this.getTestedBy().getDisplayString());
			resultsObject.put("testedBy", testedByObject);
		}

		if (this.getTestedDate() != null) {
			resultsObject.put("testedDate",this.getTestedDate().toString());
		}

		if (this.getVoided() != null) {
			resultsObject.put("voided",this.getVoided());
		}
		if (this.getVoidedBy() != null) {
			Map<String, Object> voidedBy = new HashMap<>();
			voidedBy.put("uuid", this.getVoidedBy().getUuid());
			voidedBy.put("display", this.getVoidedBy().getDisplayString());
			resultsObject.put("voidedBy",voidedBy);
		}

		if (this.getVoidReason() != null) {
			resultsObject.put("voidReason",this.getVoidReason());
		}


		if (this.getAbnormal() != null) {
			resultsObject.put("abnormal", this.getAbnormal());
		} else {
			resultsObject.put("abnormal", null);
		}
		
		resultsObject.put("standardTAT", this.getStandardTAT());
		resultsObject.put("urgentTAT", this.getUrgentTAT());
		resultsObject.put("additionalReqTimeLimit", this.getAddReqTimeLimit());
		
		if (this.getDateCreated() != null) {
			resultsObject.put("dateCreated", this.getDateCreated());
		} else {
			resultsObject.put("dateCreated", null);
		}
		
		if (this.getValueCoded() != null) {
			Map<String, Object> resultsCodedObject = new HashMap<String, Object>();
			resultsCodedObject.put("uuid", this.getValueCoded().getUuid());
			resultsCodedObject.put("display", this.getValueCoded().getDisplayString());
			resultsCodedObject.put("name", this.getValueCoded().getName().getName());
			resultsObject.put("valueCoded", resultsCodedObject);
		}
		
		Map<String, Object> instrument = new HashMap<String, Object>();
		if (this.getInstrument() != null) {
			List<String> instrumentsCodes = new ArrayList<>();
			instrumentsCodes = getCodes();
			instrument.put("uuid", this.getInstrument().getUuid());
			instrument.put("display", this.getInstrument().getDisplayString());
			if (this.getInstrument().getName() != null && this.getInstrument().getName().getName() != null) {
				instrument.put("name", this.getInstrument().getName().getName());
			}
			instrument.put("instrumentCodes", instrumentsCodes);
		} else {
			instrument = null;
		}
		
		resultsObject.put("instrument", instrument);
		
		HashMap<String, Object> resultsConceptObject = new HashMap<String, Object>();
		resultsConceptObject.put("uuid", this.getConcept().getUuid());
		resultsObject.put("concept", resultsConceptObject);
		
		Map<String, Object> testObject = new HashMap<String, Object>();
		testObject.put("uuid", this.getTestAllocation().getUuid());
		resultsObject.put("testAllocation", testObject);

		Map<String, Object> sampleDetails = new HashMap<>();
		if (this.getTestAllocation().getSample() != null) {
			sampleDetails.put("uuid", this.getTestAllocation().getSample().getUuid());
			sampleDetails.put("label", this.getTestAllocation().getSample().getLabel());
			sampleDetails.put("display", this.getTestAllocation().getSample().getLabel());
		}
		resultsObject.put("sample", sampleDetails);
		
		Map<String, Object> creatorObject = new HashMap<String, Object>();
		if (this.getCreator() != null) {
			creatorObject.put("uuid", this.getCreator().getUuid());
			creatorObject.put("display", this.getCreator().getDisplayString());
			creatorObject.put("name", this.getCreator().getName());
		}
		Map<String, Object> resultGroup = new HashMap<>();
		if (this.getValueGroup() != null) {
			resultGroup.put("uuid", this.getValueGroup().getUuid());
			resultGroup.put("valueText", this.getValueText());
			resultGroup.put("dateCreated", this.getDateCreated());
			resultGroup.put("valueNumeric", this.getValueNumeric());
			resultGroup.put("valueBoolean", this.getValueBoolean());
			resultGroup.put("valueComplex", this.getValueComplex());
			resultGroup.put("valueModifier", this.getValueModifier());
			resultGroup.put("valueDateTime", this.getValueDatetime());
		} else {
			resultGroup = null;
		}
		resultsObject.put("resultGroup", resultGroup);
		resultsObject.put("creator", creatorObject);

		if(this.getAssociatedFieldResults() != null){
			List<Map<String,Object>> associatedFieldResultMapList = new ArrayList<>();
			for(AssociatedFieldResult associatedFieldResult : this.getAssociatedFieldResults()){
				associatedFieldResultMapList.add(associatedFieldResult.toMap());
			}
			resultsObject.put("associatedFieldResults",associatedFieldResultMapList);
		}

		return resultsObject;
	}
	
	public Integer getStandardTAT() {
		return standardTAT;
	}
	
	public void setStandardTAT(Integer standardTAT) {
		this.standardTAT = standardTAT;
	}
	
	public Integer getUrgentTAT() {
		return urgentTAT;
	}
	
	public void setUrgentTAT(Integer urgentTAT) {
		this.urgentTAT = urgentTAT;
	}
	
	public Integer getAddReqTimeLimit() {
		return addReqTimeLimit;
	}
	
	public void setAddReqTimeLimit(Integer addReqTimeLimit) {
		this.addReqTimeLimit = addReqTimeLimit;
	}
	
	public Concept getInstrument() {
		return instrument;
	}
	
	public void setInstrument(Concept instrument) {
		this.instrument = instrument;
	}

	public  String getInstrumentCode() {
		return  this.instrumentCode;
	}

	public  void setInstrumentCode(String code) {
		this.instrumentCode = code;
	}

	public List<String> getCodes() {
		List<String> codes = new ArrayList<>();
		Collection<ConceptMap> conceptMaps = this.instrument.getConceptMappings();
		if (conceptMaps.size() > 0) {
			for(ConceptMap conceptMap: conceptMaps){
				ConceptReferenceTerm conceptReferenceTerm = conceptMap.getConceptReferenceTerm();
				codes.add(conceptReferenceTerm.getCode().toString());
			}
		}
		return  codes;
	}
	/*
	For statuses passed via results object
	* */
	@Transient
	private String status;
	
	@Transient
	private String category;
	
	@Transient
	private String remarks;
	
	@Transient
	private String resultStatus;
	
	public String getStatus() {
		return this.status;
	}
	
	public void setStatus(String status) {
		this.status = status;
	}
	
	public String getStatusCategory() {
		return this.category;
	}
	
	public void setStatusCategory(String category) {
		this.category = category;
	}
	
	public String getStatusRemarks() {
		return this.remarks;
	}
	
	public void setStatusRemarks(String remarks) {
		this.remarks = remarks;
	}
	
	public String getResultStatus() {
		return resultStatus;
	}
	
	public void setResultStatus(String resultStatus) {
		this.resultStatus = resultStatus;
	}
	
	/*
	End of result's statuses
	 */
	
}
