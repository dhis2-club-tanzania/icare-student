package org.openmrs.module.icare.web.controller;

import org.openmrs.User;
import org.openmrs.api.UserService;
import org.openmrs.api.context.Context;
import org.openmrs.module.icare.dhis.models.DhisDatasetTransaction;
import org.openmrs.module.icare.dhis.services.DhisDatasetTransactionService;
import org.openmrs.module.webservices.rest.web.RestConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping(value = "/rest/" + RestConstants.VERSION_1 + "/dhis2")
public class DhisTransactionController {
	
	@Autowired
	DhisDatasetTransactionService dhisDatasetTransactionService;
	
	@Autowired
	UserService userService;
	
	@RequestMapping(value = "dataset", method = RequestMethod.POST)
	@ResponseBody
	public String sendDataSetToDHIS(@RequestBody Map<String, Object> transactionMap) {
		
		DhisDatasetTransaction dhisDatasetTransaction = DhisDatasetTransaction.fromMap(transactionMap);
		
		User user = Context.getAuthenticatedUser();
		
		//	User user = userService.getUser(1);
		
		dhisDatasetTransaction.setCreator(user);
		
		return dhisDatasetTransactionService.createTransaction(dhisDatasetTransaction);
		
	}
	
	@RequestMapping(value = "logs", method = RequestMethod.GET)
	@ResponseBody
	public List<Map<String, Object>> getSentDataByFilters(@RequestParam(value = "period", required = false) String period,
	        @RequestParam(value = "report", required = false) String report,
	        @RequestParam(value = "type", required = false) String type) {
		
		List<DhisDatasetTransaction> dhisDatasetTransactions;
		
		if (period != null && report == null) {
			dhisDatasetTransactions = dhisDatasetTransactionService.getDhisTransactionsByPeriod(period);
		} else if (report != null && period == null) {
			
			dhisDatasetTransactions = dhisDatasetTransactionService.getDhisTransactionsByReportId(report);
		} else if (report != null && period != null) {
			
			dhisDatasetTransactions = dhisDatasetTransactionService.getDhisTransactionsByPeriodAndReportId(period, report);
		} else {
			dhisDatasetTransactions = dhisDatasetTransactionService.getAllDhisTransactions();
		}
		
		List<Map<String, Object>> responseListMap = new ArrayList<Map<String, Object>>();
		for (DhisDatasetTransaction dhisDatasetTransaction : dhisDatasetTransactions) {
			
			Map<String, Object> transactionMap = dhisDatasetTransaction.toMap();
			
			responseListMap.add(transactionMap);
			
		}
		
		if (type != null && type == "count") {
			
		}
		
		return responseListMap;
	}
	
	@RequestMapping(value = "count", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> getSentDataCount(@RequestParam(value = "period", required = false) String period,
	        @RequestParam(value = "report", required = false) String report) {
		
		List<DhisDatasetTransaction> dhisDatasetTransactions;
		
		Map<String, Object> response = new HashMap<String, Object>();
		
		if (period != null && report == null) {
			dhisDatasetTransactions = dhisDatasetTransactionService.getDhisTransactionsByPeriod(period);
		} else if (report != null && period == null) {
			
			dhisDatasetTransactions = dhisDatasetTransactionService.getDhisTransactionsByReportId(report);
		} else if (report != null && period != null) {
			
			dhisDatasetTransactions = dhisDatasetTransactionService.getDhisTransactionsByPeriodAndReportId(period, report);
		} else {
			dhisDatasetTransactions = dhisDatasetTransactionService.getAllDhisTransactions();
		}
		
		response.put("count", dhisDatasetTransactions.size());
		response.put("report", report);
		response.put("period", period);
		
		return response;
	}
}
