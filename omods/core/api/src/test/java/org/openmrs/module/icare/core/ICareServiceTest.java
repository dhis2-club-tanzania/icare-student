/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
package org.openmrs.module.icare.core;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.openmrs.Concept;
import org.openmrs.Visit;
import org.openmrs.VisitAttribute;
import org.openmrs.VisitAttributeType;
import org.openmrs.api.*;
import org.openmrs.api.context.Context;
import org.openmrs.module.AdvicePoint;
import org.openmrs.module.icare.ICareConfig;
import org.openmrs.module.icare.billing.aop.VisitEndAdvisor;
import org.openmrs.module.icare.billing.models.Invoice;
import org.openmrs.module.icare.billing.services.BillingService;
import org.openmrs.module.icare.billing.services.insurance.InsuranceService;
import org.openmrs.module.icare.billing.services.insurance.nhif.NHIFConfig;
import org.openmrs.module.icare.core.dao.ICareDao;
import org.openmrs.module.icare.core.impl.ICareServiceImpl;
import org.springframework.aop.Advisor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

/**
 * This is a unit test, which verifies logic in ICareService. It doesn't extend
 * BaseModuleContextSensitiveTest, thus it is run without the in-memory DB and Spring context.
 */
public class ICareServiceTest extends ICareTestBase {
	
	@Before
	public void setupMocks() throws Exception {
		this.initTestData();
		MockitoAnnotations.initMocks(this);
		AdministrationService adminService = Context.getService(AdministrationService.class);
		adminService.setGlobalProperty(ICareConfig.SERVICE_ATTRIBUTE, "298b75eb-5345-11e8-9c7c-40b0yt63cfee");
		adminService.setGlobalProperty(ICareConfig.PAYMENT_SCHEME_ATTRIBUTE, "298b75eb-5345-12e8-9c7c-40b0yt63cfee");
		adminService.setGlobalProperty(ICareConfig.PAYMENT_TYPE_ATTRIBUTE, "298b75eb-er45-12e8-9c7c-40b0yt63cfee");
		adminService.setGlobalProperty(ICareConfig.REGISTRATION_ENCOUNTER_TYPE, "2msir5eb-5345-11e8-9c7c-40b034c3cfee");
		adminService.setGlobalProperty(ICareConfig.BILLING_ORDER_TYPE, "2msir5eb-5345-11e8-9922-40b034c3cfee");
		adminService.setGlobalProperty(ICareConfig.CONSULTATION_ORDER_TYPE, "2msir5eb-5345-11e8-9922-40b034c3cfee");
		adminService.setGlobalProperty(ICareConfig.REGISTRATION_FEE_CONCEPT, "e721ec30-mfy4-11e8-ie7c-40b69mdy79ee");
		adminService.setGlobalProperty(ICareConfig.INSURANCE_ATTRIBUTE, "298b75eb-er45-12e8-9c7c-40b1yt63cfee");
		adminService.setGlobalProperty(ICareConfig.INSURANCE_ID_ATTRIBUTE, "298b75eb-er45-12e8-9c7c-42b0yt63cfee");
		adminService
		        .setGlobalProperty(ICareConfig.INSURANCE_AUTHORIZATION_ATTRIBUTE, "298b75eb-5555-12e8-9c7c-42b0yt63cfee");
		adminService.setGlobalProperty(ICareConfig.INSURANCE_REFERRAL_NUMBER, "298b75eb-5555-12e8-9c7c-42b0yt63cf11");
		adminService.setGlobalProperty(ICareConfig.VISIT_LENGTH_IN_HOURS, "24");
	}
	
	@Test
	public void saveItem_shouldSetOwnerIfNotSet() {
		//Given
		/*Item item = new Item();
		item.setDescription("some description");
		
		when(dao.saveItem(item)).thenReturn(item);
		
		User user = new User();
		when(userService.getUser(1)).thenReturn(user);
		
		//When
		basicModuleService.saveItem(item);
		
		//Then
		assertThat(item, hasProperty("owner", is(user)));*/
	}
	
	private void initiateVisitAdvice() throws ClassNotFoundException {
		Class<?> cls = Context.loadClass("org.openmrs.api.VisitService");
		Class<?> adviceClass = Context.loadClass("org.openmrs.module.icare.billing.aop.VisitEndAdvisor");
		AdvicePoint advice = new AdvicePoint("org.openmrs.api.VisitService", adviceClass);
		Advisor visitEndAdvisor = (Advisor) advice.getClassInstance();
		Context.addAdvisor(cls, visitEndAdvisor);
	}
	
	@Test
	public void testStoppingVisits() throws ClassNotFoundException {
		//Given
		VisitService visitService = Context.getService(VisitService.class);
		initiateVisitAdvice();
		
		for (VisitAttributeType visitAttributeType : visitService.getAllVisitAttributeTypes()) {
			visitAttributeType.setMinOccurs(0);
			visitService.saveVisitAttributeType(visitAttributeType);
		}
		
		//When
		ICareService iCareService = Context.getService(ICareService.class);
		iCareService.stopVisits();
		
		//Then
		int closed = 0;
		int opened = 0;
		for (Visit visit : visitService.getAllVisits()) {
			if (visit.getStopDatetime() == null) {
				opened++;
			} else {
				closed++;
			}
		}
		assertThat("6 Visit have been closed", closed, is(6));
		assertThat("0 Visit is open", opened, is(0));
	}
	
	@Test
	public void addPasswordHistory() throws Exception {
		ICareService iCareService = Context.getService(ICareService.class);
		iCareService.updatePasswordHistory();
	}
}
