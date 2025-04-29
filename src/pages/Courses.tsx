import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash, 
  Users, 
  Filter,
  CheckCircle,
  XCircle,
  ArrowUpDown
} from 'lucide-react';
import CourseForm from '../components/courses/CourseForm';
import TeacherAssignmentForm from '../components/courses/TeacherAssignmentForm';
import DeleteConfirmation from '../components/shared/DeleteConfirmation';
import '../styles/Courses.css';

const Courses: React.FC = () => {
  const { courses, teachers, deleteCourse } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<string | null>(null);
  const [assigningTeacher, setAssigningTeacher] = useState<string | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending';
  } | null>(null);

  // Get all departments for filter dropdown
  const departments = Array.from(new Set(courses.map(course => course.department)));

  // Filter and sort courses
  let filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesDepartment = !filterDepartment || course.department === filterDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  // Apply sorting
  if (sortConfig) {
    filteredCourses.sort((a: any, b: any) => {
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

  const handleDeleteConfirm = () => {
    if (deletingCourse) {
      deleteCourse(deletingCourse);
      setDeletingCourse(null);
    }
  };

  return (
    <div className="courses-container fade-in">
      <div className="page-header">
        <h1>Course Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          <Plus size={16} />
          <span>Add Course</span>
        </button>
      </div>
      
      <div className="filters-container">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-box">
          <Filter size={16} />
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
      </div>
      
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => handleSort('code')}>
                <div className="th-content">
                  Course Code
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th onClick={() => handleSort('name')}>
                <div className="th-content">
                  Course Name
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th onClick={() => handleSort('department')}>
                <div className="th-content">
                  Department
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th onClick={() => handleSort('credits')}>
                <div className="th-content">
                  Credits
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th>Instructor</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length > 0 ? (
              filteredCourses.map(course => {
                const teacher = teachers.find(t => t.id === course.teacherId);
                
                return (
                  <tr key={course.id}>
                    <td>{course.code}</td>
                    <td>{course.name}</td>
                    <td>{course.department}</td>
                    <td>{course.credits}</td>
                    <td>
                      <div className="instructor-cell">
                        {teacher ? (
                          <>
                            <span>{teacher.name}</span>
                            <CheckCircle size={16} className="text-success" />
                          </>
                        ) : (
                          <>
                            <span className="text-muted">Not Assigned</span>
                            <XCircle size={16} className="text-muted" />
                          </>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button 
                          className="action-btn"
                          onClick={() => setAssigningTeacher(course.id)}
                          title="Assign Teacher"
                        >
                          <Users size={16} />
                        </button>
                        <button 
                          className="action-btn edit"
                          onClick={() => setEditingCourse(course.id)}
                          title="Edit Course"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="action-btn delete"
                          onClick={() => setDeletingCourse(course.id)}
                          title="Delete Course"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="empty-table">
                  No courses found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Add/Edit Course Form Modal */}
      {(showAddForm || editingCourse) && (
        <CourseForm
          courseId={editingCourse}
          onClose={() => {
            setShowAddForm(false);
            setEditingCourse(null);
          }}
        />
      )}
      
      {/* Teacher Assignment Modal */}
      {assigningTeacher && (
        <TeacherAssignmentForm
          courseId={assigningTeacher}
          onClose={() => setAssigningTeacher(null)}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      {deletingCourse && (
        <DeleteConfirmation
          title="Delete Course"
          message="Are you sure you want to delete this course? This action cannot be undone and will remove the course from all students and teachers."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingCourse(null)}
        />
      )}
    </div>
  );
};

export default Courses;