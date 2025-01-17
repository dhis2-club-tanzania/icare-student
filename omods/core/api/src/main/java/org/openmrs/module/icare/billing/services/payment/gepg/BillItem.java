package org.openmrs.module.icare.billing.services.payment.gepg;

import com.fasterxml.jackson.annotation.JsonProperty;

public class BillItem {
	
	@JsonProperty("BillItemRef")
	private String billItemRef;
	
	@JsonProperty("UseItemRefOnPay")
	private String useItemRefOnPay;
	
	@JsonProperty("BillItemAmt")
	private String billItemAmt;
	
	@JsonProperty("BillItemEqvAmt")
	private String billItemEqvAmt;
	
	@JsonProperty("BillItemMiscAmt")
	private String billItemMiscAmt;
	
	@JsonProperty("GfsCode")
	private String gfsCode;
	
	// Utility method to capitalize the first letter of a string
	private String capitalizeFirstLetter(String input) {
		if (input == null || input.isEmpty()) {
			return input;
		}
		return input.substring(0, 1).toUpperCase() + input.substring(1);
	}
	
	// Constructor with capitalization
	public BillItem(String billItemRef, String useItemRefOnPay, String billItemAmt, String billItemEqvAmt,
	    String billItemMiscAmt, String gfsCode) {
		this.billItemRef = capitalizeFirstLetter(billItemRef);
		this.useItemRefOnPay = capitalizeFirstLetter(useItemRefOnPay);
		this.billItemAmt = capitalizeFirstLetter(billItemAmt);
		this.billItemEqvAmt = capitalizeFirstLetter(billItemEqvAmt);
		this.billItemMiscAmt = capitalizeFirstLetter(billItemMiscAmt);
		this.gfsCode = capitalizeFirstLetter(gfsCode);
	}
	
	// Getters and Setters with capitalization
	@JsonProperty("BillItemRef")
	public String getBillItemRef() {
		return billItemRef;
	}
	
	public void setBillItemRef(String billItemRef) {
		this.billItemRef = capitalizeFirstLetter(billItemRef);
	}
	
	@JsonProperty("UseItemRefOnPay")
	public String getUseItemRefOnPay() {
		return useItemRefOnPay;
	}
	
	public void setUseItemRefOnPay(String useItemRefOnPay) {
		this.useItemRefOnPay = capitalizeFirstLetter(useItemRefOnPay);
	}
	
	@JsonProperty("BillItemAmt")
	public String getBillItemAmt() {
		return billItemAmt;
	}
	
	public void setBillItemAmt(String billItemAmt) {
		this.billItemAmt = capitalizeFirstLetter(billItemAmt);
	}
	
	@JsonProperty("BillItemEqvAmt")
	public String getBillItemEqvAmt() {
		return billItemEqvAmt;
	}
	
	public void setBillItemEqvAmt(String billItemEqvAmt) {
		this.billItemEqvAmt = capitalizeFirstLetter(billItemEqvAmt);
	}
	
	@JsonProperty("BillItemMiscAmt")
	public String getBillItemMiscAmt() {
		return billItemMiscAmt;
	}
	
	public void setBillItemMiscAmt(String billItemMiscAmt) {
		this.billItemMiscAmt = capitalizeFirstLetter(billItemMiscAmt);
	}
	
	@JsonProperty("GfsCode")
	public String getGfsCode() {
		return gfsCode;
	}
	
	public void setGfsCode(String gfsCode) {
		this.gfsCode = capitalizeFirstLetter(gfsCode);
	}
}
