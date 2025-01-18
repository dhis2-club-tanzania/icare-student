package org.openmrs.module.icare.billing.aop;

import org.aopalliance.aop.Advice;
import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.Visit;
import org.openmrs.api.context.Context;
import org.openmrs.module.icare.billing.services.BillingService;
import org.springframework.aop.Advisor;
import org.springframework.aop.support.StaticMethodMatcherPointcutAdvisor;

import java.lang.reflect.Method;

public class VisitBillAdvisor extends StaticMethodMatcherPointcutAdvisor implements Advisor {
	
	protected final Log log = LogFactory.getLog(getClass());
	
	@Override
	public boolean matches(Method method, Class<?> targetClass) {
		log.info("ICareAdvice Matching:" + method.getName());
		if (method.getName().equals("saveVisit"))
			return true;
		return false;
	}
	
	@Override
	public Advice getAdvice() {
		return new VisitBillCreationAdvice();
	}
	
	private class VisitBillCreationAdvice implements MethodInterceptor {
		
		public Object invoke(MethodInvocation invocation) throws Throwable {
			BillingService billingService = Context.getService(BillingService.class);
			Visit visit = billingService.createVisit(invocation);
			
			return visit;
		}
	}
}
