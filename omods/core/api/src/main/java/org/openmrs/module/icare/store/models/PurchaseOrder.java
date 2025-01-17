package org.openmrs.module.icare.store.models;

import org.openmrs.BaseOpenmrsData;
import org.openmrs.module.icare.core.JSONConverter;

import javax.persistence.*;
import java.util.Map;

@Entity
@Table(name = "st_purchase_order")
public class PurchaseOrder extends BaseOpenmrsData implements java.io.Serializable, JSONConverter {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "purchase_order_id", unique = true, nullable = false)
	private Integer id;
	
	@Column(name = "code")
	private String Code;
	
	@Override
	public Integer getId() {
		return null;
	}
	
	@Override
	public void setId(Integer integer) {
		
	}
	
	public String getCode() {
		return Code;
	}
	
	public void setCode(String code) {
		Code = code;
	}
	
	@Override
	public Map<String, Object> toMap() {
		return null;
	}
}
