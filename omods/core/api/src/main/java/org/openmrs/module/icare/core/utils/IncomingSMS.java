package org.openmrs.module.icare.core.utils;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "incoming_sms")
public class IncomingSMS {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String sender;
	
	@Column(name = "message_content")
	private String messageContent;
	
	@Column(name = "message_type")
	private String messageType;
	
	public IncomingSMS() {
		
	}
	
	public IncomingSMS(Long id, String from, String content, String msgType) {
		this.id = id;
		this.sender = from;
		this.messageContent = content;
		this.messageType = msgType;
	}
	
	public IncomingSMS(String from, String content, String msgType) {
		this.sender = from;
		this.messageContent = content;
		this.messageType = msgType;
	}
	
	public Long getId() {
		return id;
	}
	
	public void setId(Long id) {
		this.id = id;
	}
	
	public String getMessageType() {
		return messageType;
	}
	
	public void setMessageType(String msgType) {
		this.messageType = msgType;
	}
	
	public String getMessageContent() {
		return messageContent;
	}
	
	public void setMessageContent(String msg) {
		this.messageContent = msg;
	}
	
	public String getSender() {
		return sender;
	}
	
	public void setSender(String from) {
		this.sender = from;
	}
	
}
