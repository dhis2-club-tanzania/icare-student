package org.openmrs.module.icare.auditlog.listener;

import org.openmrs.User;
import org.openmrs.UserSessionListener;
import org.openmrs.module.icare.auditlog.AuditLog;
import org.openmrs.module.icare.core.ICareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.util.Date;

@Component
public class LoginLogoutListener implements UserSessionListener {
	
	@Autowired
	ICareService iCareService;
	
	@Override
	@Transactional
	public void loggedInOrOut(User user, Event event, Status status) {
		
		if (event == Event.LOGIN) {
			// User logged in successfully
			System.out.println("User " + user.getUsername() + " logged in at " + new Date() + " and status " + event);
			AuditLog auditLog = new AuditLog(User.class, "LOGGED IN", user, new Date());
			iCareService.saveAuditLog(auditLog);
			// Log the event or perform other actions
		} else if (event == Event.LOGOUT) {
			// User logged out successfully
			//			System.out.println("User " + user.getUsername() + " logged out at " + new Date() + " and event " + event);
			AuditLog auditLog = new AuditLog(User.class, "LOGGED OUT", user, new Date());
			iCareService.saveAuditLog(auditLog);
		}
	}
}
