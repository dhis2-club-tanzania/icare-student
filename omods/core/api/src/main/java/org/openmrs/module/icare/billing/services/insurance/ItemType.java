package org.openmrs.module.icare.billing.services.insurance;

public class ItemType {
	
	private String name;
	
	private String dataType;
	
	public ItemType(String name, String dataType) {
		this.name = name;
		this.dataType = dataType;
	}
	
	public String getName() {
		return name;
	}
	
	public String getDataType() {
		return dataType;
	}
}
