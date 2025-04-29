export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  credits: number;
  department: string;
  teacherId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  phone: string;
  assignedCourses: string[];
  joiningDate: string;
  specialization?: string;
  education?: string;
  status: 'active' | 'inactive';
  office?: string;
  officeHours?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  department: string;
  section: string;
  enrolledCourses: string[];
  year: number;
  semester: number;
  status: 'active' | 'inactive';
  guardianName?: string;
  guardianContact?: string;
  dateOfBirth?: string;
  address?: string;
}

export interface Mark {
  id: string;
  studentId: string;
  courseId: string;
  marks: number;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  type: 'academic' | 'holiday' | 'meeting' | 'other';
  createdAt: string;
}

export interface Settings {
  theme: 'light' | 'dark';
  notifications: boolean;
  emailNotifications: boolean;
  language: string;
  academicYear: string;
  semester: string;
  gradeScale: {
    A: number;
    B: number;
    C: number;
    D: number;
    F: number;
  };
}