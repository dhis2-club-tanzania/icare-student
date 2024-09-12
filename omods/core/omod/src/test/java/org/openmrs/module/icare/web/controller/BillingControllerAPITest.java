package org.openmrs.module.icare.web.controller;

/*import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;*/

import org.apache.commons.io.IOUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.hamcrest.CoreMatchers;
import org.hamcrest.Matcher;
import org.junit.After;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.openmrs.api.*;
import org.openmrs.api.context.Context;
import org.openmrs.*;
import org.openmrs.module.icare.ICareConfig;
import org.openmrs.module.icare.billing.models.Invoice;
import org.openmrs.module.icare.billing.models.InvoiceItem;
import org.openmrs.module.icare.billing.models.ItemPrice;
import org.openmrs.module.icare.billing.models.Payment;
import org.openmrs.module.icare.billing.services.BillingService;
import org.openmrs.module.icare.core.ICareService;
import org.openmrs.module.icare.core.Item;
import org.openmrs.module.icare.web.controller.core.BaseResourceControllerTest;
import org.openmrs.module.webservices.rest.SimpleObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.mock.web.MockMultipartHttpServletRequest;
import org.springframework.web.bind.annotation.RequestMethod;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

//@ExtendWith(MockitoExtension.class)
//@RunWith(SpringJUnit4ClassRunner.class)
public class BillingControllerAPITest extends BaseResourceControllerTest {
	
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
	public void testAShouldNotHavePendingInvoices() throws Exception {
		//executeDataSet("billing-data.xml");
		//Given
		PatientService patientService = Context.getService(PatientService.class);
		Patient patient = patientService.getPatientByUuid("1f6959e5-d15a-4025-bb48-340ee9e2c58d");
		
		//When
		MockHttpServletRequest newGetRequest = newGetRequest("billing/invoice", new Parameter("patient", patient.getUuid()));
		MockHttpServletResponse handle = handle(newGetRequest);
		
		//Then
		Invoice[] invoices = (new ObjectMapper()).readValue(handle.getContentAsString(), Invoice[].class);
		//SimpleObject[] objectCreated = deserialize(handle);
		assertThat("List empty invoices", invoices.length == 0);
	}
	
	@Test
	public void testAShouldNoPayments() throws Exception {
		//executeDataSet("billing-data.xml");
		//Given
		PatientService patientService = Context.getService(PatientService.class);
		Patient patient = patientService.getPatientByUuid("1f6959e5-d15a-4025-bb48-340ee9e2c58d");
		
		//When
		MockHttpServletRequest newGetRequest = newGetRequest("billing/payment", new Parameter("patient", patient.getUuid()));
		MockHttpServletResponse handle = handle(newGetRequest);
		
		//Then
		Invoice[] invoices = (new ObjectMapper()).readValue(handle.getContentAsString(), Invoice[].class);
		//SimpleObject[] objectCreated = deserialize(handle);
		assertThat("List empty payments", invoices.length == 0);
	}
	
