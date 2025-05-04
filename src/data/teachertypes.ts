// File: src/data/teachertypes.ts

export interface Teacher {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  phone: string;
  assignedCourses: string[];
  joiningDate: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  credits: number;
  department: string;
  teacherId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  department: string;
  enrolledCourses: string[];
  year: number;
  semester: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  type: string;
  createdAt: string;
}

export interface Mark {
  id: string;
  studentId: string;
  courseId: string;
  score: number;
  feedback?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}