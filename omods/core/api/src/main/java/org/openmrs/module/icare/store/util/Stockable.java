package org.openmrs.module.icare.store.util;

import org.openmrs.Location;
import org.openmrs.module.icare.core.Item;
import org.openmrs.Order;
import java.util.Date;

public interface Stockable {
	
	Item getItem();
	
	String getBatchNo();
	
	Date getExpiryDate();
	
	Double getQuantity();
	
	Location getLocation();
	
	Location getSourceLocation();
	
	Location getDestinationLocation();

	default Date getDateCreated(){
		return new Date();
	};

	default Order getOrder(){
		return new Order();
	}


}
