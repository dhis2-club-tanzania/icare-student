package org.openmrs.module.icare.core.utils;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class Encryption {
	
	private static final String ALGORITHM = "AES";
	
	private static final String TRANSFORMATION = "AES/ECB/PKCS5Padding";
	
	private static final String ENCRYPTION_KEY = "fTjWnZr4u7x!A%D*F-JaNdRgUkXp2s5v"; //256 bits
	
	public static String encrypt(String plainText) throws Exception {
		SecretKeySpec keySpec = new SecretKeySpec(ENCRYPTION_KEY.getBytes(), ALGORITHM);
		Cipher cipher = Cipher.getInstance(TRANSFORMATION);
		cipher.init(Cipher.ENCRYPT_MODE, keySpec);
		
		byte[] encryptedBytes = cipher.doFinal(plainText.getBytes());
		
		return Base64.getEncoder().encodeToString(encryptedBytes);
	}
	
	public static String decrypt(String encryptedText) throws Exception {
		SecretKeySpec keySpec = new SecretKeySpec(ENCRYPTION_KEY.getBytes(), ALGORITHM);
		Cipher cipher = Cipher.getInstance(TRANSFORMATION);
		cipher.init(Cipher.DECRYPT_MODE, keySpec);
		
		byte[] encryptedBytes = Base64.getDecoder().decode(encryptedText);
		byte[] decryptedBytes = cipher.doFinal(encryptedBytes);
		
		return new String(decryptedBytes);
	}
}
