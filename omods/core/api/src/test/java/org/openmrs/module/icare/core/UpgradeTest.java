package org.openmrs.module.icare.core;

import org.apache.commons.io.FileUtils;
import org.junit.*;
import org.openmrs.util.OpenmrsConstants;
import org.openmrs.util.OpenmrsUtil;
import org.openmrs.util.databasechange.DatabaseUpgradeTestUtil;

import java.io.File;
import java.io.IOException;
import java.sql.SQLException;

public class UpgradeTest {
	
	private DatabaseUpgradeTestUtil upgradeTestUtil;
	
	private static File testAppDataDir;
	
	public static final String TEST_DATA_DIR = "/org/openmrs/util/databasechange/";
	
	public static final String LIQUIBASE_UPDATE_TO_LATEST_XML = "liquibase.xml";
	
	public final static String DATABASE_PATH = TEST_DATA_DIR + "openmrs-1.9.7.h2.db";
	
	@BeforeClass
	public static void beforeClass() throws IOException {
		testAppDataDir = File.createTempFile("appdir-for-unit-tests", "");
		testAppDataDir.delete();// so we can make turn it into a directory
		testAppDataDir.mkdir();
		
		System.setProperty(OpenmrsConstants.APPLICATION_DATA_DIRECTORY_RUNTIME_PROPERTY, testAppDataDir.getAbsolutePath());
		OpenmrsUtil.setApplicationDataDirectory(testAppDataDir.getAbsolutePath());
	}
	
	@AfterClass
	public static void afterClass() throws Exception {
		FileUtils.deleteDirectory(testAppDataDir);
		//Just to be safe, not to affect other units in the test suite
		System.clearProperty(OpenmrsConstants.APPLICATION_DATA_DIRECTORY_RUNTIME_PROPERTY);
	}
	
	@Before
	public void before() throws IOException, SQLException {
		upgradeTestUtil = new DatabaseUpgradeTestUtil(DATABASE_PATH);
	}
	
	@After
	public void after() throws SQLException {
		upgradeTestUtil.close();
	}
	
	@Test
	public void shouldUpgradeLiquibase() throws IOException, SQLException {
		/*upgradeTestUtil.upgrade(LIQUIBASE_UPDATE_TO_LATEST_XML);
		List<Map<String, String>> deviceList = upgradeTestUtil.select("lb_dispensable_item", null, "item_id");*/
		
		// no explicit assertions here, this test serves to see whether the master is executed without raising an exception.
		
	}
}
