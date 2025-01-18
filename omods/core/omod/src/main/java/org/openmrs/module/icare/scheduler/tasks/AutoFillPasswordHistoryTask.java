package org.openmrs.module.icare.scheduler.tasks;

import org.openmrs.api.context.Context;
import org.openmrs.module.icare.core.ICareService;
import org.openmrs.scheduler.tasks.AbstractTask;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AutoFillPasswordHistoryTask extends AbstractTask {
	
	private static final Logger log = LoggerFactory.getLogger(AutoFillPasswordHistoryTask.class);
	
	public AutoFillPasswordHistoryTask() {
	}
	
	@Override
	public void execute() {
		
		if (!this.isExecuting) {
			if (log.isDebugEnabled()) {
				log.debug("Starting Auto Fill Password History Task...");
			}
			
			this.startExecuting();
			
			try {
				ICareService iCareService = Context.getService(ICareService.class);
				iCareService.updatePasswordHistory();
				
			}
			catch (Exception var5) {
				log.error("Error while auto fill password ", var5);
			}
			finally {
				this.stopExecuting();
			}
		}
	}
	
}
