package org.openmrs.module.icare.billing.services.payment.gepg;

public class BillHdr {
	
	private String spCode;
	
	private String rtrRespFlg;
	
	// Getters and setters
	public String getSpCode() {
		return spCode;
	}
	
	public void setSpCode(String spCode) {
		this.spCode = spCode;
	}
	
	public String getRtrRespFlg() {
		return rtrRespFlg;
	}
	
	public void setRtrRespFlg(String rtrRespFlg) {
		this.rtrRespFlg = rtrRespFlg;
	}
}
