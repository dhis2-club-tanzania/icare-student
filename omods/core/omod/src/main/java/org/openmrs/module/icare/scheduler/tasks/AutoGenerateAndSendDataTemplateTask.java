package org.openmrs.module.icare.scheduler.tasks;

import org.openmrs.api.context.Context;
import org.openmrs.module.icare.core.ICareService;
import org.openmrs.scheduler.tasks.AbstractTask;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Date;

public class AutoGenerateAndSendDataTemplateTask extends AbstractTask {
	
	private static final Logger log = LoggerFactory.getLogger(AutoGenerateAndSendDataTemplateTask.class);
	
	public AutoGenerateAndSendDataTemplateTask() {
	}
	
	@Override
	public void execute() {
		
		if (!this.isExecuting) {
			if (log.isDebugEnabled()) {
				log.debug("Starting Auto Generate Data Template Task...");
			}
			
			this.startExecuting();
			
			try {
				Date endDate = new Date();
				Calendar calendar = Calendar.getInstance();
				calendar.setTime(endDate);
				calendar.add(Calendar.HOUR_OF_DAY, -24);
				Date startDate = calendar.getTime();
				
				ICareService iCareService = Context.getService(ICareService.class);
				System.out.println(startDate);
				System.out.println(endDate);
				iCareService.generateVisitsData(startDate, endDate, true, null);
			}
			catch (Exception e) {
				e.printStackTrace();
				log.error("Error while auto generating data template and sending to external mediator ", e);
			}
			finally {
				this.stopExecuting();
			}
		}
		
	}
}
