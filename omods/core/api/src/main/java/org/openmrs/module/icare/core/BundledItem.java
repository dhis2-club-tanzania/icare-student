package org.openmrs.module.icare.core;

import javax.persistence.*;

@Embeddable
class BundledItemID implements java.io.Serializable {
	
	@ManyToOne
	@JoinColumn(name = "item_id")
	private Item item;
	
	@ManyToOne(cascade = { CascadeType.PERSIST })
	@JoinColumn(name = "bundled_item_id")
	private Item bundledItem;
	
	public Item getItem() {
		return item;
	}
	
	public void setItem(Item item) {
		
		this.item = item;
	}
	
	public Item getBundledItem() {
		return bundledItem;
	}
	
	public void setBundledItem(Item bundledItem) {
		this.bundledItem = bundledItem;
	}
}

@Entity
@Table(name = "bundled_item")
public class BundledItem {
	
	@EmbeddedId
	private BundledItemID id;
	
	public BundledItemID getId() {
		return id;
	}
	
	public void setId(BundledItemID id) {
		this.id = id;
	}
	
	public Item getItem() {
		return id.getItem();
	}
	
	public void setItem(Item item) {
		if (this.id == null) {
			this.id = new BundledItemID();
		}
		this.id.setItem(item);
	}
	
	public Item getBundledItem() {
		return this.getBundledItem();
	}
	
	public void setBundledItem(Item bundledItem) {
		if (this.id == null) {
			this.id = new BundledItemID();
		}
		this.id.setBundledItem(bundledItem);
	}
}
