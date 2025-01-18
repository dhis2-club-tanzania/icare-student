package org.openmrs.module.icare.core;

import java.util.HashMap;
import java.util.Map;

public class Pager implements JSONConverter {
	
	private int page;
	
	private int pageCount;
	
	private int total;
	
	private int pageSize;
	
	private boolean allowed;
	
	public void setAllowed(boolean allowed) {
		this.allowed = allowed;
	}
	
	public int getPage() {
		return page;
	}
	
	public void setPage(int page) {
		this.page = page;
	}
	
	public int getPageCount() {
		return (int) Math.ceil((double) total / pageSize);
	}
	
	public void setPageCount(int pageCount) {
		this.pageCount = pageCount;
	}
	
	public int getTotal() {
		return total;
	}
	
	public void setTotal(int total) {
		this.total = total;
	}
	
	public int getPageSize() {
		return pageSize;
	}
	
	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}
	
	public boolean isAllowed() {
		return allowed;
	}
	
	@Override
	public Map<String, Object> toMap() {
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("page", this.page);
		result.put("pageCount", this.getPageCount());
		result.put("total", this.total);
		result.put("pageSize", this.pageSize);
		return result;
	}
}
