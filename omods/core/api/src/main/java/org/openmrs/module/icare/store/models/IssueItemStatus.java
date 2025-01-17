package org.openmrs.module.icare.store.models;

import org.openmrs.BaseOpenmrsData;
import org.openmrs.logic.op.In;

import javax.persistence.*;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "st_issue_item_status")
public class IssueItemStatus extends BaseOpenmrsData implements java.io.Serializable {
	
	@Id
	@GeneratedValue()
	@Column(name = "issue_item_status_id", unique = true, nullable = false)
	private Integer id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumns({ @JoinColumn(name = "item_id", referencedColumnName = "item_id", nullable = false),
	        @JoinColumn(name = "issue_id", referencedColumnName = "issue_id", nullable = false),
	        @JoinColumn(name = "batch_no", referencedColumnName = "batch_no", nullable = false) })
	private IssueItem issueItem;
	
	@Column(name = "remarks", length = 65535)
	private String remarks;
	
	@Column(name = "status", length = 32)
	private String status;
	
	@Override
	public Integer getId() {
		return id;
	}
	
	@Override
	public void setId(Integer id) {
		this.id = id;
	}
	
	public IssueItemStatus fromMap(Map<String, Object> issueItemStatusMap) {
		
		IssueItemStatus issueItemStatus = new IssueItemStatus();
		issueItemStatus.setRemarks(issueItemStatusMap.get("remarks").toString());
		issueItemStatus.setStatus(issueItemStatusMap.get("status").toString());
		
		IssueItem issueItem = new IssueItem();
		issueItem.setUuid(((Map) issueItemStatusMap.get("issueItem")).get("uuid").toString());
		issueItemStatus.setIssueItem(issueItem);
		
		return issueItemStatus;
	}
	
	public static enum IssueItemStatusCode {
		ISSUED, CANCELLED, REJECTED, RECEIVED;
		
	}
	
	public String getRemarks() {
		return remarks;
	}
	
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	
	public String getStatus() {
		return status;
	}
	
	public void setStatus(String status) {
		this.status = status;
	}
	
	public IssueItem getIssueItem() {
		return issueItem;
	}
	
	public void setIssueItem(IssueItem issueItem) {
		this.issueItem = issueItem;
	}
	
	public Map<String,Object> toMap(){

        Map<String,Object> issueItemStatusMap = new HashMap<>();
        issueItemStatusMap.put("status",this.getStatus());
        issueItemStatusMap.put("remarks", this.getRemarks());
        issueItemStatusMap.put("uuid", this.getUuid());
        issueItemStatusMap.put("batch",this.getIssueItem().getIssueItemId().getBatchNo());

        Map<String,Object> itemMap = new HashMap<>();
        itemMap.put("uuid",this.getIssueItem().getItem().getUuid());
        itemMap.put("display",this.getIssueItem().getItem().getDisplayString());
        issueItemStatusMap.put("item",itemMap);

        Map<String,Object> issueMap = new HashMap<>();
        issueMap.put("uuid", this.getIssueItem().getIssueItemId().getIssue().getUuid());
        issueItemStatusMap.put("issue",issueMap);
        return issueItemStatusMap;
    }
}
