package org.openmrs.module.icare.core.utils;

import org.openmrs.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class EncounterWrapper {
	
	public EncounterWrapper(Encounter encounter) {
		this.encounter = encounter;
	}
	
	Encounter encounter;
	
	public Map<String, Object> toMap() {
        Map<String, Object> encounterData = new HashMap<>();
        encounterData.put("uuid", encounter.getUuid());
        encounterData.put("encounterDatetime", encounter.getEncounterDatetime().toString());
        List<Map<String, Object>> encounterProviders = new ArrayList<>();
        for(EncounterProvider encounterProvider: encounter.getEncounterProviders()) {
            Map<String, Object> encounterPr = new HashMap<>();
            if (encounterProvider.getProvider() != null && encounterProvider.getProvider().getName() != null) {
                encounterPr.put("name", encounterProvider.getProvider().getName());
                encounterPr.put("uuid", encounterProvider.getUuid());
            }
            encounterProviders.add(encounterPr);
        }
        encounterData.put("encounterProviders", encounterProviders);

        List<Map<String, Object>> obs = new ArrayList<>();
        for(Obs observation: encounter.getAllObs()) {
            Map<String, Object> obsData = new HashMap<>();
            Map<String, Object> conceptDetails = new HashMap<>();
            conceptDetails.put("display", observation.getConcept().getDisplayString());
            conceptDetails.put("uuid", observation.getConcept().getUuid());
            obsData.put("concept", conceptDetails);
            if (observation.getValueText() != null) {
                obsData.put("value", observation.getValueText());
            }

            if (observation.getValueNumeric() != null) {
                obsData.put("value", observation.getValueNumeric());
            }
            if (observation.getValueCoded() != null && observation.getValueCoded().getDisplayString() != null) {
                obsData.put("value", observation.getValueCoded().getDisplayString());
            }
            obs.add(obsData);
        }
        encounterData.put("obs", obs);
        return  encounterData;
    }
}
