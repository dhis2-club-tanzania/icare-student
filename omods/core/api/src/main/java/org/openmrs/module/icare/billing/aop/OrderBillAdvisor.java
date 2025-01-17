package org.openmrs.module.icare.billing.aop;

import org.aopalliance.aop.Advice;
import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.*;
import org.openmrs.api.*;
import org.openmrs.api.context.Context;
import org.openmrs.attribute.AttributeType;
import org.openmrs.module.icare.ICareConfig;
import org.openmrs.module.icare.billing.ItemNotPayableException;
import org.openmrs.module.icare.billing.OrderMetaData;
import org.openmrs.module.icare.billing.models.BedOrder;
import org.openmrs.module.icare.billing.models.ItemPrice;
import org.openmrs.module.icare.billing.models.Prescription;
import org.openmrs.module.icare.billing.services.BillingService;
import org.openmrs.module.icare.core.ICareService;
import org.openmrs.module.icare.core.Item;
import org.openmrs.module.icare.store.models.OrderStatus;
import org.openmrs.module.icare.store.models.Stock;
import org.openmrs.module.icare.store.models.StockableItem;
import org.openmrs.module.icare.store.services.StoreService;
import org.openmrs.module.icare.store.util.StockOutException;
import org.openmrs.module.icare.store.util.TransactionUtil;
import org.springframework.aop.Advisor;
import org.springframework.aop.support.StaticMethodMatcherPointcutAdvisor;

