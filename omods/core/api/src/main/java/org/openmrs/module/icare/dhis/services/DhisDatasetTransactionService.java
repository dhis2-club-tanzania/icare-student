package org.openmrs.module.icare.dhis.services;

import org.openmrs.api.OpenmrsService;
import org.openmrs.module.icare.dhis.models.DhisDatasetTransaction;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface DhisDatasetTransactionService extends OpenmrsService {
	
	@Transactional
	String createTransaction(DhisDatasetTransaction dhisTransaction);
	
	DhisDatasetTransaction updateDhisTransaction(DhisDatasetTransaction dhisTransaction);
	
	List<DhisDatasetTransaction> getAllDhisTransactions();
	
	List<DhisDatasetTransaction> getDhisTransactionsByPeriod(String period);
	
	List<DhisDatasetTransaction> getDhisTransactionsByReportId(String report);
	
	List<DhisDatasetTransaction> getDhisTransactionsByPeriodAndReportId(String period, String report);
	
}
