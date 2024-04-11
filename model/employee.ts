import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const EmployeeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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
    enum: ['male', 'female'],
    required: true,
  },
  apartment: {
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
  citizenship: {
    type: String,
    enum: ['citizen', 'green_card', 'visa'],
    required: true,
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
  referralFirstName: {
    type: String,
  },
  referralMiddleName: {
    type: String,
  },
  referralLastName: {
    type: String,
  },
  referralEmail: {
    type: String,
  },
  referralPhone: {
    type: String,
  },
  referralRelationship: {
    type: String,
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
      phone: {
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
