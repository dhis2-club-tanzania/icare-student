package org.openmrs.module.icare.laboratory.dao;

import org.hibernate.Query;
import org.openmrs.api.AdministrationService;
import org.openmrs.api.context.Context;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.module.icare.ICareConfig;
import org.openmrs.module.icare.core.dao.BaseDAO;
import org.openmrs.module.icare.laboratory.models.Sample;
import org.openmrs.module.icare.laboratory.models.SampleLable;
import org.openmrs.module.icare.report.dhis2.DHIS2Config;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Pattern;

public class SampleLableDAO extends BaseDAO<SampleLable> {
	
	public SampleLable updateSampleLable(SampleLable sampleLable, Integer previosLable) {
		DbSession session = this.getSession();
		String queryStr = "UPDATE SampleLable set " + "currentLable = :currentLable," + " time = :time " + "where id = :id";
		
		Query query = session.createQuery(queryStr);
		query.setParameter("currentLable", sampleLable.getCurrentLable());
		query.setParameter("time", sampleLable.getTime());
		query.setParameter("id", sampleLable.getId());
		
		Integer success = query.executeUpdate();
		
		if (success == 1) {
			
			return sampleLable;
			
		} else {
			
			return null;
			
		}
	}
	
	public String generateSampleLabel() {
		AdministrationService adminService = Context.getService(AdministrationService.class);
		String idFormat = adminService.getGlobalProperty(ICareConfig.SAMPLE_ID_FORMAT);
		if (idFormat.contains("D{YYYY}") || idFormat.contains("D{YYY}") || idFormat.contains("D{YY}")) {
			SimpleDateFormat formatter = new SimpleDateFormat("YYYY", Locale.ENGLISH);
			idFormat = idFormat.replace("D{YYYY}", formatter.format(new Date()).substring(2));
			DbSession session = this.getSession();
			String queryStr = "SELECT COUNT(sp) FROM Sample sp \n" + "WHERE YEAR(sp.dateTime) = :year";
			Calendar calendar = Calendar.getInstance();
			Query query = session.createQuery(queryStr);
			query.setParameter("year", calendar.get(Calendar.YEAR));
			long data = (long) query.list().get(0);
			idFormat = idFormat.replace("COUNT", "" + String.format("%07d", data + 1));
		} else {
			idFormat = "";
		}
		return idFormat;
	}
	
	public List<String> generateLaboratoryIdLabels(String globalPropertyUuid, String metadataType, Integer count) {
		AdministrationService adminService = Context.getService(AdministrationService.class);
		String idFormat = adminService.getGlobalPropertyByUuid(globalPropertyUuid).getValue().toString();
		List<String> idLabels = new ArrayList<>();
		if (idFormat.contains("D{YYYY}") || idFormat.contains("D{YYY}") || idFormat.contains("D{YY}")) {
			SimpleDateFormat formatter = new SimpleDateFormat("YYYY", Locale.ENGLISH);
			Integer substringCount = 2;
			if (idFormat.contains("D{YY}")) {
				substringCount = 2;
				idFormat = idFormat.replace("D{YY}", formatter.format(new Date()).substring(substringCount));
			} else if (idFormat.contains("D{YYY}")) {
				substringCount = 1;
				idFormat = idFormat.replace("D{YYY}", formatter.format(new Date()).substring(substringCount));
			} else if (idFormat.contains("D{YYYY}")) {
				substringCount = 0;
				idFormat = idFormat.replace("D{YYYY}", formatter.format(new Date()).substring(substringCount));
			}
			DbSession session = this.getSession();
			String queryStr = null;
			if (metadataType.equals("sample")) {
				queryStr = "SELECT COUNT(sp) FROM Sample sp WHERE YEAR(sp.dateTime) = :year";
			} else if (metadataType.equals("worksheetdefinition")) {
				queryStr = "SELECT COUNT(wd) FROM WorksheetDefinition wd WHERE YEAR(wd.dateCreated) = :year";
			} else if (metadataType.equals("worksheet")){
				queryStr = "SELECT COUNT(ws) FROM Worksheet ws WHERE YEAR(ws.dateCreated) = :year";
			} else if (metadataType.equals("batchset")){
				queryStr = "SELECT COUNT(bs) FROM BatchSet bs WHERE YEAR(bs.dateCreated) = :year";
			} else if (metadataType.equals("batch")){
				queryStr = "SELECT COUNT(b) FROM BatchSample b WHERE YEAR(b.dateCreated) = :year";
			}
			if (queryStr != null) {
				Calendar calendar = Calendar.getInstance();
				Query query = session.createQuery(queryStr);
				query.setParameter("year", calendar.get(Calendar.YEAR));
				long data = (long) query.list().get(0);
				Integer countOfIdLabels = 1;
				if (count != null) {
					countOfIdLabels =  count;
				}
				for (Integer labelCount =1; labelCount <= countOfIdLabels; labelCount++) {
					idLabels.add(idFormat.replace( "COUNT:" + idFormat.split(":")[1], "" + String.format("%0" + idFormat.split(":")[1] +"d", data + labelCount)));

				}
			}
		}
		return idLabels;
	}
}
