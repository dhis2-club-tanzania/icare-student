package org.openmrs.module.icare.dhis.services;

import org.apache.commons.collections.IteratorUtils;
import org.openmrs.api.AdministrationService;
import org.openmrs.api.context.Context;
import org.openmrs.api.impl.BaseOpenmrsService;
import org.openmrs.module.icare.dhis.dao.DhisEventTransactionDAO;
import org.openmrs.module.icare.dhis.models.DhisEventTransaction;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Base64;
import java.util.List;

public class DhisEventTransactionServiceImpl extends BaseOpenmrsService implements DhisEventTransactionService {
	
	DhisEventTransactionDAO dhisEventTransactionDAO;
	
	public void setDhisEventTransactionDAO(DhisEventTransactionDAO dhisEventTransactionDAO) {
		this.dhisEventTransactionDAO = dhisEventTransactionDAO;
	}
	
	@Override
	public String createEventTransaction(DhisEventTransaction dhisEventTransaction) {
		URL url;
		
		try {
			
			AdministrationService administrationService = Context.getAdministrationService();
			String instance = administrationService.getGlobalProperty("dhis2.instance");
			String username = administrationService.getGlobalProperty("dhis2.username");
			String password = administrationService.getGlobalProperty("dhis2.password");
			
			url = new URL(instance.concat("/api/event"));
			
			HttpURLConnection con = (HttpURLConnection) url.openConnection();
			
			String userCredentials = username.concat(":").concat(password);
			String basicAuth = "Basic " + new String(Base64.getEncoder().encode(userCredentials.getBytes()));
			
			con.setRequestProperty("Authorization", basicAuth);
			
			con.setRequestMethod("POST");
			con.setRequestProperty("Content-Type", "application/json; utf-8");
			con.setRequestProperty("Accept", "application/json");
			
			con.setDoOutput(true);
			
			String jsonInputString = dhisEventTransaction.getEventPayload().replace("'", "\"");
			
			OutputStream os;
			BufferedReader br;
			
			try {
				os = con.getOutputStream();
				byte[] input = jsonInputString.getBytes("utf-8");
				os.write(input, 0, input.length);
			}
			finally {}
			
			try {
				br = new BufferedReader(new InputStreamReader(con.getInputStream(), "utf-8"));
				StringBuilder response = new StringBuilder();
				String responseLine = null;
				while ((responseLine = br.readLine()) != null) {
					response.append(responseLine.trim());
				}
				
				dhisEventTransaction.setEventResponse(response.toString());
				
				dhisEventTransactionDAO.save(dhisEventTransaction);
				
				return response.toString();
				
			}
			finally {}
			
		}
		catch (MalformedURLException e) {
			
			e.printStackTrace();
			
			return e.toString();
		}
		catch (IOException e) {
			
			e.printStackTrace();
			
			return e.toString();
		}
	}
	
	@Override
	public List<DhisEventTransaction> getEventTransactions() {
		
		List<DhisEventTransaction> dhisEventTransactions = IteratorUtils
		        .toList(dhisEventTransactionDAO.findAll().iterator());
		return dhisEventTransactions;
	}
}
