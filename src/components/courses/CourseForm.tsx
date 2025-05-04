import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { X } from 'lucide-react';
import '../../styles/modal.css';
import { v4 as uuidv4 } from 'uuid';
interface CourseFormProps {
  courseId: string | null;
  onClose: () => void;
}

const CourseForm: React.FC<CourseFormProps> = ({ courseId, onClose }) => {
  const { courses, addCourse, updateCourse } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const initialFormState = {
    id: uuidv4(),
    name: '',
    code: '',
    description: '',
    credits: 3,
    department: '',
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // If editing existing course, load data
  useEffect(() => {
    if (courseId) {
      const course = courses.find(c => c.id === courseId);
      if (course) {
        setFormData({
          id: course.id,
          name: course.name,
          code: course.code,
          description: course.description,
          credits: course.credits,
          department: course.department,
        });
      }
    }
  }, [courseId, courses]);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Course name is required';
    }
    
    if (!formData.code.trim()) {
      newErrors.code = 'Course code is required';
    } else if (
      !courseId && // Only check for duplicates when adding new course
      courses.some(course => course.code.toLowerCase() === formData.code.toLowerCase())
    ) {
      newErrors.code = 'This course code already exists';
    }
    
    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }
    
    if (formData.credits < 1) {
      newErrors.credits = 'Credits must be at least 1';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'credits' ? parseInt(value) : value,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    if (courseId) {
      // Update existing course
      updateCourse(courseId, {
        ...formData,
        updatedAt: new Date().toISOString(),
      });
    } else {
      // Add new course
      addCourse({
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 500);
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal scale-in">
        <div className="modal-header">
          <h2>{courseId ? 'Edit Course' : 'Add New Course'}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="code" className="form-label">Course Code</label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className={`form-control ${errors.code ? 'error' : ''}`}
                placeholder="e.g., CS101"
              />
              {errors.code && <p className="error-message">{errors.code}</p>}
            </div>
            
            <div className="form-group">
              <label htmlFor="credits" className="form-label">Credits</label>
              <input
                type="number"
                id="credits"
                name="credits"
                value={formData.credits}
                onChange={handleChange}
                className={`form-control ${errors.credits ? 'error' : ''}`}
                min="1"
                max="6"
              />
              {errors.credits && <p className="error-message">{errors.credits}</p>}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="name" className="form-label">Course Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-control ${errors.name ? 'error' : ''}`}
              placeholder="e.g., Introduction to Computer Science"
            />
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="department" className="form-label">Department</label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`form-control ${errors.department ? 'error' : ''}`}
              placeholder="e.g., Computer Science"
            />
            {errors.department && <p className="error-message">{errors.department}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              rows={4}
              placeholder="Enter course description..."
            ></textarea>
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
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : courseId ? 'Update Course' : 'Add Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;