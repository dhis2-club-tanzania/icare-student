package org.openmrs.module.icare.web.controller.core;

import org.codehaus.jackson.map.ObjectMapper;
import org.junit.Ignore;
import org.openmrs.Patient;
import org.openmrs.Visit;
import org.openmrs.VisitAttribute;
import org.openmrs.api.AdministrationService;
import org.openmrs.api.VisitService;
import org.openmrs.api.context.Context;
import org.openmrs.module.AdvicePoint;
import org.openmrs.module.icare.ICareConfig;
import org.openmrs.module.icare.billing.VisitInvalidException;
import org.openmrs.module.icare.billing.aop.OrderBillAdvisor;
import org.openmrs.module.icare.core.aop.VisitDiagnosisAdvisor;
import org.openmrs.module.icare.billing.services.insurance.nhif.NHIFConfig;
import org.openmrs.module.webservices.rest.web.v1_0.controller.MainResourceControllerTest;
import org.springframework.aop.Advisor;

import javax.naming.ConfigurationException;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.net.URL;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public abstract class BaseResourceControllerTest extends MainResourceControllerTest {
	
	Advisor billingAdvisor;
	
	OrderBillAdvisor orderAdvisor;
	
	VisitDiagnosisAdvisor visitDiagnosisAdvisor;
	
	public void startUp() throws ClassNotFoundException {
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
		adminService.setGlobalProperty(ICareConfig.REGISTRATION_ENCOUNTER_ROLE, "a0b03050-c99b-11e0-9572-0800200c9a66");
		adminService.setGlobalProperty(ICareConfig.INSURANCE_REFERRAL_NUMBER, "298b75eb-5555-12e8-9c7c-42b0yt63cf11");
		adminService.setGlobalProperty(NHIFConfig.FACILITY_CODE, "01099");
		adminService.setGlobalProperty(NHIFConfig.SERVER, "http://196.13.105.15");
		adminService.setGlobalProperty(NHIFConfig.USERNAME, "integrationuser");
		adminService.setGlobalProperty(NHIFConfig.PASSWORD, "nhif@2018");
		
		this.initiateVisitAdvice();
		this.initiateOrderAdvice();
		this.initiateVisitDiagnosisAdvice();
	}
	
	public Visit getVisit(Patient patient) {
		//Given
		VisitService visitService = Context.getService(VisitService.class);
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
	
	private void initiateVisitDiagnosisAdvice() throws ClassNotFoundException {
		Class<?> cls = Context.loadClass("org.openmrs.api.DiagnosisService");
		Class<?> adviceClass = Context.loadClass("org.openmrs.module.icare.core.aop.VisitDiagnosisAdvisor");
		AdvicePoint advice = new AdvicePoint("org.openmrs.api.DiagnosisService", adviceClass);
		visitDiagnosisAdvisor = (VisitDiagnosisAdvisor) advice.getClassInstance();
		Context.addAdvisor(cls, visitDiagnosisAdvisor);
	}
	
	public void shutDownVisitAdvice() throws ClassNotFoundException {
		Class<?> cls = Context.loadClass("org.openmrs.api.VisitService");
		Context.removeAdvisor(cls, billingAdvisor);
	}
	
	public void shutDownOrderAdvice() throws ClassNotFoundException {
		Class<?> cls = Context.loadClass("org.openmrs.api.OrderService");
		Context.removeAdvisor(cls, orderAdvisor);
	}
	
	public void shutDown() throws ClassNotFoundException {
		this.shutDownVisitAdvice();
		this.shutDownOrderAdvice();
	}
	
	protected Visit createVisit(Patient patient) throws VisitInvalidException, ConfigurationException {
		patient.setDateCreated(new Date());
		//Context.getPatientService().savePatient(patient);
		return createVisit(patient, "e7jnec30-5344-11e8-ie7c-40b6etw3cfee");
	}
	
	protected Visit createVisit(Patient patient, String paymentTypeUuid) throws VisitInvalidException,
	        ConfigurationException {
		VisitService visitService = Context.getService(VisitService.class);
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
		paymentTypeVisitAttribute.setValue(paymentTypeUuid);
		visit.addAttribute(paymentTypeVisitAttribute);
		
		visitService.saveVisit(visit);
		return visit;
	}
	
	protected Visit createVisitInsurance(Patient patient) throws VisitInvalidException, ConfigurationException {
		VisitService visitService = Context.getService(VisitService.class);
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
		paymentTypeVisitAttribute.setValue("e721ec30-mfy4-11e8-ie7c-40b6etw379ee");
		visit.addAttribute(paymentTypeVisitAttribute);
		
		//Setting Insurance visit attribute
		VisitAttribute insuranceVisitAttribute = new VisitAttribute();
		insuranceVisitAttribute.setAttributeType(visitService
		        .getVisitAttributeTypeByUuid("298b75eb-er45-12e8-9c7c-40b1yt63cfee"));
		insuranceVisitAttribute.setValue("NHIF");
		visit.addAttribute(insuranceVisitAttribute);
		
		//Setting Insurance ID visit attribute
		VisitAttribute insuranceIDVisitAttribute = new VisitAttribute();
		insuranceIDVisitAttribute.setAttributeType(visitService
		        .getVisitAttributeTypeByUuid("298b75eb-er45-12e8-9c7c-42b0yt63cfee"));
		insuranceIDVisitAttribute.setValue("02-nhif241");
		visit.addAttribute(insuranceIDVisitAttribute);
		
		visitService.saveVisit(visit);
		return visit;
	}
	
	public Map<String, Object> getResourceDTOMap(String file) throws IOException {
		String data = this.readFile("dto/" + file + ".json");
		return new ObjectMapper().readValue(data, HashMap.class);
	}
	
	protected String readFile(String file) throws IOException {
		URL url = this.getClass().getClassLoader().getResource(file);
		BufferedReader br = new BufferedReader(new FileReader(url.getPath()));
		StringBuilder sb = new StringBuilder();
		String line = br.readLine();
		
		while (line != null) {
			sb.append(line);
			sb.append(System.lineSeparator());
			line = br.readLine();
		}
		return sb.toString();
	}
	
	@Override
	@Ignore
	public void shouldGetAll() {
		
	}
	
	@Override
	@Ignore
	public void shouldGetRefByUuid() throws Exception {
	}
	
	@Override
	@Ignore
	public void shouldGetDefaultByUuid() {
		
	}
	
	@Override
	@Ignore
	public void shouldGetFullByUuid() {
		
	}
	
	@Override
	public long getAllCount() {
		return 4;
	}
	
	@Override
	public String getURI() {
		return null;
	}
	
	@Override
	public String getUuid() {
		return null;
	}
}
