import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash, 
  Filter,
  MapPin,
  Clock,
  Calendar as CalendarIcon
} from 'lucide-react';
import EventForm from '../components/events/EventForm';
import DeleteConfirmation from '../components/shared/DeleteConfirmation';
import { formatDate, formatDateRange } from '../utils/dateUtils';
import '../styles/Events.css';

const Events: React.FC = () => {
  const { events, deleteEvent } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'calendar'>('grid');

  // Get all event types for filter dropdown
  const eventTypes = Array.from(new Set(events.map(event => event.type)));

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType = !filterType || event.type === filterType;
    
    return matchesSearch && matchesType;
  });

  // Sort events by date
  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  // Group events by month and year
  const groupedEvents: Record<string, typeof events> = {};
  sortedEvents.forEach(event => {
    const date = new Date(event.startDate);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    
    if (!groupedEvents[key]) {
      groupedEvents[key] = [];
    }
    
    groupedEvents[key].push(event);
  });

  const handleDeleteConfirm = () => {
    if (deletingEvent) {
      deleteEvent(deletingEvent);
      setDeletingEvent(null);
    }
  };

  const getEventTypeClass = (type: string) => {
    switch (type) {
      case 'academic':
        return 'academic';
      case 'holiday':
        return 'holiday';
      case 'meeting':
        return 'meeting';
      default:
        return 'other';
    }
  };

  return (
    <div className="events-container fade-in">
      <div className="page-header">
        <h1>Upcoming Events</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          <Plus size={16} />
          <span>Add Event</span>
        </button>
      </div>
      
      <div className="filters-container">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-box">
          <Filter size={16} />
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="">All Event Types</option>
            {eventTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div className="view-toggle">
          <button 
            className={`toggle-btn ${view === 'grid' ? 'active' : ''}`}
            onClick={() => setView('grid')}
          >
            Grid
          </button>
          <button 
            className={`toggle-btn ${view === 'calendar' ? 'active' : ''}`}
            onClick={() => setView('calendar')}
          >
            Calendar
          </button>
        </div>
      </div>
      
      {view === 'grid' ? (
        <div className="events-grid">
          {Object.keys(groupedEvents).length > 0 ? (
            Object.keys(groupedEvents).map(key => {
              const [year, month] = key.split('-').map(Number);
              const monthDate = new Date(year, month);
              const monthName = monthDate.toLocaleString('default', { month: 'long' });
              
              return (
                <div key={key} className="month-group">
                  <h2 className="month-title">
                    {monthName} {year}
                  </h2>
                  <div className="events-list">
                    {groupedEvents[key].map(event => (
                      <div key={event.id} className="event-card card">
                        <div className={`event-type-indicator ${getEventTypeClass(event.type)}`}></div>
                        <div className="event-date">
                          <div className="date-day">
                            {new Date(event.startDate).getDate()}
                          </div>
                          <div className="date-month">
                            {new Date(event.startDate).toLocaleString('default', { month: 'short' })}
                          </div>
                        </div>
                        
                        <div className="event-content">
                          <div className="event-header">
                            <h3 className="event-title">{event.title}</h3>
                            <span className={`event-badge ${getEventTypeClass(event.type)}`}>
                              {event.type}
                            </span>
                          </div>
                          
                          <p className="event-description">{event.description}</p>
                          
                          <div className="event-details">
                            <div className="event-detail">
                              <CalendarIcon size={14} />
                              <span>{formatDateRange(event.startDate, event.endDate)}</span>
                            </div>
                            
                            <div className="event-detail">
                              <Clock size={14} />
                              <span>
                                {new Date(event.startDate).toLocaleTimeString('en-US', { 
                                  hour: '2-digit', 
                                  minute: '2-digit',
                                  hour12: true 
                                })}
                              </span>
                            </div>
                            
                            <div className="event-detail">
                              <MapPin size={14} />
                              <span>{event.location}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="event-actions">
                          <button 
                            className="action-btn edit"
                            onClick={() => setEditingEvent(event.id)}
                            title="Edit Event"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="action-btn delete"
                            onClick={() => setDeletingEvent(event.id)}
                            title="Delete Event"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-state">
              <h3>No events found</h3>
              <p>Try adjusting your search or add a new event</p>
            </div>
          )}
        </div>
      ) : (
        <div className="calendar-view">
          <div className="calendar-header">
            <div className="weekday">Sunday</div>
            <div className="weekday">Monday</div>
            <div className="weekday">Tuesday</div>
            <div className="weekday">Wednesday</div>
            <div className="weekday">Thursday</div>
            <div className="weekday">Friday</div>
            <div className="weekday">Saturday</div>
          </div>
          
          <div className="calendar-body">
            {/* Simplified calendar for demo purposes */}
            {Array.from({ length: 35 }).map((_, i) => {
              const day = i + 1;
              const dayEvents = sortedEvents.filter(event => 
                new Date(event.startDate).getDate() === day && 
                new Date(event.startDate).getMonth() === new Date().getMonth()
              );
              
              return (
                <div key={i} className={`calendar-day ${day === new Date().getDate() ? 'today' : ''}`}>
                  <div className="day-number">{day}</div>
                  <div className="day-events">
                    {dayEvents.map(event => (
                      <div 
                        key={event.id} 
                        className={`calendar-event ${getEventTypeClass(event.type)}`}
                        onClick={() => setEditingEvent(event.id)}
                      >
                        <span className="event-time">
                          {new Date(event.startDate).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: true 
                          })}
                        </span>
                        <span className="event-title-short">{event.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Add/Edit Event Form Modal */}
      {(showAddForm || editingEvent) && (
        <EventForm
          eventId={editingEvent}
          onClose={() => {
            setShowAddForm(false);
            setEditingEvent(null);
          }}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      {deletingEvent && (
        <DeleteConfirmation
          title="Delete Event"
          message="Are you sure you want to delete this event? This action cannot be undone."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingEvent(null)}
        />
      )}
    </div>
  );
};

export default Events;