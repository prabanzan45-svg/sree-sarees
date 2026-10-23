const storeAdapter = require('../config/storeAdapter');
const businessConfig = require('../config/businessConfig');

// @desc    Submit Blouse Stitching Enquiry
// @route   POST /api/enquiries/blouse
// @access  Public
exports.submitBlouseEnquiry = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      sareeDetails,
      measurements,
      neckDesignFront,
      neckDesignBack,
      sleeveType,
      liningRequired,
      paddingRequired,
      specialInstructions,
      preferredTimeline,
      materialProvided,
      preferredColourAndMaterial,
      needMeasurementAssistance,
      neckline,
      sleeveStyle,
      backDesign,
      preferredCompletionDate
    } = req.body;

    if (!customerName || !customerPhone) {
      return res.status(400).json({
        success: false,
        message: 'Customer name and contact number are required.'
      });
    }

    const cleanPhone = String(customerPhone).replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit mobile number.'
      });
    }

    const enquiryData = {
      customerName: customerName.trim(),
      customerPhone: cleanPhone,
      customerEmail: customerEmail ? customerEmail.trim().toLowerCase() : '',
      materialProvided: materialProvided !== undefined ? materialProvided : (req.body.materialProvided || 'yes'),
      preferredColourAndMaterial: preferredColourAndMaterial || sareeDetails || '',
      needMeasurementAssistance: !!needMeasurementAssistance,
      measurements: measurements || {},
      neckline: neckline || neckDesignFront || 'Round Neck',
      sleeveStyle: sleeveStyle || sleeveType || 'Elbow Length',
      backDesign: backDesign || neckDesignBack || 'Deep U Neck',
      specialInstructions: specialInstructions || '',
      preferredCompletionDate: preferredCompletionDate || preferredTimeline || '',
      liningRequired: liningRequired !== false,
      paddingRequired: !!paddingRequired
    };

    const enquiry = storeAdapter.createBlouseEnquiry(enquiryData);

    console.log(`[Blouse Enquiry] New request registered: ${enquiry.enquiryId} for ${enquiry.customerName}`);

    return res.status(201).json({
      success: true,
      enquiryId: enquiry.enquiryId,
      message: 'Your blouse stitching enquiry has been received. Our master tailor will review your measurements and reach out with a personalized quotation.',
      data: enquiry
    });
  } catch (error) {
    console.error('Submit blouse enquiry error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to record blouse stitching enquiry. Please try again or reach out to us directly.'
    });
  }
};

// @desc    Get Blouse Stitching Enquiries (Internal / CLI)
// @route   GET /api/enquiries/blouse
// @access  Private / Internal
exports.getBlouseEnquiries = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const list = storeAdapter.getBlouseEnquiries(filter);
    return res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    console.error('Get blouse enquiries error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving enquiries.' });
  }
};

// @desc    Submit Aari Work Class Enquiry
// @route   POST /api/enquiries/aari
// @access  Public
exports.submitAariEnquiry = async (req, res) => {
  try {
    const {
      studentName,
      studentPhone,
      studentEmail,
      preferredFormat,
      preferredBatch,
      experienceLevel,
      city,
      needKit,
      questions
    } = req.body;

    if (!studentName || !studentPhone || !preferredFormat) {
      return res.status(400).json({
        success: false,
        message: 'Student name, phone number, and preferred class format are required.'
      });
    }

    const cleanPhone = String(studentPhone).replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit mobile number.'
      });
    }

    const enquiryData = {
      studentName: studentName.trim(),
      studentPhone: cleanPhone,
      studentEmail: studentEmail ? studentEmail.trim().toLowerCase() : '',
      preferredFormat: preferredFormat.includes('Madurai') || preferredFormat.toLowerCase().includes('offline')
        ? 'Offline Classes in and around Madurai'
        : 'Online Live Sessions',
      preferredBatch: preferredBatch || 'Morning Batch (10:00 AM - 12:00 PM)',
      experienceLevel: experienceLevel || 'Beginner (No prior stitching)',
      city: city || 'Madurai',
      needKit: needKit !== false,
      questions: questions || ''
    };

    const enquiry = storeAdapter.createAariEnquiry(enquiryData);

    console.log(`[Aari Enquiry] New request registered: ${enquiry.enquiryId} for ${enquiry.studentName} (${enquiry.preferredFormat})`);

    return res.status(201).json({
      success: true,
      enquiryId: enquiry.enquiryId,
      message: 'Your Aari work class enquiry has been registered. Our training coordinator will contact you directly with batch schedules, materials kit details, and enrolment fees.',
      data: enquiry
    });
  } catch (error) {
    console.error('Submit Aari enquiry error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to record Aari class enquiry. Please try again or reach out to us directly.'
    });
  }
};

// @desc    Get Aari Work Class Enquiries (Internal / CLI)
// @route   GET /api/enquiries/aari
// @access  Private / Internal
exports.getAariEnquiries = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.preferredFormat) filter.preferredFormat = req.query.preferredFormat;
    const list = storeAdapter.getAariEnquiries(filter);
    return res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    console.error('Get Aari enquiries error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving enquiries.' });
  }
};

// @desc    Get Centralized Business Configuration
// @route   GET /api/config/business
// @access  Public
exports.getBusinessConfig = (req, res) => {
  return res.json({
    success: true,
    data: businessConfig
  });
};
