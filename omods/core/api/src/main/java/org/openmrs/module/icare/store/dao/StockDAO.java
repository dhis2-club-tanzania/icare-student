package org.openmrs.module.icare.store.dao;

// Generated Oct 7, 2020 12:49:21 PM by Hibernate Tools 5.2.10.Final

import org.hibernate.Query;
import org.openmrs.Concept;
import org.openmrs.Drug;
import org.openmrs.Location;
import org.openmrs.Visit;
import org.openmrs.api.context.Context;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.module.icare.core.Item;
import org.openmrs.module.icare.core.ListResult;
import org.openmrs.module.icare.core.Pager;
import org.openmrs.module.icare.core.dao.BaseDAO;
import org.openmrs.module.icare.store.models.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

/**
 * Home object for domain model class StStock.
 * 
 * @author Hibernate Tools
 * @see org.openmrs.module.icare.store.models.Stock
 */
public class StockDAO extends BaseDAO<Stock> {
	
	public List<Stock> getStockByItemId(String itemUuid) {
		
		DbSession session = this.getSession();
		String queryStr = "SELECT st \n" + "FROM Stock st \n"
		        + "WHERE st.item = (SELECT im FROM Item im WHERE im.uuid = :itemUuid AND im.stockable = true) \n";
		
		Query query = session.createQuery(queryStr);
		query.setParameter("itemUuid", itemUuid);
		
		return query.list();
	}
	
	public List<Stock> getStockByDrugId(String drugUuid) {
		
		DbSession session = this.getSession();
		String queryStr = "SELECT st \n"
		        + "FROM Stock st \n"
		        + "WHERE st.item = (SELECT im FROM Item im WHERE im.drug = (SELECT d FROM Drug d WHERE d.uuid= :drugUuid) AND im.stockable = true) \n";
		
		Query query = session.createQuery(queryStr);
		query.setParameter("drugUuid", drugUuid);
		
		return query.list();
	}
	
	public List<Stock> getStockByItemAndLocation(String itemUuid, String locationUuid) {
		DbSession session = this.getSession();
		String queryStr = "SELECT st \n" + "FROM Stock st \n"
		        + "WHERE st.item = (SELECT it FROM Item it WHERE it.uuid = :itemUuid) "
		        + "AND st.location = (SELECT l FROM Location l WHERE l.uuid = :locationUuid)\n"
		        + "AND st.item.stockable = true AND st.quantity > 0 ORDER BY st.expiryDate DESC";
		
		Query query = session.createQuery(queryStr);
		query.setParameter("itemUuid", itemUuid);
		query.setParameter("locationUuid", locationUuid);
		
		return query.list();
	}
	
	public List<Stock> getStockByItemAndLocations(String itemUuid, List<String> locationUuids) {
		/*DbSession session = this.getSession();
		String locations = "";
		for(String location: locationUuids){
			if(!locations.equals("")){
				locations += ",";
			}
			locations += "'" +location +"'";
		}
		String queryStr = "SELECT st \n" + "FROM Stock st \n"
				+ "WHERE st.item = (SELECT it FROM Item it WHERE it.uuid = :itemUuid) "
				+ "AND st.location = (SELECT l FROM Location l WHERE l.uuid IN (:locationUuids))\n"
				+ "AND st.item.stockable = true";

		Query query = session.createQuery(queryStr);
		query.setParameter("itemUuid", itemUuid);
		query.setParameter("locationUuids", locations);*/

        List<Stock> stockList = new ArrayList<>();

        for (String location : locationUuids) {
            stockList.addAll(getStockByItemAndLocation(itemUuid, location));
        }
        return stockList;
    }
	
	public List<Stock> getStockByDrugAndLocation(String drugUuid, String locationUuid) {
		DbSession session = this.getSession();
		new Item();
		String queryStr = "SELECT st FROM Stock st \n"
		        + "WHERE st.item = (SELECT it FROM Item it WHERE it.drug = (SELECT d FROM Drug d WHERE d.uuid=:drugUuid)) "
		        + "AND st.location = (SELECT l FROM Location l WHERE l.uuid = :locationUuid)\n"
		        + "AND st.item.stockable = true";
		
		Query query = session.createQuery(queryStr);
		query.setParameter("drugUuid", drugUuid);
		query.setParameter("locationUuid", locationUuid);
		
		return query.list();
	}
	
