package org.openmrs.module.icare.billing.services.payment.gepg;
import com.fasterxml.jackson.annotation.JsonProperty;


import java.util.ArrayList;
import java.util.List;

public class BillItems {
    private List<BillItem> billItem = new ArrayList<>();

    // Getters and setters
    @JsonProperty("BillItem")
    public List<BillItem> getBillItem() {
        return billItem;
    }

    public void setBillItem(List<BillItem> billItem) {
        this.billItem = billItem;
    }
}
