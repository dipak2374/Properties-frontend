import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/home.css';
import '../../styles/pages.css';
import { validateEmail, validateName, validatePhone, validateMessage, runValidators } from '../../utils/validate';
import { postContactMessage } from '../../services/contactService';

function AnimatedStat({ value, suffix = '', label }) {
  const shouldReduceMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const displayValue = useTransform(motionValue, (current) => `${Math.round(current).toLocaleString()}${suffix}`);

  useEffect(() => {
    if (shouldReduceMotion) {
      motionValue.set(value);
      return undefined;
    }

    const controls = animate(motionValue, value, { duration: 1.15, ease: 'easeOut' });
    return controls.stop;
  }, [motionValue, shouldReduceMotion, value]);

  return (
    <div className="contact-stat">
      <motion.strong>{displayValue}</motion.strong>
      <span>{label}</span>
    </div>
  );
}

const INITIAL_FORM = { name: '', email: '', phone: '', message: '' };
const INITIAL_ERRORS = { name: '', email: '', phone: '', message: '' };
const INITIAL_TOUCHED = { name: false, email: false, phone: false, message: false };
const MESSAGE_MAX = 1000;

export default function Contact() {
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState(INITIAL_ERRORS);
  const [touched, setTouched] = useState(INITIAL_TOUCHED);
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleBookConsultation = () => {
    navigate('/appointment');
  };

  const validateField = (name, value) => {
    if (name === 'name') return validateName(value);
    if (name === 'email') return validateEmail(value);
    if (name === 'phone') return validatePhone(value);
    if (name === 'message') return validateMessage(value, { min: 10, max: MESSAGE_MAX });
    return '';
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    if (touched[name]) {
      setFieldErrors((current) => ({ ...current, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setTouched((current) => ({ ...current, [name]: true }));
    setFieldErrors((current) => ({ ...current, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError('');
    setTouched({ name: true, email: true, phone: true, message: true });

    const { errors, hasError } = runValidators({
      name: () => validateName(formData.name),
      email: () => validateEmail(formData.email),
      phone: () => validatePhone(formData.phone),
      message: () => validateMessage(formData.message, { min: 10, max: MESSAGE_MAX }),
    });
    setFieldErrors(errors);
    if (hasError) return;

    setSending(true);
    try {
      await postContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
      });
      setSubmitted(true);
      setFormData(INITIAL_FORM);
      setTouched(INITIAL_TOUCHED);
    } catch {
      setServerError('Unable to send your message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const inputClass = (field) => {
    if (fieldErrors[field]) return 'input-invalid';
    if (touched[field] && formData[field]) return 'input-valid';
    return '';
  };

  const messageLen = formData.message.trim().length;
  const counterClass = messageLen > MESSAGE_MAX ? 'char-counter char-over' : messageLen > MESSAGE_MAX * 0.85 ? 'char-counter char-warn' : 'char-counter';

  return (
    <div className="page-shell contact-page">
      <main className="main-hero">
        <motion.section className="page-head contact-head" initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42 }}>
          <div>
            <p className="breadcrumb">Home / Contact</p>
            <h1>Contact PropertyHub</h1>
            <p>Reach our team for property inquiries, support, or personalized assistance. We're here to help you buy, sell, or rent with confidence.</p>
          </div>
          <motion.button type="button" className="button button-primary" onClick={scrollToForm} whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }} whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}>Request Support</motion.button>
          <p>Tell us about your property needs and one of our experts will respond shortly.</p>
        </motion.section>

        <section className="contact-panel">
          <motion.div className="contact-form-panel" initial={shouldReduceMotion ? false : { opacity: 0, x: -18 }} whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.42 }} ref={formRef}>
            {submitted ? (
              <motion.div
                className="form-success"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <div className="form-success-icon">✓</div>
                <h3>Message sent!</h3>
                <p>Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                <button
                  type="button"
                  className="button button-secondary"
                  style={{ marginTop: '0.5rem' }}
                  onClick={() => setSubmitted(false)}
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div className="field-group">
                  <motion.input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    aria-label="Full Name"
                    aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
                    aria-invalid={Boolean(fieldErrors.name)}
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputClass('name')}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08, duration: 0.3 }}
                  />
                  {fieldErrors.name && (
                    <span id="contact-name-error" className="field-error" role="alert">{fieldErrors.name}</span>
                  )}
                </div>

                <div className="field-group">
                  <motion.input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    aria-label="Email Address"
                    aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
                    aria-invalid={Boolean(fieldErrors.email)}
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputClass('email')}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12, duration: 0.3 }}
                  />
                  {fieldErrors.email && (
                    <span id="contact-email-error" className="field-error" role="alert">{fieldErrors.email}</span>
                  )}
                </div>

                <div className="field-group">
                  <motion.input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    aria-label="Phone Number"
                    aria-describedby={fieldErrors.phone ? 'contact-phone-error' : undefined}
                    aria-invalid={Boolean(fieldErrors.phone)}
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputClass('phone')}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.16, duration: 0.3 }}
                  />
                  {fieldErrors.phone && (
                    <span id="contact-phone-error" className="field-error" role="alert">{fieldErrors.phone}</span>
                  )}
                </div>

                <div className="field-group">
                  <motion.textarea
                    name="message"
                    placeholder="Your Message"
                    aria-label="Your Message"
                    aria-describedby={fieldErrors.message ? 'contact-message-error' : undefined}
                    aria-invalid={Boolean(fieldErrors.message)}
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputClass('message')}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  />
                  <span className={counterClass}>{messageLen} / {MESSAGE_MAX}</span>
                  {fieldErrors.message && (
                    <span id="contact-message-error" className="field-error" role="alert">{fieldErrors.message}</span>
                  )}
                </div>

                {serverError && (
                  <motion.p className="auth-error" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
                    {serverError}
                  </motion.p>
                )}

                <motion.button
                  type="submit"
                  className="button button-primary"
                  disabled={sending}
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                >
                  {sending ? 'Sending...' : 'Send Message'}
                </motion.button>
              </form>
            )}
          </motion.div>

          <div className="contact-details-panel">
            {[{ title: 'Office Address', text: '123 Real Estate St, New York, NY 10001, USA' }, { title: 'Email Address', text: 'info@propertyhub.com' }, { title: 'Phone Number', text: '+1 (212) 555-0189' }, { title: 'Working Hours', text: 'Mon - Sat: 9:00 AM - 6:00 PM' }].map((item, index) => (
              <motion.div key={item.title} className={`contact-card${index === 0 ? ' contact-card-primary' : ''}`} initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }} whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.06, duration: 0.35 }}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <motion.section className="contact-cta" initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }} whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.38 }}>
          <div>
            <h3>Need a tailored property strategy?</h3>
            <p>Our advisors can help you compare neighborhoods, clarify pricing, and plan the next step in your property journey.</p>
          </div>
          <button type="button" className="button button-secondary" onClick={handleBookConsultation}>Book a Consultation</button>
          <AnimatedStat value={1500} suffix="+" label="Deals Completed" />
          <AnimatedStat value={10} suffix="+" label="Years of Experience" />
        </motion.section>
      </main>
    </div>
  );
}
