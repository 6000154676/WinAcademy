-- WIN Academy SQL Schema
-- Make sure to create the database 'winacademy' before running this script:
-- CREATE DATABASE winacademy;

CREATE TABLE Admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_name VARCHAR(50) UNIQUE NOT NULL,
    monthly_fee DECIMAL(10,2) NOT NULL,
    admission_fee DECIMAL(10,2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    class_id INT NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    roll_number VARCHAR(50) UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES Classes(id)
);

CREATE TABLE Payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    class_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_type VARCHAR(50) NOT NULL, -- e.g., 'Admission', 'Monthly Tuition'
    payment_status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Completed', 'Failed'
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES Students(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES Classes(id)
);

CREATE TABLE Subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_name VARCHAR(100) NOT NULL,
    class_id INT NOT NULL,
    total_marks INT NOT NULL DEFAULT 100,
    passing_marks INT NOT NULL DEFAULT 30,
    FOREIGN KEY (class_id) REFERENCES Classes(id) ON DELETE CASCADE
);

CREATE TABLE Exams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exam_name VARCHAR(100) NOT NULL, -- e.g., 'Midterm 2023', 'Final 2023'
    exam_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Marks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    exam_id INT NOT NULL,
    marks_obtained DECIMAL(5,2) NOT NULL,
    UNIQUE(student_id, subject_id, exam_id),
    FOREIGN KEY (student_id) REFERENCES Students(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES Subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (exam_id) REFERENCES Exams(id) ON DELETE CASCADE
);
