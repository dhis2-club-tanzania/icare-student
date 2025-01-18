package org.openmrs.module.icare.dhis.services;

import org.openmrs.api.OpenmrsService;
import org.openmrs.module.icare.dhis.models.DhisEventTransaction;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface DhisEventTransactionService extends OpenmrsService {
	
	@Transactional
	String createEventTransaction(DhisEventTransaction dhisEventTransaction);
	
	List<DhisEventTransaction> getEventTransactions();
}
