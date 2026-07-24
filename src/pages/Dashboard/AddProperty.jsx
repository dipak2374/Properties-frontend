import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../../utils/featureState';
import { createProperty } from '../../services/propertyService';
import '../../styles/dashboard.css';

const STEPS = [
  'Basic Information',
  'Location',
  'Property Details',
  'Amenities',
  'Images & Media',
  'Pricing',
  'Documents',
  'SEO',
  'Review & Submit',
];

const INITIAL_FORM = {
  title: '',
  propertyType: 'Apartment',
  listingType: 'Sale',
  status: 'Ready to Move',
  propertyId: '',
  description: '',
  featured: false,
  country: 'United States',
  state: '',
  city: '',
  area: '',
  address: '',
  zipCode: '',
  latitude: '',
  longitude: '',
  nearbySchools: '',
  nearbyHospital: '',
  nearbyMetro: '',
  walkScore: '85',
  bedrooms: 2,
  bathrooms: 2,
  balconies: 1,
  kitchens: 1,
  parking: 1,
  superArea: '',
  carpetArea: '',
  plotArea: '',
  floorNumber: '',
  totalFloors: '',
  propertyAge: '',
  facing: 'East',
  furnished: 'Semi Furnished',
  availabilityDate: '',
  possessionDate: '',
  constructionYear: '',
  ownership: 'Freehold',
  amenities: [],
  images: [],
  youtubeUrl: '',
  virtualTourUrl: '',
  price: '',
  pricePerSqFt: '',
  maintenance: '',
  bookingAmount: '',
  propertyTax: '',
  monthlyRent: '',
  securityDeposit: '',
  seoTitle: '',
  seoDescription: '',
  seoSlug: '',
  focusKeyword: '',
};

const AMENITIES_LIST = [
  { name: 'Swimming Pool', icon: '🏊‍♂️' },
  { name: 'Gym', icon: '🏋️‍♂️' },
  { name: 'Garden', icon: '🌳' },
  { name: 'Lift', icon: '🛗' },
  { name: 'Power Backup', icon: '⚡' },
  { name: 'Club House', icon: '🏢' },
  { name: 'Kids Play Area', icon: '🧸' },
  { name: 'Jogging Track', icon: '🏃‍♂️' },
  { name: 'Fire Safety', icon: '🧯' },
  { name: 'CCTV', icon: '📹' },
  { name: 'Security', icon: '👮‍♂️' },
  { name: 'Visitor Parking', icon: '🚗' },
  { name: 'WiFi', icon: '📶' },
  { name: 'Pet Friendly', icon: '🐾' },
  { name: 'Smart Home', icon: '📱' },
  { name: 'EV Charging', icon: '🔋' },
  { name: 'Air Conditioning', icon: '❄️' },
  { name: 'Library', icon: '📚' },
  { name: 'Party Hall', icon: '🎉' },
  { name: 'Rooftop Garden', icon: '🌱' },
];

