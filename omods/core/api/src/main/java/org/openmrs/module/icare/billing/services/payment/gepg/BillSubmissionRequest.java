package org.openmrs.module.icare.billing.services.payment.gepg;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.security.cert.Certificate;
import java.io.FileInputStream;
import java.security.KeyStore;
import org.openmrs.*;
import java.net.URL;
import org.openmrs.api.AdministrationService;
import org.openmrs.api.context.Context;
import org.openmrs.module.icare.ICareConfig;
import org.openmrs.module.icare.billing.models.Invoice;
import org.openmrs.module.icare.billing.models.InvoiceItem;
import org.openmrs.module.icare.billing.services.BillingService;
import org.springframework.beans.factory.annotation.Autowired;

import com.fasterxml.jackson.annotation.JsonProperty;

public class BillSubmissionRequest {
	
	@Autowired
	BillingService billingService;
	
	@JsonProperty("SystemAuth")
	private SystemAuth systemAuth;
	
	@JsonProperty("RequestData")
	private RequestData requestData;
	
	public String toJson() throws JsonProcessingException {
		ObjectMapper mapper = new ObjectMapper();
		return mapper.writeValueAsString(this);
	}
	
	// Setter Methods
	public void setBillHdr(BillHdr billHdr) {
		if (requestData == null) {
			requestData = new RequestData();
		}
		requestData.setBillHdr(billHdr);
	}
	
	public void setBillTrxInf(BillTrxInf billTrxInf) {
		if (requestData == null) {
			requestData = new RequestData();
		}
		requestData.setBillTrxInf(billTrxInf);
	}
	
	public void setSystemAuth(SystemAuth systemAuth) {
		this.systemAuth = systemAuth;
	}
	
	public void setRequestId(String requestId) {
		if (requestData == null) {
			requestData = new RequestData();
		}
		requestData.setRequestId(requestId);
	}
	
	public void setRequestData(RequestData requestData) {
		this.requestData = requestData;
	}
	