	public List<Stock> getStockByItemLocation(String itemUuid, String locationUuid) {
		
		DbSession session = this.getSession();
		Date expireDate = new Date();
		System.out.println("dates expiry");
		System.out.println(expireDate);
		
		String queryStr = "SELECT st \n" + "FROM Stock st \n"
		        + "WHERE st.item = (SELECT it FROM Item it WHERE it.uuid = :itemUuid) "
		        + "AND st.location = (SELECT l FROM Location l WHERE l.uuid = :locationUuid)\n"
		        + "AND st.item.stockable = true AND st.expiryDate >= :expireDate";
		
		Query query = session.createQuery(queryStr);
		query.setParameter("itemUuid", itemUuid);
		query.setParameter("locationUuid", locationUuid);
		query.setParameter("expireDate", expireDate);
		
		return (List<Stock>) query.list();
		
	}
	
	public Stock getStockByItemBatchExpDateLocation(String itemUuid, String batch, Date expireDate, String locationUuid) {
		DbSession session = this.getSession();
		
		if (batch == null && expireDate == null) {
			
			expireDate = new Date();
			System.out.println("dates expiry");
			System.out.println(expireDate);
			
			String queryStr = "SELECT st \n" + "FROM Stock st \n"
			        + "WHERE st.item = (SELECT it FROM Item it WHERE it.uuid = :itemUuid) "
			        + "AND st.location = (SELECT l FROM Location l WHERE l.uuid = :locationUuid)\n"
			        + "AND st.item.stockable = true AND st.expiryDate <= :expireDate";
			
			Query query = session.createQuery(queryStr);
			query.setParameter("itemUuid", itemUuid);
			query.setParameter("locationUuid", locationUuid);
			query.setParameter("expireDate", expireDate);
			
			System.out.println(query.getQueryString());
			
			return (Stock) query.uniqueResult();
			
		} else {
			
			String queryStr = "SELECT st \n" + "FROM Stock st \n"
			        + "WHERE st.item = (SELECT it FROM Item it WHERE it.uuid = :itemUuid) "
			        + "AND st.location = (SELECT l FROM Location l WHERE l.uuid = :locationUuid)\n"
			        + "AND st.item.stockable = true AND st.batch = :batch " + "AND st.expiryDate = :expireDate";
			
			Query query = session.createQuery(queryStr);
			query.setParameter("itemUuid", itemUuid);
			query.setParameter("locationUuid", locationUuid);
			query.setParameter("batch", batch);
			query.setParameter("expireDate", expireDate);
			
			System.out.println(query.getQueryString());
			
			return (Stock) query.uniqueResult();
			
		}
		
	}
	
	public ListResult<Stock> getStockByLocation(String locationUuid,Pager pager, String search, Integer startIndex, Integer limit,
	        String conceptClassName) {
		
		DbSession session = this.getSession();
		String queryStr = "SELECT st \n"
		        + "FROM Stock st \n LEFT JOIN st.item it LEFT JOIN it.concept c LEFT JOIN it.drug d";
		if (search != null) {
			queryStr += " LEFT JOIN c.names cn WHERE (lower(d.name) LIKE lower(:search) OR lower(cn.name) like lower(:search) ) ";
		}
		if (locationUuid != null) {

			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}

			queryStr += "st.location = (SELECT l FROM Location l WHERE l.uuid = :locationUuid)";
		}
		
		if (conceptClassName != null) {
			
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}
			queryStr += " c.conceptClass =(SELECT ccl FROM ConceptClass ccl WHERE ccl.name = :conceptClassName)";
			
		}
		
		if (!queryStr.contains("WHERE")) {
			queryStr += " WHERE ";
		} else {
			queryStr += " AND ";
		}
		queryStr += " (d.retired = false OR c.retired = false) AND it.voided=false AND st.quantity > 0 order by st.item ASC";

		
		Query query = session.createQuery(queryStr);
