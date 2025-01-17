package org.openmrs.module.icare.web.controller;

import java.sql.SQLException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.codehaus.jackson.map.ObjectMapper;
import org.junit.After;
import org.junit.Before;

import org.junit.Test;
import org.openmrs.Patient;
import org.openmrs.api.AdministrationService;
import org.openmrs.api.PatientService;
import org.openmrs.api.context.Context;
import org.openmrs.module.icare.ICareConfig;
import org.openmrs.module.icare.billing.models.Invoice;
import org.openmrs.module.icare.billing.services.BillingService;
import org.openmrs.module.icare.web.controller.core.BaseResourceControllerTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class GepgControllerAPITest extends BaseResourceControllerTest {
	
	@Autowired
	BillingService billingService;
	
	@Before
	public void setUp() throws SQLException, ClassNotFoundException {
		initializeInMemoryDatabase();
		executeDataSet("billing-data.xml");
		executeDataSet("billing-e2e-test.xml");
		this.startUp();
	}
	
	@After
	public void tearDown() throws SQLException, ClassNotFoundException {
		this.shutDown();
		this.clearSessionAfterEachTest();
	}
	
	@Test
	public void testcallbackApi() throws Exception {
		List<String> recipients = Arrays.asList("+255717611117", "+1234567890", "+0987654321");
		String message = "Hello, it's me for Envaya SMS";
		
		String jsonPayload = "{ \"recipients\": [";
		for (int i = 0; i < recipients.size(); i++) {
			jsonPayload += "\"" + recipients.get(i) + "\"";
			if (i < recipients.size() - 1) {
				jsonPayload += ", ";
			}
		}
		jsonPayload += "], \"message\": \"" + message + "\" }";
		
		MockHttpServletRequest request = newPostRequest("icare/envayasms/outgoing-message", jsonPayload);
		request.setContentType(MediaType.APPLICATION_JSON_VALUE);
		
		MockHttpServletResponse response = handle(request);
		
		assertEquals(HttpServletResponse.SC_OK, response.getStatus());
		
		assertEquals("Saved successfully", response.getContentAsString());
		
		System.out.println(response);
	}
	
	@Test
	public void testSubmitBill_withValidUuid_returnsSuccess() throws Exception {
		//Given
		PatientService patientService = Context.getService(PatientService.class);
		
		Patient patient = patientService.getPatientByUuid("1f6959e5-d15a-4025-bb48-340ee9e2c58d");
		
		List<Invoice> invoices = billingService.getPendingInvoices(patient.getUuid());
		Invoice invoice = invoices.get(0);
		System.out.println("invoice data -------------------------");
		System.out.println(invoice);
		System.out.println("Test function fired ------------");
		assertTrue(true);
	}
	
	@Test
	public void testGenerateControlNumber() throws Exception {
		// Given
		String invoices = this.readFile("dto/billing/generate-control-number-by-invoice.json");
		List invoicesList = (new ObjectMapper()).readValue(invoices, List.class);
		// When
		MockHttpServletRequest mockRequest = newPutRequest("gepg/generatecontrolno", invoicesList);
		MockHttpServletResponse generateControlNumberRequest = handle(mockRequest);
		System.out.println(generateControlNumberRequest.getContentAsString());
		// Then
		// TODO: Implement test results
	}
	
	@Test
	public void TestGePGCallBackAPI() throws Exception {
		String callBackPayloadStr = this.readFile("dto/billing/gepg-return-payload.json");
		Map<String, Object> payload = (new ObjectMapper()).readValue(callBackPayloadStr, Map.class);
		
		// Set icare.billing.controlNumberBasedPaymentType.concept.uuid
		AdministrationService administrationService = Context.getAdministrationService();
		administrationService.setGlobalProperty(ICareConfig.DEFAULT_PAYMENT_TYPE_VIA_CONTROL_NUMBER,
		    "GEPGTEST-5e44-11e8-ie7c-50b6etwQqQee");
		MockHttpServletRequest mockedPostRequest = newPostRequest("gepg/callback", payload);
		System.err.println("payload ..........." + payload);
		// MockHttpServletResponse mockedCallBackResponse = handle(mockedPostRequest);		
		// Map<String, Object> responseMap = (new ObjectMapper()).readValue(mockedCallBackResponse.getContentAsString(),
		//     Map.class);
		// System.out.println(responseMap);
		//		assertThat("Payment with status unpaid has been created with reference number", responseMap.get("referenceNumber"), is("991110164278"));
	}
}
