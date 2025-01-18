package org.openmrs.module.icare.store.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.openmrs.BaseOpenmrsData;
import org.openmrs.Concept;
import org.openmrs.Location;
import org.openmrs.api.LocationService;
import org.openmrs.module.icare.billing.models.InvoiceItem;
import org.openmrs.module.icare.core.Item;
import org.openmrs.module.icare.core.JSONConverter;
import org.openmrs.module.icare.store.util.Stockable;

import javax.persistence.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Entity
@Table(name = "st_stock_invoice_item")
public class StockInvoiceItem extends BaseOpenmrsData implements java.io.Serializable, JSONConverter, Stockable {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "stock_invoice_item_id", unique = true, nullable = false)
	private Integer id;
	
	@ManyToOne
	@JoinColumn(name = "stock_invoice_id")
	private StockInvoice stockInvoice;
	
	@ManyToOne
	@JoinColumn(name = "item_id")
	private Item item;
	
	@Column(name = "batch_no", length = 30)
	private String batchNo;
	
	@Column(name = "order_quantity")
	private Integer orderQuantity;
	
	@Column(name = "batch_quantity")
	private Integer batchQuantity;
	
	@Column(name = "expiry_date")
	private Date expiryDate;
	
	@ManyToOne
	@JoinColumn(name = "uom")
	private Concept uom;
	
	@Column(name = "unit_price")
	private Double unitPrice;
	
	@Column(name = "amount")
	private Double amount;

	@ManyToOne
	@JoinColumn(name = "location_id")
	private Location location;

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "stockInvoiceItem")
	private List<StockInvoiceItemStatus> stockInvoiceItemStatuses = new ArrayList<>(0);

	
	@Override
	public Integer getId() {
		return id;
	}
	
	@Override
	public void setId(Integer id) {
		this.id = id;
	}
	
	public Item getItem() {
		return item;
	}
	
	public void setItem(Item item) {
		this.item = item;
	}
	
	public String getBatchNo() {
		return batchNo;
	}
	
	public void setBatchNo(String batchNo) {
		this.batchNo = batchNo;
	}
	
	public Integer getOrderQuantity() {
		return orderQuantity;
	}
	
	public void setOrderQuantity(Integer orderQuantity) {
		this.orderQuantity = orderQuantity;
	}
	
	public Integer getBatchQuantity() {
		return batchQuantity;
	}
	
	public void setBatchQuantity(Integer batchQuantity) {
		this.batchQuantity = batchQuantity;
	}
	
	public Date getExpiryDate() {
		return expiryDate;
	}

	@Override
	public Double getQuantity() {
		Double batchQuantity = Double.valueOf(this.getBatchQuantity());
		return batchQuantity;
	}

	@Override
	public Location getLocation() {
		return location;
	}

	@Override
	public Location getSourceLocation() {
		if (this.getStockInvoice() != null) {
			return this.getStockInvoice().getSupplier().getLocation();
		} else {
			return null;
		}
	}


	@Override
	public Location getDestinationLocation() {
		return location;
	}

	public void setLocation(Location location) {
		this.location = location;
	}

	public void setExpiryDate(Date expiryDate) {
		this.expiryDate = expiryDate;
	}
	
	public Concept getUom() {
		return uom;
	}
	
	public void setUom(Concept uom) {
		this.uom = uom;
	}
	
	public Double getUnitPrice() {
		return unitPrice;
	}
	
	public void setUnitPrice(Double unitPrice) {
		this.unitPrice = unitPrice;
	}
	
	public Double getAmount() {
		return amount;
	}
	
	public void setAmount(Double amount) {
		this.amount = amount;
	}
	
	public void setStockInvoice(StockInvoice stockInvoice) {
		this.stockInvoice = stockInvoice;
	}
	
	public StockInvoice getStockInvoice() {
		return stockInvoice;
	}

	public List<StockInvoiceItemStatus> getStockInvoiceItemStatuses() {
		return stockInvoiceItemStatuses;
	}

	public void setStockInvoiceItemStatuses(List<StockInvoiceItemStatus> stockInvoiceItemStatuses) {
		this.stockInvoiceItemStatuses = stockInvoiceItemStatuses;
	}


	@Override
    public Map<String, Object> toMap() {

        HashMap<String,Object> stockInvoiceItemObject = new HashMap<>();
		if(this.getUuid() != null){
			stockInvoiceItemObject.put("uuid",this.getUuid());
		}
		if(this.getBatchNo() != null) {
			stockInvoiceItemObject.put("batchNo", this.getBatchNo());
		}
		if(this.getOrderQuantity() != null) {
			stockInvoiceItemObject.put("orderQuantity", this.getOrderQuantity());
		}

		if(this.getBatchQuantity() != null) {
			stockInvoiceItemObject.put("batchQuantity", this.getBatchQuantity());
		}
		if(this.getUnitPrice() != null) {
			stockInvoiceItemObject.put("unitPrice", this.getUnitPrice());
		}
		if(this.getAmount() != null) {
			stockInvoiceItemObject.put("amount", this.getAmount());
		}
		if(this.getExpiryDate() != null) {
			stockInvoiceItemObject.put("expiryDate", this.getExpiryDate());
		}
		if(this.getStockInvoice() != null) {
			HashMap<String, Object> stockInvoiceObject = new HashMap<>();
			stockInvoiceObject.put("uuid", this.stockInvoice.getUuid());
			stockInvoiceObject.put("display", this.stockInvoice.getInvoiceNumber());
			stockInvoiceItemObject.put("stockInvoice", stockInvoiceObject);
		}
		if(this.getItem() != null) {
			HashMap<String, Object> itemObject = new HashMap<>();
			itemObject.put("uuid", this.getItem().getUuid());
			itemObject.put("display", this.getItem().getDisplayString());
			stockInvoiceItemObject.put("item", itemObject);
		}

		if(this.getUom() != null) {
			HashMap<String, Object> uomObject = new HashMap<>();
			uomObject.put("uuid", this.getUom().getUuid());
			uomObject.put("display", this.getUom().getDisplayString());
			stockInvoiceItemObject.put("uom", uomObject);
		}

		if(this.getStockInvoiceItemStatuses() != null){
			List<Map<String,Object>> stockInvoiceStatusesMapList = new ArrayList<>();
			Map<String,Object> stockInvoiceItemStatusesMap = new HashMap<>();
			for (StockInvoiceItemStatus stockInvoiceItemStatus : this.getStockInvoiceItemStatuses()){
				stockInvoiceItemStatusesMap.put("status",stockInvoiceItemStatus.getStatus());
			}
			stockInvoiceStatusesMapList.add(stockInvoiceItemStatusesMap);
			stockInvoiceItemObject.put("stockInvoiceItemStatus",stockInvoiceStatusesMapList);

		}

		if(this.getLocation() != null){
			HashMap<String,Object> locationObjectMap = new HashMap<>();
			locationObjectMap.put("uuid",this.getLocation().getUuid());
			locationObjectMap.put("display",this.getLocation().getDisplayString());
			stockInvoiceItemObject.put("location",locationObjectMap);
		}

		if (this.getCreator() != null) {
			Map<String, Object> creatorObject = new HashMap<String, Object>();
			creatorObject.put("uuid", this.getCreator().getUuid());
			creatorObject.put("display", this.getCreator().getDisplayString());
			stockInvoiceItemObject.put("creator", creatorObject);
		}

		if(this.getSourceLocation() != null){
			HashMap<String,Object> locationObjectMap = new HashMap<>();
			locationObjectMap.put("uuid",this.getSourceLocation().getUuid());
			locationObjectMap.put("display",this.getSourceLocation().getDisplayString());
			stockInvoiceItemObject.put("location",locationObjectMap);

		}

		if(this.getVoided() != null){
			stockInvoiceItemObject.put("voided",this.getVoided());
		}
		
        return stockInvoiceItemObject;
    }
	
	public static StockInvoiceItem fromMap(Map<String, Object> stockInvoiceItemMap) throws ParseException {
		
		StockInvoiceItem stockInvoiceItem = new StockInvoiceItem();
		
		if (stockInvoiceItemMap.get("item") != null) {
			Item item = new Item();
			item.setUuid(((Map) stockInvoiceItemMap.get("item")).get("uuid").toString());
			stockInvoiceItem.setItem(item);
		}
		
		if (stockInvoiceItemMap.get("uom") != null) {
			Concept uom = new Concept();
			uom.setUuid(((Map) stockInvoiceItemMap.get("uom")).get("uuid").toString());
			stockInvoiceItem.setUom(uom);
		}
		
		if (stockInvoiceItemMap.get("batchNo") != null) {
			stockInvoiceItem.setBatchNo(stockInvoiceItemMap.get("batchNo").toString());
		}
		if (stockInvoiceItemMap.get("unitPrice") != null) {
			Double unitPrice = Double.valueOf(stockInvoiceItemMap.get("unitPrice").toString());
			stockInvoiceItem.setUnitPrice(unitPrice);
		}
		if (stockInvoiceItemMap.get("amount") != null) {
			Double amount = Double.valueOf(stockInvoiceItemMap.get("amount").toString());
			stockInvoiceItem.setAmount(amount);
		}
		
		if (stockInvoiceItemMap.get("batchQuantity") != null) {
			stockInvoiceItem.setBatchQuantity((Integer) stockInvoiceItemMap.get("batchQuantity"));
		}
		if (stockInvoiceItemMap.get("orderQuantity") != null) {
			stockInvoiceItem.setOrderQuantity((Integer) stockInvoiceItemMap.get("orderQuantity"));
		}
		if (stockInvoiceItemMap.get("expiryDate") != null) {
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
			if (stockInvoiceItemMap.get("expiryDate").toString().length() == 10) {
				stockInvoiceItem.setExpiryDate(dateFormat.parse(stockInvoiceItemMap.get("expiryDate").toString()));
			} else {
				stockInvoiceItem.setExpiryDate(dateFormat.parse(stockInvoiceItemMap.get("expiryDate").toString()
				        .substring(0, stockInvoiceItemMap.get("expiryDate").toString().indexOf("T"))));
			}
		}
		
		//		if(stockInvoiceItemMap.get("stockInvoiceUuid") != null){
		//			StockInvoice stockInvoice = new StockInvoice();
		//			stockInvoice.setUuid(stockInvoiceItemMap.get("stockInvoiceUuid").toString());
		//			stockInvoiceItem.setStockInvoice(stockInvoice);
		//		}

		if(stockInvoiceItemMap.get("stockInvoiceItemStatus") != null){
			List<StockInvoiceItemStatus> stockInvoiceItemStatusesList = new ArrayList<>();
			for(Map<String,Object> stockInvoiceItemMapObject :(List<Map<String, Object>>) stockInvoiceItemMap.get("stockInvoiceItemStatus")) {
				StockInvoiceItemStatus stockInvoiceItemStatus = new StockInvoiceItemStatus();
				stockInvoiceItemStatus.setStatus(stockInvoiceItemMapObject.get("status").toString());
				stockInvoiceItemStatusesList.add(stockInvoiceItemStatus);
			}
			stockInvoiceItem.setStockInvoiceItemStatuses(stockInvoiceItemStatusesList);
		}

		if(stockInvoiceItemMap.get("location") != null){
			Location location = new Location();
			location.setUuid(((Map)stockInvoiceItemMap.get("location")).get("uuid").toString());
			stockInvoiceItem.setLocation(location);
		}


		if(stockInvoiceItemMap.get("voided") != null){
			stockInvoiceItem.setVoided((boolean) stockInvoiceItemMap.get("voided"));
		}
		return stockInvoiceItem;
		
	}
}
