package org.openmrs.module.icare.scheduler.tasks;

import org.openmrs.Encounter;
import org.openmrs.Order;
import org.openmrs.Visit;
import org.openmrs.api.AdministrationService;
import org.openmrs.api.context.Context;
import org.openmrs.module.icare.core.ICareService;
import org.openmrs.scheduler.tasks.AbstractTask;
import org.openmrs.scheduler.tasks.ProcessHL7InQueueTask;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

public class AutoCloseVisitsTask extends AbstractTask {
	
	private static final Logger log = LoggerFactory.getLogger(AutoCloseVisitsTask.class);
	
	static String visitLengthInHours = "icare.visit.length";
	
	public AutoCloseVisitsTask() {
	}
	
	public void execute() {
		
		if (!this.isExecuting) {
			if (log.isDebugEnabled()) {
				log.debug("Starting Auto Close Visits Task...");
			}
			
			this.startExecuting();
			
			try {
				ICareService iCareService = Context.getService(ICareService.class);
				iCareService.stopVisits();
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
