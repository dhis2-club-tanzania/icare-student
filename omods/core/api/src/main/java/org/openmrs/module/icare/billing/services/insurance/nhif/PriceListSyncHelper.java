package org.openmrs.module.icare.billing.services.insurance.nhif;

import org.openmrs.*;
import org.openmrs.api.ConceptNameType;
import org.openmrs.api.ConceptService;
import org.openmrs.api.context.Context;
import org.openmrs.api.context.UserContext;
import org.openmrs.module.icare.billing.models.ItemPrice;
import org.openmrs.module.icare.billing.services.insurance.InsuranceItem;
import org.openmrs.module.icare.billing.services.insurance.ItemType;
import org.openmrs.module.icare.billing.services.insurance.SyncResult;
import org.openmrs.module.icare.core.ICareService;
import org.openmrs.module.icare.core.Item;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class PriceListSyncHelper implements Callable<SyncResult> {
	
	private static final Logger log = LoggerFactory.getLogger(PriceListSyncHelper.class);
	
	List<Map<String, Object>> pricePackages;
	
	List<Map<String, Object>> excludedServices;
	
	UserContext userContext;
	
	PriceListSyncHelper(UserContext userContext, List<Map<String, Object>> pricePackages,
	    List<Map<String, Object>> excludedServices) {
		this.pricePackages = pricePackages;
		this.excludedServices = excludedServices;
	}
	
	public Concept getPaymentSchemePackages(Map<String, Object> pricePackage) {
		//Get Scheme for this product
		ConceptService conceptService = Context.getService(ConceptService.class);
		ConceptSource NHIFConceptSource = conceptService.getConceptSourceByName("NHIF");
		ConceptReferenceTerm conceptReferenceTerm = conceptService.getConceptReferenceTermByCode(
		    (String) pricePackage.get("ItemCode"), NHIFConceptSource);
		ConceptReferenceTerm conceptReferenceTerm2 = conceptService.getConceptReferenceTermByCode(
		    (String) pricePackage.get("PriceCode"), NHIFConceptSource);
		if (conceptReferenceTerm2 != null) {
			conceptReferenceTerm2.getConceptReferenceTermMaps();
			for (Concept concept : conceptService.getConceptsByMapping(conceptReferenceTerm2.getCode(),
			    conceptReferenceTerm2.getConceptSource().getName())) {
				for (ConceptMap conceptMap : concept.getConceptMappings()) {
					if (conceptMap.getConceptReferenceTerm().getCode().equals(conceptReferenceTerm2.getCode())) {
						concept.removeConceptMapping(conceptMap);
					}
				}
				conceptService.saveConcept(concept);
			}
			conceptService.purgeConceptReferenceTerm(conceptReferenceTerm2);
		}
		if (conceptReferenceTerm == null) {
			conceptReferenceTerm = new ConceptReferenceTerm();
			conceptReferenceTerm.setCode((String) pricePackage.get("ItemCode"));
			conceptReferenceTerm.setConceptSource(NHIFConceptSource);
			conceptReferenceTerm.setName((String) pricePackage.get("ItemName"));
			conceptService.saveConceptReferenceTerm(conceptReferenceTerm);
		}
		
		Concept concept = conceptService.getConceptByName("NHIF:" + pricePackage.get("SchemeID"));
		if (concept == null) {
			concept = new Concept();
			concept.setSet(false);
			concept.setDatatype(conceptService.getConceptDatatypeByUuid(ConceptDatatype.TEXT_UUID));
			ConceptClass pSchemeConceptClass = conceptService.getConceptClassByName("Payment Scheme");
			if (pSchemeConceptClass == null) {
				return null;
			}
			concept.setConceptClass(pSchemeConceptClass);
			
			ConceptName conceptName = new ConceptName();
			conceptName.setName("NHIF:" + pricePackage.get("SchemeID"));
			conceptName.setConceptNameType(ConceptNameType.FULLY_SPECIFIED);
			conceptName.setLocale(Locale.ENGLISH);
			concept.setPreferredName(conceptName);
			
			conceptService.saveConcept(concept);
			
			Concept NHIFconcept = conceptService.getConceptByName("NHIF");
			NHIFconcept.addSetMember(concept);
			conceptService.saveConcept(NHIFconcept);
		}
		return concept;
	}
	
	private Drug getDrugItemConcept(Concept itemConcept, Map<String, Object> pricePackage) {
		ConceptService conceptService = Context.getService(ConceptService.class);
		
		if (itemConcept == null) {
			itemConcept = new Concept();
			itemConcept.setSet(false);
			itemConcept.setConceptClass(conceptService.getConceptClassByName("Drug"));
			itemConcept.setDatatype(conceptService.getConceptDatatypeByName("N/A"));
			
			ConceptName conceptName = new ConceptName();
			conceptName.setName((String) pricePackage.get("ItemName"));
			conceptName.setConceptNameType(ConceptNameType.FULLY_SPECIFIED);
			conceptName.setLocale(Locale.ENGLISH);
			itemConcept.setPreferredName(conceptName);
			conceptService.saveConcept(itemConcept);
		} else {
			ConceptSource NHIFConceptSource = conceptService.getConceptSourceByName("NHIF");
			ConceptReferenceTerm conceptReferenceTerm = conceptService.getConceptReferenceTermByCode(
			    (String) pricePackage.get("ItemCode"), NHIFConceptSource);
			if (conceptReferenceTerm == null) {
				conceptReferenceTerm = new ConceptReferenceTerm();
				conceptReferenceTerm.setCode((String) pricePackage.get("ItemCode"));
				conceptReferenceTerm.setConceptSource(NHIFConceptSource);
				conceptReferenceTerm.setName((String) pricePackage.get("ItemName"));
				conceptService.saveConceptReferenceTerm(conceptReferenceTerm);
			}
			
			ConceptMap conceptMap = new ConceptMap();
			conceptMap.setConceptReferenceTerm(conceptReferenceTerm);
			itemConcept.addConceptMapping(conceptMap);
			conceptService.saveConcept(itemConcept);
		}
		
		List<Drug> drugs = conceptService.getDrugsByConcept(itemConcept);
		Drug drug = null;
		for (Drug d : drugs) {
			if (d.getName().equals(pricePackage.get("ItemName") + " " + pricePackage.get("Strength"))) {
				drug = d;
			}
		}
		if (drug == null) {
			drug = new Drug();
			drug.setConcept(itemConcept);
			drug.setName(pricePackage.get("ItemName") + " " + pricePackage.get("Strength"));
			drug.setStrength((String) pricePackage.get("Strength"));
			conceptService.saveDrug(drug);
		}
		return drug;
	}
	
	public SyncResult sync(){

        Map<Integer, ItemType> itemTypeMap = new HashMap<>();
        itemTypeMap.put(1,new ItemType("Service","N/A"));
        itemTypeMap.put(2, new ItemType("Bed","N/A"));
        itemTypeMap.put(3,new ItemType("Drug","N/A"));
        itemTypeMap.put(4,new ItemType("Procedure","Boolean"));
        itemTypeMap.put(5,new ItemType("Test","Text"));
        itemTypeMap.put(6, new ItemType("Prosthesis","Boolean"));
        itemTypeMap.put(7,new ItemType("Service Device","N/A"));
        itemTypeMap.put(8,new ItemType("Procedure","Boolean"));
        itemTypeMap.put(10,new ItemType("Procedure","Boolean"));
        itemTypeMap.put(11,new ItemType("Procedure","Boolean"));
        SyncResult result = new SyncResult();
        ConceptService conceptService = Context.getService(ConceptService.class);
        Concept nhifConcept = conceptService.getConceptByName("NHIF");
        for (Map<String, Object> pricePackage : pricePackages) {
            if(((String) pricePackage.get("ItemName")).trim().equals("")){
                continue;
            }
            //Get Item Mapping for this item

            //Get Scheme for this product

            Concept concept = getPaymentSchemePackages(pricePackage);//conceptService.getConceptByName("NHIF:" + pricePackage.get("SchemeID"));
            if (concept == null) {
                result.setStatus("ERROR");
                result.setMessage("Some Items have errors.");
                InsuranceItem insuranceItem = new InsuranceItem();
                insuranceItem.setStatus("ERROR");
                insuranceItem.setName((String) pricePackage.get("ItemName"));
                insuranceItem.setMessage("Payment Scheme concept class not configured.");
                result.getIgnored().add(insuranceItem);
                log.error("Payment Scheme concept class not configured.");
                continue;
            }
            ICareService iCareService = Context.getService(ICareService.class);
            //Creeate Item Price if not exists
            //for(conceptService.getConceptByMapping())
            Concept itemConcept = conceptService.getConceptByMapping((String) pricePackage.get("ItemCode"), "NHIF");
            Item item = null;
            ItemPrice itemPrice = null;
            if (itemConcept == null) {
                if(pricePackage.get("ItemTypeID") != null && ((int)pricePackage.get("ItemTypeID")) == 3){
                    itemConcept = conceptService.getConceptByName((String) pricePackage.get("ItemName"));
                    Drug drug = getDrugItemConcept(itemConcept, pricePackage);
                    item = iCareService.getItemByDrugUuid(drug.getUuid());
                    if (item == null) {
                        item = new Item();
                        item.setDrug(drug);
                        item.setStockable(true);
                        item = iCareService.saveItem(item);
                    }
                    itemPrice = iCareService.getItemPriceByDrugId(item.getDrug().getId(), concept.getId(),
                            nhifConcept.getId());
                }else if(pricePackage.get("ItemTypeID") != null){
                    itemConcept = conceptService.getConceptByName((String) pricePackage.get("ItemName"));


                    if(itemConcept == null){
                        itemConcept = new Concept();
                        itemConcept.setSet(false);
                        ConceptClass conceptClass = conceptService.getConceptClassByName(itemTypeMap.get(pricePackage.get("ItemTypeID")).getName());
                        if(conceptClass == null){
                            conceptClass = new ConceptClass();
                            conceptClass.setName(itemTypeMap.get(pricePackage.get("ItemTypeID")).getName());
                            conceptService.saveConceptClass(conceptClass);
                        }
                        itemConcept.setConceptClass(conceptClass);
                        itemConcept.setDatatype(conceptService.getConceptDatatypeByName(itemTypeMap.get(pricePackage.get("ItemTypeID")).getDataType()));

                        ConceptName conceptName = new ConceptName();
                        conceptName.setName((String) pricePackage.get("ItemName"));
                        conceptName.setConceptNameType(ConceptNameType.FULLY_SPECIFIED);
                        conceptName.setLocale(Locale.ENGLISH);
                        itemConcept.setPreferredName(conceptName);
                        conceptService.saveConcept(itemConcept);
                    } else {
                        ConceptSource NHIFConceptSource = conceptService.getConceptSourceByName("NHIF");
                        ConceptReferenceTerm conceptReferenceTerm = conceptService.getConceptReferenceTermByCode(
                                (String) pricePackage.get("ItemCode"), NHIFConceptSource);
                        if (conceptReferenceTerm == null) {
                            conceptReferenceTerm = new ConceptReferenceTerm();
                            conceptReferenceTerm.setCode((String) pricePackage.get("ItemCode"));
                            conceptReferenceTerm.setConceptSource(NHIFConceptSource);
                            conceptReferenceTerm.setName((String) pricePackage.get("ItemName"));
                            conceptService.saveConceptReferenceTerm(conceptReferenceTerm);
                        }

                        ConceptMap conceptMap = new ConceptMap();
                        conceptMap.setConceptReferenceTerm(conceptReferenceTerm);
                        itemConcept.addConceptMapping(conceptMap);
                        conceptService.saveConcept(itemConcept);
                    }


                    item = iCareService.getItemByConceptUuid(itemConcept.getUuid());
                    if (item == null) {
                        item = new Item();
                        item.setConcept(itemConcept);
                        item = iCareService.saveItem(item);
                    }
                    itemPrice = iCareService.getItemPriceByConceptId(item.getConcept().getId(), concept.getId(),
                            nhifConcept.getId());
                } else {
                    result.setStatus("ERROR");
                    InsuranceItem insuranceItem = new InsuranceItem();
                    insuranceItem.setStatus("ERROR");
                    insuranceItem.setName((String) pricePackage.get("ItemName"));
                    insuranceItem.setMessage("There are no mappings for NHIF.");
                    result.getIgnored().add(insuranceItem);
                    log.warn("There are no mappings for NHIF for " + pricePackage.get("ItemName") + "("
                            + pricePackage.get("ItemCode") + ")");
                    continue;
                }

            } else{
                item = iCareService.getItemByConceptUuid(itemConcept.getUuid());
                if (item == null) {
                    item = new Item();
                    item.setConcept(itemConcept);
                    item = iCareService.saveItem(item);
                }
                itemPrice = iCareService.getItemPriceByConceptId(item.getConcept().getId(), concept.getId(),
                        nhifConcept.getId());
            }
            //Item item = null;

            //ItemPrice itemPrice = new ItemPrice();
            if (itemPrice == null) {
                itemPrice = new ItemPrice();
                itemPrice.setPaymentScheme(concept);
                itemPrice.setPaymentType(nhifConcept);
                itemPrice.setItem(item);
                if ((pricePackage.get("IsRestricted") != null && (Boolean) pricePackage.get("IsRestricted")) || isServiceExcluded(excludedServices, pricePackage)) {
                    itemPrice.setPrice(0.0);
                    itemPrice.setPayable((Double) pricePackage.get("UnitPrice"));
                } else {
                    itemPrice.setPrice((Double) pricePackage.get("UnitPrice"));
                }
            }
            iCareService.saveItemPrice(itemPrice);
            InsuranceItem insuranceItem = new InsuranceItem();
            insuranceItem.setStatus("OK");
            insuranceItem.setName((String) pricePackage.get("ItemName"));
            insuranceItem.setMessage("Successfully created.");
            result.getCreated().add(insuranceItem);
            log.info("Successfully created for " + pricePackage.get("ItemName") + "(" + pricePackage.get("ItemCode") + ")");
        }
        return result;
    }
	
	private boolean isServiceExcluded(List<Map<String, Object>> excludedServices, Map<String, Object> pricePackage) {
		for (Map<String, Object> excludedService : excludedServices) {
			if (excludedService.get("SchemeID").equals(pricePackage.get("SchemeID"))
			        && excludedService.get("ItemCode").equals(pricePackage.get("ItemCode"))) {
				return true;
			}
		}
		return false;
	}
	
	@Override
	public SyncResult call() throws Exception {
		Context.openSession();
		//Context.setUserContext(this.userContext);
		return this.sync();
	}
}
