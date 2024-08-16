package org.openmrs.module.icare.core.models;

public class MessagePayload {
	
	private String recipient;
	
	private String message;
	
	public MessagePayload() {
		
	}
	
	public MessagePayload(String to, String msg) {
		this.recipient = to;
		this.message = msg;
	}
	
	public String getRecipient() {
		return recipient;
	}
	
	public void setRecipient(String to) {
		this.recipient = to;
	}
	
	public String getMessage() {
		return message;
	}
	
	public void setMessage(String msg) {
		this.recipient = msg;
	}
	
}
