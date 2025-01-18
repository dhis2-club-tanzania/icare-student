package org.openmrs.module.icare.store.models;

import org.openmrs.BaseOpenmrsData;
import org.openmrs.module.icare.billing.models.InvoiceItem;
import org.openmrs.module.icare.core.JSONConverter;

import javax.persistence.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Entity
@Table(name = "st_stock_invoice", uniqueConstraints = {@UniqueConstraint(columnNames = {"invoice_number","supplier_id"})})
public class StockInvoice extends BaseOpenmrsData implements java.io.Serializable, JSONConverter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stock_invoice_id",unique= true, nullable = false)
    private Integer id;

    @Column(name = "invoice_number", length=20)
    private String invoiceNumber;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @ManyToOne
    @JoinColumn(name = "purchase_order_id")
    private PurchaseOrder purchaseOrder;

    @Column(name = "receiving_date")
    private Date receivingDate;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "stockInvoice")
    private List<StockInvoiceItem> stockInvoiceItems = new ArrayList<>(0);

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "stockInvoice")
    private List<StockInvoiceStatus> stockInvoiceStatuses = new ArrayList<>(0);

    @Transient
    private Double totalAmount;


    @Override
    public Integer getId() {
        return id;
    }

    @Override
    public void setId(Integer id) {
        this.id =id;
    }

    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }

    public String getInvoiceNumber() {
        return invoiceNumber;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public void setPurchaseOrder(PurchaseOrder purchaseOrder) {
        this.purchaseOrder = purchaseOrder;
    }

    public PurchaseOrder getPurchaseOrder() {
        return purchaseOrder;
    }

    public void setReceivingDate(Date receivingDate) {
        this.receivingDate = receivingDate;
    }

    public Date getReceivingDate() {
        return receivingDate;
    }

    public List<StockInvoiceItem> getStockInvoiceItems() {
        return stockInvoiceItems;
    }

    public void setStockInvoiceItems(List<StockInvoiceItem> stockInvoiceItems) {
        this.stockInvoiceItems = stockInvoiceItems;
    }

    public List<StockInvoiceStatus> getStockInvoiceStatuses() {
        return stockInvoiceStatuses;
    }

    public void setStockInvoiceStatuses(List<StockInvoiceStatus> stockInvoiceStatuses) {
        this.stockInvoiceStatuses = stockInvoiceStatuses;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public static StockInvoice fromMap(Map<String,Object> stockInvoiceMap) throws ParseException {

        StockInvoice stockInvoice = new StockInvoice();
        if(stockInvoiceMap.get("invoiceNumber") != null) {
            stockInvoice.setInvoiceNumber(stockInvoiceMap.get("invoiceNumber").toString());
        }

        if(stockInvoiceMap.get("receivingDate") != null) {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            if (stockInvoiceMap.get("receivingDate").toString().length() == 10) {
                stockInvoice.setReceivingDate(dateFormat.parse(stockInvoiceMap.get("receivingDate").toString()));
            } else {
                stockInvoice.setReceivingDate(dateFormat.parse(stockInvoiceMap.get("receivingDate").toString().substring(0, stockInvoiceMap.get("receivingDate").toString().indexOf("T"))));
            }
        }

        if(stockInvoiceMap.get("uuid") != null){
            stockInvoice.setUuid(stockInvoiceMap.get("uuid").toString());
        }

        if(stockInvoiceMap.get("supplier") != null) {
            Supplier supplier = new Supplier();
            supplier.setUuid(((Map) stockInvoiceMap.get("supplier")).get("uuid").toString());
            stockInvoice.setSupplier(supplier);
        }
        if(stockInvoiceMap.get("purchaseOrder") != null){
            PurchaseOrder purchaseOrder = new PurchaseOrder();
            purchaseOrder.setUuid(((Map)stockInvoiceMap.get("purchaseOrder")).get("uuid").toString());
            stockInvoice.setPurchaseOrder(purchaseOrder);
        }

        if(stockInvoiceMap.get("stockInvoiceStatus") != null){
            List<StockInvoiceStatus> stockInvoiceStatusesList = new ArrayList<>();
           for(Map<String,Object> stockInvoiceMapObject :(List<Map<String, Object>>) stockInvoiceMap.get("stockInvoiceStatus")) {
               StockInvoiceStatus stockInvoiceStatus = new StockInvoiceStatus();
               stockInvoiceStatus.setStatus(stockInvoiceMapObject.get("status").toString());
               stockInvoiceStatusesList.add(stockInvoiceStatus);
           }
           stockInvoice.setStockInvoiceStatuses(stockInvoiceStatusesList);
        }

        if(stockInvoiceMap.get("voided") != null){
            stockInvoice.setVoided((boolean) stockInvoiceMap.get("voided"));
        }

         return stockInvoice;
    }


    public Map<String, Object> toMap() {

        HashMap<String,Object> stockInvoiceObject = new HashMap<String,Object>();
        stockInvoiceObject.put("invoiceNumber",this.getInvoiceNumber());
        stockInvoiceObject.put("receivingDate", this.getReceivingDate());
        stockInvoiceObject.put("uuid",this.getUuid());

        if(this.getSupplier() != null){
            Map<String,Object> supplierObject = new HashMap<>();
            supplierObject.put("uuid",this.getSupplier().getUuid());
            supplierObject.put("name", this.getSupplier().getName());
            stockInvoiceObject.put("supplier",supplierObject);
        }

        if(this.purchaseOrder != null){
            Map<String,Object> purchaseOrderObject = new HashMap<String,Object>();
            purchaseOrderObject.put("uuid",this.getPurchaseOrder().getUuid());
            purchaseOrderObject.put("display",this.getPurchaseOrder().getCode());
            stockInvoiceObject.put("purchaseOrder",purchaseOrderObject);
        }

//        if(this.getStockInvoiceItems() != null) {
//                List<Map<String, Object>> stockInvoiceItems = new ArrayList<>();
//                for (StockInvoiceItem stockInvoiceItem : this.getStockInvoiceItems()) {
//                    stockInvoiceItems.add(stockInvoiceItem.toMap());
//                }
//                stockInvoiceObject.put("InvoiceItems", stockInvoiceItems);
//
//        }


        if (this.getCreator() != null) {
            Map<String, Object> creatorObject = new HashMap<String, Object>();
            creatorObject.put("uuid", this.getCreator().getUuid());
            creatorObject.put("display", this.getCreator().getDisplayString());
            stockInvoiceObject.put("creator", creatorObject);
        }

        if(this.getStockInvoiceStatuses() != null){
            List<Map<String,Object>> stockInvoiceStatusesMapList = new ArrayList<>();
            Map<String,Object> stockInvoiceStatusesMap = new HashMap<>();
            for (StockInvoiceStatus stockInvoiceStatus : this.getStockInvoiceStatuses()){
                stockInvoiceStatusesMap.put("status",stockInvoiceStatus.getStatus());
            }
            stockInvoiceStatusesMapList.add(stockInvoiceStatusesMap);
            stockInvoiceObject.put("stockInvoiceStatus",stockInvoiceStatusesMapList);

        }

        if(this.getVoided() != null){
            stockInvoiceObject.put("voided",this.getVoided());
        }

        if(this.getTotalAmount() != null){
            stockInvoiceObject.put("totalAmount",this.getTotalAmount());
        }

        return stockInvoiceObject;
    }

    // Added this function to optimize performance when getting stock invoices
    public Map<String, Object> toMapWithItems(){

        Map<String,Object> stockInvoiceObject = this.toMap();

        if(this.getStockInvoiceItems() != null) {
            List<Map<String, Object>> stockInvoiceItems = new ArrayList<>();
            for (StockInvoiceItem stockInvoiceItem : this.getStockInvoiceItems()) {
                stockInvoiceItems.add(stockInvoiceItem.toMap());
            }
            stockInvoiceObject.put("InvoiceItems", stockInvoiceItems);

        }
        return  stockInvoiceObject;
    }

}
