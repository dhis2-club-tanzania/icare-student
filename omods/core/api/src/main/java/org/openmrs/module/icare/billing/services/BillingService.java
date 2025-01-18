package org.openmrs.module.icare.billing.services;

import org.aopalliance.intercept.MethodInvocation;
import org.openmrs.Concept;
import org.openmrs.Encounter;
import org.openmrs.Order;
import org.openmrs.Patient;
import org.openmrs.Visit;
import org.openmrs.annotation.Authorized;
import org.openmrs.api.APIException;
import org.openmrs.api.OpenmrsService;
import org.openmrs.module.icare.billing.OrderMetaData;
import org.openmrs.module.icare.billing.VisitMetaData;
import org.openmrs.module.icare.billing.models.Discount;
import org.openmrs.module.icare.billing.models.Invoice;
import org.openmrs.module.icare.billing.models.InvoiceItem;
import org.openmrs.module.icare.billing.models.Payment;
import org.openmrs.module.icare.billing.services.insurance.SyncResult;
import org.openmrs.module.icare.core.utils.VisitWrapper;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Transactional
public interface BillingService extends OpenmrsService {
	
	/**
	 * Returns an invoice that has been created. It can be called by any authenticated user. It is
	 * fetched in read only transaction.
	 * 
	 * @param uuid
	 * @return
	 * @throws APIException
	 */
	@Authorized()
	@Transactional(readOnly = true)
	Invoice createInvoice(Invoice invoice) throws APIException;
	
	/**
	 * Returns an invoice that has been created based on the encounter.
	 * 
	 * @param encounter
	 * @return Invoice
	 * @throws APIException
	 */
	@Authorized()
	@Transactional()
	Invoice createInvoice(Encounter encounter) throws APIException;
	
	List<Invoice> getPendingInvoices(String patientUuid);
	
	List<Payment> getPatientPayments(String patientUuid);
	
	Payment confirmPayment(Payment payment) throws Exception;
	
	Discount discountInvoice(Discount discount) throws Exception;
	
	List<Discount> getPatientDiscounts(String patientUuid);
	
	Concept createDiscountCriteria(Concept discountCriteria);
	
	VisitMetaData validateVisitMetaData(VisitWrapper visit) throws Exception;
	
	@Transactional()
	Visit createVisit(MethodInvocation invocation) throws Throwable;
	
	List<Invoice> getPatientsInvoices(String patientUuid);
	
	<T extends Order> Order processOrder(OrderMetaData<T> orderMetaData, Double quantity);
	
	InvoiceItem getInvoiceItemByOrder(Order order);
	
	SyncResult syncInsurance(String insurance) throws Exception;
	
	List<Invoice> getInvoicesByVisitUuid(String visit);
	
	Invoice getInvoiceDetailsByUuid(String uuid);
	
	Order createOrderForOngoingIPDPatients() throws Exception;
	
	Order createOrderForOngoingDeceasedPatients() throws Exception;
	
	List<Object[]> getTotalAmountFromPaidInvoices(Date startDate, Date endDate, String provider) throws Exception;
	
	Map<String, Object> processGepgCallbackResponse(Map<String, Object> feedBack) throws Exception;
	
	String fetchControlNumber(Integer requestId) throws Exception;
	
	List<Payment> getAllPaymentsWithStatus() throws Exception;
	
	Map<String, Object> createGePGPayload(Patient patient, List<InvoiceItem> invoiceItems, Number totalBillAmount,
	        Date billExpirlyDate, String personPhoneAttributeTypeUuid, String personEmailAttributeTypeUuid, String currency,
	        String gepgAuthSignature, String GFSCodeConceptSourceMappingUuid, String spCode, String sytemCode,
	        String serviceCode, String SpSysId, String subSpCode, String clientPrivateKey, String pkcs12Path,
	        String pkcs12Password, String enginepublicKey, String billId) throws Exception;
	
	String signatureData(String rowData) throws Exception;
}
