package org.openmrs.module.icare.billing.services.insurance;

/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import org.openmrs.VisitType;
import org.openmrs.module.icare.core.utils.StaticHelper;

import java.util.Map;

public class VerificationRequest {
	
	private String id;
	
	private VisitType visitType;
	
	private String paymentType;
	
	private String paymentScheme;
	
	private String authorizationNumber;
	
	private String referralNumber;
	
	private String comment;
	
	public String getId() {
		return id;
	}
	
	public void setId(String id) {
		this.id = id;
	}
	
	public VisitType getVisitType() {
		return this.visitType;
	}
	
	public void setVisitType(VisitType visitType) {
		this.visitType = visitType;
	}
	
	public String getAuthorizationNumber() {
		return this.authorizationNumber;
	}
	
	public void setAuthorizationNumber(String authorizationNumber) {
		this.authorizationNumber = authorizationNumber;
	}
	
	public String getComment() {
		return comment;
	}
	
	public void setComment(String comment) {
		this.comment = comment;
	}
	
	public String getPaymentType() {
		return paymentType;
	}
	
	public void setPaymentType(String paymentType) {
		this.paymentType = paymentType;
	}
	
	public String getReferralNumber() {
		return referralNumber;
	}
	
	public void setReferralNumber(String referralNumber) {
		this.referralNumber = referralNumber;
	}
	
	public String getPaymentScheme() {
		return paymentScheme;
	}
	
	public void setPaymentScheme(String paymentScheme) {
		this.paymentScheme = paymentScheme;
	}
	
	public static VerificationRequest fromMap(Map<String, Object> verificationRequestObject) {
		VerificationRequest verificationRequest = new VerificationRequest();
		
		if (verificationRequestObject.get("id") != null) {
			verificationRequest.setId(verificationRequestObject.get("id").toString());
		}
		
		if (verificationRequestObject.get("visitType") != null) {
			VisitType visitType = new VisitType();
			visitType.setUuid(StaticHelper.getUuid(verificationRequestObject.get("visitType")));
			verificationRequest.setVisitType(visitType);
		}
		
		if (verificationRequestObject.get("authorizationNumber") != null) {
			verificationRequest.setAuthorizationNumber(verificationRequestObject.get("authorizationNumber").toString());
		}
		
		if (verificationRequestObject.get("comment") != null) {
			verificationRequest.setComment(verificationRequestObject.get("comment").toString());
		}
		
		if (verificationRequestObject.get("paymentType") != null) {
			verificationRequest.setPaymentType(verificationRequestObject.get("paymentType").toString());
		}
		
		if (verificationRequestObject.get("referralNumber") != null) {
			verificationRequest.setReferralNumber(verificationRequestObject.get("referralNumber").toString());
		}
		
		if (verificationRequestObject.get("paymentScheme") != null) {
			verificationRequest.setPaymentScheme(verificationRequestObject.get("paymentScheme").toString());
		}
		
		return verificationRequest;
		
	}
}
