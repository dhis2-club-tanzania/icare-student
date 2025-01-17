package org.openmrs.module.icare.core.utils;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;
import java.util.Map;

public class ChildIdOnlySerializer extends StdSerializer<Map<String, Object>> {
	
	protected ChildIdOnlySerializer(Class<Map<String, Object>> t) {
		super(t);
	}
	
	@Override
	public void serialize(Map<String, Object> stringObjectMap, JsonGenerator jsonGenerator,
	        SerializerProvider serializerProvider) throws IOException {
		
	}
}