//		query.setFirstResult(startIndex);
//		query.setMaxResults(limit);
		
		if (search != null) {
			query.setParameter("search", "%" + search.replace(" ", "%") + "%");
		}
		if (conceptClassName != null) {
			query.setParameter("conceptClassName", conceptClassName);
		}
		if (locationUuid != null) {
			query.setParameter("locationUuid", locationUuid);
		}

		if (pager.isAllowed()) {
			pager.setTotal(query.list().size());
			query.setFirstResult((pager.getPage() - 1) * pager.getPageSize());
			query.setMaxResults(pager.getPageSize());
		}

		ListResult<Stock> listResults = new ListResult<>();
		listResults.setPager(pager);
		listResults.setResults(query.list());
		return listResults;
		
	}
	
	public ListResult<Item> getStockedOut(Pager pager) {
		
		DbSession session = this.getSession();
		String queryStr = "SELECT item FROM Item item \n"
		        + "WHERE item.stockable = true AND item.voided=false AND ( item IN(SELECT stock.item FROM Stock stock WHERE (SELECT SUM(stock2.quantity) FROM Stock stock2 WHERE stock2.item = stock.item AND stock2.expiryDate > current_date) <= 0)) OR (item IN(SELECT stock.item FROM Stock stock WHERE (SELECT SUM(stock2.quantity) FROM Stock stock2 WHERE stock2.item = stock.item AND stock2.expiryDate > current_date) = NULL))";
		
		Query query = session.createQuery(queryStr);
		
		ListResult<Item> listResults = new ListResult();
		listResults.setPager(pager);
		listResults.setResults(query.list());
		return listResults;
		
	}
	
	public ListResult<Item> getNearlyStockedOut(String locationUuid,Pager pager, String q) {

			DbSession session = this.getSession();

//			String queryStr = "SELECT stc.item,SUM(stc.quantity) FROM Stock stc \n"
//					+ "WHERE stc.location = (SELECT l FROM Location l WHERE l.uuid = :locationUuid) \n" + "GROUP BY stc.item \n"
//					+ "HAVING SUM(stc.quantity) <=  (SELECT rol.quantity FROM ReorderLevel rol \n"
//					+ "WHERE rol.id.location = (SELECT loc FROM Location loc WHERE loc.uuid = :locationUuid) AND rol.id.item = stc.item)";
//
//			String queryStr = "SELECT s FROM Stock s JOIN (SELECT s.item, SUM(s.quantity) as totalQuantity FROM Stock s WHERE s.location = (SELECT l FROM Location l WHERE l.uuid = :locationUuid) GROUP BY s.item) AS sq ON s.item = sq.item JOIN ReorderLevel r ON s.item = r.id.item WHERE sq.totalQuantity <= r.quantity";

//			String queryStr = "SELECT s FROM Stock s INNER JOIN ReorderLevel r ON s.item = r.id.item WHERE s.item IN ( SELECT s2.item FROM Stock s2 WHERE s2.location = (SELECT l FROM Location l WHERE l.uuid = :locationUuid) GROUP BY s2.item HAVING SUM(s2.quantity) < r.quantity)";

			String queryStr = "SELECT item FROM Item item LEFT JOIN item.concept c WITH c.retired = false LEFT JOIN c.names cn WITH cn.conceptNameType = 'FULLY_SPECIFIED' LEFT JOIN item.drug d WITH d.retired = false WHERE item IN( SELECT s.item FROM Stock s WHERE s.location = (SELECT l FROM Location l WHERE l.uuid = :locationUuid) AND  s.item IN ( SELECT r.id.item FROM ReorderLevel r WHERE ( SELECT SUM(s2.quantity) FROM Stock s2 WHERE s2.item = r.id.item AND s2.location = (SELECT l FROM Location l WHERE l.uuid = :locationUuid AND s2.expiryDate > current_date) GROUP BY s2.item) <= r.quantity)) ";

			if( q != null){
				if(!queryStr.contains("WHERE")){
					queryStr += " WHERE ";
				} else{
					queryStr += " AND ";
				}
				queryStr += " lower(d.name) LIKE lower(:q) OR lower(cn.name) like lower(:q) ";
			}


			Query query = session.createQuery(queryStr);

			if (q != null) {
				query.setParameter("q", "%" + q.replace(" ", "%") + "%");
			}

			query.setParameter("locationUuid", locationUuid);

			if (pager.isAllowed()) {
				pager.setTotal(query.list().size());
				query.setFirstResult((pager.getPage() - 1) * pager.getPageSize());
				query.setMaxResults(pager.getPageSize());
			}

			ListResult<Item> listResults = new ListResult<>();
			listResults.setPager(pager);
			listResults.setResults(query.list());
			return listResults;
		}
	
	public ListResult<Item> getNearlyExpiredByLocation(String locationUuid, Pager pager, String q) {

		LocalDate endDate = LocalDate.now().plusDays(30);
		Date endDateUtil = Date.from(endDate.atStartOfDay(ZoneId.systemDefault()).toInstant());

		DbSession session = this.getSession();

		String queryStr = "SELECT stc FROM Stock stc INNER JOIN stc.item it LEFT JOIN it.concept c LEFT JOIN c.names cn WITH cn.conceptNameType = 'FULLY_SPECIFIED' LEFT JOIN it.drug d WHERE stc.expiryDate <= :endDate AND stc.expiryDate > current_date AND (d.retired = false OR c.retired = false) AND stc.location = (SELECT l FROM Location l WHERE l.uuid = :locationUuid) AND stc.quantity > 0 ";

		if( q != null){
			if(!queryStr.contains("WHERE")){
				queryStr += " WHERE ";
			} else{
				queryStr += " AND ";
			}
			queryStr += " lower(d.name) LIKE lower(:q) OR lower(cn.name) like lower(:q) ";
		}

		Query query = session.createQuery(queryStr);

		if (q != null) {
			query.setParameter("q", "%" + q.replace(" ", "%") + "%");
		}

		query.setParameter("locationUuid", locationUuid);
		query.setParameter("endDate",endDateUtil);
		System.out.println(query);

		if (pager.isAllowed()) {
			pager.setTotal(query.list().size());
			query.setFirstResult((pager.getPage() - 1) * pager.getPageSize());
			query.setMaxResults(pager.getPageSize());
		}

		ListResult<Item> listResults = new ListResult<>();
		listResults.setPager(pager);
		listResults.setResults(query.list());
		return listResults;

	}
	
	public ListResult<Item> getExpiredItemsByLocation(String locationUuid, Pager pager, String q) {

		DbSession session = this.getSession();

		String queryStr = "SELECT stc FROM Stock stc INNER JOIN stc.item it LEFT JOIN it.concept c LEFT JOIN c.names cn WITH cn.conceptNameType = 'FULLY_SPECIFIED' LEFT JOIN it.drug d WHERE stc.expiryDate <= current_date AND (d.retired = false OR c.retired = false) AND  stc.location = (SELECT l FROM Location l WHERE l.uuid = :locationUuid) AND stc.quantity > 0 ";

		if( q != null){
			if(!queryStr.contains("WHERE")){
				queryStr += " WHERE ";
			} else{
				queryStr += " AND ";
			}
			queryStr += " lower(d.name) LIKE lower(:q) OR lower(cn.name) like lower(:q) ";
		}

		Query query = session.createQuery(queryStr);

		if (q != null) {
			query.setParameter("q", "%" + q.replace(" ", "%") + "%");
		}
		query.setParameter("locationUuid", locationUuid);

		if (pager.isAllowed()) {
			pager.setTotal(query.list().size());
			query.setFirstResult((pager.getPage() - 1) * pager.getPageSize());
			query.setMaxResults(pager.getPageSize());
		}
		//Stock
		ListResult<Item> listResults = new ListResult<>();
		listResults.setPager(pager);
		listResults.setResults(query.list());
		return listResults;

	}
	
	//TODO fix getting by location query
	public ListResult<Item> getStockedOutByLocation(String locationUuid, Pager pager, String q, String conceptClassName) {
		DbSession session = this.getSession();
		//String queryStr = "SELECT item FROM Item item \n"
		//        + "WHERE item.stockable = true AND item.uuid NOT IN(SELECT stock.item.uuid FROM Stock stock WHERE stock.location.uuid =:locationUuid)";
		//String queryStr = "SELECT item FROM Item item, Stock stock WHERE item.stockable = true AND stock.item=item AND stock.location.uuid =:locationUuid";

		String queryStr = "SELECT item FROM Item item LEFT JOIN item.concept c WITH c.retired = false LEFT JOIN item.drug d WITH d.retired = false \n";
		
		if (q != null) {
			queryStr += " LEFT JOIN c.names cn";
			queryStr += " WHERE lower(d.name) LIKE lower(:q) OR lower(cn.name) like lower(:q) ";
		}
		
		if (!queryStr.contains("WHERE")) {
			queryStr += " WHERE ";
		} else {
			queryStr += " AND ";
		}
		queryStr += "item.stockable = true AND item.voided=false AND ((item IN(SELECT stock.item FROM Stock stock WHERE stock.location.uuid =:locationUuid AND (SELECT SUM(stock2.quantity) FROM Stock stock2 WHERE stock2.item = stock.item AND stock2.expiryDate > current_date AND stock2.location.uuid =:locationUuid) <= 0) ) OR (item IN(SELECT stock.item FROM Stock stock WHERE stock.location.uuid =:locationUuid AND (SELECT SUM(stock2.quantity) FROM Stock stock2 WHERE stock2.item = stock.item AND stock2.expiryDate > current_date AND stock2.location.uuid =:locationUuid) = NULL)) OR (item NOT IN( SELECT stock.item FROM Stock stock WHERE stock.location.uuid =:locationUuid)))";
		
		Query query = session.createQuery(queryStr);
		//		query.setFirstResult(startIndex);
		//		query.setMaxResults(limit);
		
		if (q != null) {
			query.setParameter("q", "%" + q.replace(" ", "%") + "%");
		}
		//		if (conceptClassName != null) {
		//			query.setParameter("conceptClassName", conceptClassName);
		//		}
		
		query.setParameter("locationUuid", locationUuid);

		if (pager.isAllowed()) {
			pager.setTotal(query.list().size());
			query.setFirstResult((pager.getPage() - 1) * pager.getPageSize());
			query.setMaxResults(pager.getPageSize());
		}

		ListResult<Item> listResults = new ListResult<>();
		listResults.setPager(pager);
		listResults.setResults(query.list());
		return listResults;
	}
	
	public Map<String, Object> getStockMetricsByLocation(String locationUuid) {
		
		Pager pager = new Pager();
		pager.setAllowed(false);
		
		Map<String, Object> metricsMap = new HashMap<String, Object>();
		metricsMap.put("nearlyStockedOut", this.getNearlyStockedOut(locationUuid, pager, null).getResults().size());
		metricsMap.put("nearlyExpired", this.getNearlyExpiredByLocation(locationUuid, pager, null).getResults().size());
		metricsMap.put("stockedOut", this.getStockedOutByLocation(locationUuid, pager, null, null).getResults().size());
		metricsMap.put("expired", this.getExpiredItemsByLocation(locationUuid, pager, null).getResults().size());
		
		return metricsMap;
		
	}
	
	public List<OrderStatus> getOrderStatusByVisit(String visitUuid) {
		DbSession session = this.getSession();
		//String queryStr = "SELECT item FROM Item item \n"
		//        + "WHERE item.stockable = true AND item.uuid NOT IN(SELECT stock.item.uuid FROM Stock stock WHERE stock.location.uuid =:locationUuid)";
		//String queryStr = "SELECT item FROM Item item, Stock stock WHERE item.stockable = true AND stock.item=item AND stock.location.uuid =:locationUuid";
		String queryStr = "SELECT os FROM OrderStatus os\n" + "INNER JOIN os.order o\n" + "INNER JOIN o.encounter e\n"
		        + "INNER JOIN e.visit v\n" + "WHERE v.uuid=:visitUuid";
		
		Query query = session.createQuery(queryStr);
		query.setParameter("visitUuid", visitUuid);
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
	
	public OrderStatus saveOrderStatus(OrderStatus entity) {
		DbSession session = getSession();
		session.saveOrUpdate("OrderStatus", entity);
		session.flush();
		return entity;
	}
	
	public ReorderLevel updateReorderLevel(ReorderLevel reorderLevel) {
		
		DbSession session = this.getSession();
		String queryStr = " UPDATE ReorderLevel ro ";
		
		if (reorderLevel.getItem() != null) {
			if (!queryStr.contains("SET")) {
				queryStr += " SET ";
			} else {
				queryStr += " ,";
			}
			queryStr += " ro.id.item = :item ";
		}
		
		if (reorderLevel.getLocation() != null) {
			if (!queryStr.contains("SET")) {
				queryStr += " SET ";
			} else {
				queryStr += " ,";
			}
			queryStr += " ro.id.location = :location";
		}
		
		if (reorderLevel.getQuantity() != null) {
			if (!queryStr.contains("SET")) {
				queryStr += " SET ";
			} else {
				queryStr += " ,";
			}
			queryStr += " ro.quantity = :quantity";
			
		}
		
		queryStr += " WHERE uuid = :uuid";
		
		Query query = session.createQuery(queryStr);
		
		if (reorderLevel.getItem() != null) {
			query.setParameter("item", reorderLevel.getItem());
		}
		
		if (reorderLevel.getLocation() != null) {
			query.setParameter("location", reorderLevel.getLocation());
		}
		
		if (reorderLevel.getQuantity() != null) {
			query.setParameter("quantity", reorderLevel.getQuantity());
		}
		
		query.setParameter("uuid", reorderLevel.getUuid());
		
		Integer success = query.executeUpdate();
		
		if (success == 1) {
			return reorderLevel;
		} else {
			return null;
		}
		
	}
	
	public Boolean isPendingRequisition(String itemUuid, String locationUuid) {
		DbSession session = this.getSession();
		String queryStr = "SELECT rq FROM Requisition rq INNER JOIN rq.requisitionItems ri INNER JOIN rq.requestingLocation loc WHERE ri.id.item.uuid =:itemUuid AND loc.uuid =:locationUuid AND rq NOT IN( SELECT rs.requisition FROM RequisitionStatus rs WHERE (rs.status = 4 OR rs.status= 1 OR rs.status = 2))";
		
		Query query = session.createQuery(queryStr);
		
		if (itemUuid != null) {
			query.setParameter("itemUuid", itemUuid);
		}
		
		if (locationUuid != null) {
			query.setParameter("locationUuid", locationUuid);
		}
		
		Boolean isPendingRequisition = false;
		
		if (query.list().size() > 0) {
			isPendingRequisition = true;
		}
		
		return isPendingRequisition;
		
	}
	
	public Requisition deleteRequisition(String requisitionUuid) {
		
		DbSession session = this.getSession();
		String selectQueryStr = "SELECT rq FROM Requisition rq WHERE rq.uuid = :requisitionUuid";
		
		Query selectQuery = session.createQuery(selectQueryStr);
		selectQuery.setParameter("requisitionUuid", requisitionUuid);
		
		Requisition deletedRequisition = (Requisition) selectQuery.uniqueResult(); // Fetch the object before deletion
		
		if (deletedRequisition != null) {
			String deleteQueryStr = "DELETE FROM Requisition rq WHERE rq.uuid = :requisitionUuid";
			
			Query deleteQuery = session.createQuery(deleteQueryStr);
			deleteQuery.setParameter("requisitionUuid", requisitionUuid);
			
			int deletedCount = deleteQuery.executeUpdate(); // Perform the deletion
			
			// Now 'deletedRequisition' contains the deleted object
		}
		
		//session.getTransaction().commit(); // Commit the transaction
		
		return deletedRequisition;
	}
	
	public RequisitionItem deleteRequisitionItem(String requestItemUuid) {
		
		DbSession session = this.getSession();
		String selectQueryStr = "SELECT rq FROM RequisitionItem rq WHERE rq.uuid = :requestItemUuid";
		
		Query selectQuery = session.createQuery(selectQueryStr);
		selectQuery.setParameter("requestItemUuid", requestItemUuid);
		
		RequisitionItem deletedRequisitionItem = (RequisitionItem) selectQuery.uniqueResult(); // Fetch the object before deletion
		
		if (deletedRequisitionItem != null) {
			String deleteQueryStr = "DELETE FROM RequisitionItem rq WHERE rq.uuid = :requestItemUuid";
			
			Query deleteQuery = session.createQuery(deleteQueryStr);
			deleteQuery.setParameter("requestItemUuid", requestItemUuid);
			
			int deletedCount = deleteQuery.executeUpdate(); // Perform the deletion
			
		}
		
		//session.getTransaction().commit(); // Commit the transaction
		
		return deletedRequisitionItem;
		
	}
	
	public RequisitionStatus deleteRequisitionStatus(String requestStatusUuid) {
		
		DbSession session = this.getSession();
		String selectQueryStr = "SELECT rq FROM RequisitionStatus rq WHERE rq.uuid = :requestStatusUuid";
		
		Query selectQuery = session.createQuery(selectQueryStr);
		selectQuery.setParameter("requestStatusUuid", requestStatusUuid);
		
		RequisitionStatus deletedRequisitionStatus = (RequisitionStatus) selectQuery.uniqueResult(); // Fetch the object before deletion
		
		if (deletedRequisitionStatus != null) {
			String deleteQueryStr = "DELETE FROM RequisitionStatus rq WHERE rq.uuid = :requestStatusUuid";
			
			Query deleteQuery = session.createQuery(deleteQueryStr);
			deleteQuery.setParameter("requestStatusUuid", requestStatusUuid);
			
			int deletedCount = deleteQuery.executeUpdate(); // Perform the deletion
			
		}
		
		//session.getTransaction().commit(); // Commit the transaction
		
		return deletedRequisitionStatus;
	}
	
	public RequisitionItemStatus deleteRequisitionItemStatus(String requestItemStatusUuid) {
		DbSession session = this.getSession();
		String selectQueryStr = "SELECT rq FROM RequisitionItemStatus rq WHERE rq.uuid = :requestItemStatusUuid";
		
		Query selectQuery = session.createQuery(selectQueryStr);
		selectQuery.setParameter("requestItemStatusUuid", requestItemStatusUuid);
		
		RequisitionItemStatus deletedRequisitionItemStatus = (RequisitionItemStatus) selectQuery.uniqueResult(); // Fetch the object before deletion
		
		if (deletedRequisitionItemStatus != null) {
			String deleteQueryStr = "DELETE FROM RequisitionItemStatus rq WHERE rq.uuid = :requestItemStatusUuid";
			
			Query deleteQuery = session.createQuery(deleteQueryStr);
			deleteQuery.setParameter("requestItemStatusUuid", requestItemStatusUuid);
			
			int deletedCount = deleteQuery.executeUpdate(); // Perform the deletion
			
		}
		
		//session.getTransaction().commit(); // Commit the transaction
		
		return deletedRequisitionItemStatus;
		
	}
	
	public RequisitionItem getRequisitionItemByUuid(String requestItemUuid) {
		
		DbSession session = this.getSession();
		String queryStr = "SELECT ri FROM RequisitionItem ri WHERE ri.uuid = :requestItemUuid";
		
		Query query = session.createQuery(queryStr);
		query.setParameter("requestItemUuid", requestItemUuid);
		
		return (RequisitionItem) query.uniqueResult();
	}
	
	public StockInvoice deleteStockInvoice(String stockInvoiceUuid) {
		
		DbSession session = this.getSession();
		String selectQueryStr = "SELECT sti FROM StockInvoice sti WHERE sti.uuid = :stockInvoiceUuid";
		
		Query selectQuery = session.createQuery(selectQueryStr);
		selectQuery.setParameter("stockInvoiceUuid", stockInvoiceUuid);
		
		StockInvoice deletedStockInvoice = (StockInvoice) selectQuery.uniqueResult(); // Fetch the object before deletion
		
		if (deletedStockInvoice != null) {
			String deleteQueryStr = "DELETE FROM StockInvoice sti WHERE sti.uuid = :stockInvoiceUuid";
			
			Query deleteQuery = session.createQuery(deleteQueryStr);
			deleteQuery.setParameter("stockInvoiceUuid", stockInvoiceUuid);
			
			int deletedCount = deleteQuery.executeUpdate(); // Perform the deletion
			
		}
		
		//session.getTransaction().commit(); // Commit the transaction
		
		return deletedStockInvoice;
		
	}
	
	public StockInvoiceStatus deleteStockInvoiceStatus(String stockInvoiceStatusUuid) {
		DbSession session = this.getSession();
		String selectQueryStr = "SELECT stis FROM StockInvoiceStatus stis WHERE stis.uuid = :stockInvoiceStatusUuid";
		
		Query selectQuery = session.createQuery(selectQueryStr);
		selectQuery.setParameter("stockInvoiceStatusUuid", stockInvoiceStatusUuid);
		
		StockInvoiceStatus deletedStockInvoiceStatus = (StockInvoiceStatus) selectQuery.uniqueResult(); // Fetch the object before deletion
		
		if (deletedStockInvoiceStatus != null) {
			String deleteQueryStr = "DELETE FROM StockInvoiceStatus stis WHERE stis.uuid = :stockInvoiceStatusUuid";
			
			Query deleteQuery = session.createQuery(deleteQueryStr);
			deleteQuery.setParameter("stockInvoiceStatusUuid", stockInvoiceStatusUuid);
			
			int deletedCount = deleteQuery.executeUpdate(); // Perform the deletion
			
		}
		
		////session.getTransaction().commit(); // Commit the transaction
		
		return deletedStockInvoiceStatus;
	}
	
	public StockInvoiceItem deleteStockInvoiceItem(String stockInvoiceItemUuid) {
		
		DbSession session = this.getSession();
		String selectQueryStr = "SELECT stii FROM StockInvoiceItem stii WHERE stii.uuid = :stockInvoiceItemUuid";
		
		Query selectQuery = session.createQuery(selectQueryStr);
		selectQuery.setParameter("stockInvoiceItemUuid", stockInvoiceItemUuid);
		
		StockInvoiceItem deletedStockInvoiceItem = (StockInvoiceItem) selectQuery.uniqueResult(); // Fetch the object before deletion
		
		if (deletedStockInvoiceItem != null) {
			String deleteQueryStr = "DELETE FROM StockInvoiceItem stii WHERE stii.uuid = :stockInvoiceItemUuid";
			
			Query deleteQuery = session.createQuery(deleteQueryStr);
			deleteQuery.setParameter("stockInvoiceItemUuid", stockInvoiceItemUuid);
			
			int deletedCount = deleteQuery.executeUpdate(); // Perform the deletion
			
		}
		
		//session.getTransaction().commit(); // Commit the transaction
		
		return deletedStockInvoiceItem;
	}
	
	public StockInvoiceItemStatus deleteStockInvoiceItemStatus(String stockInvoiceItemStatusUuid) {
		
		DbSession session = this.getSession();
		String selectQueryStr = "SELECT stiis FROM StockInvoiceItemStatus stiis WHERE stiis.uuid = :stockInvoiceItemStatusUuid";
		
		Query selectQuery = session.createQuery(selectQueryStr);
		selectQuery.setParameter("stockInvoiceItemStatusUuid", stockInvoiceItemStatusUuid);
		
		StockInvoiceItemStatus deletedStockInvoiceItemStatus = (StockInvoiceItemStatus) selectQuery.uniqueResult(); // Fetch the object before deletion
		
		if (deletedStockInvoiceItemStatus != null) {
			String deleteQueryStr = "DELETE FROM StockInvoiceItemStatus stiis WHERE stiis.uuid = :stockInvoiceItemStatusUuid";
			
			Query deleteQuery = session.createQuery(deleteQueryStr);
			deleteQuery.setParameter("stockInvoiceItemStatusUuid", stockInvoiceItemStatusUuid);
			
			int deletedCount = deleteQuery.executeUpdate(); // Perform the deletion
			
		}
		
		//session.getTransaction().commit(); // Commit the transaction
		
		return deletedStockInvoiceItemStatus;
	}
}