	@Test
	public void testBFetchingPendingInvoices() throws Exception {
		//Given
		PatientService patientService = Context.getService(PatientService.class);
		Patient patient = patientService.getPatientByUuid("1f6959e5-d15a-4025-bb48-340ee9e2c58d");
		Visit visit = createVisit(patient);
		
		MockHttpServletRequest newGetRequest = newGetRequest("billing/invoice", new Parameter("patient", patient.getUuid()));
		MockHttpServletResponse handle = handle(newGetRequest);
		
		List<Map<String, Object>> invoices = (new ObjectMapper()).readValue(handle.getContentAsString(), List.class);
		assertThat("List should contain invoice", invoices.size(), is(1));
		Map<String, Object> invoice = invoices.get(0);
		assertThat("No Id", invoice.get("id") == null);
		assertThat("UUID Exists", invoice.get("uuid") != null);
		assertThat("Items Exists", invoice.get("items") != null);
		Map<String, Object> item1 = null;
		Map<String, Object> item2 = null;
		for (Map<String, Object> item : ((List<Map>) invoice.get("items"))) {
			if (((Map) ((Map) item.get("item")).get("concept")).get("name").equals("Registration Fee")) {
				item1 = item;
			} else {
				item2 = item;
			}
		}
		
		assertThat("Item 1 amount is legit", item1.get("price"), CoreMatchers.<Object> is(6000.0));
		assertThat("Item 1 quantity is 1", item1.get("quantity"), CoreMatchers.<Object> is(1.0));
		assertThat("Item 1 item name is Registration Fee", ((Map) ((Map) item1.get("item")).get("concept")).get("name"),
		    CoreMatchers.<Object> is("Registration Fee"));
		
		assertThat("Item 2 amount is legit", item2.get("price"), CoreMatchers.<Object> is(5000.0));
		assertThat("Item 2 quantity is 1", item2.get("quantity"), CoreMatchers.<Object> is(1.0));
		assertThat("Item 2 item name is OPD Service", ((Map) ((Map) item2.get("item")).get("concept")).get("name"),
		    CoreMatchers.<Object> is("OPD Service"));
		
		newGetRequest = newGetRequest("billing/invoice", new Parameter("visit", visit.getUuid()));
		handle = handle(newGetRequest);
		
		invoices = (new ObjectMapper()).readValue(handle.getContentAsString(), List.class);
		assertThat("List should contain invoice", invoices.size(), is(1));
		invoice = invoices.get(0);
		assertThat("No Id", invoice.get("id") == null);
		assertThat("UUID Exists", invoice.get("uuid") != null);
		assertThat("Items Exists", invoice.get("items") != null);
		for (Map<String, Object> item : ((List<Map>) invoice.get("items"))) {
			if (((Map) ((Map) item.get("item")).get("concept")).get("name").equals("Registration Fee")) {
				item1 = item;
			} else {
				item2 = item;
			}
		}
		
		assertThat("Item 1 amount is legit", item1.get("price"), CoreMatchers.<Object> is(6000.0));
		assertThat("Item 1 quantity is 1", item1.get("quantity"), CoreMatchers.<Object> is(1.0));
		assertThat("Item 1 item name is Registration Fee", ((Map) ((Map) item1.get("item")).get("concept")).get("name"),
		    CoreMatchers.<Object> is("Registration Fee"));
		
		assertThat("Item 2 amount is legit", item2.get("price"), CoreMatchers.<Object> is(5000.0));
		assertThat("Item 2 quantity is 1", item2.get("quantity"), CoreMatchers.<Object> is(1.0));
		assertThat("Item 2 item name is OPD Service", ((Map) ((Map) item2.get("item")).get("concept")).get("name"),
		    CoreMatchers.<Object> is("OPD Service"));
	}
	
	@Test
	@Ignore("To be done with NHIF Servers")
	public void testBFetchingPendingInvoicesNHIF() throws Exception {
		//Given
		PatientService patientService = Context.getService(PatientService.class);
		Patient patient = patientService.getPatientByUuid("1f6959e5-d15a-4025-bb48-340ee9e2c58d");
		createVisitInsurance(patient);
		
		MockHttpServletRequest newGetRequest = newGetRequest("billing/invoice", new Parameter("patient", patient.getUuid()));
		MockHttpServletResponse handle = handle(newGetRequest);
		
		List<Map<String, Object>> invoices = (new ObjectMapper()).readValue(handle.getContentAsString(), List.class);
		assertThat("List should contain invoice", invoices.size(), is(1));
		Map<String, Object> invoice = invoices.get(0);
		assertThat("No Id", invoice.get("id") == null);
		assertThat("UUID Exists", invoice.get("uuid") != null);
		assertThat("Items Exists", invoice.get("items") != null);
		Map<String, Object> item1 = ((List<Map>) invoice.get("items")).get(0);
		assertThat("Item 1 amount is legit", item1.get("price"), CoreMatchers.<Object> is(6000.0));
		assertThat("Item 1 quantity is 1", item1.get("quantity"), CoreMatchers.<Object> is(1.0));
		assertThat("Item 1 item name is Registration Fee", ((Map) item1.get("item")).get("name"),
		    CoreMatchers.<Object> is("Registration Fee"));
		
		Map<String, Object> item2 = ((List<Map>) invoice.get("items")).get(1);
		assertThat("Item 2 amount is legit", item2.get("price"), CoreMatchers.<Object> is(5000.0));
		assertThat("Item 2 quantity is 1", item2.get("quantity"), CoreMatchers.<Object> is(1.0));
		assertThat("Item 2 item name is OPD Service", ((Map) item2.get("item")).get("name"),
		    CoreMatchers.<Object> is("OPD Service"));
	}
	
