package org.openmrs.module.icare.laboratory.dao;

// Generated Oct 7, 2020 12:49:21 PM by Hibernate Tools 5.2.10.Final

import org.hibernate.Query;
import org.openmrs.Visit;
import org.openmrs.api.db.hibernate.DbSession;
import org.openmrs.module.icare.core.ListResult;
import org.openmrs.module.icare.core.Pager;
import org.openmrs.module.icare.core.dao.BaseDAO;
import org.openmrs.module.icare.laboratory.models.*;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Home object for domain model class LbSample.
 * 
 * @see org.openmrs.module.icare.laboratory.models.Sample
 * @author Hibernate Tools
 */

public class SampleDAO extends BaseDAO<Sample> {
	
	//	TODO: Add also support to get samples by day and month
	public long getNumberOfRegisteredSamplesThisYear() {
		DbSession session = this.getSession();
		String queryStr = "SELECT COUNT(sp) FROM Sample sp \n" + "WHERE YEAR(sp.dateTime) = :year";
		Calendar calendar = Calendar.getInstance();
		Query query = session.createQuery(queryStr);
		query.setParameter("year", calendar.get(Calendar.YEAR));
		return (long) query.list().get(0);
	}
	
	public List<Sample> getSamplesByVisit(String id) {
		DbSession session = this.getSession();
		String queryStr = "SELECT sp \n" + "FROM Sample sp \n"
		        + "WHERE sp.visit = (SELECT v FROM Visit v WHERE v.uuid = :visitUuid)";
		
		Query query = session.createQuery(queryStr);
		query.setParameter("visitUuid", id);
		
		return query.list();
	}
	
	public List<Sample> getSamplesByDates(Date startDate, Date endDate) {
		
		DbSession session = this.getSession();
		String queryStr = "SELECT sp \n" + "FROM Sample sp \n"
		        + "WHERE cast(sp.dateTime as date) BETWEEN :startDate AND :endDate \n"
		        + "OR cast(sp.dateCreated as date) BETWEEN :startDate AND :endDate";
		
		Query query = session.createQuery(queryStr);
		query.setParameter("startDate", startDate);
		query.setParameter("endDate", endDate);
		
		return query.list();
	}
	
	public List<Visit> getPendingSampleCollectionVisits(Integer limit, Integer startIndex) {
		DbSession session = this.getSession();
		String queryStr = "SELECT distinct v FROM Visit v" + " INNER JOIN v.encounters e" + " INNER JOIN e.orders o"
		        + " INNER JOIN o.orderType ot" + " WHERE ot.javaClassName='org.openmrs.TestOrder' AND v NOT IN("
		        + "		SELECT v FROM Sample s" + "		INNER JOIN s.visit v" + ") AND v.stopDatetime IS NULL" + " ";
		
		Query query = session.createQuery(queryStr);
		query.setFirstResult(startIndex);
		query.setMaxResults(limit);
		
		return query.list();
	}
	
	public ListResult<Sample> getSamples(Date startDate, Date endDate, Pager pager, String locationUuid,
										 String sampleCategory, String testCategory, String q, String hasStatus, String acceptedByUuid,
										 String testConceptUuid, String departmentUuid, String specimenSourceUuid, String instrumentUuid, String visitUuid, String excludeStatus) {
		
		DbSession session = this.getSession();
		
		String queryStr = "SELECT sp \n" + "FROM Sample sp ";
		//		if (sampleCategory != null) {
		//			queryStr += " JOIN sp.sampleStatuses ss ";
		//		}
		
		if (testConceptUuid != null) {
			queryStr += " JOIN sp.sampleOrders sos LEFT JOIN sos.id.order o LEFT JOIN o.concept concept";
			if (q != null) {} else {
				queryStr += "WHERE concept.uuid =:testConceptUuid ";
			}
		}
		
		if (q != null) {
			queryStr += " JOIN sp.visit v LEFT JOIN v.patient p LEFT JOIN p.names pname LEFT JOIN p.identifiers pi LEFT JOIN v.attributes va";
			
			if (testConceptUuid != null) {
				queryStr += " WHERE concept.uuid =:testConceptUuid ";
			}
			
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}
			
			queryStr += "(lower(sp.label) like lower(:q) OR (lower(concat(pname.givenName,pname.middleName,pname.familyName)) LIKE lower(:q) OR lower(pname.givenName) LIKE lower(:q) OR lower(pname.middleName) LIKE lower(:q) OR lower(pname.familyName) LIKE lower(:q) OR lower(concat(pname.givenName,'',pname.familyName)) LIKE lower(:q) OR lower(concat(pname.givenName,'',pname.middleName)) LIKE lower(:q) OR lower(concat(pname.middleName,'',pname.familyName)) LIKE lower(:q)  OR pi.identifier LIKE :q OR lower(va.valueReference) LIKE lower(:q)))";
		}
		
