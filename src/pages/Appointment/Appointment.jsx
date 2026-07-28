import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../../styles/pages.css';
import { bookAppointment } from '../../services/appointmentService';
import { fetchProperties } from '../../services/propertyService';
import { featuredProperties as propertySeed } from '../../data/featuredProperties';
import { showToast } from '../../utils/featureState';

const getTodayString = () => new Date().toISOString().split('T')[0];

const formatAppointmentDate = (value) => {
  if (!value) return 'Pending confirmation';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Pending confirmation';
  return parsed.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const timeSlots = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM'];

const buildAppointmentDate = (date, slot) => {
  const [, hourPart, minutePart, period] = slot.match(/^(\d{1,2}):(\d{2})\s(AM|PM)$/) || [];
  let hour = Number(hourPart || 9);
  const minute = Number(minutePart || 0);

  if (period === 'PM' && hour !== 12) {
    hour += 12;
  }
  if (period === 'AM' && hour === 12) {
    hour = 0;
  }

  const nextDate = new Date(`${date}T00:00:00`);
  nextDate.setHours(hour, minute, 0, 0);
  return nextDate.toISOString();
};

export default function Appointment() {
  const shouldReduceMotion = useReducedMotion();
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get('propertyId') || '';
  const { user } = useSelector((state) => state.auth);

  const [properties, setProperties] = useState([]);
  const [loadingProps, setLoadingProps] = useState(true);
  const [form, setForm] = useState({
    date: '',
    timeSlot: '9:00 AM',
    propertyId: preselectedId,
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState(null);

  useEffect(() => {
    fetchProperties()
      .then((data) => setProperties(data.length > 0 ? data : propertySeed))
      .catch(() => setProperties(propertySeed))
      .finally(() => setLoadingProps(false));
  }, []);

  // Pre-select property when list loads if id was in query string
  useEffect(() => {
    if (preselectedId) {
      setForm((f) => ({ ...f, propertyId: preselectedId }));
    }
  }, [preselectedId]);

  const validate = () => {
    const errs = {};
    if (!form.propertyId) errs.propertyId = 'Please select a property.';
    if (!form.date) errs.date = 'Please choose a date.';
    else if (form.date < getTodayString()) errs.date = 'Date must be today or in the future.';
    if (!form.timeSlot) errs.timeSlot = 'Please select a time slot.';
    return errs;
  };

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) {
      setErrors((e) => ({ ...e, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    if (!user) {
      showToast('Please sign in to book an appointment.', 'error');
      return;
    }

    const payload = {
      date: buildAppointmentDate(form.date, form.timeSlot),
      property: form.propertyId,
      user: user.id || user._id,
      notes: form.notes,
    };

    setSubmitting(true);
    try {
      const response = await bookAppointment(payload);
      const appointment = response?.appointment || response;
      setBookedAppointment(appointment);
      setSuccess(true);
      showToast('Appointment booked successfully! The agent will contact you shortly.', 'success');
    } catch (err) {
      showToast(err?.response?.data?.message || 'Unable to book appointment. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedProperty = properties.find((p) => p.id === form.propertyId);

  return (
    <div className="page-shell">
      <main className="page-content">
        <motion.section
          className="page-head"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div>
            <p className="breadcrumb">
              <Link to="/">Home</Link> / <Link to="/properties">Properties</Link> / Appointment
            </p>
            <h1>Book an Appointment</h1>
            <p>Select a property, pick a date and time, and an agent will confirm your tour within 24 hours.</p>
          </div>
        </motion.section>

        {success ? (
          <motion.div
            className="card-panel"
            style={{ textAlign: 'center', padding: '3rem 2rem', maxWidth: '520px', margin: '2rem auto' }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ marginBottom: '0.5rem' }}>Appointment Confirmed</h2>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
              Your visit has been scheduled. Our agent will reach out to confirm details within 24 hours.
            </p>
            {bookedAppointment && (
              <div style={{ textAlign: 'left', margin: '1.5rem 0', padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: '14px' }}>
                <p style={{ margin: '0 0 0.5rem' }}><strong>Property:</strong> {bookedAppointment.property?.title || bookedAppointment.property?.name || selectedProperty?.title || selectedProperty?.name || 'Selected property'}</p>
                <p style={{ margin: '0 0 0.5rem' }}><strong>Date:</strong> {formatAppointmentDate(bookedAppointment.date)}</p>
                {bookedAppointment.notes ? <p style={{ margin: '0 0 0.5rem' }}><strong>Notes:</strong> {bookedAppointment.notes}</p> : null}
                <p style={{ margin: 0 }}><strong>Status:</strong> {bookedAppointment.status || 'Pending'}</p>
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/profile" className="button button-primary">View My Appointments</Link>
              <button
                type="button"
                className="button button-secondary"
                onClick={() => {
                  setSuccess(false);
                  setBookedAppointment(null);
                  setForm({ date: '', timeSlot: '9:00 AM', propertyId: '', notes: '' });
                  setErrors({});
                }}
              >
                Book Another
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="appointment-grid"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <form className="card-panel appointment-form" onSubmit={handleSubmit} noValidate>
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Appointment Details</h2>

              {/* Property selection */}
              <div className="form-field">
                <label htmlFor="appt-property">Select Property *</label>
                {loadingProps ? (
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Loading properties…</p>
                ) : (
                  <select
                    id="appt-property"
                    value={form.propertyId}
                    onChange={(e) => handleChange('propertyId', e.target.value)}
                    className={errors.propertyId ? 'input-invalid' : form.propertyId ? 'input-valid' : ''}
                  >
                    <option value="">— Choose a property —</option>
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} — {typeof p.location === 'object' ? `${p.location.city}, ${p.location.state}` : p.location}
                      </option>
                    ))}
                  </select>
                )}
                {errors.propertyId && <span className="field-error">{errors.propertyId}</span>}
              </div>

              {/* Date */}
              <div className="form-field">
                <label htmlFor="appt-date">Preferred Date *</label>
                <input
                  id="appt-date"
                  type="date"
                  min={getTodayString()}
                  value={form.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className={errors.date ? 'input-invalid' : form.date ? 'input-valid' : ''}
                />
                {errors.date && <span className="field-error">{errors.date}</span>}
              </div>

              {/* Time Slot */}
              <div className="form-field">
                <label htmlFor="appt-time">Preferred Time *</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {timeSlots.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => handleChange('timeSlot', slot)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '999px',
                        border: '2px solid',
                        borderColor: form.timeSlot === slot ? '#4f46e5' : '#e2e8f0',
                        backgroundColor: form.timeSlot === slot ? '#eef2ff' : '#fff',
                        color: form.timeSlot === slot ? '#4f46e5' : '#475569',
                        fontWeight: form.timeSlot === slot ? '600' : '400',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                {errors.timeSlot && <span className="field-error">{errors.timeSlot}</span>}
              </div>

              {/* Notes */}
              <div className="form-field">
                <label htmlFor="appt-notes">Additional Notes (optional)</label>
                <textarea
                  id="appt-notes"
                  rows={3}
                  placeholder="Any specific requirements, questions for the agent, or accessibility needs…"
                  value={form.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  style={{ resize: 'vertical', width: '100%' }}
                />
              </div>

              {!user && (
                <div style={{ padding: '0.75rem 1rem', backgroundColor: '#fef3c7', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem', color: '#92400e' }}>
                  ⚠️ You must <Link to="/login" style={{ color: '#4f46e5', fontWeight: '600' }}>sign in</Link> to book an appointment.
                </div>
              )}

              <button
                type="submit"
                className="button button-primary"
                disabled={submitting || !user}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {submitting ? 'Confirming...' : 'Confirm Appointment'}
              </button>
            </form>

            {/* Summary panel */}
            <div className="card-panel appointment-summary">
              <h3>What to Expect</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0 0 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { icon: '🗓️', text: 'Tour confirmed within 24 hours of booking' },
                  { icon: '📞', text: 'Agent will call/text with address and details' },
                  { icon: '🔄', text: 'Free rescheduling with 12-hour notice' },
                  { icon: '🔒', text: 'Your contact info is kept private and secure' },
                ].map(({ icon, text }) => (
                  <li key={text} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>{icon}</span>
                    <span style={{ color: '#475569', fontSize: '0.95rem' }}>{text}</span>
                  </li>
                ))}
              </ul>

              {selectedProperty && (
                <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontWeight: '600', marginBottom: '0.4rem', color: '#1e293b' }}>Selected Property</p>
                  <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem' }}>{selectedProperty.title}</p>
                  <p style={{ margin: '0.25rem 0 0 0', color: '#94a3b8', fontSize: '0.875rem' }}>
                    {typeof selectedProperty.location === 'object'
                      ? `${selectedProperty.location.address}, ${selectedProperty.location.city}`
                      : selectedProperty.location}
                  </p>
                  <p style={{ margin: '0.5rem 0 0 0', fontWeight: '700', color: '#4f46e5', fontSize: '1.05rem' }}>
                    {selectedProperty.price}
                  </p>
                </div>
              )}

              {form.date && (
                <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', backgroundColor: '#eef2ff', borderRadius: '8px' }}>
                  <p style={{ margin: 0, color: '#4338ca', fontSize: '0.9rem', fontWeight: '500' }}>
                    📅 {new Date(form.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    {' · '}{form.timeSlot}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
