import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { showToast } from '../../utils/featureState';

export default function Settings() {
  const shouldReduceMotion = useReducedMotion();
  const user = useSelector((state) => state.auth?.user) || { name: 'Agent User', email: 'agent@propertyhub.com' };
  
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [twoFactor, setTwoFactor] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast('Settings saved successfully.', 'success');
    }, 600);
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('All password fields are required.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Password updated successfully.', 'success');
    }, 800);
  };

  return (
    <div className="agent-settings-view">
      <motion.section
        className="dashboard-page-header"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div>
          <p className="dashboard-breadcrumb">Dashboard &gt; Settings</p>
          <h1>Account Settings</h1>
        </div>
      </motion.section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
        
        {/* Left Side: General preferences & Notification panel */}
        <motion.div
          className="wizard-card glass-panel"
          style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', margin: '0 0 1rem 0', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Notifications Settings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer', color: '#334155' }}>
                  <input 
                    type="checkbox" 
                    checked={emailNotifications} 
                    onChange={(e) => setEmailNotifications(e.target.checked)} 
                  />
                  Email alerts for new leads & appointments
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer', color: '#334155' }}>
                  <input 
                    type="checkbox" 
                    checked={smsNotifications} 
                    onChange={(e) => setSmsNotifications(e.target.checked)} 
                  />
                  SMS text alerts for urgent client messages
                </label>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', margin: '0 0 1rem 0', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Privacy & Listings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label htmlFor="settings-visibility-select" style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '600' }}>Agent Profile Visibility</label>
                <select 
                  id="settings-visibility-select"
                  value={profileVisibility} 
                  onChange={(e) => setProfileVisibility(e.target.value)}
                  style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%', fontSize: '0.9rem', outline: 'none' }}
                >
                  <option value="public">Visible to Public</option>
                  <option value="registered">Registered Users Only</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', margin: '0 0 1rem 0', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Security Policies</h3>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer', color: '#334155' }}>
                <input 
                  type="checkbox" 
                  checked={twoFactor} 
                  onChange={(e) => setTwoFactor(e.target.checked)} 
                />
                Enable Two-Factor Authentication (2FA)
              </label>
            </div>

            <button 
              type="submit" 
              className="button button-primary" 
              disabled={saving}
              style={{ width: 'fit-content', padding: '0.6rem 1.5rem', fontSize: '0.85rem' }}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </motion.div>

        {/* Right Side: Password Panel */}
        <motion.div
          className="wizard-card glass-panel"
          style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', margin: '0 0 1.25rem 0', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Update Password</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label htmlFor="settings-current-password" style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '600' }}>Current Password</label>
              <input 
                id="settings-current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label htmlFor="settings-new-password" style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '600' }}>New Password</label>
              <input 
                id="settings-new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label htmlFor="settings-confirm-password" style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '600' }}>Confirm New Password</label>
              <input 
                id="settings-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>

            <button 
              type="submit" 
              className="button button-primary" 
              disabled={saving}
              style={{ width: 'fit-content', padding: '0.6rem 1.5rem', fontSize: '0.85rem', marginTop: '0.5rem' }}
            >
              Update Password
            </button>
          </form>
        </motion.div>

      </div>
    </div>
  );
}
