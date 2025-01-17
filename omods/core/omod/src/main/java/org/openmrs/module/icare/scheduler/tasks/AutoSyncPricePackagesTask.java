package org.openmrs.module.icare.scheduler.tasks;

import org.openmrs.api.context.Context;
import org.openmrs.module.icare.billing.services.insurance.nhif.NHIFServiceImpl;
import org.openmrs.scheduler.tasks.AbstractTask;
import org.openmrs.scheduler.tasks.AutoCloseVisitsTask;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Date;

public class AutoSyncPricePackagesTask extends AbstractTask {
	
	private static final Logger log = LoggerFactory.getLogger(AutoCloseVisitsTask.class);
	
	public AutoSyncPricePackagesTask() {
	}
	
	public void execute() {
		if (!this.isExecuting) {
			if (log.isDebugEnabled()) {
				log.debug("Starting Auto Close Visits Task...");
			}
			
			this.startExecuting();
			
			try {
				NHIFServiceImpl NHIFService = new NHIFServiceImpl();
				NHIFService.syncPriceList();
			}
			catch (Exception var5) {
				log.error("Error while auto closing visits:", var5);
			}
			finally {
				this.stopExecuting();
			}
		}
		
	}
}
