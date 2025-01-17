package org.openmrs.module.icare.report.utils;

import org.apache.xerces.impl.dv.util.Base64;
import org.codehaus.jackson.map.ObjectMapper;
import org.openmrs.Concept;
import org.openmrs.ConceptMap;
import org.openmrs.api.AdministrationService;
import org.openmrs.api.ConceptService;
import org.openmrs.api.context.Context;
import org.openmrs.module.icare.report.dhis2.DHIS2Config;
import org.openmrs.module.icare.report.dhis2.models.DataImport;
import org.openmrs.module.icare.report.dhis2.models.DataValue;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

public class DHISImportUtil {
	
	public static Map<String,Object> importData(DataImport dataImport) throws Exception {
        AdministrationService adminService = Context.getService(AdministrationService.class);
        String dhisServerUrl = adminService.getGlobalProperty(DHIS2Config.server);
        if(dhisServerUrl == null){
            throw new Exception("DHIS Server not specified");
        }
        String username = adminService.getGlobalProperty(DHIS2Config.username);
        if(username == null){
            throw new Exception("DHIS 'username' not specified");
        }
        String password = adminService.getGlobalProperty(DHIS2Config.password);
        if(password == null){
            throw new Exception("DHIS 'password' not specified");
        }
        URL url = new URL(dhisServerUrl + "/api/dataValueSets");
        String auth = username + ":" + password;
        String encodedAuth = Base64.encode(auth.getBytes(StandardCharsets.UTF_8));
        String authHeaderValue = "Basic " + encodedAuth;

        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestProperty("Authorization", authHeaderValue);
		con.setRequestMethod("POST");
		con.setRequestProperty("Content-Type", "application/json; utf-8");
		con.setDoOutput(true);
        ObjectMapper oMapper = new ObjectMapper();
        String data = oMapper.writerWithDefaultPrettyPrinter()
                .writeValueAsString(dataImport);
        try {
            try(OutputStream os = con.getOutputStream()) {
                byte[] input = data.getBytes("utf-8");
                os.write(input, 0, input.length);
                os.flush();
            }
            BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
            String inputLine;
            StringBuffer content = new StringBuffer();
            while ((inputLine = in.readLine()) != null) {
                content.append(inputLine);
            }
            in.close();
            return oMapper.readValue(content.toString(), Map.class);
        }
        catch (Exception e) {
            e.printStackTrace();
            BufferedReader in = new BufferedReader(new InputStreamReader(con.getErrorStream()));
            String inputLine;
            StringBuffer content = new StringBuffer();
            while ((inputLine = in.readLine()) != null) {
                content.append(inputLine);
            }
            in.close();
            return oMapper.readValue(content.toString(), Map.class);
        }
    }
	
	public static DataImport convertReportDataToDataImport(Map<String, Object> reportData) throws Exception {
		List<Map<String, Object>> dataSets = (List<Map<String, Object>>) reportData.get("dataSets");
		//ReportData reportData1 = ReportData.fromMap(reportData);
		DataImport dataImport = new DataImport();
		ConceptService conceptService = Context.getConceptService();
		AdministrationService administrationService = Context.getAdministrationService();
		String organisationUnitUid = administrationService.getGlobalProperty(DHIS2Config.facilityUid);
		if (organisationUnitUid == null) {
			throw new Exception("Organisation unit uid is not set");
		}
		Map parameterValues = ((Map) ((Map) reportData.get("context")).get("parameterValues"));
		String period = parameterValues.get("startDate").toString().substring(0, 7).replace("-", "");
		for (Map<String, Object> dataSet : dataSets) {
			List<Map<String, Object>> columns = (List<Map<String, Object>>) ((Map) dataSet.get("metadata")).get("columns");
			int dXIndex = 0;
			for (Map<String, Object> column : columns) {
				if (column.get("name").toString().startsWith("DXConcept")) {
					List<Map<String, Object>> rows = (List<Map<String, Object>>) dataSet.get("rows");
					for (Map<String, Object> row : rows) {
						Concept concept = conceptService.getConceptByName((String) row.get(column.get("name")));
						if (concept != null) {
							DataValue dataValue = new DataValue();
							for (ConceptMap conceptMap : concept.getConceptMappings()) {
								if (conceptMap.getConceptReferenceTerm().getConceptSource().getName()
								        .equals("DHIS2 Data Element")) {
									String[] data = conceptMap.getConceptReferenceTerm().getCode().split("-");
									dataValue.setDataElement(data[0]);
									dataValue.setCategoryOptionCombo(data[1]);
								}
							}
							String dataKey = (String) columns.get(dXIndex + 1).get("name");
							dataValue.setValue((String) row.get(dataKey));
							dataValue.setOrgUnit(organisationUnitUid);
							dataValue.setPeriod(period);
							dataImport.getDataValues().add(dataValue);
						}
					}
				}
				dXIndex++;
			}
		}
		return dataImport;
	}
	
	public static Map<String, Object> getDataElements(String searchTerm) throws Exception {
		AdministrationService adminService = Context.getService(AdministrationService.class);
		String dhisServerUrl = adminService.getGlobalProperty(DHIS2Config.server);
		if (dhisServerUrl == null) {
			throw new Exception("DHIS Server not specified");
		}
		String username = adminService.getGlobalProperty(DHIS2Config.username);
		if (username == null) {
			throw new Exception("DHIS 'username' not specified");
		}
		String password = adminService.getGlobalProperty(DHIS2Config.password);
		if (password == null) {
			throw new Exception("DHIS 'password' not specified");
		}
		URL url = new URL(dhisServerUrl + "/api/dataElements?filter=name:ilike:" + searchTerm
		        + "&fields=id,name,code,categoryCombo[categoryOptionCombos[id,name,code]]");
		String auth = username + ":" + password;
		String encodedAuth = Base64.encode(auth.getBytes(StandardCharsets.UTF_8));
		String authHeaderValue = "Basic " + encodedAuth;
		
		HttpURLConnection con = (HttpURLConnection) url.openConnection();
		con.setRequestProperty("Authorization", authHeaderValue);
		con.setRequestMethod("GET");
		con.setRequestProperty("Content-Type", "application/json; utf-8");
		con.setDoOutput(true);
		ObjectMapper oMapper = new ObjectMapper();
		try {
			BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
			String inputLine;
			StringBuffer content = new StringBuffer();
			while ((inputLine = in.readLine()) != null) {
				content.append(inputLine);
			}
			in.close();
			return oMapper.readValue(content.toString(), Map.class);
		}
		catch (Exception e) {
			e.printStackTrace();
			BufferedReader in = new BufferedReader(new InputStreamReader(con.getErrorStream()));
			String inputLine;
			StringBuffer content = new StringBuffer();
			while ((inputLine = in.readLine()) != null) {
				content.append(inputLine);
			}
			in.close();
			return oMapper.readValue(content.toString(), Map.class);
		}
	}
}
