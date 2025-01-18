package org.openmrs.module.icare.laboratory.models;

import org.openmrs.module.icare.ModelTest;

import java.io.IOException;
import java.util.Map;

public class SampleTest extends ModelTest<Sample> {
	
	@Override
	public void testSerialize() throws IOException {
		Map<String, Object> result = getMap();
		/*Sample sample = getObject();
		
		assertThat("Visit is is set", result.get("visit").equals(sample.getVisit().getUuid()));
		assertThat("Label is set", result.get("criteria").equals(sample.getLabel()));
		assertThat("Concept is set", result.get("concept").equals(sample.getConcept().getUuid()));
		assertThat("Sample Statuses are set", result.get("items") != null);
		assertThat("Sample Orders are set", result.get("items") != null);*/
		
	}
	
	@Override
	public void testDeserialize() throws IOException {
		
	}
}
