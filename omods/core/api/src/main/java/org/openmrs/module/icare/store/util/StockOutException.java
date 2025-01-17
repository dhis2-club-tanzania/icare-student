package org.openmrs.module.icare.store.util;

import org.openmrs.api.APIException;

public class StockOutException extends APIException {
	
	public StockOutException(String msg) {
		super(msg);
	}
}
