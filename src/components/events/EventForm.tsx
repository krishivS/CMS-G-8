import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { X } from 'lucide-react';
import '../../styles/modal.css';

interface EventFormProps {
  eventId: string | null;
  onClose: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ eventId, onClose }) => {
  const { events, addEvent, updateEvent } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const initialFormState = {
    title: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endDate: new Date().toISOString().split('T')[0],
    endTime: '10:00',
    location: '',
    type: 'academic',
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // If editing existing event, load data
  useEffect(() => {
    if (eventId) {
      const event = events.find(e => e.id === eventId);
      if (event) {
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);
        
        setFormData({
          title: event.title,
          description: event.description,
          startDate: startDate.toISOString().split('T')[0],
          startTime: startDate.toLocaleTimeString('en-GB', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          }),
          endDate: endDate.toISOString().split('T')[0],
          endTime: endDate.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }),
          location: event.location,
          type: event.type,
        });
      }
    }
  }, [eventId, events]);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    
    if (new Date(`${formData.endDate}T${formData.endTime}`) < new Date(`${formData.startDate}T${formData.startTime}`)) {
      newErrors.endDate = 'End date/time must be after start date/time';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    
    // Combine date and time
    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
    
    if (eventId) {
      // Update existing event
      updateEvent(eventId, {
        title: formData.title,
        description: formData.description,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        location: formData.location,
        type: formData.type as 'academic' | 'holiday' | 'meeting' | 'other',
      });
    } else {
      // Add new event
      addEvent({
        id: crypto.randomUUID(),
        title: formData.title,
        description: formData.description,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        location: formData.location,
        type: formData.type as 'academic' | 'holiday' | 'meeting' | 'other',
        createdAt: new Date().toISOString(),
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
          <h2>{eventId ? 'Edit Event' : 'Add New Event'}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title" className="form-label">Event Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`form-control ${errors.title ? 'error' : ''}`}
              placeholder="e.g., End of Semester Examination"
            />
            {errors.title && <p className="error-message">{errors.title}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="type" className="form-label">Event Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="form-control"
            >
              <option value="academic">Academic</option>
              <option value="holiday">Holiday</option>
              <option value="meeting">Meeting</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="startDate" className="form-label">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`form-control ${errors.startDate ? 'error' : ''}`}
              />
              {errors.startDate && <p className="error-message">{errors.startDate}</p>}
            </div>
            
            <div className="form-group">
              <label htmlFor="startTime" className="form-label">Start Time</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="endDate" className="form-label">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`form-control ${errors.endDate ? 'error' : ''}`}
              />
              {errors.endDate && <p className="error-message">{errors.endDate}</p>}
            </div>
            
            <div className="form-group">
              <label htmlFor="endTime" className="form-label">End Time</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="location" className="form-label">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`form-control ${errors.location ? 'error' : ''}`}
              placeholder="e.g., Main Conference Hall"
            />
            {errors.location && <p className="error-message">{errors.location}</p>}
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
              placeholder="Enter event description..."
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
              {isSubmitting ? 'Saving...' : eventId ? 'Update Event' : 'Add Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;