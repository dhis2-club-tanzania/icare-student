package org.openmrs.module.icare.store.models;

import org.openmrs.BaseOpenmrsData;
import org.openmrs.module.icare.core.JSONConverter;

import javax.persistence.*;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "st_stock_invoice_item_status")
public class StockInvoiceItemStatus extends BaseOpenmrsData implements java.io.Serializable, JSONConverter {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "stock_invoice_item_status_id", unique = true, nullable = false)
	public Integer id;
	
	@ManyToOne
	@JoinColumn(name = "stock_invoice_item_id")
	public StockInvoiceItem stockInvoiceItem;
	
	@Column(name = "status")
	public String status;
	
	@Column(name = "remarks")
	public String remarks;
	
	public enum Type {
		DRAFT, RECEIVED, PENDING, PAID
	}
	
	@Override
	public Integer getId() {
		return id;
	}
	
	@Override
	public void setId(Integer id) {
		this.id = id;
	}
	
	public StockInvoiceItem getStockInvoiceItem() {
		return stockInvoiceItem;
	}
	
	public void setStockInvoiceItem(StockInvoiceItem stockInvoiceItem) {
		this.stockInvoiceItem = stockInvoiceItem;
	}
	
	public String getStatus() {
		return status;
	}
	
	public void setStatus(String status) {
		this.status = status;
	}
	
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	
	public String getRemarks() {
		return remarks;
	}
	
	@Override
    public Map<String, Object> toMap() {

        Map<String,Object> stockInvoiceItemStatusMap = new HashMap<>();
        stockInvoiceItemStatusMap.put("status", this.getStatus());
        stockInvoiceItemStatusMap.put("remarks",this.getRemarks());
        stockInvoiceItemStatusMap.put("uuid",this.getUuid());

        Map<String,Object> stockInvoiceItemMap = new HashMap<>();
        stockInvoiceItemMap.put("uuid",this.getStockInvoiceItem().getUuid());
        stockInvoiceItemMap.put("display",this.getStockInvoiceItem().getBatchNo());
        stockInvoiceItemStatusMap.put("stockInvoiceItem",stockInvoiceItemMap);

        return stockInvoiceItemStatusMap;
    }
	
	public static StockInvoiceItemStatus fromMap(Map<String, Object> stockInvoiceItemStatusMap) {
		
		StockInvoiceItemStatus stockInvoiceItemStatus = new StockInvoiceItemStatus();
		stockInvoiceItemStatus.setStatus(stockInvoiceItemStatusMap.get("status").toString());
		stockInvoiceItemStatus.setRemarks(stockInvoiceItemStatusMap.get("remarks").toString());
		
		StockInvoiceItem stockInvoiceItem = new StockInvoiceItem();
		stockInvoiceItem.setUuid(((Map) stockInvoiceItemStatusMap.get("stockInvoiceItem")).get("uuid").toString());
		
		stockInvoiceItemStatus.setStockInvoiceItem(stockInvoiceItem);
		
		return stockInvoiceItemStatus;
	}
}
