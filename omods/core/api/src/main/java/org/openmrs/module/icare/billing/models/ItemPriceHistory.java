package org.openmrs.module.icare.billing.models;

import org.openmrs.Concept;
import org.openmrs.User;
import org.openmrs.module.icare.core.Item;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "bl_item_price_history")
public class ItemPriceHistory {
	
	@Id
	@GeneratedValue()
	@Column(name = "item_price_history_id", unique = true, nullable = false)
	private Integer id;
	
	@ManyToOne
	@JoinColumn(name = "payment_scheme_id")
	private Concept paymentScheme;
	
	@ManyToOne(cascade = { CascadeType.PERSIST })
	@JoinColumn(name = "item_id")
	private Item item;
	
	@ManyToOne
	@JoinColumn(name = "payment_type_id")
	private Concept paymentType;
	
	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "timestamp", length = 19)
	//@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-ddTHH:mm:ss.SSSZ")
	private Date timestamp;
	
	@Column(name = "previous_price", precision = 10, scale = 0, nullable = false)
	private Double previous_price;
	
	@Column(name = "current_price", precision = 10, scale = 0, nullable = false)
	private Double current_price;
	
	public Integer getId() {
		return id;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}
	
	public Concept getPaymentScheme() {
		return paymentScheme;
	}
	
	public void setPaymentScheme(Concept paymentScheme) {
		this.paymentScheme = paymentScheme;
	}
	
	public Item getItem() {
		return item;
	}
	
	public void setItem(Item item) {
		this.item = item;
	}
	
	public Concept getPaymentType() {
		return paymentType;
	}
	
	public void setPaymentType(Concept paymentType) {
		this.paymentType = paymentType;
	}
	
	public User getUser() {
		return user;
	}
	
	public void setUser(User user) {
		this.user = user;
	}
	
	public Date getTimestamp() {
		return timestamp;
	}
	
	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
	}
	
	public Double getPrevious_price() {
		return previous_price;
	}
	
	public void setPrevious_price(Double previous_price) {
		this.previous_price = previous_price;
	}
	
	public Double getCurrent_price() {
		return current_price;
	}
	
	public void setCurrent_price(Double current_price) {
		this.current_price = current_price;
	}
}
