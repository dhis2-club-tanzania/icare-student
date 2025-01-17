package org.openmrs.module.icare.billing.services.insurance;

import org.openmrs.module.icare.billing.models.Payment;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SyncResult {
	
	private String status;
	
	private String message;
	
	private List<InsuranceItem> created = new ArrayList<InsuranceItem>();
	
	private List<InsuranceItem> updated = new ArrayList<InsuranceItem>();
	
	private List<InsuranceItem> ignored = new ArrayList<InsuranceItem>();
	
	private List<InsuranceItem> deleted = new ArrayList<InsuranceItem>();
	
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
	
	public List<InsuranceItem> getCreated() {
		return created;
	}
	
	public void setCreated(List<InsuranceItem> created) {
		this.created = created;
	}
	
	public List<InsuranceItem> getUpdated() {
		return updated;
	}
	
	public void setUpdated(List<InsuranceItem> updated) {
		this.updated = updated;
	}
	
	public List<InsuranceItem> getIgnored() {
		return ignored;
	}
	
	public void setIgnored(List<InsuranceItem> ignored) {
		this.ignored = ignored;
	}
	
	public List<InsuranceItem> getDeleted() {
		return deleted;
	}
	
	public void setDeleted(List<InsuranceItem> deleted) {
		this.deleted = deleted;
	}
	
	public Map<String, Object> toMap() {
		Map<String, Object> results = new HashMap<String, Object>();
		results.put("status", this.status);
		results.put("message", this.message);
		List<Map<String, Object>> created = new ArrayList<Map<String, Object>>();
		for (InsuranceItem insuranceItem : this.created) {
			created.add(insuranceItem.toMap());
		}
		results.put("created", created);
		
		List<Map<String, Object>> updated = new ArrayList<Map<String, Object>>();
		for (InsuranceItem insuranceItem : this.updated) {
			updated.add(insuranceItem.toMap());
		}
		results.put("updated", updated);
		
		List<Map<String, Object>> ignored = new ArrayList<Map<String, Object>>();
		for (InsuranceItem insuranceItem : this.ignored) {
			ignored.add(insuranceItem.toMap());
		}
		results.put("ignored", ignored);
		
		List<Map<String, Object>> deleted = new ArrayList<Map<String, Object>>();
		for (InsuranceItem insuranceItem : this.deleted) {
			deleted.add(insuranceItem.toMap());
		}
		results.put("deleted", deleted);
		return results;
	}
}
