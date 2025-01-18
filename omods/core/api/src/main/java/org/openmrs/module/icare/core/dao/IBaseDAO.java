package org.openmrs.module.icare.core.dao;

import java.util.List;

public interface IBaseDAO<T> {
	
	public <S extends T> S save(S entity);
	
	public Iterable<T> findAll();
	
	public List<T> findByPatientUuid(String patientId);
	
	public T findByUuid(String uuid);
	
}
