import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  name: {type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String, required: true },
  registrationDate: { type: String },
  status: { type: String },
  lastLoginDate: { type: String },
  access: { type: Boolean, default: true}
});

export const UserModel = model('User', UserSchema);