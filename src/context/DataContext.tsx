import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course, Teacher, Student, Event, Mark } from '../types';
import { mockCourses, mockTeachers, mockStudents, mockEvents } from '../data/mockData';
import { supabase } from '../utils/supabaseClient';



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
    const initialMarks: Mark[] = [];
    students.forEach(student => {
      student.enrolledCourses.forEach(courseId => {
        initialMarks.push({
          id: `${student.id}-${courseId}`,
          studentId: student.id,
          courseId: courseId,
          marks: Math.floor(Math.random() * 41) + 60, 
          updatedAt: new Date().toISOString()
        });
      });
    });
    setMarks(initialMarks);

    supabase.from('Teachers').select('*').then(({ data, error }) => {
      if (error) {
        console.error('Error fetching teachers:', error);
      } else {
        setTeachers(data);
      }
    });

    supabase.from('Courses').select('*').then(({ data, error }) => {
      if (error) {
        console.error('Error fetching courses:', error);
      } else {
        setCourses(data);
      }
    });
  }, [students]);






// COURSES addition Function
  const addCourse = (course: Course) => {
    setCourses([...courses, course]);
    console.log(course);
    
    supabase.from('Courses').insert(course).then(({ data, error }) => {
      if (error) {
        console.error('Error adding course:', error);
      } else {
        console.log('Course added:', data);
      }
    });
  };




// COURSES update Function
  const updateCourse = (courseId: string, updatedCourse: Partial<Course>) => {
    // Update in local state
    setCourses(courses.map(course => 
      course.id === courseId ? { ...course, ...updatedCourse } : course
    ));
  
    // Update in Supabase
    supabase
      .from('Courses')
      .update(updatedCourse)
      .eq('id', courseId)
      .then(({ error }) => {
        if (error) {
          console.error('Error updating course in Supabase:', error);
        } else {
          console.log('Course updated in Supabase');
        }
      });
  };
  



// COURSES delete Function
  const deleteCourse = (courseId: string) => {
    setCourses(courses.filter(course => course.id !== courseId));
    setTeachers(teachers.map(teacher => ({
      ...teacher,
      assignedCourses: teacher.assignedCourses.filter(id => id !== courseId)
    })));
    setStudents(students.map(student => ({
      ...student,
      enrolledCourses: student.enrolledCourses.filter(id => id !== courseId)
    })));
    setMarks(marks.filter(mark => mark.courseId !== courseId));
  
    supabase.from('Courses').delete().eq('id', courseId).then(({ error }) => {
      if (error) {
        console.error('Error deleting course from Supabase:', error);
      } else {
        console.log('Course deleted from Supabase');
      }
    });
  };
  








  const assignTeacher = (courseId: string, teacherId: string) => {
    // Unassign the course from any teacher that might have it
    const updatedTeachers = teachers.map(teacher => ({
      ...teacher,
      assignedCourses: teacher.assignedCourses.filter(id => id !== courseId)
    }));
  
    // Assign the course to the new teacher
    const finalTeachers = updatedTeachers.map(teacher =>
      teacher.id === teacherId
        ? { ...teacher, assignedCourses: [...teacher.assignedCourses, courseId] }
        : teacher
    );
    setTeachers(finalTeachers);
  
    // Update the course with the new teacher
    setCourses(courses.map(course =>
      course.id === courseId ? { ...course, teacherId } : course
    ));
  
    // Supabase: update the course with the new teacherId
    supabase
      .from('Courses')
      .update({ teacherId })
      .eq('id', courseId)
      .then(({ error }) => {
        if (error) {
          console.error('Error updating course with assigned teacher:', error);
        } else {
          console.log('Course updated with assigned teacher in Supabase');
        }
      });
  
    // Supabase: update the teacher's assignedCourses
    const newTeacher = finalTeachers.find(t => t.id === teacherId);
    if (newTeacher) {
      supabase
        .from('Teachers')
        .update({ assignedCourses: newTeacher.assignedCourses })
        .eq('id', teacherId)
        .then(({ error }) => {
          if (error) {
            console.error('Error updating teacher with assigned course:', error);
          } else {
            console.log('Teacher updated with assigned course in Supabase');
          }
        });
    }
  };
  




// TEACHERS addition Function
  const addTeacher = (teacher: Teacher) => {
    setTeachers([...teachers, teacher]);
  };



// TEACHERS update Function
  const updateTeacher = (teacherId: string, updatedTeacher: Partial<Teacher>) => {
    setTeachers(teachers.map(teacher => 
      teacher.id === teacherId ? { ...teacher, ...updatedTeacher } : teacher
    ));
  
    supabase
      .from('Teachers')
      .update(updatedTeacher)
      .eq('id', teacherId)
      .then(({ error }) => {
        if (error) {
          console.error('Error updating teacher in Supabase:', error);
        } else {
          console.log('Teacher updated in Supabase');
        }
      });
  };
  




// TEACHERS delete Function
  const deleteTeacher = (teacherId: string) => {
    setTeachers(teachers.filter(teacher => teacher.id !== teacherId));
    setCourses(courses.map(course =>
      course.teacherId === teacherId ? { ...course, teacherId: undefined } : course
    ));
  
    supabase.from('Teachers').delete().eq('id', teacherId).then(({ error }) => {
      if (error) {
        console.error('Error deleting teacher from Supabase:', error);
      } else {
        console.log('Teacher deleted from Supabase');
      }
    });
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