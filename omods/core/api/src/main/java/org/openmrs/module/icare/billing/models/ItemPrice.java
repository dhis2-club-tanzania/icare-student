package org.openmrs.module.icare.billing.models;

// Generated Oct 7, 2020 12:48:40 PM by Hibernate Tools 5.2.10.Final

import org.openmrs.Concept;
import org.openmrs.module.icare.core.Item;
import org.openmrs.module.icare.core.JSONConverter;

import javax.persistence.*;
import java.util.HashMap;
import java.util.Map;

@Embeddable
class ItemPriceID implements java.io.Serializable {
	
	@ManyToOne
	@JoinColumn(name = "payment_scheme_id")
	private Concept paymentScheme;
	
	@ManyToOne(cascade = { CascadeType.PERSIST })
	@JoinColumn(name = "item_id")
	private Item item;
	
	@ManyToOne
	@JoinColumn(name = "payment_type_id")
	private Concept paymentType;
	
	public Concept getPaymentType() {
		return paymentType;
	}
	
	public void setPaymentType(Concept paymentType) {
		this.paymentType = paymentType;
	}
	
	public Item getItem() {
		return item;
	}
	
	public void setItem(Item item) {
		this.item = item;
	}
	
	public Concept getPaymentScheme() {
		return paymentScheme;
	}
	
	public void setPaymentScheme(Concept paymentScheme) {
		this.paymentScheme = paymentScheme;
	}
}

@Entity
@Table(name = "bl_item_price")
public class ItemPrice implements java.io.Serializable {
	
	@EmbeddedId
	private ItemPriceID id;
	
	@Column(name = "price", precision = 10, scale = 0, nullable = false)
	private Double price;
	
	@Column(name = "payable", precision = 10, scale = 0)
	private Double payable;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "payable_payment_mode_id", nullable = true)
	private Concept payablePaymentMode;
	
	public Concept getPaymentType() {
		return this.id.getPaymentType();
	}
	
	public void setPaymentType(Concept paymentType) {
		if (id == null) {
			id = new ItemPriceID();
		}
		this.id.setPaymentType(paymentType);
	}
	
	public Item getItem() {
		return this.id.getItem();
	}
	
	public void setItem(Item item) {
		if (id == null) {
			id = new ItemPriceID();
		}
		this.id.setItem(item);
	}
	
	public Double getPrice() {
		return this.price;
	}
	
	public void setPrice(Double price) {
		this.price = price;
	}
	
	public Concept getPaymentScheme() {
		return this.id.getPaymentScheme();
	}
	
	public void setPaymentScheme(Concept paymentScheme) {
		if (id == null) {
			id = new ItemPriceID();
		}
		this.id.setPaymentScheme(paymentScheme);
	}
	
	public ItemPriceID getId() {
		return id;
	}
	
	public void setId(ItemPriceID id) {
		this.id = id;
	}
	
	public Map<String, Object> toMap() {
		Map<String, Object> itemMap = new HashMap<>();
		itemMap.put("price", this.getPrice());
		itemMap.put("payable", this.getPayable());
		
		if (this.getItem() != null) {
			HashMap<String, Object> item = new HashMap<String, Object>();
			item.put("uuid", this.getItem().getUuid());
			if (this.getItem().getConcept() != null) {
				item.put("display", this.getItem().getConcept().getDisplayString());
			} else if (this.getItem().getDrug() != null) {
				item.put("display", this.getItem().getDrug().getDisplayName());
			}
			itemMap.put("item", item);
		}
		if (this.getPaymentType() != null) {
			HashMap<String, Object> paymentType = new HashMap<String, Object>();
			paymentType.put("uuid", this.getPaymentType().getUuid());
			paymentType.put("display", this.getPaymentType().getName().getName());
			itemMap.put("paymentType", paymentType);
		}
		if (this.getPaymentScheme() != null) {
			HashMap<String, Object> paymentScheme = new HashMap<String, Object>();
			paymentScheme.put("uuid", this.getPaymentScheme().getUuid());
			paymentScheme.put("display", this.getPaymentScheme().getName().getName());
			itemMap.put("paymentScheme", paymentScheme);
		}

		HashMap<String, Object> payablePaymentMode = new HashMap<String, Object>();
		if (this.getPayablePaymentMode() != null) {
			payablePaymentMode.put("uuid", this.getPayablePaymentMode().getUuid());
			payablePaymentMode.put("display", this.getPayablePaymentMode().getDisplayString());
		} else {
			payablePaymentMode = null;
		}
		itemMap.put("payablePaymentMode", payablePaymentMode);
		return itemMap;
	}
	
	public Double getPayable() {
		return payable;
	}
	
	public void setPayable(Double payable) {
		this.payable = payable;
	}
	
	public Concept getPayablePaymentMode() {
		return payablePaymentMode;
	}
	
	public void setPayablePaymentMode(Concept payablePaymentMode) {
		this.payablePaymentMode = payablePaymentMode;
	}
	
}
