package org.openmrs.module.icare.billing;

import org.hamcrest.MatcherAssert;
import org.junit.After;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openmrs.Concept;
import org.openmrs.EncounterType;
import org.openmrs.Visit;
import org.openmrs.api.AdministrationService;
import org.openmrs.api.context.Context;
import org.openmrs.module.icare.billing.models.*;
import org.openmrs.module.icare.billing.services.BillingService;
import org.openmrs.module.icare.core.ICareService;
import org.openmrs.module.icare.core.Item;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.naming.ConfigurationException;
import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.junit.Assert.assertThat;

@RunWith(SpringJUnit4ClassRunner.class)
public class BillingServiceTest extends BillingTestBase {
	
	@Autowired
	public BillingService billingService;
	
	@Autowired
	public ICareService icareService;
	
	//Item item;
	@Before
	public void initMockito() throws Exception {
		super.initTestData();
		this.setUpAdvisors();
		//MockitoAnnotations.initMocks(this);
	}
	
	@After
	public void afterTests() throws Exception {
		this.shutDowndvisors();
	}
	
	@Test
	public void testInitialTest() {
		assertThat(billingService, is(notNullValue()));
		//assertThat(icareService,null);
	}
	
	@Test
	public void testACreatingInvoiceOnVisit() throws VisitInvalidException, ConfigurationException {
		/**
		 * Testing creation of invoice
		 */
		
		//Given
		Visit visit = getVisit();
		
		//When
		List<Invoice> invoices = billingService.getPendingInvoices(visit.getPatient().getUuid());
		
		//Then
		
		Invoice invoice = invoices.get(0);
		MatcherAssert.assertThat("Invoice items have been created", invoice.getInvoiceItems().size(), is(2));
		int countItems = 0;
		for (InvoiceItem invoiceItem : invoice.getInvoiceItems()) {
			if (invoiceItem.getItem().getConcept().getDisplayString().equals("Registration Fee")) {
				MatcherAssert.assertThat("Registration Fee is 6000", invoiceItem.getPrice(), is(6000.0));
				countItems++;
			} else if (invoiceItem.getItem().getConcept().getDisplayString().equals("OPD Service")) {
				MatcherAssert.assertThat("OPD Service Fee is 5000", invoiceItem.getPrice(), is(5000.0));
				countItems++;
			}
			MatcherAssert.assertThat("Invoice quantity is 1", invoiceItem.getQuantity(), is(1.0));
		}
		MatcherAssert.assertThat("Two items have been found", countItems, is(2));
		
		invoices = billingService.getPatientsInvoices(visit.getPatient().getUuid());
		
		System.out.println("Invoices:" + invoices.size());
		MatcherAssert.assertThat("One invoice is found by fetching all invoices ", invoices.size(), is(1));
	}
	
	@Test
	@Ignore
	public void testACreatingInvoiceFailureOnVisit() throws ConfigurationException, VisitInvalidException {
		/**
		 * Testing creation of invoice
		 */
		//Given
		//MockSettings customSettings = withSettings().defaultAnswer((Answer) Context.getEncounterService());
		
		/*Context context = mock(Context.class);//,new CustomEncounterService());
		//Context.
		when(billingService..g).thenThrow(new APIException());*/
		EncounterType encounterType = Context.getEncounterService().getEncounterTypeByUuid(
		    "2msir5eb-5345-11e8-9c7c-40b034c3cfee");
		encounterType.setUuid("2msir5eb-5345-11e8-9c7c-40b034c3cfe1");
		Context.getEncounterService().saveEncounterType(encounterType);
		//when(billingService.processVisit((Visit)any(),(VisitMetaData) any())).thenThrow(new APIException());
		Visit visit = getVisit();
		
		//When
		List<Invoice> invoices = billingService.getPendingInvoices(visit.getPatient().getUuid());
		
		//Then
		
		Invoice invoice = invoices.get(0);
		MatcherAssert.assertThat("Invoice items have been created", invoice.getInvoiceItems().size(), is(2));
		int countItems = 0;
		for (InvoiceItem invoiceItem : invoice.getInvoiceItems()) {
			if (invoiceItem.getItem().getConcept().getDisplayString().equals("Registration Fee")) {
				MatcherAssert.assertThat("Registration Fee is 6000", invoiceItem.getPrice(), is(6000.0));
				countItems++;
			} else if (invoiceItem.getItem().getConcept().getDisplayString().equals("OPD Service")) {
				MatcherAssert.assertThat("OPD Service Fee is 5000", invoiceItem.getPrice(), is(5000.0));
				countItems++;
			}
			MatcherAssert.assertThat("Invoice quantity is 1", invoiceItem.getQuantity(), is(1.0));
		}
		MatcherAssert.assertThat("Two items have been found", countItems, is(2));
	}
	
