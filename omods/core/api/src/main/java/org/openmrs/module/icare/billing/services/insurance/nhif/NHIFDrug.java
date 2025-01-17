package org.openmrs.module.icare.billing.services.insurance.nhif;

import org.openmrs.*;
import org.openmrs.api.AdministrationService;
import org.openmrs.api.ConceptService;
import org.openmrs.api.context.Context;
import org.openmrs.module.icare.billing.services.insurance.VerificationException;

import javax.naming.ConfigurationException;
import java.util.HashMap;
import java.util.Map;

public class NHIFDrug {
	
	private Drug drug;
	
	NHIFDrug(Drug drug) {
		this.drug = drug;
	}
	
	public boolean hasItemCode() {
		for (DrugReferenceMap drugReferenceMap : drug.getDrugReferenceMaps()) {
			if (drugReferenceMap.getConceptReferenceTerm().getConceptSource().getName().equals("NHIF")) {
				return true;
			}
		}
		return false;
	}
	
	public boolean hasDosageForm() {
		return this.drug.getDosageForm() != null;
	}
	
	public void setItemCode(String itemCode, String itemName) {
		ConceptService conceptService = Context.getConceptService();
		ConceptSource NHIFConceptSource = conceptService.getConceptSourceByName("NHIF");
		ConceptReferenceTerm conceptReferenceTerm = conceptService.getConceptReferenceTermByCode(
		
		itemCode, NHIFConceptSource);
		if (conceptReferenceTerm == null) {
			conceptReferenceTerm = new ConceptReferenceTerm();
			conceptReferenceTerm.setCode(itemCode);
			conceptReferenceTerm.setConceptSource(NHIFConceptSource);
			conceptReferenceTerm.setName(itemName);
			conceptService.saveConceptReferenceTerm(conceptReferenceTerm);
		}
		
		DrugReferenceMap drugReferenceMap = new DrugReferenceMap();
		drugReferenceMap.setConceptReferenceTerm(conceptReferenceTerm);
		drugReferenceMap.setDrug(drug);
		drugReferenceMap.setConceptMapType(conceptService.getDefaultConceptMapType());
		drug.getDrugReferenceMaps().add(drugReferenceMap);
	}
	
	public void setDosageForm(String doseForm) throws ConfigurationException {
		Map<String, String> doubleBraceMap = new HashMap<String, String>() {
			
			{
				put("key1", "value1");
				put("key2", "value2");
			}
		};
		if (doseForm != null) {
			ConceptService conceptService = Context.getConceptService();
			Concept unitConcept = null;
			AdministrationService adminService = Context.getService(AdministrationService.class);
			String doseUnitConept = adminService.getGlobalProperty(NHIFConfig.DOSING_UNIT_CONCEPT_UUID);
			if (doseUnitConept == null) {
				throw new ConfigurationException("Dosing Unit Concept Uuid is not set. Please set "
				        + NHIFConfig.DOSING_UNIT_CONCEPT_UUID + ".");
			}
			for (Concept concept : conceptService.getConceptByUuid(doseUnitConept).getSetMembers()) {
				for (ConceptName conceptName : concept.getShortNames()) {
					if (doseForm.toLowerCase().contains(conceptName.getName().toLowerCase())) {
						unitConcept = concept;
						break;
					}
				}
				if (unitConcept != null) {
					break;
				}
			}
			if (unitConcept != null) {
				System.out.println("SAVEDRUG:" + doseForm.toLowerCase() + ":" + drug.getName());
			} else {
				System.out.println("SAVENULLDRUG:" + doseForm.toLowerCase() + ":" + drug.getName());
			}
			
			drug.setDosageForm(unitConcept);
		}
		/*if(unitConcept != null){
		    DrugIngredient ingredient = new DrugIngredient();
		    ingredient.setDrug(this.drug);
		    ingredient.set
		    ingredient.setUnits(unitConcept);
		    this.drug.getIngredients().add(ingredient);
		}*/
		/*ConceptService conceptService = Context.getConceptService();
		ConceptSource NHIFConceptSource = conceptService.getConceptSourceByName("Dosage");
		ConceptReferenceTerm conceptReferenceTerm = conceptService.getConceptReferenceTermByCode(

		        doseUnit, NHIFConceptSource);
		if (conceptReferenceTerm == null) {
		    conceptReferenceTerm = new ConceptReferenceTerm();
		    conceptReferenceTerm.setCode(doseUnit);
		    conceptReferenceTerm.setConceptSource(NHIFConceptSource);
		    conceptReferenceTerm.setName(doseUnit);
		    conceptService.saveConceptReferenceTerm(conceptReferenceTerm);
		}

		DrugReferenceMap drugReferenceMap = new DrugReferenceMap();
		drugReferenceMap.setConceptReferenceTerm(conceptReferenceTerm);
		drugReferenceMap.setDrug(drug);
		drugReferenceMap.setConceptMapType(conceptService.getDefaultConceptMapType());
		drug.getDrugReferenceMaps().add(drugReferenceMap);*/
	}
	
	public Drug getDrug() {
		return this.drug;
	}
}
