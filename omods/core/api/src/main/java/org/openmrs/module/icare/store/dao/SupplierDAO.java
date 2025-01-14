package org.openmrs.module.icare.store.dao;

import org.hibernate.Query;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.module.icare.core.dao.BaseDAO;
import org.openmrs.module.icare.core.models.EncounterPatientProgram;
import org.openmrs.module.icare.store.models.Supplier;

import java.util.List;

public class SupplierDAO extends BaseDAO<Supplier> {
	
	public List<Supplier> getSuppliers(Integer startIndex, Integer limit) {
		
		DbSession dbSession = this.getSession();
		String queryStr = "SELECT sp FROM Supplier sp WHERE sp.voided = false";
		
		//Construct a query Object
		Query query = dbSession.createQuery(queryStr);
		
		query.setMaxResults(limit);
		query.setFirstResult(startIndex);
		return query.list();
		
	}
	
	public Supplier updateSupplier(Supplier supplier) {
		
		DbSession dbSession = this.getSession();
		String queryStr = "UPDATE Supplier sp";
		
		if (supplier.getName() != null) {
			if (!queryStr.contains("SET")) {
				queryStr += " SET ";
			} else {
				queryStr += " , ";
			}
			queryStr += " sp.name = :name";
		}
		
		if (supplier.getDescription() != null) {
			if (!queryStr.contains("SET")) {
				queryStr += " SET ";
			} else {
				queryStr += " ,";
			}
			queryStr += " sp.description = :description";
		}
		
		if (supplier.getVoided() != null) {
			if (!queryStr.contains("SET")) {
				queryStr += " SET ";
			} else {
				queryStr += " ,";
			}
			queryStr += " sp.voided = :voided";
		}
		
		if (supplier.getLocation() != null) {
			if (!queryStr.contains("SET")) {
				queryStr += " SET ";
			} else {
				queryStr += " ,";
			}
			queryStr += " sp.location = :location";
		}
		
		queryStr += " WHERE sp.uuid = :uuid";
		
		Query query = dbSession.createQuery(queryStr);
		
		if (supplier.getName() != null) {
			query.setParameter("name", supplier.getName());
		}
		
		if (supplier.getDescription() != null) {
			query.setParameter("description", supplier.getDescription());
		}
		
		if (supplier.getVoided() != null) {
			query.setParameter("voided", supplier.getVoided());
		}
		
		if (supplier.getLocation() != null) {
			query.setParameter("location", supplier.getLocation());
		}
		
		query.setParameter("uuid", supplier.getUuid());
		
		Integer success = query.executeUpdate();
		
		if (success == 1) {
			return supplier;
		} else {
			return null;
		}
	}
}
