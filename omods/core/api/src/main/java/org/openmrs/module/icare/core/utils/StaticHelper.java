package org.openmrs.module.icare.core.utils;

import org.openmrs.api.context.Context;

import java.util.Map;

public class StaticHelper {
	
	public static String getUuid(Object uuidOrObject) {
		if (uuidOrObject instanceof Map) {
			return (String) ((Map<?, ?>) uuidOrObject).get("uuid");
		} else {
			return (String) uuidOrObject;
		}
	}
	
	public static String getFilepath() {
		return Context.getAdministrationService().getSystemVariables().get("ATTACHMENT_DIRECTORY");
	}
}
