import mongoose from 'mongoose';
import { Document, Schema } from 'mongoose';

export interface EmergencyContact {
  firstName: string;
  lastName: string;
  middleName?: string;
  cellPhone: string;
  email: string;
  relationship: string;
}

export interface IEmployee extends Document {
  user: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  middleName?: string;
  preferredName?: string;
  email: string;
  avatar?: string;
  ssn: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female';
  Apartment?: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  cellPhone: string;
  workPhone?: string;
  visaType?: string;
  visaStartDate?: Date;
  visaEndDate?: Date;
  referredBy?: {
    referrer: mongoose.Types.ObjectId;
    relationship: string;
  };
  emergencyContacts: EmergencyContact[];
  documents: {
    file: string;
    type: string;
  }[];
}

const EmployeeSchema = new Schema<IEmployee>({
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

const Employee = mongoose.model<IEmployee>('Employee', EmployeeSchema);
export default Employee;
