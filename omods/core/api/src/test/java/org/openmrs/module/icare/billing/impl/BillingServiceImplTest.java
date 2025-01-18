package org.openmrs.module.icare.billing.impl;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.openmrs.*;
import org.openmrs.api.ConceptService;
import org.openmrs.api.PatientService;
import org.openmrs.api.context.Context;
import org.openmrs.api.context.ServiceContext;
import org.openmrs.logic.op.In;
import org.openmrs.module.icare.billing.BillingServiceImpl;
import org.openmrs.module.icare.billing.dao.DiscountDAO;
import org.openmrs.module.icare.billing.dao.InvoiceDAO;
import org.openmrs.module.icare.billing.dao.PaymentDAO;
import org.openmrs.module.icare.billing.models.Discount;
import org.openmrs.module.icare.billing.models.Invoice;
import org.openmrs.module.icare.billing.models.Payment;
import org.openmrs.test.BaseModuleContextSensitiveTest;

import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.Mockito.*;

//@ExtendWith(MockitoExtension.class)
//@DisplayName("Billing service implementation")
public class BillingServiceImplTest extends BaseModuleContextSensitiveTest {
	
	@Mock
	InvoiceDAO invoiceDAO;
	
	@Mock
	PaymentDAO paymentDAO;
	
	@Mock
	DiscountDAO discountDAO;
	
	@Mock
	PatientService patientService;
	
	@Mock
	ConceptService conceptService;
	
	@InjectMocks
	BillingServiceImpl billingService;
	
	@Before
	public void setUp() {
		MockitoAnnotations.initMocks(this);
	}
	
	@Test
	//@DisplayName("Creating an invoice")
	public void testCreatingInvoice() {
		
		//Given
		Invoice invoice = new Invoice();
		Patient patient = new Patient();
		patient.setId(1);
		Visit visit = new Visit();
		visit.setPatient(patient);
		invoice.setVisit(visit);
		
		Invoice newInvoice = invoice;
		newInvoice.setId(1);
		when(invoiceDAO.save(invoice)).thenReturn(newInvoice);
		
		//When
		Invoice createdInvoice = billingService.createInvoice(invoice);
		
		//Then
		verify(invoiceDAO).save(invoice);
		assertThat("ID was create", createdInvoice.getId() == newInvoice.getId());
	}
	
	Encounter getEncounter() {
		Encounter encounter = new Encounter();
		Visit visit = new Visit();
		Patient patient = new Patient();
		patient.setId(1);
		visit.setPatient(patient);
		encounter.setPatient(patient);
		encounter.setVisit(visit);
		Order order = new Order();
		order.setId(4);
		Concept orderConcept = new Concept();
		order.setConcept(orderConcept);
		encounter.addOrder(order);
		return encounter;
	}
	
	@Test
	//@DisplayName("Creating an invoice based on the encounter")
	public void testCreatingInvoiceFromAnEncounter() {
		//Given
		Encounter encounter = getEncounter();
		
		when(invoiceDAO.save(new Invoice())).thenReturn(new Invoice());
		//When
		Invoice createdInvoice = billingService.createInvoice(encounter);
		
		//Then
		verify(invoiceDAO).save(createdInvoice);
		assertThat("Check that the invoice items have been created", createdInvoice.getInvoiceItems().size() == encounter
		        .getOrders().size());
		
		Patient patient2 = createdInvoice.getVisit().getPatient();
		assertThat("Check that the invoice patient associated", patient2.getId() == encounter.getPatient().getId());
	}
	
	@Test
	//@DisplayName("Getting patient pending invoices")
	public void testGettingPendingInvoice() {
		
		//Given
		String patientId = "patientID";
		List<Invoice> invoices = new ArrayList<Invoice>();
		Visit visit = new Visit();
		Patient patient = new Patient();
		patient.setUuid(patientId);
		visit.setPatient(patient);
		
		Invoice invoice1 = new Invoice();
		invoice1.setVisit(visit);
		invoices.add(invoice1);
		
		invoice1 = new Invoice();
		invoice1.setVisit(visit);
		invoices.add(invoice1);
		when(invoiceDAO.findByPatientUuidAndPending(patientId)).thenReturn(invoices);
		
		//When
		List<Invoice> fetchedInvoices = billingService.getPendingInvoices(patientId);
		
		//Then
		verify(invoiceDAO).findByPatientUuidAndPending(patientId);
		assertThat("ID was create", fetchedInvoices.size() == invoices.size());
	}
	
	@Test
	//@DisplayName("Getting patient pending invoices")
	public void testFetchingPatientPayments() {
		
		//Given
		String patientId = "patientId";
		Payment payment = new Payment();
		
		Invoice newInvoice = new Invoice();
		newInvoice.setId(1);
		when(paymentDAO.findByPatientUuid(patientId)).thenReturn(new ArrayList<Payment>());
		
		//When
		List<Payment> payments = billingService.getPatientPayments(patientId);
		
		//Then
		verify(paymentDAO).findByPatientUuid(patientId);
	}
	
	@Test
	//@DisplayName("Getting patient pending invoices")
	public void testConfirmingInvoicePayment() throws Exception {
		
		//Given
		Concept paymentType = new Concept();
		paymentType.setUuid("patientTypeId");
		
		String patientId = "patientId";
		Payment payment = new Payment();
		payment.setReferenceNumber("THE USER");
		payment.setPaymentType(paymentType);
		
		Invoice newInvoice = new Invoice();
		newInvoice.setUuid(patientId);
		payment.setInvoice(newInvoice);
		
		//when(paymentTypeDAO.findByUuid(paymentType.getUuid())).thenReturn(paymentType);
		//ConceptService conceptService = mock(ConceptService.class);
		when(conceptService.getConceptByUuid(paymentType.getUuid())).thenReturn(paymentType);
		//when(Context.getServiceContext()).thenReturn(paymentType);
		when(invoiceDAO.findByUuid(patientId)).thenReturn(newInvoice);
		
		//When
		billingService.confirmPayment(payment);
		
		//Then
		verify(invoiceDAO).findByUuid(patientId);
		verify(paymentDAO).save(payment);
	}
	
	@Test
	//@Ignore
	public void testDiscountingInvoice() throws Exception {
		
		//Given
		String patientId = "patientId";
		Discount discount = new Discount();
		Patient patient = new Patient();
		patient.setUuid(patientId);
		discount.setPatient(patient);
		Concept criteria = new Concept();
		criteria.setUuid("uuid");
		discount.setCriteria(criteria);
		
		//
		Invoice newInvoice = new Invoice();
		newInvoice.setId(1);
		when(invoiceDAO.findByPatientUuid(patientId)).thenReturn(new ArrayList<Invoice>());
		when(conceptService.getConceptByUuid(criteria.getUuid())).thenReturn(criteria);
		
		ServiceContext serviceContext = org.openmrs.api.context.ServiceContext.getInstance();
		serviceContext.setPatientService(patientService);
		Context.setContext(serviceContext);
		when(patientService.getPatientByUuid(patient.getUuid())).thenReturn(patient);
		
		//When
		Discount createdDiscount = billingService.discountInvoice(discount);
		
		//Then
		//verify(invoiceDAO).findByPatientUuid(patientId);
		verify(discountDAO).save(discount);
	}
}
