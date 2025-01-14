package org.openmrs.module.icare.core.models;

import org.openmrs.Drug;

public class CommonlyOrderedDrugs {
	
	private Integer count;
	
	private Drug drug;
	
	public Integer getCount() {
		return count;
	}
	
	public void setCount(Integer count) {
		this.count = count;
	}
	
	public Drug getDrug() {
		return drug;
	}
	
	public void setDrug(Drug drug) {
		this.drug = drug;
	}
}
