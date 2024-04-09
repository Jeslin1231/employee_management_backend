import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const EmployeeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Auth',
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  preferredName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
  },
  ssn: {
    type: String,
    required: true,
    unique: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true,
  },
  Apartment: {
    type: String,
  },
  streetAddress: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
  cellPhone: {
    type: String,
    required: true,
  },
  workPhone: {
    type: String,
  },
  visaType: {
    type: String,
  },
  visaStartDate: {
    type: Date,
  },
  visaEndDate: {
    type: Date,
  },
  referredBy: {
    referrer: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
    },
    relationship: {
      type: String,
    },
  },
  emergencyContacts: [
    {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      middleName: {
        type: String,
      },
      cellPhone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      relationship: {
        type: String,
        required: true,
      },
    },
  ],
  documents: [
    {
      file: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
    },
  ],
});

const Employee = mongoose.model('Employee', EmployeeSchema);
export default Employee;
