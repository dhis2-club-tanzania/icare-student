package org.openmrs.module.icare.billing.services.insurance.nhif.claim;

import java.util.ArrayList;
import java.util.List;

public class FolioEntities {
	
	private List<Folio> entities = new ArrayList<Folio>();
	
	public List<Folio> getEntities() {
		return entities;
	}
	
	public void setEntities(List<Folio> entities) {
		this.entities = entities;
	}
}
