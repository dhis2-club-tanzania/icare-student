package org.openmrs.module.icare.billing;

import org.openmrs.Concept;
import org.openmrs.EncounterType;
import org.openmrs.OrderType;
import org.openmrs.module.icare.billing.models.ItemPrice;

public class VisitMetaData {
	
	private EncounterType registrationEncounterType;
	
	private Concept paymentScheme;
	
	private Concept paymentType;
	
	private Concept registrationFeeConcept;
	
	private OrderType billingOrderType;
	
	private Concept serviceConcept;
	
	private ItemPrice registrationItemPrice;
	
	private ItemPrice serviceItemPrice;
	
	private OrderType consultationOrderType;
	
	public EncounterType getRegistrationEncounterType() {
		return registrationEncounterType;
	}
	
	public void setRegistrationEncounterType(EncounterType registrationEncounterType) {
		this.registrationEncounterType = registrationEncounterType;
	}
	
	public OrderType getBillingOrderType() {
		return billingOrderType;
	}
	
	public void setBillingOrderType(OrderType billingOrderType) {
		this.billingOrderType = billingOrderType;
	}
	
	public OrderType getConsultationOrderType() {
		return consultationOrderType;
	}
	
	public void setConsultationOrderType(OrderType consultationOrderType) {
		this.consultationOrderType = consultationOrderType;
	}
	
	public Concept getPaymentScheme() {
		return paymentScheme;
	}
	
	public void setPaymentScheme(Concept paymentScheme) {
		this.paymentScheme = paymentScheme;
	}
	
	public Concept getPaymentType() {
		return paymentType;
	}
	
	public void setPaymentType(Concept paymentType) {
		this.paymentType = paymentType;
	}
	
	public Concept getRegistrationFeeConcept() {
		return registrationFeeConcept;
	}
	
	public void setRegistrationFeeConcept(Concept registrationFeeConcept) {
		this.registrationFeeConcept = registrationFeeConcept;
	}
	
	public Concept getServiceConcept() {
		return serviceConcept;
	}
	
	public void setServiceConcept(Concept serviceConcept) {
		this.serviceConcept = serviceConcept;
	}
	
	public ItemPrice getRegistrationItemPrice() {
		return registrationItemPrice;
	}
	
	public void setRegistrationItemPrice(ItemPrice registrationItemPrice) {
		this.registrationItemPrice = registrationItemPrice;
	}
	
	public ItemPrice getServiceItemPrice() {
		return serviceItemPrice;
	}
	
	public void setServiceItemPrice(ItemPrice serviceItemPrice) {
		this.serviceItemPrice = serviceItemPrice;
	}
}
