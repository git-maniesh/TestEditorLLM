
import mongoose, { Schema, Document } from 'mongoose';
export interface IFile extends Document { owner:string; name:string; type:'file'|'folder'; content?:string; parentId?:string; language?:string; createdAt:Date; updatedAt:Date }
const FileSchema = new Schema<IFile>({ owner:{type:String, required:true, index:true}, name:{type:String, required:true}, type:{type:String, enum:['file','folder'], default:'file'}, content:{type:String, default:''}, parentId:{type:String, default:null}, language:{type:String, default:'javascript'}, createdAt:{type:Date, default:Date.now}, updatedAt:{type:Date, default:Date.now} });
FileSchema.index({ owner:1, name:1, parentId:1 }, { unique:true });
export const File = (mongoose.models.File as mongoose.Model<IFile>) || mongoose.model<IFile>('File', FileSchema);
