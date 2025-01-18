package org.openmrs.module.icare.core.models;

import org.openmrs.*;
import org.openmrs.api.context.Context;

import javax.persistence.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "encounter_patient_state")
public class EncounterPatientState extends BaseOpenmrsData {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "encounter_patient_state_id", unique = true, nullable = false)
	private Integer id;
	
	@ManyToOne
	@JoinColumn(name = "encounter_id", nullable = false)
	private Encounter encounter;
	
	@ManyToOne
	@JoinColumn(name = "patient_state_id", nullable = false)
	private PatientState patientState;
	
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
	
	public PatientState getPatientState() {
		return patientState;
	}
	
	public void setPatientState(PatientState patientState) {
		this.patientState = patientState;
	}
	
	public Map<String,Object> toMap(){
        Map<String,Object> encounterWorkflowStateMap = new HashMap<>();

        if(this.getUuid() != null){
            encounterWorkflowStateMap.put("uuid", this.getUuid());
        }

        if(this.getEncounter() != null){
            Map<String, Object> encounterMap = new HashMap<>();
            encounterMap.put("uuid", this.encounter.getUuid());
            encounterWorkflowStateMap.put("encounter",encounterMap);
        }

        if(this.getPatientState() != null){
            Map<String, Object> stateMap = new HashMap<>();
            stateMap.put("uuid",this.getPatientState().getUuid());
            encounterWorkflowStateMap.put("patientState",stateMap);
        }

        return encounterWorkflowStateMap;
    }
}
