import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { X, Search } from 'lucide-react';
import '../../styles/modal.css';

interface TeacherAssignmentFormProps {
  courseId: string;
  onClose: () => void;
}

const TeacherAssignmentForm: React.FC<TeacherAssignmentFormProps> = ({ courseId, onClose }) => {
  const { courses, teachers, assignTeacher } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const course = courses.find(c => c.id === courseId);
  
  // Set the current teacher as selected by default
  useEffect(() => {
    if (course?.teacherId) {
      setSelectedTeacherId(course.teacherId);
    }
  }, [course]);
  
  // Filter teachers based on search term
  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.department.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!courseId || !selectedTeacherId) {
      return;
    }
    
    setIsSubmitting(true);
    
    assignTeacher(courseId, selectedTeacherId);
    
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 500);
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal scale-in">
        <div className="modal-header">
          <h2>Assign Teacher to Course</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        
        <div className="modal-content">
          {course && (
            <div className="course-info">
              <h3>{course.name}</h3>
              <p className="course-code">{course.code}</p>
              <p className="course-department">{course.department}</p>
            </div>
          )}
          
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="teacher-list">
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map(teacher => (
                  <div 
                    key={teacher.id} 
                    className={`teacher-item ${selectedTeacherId === teacher.id ? 'selected' : ''}`}
                    onClick={() => setSelectedTeacherId(teacher.id)}
                  >
                    <div className="teacher-radio">
                      <input
                        type="radio"
                        name="teacherId"
                        value={teacher.id}
                        checked={selectedTeacherId === teacher.id}
                        onChange={() => setSelectedTeacherId(teacher.id)}
                        id={`teacher-${teacher.id}`}
                      />
                      <label htmlFor={`teacher-${teacher.id}`}></label>
                    </div>
                    <div className="teacher-info">
                      <h4>{teacher.name}</h4>
                      <p>{teacher.department}</p>
                      <p className="teacher-designation">{teacher.designation}</p>
                    </div>
                    <div className="teacher-course-count">
                      {teacher.assignedCourses.length} course(s)
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-list">
                  <p>No teachers found matching your search criteria.</p>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting || !selectedTeacherId}
              >
                {isSubmitting ? 'Assigning...' : 'Assign Teacher'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherAssignmentForm;