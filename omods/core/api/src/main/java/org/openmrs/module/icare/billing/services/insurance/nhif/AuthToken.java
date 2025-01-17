package org.openmrs.module.icare.billing.services.insurance.nhif;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.Date;
import java.util.Map;

public class AuthToken {
	
	private String accessToken;
	
	private String tokenType;
	
	private NHIFServer server;
	
	private Date expiry;
	
	AuthToken() {
	}
	
	public static AuthToken fromJSONString(String json, NHIFServer nHIFServer) throws IOException {
		AuthToken authToken = new AuthToken();
		
		ObjectMapper mapper = new ObjectMapper();
		Map<String, Object> resultMap = mapper.readValue(json, Map.class);
		authToken.setAccessToken((String) resultMap.get("access_token"));
		authToken.setTokenType((String) resultMap.get("token_type"));
		authToken.setServer(nHIFServer);
		int expires_in = (int) resultMap.get("expires_in");
		authToken.setExpiry(new Date(System.currentTimeMillis() + expires_in));
		return authToken;
	}
	
	public String getAccessToken() {
		return accessToken;
	}
	
	public void setAccessToken(String accessToken) {
		this.accessToken = accessToken;
	}
	
	public String getTokenType() {
		return tokenType;
	}
	
	public void setTokenType(String tokenType) {
		this.tokenType = tokenType;
	}
	
	public Date getExpiry() {
		return expiry;
	}
	
	public void setExpiry(Date expiry) {
		this.expiry = expiry;
	}
	
	public NHIFServer getServer() {
		return server;
	}
	
	public void setServer(NHIFServer server) {
		this.server = server;
	}
}
