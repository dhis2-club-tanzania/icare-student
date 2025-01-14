package org.openmrs.module.icare.core.utils;

import java.util.HashMap;
import java.util.Map;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.openmrs.module.icare.ICareConfig;
import org.openmrs.module.icare.core.JSONConverter;

@Entity
@Table(name = "outgoing_sms")
public class OutgoingSMS implements JSONConverter {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	protected Long id;
	
	protected String recipient;
	
	protected String message;
	
	protected String status; // message status like sent, failed or queued
	
	public OutgoingSMS() {
		
	}
	
	public OutgoingSMS(Long id, String to, String msg, String status) {
		this.id = id;
		this.recipient = to;
		this.message = msg;
		this.status = status;
	}
	
	public OutgoingSMS(String to, String msg, String status) {
		this.recipient = to;
		this.message = msg;
		this.status = status;
	}
	
	public Long getId() {
		return id;
	}
	
	public void setId(Long id) {
		this.id = id;
	}
	
	public String getRecipient() {
		return recipient;
	}
	
	public void setRecipient(String recipient) {
		this.recipient = recipient;
	}
	
	public String getMessage() {
		return message;
	}
	
	public void setMessage(String msg) {
		this.message = msg;
	}
	
	public String getStatus() {
		return status;
	}
	
	public void setStatus(String status) {
		this.status = status;
	}
	
	@Override
    public Map<String, Object> toMap() throws Exception {
        Map<String, Object> map = new HashMap<>();
        map.put("event", ICareConfig.EVENT_SEND);

        Map<String, Object> messageObject = new HashMap<>();
        messageObject.put("id", String.valueOf(id));
        messageObject.put("to", recipient);
        messageObject.put("message", message);

        map.put("messages", messageObject);
        return map;
    }
}
