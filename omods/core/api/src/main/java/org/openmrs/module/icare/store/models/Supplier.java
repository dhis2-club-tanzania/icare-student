package org.openmrs.module.icare.store.models;

import org.openmrs.BaseOpenmrsData;
import org.openmrs.Location;
import org.openmrs.module.icare.core.JSONConverter;
import org.openmrs.module.icare.laboratory.models.BatchSet;

import javax.persistence.*;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "st_supplier")
public class Supplier extends BaseOpenmrsData implements java.io.Serializable, JSONConverter {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "supplier_id", unique = true, nullable = false)
	private Integer id;
	
	@Column(name = "name", length = 20)
	private String name;
	
	@Column(name = "description", length = 100)
	private String description;
	
	@ManyToOne
	@JoinColumn(name = "location_id", nullable = true)
	private Location location;
	
	@Override
	public Integer getId() {
		return id;
	}
	
	@Override
	public void setId(Integer id) {
		this.id = id;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getDescription() {
		return description;
	}
	
	public void setDescription(String description) {
		this.description = description;
	}
	
	public Location getLocation() {
		return location;
	}
	
	public void setLocation(Location location) {
		this.location = location;
	}
	
	@Override
    public Map<String, Object> toMap()
    {
        Map<String,Object> supplierMap = new HashMap<>();
        supplierMap.put("name",this.getName());
        supplierMap.put("description",this.getDescription());
        supplierMap.put("uuid",this.getUuid());
		supplierMap.put("voided",this.getVoided());

		if(this.getLocation() != null){
			Map<String,Object> locationMap = new HashMap<>();
			locationMap.put("uuid",this.getLocation().getUuid());
			locationMap.put("display",this.getLocation().getDisplayString());
			supplierMap.put("location",locationMap);
		}
        return supplierMap;
    }
	
	public static Supplier fromMap(Map<String, Object> supplierMap) {
		
		Supplier supplier = new Supplier();
		if (supplierMap.get("description") != null) {
			supplier.setDescription(supplierMap.get("description").toString());
		}
		if (supplierMap.get("name") != null) {
			supplier.setName(supplierMap.get("name").toString());
		}
		
		if (supplierMap.get("location") != null) {
			Location location = new Location();
			location.setUuid(((Map) supplierMap.get("location")).get("uuid").toString());
			supplier.setLocation(location);
		}
		
		if (supplierMap.get("voided") != null) {
			supplier.setVoided((boolean) supplierMap.get("voided"));
		}
		return supplier;
	}
}
