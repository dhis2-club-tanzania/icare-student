package org.openmrs.module.icare.billing.models;

import java.util.Date;
import java.util.UUID;

public class PaymentRequest {
	
	private Integer paymentId; // Payment ID
	
	private UUID uuid; // Unique identifier for the payment
	
	private String invoiceId; // ID of the associated invoice
	
	private String referenceNumber; // Reference number for the payment
	
	private String receivedBy; // User or entity that received the payment
	
	private Integer paymentTypeId; // ID of the payment type
	
	private Date dateCreated; // Date the payment was created
	
	private String status; // Current status of the payment
	
	// Default constructor
	public void Payment() {
	}
	
	// Constructor with parameters
	public void Payment(Integer paymentId, UUID uuid, String invoiceId, String referenceNumber, String receivedBy,
	        Integer paymentTypeId, Date dateCreated, String status) {
		this.paymentId = paymentId;
		this.uuid = uuid;
		this.invoiceId = invoiceId;
		this.referenceNumber = referenceNumber;
		this.receivedBy = receivedBy;
		this.paymentTypeId = paymentTypeId;
		this.dateCreated = dateCreated;
		this.status = status;
	}
	
	// Getter and Setter for paymentId
	public Integer getPaymentId() {
		return paymentId;
	}
	
	public void setPaymentId(Integer paymentId) {
		this.paymentId = paymentId;
	}
	
	// Getter and Setter for uuid
	public UUID getUuid() {
		return uuid;
	}
	
	public void setUuid(UUID uuid) {
		this.uuid = uuid;
	}
	
	// Getter and Setter for invoiceId
	public String getInvoiceId() {
		return invoiceId;
	}
	
	public void setInvoiceId(String invoiceId) {
		this.invoiceId = invoiceId;
	}
	
	// Getter and Setter for referenceNumber
	public String getReferenceNumber() {
		return referenceNumber;
	}
	
	public void setReferenceNumber(String referenceNumber) {
		this.referenceNumber = referenceNumber;
	}
	
	// Getter and Setter for receivedBy
	public String getReceivedBy() {
		return receivedBy;
	}
	
	public void setReceivedBy(String receivedBy) {
		this.receivedBy = receivedBy;
	}
	
	// Getter and Setter for paymentTypeId
	public Integer getPaymentTypeId() {
		return paymentTypeId;
	}
	
	public void setPaymentTypeId(Integer paymentTypeId) {
		this.paymentTypeId = paymentTypeId;
	}
	
	// Getter and Setter for dateCreated
	public Date getDateCreated() {
		return dateCreated;
	}
	
	public void setDateCreated(Date dateCreated) {
		this.dateCreated = dateCreated;
	}
	
	// Getter and Setter for status
	public String getStatus() {
		return status;
	}
	
	public void setStatus(String status) {
		this.status = status;
	}
}
