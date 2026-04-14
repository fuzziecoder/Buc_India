import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.Mixed,
    ref: 'Event',
    required: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date
  },
  bloodGroup: {
    type: String
  },
  address: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  pincode: {
    type: String
  },
  emergencyContactName: {
    type: String
  },
  emergencyContactPhone: {
    type: String
  },
  bikeModel: {
    type: String
  },
  bikeRegistrationNumber: {
    type: String
  },
  licenseNumber: {
    type: String
  },
  anyMedicalCondition: {
    type: String
  },
  tShirtSize: {
    type: String
  },
  licenseImage: {
    type: String,
    default: ''
  },
  licenseImagePublicId: {
    type: String,
    default: ''
  },
  profileImage: {
    type: String,
    default: ''
  },
  profileImagePublicId: {
    type: String,
    default: ''
  },
  requestRidingGears: {
    type: Boolean,
    default: false
  },
  requestedGears: {
    helmet: { type: Boolean, default: false },
    gloves: { type: Boolean, default: false },
    jacket: { type: Boolean, default: false },
    boots: { type: Boolean, default: false },
    kneeGuards: { type: Boolean, default: false },
    elbowGuards: { type: Boolean, default: false }
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Event-scoped uniqueness indexes
registrationSchema.index({ eventId: 1, email: 1 }, { unique: true });
registrationSchema.index({ eventId: 1, phone: 1 }, { unique: true });
registrationSchema.index({ eventId: 1, bikeRegistrationNumber: 1 }, { unique: true });
registrationSchema.index({ eventId: 1, licenseNumber: 1 }, { unique: true });

const Registration = mongoose.model('Registration', registrationSchema);
export default Registration;
