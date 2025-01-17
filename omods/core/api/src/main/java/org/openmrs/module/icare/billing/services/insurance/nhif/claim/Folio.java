package org.openmrs.module.icare.billing.services.insurance.nhif.claim;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.openmrs.module.icare.billing.models.Invoice;
import org.openmrs.module.icare.billing.services.insurance.Claim;
import org.openmrs.module.icare.billing.services.insurance.nhif.NHIFConfig;

import java.util.*;

public class Folio implements Claim {
	
	@JsonProperty("FolioID")
	private String folioID;
	
	@JsonProperty("FacilityCode")
	private String facilityCode;
	
	@JsonProperty("ClaimYear")
	private int claimYear;
	
	@JsonProperty("ClaimMonth")
	private int claimMonth;
	
	@JsonProperty("FolioNo")
	private long folioNo;
	
	@JsonProperty("SerialNo")
	private String serialNo;
	
	@JsonProperty("CardNo")
	private String cardNo;
	
	@JsonProperty("FirstName")
	private String firstName;
	
	@JsonProperty("LastName")
	private String lastName;
	
	@JsonProperty("Gender")
	private String gender;
	
	@JsonProperty("DateOfBirth")
	private Date dateOfBirth;
	
	@JsonProperty("Age")
	private int age;
	
	@JsonProperty("TelephoneNo")
	private String telephoneNo;
	
	@JsonProperty("PatientFileNo")
	private String patientFileNo;
	
	@JsonProperty("PatientFile")
	private String patientFile;
	
	@JsonProperty("AuthorizationNo")
	private String authorizationNo;
	
	@JsonProperty("AttendanceDate")
	private Date attendanceDate;
	
	@JsonProperty("PatientTypeCode")
	private String patientTypeCode;
	
	@JsonProperty("DateAdmitted")
	private Date dateAdmitted;
	
	@JsonProperty("DateDischarged")
	private Date dateDischarged;
	
	@JsonProperty("PractitionerNo")
	private String practitionerNo;
	
	@JsonProperty("ClaimFile")
	private String claimFile;
	
	@JsonProperty("CreatedBy")
	private String createdBy;
	
	@JsonProperty("DateCreated")
	private Date dateCreated;
	
	@JsonProperty("LastModifiedBy")
	private String lastModifiedBy;
	
	@JsonProperty("LastModified")
	private Date lastModified;
	
	@JsonProperty("FolioDiseases")
	private List<FolioDisease> folioDiseases = new ArrayList<FolioDisease>();
	
	@JsonProperty("FolioItems")
	private List<FolioItem> folioItems = new ArrayList<FolioItem>();
	
	public static Folio fromInvoice(Invoice invoice) {
		Folio folio = new Folio();
		return folio;
	}
	
	public int getClaimYear() {
		return claimYear;
	}
	
	public void setClaimYear(int claimYear) {
		this.claimYear = claimYear;
	}
	
	public int getClaimMonth() {
		return claimMonth;
	}
	
	public void setClaimMonth(int claimMonth) {
		this.claimMonth = claimMonth;
	}
	
	public long getFolioNo() {
		return folioNo;
	}
	
	public void setFolioNo(long folioNo) {
		this.folioNo = folioNo;
	}
	
	public String getSerialNo() {
		return serialNo;
	}
	
	public void setSerialNo(String serialNo) {
		this.serialNo = serialNo;
	}
	
	public String getCardNo() {
		return cardNo;
	}
	
	public void setCardNo(String cardNo) {
		this.cardNo = cardNo;
	}
	
	public String getFirstName() {
		return firstName;
	}
	
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	
	public String getLastName() {
		return lastName;
	}
	
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	
	public String getGender() {
		return gender;
	}
	
	public void setGender(String gender) {
		this.gender = gender;
	}
	
	public Date getDateOfBirth() {
		return dateOfBirth;
	}
	
	public void setDateOfBirth(Date dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}
	
	public int getAge() {
		return age;
	}
	
	public void setAge(int age) {
		this.age = age;
	}
	
	public String getTelephoneNo() {
		return telephoneNo;
	}
	
	public void setTelephoneNo(String telephoneNo) {
		this.telephoneNo = telephoneNo;
	}
	
	public String getPatientFileNo() {
		return patientFileNo;
	}
	
	public void setPatientFileNo(String patientFileNo) {
		this.patientFileNo = patientFileNo;
	}
	
	public String getPatientFile() {
		return patientFile;
	}
	
	public void setPatientFile(String patientFile) {
		this.patientFile = patientFile;
	}
	
	public String getAuthorizationNo() {
		return authorizationNo;
	}
	
	public void setAuthorizationNo(String authorizationNo) {
		this.authorizationNo = authorizationNo;
	}
	
	public Date getAttendanceDate() {
		return attendanceDate;
	}
	
	public void setAttendanceDate(Date attendanceDate) {
		this.attendanceDate = attendanceDate;
	}
	
	public String getPatientTypeCode() {
		return patientTypeCode;
	}
	
	public void setPatientTypeCode(String patientTypeCode) {
		this.patientTypeCode = patientTypeCode;
	}
	
	public Date getDateAdmitted() {
		return dateAdmitted;
	}
	
	public void setDateAdmitted(Date dateAdmitted) {
		this.dateAdmitted = dateAdmitted;
	}
	
	public Date getDateDischarged() {
		return dateDischarged;
	}
	
	public void setDateDischarged(Date dateDischarged) {
		this.dateDischarged = dateDischarged;
	}
	
	public String getPractitionerNo() {
		return practitionerNo;
	}
	
	public void setPractitionerNo(String practitionerNo) {
		this.practitionerNo = practitionerNo;
	}
	
	public String getCreatedBy() {
		return createdBy;
	}
	
	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}
	
	public Date getDateCreated() {
		return dateCreated;
	}
	
	public void setDateCreated(Date dateCreated) {
		this.dateCreated = dateCreated;
	}
	
	public String getLastModifiedBy() {
		return lastModifiedBy;
	}
	
	public void setLastModifiedBy(String lastModifiedBy) {
		this.lastModifiedBy = lastModifiedBy;
	}
	
	public Date getLastModified() {
		return lastModified;
	}
	
	public void setLastModified(Date lastModified) {
		this.lastModified = lastModified;
	}
	
	public List<FolioDisease> getFolioDiseases() {
		return folioDiseases;
	}
	
	public void setFolioDiseases(List<FolioDisease> folioDiseases) {
		this.folioDiseases = folioDiseases;
	}
	
	public List<FolioItem> getFolioItems() {
		return folioItems;
	}
	
	public void setFolioItems(List<FolioItem> folioItems) {
		this.folioItems = folioItems;
	}
	
	public String getFolioID() {
		return folioID;
	}
	
	public void setFolioID(String folioID) {
		this.folioID = folioID;
	}
	
	public String getFacilityCode() {
		return facilityCode;
	}
	
	public void setFacilityCode(String facilityCode) {
		this.facilityCode = facilityCode;
	}
	
	public String getClaimFile() {
		return claimFile;
	}
	
	public void setClaimFile(String claimFile) {
		this.claimFile = claimFile;
	}
	
	@Override
	public Map<String, Object> toMap() {
		Map<String, Object> result = new HashMap<>();
		result.put("claimFile",this.getClaimFile());
		result.put("patientFile",this.getPatientFile());
		return result;
	}
}
