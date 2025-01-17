package org.openmrs.module.icare.billing.services.insurance.nhif;

import com.fasterxml.jackson.annotation.JsonProperty;

// import com.fasterxml.jackson.databind.ObjectMapper; // version 2.11.1
// import com.fasterxml.jackson.annotation.JsonProperty; // version 2.11.1
/* ObjectMapper om = new ObjectMapper();
Root root = om.readValue(myJsonString), Root.class); */
public class PricePackage {
	
	@JsonProperty("ItemCode")
	public String itemCode;
	
	@JsonProperty("PriceCode")
	public String priceCode;
	
	@JsonProperty("LevelPriceCode")
	public String levelPriceCode;
	
	@JsonProperty("OldItemCode")
	public Object oldItemCode;
	
	@JsonProperty("ItemTypeID")
	public int itemTypeID;
	
	@JsonProperty("ItemName")
	public String itemName;
	
	@JsonProperty("Strength")
	public String strength;
	
	@JsonProperty("Dosage")
	public String dosage;
	
	@JsonProperty("PackageID")
	public int packageID;
	
	@JsonProperty("SchemeID")
	public int schemeID;
	
	@JsonProperty("FacilityLevelCode")
	public String facilityLevelCode;
	
	@JsonProperty("UnitPrice")
	public double unitPrice;
	
	@JsonProperty("IsRestricted")
	public boolean isRestricted;
	
	@JsonProperty("MaximumQuantity")
	public int maximumQuantity;
	
	@JsonProperty("AvailableInLevels")
	public Object availableInLevels;
	
	@JsonProperty("PractitionerQualifications")
	public Object practitionerQualifications;
	
	@JsonProperty("IsActive")
	public boolean isActive;
}
