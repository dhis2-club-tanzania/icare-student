package org.openmrs.module.icare.billing.models;

import java.util.Map;

import org.hibernate.validator.constraints.NotEmpty;

public class RequestDto {
	
	@NotEmpty(message = "Callback data cannot be null or empty.")
	private Map<String, Object> callbackData;
	
	private String fallback;
	
	// Getters and Setters
	public Map<String, Object> getCallbackData() {
		return callbackData;
	}
	
	public void setCallbackData(Map<String, Object> callbackData) {
		this.callbackData = callbackData;
	}
	
	public String getFallback() {
		return fallback;
	}
	
	public void setFallback(String fallback) {
		this.fallback = fallback;
	}
}
