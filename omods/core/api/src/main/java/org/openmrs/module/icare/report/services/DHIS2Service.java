package org.openmrs.module.icare.report.services;

import org.openmrs.api.OpenmrsService;

import java.util.List;
import java.util.Map;

public interface DHIS2Service extends OpenmrsService {
	
	Map<String, Object> postDhisData(Map<String, Object> payload) throws Exception;
	
	List<Map<String, Object>> getDataElements(String searchTerm) throws Exception;
}
