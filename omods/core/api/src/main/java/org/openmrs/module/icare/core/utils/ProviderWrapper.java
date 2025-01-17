package org.openmrs.module.icare.core.utils;

import org.openmrs.*;
import org.openmrs.api.AdministrationService;
import org.openmrs.api.ProviderService;
import org.openmrs.api.VisitService;
import org.openmrs.api.context.Context;
import org.openmrs.attribute.AttributeType;
import org.openmrs.module.icare.ICareConfig;

import javax.naming.ConfigurationException;
import java.util.List;

public class ProviderWrapper {
	
	private Provider provider;
	
	public ProviderWrapper(Provider provider) {
		this.provider = provider;
	}
	
	public Provider getProvider() {
		return provider;
	}
	
	private String getAttribute(String attributeConfig) throws ConfigurationException {
		String attributeValue = null;
		AdministrationService adminService = Context.getService(AdministrationService.class);
		String providerAttributeUuid = adminService.getGlobalProperty(attributeConfig);
		if (providerAttributeUuid == null) {
			throw new ConfigurationException("Attribute ID is configured. Please set '" + attributeConfig + "'");
		}
		ProviderService providerService = Context.getService(ProviderService.class);
		List<ProviderAttributeType> providerAttributeTypes = providerService.getAllProviderAttributeTypes();
		for (ProviderAttribute attribute : this.provider.getAttributes()) {
			AttributeType attributeType = attribute.getAttributeType();
			for (ProviderAttributeType providerAttributeType : providerAttributeTypes) {
				if (providerAttributeType.getUuid().equals(attributeType.getUuid())) {
					if (providerAttributeType.getUuid().equals(providerAttributeUuid)) { //CASH OR Insurance
						attributeValue = (String) attribute.getValue();
					}
				}
			}
		}
		return attributeValue;
	}
	
	public String getQualification() throws ConfigurationException {
		return this.getAttribute(ICareConfig.PROVIDER_QUALIFICATION_ATTRIBUTE);
	}
	
	public String getRegistrationNumber() throws ConfigurationException {
		return this.getAttribute(ICareConfig.PROVIDER_REGISTRATION_NUMBER_ATTRIBUTE);
	}
	
	public String getSignature() throws ConfigurationException {
		return this.getAttribute(ICareConfig.PROVIDER_SIGNATURE_ATTRIBUTE);
	}
	
	public String getPhoneNumber() throws ConfigurationException {
		return this.getAttribute(ICareConfig.PROVIDER_PHONENUMBER_ATTRIBUTE);
	}
}
