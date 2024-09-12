package org.openmrs.module.icare.billing.services.payment.gepg;

// SystemAuth class
public class SystemAuth {
	
	private String systemCode;
	
	private String serviceCode;
	
	private String signature;
	
	// Getters and setters
	public String getSystemCode() {
		return systemCode;
	}
	
	public void setSystemCode(String systemCode) {
		this.systemCode = systemCode;
	}
	
	public String getServiceCode() {
		return serviceCode;
	}
	
	public void setServiceCode(String serviceCode) {
		this.serviceCode = serviceCode;
	}
	
	public String getSignature() {
		return signature;
	}
	
	public void setSignature(String signature) {
		this.signature = signature;
	}
}
