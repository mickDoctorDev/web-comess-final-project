import mongoose, { Schema, Document } from 'mongoose';

export interface IRepair extends Document {
  userId: mongoose.Types.ObjectId;
  username: string;
  item: string;
  modelName: string;
  imageUrl: string;
  description: string;
  status: 'pending' | 'acknowledged' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const RepairSchema = new Schema<IRepair>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    item: { type: String, required: true },
    modelName: { type: String },
    imageUrl: { type: String },
    description: { type: String, required: true },
    status: { type: String, enum: ['pending', 'acknowledged', 'completed'], default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.models.Repair || mongoose.model<IRepair>('Repair', RepairSchema);