	@Test
	public void testCMakingDiscounts() throws Exception {
		
		//Given
		PatientService patientService = Context.getService(PatientService.class);
		Patient patient = patientService.getPatientByUuid("1f6959e5-d15a-4025-bb48-340ee9e2c58d");
		
		createVisit(patient);
		List<Invoice> invoices = billingService.getPendingInvoices(patient.getUuid());
		Invoice invoice = invoices.get(0);
		
		System.out.println(Context.getObsService().getObservationsByPerson(patient));
		
		String dto = this.readFile("dto/discount-create.json");
		Map<String, Object> discount = (new ObjectMapper()).readValue(dto, Map.class);
		
		//When
		((Map) ((Map) ((List) discount.get("items")).get(0)).get("invoice")).put("uuid", invoice.getUuid());
		MockHttpServletRequest newGetRequest = newPostRequest("billing/discount", discount);
		MockHttpServletResponse handle = handle(newGetRequest);
		
		//Then
		Map<String, Object> newDiscount = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		assertThat("Should contain discount", newDiscount != null);
		assertThat("Should contain Remarks", discount.get("remarks"), is(newDiscount.get("remarks")));
		assertThat("Should contain Patient", discount.get("patient"), is(newDiscount.get("patient")));
		assertThat("Should contain Criteria", discount.get("criteria"), is(newDiscount.get("criteria")));
		assertThat("Should contain items", ((List) discount.get("items")).size(),
		    is(((List) newDiscount.get("items")).size()));
		
		String amount = ((Map) ((List) discount.get("items")).get(0)).get("amount").toString();
		assertThat("Should have item with amount", (Double.valueOf(amount)),
		    is(((Map) ((List) newDiscount.get("items")).get(0)).get("amount")));
		
		//Test fetching discounts on the invoice
		newGetRequest = newGetRequest("billing/invoice", new Parameter("patient", patient.getUuid()));
		MockHttpServletResponse handle2 = handle(newGetRequest);
		List invoiceMaps = (new ObjectMapper()).readValue(handle2.getContentAsString(), List.class);
		Map<String, Object> invoiceMap = (Map<String, Object>) invoiceMaps.get(0);
		assertThat("Should contain discount items", ((List) invoiceMap.get("discountItems")).size(), is(1));
	}
	
	@Test
	public void testDMakingDiscountsDoubleAmount() throws Exception {
		
		//Given
		PatientService patientService = Context.getService(PatientService.class);
		Patient patient = patientService.getPatientByUuid("1f6959e5-d15a-4025-bb48-340ee9e2c58d");
		createVisit(patient);
		List<Invoice> invoices = billingService.getPendingInvoices(patient.getUuid());
		Invoice invoice = invoices.get(0);
		
		String dto = this.readFile("dto/discount-create-double.json");
		Map<String, Object> discount = (new ObjectMapper()).readValue(dto, Map.class);
		
		//When
		((Map) ((Map) ((List) discount.get("items")).get(0)).get("invoice")).put("uuid", invoice.getUuid());
		MockHttpServletRequest newGetRequest = newPostRequest("billing/discount", discount);
		MockHttpServletResponse handle = handle(newGetRequest);
		
		//Then
		Map<String, Object> newDiscount = (new ObjectMapper()).readValue(handle.getContentAsString(), Map.class);
		assertThat("Should contain discount", newDiscount != null);
		assertThat("Should contain Remarks", discount.get("remarks"), is(newDiscount.get("remarks")));
		assertThat("Should contain Patient", discount.get("patient"), is(newDiscount.get("patient")));
		assertThat("Should contain Criteria", discount.get("criteria"), is(newDiscount.get("criteria")));
		assertThat("Should contain items", ((List) discount.get("items")).size(),
		    is(((List) newDiscount.get("items")).size()));
		
		String amount = ((Map) ((List) discount.get("items")).get(0)).get("amount").toString();
		assertThat("Should have item with amount", (Double.valueOf(amount)),
		    is(((Map) ((List) newDiscount.get("items")).get(0)).get("amount")));
		
		//Test fetching discounts on the invoice
		newGetRequest = newGetRequest("billing/invoice", new Parameter("patient", patient.getUuid()));
		MockHttpServletResponse handle2 = handle(newGetRequest);
		List invoiceMaps = (new ObjectMapper()).readValue(handle2.getContentAsString(), List.class);
		Map<String, Object> invoiceMap = (Map<String, Object>) invoiceMaps.get(0);
		assertThat("Should contain discount items", ((List) invoiceMap.get("discountItems")).size(), is(1));
	}
	
