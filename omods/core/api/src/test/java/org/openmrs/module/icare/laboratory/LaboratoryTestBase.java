package org.openmrs.module.icare.laboratory;

import org.openmrs.test.BaseModuleContextSensitiveTest;

public abstract class LaboratoryTestBase extends BaseModuleContextSensitiveTest {
	
	public void initTestData() throws Exception {
		initializeInMemoryDatabase();
		executeDataSet("lab-data.xml");
	}
	
}
