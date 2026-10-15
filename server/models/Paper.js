import mongoose from 'mongoose';

const paperSchema = new mongoose.Schema(
  {
    subjectName: {
      type: String,
      required: true,
      trim: true,
    },
    subjectCode: {
      type: String,
      trim: true,
      default: '',
    },
    branch: {
      type: String,
      required: true,
      enum: ['cse', 'ece', 'ee', 'me', 'ce'],
    },
    branchName: {
      type: String,
      required: true,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    examType: {
      type: String,
      enum: ['internal-1', 'internal-2', 'external', 'mid-sem', 'end-sem'],
      default: 'external',
    },
    year: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    cloudinaryPublicId: {
      type: String,
      default: '',
    },
    fileName: {
      type: String,
      default: '',
    },
    fileType: {
      type: String,
      default: 'application/pdf',
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    uploaderName: {
      type: String,
      default: 'CEC Student',
    },
    uploaderEmail: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Map _id to id for seamless frontend compatibility
paperSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret.__v;
    return ret;
  },
});

export const Paper = mongoose.model('Paper', paperSchema);