	@Test
	//@Ignore
	public void testDViewingPayments() throws Exception {
		
		//Given
		PatientService patientService = Context.getService(PatientService.class);
		Patient patient = patientService.getPatientByUuid("1f6959e5-d15a-4025-bb48-340ee9e2c58d");
		
		MockHttpServletRequest newGetRequest = newGetRequest("billing/payment", new Parameter("patient", patient.getUuid()));
		MockHttpServletResponse handle = handle(newGetRequest);
		
		Payment[] payments = (new ObjectMapper()).readValue(handle.getContentAsString(), Payment[].class);
		
		assertThat("List should not contain payments", payments.length == 0);
	}
	
	@Test
	public void testEMakingPartialPayments() throws Exception {
		
		//Given
		PatientService patientService = Context.getService(PatientService.class);
		ICareService iCareService = Context.getService(ICareService.class);
		
		Patient patient = patientService.getPatientByUuid("1f6959e5-d15a-4025-bb48-340ee9e2c58d");
		createVisit(patient);
		
		List<Invoice> invoices = billingService.getPendingInvoices(patient.getUuid());
		Invoice invoice = invoices.get(0);
		
		SimpleObject payment = new SimpleObject();
		payment.add("invoice", (new SimpleObject()).add("uuid", invoice.getUuid()));
		payment.add("paymentType", (new SimpleObject()).add("uuid", "e7jnec30-5344-11e8-ie7c-40b6etw3cfee"));
		payment.add("referenceNumber", "RECEIVED BY: The User");
		
		List<SimpleObject> discountItems = new ArrayList<SimpleObject>();
		SimpleObject paymentItem = new SimpleObject();
		InvoiceItem invoiceItem = invoice.getInvoiceItems().get(0);
		paymentItem.add("order", (new SimpleObject()).add("uuid", invoiceItem.getOrder().getUuid()));
		paymentItem.add("item", (new SimpleObject()).add("uuid", invoiceItem.getItem().getUuid()));
		//paymentItem.add("invoice", (new SimpleObject()).add("uuid", invoice.getUuid()));
		paymentItem.add("amount", 2000);
		discountItems.add(paymentItem);
		payment.add("items", discountItems);
		
		//When
		MockHttpServletRequest newPostRequest = newPostRequest("billing/payment", payment);
		MockHttpServletResponse handler = handle(newPostRequest);
		
		//Then
		MockHttpServletRequest newGetRequest = newGetRequest("billing/payment", new Parameter("patient", patient.getUuid()));
		handler = handle(newGetRequest);
		List newPayments = (new ObjectMapper()).readValue(handler.getContentAsString(), List.class);
		
		Map newPayment = (Map) newPayments.get(0);
		assertThat("List should contain payment", newPayment.get("referenceNumber"),
		    is(Optional.ofNullable(payment.get("referenceNumber"))));
		
		List<Map> itemPayments = (List<Map>) newPayment.get("items");
		assertThat("List should contain payment", itemPayments.get(0).get("amount"), CoreMatchers.<Object> is(2000.0));
		
		newGetRequest = newGetRequest("billing/invoice", new Parameter("patient", patient.getUuid()));
		handler = handle(newGetRequest);
		List invoicePayment = (new ObjectMapper()).readValue(handler.getContentAsString(), List.class);
		assertThat("Should still contain a invoice", invoicePayment.size(), is(1));
	}
	
