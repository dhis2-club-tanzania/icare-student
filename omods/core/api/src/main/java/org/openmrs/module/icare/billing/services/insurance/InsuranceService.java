package org.openmrs.module.icare.billing.services.insurance;

import org.openmrs.Concept;
import org.openmrs.Visit;
import org.openmrs.module.icare.billing.VisitInvalidException;
import org.openmrs.module.icare.billing.services.insurance.jubilee.JubileeInsuranceImpl;
import org.openmrs.module.icare.billing.services.insurance.nhif.NHIFServiceImpl;
import org.openmrs.module.icare.billing.services.insurance.startegies.StrategiesInsuranceImpl;

public interface InsuranceService {
	
	static InsuranceService getInsuranceInstance(String insuranceName) {
        InsuranceService insuranceService = null;
        if (insuranceName.toLowerCase().equals("nhif")) {
            insuranceService = new NHIFServiceImpl();

        } else if (insuranceName.toLowerCase().equals("jubilee")) {
            insuranceService = new JubileeInsuranceImpl();

        } else if (insuranceName.toLowerCase().equals("stratergies")) {
            insuranceService = new StrategiesInsuranceImpl();
        } else {

            throw new VisitInvalidException("Insurance '" + insuranceName + "' has not been implemented.");
        }
        return insuranceService;
    }
	
	VerificationResponse request(VerificationRequest verificationRequest) throws Exception;
	
	SyncResult syncPriceList() throws Exception;
	
	ClaimResult claim(Visit visit) throws Exception;
	
	Claim getClaim(Visit visit) throws Exception;
}
