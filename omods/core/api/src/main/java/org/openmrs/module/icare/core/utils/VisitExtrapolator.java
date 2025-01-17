package org.openmrs.module.icare.core.utils;

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
import org.openmrs.module.icare.billing.VisitMetaData;

import javax.naming.ConfigurationException;
import java.util.Collection;
import java.util.List;

public class VisitExtrapolator {
	
	public static VisitMetaData extrapolateMetaData(Visit visit) throws Exception {
		VisitMetaData visitMetaData = new VisitMetaData();
		AdministrationService adminService = Context.getService(AdministrationService.class);
		String serviceAttribute = adminService.getGlobalProperty(ICareConfig.SERVICE_ATTRIBUTE);
		if (serviceAttribute == null) {
			throw new ConfigurationException("Attribute ID for billing is not set. Please set '"
			        + ICareConfig.SERVICE_ATTRIBUTE + "'");
		}
		String paymentSchemeAttribute = adminService.getGlobalProperty(ICareConfig.PAYMENT_SCHEME_ATTRIBUTE);
		if (paymentSchemeAttribute == null) {
			throw new ConfigurationException("Attribute ID for billing is not set. Please set '"
			        + ICareConfig.PAYMENT_SCHEME_ATTRIBUTE + "'");
		}
		String paymentTypeAttribute = adminService.getGlobalProperty(ICareConfig.PAYMENT_TYPE_ATTRIBUTE);
		if (paymentTypeAttribute == null) {
			throw new ConfigurationException("Attribute ID for billing is not set. Please set '"
			        + ICareConfig.PAYMENT_TYPE_ATTRIBUTE + "'");
		}
		String registrationEncounterType = adminService.getGlobalProperty(ICareConfig.REGISTRATION_ENCOUNTER_TYPE);
		if (registrationEncounterType == null) {
			throw new ConfigurationException("Attribute ID for billing is not set. Please set '"
			        + ICareConfig.REGISTRATION_ENCOUNTER_TYPE + "'");
		}
		String registrationFeeConcept = adminService.getGlobalProperty(ICareConfig.REGISTRATION_FEE_CONCEPT);
		if (registrationFeeConcept == null) {
			throw new ConfigurationException("Attribute ID for registration is not set. Please set '"
			        + ICareConfig.REGISTRATION_FEE_CONCEPT + "'");
		}
		String billingOrderTypeUuid = adminService.getGlobalProperty(ICareConfig.BILLING_ORDER_TYPE);
		if (billingOrderTypeUuid == null) {
			throw new ConfigurationException("Attribute ID for billing order type is not set. Please set '"
			        + ICareConfig.BILLING_ORDER_TYPE + "'");
		}
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
		
		//Extract service, payment type and payment scheme attributes
		Collection<VisitAttribute> attributes = visit.getAttributes();
		String serviceConceptUuidForVisit = null;
		String paymentScheme = null;
		String paymentType = null;
		String insurance = null;
		String insuranceId = null;
		VisitService visitService = Context.getService(VisitService.class);
		List<VisitAttributeType> visitAttributeTypes = visitService.getAllVisitAttributeTypes();
		for (VisitAttribute attribute : attributes) {
			AttributeType attributeType = attribute.getAttributeType();
			for (VisitAttributeType visitAttributeType : visitAttributeTypes) {
				if (visitAttributeType.getUuid().equals(attributeType.getUuid())) {
					if (visitAttributeType.getUuid().equals(serviceAttribute)) {
						serviceConceptUuidForVisit = (String) attribute.getValue();
					} else if (visitAttributeType.getUuid().equals(paymentSchemeAttribute)) { //
						paymentScheme = (String) attribute.getValue();
					} else if (visitAttributeType.getUuid().equals(paymentTypeAttribute)) { //CASH OR Insurance
						paymentType = (String) attribute.getValue();
					} else if (visitAttributeType.getUuid().equals(insuranceAttributeUuid)) { //CASH OR Insurance
						insurance = (String) attribute.getValue();
					} else if (visitAttributeType.getUuid().equals(insuranceIDAttributeUuid)) { //CASH OR Insurance
						insuranceId = (String) attribute.getValue();
					}
				}
			}
			
		}
		//Validate the visit with required attributes
		if (serviceConceptUuidForVisit == null) {
			throw new VisitInvalidException("Service has not been specified in the visit");
		}
		if (paymentType == null) {
			throw new VisitInvalidException("Payment Type has not been specified in the visit");
		}
		ConceptService conceptService = Context.getService(ConceptService.class);
		Concept serviceConcept = conceptService.getConceptByUuid(serviceConceptUuidForVisit);
		if (serviceConcept == null) {
			throw new VisitInvalidException("Service concept is not valid. Check the UUID '" + serviceConceptUuidForVisit
			        + "'.");
		}
		visitMetaData.setServiceConcept(serviceConcept);
		
		Concept paymentTypeConcept = conceptService.getConceptByUuid(paymentType);
		if (paymentTypeConcept == null) {
			throw new VisitInvalidException("Payment Type concept is not valid. Check the UUID '" + paymentType + "'.");
		}
		visitMetaData.setPaymentType(paymentTypeConcept);
		if (visitMetaData.getPaymentType().getName().getName().toLowerCase().equals("cash")) {
			if (paymentScheme == null) {
				throw new VisitInvalidException("Payment Schema has not been specified in the visit");
			}
			Concept paymentSchemeConcept = conceptService.getConceptByUuid(paymentScheme);
			if (paymentSchemeConcept == null) {
				throw new VisitInvalidException("Payment Schema concept is not valid. Check the UUID '" + paymentScheme
				        + "'.");
			}
			visitMetaData.setPaymentScheme(paymentSchemeConcept);
		} else if (visitMetaData.getPaymentType().getName().getName().toLowerCase().equals("insurance")) {
			//TODO Create logic for insurance
			if (insurance == null) {
				throw new VisitInvalidException("Insurance has not been specified in the visit");
			}
			if (insuranceId == null) {
				throw new VisitInvalidException("Insurance ID has not been specified in the visit");
			}
			paymentTypeConcept = conceptService.getConceptByUuid(insurance);
			if (paymentTypeConcept == null) {
				throw new VisitInvalidException("Payment Type concept is not valid. Check the UUID '" + paymentType + "'.");
			}
			visitMetaData.setPaymentType(paymentTypeConcept);
			
			AdministrationService administrationService = Context.getAdministrationService();
			String insuranceAuthorizationAttribute = administrationService
			        .getGlobalProperty(ICareConfig.INSURANCE_AUTHORIZATION_ATTRIBUTE);
			if (insuranceAuthorizationAttribute == null) {
				throw new VisitInvalidException("Insurance Authorization attribute not set. Pleas ensure '"
				        + ICareConfig.INSURANCE_AUTHORIZATION_ATTRIBUTE + "' is set.");
			}
			if (paymentScheme == null) {
				throw new VisitInvalidException("Payment Schema has not been specified in the visit");
			}
			Concept paymentSchemeConcept = conceptService.getConceptByUuid(paymentScheme);
			if (paymentSchemeConcept == null) {
				throw new VisitInvalidException("Payment Schema concept is not valid. Check the UUID '" + paymentScheme
				        + "'.");
			}
			visitMetaData.setPaymentScheme(paymentSchemeConcept);
		}
		return visitMetaData;
	}
}
