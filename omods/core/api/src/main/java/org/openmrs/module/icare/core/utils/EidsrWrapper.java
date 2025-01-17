package org.openmrs.module.icare.core.utils;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class EidsrWrapper {
	
	public Map<String, Object> formatData(String mappings, Map<String, Object> systemData) throws Exception {
        Map<String, Object> data = new HashMap<>();
        List<Map<String, Object>> casesData = new ArrayList<>();
        JSONArray mappingsArray = new JSONArray(mappings);
        if (mappingsArray.length() > 0) {
            Map<String, Object> caseData = new HashMap<>();
            for (int count = 0; count < mappingsArray.length(); count++) {
                JSONObject mappingObject = mappingsArray.getJSONObject(count);
                if (mappingObject.has("sourceDataKey") && mappingObject.getString("sourceDataKey") != null) {
                    if (mappingObject.has("codedAnswers")) {
                        JSONObject codedAnswers = (JSONObject) mappingObject.get("codedAnswers");
                        if ((!mappingObject.has("forCases") || (mappingObject.has("forCases") && !mappingObject.getBoolean("forCases"))) && systemData.get(mappingObject.getString("sourceDataKey")) != null) {
                            String systemValue = systemData.get(mappingObject.getString("sourceDataKey")).toString();
                            String value = codedAnswers.get(systemValue.toString()).toString();
                            data.put(mappingObject.getString("valueKey"), value);
                        } else if (mappingObject.has("forCases") && mappingObject.getBoolean("forCases") && systemData.get(mappingObject.getString("sourceDataKey")) != null) {
                            String value = systemData.get(mappingObject.getString("sourceDataKey")).toString();
                            caseData.put(mappingObject.getString("valueKey"), value);
                        }
                    } else {
                        if (systemData.get(mappingObject.getString("sourceDataKey")) != null) {
                            if ((!mappingObject.has("forCases") || (mappingObject.has("forCases") && !mappingObject.getBoolean("forCases"))) && systemData.get(mappingObject.getString("sourceDataKey")) != null) {
                                String value = systemData.get(mappingObject.getString("sourceDataKey")).toString();
                                data.put(mappingObject.getString("valueKey"), value);
                            } else if (mappingObject.has("forCases") && mappingObject.getBoolean("forCases") && systemData.get(mappingObject.getString("sourceDataKey")) != null) {
                                String value = systemData.get(mappingObject.getString("sourceDataKey")).toString();
                                caseData.put(mappingObject.getString("valueKey"), value);
                            }
                        }
                    }
                } else {
                    if ((!mappingObject.has("forCases") || (mappingObject.has("forCases") && !mappingObject.getBoolean("forCases")))) {
                        data.put(mappingObject.getString("valueKey"), mappingObject.getString("defaultValue"));
                    } else if (mappingObject.has("forCases") && mappingObject.getBoolean("forCases") ) {
                        caseData.put(mappingObject.getString("valueKey"), mappingObject.getString("defaultValue"));
                    }
                }
            }
            casesData.add(caseData);
            data.put("cases", casesData);
        }
        return  data;
    }
}