	@Test
	public void testEMakingFullPayments() throws Exception {
		
		//Given
		PatientService patientService = Context.getService(PatientService.class);
		ICareService iCareService = Context.getService(ICareService.class);
		Patient patient = patientService.getPatientByUuid("1f6959e5-d15a-4025-bb48-340ee9e2c58d");
		createVisit(patient);
		List<Invoice> invoices = billingService.getPendingInvoices(patient.getUuid());
		Invoice invoice = invoices.get(0);
		
		Item item = iCareService.getItemByUuid("b210used-9ab1-4b57-8a89-c0b09854368d");
		
		SimpleObject payment = new SimpleObject();
		payment.add("invoice", (new SimpleObject()).add("uuid", invoice.getUuid()));
		payment.add("paymentType", (new SimpleObject()).add("uuid", "e7jnec30-5344-11e8-ie7c-40b6etw3cfee"));
		payment.add("referenceNumber", "RECEIVED BY: The User");
		
		List<SimpleObject> discountItems = new ArrayList<SimpleObject>();
		for (InvoiceItem invoiceItem : invoice.getInvoiceItems()) {
			SimpleObject paymentItem = new SimpleObject();
			paymentItem.add("order", (new SimpleObject()).add("uuid", invoiceItem.getOrder().getUuid()));
			paymentItem.add("item", (new SimpleObject()).add("uuid", invoiceItem.getItem().getUuid()));
			//paymentItem.add("invoice", (new SimpleObject()).add("uuid", invoice.getUuid()));
			paymentItem.add("amount", invoiceItem.getPrice() * invoiceItem.getQuantity());
			discountItems.add(paymentItem);
		}
		payment.add("items", discountItems);
		
		//When
		MockHttpServletRequest newPostRequest = newPostRequest("billing/payment", payment);
		MockHttpServletResponse handler = handle(newPostRequest);
		//Then
		MockHttpServletRequest newGetRequest = newGetRequest("billing/payment", new Parameter("patient", patient.getUuid()));
		handler = handle(newGetRequest);
		List newPayments = (new ObjectMapper()).readValue(handler.getContentAsString(), List.class);
		
		Map newPayment = (Map) newPayments.get(0);
		assertThat("List should contain payment", newPayment.get("referenceNumber"),
		    is(Optional.ofNullable(payment.get("referenceNumber"))));
		
		List<Map> itemPayments = (List<Map>) newPayment.get("items");
		//TODO find out how to run a reliable test with the below line
		//assertThat("List should contain payment", itemPayments.size(), is(2));
		
		newGetRequest = newGetRequest("billing/invoice", new Parameter("patient", patient.getUuid()));
		handler = handle(newGetRequest);
		List invoicePayment = (new ObjectMapper()).readValue(handler.getContentAsString(), List.class);
		assertThat("Should still contain a invoice", invoicePayment.size(), is(0));
	}
	
	@Test
	public void testExceptions() throws Exception {
		
		//Given
		PatientService patientService = Context.getService(PatientService.class);
		ICareService iCareService = Context.getService(ICareService.class);
		Patient patient = patientService.getPatientByUuid("1f6959e5-d15a-4025-bb48-340ee9e2c58d");
		createVisit(patient);
		List<Invoice> invoices = billingService.getPendingInvoices(patient.getUuid());
		Invoice invoice = invoices.get(0);
		
		Item item = iCareService.getItemByUuid("b210used-9ab1-4b57-8a89-c0b09854368d");
		
		SimpleObject payment = new SimpleObject();
		payment.add("invoice", (new SimpleObject()).add("uuid", invoice.getUuid()));
		payment.add("paymentType", (new SimpleObject()).add("uuid", "e7jnec30-5344-11e8-ie7c-40b6etw3cfee"));
		payment.add("referenceNumber", "RECEIVED BY: The User");
		
		List<SimpleObject> discountItems = new ArrayList<SimpleObject>();
		SimpleObject paymentItem = new SimpleObject();
		InvoiceItem invoiceItem = invoice.getInvoiceItems().get(0);
		paymentItem.add("item", (new SimpleObject()).add("uuid", invoiceItem.getItem().getUuid()));
		//paymentItem.add("invoice", (new SimpleObject()).add("uuid", invoice.getUuid()));
		paymentItem.add("amount", 2000);
		discountItems.add(paymentItem);
		payment.add("items", discountItems);
		
		//When
		/*MockHttpServletRequest newPostRequest = newPostRequest("billing/payment", payment);
		MockHttpServletResponse handler = handle(newPostRequest);
		
		//Then
		MockHttpServletRequest newGetRequest = newGetRequest("billing/payment", new Parameter("patient", patient.getUuid()));
		handler = handle(newGetRequest);
		List newPayments = (new ObjectMapper()).readValue(handler.getContentAsString(), List.class);
		
		Map newPayment = (Map) newPayments.get(0);
		assertThat("List should contain payment", newPayment.get("referenceNumber"), is(payment.get("referenceNumber")));
		
		List<Map> itemPayments = (List<Map>) newPayment.get("items");
		assertThat("List should contain payment", itemPayments.get(0).get("amount"), CoreMatchers.<Object> is(2000.0));
		
		newGetRequest = newGetRequest("billing/invoice", new Parameter("patient", patient.getUuid()));
		handler = handle(newGetRequest);
		List invoicePayment = (new ObjectMapper()).readValue(handler.getContentAsString(), List.class);
		assertThat("Should still contain a invoice", invoicePayment.size(), is(1));*/
	}
	
