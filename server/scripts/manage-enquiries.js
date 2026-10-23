#!/usr/bin/env node
/**
 * SREE SAREES - Enquiry Management CLI for Shop Owner
 * Tagline: "Tradition Woven with Elegance."
 *
 * Usage:
 *   node server/scripts/manage-enquiries.js
 *   node server/scripts/manage-enquiries.js --blouse
 *   node server/scripts/manage-enquiries.js --aari
 */

require('dotenv').config();
const storeAdapter = require('../config/storeAdapter');
const businessConfig = require('../config/businessConfig');

const arg = process.argv[2];

console.log('\n=============================================================');
console.log(`  SREE SAREES — Enquiries Management System`);
console.log(`  ${businessConfig.tagline} | Location: ${businessConfig.address.city}, ${businessConfig.address.state}`);
console.log('=============================================================\n');

if (!arg || arg === '--blouse') {
  const blouseList = storeAdapter.getBlouseEnquiries();
  console.log(`📌 BLOUSE STITCHING ENQUIRIES (${blouseList.length} Total):`);
  console.log('-------------------------------------------------------------');
  if (blouseList.length === 0) {
    console.log('  No blouse stitching enquiries received yet.');
  } else {
    blouseList.forEach((b, i) => {
      console.log(`  [${i + 1}] ID: ${b.enquiryId} | Customer: ${b.customerName} | Phone: ${b.customerPhone}`);
      console.log(`      Front: ${b.neckDesignFront} | Back: ${b.neckDesignBack} | Sleeves: ${b.sleeveType}`);
      console.log(`      Lining: ${b.liningRequired ? 'Yes' : 'No'} | Padding: ${b.paddingRequired ? 'Yes' : 'No'}`);
      console.log(`      Timeline: ${b.preferredTimeline} | Status: ${b.status}`);
      if (b.specialInstructions) console.log(`      Notes: ${b.specialInstructions}`);
      console.log(`      Received: ${new Date(b.createdAt).toLocaleString()}`);
      console.log('  -----------------------------------------------------------');
    });
  }
}

if (!arg || arg === '--aari') {
  const aariList = storeAdapter.getAariEnquiries();
  console.log(`\n🧵 AARI WORK CLASS ENQUIRIES (${aariList.length} Total):`);
  console.log('-------------------------------------------------------------');
  if (aariList.length === 0) {
    console.log('  No Aari work class enquiries received yet.');
  } else {
    aariList.forEach((a, i) => {
      console.log(`  [${i + 1}] ID: ${a.enquiryId} | Student: ${a.studentName} | Phone: ${a.studentPhone}`);
      console.log(`      Format: ${a.preferredFormat} | Batch: ${a.preferredBatch}`);
      console.log(`      Level: ${a.experienceLevel} | City: ${a.city} | Kit Needed: ${a.needKit ? 'Yes' : 'No'}`);
      console.log(`      Status: ${a.status}`);
      if (a.questions) console.log(`      Questions: ${a.questions}`);
      console.log(`      Received: ${new Date(a.createdAt).toLocaleString()}`);
      console.log('  -----------------------------------------------------------');
    });
  }
}

console.log('\n=============================================================\n');
