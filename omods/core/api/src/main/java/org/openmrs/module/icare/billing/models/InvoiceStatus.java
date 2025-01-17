package org.openmrs.module.icare.billing.models;

import org.openmrs.User;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "bl_invoice_status")
public class InvoiceStatus {
	
	@Id
	@GeneratedValue()
	@Column(name = "invoice_status_id", unique = true, nullable = false)
	private Integer id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "invoice_id")
	private Invoice invoice;
	
	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;
	
	@Column(name = "remarks", length = 65535)
	private String remarks;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "timestamp", length = 19)
	//@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-ddTHH:mm:ss.SSSZ")
	private Date timestamp;
	
	@Column(name = "status", length = 32)
	private String status;
	
	public Integer getId() {
		return id;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}
	
	public Invoice getInvoice() {
		return invoice;
	}
	
	public void setInvoice(Invoice invoice) {
		this.invoice = invoice;
	}
	
	public User getUser() {
		return user;
	}
	
	public void setUser(User user) {
		this.user = user;
	}
	
	public String getRemarks() {
		return remarks;
	}
	
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	
	public Date getTimestamp() {
		return timestamp;
	}
	
	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
	}
	
	public String getStatus() {
		return status;
	}
	
	public void setStatus(String status) {
		this.status = status;
	}
}
