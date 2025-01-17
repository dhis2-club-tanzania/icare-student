package org.openmrs.module.icare.billing.models;

import org.openmrs.Location;
import org.openmrs.Order;

import javax.persistence.*;

//@Entity
//@Table(name = "bed_order")
//@PrimaryKeyJoinColumn(name = "orderId")
public class BedOrder extends Order {
	
	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "bed_id", nullable = false)
	private Location bed;
	
	public Location getBed() {
		return bed;
	}
	
	public void setBed(Location bed) {
		this.bed = bed;
	}
}
