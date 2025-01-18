package org.openmrs.module.icare.billing.models;

public class CallbackData {
	
	private SystemAuth systemAuth;
	
	private FeedbackData feedbackData;
	
	private Status status;
	
	// Getters and setters
	public SystemAuth getSystemAuth() {
		return systemAuth;
	}
	
	public void setSystemAuth(SystemAuth systemAuth) {
		this.systemAuth = systemAuth;
	}
	
	public FeedbackData getFeedbackData() {
		return feedbackData;
	}
	
	public void setFeedbackData(FeedbackData feedbackData) {
		this.feedbackData = feedbackData;
	}
	
	public Status getStatus() {
		return status;
	}
	
	public void setStatus(Status status) {
		this.status = status;
	}
	
	// Nested classes for the structure
	public static class SystemAuth {
		
		private String serviceCode;
		
		private String signature;
		
		// Getters and setters
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
	
	public static class FeedbackData {
		
		private GepgBillSubResp gepgBillSubResp;
		
		// Getter and setter
		public GepgBillSubResp getGepgBillSubResp() {
			return gepgBillSubResp;
		}
		
		public void setGepgBillSubResp(GepgBillSubResp gepgBillSubResp) {
			this.gepgBillSubResp = gepgBillSubResp;
		}
		
		public static class GepgBillSubResp {
			
			private BillTrxInf billTrxInf;
			
			// Getter and setter
			public BillTrxInf getBillTrxInf() {
				return billTrxInf;
			}
			
			public void setBillTrxInf(BillTrxInf billTrxInf) {
				this.billTrxInf = billTrxInf;
			}
			
			public static class BillTrxInf {
				
				private String billId;
				
				private String payCntrNum;
				
				private String trxSts;
				
				private String trxStsCode;
				
				// Getters and setters
				public String getBillId() {
					return billId;
				}
				
				public void setBillId(String billId) {
					this.billId = billId;
				}
				
				public String getPayCntrNum() {
					return payCntrNum;
				}
				
				public void setPayCntrNum(String payCntrNum) {
					this.payCntrNum = payCntrNum;
				}
				
				public String getTrxSts() {
					return trxSts;
				}
				
				public void setTrxSts(String trxSts) {
					this.trxSts = trxSts;
				}
				
				public String getTrxStsCode() {
					return trxStsCode;
				}
				
				public void setTrxStsCode(String trxStsCode) {
					this.trxStsCode = trxStsCode;
				}
			}
		}
	}
	
	public static class Status {
		
		private String requestId;
		
		private String code;
		
		private String description;
		
		// Getters and setters
		public String getRequestId() {
			return requestId;
		}
		
		public void setRequestId(String requestId) {
			this.requestId = requestId;
		}
		
		public String getCode() {
			return code;
		}
		
		public void setCode(String code) {
			this.code = code;
		}
		
		public String getDescription() {
			return description;
		}
		
		public void setDescription(String description) {
			this.description = description;
		}
	}
}
