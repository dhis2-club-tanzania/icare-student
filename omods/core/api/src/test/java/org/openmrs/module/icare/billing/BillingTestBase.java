package org.openmrs.module.icare.billing;

import org.openmrs.Patient;
import org.openmrs.Visit;
import org.openmrs.VisitAttribute;
import org.openmrs.api.AdministrationService;
import org.openmrs.api.PatientService;
import org.openmrs.api.VisitService;
import org.openmrs.api.context.Context;
import org.openmrs.module.AdvicePoint;
import org.openmrs.module.icare.ICareConfig;
import org.openmrs.module.icare.billing.aop.OrderBillAdvisor;
import org.openmrs.module.icare.billing.services.insurance.nhif.NHIFConfig;
import org.openmrs.test.BaseModuleContextSensitiveTest;
import org.springframework.aop.Advisor;

import java.util.Date;

public abstract class BillingTestBase extends BaseModuleContextSensitiveTest {
	
	Advisor billingAdvisor;
	
	OrderBillAdvisor orderAdvisor;
	
	public void initTestData() throws Exception {
		initTestOnfile("billing-data.xml");
	}
	
	public void initTestOnfile(String file) throws Exception {
		initializeInMemoryDatabase();
		executeDataSet(file);
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
		adminService.setGlobalProperty(ICareConfig.REGISTRATION_ENCOUNTER_ROLE, "a0b03050-c99b-11e0-9572-0800200c9a66");
	}
	
	private void initiateVisitAdvice() throws ClassNotFoundException {
		Class<?> cls = Context.loadClass("org.openmrs.api.VisitService");
		Class<?> adviceClass = Context.loadClass("org.openmrs.module.icare.billing.aop.VisitBillAdvisor");
		AdvicePoint advice = new AdvicePoint("org.openmrs.api.VisitService", adviceClass);
		billingAdvisor = (Advisor) advice.getClassInstance();
		Context.addAdvisor(cls, billingAdvisor);
	}
	
	private void initiateOrderAdvice() throws ClassNotFoundException {
		Class<?> cls = Context.loadClass("org.openmrs.api.OrderService");
		Class<?> adviceClass = Context.loadClass("org.openmrs.module.icare.billing.aop.OrderBillAdvisor");
		AdvicePoint advice = new AdvicePoint("org.openmrs.api.Orderervice", adviceClass);
		orderAdvisor = (OrderBillAdvisor) advice.getClassInstance();
		Context.addAdvisor(cls, orderAdvisor);
	}
	
	private void shutDownVisitAdvice() throws ClassNotFoundException {
		Class<?> cls = Context.loadClass("org.openmrs.api.VisitService");
		Context.removeAdvisor(cls, billingAdvisor);
	}
	
	private void shutDownOrderAdvice() throws ClassNotFoundException {
		Class<?> cls = Context.loadClass("org.openmrs.api.OrderService");
		Context.removeAdvisor(cls, orderAdvisor);
	}
	
	public void setUpAdvisors() throws ClassNotFoundException {
		this.initiateVisitAdvice();
		this.initiateOrderAdvice();
	}
	
	public void shutDowndvisors() throws ClassNotFoundException {
		this.shutDownVisitAdvice();
		this.shutDownOrderAdvice();
	}
	
	public Visit getVisit() {
		VisitService visitService = Context.getService(VisitService.class);
		PatientService patientService = Context.getService(PatientService.class);
		Patient patient = patientService.getPatientByUuid("993c46d2-5007-45e8-9512-969300717761");
		patient.setDateCreated(new Date());
		//Given
		Visit visit = new Visit();
		visit.setPatient(patient);
		visit.setStartDatetime(new Date());
		visit.setVisitType(visitService.getAllVisitTypes().get(0));
		
		//Setting Service visit attribute
		VisitAttribute serviceVisitAttribute = new VisitAttribute();
		serviceVisitAttribute.setAttributeType(visitService
		        .getVisitAttributeTypeByUuid("298b75eb-5345-11e8-9c7c-40b0yt63cfee"));
		serviceVisitAttribute.setValue("e721ec30-5344-11e8-9c7c-40b6etw3cfee");
		visit.addAttribute(serviceVisitAttribute);
		
		//Setting Payment Scheme visit attribute
		VisitAttribute schemeVisitAttribute = new VisitAttribute();
		schemeVisitAttribute.setAttributeType(visitService
		        .getVisitAttributeTypeByUuid("298b75eb-5345-12e8-9c7c-40b0yt63cfee"));
		schemeVisitAttribute.setValue("e721ec30-5344-11e8-ie7c-40b6etw379ee");
		visit.addAttribute(schemeVisitAttribute);
		
		//Setting Payment Type visit attribute
		VisitAttribute paymentTypeVisitAttribute = new VisitAttribute();
		paymentTypeVisitAttribute.setAttributeType(visitService
		        .getVisitAttributeTypeByUuid("298b75eb-er45-12e8-9c7c-40b0yt63cfee"));
		paymentTypeVisitAttribute.setValue("e7jnec30-5344-11e8-ie7c-40b6etw3cfee");
		visit.addAttribute(paymentTypeVisitAttribute);
		
		return visitService.saveVisit(visit);
	}
	
