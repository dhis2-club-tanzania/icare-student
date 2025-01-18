package org.openmrs.module.icare.billing;

import org.openmrs.api.APIException;

public class ItemNotPayableException extends APIException {
	
	public ItemNotPayableException(String s) {
		super(s);
	}
}
