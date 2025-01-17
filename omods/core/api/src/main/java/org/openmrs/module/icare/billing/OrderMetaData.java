package org.openmrs.module.icare.billing;

import org.openmrs.Order;
import org.openmrs.module.icare.billing.models.ItemPrice;

public class OrderMetaData<T extends Order> {
	
	private T order;
	
	private ItemPrice itemPrice;
	
	private Boolean removeBill = false;
	
	public T getOrder() {
		return order;
	}
	
	public void setOrder(T order) {
		this.order = order;
	}
	
	public ItemPrice getItemPrice() {
		return itemPrice;
	}
	
	public void setItemPrice(ItemPrice itemPrice) {
		this.itemPrice = itemPrice;
	}
	
	public Boolean getRemoveBill() {
		return removeBill;
	}
	
	public void setRemoveBill(Boolean removeBill) {
		this.removeBill = removeBill;
	}
}
