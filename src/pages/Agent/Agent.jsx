import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageLoader from '../../components/Common/PageLoader';
import { defaultAgents } from '../../data/agentsData';
import { fetchAgents, resolveUserAssetUrl } from '../../services/userService';
import { validateName, validateEmail, validatePhone, validateMessage, runValidators } from '../../utils/validate';
import '../../styles/pages.css';

const INITIAL_FORM = { name: '', email: '', phone: '', message: '' };

export default function Agent() {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form state & validation
  const [contactForm, setContactForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let active = true;
    const loadAgent = async () => {
      setLoading(true);
      try {
        const extractedNum = parseInt(String(id || '').replace(/\D/g, ''), 10);
        const staticAgent = defaultAgents.find(
          (a) => String(a.id) === String(id) || (Number.isInteger(extractedNum) && a.id === extractedNum)
        );

        if (staticAgent) {
          if (active) setAgent(staticAgent);
        } else {
          const liveAgents = await fetchAgents();
          const found = liveAgents.find((a) => String(a._id || a.id) === String(id));
          
          if (found && active) {
            const formatted = {
              id: found._id || found.id,
              name: found.name || 'Property Agent',
              title: found.title || (found.role === 'seller' ? 'Certified Agent' : found.role ? found.role.charAt(0).toUpperCase() + found.role.slice(1) : 'Property Specialist'),
              properties: Number.isFinite(Number(found.propertyCount)) ? `${found.propertyCount} Properties` : '15+ Properties',
              experience: found.experience || '5+ Years Experience',
              sold: found.sold || '120+ Properties Sold',
              rating: found.rating || '98% Client Satisfaction',
              clients: found.clients || '180+ Happy Clients',
              location: found.location || 'United States',
              email: found.email || '',
              phone: found.phone || '+1 555-0100',
              image: resolveUserAssetUrl(found.profilePicture || found.avatar) || defaultAgents[0].image,
              description: found.description || 'Verified real estate professional with a passion for helping clients navigate the property market and find their dream home.',
            };
            setAgent(formatted);
          } else if (active) {
            setAgent(defaultAgents[0]);
          }
        }
      } catch (err) {
        console.error('Error loading agent profile', err);
        if (active) setAgent(defaultAgents[0]);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadAgent();
    return () => { active = false; };
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validateField = (name, value) => {
    if (name === 'name') return validateName(value);
    if (name === 'email') return validateEmail(value);
    if (name === 'phone') return validatePhone(value);
    if (name === 'message') return validateMessage(value, { min: 5, max: 1000 });
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true, message: true });

    const { errors, hasError } = runValidators({
      name: () => validateName(contactForm.name),
      email: () => validateEmail(contactForm.email),
      phone: () => validatePhone(contactForm.phone),
      message: () => validateMessage(contactForm.message, { min: 5, max: 1000 }),
    });

    setFieldErrors(errors);
    if (hasError) return;

    setSending(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSubmitted(true);
      setContactForm(INITIAL_FORM);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <PageLoader label="Loading Agent Profile…" />;
  }

  if (!agent) {
    return null;
  }

  return (
    <div className="page-shell agent-page">
      <main className="page-content">
        <section className="agent-hero">
          <div className="agent-profile-card">
            <div className="agent-profile-top">
              <div className="agent-profile-image" style={{ backgroundImage: `url(${agent.image})` }} />
              <div>
                <p className="agent-badge">Verified Agent</p>
                <h1>{agent.name}</h1>
                <p>{agent.title}</p>
                <p className="agent-location">{agent.location}</p>
              </div>
            </div>

            <div className="agent-details">
              <p>{agent.description}</p>

              <div className="agent-stats">
                <div className="agent-stat">
                  <strong>{agent.experience?.split(' ')[0] || '5+'}</strong>
                  <span>{agent.experience?.substring(agent.experience.indexOf(' ') + 1) || 'Years Experience'}</span>
                </div>
                <div className="agent-stat">
                  <strong>{agent.sold?.split(' ')[0] || '100+'}</strong>
                  <span>{agent.sold?.substring(agent.sold.indexOf(' ') + 1) || 'Properties Sold'}</span>
                </div>
                <div className="agent-stat">
                  <strong>{agent.rating?.split(' ')[0] || '98%'}</strong>
                  <span>{agent.rating?.substring(agent.rating.indexOf(' ') + 1) || 'Satisfaction'}</span>
                </div>
                <div className="agent-stat">
                  <strong>{agent.clients?.split(' ')[0] || '150+'}</strong>
                  <span>{agent.clients?.substring(agent.clients.indexOf(' ') + 1) || 'Happy Clients'}</span>
                </div>
              </div>
            </div>
          </div>

          <aside className="agent-contact-card">
            <h2>Contact Agent</h2>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0', color: '#16a34a' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✓</div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#15803d' }}>Message Sent!</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569' }}>
                  Thank you! {agent.name.split(' ')[0]} will get back to you shortly.
                </p>
                <button
                  type="button"
                  className="button button-secondary"
                  style={{ marginTop: '1rem', width: '100%' }}
                  onClick={() => setSubmitted(false)}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    aria-label="Your Name"
                    value={contactForm.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={fieldErrors.name ? 'input-invalid' : touched.name && contactForm.name ? 'input-valid' : ''}
                  />
                  {fieldErrors.name && <span className="field-error" role="alert" style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '2px', display: 'block' }}>{fieldErrors.name}</span>}
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    aria-label="Your Email"
                    value={contactForm.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={fieldErrors.email ? 'input-invalid' : touched.email && contactForm.email ? 'input-valid' : ''}
                  />
                  {fieldErrors.email && <span className="field-error" role="alert" style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '2px', display: 'block' }}>{fieldErrors.email}</span>}
                </div>

                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    aria-label="Phone Number"
                    value={contactForm.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={fieldErrors.phone ? 'input-invalid' : touched.phone && contactForm.phone ? 'input-valid' : ''}
                  />
                  {fieldErrors.phone && <span className="field-error" role="alert" style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '2px', display: 'block' }}>{fieldErrors.phone}</span>}
                </div>

                <div>
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    aria-label="Your Message"
                    rows={4}
                    value={contactForm.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={fieldErrors.message ? 'input-invalid' : touched.message && contactForm.message ? 'input-valid' : ''}
                  />
                  {fieldErrors.message && <span className="field-error" role="alert" style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '2px', display: 'block' }}>{fieldErrors.message}</span>}
                </div>

                <button type="submit" className="button button-primary" disabled={sending}>
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}

            <div className="agent-contact-details">
              {agent.email && (
                <>
                  <p><strong>Email</strong></p>
                  <p>{agent.email}</p>
                </>
              )}
              {agent.phone && (
                <>
                  <p><strong>Phone</strong></p>
                  <p>{agent.phone}</p>
                </>
              )}
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
