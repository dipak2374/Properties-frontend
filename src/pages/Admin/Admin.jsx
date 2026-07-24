import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAppointments } from '../../services/appointmentService';
import { fetchMessages } from '../../services/messageService';
import { fetchPayments } from '../../services/paymentService';
import { fetchProperties } from '../../services/propertyService';
import { fetchReviews } from '../../services/reviewService';
import { fetchAgents, fetchUsers } from '../../services/userService';
import { logout } from '../../redux/authSlice';
import './Admin.css';

const logo = '/images/ad-logo.png';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '/images/dashboard.png' },
  { id: 'properties', label: 'Properties', icon: '/images/Properties.png' },
  { id: 'appointments', label: 'Appointments', icon: '/images/Appointments.png' },
  { id: 'users', label: 'Users', icon: '/images/users.png' },
  { id: 'agents', label: 'Agents', icon: '/images/agents.png' },
  { id: 'messages', label: 'Messages', icon: '/images/message.png' },
  { id: 'reviews', label: 'Reviews', icon: '/images/review.png' },
  { id: 'payments', label: 'Payments', icon: '/images/payment.png' },
  { id: 'pages', label: 'Pages', icon: '/images/pages.png' },
  { id: 'reports', label: 'Reports', icon: '/images/reports.png' },
  { id: 'settings', label: 'Settings', icon: '/images/setting.png' },
];

const stats = [
  { label: 'Total Properties', value: '1,284', change: '+12.8%', note: 'Listed across 18 cities' },
  { label: 'Active Agents', value: '86', change: '+6.4%', note: '12 awaiting review' },
  { label: 'Monthly Revenue', value: '$48.2k', change: '+18.1%', note: 'From subscriptions and ads' },
  { label: 'Open Tickets', value: '24', change: '-9.7%', note: 'Average response 2h 14m' },
];

const properties = [
  { name: 'Marina Heights Villa', location: 'Miami, FL', price: '$1.24M', type: 'Villa', status: 'Approved', agent: 'Nora Blake', views: '8,420' },
  { name: 'Downtown Glass Loft', location: 'Austin, TX', price: '$680k', type: 'Apartment', status: 'Pending', agent: 'Owen Pierce', views: '5,118' },
  { name: 'Cedar Park Estate', location: 'Denver, CO', price: '$920k', type: 'House', status: 'Approved', agent: 'Maya Grant', views: '6,902' },
  { name: 'Harbor Studio Suite', location: 'Seattle, WA', price: '$410k', type: 'Studio', status: 'Rejected', agent: 'Leo Carter', views: '2,734' },
  { name: 'Palm Ridge Duplex', location: 'Phoenix, AZ', price: '$755k', type: 'Duplex', status: 'Pending', agent: 'Ava Nelson', views: '4,381' },
];

const formatNumber = (value) => new Intl.NumberFormat('en-US').format(value);

