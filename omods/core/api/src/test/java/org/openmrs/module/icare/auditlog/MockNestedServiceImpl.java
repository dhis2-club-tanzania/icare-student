//package org.openmrs.module.icare.auditlog;
//
//import org.openmrs.EncounterType;
//import org.openmrs.Location;
//import org.openmrs.api.APIException;
//import org.openmrs.api.context.Context;
//import org.openmrs.api.impl.BaseOpenmrsService;
//import org.springframework.transaction.annotation.Propagation;
//import org.springframework.transaction.annotation.Transactional;
//
//public class MockNestedServiceImpl extends BaseOpenmrsService implements MockNestedService {
//
//	@Override
//	@Transactional
//	public void outerTransaction(Location location, boolean innerRollback, boolean outerRollback) {
//
//		Context.getLocationService().saveLocation(location);
//
//		try {
//			Context.getService(MockNestedService.class).innerTransaction(innerRollback);
//		}
//		catch (Exception e) {}
//
//		if (outerRollback) {
//			throw new APIException();
//		}
//	}
//
//	@Override
//	@Transactional(propagation = Propagation.REQUIRES_NEW)
//	public void innerTransaction(boolean rollback) {
//
//		EncounterType et = Context.getEncounterService().getEncounterType(ENCOUNTER_TYPE_ID);
//		et.setDescription("Some new description");
//		Context.getEncounterService().saveEncounterType(et);
//
//		if (rollback) {
//			throw new APIException();
//		}
//	}
//
//}