	public Visit getNHIFVisit(String schemeUuid) {
		VisitService visitService = Context.getService(VisitService.class);
		PatientService patientService = Context.getService(PatientService.class);
		Patient patient = patientService.getPatientByUuid("993c46d2-5007-45e8-9512-969300717761");
		patient.setDateCreated(new Date());
		//Given
		Visit visit = new Visit();
		visit.setPatient(patient);
		visit.setStartDatetime(new Date());
		visit.setVisitType(visitService.getAllVisitTypes().get(0));
		
		//Setting Service visit attribute
		VisitAttribute serviceVisitAttribute = new VisitAttribute();
		serviceVisitAttribute.setAttributeType(visitService
		        .getVisitAttributeTypeByUuid("298b75eb-5345-11e8-9c7c-40b0yt63cfee"));
		serviceVisitAttribute.setValue("a8102d6d-c528-477a-80bd-acc38ebc6252");
		visit.addAttribute(serviceVisitAttribute);
		
		//Setting Payment Scheme visit attribute
		VisitAttribute schemeVisitAttribute = new VisitAttribute();
		schemeVisitAttribute.setAttributeType(visitService
		        .getVisitAttributeTypeByUuid("298b75eb-5345-12e8-9c7c-40b0yt63cfee"));
		schemeVisitAttribute.setValue(schemeUuid);
		visit.addAttribute(schemeVisitAttribute);
		
		//Setting Payment Type visit attribute
		VisitAttribute paymentTypeVisitAttribute = new VisitAttribute();
		paymentTypeVisitAttribute.setAttributeType(visitService
		        .getVisitAttributeTypeByUuid("298b75eb-er45-12e8-9c7c-40b0yt63cfee"));
		paymentTypeVisitAttribute.setValue("e721ec30-mfy4-11e8-ie7c-40b6etw379ee");
		visit.addAttribute(paymentTypeVisitAttribute);
		
		//Setting Insurance visit attribute
		VisitAttribute insuranceVisitAttribute = new VisitAttribute();
		insuranceVisitAttribute.setAttributeType(visitService
		        .getVisitAttributeTypeByUuid("298b75eb-er45-12e8-9c7c-40b1yt63cfee"));
		//insuranceVisitAttribute.setValue("NHIF");
		insuranceVisitAttribute.setValue("e721ec30-m1y4-11e8-ie7c-40b69mdy79ee");
		visit.addAttribute(insuranceVisitAttribute);
		
		//Setting Insurance visit attribute
		VisitAttribute insuranceIDVisitAttribute = new VisitAttribute();
		insuranceIDVisitAttribute.setAttributeType(visitService
		        .getVisitAttributeTypeByUuid("298b75eb-er45-12e8-9c7c-42b0yt63cfee"));
		//insuranceIDVisitAttribute.setValue("01-nhif241");
		insuranceIDVisitAttribute.setValue("103701630289");
		visit.addAttribute(insuranceIDVisitAttribute);
		
		//Setting Insurance visit attribute
		AdministrationService adminService = Context.getService(AdministrationService.class);
		VisitAttribute authNoVisitAttribute = new VisitAttribute();
		authNoVisitAttribute.setAttributeType(visitService.getVisitAttributeTypeByUuid(adminService
		        .getGlobalProperty(ICareConfig.INSURANCE_AUTHORIZATION_ATTRIBUTE)));
		authNoVisitAttribute.setValue("683768234");
		visit.addAttribute(authNoVisitAttribute);
		
		return visitService.saveVisit(visit);
	}
}
