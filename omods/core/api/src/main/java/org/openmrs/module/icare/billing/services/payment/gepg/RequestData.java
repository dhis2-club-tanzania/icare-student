package org.openmrs.module.icare.billing.services.payment.gepg;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RequestData {
	
	@JsonProperty("RequestId")
	private String requestId;
	
	@JsonProperty("BillHdr")
	private BillHdr billHdr;
	
	@JsonProperty("BillTrxInf")
	private BillTrxInf billTrxInf;
	
	public RequestData() {
	}
	
	public RequestData(String requestId, BillHdr billHdr, BillTrxInf billTrxInf) {
		this.requestId = requestId;
		this.billHdr = billHdr;
		this.billTrxInf = billTrxInf;
	}
	
	// Getter and Setter Methods
	public String getRequestId() {
		return requestId;
	}
	
	public void setRequestId(String requestId) {
		this.requestId = requestId;
	}
	
	public BillHdr getBillHdr() {
		return billHdr;
	}
	
	public void setBillHdr(BillHdr billHdr) {
		this.billHdr = billHdr;
	}
	
	public BillTrxInf getBillTrxInf() {
		return billTrxInf;
	}
	
	public void setBillTrxInf(BillTrxInf billTrxInf) {
		this.billTrxInf = billTrxInf;
	}
}
