package org.openmrs.module.icare.billing.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.annotate.JsonSetter;
import org.openmrs.Order;
import org.openmrs.module.icare.billing.Utils.PaymentStatus;
import org.openmrs.module.icare.core.Item;

import javax.persistence.*;
import java.util.HashMap;
import java.util.Map;

@Embeddable
class PaymentItemID implements java.io.Serializable {
	
	@ManyToOne
	@JoinColumn(name = "payment_id")
	private Payment payment;
	
	@ManyToOne
	@JoinColumn(name = "item_id")
	private Item item;
	
	@OneToOne
	@JoinColumn(name = "order_id")
	@JsonIgnore
	private Order order;
	
	public Item getItem() {
		return item;
	}
	
	public void setItem(Item item) {
		this.item = item;
	}
	
	public Order getOrder() {
		return order;
	}
	
	public void setOrder(Order order) {
		this.order = order;
	}
	
	public Payment getPayment() {
		return payment;
	}
	
	public void setPayment(Payment payment) {
		this.payment = payment;
	}
}

@Entity
@Table(name = "bl_payment_item")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PaymentItem {
	
	@EmbeddedId
	@JsonIgnore
	private PaymentItemID id;
	
	@Column(name = "amount", nullable = false)
	private Double amount;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = true)
	private PaymentStatus status;
	
	public Payment getPayment() {
		return id.getPayment();
	}
	
	public void setPayment(Payment payment) {
		if (id == null) {
			id = new PaymentItemID();
		}
		id.setPayment(payment);
	}
	
	public Item getItem() {
		return id.getItem();
	}
	
	public void setItem(Item item) {
		if (id == null) {
			id = new PaymentItemID();
		}
		id.setItem(item);
	}
	
	public Order getOrder() {
		return id.getOrder();
	}
	
	@JsonSetter("order")
	public void setOrder(Order order) {
		if (id == null) {
			id = new PaymentItemID();
		}
		id.setOrder(order);
	}
	
	public Map<String, Object> getMap() {
		Map<String, Object> itemMap = new HashMap<String, Object>();
		itemMap.put("amount", this.getAmount());
		/*Map<String, Object> discountItemInvoiceObject = new HashMap<String, Object>();
		discountItemInvoiceObject.put("uuid", this.getPayment().getUuid());
		itemMap.put("payment", discountItemInvoiceObject);*/
		
		Map<String, Object> discountItemItemObject = new HashMap<String, Object>();
		discountItemItemObject.put("uuid", this.getItem().getUuid());
		if (this.getItem().getConcept() != null) {
			discountItemItemObject.put("name", this.getItem().getConcept().getDisplayString());
		}
		if (this.getItem().getDrug() != null) {
			discountItemItemObject.put("name", this.getItem().getDrug().getDisplayName());
		}
		itemMap.put("item", discountItemItemObject);
		
		Map<String, Object> paymentOrderObject = new HashMap<String, Object>();
		paymentOrderObject.put("uuid", this.getOrder().getUuid());
		
		itemMap.put("order", paymentOrderObject);
		return itemMap;
	}
	
	public Double getAmount() {
		return amount;
	}
	
	public void setAmount(Double amount) {
		this.amount = amount;
	}
	
	public PaymentStatus getStatus() {
		return status;
	}
	
	public void setStatus(PaymentStatus status) {
		this.status = status;
	}
}
