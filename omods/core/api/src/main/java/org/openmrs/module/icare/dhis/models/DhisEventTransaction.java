package org.openmrs.module.icare.dhis.models;

import org.openmrs.BaseOpenmrsData;

import javax.persistence.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@Entity
@Table(name = "dh_event_transaction")
public class DhisEventTransaction extends BaseOpenmrsData implements java.io.Serializable {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "dh_event_transaction_id")
	private Integer id;
	
	@Column(name = "dh_event_identifier", length = 65535)
	private String eventIdentifier;
	
	@Column(name = "dh_event_program", length = 65535)
	private String eventProgram;
	
	@Column(name = "dh_event_date", length = 65535)
	private Date eventDate;
	
	@Column(name = "dh_event_payload", length = 65535)
	private String eventPayload;
	
	@Column(name = "dh_event_response", length = 65535)
	private String eventResponse;
	
	@Override
	public Integer getId() {
		return id;
	}
	
	@Override
	public void setId(Integer id) {
		this.id = id;
	}
	
	public String getEventIdentifier() {
		return eventIdentifier;
	}
	
	public void setEventIdentifier(String eventIdentifier) {
		this.eventIdentifier = eventIdentifier;
	}
	
	public String getEventProgram() {
		return eventProgram;
	}
	
	public void setEventProgram(String eventProgram) {
		this.eventProgram = eventProgram;
	}
	
	public Date getEventDate() {
		return eventDate;
	}
	
	public void setEventDate(Date eventDate) {
		this.eventDate = eventDate;
	}
	
	public String getEventPayload() {
		return eventPayload;
	}
	
	public void setEventPayload(String eventPayload) {
		this.eventPayload = eventPayload;
	}
	
	public String getEventResponse() {
		return eventResponse;
	}
	
	public void setEventResponse(String eventResponse) {
		this.eventResponse = eventResponse;
	}
	
	public static DhisEventTransaction fromMap(Map<String, Object> transactionMap) throws ParseException {
		DhisEventTransaction newDhisEvent = new DhisEventTransaction();
		
		newDhisEvent.setEventIdentifier((String) transactionMap.get("identifier"));
		newDhisEvent.setEventPayload((String) transactionMap.get("eventPayload"));
		newDhisEvent.setEventProgram((String) transactionMap.get("eventProgram"));
		newDhisEvent.setEventResponse((String) transactionMap.get("eventResponse"));
		
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd", Locale.ENGLISH);
		Date date = formatter.parse((String) transactionMap.get("eventDate"));
		newDhisEvent.setEventDate(date);
		
		return newDhisEvent;
	}
	
	public Map<String, Object> toMap() {
		HashMap<String, Object> transactionMap = new HashMap<String, Object>();
		
		transactionMap.put("identifier", this.getEventIdentifier());
		transactionMap.put("uuid", this.getUuid());
		transactionMap.put("transactionDate", this.getDateCreated());
		transactionMap.put("eventResponse", this.getEventResponse());
		transactionMap.put("eventPayload", this.getEventPayload());
		transactionMap.put("eventDate", this.getEventDate());
		transactionMap.put("eventProgram", this.getEventProgram());
		Map<String, Object> creatorObject = new HashMap<String, Object>();
		if (this.getCreator() != null) {
			creatorObject.put("uuid", this.getCreator().getUuid());
			creatorObject.put("display", this.getCreator().getDisplayString());
		}
		transactionMap.put("user", creatorObject);
		
		return transactionMap;
	}
	
}
