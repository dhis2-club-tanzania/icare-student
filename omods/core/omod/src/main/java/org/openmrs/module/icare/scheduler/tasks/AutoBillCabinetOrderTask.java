package org.openmrs.module.icare.scheduler.tasks;

import org.openmrs.api.context.Context;
import org.openmrs.module.icare.billing.services.BillingService;
import org.openmrs.scheduler.tasks.AbstractTask;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AutoBillCabinetOrderTask extends AbstractTask {
	
	private static final Logger log = LoggerFactory.getLogger(AutoBillCabinetOrderTask.class);
	
	public AutoBillCabinetOrderTask() {
	}
	
	@Override
	public void execute() {
		
		if (!this.isExecuting) {
			if (log.isDebugEnabled()) {
				log.debug("Starting Auto BedOrder Bill Task...");
			}
			
			this.startExecuting();
			
			try {
				BillingService billingService = Context.getService(BillingService.class);
				billingService.createOrderForOngoingDeceasedPatients();
			}
			catch (Exception var5) {
				log.error("Error while auto bed order ", var5);
			}
			finally {
				this.stopExecuting();
			}
		}
		
	}
}