	@Test
	//@Ignore
	public void testBCreatingInvoiceAndGetPendingBill() throws Exception {
		
		/**
		 * Testing creation of invoice
		 */
		//Given
		Visit visit = getVisit();
		
		AdministrationService adminService = Context.getService(AdministrationService.class);
		String property = adminService.getGlobalProperty("coreapps.defaultPatientIdentifierLocation");
		
		//When
		List<Invoice> invoices = billingService.getPendingInvoices(visit.getPatient().getUuid());
		
		//Then
		MatcherAssert.assertThat("Invoice was created", invoices.size() == 1);
		MatcherAssert.assertThat("Invoice items were created", invoices.get(0).getInvoiceItems().size() > 0);
		Invoice invoice = invoices.get(0);
		
		//createdInvoice = invoices.get(0);
		
		/**
		 * Testing discounting invoice
		 */
		//TODO create test for discount
		//Given
		Discount discount = new Discount();
		discount.setPatient(visit.getPatient());
		
		Concept discountCriteria = new Concept();
		discountCriteria.setUuid("e7jnec30-5344-11e8-ie7c-40b6etw3cfee");
		discount.setCriteria(discountCriteria);
		
		List<DiscountInvoiceItem> discountInvoiceItems = new ArrayList<DiscountInvoiceItem>();
		DiscountInvoiceItem discountInvoiceItem = new DiscountInvoiceItem();
		discountInvoiceItem.setInvoice(invoice);
		discountInvoiceItem.setAmount(Double.valueOf(1000));
		discountInvoiceItem.setDiscount(discount);
		
		Item item = new Item();
		item.setUuid("b21bhsld-9ab1-4b57-8a89-c0bf2580a68d");
		discountInvoiceItem.setItem(item);
		
		discountInvoiceItems.add(discountInvoiceItem);
		discount.setItems(discountInvoiceItems);
		
		//When
		Discount createdDiscount = billingService.discountInvoice(discount);
		
		//Then
		MatcherAssert.assertThat("ID was create", createdDiscount.getId() == discount.getId());
		List<Discount> discounts = billingService.getPatientDiscounts(visit.getPatient().getUuid());
		MatcherAssert.assertThat("Invoice was created", discounts.size() > 0);
		MatcherAssert.assertThat("Discount items were created", discounts.get(0).getItems().size() > 0);
		
		/**
		 * Testing confirmation of payments
		 */
		//Given
		Payment payment = new Payment();
		//Invoice newInvoice = new Invoice();
		//newInvoice.setUuid(invoice.getUuid());
		payment.setInvoice(invoice);
		payment.setReferenceNumber("THE USER");
		for (InvoiceItem invoiceItem : invoice.getInvoiceItems()) {
			PaymentItem paymentItem = new PaymentItem();
			paymentItem.setPayment(payment);
			paymentItem.setItem(invoiceItem.getItem());
			paymentItem.setOrder(invoiceItem.getOrder());
			paymentItem.setAmount(invoiceItem.getPrice() * invoiceItem.getQuantity());
			payment.getItems().add(paymentItem);
		}
		
		Concept paymentType = new Concept();
		paymentType.setUuid("e7jnec30-5344-11e8-ie7c-40b6etw3cfee");
		payment.setPaymentType(paymentType);
		payment.setInvoice(invoice);
		
		//When
		Payment createdPayment = billingService.confirmPayment(payment);
		
		//Then
		MatcherAssert.assertThat("ID was create", createdPayment.getId() == payment.getId());
		List<Payment> payments = billingService.getPatientPayments(visit.getPatient().getUuid());
		MatcherAssert.assertThat("Invoice was created", payments.size() > 0);
		
		List<Invoice> pendingInvoices = billingService.getPendingInvoices(visit.getPatient().getUuid());
		MatcherAssert.assertThat("There are no pending invoices after payment", pendingInvoices.size(), is(0));
	}
	
}
