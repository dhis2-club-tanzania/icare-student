package org.openmrs.module.icare.web.controller;

import org.openmrs.Patient;
import org.openmrs.Visit;
import org.openmrs.api.AdministrationService;
import org.openmrs.api.context.Context;
import org.openmrs.module.icare.ICareConfig;
import org.openmrs.module.icare.billing.models.Invoice;
import org.openmrs.module.icare.billing.models.InvoiceItem;
import org.openmrs.module.icare.billing.services.BillingService;
import org.openmrs.module.icare.billing.services.payment.gepg.BillSubmissionRequest;
import org.openmrs.module.icare.billing.services.payment.gepg.GEPGService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.openmrs.module.webservices.rest.web.RestConstants;

import java.util.*;

@RestController
@RequestMapping(value = "/rest/" + RestConstants.VERSION_1 + "/gepg")
public class GepgBillingController {
	
	@Autowired
	private GEPGService gepgbillService;
	
	@Autowired
	private BillingService billingService;
	
	@RequestMapping(value = "/controlNumber", method = RequestMethod.POST)
	public String submitBill(@RequestBody Map<String, Object> payload) {
		String uuid = (String) payload.get("uuid");
		List<Map<String, String>> selectedBills = (List<Map<String, String>>) payload.get("selectedbills");
		Integer totalBill = (Integer) payload.get("totalBill");
		
		System.out.println("uuid: " + uuid);
		if (uuid == null || uuid.isEmpty()) {
			return "UUID is required";
		}
		System.out.println("Sent payload: " + payload);
		
		String jsonPayload;
		String response = null;
		
		try {
			// Create an instance of BillSubmissionRequest
			BillSubmissionRequest billRequest = new BillSubmissionRequest().createGepgPayloadRequest(uuid, selectedBills,
			    totalBill);
			// Call the non-static method on the instance
			jsonPayload = billRequest.toJson();
			System.out.println("Generated BillSubmissionRequest: " + jsonPayload);
			// Uncomment and use the following line if the method is available
			// response = gepgbillService.submitGepgRequest(jsonPayload);
		}
		catch (JsonProcessingException e) {
			e.printStackTrace();
			return "Error generating JSON payload";
		}
		
		return response;
	}
	
	@RequestMapping(value = "/generatecontrolno", method = RequestMethod.POST)
    public Map<String, Object> generateControlNumber(@RequestBody List<Map<String, Object>> requestPayload) throws Exception {
        Map<String, Object> generatedControlNumberObject = new HashMap<>();
        System.out.println("Payload received: " + requestPayload);

        Visit visit = null;
        Double totalBillAmount = 0.0; 
        String currency = null;
        List<InvoiceItem> invoiceItems = new ArrayList<>();

        for (Map<String, Object> invoiceReference : requestPayload) {
            String uuid = (String) invoiceReference.get("uuid");
            if (uuid == null) {
                throw new IllegalArgumentException("UUID cannot be null");
            }

            if (currency == null) {
                currency = (String) invoiceReference.get("currency");
            }

            Invoice invoice = billingService.getInvoiceDetailsByUuid(uuid);
            System.out.println("Invoice: " + invoice);

            if (invoice == null) {
                throw new IllegalStateException("Invoice not found for UUID: " + uuid);
            }

            visit = invoice.getVisit();
            if (visit == null) {
                throw new IllegalStateException("Visit cannot be null for Invoice: " + uuid);
            }

            for (InvoiceItem invoiceItem : invoice.getInvoiceItems()) {
                totalBillAmount += invoiceItem.getPrice();
                invoiceItems.add(invoiceItem);
            }
        }

        AdministrationService administrationService = Context.getAdministrationService();
        Date billExpDate = new Date();
        String personPhoneNumberAttributeTypeUuid = administrationService.getGlobalProperty(ICareConfig.PHONE_NUMBER_ATTRIBUTE);
        String spCode = administrationService.getGlobalProperty(ICareConfig.SP_CODE);
        String systemCode = administrationService.getGlobalProperty(ICareConfig.SYSTEM_CODE);
        String serviceCode = administrationService.getGlobalProperty(ICareConfig.SERVICE_CODE);
        String spsyId = administrationService.getGlobalProperty(ICareConfig.SERVICE_PROVIDER_ID);
        String subSpCode = administrationService.getGlobalProperty(ICareConfig.SUB_SERVICE_PROVIDER_CODE);
        String personEmailAttributeTypeUuid = administrationService.getGlobalProperty(ICareConfig.ICARE_PERSON_EMAIL_ATTRIBUTE_TYPE);
        String gepgAuthSignature = administrationService.getGlobalProperty(ICareConfig.GEPG_AUTH_SIGNATURE);
        String GFSCodeConceptSourceMappingUuid = administrationService.getGlobalProperty(ICareConfig.GFSCODE_CONCEPT_SOURCE_REFERENCE);
        String clientPrivateKey = administrationService.getGlobalProperty(ICareConfig.CLIENT_PRIVATE_KEY);

        if (currency == null) {
            throw new IllegalArgumentException("Currency cannot be null");
        }
        if (personPhoneNumberAttributeTypeUuid == null || gepgAuthSignature == null) {
            throw new IllegalStateException("One or more global properties are missing");
        }

        BillSubmissionRequest billRequest = new BillSubmissionRequest().createGePGPayload(
            visit.getPatient(),
            invoiceItems,
            totalBillAmount,
            billExpDate,
            personPhoneNumberAttributeTypeUuid,
            personEmailAttributeTypeUuid,
            currency,
            gepgAuthSignature,
            GFSCodeConceptSourceMappingUuid, spCode,
            systemCode,
            serviceCode,
            spsyId,
            subSpCode
        );

        try {
            // Call the non-static method on the instance
            String jsonPayload = billRequest.toJson();
            System.out.println("Generated BillSubmissionRequest: " + jsonPayload);
            generatedControlNumberObject = gepgbillService.submitGepgRequest(jsonPayload, clientPrivateKey);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return generatedControlNumberObject;
    }
}
