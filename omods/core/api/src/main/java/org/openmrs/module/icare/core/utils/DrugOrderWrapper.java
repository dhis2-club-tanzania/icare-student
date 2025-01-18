package org.openmrs.module.icare.core.utils;

import org.openmrs.DrugOrder;

import java.util.HashMap;
import java.util.Map;

public class DrugOrderWrapper {
	
	DrugOrder drugOrder;
	
	DrugOrderWrapper(DrugOrder drugOrder) {
		this.drugOrder = drugOrder;
	}
	
	public static DrugOrderWrapper fromOrder(DrugOrder drugOrder) {
		return new DrugOrderWrapper(drugOrder);
	}
	
	public Map<String, Object> toMap() {
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("uuid", drugOrder.getUuid());
		//System.out.println("drugOrder.getFulfillerStatus():" + drugOrder.getFulfillerComment());
		//result.put("fullfillStatus", drugOrder.getFulfillerStatus().name());
		return result;
	}
}
