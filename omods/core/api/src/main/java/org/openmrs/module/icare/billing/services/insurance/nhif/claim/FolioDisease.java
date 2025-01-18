package org.openmrs.module.icare.billing.services.insurance.nhif.claim;

import org.codehaus.jackson.annotate.JsonProperty;
import org.openmrs.ConceptMap;
import org.openmrs.Diagnosis;
import org.openmrs.Order;
import org.openmrs.api.context.Context;
import org.openmrs.module.icare.billing.models.InvoiceItem;
import org.openmrs.module.icare.billing.services.BillingService;

import java.util.Date;

public class FolioDisease {
	
	@JsonProperty("FolioDiseaseID")
	public String folioDiseaseID;
	
	@JsonProperty("DiseaseCode")
	public String diseaseCode;
	
	@JsonProperty("FolioID")
	public String folioID;
	
	@JsonProperty("Remarks")
	public Object remarks;
	
	@JsonProperty("CreatedBy")
	public String createdBy;
	
	@JsonProperty("DateCreated")
	public Date dateCreated;
	
	@JsonProperty("LastModifiedBy")
	public String lastModifiedBy;
	
	@JsonProperty("LastModified")
	public Date lastModified;
	
	public static FolioDisease fromDiagnosis(Folio folio, Diagnosis diagnosis) {
		FolioDisease folioDisease = new FolioDisease();
		folioDisease.setFolioID(folio.getFolioID());
		folioDisease.setFolioDiseaseID(diagnosis.getUuid());
		//diagnosis.getDiagnosis().
		String diagnosisString = diagnosis.getDiagnosis().getCoded().getDisplayString();
		String diagnosisCode = diagnosisString.split(" ")[0].replace("(", "").replace(")", "").toUpperCase();
		
		folioDisease.setDiseaseCode(diagnosisCode);
		folioDisease.setRemarks(diagnosis.getDiagnosis().getNonCoded());
		folioDisease.setCreatedBy(diagnosis.getCreator().getDisplayString());
		folioDisease.setDateCreated(diagnosis.getDateCreated());
		if (diagnosis.getChangedBy() != null) {
			folioDisease.setLastModifiedBy(diagnosis.getChangedBy().getDisplayString());
		} else {
			folioDisease.setLastModifiedBy(diagnosis.getCreator().getDisplayString());
		}
		if (diagnosis.getDateChanged() != null) {
			folioDisease.setLastModified(diagnosis.getDateChanged());
		} else {
			folioDisease.setLastModified(diagnosis.getDateCreated());
		}
		return folioDisease;
	}
	
	public String getFolioDiseaseID() {
		return folioDiseaseID;
	}
	
	public void setFolioDiseaseID(String folioDiseaseID) {
		this.folioDiseaseID = folioDiseaseID;
	}
	
	public String getDiseaseCode() {
		return diseaseCode;
	}
	
	public void setDiseaseCode(String diseaseCode) {
		this.diseaseCode = diseaseCode;
	}
	
	public String getFolioID() {
		return folioID;
	}
	
	public Object getRemarks() {
		return remarks;
	}
	
	public void setRemarks(Object remarks) {
		this.remarks = remarks;
	}
	
	public String getCreatedBy() {
		return createdBy;
	}
	
	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}
	
	public Date getDateCreated() {
		return dateCreated;
	}
	
	public void setDateCreated(Date dateCreated) {
		this.dateCreated = dateCreated;
	}
	
	public String getLastModifiedBy() {
		return lastModifiedBy;
	}
	
	public void setLastModifiedBy(String lastModifiedBy) {
		this.lastModifiedBy = lastModifiedBy;
	}
	
	public Date getLastModified() {
		return lastModified;
	}
	
	public void setLastModified(Date lastModified) {
		this.lastModified = lastModified;
	}
	
	public void setFolioID(String folioID) {
		this.folioID = folioID;
	}
}
