package org.openmrs.module.icare.billing.models;

import org.apache.commons.lang3.StringUtils;
import org.codehaus.jackson.annotate.JsonIgnore;
import org.openmrs.*;
import org.openmrs.api.ProviderService;
import org.openmrs.api.context.Context;
import org.openmrs.module.icare.ICareConfig;
import org.openmrs.module.icare.billing.services.BillingService;
import org.openmrs.module.icare.core.PrescriptionDosingInstruction;
import org.openmrs.module.icare.core.utils.StaticHelper;
import org.openmrs.module.icare.store.models.OrderStatus;
import org.openmrs.module.icare.store.services.StoreService;
import org.openmrs.util.OpenmrsUtil;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.*;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

//@Entity
//@Transactional
//@Table(name = "prescription")
//@PrimaryKeyJoinColumn(name = "orderId")
public class Prescription extends Order {
	
	public static final long serialVersionUID = 7231L;
	
	private Double dose;
	
	private Concept doseUnits;
	
	private OrderFrequency frequency;
	
	private Double quantity;
	
	private Concept quantityUnits;
	
	private Drug drug;
	
	private Integer duration;
	
	private Concept durationUnits;
	
	private Concept route;
	
	private InvoiceItem invoiceItem;
	
	public Prescription() {
	}
	
	public Prescription(Integer orderId) {
		this.setOrderId(orderId);
	}
	
	public boolean isPrescription() {
		return true;
	}
	
	public Concept getDoseUnits() {
		return this.doseUnits;
	}
	
	public void setDoseUnits(Concept doseUnits) {
		this.doseUnits = doseUnits;
	}
	
	public OrderFrequency getFrequency() {
		return this.frequency;
	}
	
	public void setFrequency(OrderFrequency frequency) {
		this.frequency = frequency;
	}
	
	public Double getQuantity() {
		return this.quantity;
	}
	
	public void setQuantity(Double quantity) {
		this.quantity = quantity;
	}
	
	public Concept getQuantityUnits() {
		return this.quantityUnits;
	}
	
	public void setQuantityUnits(Concept quantityUnits) {
		this.quantityUnits = quantityUnits;
	}
	
	public Drug getDrug() {
		return this.drug;
	}
	
	public void setDrug(Drug drug) {
		this.drug = drug;
		if (drug != null && this.getConcept() == null) {
			this.setConcept(drug.getConcept());
		}
		
	}
	
	public Concept getRoute() {
		return this.route;
	}
	
	public void setRoute(Concept route) {
		this.route = route;
	}
	
	public void setDose(Double dose) {
		this.dose = dose;
	}
	
	public Double getDose() {
		return this.dose;
	}
	
	public Integer getDuration() {
		return this.duration;
	}
	
	public void setDuration(Integer duration) {
		this.duration = duration;
	}
	
	public Concept getDurationUnits() {
		return this.durationUnits;
	}
	
	public void setDurationUnits(Concept durationUnits) {
		this.durationUnits = durationUnits;
	}
	
	//	public String toString() {
	//		String prefix = Order.Action.DISCONTINUE == this.getAction() ? "DC " : "";
	//		return prefix + "Prescription(ID:" + this.getId() + "|" + this.getDose() + this.getDoseUnits() + " of "
	//		        + (this.getDrug() != null ? this.getDrug().getName() : "[no drug]") + " from " + this.getDateActivated()
	//		        + " to " + (this.isDiscontinuedRightNow() ? this.getDateStopped() : this.getAutoExpireDate()) + ")";
	//	}
	
	public void setDosing(PrescriptionDosingInstruction di) {
		di.setDosingInstructions(this);
	}
	
