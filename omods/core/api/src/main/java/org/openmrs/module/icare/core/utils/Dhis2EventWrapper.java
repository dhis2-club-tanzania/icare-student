package org.openmrs.module.icare.core.utils;

import org.json.JSONArray;
import org.json.JSONObject;
import org.openmrs.api.AdministrationService;
import org.openmrs.api.context.Context;
import org.openmrs.module.icare.ICareConfig;

import javax.naming.ConfigurationException;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.*;

public class Dhis2EventWrapper {
	
	public String getEventProgram() throws ConfigurationException {
		return this.getGlobalPropertyValueByKey(ICareConfig.SURVEILLANCE_EVENT_PROGRAM);
	}
	
	public String getHFRCode() throws ConfigurationException {
		return this.getGlobalPropertyValueByKey(ICareConfig.HFR_CODE);
	}
	
	public String getEventProgramStage() throws ConfigurationException {
		return this.getGlobalPropertyValueByKey(ICareConfig.SURVEILLANCE_SINGLE_EVENT_PROGRAM_STAGE);
	}
	
	public List<Map<String, Object>> formulateDataValuesObject(Map<String, Object> eventData, String mappings) throws Exception {
        List<Map<String, Object>> dataValues = new ArrayList<>();
        if (mappings != null && eventData !=null) {
			JSONArray mappingsArray = new JSONArray(mappings);
			if (mappingsArray.length() > 0) {
				for (int count = 0; count < mappingsArray.length(); count++) {
					JSONObject object = mappingsArray.getJSONObject(count);
					Map<String, Object> dataValue = new HashMap<>();
					if (object.has("dhis2MetadataCode")  && object.has("sourceDataKey") && eventData.get(object.getString("sourceDataKey")) != null) {
						dataValue.put("dataElement", object.get("dhis2MetadataCode"));
						if (object.has("codedAnswers")) {
							JSONObject codedAnswers = (JSONObject) object.get("codedAnswers");
							String systemValue = eventData.get(object.getString("sourceDataKey")).toString();
							String value = codedAnswers.get(systemValue.toString()).toString();
							dataValue.put("value", value);
						} else {
							dataValue.put("value", eventData.get(object.getString("sourceDataKey")));
						}
						dataValues.add(dataValue);
					}
				}
			}
		}

        return dataValues;
    }
	
	public String formatDateToYYYYMMDD(Date diagnosisDate) throws Exception {
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
		String dateStr = formatter.format(diagnosisDate);
		return dateStr;
	}
	
	public String getGlobalPropertyValueByKey(String key) throws ConfigurationException {
		AdministrationService administrationService = Context.getAdministrationService();
		String value = administrationService.getGlobalProperty(key);
		return value;
	}
	
}
