package com.employee;

import java.util.Map;

import org.apache.struts2.dispatcher.SessionMap;
import org.apache.struts2.interceptor.SessionAware;

public class Employee implements SessionAware {

	String id;
	String name;
	SessionMap<String, Object> sessionMap ;
	
	String salary;
	
	public String getSalary() {
		return salary;
	}
	public void setSalary(String salary) {
		this.salary = salary;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	public String execute(){
		System.out.println("Employee object");
		System.out.println(this.getName());
	
		try{
		if(this.getId().equals(this.getName())){
			sessionMap.put("login", "true");
		this.setSalary("2000");
		return "success";
		}
		}catch(Exception ex){
			return "invalid";
		}
		return "failure";
	}
	@Override
	public void setSession(Map<String, Object> arg0) {
		sessionMap = (SessionMap<String, Object>) arg0;
	}
	
	public String logout(){
		sessionMap.invalidate();
		return "success";
	}
}
