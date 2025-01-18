import * as _ from 'lodash';

export function formatBillingInfo(data) {
  let formattedBillingInfo = {};
  _.each(data, (quote) => {
    let quoteData = {
      status: quote.quoteStatus.name,
      discounted: quote.discounted,
      totalDiscountedAmount: quote.totalDiscountedAmount,
      totalQuotedAmount: quote.totalQuotedAmount,
      totalPayableAmount: quote.totalPayableAmount,
    };
    _.each(quote.saleQuoteLineList, (saleQuoteLineList) => {
      formattedBillingInfo[
        quote.visit.uuid + '-' + saleQuoteLineList.item.uuid
      ] = {
        quote: quoteData,
        visitAndConceptUuids:
          quote.visit.uuid + '-' + saleQuoteLineList.item.uuid,
        conceptUuid: saleQuoteLineList.item.uuid,
        conceptName: saleQuoteLineList.item.name,
        quotedAmount: saleQuoteLineList.quotedAmount,
        payableAmount: saleQuoteLineList.payableAmount,
        paymentCategory: saleQuoteLineList.paymentCategory.name,
        paymentSubCategory: saleQuoteLineList.paymentSubCategory.name,
        quoteStatus: saleQuoteLineList.quoteStatus,
      };
    });
  });
  return formattedBillingInfo;
}

export function formatPaidItemsFromBilling(billingInfoByItems) {
  let formattedBillingInfo = {};
  _.map(billingInfoByItems, (item) => {
    formattedBillingInfo[item?.visit_uuid + '-' + item?.concept_uuid] = item;
  });
  return formattedBillingInfo;
}
