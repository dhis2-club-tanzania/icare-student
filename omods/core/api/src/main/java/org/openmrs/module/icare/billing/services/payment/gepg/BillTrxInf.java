package org.openmrs.module.icare.billing.services.payment.gepg;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonPropertyOrder({ "BillId", "SubSpCode", "SpSysId", "BillAmt", "MiscAmt", "BillExprDt", "PyrId", "PyrName", "BillDesc",
        "BillGenDt", "BillGenBy", "BillApprBy", "PyrCellNum", "PyrEmail", "Ccy", "BillEqvAmt", "RemFlag", "BillPayOpt",
        "BillItems" })
public class BillTrxInf {
	
	private String BillId;
	
	private String SubSpCode;
	
	private String SpSysId;
	
	private String BillAmt;
	
	private String MiscAmt;
	
	private String BillExprDt;
	
	private String PyrId;
	
	private String PyrName;
	
	private String BillDesc;
	
	private String BillGenDt;
	
	private String BillGenBy;
	
	private String BillApprBy;
	
	private String PyrCellNum;
	
	private String PyrEmail;
	
	private String Ccy;
	
	private String BillEqvAmt;
	
	private String RemFlag;
	
	private String BillPayOpt;
	
	private BillItems BillItems;
	
	// Capitalize first letter utility method
	private String capitalizeFirstLetter(String input) {
		if (input == null || input.isEmpty()) {
			return input;
		}
		return input.substring(0, 1).toUpperCase() + input.substring(1).toLowerCase();
	}
	
	// Getters and Setters with capitalization applied in the getters
	@JsonProperty("BillId")
	public String getBillId() {
		return BillId;
	}
	
	public void setBillId(String BillId) {
		this.BillId = BillId;
	}
	
	@JsonProperty("SubSpCode")
	public String getSubSpCode() {
		return SubSpCode;
	}
	
	public void setSubSpCode(String SubSpCode) {
		this.SubSpCode = SubSpCode;
	}
	
	@JsonProperty("SpSysId")
	public String getSpSysId() {
		return SpSysId;
	}
	
	public void setSpSysId(String SpSysId) {
		this.SpSysId = SpSysId;
	}
	
	@JsonProperty("BillAmt")
	public String getBillAmt() {
		return BillAmt;
	}
	
	public void setBillAmt(String BillAmt) {
		this.BillAmt = BillAmt;
	}
	
	@JsonProperty("MiscAmt")
	public String getMiscAmt() {
		return MiscAmt;
	}
	
	public void setMiscAmt(String MiscAmt) {
		this.MiscAmt = MiscAmt;
	}
	
	@JsonProperty("BillExprDt")
	public String getBillExprDt() {
		return BillExprDt;
	}
	
	public void setBillExprDt(String BillExprDt) {
		this.BillExprDt = BillExprDt;
	}
	
	@JsonProperty("PyrId")
	public String getPyrId() {
		return PyrId;
	}
	
	public void setPyrId(String PyrId) {
		this.PyrId = PyrId;
	}
	
	@JsonProperty("PyrName")
	public String getPyrName() {
		return PyrName;
	}
	
	public void setPyrName(String PyrName) {
		this.PyrName = PyrName;
	}
	
	@JsonProperty("BillDesc")
	public String getBillDesc() {
		return BillDesc;
	}
	
	public void setBillDesc(String BillDesc) {
		this.BillDesc = BillDesc;
	}
	
	@JsonProperty("BillGenDt")
	public String getBillGenDt() {
		return BillGenDt;
	}
	
	public void setBillGenDt(String BillGenDt) {
		this.BillGenDt = BillGenDt;
	}
	
	@JsonProperty("BillGenBy")
	public String getBillGenBy() {
		return BillGenBy;
	}
	
	public void setBillGenBy(String BillGenBy) {
		this.BillGenBy = BillGenBy;
	}
	
	@JsonProperty("BillApprBy")
	public String getBillApprBy() {
		return BillApprBy;
	}
	
	public void setBillApprBy(String BillApprBy) {
		this.BillApprBy = BillApprBy;
	}
	
	@JsonProperty("PyrCellNum")
	public String getPyrCellNum() {
		return PyrCellNum;
	}
	
	public void setPyrCellNum(String PyrCellNum) {
		this.PyrCellNum = PyrCellNum;
	}
	
	@JsonProperty("PyrEmail")
	public String getPyrEmail() {
		return PyrEmail;
	}
	
	public void setPyrEmail(String PyrEmail) {
		this.PyrEmail = PyrEmail;
	}
	
	@JsonProperty("Ccy")
	public String getCcy() {
		return Ccy;
	}
	
	public void setCcy(String Ccy) {
		this.Ccy = Ccy;
	}
	
	@JsonProperty("BillEqvAmt")
	public String getBillEqvAmt() {
		return BillEqvAmt;
	}
	
	public void setBillEqvAmt(String BillEqvAmt) {
		this.BillEqvAmt = BillEqvAmt;
	}
	
	@JsonProperty("RemFlag")
	public String getRemFlag() {
		return RemFlag;
	}
	
	public void setRemFlag(String RemFlag) {
		this.RemFlag = RemFlag;
	}
	
	@JsonProperty("BillPayOpt")
	public String getBillPayOpt() {
		return BillPayOpt;
	}
	
	public void setBillPayOpt(String BillPayOpt) {
		this.BillPayOpt = BillPayOpt;
	}
	
	@JsonProperty("BillItems")
	public BillItems getBillItems() {
		return BillItems;
	}
	
	public void setBillItems(BillItems BillItems) {
		this.BillItems = BillItems;
	}
}
