package org.openmrs.module.icare.core.models;

import org.openmrs.module.icare.core.Message;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PimaCovidLabRequest {
	
	private String programStage;
	
	private String program;
	
	private List<Object> dataValues;
	
	private String enrollment;
	
	private String trackedEntityInstance;
	
	private String orgUnit;
	
	public String getProgramStage() {
		return programStage;
	}
	
	public void setProgramStage(String programStage) {
		this.programStage = programStage;
	}
	
	public String getProgram() {
		return program;
	}
	
	public void setProgram(String program) {
		this.program = program;
	}
	
	public List<Object> getDataValues() {
		return dataValues;
	}
	
	public void setDataValues(List<Object> dataValues) {
		this.dataValues = dataValues;
	}
	
	public String getEnrollment() {
		return this.enrollment;
	}
	
	public void setEnrollment(String enrollment) {
		this.enrollment = enrollment;
	}
	
	public String getTrackedEntityInstance() {
		return this.trackedEntityInstance;
	}
	
	public void setTrackedEntityInstance(String trackedEntityInstance) {
		this.trackedEntityInstance = trackedEntityInstance;
	}
	
	public String getOrgUnit() {
		return this.orgUnit;
	}
	
	public void setOrgUnit(String orgUnit) {
		this.orgUnit = orgUnit;
	}
	
	private String basicAuth;
	
	private String getBasicAuth() {
		return this.basicAuth;
	}
	
	private void setBasicAuth(String basicAuth) {
		this.basicAuth = basicAuth;
	}
	
	public Map<String, Object> toMap() {
		HashMap<String, Object> eventMap = new HashMap<String, Object>();
		
		eventMap.put("programStage", this.getProgramStage());
		eventMap.put("program", this.getProgram());
		eventMap.put("enrollment", this.getEnrollment());
		eventMap.put("orgUnit", this.getOrgUnit());
		eventMap.put("trackedEntityInstance", this.getTrackedEntityInstance());
		eventMap.put("dataValues", this.getDataValues());
		return eventMap;
	}
	
	public static String basicAuthKey(Map<String, Object> labRequestMap) {
		return labRequestMap.get("basicAuth").toString();
	}
	
	public static PimaCovidLabRequest fromMap(Map<String, Object> labRequestMap) throws ParseException {
		PimaCovidLabRequest request = new PimaCovidLabRequest();
		request.setProgramStage((String) labRequestMap.get("programStage"));
		request.setProgram((String) labRequestMap.get("program"));
		request.setEnrollment((String) labRequestMap.get("enrollment"));
		request.setOrgUnit((String) labRequestMap.get("orgUnit"));
		request.setTrackedEntityInstance((String) labRequestMap.get("trackedEntityInstance"));
		request.setDataValues((List<Object>) labRequestMap.get("dataValues"));
		return request;
	}
}
