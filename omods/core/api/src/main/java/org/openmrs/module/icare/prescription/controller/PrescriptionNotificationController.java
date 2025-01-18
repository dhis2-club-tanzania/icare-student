package org.openmrs.module.icare.prescription.controller;
import org.openmrs.module.icare.prescription.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/notifications/prescriptions")

public class PrescriptionNotificationController {
     @Autowired
    private NotificationService notificationService;
    
    @GetMapping("/subscribe")
    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        notificationService.addEmitter(emitter);
        return emitter;
    }
}

