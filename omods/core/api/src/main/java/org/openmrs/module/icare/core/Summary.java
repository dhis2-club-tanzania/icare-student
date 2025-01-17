package org.openmrs.module.icare.core;

import org.openmrs.Location;
import org.openmrs.LocationTag;

import java.util.*;

public class Summary {
	
	private Long allPatients;
	
	private Long activeVisits;
	
	private Map<Location, Long> locations;
	
	public Map<String, Object> toMap(){
        Map<String,Object> result = new HashMap<>();
        result.put("allPatients", this.getAllPatients());
        result.put("activeVisits", this.getActiveVisits());
        List<Map<String,Object>> locationsList = new ArrayList<>();

        for (Map.Entry<Location, Long> entry : locations.entrySet()){
            Map<String,Object> locationMap = new HashMap<>();
            Location location = entry.getKey();
            locationMap.put("uuid", location.getUuid());
            locationMap.put("name", location.getName());
            locationMap.put("activeVisits", entry.getValue());

            Iterator it = location.getTags().iterator();
            List<Map<String,Object>> locationTagsList = new ArrayList<>();
            while(it.hasNext()){
                LocationTag tag = (LocationTag) it.next();
                Map<String,Object> locationTagMap = new HashMap<>();
                locationTagMap.put("uuid",tag.getUuid());
                locationTagMap.put("name",tag.getName());

                locationTagsList.add(locationTagMap);
            }
            locationMap.put("tags", locationTagsList);
            locationsList.add(locationMap);
        }
        result.put("locations", locationsList);
        return result;
    }
	
	public Long getActiveVisits() {
		return activeVisits;
	}
	
	public void setActiveVisits(Long activeVisits) {
		this.activeVisits = activeVisits;
	}
	
	public Long getAllPatients() {
		return allPatients;
	}
	
	public void setAllPatients(Long allPatients) {
		this.allPatients = allPatients;
	}
	
	public Map<Location, Long> getLocations() {
		return locations;
	}
	
	public void setLocations(Map<Location, Long> locations) {
		this.locations = locations;
	}
}
