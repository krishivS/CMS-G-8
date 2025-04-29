import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course, Teacher, Student, Event, Mark } from '../types';
import { mockCourses, mockTeachers, mockStudents, mockEvents } from '../data/mockData';

interface DataContextType {
  courses: Course[];
  teachers: Teacher[];
  students: Student[];
  events: Event[];
  marks: Mark[];
  addCourse: (course: Course) => void;
  updateCourse: (courseId: string, course: Partial<Course>) => void;
  deleteCourse: (courseId: string) => void;
  assignTeacher: (courseId: string, teacherId: string) => void;
  addTeacher: (teacher: Teacher) => void;
  updateTeacher: (teacherId: string, teacher: Partial<Teacher>) => void;
  deleteTeacher: (teacherId: string) => void;
  updateMarks: (studentId: string, courseId: string, marks: number) => void;
  addEvent: (event: Event) => void;
  updateEvent: (eventId: string, event: Partial<Event>) => void;
  deleteEvent: (eventId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [marks, setMarks] = useState<Mark[]>([]);

  useEffect(() => {
    // Initialize marks based on students and their enrolled courses
    const initialMarks: Mark[] = [];
    students.forEach(student => {
      student.enrolledCourses.forEach(courseId => {
        initialMarks.push({
          id: `${student.id}-${courseId}`,
          studentId: student.id,
          courseId: courseId,
          marks: Math.floor(Math.random() * 41) + 60, // Random marks between 60-100
          updatedAt: new Date().toISOString()
        });
      });
    });
    setMarks(initialMarks);
  }, [students]);

  const addCourse = (course: Course) => {
    setCourses([...courses, course]);
  };

  const updateCourse = (courseId: string, updatedCourse: Partial<Course>) => {
    setCourses(courses.map(course => 
      course.id === courseId ? { ...course, ...updatedCourse } : course
    ));
  };

  const deleteCourse = (courseId: string) => {
    setCourses(courses.filter(course => course.id !== courseId));
    // Also remove the course from teachers and students
    setTeachers(teachers.map(teacher => ({
      ...teacher,
      assignedCourses: teacher.assignedCourses.filter(id => id !== courseId)
    })));
    setStudents(students.map(student => ({
      ...student,
      enrolledCourses: student.enrolledCourses.filter(id => id !== courseId)
    })));
    // Remove related marks
    setMarks(marks.filter(mark => mark.courseId !== courseId));
  };

  const assignTeacher = (courseId: string, teacherId: string) => {
    // Unassign the course from any teacher that might have it
    setTeachers(teachers.map(teacher => ({
      ...teacher,
      assignedCourses: teacher.assignedCourses.filter(id => id !== courseId)
    })));
    
    // Assign the course to the new teacher
    setTeachers(teachers.map(teacher => 
      teacher.id === teacherId 
        ? { ...teacher, assignedCourses: [...teacher.assignedCourses, courseId] } 
        : teacher
    ));
    
    // Update the course with the new teacher
    setCourses(courses.map(course => 
      course.id === courseId ? { ...course, teacherId } : course
    ));
  };

  const addTeacher = (teacher: Teacher) => {
    setTeachers([...teachers, teacher]);
  };

  const updateTeacher = (teacherId: string, updatedTeacher: Partial<Teacher>) => {
    setTeachers(teachers.map(teacher => 
      teacher.id === teacherId ? { ...teacher, ...updatedTeacher } : teacher
    ));
  };

  const deleteTeacher = (teacherId: string) => {
    setTeachers(teachers.filter(teacher => teacher.id !== teacherId));
    // Unassign the teacher from courses
    setCourses(courses.map(course => 
      course.teacherId === teacherId ? { ...course, teacherId: undefined } : course
    ));
  };

  const updateMarks = (studentId: string, courseId: string, updatedMarks: number) => {
    const markIndex = marks.findIndex(
      mark => mark.studentId === studentId && mark.courseId === courseId
    );
    
    if (markIndex !== -1) {
      const updatedMark = {
        ...marks[markIndex],
        marks: updatedMarks,
        updatedAt: new Date().toISOString()
      };
      
      setMarks([
        ...marks.slice(0, markIndex),
        updatedMark,
        ...marks.slice(markIndex + 1)
      ]);
    } else {
      // If no mark exists, create a new one
      const newMark: Mark = {
        id: `${studentId}-${courseId}`,
        studentId,
        courseId,
        marks: updatedMarks,
        updatedAt: new Date().toISOString()
      };
      setMarks([...marks, newMark]);
    }
  };

  const addEvent = (event: Event) => {
    setEvents([...events, event]);
  };

  const updateEvent = (eventId: string, updatedEvent: Partial<Event>) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, ...updatedEvent } : event
    ));
  };

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  return (
    <DataContext.Provider value={{
      courses,
      teachers,
      students,
      events,
      marks,
      addCourse,
      updateCourse,
      deleteCourse,
      assignTeacher,
      addTeacher,
      updateTeacher,
      deleteTeacher,
      updateMarks,
      addEvent,
      updateEvent,
      deleteEvent
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};