	public Map<String, Object> toMap() {
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("uuid", this.getUuid());
		result.put("quantity", this.getQuantity());
		result.put("instructions", this.getInstructions());
		BillingService billingService = Context.getService(BillingService.class);
		InvoiceItem invoiceItem = billingService.getInvoiceItemByOrder(this);
		if(invoiceItem != null){
			result.put("invoiceItem", invoiceItem.toMap());
		}else{
			result.put("invoiceItem", null);
		}

		Map<String,Object> encounterMap = new HashMap<>();
		encounterMap.put("uuid",this.getEncounter().getUuid());
		result.put("encounter", encounterMap);

		Map<String,Object> drugMap = new HashMap<>();
		drugMap.put("uuid",this.getDrug().getUuid());
		drugMap.put("display",this.getDrug().getDisplayName());
		Map<String, Object> drugConceptMap = new HashMap<>();
		drugConceptMap.put("uuid", this.getDrug().getConcept().getUuid());
		drugConceptMap.put("display", this.getDrug().getConcept().getDisplayString());
		drugMap.put("concept", drugConceptMap);
		result.put("drug", drugMap);

		Map<String,Object> orderTypeMap = new HashMap<>();
		orderTypeMap.put("uuid",this.getOrderType().getUuid());
		orderTypeMap.put("display",this.getOrderType().getName());
		result.put("orderType", orderTypeMap);

		Map<String,Object> ordererMap = new HashMap<>();
		ordererMap.put("uuid",this.getOrderer().getUuid());
		ordererMap.put("display",this.getOrderer().getName());
		result.put("orderer", ordererMap);

		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ");
		result.put("dateActivated", dateFormat.format(this.getDateActivated()));

		StoreService storeService = Context.getService(StoreService.class);
		List<OrderStatus> orderStatuses = storeService.getOrderStatusByOrderUuid(this.getUuid());
		List<Map<String,Object>> orderStatusesMap = new ArrayList<>();
		for(OrderStatus orderStatus:orderStatuses){
			Map<String,Object> orderStatusMap = new HashMap<>();
			orderStatusMap.put("uuid",orderStatus.getUuid());
			orderStatusMap.put("status",orderStatus.getStatus());
			orderStatusMap.put("remarks",orderStatus.getRemarks());
			orderStatusesMap.add(orderStatusMap);
		}
		result.put("statuses", orderStatusesMap);

		if (this.getDose() != null) {
			result.put("dose", this.getDose().floatValue());
		}

		if (this.getDuration() != null) {
			result.put("duration", this.getDuration().floatValue());
		}

		Map<String, Object> durationUnits = new HashMap<>();
		if (this.getDurationUnits() != null) {
			durationUnits.put("uuid", this.getDurationUnits().getUuid());
			durationUnits.put("display", this.getDurationUnits().getDisplayString());
			if (this.getDurationUnits().getConceptMappings().size() > 0) {
				// Get mapping source for referencing the equivalency
				String conceptSourceUuid = Context.getAdministrationService().getGlobalProperty(ICareConfig.DRUG_DURATION_UNITS_EQUIVALENCE_CONCEPT_SOURCE);
				for (ConceptMap conceptMap: this.getDurationUnits().getConceptMappings()) {
					if (conceptMap.getConceptReferenceTerm().getConceptSource().getUuid().toString().equals(conceptSourceUuid)) {
						durationUnits.put("secondsPerUnitEquivalence", conceptMap.getConceptReferenceTerm().getCode());
					}
				}
			}
		}
		result.put("durationUnits", durationUnits);

		Map<String, Object> frequency = new HashMap<>();
		if (this.getFrequency() != null) {
			frequency.put("uuid", this.getFrequency().getUuid());
			frequency.put("display", this.getFrequency().getName().toString());
			if (this.getFrequency().getConcept().getConceptMappings().size() > 0) {
				// Get mapping source for referencing the equivalency
				String conceptSourceUuid = Context.getAdministrationService().getGlobalProperty(ICareConfig.DRUG_FREQUENCY_EQUIVALENCE_CONCEPT_SOURCE);
				for (ConceptMap conceptMap: this.getFrequency().getConcept().getConceptMappings()) {
					if (conceptMap.getConceptReferenceTerm().getConceptSource().getUuid().toString().equals(conceptSourceUuid)) {
						frequency.put("daysPerUnitEquivalence", conceptMap.getConceptReferenceTerm().getCode());
					}
				}
			}
		}
		result.put("frequency", frequency);

		Map<String, Object> previousOrder = new HashMap<>();
		if (this.getPreviousOrder() != null) {
			previousOrder.put("uuid", this.getPreviousOrder().getUuid());
			if (this.getPreviousOrder().getInstructions() != null) {
				previousOrder.put("instructions", this.getPreviousOrder().getInstructions().toString());
			}
		}
		result.put("previousOrder", previousOrder);
		return result;
	}
	
