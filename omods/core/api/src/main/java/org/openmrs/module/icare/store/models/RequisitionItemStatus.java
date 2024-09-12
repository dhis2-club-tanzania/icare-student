package org.openmrs.module.icare.store.models;

import org.openmrs.BaseOpenmrsData;
import org.openmrs.module.icare.core.Item;
import org.openmrs.module.icare.laboratory.models.SampleOrder;

import javax.persistence.*;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "st_requisition_item_status")
public class RequisitionItemStatus extends BaseOpenmrsData implements java.io.Serializable {
	
	@Id
	@GeneratedValue()
	@Column(name = "requisition_item_status_id", unique = true, nullable = false)
	private Integer id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumns({ @JoinColumn(name = "requisition_id", referencedColumnName = "requisition_id", nullable = false),
	        @JoinColumn(name = "item_id", referencedColumnName = "item_id", nullable = false) })
	private RequisitionItem requisitionItem;
	
	//	@ManyToOne
	//	@JoinColumn(name = "requisition_id", nullable = false)
	//	private Requisition requisition;
	//
	//	@ManyToOne
	//	@JoinColumn(name = "item_id", nullable = false)
	//	private Item item;
	//
	@Column(name = "remarks", length = 65535)
	private String remarks;
	
	@Column(name = "status", length = 32)
	private String status;
	
	public static enum RequisitionItemStatusCode {
		RECEIVED, PENDING, REQUESTED, DRAFT;
		
	}
	
	@Override
	public Integer getId() {
		return id;
	}
	
	@Override
	public void setId(Integer id) {
		this.id = id;
	}
	
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	
	public String getRemarks() {
		return remarks;
	}
	
	public void setStatus(String status) {
		this.status = status;
	}
	
	public String getStatus() {
		return status;
	}
	
	public RequisitionItem getRequisitionItem() {
		return requisitionItem;
	}
	
	public void setRequisitionItem(RequisitionItem requisitionItem) {
		this.requisitionItem = requisitionItem;
	}
	
	//	public Item getItem() {
	//		return item;
	//	}
	//
	//	public void setItem(Item item) {
	//		this.item = item;
	//	}
	//
	//	public Requisition getRequisition() {
	//		return requisition;
	//	}
	//
	//	public void setRequisition(Requisition requisition) {
	//		this.requisition = requisition;
	//	}
	
	public Map<String,Object> toMap(){

        Map<String,Object> requisitionStatusMap = new HashMap<>();
        requisitionStatusMap.put("status",this.getStatus());

		Map<String,Object> itemMap = new HashMap<>();
		itemMap.put("uuid",this.getRequisitionItem().getItem().getUuid());
		itemMap.put("display",this.getRequisitionItem().getItem().getDisplayString());
		requisitionStatusMap.put("item",itemMap);

		Map<String,Object> requisitionMap = new HashMap<>();
		requisitionMap.put("uuid",this.getRequisitionItem().getRequisition().getUuid());
		requisitionMap.put("display",this.getRequisitionItem().getRequisition().getCode());

		requisitionStatusMap.put("requisition",requisitionMap);
		
        return  requisitionStatusMap;

    }
}
