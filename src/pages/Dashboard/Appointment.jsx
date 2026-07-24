import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAppointments } from '../../services/appointmentService';

const getAppointmentUserId = (appointment) => (
  appointment?.user?._id || appointment?.user?.id || appointment?.user || ''
);

const getAppointmentPropertyName = (appointment) => (
  appointment?.property?.title || appointment?.property?.name || appointment?.propertyName || `Property ${appointment?.property || ''}`.trim()
);

const getAppointmentLocation = (appointment) => (
  appointment?.property?.location || appointment?.location || appointment?.property?.city || ''
);

const getAppointmentAgent = (appointment) => {
  const owner = appointment?.property?.owner;
  const agent = appointment?.agent;

  return {
    name: agent?.name || owner?.name || 'Agent pending',
    phone: agent?.phone || owner?.phone || 'Phone pending',
  };
};

const formatAppointmentDate = (value) => {
  if (!value) return 'Date pending';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Date pending';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
};

export default function DashboardAppointment() {
  const { user } = useSelector((state) => state.auth || {});
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = user?.id || user?._id;
  const userAppointments = useMemo(() => {
    if (!userId) return [];
    return appointments.filter((appointment) => String(getAppointmentUserId(appointment)) === String(userId));
  }, [appointments, userId]);

  useEffect(() => {
    let active = true;

    fetchAppointments()
      .then((data) => {
        if (!active) return;
        const nextAppointments = Array.isArray(data?.appointments) ? data.appointments : [];
        setAppointments(nextAppointments);
      })
      .catch(() => {
        if (active) setAppointments([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="page-shell">
      <main className="page-content">
        <section className="page-head">
          <div>
            <p className="breadcrumb">Dashboard / Appointments</p>
            <h1>My Booked Appointments</h1>
            <p>These are the appointments booked by your account.</p>
          </div>
          <Link to="/appointment" className="button button-primary" style={{ alignSelf: 'flex-start' }}>
            Book New Appointment
          </Link>
        </section>

        <section className="card-panel" style={{ marginTop: '1.5rem' }}>
          {loading ? (
            <div className="empty-state">
              <p>Loading your booked appointments…</p>
            </div>
          ) : userAppointments.length > 0 ? (
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              {userAppointments.map((appointment) => {
                const appointmentId = appointment._id || appointment.id;
                const agent = getAppointmentAgent(appointment);
                const location = getAppointmentLocation(appointment);

                return (
                  <article key={appointmentId} className="appointment-summary" style={{ padding: '1.5rem', borderRadius: '24px', border: '1px solid #e5e7eb', background: '#ffffff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                      <div>
                        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{getAppointmentPropertyName(appointment)}</h2>
                        {location && <p style={{ margin: '0.35rem 0 0', color: '#64748b' }}>{location}</p>}
                        <p style={{ margin: '0.35rem 0 0', color: '#64748b' }}>{formatAppointmentDate(appointment.date)}</p>
                      </div>
                      <span style={{ alignSelf: 'center', padding: '0.5rem 0.85rem', borderRadius: '999px', backgroundColor: '#eff6ff', color: '#1d4ed8', fontWeight: 700 }}>
                        {appointment.status || 'Pending'}
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.25rem' }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: 700 }}>Agent</p>
                        <p style={{ margin: '0.35rem 0 0', color: '#111827' }}>{agent.name}</p>
                        <p style={{ margin: '0.25rem 0 0', color: '#475569' }}>{agent.phone}</p>
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 700 }}>Notes</p>
                        <p style={{ margin: '0.35rem 0 0', color: '#475569' }}>{appointment.notes || 'No additional notes'}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <h2 style={{ margin: 0 }}>No booked appointments yet</h2>
              <p style={{ margin: 0, color: '#6b7280' }}>Once you book an appointment, it will appear here.</p>
              <div className="empty-actions">
                <Link to="/appointment" className="button button-primary">Book an Appointment</Link>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
