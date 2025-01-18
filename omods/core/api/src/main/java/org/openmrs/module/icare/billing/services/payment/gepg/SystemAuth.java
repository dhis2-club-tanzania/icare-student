package org.openmrs.module.icare.billing.services.payment.gepg;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SystemAuth {
	
	@JsonProperty("SystemCode")
	private String systemCode;
	
	@JsonProperty("ServiceCode")
	private String serviceCode;
	
	@JsonProperty("Signature")
	private String signature;
	
	// Getters and setters
	@JsonProperty("SystemCode")
	public String getSystemCode() {
		return systemCode;
	}
	
	public void setSystemCode(String systemCode) {
		this.systemCode = capitalizeFirstLetter(systemCode);
	}
	
	@JsonProperty("ServiceCode")
	public String getServiceCode() {
		return serviceCode;
	}
	
	public void setServiceCode(String serviceCode) {
		this.serviceCode = capitalizeFirstLetter(serviceCode);
	}
	
	@JsonProperty("Signature")
	public String getSignature() {
		return signature;
	}
	
	public void setSignature(String signature) {
		this.signature = capitalizeFirstLetter(signature);
	}
	
	// Utility method to capitalize the first letter of a string
	private String capitalizeFirstLetter(String input) {
		if (input == null || input.isEmpty()) {
			return input;
		}
		return input.substring(0, 1).toUpperCase() + input.substring(1);
	}
}
