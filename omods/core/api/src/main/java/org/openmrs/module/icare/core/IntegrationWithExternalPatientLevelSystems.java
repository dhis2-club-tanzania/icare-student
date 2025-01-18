package org.openmrs.module.icare.core;

import java.util.HashMap;
import java.util.Map;

public class IntegrationWithExternalPatientLevelSystems {
	
	String patientFirstName;
	
	String patientMiddleName;
	
	String patientLastName;
	
	String patientPrimaryIdentifier;
	
	public Map<String, Object> toMap(){
        Map<String,Object> result = new HashMap<>();
        Map<String,Object> patient = new HashMap<>();
        patient.put("firstName", this.getPatientFirstName());
        patient.put("middleName", this.getPatientNames());
        patient.put("lastName", this.getPatientLastName());
        patient.put("primaryIdentifier", this.getPatientPrimaryIdentifier());
        result.put("patient", patient);
        return result;
    }
	
	public String getPatientFirstName() {
		return patientFirstName;
	}
	
	public String getPatientMiddleName() {
		return patientMiddleName;
	}
	
	public String getPatientLastName() {
		return patientLastName;
	}
	
	public String getPatientNames() {
		return patientFirstName + " " + patientMiddleName + " " + patientLastName;
	}
	
	public String getPatientPrimaryIdentifier() {
		return patientPrimaryIdentifier;
	}
}