		if (startDate != null && endDate != null) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}
			queryStr += " ((cast(sp.dateTime as date) BETWEEN :startDate AND :endDate) \n"
			        + "OR (cast(sp.dateCreated as date) BETWEEN :startDate AND :endDate))";
		}
		
		if (departmentUuid != null) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}
			queryStr += "sp.concept.uuid =:departmentUuid";
		}
		
		if (specimenSourceUuid != null) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}
			queryStr += "sp.specimenSource.uuid =:specimenSourceUuid";
		}
		
		if (locationUuid != null) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}
			queryStr += " sp.visit.location = (SELECT l FROM Location l WHERE l.uuid = :locationUuid)";
		}
		if (sampleCategory != null) {
			if (sampleCategory.toLowerCase().equals("not accepted")) {
				if (!queryStr.contains("WHERE")) {
					queryStr += " WHERE ";
				} else {
					queryStr += " AND ";
				}
				queryStr += " sp NOT IN (SELECT DISTINCT sst.sample FROM SampleStatus sst WHERE (sst.category='ACCEPTED'  OR  lower(sst.category) LIKE 'reject%'))  ";
				
			} else if (sampleCategory.toLowerCase().equals("no results")) {
				if (!queryStr.contains("WHERE")) {
					queryStr += " WHERE ";
				} else {
					queryStr += " AND ";
				}
				queryStr += " sp NOT IN (SELECT DISTINCT sst.sample FROM SampleStatus sst WHERE (sst.category='HAS_RESULTS'  OR  lower(sst.category) LIKE 'reject%'))   AND sp IN (SELECT DISTINCT sst.sample FROM SampleStatus sst WHERE (sst.category='ACCEPTED'))";
				
			} else if (sampleCategory.toLowerCase().equals("rejected")) {
				if (!queryStr.contains("WHERE")) {
					queryStr += " WHERE ";
				} else {
					queryStr += " AND ";
				}
				queryStr += "sp IN( SELECT sst.sample FROM SampleStatus sst WHERE lower(sst.category) LIKE 'reject%')";
			} else {
				
				if (!queryStr.contains("WHERE")) {
					queryStr += " WHERE ";
				} else {
					queryStr += " AND ";
				}
				queryStr += "sp IN( SELECT sst.sample FROM SampleStatus sst WHERE sst.category=:sampleCategory)";
				
			}
			
		}
		
		if (instrumentUuid != null) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}
			queryStr += " sp IN (SELECT DISTINCT sst.sample FROM SampleStatus sst WHERE (sst.category='HAS_RESULTS' AND sst.sample IN (SELECT testAllocation.sampleOrder.id.sample FROM TestAllocation testAllocation WHERE testAllocation IN (SELECT res.testAllocation FROM Result res WHERE res.instrument=(SELECT instrument FROM Concept instrument WHERE instrument.uuid =:instrumentUuid))))) ";
		}
		
		if (testCategory != null && testCategory.toLowerCase() != "completed") {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}
			queryStr += "sp IN(SELECT testalloc.sampleOrder.id.sample FROM TestAllocation testalloc WHERE testalloc IN (SELECT testallocstatus.testAllocation FROM TestAllocationStatus testallocstatus WHERE testallocstatus.category=:testCategory))";
		}
		
		if (testCategory != null && testCategory.toLowerCase().equals("completed")) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}
			queryStr += "sp IN(SELECT testalloc.sampleOrder.id.sample FROM TestAllocation testalloc WHERE testalloc IN (SELECT testresults.testAllocation FROM Result testresults))) ";
			
		}
		
		if (hasStatus != null) {
			if (hasStatus.toLowerCase().equals("no")) {
				
				if (!queryStr.contains("WHERE")) {
					queryStr += " WHERE ";
				} else {
					queryStr += " AND ";
				}
				queryStr += "sp NOT IN( SELECT samplestatus.sample FROM SampleStatus samplestatus)";
				
			}
			if (hasStatus.toLowerCase().equals("yes")) {
				
				if (!queryStr.contains("WHERE")) {
					queryStr += " WHERE ";
				} else {
					queryStr += " AND ";
				}
				if (acceptedByUuid == null) {
					queryStr += "sp IN( SELECT samplestatus.sample FROM SampleStatus samplestatus)";
					
				}
				if (acceptedByUuid != null) {
					queryStr += "sp IN ( SELECT samplestatus.sample FROM SampleStatus samplestatus WHERE samplestatus.user IN( SELECT usr FROM User usr WHERE uuid = :acceptedByUuid))";
					
				}
				
			}
		}
		
		if (visitUuid != null) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}
			queryStr += "sp.visit = (SELECT v FROM Visit v WHERE v.uuid = :visitUuid)";
			
		}

		if(excludeStatus != null){

			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}

			queryStr += "sp NOT IN( SELECT sst.sample FROM SampleStatus sst WHERE sst.category IN(:statuses)))";

		}
		
		queryStr += " ORDER BY sp.dateCreated DESC";
		//		if (sampleCategory != null) {
		//			queryStr += ",ss.timestamp DESC";
		//		}
		Query query = session.createQuery(queryStr);
		System.out.println(queryStr);
		if (startDate != null && endDate != null) {
			query.setParameter("startDate", startDate);
			query.setParameter("endDate", endDate);
		}
		
		if (locationUuid != null) {
			query.setParameter("locationUuid", locationUuid);
		}
		
		if (sampleCategory != null && !sampleCategory.toLowerCase().equals("not accepted")
		        && !sampleCategory.toLowerCase().equals("no results") && !sampleCategory.toLowerCase().equals("rejected")) {
			query.setParameter("sampleCategory", sampleCategory);
		}
		
		//		if (sampleCategory.toLowerCase().equals("rejected")) {
		//			query.setParameter("sampleCategory", sampleCategory);
		//		}
		
		if (q != null) {
			query.setParameter("q", "%" + q.replace(" ", "%") + "%");
		}
		
		if (departmentUuid != null) {
			query.setParameter("departmentUuid", departmentUuid);
		}
		
		if (specimenSourceUuid != null) {
			query.setParameter("specimenSourceUuid", specimenSourceUuid);
		}
		
		if (testCategory != null && testCategory.toLowerCase() != "completed") {
			query.setParameter("testCategory", testCategory);
		}
		if (acceptedByUuid != null && hasStatus.toLowerCase().equals("yes")) {
			query.setParameter("acceptedByUuid", acceptedByUuid);
		}
		
		if (testConceptUuid != null) {
			query.setParameter("testConceptUuid", testConceptUuid);
		}
		
		if (instrumentUuid != null) {
			query.setParameter("instrumentUuid", instrumentUuid);
		}
		if (visitUuid != null) {
			query.setParameter("visitUuid", visitUuid);
		}

		if(excludeStatus != null){
			Pattern pattern = Pattern.compile("List:\\[(.*?)\\]");
			Matcher matcher = pattern.matcher(excludeStatus);
			String excludedValue;
			if(matcher.find()){
				excludedValue = matcher.group(1);
			}else{
				excludedValue = excludeStatus;
			}

			String[] valuesArray = excludedValue.split(",");
			List<String> valueList = new ArrayList<>(Arrays.asList(valuesArray));
			query.setParameterList("statuses",valueList);
		}
		
		if (pager.isAllowed()) {
			pager.setTotal(query.list().size());
			//pager.setPageCount(pager.getT);
			query.setFirstResult((pager.getPage() - 1) * pager.getPageSize());
			query.setMaxResults(pager.getPageSize());
		}
		ListResult<Sample> listResults = new ListResult();
		listResults.setPager(pager);
		listResults.setResults(query.list());
		return listResults;
	}
	
	public List<Sample> getSamplesByVisitOrPatientAndOrDates(String visitId, String patient, Date startDate, Date endDate) {
		
		DbSession session = this.getSession();
		
		// General search query
		String queryStr = "SELECT sp FROM Sample sp";
		
		//If visit is provided, use visit instead
		if (visitId != null && visitId.length() > 0) {
			queryStr = "SELECT sp \n" + "FROM Sample sp \n"
			        + "WHERE sp.visit = (SELECT v FROM Visit v WHERE v.uuid = :visitUuid)";
		}
		
		//if no visit is provided but patient is provided
		if ((visitId == null || visitId.equals("")) && patient != null) {
			queryStr += " LEFT JOIN sp.visit v LEFT JOIN v.patient pnt WHERE pnt.uuid=:patientUuid";
		}
		
		// if visit / patient is provided
		if (visitId != null || patient != null) {
			//if start date only is provided
			if (startDate != null && endDate == null) {
				queryStr += " AND sp.dateCreated >= :startDate";
			}
			
			//if both dates are provided
			if (startDate != null && endDate != null) {
				queryStr += " AND sp.dateCreated >= :startDate AND sp.dateCreated <= :endDate";
			}
		}
		
		// Append with dates if provided but no patient/visit number
		
		if ((visitId == null || visitId.equals(""))) {
			if (patient == null || patient.equals("")) {
				//if start date only is provided
				if (startDate != null && endDate == null) {
					queryStr += " WHERE sp.dateCreated >= :startDate";
				}
				//if both dates are provided
				if (startDate != null && endDate != null) {
					queryStr += " WHERE sp.dateCreated >= :startDate AND sp.dateCreated <= :endDate";
				}
			}
		}
		
		//Construct a query object
		Query query = session.createQuery(queryStr);
		
		//Attach arguments accordingly
		if (startDate != null) {
			query.setParameter("startDate", startDate);
		}
		if (endDate != null && startDate != null) {
			query.setParameter("endDate", endDate);
		}
		
		if (visitId != null && visitId.length() > 0) {
			query.setParameter("visitUuid", visitId);
		}
		
		if ((visitId == null || visitId.length() < 1) && patient != null) {
			query.setParameter("patientUuid", patient);
		}
		
		return query.list();
	}
	
	public WorkloadSummary getWorkloadSummary(Date startDate, Date endDate) {
		
		WorkloadSummary workloadSummary = new WorkloadSummary();
		
		DbSession session = getSession();
		
		if (startDate != null && endDate != null) {
			
			String queryStr = "SELECT COUNT(sample) FROM Sample sample WHERE sample IN(SELECT testalloc.sampleOrder.id.sample FROM TestAllocation testalloc WHERE testalloc IN (SELECT testallocstatus.testAllocation FROM TestAllocationStatus testallocstatus WHERE testallocstatus.status='REJECTED')) AND (sample.dateCreated BETWEEN :startDate AND :endDate)";
			Query query = session.createQuery(queryStr);
			query.setParameter("startDate", startDate);
			query.setParameter("endDate", endDate);
			workloadSummary.setSamplesWithRejectedResults((long) query.list().get(0));
			
			queryStr = "SELECT COUNT(sample) FROM Sample sample WHERE sample IN(SELECT testalloc.sampleOrder.id.sample FROM TestAllocation testalloc WHERE testalloc IN (SELECT testallocstatus.testAllocation FROM TestAllocationStatus testallocstatus WHERE testallocstatus.status='APPROVED' ) ) AND (sample.dateCreated BETWEEN :startDate AND :endDate) ";
			query = session.createQuery(queryStr);
			query.setParameter("startDate", startDate);
			query.setParameter("endDate", endDate);
			workloadSummary.setSamplesAuthorized((long) query.list().get(0));
			
			queryStr = "SELECT COUNT(sample) FROM Sample sample WHERE sample IN(SELECT testalloc.sampleOrder.id.sample FROM TestAllocation testalloc WHERE testalloc IN (SELECT testresult.testAllocation FROM Result testresult) ) AND (sample.dateCreated BETWEEN :startDate AND :endDate) ";
			query = session.createQuery(queryStr);
			query.setParameter("startDate", startDate);
			query.setParameter("endDate", endDate);
			workloadSummary.setSamplesWithResults((long) query.list().get(0));
			
			queryStr = "SELECT COUNT(sample) FROM Sample sample WHERE sample IN(SELECT testalloc.sampleOrder.id.sample FROM TestAllocation testalloc WHERE testalloc NOT IN (SELECT testresult.testAllocation FROM Result testresult) ) AND (sample.dateCreated BETWEEN :startDate AND :endDate) ";
			query = session.createQuery(queryStr);
			query.setParameter("startDate", startDate);
			query.setParameter("endDate", endDate);
			workloadSummary.setSamplesWithNoResults((long) query.list().get(0));
			
		} else {
			
			String queryStr = "SELECT COUNT(sample) FROM Sample sample WHERE sample IN(SELECT testalloc.sampleOrder.id.sample FROM TestAllocation testalloc WHERE testalloc IN (SELECT testallocstatus.testAllocation FROM TestAllocationStatus testallocstatus WHERE testallocstatus.status='REJECTED')) ";
			Query query = session.createQuery(queryStr);
			workloadSummary.setSamplesWithRejectedResults((long) query.list().get(0));
			
			queryStr = "SELECT COUNT(sample) FROM Sample sample WHERE sample IN(SELECT testalloc.sampleOrder.id.sample FROM TestAllocation testalloc WHERE testalloc IN (SELECT testallocstatus.testAllocation FROM TestAllocationStatus testallocstatus WHERE testallocstatus.status='APPROVED' )) ";
			query = session.createQuery(queryStr);
			workloadSummary.setSamplesAuthorized((long) query.list().get(0));
			
			queryStr = "SELECT COUNT(sample) FROM Sample sample WHERE sample IN(SELECT testalloc.sampleOrder.id.sample FROM TestAllocation testalloc WHERE testalloc IN (SELECT testresult.testAllocation FROM Result testresult) ) ";
			query = session.createQuery(queryStr);
			workloadSummary.setSamplesWithResults((long) query.list().get(0));
			
			queryStr = "SELECT COUNT(sample) FROM Sample sample WHERE sample IN(SELECT testalloc.sampleOrder.id.sample FROM TestAllocation testalloc WHERE testalloc NOT IN (SELECT testresult.testAllocation FROM Result testresult) )  ";
			query = session.createQuery(queryStr);
			workloadSummary.setSamplesWithNoResults((long) query.list().get(0));
			
		}
		
		return workloadSummary;
		
	}
	
	public ListResult<SampleExt> getSamplesWithoutAllocations(Date startDate, Date endDate, Pager pager,
															  String locationUuid, String sampleCategory, String testCategory, String q, String hasStatus,
															  String acceptedByUuid, String testConceptUuid, String departmentUuid, String specimenSourceUuid,
															  String instrumentUuid, String visitUuid, String excludeStatus) {
		
		DbSession session = this.getSession();
		
		String queryStr = "SELECT DISTINCT sp \n" + "FROM SampleExt sp ";
		//		if (sampleCategory != null) {
		//			queryStr += " JOIN sp.sampleStatuses ss ";
		//		}
		
		if (testConceptUuid != null) {
			queryStr += " LEFT JOIN sp.sampleOrders sos JOIN sos.id.order o JOIN o.concept orderConcept";
			if (q != null) {} else {
				queryStr += " WHERE orderConcept.uuid =:testConceptUuid ";
			}
		}
		
		if (q != null) {
			queryStr += " JOIN sp.visit v LEFT JOIN v.patient p LEFT JOIN p.names pname LEFT JOIN p.identifiers pi LEFT JOIN v.attributes va ";
			
			if (testConceptUuid != null) {
				queryStr += " WHERE orderConcept.uuid =:testConceptUuid ";
			}
			
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}
			
			queryStr += "(lower(sp.label) like lower(:q) OR (lower(concat(pname.givenName,pname.middleName,pname.familyName)) LIKE lower(:q) OR lower(pname.givenName) LIKE lower(:q) OR lower(pname.middleName) LIKE lower(:q) OR lower(pname.familyName) LIKE lower(:q) OR lower(concat(pname.givenName,'',pname.familyName)) LIKE lower(:q) OR lower(concat(pname.givenName,'',pname.middleName)) LIKE lower(:q) OR lower(concat(pname.middleName,'',pname.familyName)) LIKE lower(:q)  OR pi.identifier LIKE :q OR lower(va.valueReference) LIKE lower(:q)))";
		}
		
		if (startDate != null && endDate != null) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}
			queryStr += " ((cast(sp.dateTime as date) BETWEEN :startDate AND :endDate) \n"
			        + "OR (cast(sp.dateCreated as date) BETWEEN :startDate AND :endDate))";
		}
		
		if (departmentUuid != null) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}
			queryStr += "sp.concept.uuid =:departmentUuid";
		}
		
		if (specimenSourceUuid != null) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}
			queryStr += "sp.specimenSource.uuid =:specimenSourceUuid";
		}
		
		if (instrumentUuid != null) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}
			queryStr += " sp IN (SELECT DISTINCT sst.sample FROM SampleStatus sst WHERE (sst.category='HAS_RESULTS' AND sst.sample IN (SELECT testAllocation.sampleOrder.id.sample FROM TestAllocation testAllocation WHERE testAllocation IN (SELECT res.testAllocation FROM Result res WHERE res.instrument.uuid =:instrumentUuid)))) ";
		}
		
		if (locationUuid != null) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}
			queryStr += " sp.visit.location = (SELECT l FROM Location l WHERE l.uuid = :locationUuid)";
		}
		if (sampleCategory != null) {
			
			if (sampleCategory.toLowerCase().equals("not accepted")) {
				if (!queryStr.contains("WHERE")) {
					queryStr += " WHERE ";
				} else {
					queryStr += " AND ";
				}
				queryStr += " sp NOT IN (SELECT DISTINCT sst.sample FROM SampleStatus sst WHERE (sst.category='ACCEPTED'  OR  lower(sst.category) LIKE 'reject%' OR lower(sst.category) LIKE 'dispose%')) ";
				
			} else if (sampleCategory.toLowerCase().equals("no results")) {
				if (!queryStr.contains("WHERE")) {
					queryStr += " WHERE ";
				} else {
					queryStr += " AND ";
				}
				queryStr += " sp NOT IN (SELECT DISTINCT sst.sample FROM SampleStatus sst WHERE (sst.category='HAS_RESULTS'  OR  lower(sst.category) LIKE 'reject%' OR lower(sst.category) LIKE 'dispose%')) AND sp IN (SELECT DISTINCT sst.sample FROM SampleStatus sst WHERE (sst.category='ACCEPTED'))";
				
			} else if (sampleCategory.toLowerCase().equals("rejected")) {
				if (!queryStr.contains("WHERE")) {
					queryStr += " WHERE ";
				} else {
					queryStr += " AND ";
				}
				queryStr += "sp IN( SELECT sst.sample FROM SampleStatus sst WHERE lower(sst.category) LIKE 'reject%')";
			} else {
				
				if (!queryStr.contains("WHERE")) {
					queryStr += " WHERE ";
				} else {
					queryStr += " AND ";
				}
				queryStr += "sp IN( SELECT sst.sample FROM SampleStatus sst WHERE sst.category=:sampleCategory)";
				
			}
			
		}
		if (testCategory != null && testCategory != "Completed") {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}
			queryStr += "sp IN(SELECT testalloc.sampleOrder.id.sample FROM TestAllocation testalloc WHERE testalloc IN (SELECT testallocstatus.testAllocation FROM TestAllocationStatus testallocstatus WHERE testallocstatus.category=:testCategory))";
		}
		
		if (testCategory == "Completed") {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}
			queryStr += "sp IN(SELECT testalloc.sampleOrder.id.sample FROM TestAllocation testalloc WHERE testalloc IN (SELECT testresults.testAllocation FROM Result testresults))) ";
			
			//			queryStr+="LEFT JOIN TestAllocation testalloc ON testalloc.sampleOrder.id.sample = sp JOIN Result testresults ON testresults.testAllocation = testalloc GROUP BY sp HAVING COUNT(testalloc)=COUNT(testresults) ";
			
			//			queryStr +=" LEFT JOIN sp.testAllocations al LEFT JOIN al.testAllocationResults ar GROUP BY sp HAVING COUNT(al.id) = COUNT(ar.testAllocation)";
			
		}
		
		if (hasStatus != null) {
			if (hasStatus.toLowerCase().equals("no")) {
				
				if (!queryStr.contains("WHERE")) {
					queryStr += " WHERE ";
				} else {
					queryStr += " AND ";
				}
				queryStr += "sp NOT IN( SELECT samplestatus.sample FROM SampleStatus samplestatus)";
				
			}
			if (hasStatus.toLowerCase().equals("yes")) {
				
				if (!queryStr.contains("WHERE")) {
					queryStr += " WHERE ";
				} else {
					queryStr += " AND ";
				}
				
				if (acceptedByUuid == null) {
					queryStr += "sp IN( SELECT samplestatus.sample FROM SampleStatus samplestatus)";
					
				}
				if (acceptedByUuid != null) {
					queryStr += "sp IN ( SELECT samplestatus.sample FROM SampleStatus samplestatus WHERE samplestatus.user IN( SELECT usr FROM User usr WHERE uuid = :acceptedByUuid))";
					
				}
			}
		}
		
		if (visitUuid != null) {
			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}
			queryStr += "sp.visit = (SELECT v FROM Visit v WHERE v.uuid = :visitUuid)";
			
		}

		if(excludeStatus != null){

			if (!queryStr.contains("WHERE")) {
				queryStr += " WHERE ";
			} else {
				queryStr += " AND ";
			}

			queryStr += "sp NOT IN( SELECT sst.sample FROM SampleStatus sst WHERE sst.category IN(:statuses)))";

		}
		
		queryStr += " ORDER BY sp.dateCreated DESC";
		//		if (sampleCategory != null) {
		//			queryStr += ",ss.timestamp DESC";
		//		}
		//		System.out.println(queryStr);
		Query query = session.createQuery(queryStr);
		System.out.println(queryStr);
		if (startDate != null && endDate != null) {
			query.setParameter("startDate", startDate);
			query.setParameter("endDate", endDate);
		}
		if (locationUuid != null) {
			query.setParameter("locationUuid", locationUuid);
		}
		
		if (sampleCategory != null && !sampleCategory.toLowerCase().equals("not accepted")
		        && !sampleCategory.toLowerCase().equals("no results") && !sampleCategory.toLowerCase().equals("rejected")) {
			query.setParameter("sampleCategory", sampleCategory);
		}
		
		if (q != null) {
			query.setParameter("q", "%" + q.replace(" ", "%") + "%");
		}
		
		if (departmentUuid != null) {
			query.setParameter("departmentUuid", departmentUuid);
		}
		
		if (specimenSourceUuid != null) {
			query.setParameter("specimenSourceUuid", specimenSourceUuid);
		}
		
		if (testCategory != null && testCategory != "Completed") {
			query.setParameter("testCategory", testCategory);
		}
		
		if (acceptedByUuid != null && hasStatus.toLowerCase().equals("yes")) {
			query.setParameter("acceptedByUuid", acceptedByUuid);
		}
		if (testConceptUuid != null) {
			query.setParameter("testConceptUuid", testConceptUuid);
		}
		
		if (instrumentUuid != null) {
			query.setParameter("instrumentUuid", instrumentUuid);
		}
		
		if (visitUuid != null) {
			query.setParameter("visitUuid", visitUuid);
		}

		if(excludeStatus != null){
			Pattern pattern = Pattern.compile("List:\\[(.*?)\\]");
			Matcher matcher = pattern.matcher(excludeStatus);
			String excludedValue;
			if(matcher.find()){
				excludedValue = matcher.group(1);
			}else{
				excludedValue = excludeStatus;
			}

			String[] valuesArray = excludedValue.split(",");
			List<String> valueList = new ArrayList<>(Arrays.asList(valuesArray));
			query.setParameterList("statuses",valueList);
		}
		
		if (pager.isAllowed()) {
			pager.setTotal(query.list().size());
			//pager.setPageCount(pager.getT);
			query.setFirstResult((pager.getPage() - 1) * pager.getPageSize());
			query.setMaxResults(pager.getPageSize());
		}
		
		ListResult<SampleExt> listResults = new ListResult();
		listResults.setPager(pager);
		listResults.setResults(query.list());
		return listResults;
	}
	
	public List<Sample> getSamplesByBatchSampleUuid(String batchSampleUuid) {
		DbSession session = this.getSession();
		String queryStr = "SELECT s FROM Sample s WHERE s.batchSample IN (select bs FROM BatchSample bs WHERE bs.uuid =:batchUuid)";
		Query query = session.createQuery(queryStr);
		query.setParameter("batchSampleUuid", batchSampleUuid);
		return query.list();
	}
}
