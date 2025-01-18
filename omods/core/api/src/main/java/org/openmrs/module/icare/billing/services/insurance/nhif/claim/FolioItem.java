package org.openmrs.module.icare.billing.services.insurance.nhif.claim;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.openmrs.Concept;
import org.openmrs.ConceptMap;
import org.openmrs.DrugReferenceMap;
import org.openmrs.Order;
import org.openmrs.api.context.Context;
import org.openmrs.module.icare.billing.models.InvoiceItem;
import org.openmrs.module.icare.billing.services.BillingService;

import java.util.Date;

public class FolioItem {
	
	@JsonProperty("FolioItemID")
	public String folioItemID;
	
	@JsonProperty("FolioID")
	public String folioID;
	
	public static FolioItem fromOrder(Order order) {
		FolioItem folioItem = new FolioItem();
		BillingService billingService = Context.getService(BillingService.class);
		InvoiceItem invoiceItem = billingService.getInvoiceItemByOrder(order);
		if (invoiceItem == null) {
			return null;
		}
		folioItem.setFolioID(order.getEncounter().getVisit().getUuid());
		folioItem.setFolioItemID(order.getUuid());
		//		if (invoiceItem.getItem().getConcept() != null) {
		//			for (ConceptMap map : invoiceItem.getItem().getConcept().getConceptMappings()) {
		//				if (map.getConceptReferenceTerm().getConceptSource().getName().toLowerCase().equals("nhif")) {
		//					if (map.getConceptReferenceTerm().getCode() == null) {
		//						folioItem.setItemCode("[Code Does not exist]");
		//					} else {
		//						folioItem.setItemCode(map.getConceptReferenceTerm().getCode());
		//					}
		//					if (map.getConceptReferenceTerm().getName() == null) {
		//						folioItem.setItemName("[Item is not mapped]");
		//					} else {
		//						folioItem.setItemName(invoiceItem.getItem().getConcept().getName().getName());
		//					}
		//				}
		//			}
		//			//folioItem.setItemCode();
		//		} else if (invoiceItem.getItem().getDrug() != null) {
		//			for (ConceptMap map : invoiceItem.getItem().getDrug().getConcept().getConceptMappings()) {
		//				if (map.getConceptReferenceTerm().getConceptSource().getName().toLowerCase().equals("nhif")) {
		//					if (map.getConceptReferenceTerm().getCode() == null) {
		//						folioItem.setItemCode("[Code Does not exist]");
		//					} else {
		//						folioItem.setItemCode(map.getConceptReferenceTerm().getCode());
		//					}
		//					if (map.getConceptReferenceTerm().getName() == null) {
		//						folioItem.setItemName("[Item is not mapped]");
		//					} else {
		//						folioItem.setItemName(invoiceItem.getItem().getDrug().getName());
		//					}
		//				}
		//			}
		/*for (DrugReferenceMap map : invoiceItem.getItem().getDrug().getDrugReferenceMaps()) {
			if (map.getConceptReferenceTerm().getConceptSource().getName().toLowerCase().equals("nhif")) {
				if (map.getConceptReferenceTerm().getCode() == null) {
					folioItem.setItemCode("[Code Does not exist]");
				} else {
					folioItem.setItemCode(map.getConceptReferenceTerm().getCode());
				}
				if (map.getConceptReferenceTerm().getName() == null) {
					folioItem.setItemName("[Item is not mapped]");
				} else {
					folioItem.setItemName(map.getConceptReferenceTerm().getName());
				}
			}
		}*/
		//}
		if (invoiceItem.getItem().getConcept() != null) {
			for (ConceptMap map : invoiceItem.getItem().getConcept().getConceptMappings()) {
				if (map.getConceptReferenceTerm().getConceptSource().getName().toLowerCase().equals("nhif")) {
					if (map.getConceptReferenceTerm().getCode().equals(null)) {
						folioItem.setItemCode("[Code Does not exist]");
					} else {
						folioItem.setItemCode(map.getConceptReferenceTerm().getCode());
					}
				}
			}
		} else {
			for (ConceptMap map : invoiceItem.getItem().getDrug().getConcept().getConceptMappings()) {
				if (map.getConceptReferenceTerm().getConceptSource().getName().toLowerCase().equals("nhif")) {
					if (map.getConceptReferenceTerm().getCode().equals(null)) {
						folioItem.setItemCode("[Code Does not exist]");
					} else {
						folioItem.setItemCode(map.getConceptReferenceTerm().getCode());
					}
				}
			}
		}
		
		folioItem.setItemName(invoiceItem.getItem().getDisplayString());
		folioItem.setItemQuantity(invoiceItem.getQuantity().intValue());
		folioItem.setUnitPrice(invoiceItem.getPrice().intValue());
		folioItem.setAmountClaimed((int) (invoiceItem.getQuantity() * invoiceItem.getPrice()));
		folioItem.setCreatedBy(order.getCreator().getDisplayString());
		folioItem.setDateCreated(order.getDateCreated());
		folioItem.setOtherDetails("");
		//TODO adding approval refference number
		folioItem.setApprovalRefNo("");
		if (order.getChangedBy() != null) {
			folioItem.setLastModifiedBy(order.getChangedBy().getDisplayString());
			folioItem.setLastModified(order.getDateChanged());
		} else {
			folioItem.setLastModifiedBy(order.getCreator().getDisplayString());
			folioItem.setLastModified(order.getDateCreated());
		}
		return folioItem;
	}
	
