package org.openmrs.module.icare.core;

import org.codehaus.jackson.map.ObjectMapper;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.net.URL;
import java.util.Map;

public class DTOUtil {
	
	public static Map<String, Object> readDTOFile(String file) throws IOException {
		URL url = DTOUtil.class.getResource(file);
		BufferedReader br = new BufferedReader(new FileReader(url.getPath()));
		StringBuilder sb = new StringBuilder();
		String line = br.readLine();
		
		while (line != null) {
			sb.append(line);
			sb.append(System.lineSeparator());
			line = br.readLine();
		}
		return (new ObjectMapper()).readValue(sb.toString(), Map.class);
	}
}
