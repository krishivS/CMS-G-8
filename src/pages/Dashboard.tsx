import React from 'react';
import { useData } from '../context/DataContext';
import { 
  BookOpen, 
  Users, 
  GraduationCap, 
  Calendar, 
  BarChart3, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const { courses, teachers, students, events, marks } = useData();
  
  // Calculate stats
  const totalCourses = courses.length;
  const totalTeachers = teachers.length;
  const totalStudents = students.length;
  const upcomingEvents = events.filter(event => new Date(event.startDate) > new Date()).length;
  
  // Calculate department statistics
  const departmentStats = students.reduce((acc, student) => {
    if (!acc[student.department]) {
      acc[student.department] = {
        count: 0,
        totalMarks: 0,
        markCount: 0
      };
    }
    acc[student.department].count++;
    
    // Calculate average marks for this student
    const studentMarks = marks.filter(mark => mark.studentId === student.id);
    studentMarks.forEach(mark => {
      acc[student.department].totalMarks += mark.marks;
      acc[student.department].markCount++;
    });
    
    return acc;
  }, {} as Record<string, { count: number; totalMarks: number; markCount: number }>);
  
  // Get top performing departments
  const departmentPerformance = Object.entries(departmentStats)
    .map(([dept, stats]) => ({
      department: dept,
      average: stats.markCount > 0 ? stats.totalMarks / stats.markCount : 0,
      studentCount: stats.count
    }))
    .sort((a, b) => b.average - a.average);
  
  // Calculate course enrollment statistics
  const courseEnrollments = courses.map(course => ({
    code: course.code,
    name: course.name,
    count: students.filter(student => student.enrolledCourses.includes(course.id)).length
  })).sort((a, b) => b.count - a.count);
  
  // Get upcoming events
  const sortedEvents = [...events]
    .filter(event => new Date(event.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 3);
  
  // Get recent course activities
  const recentCourses = [...courses]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="dashboard fade-in">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <BookOpen size={24} />
          </div>
          <div className="stat-content">
            <h3>{totalCourses}</h3>
            <p>Total Courses</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>{totalTeachers}</h3>
            <p>Faculty Members</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <GraduationCap size={24} />
          </div>
          <div className="stat-content">
            <h3>{totalStudents}</h3>
            <p>Students</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <h3>{upcomingEvents}</h3>
            <p>Upcoming Events</p>
          </div>
        </div>
      </div>
      
      <div className="dashboard-grid">
        <div className="card dashboard-card">
          <div className="card-header">
            <h2 className="card-title">Academic Analytics</h2>
          </div>
          <div className="card-body">
            <div className="analytics-container">
              <div className="analytics-section">
                <h3 className="section-title">
                  <BarChart3 size={18} />
                  <span>Department Performance</span>
                </h3>
                <div className="department-stats">
                  {departmentPerformance.map((dept, index) => (
                    <div key={dept.department} className="department-stat-item">
                      <div className="department-info">
                        <span className="department-name">{dept.department}</span>
                        <span className="student-count">{dept.studentCount} students</span>
                      </div>
                      <div className="stat-bar-container">
                        <div 
                          className="stat-bar-fill"
                          style={{ width: `${(dept.average / 100) * 100}%` }}
                        ></div>
                      </div>
                      <span className="average-score">{dept.average.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="analytics-section">
                <h3 className="section-title">
                  <Users size={18} />
                  <span>Course Enrollment</span>
                </h3>
                <div className="enrollment-stats">
                  {courseEnrollments.slice(0, 5).map(course => (
                    <div key={course.code} className="enrollment-stat-item">
                      <div className="course-info">
                        <span className="course-code">{course.code}</span>
                        <span className="course-name">{course.name}</span>
                      </div>
                      <div className="enrollment-bar-container">
                        <div 
                          className="enrollment-bar-fill"
                          style={{ width: `${(course.count / totalStudents) * 100}%` }}
                        ></div>
                      </div>
                      <span className="enrollment-count">{course.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card dashboard-card">
          <div className="card-header">
            <h2 className="card-title">Upcoming Events</h2>
          </div>
          <div className="card-body">
            {sortedEvents.length > 0 ? (
              <div className="events-list">
                {sortedEvents.map(event => (
                  <div key={event.id} className="event-item">
                    <div className="event-date">
                      <div className="event-month">
                        {new Date(event.startDate).toLocaleString('default', { month: 'short' })}
                      </div>
                      <div className="event-day">
                        {new Date(event.startDate).getDate()}
                      </div>
                    </div>
                    <div className="event-details">
                      <h4 className="event-title">{event.title}</h4>
                      <p className="event-time">
                        <Clock size={14} />
                        <span>
                          {new Date(event.startDate).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: true 
                          })}
                        </span>
                      </p>
                      <p className="event-location">{event.location}</p>
                    </div>
                    <div className={`event-badge ${event.type}`}>
                      {event.type}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <AlertCircle size={24} />
                <p>No upcoming events scheduled</p>
              </div>
            )}
          </div>
          <div className="card-footer">
            <button className="btn btn-outline">View All Events</button>
          </div>
        </div>
      </div>
      
      <div className="card recent-activity">
        <div className="card-header">
          <h2 className="card-title">Recent Course Updates</h2>
        </div>
        <div className="card-body">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Department</th>
                  <th>Instructor</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {recentCourses.map(course => {
                  const teacher = teachers.find(t => t.id === course.teacherId);
                  
                  return (
                    <tr key={course.id}>
                      <td>{course.code}</td>
                      <td>{course.name}</td>
                      <td>{course.department}</td>
                      <td>{teacher ? teacher.name : 'Not Assigned'}</td>
                      <td>{formatDate(course.updatedAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer">
          <button className="btn btn-outline">View All Courses</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;