	public String getFolioItemID() {
		return folioItemID;
	}
	
	public void setFolioItemID(String folioItemID) {
		this.folioItemID = folioItemID;
	}
	
	public String getFolioID() {
		return folioID;
	}
	
	public void setFolioID(String folioID) {
		this.folioID = folioID;
	}
	
	public String getItemCode() {
		return itemCode;
	}
	
	public void setItemCode(String itemCode) {
		this.itemCode = itemCode;
	}
	
	public Object getOtherDetails() {
		return otherDetails;
	}
	
	public void setOtherDetails(Object otherDetails) {
		this.otherDetails = otherDetails;
	}
	
	public int getItemQuantity() {
		return itemQuantity;
	}
	
	public void setItemQuantity(int itemQuantity) {
		this.itemQuantity = itemQuantity;
	}
	
	public float getUnitPrice() {
		return unitPrice;
	}
	
	public void setUnitPrice(int unitPrice) {
		this.unitPrice = unitPrice;
	}
	
	public float getAmountClaimed() {
		return amountClaimed;
	}
	
	public void setAmountClaimed(int amountClaimed) {
		this.amountClaimed = amountClaimed;
	}
	
	public String getApprovalRefNo() {
		return approvalRefNo;
	}
	
	public void setApprovalRefNo(String approvalRefNo) {
		this.approvalRefNo = approvalRefNo;
	}
	
	public String getCreatedBy() {
		return createdBy;
	}
	
	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}
	
	public Date getDateCreated() {
		return dateCreated;
	}
	
	public void setDateCreated(Date dateCreated) {
		this.dateCreated = dateCreated;
	}
	
	public String getLastModifiedBy() {
		return lastModifiedBy;
	}
	
	public void setLastModifiedBy(String lastModifiedBy) {
		this.lastModifiedBy = lastModifiedBy;
	}
	
	public Date getLastModified() {
		return lastModified;
	}
	
	public void setLastModified(Date lastModified) {
		this.lastModified = lastModified;
	}
	
	@JsonProperty("ItemCode")
	public String itemCode;
	
	@JsonProperty("ItemName")
	private String itemName;
	
	@JsonProperty("OtherDetails")
	public Object otherDetails;
	
	@JsonProperty("ItemQuantity")
	public int itemQuantity;
	
	@JsonProperty("UnitPrice")
	public float unitPrice;
	
	@JsonProperty("AmountClaimed")
	public float amountClaimed;
	
	@JsonProperty("ApprovalRefNo")
	public String approvalRefNo;
	
	@JsonProperty("CreatedBy")
	public String createdBy;
	
	@JsonProperty("DateCreated")
	public Date dateCreated;
	
	@JsonProperty("LastModifiedBy")
	public String lastModifiedBy;
	
	@JsonProperty("LastModified")
	public Date lastModified;
	
	public String getItemName() {
		return itemName;
	}
	
	public void setItemName(String itemName) {
		this.itemName = itemName;
	}
}