	@Test
	@Ignore("Need to finish the test to accomodate the new discount creation")
	public void testAutomaticFullDiscountCreation() throws Exception {
		
		//Discount Creation
		PatientService patientService = Context.getService(PatientService.class);
		Patient patient = patientService.getPatientByUuid("1f6959e5-d15a-4025-bb48-340ee9e2c58d");
		createVisit(patient);
		List<Invoice> invoices = billingService.getPendingInvoices(patient.getUuid());
		
		Invoice invoice = invoices.get(0);
		Visit visit = invoice.getVisit();
		
		String dto = this.readFile("dto/discount-create.json");
		Map<String, Object> discount = (new ObjectMapper()).readValue(dto, Map.class);
		discount.put("exempted", true);
		
		//When
		((Map) ((Map) ((List) discount.get("items")).get(0)).get("invoice")).put("uuid", invoice.getUuid());
		MockHttpServletRequest newGetRequest = newPostRequest("billing/discount", discount);
		MockHttpServletResponse handle = handle(newGetRequest);
		
		System.out.println(invoice.getInvoiceItems().size());
		
		///Create a new bill
		//Given
		OrderType orderType = new OrderType();
		orderType.setJavaClassName("org.openmrs.module.icare.billing.models.Prescription");
		orderType.setName("Prescription");
		Context.getOrderService().saveOrderType(orderType);
		
		Map<String, Object> result = getResourceDTOMap("core/ledger-add");
		MockHttpServletRequest newPostRequest = null;
		//		MockHttpServletResponse
		handle = null;
		newPostRequest = newPostRequest("store/ledger", result);
		handle = handle(newPostRequest);
		
		result = getResourceDTOMap("drug-create-dto");
		patientService = Context.getService(PatientService.class);
		patient = patientService.getPatientByUuid("1f6959e5-d15a-4025-bb48-340ee9e2c58d");
		//Visit visit = this.getVisit(patient);
		
		EncounterService encounterService = Context.getService(EncounterService.class);
		Encounter encounter = encounterService.getEncountersByVisit(visit, false).get(0);
		result.put("encounter", encounter.getUuid());
		
		//When
		newGetRequest = newPostRequest("icare/prescription", result);
		handle = handle(newGetRequest);
		
		//logics to check if full discount is created automatically
		Double discountPrice = invoice.getDiscountItems().get(1).getAmount();
		Double totalPrice = invoice.getInvoiceItems().get(1).getPrice() * invoice.getInvoiceItems().get(1).getQuantity();
		
		assertThat(totalPrice, equalTo(discountPrice));
		assertThat("The discount items should be three i.e includes the registration invoice item", invoice
		        .getDiscountItems().size() == 3);
		
	}
	
	@Test
	public void createOrderForOngoingIPDPatients() throws Exception {
		Order order = new Order();
		
		AdministrationService adminService = Context.getService(AdministrationService.class);
		ConceptService conceptService = Context.getService(ConceptService.class);
		adminService.setGlobalProperty(ICareConfig.BED_ORDER_TYPE, "2msir5eb-5345-11e8-9922-40b034c3cfef");
		//adminService.setGlobalProperty(ICareConfig.SERVICE_ATTRIBUTE,"SERVICE0IIIIIIIIIIIIIIIIIIIIIIIATYPE");
		System.out.println("Yuhu:" + Context.getProviderService().getProvider(1));
		adminService.setGlobalProperty(ICareConfig.BED_ORDER_CONCEPT, "e721ec30-mfy4-11e8-ie7c-40b69mdy79ee");
		
		order = billingService.createOrderForOngoingIPDPatients();
		
		OrderService orderService = Context.getService(OrderService.class);
		Order createdOrders = orderService.getOrderByUuid(order.getUuid());
		
		List<Invoice> patientInvoices = billingService.getPatientsInvoices("1f6959e5-d15a-4025-bb48-340ee9e2c58d");
		
		assertThat("The order should be created", createdOrders.getUuid().length() > 1);
		assertThat("Invoice should have 1 item", patientInvoices.get(0).getInvoiceItems().size(), is(1));
		
		System.out.println(order);
		
	}
	
	@Override
	public String getURI() {
		return "billing";
	}
	
	@Override
	public String getUuid() {
		return null;
	}
	
	@Override
	public long getAllCount() {
		return 0;
	}
	
}
