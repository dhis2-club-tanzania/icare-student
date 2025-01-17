package org.openmrs.module.icare.dhis.services;

import org.apache.commons.collections.IteratorUtils;
import org.openmrs.Concept;
import org.openmrs.User;
import org.openmrs.api.AdministrationService;
import org.openmrs.api.context.Context;
import org.openmrs.api.impl.BaseOpenmrsService;
import org.openmrs.module.icare.dhis.dao.DhisDatasetTransactionDAO;
import org.openmrs.module.icare.dhis.models.DhisDatasetTransaction;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DhisDatasetTransactionServiceImpl extends BaseOpenmrsService implements DhisDatasetTransactionService {
	
	DhisDatasetTransactionDAO dhisDatasetTransactionDAO;
	
	public void setDhisDatasetTransactionDAO(DhisDatasetTransactionDAO dhisDatasetTransactionDAO) {
		this.dhisDatasetTransactionDAO = dhisDatasetTransactionDAO;
	}
	
	@Override
	public String createTransaction(DhisDatasetTransaction dhisDatasetTransaction) {
		
		URL url;
		
		try {
			
			AdministrationService administrationService = Context.getAdministrationService();
			String instance = administrationService.getGlobalProperty("dhis2.instance");
			String username = administrationService.getGlobalProperty("dhis2.username");
			String password = administrationService.getGlobalProperty("dhis2.password");
			
			url = new URL(instance.concat("/api/dataValueSets?idScheme=UID&orgUnitIdScheme=UID"));
			
			//TODO: CLARIFY URL FORMAT
			//	url = new URL(instance.concat("/api/dataValueSets?idScheme=UID&orgUnitIdScheme=UID"));
			
			HttpURLConnection con = (HttpURLConnection) url.openConnection();
			
			String userCredentials = username.concat(":").concat(password);
			String basicAuth = "Basic " + new String(Base64.getEncoder().encode(userCredentials.getBytes()));
			
			con.setRequestProperty("Authorization", basicAuth);
			
			con.setRequestMethod("POST");
			con.setRequestProperty("Content-Type", "application/json; utf-8");
			con.setRequestProperty("Accept", "application/json");
			
			con.setDoOutput(true);
			
			String jsonInputString = dhisDatasetTransaction.getReportPayload().replace("'", "\"");
			
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
				
				//				User user = Context.getAuthenticatedUser();
				
				dhisDatasetTransaction.setReportResponse(response.toString());
				//				dhisTransaction.setCreator(user);
				
				//				Map<String, Object> newObject = new HashMap<String, Object>();
				//				newObject.put("object", dhisTransaction.toMap().toString());
				//				newObject.put("user", Context.getAuthenticatedUser());
				//
				//				return newObject.toString();
				
				dhisDatasetTransactionDAO.save(dhisDatasetTransaction);
				
				return response.toString();
				
				//								return dhisTransaction.toString();
				
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
	public DhisDatasetTransaction updateDhisTransaction(DhisDatasetTransaction dhisDatasetTransaction) {
		return null;
	}
	
	@Override
	public List<DhisDatasetTransaction> getAllDhisTransactions() {
		return IteratorUtils.toList(dhisDatasetTransactionDAO.findAll().iterator());
	}
	
	@Override
	public List<DhisDatasetTransaction> getDhisTransactionsByPeriod(String period) {
		return dhisDatasetTransactionDAO.getDhisTransactionByPeriod(period);
	}
	
	@Override
	public List<DhisDatasetTransaction> getDhisTransactionsByReportId(String report) {
		return dhisDatasetTransactionDAO.getDhisTransactionByPeriod(report);
	}
	
	@Override
	public List<DhisDatasetTransaction> getDhisTransactionsByPeriodAndReportId(String period, String report) {
		return dhisDatasetTransactionDAO.getDhisTransactionByPeriodAndReport(report, period);
	}
}
