import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  name: {type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  activationLink: { type: String, required: true },
  registrationDate: { type: String },
  status: { type: String },
  lastLoginDate: { type: String },
  access: { type: String, default: "unblocked"},
});

export const UserModel = model('User', UserSchema);