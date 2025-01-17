package org.openmrs.module.icare.billing.services.payment.gepg;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.openmrs.GlobalProperty;
import org.openmrs.api.AdministrationService;
import org.openmrs.GlobalProperty;
import org.openmrs.api.AdministrationService;
import org.openmrs.api.context.Context;
import org.openmrs.module.icare.billing.dao.PaymentDAO;
import org.openmrs.module.icare.billing.services.BillingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GEPGService {

    @Autowired
    private PaymentDAO paymentDAO;

    @Autowired
    private BillingService billingService;

    private final Map<String, Map<String, Object>> callbackResponses = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Map<String, Object> submitGepgRequest(String jsonPayload, String signature, String uccUrl) {
        Map<String, Object> responseMap = new ConcurrentHashMap<>();
        HttpURLConnection con = null;

        try {
            URL url = new URL(uccUrl);
            con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("POST");
            con.addRequestProperty("Authorization", "Bearer " + "authToken.getAccessToken()");
            con.addRequestProperty("Content-Type", "application/json");
            con.addRequestProperty("Signature", signature);
            con.setDoInput(true);
            con.setDoOutput(true);

            // Write JSON payload
            try (OutputStream os = con.getOutputStream();
                    BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(os, "UTF-8"))) {
                writer.write(jsonPayload);
                writer.flush();
            }

            // Process the response
            int responseCode = con.getResponseCode();
            responseMap.put("Code", responseCode);

            if (responseCode == HttpURLConnection.HTTP_OK) {
                StringBuilder content = new StringBuilder();
                try (BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()))) {
                    String inputLine;
                    while ((inputLine = in.readLine()) != null) {
                        content.append(inputLine);
                    }
                }

                String responseString = content.toString();
                responseMap.put("response", responseString);

                // Extract relevant data from the response
                Map<String, Object> parsedResponse = parseJsonResponse(responseString);
                String requestId = (String) parsedResponse.get("RequestId");
                String ackCode = (String) parsedResponse.get("SystemAckCode");

                // Check if requestId is null
                if (requestId == null) {
                    responseMap.put("status", "error");
                    responseMap.put("message", "RequestId is null. Unable to fetch control number.");
                    return responseMap;
                }

                // Handle different ackCodes
                if ("R3001".equals(ackCode)) {
                    Integer requestpaymentId = null;
                    requestpaymentId = Integer.parseInt(requestId);
                    String controlNumber = billingService.fetchControlNumber(requestpaymentId);
                    // Save the payload in a global property
                    AdministrationService administrationService = Context.getAdministrationService();
                    GlobalProperty globalProperty = new GlobalProperty();
                    globalProperty.setProperty("gepg.controlNumberGen.icareConnect");
                    globalProperty.setPropertyValue(controlNumber);
                    administrationService.saveGlobalProperty(globalProperty);
                    responseMap.put("status", "success");
                    responseMap.put("controlNumber",
                            controlNumber != null ? controlNumber : "Not found within timeout");
                    responseMap.put("ackCode", ackCode);
                    responseMap.put("message", "Request processed successfully.");
                } else if ("CONS9005".equals(ackCode)) {
                    responseMap.put("status", "error");
                    responseMap.put("ackCode", ackCode);
                    responseMap.put("message", "Request failed: Please check the input values or contact support.");
                } else {
                    responseMap.put("status", "error");
                    responseMap.put("ackCode", ackCode);
                    responseMap.put("message", "Request failed with ack code: " + ackCode);
                }
            } else {
                handleErrorResponse(con, responseMap);
            }
        } catch (Exception e) {
            responseMap.put("Code", 500);
            responseMap.put("error", "Unexpected error: " + (e.getMessage() != null ? e.getMessage() : "null"));
        } finally {
            if (con != null) {
                con.disconnect();
            }
        }
        return responseMap;
    }

    private Map<String, Object> parseJsonResponse(String responseString) {
        Map<String, Object> resultMap = new ConcurrentHashMap<>();
        try {
            JsonNode jsonNode = objectMapper.readTree(responseString);

            // Extract SystemAuth information
            JsonNode systemAuth = jsonNode.get("SystemAuth");
            if (systemAuth != null) {
                String serviceCode = systemAuth.path("ServiceCode").asText();
                String signature = systemAuth.path("Signature").asText();
                resultMap.put("ServiceCode", serviceCode);
                resultMap.put("Signature", signature);
            }

            // Extract AckData information
            JsonNode ackData = jsonNode.get("AckData");
            if (ackData != null) {
                String requestId = ackData.path("RequestId").asText();
                String systemAckCode = ackData.path("SystemAckCode").asText();
                resultMap.put("RequestId", requestId);
                resultMap.put("SystemAckCode", systemAckCode);
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
        return resultMap;
    }

    private void handleErrorResponse(HttpURLConnection con, Map<String, Object> responseMap) throws IOException {
        try (BufferedReader errorReader = new BufferedReader(new InputStreamReader(con.getErrorStream()))) {
            StringBuilder errorContent = new StringBuilder();
            String errorLine;
            while ((errorLine = errorReader.readLine()) != null) {
                errorContent.append(errorLine);
            }
            responseMap.put("error", errorContent.toString());
        }
    }
}
