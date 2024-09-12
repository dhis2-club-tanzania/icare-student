package org.openmrs.module.icare.store.util;

import org.openmrs.api.AdministrationService;
import org.openmrs.api.context.Context;
import org.openmrs.module.icare.ICareConfig;
import org.openmrs.module.icare.store.models.Stock;
import org.openmrs.module.icare.store.models.Transaction;
import org.openmrs.module.icare.store.services.StoreService;
import java.util.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class TransactionUtil {
	
	public static void addStock(Stockable stockable) {
		Transaction transaction = new Transaction();
		transaction.setItem(stockable.getItem());
		transaction.setLocation(stockable.getLocation());
		transaction.setBatchNo(stockable.getBatchNo());
		transaction.setExpireDate(stockable.getExpiryDate());
		if (stockable.getSourceLocation() != null) {
			transaction.setSourceLocation(stockable.getSourceLocation());
		}
		if (stockable.getDestinationLocation() != null) {
			transaction.setDestinationLocation(stockable.getDestinationLocation());
		}
		
		if (stockable.getDateCreated() != null) {
			transaction.setDateCreated(stockable.getDateCreated());
		}
		StoreService storeService = Context.getService(StoreService.class);
		Stock stock = storeService.getStockByItemBatchLocation(stockable.getItem(), stockable.getBatchNo(),
		    stockable.getExpiryDate(), stockable.getLocation());
		
		if (stock == null) {
			transaction.setPreviousQuantity(0.0);
			stock = new Stock();
			stock.setQuantity(0.0);
			stock.setBatch(stockable.getBatchNo());
			stock.setExpiryDate(stockable.getExpiryDate());
			stock.setItem(stockable.getItem());
			stock.setLocation(stockable.getLocation());
		} else {
			transaction.setPreviousQuantity(stock.getQuantity());
		}
		Double newQuantity = stockable.getQuantity() + stock.getQuantity();
		transaction.setCurrentQuantity(newQuantity);
		stock.setQuantity(newQuantity);
		
		storeService.saveStock(stock);
		storeService.saveTransaction(transaction);
	}
	
	public static void deductExpiredStock(Stockable stockable) throws StockOutException {
		
		Transaction transaction = new Transaction();
		transaction.setItem(stockable.getItem());
		transaction.setLocation(stockable.getLocation());
		transaction.setBatchNo(stockable.getBatchNo());
		transaction.setExpireDate(stockable.getExpiryDate());
		if (stockable.getSourceLocation() != null) {
			transaction.setSourceLocation(stockable.getSourceLocation());
		}
		if (stockable.getDestinationLocation() != null) {
			transaction.setDestinationLocation(stockable.getDestinationLocation());
		}
		StoreService storeService = Context.getService(StoreService.class);
		Stock stock = storeService.getStockByItemBatchLocation(stockable.getItem(), stockable.getBatchNo(),
		    stockable.getExpiryDate(), stockable.getLocation());
		
		System.out.println(stockable.getItem() + "ff");
		
		if (stock.getQuantity() - stockable.getQuantity() < 0) {
			throw new StockOutException("Negative Stock is not allowed");
		} else {
			
			transaction.setPreviousQuantity(stock.getQuantity());
			Double newQuantity = stock.getQuantity() - stockable.getQuantity();
			transaction.setCurrentQuantity(newQuantity);
			stock.setQuantity(newQuantity);
			storeService.saveStock(stock);
			storeService.saveTransaction(transaction);
		}
		
	}
	
	public static void deductStock(Stockable stockable) throws StockOutException {

        Transaction transaction = new Transaction();
        transaction.setItem(stockable.getItem());
        transaction.setLocation(stockable.getLocation());
        transaction.setBatchNo(stockable.getBatchNo());
        transaction.setExpireDate(stockable.getExpiryDate());

        if(stockable != null && stockable.getOrder() != null && stockable.getOrder().getId() != null){
            transaction.setOrder(stockable.getOrder());
        }
        if(stockable.getSourceLocation() != null) {
            transaction.setSourceLocation(stockable.getSourceLocation());
        }
        if(stockable.getDestinationLocation() != null){
            transaction.setDestinationLocation(stockable.getDestinationLocation());
        }

        StoreService storeService = Context.getService(StoreService.class);

        Stock stock = null;
        List<Transaction> transactionList = new ArrayList<>();

        List<Stock> stockList = storeService.getStockByItemLocation(stockable.getItem(), stockable.getLocation());
        List<Map<String, Object>> stockListMap = new ArrayList<>();
        double totalStock = 0.00;

        for (Stock stockItem : stockList) {

            stockListMap.add(stockItem.toMap());
            totalStock = totalStock + stockItem.getQuantity();
        }

        AdministrationService administrationService = Context.getAdministrationService();
        String allowNegativeStock = administrationService.getGlobalProperty(ICareConfig.ALLOW_NEGATIVE_STOCK);


        // check if stock to issue is more than total stock
        if (totalStock - stockable.getQuantity() < 0) {
            // if diffentnce < 0 throw execption
            if (allowNegativeStock == null || allowNegativeStock.equals("false")) {
                throw new StockOutException("Negative Stock is not allowed");
            }
        } else {


            double stockNeed = stockable.getQuantity();

            System.out.println("stockList size is : " + stockList.size());
            // if difference >= 0 go through stocks
            for (int i = 0; i <= stockList.size() - 1; i++) {

                System.out.println("iteration : " + i);
                System.out.println("stock need is : " + stockNeed);
                // for each stock check if stock need to be deducted
                if (stockNeed > 0) {

                    // should deduct all stock
                    if (stockList.get(i).getQuantity() - stockNeed < 0 ) {

                        if(stockList.get(i).getBatch().equals(stockable.getBatchNo())){
                        Transaction newTransaction = new Transaction();

                        // deduct to 0
                        transactionList.add(newTransaction);
                        newTransaction.setItem(stockable.getItem());
                        newTransaction.setLocation(stockable.getLocation());
                        if(stockable.getSourceLocation() != null) {
                            newTransaction.setSourceLocation(stockable.getSourceLocation());
                        }
                        if(stockable.getDestinationLocation() != null){
                            newTransaction.setDestinationLocation(stockable.getDestinationLocation());
                        }
                        if(stockable.getOrder().getId() != null){
                            newTransaction.setOrder(stockable.getOrder());
                        }
                        newTransaction.setBatchNo(stockList.get(i).getBatch());
                        newTransaction.setExpireDate(stockable.getExpiryDate());
                        newTransaction.setCurrentQuantity(0.0);
                        newTransaction.setPreviousQuantity(stockList.get(i).getQuantity());

                        stockNeed = stockNeed -stockList.get(i).getQuantity();

                        stockList.get(i).setQuantity(0.0);

                        storeService.saveStock(stockList.get(i));
                        storeService.saveTransaction(newTransaction);

                        }


                    } else {


                        if (stockList.get(i).getBatch().equals(stockable.getBatchNo())){

                        // deduction operations and transactions
                        Transaction newTransaction = new Transaction();
                        transactionList.add(newTransaction);
                        newTransaction.setItem(stockable.getItem());
                        newTransaction.setLocation(stockable.getLocation());
                        newTransaction.setBatchNo(stockList.get(i).getBatch());
                        newTransaction.setExpireDate(stockable.getExpiryDate());
                        newTransaction.setCurrentQuantity(stockList.get(i).getQuantity() - stockNeed);
                        newTransaction.setPreviousQuantity(stockList.get(i).getQuantity());
                        if(stockable.getSourceLocation() != null) {
                            newTransaction.setSourceLocation(stockable.getSourceLocation());
                        }
                        if(stockable.getDestinationLocation() != null){
                            newTransaction.setDestinationLocation(stockable.getDestinationLocation());
                        }

                        if(stockable.getOrder().getId() != null){
                            newTransaction.setOrder(stockable.getOrder());
                        }
                        stockList.get(i).setQuantity(stockList.get(i).getQuantity() - stockNeed);

                        storeService.saveStock(stockList.get(i));
                        storeService.saveTransaction(newTransaction);


                        stockNeed = stockNeed - stockList.get(i).getQuantity();
                    }

                    }

                }


            }


        }


    }
	
	public static void operateOnStock(String operation, Stockable stockable) throws StockOutException {
		Date todaysDate = new Date();
		
		if (operation.equals("+")) {
			TransactionUtil.addStock(stockable);
		} else if (operation.equals("-") && stockable.getExpiryDate().compareTo(todaysDate) > 0) {
			//Deduction for non-expired drugs
			TransactionUtil.deductStock(stockable);
		} else if (operation.equals("-") && stockable.getExpiryDate().compareTo(todaysDate) < 0) {
			// Deduction for expired drugs
			TransactionUtil.deductExpiredStock(stockable);
			
		}
	}
}
