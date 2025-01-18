package org.openmrs.module.icare.billing.aop;

import org.aopalliance.aop.Advice;
import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.Concept;
import org.openmrs.Visit;
import org.openmrs.VisitAttribute;
import org.openmrs.VisitAttributeType;
import org.openmrs.api.AdministrationService;
import org.openmrs.api.ConceptService;
import org.openmrs.api.VisitService;
import org.openmrs.api.context.Context;
import org.openmrs.attribute.AttributeType;
import org.openmrs.module.icare.ICareConfig;
import org.openmrs.module.icare.billing.VisitInvalidException;
import org.openmrs.module.icare.billing.services.insurance.InsuranceService;
import org.openmrs.module.icare.billing.services.insurance.jubilee.JubileeInsuranceImpl;
import org.openmrs.module.icare.billing.services.insurance.nhif.NHIFServiceImpl;
import org.openmrs.module.icare.billing.services.insurance.startegies.StrategiesInsuranceImpl;
import org.springframework.aop.Advisor;
import org.springframework.aop.support.StaticMethodMatcherPointcutAdvisor;

import javax.naming.ConfigurationException;
import java.lang.reflect.Method;
import java.util.List;

public class VisitEndAdvisor extends StaticMethodMatcherPointcutAdvisor implements Advisor {
	
	protected final Log log = LogFactory.getLog(getClass());
	
	@Override
	public boolean matches(Method method, Class<?> targetClass) {
		log.info("ICareAdvice Matching:" + method.getName());
		if (method.getName().equals("endVisit"))
			return true;
		return false;
	}
	
	@Override
	public Advice getAdvice() {
		return new VisitEndAdvisor.VisitEndAdvice();
	}
	
	private class VisitEndAdvice implements MethodInterceptor {
		
		public Object invoke(MethodInvocation invocation) throws Throwable {
			Visit visit = (Visit) invocation.proceed();
			String insurance = null;
			String paymentType = null;
			AdministrationService adminService = Context.getService(AdministrationService.class);
			String insuranceAttributeUuid = adminService.getGlobalProperty(ICareConfig.INSURANCE_ATTRIBUTE);
			if (insuranceAttributeUuid == null) {
				throw new ConfigurationException("Attribute ID for Insurance Attribute is not set. Please set '"
				        + ICareConfig.INSURANCE_ATTRIBUTE + "'");
			}
			String insuranceIDAttributeUuid = adminService.getGlobalProperty(ICareConfig.INSURANCE_ID_ATTRIBUTE);
			if (insuranceIDAttributeUuid == null) {
				throw new ConfigurationException("Attribute ID for Insurance Attribute ID is not set. Please set '"
				        + ICareConfig.INSURANCE_ID_ATTRIBUTE + "'");
			}
			
			String paymentTypeAttribute = adminService.getGlobalProperty(ICareConfig.PAYMENT_TYPE_ATTRIBUTE);
			if (paymentTypeAttribute == null) {
				throw new ConfigurationException("Attribute ID for billing is not set. Please set '"
				        + ICareConfig.PAYMENT_TYPE_ATTRIBUTE + "'");
			}
			VisitService visitService = Context.getService(VisitService.class);
			List<VisitAttributeType> visitAttributeTypes = visitService.getAllVisitAttributeTypes();
			for (VisitAttribute attribute : visit.getAttributes()) {
				AttributeType attributeType = attribute.getAttributeType();
				for (VisitAttributeType visitAttributeType : visitAttributeTypes) {
					if (visitAttributeType.getUuid().equals(attributeType.getUuid())) {
						if (visitAttributeType.getUuid().equals(insuranceAttributeUuid)) { //CASH OR Insurance
							insurance = (String) attribute.getValue();
						} else if (visitAttributeType.getUuid().equals(paymentTypeAttribute)) { //CASH OR Insurance
							paymentType = (String) attribute.getValue();
						}
					}
				}
			}
			if (insurance != null) {
				ConceptService conceptService = Context.getService(ConceptService.class);
				Concept paymentTypeConcept = conceptService.getConceptByUuid(paymentType);
				
				if (paymentTypeConcept.getName().getName().toLowerCase().equals("insurance")) {
					InsuranceService insuranceService = null;
					Concept insuranceConcept = conceptService.getConceptByUuid(insurance);
					if (insuranceConcept == null) {
						throw new VisitInvalidException("Insurance Concept '" + insurance.toString() + "' does not exist.");
					}
					insuranceService = InsuranceService.getInsuranceInstance(insuranceConcept.getName().toString());
					/*if (insuranceConcept.getName().toString().toLowerCase().equals("nhif")) {
						insuranceService = new NHIFServiceImpl();
						
					} else if (insuranceConcept.getName().toString().toLowerCase().equals("jubilee")) {
						insuranceService = new JubileeInsuranceImpl();
						
					} else if (insuranceConcept.getName().toString().toLowerCase().equals("stratergies")) {
						insuranceService = new StrategiesInsuranceImpl();
					} else {
						
						throw new VisitInvalidException("Insurance '" + insurance.toString() + "' has not been implemented.");
					}*/
					
					paymentTypeConcept = conceptService.getConceptByName(insuranceConcept.getName().toString());
					if (paymentTypeConcept == null) {
						throw new VisitInvalidException("Payment Type concept is not valid. Check the UUID '" + paymentType
						        + "'.");
					}
					insuranceService.claim(visit);
				}
			}
			return invocation.proceed();
		}
	}
}
