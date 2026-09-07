import mongoose from 'mongoose';

const caseSchema = new mongoose.Schema({
    caseId: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    sender: { type: String, required: true },
    threatType: { type: String, default: 'Phishing' },
    threatScore: { type: Number, required: true },
    verdict: { type: String, required: true },
    originIP: { type: String },
    geolocation: {
        country: String,
        city: String,
        isp: String
    },
    indicators: [String],
    analyst: { type: String, default: 'T. Srivastava' },
    status: { type: String, default: 'Critical' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Case', caseSchema);