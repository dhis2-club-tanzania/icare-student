export function getDrugOrderPaymentStatus(orderDetails: any, visit: any){
    let paidAmount = 0;
    let itemAmount = 0;
    let discountAmount = 0;
    
    orderDetails?.invoiceItem?.invoice?.payments?.map((payment) => {
        payment?.items?.map((item) => {
            paidAmount += item?.item?.uuid === orderDetails?.invoiceItem?.item?.uuid ? item?.amount : 0;
        })
    })

    orderDetails?.invoiceItem?.invoice?.items?.map((item) => {
        itemAmount += item?.item?.uuid === orderDetails?.invoiceItem?.item?.uuid ? item?.quantity * item?.price : 0
    })

    const isPaid = paidAmount + discountAmount >= itemAmount;
    
    return !orderDetails?.invoiceItem
        ? true
        : orderDetails?.invoiceItem?.invoice?.paymentMode?.display.toLowerCase() ===
            "insurance" &&
            orderDetails?.invoiceItem?.invoice?.visit?.uuid == visit
            ? true
            : isPaid &&
                orderDetails?.invoiceItem?.invoice?.visit?.uuid == visit
                ? true
                : false
}