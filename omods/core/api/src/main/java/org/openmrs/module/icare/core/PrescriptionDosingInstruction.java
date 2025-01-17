package org.openmrs.module.icare.core;

import org.openmrs.module.icare.billing.models.Prescription;
import org.springframework.validation.Errors;

import java.util.Date;
import java.util.Locale;

public interface PrescriptionDosingInstruction {
	
	String getDosingInstructionsAsString(Locale var1);
	
	void setDosingInstructions(Prescription var1);
	
	PrescriptionDosingInstruction getDosingInstructions(Prescription var1);
	
	void validate(Prescription var1, Errors var2);
	
	Date getAutoExpireDate(Prescription var1);
}
