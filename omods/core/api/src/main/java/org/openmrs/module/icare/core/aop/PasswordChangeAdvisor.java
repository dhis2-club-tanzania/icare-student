package org.openmrs.module.icare.core.aop;

import org.aopalliance.aop.Advice;
import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.User;
import org.openmrs.api.context.Context;
import org.openmrs.module.icare.billing.aop.OrderBillAdvisor;
import org.openmrs.module.icare.core.ICareService;
import org.springframework.aop.Advisor;
import org.springframework.aop.support.StaticMethodMatcherPointcutAdvisor;

import java.lang.reflect.Method;

public class PasswordChangeAdvisor extends StaticMethodMatcherPointcutAdvisor implements Advisor {
	
	protected final Log log = LogFactory.getLog(getClass());
	
	@Override
	public boolean matches(Method method, Class<?> aClass) {
		log.info("ICareAdvice Matching:" + method.getName());
		if (method.getName().equals("changePassword"))
			return true;
		return false;
		
	}
	
	@Override
	public Advice getAdvice() {
		return new ChangePasswordAdvice();
	}
	
	private class ChangePasswordAdvice implements MethodInterceptor {
		
		public Object invoke(MethodInvocation invocation) throws Throwable {
			ICareService iCareService = Context.getService(ICareService.class);
			if (invocation.getArguments()[0] instanceof User) {
				
				iCareService.savePasswordHistory((User) invocation.getArguments()[0],
				    invocation.getArguments()[2].toString());
			} else {
				
				iCareService.savePasswordHistory(null, invocation.getArguments()[1].toString());
			}
			
			return invocation.proceed();
		}
	}
}
