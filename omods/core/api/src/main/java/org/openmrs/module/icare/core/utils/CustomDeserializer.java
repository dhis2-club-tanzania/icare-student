package org.openmrs.module.icare.core.utils;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import org.openmrs.Patient;

import java.io.IOException;

public class CustomDeserializer extends StdDeserializer<Patient> {
	
	protected CustomDeserializer(Class<?> vc) {
		super(vc);
	}
	
	@Override
	public Patient deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException,
	        JsonProcessingException {
		return null;
	}
}
