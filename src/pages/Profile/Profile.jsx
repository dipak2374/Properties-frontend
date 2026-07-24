import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../redux/authSlice';
import { fetchAppointments } from '../../services/appointmentService';
import '../../styles/pages.css';

const getAppointmentUserId = (appointment) => (
  appointment?.user?._id ||
  appointment?.user?.id ||
  appointment?.user ||
  ''
);

const getAppointmentPropertyName = (appointment) => (
  appointment?.property?.title ||
  appointment?.property?.name ||
  appointment?.propertyName ||
  `Property ${appointment?.property || ''}`.trim()
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
  if (!value) {
    return 'Date pending';
  }

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

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState('');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const displayName = user?.name || 'PropertyHub Member';
  const displayEmail = user?.email || 'No email provided';
  const displayPhone = user?.phone || 'No phone provided';
  const displayRole = user?.role || 'user';
  const memberSince = user?.createdAt
    ? new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(user.createdAt))
    : 'Recently joined';
  const userAppointments = useMemo(() => {
    const userId = user?.id || user?._id;
    if (!userId) {
      return [];
    }

    return appointments.filter((appointment) => String(getAppointmentUserId(appointment)) === String(userId));
  }, [appointments, user]);
  const selectedAppointment = userAppointments.find((appointment) => {
    const appointmentId = appointment._id || appointment.id;
    return String(appointmentId) === String(selectedAppointmentId);
  }) || userAppointments[0];
  const selectedAgent = getAppointmentAgent(selectedAppointment);

  useEffect(() => {
    let active = true;

    fetchAppointments()
      .then((data) => {
        if (!active) {
          return;
        }

        const nextAppointments = Array.isArray(data?.appointments) ? data.appointments : [];
        setAppointments(nextAppointments);
        const firstUserAppointment = nextAppointments.find((appointment) => {
          const userId = user?.id || user?._id;
          return userId && String(getAppointmentUserId(appointment)) === String(userId);
        });
        if (firstUserAppointment) {
          setSelectedAppointmentId(firstUserAppointment._id || firstUserAppointment.id);
        }
      })
      .catch(() => setAppointments([]))
      .finally(() => {
        if (active) {
          setLoadingAppointments(false);
        }
      });

    return () => {
      active = false;
    };
  }, [user]);

  return (
    <div className="page-shell">
      <main className="page-content">
        <section className="profile-hero">
          <div className="profile-intro">
            <div className="avatar-pill">{displayName.charAt(0).toUpperCase()}</div>
            <div>
              <p className="section-label">My Account</p>
              <h1>{displayName}</h1>
              <p className="profile-subtitle">Manage your details, saved homes, appointments, and account activity.</p>
            </div>
          </div>
          <button type="button" className="button button-secondary" onClick={handleLogout}>Sign out</button>
        </section>

        <section className="profile-stat-row">
          <article>
            <strong>Wishlist</strong>
            <span>Saved homes</span>
          </article>
          <article>
            <strong>Appointments</strong>
            <span>{loadingAppointments ? 'Loading...' : `${userAppointments.length} booked`}</span>
          </article>
          <article>
            <strong>Messages</strong>
            <span>Agent conversations</span>
          </article>
        </section>

        <section className="profile-grid">
          <article className="info-card">
            <h2>Account Details</h2>
            <ul className="profile-list">
              <li><strong>Name:</strong> {displayName}</li>
              <li><strong>Email:</strong> {displayEmail}</li>
              <li><strong>Phone:</strong> {displayPhone}</li>
              <li><strong>Role:</strong> {displayRole}</li>
              <li><strong>Member since:</strong> {memberSince}</li>
            </ul>
          </article>

          <article className="info-card">
            <h2>Quick Actions</h2>
            <ul className="profile-list">
              <li><Link to="/wishlist">Open wishlist</Link></li>
              <li><Link to="/appointment">Book an appointment</Link></li>
              <li><Link to="/messages">View messages</Link></li>
              <li><Link to="/properties">Browse properties</Link></li>
            </ul>
          </article>

          <article className="info-card profile-wide-card">
            <h2>Booked Appointments</h2>
            {loadingAppointments ? (
              <p className="profile-muted">Loading appointments...</p>
            ) : userAppointments.length > 0 ? (
              <div className="booked-appointment-panel">
                <label>
                  Select appointment
                  <select
                    value={selectedAppointment?._id || selectedAppointment?.id || ''}
                    onChange={(event) => setSelectedAppointmentId(event.target.value)}
                  >
                    {userAppointments.map((appointment) => {
                      const appointmentId = appointment._id || appointment.id;
                      return (
                        <option key={appointmentId} value={appointmentId}>
                          {getAppointmentPropertyName(appointment)} - {formatAppointmentDate(appointment.date)}
                        </option>
                      );
                    })}
                  </select>
                </label>
                <div className="booked-appointment-details">
                  <span>{selectedAppointment?.status || 'Pending'}</span>
                  <strong>{getAppointmentPropertyName(selectedAppointment)}</strong>
                  <p>{formatAppointmentDate(selectedAppointment?.date)}</p>
                  <div className="booked-agent-contact">
                    <p><strong>Agent:</strong> {selectedAgent.name}</p>
                    <p><strong>Phone:</strong> {selectedAgent.phone}</p>
                  </div>
                  {selectedAppointment?.notes ? <p>{selectedAppointment.notes}</p> : null}
                </div>
              </div>
            ) : (
              <div className="booked-appointment-empty">
                <p>No booked appointments yet.</p>
                <Link to="/appointment" className="button button-primary">Book an appointment</Link>
              </div>
            )}
          </article>

          <article className="info-card profile-wide-card">
            <h2>Preferences</h2>
            <div className="profile-preference-grid">
              <span>Email alerts enabled</span>
              <span>Saved search reminders</span>
              <span>Appointment updates</span>
              <span>Buyer dashboard access</span>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
