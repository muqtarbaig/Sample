package com.employee;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class EmpData extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		System.out.println("Do Post");
		List<String> list = new ArrayList<String>();
		list.add("Emp1");
		list.add("Emp2");
		req.setAttribute("names", list);
		
		List<Employee> elist = new ArrayList<Employee>();
		Employee e1 = new Employee();
		e1.setId(1001);
		e1.setName("First emp");
		
		Employee e2 = new Employee();
		e2.setId(1002);
		e2.setName("Second emp");
		
		elist.add(e1);
		elist.add(e2);
		
		req.setAttribute("empList", elist);
		
		RequestDispatcher rd = req.getRequestDispatcher("second.jsp");
		rd.forward(req, resp);
		
		//resp.sendRedirect("second.jsp");
	}
	
}
