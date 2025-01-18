package org.openmrs.module.icare.billing.services.payment.gepg;

import com.fasterxml.jackson.annotation.JsonProperty;

public class BillHdr {
	
	@JsonProperty("SpCode")
	private String spCode;
	
	@JsonProperty("RtrRespFlg")
	private String rtrRespFlg;
	
	// Utility method to capitalize the first letter of a string
	private String capitalizeFirstLetter(String input) {
		if (input == null || input.isEmpty()) {
			return input;
		}
		return input.substring(0, 1).toUpperCase() + input.substring(1);
	}
	
	// Getters and setters with capitalization
	@JsonProperty("SpCode")
	public String getSpCode() {
		return spCode;
	}
	
	public void setSpCode(String spCode) {
		this.spCode = spCode;
	}
	
	@JsonProperty("RtrRespFlg")
	public String getRtrRespFlg() {
		return rtrRespFlg;
	}
	
	public void setRtrRespFlg(String rtrRespFlg) {
		this.rtrRespFlg = rtrRespFlg;
	}
}
