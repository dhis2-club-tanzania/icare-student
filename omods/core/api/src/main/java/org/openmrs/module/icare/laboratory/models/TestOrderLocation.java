package org.openmrs.module.icare.laboratory.models;

import javax.persistence.*;
import org.openmrs.*;
import org.openmrs.Concept;
import org.openmrs.Location;
import java.util.*;

@Entity
@Table(name = "lb_test_order_location")
public class TestOrderLocation {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "test_order_location_id", unique = true, nullable = false)
	private int id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "concept_id")
	private Concept concept;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "location_id")
	private Location location;
	
	@Column(name = "created_on")
	private Date dateTime;
	
	@Column(name = "created_by")
	private User user;
	
	public int getId() {
		return this.id;
	}
	
	public void setId(int id) {
		this.id = id;
	}
	
	public Concept getConcept() {
		return this.concept;
	}
	
	public void setConcept(Concept concept) {
		this.concept = concept;
	}
	
	public void setLocation(Location location) {
		this.location = location;
	}
	
	public Location getLocation() {
		return this.location;
	}
	
	public Date getDateTime() {
		return dateTime;
	}
	
	public void setDateTime(Date dateTime) {
		this.dateTime = dateTime;
	}
	
	public User getUser() {
		return this.user;
	}
	
	public void setUser(User user) {
		this.user = user;
	}
	
	public static TestOrderLocation fromMap(Map<String, Object> testOrderLocationMap) {
		
		//		samplemap
		//		{
		//			concept: {uuid},
		//			location: {uuid},
		//			
		//		}
		
		TestOrderLocation testOrderLocation = new TestOrderLocation();
		
		//Concept
		Concept concept = new Concept();
		concept.setUuid((String) ((Map<String, Object>) testOrderLocationMap.get("concept")).get("uuid"));
		testOrderLocation.setConcept(concept);
		
		//Location
		Location location = new Location();
		location.setUuid((String) ((Map<String, Object>) testOrderLocationMap.get("location")).get("uuid"));
		testOrderLocation.setLocation(location);
		
		User user = new User();
		location.setUuid((String) ((Map<String, Object>) testOrderLocationMap.get("user")).get("uuid"));
		testOrderLocation.setUser(user);
		
		return testOrderLocation;
	}
	
	public Map<String, Object> toMap() {
		
		HashMap<String, Object> testOrderLocationMap = new HashMap<String, Object>();
		
		HashMap<String, Object> conceptMap = new HashMap<String, Object>();
		conceptMap.put("display", this.getConcept().getDisplayString());
		conceptMap.put("uuid", this.getConcept().getUuid());
		//		conceptMap.put("name", this.getConcept().getName().getName());
		testOrderLocationMap.put("concept", conceptMap);
		
		HashMap<String, Object> locationMap = new HashMap<String, Object>();
		locationMap.put("display", this.getLocation().getDisplayString());
		locationMap.put("uuid", this.getLocation().getUuid());
		locationMap.put("name", this.getLocation().getName());
		testOrderLocationMap.put("location", locationMap);
		
		HashMap<String, Object> userMap = new HashMap<String, Object>();
		userMap.put("user_id", this.getUser().getUserId());
		userMap.put("uuid", this.getUser().getUuid());
		userMap.put("username", this.getUser().getName());
		testOrderLocationMap.put("created_by", userMap);
		
		testOrderLocationMap.put("created_on", this.getDateTime());
		
		return testOrderLocationMap;
	}
	
}