import javax.naming.ConfigurationException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class OrderBillAdvisor extends StaticMethodMatcherPointcutAdvisor implements Advisor {
	
	protected final Log log = LogFactory.getLog(getClass());
	
	@Override
	public boolean matches(Method method, Class<?> aClass) {
		log.info("ICareAdvice Matching:" + method.getName());
		if (method.getName().equals("saveOrder"))
			return true;
		return false;
	}
	
	@Override
	public Advice getAdvice() {
		return new OrderBillCreationAdvice();
	}
	
	private class OrderBillCreationAdvice implements MethodInterceptor {
		
		public Object invoke(MethodInvocation invocation) throws Throwable {
			BillingService billingService = Context.getService(BillingService.class);
			if (invocation.getArguments()[0] instanceof TestOrder) {
				//Determine the item price
				TestOrder order = (TestOrder) invocation.getArguments()[0];
				ItemPrice itemPrice = Context.getService(ICareService.class).getItemPriceByConceptAndVisit(order.getEncounter().getVisit(),
				    order.getConcept());
				if (itemPrice == null) {
					throw new ItemNotPayableException(order.getConcept().getName() + " is not a billable item");
				}
				
				//Set the metadata
				OrderMetaData<TestOrder> orderMetaData = new OrderMetaData<TestOrder>();
				orderMetaData.setItemPrice(itemPrice);
				
				if (order.getAction() == Order.Action.DISCONTINUE) {
					orderMetaData.setRemoveBill(true);
				} else {
					order = (TestOrder) invocation.proceed();
					orderMetaData.setOrder(order);
				}
				billingService.processOrder(orderMetaData, null);
				
				return order;
			} else if (invocation.getArguments()[0] instanceof DrugOrder) {
				//check if drug is set
				DrugOrder order = (DrugOrder) invocation.getArguments()[0];
				if (((DrugOrder) invocation.getArguments()[0]).getDrug() != null) {
					//Determine the item price
					ItemPrice itemPrice = Context.getService(ICareService.class).getItemPrice(
					    order.getEncounter().getVisit(), order.getDrug());
					if (itemPrice == null) {
						throw new ItemNotPayableException(order.getDrug().getName() + " is not a billable item");
					}
					//Set the metadata
					OrderMetaData<DrugOrder> orderMetaData = new OrderMetaData<DrugOrder>();
					orderMetaData.setItemPrice(itemPrice);
					
					// StoreService storeService = Context.getService(StoreService.class);
					if (order.getAction() == Order.Action.NEW) {
						Item item = orderMetaData.getItemPrice().getItem();
						StoreService storeService = Context.getService(StoreService.class);
						/* AdministrationService administrationService = Context.getAdministrationService();
						String stockLocations = administrationService.getGlobalProperty(ICareConfig.STOCK_LOCATIONS);
						if (stockLocations == null) {
							throw new ConfigurationException("Stock Locations is configured. Please set '"
							        + ICareConfig.STOCK_LOCATIONS + "'");
						}*/
						if(order.getQuantity() != null && order.getQuantity() != 0){
							LocationService locationService = Context.getLocationService();
							List<String> locationUuids = new ArrayList<>();
							for (Location location : locationService.getLocationsByTag(locationService.getLocationTagByName("Dispensing Unit"))) {
								locationUuids.add(location.getUuid());
							}
							//List<Stock> stockList = storeService.getStockByItemAndLocation(item.getUuid(), order.getEncounter().getLocation().getUuid());
							AdministrationService administrationService = Context.getAdministrationService();
							String stockEnabled= administrationService.getGlobalProperty(ICareConfig.STOCK_ENABLE);

							if(!(stockEnabled != null && stockEnabled.equals("false"))){
								List<Stock> stockList = storeService.getStockByItemAndLocations(item.getUuid(), locationUuids);
								if (stockList.size() == 0) {
									throw new StockOutException(item.getDisplayString() + " is stocked out.");
								}
							}
						}
						
						order = (DrugOrder) invocation.proceed();
						orderMetaData.setOrder(order);
						billingService.processOrder(orderMetaData,  order.getQuantity());
					} else if (order.getAction() == Order.Action.REVISE) {
						//TODO find a way to edit the quantity
						OrderService orderService = Context.getOrderService();
						DrugOrder savedOrder = (DrugOrder) orderService.getOrderByUuid(order.getUuid());
						OrderContext orderContext = (OrderContext) invocation.getArguments()[1];
						savedOrder.setQuantity(order.getQuantity());
						savedOrder.setFulfillerStatus(Order.FulfillerStatus.COMPLETED);
						order = (DrugOrder) orderService.saveRetrospectiveOrder(savedOrder, orderContext);
						orderMetaData.setOrder(order);
						billingService.processOrder(orderMetaData, order.getQuantity());
					} else if (order.getAction() == Order.Action.DISCONTINUE) {
						OrderService orderService = Context.getOrderService();
						DrugOrder savedOrder = (DrugOrder) orderService.getOrderByUuid(order.getUuid());
						
						order = (DrugOrder) orderService.updateOrderFulfillerStatus(savedOrder,
						    Order.FulfillerStatus.COMPLETED, "DISPENSED");
						StockableItem stockableItem = new StockableItem();
						Item item = orderMetaData.getItemPrice().getItem();
						
						StoreService storeService = Context.getService(StoreService.class);
						List<Stock> stockList = storeService.getStockByItemAndLocation(item.getUuid(), order.getEncounter()
						        .getLocation().getUuid());
						if (stockList.size() == 0) {
							throw new StockOutException(item.getDisplayString() + " is stocked out.");
						}
						Stock stock = stockList.get(0);
						stockableItem.setBatch(stock.getBatch());
						stockableItem.setExpiryDate(stock.getExpiryDate());
						stockableItem.setItem(item);
						stockableItem.setLocation(order.getEncounter().getLocation());
						stockableItem.setQuantity(order.getQuantity());
						stockableItem.setSourceLocation(order.getEncounter().getLocation());
						TransactionUtil.deductStock(stockableItem);
					}
					
					return order;
					
				} else {
					order = (DrugOrder) invocation.proceed();
					return order;
				}
			} else if (invocation.getArguments()[0] instanceof Prescription) {
				//check if drug is set
				Prescription order = (Prescription) invocation.getArguments()[0];
				if (order.getDrug() != null) {
					//Determine the item price
					ItemPrice itemPrice = Context.getService(ICareService.class).getItemPrice(
							order.getEncounter().getVisit(), order.getDrug());
					if (itemPrice == null) {
						throw new ItemNotPayableException(order.getDrug().getName() + " is not a billable item");
					}
					//Set the metadata
					OrderMetaData<Prescription> orderMetaData = new OrderMetaData<Prescription>();
					orderMetaData.setItemPrice(itemPrice);

					Item item = orderMetaData.getItemPrice().getItem();
					StoreService storeService = Context.getService(StoreService.class);
					LocationService locationService = Context.getLocationService();
					List<String> locationUuids = new ArrayList<>();
					for (Location location : locationService.getLocationsByTag(locationService.getLocationTagByName("Dispensing Unit"))) {
						locationUuids.add(location.getUuid());
					}
					//List<Stock> stockList = storeService.getStockByItemAndLocation(item.getUuid(), order.getEncounter().getLocation().getUuid());
					AdministrationService administrationService = Context.getAdministrationService();
					String stockEnabled= administrationService.getGlobalProperty(ICareConfig.STOCK_ENABLE);
					if(!(stockEnabled != null && stockEnabled.equals("false"))){
						List<Stock> stockList = storeService.getStockByItemAndLocations(item.getUuid(), locationUuids);

						//Getting the total quantity of an item in all the dispensing units
						Double totalQuantity=0.00;
						for(Stock stock : stockList){
							totalQuantity = stock.getQuantity() + totalQuantity;
						}

						if (order.getQuantity() > totalQuantity) {
							throw new StockOutException(item.getDisplayString() + " is stocked out.");
						}
					}

					order = (Prescription) invocation.proceed();
					Prescription prescriptionOrder = (Prescription)Context.getOrderService().getOrderByUuid(order.getUuid());
//					List<OrderStatus> prescriptionOrderStatuses = Context.getService(StoreService.class).getOrderStatusByOrderUuid(prescriptionOrder.getUuid());
					if (!orderMetaData.getItemPrice().getPaymentType().getName().getName().toLowerCase().equals("cash")) {
						orderMetaData.setOrder(prescriptionOrder);
						billingService.processOrder(orderMetaData,order.getQuantity());
						return order;
					} else if (order.getPreviousOrder() != null) {
						orderMetaData.setOrder(prescriptionOrder);
						billingService.processOrder(orderMetaData, order.getQuantity());
						return order;
					} else {
						return  order;
					}
				} else {
					order = (Prescription) invocation.proceed();
					return order;
				}
			} else if (invocation.getArguments()[0] instanceof BedOrder) {
				//Determine the item price
				BedOrder order = (BedOrder) invocation.getArguments()[0];
				ItemPrice itemPrice = Context.getService(ICareService.class).getItemPriceByConceptAndVisit(order.getEncounter().getVisit(),
				    order.getConcept());
				if (itemPrice == null) {
					throw new ItemNotPayableException(order.getConcept().getName() + " is not a billable item");
				}
				
				//Set the metadata
				OrderMetaData<BedOrder> orderMetaData = new OrderMetaData<BedOrder>();
				orderMetaData.setItemPrice(itemPrice);
				
				order = (BedOrder) invocation.proceed();
				orderMetaData.setOrder(order);
				billingService.processOrder(orderMetaData, null);
				
				return order;
			} else {
				Order order = (Order) invocation.getArguments()[0];
				AdministrationService administrationService = Context.getAdministrationService();
				String orderTypeToSkipBilling = administrationService.getGlobalProperty(ICareConfig.ORDER_TO_SKIP_BILLING_ADVISOR);
				if (orderTypeToSkipBilling == null || !order.getOrderType().getUuid().equals(orderTypeToSkipBilling)) {
                    ItemPrice itemPrice = Context.getService(ICareService.class).getItemPriceByConceptAndVisit(order.getEncounter().getVisit(),
                            order.getConcept());
                    if (itemPrice == null) {
                        throw new ItemNotPayableException(order.getConcept().getName() + " is not a billable item.");
                    }
                    //Set the metadata
                    OrderMetaData<Order> orderMetaData = new OrderMetaData();
                    orderMetaData.setItemPrice(itemPrice);
                    order = (Order) invocation.proceed();
                    orderMetaData.setOrder(order);
                    billingService.processOrder(orderMetaData, null);
                } else {
					order = (Order) invocation.proceed();
				}
                return order;
            }
			
		}
	}
}
