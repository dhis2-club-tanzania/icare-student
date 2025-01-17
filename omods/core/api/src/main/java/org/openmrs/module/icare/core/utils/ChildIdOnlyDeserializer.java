package org.openmrs.module.icare.core.utils;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.JsonParser;
import org.codehaus.jackson.JsonProcessingException;
import org.codehaus.jackson.map.DeserializationContext;
import org.codehaus.jackson.map.deser.std.StdDeserializer;
import org.openmrs.BaseOpenmrsObject;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class ChildIdOnlyDeserializer extends StdDeserializer<BaseOpenmrsObject> {
	
	public ChildIdOnlyDeserializer() {
		this(null);
	}
	
	protected ChildIdOnlyDeserializer(Class<?> vc) {
		super(vc);
	}
	
	@Override
	public BaseOpenmrsObject deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException,
	        JsonProcessingException {
		JsonNode node = jp.getCodec().readTree(jp);
		Map<String, Object> obj = new HashMap<String, Object>();
		obj.put("uuid", node.get("uuid").asText());
		BaseOpenmrsObject newBaseOpenmrsObject = new BaseOpenmrsObject() {
			
			@Override
			public Integer getId() {
				return null;
			}
			
			@Override
			public void setId(Integer integer) {
				
			}
		};
		newBaseOpenmrsObject.setUuid(node.get("uuid").asText());
		return newBaseOpenmrsObject;
		/*Class<T> clazz = getType();
		try {
			T newInstance = clazz.getDeclaredConstructor().newInstance();
			newInstance.setUuid(node.get("uuid").asText());
			return newInstance;
		} catch (InstantiationException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			e.printStackTrace();
		} catch (NoSuchMethodException e) {
			e.printStackTrace();
		}
		return null;*/
	}
	/*protected Class<T> getType() {
		Type type = ((ParameterizedType) this.getClass().getGenericSuperclass()).getActualTypeArguments()[0];
		return (Class<T>) type;
	}*/
}
