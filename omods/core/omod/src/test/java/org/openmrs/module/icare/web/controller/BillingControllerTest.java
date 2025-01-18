package org.openmrs.module.icare.web.controller;

import org.apache.commons.io.IOUtils;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.openmrs.Concept;
import org.openmrs.Patient;
import org.openmrs.api.context.Context;
import org.openmrs.module.icare.billing.models.Discount;
import org.openmrs.module.icare.billing.models.Invoice;
import org.openmrs.module.icare.billing.models.Payment;
import org.openmrs.module.icare.billing.services.BillingService;
import org.openmrs.module.icare.core.utils.StaticHelper;
import org.springframework.mock.web.MockMultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class BillingControllerTest {
	
	@Mock
	BillingService billingService;
	
	@InjectMocks
	BillingController billingController;
	
	@Before
	public void setUp() {
		MockitoAnnotations.initMocks(this);
	}
	
	@Test
	//@DisplayName("Creating an invoice")
	public void testFetchingPendingInvoices() {
		
		//Given
		when(billingService.getPendingInvoices("")).thenReturn(new ArrayList<Invoice>());
		
		//When
		List<Invoice> invoices = billingController.onGetPatientPendingBills("");
		
		//Then
		verify(billingService).getPendingInvoices("");
		assertThat("List empty invoices", invoices.size() == 0);
	}
	
	@Test
	//@DisplayName("Creating an invoice")
	public void testFetchingPatientPayments() {
		
		//Given
		when(billingService.getPatientPayments("")).thenReturn(new ArrayList<Payment>());
		
		//When
		List<Payment> payments = billingController.onGetPatientPayments("");
		
		//Then
		verify(billingService).getPatientPayments("");
		assertThat("List empty payments", payments.size() == 0);
	}
	
	@Test
	//@DisplayName("Creating an invoice")
	public void testConfirmingPayments() throws Exception {
		
		//Given
		Payment payment = new Payment();
		when(billingService.confirmPayment(payment)).thenReturn(payment);
		
		//When
		Payment payment2 = billingController.onPostConfirmPayment(payment);
		
		//Then
		verify(billingService).confirmPayment(payment);
	}
	
	@Test
	//@DisplayName("Creating an invoice")
	public void testDiscountingInvoice() throws Exception {
		
		//Given
		Discount discount = new Discount();
		
		Concept criteria = new Concept();
		discount.setCriteria(criteria);
		
		Patient patient = new Patient();
		patient.setPersonId(1);
		discount.setPatient(patient);
		
		when(billingService.discountInvoice(discount)).thenReturn(discount);
		
		//When
		Discount discount2 = billingController.onPostDiscountInvoice(discount);
		
		//Then
		verify(billingService).discountInvoice(discount);
	}
}
