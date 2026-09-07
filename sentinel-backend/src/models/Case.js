import mongoose from 'mongoose';

const CaseSchema = new mongoose.Schema({
    caseId: { type: String, required: true, unique: true },
    subject: { type: String, default: 'No Subject' },
    sender: { type: String, default: 'Unknown Sender' },
    threatType: { type: String, default: 'Suspicious Activity' },
    threatScore: { type: Number, default: 0 },
    
    // NEW: Explicitly defining the AI verdict so Mongoose doesn't drop it
    verdict: { type: String, default: 'No explicit verdict generated.' },
    
    originIP: { type: String, default: 'Unknown' },
    
    // NEW: Explicitly defining geolocation fields for the frontend
    geolocation: {
        country: { type: String, default: 'Unknown' },
        city: { type: String, default: 'Unknown' },
        lat: { type: Number, default: 0 },
        lng: { type: Number, default: 0 },
        isp: { type: String, default: 'Unknown' }
    },
    
    indicators: { type: [String], default: [] },
    status: { type: String, default: 'Unknown' },
    
    authResults: {
        spf: { type: String, default: 'Neutral' },
        dkim: { type: String, default: 'Neutral' },
        dmarc: { type: String, default: 'Neutral' }
    },
    
    network: {
        originIP: { type: String, default: 'Unknown' },
        relayHops: { type: Array, default: [] }
    },
    
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Case', CaseSchema);