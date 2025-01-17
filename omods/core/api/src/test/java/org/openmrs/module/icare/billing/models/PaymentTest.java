package org.openmrs.module.icare.billing.models;

import org.codehaus.jackson.map.ObjectMapper;
import org.openmrs.Concept;
import org.openmrs.module.icare.ModelTest;
import org.openmrs.module.icare.core.Item;

import java.io.IOException;
import java.util.Map;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class PaymentTest extends ModelTest<Payment> {
	
	@Override
	public void testSerialize() throws IOException {
		Map<String, Object> result = getMap();
		Payment payment = getObject();
		
		assertThat("Invoice is set", ((Map) result.get("invoice")).get("uuid").equals(payment.getInvoice().getUuid()));
		assertThat("PaymentType is set",
		    ((Map) result.get("paymentType")).get("uuid").equals(payment.getPaymentType().getUuid()));
		assertThat("Refference is set", result.get("referenceNumber").equals(payment.getReferenceNumber()));
		assertThat("Items are set", result.get("items") != null);
		
		assertThat("One Item", payment.getItems().size() == 1);
		assertThat("The item is legit", payment.getItems().get(0).getItem().getUuid(),
		    is("b210used-9ab1-4b57-8a89-c0b09854368d"));
	}
	
	@Override
	public void testDeserialize() throws IOException {
		//Given
		Payment payment = new Payment();
		Invoice invoice = new Invoice();
		invoice.setId(1);
		invoice.setUuid("3d6d2029-f0c9-443e-9055-edbc5a8018e4");
		payment.setInvoice(invoice);
		
		Concept paymentType = new Concept();
		paymentType.setId(1);
		paymentType.setUuid("e7jnec30-5344-11e8-ie7c-40b6etw3cfee");
		payment.setPaymentType(paymentType);
		
		payment.setReferenceNumber("RECEIVED BY: The User");
		
		PaymentItem item = new PaymentItem();
		item.setPayment(payment);
		item.setAmount(1000.0);
		Item i = new Item();
		i.setUuid("b210used-9ab1-4b57-8a89-c0b09854368d");
		item.setItem(i);
		payment.getItems().add(item);
		
		//When
		String json = (new ObjectMapper()).writeValueAsString(payment);
		
		Map<String, Object> result = (new ObjectMapper()).readValue(json, Map.class);
		
		//Then
		assertThat("Invoice is set", ((Map) result.get("invoice")).get("uuid").equals(payment.getInvoice().getUuid()));
		assertThat("PaymentType is set",
		    ((Map) result.get("paymentType")).get("uuid").equals(payment.getPaymentType().getUuid()));
		assertThat("Refference is set", result.get("referenceNumber").equals(payment.getReferenceNumber()));
		assertThat("Items are set", result.get("items") != null);
		
		assertThat("One Item", payment.getItems().size() == 1);
		assertThat("The item is legit", payment.getItems().get(0).getItem().getUuid(),
		    is("b210used-9ab1-4b57-8a89-c0b09854368d"));
	}
}
