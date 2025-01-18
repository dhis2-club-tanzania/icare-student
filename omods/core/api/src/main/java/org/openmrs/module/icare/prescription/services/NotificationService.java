package org.openmrs.module.icare.prescription.services;

import org.openmrs.Patient;
import org.openmrs.module.icare.prescription.notifications.PrescriptionNotificationMessage;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class NotificationService {
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public void addEmitter(SseEmitter emitter) {
        emitters.add(emitter);
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
    }

    public void sendNotification(Patient patient) {
        // Get patient's full name using OpenMRS API
        String patientName = patient.getPersonName().getFullName();

        PrescriptionNotificationMessage popupNotif = new PrescriptionNotificationMessage(
                patientName,
                "Rx alert! New prescription for " + patientName + " just arrived! 💊",
                "POPUP",
                0
        );

        PrescriptionNotificationMessage bannerNotif = new PrescriptionNotificationMessage(
                patientName,
                patientName + "'s med list needs updating! See their new prescription.",
                "BANNER",
                0
        );

        List<PrescriptionNotificationMessage> notifications = Arrays.asList(
                popupNotif, bannerNotif
        );

        emitters.forEach(emitter -> {
            try {
                // Create an SSE event with the notifications
                SseEmitter.SseEventBuilder eventBuilder = SseEmitter.event()
                        .data(notifications)
                        .id(String.valueOf(System.currentTimeMillis()))
                        .name("prescription-notification");

                emitter.send(eventBuilder);
            } catch (IOException e) {
                emitters.remove(emitter);
            }
        });
    }

    // Method to remove an emitter
    public void removeEmitter(SseEmitter emitter) {
        emitters.remove(emitter);
    }

    // Method to get current emitter count (useful for debugging)
    public int getEmitterCount() {
        return emitters.size();
    }
}