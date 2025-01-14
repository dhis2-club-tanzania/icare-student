package org.openmrs.module.icare.auditlog.util;

import org.apache.commons.io.IOUtils;
import org.openmrs.api.APIException;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public final class AuditLogConstants {
	
	public static final String MODULE_ID = "auditlog";
	
	public static final String SEPARATOR = ",";
	
	public static final String DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";
	
	//Specifies the auditing strategy in use
	public static final String GP_AUDITING_STRATEGY = MODULE_ID + ".auditingStrategy";
	
	//Specifies whether the last states of deleted items should be stored on the auditlog
	public static final String GP_STORE_LAST_STATE_OF_DELETED_ITEMS = MODULE_ID + ".storeLastStateOfDeletedItems";
	
	/* MODULE PRIVILEGES */
	public static final String PRIV_GET_AUDITLOGS = "Get Audit Logs";
	
	public static final String PRIV_GET_AUDIT_STRATEGY = "Get Audit Strategy";
	
	public static final String PRIV_GET_ITEMS = "Get Items";
	
	public static final String CHECK_FOR_AUDITED_ITEMS = "Check For Audited Items";
	
	public static final String PRIV_MANAGE_AUDITLOG = "Manage Audit Log";
	
	public static final String MODULE_VERSION;
	
	static {
		InputStream file = AuditLogConstants.class.getClassLoader().getResourceAsStream(
		    "org/openmrs/module/auditlog/util/module.properties");
		if (file == null) {
			throw new APIException("Unable to find the module.properties file");
		}
		
		try {
			Properties props = new Properties();
			props.load(file);
			file.close();
			MODULE_VERSION = props.getProperty("moduleVersion");
		}
		catch (IOException e) {
			throw new APIException("Unable to parse the module.properties file", e);
		}
		finally {
			IOUtils.closeQuietly(file);
		}
	}
	
}
