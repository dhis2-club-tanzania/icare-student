package org.openmrs.module.icare.core;

import org.openmrs.module.icare.billing.models.ItemPrice;

import javax.mail.internet.InternetAddress;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

public class Message {
	
	private String id;
	
	private String message;
	
	private String recipient;
	
	private String phoneNumber;
	
	private Date dateTime;
	
	private Message.Status status;
	
	public Date getDateTime() {
		return dateTime;
	}
	
	public void setDateTime(Date dateTime) {
		this.dateTime = dateTime;
	}
	
	public Status getStatus() {
		return status;
	}
	
	public void setStatus(Status status) {
		this.status = status;
	}
	
	public String getMessage() {
		return message;
	}
	
	public void setMessage(String message) {
		this.message = message;
	}
	
	public String getId() {
		return id;
	}
	
	public void setId(String id) {
		this.id = id;
	}
	
	public String getRecipient() {
		return recipient;
	}
	
	public void setRecipient(String recipient) {
		this.recipient = recipient;
	}
	
	public String getPhoneNumber() {
		return phoneNumber;
	}
	
	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}
	
	public void addRecipient(javax.mail.Message.RecipientType to, InternetAddress internetAddress) {
	}
	
	public enum Status {
		WAITING, SENT, DELIVERED
	}
	
	public static Message fromMap(Map<String, Object> messageMap) throws ParseException {
		Message message = new Message();
		message.setMessage((String) messageMap.get("message"));
		message.setStatus(Status.valueOf((String) messageMap.get("status")));
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ");
		message.setDateTime(dateFormat.parse((String) messageMap.get("dateTime")));
		message.setRecipient((String) messageMap.get("recipient"));
		message.setId((String) messageMap.get("id"));
		message.setPhoneNumber((String) messageMap.get("phoneNumber"));
		return message;
	}
	
	public Map<String, Object> toMap() {
		Map<String, Object> messageMap = new HashMap<String, Object>();
		messageMap.put("id", this.getId());
		messageMap.put("message", this.getMessage());
		messageMap.put("dateTime", this.getDateTime());
		messageMap.put("status", this.getStatus().name());
		messageMap.put("phoneNumber", this.getPhoneNumber());
		messageMap.put("recipient", this.getRecipient());
		
		return messageMap;
	}
}
