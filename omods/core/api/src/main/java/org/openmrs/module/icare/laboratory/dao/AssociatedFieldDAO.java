package org.openmrs.module.icare.laboratory.dao;

import org.hibernate.Query;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.module.icare.core.dao.BaseDAO;
import org.openmrs.module.icare.laboratory.models.AssociatedField;

import java.util.List;

public class AssociatedFieldDAO extends BaseDAO<AssociatedField> {
	
	public AssociatedField updateAssociatedField(String associatedFieldUuid, AssociatedField associatedField) {
		DbSession session = this.getSession();
		
		String queryStr = "UPDATE AssociatedField af";
		
		if (associatedField.getName() != null) {
			if (!queryStr.contains("SET")) {
				queryStr += " SET ";
			} else {
				queryStr += " , ";
			}
			queryStr += "af.name = :name";
		}
		
		if (associatedField.getVoided() != null) {
			if (!queryStr.contains("SET")) {
				queryStr += " SET ";
			} else {
				queryStr += " , ";
			}
			queryStr += " af.voided = :voided";
		}
		
		if (associatedField.getFieldType() != null) {
			if (!queryStr.contains("SET")) {
				queryStr += " SET ";
			} else {
				queryStr += " , ";
			}
			
			queryStr += " af.fieldType = :fieldType";
		}
		
		if (associatedField.getDescription() != null) {
			if (!queryStr.contains("SET")) {
				queryStr += " SET ";
			} else {
				queryStr += " , ";
			}
			queryStr += " af.description = :description";
		}
		
		queryStr += " WHERE af.uuid = :uuid";
		
		Query query = session.createQuery(queryStr);
		
		if (associatedField.getName() != null) {
			query.setParameter("name", associatedField.getName());
		}
		
		if (associatedField.getVoided() != null) {
			query.setParameter("voided", associatedField.getVoided());
		}
		
		if (associatedField.getFieldType() != null) {
			query.setParameter("fieldType", associatedField.getFieldType());
		}
		
		if (associatedField.getDescription() != null) {
			query.setParameter("description", associatedField.getDescription());
		}
		
		query.setParameter("uuid", associatedFieldUuid);
		
		Integer success = query.executeUpdate();
		
		if (success == 1) {
			return associatedField;
		} else {
			return null;
		}
	}
	
	public List<AssociatedField> getAssociatedFields(String q, Integer startIndex, Integer limit) {
		
		DbSession session = this.getSession();
		
		String queryStr = "SELECT af FROM AssociatedField af WHERE af.voided = false";
		
		if (q != null) {
			if (q != null) {
				if (!queryStr.contains("WHERE")) {
					queryStr += " WHERE ";
				} else {
					queryStr += " AND ";
				}
				
				queryStr += "lower(af.name) like lower(:q)";
			}
		}
		
		Query query = session.createQuery(queryStr);
		
		if (q != null) {
			query.setParameter("q", "%" + q.replace(" ", "%") + "%");
		}
		
		query.setFirstResult(startIndex);
		query.setMaxResults(limit);
		
		return query.list();
		
	}
}
