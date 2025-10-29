
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
export interface IUser extends Document { email:string; password:string; createdAt:Date; comparePassword(password:string):Promise<boolean> }
const UserSchema = new Schema<IUser>({ email:{type:String, required:true, unique:true}, password:{type:String, required:true}, createdAt:{type:Date, default:Date.now} });
UserSchema.pre('save', async function(next){ if (!this.isModified('password')) return next(); const salt = await bcrypt.genSalt(10); this.password = await bcrypt.hash(this.password, salt); next(); });
UserSchema.methods.comparePassword = function(password:string){ return bcrypt.compare(password, this.password); }
export const User = (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>('User', UserSchema);
