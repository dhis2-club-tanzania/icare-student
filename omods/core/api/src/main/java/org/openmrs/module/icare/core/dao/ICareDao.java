/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
package org.openmrs.module.icare.core.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.openmrs.*;
import org.openmrs.api.AdministrationService;
import org.openmrs.api.context.Context;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.module.icare.ICareConfig;
import org.openmrs.module.icare.auditlog.AuditLog;
import org.openmrs.module.icare.billing.models.ItemPrice;
import org.openmrs.module.icare.billing.models.Prescription;
import org.openmrs.module.icare.core.Item;
import org.openmrs.module.icare.core.ListResult;
import org.openmrs.module.icare.core.Pager;
import org.openmrs.module.icare.core.Summary;
import org.openmrs.module.icare.core.utils.IncomingSMS;
import org.openmrs.module.icare.core.utils.OutgoingSMS;
import org.openmrs.module.icare.core.utils.PatientWrapper;
import org.openmrs.module.icare.core.utils.VisitWrapper;
import org.openmrs.module.icare.store.models.OrderStatus;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.transaction.Transaction;

public class ICareDao extends BaseDAO<Item> {
	
	private Log log = LogFactory.getLog(this.getClass());
	
	public Item saveItem(Item item) {
		getSession().saveOrUpdate(item);
		return item;
	}
	
	public Item getItemByConceptId(Integer id) {
		DbSession session = getSession();
		List<Item> items = session.createQuery("SELECT a FROM Item a WHERE a.concept='" + id.toString() + "'").list();
		
		if (items.size() > 0) {
			return items.get(0);
		} else {
			return null;
		}
	}
	
	public ItemPrice getItemPriceByConceptId(Integer serviceConceptId, Integer paymentSchemeConceptId,
	        Integer paymentTypeConceptId) {
		DbSession session = getSession();
		String queryStr = "SELECT ip FROM ItemPrice ip WHERE\n" + "ip.id.item.concept.id = :serviceConceptId AND\n"
		        + "ip.id.paymentScheme.id = :paymentSchemeConceptId AND \n" + "ip.id.paymentType.id = :paymentTypeConceptId";
		Query query = session.createQuery(queryStr);
		query.setParameter("serviceConceptId", serviceConceptId);
		query.setParameter("paymentTypeConceptId", paymentTypeConceptId);
		query.setParameter("paymentSchemeConceptId", paymentSchemeConceptId);
		log.info("QUERY:" + query.getQueryString());
		List<ItemPrice> itemPrices = query.list();
		if (itemPrices.size() > 0) {
			return itemPrices.get(0);
		} else {
			return null;
		}
	}
	
	public ItemPrice getItemPriceByDrugId(Integer drugId, Integer paymentSchemeConceptId, Integer paymentTypeConceptId) {
		DbSession session = getSession();
		String queryStr = "SELECT ip FROM ItemPrice ip WHERE\n" + "ip.id.item.drug.id = :drugId AND\n"
		        + "ip.id.paymentScheme.id = :paymentSchemeConceptId AND \n" + "ip.id.paymentType.id = :paymentTypeConceptId";
		Query query = session.createQuery(queryStr);
		query.setParameter("drugId", drugId);
		query.setParameter("paymentTypeConceptId", paymentTypeConceptId);
		query.setParameter("paymentSchemeConceptId", paymentSchemeConceptId);
		log.info("QUERY:" + query.getQueryString());
		List<ItemPrice> itemPrices = query.list();
		if (itemPrices.size() > 0) {
			return itemPrices.get(0);
		} else {
			return null;
		}
	}
	
	public List<ItemPrice> getItemPrices() {
		DbSession session = getSession();
		String queryStr = "SELECT ip FROM ItemPrice ip";
		Query query = session.createQuery(queryStr);
		log.info("QUERY:" + query.getQueryString());
		return query.list();
	}
	
	public List<ItemPrice> getItemPrices(Integer limit, Integer startIndex) {
		DbSession session = getSession();
		String queryStr = "SELECT ip FROM ItemPrice ip ";
		Query query = session.createQuery(queryStr);
		query.setFirstResult(startIndex);
		query.setMaxResults(limit);
		return query.list();
	}
	
	public List<ItemPrice> getItemPricesByPaymentType(String paymentType, Integer limit, Integer startIndex) {
		DbSession session = getSession();
		String queryStr = "SELECT ip FROM ItemPrice ip WHERE ip.paymentType.uuid =:paymentType";
		Query query = session.createQuery(queryStr);
		query.setParameter("paymentType", paymentType);
		query.setFirstResult(startIndex);
		query.setMaxResults(limit);
		return query.list();
	}
	
	public ItemPrice saveItemPrice(ItemPrice itemPrice) {
		getSession().saveOrUpdate(itemPrice);
		return itemPrice;
	}
	
	public List<Item> getItems() {
		DbSession session = getSession();
		String queryStr = "SELECT ip FROM Item ip WHERE ip.voided=false";
		Query query = session.createQuery(queryStr);
		log.info("QUERY:" + query.getQueryString());
		return query.list();
	}
	
