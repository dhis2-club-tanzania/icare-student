package org.openmrs.module.icare.report.services;

import org.openmrs.api.impl.BaseOpenmrsService;
import org.openmrs.module.icare.report.dhis2.models.DataImport;
import org.openmrs.module.icare.report.utils.DHISImportUtil;

import java.util.List;
import java.util.Map;

public class DHIS2ServiceImpl extends BaseOpenmrsService implements DHIS2Service {
	
	@Override
	public Map<String, Object> postDhisData(Map<String, Object> payload) throws Exception {
		DataImport dataImport = DHISImportUtil.convertReportDataToDataImport(payload);
		Map<String, Object> dhisResults = DHISImportUtil.importData(dataImport);
		return dhisResults;
	}
	
	@Override
	public List<Map<String, Object>> getDataElements(String searchTerm) throws Exception {
		Map<String, Object> results = DHISImportUtil.getDataElements(searchTerm);
		return (List<Map<String, Object>>) results.get("dataElements");
	}
}
