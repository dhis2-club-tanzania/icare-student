package org.openmrs.module.icare.billing.models;

import org.openmrs.module.icare.ModelTest;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import static org.hamcrest.MatcherAssert.assertThat;

public class DiscountTest extends ModelTest<Discount> {
	
	@Override
	public void testSerialize() throws IOException {
		Map<String, Object> result = getMap();
		
		Discount discount = getObject();
		
		assertThat("Patient is set", ((Map) result.get("patient")).get("uuid").equals(discount.getPatient().getUuid()));
		assertThat("Discount Criteria is set",
		    ((Map) result.get("criteria")).get("uuid").equals(discount.getCriteria().getUuid()));
		assertThat("Remark is set", result.get("remarks").equals(discount.getRemarks()));
		
		assertThat("Items are set", result.get("items") != null);
		List<Map<String, Object>> items = (List<Map<String, Object>>) result.get("items");
		//new ObjectMapper().readValue(result.get("items"), HashMap[].class);
		assertThat("One Item", discount.getItems().size() == 1);
		assertThat("The item is legit",
		    discount.getItems().get(0).getItem().getUuid().equals("b210used-9ab1-4b57-8a89-c0b09854368d"));
		assertThat("The invoice is legit",
		    discount.getItems().get(0).getInvoice().getUuid().equals("fa3e24ef-1877-497c-ba43-7a402aec2239"));
		assertThat("The invoice is legit", discount.getItems().get(0).getAmount() == 2000);
		
	}
	
	@Override
	public void testDeserialize() throws IOException {
		
	}
}
