package org.openmrs.module.icare.laboratory.models;

import org.openmrs.BaseOpenmrsData;

import javax.persistence.*;
import java.util.*;

@Entity
@Table(name = "lb_batch_sample")
public class BatchSample extends BaseOpenmrsData implements java.io.Serializable {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "batch_sample_id", unique = true, nullable = false)
	private Integer id;
	
	@Column(name = "code", length = 30)
	private String code;
	
	@ManyToOne
	@JoinColumn(name = "batch_id")
	private Batch batch;
	
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "batchSample")
	private List<Sample> samples = new ArrayList<Sample>();
	
	@Override
	public Integer getId() {
		return id;
	}
	
	@Override
	public void setId(Integer integer) {
		this.id = id;
	}
	
	public String getCode() {
		return code;
	}
	
	public void setCode(String code) {
		this.code = code;
	}
	
	public Batch getBatch() {
		return batch;
	}
	
	public void setBatch(Batch batch) {
		this.batch = batch;
	}
	
	public List<Sample> getSamples() {
		return samples;
	}
	
	public void setSamples(List<Sample> samples) {
		this.samples = samples;
	}
	
	public Map<String,Object> toMap() throws Exception {

        Map<String,Object> newBatchSampleObject = new HashMap<>();
        newBatchSampleObject.put("code",this.getCode());
        newBatchSampleObject.put("uuid",this.getUuid());
        newBatchSampleObject.put("dateCreated",this.getDateCreated());

        if(this.batch != null){
            Map<String, Object> batchObject = new HashMap<>();
            batchObject.put("uuid",this.getBatch().getUuid());
            batchObject.put("display",this.getBatch().getBatchName());
            newBatchSampleObject.put("batch",batchObject);
        }
        if (this.creator != null){
            Map<String,Object> userObject = new HashMap<>();
            userObject.put("uuid",this.getCreator().getUuid());
            userObject.put("display",this.getCreator().getDisplayString());
            newBatchSampleObject.put("creator",userObject);
        }

        List<Map<String, Object>> samplesObject = new ArrayList<Map<String, Object>>();
        if (this.getSamples() != null) {

            for (Sample sample : this.getSamples()) {
                samplesObject.add(sample.toMap());
            }
            newBatchSampleObject.put("samples", samplesObject);
        }

        return newBatchSampleObject;
    }
	
	public static BatchSample fromMap(Map<String, Object> batchSampleMap) {
		
		BatchSample batchSample = new BatchSample();
		
		batchSample.setCode(batchSampleMap.get("code").toString());
		
		Batch batch = new Batch();
		batch.setUuid(((Map) batchSampleMap.get("batch")).get("uuid").toString());
		
		batchSample.setBatch(batch);
		
		return batchSample;
	}
}
