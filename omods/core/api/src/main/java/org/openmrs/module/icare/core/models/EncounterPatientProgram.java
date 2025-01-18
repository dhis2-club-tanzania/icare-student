package org.openmrs.module.icare.core.models;

import org.openmrs.BaseOpenmrsData;
import org.openmrs.Encounter;
import org.openmrs.PatientProgram;
import javax.persistence.*;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "encounter_patient_program")
public class EncounterPatientProgram extends BaseOpenmrsData implements Serializable {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "encounter_patient_program_id", unique = true, nullable = false)
	private Integer id;
	
	@ManyToOne
	@JoinColumn(name = "encounter_id", nullable = true)
	private Encounter encounter;
	
	@ManyToOne
	@JoinColumn(name = "patient_program_id", nullable = true)
	private PatientProgram patientProgram;
	
	@Override
	public Integer getId() {
		return id;
	}
	
	@Override
	public void setId(Integer id) {
		this.id = id;
	}
	
	public Encounter getEncounter() {
		return encounter;
	}
	
	public void setEncounter(Encounter encounter) {
		this.encounter = encounter;
	}
	
	public PatientProgram getPatientProgram() {
		return patientProgram;
	}
	
	public void setPatientProgram(PatientProgram patientProgram) {
		this.patientProgram = patientProgram;
	}
	
	public Map<String, Object> toMap(){
        Map<String, Object> encounterProgramMap = new HashMap<>();

        if(this.patientProgram != null){
            Map<String, Object> patientProgramMap = new HashMap<>();
            patientProgramMap.put("uuid",this.getPatientProgram().getUuid());
            patientProgramMap.put("name",this.getPatientProgram().getProgram().getName());
            encounterProgramMap.put("patientProgram", patientProgramMap);

        }

        if(this.getEncounter() != null){
            Map<String,Object> encounterMap = new HashMap<>();
            encounterMap.put("uuid",this.getEncounter().getUuid());
            encounterProgramMap.put("encounters",encounterMap);

        }
        encounterProgramMap.put("uuid",this.getUuid());

        return encounterProgramMap;
    }
}
