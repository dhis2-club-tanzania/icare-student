package org.openmrs.module.icare.laboratory.models;

import java.util.HashMap;
import java.util.Map;

public class WorkloadSummary {
	
	private long samplesWithNoResults;
	
	private long samplesWithRejectedResults;
	
	private long samplesWithResults;
	
	private long samplesAuthorized;
	
	public Map<String,Object> toMap(){
        Map<String,Object> result = new HashMap<>();
        result.put("samplesWithNoResults",this.samplesWithNoResults);
        result.put("samplesWithRejectedResults",this.samplesWithRejectedResults);
        result.put("samplesWithResults",this.samplesWithResults);
        result.put("samplesAuthorized",this.getSamplesAuthorized());

        return  result;
    }
	
	public long getSamplesWithNoResults() {
		return samplesWithNoResults;
	}
	
	public void setSamplesWithNoResults(long samplesWithNoResults) {
		this.samplesWithNoResults = samplesWithNoResults;
	}
	
	public long getSamplesWithRejectedResults() {
		return samplesWithRejectedResults;
	}
	
	public void setSamplesWithRejectedResults(long samplesWithRejectedResults) {
		this.samplesWithRejectedResults = samplesWithRejectedResults;
	}
	
	public long getSamplesAuthorized() {
		return samplesAuthorized;
	}
	
	public void setSamplesAuthorized(long samplesAuthorized) {
		this.samplesAuthorized = samplesAuthorized;
	}
	
	public long getSamplesWithResults() {
		return samplesWithResults;
	}
	
	public void setSamplesWithResults(long samplesWithResults) {
		this.samplesWithResults = samplesWithResults;
	}
}
