package org.openmrs.module.icare.billing.services.payment.gepg;

import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.spec.*;
import java.util.Base64;

import org.openmrs.GlobalProperty;
import org.openmrs.api.AdministrationService;
import org.openmrs.api.context.Context;

public class SignatureUtils {
	
	public static String signData(String payload, String client64PrivateKey) throws Exception {
		AdministrationService administrationService = Context.getAdministrationService();
		// String clientPrivateKey = "MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAKcElMpG9OrSU3/ylY+ZrHa7jUCbI7jWjKeB+jqLM+tTGkfwLuQIe+fLWIRJfK6q53qLD4nMdhhRdVB4Eg6CDSxXxl8QxLkWPLFyJ2iU8f6iAgZUE1yx4pGv8g8RmXtAG05HnVXtbKeO/33hEzHtKt5gNQN3RmiZR7hbF5QGN545AgMBAAECgYAhrYPPMfWq8BRURXcxCJzFKFZ4Q5A1clXUZRou+ejTN+Ohw+XAp5FMkS1dJ3BTzDR2+ll8wNTDXJGaU0vYzxKWnfta6U+mRmtdwBxT/PqlVtMOU090VweeO9+j5SaJx5eXauKyK9lxb75dTSmRjh3PW8wbZiXDIcknZj6udeqEnQJBANcxSfqHa4EW8PldeLfQ7K7erxN6h/jfe2mjAPf/fU04JDifoavcEBM6E/Bc6slsHtEazzv/CAhn93CA0SgkHhsCQQDGsJyod57dqd12XaVfbo05PMX0rsRJMresCIHLDzGIoApWZMzn8DmzS4FjtM+j7AzNbqR3slzp0wrBIaTtIOo7AkBKKWhveOAp2vgtWHNUFiKbmY8IzX+y24Iyw8R/s4NBa4nAIfObwPmhRrC8c6lOxX5RXkXxTVE9ZGc4VIzAosHlAkA8sGGJi9A4wNPmfcAvoCL+4rNMg71s5lL39zk9/wwQQWIm9W8pQVU+kMea3vW1ijp23V7bON3shgv45f/sdmtVAkEAuLiFZ6ncUsIv7ydLXUWyhY6h2qtk12aFKGaHqkWLCDrqD4WCJffti/+NPwCJu+qTIgc6YUpJPjFfHw8ULsxQig==";
		String clientPrivateKey = client64PrivateKey;
		PrivateKey privateKey = getRsaPrivateKey(clientPrivateKey);
		Signature signature = Signature.getInstance("SHA256withRSA");
		signature.initSign(privateKey);
		signature.update(payload.getBytes());
		
		byte[] signedData = signature.sign();
		GlobalProperty globalProperty = new GlobalProperty();
		globalProperty.setProperty("gepg.signatureGeneratedL.icareConnect");
		globalProperty.setPropertyValue(Base64.getEncoder().encodeToString(signedData));
		administrationService.saveGlobalProperty(globalProperty);
		return Base64.getEncoder().encodeToString(signedData);
	}
	
	private static PrivateKey getRsaPrivateKey(String key) throws Exception {
		byte[] keyBytes = Base64.getDecoder().decode(key);
		PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
		KeyFactory keyFactory = KeyFactory.getInstance("RSA");
		return keyFactory.generatePrivate(spec);
	}
	
	public static boolean verifyData(String payload, String base64Signature, String publicKeyStr) throws Exception {
		AdministrationService administrationService = Context.getAdministrationService();
		PublicKey publicKey = getRsaPublicKey(publicKeyStr);
		Signature signature = Signature.getInstance("SHA256withRSA");
		signature.initVerify(publicKey);
		signature.update(payload.getBytes(StandardCharsets.UTF_8));
		
		byte[] signatureBytes = Base64.getDecoder().decode(base64Signature);
		GlobalProperty globalProperty = new GlobalProperty();
		globalProperty.setProperty("gepg.signatureGeneratedLength.icareConnect");
		globalProperty.setPropertyValue(String.valueOf(signatureBytes.length));
		administrationService.saveGlobalProperty(globalProperty);
		
		return signature.verify(signatureBytes);
	}
	
	private static PublicKey getRsaPublicKey(String key) throws Exception {
		byte[] keyBytes = Base64.getDecoder().decode(key);
		X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
		KeyFactory keyFactory = KeyFactory.getInstance("RSA");
		return keyFactory.generatePublic(spec);
	}
}