const formatDate = (value, options = {}) => {
  if (!value) {
    return 'Not set';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-US', options).format(date);
};

const formatCurrency = (value) => {
  if (typeof value !== 'number') {
    return value || 'Not set';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
};

const getPropertyStatus = (property) => property.status || (property.approved ? 'Approved' : 'Pending');

const normalizeProperty = (property, index) => ({
  id: property._id || property.id || `property-${index}`,
  createdAt: property.createdAt,
  updatedAt: property.updatedAt,
  featured: Boolean(property.featured),
  name: property.name || property.title || `Property ${index + 1}`,
  location: property.location || property.city || 'Location pending',
  city: property.city || property.location?.split(',')[0]?.trim() || 'Unknown',
  price: formatCurrency(property.price),
  type: property.type || property.category || 'Property',
  status: getPropertyStatus(property),
  agent: property.agent?.name || property.agentName || 'Unassigned',
  views: formatNumber(property.views || property.viewCount || 0),
  image: property.image || property.imageUrl,
});

const normalizeUser = (user, index) => [
  user.name || user.username || `User ${index + 1}`,
  user.role || 'user',
  user.email || 'No email',
  user.status || (user.blocked ? 'Blocked' : 'Active'),
];

const normalizeAgent = (agent, index) => ({
  id: agent._id || agent.id || `agent-${index}`,
  name: agent.name || agent.username || `Agent ${index + 1}`,
  email: agent.email || 'No email',
  role: agent.role || 'seller',
  title: agent.title || 'Agent',
  status: agent.status || 'Active',
  profilePicture: agent.profilePicture || agent.avatar || '',
});

const normalizeAppointment = (appointment, index) => [
  formatDate(appointment.date || appointment.createdAt, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
  appointment.property?.title || appointment.property?.name || appointment.propertyName || `Appointment ${index + 1}`,
  appointment.client?.name || appointment.user?.name || appointment.clientName || 'Client pending',
  appointment.property?.owner?.name || appointment.agent?.name || 'Agent pending',
  appointment.status || 'Pending',
];

const normalizeMessage = (message, index) => [
  message.sender?.name || message.senderName || 'Unknown sender',
  message.sender?.email || message.senderEmail || 'No email',
  message.subject || `Message ${index + 1}`,
  message.content || 'No message body',
  message.read ? 'Read' : 'Unread',
];

const normalizeReview = (review, index) => [
  review.property?.title || review.propertyName || `Review ${index + 1}`,
  String(review.rating ?? 'Not rated'),
  review.comment || 'No comment',
  review.status || 'Published',
];

const normalizePayment = (payment, index) => [
  payment.invoice || payment.invoiceNumber || `PAY-${String(index + 1).padStart(4, '0')}`,
  payment.customer?.name || payment.user?.name || payment.customerName || 'Customer pending',
  formatCurrency(payment.amount),
  payment.status || 'Pending',
];

const getArrayPayload = (data, key) => {
  if (Array.isArray(data)) {
    return data;
  }

  return Array.isArray(data?.[key]) ? data[key] : [];
};

const appointments = [
  ['Today, 10:30 AM', 'Marina Heights Villa', 'Amelia Woods', 'Confirmed'],
  ['Today, 2:00 PM', 'Downtown Glass Loft', 'Ryan Stone', 'Pending'],
  ['Tomorrow, 9:15 AM', 'Cedar Park Estate', 'Priya Shah', 'Confirmed'],
  ['Tomorrow, 4:45 PM', 'Palm Ridge Duplex', 'Mateo Cruz', 'Reschedule'],
];

const users = [
  ['Amelia Woods', 'Buyer', 'amelia@example.com', 'Active'],
  ['Ryan Stone', 'Seller', 'ryan@example.com', 'Active'],
  ['Priya Shah', 'Buyer', 'priya@example.com', 'Pending'],
  ['Mateo Cruz', 'Investor', 'mateo@example.com', 'Blocked'],
];

const agents = [
  ['Nora Blake', '42 portfolios', '4.9 rating', 'Verified'],
  ['Owen Pierce', '28 portfolios', '4.7 rating', 'Verified'],
  ['Maya Grant', '34 portfolios', '4.8 rating', 'Review'],
  ['Leo Carter', '19 portfolios', '4.5 rating', 'Verified'],
];

const messages = [
  ['Support inbox', '9 unread conversations', 'High'],
  ['Agent approvals', '4 profile updates waiting', 'Medium'],
  ['Property disputes', '2 refund questions', 'High'],
  ['General contact', '18 new form submissions', 'Normal'],
];

const reviews = [
  ['Marina Heights Villa', '5.0', 'Clean handoff and accurate listing', 'Published'],
  ['Downtown Glass Loft', '4.0', 'Tour time changed twice', 'Review'],
  ['Cedar Park Estate', '5.0', 'Excellent agent follow-up', 'Published'],
  ['Harbor Studio Suite', '2.0', 'Photos need correction', 'Hidden'],
];

const payments = [
  ['INV-1048', 'Nora Blake', '$499', 'Paid'],
  ['INV-1047', 'Owen Pierce', '$249', 'Paid'],
  ['INV-1046', 'Maya Grant', '$499', 'Pending'],
  ['INV-1045', 'Leo Carter', '$149', 'Failed'],
];

const contentByPage = {
  appointments: {
    title: 'Appointments',
    subtitle: 'Track upcoming property visits and agent follow-ups.',
    columns: ['Time', 'Property', 'Client', 'Agent', 'Status'],
    rows: appointments,
  },
  users: {
    title: 'Users',
    subtitle: 'Manage buyers, sellers, investors, and blocked accounts.',
    columns: ['Name', 'Role', 'Email', 'Status'],
    rows: users,
  },
  agents: {
    title: 'Agents',
    subtitle: 'Review agent performance, portfolio, and verification status.',
    columns: ['Agent', 'Portfolio', 'Score', 'Status'],
    rows: agents,
  },
  messages: {
    title: 'Messages',
    subtitle: 'Monitor support queues and sender details.',
    columns: ['Sender', 'Email', 'Subject', 'Message', 'Status'],
    rows: messages,
  },
  reviews: {
    title: 'Reviews',
    subtitle: 'Moderate property feedback and customer ratings.',
    columns: ['Property', 'Rating', 'Comment', 'Status'],
    rows: reviews,
  },
  payments: {
    title: 'Payments',
    subtitle: 'Audit subscriptions, invoices, and failed payments.',
    columns: ['Invoice', 'Customer', 'Amount', 'Status'],
    rows: payments,
  },
  pages: {
    title: 'Pages',
    subtitle: 'Maintain public content and important site pages.',
    columns: ['Page', 'Last Updated', 'Owner', 'Status'],
    rows: [
      ['Home', 'Jul 15, 2026', 'Content team', 'Live'],
      ['About', 'Jul 11, 2026', 'Marketing', 'Live'],
      ['Contact', 'Jul 9, 2026', 'Support', 'Draft'],
      ['Terms', 'Jun 28, 2026', 'Legal', 'Review'],
    ],
  },
  reports: {
    title: 'Reports',
    subtitle: 'View marketplace health, growth, and moderation trends.',
    columns: ['Report', 'Period', 'Owner', 'Status'],
    rows: [
      ['Listing quality', 'This week', 'Operations', 'Ready'],
      ['Revenue forecast', 'July 2026', 'Finance', 'Draft'],
      ['Agent response time', 'Last 30 days', 'Support', 'Ready'],
      ['Lead conversion', 'Q3 2026', 'Sales', 'Building'],
    ],
  },
  settings: {
    title: 'Settings',
    subtitle: 'Configure platform policies, notifications, and access rules.',
    columns: ['Setting', 'Value', 'Owner', 'Status'],
    rows: [
      ['Auto approve listings', 'Off', 'Admin', 'Locked'],
      ['Agent verification', 'Required', 'Compliance', 'Active'],
      ['Email alerts', 'Enabled', 'Support', 'Active'],
      ['Maintenance mode', 'Disabled', 'Engineering', 'Ready'],
    ],
  },
};

function Header({ activeLabel, adminName, theme, onToggleMenu, onToggleTheme, onOpenProfile, sidebarOpen, notificationCount, messageCount }) {
  return (
    <header className="admin-header">
      <button className="admin-menu-toggle" type="button" onClick={onToggleMenu} aria-label={sidebarOpen ? 'Close menu' : 'Open menu'} aria-expanded={sidebarOpen}>
        <img src="/images/menu.png" alt="" aria-hidden="true" />
      </button>
      <label className="admin-header-search">
        <span className="admin-search-icon" />
        <input placeholder={`Search ${activeLabel.toLowerCase()}`} />
        <kbd>Ctrl K</kbd>
      </label>
      <div className="admin-header-actions">
        <button className="admin-theme-toggle" type="button" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
          <span className="admin-theme-track">
            <span className="admin-theme-thumb" />
          </span>
          {theme === 'dark' ? 'Dark' : 'Light'}
        </button>
        <button className="admin-website-btn" type="button" onClick={() => window.location.assign('/')}>
          <span className="admin-target-icon" />
          Website
          <span className="admin-open-icon" aria-hidden="true" />
        </button>
        <button className="admin-header-icon has-count" data-count={notificationCount} type="button" aria-label={`${notificationCount} notifications`}>
          <img src="/images/notification.png" alt="" aria-hidden="true" />
        </button>
        <button className="admin-header-icon has-count" data-count={messageCount} type="button" aria-label={`${messageCount} unread messages`}>
          <img src="/images/mail.png" alt="" aria-hidden="true" />
        </button>
        <button className="admin-user" type="button" onClick={onOpenProfile}>
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" alt="" />
          <span>
            <strong>{adminName}</strong>
            <small>Administrator</small>
          </span>
          <em aria-hidden="true">v</em>
        </button>
      </div>
    </header>
  );
}

function Sidebar({ activePage, onChange, open }) {
  return (
    <aside className={`admin-side${open ? ' is-open' : ''}`}>
      <div className="admin-side-logo">
        <img src={logo} alt="PropertyHub Admin" />
      </div>
      <nav className="admin-side-nav" aria-label="Admin pages">
        {navItems.map((item) => (
          <button
            className={activePage === item.id ? 'is-active' : ''}
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
          >
            <img className="admin-nav-icon" src={item.icon} alt="" aria-hidden="true" />
            {item.label}
          </button>
        ))}
      </nav>
      <button className="admin-side-profile" type="button" onClick={() => onChange('profile')}>
        <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80" alt="" />
        <span>
          <strong>Admin team</strong>
          <small>Online</small>
        </span>
        <span aria-hidden="true">v</span>
      </button>
    </aside>
  );
}

function Dashboard({ dashboardStats, dashboardProperties }) {
  return (
    <>
      <section className="admin-welcome">
        <div>
          <p>PropertyHub control center</p>
          <h1>Welcome back, admin</h1>
          <span>Review performance, approve listings, and keep the marketplace moving.</span>
        </div>
      </section>
      <section className="admin-stat-grid">
        {dashboardStats.map((stat) => (
          <article className="admin-card" key={stat.label}>
            <p>{stat.label}</p>
            <h2>{stat.value}</h2>
            <strong>{stat.change}</strong>
            <span>{stat.note}</span>
          </article>
        ))}
      </section>
      <section className="admin-dashboard-grid">
        <TablePanel title="Recent Listings" subtitle="Newest properties waiting for admin attention." columns={['Property', 'Agent', 'Price', 'Status', 'Views']} rows={dashboardProperties.map((item) => [item.name, item.agent, item.price, item.status, item.views])} />
        <article className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <h2>Team Tasks</h2>
              <p>Today's operational checklist.</p>
            </div>
          </div>
          <div className="admin-task-list">
            {[
              ['Verify agent documents', '12 profiles in queue', '72%'],
              ['Review flagged listings', '5 reports need action', '48%'],
              ['Publish weekly report', 'Revenue and lead summary', '88%'],
            ].map(([title, body, progress]) => (
              <div className="admin-task" key={title}>
                <strong>{title}</strong>
                <span>{body}</span>
                <div><i style={{ width: progress }} /></div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}

function TablePanel({ title, subtitle, columns, rows, loading = false, error = '' }) {
  return (
    <article className="admin-panel">
      <div className="admin-panel-head">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>
      <div className="admin-table">
        <div className="admin-table-row admin-table-heading" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(120px, 1fr))` }}>
          {columns.map((column) => <span key={column}>{column}</span>)}
        </div>
        {loading && <div className="admin-table-state">Loading {title.toLowerCase()}...</div>}
        {!loading && error && <div className="admin-table-state error">{error}</div>}
        {!loading && !error && rows.length === 0 && <div className="admin-table-state">No {title.toLowerCase()} found.</div>}
        {!loading && !error && rows.map((row) => (
          <div className="admin-table-row" key={row.join('-')} style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(120px, 1fr))` }}>
            {row.map((cell, cellIndex) => cellIndex === row.length - 1 ? <mark className={String(cell).toLowerCase() === 'approved' || String(cell).toLowerCase() === 'live' || String(cell).toLowerCase() === 'paid' || String(cell).toLowerCase() === 'active' ? 'live' : ''} key={`${cell}-${cellIndex}`}>{cell}</mark> : <span key={`${cell}-${cellIndex}`}>{cell}</span>)}
          </div>
        ))}
      </div>
    </article>
  );
}

function PropertiesPage({ propertyRows, hasBackendProperties, loading, error }) {
  const [filters, setFilters] = useState({ search: '', status: 'All Status', type: 'All Types', city: 'All Cities' });
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const statusOptions = useMemo(() => ['All Status', ...Array.from(new Set(propertyRows.map((property) => property.status))).filter(Boolean)], [propertyRows]);
  const typeOptions = useMemo(() => ['All Types', ...Array.from(new Set(propertyRows.map((property) => property.type))).filter(Boolean)], [propertyRows]);
  const cityOptions = useMemo(() => ['All Cities', ...Array.from(new Set(propertyRows.map((property) => property.city || property.location))).filter(Boolean)], [propertyRows]);
  const filteredRows = useMemo(() => propertyRows.filter((property) => {
    const search = filters.search.trim().toLowerCase();
    const matchesSearch = !search || [property.name, property.location, property.agent, property.type, property.status].some((value) => String(value).toLowerCase().includes(search));
    const matchesStatus = filters.status === 'All Status' || property.status === filters.status;
    const matchesType = filters.type === 'All Types' || property.type === filters.type;
    const matchesCity = filters.city === 'All Cities' || property.city === filters.city || property.location === filters.city;

    return matchesSearch && matchesStatus && matchesType && matchesCity;
  }), [filters, propertyRows]);
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const visibleRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);
  const totalProperties = propertyRows.length;
  const approvedCount = propertyRows.filter((property) => property.status.toLowerCase() === 'approved').length;
  const pendingCount = propertyRows.filter((property) => property.status.toLowerCase() === 'pending').length;
  const rejectedCount = propertyRows.filter((property) => property.status.toLowerCase() === 'rejected').length;
  const featuredCount = propertyRows.filter((property) => property.featured).length;
  const statsSource = [
    ['Total Properties', formatNumber(totalProperties), hasBackendProperties ? 'Live data' : '+12.8% this month', 'blue'],
    ['Approved', formatNumber(approvedCount), hasBackendProperties ? 'From listings' : '+8.2% this month', 'green'],
    ['Pending', formatNumber(pendingCount), hasBackendProperties ? 'Awaiting review' : '+3.4% this month', 'orange'],
    ['Rejected', formatNumber(rejectedCount), hasBackendProperties ? 'Needs attention' : '-4.1% this month', 'red'],
    ['Featured', formatNumber(featuredCount), hasBackendProperties ? 'Promoted listings' : '+15.6% this month', 'purple'],
  ];
  const updateFilter = (name, value) => {
    setFilters((current) => ({ ...current, [name]: value }));
    setPage(1);
  };

  return (
    <>
      <section className="properties-title">
        <h1>Properties Management</h1>
        <p>Admin <span>/</span> Properties <span>/</span> All Listings</p>
      </section>
      <section className="properties-stats">
        {statsSource.map(([label, value, change, color]) => (
          <article className="properties-stat" key={label}>
            <span className={`properties-stat-icon ${color}`}>{value.slice(0, 1)}</span>
            <div>
              <p>{label}</p>
              <h2>{value}</h2>
              <span className={change.startsWith('-') ? 'down' : ''}>{change}</span>
            </div>
          </article>
        ))}
      </section>
      <section className="properties-panel">
        <div className="properties-tools">
          <input placeholder="Search properties" value={filters.search} onChange={(event) => updateFilter('search', event.target.value)} />
          <select value={filters.status} onChange={(event) => updateFilter('status', event.target.value)}>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select>
          <select value={filters.type} onChange={(event) => updateFilter('type', event.target.value)}>{typeOptions.map((type) => <option key={type}>{type}</option>)}</select>
          <select value={filters.city} onChange={(event) => updateFilter('city', event.target.value)}>{cityOptions.map((city) => <option key={city}>{city}</option>)}</select>
        </div>
        <div className="properties-table">
          <div className="properties-table-row properties-table-head">
            <span>Property</span><span>Type</span><span>Agent</span><span>Price</span><span>Views</span><span>Location</span><span>Status</span>
          </div>
          {loading && <div className="properties-table-state">Loading properties...</div>}
          {!loading && error && <div className="properties-table-state error">{error}</div>}
          {!loading && !error && filteredRows.length === 0 && <div className="properties-table-state">No properties match your filters.</div>}
          {!loading && !error && visibleRows.map((property, index) => (
            <div className="properties-table-row" key={property.id || property.name}>
              <span className="property-cell">
                <img src={property.image || `https://images.unsplash.com/photo-${index % 2 === 0 ? '1564013799919-ab600027ffc6' : '1522708323590-d24dbb6b0267'}?auto=format&fit=crop&w=180&q=80`} alt="" />
                <span><strong>{property.name}</strong><small>{property.location}</small></span>
              </span>
              <span>{property.type}</span>
              <span className="agent-cell"><img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80" alt="" />{property.agent}</span>
              <span>{property.price}</span>
              <span>{property.views}</span>
              <span>{property.location}</span>
              <mark className={property.status.toLowerCase()}>{property.status}</mark>
            </div>
          ))}
        </div>
        <div className="properties-pagination">
          <p>Showing {filteredRows.length === 0 ? 0 : ((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filteredRows.length)} of {formatNumber(filteredRows.length)} properties</p>
          <div>
            <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>Previous</button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button className={pageNumber === page ? 'active' : ''} type="button" key={pageNumber} onClick={() => setPage(pageNumber)}>{pageNumber}</button>
            ))}
            <button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages}>Next</button>
          </div>
        </div>
      </section>
    </>
  );
}

