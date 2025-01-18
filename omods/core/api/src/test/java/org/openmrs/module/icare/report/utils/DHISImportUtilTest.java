package org.openmrs.module.icare.report.utils;

import org.junit.Before;
import org.junit.Test;
import org.openmrs.api.AdministrationService;
import org.openmrs.api.context.Context;
import org.openmrs.module.icare.core.ICareTestBase;
import org.openmrs.module.icare.report.dhis2.DHIS2Config;
import org.openmrs.module.icare.report.dhis2.models.DataImport;
import org.openmrs.module.icare.report.dhis2.models.DataValue;

import java.util.Map;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class DHISImportUtilTest extends ICareTestBase {
	
	@Before
	public void initTestData() throws Exception {
		initializeInMemoryDatabase();
		executeDataSet("report-data.xml");
		AdministrationService adminService = Context.getService(AdministrationService.class);
		adminService.setGlobalProperty("icare.billing.serviceAttribute", "298b75eb-5345-11e8-9c7c-40b0yt63cfee");
		adminService.setGlobalProperty("icare.billing.paymentSchemeAttribute", "298b75eb-5345-12e8-9c7c-40b0yt63cfee");
		adminService.setGlobalProperty("icare.billing.paymentTypeAttribute", "298b75eb-er45-12e8-9c7c-40b0yt63cfee");
		adminService.setGlobalProperty("icare.registration.encounterType", "2msir5eb-5345-11e8-9c7c-40b034c3cfee");
		adminService.setGlobalProperty("icare.billing.orderType", "2msir5eb-5345-11e8-9922-40b034c3cfee");
		adminService.setGlobalProperty("icare.registration.feeConcept", "e721ec30-mfy4-11e8-ie7c-40b69mdy79ee");
		adminService.setGlobalProperty(DHIS2Config.facilityUid, "DiszpKrYNg8");
		adminService.setGlobalProperty(DHIS2Config.server, "https://play.dhis2.org/2.35.0");
		adminService.setGlobalProperty(DHIS2Config.username, "admin");
		adminService.setGlobalProperty(DHIS2Config.password, "district");
	}
	
	//@Test
	public void testImportDataWithIds() throws Exception {
		
		//Given
		DataImport dataImport = new DataImport();
		DataValue dataValue = new DataValue();
		dataValue.setDataElement("s46m5MS0hxu");
		dataValue.setCategoryOptionCombo("Prlt0C1RF0s");
		dataValue.setOrgUnit("DiszpKrYNg8");
		dataValue.setPeriod("201901");
		dataValue.setValue("5");
		dataImport.getDataValues().add(dataValue);
		
		//When
		Map result = DHISImportUtil.importData(dataImport);
		
		//Then
		assertThat("Request was successful", result.get("status").toString(), is("SUCCESS"));
		Integer updated = (Integer) ((Map) result.get("importCount")).get("updated");
		assertThat("Has to import one", updated, is(1));
	}
	
	@Test
	public void testConvertingReportData() throws Exception {
		
		//Given
		Map<String, Object> reportData = this.readDTOFile("report/report-data.json");
		
		//When
		DataImport result = DHISImportUtil.convertReportDataToDataImport(reportData);
		
		//Then
		assertThat("There is on datavalue", result.getDataValues().size(), is(1));
		assertThat("There is a valid data element", result.getDataValues().get(0).getDataElement(), is("s46m5MS0hxu"));
		assertThat("There is a valid Category", result.getDataValues().get(0).getCategoryOptionCombo(), is("Prlt0C1RF0s"));
		assertThat("There is a valid Organisation", result.getDataValues().get(0).getOrgUnit(), is("DiszpKrYNg8"));
		assertThat("There is a valid Period", result.getDataValues().get(0).getPeriod(), is("202001"));
		assertThat("There is a valid Value", result.getDataValues().get(0).getValue(), is("5"));
	}
	
}