	public List<Item> getItems(String search, Integer limit, Integer startIndex, String department, Item.Type type,
	        Boolean stockable) {
		DbSession session = getSession();
		String queryStr;
		
		if (department != null) {
			queryStr = "SELECT ip FROM Item ip WHERE ip.concept IN "
			        + "((SELECT cs.concept FROM ConceptSet cs WHERE cs.conceptSet = (SELECT c FROM Concept c WHERE c.uuid = :department)))";
		} else {
			queryStr = "SELECT ip FROM Item ip";
		}
		if (queryStr != null && type == Item.Type.DRUG) {
			queryStr += " WHERE ip.drug IS NOT NULL";
		} else if (queryStr != null && type == Item.Type.CONCEPT) {
			queryStr += " WHERE ip.concept IS NOT NULL";
		}
		
		if (search != null) {
			
			if (department != null) {
				queryStr = "SELECT ip FROM Item ip "
				        + "LEFT JOIN ip.concept as c WITH c.retired = false "
				        + "LEFT JOIN c.names cn WITH cn.conceptNameType = 'FULLY_SPECIFIED' "
				        + "LEFT JOIN ip.drug as d WITH d.retired = false "
				        + "LEFT JOIN d.concept as c1 WITH c1.retired = false "
				        + "LEFT JOIN c1.names cn1 WITH cn1.conceptNameType = 'FULLY_SPECIFIED' "
				        + "WHERE (lower(cn.name) like :search OR lower(cn1.name) like :search OR lower(d.name) like :search) "
				        + "AND ip.concept IN ((SELECT cs.concept FROM ConceptSet cs WHERE cs.conceptSet = (SELECT c FROM Concept c WHERE c.uuid = :department)))";
			} else {
				queryStr = "SELECT ip FROM Item ip " + "LEFT JOIN ip.concept as c WITH c.retired = false "
				        + "LEFT JOIN c.names cn WITH cn.conceptNameType = 'FULLY_SPECIFIED' "
				        + "LEFT JOIN ip.drug as d WITH d.retired=false "
				        + "LEFT JOIN d.concept as c1 WITH c1.retired = false "
				        + "LEFT JOIN c1.names cn1 WITH cn1.conceptNameType = 'FULLY_SPECIFIED' "
				        + "WHERE lower(cn.name) like :search OR lower(cn1.name) like :search OR lower(d.name) like :search";
			}
			if (type == Item.Type.DRUG) {
				queryStr += " AND ip.drug IS NOT NULL";
			}
			if (type == Item.Type.CONCEPT) {
				queryStr += " AND ip.concept IS NOT NULL";
			}
			
		}
		
		if (stockable != null) {
			
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}
			
			queryStr += " ip.stockable = :stockable";
			
		}
		Query query = session.createQuery(queryStr);
		query.setFirstResult(startIndex);
		query.setMaxResults(limit);
		if (search != null) {
			query.setParameter("search", "%" + search + "%");
		}
		
		if (department != null) {
			query.setParameter("department", department);
		}
		
		if (stockable != null) {
			query.setParameter("stockable", stockable);
		}
		
