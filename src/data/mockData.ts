import { Course, Teacher, Student, Event } from '../types';

export const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Introduction to Computer Science',
    code: 'CS101',
    description: 'Fundamental concepts of computer science including algorithms, data structures, and problem-solving.',
    credits: 3,
    department: 'Computer Science',
    teacherId: '1',
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-06-20T14:30:00Z'
  },
  {
    id: '2',
    name: 'Calculus I',
    code: 'MATH101',
    description: 'Introduction to differential and integral calculus of functions of one variable.',
    credits: 4,
    department: 'Mathematics',
    teacherId: '2',
    createdAt: '2023-01-10T09:00:00Z',
    updatedAt: '2023-05-25T11:45:00Z'
  },
  {
    id: '3',
    name: 'Physics for Engineers',
    code: 'PHYS201',
    description: 'Mechanics, thermodynamics, and waves with applications to engineering problems.',
    credits: 4,
    department: 'Physics',
    teacherId: '3',
    createdAt: '2023-01-12T11:30:00Z',
    updatedAt: '2023-06-15T10:15:00Z'
  },
  {
    id: '4',
    name: 'Data Structures and Algorithms',
    code: 'CS201',
    description: 'Advanced data structures and algorithms including trees, graphs, sorting, and searching.',
    credits: 3,
    department: 'Computer Science',
    teacherId: '1',
    createdAt: '2023-01-20T13:45:00Z',
    updatedAt: '2023-06-22T16:00:00Z'
  },
  {
    id: '5',
    name: 'Linear Algebra',
    code: 'MATH202',
    description: 'Vector spaces, linear transformations, matrices, and determinants.',
    credits: 3,
    department: 'Mathematics',
    teacherId: '2',
    createdAt: '2023-01-18T08:30:00Z',
    updatedAt: '2023-06-10T09:45:00Z'
  }
];

export const mockTeachers: Teacher[] = [
  {
    id: '1',
    name: 'Dr. John Smith',
    email: 'jsmith@university.edu',
    department: 'Computer Science',
    designation: 'Associate Professor',
    phone: '(555) 123-4567',
    assignedCourses: ['1', '4'],
    joiningDate: '2015-09-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Dr. Emily Johnson',
    email: 'ejohnson@university.edu',
    department: 'Mathematics',
    designation: 'Professor',
    phone: '(555) 234-5678',
    assignedCourses: ['2', '5'],
    joiningDate: '2010-08-15T00:00:00Z'
  },
  {
    id: '3',
    name: 'Dr. Michael Chen',
    email: 'mchen@university.edu',
    department: 'Physics',
    designation: 'Assistant Professor',
    phone: '(555) 345-6789',
    assignedCourses: ['3'],
    joiningDate: '2018-01-10T00:00:00Z'
  },
  {
    id: '4',
    name: 'Dr. Sarah Wilson',
    email: 'swilson@university.edu',
    department: 'Computer Science',
    designation: 'Lecturer',
    phone: '(555) 456-7890',
    assignedCourses: [],
    joiningDate: '2020-08-20T00:00:00Z'
  },
  {
    id: '5',
    name: 'Dr. Robert Martinez',
    email: 'rmartinez@university.edu',
    department: 'Mathematics',
    designation: 'Associate Professor',
    phone: '(555) 567-8901',
    assignedCourses: [],
    joiningDate: '2016-07-15T00:00:00Z'
  }
];

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Alice Brown',
    email: 'abrown@university.edu',
    rollNumber: 'CS2021001',
    department: 'Computer Science',
    enrolledCourses: ['1', '4', '5'],
    year: 2,
    semester: 3
  },
  {
    id: '2',
    name: 'Bob Miller',
    email: 'bmiller@university.edu',
    rollNumber: 'CS2021002',
    department: 'Computer Science',
    enrolledCourses: ['1', '2', '4'],
    year: 2,
    semester: 3
  },
  {
    id: '3',
    name: 'Charlie Davis',
    email: 'cdavis@university.edu',
    rollNumber: 'MATH2020005',
    department: 'Mathematics',
    enrolledCourses: ['2', '5'],
    year: 3,
    semester: 5
  },
  {
    id: '4',
    name: 'Diana Garcia',
    email: 'dgarcia@university.edu',
    rollNumber: 'PHYS2022008',
    department: 'Physics',
    enrolledCourses: ['2', '3'],
    year: 1,
    semester: 2
  },
  {
    id: '5',
    name: 'Ethan Wilson',
    email: 'ewilson@university.edu',
    rollNumber: 'CS2020015',
    department: 'Computer Science',
    enrolledCourses: ['1', '3', '4'],
    year: 3,
    semester: 6
  },
  {
    id: '6',
    name: 'Fiona Taylor',
    email: 'ftaylor@university.edu',
    rollNumber: 'MATH2021012',
    department: 'Mathematics',
    enrolledCourses: ['2', '5'],
    year: 2,
    semester: 4
  },
  {
    id: '7',
    name: 'George Martin',
    email: 'gmartin@university.edu',
    rollNumber: 'CS2022003',
    department: 'Computer Science',
    enrolledCourses: ['1', '4'],
    year: 1,
    semester: 1
  },
  {
    id: '8',
    name: 'Hannah Lee',
    email: 'hlee@university.edu',
    rollNumber: 'PHYS2021010',
    department: 'Physics',
    enrolledCourses: ['3', '5'],
    year: 2,
    semester: 3
  }
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'End of Semester Exams',
    description: 'Final examinations for all courses for the current semester.',
    startDate: '2023-12-10T00:00:00Z',
    endDate: '2023-12-20T00:00:00Z',
    location: 'University Examination Halls',
    type: 'academic',
    createdAt: '2023-09-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Winter Break',
    description: 'University closed for winter holidays.',
    startDate: '2023-12-22T00:00:00Z',
    endDate: '2024-01-05T00:00:00Z',
    location: 'University Campus',
    type: 'holiday',
    createdAt: '2023-09-20T11:30:00Z'
  },
  {
    id: '3',
    title: 'Faculty Meeting',
    description: 'Semester planning meeting for all faculty members.',
    startDate: '2023-11-25T14:00:00Z',
    endDate: '2023-11-25T16:00:00Z',
    location: 'Main Conference Hall',
    type: 'meeting',
    createdAt: '2023-10-30T09:45:00Z'
  },
  {
    id: '4',
    title: 'Course Registration',
    description: 'Registration period for the next semester courses.',
    startDate: '2024-01-08T00:00:00Z',
    endDate: '2024-01-15T00:00:00Z',
    location: 'Online Portal',
    type: 'academic',
    createdAt: '2023-11-01T13:20:00Z'
  },
  {
    id: '5',
    title: 'Technology Symposium',
    description: 'Annual technology showcase featuring student projects and industry speakers.',
    startDate: '2023-11-15T09:00:00Z',
    endDate: '2023-11-17T18:00:00Z',
    location: 'University Convention Center',
    type: 'other',
    createdAt: '2023-09-05T15:10:00Z'
  }
];