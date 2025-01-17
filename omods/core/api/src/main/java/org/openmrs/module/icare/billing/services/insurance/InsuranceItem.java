package org.openmrs.module.icare.billing.services.insurance;

import java.util.HashMap;
import java.util.Map;

public class InsuranceItem {
	
	private String name;
	
	private String status;
	
	private String message;
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getStatus() {
		return status;
	}
	
	public void setStatus(String status) {
		this.status = status;
	}
	
	public String getMessage() {
		return message;
	}
	
	public void setMessage(String message) {
		this.message = message;
	}
	
	public Map<String, Object> toMap() {
		Map<String, Object> results = new HashMap<String, Object>();
		results.put("name", this.name);
		results.put("status", this.status);
		results.put("message", this.message);
		return results;
	}
}
