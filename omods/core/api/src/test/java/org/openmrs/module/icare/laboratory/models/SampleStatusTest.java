package org.openmrs.module.icare.laboratory.models;

import org.codehaus.jackson.map.ObjectMapper;
import org.junit.Ignore;
import org.openmrs.User;
import org.openmrs.module.icare.ModelTest;

import java.io.IOException;
import java.util.Date;
import java.util.Map;

import static org.hamcrest.MatcherAssert.assertThat;

@Ignore
public class SampleStatusTest extends ModelTest<SampleStatus> {
	
	@Override
	public void testSerialize() throws IOException {
		Map<String, Object> result = getMap();
		SampleStatus sampleStatus = getObject();
		
		assertThat("Sample is is set", ((Map) result.get("sample")).get("uuid").equals(sampleStatus.getSample().getUuid()));
		assertThat("User is is set", ((Map) result.get("user")).get("uuid").equals(sampleStatus.getUser().getUuid()));
		assertThat("Remark is is set", result.get("remarks").equals(sampleStatus.getRemarks()));
		assertThat("Status is is set", result.get("status").equals(sampleStatus.getStatus()));
		assertThat("Created is is set", result.get("timestamp").equals(sampleStatus.getTimestamp()));
	}
	
	@Override
	public void testDeserialize() throws IOException {
		//Given
		SampleStatus sampleStatus = new SampleStatus();
		sampleStatus.setStatus("status");
		sampleStatus.setRemarks("remarks");
		sampleStatus.setTimestamp(new Date());
		User user = new User();
		user.setUuid("userid");
		sampleStatus.setUser(user);
		
		Sample sample = new Sample();
		sample.setId(1);
		sample.setUuid("sampleuuid");
		sampleStatus.setSample(sample);
		
		//When
		String json = (new ObjectMapper()).writeValueAsString(sampleStatus);
		
		Map<String, Object> result = (new ObjectMapper()).readValue(json, Map.class);
		
		//Then
		assertThat("Sample is set", ((Map) result.get("sample")).get("uuid").equals(sampleStatus.getSample().getUuid()));
		assertThat("User is set", ((Map) result.get("user")).get("uuid").equals(sampleStatus.getUser().getUuid()));
		assertThat("Status is set", result.get("status").equals(sampleStatus.getStatus()));
		assertThat("Remarks is set", result.get("remarks").equals(sampleStatus.getRemarks()));
		assertThat("Timestamp are set", result.get("timestamp") != null);
	}
}
