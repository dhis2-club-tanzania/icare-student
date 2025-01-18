package org.openmrs.module.icare;

import org.codehaus.jackson.map.ObjectMapper;
import org.junit.Ignore;
import org.junit.Test;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertNotNull;

public abstract class ModelTest<T> {
	
	@Test
	@Ignore("Serialization done in objects")
	public abstract void testSerialize() throws IOException;
	
	@Test
	@Ignore("Serialization done in objects")
	public abstract void testDeserialize() throws IOException;
	
	protected String readFile(String file) throws IOException {
		URL url = this.getClass().getClassLoader().getResource(file);
		BufferedReader br = new BufferedReader(new FileReader(url.getPath()));
		StringBuilder sb = new StringBuilder();
		String line = br.readLine();
		
		while (line != null) {
			sb.append(line);
			sb.append(System.lineSeparator());
			line = br.readLine();
		}
		return sb.toString();
	}
	
	@Test
	@Ignore
	public void testConversion() throws IOException {
		Map<String, Object> result = getMap();
		assertNotNull(result);
		
		T obj = getObject();
		assertNotNull(obj);
		
	}
	
	//Gets object from DTO
	public T getObject() throws IOException {
		Class<T> clazz = getType();
		String data = this.readFile("models/" + clazz.getSimpleName().toLowerCase() + "-dto.json");
		return (T) (new ObjectMapper()).readValue(data, clazz);
	}
	
	public Map<String, Object> getMap() throws IOException {
		Class<T> clazz = getType();
		String data = this.readFile("models/" + clazz.getSimpleName().toLowerCase() + "-dto.json");
		return new ObjectMapper().readValue(data, HashMap.class);
	}
	
	protected Class<T> getType() {
		Type type = ((ParameterizedType) this.getClass().getGenericSuperclass()).getActualTypeArguments()[0];
		return (Class<T>) type;
	}
}
