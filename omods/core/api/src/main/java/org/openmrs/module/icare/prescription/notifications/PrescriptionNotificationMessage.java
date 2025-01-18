package org.openmrs.module.icare.prescription.notifications;

import org.openmrs.module.icare.billing.models.Prescription;
public class PrescriptionNotificationMessage {
    private String patientName;
    private String message;
    private String type; // POPUP, BANNER, or NOTIFICATION_CENTER
    private int unreadCount;

    // Constructor
    public PrescriptionNotificationMessage(String patientName, String message, String type, int unreadCount) {
        this.patientName = patientName;
        this.message = message;
        this.type = type;
        this.unreadCount = unreadCount;
    }

    // Getters
    public String getPatientName() {
        return patientName;
    }

    public String getMessage() {
        return message;
    }

    public String getType() {
        return type;
    }

    public int getUnreadCount() {
        return unreadCount;
    }

    // Setters
    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setUnreadCount(int unreadCount) {
        this.unreadCount = unreadCount;
    }

    // You might also want to override toString() for debugging
    @Override
    public String toString() {
        return "PrescriptionNotification{" +
                "patientName='" + patientName + '\'' +
                ", message='" + message + '\'' +
                ", type='" + type + '\'' +
                ", unreadCount=" + unreadCount +
                '}';
    }
}