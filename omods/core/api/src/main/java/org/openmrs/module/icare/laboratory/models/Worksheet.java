package org.openmrs.module.icare.laboratory.models;

import org.hibernate.annotations.Type;
import org.openmrs.BaseChangeableOpenmrsMetadata;
import org.openmrs.Concept;
import javax.persistence.*;
import java.util.HashMap;
import java.util.Map;

import static javax.persistence.GenerationType.IDENTITY;

@Entity
@Table(name = "lb_worksheet")
public class Worksheet extends BaseChangeableOpenmrsMetadata implements java.io.Serializable {
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "worksheet_id", unique = true, nullable = false)
	private Integer id;
	
	@Column(name = "code", length = 30)
	private String code;
	
	@Column(name = "rows", columnDefinition = "TINYINT")
	@Type(type = "org.hibernate.type.IntegerType")
	private Integer rows;
	
	@Column(name = "columns", columnDefinition = "TINYINT")
	@Type(type = "org.hibernate.type.IntegerType")
	private Integer columns;
	
	@ManyToOne
	@JoinColumn(name = "test_order_id")
	private Concept testOrder;
	
	@ManyToOne
	@JoinColumn(name = "instrument_id")
	private Concept instrument;
	
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
	
	public Integer getRows() {
		return rows;
	}
	
	public void setRows(Integer rows) {
		this.rows = rows;
	}
	
	public Integer getColumns() {
		return columns;
	}
	
	public void setColumns(Integer columns) {
		this.columns = columns;
	}
	
	public Concept getTestOrder() {
		return testOrder;
	}
	
	public void setTestOrder(Concept testOrder) {
		this.testOrder = testOrder;
	}
	
	public Concept getInstrument() {
		return instrument;
	}
	
	public void setInstrument(Concept instrument) {
		this.instrument = instrument;
	}
	
	public static Worksheet fromMap(Map<String, Object> worksheetMap) {
		
		Worksheet worksheet = new Worksheet();
		worksheet.setCode(worksheetMap.get("code").toString());
		worksheet.setDescription(worksheetMap.get("description").toString());
		worksheet.setRows((Integer) worksheetMap.get("rows"));
		worksheet.setColumns((Integer) worksheetMap.get("columns"));
		worksheet.setName(worksheetMap.get("name").toString());
		
		return worksheet;
	}
	
	public Map<String,Object> toMap(){

		HashMap<String,Object> worksheetObject = new HashMap<>();

		worksheetObject.put("code",this.getCode());
		worksheetObject.put("description",this.getDescription());
		worksheetObject.put("rows",this.getRows());
		worksheetObject.put("columns",this.getColumns());
		worksheetObject.put("name",this.getName());
		worksheetObject.put("uuid",this.getUuid());

		Map<String,Object> testOrderObject = new HashMap<>();
		testOrderObject.put("uuid",this.getTestOrder().getUuid());
		testOrderObject.put("display",this.getTestOrder().getDisplayString());
		worksheetObject.put("testOrder",testOrderObject);

		if(this.getCreator() != null){
			Map<String,Object> creatorObject = new HashMap<>();
			creatorObject.put("uuid",this.getCreator().getUuid());
			creatorObject.put("display",this.getCreator().getDisplayString());
		}

		if (this.getInstrument() != null){
			Map<String,Object> instrumentObject = new HashMap<>();
			instrumentObject.put("uuid",this.getInstrument().getUuid());
			instrumentObject.put("display",this.getInstrument().getDisplayString());
			worksheetObject.put("instrument",instrumentObject);
		}

		return worksheetObject;
	}
}
