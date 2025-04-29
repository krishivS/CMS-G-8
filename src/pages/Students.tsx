import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Search, 
  Filter, 
  Check, 
  XCircle,
  ArrowUpDown,
  Save,
  Filter as FilterIcon
} from 'lucide-react';
import '../styles/Students.css';

const Students: React.FC = () => {
  const { students, courses, marks, updateMarks } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  const [editedMarks, setEditedMarks] = useState<Record<string, number>>({});
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending';
  } | null>(null);

  // Get unique departments
  const departments = Array.from(new Set(students.map(student => student.department)));

  // Filter students
  let filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesDepartment = !filterDepartment || student.department === filterDepartment;
    
    const matchesCourse = !filterCourse || student.enrolledCourses.includes(filterCourse);
    
    return matchesSearch && matchesDepartment && matchesCourse;
  });

  // Apply sorting
  if (sortConfig) {
    filteredStudents.sort((a: any, b: any) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }

  const handleSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig?.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getStudentMark = (studentId: string, courseId: string) => {
    const mark = marks.find(
      mark => mark.studentId === studentId && mark.courseId === courseId
    );
    return mark ? mark.marks : '-';
  };

  const toggleEditMode = (studentId: string, courseId: string) => {
    const key = `${studentId}-${courseId}`;
    
    if (editMode[key]) {
      // If we're exiting edit mode, save the marks
      if (key in editedMarks) {
        updateMarks(studentId, courseId, editedMarks[key]);
      }
    } else {
      // If we're entering edit mode, initialize with current value
      const currentMark = getStudentMark(studentId, courseId);
      if (currentMark !== '-') {
        setEditedMarks(prev => ({
          ...prev,
          [key]: currentMark as number
        }));
      }
    }
    
    setEditMode(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleMarksChange = (studentId: string, courseId: string, value: string) => {
    const key = `${studentId}-${courseId}`;
    const numValue = parseInt(value, 10);
    
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      setEditedMarks(prev => ({
        ...prev,
        [key]: numValue
      }));
    }
  };

  const handleSaveMarks = (studentId: string, courseId: string) => {
    const key = `${studentId}-${courseId}`;
    
    if (key in editedMarks) {
      updateMarks(studentId, courseId, editedMarks[key]);
      setEditMode(prev => ({
        ...prev,
        [key]: false
      }));
    }
  };

  return (
    <div className="students-container fade-in">
      <div className="page-header">
        <h1>Student Marks</h1>
      </div>
      
      <div className="filters-container">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filters">
          <div className="filter-box">
            <FilterIcon size={16} />
            <select 
              value={filterDepartment} 
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="filter-select"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-box">
            <Filter size={16} />
            <select 
              value={filterCourse} 
              onChange={(e) => setFilterCourse(e.target.value)}
              className="filter-select"
            >
              <option value="">All Courses</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="table-container">
        <table className="table marks-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('rollNumber')}>
                <div className="th-content">
                  Roll Number
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th onClick={() => handleSort('name')}>
                <div className="th-content">
                  Student Name
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th onClick={() => handleSort('department')}>
                <div className="th-content">
                  Department
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th onClick={() => handleSort('year')}>
                <div className="th-content">
                  Year
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th onClick={() => handleSort('semester')}>
                <div className="th-content">
                  Semester
                  <ArrowUpDown size={14} />
                </div>
              </th>
              {courses.map(course => (
                <th key={course.id} className="course-header">
                  <div className="course-code">{course.code}</div>
                  <div className="course-name">{course.name}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map(student => (
                <tr key={student.id}>
                  <td>{student.rollNumber}</td>
                  <td>{student.name}</td>
                  <td>{student.department}</td>
                  <td>{student.year}</td>
                  <td>{student.semester}</td>
                  {courses.map(course => {
                    const isEnrolled = student.enrolledCourses.includes(course.id);
                    const key = `${student.id}-${course.id}`;
                    const isEditing = editMode[key] || false;
                    
                    return (
                      <td 
                        key={course.id} 
                        className={`marks-cell ${isEnrolled ? '' : 'not-enrolled'}`}
                      >
                        {isEnrolled ? (
                          isEditing ? (
                            <div className="marks-edit">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={editedMarks[key] || ''}
                                onChange={(e) => handleMarksChange(student.id, course.id, e.target.value)}
                                className="marks-input"
                              />
                              <button 
                                className="save-btn"
                                onClick={() => handleSaveMarks(student.id, course.id)}
                                title="Save"
                              >
                                <Save size={14} />
                              </button>
                              <button 
                                className="cancel-btn"
                                onClick={() => toggleEditMode(student.id, course.id)}
                                title="Cancel"
                              >
                                <XCircle size={14} />
                              </button>
                            </div>
                          ) : (
                            <div 
                              className="marks-value" 
                              onClick={() => toggleEditMode(student.id, course.id)}
                              title="Click to edit"
                            >
                              {getStudentMark(student.id, course.id)}
                            </div>
                          )
                        ) : (
                          <span className="not-enrolled-text">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5 + courses.length} className="empty-table">
                  No students found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Students;