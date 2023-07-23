package org.openmrs.module.icare.store.util;

import org.openmrs.Location;
import org.openmrs.module.icare.core.Item;

import java.util.Date;

public interface Stockable {
	
	Item getItem();
	
	String getBatchNo();
	
	Date getExpiryDate();
	
	Double getQuantity();
	
	Location getLocation();
	
	Location getSourceLocation();
	
	Location getDestinationLocation();
}
