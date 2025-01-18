package org.openmrs.module.icare.web.controller;

import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.map.ObjectMapper;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.openmrs.api.AdministrationService;
import org.openmrs.api.context.Context;
import org.openmrs.module.icare.report.dhis2.DHIS2Config;
import org.openmrs.module.icare.web.controller.core.BaseResourceControllerTest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.util.List;
import java.util.Map;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class ReportControllerTest extends BaseResourceControllerTest {
	
	@Before
	public void setUp() throws Exception {
		
		initializeInMemoryDatabase();
		executeDataSet("report-data.xml");
		AdministrationService adminService = Context.getService(AdministrationService.class);
		adminService.setGlobalProperty(DHIS2Config.facilityUid, "DiszpKrYNg8");
		adminService.setGlobalProperty(DHIS2Config.server, "https://play.dhis2.org/2.35.0");
		adminService.setGlobalProperty(DHIS2Config.username, "admin");
		adminService.setGlobalProperty(DHIS2Config.password, "district");
	}
	
	public void tearDown() throws Exception {
	}
	
	@Test
	@Ignore
	public void testUploadingDHISData() throws Exception {
		
		//gien
		String dto = this.readFile("dto/report/report-data.json");
		Map<String, Object> reportData = (new ObjectMapper()).readValue(dto, Map.class);
		
		//when
		MockHttpServletRequest newPostRequest = newPostRequest("report/dhis2", reportData);
		MockHttpServletResponse handlePost = handle(newPostRequest);
		
		//Then
		Map<String, Object> result = (new ObjectMapper()).readValue(handlePost.getContentAsString(), Map.class);
		
		assertThat("Request was successful", result.get("status").toString(), is("SUCCESS"));
		Integer updated = (Integer) ((Map) result.get("importCount")).get("updated");
		assertThat("Has to import one", updated, is(1));
		
	}
	
	@Ignore("Depends on DHIS Server")
	@Test
	public void testGettingDataElements() throws Exception {
		
		//gien
		
		//when
		MockHttpServletRequest newGetRequest = newGetRequest("report/dhis2/dataElements", new Parameter("q", "accute"));
		MockHttpServletResponse handleGet = handle(newGetRequest);
		
		//Then
		List<Map<String, Object>> result = (new ObjectMapper()).readValue(handleGet.getContentAsString(), List.class);
		
		assertThat("Request was successful with one item", result.size(), is(1));
		assertThat("Request was successful with one Accute Flaccid Paralysis (Deaths < 5 yrs)", result.get(0).get("name")
		        .toString(), is("Accute Flaccid Paralysis (Deaths < 5 yrs)"));
		
	}
}
