package org.openmrs.module.icare.report.dhis2.models;

import java.util.ArrayList;
import java.util.List;

public class DataImport {
	
	private List<DataValue> dataValues = new ArrayList<DataValue>();
	
	public List<DataValue> getDataValues() {
		return dataValues;
	}
	
	public void setDataValues(List<DataValue> dataValues) {
		this.dataValues = dataValues;
	}
}
