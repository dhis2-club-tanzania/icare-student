package org.openmrs.module.icare.billing.services.payment.gepg;

public class BillItem {
	
	private String billItemRef;
	
	private String useItemRefOnPay;
	
	private String billItemAmt;
	
	private String billItemEqvAmt;
	
	private String billItemMiscAmt;
	
	private String gfsCode;
	
	// Constructor
	public BillItem(String billItemRef, String useItemRefOnPay, String billItemAmt, String billItemEqvAmt,
	    String billItemMiscAmt, String gfsCode) {
		this.billItemRef = billItemRef;
		this.useItemRefOnPay = useItemRefOnPay;
		this.billItemAmt = billItemAmt;
		this.billItemEqvAmt = billItemEqvAmt;
		this.billItemMiscAmt = billItemMiscAmt;
		this.gfsCode = gfsCode;
	}
	
	// Getters and setters
	public String getBillItemRef() {
		return billItemRef;
	}
	
	public void setBillItemRef(String billItemRef) {
		this.billItemRef = billItemRef;
	}
	
	public String getUseItemRefOnPay() {
		return useItemRefOnPay;
	}
	
	public void setUseItemRefOnPay(String useItemRefOnPay) {
		this.useItemRefOnPay = useItemRefOnPay;
	}
	
	public String getBillItemAmt() {
		return billItemAmt;
	}
	
	public void setBillItemAmt(String billItemAmt) {
		this.billItemAmt = billItemAmt;
	}
	
	public String getBillItemEqvAmt() {
		return billItemEqvAmt;
	}
	
	public void setBillItemEqvAmt(String billItemEqvAmt) {
		this.billItemEqvAmt = billItemEqvAmt;
	}
	
	public String getBillItemMiscAmt() {
		return billItemMiscAmt;
	}
	
	public void setBillItemMiscAmt(String billItemMiscAmt) {
		this.billItemMiscAmt = billItemMiscAmt;
	}
	
	public String getGfsCode() {
		return gfsCode;
	}
	
	public void setGfsCode(String gfsCode) {
		this.gfsCode = gfsCode;
	}
}
