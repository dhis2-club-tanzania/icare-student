package org.openmrs.module.icare.dhis.models;

import org.openmrs.BaseOpenmrsData;
import javax.persistence.*;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "dh_transaction")
public class DhisDatasetTransaction extends BaseOpenmrsData implements java.io.Serializable {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "dh_transaction_id", unique = true, nullable = false)
	private Integer id;
	
	@Column(name = "dh_report_name", length = 65535)
	private String reportName;
	
	@Column(name = "dh_report_id")
	private String reportId;
	
	@Column(name = "dh_report_period")
	private String reportPeriod;
	
	@Column(name = "dh_report_payload")
	private String reportPayload;
	
	@Column(name = "dh_report_response")
	private String reportResponse;
	
	public DhisDatasetTransaction() {
	}
	
	public String getReportId() {
		return this.reportId;
	}
	
	public void setReportId(String reportId) {
		this.reportId = reportId;
	}
	
	public String getReportPeriod() {
		return this.reportPeriod;
	}
	
	public void setReportPeriod(String reportPeriod) {
		this.reportPeriod = reportPeriod;
	}
	
	public String getReportName() {
		return this.reportName;
	}
	
	public void setReportName(String reportName) {
		this.reportName = reportName;
	}
	
	@Override
	public Integer getId() {
		return id;
	}
	
	@Override
	public void setId(Integer id) {
		this.id = id;
	}
	
	public String getReportPayload() {
		return this.reportPayload;
	}
	
	public void setReportPayload(String reportPayload) {
		this.reportPayload = reportPayload;
	}
	
	public String getReportResponse() {
		return this.reportResponse;
	}
	
	public void setReportResponse(String reportResponse) {
		this.reportResponse = reportResponse;
	}
	
	public static DhisDatasetTransaction fromMap(Map<String, Object> transactionMap) {
		DhisDatasetTransaction newDhisTransaction = new DhisDatasetTransaction();
		
		newDhisTransaction.setReportId((String) transactionMap.get("report_id"));
		newDhisTransaction.setReportPeriod((String) transactionMap.get("period"));
		newDhisTransaction.setReportName((String) transactionMap.get("report_name"));
		newDhisTransaction.setReportPayload((String) transactionMap.get("payload"));
		
		return newDhisTransaction;
	}
	
	public Map<String, Object> toMap() {
		HashMap<String, Object> transactionMap = new HashMap<String, Object>();
		
		transactionMap.put("report_id", this.getReportId());
		transactionMap.put("period", this.getReportPeriod());
		transactionMap.put("report_name", this.getReportName());
		transactionMap.put("payload", this.getReportPayload());
		transactionMap.put("response_dhis", this.getReportResponse());
		transactionMap.put("timestamp", this.getDateCreated());
		Map<String, Object> creatorObject = new HashMap<String, Object>();
		if (this.getCreator() != null) {
			creatorObject.put("uuid", this.getCreator().getUuid());
			creatorObject.put("display", this.getCreator().getDisplayString());
		}
		transactionMap.put("user", creatorObject);
		
		return transactionMap;
	}
	
}
