package org.openmrs.module.icare.laboratory.models;

import org.openmrs.BaseOpenmrsData;

import javax.persistence.*;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "lb_worksheet_definition")
public class WorksheetDefinition extends BaseOpenmrsData implements java.io.Serializable {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "worksheet_definition_id", unique = true, nullable = false)
	private Integer id;
	
	@Column(name = "code", length = 30)
	private String code;
	
	@Column(name = "expiration_date_time", nullable = true)
	private Date expirationDateTime;
	
	@Column(name = "header_fields", nullable = true)
	private String additionalFields;
	
	@ManyToOne
	@JoinColumn(name = "worksheet_id")
	private Worksheet worksheet;
	
	@Override
	public Integer getId() {
		return id;
	}
	
	@Override
	public void setId(Integer id) {
		this.id = id;
	}
	
	public String getCode() {
		return code;
	}
	
	public void setCode(String code) {
		this.code = code;
	}
	
	public Date getExpirationDateTime() {
		return expirationDateTime;
	}
	
	public void setExpirationDateTime(Date expirationDateTime) {
		this.expirationDateTime = expirationDateTime;
	}
	
	public Worksheet getWorksheet() {
		return worksheet;
	}
	
	public void setWorksheet(Worksheet worksheet) {
		this.worksheet = worksheet;
	}
	
	public String getAdditionalFields() {
		return additionalFields;
	}
	
	public void setAdditionalFields(String additionalFields) {
		this.additionalFields = additionalFields;
	}
	
	public static WorksheetDefinition fromMap(Map<String, Object> worksheetDefinitionMap) throws ParseException {
		
		WorksheetDefinition worksheetDefinition = new WorksheetDefinition();
		worksheetDefinition.setCode(worksheetDefinitionMap.get("code").toString());
		if (worksheetDefinitionMap.get("expirationDateTime") != null) {
			DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			Date expirationDateTime = dateFormat.parse(worksheetDefinitionMap.get("expirationDateTime").toString());
			worksheetDefinition.setExpirationDateTime(expirationDateTime);
		}
		if (worksheetDefinitionMap.get("additionalFields") != null) {
			worksheetDefinition.setAdditionalFields(worksheetDefinitionMap.get("additionalFields").toString());
		}
		
		Worksheet worksheet = new Worksheet();
		worksheet.setUuid(((Map) worksheetDefinitionMap.get("worksheet")).get("uuid").toString());
		worksheetDefinition.setWorksheet(worksheet);
		
		return worksheetDefinition;
	}
	
	public Map<String,Object> toMap(){

		Map<String,Object> worksheetDefinitionObject = new HashMap<>();
		worksheetDefinitionObject.put("code",this.getCode());
		worksheetDefinitionObject.put("uuid",this.getUuid());
		worksheetDefinitionObject.put("dateCreated",this.getDateCreated());
		worksheetDefinitionObject.put("expirationDateTime", this.getExpirationDateTime());
		if(this.getAdditionalFields() != null){
			worksheetDefinitionObject.put("additionalFields",this.getAdditionalFields());
		}

		Map<String,Object> worksheetObject = new HashMap<>();
		worksheetObject.put("uuid",this.getWorksheet().getUuid());
		worksheetObject.put("display",this.getWorksheet().getName());
		worksheetObject.put("code",this.getWorksheet().getCode());
		worksheetObject.put("rows",this.getWorksheet().getRows());
		worksheetObject.put("columns",this.getWorksheet().getColumns());
		worksheetDefinitionObject.put("worksheet",worksheetObject);

		if (this.creator != null){
			Map<String,Object> userObject = new HashMap<>();
			userObject.put("uuid",this.getCreator().getUuid());
			userObject.put("display",this.getCreator().getDisplayString());
			worksheetDefinitionObject.put("creator",userObject);
		}

		return worksheetDefinitionObject;
	}
}
