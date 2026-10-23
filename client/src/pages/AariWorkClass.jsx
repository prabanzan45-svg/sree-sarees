import React, { useState } from 'react';
import { Award, CheckCircle, Video, MapPin, BookOpen, Package, Calendar, PhoneCall, AlertCircle, Info } from 'lucide-react';
import api from '../services/api';

const AARI_SAMPLES = [
  { img: '/images/aari/aari-1.jpg', title: 'Authentic Aari Needlework on Wooden Frame', desc: 'Precision gold zari chain stitching on stretched fabric' },
  { img: '/images/aari/aari-2.jpg', title: 'Artisan Needle Tension & Zari Craft', desc: 'Handcrafted embellishment using traditional Maggam needle' },
  { img: '/images/aari/aari-3.jpg', title: 'Embroidery Hoop & Detailed Handwork', desc: 'Close-up demonstration on wooden ring frame' },
  { img: '/images/aari/aari-4.jpg', title: 'Zardozi & Beadwork Embellishment', desc: 'Metallic wire and pearl beadwork crafted by hand' }
];

const AariWorkClass = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    studentPhone: '',
    studentEmail: '',
    preferredFormat: 'Online Live Sessions',
    preferredBatch: 'Morning Batch (10:00 AM – 12:00 PM)',
    experienceLevel: 'Complete Beginner (Never stitched before)',
    city: 'Madurai',
    needKit: true,
    questions: ''
  });

  const [loading, setLoading] = useState(false);
  const [successResult, setSuccessResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.studentName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    const cleanPhone = formData.studentPhone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit WhatsApp mobile number.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        studentPhone: cleanPhone
      };

      const res = await api.post('/enquiries/aari', payload);
      if (res.data.success) {
        setSuccessResult(res.data);
      } else {
        setErrorMsg(res.data.message || 'Failed to submit enquiry.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Server error submitting enquiry. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-boutique-cream py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-boutique-goldLight/20 border border-boutique-gold/40 text-boutique-maroon text-xs font-semibold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Artisanal Heritage Training</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-boutique-maroon tracking-tight">
            Authentic Aari & Maggam Work Classes
          </h1>
          <p className="text-sm sm:text-base text-boutique-muted font-sans leading-relaxed">
            Turn your passion for hand embroidery into a masterful craft. Sree Sarees offers certified training in traditional Aari embroidery from beginner fundamentals to grand bridal blouse designing.
          </p>
        </div>

        {/* Two Learning Formats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Format 1: Online Live Sessions */}
          <div className="bg-white rounded-3xl p-8 border-2 border-boutique-gold/30 hover:border-boutique-maroon shadow-md transition-all space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-boutique-maroon text-white flex items-center justify-center shadow-md">
                <Video className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold tracking-wider uppercase text-boutique-goldDark">Format 01</span>
                <h3 className="font-serif text-2xl font-bold text-boutique-charcoal">Online Live Sessions</h3>
                <p className="text-xs text-boutique-muted leading-relaxed">
                  Interactive live video training designed for learners across India and abroad. Learn comfortably from home with step-by-step guidance.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-boutique-charcoal">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span><strong>Close-up HD Camera:</strong> Crystal-clear needle angles and thread loop view</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span><strong>Live Doubt Clearing:</strong> Direct one-on-one feedback on every stitch</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span><strong>Recorded Replays:</strong> Lifetime access to lesson recordings for practice</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span><strong>Materials Kit Delivered:</strong> Comprehensive tools kit couriered to your address</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-boutique-muted">Batch Size: 8–10 Students</span>
              <a
                href="#enquiry-form"
                onClick={() => setFormData(prev => ({ ...prev, preferredFormat: 'Online Live Sessions' }))}
                className="text-xs font-bold text-boutique-maroon hover:underline"
              >
                Enroll Online →
              </a>
            </div>
          </div>

          {/* Format 2: Offline Classes in Madurai */}
          <div className="bg-white rounded-3xl p-8 border-2 border-boutique-gold/50 hover:border-boutique-maroon shadow-md transition-all space-y-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-boutique-gold text-boutique-maroonDark px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase">
              Madurai Studio
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-boutique-maroon text-white flex items-center justify-center shadow-md">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold tracking-wider uppercase text-boutique-goldDark">Format 02</span>
                <h3 className="font-serif text-2xl font-bold text-boutique-charcoal">
                  Offline Classes in & around Madurai
                </h3>
                <p className="text-xs text-boutique-muted leading-relaxed">
                  Immersive hands-on classroom training at our Madurai boutique studio (South Masi Street). Ideal for students across Madurai and southern Tamil Nadu districts.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-boutique-charcoal">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span><strong>Physical Wooden Frame Setup:</strong> Learn correct posture and finger dexterity</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span><strong>Hands-On Mentor Supervision:</strong> Physical correction of needle tension</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span><strong>Full Studio Access:</strong> Access boutique zari fabrics, beads, and tracing tables</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span><strong>Course Completion Certificate:</strong> Recognized artisan portfolio guidance</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-boutique-muted">Madurai, Tamil Nadu</span>
              <a
                href="#enquiry-form"
                onClick={() => setFormData(prev => ({ ...prev, preferredFormat: 'Offline Classes in and around Madurai' }))}
                className="text-xs font-bold text-boutique-maroon hover:underline"
              >
                Enroll Offline →
              </a>
            </div>
          </div>

        </div>

        {/* Gallery of Works */}
        <div className="space-y-6">
          <div className="border-b border-boutique-gold/20 pb-3 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-boutique-charcoal">
              Aari Embroidery Stitches & Student Showcase
            </h2>
            <span className="text-xs text-boutique-muted font-medium">Authentic Handcraft</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {AARI_SAMPLES.map((item, idx) => (
              <div key={idx} className="group rounded-2xl overflow-hidden bg-white border border-boutique-gold/25 shadow-sm hover:shadow-md transition-all">
                <div className="aspect-square overflow-hidden bg-boutique-sand/20">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-2.5 text-left">
                  <h4 className="font-serif text-[11px] font-bold text-boutique-maroon truncate">{item.title}</h4>
                  <p className="text-[10px] text-boutique-muted truncate">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Structured Curriculum */}
        <div className="bg-white rounded-3xl p-8 border border-boutique-gold/30 shadow-sm space-y-6">
          <div className="border-b border-boutique-gold/20 pb-3 flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-boutique-maroon" />
            <h2 className="font-serif text-2xl font-bold text-boutique-charcoal">
              Comprehensive 4-Stage Curriculum
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-boutique-cream border border-boutique-gold/30 space-y-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-boutique-maroon text-white">Stage 01</span>
              <h4 className="font-serif font-bold text-sm text-boutique-charcoal">Needle Fundamentals</h4>
              <p className="text-xs text-boutique-muted leading-relaxed">
                Holding the Aari needle, chain stitch, reverse chain, stem stitch, corner turns, and knot securing.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-boutique-cream border border-boutique-gold/30 space-y-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-boutique-maroon text-white">Stage 02</span>
              <h4 className="font-serif font-bold text-sm text-boutique-charcoal">Fillings & Textures</h4>
              <p className="text-xs text-boutique-muted leading-relaxed">
                Water filling stitch, embossed load stitch, feather stitch, buttonhole stitch, and leaf vein outlines.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-boutique-cream border border-boutique-gold/30 space-y-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-boutique-maroon text-white">Stage 03</span>
              <h4 className="font-serif font-bold text-sm text-boutique-charcoal">Beads, Zari & Stones</h4>
              <p className="text-xs text-boutique-muted leading-relaxed">
                Sugar bead stringing, cut beads, pearl load, mirror embroidery, zardozi coil work, and stone chain fixing.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-boutique-cream border border-boutique-gold/30 space-y-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-boutique-maroon text-white">Stage 04</span>
              <h4 className="font-serif font-bold text-sm text-boutique-charcoal">Bridal Blouse Layout</h4>
              <p className="text-xs text-boutique-muted leading-relaxed">
                Tracing temple & peacock designs onto silk fabric, neckline layout, elbow border design, and final framing.
              </p>
            </div>
          </div>
        </div>

        {/* Complete Starter Kit Details */}
        <div className="bg-gradient-to-r from-boutique-sand/40 to-boutique-goldLight/20 rounded-3xl p-8 border border-boutique-gold/40 flex flex-col sm:flex-row items-center gap-6">
          <div className="p-4 bg-boutique-maroon text-boutique-goldLight rounded-2xl shadow-md flex-shrink-0">
            <Package className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-boutique-charcoal">
              Complete Materials Starter Kit Included
            </h3>
            <p className="text-xs text-boutique-muted leading-relaxed">
              Every enrolled student receives our curated toolkit: 18" wooden embroidery ring frame, 3 precision iron Aari needles (sizes 14 & 24), metallic gold & silver zari spools, silk embroidery threads, pearl beads, sugar beads, stone chain, fabric marking pencil, tracing sheet, and practice fabric swatches.
            </p>
          </div>
        </div>

        {/* Registration / Enquiry Form */}
        <div id="enquiry-form" className="bg-white rounded-3xl p-6 sm:p-10 border border-boutique-gold/30 shadow-md">
          {successResult ? (
            <div className="text-center py-8 space-y-6 max-w-xl mx-auto">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-boutique-maroon">
                  Aari Class Registration Received!
                </h3>
                <p className="text-xs text-boutique-muted">
                  Registration ID: <span className="font-mono font-bold text-boutique-charcoal text-sm">{successResult.enquiryId}</span>
                </p>
              </div>
              <div className="bg-boutique-cream p-5 rounded-2xl border border-boutique-gold/30 text-xs text-boutique-charcoal leading-relaxed text-left space-y-2">
                <p className="font-semibold text-boutique-maroon">Next Steps for Enrollment:</p>
                <p>1. Our training coordinator will call or WhatsApp you at <strong>+91 {formData.studentPhone}</strong>.</p>
                <p>2. We will confirm your preferred timing for <strong>{formData.preferredFormat}</strong> and provide complete fee details & materials kit courier information.</p>
                <p>3. You will be assigned a seat in the upcoming batch.</p>
              </div>
              <button
                onClick={() => {
                  setSuccessResult(null);
                  setFormData({
                    studentName: '',
                    studentPhone: '',
                    studentEmail: '',
                    preferredFormat: 'Online Live Sessions',
                    preferredBatch: 'Morning Batch (10:00 AM – 12:00 PM)',
                    experienceLevel: 'Complete Beginner (Never stitched before)',
                    city: 'Madurai',
                    needKit: true,
                    questions: ''
                  });
                }}
                className="px-6 py-2.5 rounded-full bg-boutique-maroon text-white text-xs font-semibold hover:bg-boutique-maroonDark transition-all"
              >
                Register Another Student
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="border-b border-boutique-gold/20 pb-4">
                <h3 className="font-serif text-2xl font-bold text-boutique-charcoal">
                  Course Enquiry & Batch Registration
                </h3>
                <p className="text-xs text-boutique-muted mt-1">
                  Submit your details below. Our training team will contact you with batch schedules, materials kit dispatch, and course fee confirmation.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-boutique-charcoal mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    placeholder="e.g. Ananya Meenakshi"
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-boutique-gold/40 focus:border-boutique-maroon outline-none bg-boutique-ivory/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-boutique-charcoal mb-1">
                    WhatsApp Mobile Number (10 digits) *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-boutique-gold/40 bg-gray-50 text-xs text-gray-500">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="studentPhone"
                      maxLength="10"
                      value={formData.studentPhone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      required
                      className="w-full px-3 py-2 text-xs rounded-r-xl border border-boutique-gold/40 focus:border-boutique-maroon outline-none bg-boutique-ivory/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-boutique-charcoal mb-1">
                    City / Location *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Madurai, Chennai, Coimbatore"
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-boutique-gold/40 focus:border-boutique-maroon outline-none bg-boutique-ivory/20"
                  />
                </div>
              </div>

              {/* Class Format & Batch Preferences */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-boutique-charcoal mb-1">
                    Preferred Learning Format *
                  </label>
                  <select
                    name="preferredFormat"
                    value={formData.preferredFormat}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-boutique-gold/40 focus:border-boutique-maroon outline-none bg-white font-medium text-boutique-maroon"
                  >
                    <option value="Online Live Sessions">Online Live Sessions (Interactive HD)</option>
                    <option value="Offline Classes in and around Madurai">Offline Classes in & around Madurai</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-boutique-charcoal mb-1">
                    Preferred Batch Timing
                  </label>
                  <select
                    name="preferredBatch"
                    value={formData.preferredBatch}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-boutique-gold/40 focus:border-boutique-maroon outline-none bg-white"
                  >
                    <option>Morning Batch (10:00 AM – 12:00 PM)</option>
                    <option>Afternoon Batch (2:00 PM – 4:00 PM)</option>
                    <option>Evening Batch (5:00 PM – 7:00 PM)</option>
                    <option>Weekend Special (Sat & Sun)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-boutique-charcoal mb-1">
                    Prior Stitching Experience
                  </label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-boutique-gold/40 focus:border-boutique-maroon outline-none bg-white"
                  >
                    <option>Complete Beginner (Never stitched before)</option>
                    <option>Basic Hand Embroidery Knowledge</option>
                    <option>Tailor wanting to learn bridal Aari</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <label className="flex items-center space-x-2 text-xs font-medium text-boutique-charcoal cursor-pointer">
                  <input
                    type="checkbox"
                    name="needKit"
                    checked={formData.needKit}
                    onChange={handleChange}
                    className="rounded text-boutique-maroon focus:ring-boutique-gold"
                  />
                  <span>I need the complete Aari Materials Starter Kit delivered to me</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-boutique-charcoal mb-1">
                  Questions or Special Learning Goals (Optional)
                </label>
                <textarea
                  name="questions"
                  rows="3"
                  value={formData.questions}
                  onChange={handleChange}
                  placeholder="Tell us if you want to learn for your own bridal wear, start a boutique business, or require custom timing."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-boutique-gold/40 focus:border-boutique-maroon outline-none bg-boutique-ivory/20"
                />
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start space-x-3 text-xs text-amber-900 leading-relaxed">
                <Info className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Transparent Registration Policy:</span> Submitting this enquiry reserves your inquiry slot. Course fees, batch start dates, and materials delivery are confirmed directly with our training coordinator via phone/WhatsApp before enrollment is finalized.
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 rounded-full bg-boutique-maroon text-white font-semibold text-xs tracking-wider uppercase hover:bg-boutique-maroonDark transition-all shadow-md disabled:opacity-50"
                >
                  {loading ? 'Submitting Enquiry...' : 'Submit Class Registration'}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default AariWorkClass;
