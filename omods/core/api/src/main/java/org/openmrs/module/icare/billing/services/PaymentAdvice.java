package org.openmrs.module.icare.billing.services;

import org.aopalliance.aop.Advice;
import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.module.icare.core.Item;
import org.springframework.aop.Advisor;
import org.springframework.aop.support.StaticMethodMatcherPointcutAdvisor;

import java.lang.reflect.Method;

public abstract class PaymentAdvice extends StaticMethodMatcherPointcutAdvisor implements Advisor {
	
	private static final long serialVersionUID = 3333L;
	
	private final Log log = LogFactory.getLog(this.getClass());
	
	public boolean matches(Method method, Class targetClass) {
		// only 'run' this advice on the getter methods
		return method.getName().startsWith("validate");
	}
	
	abstract public String getUniquePaymentMethodName();
	
	abstract public Item validate();
	
	@Override
	public Advice getAdvice() {
		log.debug("Getting new around advice");
		return new PrintingAroundAdvice();
	}
	
	private class PrintingAroundAdvice implements MethodInterceptor {
		
		public Object invoke(MethodInvocation invocation) throws Throwable {
			
			log.info("Before " + invocation.getMethod().getName() + ".");
			
			log.info("After " + invocation.getMethod().getName() + ".");
			if (invocation.getMethod().getName().startsWith("validate")) {
				return PaymentAdvice.this.validate();
			} else {
				return invocation.proceed();
			}
		}
	}
	
}
