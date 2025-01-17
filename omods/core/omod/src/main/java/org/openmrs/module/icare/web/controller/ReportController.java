package org.openmrs.module.icare.web.controller;

import org.openmrs.module.icare.report.services.DHIS2Service;
import org.openmrs.module.webservices.rest.web.RestConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping(value = "/rest/" + RestConstants.VERSION_1 + "/report")
public class ReportController {
	
	@Autowired
	DHIS2Service dhis2Service;
	
	@RequestMapping(value = "dhis2", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> postDhis2Data(@RequestBody Map<String, Object> data) throws Exception {
		return dhis2Service.postDhisData(data);
	}
	
	@RequestMapping(value = "dhis2/dataElements", method = RequestMethod.GET)
	@ResponseBody
	public List<Map<String, Object>> getDataElement(@RequestParam String q) throws Exception {
		return dhis2Service.getDataElements(q);
	}
}
