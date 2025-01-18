package org.openmrs.module.icare.laboratory.models;

import javax.persistence.*;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static javax.persistence.GenerationType.IDENTITY;

@Entity
@Table(name = "lb_sample_reserved_values")
public class SampleLable implements java.io.Serializable {
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "id", unique = true, nullable = false)
	private Integer id;
	
	@Column(name = "current_label", length = 65535)
	private Integer currentLable;
	
	@Column(name = "time_reserved")
	private Date time;
	
	public Integer getCurrentLable() {
		return currentLable;
	}
	
	public void setCurrentLable(Integer currentLable) {
		this.currentLable = currentLable;
	}
	
	public Date getTime() {
		return time;
	}
	
	public void setTime(Date time) {
		this.time = time;
	}
	
	public Map<String, Object> toMap() {
		Map<String, Object> sampleLableMap = new HashMap<String, Object>();
		
		sampleLableMap.put("label", this.currentLable);
		
		return sampleLableMap;
	}
	
	public Integer getId() {
		return id;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}
}
