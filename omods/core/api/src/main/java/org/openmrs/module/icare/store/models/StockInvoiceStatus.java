package org.openmrs.module.icare.store.models;

import org.openmrs.BaseOpenmrsData;
import org.openmrs.module.icare.core.JSONConverter;

import javax.persistence.*;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "st_stock_invoice_status")
public class StockInvoiceStatus extends BaseOpenmrsData implements java.io.Serializable, JSONConverter {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "stock_invoice_status_id", unique = true, nullable = false)
	public Integer id;
	
	@ManyToOne
	@JoinColumn(name = "stock_invoice_id")
	public StockInvoice stockInvoice;
	
	@Column(name = "status")
	public String status;
	
	@Column(name = "remarks")
	public String remarks;
	
	public enum Type {
		DRAFT, RECEIVED
	}
	
	@Override
	public Integer getId() {
		return id;
	}
	
	@Override
	public void setId(Integer id) {
		this.id = id;
	}
	
	public StockInvoice getStockInvoice() {
		return stockInvoice;
	}
	
	public void setStockInvoice(StockInvoice stockInvoice) {
		this.stockInvoice = stockInvoice;
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

        Map<String,Object> stockInvoiceStatusMap = new HashMap<>();
        stockInvoiceStatusMap.put("status", this.getStatus());
        stockInvoiceStatusMap.put("remarks",this.getRemarks());
        stockInvoiceStatusMap.put("uuid",this.getUuid());

        Map<String,Object> stockInvoiceMap = new HashMap<>();
        stockInvoiceMap.put("uuid",this.getStockInvoice().getUuid());
        stockInvoiceMap.put("display",this.getStockInvoice().getInvoiceNumber());
        stockInvoiceStatusMap.put("stockInvoice",stockInvoiceMap);


        return stockInvoiceStatusMap;
    }
	
	public static StockInvoiceStatus fromMap(Map<String, Object> stockInvoiceStatusMap) {
		
		StockInvoiceStatus stockInvoiceStatus = new StockInvoiceStatus();
		stockInvoiceStatus.setStatus(stockInvoiceStatusMap.get("status").toString());
		stockInvoiceStatus.setRemarks(stockInvoiceStatusMap.get("remarks").toString());
		
		StockInvoice stockInvoice = new StockInvoice();
		stockInvoice.setUuid(((Map) stockInvoiceStatusMap.get("stockInvoice")).get("uuid").toString());
		
		stockInvoiceStatus.setStockInvoice(stockInvoice);
		
		return stockInvoiceStatus;
	}
}
