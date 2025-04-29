import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash, 
  BookOpen,
  ArrowUpDown,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';
import TeacherForm from '../components/teachers/TeacherForm';
import DeleteConfirmation from '../components/shared/DeleteConfirmation';
import '../styles/Teachers.css';

const Teachers: React.FC = () => {
  const { teachers, courses, deleteTeacher } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<string | null>(null);
  const [deletingTeacher, setDeletingTeacher] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending';
  } | null>(null);

  // Filter and sort teachers
  let filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Apply sorting
  if (sortConfig) {
    filteredTeachers.sort((a: any, b: any) => {
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
    if (deletingTeacher) {
      deleteTeacher(deletingTeacher);
      setDeletingTeacher(null);
    }
  };

  const getAssignedCourses = (teacherId: string) => {
    return courses.filter(course => course.teacherId === teacherId);
  };

  return (
    <div className="teachers-container fade-in">
      <div className="page-header">
        <h1>Teacher Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          <Plus size={16} />
          <span>Add Teacher</span>
        </button>
      </div>
      
      <div className="search-box">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search teachers by name, email, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="teachers-grid">
        {filteredTeachers.length > 0 ? (
          filteredTeachers.map(teacher => {
            const assignedCourses = getAssignedCourses(teacher.id);
            
            return (
              <div key={teacher.id} className="teacher-card card">
                <div className="teacher-header">
                  <div className="teacher-avatar">
                    {teacher.name.charAt(0)}
                  </div>
                  <div className="teacher-info">
                    <h3 className="teacher-name">{teacher.name}</h3>
                    <p className="teacher-title">{teacher.designation}</p>
                  </div>
                  <div className="actions-dropdown">
                    <div className="dropdown-menu">
                      <button 
                        className="dropdown-item edit"
                        onClick={() => setEditingTeacher(teacher.id)}
                      >
                        <Edit size={14} />
                        <span>Edit</span>
                      </button>
                      <button 
                        className="dropdown-item delete"
                        onClick={() => setDeletingTeacher(teacher.id)}
                      >
                        <Trash size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="teacher-content">
                  <div className="teacher-detail">
                    <Mail size={16} />
                    <span>{teacher.email}</span>
                  </div>
                  <div className="teacher-detail">
                    <Phone size={16} />
                    <span>{teacher.phone}</span>
                  </div>
                  <div className="teacher-detail">
                    <BookOpen size={16} />
                    <span>{teacher.department}</span>
                  </div>
                  <div className="teacher-detail">
                    <Calendar size={16} />
                    <span>Joined {new Date(teacher.joiningDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="teacher-courses">
                  <h4 className="courses-title">
                    Assigned Courses ({assignedCourses.length})
                  </h4>
                  {assignedCourses.length > 0 ? (
                    <div className="courses-list">
                      {assignedCourses.map(course => (
                        <div key={course.id} className="course-tag">
                          <span className="course-code">{course.code}</span>
                          <span className="course-name">{course.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-courses">No courses assigned yet</p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state">
            <h3>No teachers found</h3>
            <p>Try adjusting your search or add a new teacher</p>
          </div>
        )}
      </div>
      
      {/* Add/Edit Teacher Form Modal */}
      {(showAddForm || editingTeacher) && (
        <TeacherForm
          teacherId={editingTeacher}
          onClose={() => {
            setShowAddForm(false);
            setEditingTeacher(null);
          }}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      {deletingTeacher && (
        <DeleteConfirmation
          title="Delete Teacher"
          message="Are you sure you want to delete this teacher? This action cannot be undone and will remove the teacher from all assigned courses."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingTeacher(null)}
        />
      )}
    </div>
  );
};

export default Teachers;