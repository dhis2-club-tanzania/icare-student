/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
package org.openmrs.module.icare.billing.services.insurance;

import org.openmrs.Concept;
import org.openmrs.module.icare.billing.services.insurance.nhif.Gender;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class VerificationResponse {
	
	private String id;
	
	private EligibilityStatus eligibilityStatus;
	
	private String firstName;
	
	private String middleName;
	
	private String lastName;
	
	private String remarks;
	
	private Gender gender;
	
	private Date dateOfBirth;
	
	private Date dateOfExpiry;
	
	private AuthorizationStatus authorizationStatus;
	
	private String authorizationNumber;
	
	private Map<String, Object> otherData;
	
	private String comment;
	
	private Concept paymentScheme;
	
	public String getId() {
		return id;
	}
	
	public void setId(String id) {
		this.id = id;
	}
	
	public EligibilityStatus getEligibilityStatus() {
		return this.eligibilityStatus;
	}
	
	public void setEligibilityStatus(EligibilityStatus eligibilityStatus) {
		this.eligibilityStatus = eligibilityStatus;
	}
	
	public String getComment() {
		return comment;
	}
	
	public void setComment(String comment) {
		this.comment = comment;
	}
	
	public String getFirstName() {
		return firstName;
	}
	
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	
	public String getMiddleName() {
		return middleName;
	}
	
	public void setMiddleName(String middleName) {
		this.middleName = middleName;
	}
	
	public String getLastName() {
		return lastName;
	}
	
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	
	public Gender getGender() {
		return gender;
	}
	
	public void setGender(Gender gender) {
		this.gender = gender;
	}
	
	public Date getDateOfBirth() {
		return dateOfBirth;
	}
	
	public void setDateOfBirth(Date dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}
	
	public Date getDateOfExpiry() {
		return dateOfExpiry;
	}
	
	public void setDateOfExpiry(Date dateOfExpiry) {
		this.dateOfExpiry = dateOfExpiry;
	}
	
	public AuthorizationStatus getAuthorizationStatus() {
		return authorizationStatus;
	}
	
	public void setAuthorizationStatus(AuthorizationStatus authorizationStatus) {
		this.authorizationStatus = authorizationStatus;
	}
	
	public Map<String, Object> getOtherData() {
		return otherData;
	}
	
	public void setOtherData(Map<String, Object> otherData) {
		this.otherData = otherData;
	}
	
	public String getAuthorizationNumber() {
		return authorizationNumber;
	}
	
	public void setAuthorizationNumber(String authorizationNumber) {
		this.authorizationNumber = authorizationNumber;
	}
	
	public String getRemarks() {
		return remarks;
	}
	
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	
	public Concept getPaymentScheme() {
		return paymentScheme;
	}
	
	public void setPaymentScheme(Concept paymentScheme) {
		this.paymentScheme = paymentScheme;
	}
	
	public Map<String, Object> toMap(){

		Map<String, Object> verificationResponseMap = new HashMap<>();

		if(this.getId() != null){
			verificationResponseMap.put("id",this.getId());
		}

		if(this.getEligibilityStatus() != null){
			verificationResponseMap.put("elligibilityStatus",this.getEligibilityStatus().toString());
		}

		if(this.getFirstName() != null){
			verificationResponseMap.put("firstName", this.getFirstName());
		}

		if(this.getMiddleName() != null){
			verificationResponseMap.put("middleName", this.getMiddleName());
		}

		if(this.getLastName() != null){
			verificationResponseMap.put("lastName", this.getLastName());
		}

		if(this.getRemarks() != null){
			verificationResponseMap.put("remarks", this.getRemarks());
		}

		if(this.getGender() != null){
			verificationResponseMap.put("gender", this.getGender());
		}

		if(this.getDateOfBirth() != null){
			verificationResponseMap.put("dateOfBirth",this.getDateOfBirth());
		}

		if(this.getDateOfExpiry() != null){
			verificationResponseMap.put("dateOfexpiry", this.getDateOfExpiry());
		}

		if( this.getAuthorizationStatus() != null){
			verificationResponseMap.put("authorizationStatus", this.getAuthorizationStatus());
		}

		if(this.getAuthorizationNumber() != null){
			verificationResponseMap.put("authorizationNumber",this.getAuthorizationNumber());
		}

		if(this.getOtherData() != null){
			verificationResponseMap.put("otherData",this.getOtherData());
		}

		if(this.getComment() != null){
			verificationResponseMap.put("comment",this.getComment());
		}

		if(this.getPaymentScheme() != null){
			Map<String,Object> paymentSchemeMap = new HashMap<>();
			paymentSchemeMap.put("uuid",this.getPaymentScheme().getUuid());
			paymentSchemeMap.put("name",this.getPaymentScheme().getName().getName());
		}

		return verificationResponseMap;

	}
}
