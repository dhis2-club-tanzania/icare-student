package org.openmrs.module.icare.billing.services.insurance.nhif;

public enum NHIFServer {
	CLAIM {
		
		public String getEndPoint() {
			return "claimsserver";
		}
	},
	SERVICE {
		
		public String getEndPoint() {
			return "nhifservice";
		}
	};
	
	public abstract String getEndPoint();
}
