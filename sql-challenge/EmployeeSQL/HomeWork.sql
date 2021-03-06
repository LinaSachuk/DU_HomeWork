-- 1. List the following details of each employee: 
-- employee number, last name, first name, gender, and salary.

SELECT e.emp_no, e.last_name, e.first_name, e.gender, s.salary
FROM employees e
INNER JOIN salaries s
ON s.emp_no = e.emp_no;


-- 2. List employees who were hired in 1986.
SELECT * 
FROM employees
WHERE date_part('year', hire_date)= 1986;


-- 3. List the manager of each department with the following information:
-- department number, department name, the manager's employee number, 
-- last name, first name, and start and end employment dates.
SELECT  dm.dept_no, d.dept_name, dm.emp_no, e.last_name, e.first_name, dm.from_date, dm.to_date
FROM dept_manager dm
LEFT JOIN departments d
ON dm.dept_no = d.dept_no
LEFT JOIN employees e
ON e.emp_no = dm.emp_no;	


-- 4. List the department of each employee with the following information:
-- employee number, last name, first name, and department name.
SELECT de.emp_no, e.last_name, e.first_name, d.dept_name 
FROM dept_emp de
LEFT JOIN employees e
ON e.emp_no = de.emp_no
LEFT JOIN departments d
ON d.dept_no = de.dept_no


-- 5. List all employees whose first name is "Hercules" and last names begin with "B."
SELECT * 
FROM employees e
WHERE e.first_name = 'Hercules'
AND e.last_name LIKE 'B%'


-- 6. List all employees in the Sales department, including their employee number, 
-- last name, first name, and department name.
SELECT s.emp_no, e.last_name, e.first_name, s.dept_name 
FROM
	(SELECT *
	FROM dept_emp de 
	LEFT JOIN departments d
	ON de.dept_no = d.dept_no
	WHERE d.dept_name = 'Sales') s
LEFT JOIN employees e
ON s.emp_no = e.emp_no

-- different query for part 6
SELECT de.emp_no, e.last_name, e.first_name, d.dept_name 
FROM dept_emp de 
LEFT JOIN departments d
ON de.dept_no = d.dept_no
LEFT JOIN employees e
ON de.emp_no = e.emp_no
WHERE d.dept_name = 'Sales'


-- 7. List all employees in the Sales and Development departments,
-- including their employee number, last name, first name, and department name.
SELECT de.emp_no, e.last_name, e.first_name, d.dept_name 
FROM dept_emp de 
LEFT JOIN departments d
ON de.dept_no = d.dept_no
LEFT JOIN employees e
ON de.emp_no = e.emp_no
WHERE d.dept_name  IN ('Sales' , 'Development')


-- 8. In descending order, list the frequency count of employee last names, i.e., 
-- how many employees share each last name.
SELECT last_name,
COUNT(last_name) last_name_frequency_count
FROM employees 
GROUP BY last_name
ORDER BY
COUNT(last_name) DESC;





	
	
	
	
	
	