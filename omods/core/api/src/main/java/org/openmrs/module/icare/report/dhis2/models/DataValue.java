package org.openmrs.module.icare.report.dhis2.models;

public class DataValue {
	
	private String dataElement;
	
	private String categoryOptionCombo;
	
	private String period;
	
	private String orgUnit;
	
	private String value;
	
	// Getter Methods
	
	public String getDataElement() {
		return dataElement;
	}
	
	public String getPeriod() {
		return period;
	}
	
	public String getOrgUnit() {
		return orgUnit;
	}
	
	public String getValue() {
		return value;
	}
	
	// Setter Methods
	
	public void setDataElement(String dataElement) {
		this.dataElement = dataElement;
	}
	
	public void setPeriod(String period) {
		this.period = period;
	}
	
	public void setOrgUnit(String orgUnit) {
		this.orgUnit = orgUnit;
	}
	
	public void setValue(String value) {
		this.value = value;
	}
	
	public String getCategoryOptionCombo() {
		return categoryOptionCombo;
	}
	
	public void setCategoryOptionCombo(String categoryOptionCombo) {
		this.categoryOptionCombo = categoryOptionCombo;
	}
}