	public Prescription cloneForRevision() {
		return this.cloneForRevisionHelper(new Prescription());
	}
	
	protected Prescription cloneForRevisionHelper(Prescription target) {
		super.cloneForRevisionHelper(target);
		target.setDose(this.getDose());
		target.setDoseUnits(this.getDoseUnits());
		target.setFrequency(this.getFrequency());
		target.setQuantity(this.getQuantity());
		target.setQuantityUnits(this.getQuantityUnits());
		target.setDrug(this.getDrug());
		target.setDuration(this.getDuration());
		target.setDurationUnits(this.getDurationUnits());
		target.setRoute(this.getRoute());
		return target;
	}
	
	public static Prescription fromMap(Map<String, Object> orderObject) {
		Prescription order = new Prescription();
		order.setUuid((String) orderObject.get("uuid"));
		order.setAction(Order.Action.valueOf((String) orderObject.get("action")));
		if (orderObject.get("urgency") != null) {
			order.setUrgency(Order.Urgency.valueOf((String) orderObject.get("urgency")));
		}
		if (orderObject.get("dose") != null) {
			order.setDose(Double.valueOf(orderObject.get("dose").toString()));
		}
		order.setInstructions((String) orderObject.get("instructions"));
		order.setQuantity(Double.valueOf(orderObject.get("quantity").toString()));
		
		Concept doseUnits = new Concept();
		doseUnits.setUuid(StaticHelper.getUuid(orderObject.get("doseUnits")));
		order.setDoseUnits(doseUnits);
		
		Concept route = new Concept();
		route.setUuid(StaticHelper.getUuid(orderObject.get("route")));
		order.setRoute(route);
		
		OrderFrequency frequency = new OrderFrequency();
		frequency.setUuid(StaticHelper.getUuid(orderObject.get("frequency")));
		order.setFrequency(frequency);
		
		Concept quantityUnits = new Concept();
		quantityUnits.setUuid(StaticHelper.getUuid(orderObject.get("quantityUnits")));
		order.setQuantityUnits(quantityUnits);
		
		Concept durationUnits = new Concept();
		durationUnits.setUuid(StaticHelper.getUuid(orderObject.get("durationUnits")));
		order.setDurationUnits(durationUnits);
		
		Drug drug = new Drug();
		drug.setUuid((String) orderObject.get("drug"));
		order.setDrug(drug);
		
		Patient patient = new Patient();
		patient.setUuid((String) orderObject.get("patient"));
		order.setPatient(patient);
		
		Provider provider = new Provider();
		provider.setUuid((String) orderObject.get("orderer"));
		order.setOrderer(provider);
		
		Concept concept = new Concept();
		concept.setUuid((String) orderObject.get("concept"));
		order.setConcept(concept);
		CareSetting careSetting = new CareSetting();
		careSetting.setCareSettingId(1);
		order.setCareSetting(careSetting);
		
		Encounter encounter = new Encounter();
		encounter.setPatient(patient);
		encounter.setUuid((String) orderObject.get("encounter"));
		order.setEncounter(encounter);
		return order;
	}
	
	@Override
	public int hashCode() {
		return Objects.hash(this.toString());
	}
	
	public void updatePrescription(Prescription prescription) {
		this.setUrgency(prescription.getUrgency());
		this.setDuration(prescription.getDuration());
		this.setDose(prescription.getDose());
		this.setDurationUnits(prescription.getDurationUnits());
		this.setDoseUnits(prescription.getDoseUnits());
		this.setDrug(prescription.getDrug());
		this.setFrequency(prescription.getFrequency());
		this.setQuantity(prescription.getQuantity());
		this.setQuantityUnits(prescription.getQuantityUnits());
		this.setRoute(prescription.getRoute());
	}
	
	public InvoiceItem getInvoiceItem() {
		return invoiceItem;
	}
	
	public void setInvoiceItem(InvoiceItem invoiceItem) {
		this.invoiceItem = invoiceItem;
	}
}
