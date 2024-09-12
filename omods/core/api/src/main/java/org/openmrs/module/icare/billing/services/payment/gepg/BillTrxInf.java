package org.openmrs.module.icare.billing.services.payment.gepg;

public class BillTrxInf {
	
	private String billId;
	
	private String subSpCode;
	
	private String spSysId;
	
	private String billAmt;
	
	private String miscAmt;
	
	private String billExprDt;
	
	private String pyrId;
	
	private String pyrName;
	
	private String billDesc;
	
	private String billGenDt;
	
	private String billGenBy;
	
	private String billApprBy;
	
	private String pyrCellNum;
	
	private String pyrEmail;
	
	private String ccy;
	
	private String billEqvAmt;
	
	private String remFlag;
	
	private String billPayOpt;
	
	private BillItems billItems;
	
	// Getters and setters
	public String getBillId() {
		return billId;
	}
	
	public void setBillId(String billId) {
		this.billId = billId;
	}
	
	public String getSubSpCode() {
		return subSpCode;
	}
	
	public void setSubSpCode(String subSpCode) {
		this.subSpCode = subSpCode;
	}
	
	public String getSpSysId() {
		return spSysId;
	}
	
	public void setSpSysId(String spSysId) {
		this.spSysId = spSysId;
	}
	
	public String getBillAmt() {
		return billAmt;
	}
	
	public void setBillAmt(String billAmt) {
		this.billAmt = billAmt;
	}
	
	public String getMiscAmt() {
		return miscAmt;
	}
	
	public void setMiscAmt(String miscAmt) {
		this.miscAmt = miscAmt;
	}
	
	public String getBillExprDt() {
		return billExprDt;
	}
	
	public void setBillExprDt(String billExprDt) {
		this.billExprDt = billExprDt;
	}
	
	public String getPyrId() {
		return pyrId;
	}
	
	public void setPyrId(String pyrId) {
		this.pyrId = pyrId;
	}
	
	public String getPyrName() {
		return pyrName;
	}
	
	public void setPyrName(String pyrName) {
		this.pyrName = pyrName;
	}
	
	public String getBillDesc() {
		return billDesc;
	}
	
	public void setBillDesc(String billDesc) {
		this.billDesc = billDesc;
	}
	
	public String getBillGenDt() {
		return billGenDt;
	}
	
	public void setBillGenDt(String billGenDt) {
		this.billGenDt = billGenDt;
	}
	
	public String getBillGenBy() {
		return billGenBy;
	}
	
	public void setBillGenBy(String billGenBy) {
		this.billGenBy = billGenBy;
	}
	
	public String getBillApprBy() {
		return billApprBy;
	}
	
	public void setBillApprBy(String billApprBy) {
		this.billApprBy = billApprBy;
	}
	
	public String getPyrCellNum() {
		return pyrCellNum;
	}
	
	public void setPyrCellNum(String pyrCellNum) {
		this.pyrCellNum = pyrCellNum;
	}
	
	public String getPyrEmail() {
		return pyrEmail;
	}
	
	public void setPyrEmail(String pyrEmail) {
		this.pyrEmail = pyrEmail;
	}
	
	public String getCcy() {
		return ccy;
	}
	
	public void setCcy(String ccy) {
		this.ccy = ccy;
	}
	
	public String getBillEqvAmt() {
		return billEqvAmt;
	}
	
	public void setBillEqvAmt(String billEqvAmt) {
		this.billEqvAmt = billEqvAmt;
	}
	
	public String getRemFlag() {
		return remFlag;
	}
	
	public void setRemFlag(String remFlag) {
		this.remFlag = remFlag;
	}
	
	public String getBillPayOpt() {
		return billPayOpt;
	}
	
	public void setBillPayOpt(String billPayOpt) {
		this.billPayOpt = billPayOpt;
	}
	
	public BillItems getBillItems() {
		return billItems;
	}
	
	public void setBillItems(BillItems billItems) {
		this.billItems = billItems;
	}
}