function AdminProfile({ adminName, user, metrics, onSignOut }) {
  const displayEmail = user?.email || 'No email provided';
  const joinedDate = formatDate(user?.createdAt, { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <section className="admin-profile-page">
      <div className="admin-profile-hero">
        <div className="admin-profile-avatar">{adminName.charAt(0).toUpperCase()}</div>
        <div>
          <p>Administrator profile</p>
          <h1>{adminName}</h1>
          <span>{displayEmail}</span>
        </div>
        <button type="button" onClick={onSignOut}>Sign out</button>
      </div>

      <div className="admin-profile-grid">
        <article className="admin-profile-card">
          <h2>Account</h2>
          <dl>
            <div><dt>Role</dt><dd>{user?.role || 'admin'}</dd></div>
            <div><dt>Email</dt><dd>{displayEmail}</dd></div>
            <div><dt>Joined</dt><dd>{joinedDate}</dd></div>
          </dl>
        </article>
        <article className="admin-profile-card">
          <h2>Admin Snapshot</h2>
          <dl>
            <div><dt>Properties</dt><dd>{formatNumber(metrics.properties)}</dd></div>
            <div><dt>Pending listings</dt><dd>{formatNumber(metrics.pending)}</dd></div>
            <div><dt>Messages</dt><dd>{formatNumber(metrics.messages)}</dd></div>
          </dl>
        </article>
        <article className="admin-profile-card wide">
          <h2>Access</h2>
          <div className="admin-access-list">
            {['Listing moderation', 'User management', 'Payment review', 'Message monitoring'].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

export default function Admin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [backendProperties, setBackendProperties] = useState([]);
  const [agentProfiles, setAgentProfiles] = useState([]);
  const [resourceState, setResourceState] = useState({
    properties: { loading: true, error: '', loaded: false },
    users: { loading: true, error: '', rows: [] },
    agents: { loading: true, error: '' },
    appointments: { loading: true, error: '', rows: [] },
    messages: { loading: true, error: '', rows: [] },
    reviews: { loading: true, error: '', rows: [] },
    payments: { loading: true, error: '', rows: [] },
  });
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') {
      return 'light';
    }

    return window.localStorage.getItem('propertyhub-admin-theme') || 'light';
  });
  const user = useSelector((state) => state.auth.user);
  const activeLabel = useMemo(() => navItems.find((item) => item.id === activePage)?.label ?? 'Dashboard', [activePage]);
  const adminName = user?.name || user?.username || 'Admin User';
  const isProperties = activePage === 'properties';
  const dynamicContent = useMemo(() => ({
    appointments: { ...contentByPage.appointments, rows: resourceState.appointments.rows, loading: resourceState.appointments.loading, error: resourceState.appointments.error },
    users: { ...contentByPage.users, rows: resourceState.users.rows, loading: resourceState.users.loading, error: resourceState.users.error },
    messages: { ...contentByPage.messages, rows: resourceState.messages.rows, loading: resourceState.messages.loading, error: resourceState.messages.error },
    reviews: { ...contentByPage.reviews, rows: resourceState.reviews.rows, loading: resourceState.reviews.loading, error: resourceState.reviews.error },
    payments: { ...contentByPage.payments, rows: resourceState.payments.rows, loading: resourceState.payments.loading, error: resourceState.payments.error },
  }), [resourceState]);
  const pageConfig = dynamicContent[activePage] || contentByPage[activePage];
  const propertyRows = useMemo(() => {
    if (!resourceState.properties.loaded) {
      return properties;
    }

    return backendProperties.map(normalizeProperty);
  }, [backendProperties, resourceState.properties.loaded]);
  const hasBackendProperties = resourceState.properties.loaded;
  const dashboardStats = useMemo(() => {
    if (!hasBackendProperties) {
      return stats;
    }

    const approvedCount = propertyRows.filter((property) => property.status.toLowerCase() === 'approved').length;
    const pendingCount = propertyRows.filter((property) => property.status.toLowerCase() === 'pending').length;
    const totalViews = propertyRows.reduce((total, property) => total + Number(String(property.views).replace(/,/g, '')) || total, 0);

    return [
      { label: 'Total Properties', value: formatNumber(propertyRows.length), change: 'Live', note: 'Loaded from backend listings' },
      { label: 'Approved Listings', value: formatNumber(approvedCount), change: `${formatNumber(pendingCount)} pending`, note: 'Current moderation status' },
      { label: 'Total Views', value: formatNumber(totalViews), change: 'Updated', note: 'Across available listings' },
      { label: 'Open Tickets', value: '0', change: 'Live', note: 'No ticket endpoint connected yet' },
    ];
  }, [hasBackendProperties, propertyRows]);
  const notificationCount = hasBackendProperties ? propertyRows.filter((property) => property.status.toLowerCase() === 'pending').length : 6;
  const messageCount = resourceState.messages.rows.length > 0 ? resourceState.messages.rows.length : messages.reduce((total, [activity]) => {
    const unread = activity.match(/(\d+)\s+unread/i);
    return total + (unread ? Number(unread[1]) : 0);
  }, 0);

  useEffect(() => {
    let active = true;

    const setResource = (name, nextState) => {
      if (!active) {
        return;
      }

      setResourceState((current) => ({
        ...current,
        [name]: {
          ...current[name],
          ...nextState,
        },
      }));
    };

    fetchProperties()
      .then((data) => {
        const nextProperties = getArrayPayload(data, 'properties');
        if (active) {
          setBackendProperties(nextProperties);
          setResource('properties', { loading: false, error: '', loaded: true });
        }
      })
      .catch(() => setResource('properties', { loading: false, error: 'Unable to load properties.', loaded: true }));

    fetchUsers()
      .then((data) => setResource('users', { loading: false, error: '', rows: getArrayPayload(data, 'users').map(normalizeUser) }))
      .catch(() => setResource('users', { loading: false, error: 'Unable to load users.', rows: [] }));

    fetchAgents()
      .then((data) => {
        if (active) {
          setAgentProfiles(data.map(normalizeAgent));
          setResource('agents', { loading: false, error: '' });
        }
      })
      .catch(() => setResource('agents', { loading: false, error: 'Unable to load agents.' }));

    fetchAppointments()
      .then((data) => setResource('appointments', { loading: false, error: '', rows: getArrayPayload(data, 'appointments').map(normalizeAppointment) }))
      .catch(() => setResource('appointments', { loading: false, error: 'Unable to load appointments.', rows: [] }));

    fetchMessages()
      .then((data) => setResource('messages', { loading: false, error: '', rows: getArrayPayload(data, 'messages').map(normalizeMessage) }))
      .catch(() => setResource('messages', { loading: false, error: 'Unable to load messages.', rows: [] }));

    fetchReviews()
      .then((data) => setResource('reviews', { loading: false, error: '', rows: getArrayPayload(data, 'reviews').map(normalizeReview) }))
      .catch(() => setResource('reviews', { loading: false, error: 'Unable to load reviews.', rows: [] }));

    fetchPayments()
      .then((data) => setResource('payments', { loading: false, error: '', rows: getArrayPayload(data, 'payments').map(normalizePayment) }))
      .catch(() => setResource('payments', { loading: false, error: 'Unable to load payments.', rows: [] }));

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!sidebarOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  const changePage = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };
  const handleSignOut = () => {
    dispatch(logout());
    navigate('/login');
  };
  const toggleTheme = () => {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('propertyhub-admin-theme', nextTheme);
      }
      return nextTheme;
    });
  };

  return (
    <div className={`admin-app admin-theme-${theme}${isProperties ? ' admin-properties-app' : ''}${sidebarOpen ? ' admin-sidebar-open' : ''}`}>
      <Sidebar activePage={activePage} onChange={changePage} open={sidebarOpen} />
      <button className="admin-side-backdrop" type="button" aria-label="Close menu" onClick={() => setSidebarOpen(false)} />
      <main className="admin-main">
        <Header activeLabel={activeLabel} adminName={adminName} theme={theme} onToggleMenu={() => setSidebarOpen((open) => !open)} onToggleTheme={toggleTheme} onOpenProfile={() => setActivePage('profile')} sidebarOpen={sidebarOpen} notificationCount={notificationCount} messageCount={messageCount} />
        <div className={`admin-content${isProperties ? ' properties-content' : ''}`}>
          {activePage === 'dashboard' && <Dashboard dashboardStats={dashboardStats} dashboardProperties={propertyRows} />}
          {isProperties && <PropertiesPage propertyRows={propertyRows} hasBackendProperties={hasBackendProperties} loading={resourceState.properties.loading} error={resourceState.properties.error} />}
          {activePage === 'profile' && <AdminProfile adminName={adminName} user={user} metrics={{ properties: propertyRows.length, pending: notificationCount, messages: messageCount }} onSignOut={handleSignOut} />}
          {pageConfig && <TablePanel title={pageConfig.title} subtitle={pageConfig.subtitle} columns={pageConfig.columns} rows={pageConfig.rows} loading={pageConfig.loading} error={pageConfig.error} />}
        </div>
      </main>
    </div>
  );
}
