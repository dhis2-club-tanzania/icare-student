package org.openmrs.module.icare.billing.services.payment.gepg;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.openmrs.*;
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
	
	// Utility method to create BillSubmissionRequest
	public BillSubmissionRequest createGepgPayloadRequest(String uuid, List<Map<String, String>> selectedBills,
	        Integer totalBill) {
		
		System.out.println("Received UUID on Submission Request: " + uuid + selectedBills + totalBill);
		// if (uuid != null) {
		// 	List<Invoice> invoices = billingService.getPatientsInvoices(uuid);
		// 	List<Map<String, Object>> invoiceMaps = new ArrayList<Map<String, Object>>();
		// 	for (Invoice invoice : invoices) {
		// 		invoiceMaps.add(invoice.toMap());
		// 	}
		// 	System.out.println("client invoice ----------------------->" + invoiceMaps);
		// }
		
		// Create and populate BillHdr
		BillHdr billHdr = new BillHdr();
		billHdr.setSpCode("SP111");
		billHdr.setRtrRespFlg("true");
		
		// Create and populate BillTrxInf
		BillTrxInf billTrxInf = new BillTrxInf();
		billTrxInf.setBillId("123456222");
		billTrxInf.setSubSpCode("7001");
		billTrxInf.setSpSysId("LHGSE001");
		billTrxInf.setBillAmt("30000");
		billTrxInf.setMiscAmt("0");
		billTrxInf.setBillExprDt("2018-08-08T07:09:34");
		billTrxInf.setPyrId("40");
		billTrxInf.setPyrName("PATRICK PASCHAL");
		billTrxInf.setBillDesc("Application Fees Payment");
		LocalDateTime now = LocalDateTime.now();
		DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
		String formattedNow = now.format(formatter);
		billTrxInf.setBillGenDt(formattedNow);
		billTrxInf.setBillGenBy("40");
		billTrxInf.setBillApprBy("PATRICK PASCHAL");
		billTrxInf.setPyrCellNum("0767454012");
		billTrxInf.setPyrEmail("patrickkalu199@gmail.com");
		billTrxInf.setCcy("TZS");
		billTrxInf.setBillEqvAmt("30000");
		billTrxInf.setRemFlag("false");
		billTrxInf.setBillPayOpt("3");
		
		// Create and populate BillItems
		BillItems billItems = new BillItems();
		billItems.getBillItem().add(new BillItem("FRRR40", "N", "30000", "30000", "0", "140313"));
		billItems.getBillItem().add(new BillItem("11", "N", "5000", "5000", "0.0", "140371"));
		
		// Set BillItems to BillTrxInf
		billTrxInf.setBillItems(billItems);
		
		// Create and populate RequestData
		RequestData requestData = new RequestData();
		requestData.setRequestId("6474647FD8484909");
		requestData.setBillHdr(billHdr);
		requestData.setBillTrxInf(billTrxInf);
		
		// Create and populate SystemAuth
		SystemAuth systemAuth = new SystemAuth();
		systemAuth.setSystemCode("90019");
		systemAuth.setServiceCode("1001");
		// TODO: Put this on system settings
		systemAuth
		        .setSignature("H1L8loLjkPsQ2BVueqcVX/KVYH7F7kym1TJ448Pi0jye2ACidAikTVwBJb9UYvW7XaLlftTD3m4/dDuvi5mRoemIjO6rizuwI1TWoWst9b1P8BpthKObnofVKwPVKnD6v2GLpfbXwtoiRSuajvkiyJnSCrqsQvtmBmL8ACV3pls5eesYxppsszXEtV/VfilMePOJhfGsIma64baM7sJ8q7LHyujjWT3094Df5oYZEbMDXOPjykCm63vjsEdrrT0A+vz+N7LblmTdHBhtHar52OJmbpNZkbVq/0ZsL1IbX0Wc7SrlU6cWaNuOt0CRJ3bqNnSe8RlO746zkUJtXerYdg==");
		
		// Create and return BillSubmissionRequest
		BillSubmissionRequest billRequest = new BillSubmissionRequest();
		billRequest.setSystemAuth(systemAuth);
		billRequest.setRequestData(requestData);
		return billRequest;
		
	}
	
	public BillSubmissionRequest createGePGPayload(Patient patient, List<InvoiceItem> invoiceItems, Number totalBillAmount,
	        Date billExpirlyDate, String personPhoneAttributeTypeUuid, String personEmailAttributeTypeUuid, String currency,
	        String gepgAuthSignature, String GFSCodeConceptSourceMappingUuid, String spCode, String sytemCode,
	        String serviceCode, String SpSysId, String subSpCode) throws Exception {
		String totalAmount = totalBillAmount.toString();
		String patientNames = patient.getGivenName() + " " + patient.getFamilyName();
		String patientUuid = patient.getUuid();
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
		BillItems billItems = new BillItems();
		for (InvoiceItem invoiceItem : invoiceItems) {
			Concept concept = invoiceItem.getItem().getConcept();
			for (ConceptMap conceptMap : concept.getConceptMappings()) {
				if (conceptMap.getConceptReferenceTerm().getConceptSource().getUuid()
				        .equals(GFSCodeConceptSourceMappingUuid)) {
					// TODO: Formulate the bill item with the GSF code, add exception handling in case the GFS code is not present
					String GFSCode = conceptMap.getConceptReferenceTerm().getCode();
					billItems.getBillItem().add(new BillItem("11", "N", "5000", "5000", "0.0", GFSCode));
				}
			}
		}
		
		// Set the required payload
		BillHdr billHdr = new BillHdr();
		billHdr.setSpCode(spCode);
		billHdr.setRtrRespFlg("true");
		
		// Create and populate BillTrxInf
		BillTrxInf billTrxInf = new BillTrxInf();
		billTrxInf.setBillId(patientUuid);
		billTrxInf.setSubSpCode(subSpCode);
		billTrxInf.setSpSysId(SpSysId);
		billTrxInf.setBillAmt(totalAmount);
		billTrxInf.setMiscAmt("0");
		LocalDateTime now = LocalDateTime.now();
		DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
		String formattedNow = now.format(formatter);
		billTrxInf.setBillGenDt(formattedNow);
		
		LocalDateTime expirationTime = now.plusHours(24);
		String formattedExpirationTime = expirationTime.format(formatter);
		billTrxInf.setBillExprDt(formattedExpirationTime);
		billTrxInf.setPyrId("40");
		billTrxInf.setPyrName(patientNames.toUpperCase());
		billTrxInf.setBillDesc("Hospita Bill Payments");
		billTrxInf.setBillGenBy("UDSM Hospital");
		billTrxInf.setBillApprBy(patientNames.toUpperCase());
		billTrxInf.setPyrCellNum(patientPhoneNumber);
		billTrxInf.setPyrEmail(email);
		billTrxInf.setCcy(currency);
		billTrxInf.setBillEqvAmt(totalAmount);
		billTrxInf.setRemFlag("false");
		billTrxInf.setBillPayOpt("2");
		// Create and populate RequestData
		RequestData requestData = new RequestData();
		requestData.setRequestId(patientUuid);
		requestData.setBillHdr(billHdr);
		requestData.setBillTrxInf(billTrxInf);
		
		// Create and populate SystemAuth
		SystemAuth systemAuth = new SystemAuth();
		systemAuth.setSystemCode(sytemCode);
		systemAuth.setServiceCode(serviceCode);
		systemAuth.setSignature(gepgAuthSignature);
		
		BillSubmissionRequest billRequest = new BillSubmissionRequest();
		billRequest.setSystemAuth(systemAuth);
		billRequest.setRequestData(requestData);
		return billRequest;
	}
}