export default function AddProperty() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth?.user);
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('propertyhub_draft_property');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_FORM; }
    }
    return { ...INITIAL_FORM, propertyId: `PROP-${Math.floor(100000 + Math.random() * 90000) }` };
  });

  // Autosave setup
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem('propertyhub_draft_property', JSON.stringify(formData));
      showToast('Draft auto-saved successfully.', 'success');
    }, 30000);
    return () => clearInterval(interval);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleManualChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAmenity = (name) => {
    setFormData((prev) => {
      const amenities = prev.amenities.includes(name)
        ? prev.amenities.filter((a) => a !== name)
        : [...prev.amenities, name];
      return { ...prev, amenities };
    });
  };

  const handleImageUpload = () => {
    const mockImages = [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=600&q=80',
    ];
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, mockImages[prev.images.length % mockImages.length]],
    }));
    showToast('Mock image added to listing.', 'success');
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const generateAITitle = () => {
    const type = formData.propertyType;
    const city = formData.city || 'New York';
    const beds = formData.bedrooms;
    const design = ['Stunning', 'Modern', 'Premium', 'Cozy', 'Luxurious'];
    const chosenDesign = design[Math.floor(Math.random() * design.length)];
    const title = `${chosenDesign} ${beds} Bed ${type} in ${city}`;
    handleManualChange('title', title);
    showToast('AI title generated.', 'success');
  };

  const generateAIDescription = () => {
    const type = formData.propertyType;
    const city = formData.city || 'New York';
    const beds = formData.bedrooms;
    const desc = `Welcome to this premium ${beds}-bedroom ${type.toLowerCase()} located in the heart of ${city}. Perfect for families or professionals seeking modern convenience, it features spacious interiors, beautiful natural lighting, and top-tier finishes throughout. Nearby access to transit and premier shopping makes this a highly desirable opportunity.`;
    handleManualChange('description', desc);
    showToast('AI description generated.', 'success');
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.title) {
      showToast('Please add a property title before publishing.', 'error');
      setCurrentStep(0);
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price) || 0,
        propertyType: formData.propertyType,
        listingType: formData.listingType,
        status: formData.listingType === 'Rent' ? 'Rented' : 'Available',
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        areaSqFt: Number(formData.superArea) || 0,
        amenities: formData.amenities,
        images: formData.images,
        location: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        owner: user?.id || null,
      };

      await createProperty(payload);
      localStorage.removeItem('propertyhub_draft_property');
      showToast('Property published and saved to your listings!', 'success');
      navigate('/dashboard');
    } catch (error) {
      showToast(error?.response?.data?.message || 'Unable to save property. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const progressPercentage = Math.round(((currentStep + 1) / STEPS.length) * 100);

  return (
    <div className="add-property-container">
      <div className="dashboard-page-header">
        <p className="dashboard-breadcrumb">Dashboard &gt; My Properties &gt; Add Property</p>
        <h1>Add New Property</h1>
      </div>

      {/* stepper progress wizard */}
      <div className="wizard-stepper-wrap">
        <div className="wizard-stepper">
          <div className="stepper-progress-bar">
            <div className="stepper-progress-fill" style={{ width: `${((currentStep) / (STEPS.length - 1)) * 100}%` }} />
          </div>
          {STEPS.map((step, index) => (
            <div
              key={step}
              className={`stepper-node ${index === currentStep ? 'active' : index < currentStep ? 'completed' : ''}`}
              onClick={() => setCurrentStep(index)}
            >
              <div className="stepper-node-circle">{index < currentStep ? '✓' : index + 1}</div>
              <span className="stepper-node-label">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main split grid */}
      <div className="add-property-layout">
        {/* Left Form Panel */}
        <div className="wizard-card-wrap">
          <div className="wizard-card">
            <h2>{STEPS[currentStep]}</h2>
            <p className="wizard-card-subtitle">Please complete the details below. Step {currentStep + 1} of {STEPS.length} ({progressPercentage}% completed)</p>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
              >
                {/* STEP 1: Basic Information */}
                {currentStep === 0 && (
                  <div className="form-section-grid">
                    <div className="dashboard-form-group form-grid-span-2">
                      <label htmlFor="prop-title">Property Title</label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                          id="prop-title"
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="e.g. Luxurious Apartment with View"
                          className="dashboard-input"
                          style={{ flexGrow: 1 }}
                        />
                        <button type="button" onClick={generateAITitle} className="ai-helper-btn">✨ AI Title</button>
                      </div>
                    </div>

                    <div className="dashboard-form-group">
                      <label htmlFor="prop-type">Property Type</label>
                      <select id="prop-type" name="propertyType" value={formData.propertyType} onChange={handleChange} className="dashboard-input">
                        <option>Apartment</option>
                        <option>Villa</option>
                        <option>House</option>
                        <option>Office</option>
                        <option>Commercial</option>
                        <option>Land</option>
                      </select>
                    </div>

                    <div className="dashboard-form-group">
                      <label htmlFor="listing-type">Listing Type</label>
                      <select id="listing-type" name="listingType" value={formData.listingType} onChange={handleChange} className="dashboard-input">
                        <option>Sale</option>
                        <option>Rent</option>
                        <option>PG</option>
                        <option>Lease</option>
                      </select>
                    </div>

                    <div className="dashboard-form-group">
                      <label htmlFor="prop-status">Property Status</label>
                      <select id="prop-status" name="status" value={formData.status} onChange={handleChange} className="dashboard-input">
                        <option>Ready to Move</option>
                        <option>Under Construction</option>
                        <option>New Launch</option>
                      </select>
                    </div>

                    <div className="dashboard-form-group">
                      <label htmlFor="prop-id">Property ID (Auto Generated)</label>
                      <input id="prop-id" type="text" name="propertyId" value={formData.propertyId} readOnly className="dashboard-input" style={{ backgroundColor: '#f1f5f9' }} />
                    </div>

                    <div className="dashboard-form-group form-grid-span-2">
                      <label htmlFor="prop-desc">Description</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <textarea
                          id="prop-desc"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Describe the property highlights, amenities, and community details..."
                          className="dashboard-input"
                          style={{ height: '140px', resize: 'vertical' }}
                        />
                        <div>
                          <button type="button" onClick={generateAIDescription} className="ai-helper-btn">✨ AI Description</button>
                        </div>
                      </div>
                    </div>

                    <div className="dashboard-form-group form-grid-span-2">
                      <label className="switch-label">
                        <span>Featured Property</span>
                        <div className="switch-control">
                          <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
                          <span className="switch-slider" />
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* STEP 2: Location */}
                {currentStep === 1 && (
                  <div className="form-section-grid">
                    <div className="dashboard-form-group">
                      <label htmlFor="loc-country">Country</label>
                      <input id="loc-country" type="text" name="country" value={formData.country} onChange={handleChange} className="dashboard-input" />
                    </div>
                    <div className="dashboard-form-group">
                      <label htmlFor="loc-state">State</label>
                      <input id="loc-state" type="text" name="state" value={formData.state} onChange={handleChange} placeholder="New York" className="dashboard-input" />
                    </div>
                    <div className="dashboard-form-group">
                      <label htmlFor="loc-city">City</label>
                      <input id="loc-city" type="text" name="city" value={formData.city} onChange={handleChange} placeholder="New York City" className="dashboard-input" />
                    </div>
                    <div className="dashboard-form-group">
                      <label htmlFor="loc-area">Area</label>
                      <input id="loc-area" type="text" name="area" value={formData.area} onChange={handleChange} placeholder="Manhattan" className="dashboard-input" />
                    </div>
                    <div className="dashboard-form-group form-grid-span-2">
                      <label htmlFor="loc-addr">Address</label>
                      <input id="loc-addr" type="text" name="address" value={formData.address} onChange={handleChange} placeholder="123 Luxury Ave" className="dashboard-input" />
                    </div>
                    <div className="dashboard-form-group">
                      <label htmlFor="loc-zip">Zip Code</label>
                      <input id="loc-zip" type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="10001" className="dashboard-input" />
                    </div>
                    <div className="dashboard-form-group">
                      <label htmlFor="loc-walk">Walk Score</label>
                      <input id="loc-walk" type="text" name="walkScore" value={formData.walkScore} onChange={handleChange} className="dashboard-input" />
                    </div>
                  </div>
                )}

                {/* STEP 3: Property Details */}
                {currentStep === 2 && (
                  <div>
                    <div className="counters-grid">
                      <div className="counter-item">
                        <label>Bedrooms</label>
                        <div className="counter-controls">
                          <button type="button" className="counter-btn" onClick={() => handleManualChange('bedrooms', Math.max(0, formData.bedrooms - 1))}>-</button>
                          <span className="counter-value">{formData.bedrooms}</span>
                          <button type="button" className="counter-btn" onClick={() => handleManualChange('bedrooms', formData.bedrooms + 1)}>+</button>
                        </div>
                      </div>

                      <div className="counter-item">
                        <label>Bathrooms</label>
                        <div className="counter-controls">
                          <button type="button" className="counter-btn" onClick={() => handleManualChange('bathrooms', Math.max(0, formData.bathrooms - 1))}>-</button>
                          <span className="counter-value">{formData.bathrooms}</span>
                          <button type="button" className="counter-btn" onClick={() => handleManualChange('bathrooms', formData.bathrooms + 1)}>+</button>
                        </div>
                      </div>

                      <div className="counter-item">
                        <label>Balconies</label>
                        <div className="counter-controls">
                          <button type="button" className="counter-btn" onClick={() => handleManualChange('balconies', Math.max(0, formData.balconies - 1))}>-</button>
                          <span className="counter-value">{formData.balconies}</span>
                          <button type="button" className="counter-btn" onClick={() => handleManualChange('balconies', formData.balconies + 1)}>+</button>
                        </div>
                      </div>

                      <div className="counter-item">
                        <label>Parking Spaces</label>
                        <div className="counter-controls">
                          <button type="button" className="counter-btn" onClick={() => handleManualChange('parking', Math.max(0, formData.parking - 1))}>-</button>
                          <span className="counter-value">{formData.parking}</span>
                          <button type="button" className="counter-btn" onClick={() => handleManualChange('parking', formData.parking + 1)}>+</button>
                        </div>
                      </div>
                    </div>

                    <div className="form-section-grid">
                      <div className="dashboard-form-group">
                        <label htmlFor="det-super">Super Area (Sq Ft)</label>
                        <input id="det-super" type="text" name="superArea" value={formData.superArea} onChange={handleChange} placeholder="e.g. 1500" className="dashboard-input" />
                      </div>
                      <div className="dashboard-form-group">
                        <label htmlFor="det-carpet">Carpet Area (Sq Ft)</label>
                        <input id="det-carpet" type="text" name="carpetArea" value={formData.carpetArea} onChange={handleChange} placeholder="e.g. 1200" className="dashboard-input" />
                      </div>
                      <div className="dashboard-form-group">
                        <label htmlFor="det-facing">Facing Direction</label>
                        <select id="det-facing" name="facing" value={formData.facing} onChange={handleChange} className="dashboard-input">
                          <option>East</option>
                          <option>West</option>
                          <option>North</option>
                          <option>South</option>
                        </select>
                      </div>
                      <div className="dashboard-form-group">
                        <label htmlFor="det-furn">Furnished Status</label>
                        <select id="det-furn" name="furnished" value={formData.furnished} onChange={handleChange} className="dashboard-input">
                          <option>Unfurnished</option>
                          <option>Semi Furnished</option>
                          <option>Fully Furnished</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: Amenities */}
                {currentStep === 3 && (
                  <div className="amenities-selection-grid">
                    {AMENITIES_LIST.map((item) => {
                      const isSelected = formData.amenities.includes(item.name);
                      return (
                        <div
                          key={item.name}
                          onClick={() => toggleAmenity(item.name)}
                          className={`amenity-select-card ${isSelected ? 'selected' : ''}`}
                        >
                          <span className="amenity-icon">{item.icon}</span>
                          <span className="amenity-label">{item.name}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* STEP 5: Images & Media */}
                {currentStep === 4 && (
                  <div>
                    <div className="media-upload-area" onClick={handleImageUpload}>
                      <span className="upload-icon">📸</span>
                      <h3>Drag &amp; drop images here or click to upload</h3>
                      <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Supports PNG, JPG (maximum 5MB per image)</p>
                    </div>

                    {formData.images.length > 0 && (
                      <div className="media-gallery-preview">
                        {formData.images.map((img, index) => (
                          <div
                            key={`${img}-${index}`}
                            className="gallery-preview-item"
                            style={{ backgroundImage: `url(${img})` }}
                          >
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                              className="remove-media-btn"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="form-section-grid" style={{ marginTop: '2rem' }}>
                      <div className="dashboard-form-group">
                        <label htmlFor="med-yt">YouTube Video URL</label>
                        <input id="med-yt" type="text" name="youtubeUrl" value={formData.youtubeUrl} onChange={handleChange} placeholder="https://youtube.com/watch?v=..." className="dashboard-input" />
                      </div>
                      <div className="dashboard-form-group">
                        <label htmlFor="med-vt">360 Virtual Tour URL</label>
                        <input id="med-vt" type="text" name="virtualTourUrl" value={formData.virtualTourUrl} onChange={handleChange} placeholder="https://my.matterport.com/show/?m=..." className="dashboard-input" />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 6: Pricing */}
                {currentStep === 5 && (
                  <div className="form-section-grid">
                    <div className="dashboard-form-group">
                      <label htmlFor="pr-price">Property Price ($)</label>
                      <input id="pr-price" type="number" name="price" value={formData.price} onChange={handleChange} placeholder="550000" className="dashboard-input" />
                    </div>
                    <div className="dashboard-form-group">
                      <label htmlFor="pr-price-sq">Price per Sq Ft ($)</label>
                      <input id="pr-price-sq" type="number" name="pricePerSqFt" value={formData.pricePerSqFt} onChange={handleChange} placeholder="350" className="dashboard-input" />
                    </div>
                    <div className="dashboard-form-group">
                      <label htmlFor="pr-maint">Maintenance Charges ($)</label>
                      <input id="pr-maint" type="number" name="maintenance" value={formData.maintenance} onChange={handleChange} placeholder="250" className="dashboard-input" />
                    </div>
                    <div className="dashboard-form-group">
                      <label htmlFor="pr-tax">Property Tax ($)</label>
                      <input id="pr-tax" type="number" name="propertyTax" value={formData.propertyTax} onChange={handleChange} placeholder="1200" className="dashboard-input" />
                    </div>
                  </div>
                )}

                {/* STEP 7: Documents */}
                {currentStep === 6 && (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <span style={{ fontSize: '3rem' }}>📄</span>
                    <h3>Legal Documents Upload</h3>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Upload ownership proof, title deeds, NOC, or layout approvals here.</p>
                    <button type="button" className="button button-secondary" onClick={() => showToast('Mock document uploaded successfully.', 'success')}>Upload PDF / File</button>
                  </div>
                )}

                {/* STEP 8: SEO */}
                {currentStep === 7 && (
                  <div className="form-section-grid">
                    <div className="dashboard-form-group form-grid-span-2">
                      <label htmlFor="seo-t">SEO Title</label>
                      <input id="seo-t" type="text" name="seoTitle" value={formData.seoTitle} onChange={handleChange} placeholder="Stunning Apartment in Manhattan | PropertyHub" className="dashboard-input" />
                    </div>
                    <div className="dashboard-form-group form-grid-span-2">
                      <label htmlFor="seo-d">Meta Description</label>
                      <textarea id="seo-d" name="seoDescription" value={formData.seoDescription} onChange={handleChange} placeholder="View details, prices, floor plans, and amenities of this property..." className="dashboard-input" style={{ height: '80px' }} />
                    </div>
                    <div className="dashboard-form-group">
                      <label htmlFor="seo-s">Slug</label>
                      <input id="seo-s" type="text" name="seoSlug" value={formData.seoSlug} onChange={handleChange} placeholder="luxurious-manhattan-apartment" className="dashboard-input" />
                    </div>
                    <div className="dashboard-form-group">
                      <label htmlFor="seo-kw">Focus Keyword</label>
                      <input id="seo-kw" type="text" name="focusKeyword" value={formData.focusKeyword} onChange={handleChange} placeholder="apartment Manhattan" className="dashboard-input" />
                    </div>
                  </div>
                )}

                {/* STEP 9: Review & Submit */}
                {currentStep === 8 && (
                  <div style={{ padding: '1rem 0' }}>
                    <h3>Review Listing Details</h3>
                    <p style={{ color: '#64748b', marginBottom: '2rem' }}>Please make sure all information matches your official documents before submitting.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.9rem' }}>
                      <p><strong>Title:</strong> {formData.title || 'Untitled Property'}</p>
                      <p><strong>Location:</strong> {formData.address ? `${formData.address}, ${formData.city}` : 'No location specified'}</p>
                      <p><strong>Price:</strong> {formData.price ? `$${Number(formData.price).toLocaleString()}` : 'Contact Agent'}</p>
                      <p><strong>Amenities selected:</strong> {formData.amenities.length > 0 ? formData.amenities.join(', ') : 'None'}</p>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                      <button type="button" onClick={handleSubmit} disabled={submitting} className="button button-primary" style={{ width: '100%' }}>{submitting ? 'Publishing...' : 'Publish Property Listing'}</button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Bottom Nav Buttons */}
            <div className="wizard-bottom-nav">
              <button type="button" onClick={handlePrev} disabled={currentStep === 0} className="button button-secondary">Previous Step</button>
              <div className="wizard-btn-grp">
                <button type="button" onClick={() => showToast('Draft saved successfully.', 'success')} className="button button-secondary">Save Draft</button>
                {currentStep < STEPS.length - 1 ? (
                  <button type="button" onClick={handleNext} className="button button-primary">Next Step</button>
                ) : (
                  <button type="button" onClick={handleSubmit} disabled={submitting} className="button button-primary">{submitting ? 'Publishing...' : 'Publish Property'}</button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sticky Preview */}
        <aside className="sticky-preview-panel">
          <h3>Live Preview <span>Step {currentStep + 1}</span></h3>
          <div className="live-preview-card">
            <div
              className="live-preview-img"
              style={{
                backgroundImage: `url(${formData.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'})`,
              }}
            >
              <span className="live-preview-tag">{formData.listingType}</span>
            </div>
            <div className="live-preview-body">
              <h4 className="live-preview-price">{formData.price ? `$${Number(formData.price).toLocaleString()}` : '$0'}</h4>
              <h5 className="live-preview-title">{formData.title || 'Untitled Property'}</h5>
              <p className="live-preview-location">📍 {formData.city ? `${formData.city}, ${formData.state || ''}` : 'No City Entered'}</p>
              <div className="live-preview-details">
                <span>🛏️ {formData.bedrooms} Beds</span>
                <span>🚿 {formData.bathrooms} Baths</span>
                <span>📏 {formData.superArea || '0'} Sq Ft</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
