import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { X } from 'lucide-react';
import '../../styles/modal.css';

interface TeacherFormProps {
  teacherId: string | null;
  onClose: () => void;
}

const TeacherForm: React.FC<TeacherFormProps> = ({ teacherId, onClose }) => {
  const { teachers, addTeacher, updateTeacher } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const initialFormState = {
    name: '',
    email: '',
    department: '',
    designation: '',
    phone: '',
    joiningDate: new Date().toISOString().split('T')[0]
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // If editing existing teacher, load data
  useEffect(() => {
    if (teacherId) {
      const teacher = teachers.find(t => t.id === teacherId);
      if (teacher) {
        setFormData({
          name: teacher.name,
          email: teacher.email,
          department: teacher.department,
          designation: teacher.designation,
          phone: teacher.phone,
          joiningDate: new Date(teacher.joiningDate).toISOString().split('T')[0]
        });
      }
    }
  }, [teacherId, teachers]);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    } else if (
      !teacherId && // Only check for duplicates when adding new teacher
      teachers.some(teacher => teacher.email.toLowerCase() === formData.email.toLowerCase())
    ) {
      newErrors.email = 'A teacher with this email already exists';
    }
    
    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }
    
    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.joiningDate) {
      newErrors.joiningDate = 'Joining date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    if (teacherId) {
      // Update existing teacher
      updateTeacher(teacherId, formData);
    } else {
      // Add new teacher
      addTeacher({
        id: crypto.randomUUID(),
        ...formData,
        assignedCourses: [],
        joiningDate: new Date(formData.joiningDate).toISOString()
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
          <h2>{teacherId ? 'Edit Teacher' : 'Add New Teacher'}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-control ${errors.name ? 'error' : ''}`}
                placeholder="John Smith"
              />
              {errors.name && <p className="error-message">{errors.name}</p>}
            </div>
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-control ${errors.email ? 'error' : ''}`}
                placeholder="jsmith@university.edu"
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="department" className="form-label">Department</label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={`form-control ${errors.department ? 'error' : ''}`}
                placeholder="Computer Science"
              />
              {errors.department && <p className="error-message">{errors.department}</p>}
            </div>
            
            <div className="form-group">
              <label htmlFor="designation" className="form-label">Designation</label>
              <input
                type="text"
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className={`form-control ${errors.designation ? 'error' : ''}`}
                placeholder="Associate Professor"
              />
              {errors.designation && <p className="error-message">{errors.designation}</p>}
            </div>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`form-control ${errors.phone ? 'error' : ''}`}
                placeholder="(555) 123-4567"
              />
              {errors.phone && <p className="error-message">{errors.phone}</p>}
            </div>
            
            <div className="form-group">
              <label htmlFor="joiningDate" className="form-label">Joining Date</label>
              <input
                type="date"
                id="joiningDate"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                className={`form-control ${errors.joiningDate ? 'error' : ''}`}
              />
              {errors.joiningDate && <p className="error-message">{errors.joiningDate}</p>}
            </div>
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
              {isSubmitting ? 'Saving...' : teacherId ? 'Update Teacher' : 'Add Teacher'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherForm;