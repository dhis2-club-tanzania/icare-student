package org.openmrs.module.icare.store.models;

import org.openmrs.Location;
import org.openmrs.Order;
import org.openmrs.module.icare.core.Item;
import org.openmrs.module.icare.store.util.Stockable;

import java.util.Date;

public class StockableItem implements Stockable {
	
	private Item item;
	
	private String batch;
	
	private Date expiryDate;
	
	private Double quantity;
	
	private Location location;
	
	private Location sourceLocation;
	
	private Location destinationLocation;
	
	private Order order;
	
	@Override
	public Item getItem() {
		return item;
	}
	
	@Override
	public String getBatchNo() {
		return batch;
	}
	
	@Override
	public Date getExpiryDate() {
		return expiryDate;
	}
	
	@Override
	public Double getQuantity() {
		return quantity;
	}
	
	@Override
	public Location getLocation() {
		return location;
	}
	
	@Override
	public Location getSourceLocation() {
		return sourceLocation;
	}
	
	@Override
	public Location getDestinationLocation() {
		return destinationLocation;
	}
	
	@Override
	public Order getOrder() {
		return order;
	}
	
	public void setItem(Item item) {
		this.item = item;
	}
	
	public void setBatch(String batch) {
		this.batch = batch;
	}
	
	public void setExpiryDate(Date expiryDate) {
		this.expiryDate = expiryDate;
	}
	
	public void setQuantity(Double quantity) {
		this.quantity = quantity;
	}
	
	public void setLocation(Location location) {
		this.location = location;
	}
	
	public void setSourceLocation(Location sourceLocation) {
		this.sourceLocation = sourceLocation;
	}
	
	public void setDestinationLocation(Location destinationLocation) {
		this.destinationLocation = destinationLocation;
	}
	
	public void setOrder(Order order) {
		this.order = order;
	}
}
