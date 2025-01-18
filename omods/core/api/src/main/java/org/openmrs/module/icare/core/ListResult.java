package org.openmrs.module.icare.core;

import org.openmrs.module.icare.laboratory.models.Sample;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ListResult<T extends JSONConverter> implements JSONConverter {
	
	Pager pager;
	
	List<T> results;
	
	public Pager getPager() {
		return pager;
	}
	
	public void setPager(Pager pager) {
		this.pager = pager;
	}
	
	public List<T> getResults() {
		return results;
	}
	
	public void setResults(List<T> results) {
		this.results = results;
	}
	
	@Override
	public Map<String, Object> toMap() throws Exception {
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("pager", this.pager.toMap());
		List<Map<String, Object>> resultObjectList = new ArrayList<Map<String, Object>>();
		for (T data : results) {
			Map<String, Object> sampleObject = data.toMap();
			//add the sample after creating its object
			resultObjectList.add(sampleObject);
		}
		result.put("results", resultObjectList);
		return result;
	}
}
