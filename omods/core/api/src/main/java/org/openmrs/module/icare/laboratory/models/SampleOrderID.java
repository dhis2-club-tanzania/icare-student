package org.openmrs.module.icare.laboratory.models;

import org.openmrs.Order;

import javax.persistence.Embeddable;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Embeddable
public class SampleOrderID implements java.io.Serializable {
	
	@ManyToOne
	@JoinColumn(name = "sample_id")
	private Sample sample;
	
	@ManyToOne
	@JoinColumn(name = "order_id")
	private Order order;
	
	public Sample getSample() {
		return sample;
	}
	
	public void setSample(Sample sample) {
		this.sample = sample;
	}
	
	public Order getOrder() {
		return order;
	}
	
	public void setOrder(Order order) {
		this.order = order;
	}
	
}