	public Map<String, Object> createGePGPayload(Patient patient, List<InvoiceItem> invoiceItems,
			Number totalBillAmount,
			Date billExpirlyDate, String personPhoneAttributeTypeUuid, String personEmailAttributeTypeUuid,
			String currency,
			String gepgAuthSignature, String GFSCodeConceptSourceMappingUuid, String spCode, String sytemCode,
			String serviceCode, String SpSysId, String subSpCode, String clientPrivateKey,String pkcs12Path, String pkcs12Password,String enginepublicKey,String billId) throws Exception {
		AdministrationService administrationService = Context.getAdministrationService();
		// Validate inputs
		if (patient == null) {
			throw new IllegalArgumentException("Patient cannot be null");
		}
		if (invoiceItems == null || invoiceItems.isEmpty()) {
			throw new IllegalArgumentException("Invoice items cannot be null or empty");
		}
		if (currency == null) {
			throw new IllegalArgumentException("Currency cannot be null");
		}
		if (gepgAuthSignature == null) {
			gepgAuthSignature = "";
		}
		if (GFSCodeConceptSourceMappingUuid == null) {
			throw new IllegalArgumentException("GFS Code Concept Source Mapping UUID cannot be null");
		}
		if (spCode == null || sytemCode == null || serviceCode == null || SpSysId == null || subSpCode == null) {
			String missingParams = "";
			if (spCode == null)
				missingParams += "spCode ";
			if (sytemCode == null)
				missingParams += "systemCode ";
			if (serviceCode == null)
				missingParams += "serviceCode ";
			if (SpSysId == null)
				missingParams += "SpSysId ";
			if (subSpCode == null)
				missingParams += "subSpCode ";
			throw new IllegalArgumentException("Missing system parameters: " + missingParams.trim());
		}

		// Retrieve patient attributes
		String patientNames = patient.getGivenName() + " " + patient.getFamilyName();
		String patientUuid = patient.getId().toString();
		String patientPhoneNumber = "";
		String email = "";
		for (PersonAttribute attribute : patient.getAttributes()) {
			if (personPhoneAttributeTypeUuid != null
					&& attribute.getAttributeType().getUuid().equals(personPhoneAttributeTypeUuid)) {
				patientPhoneNumber = attribute.getValue();
			} else if (personEmailAttributeTypeUuid != null
					&& attribute.getAttributeType().getUuid().equals(personEmailAttributeTypeUuid)) {
				email = attribute.getValue();
			}
		}

		// BillItems generation

		BillItems billItems = new BillItems();

		for (InvoiceItem invoiceItem : invoiceItems) {
			Drug drug = invoiceItem.getItem().getDrug();
			Concept concept = invoiceItem.getItem().getConcept();

			if (drug == null && concept == null) {
				throw new IllegalStateException("Concept can not be null for InvoiceItem" + drug + concept);
			} else if (concept != null) {
				for (ConceptMap conceptMap : concept.getConceptMappings()) {
					if (conceptMap.getConceptReferenceTerm().getConceptSource().getUuid()
							.equals(GFSCodeConceptSourceMappingUuid)) {
						String GFSCode = conceptMap.getConceptReferenceTerm().getCode();
						billItems.getBillItem().add(
								new BillItem(invoiceItem.getItem().getId().toString(), "N",
										invoiceItem.getPrice().toString(),
										invoiceItem.getPrice().toString(), "0.0", GFSCode));
					}else {
						throw new IllegalStateException("Please verify GFS CODE concept mapping if configured in a correct way");
					}
				}
			} else if (drug != null) {
				Concept drugConcept = drug.getConcept();
				GlobalProperty globalProperty = new GlobalProperty();
				for (ConceptMap conceptMap : drugConcept.getConceptMappings()) {
					if (conceptMap.getConceptReferenceTerm().getConceptSource().getUuid()
							.equals(GFSCodeConceptSourceMappingUuid)) {
						globalProperty.setProperty("iCare.gepg.DrugConcept.icareConnect");
						globalProperty.setPropertyValue("if condition meet");
						administrationService.saveGlobalProperty(globalProperty);
						String GFSCode = conceptMap.getConceptReferenceTerm().getCode();
						billItems.getBillItem().add(
								new BillItem(invoiceItem.getItem().getId().toString(), "N",
										invoiceItem.getPrice().toString(),
										invoiceItem.getPrice().toString(), "0.0", GFSCode));
					} else {
						throw new IllegalStateException("Please verify GFS CODE concept mapping if configured in a correct way");
					}
				}
			}

		}

		// Create and populate BillHdr
		BillHdr billHdr = new BillHdr();
		billHdr.setSpCode(spCode);
		billHdr.setRtrRespFlg("true");

		// Create and populate BillTrxInf
		BillTrxInf billTrxInf = new BillTrxInf();
		billTrxInf.setBillId(billId);
		billTrxInf.setSubSpCode(subSpCode);
		billTrxInf.setSpSysId(SpSysId);
		billTrxInf.setBillAmt(totalBillAmount.toString());
		billTrxInf.setMiscAmt("0");
		LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        String formattedNow = now.format(formatter);
        billTrxInf.setBillGenDt(formattedNow);

		LocalDateTime expirationTime = now.plusHours(24);
		String formattedExpirationTime = expirationTime.format(formatter);
		billTrxInf.setBillExprDt(formattedExpirationTime);
		billTrxInf.setPyrId("40");
		billTrxInf.setPyrName(patientNames.toUpperCase());
		billTrxInf.setBillDesc("Hospital Bill Payments");
		billTrxInf.setBillGenBy("UDSM Hospital");
		billTrxInf.setBillApprBy(patientNames.toUpperCase());
		billTrxInf.setPyrCellNum(patientPhoneNumber);
		billTrxInf.setPyrEmail(email);
		billTrxInf.setCcy(currency);
		billTrxInf.setBillEqvAmt(totalBillAmount.toString());
		billTrxInf.setRemFlag("false");
		billTrxInf.setBillPayOpt("2");
		billTrxInf.setBillItems(billItems);
		// Create and populate RequestData
		RequestData requestData = new RequestData();
		requestData.setRequestId(patientUuid);
		requestData.setBillHdr(billHdr);
		requestData.setBillTrxInf(billTrxInf);

		// Create and populate SystemAuth
		SystemAuth systemAuth = new SystemAuth();
		systemAuth.setSystemCode(sytemCode);
		systemAuth.setServiceCode(serviceCode);

		// Create and return BillSubmissionRequest
		BillSubmissionRequest billRequest = new BillSubmissionRequest();
		billRequest.setSystemAuth(systemAuth);
		billRequest.setRequestData(requestData);

		// Serialize RequestData to JSON for signing
		String requestDataJson = new ObjectMapper().writeValueAsString(requestData);
		
		// Save the payload in a global property
		GlobalProperty globalProperty = new GlobalProperty();
		globalProperty.setProperty("gepg.requestDataJson.icareConnect");
		globalProperty.setPropertyValue(requestDataJson);
		administrationService.saveGlobalProperty(globalProperty);

        // Sign the request data
        String signature = SignatureUtils.signData(requestDataJson,clientPrivateKey);
		systemAuth.setSignature(signature);

		Map<String, Object> result = new HashMap<>();
		result.put("billRequest", billRequest);
		result.put("signature", signature);

		return result;
	}
	
	public Map<String, Object> generateErrorResponse(String errorMessage) throws Exception {
        Map<String, Object> errorResponse = new HashMap<>();
        AdministrationService administrationService = Context.getAdministrationService();
        String clientPrivateKey = administrationService.getGlobalProperty(ICareConfig.CLIENT_PRIVATE_KEY);

            // AckData as per your requested format
            Map<String, Object> ackData = new HashMap<>();
            ackData.put("Description", errorMessage);
            ackData.put("RequestId", null);
            ackData.put("SystemAckCode", "0");

            // Serialize RequestData to JSON for signing
            String requestDataJson = new ObjectMapper().writeValueAsString(ackData);
            String signature = SignatureUtils.signData(requestDataJson, clientPrivateKey);

            // SystemAuth as per your requested format
            Map<String, Object> systemAuth = new HashMap<>();
            systemAuth.put("SystemCode", "1001");
            systemAuth.put("Signature", signature);

            errorResponse.put("AckData", ackData);
            errorResponse.put("SystemAuth", systemAuth);

            return errorResponse;

    }
}
