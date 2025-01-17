package org.openmrs.module.icare.core.models;

import org.openmrs.User;
import org.openmrs.api.context.Context;
import org.openmrs.module.icare.core.utils.Encryption;

import javax.persistence.*;
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "password_history")
public class PasswordHistory implements Serializable {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "password_history_id", unique = true, nullable = false)
	private Integer id;
	
	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	private User user;
	
	@Column(name = "password", nullable = true)
	private String password;
	
	@Column(name = "change_date", nullable = false)
	private Date changedDate;
	
	public Date getChangedDate() {
		return changedDate;
	}
	
	public void setChangedDate(Date changedDate) {
		this.changedDate = changedDate;
	}
	
	public User getUser() {
		return user;
	}
	
	public void setUser(User user) {
		this.user = user;
	}
	
	public Integer getId() {
		return id;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}
	
	public String getPassword() {
		return password;
	}
	
	public void setPassword(String password) throws Exception {
		String encryptedPassword = Encryption.encrypt(password);
		this.password = encryptedPassword;
	}
	
	public static PasswordHistory fromMap(Map<String, Object> passwordHistoryMap) throws Exception {
		
		PasswordHistory passwordHistory = new PasswordHistory();
		if (passwordHistoryMap.get("user") != null) {
			User user = Context.getUserService()
			        .getUserByUuid(((Map) passwordHistoryMap.get("user")).get("uuid").toString());
			passwordHistory.setUser(user);
		}
		
		if (passwordHistoryMap.get("password") != null) {
			String encryptedPassword = Encryption.encrypt(passwordHistoryMap.get("password").toString());
			passwordHistory.setPassword(encryptedPassword);
		}
		
		if (passwordHistoryMap.get("date") != null) {
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
			if (passwordHistoryMap.get("date").toString().length() == 10) {
				passwordHistory.setChangedDate(dateFormat.parse(passwordHistoryMap.get("date").toString()));
			} else {
				passwordHistory.setChangedDate(dateFormat.parse(passwordHistoryMap.get("date").toString()
				        .substring(0, passwordHistoryMap.get("date").toString().indexOf("T"))));
			}
		}
		
		return passwordHistory;
		
	}
	
	public Map<String, Object> toMap(){
        Map<String, Object> passwordHistoryMap = new HashMap<>();

        if(this.getUser() != null){
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("uuid",this.getUser().getUuid());
            userMap.put("name", this.getUser().getDisplayString());
            passwordHistoryMap.put("user",userMap);
        }

        if(this.getChangedDate() != null){
            passwordHistoryMap.put("date", this.getChangedDate());
        }

        return passwordHistoryMap;
    }
}
