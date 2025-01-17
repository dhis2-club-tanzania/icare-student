package org.openmrs.module.icare.store;

import org.openmrs.test.BaseModuleContextSensitiveTest;

public abstract class StoreTestBase extends BaseModuleContextSensitiveTest {
	
	public void initTestData() throws Exception {
		initializeInMemoryDatabase();
		executeDataSet("store-data.xml");
	}
}
