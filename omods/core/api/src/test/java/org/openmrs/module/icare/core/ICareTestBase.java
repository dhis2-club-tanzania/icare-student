package org.openmrs.module.icare.core;

import org.codehaus.jackson.map.ObjectMapper;
import org.openmrs.api.AdministrationService;
import org.openmrs.api.context.Context;
import org.openmrs.test.BaseModuleContextSensitiveTest;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.net.URL;
import java.util.Map;

public abstract class ICareTestBase extends BaseModuleContextSensitiveTest {
	
	public void initTestData() throws Exception {
		initializeInMemoryDatabase();
		executeDataSet("billing-data.xml");
		AdministrationService adminService = Context.getService(AdministrationService.class);
		adminService.setGlobalProperty("icare.billing.serviceAttribute", "298b75eb-5345-11e8-9c7c-40b0yt63cfee");
		adminService.setGlobalProperty("icare.billing.paymentSchemeAttribute", "298b75eb-5345-12e8-9c7c-40b0yt63cfee");
		adminService.setGlobalProperty("icare.billing.paymentTypeAttribute", "298b75eb-er45-12e8-9c7c-40b0yt63cfee");
		adminService.setGlobalProperty("icare.registration.encounterType", "2msir5eb-5345-11e8-9c7c-40b034c3cfee");
		adminService.setGlobalProperty("icare.billing.orderType", "2msir5eb-5345-11e8-9922-40b034c3cfee");
		adminService.setGlobalProperty("icare.registration.feeConcept", "e721ec30-mfy4-11e8-ie7c-40b69mdy79ee");
		
		/*Class<?> cls = Context.loadClass("org.openmrs.api.EncounterService");
		Class<?> adviceClass = Context.loadClass("org.openmrs.module.icare.billing.aop.VisitBillAdvisor");
		AdvicePoint advice = new AdvicePoint("org.openmrs.api.EncounterService", adviceClass);
		Object aopObject = advice.getClassInstance();
		Context.addAdvice(cls, (Advice) aopObject);*/
	}
	
	protected Map<String, Object> readDTOFile(String file) throws IOException {
		URL url = this.getClass().getClassLoader().getResource(file);
		BufferedReader br = new BufferedReader(new FileReader(url.getPath()));
		StringBuilder sb = new StringBuilder();
		String line = br.readLine();
		
		while (line != null) {
			sb.append(line);
			sb.append(System.lineSeparator());
			line = br.readLine();
		}
		return (new ObjectMapper()).readValue(sb.toString(), Map.class);
	}
}
