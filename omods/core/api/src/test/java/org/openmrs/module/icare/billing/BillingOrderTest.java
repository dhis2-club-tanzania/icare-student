package org.openmrs.module.icare.billing;

import org.junit.After;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.openmrs.*;
import org.openmrs.api.*;
import org.openmrs.api.context.Context;
import org.openmrs.module.AdvicePoint;
import org.openmrs.module.icare.ICareConfig;
import org.openmrs.module.icare.billing.aop.OrderBillAdvisor;
import org.openmrs.module.icare.billing.models.BedOrder;
import org.openmrs.module.icare.billing.models.Invoice;
import org.openmrs.module.icare.billing.services.BillingService;
import org.openmrs.module.icare.core.ICareService;

import java.util.Date;
import java.util.List;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class BillingOrderTest extends BillingTestBase {
	
	OrderBillAdvisor orderAdvisor;
	
	@Before
	public void setUp() throws Exception {
		super.initTestData();
		
		Class<?> cls = Context.loadClass("org.openmrs.api.OrderService");
		Class<?> adviceClass = Context.loadClass("org.openmrs.module.icare.billing.aop.OrderBillAdvisor");
		AdvicePoint advice = new AdvicePoint("org.openmrs.api.Orderervice", adviceClass);
		orderAdvisor = (OrderBillAdvisor) advice.getClassInstance();
		Context.addAdvisor(cls, orderAdvisor);
	}
	
	@After
	public void tearDown() throws Exception {
		Class<?> cls = Context.loadClass("org.openmrs.api.OrderService");
		Context.removeAdvisor(cls, orderAdvisor);
	}
	
	@Test
	public void testLabOrder() {
		//Given there is an order to be created
		
		BillingService billingService = Context.getService(BillingService.class);
		VisitService visitService = Context.getService(VisitService.class);
		
		PatientService patientService = Context.getService(PatientService.class);
		ConceptService conceptService = Context.getService(ConceptService.class);
		OrderService orderService = Context.getService(OrderService.class);
		ProviderService providerService = Context.getService(ProviderService.class);
		EncounterService encounterService = Context.getService(EncounterService.class);
		
		TestOrder testOrder = new TestOrder();
		testOrder.setCareSetting(orderService.getCareSettingByName("Inpatient"));
		testOrder.setConcept(conceptService.getConceptByUuid("e721ec30-mfy4-11e8-ie7c-40b69mdy79ee"));
		
		Encounter previousEncounter = encounterService.getEncounterByUuid("333395c-dd07-488d-8fd7-a748c9570000");
		Encounter testEncounter = new Encounter();
		testEncounter.setEncounterType(previousEncounter.getEncounterType());
		testEncounter.setPatient(previousEncounter.getVisit().getPatient());
		testEncounter.setEncounterDatetime(new Date());
		testEncounter.setVisit(previousEncounter.getVisit());
		encounterService.saveEncounter(testEncounter);
		
		testOrder.setEncounter(testEncounter);
		testOrder.setPatient(testEncounter.getVisit().getPatient());
		testOrder.setOrderer(providerService.getProviderByUuid("1a61a0b5-d271-4b00-a803-5cef8b06ba8f"));
		
		OrderContext orderContext = new OrderContext();
		
		//When the order is saved
		Order order = orderService.saveOrder(testOrder, orderContext);
		
		//Then ensure that the order is created and an invoice with the related item is created
		Order createdOrders = orderService.getOrderByUuid(order.getUuid());
		
		List<Invoice> patientInvoices = billingService.getPatientsInvoices(testEncounter.getVisit().getPatient().getUuid());
		assertThat("List of invoices must be greater than 0", patientInvoices.size(), is(1));
		
		assertThat("Invoice should have 1 item", patientInvoices.get(0).getInvoiceItems().size(), is(1));
		
	}
	
	@Test
	public void testDiscontinuedLabOrder() {
		//Given there is an order to be created
		
		BillingService billingService = Context.getService(BillingService.class);
		VisitService visitService = Context.getService(VisitService.class);
		
		PatientService patientService = Context.getService(PatientService.class);
		ConceptService conceptService = Context.getService(ConceptService.class);
		OrderService orderService = Context.getService(OrderService.class);
		ProviderService providerService = Context.getService(ProviderService.class);
		EncounterService encounterService = Context.getService(EncounterService.class);
		
		TestOrder testOrder = new TestOrder();
		testOrder.setCareSetting(orderService.getCareSettingByName("Inpatient"));
		testOrder.setConcept(conceptService.getConceptByUuid("e721ec30-mfy4-11e8-ie7c-40b69mdy79ee"));
		
		Encounter previousEncounter = encounterService.getEncounterByUuid("333395c-dd07-488d-8fd7-a748c9570000");
		Encounter testEncounter = new Encounter();
		testEncounter.setEncounterType(previousEncounter.getEncounterType());
		testEncounter.setPatient(previousEncounter.getVisit().getPatient());
		testEncounter.setEncounterDatetime(new Date());
		testEncounter.setVisit(previousEncounter.getVisit());
		encounterService.saveEncounter(testEncounter);
		
		testOrder.setEncounter(testEncounter);
		testOrder.setOrderer(providerService.getProviderByUuid("1a61a0b5-d271-4b00-a803-5cef8b06ba8f"));
		testOrder.setPatient(previousEncounter.getVisit().getPatient());
		
		OrderContext orderContext = new OrderContext();
		Order order = orderService.saveOrder(testOrder, orderContext);
		
		//When the order is saved
		Order createdOrder = orderService.getOrderByUuid(order.getUuid());
		//orderService.voidOrder(createdOrder, "Deleted");
		//orderService.saveOrder(createdOrder, orderContext);
		orderService.purgeOrder(createdOrder);
		
		//Then ensure that the order is created and an invoice with the related item is created
		
		List<Invoice> patientInvoices = billingService.getPatientsInvoices(previousEncounter.getVisit().getPatient()
		        .getUuid());
		
		assertThat("List of invoices must be greater than 0", patientInvoices.size(), is(1));
		
		assertThat("Invoice should have 1 item", patientInvoices.get(0).getInvoiceItems().size(), is(1));
		
	}
	
	@Test
	public void testDrugOrderFromDoctor() {
		
		BillingService billingService = Context.getService(BillingService.class);
		PatientService patientService = Context.getService(PatientService.class);
		ConceptService conceptService = Context.getService(ConceptService.class);
		OrderService orderService = Context.getService(OrderService.class);
		ProviderService providerService = Context.getService(ProviderService.class);
		EncounterService encounterService = Context.getService(EncounterService.class);
		
		DrugOrder drugOrder = new DrugOrder();
		drugOrder.setOrderType(orderService.getOrderTypeByName("Misc Order"));
		
		//drugOrder.setDoseUnits(conceptService.getConceptByUuid("2000ec30-6666-1558-1177-40b6etw333ee"));
		drugOrder.setDoseUnits(conceptService.getConceptByName("mg"));
		drugOrder.setDose(10.0);
		//drugOrder.setDuration(12);
		drugOrder.setQuantity(0.0);
		//drugOrder.setDurationUnits(orderService.getDurationUnits().get(0));//conceptService.getConceptByUuid("172aec30-5555-1558-1177-40b6etw333ee"));
		drugOrder.setRoute(orderService.getDrugRoutes().get(0));//conceptService.getConceptByUuid("3000ec30-5445-1558-1177-40b6etw333ee"));
		
		drugOrder.setPatient(patientService.getPatientByUuid("993c46d2-5007-45e8-9512-969300717761"));
		drugOrder.setCareSetting(orderService.getCareSettingByName("Inpatient"));
		drugOrder.setConcept(conceptService.getConceptByUuid("e721ec30-mfy4-11e8-ie7c-40b69mdy79ee"));
		drugOrder.setQuantityUnits(conceptService.getConceptByName("mg"));
		
		Encounter testEncounter = encounterService.getEncounterByUuid("333395c-dd07-488d-8fd7-a748c9570000");
		
		drugOrder.setEncounter(encounterService.getEncounterByUuid("333395c-dd07-488d-8fd7-a748c9570000"));
		drugOrder.setOrderer(providerService.getProviderByUuid("1a61a0b5-d271-4b00-a803-5cef8b06ba8f"));
		
		drugOrder.setFrequency(orderService.getOrderFrequencies(true).get(0));
		drugOrder.setBrandName("some drug brand");
		
		Order createdOrder = orderService.saveOrder(drugOrder, new OrderContext());
		
		List<Invoice> patientInvoices = billingService.getPatientsInvoices("993c46d2-5007-45e8-9512-969300717761");
		
		//	createdOrder
		
		assertThat("created order encounter uuid equal to passed encounter uuid", createdOrder.getEncounter().getUuid()
		        .equals("333395c-dd07-488d-8fd7-a748c9570000"));
		assertThat("List of orders must be equal to 0", patientInvoices.size(), is(0));
		
	}
	
	public DrugOrder createDrugOrder() {
		PatientService patientService = Context.getService(PatientService.class);
		ConceptService conceptService = Context.getService(ConceptService.class);
		OrderService orderService = Context.getService(OrderService.class);
		ProviderService providerService = Context.getService(ProviderService.class);
		EncounterService encounterService = Context.getService(EncounterService.class);
		
		DrugOrder drugOrderFromPharmacist = new DrugOrder();
		drugOrderFromPharmacist.setOrderType(orderService.getOrderTypeByName("Misc Order"));
		
		Drug drug = conceptService.getAllDrugs().get(1);
		
		drugOrderFromPharmacist.setDrug(drug);
		drugOrderFromPharmacist.setDoseUnits(conceptService.getConceptByName("mg"));
		drugOrderFromPharmacist.setDose(10.0);
		drugOrderFromPharmacist.setQuantity(5.0);
		drugOrderFromPharmacist.setRoute(orderService.getDrugRoutes().get(0));
		
		drugOrderFromPharmacist.setPatient(patientService.getPatientByUuid("993c46d2-5007-45e8-9512-969300717761"));
		drugOrderFromPharmacist.setCareSetting(orderService.getCareSettingByName("Inpatient"));
		drugOrderFromPharmacist.setConcept(conceptService.getConceptByName("ASPIRIN"));
		drugOrderFromPharmacist.setQuantityUnits(conceptService.getConceptByName("mg"));
		
		Encounter encounter = encounterService.getEncounterByUuid("333395c-dd07-488d-8fd7-a748c9570000");
		encounter.setLocation(Context.getLocationService().getAllLocations().get(0));
		drugOrderFromPharmacist.setEncounter(encounter);
		drugOrderFromPharmacist.setOrderer(providerService.getProviderByUuid("1a61a0b5-d271-4b00-a803-5cef8b06ba8f"));
		
		drugOrderFromPharmacist.setFrequency(orderService.getOrderFrequencies(true).get(0));
		drugOrderFromPharmacist.setBrandName("some drug brand");
		return drugOrderFromPharmacist;
	}
	
	@Test
	public void testDrugOrderFromPharmacist() {
		
		//Given
		String locations = "";
		for (Location location : Context.getLocationService().getAllLocations()) {
			if (!locations.equals("")) {
				locations += ",";
			}
			locations += location.getUuid();
		}
		AdministrationService administrationService = Context.getAdministrationService();
		administrationService.setGlobalProperty(ICareConfig.STOCK_LOCATIONS, locations);
		
		EncounterService encounterService = Context.getEncounterService();
		Encounter previousEncounter = encounterService.getEncounterByUuid("333395c-dd07-488d-8fd7-a748c9570000");
		Encounter testEncounter = new Encounter();
		testEncounter.setEncounterType(previousEncounter.getEncounterType());
		testEncounter.setPatient(previousEncounter.getVisit().getPatient());
		testEncounter.setLocation(Context.getLocationService().getAllLocations().get(0));
		testEncounter.setEncounterDatetime(new Date());
		testEncounter.setVisit(previousEncounter.getVisit());
		encounterService.saveEncounter(testEncounter);
		
		DrugOrder drugOrderFromPharmacist = createDrugOrder();
		drugOrderFromPharmacist.setEncounter(testEncounter);
		drugOrderFromPharmacist.setPatient(testEncounter.getPatient());
		//When
		OrderService orderService = Context.getService(OrderService.class);
		Order createdOrder = orderService.saveOrder(drugOrderFromPharmacist, new OrderContext());
		
		//Then
		BillingService billingService = Context.getService(BillingService.class);
		List<Invoice> patientInvoices = billingService.getPatientsInvoices(testEncounter.getPatient().getUuid());
		
		//	createdOrder
		assertThat("List of invoices for patient must be greater than 0", patientInvoices.size(), is(1));
		assertThat("Invoice should have 1 item", patientInvoices.get(0).getInvoiceItems().size(), is(1));
		assertThat("Drug quantity should be 5", patientInvoices.get(0).getInvoiceItems().get(0).getQuantity(), is(5.0));
		
	}
	
	public DrugOrder createDrugOrderFromDoctor() {
		PatientService patientService = Context.getService(PatientService.class);
		ConceptService conceptService = Context.getService(ConceptService.class);
		OrderService orderService = Context.getService(OrderService.class);
		ProviderService providerService = Context.getService(ProviderService.class);
		EncounterService encounterService = Context.getService(EncounterService.class);
		
		DrugOrder drugOrderFromPharmacist = new DrugOrder();
		drugOrderFromPharmacist.setOrderType(orderService.getOrderTypeByName("Misc Order"));
		
		drugOrderFromPharmacist.setDoseUnits(conceptService.getConceptByName("mg"));
		drugOrderFromPharmacist.setDose(10.0);
		
		drugOrderFromPharmacist.setRoute(orderService.getDrugRoutes().get(0));
		
		drugOrderFromPharmacist.setPatient(patientService.getPatientByUuid("993c46d2-5007-45e8-9512-969300717761"));
		drugOrderFromPharmacist.setCareSetting(orderService.getCareSettingByName("Inpatient"));
		drugOrderFromPharmacist.setConcept(conceptService.getConceptByName("ASPIRIN"));
		drugOrderFromPharmacist.setQuantityUnits(conceptService.getConceptByName("mg"));
		
		Encounter encounter = encounterService.getEncounterByUuid("333395c-dd07-488d-8fd7-a748c9570000");
		encounter.setLocation(Context.getLocationService().getAllLocations().get(0));
		drugOrderFromPharmacist.setEncounter(encounter);
		drugOrderFromPharmacist.setOrderer(providerService.getProviderByUuid("1a61a0b5-d271-4b00-a803-5cef8b06ba8f"));
		
		drugOrderFromPharmacist.setFrequency(orderService.getOrderFrequencies(true).get(0));
		drugOrderFromPharmacist.setBrandName("some drug brand");
		return drugOrderFromPharmacist;
	}
	
	@Test
	public void testDispensingDrugOrderFromPharmacist() {
		
		//Given
		String locations = "";
		LocationService locationService = Context.getLocationService();
		
		for (Location location : locationService.getAllLocations()) {
			if (!locations.equals("")) {
				locations += ",";
			}
			locations += location.getUuid();
		}
		AdministrationService administrationService = Context.getAdministrationService();
		administrationService.setGlobalProperty(ICareConfig.STOCK_LOCATIONS, locations);
		administrationService.setGlobalProperty(ICareConfig.ALLOW_NEGATIVE_STOCK, "true");
		
		EncounterService encounterService = Context.getEncounterService();
		Encounter previousEncounter = encounterService.getEncounterByUuid("333395c-dd07-488d-8fd7-a748c9570000");
		Encounter testEncounter = new Encounter();
		testEncounter.setEncounterType(previousEncounter.getEncounterType());
		testEncounter.setPatient(previousEncounter.getVisit().getPatient());
		testEncounter.setLocation(Context.getLocationService().getAllLocations().get(0));
		testEncounter.setEncounterDatetime(new Date());
		testEncounter.setVisit(previousEncounter.getVisit());
		encounterService.saveEncounter(testEncounter);
		
		DrugOrder drugOrderFromPharmacist = createDrugOrder();
		OrderService orderService = Context.getService(OrderService.class);
		drugOrderFromPharmacist.setEncounter(testEncounter);
		drugOrderFromPharmacist.setPatient(testEncounter.getPatient());
		DrugOrder createdOrder = (DrugOrder) orderService.saveOrder(drugOrderFromPharmacist, new OrderContext());
		DrugOrder newDrugOrder = createdOrder.cloneForRevision();
		//newDrugOrder.setQuantity(10.0);
		newDrugOrder.setAction(Order.Action.DISCONTINUE);
		newDrugOrder.setEncounter(createdOrder.getEncounter());
		newDrugOrder.setOrderer(createdOrder.getOrderer());
		newDrugOrder.setUuid(createdOrder.getUuid());
		
		//When
		newDrugOrder = (DrugOrder) orderService.saveOrder(newDrugOrder, new OrderContext());
		
		//Then
		BillingService billingService = Context.getService(BillingService.class);
		List<Invoice> patientInvoices = billingService.getPatientsInvoices(testEncounter.getPatient().getUuid());
		
		//	createdOrder
		assertThat("List of invoices for patient must be greater than 0", patientInvoices.size(), is(1));
		assertThat("Invoice should have 1 item", patientInvoices.get(0).getInvoiceItems().size(), is(1));
		assertThat("Drug quantity should be 5", patientInvoices.get(0).getInvoiceItems().get(0).getQuantity(), is(5.0));
		
	}
	
	@Test
	@Ignore("To be done with changing an order information")
	public void testUpdatingDrugOrderFromPharmacist() {
		
		//Given
		DrugOrder drugOrderFromPharmacist = createDrugOrder();
		OrderService orderService = Context.getService(OrderService.class);
		DrugOrder createdOrder = (DrugOrder) orderService.saveOrder(drugOrderFromPharmacist, new OrderContext());
		DrugOrder newDrugOrder = createdOrder.cloneForRevision();
		newDrugOrder.setQuantity(10.0);
		newDrugOrder.setAction(Order.Action.REVISE);
		newDrugOrder.setEncounter(createdOrder.getEncounter());
		newDrugOrder.setOrderer(createdOrder.getOrderer());
		newDrugOrder.setUuid(createdOrder.getUuid());
		
		//When
		newDrugOrder = (DrugOrder) orderService.saveOrder(newDrugOrder, new OrderContext());
		
		//Then
		BillingService billingService = Context.getService(BillingService.class);
		List<Invoice> patientInvoices = billingService.getPatientsInvoices("993c46d2-5007-45e8-9512-969300717761");
		
		//	createdOrder
		assertThat("List of invoices for patient must be greater than 0", patientInvoices.size(), is(1));
		assertThat("Invoice should have 1 item", patientInvoices.get(0).getInvoiceItems().size(), is(1));
		assertThat("Drug quantity should be 5", patientInvoices.get(0).getInvoiceItems().get(0).getQuantity(), is(5.0));
		
	}
	
	@Test
	@Ignore("TODO to be done on admission orders")
	public void testBedOrder() {
		//Given there is an order to be created
		
		BillingService billingService = Context.getService(BillingService.class);
		VisitService visitService = Context.getService(VisitService.class);
		
		PatientService patientService = Context.getService(PatientService.class);
		ConceptService conceptService = Context.getService(ConceptService.class);
		OrderService orderService = Context.getService(OrderService.class);
		ProviderService providerService = Context.getService(ProviderService.class);
		EncounterService encounterService = Context.getService(EncounterService.class);
		
		/*OrderType bedOrderType = new OrderType();
		bedOrderType.setJavaClassName("org.openmrs.module.icare.billing.models.BedOrder");
		bedOrderType.setName("Bed Order");
		Context.getOrderService().saveOrderType(bedOrderType);*/
		//bedOrderType.setParent();
		BedOrder bedOrder = new BedOrder();
		
		bedOrder.setOrderType(Context.getOrderService().getOrderTypeByName("Bed Order"));
		bedOrder.setPatient(patientService.getPatientByUuid("993c46d2-5007-45e8-9512-969300717761"));
		bedOrder.setCareSetting(orderService.getCareSettingByName("Inpatient"));
		bedOrder.setConcept(conceptService.getConceptByUuid("e721ec30-mfy4-11e8-ie7c-40b69mdy79ee"));
		
		Encounter testEncounter = encounterService.getEncounterByUuid("333395c-dd07-488d-8fd7-a748c9570000");
		
		bedOrder.setEncounter(encounterService.getEncounterByUuid("333395c-dd07-488d-8fd7-a748c9570000"));
		bedOrder.setOrderer(providerService.getProviderByUuid("1a61a0b5-d271-4b00-a803-5cef8b06ba8f"));
		
		OrderContext orderContext = new OrderContext();
		
		//When the order is saved
		Order order = orderService.saveOrder(bedOrder, orderContext);
		
		//Then ensure that the order is created and an invoice with the related item is created
		Order createdOrders = orderService.getOrderByUuid(order.getUuid());
		
		List<Invoice> patientInvoices = billingService.getPatientsInvoices("993c46d2-5007-45e8-9512-969300717761");
		
		assertThat("List of invoices must be greater than 0", patientInvoices.size(), is(1));
		
		assertThat("Invoice should have 1 item", patientInvoices.get(0).getInvoiceItems().size(), is(1));
		
	}
	
}