		return query.list();
	}
	
	public List<Item> getStockableItems(String search, Integer limit, Integer startIndex, Item.Type type) {
		DbSession session = getSession();
		String queryStr;
		queryStr = "SELECT ip FROM Item ip WHERE id.stockable = true ";
		
		if (queryStr != null && type == Item.Type.DRUG) {
			queryStr += " AND ip.drug IS NOT NULL";
		} else if (queryStr != null && type == Item.Type.CONCEPT) {
			queryStr += " AND ip.concept IS NOT NULL";
		}
		
		if (search != null) {
			queryStr = "SELECT ip FROM Item ip " + "LEFT JOIN ip.concept as c WITH c.retired = false "
			        + "LEFT JOIN c.names cn WITH cn.conceptNameType = 'FULLY_SPECIFIED' "
			        + "LEFT JOIN ip.drug as d WITH d.retired=false "
			        + "WHERE ip.stockable = true AND lower(cn.name) like :search  OR lower(d.name) like :search";
			if (type == Item.Type.DRUG) {
				queryStr += " AND ip.drug IS NOT NULL";
			}
			if (type == Item.Type.CONCEPT) {
				queryStr += " AND ip.concept IS NOT NULL";
			}
			
		}
		Query query = session.createQuery(queryStr);
		query.setFirstResult(startIndex);
		query.setMaxResults(limit);
		if (search != null) {
			query.setParameter("search", "%" + search + "%");
		}
		return query.list();
	}
	
	public List<OrderStatus> getOrderStatusByOrderUuid(String orderUuid) {
		DbSession session = this.getSession();
		//String queryStr = "SELECT item FROM Item item \n"
		//        + "WHERE item.stockable = true AND item.uuid NOT IN(SELECT stock.item.uuid FROM Stock stock WHERE stock.location.uuid =:locationUuid)";
		//String queryStr = "SELECT item FROM Item item, Stock stock WHERE item.stockable = true AND stock.item=item AND stock.location.uuid =:locationUuid";
		String queryStr = "SELECT os FROM OrderStatus os\n" + "INNER JOIN os.order o\n" + "WHERE o.uuid=:orderUuid";
		
		Query query = session.createQuery(queryStr);
		query.setParameter("orderUuid", orderUuid);
		return query.list();
	}
	
	public long getVisitSerialNumber(Visit visit) {
		DbSession session = getSession();
		String queryStr = "SELECT COUNT(visit) FROM Visit visit WHERE YEAR(visit.startDatetime) = :year AND MONTH(visit.startDatetime) = :month AND visit.startDatetime <= :startDate ORDER BY visit.startDatetime";
		Query query = session.createQuery(queryStr);
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(visit.getStartDatetime());
		query.setParameter("year", calendar.get(Calendar.YEAR));
		query.setParameter("startDate", visit.getStartDatetime());
		query.setParameter("month", calendar.get(Calendar.MONTH) + 1);
		return (long) query.list().get(0);
	}
	
	public Item getItemByConceptUuid(String uuid) {
		DbSession session = getSession();
		
		String queryStr = "SELECT i FROM Item i " + "LEFT JOIN i.concept as c " + "LEFT JOIN i.drug as d "
		        + "LEFT JOIN d.concept as c1 " + " WHERE c.uuid= :uuid OR c1.uuid= :uuid";
		//String queryStr = "SELECT a FROM Item a WHERE a.concept.uuid=:uuid";
		Query query = session.createQuery(queryStr);
		query.setParameter("uuid", uuid);
		List<Item> items = query.list();
		
		if (items.size() > 0) {
			return items.get(0);
		} else {
			return null;
		}
	}
	
	public Item getItemByDrugConceptUuid(String uuid) {
		DbSession session = getSession();
		
		//String queryStr = "SELECT a FROM Item a WHERE a.concept.uuid= :uuid OR a.drug.concept.uuid= :uuid";
		String queryStr = "SELECT a FROM Item a WHERE a.drug.concept.uuid=:uuid";
		Query query = session.createQuery(queryStr);
		query.setParameter("uuid", uuid);
		List<Item> items = query.list();
		
		if (items.size() > 0) {
			return items.get(0);
		} else {
			return null;
		}
	}
	
	public Item getItemByDrugUuid(String uuid) {
		DbSession session = getSession();
		
		String queryStr = "SELECT a FROM Item a WHERE a.drug.uuid= :uuid";
		Query query = session.createQuery(queryStr);
		query.setParameter("uuid", uuid);
		List<Item> items = query.list();
		
		if (items.size() > 0) {
			return items.get(0);
		} else {
			return null;
		}
	}
	
	public List<Visit> getOpenVisit() {
		DbSession session = getSession();
		String queryStr = "SELECT visit FROM Visit visit WHERE visit.stopDatetime IS NULL";
		Query query = session.createQuery(queryStr);
		return query.list();
	}
	
	public Prescription updatePrescription(Prescription prescription) {
		DbSession session = getSession();
		String queryStr = "UPDATE prescription SET quantity=" + prescription.getQuantity().toString()
		        + " WHERE orderId=:orderId";
		SQLQuery query = session.createSQLQuery(queryStr);
		query.setParameter("orderId", prescription.getOrderId());
		query.executeUpdate();
		return prescription;
		
	}
	
	public List<Encounter> getEncountersByEncounterType(String search, String encounterTypeUuid, Integer limit,
	        Integer startIndex) {
		Query query = null;
		System.out.println(encounterTypeUuid);
		DbSession session = this.getSession();
		String queryString = "SELECT e FROM Encounter e LEFT JOIN e.encounterType et WHERE et.uuid =:encounterTypeUuid";
		query = session.createQuery(queryString);
		if (encounterTypeUuid != null) {
			query.setParameter("encounterTypeUuid", encounterTypeUuid);
		}
		
		query.setFirstResult(startIndex);
		query.setMaxResults(limit);
		return query.list();
	}
	
	public List<Visit> getVisitsByOrderType(String search, String orderTypeUuid, String encounterTypeUuid,
                                            String locationUuid, OrderStatus.OrderStatusCode orderStatusCode, Order.FulfillerStatus fulfillerStatus,
                                            Integer limit, Integer startIndex, VisitWrapper.OrderBy orderBy, VisitWrapper.OrderByDirection orderByDirection,
                                            String attributeValueReference, VisitWrapper.PaymentStatus paymentStatus, String visitAttributeTypeUuid,
                                            String sampleCategory, String exclude, Boolean includeInactive, Boolean includeDeadPatients) {
		//PatientIdentifier
		Query query = null;
		DbSession session = this.getSession();
		
		String queryStr = "SELECT distinct v FROM Visit v" + " INNER JOIN v.patient p" + " LEFT JOIN p.names pname "
		        + "LEFT JOIN p.identifiers pi INNER JOIN v.attributes va LEFT JOIN va.attributeType vat ";
		//				+ " INNER JOIN p.attributes pattr";
		
		if (orderTypeUuid != null && encounterTypeUuid == null) {
			queryStr = queryStr + " INNER JOIN v.encounters e" + " INNER JOIN e.orders o" + " INNER JOIN o.orderType ot"
			        + " WHERE ot.uuid=:orderTypeUuid " + "  ";
			
			if (fulfillerStatus != null) {
				queryStr += " AND o.fulfillerStatus=:fulfillerStatus";
			} else {
				queryStr += " AND o.fulfillerStatus IS NULL";
			}
			
			if (orderStatusCode != null) {
				if (orderStatusCode == OrderStatus.OrderStatusCode.EMPTY) {
					queryStr += " AND o NOT IN (SELECT o2 FROM OrderStatus os" + "	INNER JOIN os.order o2)";
				} else {
					queryStr += " AND o IN (SELECT o2 FROM OrderStatus os"
					        + "	INNER JOIN os.order o2 WHERE os.status=:orderStatusCode)";
				}
			}
			
		} else if (encounterTypeUuid != null && orderTypeUuid == null) {
			queryStr += " INNER JOIN v.encounters e INNER JOIN e.encounterType et ";
			queryStr += " WHERE et.uuid = :encounterTypeUuid AND v.stopDatetime IS NULL ";
		} else {
			queryStr = queryStr + " INNER JOIN v.encounters e WHERE v.stopDatetime IS NULL ";
			
		}

		if(!includeInactive){
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}

			queryStr +=" v.stopDatetime IS NULL";

		}

		if (search != null) {
			queryStr += " AND (lower(concat(pname.givenName,pname.middleName,pname.familyName)) LIKE lower(:search) OR lower(pname.givenName) LIKE lower(:search) OR lower(pname.middleName) LIKE lower(:search) OR lower(pname.familyName) LIKE lower(:search) OR lower(concat(pname.givenName,'',pname.familyName)) LIKE lower(:search) OR lower(concat(pname.givenName,'',pname.middleName)) LIKE lower(:search) OR lower(concat(pname.middleName,'',pname.familyName)) LIKE lower(:search)  OR pi.identifier LIKE :search)";
		}
		if (locationUuid != null) {
			queryStr += " AND v.location.uuid=:locationUuid ";
		}
		
		if (attributeValueReference != null) {
			queryStr += " AND v IN ( SELECT va.visit FROM VisitAttribute va WHERE va.valueReference=:attributeValueReference)";
		}
		
		if (paymentStatus != null) {
			if (paymentStatus == VisitWrapper.PaymentStatus.PAID) {
				queryStr += " AND v IN (SELECT invoice.visit FROM Invoice invoice WHERE "
				        + "(SELECT SUM(item.price*item.quantity) FROM InvoiceItem item WHERE item.id.invoice = invoice) <= ("
				        + "(SELECT CASE WHEN SUM(pi.amount) IS NULL THEN 0 ELSE SUM(pi.amount) END FROM PaymentItem pi "
				        + "WHERE pi.id.payment.invoice = invoice)+(SELECT CASE WHEN SUM(di.amount) IS NULL THEN 0 ELSE SUM(di.amount) END FROM DiscountInvoiceItem di WHERE di.id.invoice = invoice)) AND v NOT IN( SELECT invoice.visit FROM Invoice invoice WHERE (SELECT SUM(item.price*item.quantity) FROM InvoiceItem item WHERE item.id.invoice = invoice) > ((SELECT CASE WHEN SUM(pi.amount) IS NULL THEN 0 ELSE SUM(pi.amount) END FROM PaymentItem pi WHERE pi.id.payment.invoice = invoice)+(SELECT CASE WHEN SUM(di.amount) IS NULL THEN 0 ELSE SUM(di.amount) END FROM DiscountInvoiceItem di WHERE di.id.invoice = invoice ))"
				        + ") ORDER BY v.startDatetime  ASC)";
				
			}
			
			if (paymentStatus == VisitWrapper.PaymentStatus.PENDING) {
				queryStr += " AND v IN (SELECT invoice.visit FROM Invoice invoice WHERE "
				        + "(SELECT SUM(item.price*item.quantity) FROM InvoiceItem item WHERE item.id.invoice = invoice) > ("
				        + "(SELECT CASE WHEN SUM(pi.amount) IS NULL THEN 0 ELSE SUM(pi.amount) END FROM PaymentItem pi "
				        + "WHERE pi.id.payment.invoice = invoice)+(SELECT CASE WHEN SUM(di.amount) IS NULL THEN 0 ELSE SUM(di.amount) END FROM DiscountInvoiceItem di WHERE di.id.invoice = invoice))"
				        + ") ORDER BY v.startDatetime  ASC)";
				
			}
		}
		
		if (visitAttributeTypeUuid != null) {
			
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}
			
			queryStr += " vat.uuid = :visitAttributeTypeUuid";
			
		}
		
		if (sampleCategory != null) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}
			
			queryStr += " v IN (SELECT sp.visit FROM Sample sp WHERE sp IN (SELECT sst.sample FROM SampleStatus sst WHERE sst.category =:sampleCategory))";

			if(exclude != null){

				if (!queryStr.contains("WHERE")) {
					queryStr += " WHERE ";
				} else {
					queryStr += " AND ";
				}

				queryStr += " v IN (SELECT sp.visit FROM Sample sp WHERE sp NOT IN (SELECT sst.sample FROM SampleStatus sst WHERE sst.category IN(:statuses)))";


			}

			
		}

		if (!queryStr.contains("WHERE")) {
			queryStr += " WHERE ";
		} else {
			queryStr += " AND ";
		}

		queryStr +=" p.dead = :includeDeadPatients";
		
		if (orderBy == VisitWrapper.OrderBy.VISIT) {
			queryStr += " ORDER BY v.startDatetime ";
		} else if (orderBy == VisitWrapper.OrderBy.ENCOUNTER) {
			queryStr += " ORDER BY e.encounterDatetime";
		} else if (orderBy == VisitWrapper.OrderBy.ORDER) {
			queryStr += " ORDER BY o.dateActivated ";
		} else if (orderBy == VisitWrapper.OrderBy.OBSERVATION) {
			queryStr += " ORDER BY e.dateChanged ";
		}
		
		if (orderByDirection == VisitWrapper.OrderByDirection.ASC) {
			queryStr += " ASC ";
		} else if (orderByDirection == VisitWrapper.OrderByDirection.DESC) {
			queryStr += " DESC ";
		}
		query = session.createQuery(queryStr);
		if (orderTypeUuid != null) {
			query.setParameter("orderTypeUuid", orderTypeUuid);
		}
		
		if (fulfillerStatus != null) {
			query.setParameter("fulfillerStatus", fulfillerStatus);
		}
		
		if (orderStatusCode != null) {
			if (orderStatusCode == OrderStatus.OrderStatusCode.EMPTY) {
				
			} else {
				query.setParameter("orderStatusCode", orderStatusCode);
			}
		}
		
		if (encounterTypeUuid != null) {
			query.setParameter("encounterTypeUuid", encounterTypeUuid);
		}
		
		if (locationUuid != null) {
			query.setParameter("locationUuid", locationUuid);
		}
		if (search != null) {
			query.setParameter("search", "%" + search.replace(" ", "%") + "%");
		}
		if (attributeValueReference != null) {
			query.setParameter("attributeValueReference", attributeValueReference);
		}
		if (visitAttributeTypeUuid != null) {
			query.setParameter("visitAttributeTypeUuid", visitAttributeTypeUuid);
		}
		if (sampleCategory != null) {
			query.setParameter("sampleCategory", sampleCategory);
		}

		query.setParameter("includeDeadPatients",includeDeadPatients);

		if(exclude != null){
			Pattern pattern = Pattern.compile("List:\\[(.*?)\\]");
			Matcher matcher = pattern.matcher(exclude);
			String excludedValue;
			if(matcher.find()){
				excludedValue = matcher.group(1);
			}else{
				excludedValue = exclude;
			}

			String[] valuesArray = excludedValue.split(",");
			List<String> valueList = new ArrayList<>(Arrays.asList(valuesArray));
			query.setParameterList("statuses",valueList);
		}
		query.setFirstResult(startIndex);
		query.setMaxResults(limit);
		return query.list();
		
	}
	
	public List<Object[]> getCommonlyOrderedItems(String visitUuid, String orderTypeUuid, Integer limit, Integer startIndex,
	        Boolean isDrug) {
		DbSession session = this.getSession();
		String queryStr = "";
		if (isDrug == null || isDrug == true) {
			queryStr = "SELECT distinct pres.drug AS drug, COUNT(pres.orderId) AS count FROM Prescription pres "
			        + "GROUP BY pres.drug ORDER BY COUNT(pres.orderId)  DESC";
		} else {
			queryStr = "SELECT distinct order, COUNT(order.orderId) AS count FROM Order order "
			        + "GROUP BY order.concept ORDER BY COUNT(order.orderId) DESC";
		}
		
		Query query = session.createQuery(queryStr);
		query.setFirstResult(startIndex);
		query.setMaxResults(limit);
		return query.list();
	}
	
	public List<Order> getOrdersByVisitAndOrderType(String visitUuid, String orderTypeUuid,
	        Order.FulfillerStatus fulfillerStatus, Integer limit, Integer startIndex) {
		DbSession session = this.getSession();
		String queryStr = "SELECT distinct o FROM Visit v" + " INNER JOIN v.encounters e" + " INNER JOIN e.orders o"
		        + " INNER JOIN o.orderType ot" + " WHERE ot.uuid=:orderTypeUuid " + " AND v.uuid=:visitUuid ";
		if (fulfillerStatus != null) {
			queryStr += " AND o.fulfillerStatus=:fulfillerStatus";
		} else {
			queryStr += " AND o.fulfillerStatus IS NULL";
		}
		
		Query query = session.createQuery(queryStr);
		query.setParameter("orderTypeUuid", orderTypeUuid);
		query.setParameter("visitUuid", visitUuid);
		if (fulfillerStatus != null) {
			query.setParameter("fulfillerStatus", fulfillerStatus);
		}
		//query.setParameter("fulfillerStatus", fulfillerStatus);
		query.setFirstResult(startIndex);
		query.setMaxResults(limit);
		return query.list();
	}
	
	public long countDailyPatients() {
		DbSession session = getSession();
		String queryStr = "SELECT COUNT(patient) FROM Patient patient WHERE YEAR(patient.personDateCreated) = :year AND MONTH(patient.personDateCreated) = :month AND DAY(patient.personDateCreated) = :day";
		Query query = session.createQuery(queryStr);
		Calendar calendar = Calendar.getInstance();
		query.setParameter("year", calendar.get(Calendar.YEAR));
		query.setParameter("day", calendar.get(Calendar.DATE));
		query.setParameter("month", calendar.get(Calendar.MONTH) + 1);
		return (long) query.list().get(0);
	}
	
	public long countMonthlyPatients() {
		DbSession session = getSession();
		String queryStr = "SELECT COUNT(patient) FROM Patient patient WHERE YEAR(patient.personDateCreated) = :year AND MONTH(patient.personDateCreated) = :month";
		Query query = session.createQuery(queryStr);
		Calendar calendar = Calendar.getInstance();
		query.setParameter("year", calendar.get(Calendar.YEAR));
		query.setParameter("month", calendar.get(Calendar.MONTH) + 1);
		return (long) query.list().get(0);
	}
	
	public long countYearlyPatients() {
		DbSession session = getSession();
		String queryStr = "SELECT COUNT(patient) FROM Patient patient WHERE YEAR(patient.personDateCreated) = :year";
		Query query = session.createQuery(queryStr);
		Calendar calendar = Calendar.getInstance();
		query.setParameter("year", calendar.get(Calendar.YEAR));
		return (long) query.list().get(0);
	}
	
	public ListResult getConceptsBySearchParams(String q, String conceptClass, String searchTerm, Integer limit,
	        Integer startIndex, String searchTermOfConceptSetToExclude, String conceptSourceUuid, String referenceTermCode,
	        String attributeType, String attributeValue, Pager pager) {
		DbSession session = getSession();
		String searchConceptQueryStr = "SELECT DISTINCT c FROM Concept c INNER JOIN c.names cn INNER JOIN c.conceptClass cc ";
		
		if (searchTerm != null) {
			searchConceptQueryStr += " LEFT JOIN c.names st ON st.conceptNameType= 'INDEX_TERM'";
		}
		String where = "WHERE";
		if (q != null) {
			where += " lower(cn.name) like lower(:q)";
		}
		
		if (conceptClass != null) {
			if (!where.equals("WHERE")) {
				where += " AND ";
			}
			where += " lower(cc.name) like lower(:conceptClass)";
		}
		if (searchTerm != null) {
			if (!where.equals("WHERE")) {
				where += " AND ";
			}
			where += " lower(st.name) like lower(:searchTerm)";
		}
		
		if (searchTermOfConceptSetToExclude != null) {
			if (!where.equals("WHERE")) {
				where += " AND ";
			}
			where += " c NOT IN (SELECT DISTINCT cs.concept FROM ConceptSet cs WHERE cs.conceptSet IN (SELECT DISTINCT conc FROM Concept conc JOIN conc.names stn WHERE stn.conceptNameType= 'INDEX_TERM' AND lower(stn.name) like lower(:searchTermOfConceptSetToExclude)))";
		}
		
		if (attributeType != null && attributeValue != null) {
			if (!where.equals("WHERE")) {
				where += " AND ";
			}
			where += " c IN (SELECT attribute.concept FROM ConceptAttribute attribute WHERE attribute.valueReference =:attributeValue AND attribute.attributeType IN (SELECT cat FROM ConceptAttributeType cat WHERE cat.uuid =:attributeType))";
		}
		
		if (referenceTermCode != null && conceptSourceUuid != null) {
			if (!where.equals("WHERE")) {
				where += " AND ";
			}
			where += " c IN (SELECT DISTINCT cms.concept FROM ConceptMap cms WHERE cms.conceptReferenceTerm IN (SELECT DISTINCT crt FROM ConceptReferenceTerm crt WHERE crt.conceptSource IN (SELECT cs FROM ConceptSource cs WHERE cs.uuid =:conceptSourceUuid) AND crt.code =:referenceTermCode))";
		}
		
		if (!where.equals("WHERE")) {
			searchConceptQueryStr += " " + where;
		}
		
		searchConceptQueryStr += " ORDER BY c.dateCreated DESC";
		
		Query sqlQuery = session.createQuery(searchConceptQueryStr);
		sqlQuery.setFirstResult(startIndex);
		sqlQuery.setMaxResults(limit);
		if (q != null) {
			sqlQuery.setParameter("q", "%" + q + "%");
		}
		if (searchTerm != null) {
			sqlQuery.setParameter("searchTerm", "%" + searchTerm + "%");
		}
		if (conceptClass != null) {
			sqlQuery.setParameter("conceptClass", "%" + conceptClass + "%");
		}
		
		if (searchTermOfConceptSetToExclude != null) {
			sqlQuery.setParameter("searchTermOfConceptSetToExclude", searchTermOfConceptSetToExclude);
		}
		
		if (referenceTermCode != null && conceptSourceUuid != null) {
			sqlQuery.setParameter("referenceTermCode", referenceTermCode);
			sqlQuery.setParameter("conceptSourceUuid", conceptSourceUuid);
		}
		
		if (attributeType != null && attributeValue != null) {
			sqlQuery.setParameter("attributeType", attributeType);
			sqlQuery.setParameter("attributeValue", attributeValue);
		}
		
		if (pager.isAllowed()) {
			pager.setTotal(sqlQuery.list().size());
			sqlQuery.setFirstResult((pager.getPage() - 1) * pager.getPageSize());
			sqlQuery.setMaxResults(pager.getPageSize());
		}
		
		ListResult listResults = new ListResult();
		listResults.setPager(pager);
		listResults.setResults(sqlQuery.list());
		return listResults;
	}
	
	public List<ConceptReferenceTerm> getConceptReferenceTermsBySearchParams(String q, String source, Integer limit,
	        Integer startIndex) {
		//				new ConceptReferenceTerm();
		DbSession session = getSession();
		String searchQueryStr = "SELECT DISTINCT crt FROM ConceptReferenceTerm crt INNER JOIN crt.conceptSource cs";
		String where = "WHERE";
		if (q != null) {
			where += " (lower(crt.name) like lower(:q) OR lower(crt.code) like lower(:q))";
		}
		if (source != null) {
			if (!where.equals("WHERE")) {
				where += " AND ";
			}
			where += " cs.uuid like :source";
		}
		if (!where.equals("WHERE")) {
			searchQueryStr += " " + where;
		}
		Query sqlQuery = session.createQuery(searchQueryStr);
		sqlQuery.setFirstResult(startIndex);
		sqlQuery.setMaxResults(limit);
		
		if (q != null) {
			sqlQuery.setParameter("q", "%" + q + "%");
		}
		if (source != null) {
			sqlQuery.setParameter("source", "%" + source + "%");
		}
		List data = sqlQuery.list();
		return data;
	}
	
	public List<ConceptSet> getConceptsSetsByConcept(String concept) {
		DbSession session = getSession();
		String searchConceptSetQueryStr = "SELECT DISTINCT cs FROM ConceptSet cs INNER JOIN cs.concept c WHERE c.uuid =:concept";
		Query sqlQuery = session.createQuery(searchConceptSetQueryStr);
		
		if (concept != null) {
			sqlQuery.setParameter("concept", concept);
		}
		return sqlQuery.list();
	}
	
	public String unRetireConcept(String uuid) {
		DbSession session = getSession();
		String queryStr = "UPDATE Concept SET retired='false' WHERE uuid=:uuid";
		
		SQLQuery query = session.createSQLQuery(queryStr);
		query.setParameter("uuid", uuid);
		query.executeUpdate();
		return uuid;
	}
	
	public List<Location> getLocations(String attributeType, String value, Integer limit, Integer startIndex) {
		DbSession session = getSession();
		new LocationAttribute();
		String getLocationQuery = "SELECT DISTINCT location FROM Location location ";
		
		if (attributeType != null && value != null) {
			getLocationQuery += " WHERE location IN (SELECT attribute.location FROM LocationAttribute attribute WHERE attribute.valueReference =:value AND attribute.attributeType IN (SELECT lat FROM LocationAttributeType lat WHERE lat.uuid =:attributeType))";
		}
		Query sqlQuery = session.createQuery(getLocationQuery);
		
		sqlQuery.setFirstResult(startIndex);
		sqlQuery.setMaxResults(limit);
		if (attributeType != null && value != null) {
			sqlQuery.setParameter("attributeType", attributeType);
			sqlQuery.setParameter("value", value);
		}
		
		return sqlQuery.list();
	}
	
	public List<PatientWrapper> getPatients(String search, String patientUUID, PatientWrapper.VisitStatus visitStatus,
	        Integer startIndex, Integer limit, PatientWrapper.OrderByDirection orderByDirection) {
		
		DbSession session = this.getSession();
		String queryStr = "SELECT p, v FROM Patient p,Visit v INNER JOIN p.names pname WHERE p = v.patient AND v.stopDatetime IS NULL AND p.voided = false ";
		
		if (search != null) {
			queryStr += "AND lower(concat(pname.givenName,pname.middleName,pname.familyName)) LIKE lower(:search)";
		}
		if (patientUUID != null) {
			queryStr += "AND p.uuid=:patientUUID";
		}
		
		//		if (orderByDirection == PatientWrapper.OrderByDirection.ASC) {
		//			queryStr += " ASC";
		//		} else if (orderByDirection == PatientWrapper.OrderByDirection.DESC) {
		//			queryStr += " DESC";
		//		}
		
		Query query = session.createQuery(queryStr);
		
		if (search != null) {
			query.setParameter("search", "%" + search.replace(" ", "%") + "%");
		}
		
		if (patientUUID != null) {
			query.setParameter("patientUUID", patientUUID);
		}
		
		query.setFirstResult(startIndex);
		query.setMaxResults(limit);
		
		List<PatientWrapper> patientWrappers = new ArrayList<PatientWrapper>();
		
		for (Object[] patientData : (List<Object[]>) query.list()) {
			Patient patient = (Patient) patientData[0];
			Visit visit = (Visit) patientData[1];
			patientWrappers.add(new PatientWrapper(patient, visit));
		}
		/*for(Patient patient:(List<Patient>)query.list()){
			patientWrappers.add(new PatientWrapper(patient));
		}*/
		return patientWrappers;
		
	}
	
	public Summary getSummary() {

		Summary summary = new Summary();

		DbSession session = getSession();
		String queryStr = "SELECT COUNT(patient) FROM Patient patient";
		Query query = session.createQuery(queryStr);
		summary.setAllPatients((long) query.list().get(0));

		queryStr = "SELECT COUNT(visit) FROM Visit visit WHERE visit.stopDatetime IS NULL";
		query = session.createQuery(queryStr);
		summary.setActiveVisits((long) query.list().get(0));

		queryStr = "SELECT l,COUNT(v) FROM Location l, Visit v WHERE v.stopDatetime IS NULL AND v.location=l AND l.retired=false GROUP BY l";
		query = session.createQuery(queryStr);
		//summary.setActiveVisits((long) query.list().get(0));

		Map<Location, Long> locationMap= new HashMap<>();
		for (Object[] locationData : (List<Object[]>) query.list()) {
			Location location = (Location) locationData[0];
			Long count = (long) locationData[1];
			locationMap.put(location,count);
		}
		summary.setLocations(locationMap);
		return summary;
    }
	
	public List<Drug> getDrugs(String concept, Integer limit, Integer startIndex) {
		DbSession session = getSession();
		String queryStr = "SELECT d FROM Drug d WHERE d.concept.uuid=:concept";
		Query query = session.createQuery(queryStr);
		query.setFirstResult(startIndex);
		query.setMaxResults(limit);
		query.setParameter("concept", concept);
		return query.list();
	}
	
	public List<Visit> getOpenAdmittedVisit() {
		DbSession session = getSession();
		String queryStr = "SELECT distinct v FROM Visit v INNER JOIN v.encounters e INNER JOIN e.orders o INNER JOIN o.orderType ot WHERE ot.name='Bed Order' AND v.stopDatetime IS NULL";
		Query query = session.createQuery(queryStr);
		
		return query.list();
	}
	
	public List<Visit> getOpenVisitForDeceasedPatients() {
		DbSession session = getSession();
		String queryStr = "SELECT distinct v FROM Visit v INNER JOIN v.encounters e INNER JOIN e.orders o INNER JOIN o.orderType ot WHERE ot.name='Cabinet Order' AND v.stopDatetime IS NULL";
		Query query = session.createQuery(queryStr);
		
		return query.list();
	}
	
	public long countYearlyGeneratedMetadataCodes(String metadataType) {
		DbSession session = this.getSession();
		if (metadataType.equals("requisition")) {
			String queryStr = " SELECT COUNT(req) FROM Requisition req WHERE YEAR(req.dateCreated) = :year";
			Query query = session.createQuery(queryStr);
			Calendar calendar = Calendar.getInstance();
			query.setParameter("year", calendar.get(Calendar.YEAR));
			return (long) query.list().get(0);
		}
		return 0;
		
	}
	
	public List<String> generateCode(String globalPropertyUuid, String metadataType, Integer count) throws Exception {

		AdministrationService adminService = Context.getService(AdministrationService.class);
		String idFormat = adminService.getGlobalPropertyByUuid(globalPropertyUuid).getValue().toString();
		if(idFormat == null){
			throw new Exception("The global property for generationg code is mot set. Please set ");
		}
		List<String> idLabels = new ArrayList<>();
		if (idFormat.contains("D{YYYY}") || idFormat.contains("D{YYY}") || idFormat.contains("D{YY}")) {
			SimpleDateFormat formatter = new SimpleDateFormat("YYYY", Locale.ENGLISH);
			Integer substringCount = 2;
			if (idFormat.contains("D{YY}")) {
				substringCount = 2;
				idFormat = idFormat.replace("D{YY}", formatter.format(new Date()).substring(substringCount));
			} else if (idFormat.contains("D{YYY}")) {
				substringCount = 1;
				idFormat = idFormat.replace("D{YYY}", formatter.format(new Date()).substring(substringCount));
			} else if (idFormat.contains("D{YYYY}")) {
				substringCount = 0;
				idFormat = idFormat.replace("D{YYYY}", formatter.format(new Date()).substring(substringCount));
			}
			DbSession session = this.getSession();
			String queryStr = null;
			if (metadataType.equals("sample")) {
				queryStr = "SELECT COUNT(sp) FROM Sample sp WHERE YEAR(sp.dateTime) = :year";
			} else if (metadataType.equals("worksheetdefinition")) {
				queryStr = "SELECT COUNT(wd) FROM WorksheetDefinition wd WHERE YEAR(wd.dateCreated) = :year";
			} else if (metadataType.equals("worksheet")){
				queryStr = "SELECT COUNT(ws) FROM Worksheet ws WHERE YEAR(ws.dateCreated) = :year";
			} else if (metadataType.equals("batchset")){
				queryStr = "SELECT COUNT(bs) FROM BatchSet bs WHERE YEAR(bs.dateCreated) = :year";
			} else if (metadataType.equals("batch")){
				queryStr = "SELECT COUNT(b) FROM Batch b WHERE YEAR(b.dateCreated) = :year";
			} else if(metadataType.equals("requisition")){
				queryStr = " SELECT COUNT(req) FROM Requisition req WHERE YEAR(req.dateCreated) = :year";
			}

			if (queryStr != null) {
				Calendar calendar = Calendar.getInstance();
				Query query = session.createQuery(queryStr);
				query.setParameter("year", calendar.get(Calendar.YEAR));
				long data = (long) query.list().get(0);
				Integer countOfIdLabels = 1;
				if (count != null) {
					countOfIdLabels =  count;
				}
				for (Integer labelCount =1; labelCount <= countOfIdLabels; labelCount++) {
					idLabels.add(idFormat.replace( "COUNT:" + idFormat.split(":")[1], "" + String.format("%0" + idFormat.split(":")[1] +"d", data + labelCount)));

				}
			}
		}
		return idLabels;

	}
	
	public List<ItemPrice> getItemPricesByConceptId(Integer Id) {
		DbSession session = getSession();
		
		String queryStr = " SELECT ip FROM ItemPrice ip WHERE ip.id.item IN ( SELECT it FROM Item it WHERE it.concept.conceptId = :Id)";
		Query query = session.createQuery(queryStr);
		query.setParameter("Id", Id);
		return query.list();
		
	}
	
	//EnvayaSMS database interactions
	//insert outgoing messages to outgoing message table to sent later
	public void saveOutgoingMessage(OutgoingSMS outgoingSMS) {
		getSession().save(outgoingSMS);
	}
	
	//save incoming messages to the incoming message table
	public void save(String from, String messageContent, String messageType) {
		IncomingSMS incomingSMS = new IncomingSMS(from, messageContent, messageType);
		getSession().save(incomingSMS);
	}
	
	// pull outgoing messsages from outgoing message table
	public List<OutgoingSMS> findByStatus(String status) {
		DbSession session = getSession();
		String queryStr = "SELECT os FROM OutgoingSMS os WHERE os.status = :status";
		Query query = session.createQuery(queryStr);
		query.setParameter("status", status);
		System.out.println("Executing query: " + queryStr + " with status: " + status);
		
		List<OutgoingSMS> results = query.list();
		System.out.println("Number of messages found: " + results.size());
		
		return results;
	}
	
	//Set status of the pulled message to SENT status
	public void updateStatusOutgoingSMS(OutgoingSMS outgoingSMS) {
		String recipient = outgoingSMS.getRecipient();
		String message = outgoingSMS.getMessage();
		String status = ICareConfig.STATUS_SENT;/*outgoingSMS.getStatus();*/
		OutgoingSMS pulledOutgoingSMS = new OutgoingSMS(recipient, message, status);
		getSession().save(pulledOutgoingSMS);
	}
	
	//Ends of EnvayaSMS interactions
	
	//	public String voidOrder(String uuid, String voidReason) {
	//		DbSession session = getSession();
	//		new Order();
	//		String queryStr = "UPDATE Order SET voided = 1,voidReason=:voidReason WHERE uuid =:uuid";
	//		Query sqlQuery = session.createQuery(queryStr);
	//
	//		if (uuid == null) {
	//			return "";
	//		} else {
	//			sqlQuery.setParameter("uuid", uuid);
	//		}
	//
	//		if (voidReason != null) {
	//			sqlQuery.setParameter("voidReason", voidReason);
	//		} else {
	//			sqlQuery.setParameter("voidReason", "");
	//		}
	//		sqlQuery.executeUpdate();
	//
	//		return uuid;
	//	}
	//
}
