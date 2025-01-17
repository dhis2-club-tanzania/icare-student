package org.openmrs.module.icare.report;

import org.codehaus.jackson.map.ObjectMapper;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Map;

public class ReportData implements Serializable {
	
	private String uuid;
	
	ArrayList<Object> dataSets = new ArrayList<Object>();
	
	Context ContextObject;
	
	Definition DefinitionObject;
	
	ArrayList<Object> links = new ArrayList<Object>();
	
	private String resourceVersion;
	
	public static ReportData fromMap(Map<String, Object> reportData) {
		ReportData reportData1 = (new ObjectMapper()).convertValue(reportData, ReportData.class);
		return reportData1;
	}
	
	// Getter Methods
	
	public String getUuid() {
		return uuid;
	}
	
	public Context getContext() {
		return ContextObject;
	}
	
	public Definition getDefinition() {
		return DefinitionObject;
	}
	
	public String getResourceVersion() {
		return resourceVersion;
	}
	
	// Setter Methods
	
	public void setUuid(String uuid) {
		this.uuid = uuid;
	}
	
	public void setContext(Context contextObject) {
		this.ContextObject = contextObject;
	}
	
	public void setDefinition(Definition definitionObject) {
		this.DefinitionObject = definitionObject;
	}
	
	public void setResourceVersion(String resourceVersion) {
		this.resourceVersion = resourceVersion;
	}
}

class Definition {
	
	private String clazz;
	
	private String uuid;
	
	private String name;
	
	private String description;
	
	ArrayList<Object> parameters = new ArrayList<Object>();
	
	ArrayList<Object> links = new ArrayList<Object>();
	
	private String resourceVersion;
	
	// Getter Methods
	
	public String getClassDef() {
		return clazz;
	}
	
	public String getUuid() {
		return uuid;
	}
	
	public String getName() {
		return name;
	}
	
	public String getDescription() {
		return description;
	}
	
	public String getResourceVersion() {
		return resourceVersion;
	}
	
	// Setter Methods
	
	public void setClass(String clazz) {
		this.clazz = clazz;
	}
	
	public void setUuid(String uuid) {
		this.uuid = uuid;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public void setDescription(String description) {
		this.description = description;
	}
	
	public void setResourceVersion(String resourceVersion) {
		this.resourceVersion = resourceVersion;
	}
}

class Context {
	
	private float evaluationId;
	
	private String evaluationDate;
	
	private float evaluationLevel;
	
	private String limit = null;
	
	private String baseCohort = null;
	
	ContextValues ContextValuesObject;
	
	ParameterValues ParameterValuesObject;
	
	// Getter Methods
	
	public float getEvaluationId() {
		return evaluationId;
	}
	
	public String getEvaluationDate() {
		return evaluationDate;
	}
	
	public float getEvaluationLevel() {
		return evaluationLevel;
	}
	
	public String getLimit() {
		return limit;
	}
	
	public String getBaseCohort() {
		return baseCohort;
	}
	
	public ContextValues getContextValues() {
		return ContextValuesObject;
	}
	
	public ParameterValues getParameterValues() {
		return ParameterValuesObject;
	}
	
	// Setter Methods
	
	public void setEvaluationId(float evaluationId) {
		this.evaluationId = evaluationId;
	}
	
	public void setEvaluationDate(String evaluationDate) {
		this.evaluationDate = evaluationDate;
	}
	
	public void setEvaluationLevel(float evaluationLevel) {
		this.evaluationLevel = evaluationLevel;
	}
	
	public void setLimit(String limit) {
		this.limit = limit;
	}
	
	public void setBaseCohort(String baseCohort) {
		this.baseCohort = baseCohort;
	}
	
	public void setContextValues(ContextValues contextValuesObject) {
		this.ContextValuesObject = contextValuesObject;
	}
	
	public void setParameterValues(ParameterValues parameterValuesObject) {
		this.ParameterValuesObject = parameterValuesObject;
	}
}

class ParameterValues {
	
	private String endDate;
	
	private String startDate;
	
	// Getter Methods
	
	public String getEndDate() {
		return endDate;
	}
	
	public String getStartDate() {
		return startDate;
	}
	
	// Setter Methods
	
	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}
	
	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}
}

class ContextValues {
	
	private String start_of_today;
	
	private String end_of_last_month;
	
	private String now;
	
	private String start_of_last_month;
	
	private String generationDate;
	
	private String end_of_today;
	
	private String generatedBy;
	
	// Getter Methods
	
	public String getStart_of_today() {
		return start_of_today;
	}
	
	public String getEnd_of_last_month() {
		return end_of_last_month;
	}
	
	public String getNow() {
		return now;
	}
	
	public String getStart_of_last_month() {
		return start_of_last_month;
	}
	
	public String getGenerationDate() {
		return generationDate;
	}
	
	public String getEnd_of_today() {
		return end_of_today;
	}
	
	public String getGeneratedBy() {
		return generatedBy;
	}
	
	// Setter Methods
	
	public void setStart_of_today(String start_of_today) {
		this.start_of_today = start_of_today;
	}
	
	public void setEnd_of_last_month(String end_of_last_month) {
		this.end_of_last_month = end_of_last_month;
	}
	
	public void setNow(String now) {
		this.now = now;
	}
	
	public void setStart_of_last_month(String start_of_last_month) {
		this.start_of_last_month = start_of_last_month;
	}
	
	public void setGenerationDate(String generationDate) {
		this.generationDate = generationDate;
	}
	
	public void setEnd_of_today(String end_of_today) {
		this.end_of_today = end_of_today;
	}
	
	public void setGeneratedBy(String generatedBy) {
		this.generatedBy = generatedBy;
	}
}
