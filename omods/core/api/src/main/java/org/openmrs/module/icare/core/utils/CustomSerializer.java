package org.openmrs.module.icare.core.utils;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;

public class CustomSerializer<T> extends StdSerializer<T> {
	
	public CustomSerializer() {
		this(null);
	}
	
	public CustomSerializer(Class<T> t) {
		super(t);
	}
	
	@Override
	public void serialize(T t, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
		/*
		//jsonGenerator.writeString("{\"uuid\":\"" + patient.getUuid() + "\"}");

		StringBuilder lang = new StringBuilder();
		jsonGenerator.writeStartObject();
		jsonGenerator.writeStringField("id", patient.getUuid());

		jsonGenerator.writeEndObject();*/
		jsonGenerator.writeString("Value");
	}
}
