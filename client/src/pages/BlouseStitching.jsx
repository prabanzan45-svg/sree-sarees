import React, { useState, useRef } from 'react';
import { Scissors, CheckCircle, Info, Sparkles, Ruler, Clock, MessageSquare, AlertCircle, Calendar, Phone, User, HelpCircle, ArrowDown, ChevronRight } from 'lucide-react';
import api from '../services/api';

const BlouseStitching = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    materialProvided: 'yes',
    preferredColourAndMaterial: '',
    needMeasurementAssistance: false,
    measurements: {
      bust: '',
      waist: '',
      shoulder: '',
      armHole: '',
      blouseLength: '',
      sleeveLength: ''
    },
    neckline: 'Classic Round Neck',
    sleeveStyle: 'Elbow Length Sleeves (Most Popular)',
    backDesign: 'Deep U-Neck with Dori & Tassels',
    additionalInstructions: '',
    preferredCompletionDate: ''
  });

  const [formVisible, setFormVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successResult, setSuccessResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const formRef = useRef(null);

  const handleOpenForm = () => {
    setFormVisible(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMeasurementChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.customerName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    const cleanPhone = formData.customerPhone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit WhatsApp mobile number.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        customerName: formData.customerName.trim(),
        customerPhone: cleanPhone,
        customerEmail: formData.customerEmail.trim(),
        materialProvided: formData.materialProvided,
        preferredColourAndMaterial: formData.preferredColourAndMaterial.trim(),
        needMeasurementAssistance: formData.needMeasurementAssistance,
        measurements: formData.measurements,
        neckline: formData.neckline,
        sleeveStyle: formData.sleeveStyle,
        backDesign: formData.backDesign,
        specialInstructions: formData.additionalInstructions.trim(),
        preferredCompletionDate: formData.preferredCompletionDate
      };

      const res = await api.post('/enquiries/blouse', payload);
      if (res.data.success) {
        setSuccessResult(res.data);
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        setErrorMsg(res.data.message || 'Failed to submit enquiry.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Server error submitting enquiry. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccessResult(null);
    setFormData({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      materialProvided: 'yes',
      preferredColourAndMaterial: '',
      needMeasurementAssistance: false,
      measurements: {
        bust: '',
        waist: '',
        shoulder: '',
        armHole: '',
        blouseLength: '',
        sleeveLength: ''
      },
      neckline: 'Classic Round Neck',
      sleeveStyle: 'Elbow Length Sleeves (Most Popular)',
      backDesign: 'Deep U-Neck with Dori & Tassels',
      additionalInstructions: '',
      preferredCompletionDate: ''
    });
  };

  return (
    <div className="min-h-screen bg-boutique-cream py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Hero Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-boutique-gold/30 shadow-md text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-boutique-goldLight/25 border border-boutique-gold/40 text-boutique-maroon text-xs font-semibold uppercase tracking-wider">
            <Scissors className="w-3.5 h-3.5" />
            <span>Master Tailoring Service</span>
          </div>

          <div className="space-y-3">
            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-boutique-maroon tracking-tight">
              Blouse Stitching
            </h1>
            <p className="text-base sm:text-lg text-boutique-muted font-sans max-w-2xl mx-auto leading-relaxed">
              Get your blouse stitched according to your preferred design, measurements, and requirements.
            </p>
          </div>

          {/* Attractive Traditional Blouse Tailoring Image */}
          <div className="relative max-w-2xl mx-auto rounded-2xl overflow-hidden border-2 border-boutique-gold/40 shadow-lg group">
            <img
              src="/images/blouse/tailoring-service.jpg"
              alt="Traditional Blouse Tailoring & Stitching Service"
              className="w-full h-72 sm:h-96 object-cover object-center group-hover:scale-102 transition-transform duration-500"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-boutique-charcoal/70 via-transparent to-transparent flex items-end p-6">
              <div className="text-left text-white">
                <p className="font-serif text-lg font-bold">Artisanal Fit & Heritage Finishes</p>
                <p className="text-xs text-boutique-cream/90">Custom cut, pure cotton lining, hand piping, and master finishing.</p>
              </div>
            </div>
          </div>

          {/* Mandatory Transparent Pricing Message */}
          <div className="bg-boutique-goldLight/15 border border-boutique-gold/40 p-4 rounded-2xl max-w-2xl mx-auto text-left flex items-start space-x-3">
            <Info className="w-5 h-5 text-boutique-maroon flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-boutique-charcoal leading-relaxed">
              <strong>Stitching charges depend on your selected design and requirements.</strong> Submit your enquiry, and our team will contact you to discuss the price and next steps.
            </p>
          </div>

          {/* Call to Action Button */}
          <div>
            <button
              onClick={handleOpenForm}
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full bg-boutique-maroon hover:bg-boutique-maroonDark text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Scissors className="w-4 h-4 text-boutique-gold" />
              <span>Submit Stitching Enquiry</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Enquiry Form Anchor */}
        <div ref={formRef}>
          {formVisible && (
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-boutique-gold/30 shadow-md space-y-8 animate-fadeIn">
              
              {successResult ? (
                /* Success State */
                <div className="text-center py-8 space-y-6 max-w-xl mx-auto">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl font-bold text-boutique-maroon">
                      Blouse Stitching Enquiry Submitted!
                    </h3>
                    <p className="text-xs text-boutique-muted">
                      Enquiry Reference ID: <span className="font-mono font-bold text-boutique-charcoal text-sm">{successResult.enquiryId}</span>
                    </p>
                  </div>

                  <div className="bg-boutique-cream p-5 rounded-2xl border border-boutique-gold/30 text-xs text-boutique-charcoal leading-relaxed text-left space-y-2.5">
                    <p className="font-semibold text-boutique-maroon text-sm flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-boutique-gold" />
                      <span>Next Steps with Sree Sarees Master Tailor</span>
                    </p>
                    <p>• <strong>Tailor Review:</strong> Our master tailor will inspect your submitted preferences ({formData.neckline}, {formData.sleeveStyle}, {formData.backDesign}).</p>
                    <p>• <strong>Personalized Quotation:</strong> We will call or WhatsApp you at <strong>+91 {formData.customerPhone}</strong> to discuss the exact stitching charges and material handover.</p>
                    <p>• <strong>Measurement Assistance:</strong> {formData.needMeasurementAssistance ? 'As requested, our tailor will guide you step-by-step for accurate measurements.' : 'Your measurements are registered for custom cutting.'}</p>
                    <p>• <strong>Timely Delivery:</strong> After quotation confirmation, your custom blouse will be stitched and delivered with precision.</p>
                  </div>

                  <button
                    onClick={resetForm}
                    className="px-6 py-2.5 rounded-full bg-boutique-maroon text-white text-xs font-semibold hover:bg-boutique-maroonDark transition-all cursor-pointer"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              ) : (
                /* Interactive Enquiry Form */
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="border-b border-boutique-gold/20 pb-4">
                    <h2 className="font-serif text-2xl font-bold text-boutique-maroon">
                      Submit Your Stitching Enquiry
                    </h2>
                    <p className="text-xs text-boutique-muted mt-1">
                      Please enter your contact details, material status, preferred style, and measurements.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Section 1: Customer Contact Details */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-boutique-charcoal uppercase tracking-wider flex items-center space-x-2">
                      <User className="w-4 h-4 text-boutique-gold" />
                      <span>1. Customer Details</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-boutique-charcoal mb-1">
                          Customer Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="customerName"
                          value={formData.customerName}
                          onChange={handleChange}
                          placeholder="e.g. Priyadarshini Devi"
                          required
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-boutique-gold/40 focus:outline-none focus:ring-2 focus:ring-boutique-maroon/20"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-boutique-charcoal mb-1">
                          Contact Number (WhatsApp) <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-2.5 text-xs text-boutique-muted font-mono">+91</span>
                          <input
                            type="tel"
                            name="customerPhone"
                            value={formData.customerPhone}
                            onChange={handleChange}
                            placeholder="9876543210"
                            maxLength={10}
                            required
                            className="w-full pl-12 pr-3.5 py-2.5 text-xs rounded-xl border border-boutique-gold/40 focus:outline-none focus:ring-2 focus:ring-boutique-maroon/20 font-mono"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-boutique-charcoal mb-1">
                          Email Address <span className="text-boutique-muted font-normal">(Optional, for quotation invoice copy)</span>
                        </label>
                        <input
                          type="email"
                          name="customerEmail"
                          value={formData.customerEmail}
                          onChange={handleChange}
                          placeholder="e.g. customer@example.com"
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-boutique-gold/40 focus:outline-none focus:ring-2 focus:ring-boutique-maroon/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Material Details */}
                  <div className="space-y-4 pt-2 border-t border-boutique-gold/20">
                    <h3 className="text-xs font-semibold text-boutique-charcoal uppercase tracking-wider flex items-center space-x-2">
                      <Scissors className="w-4 h-4 text-boutique-gold" />
                      <span>2. Material & Fabric Information</span>
                    </h3>

                    <div>
                      <label className="block text-xs font-medium text-boutique-charcoal mb-2">
                        Material Provided? <span className="text-rose-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          formData.materialProvided === 'yes'
                            ? 'border-boutique-maroon bg-boutique-goldLight/15 text-boutique-maroon font-semibold'
                            : 'border-boutique-gold/30 hover:bg-boutique-cream text-boutique-charcoal'
                        }`}>
                          <input
                            type="radio"
                            name="materialProvided"
                            value="yes"
                            checked={formData.materialProvided === 'yes'}
                            onChange={handleChange}
                            className="text-boutique-maroon focus:ring-boutique-maroon"
                          />
                          <span className="text-xs">Yes — I will provide the blouse material / saree piece</span>
                        </label>

                        <label className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          formData.materialProvided === 'no'
                            ? 'border-boutique-maroon bg-boutique-goldLight/15 text-boutique-maroon font-semibold'
                            : 'border-boutique-gold/30 hover:bg-boutique-cream text-boutique-charcoal'
                        }`}>
                          <input
                            type="radio"
                            name="materialProvided"
                            value="no"
                            checked={formData.materialProvided === 'no'}
                            onChange={handleChange}
                            className="text-boutique-maroon focus:ring-boutique-maroon"
                          />
                          <span className="text-xs">No — Sree Sarees to source/provide matching fabric</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-boutique-charcoal mb-1">
                        Preferred Blouse Colour and Material Details
                      </label>
                      <textarea
                        name="preferredColourAndMaterial"
                        rows={2}
                        value={formData.preferredColourAndMaterial}
                        onChange={handleChange}
                        placeholder="e.g. Deep Crimson Red Soft Silk with gold zari border, or bottle green raw silk to match my bridal saree"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-boutique-gold/40 focus:outline-none focus:ring-2 focus:ring-boutique-maroon/20"
                      />
                    </div>
                  </div>

                  {/* Section 3: Design & Styling Preferences */}
                  <div className="space-y-4 pt-2 border-t border-boutique-gold/20">
                    <h3 className="text-xs font-semibold text-boutique-charcoal uppercase tracking-wider flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-boutique-gold" />
                      <span>3. Neckline & Sleeve Styling</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-boutique-charcoal mb-1">
                          Neckline
                        </label>
                        <select
                          name="neckline"
                          value={formData.neckline}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-boutique-gold/40 focus:outline-none focus:ring-2 focus:ring-boutique-maroon/20 bg-white"
                        >
                          <option value="Classic Round Neck">Classic Round Neck</option>
                          <option value="Elegant Boat Neck">Elegant Boat Neck</option>
                          <option value="Sweetheart Neck">Sweetheart Neck</option>
                          <option value="Deep V-Neck">Deep V-Neck</option>
                          <option value="Square Neckline">Square Neckline</option>
                          <option value="High Neck / Mandarin Collar">High Neck / Mandarin Collar</option>
                          <option value="Custom Neckline (See Notes)">Custom Neckline (See Notes)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-boutique-charcoal mb-1">
                          Sleeve Style
                        </label>
                        <select
                          name="sleeveStyle"
                          value={formData.sleeveStyle}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-boutique-gold/40 focus:outline-none focus:ring-2 focus:ring-boutique-maroon/20 bg-white"
                        >
                          <option value="Elbow Length Sleeves (Most Popular)">Elbow Length Sleeves (Most Popular)</option>
                          <option value="Short / Cap Sleeves">Short / Cap Sleeves</option>
                          <option value="3/4th Sleeves">3/4th Sleeves</option>
                          <option value="Full Length Sleeves">Full Length Sleeves</option>
                          <option value="Sleeveless">Sleeveless</option>
                          <option value="Traditional Puff / Balloon Sleeves">Traditional Puff / Balloon Sleeves</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-boutique-charcoal mb-1">
                          Back Design
                        </label>
                        <select
                          name="backDesign"
                          value={formData.backDesign}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-boutique-gold/40 focus:outline-none focus:ring-2 focus:ring-boutique-maroon/20 bg-white"
                        >
                          <option value="Deep U-Neck with Dori & Tassels">Deep U-Neck with Dori & Tassels</option>
                          <option value="Royal Pot Neck with Button">Royal Pot Neck with Button</option>
                          <option value="Keyhole Back Design">Keyhole Back Design</option>
                          <option value="Deep V-Back">Deep V-Back</option>
                          <option value="Covered Back with Fabric Buttons">Covered Back with Fabric Buttons</option>
                          <option value="Sheer Net Back with Zari Border">Sheer Net Back with Zari Border</option>
                          <option value="Custom Back Design (See Notes)">Custom Back Design (See Notes)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Body Measurements */}
                  <div className="space-y-4 pt-2 border-t border-boutique-gold/20">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h3 className="text-xs font-semibold text-boutique-charcoal uppercase tracking-wider flex items-center space-x-2">
                        <Ruler className="w-4 h-4 text-boutique-gold" />
                        <span>4. Measurements (Inches)</span>
                      </h3>

                      {/* Request measurement assistance option */}
                      <label className="inline-flex items-center space-x-2 text-xs text-boutique-maroon font-semibold cursor-pointer bg-boutique-goldLight/20 px-3 py-1.5 rounded-lg border border-boutique-gold/30">
                        <input
                          type="checkbox"
                          name="needMeasurementAssistance"
                          checked={formData.needMeasurementAssistance}
                          onChange={handleChange}
                          className="rounded text-boutique-maroon focus:ring-boutique-maroon"
                        />
                        <span>Need measurement assistance from the shop</span>
                      </label>
                    </div>

                    {formData.needMeasurementAssistance && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start space-x-2">
                        <HelpCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>Measurement Assistance Requested:</strong> You may leave the measurements below blank or approximate. Our master tailor will contact you via WhatsApp / phone to guide you step-by-step for accurate measurements.
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-boutique-charcoal mb-1">
                          Bust (in)
                        </label>
                        <input
                          type="text"
                          name="bust"
                          value={formData.measurements.bust}
                          onChange={handleMeasurementChange}
                          placeholder="e.g. 36"
                          className="w-full px-2.5 py-2 text-xs rounded-lg border border-boutique-gold/40 focus:outline-none focus:ring-2 focus:ring-boutique-maroon/20 font-mono text-center"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-boutique-charcoal mb-1">
                          Waist (in)
                        </label>
                        <input
                          type="text"
                          name="waist"
                          value={formData.measurements.waist}
                          onChange={handleMeasurementChange}
                          placeholder="e.g. 30"
                          className="w-full px-2.5 py-2 text-xs rounded-lg border border-boutique-gold/40 focus:outline-none focus:ring-2 focus:ring-boutique-maroon/20 font-mono text-center"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-boutique-charcoal mb-1">
                          Shoulder (in)
                        </label>
                        <input
                          type="text"
                          name="shoulder"
                          value={formData.measurements.shoulder}
                          onChange={handleMeasurementChange}
                          placeholder="e.g. 14"
                          className="w-full px-2.5 py-2 text-xs rounded-lg border border-boutique-gold/40 focus:outline-none focus:ring-2 focus:ring-boutique-maroon/20 font-mono text-center"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-boutique-charcoal mb-1">
                          Armhole (in)
                        </label>
                        <input
                          type="text"
                          name="armHole"
                          value={formData.measurements.armHole}
                          onChange={handleMeasurementChange}
                          placeholder="e.g. 16"
                          className="w-full px-2.5 py-2 text-xs rounded-lg border border-boutique-gold/40 focus:outline-none focus:ring-2 focus:ring-boutique-maroon/20 font-mono text-center"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-boutique-charcoal mb-1">
                          Blouse Length (in)
                        </label>
                        <input
                          type="text"
                          name="blouseLength"
                          value={formData.measurements.blouseLength}
                          onChange={handleMeasurementChange}
                          placeholder="e.g. 14.5"
                          className="w-full px-2.5 py-2 text-xs rounded-lg border border-boutique-gold/40 focus:outline-none focus:ring-2 focus:ring-boutique-maroon/20 font-mono text-center"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-boutique-charcoal mb-1">
                          Sleeve (in)
                        </label>
                        <input
                          type="text"
                          name="sleeveLength"
                          value={formData.measurements.sleeveLength}
                          onChange={handleMeasurementChange}
                          placeholder="e.g. 10.5"
                          className="w-full px-2.5 py-2 text-xs rounded-lg border border-boutique-gold/40 focus:outline-none focus:ring-2 focus:ring-boutique-maroon/20 font-mono text-center"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 5: Additional Instructions & Preferred Date */}
                  <div className="space-y-4 pt-2 border-t border-boutique-gold/20">
                    <h3 className="text-xs font-semibold text-boutique-charcoal uppercase tracking-wider flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-boutique-gold" />
                      <span>5. Additional Instructions & Completion Date</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-boutique-charcoal mb-1">
                          Preferred Completion Date
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            name="preferredCompletionDate"
                            value={formData.preferredCompletionDate}
                            onChange={handleChange}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-boutique-gold/40 focus:outline-none focus:ring-2 focus:ring-boutique-maroon/20"
                          />
                        </div>
                        <p className="text-[11px] text-boutique-muted mt-1">Standard turnaround: 5–7 business days.</p>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-boutique-charcoal mb-1">
                          Additional Instructions / Special Requests
                        </label>
                        <textarea
                          name="additionalInstructions"
                          rows={2}
                          value={formData.additionalInstructions}
                          onChange={handleChange}
                          placeholder="e.g. Include padded cups, contrast gold piping on neckline, deep back dori tassels, butter-crepe lining"
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-boutique-gold/40 focus:outline-none focus:ring-2 focus:ring-boutique-maroon/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pricing Policy Box Right Above Submit */}
                  <div className="bg-boutique-goldLight/20 border border-boutique-gold/50 p-4 rounded-2xl flex items-start space-x-3">
                    <Info className="w-5 h-5 text-boutique-maroon flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm font-semibold text-boutique-maroon">
                        Pricing Transparency Notice
                      </p>
                      <p className="text-xs text-boutique-charcoal leading-relaxed">
                        “Stitching charges depend on your selected design and requirements. Submit your enquiry, and our team will contact you to discuss the price and next steps.”
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setFormVisible(false)}
                      className="px-5 py-2.5 rounded-full border border-boutique-gold/40 text-boutique-muted hover:text-boutique-charcoal text-xs font-medium transition-all cursor-pointer"
                    >
                      Close Form
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3 rounded-full bg-boutique-maroon hover:bg-boutique-maroonDark text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Submitting Enquiry...</span>
                        </>
                      ) : (
                        <>
                          <Scissors className="w-4 h-4 text-boutique-gold" />
                          <span>Submit Stitching Enquiry</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default BlouseStitching;
