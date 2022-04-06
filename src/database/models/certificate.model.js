/* istanbul ignore file */
import mongoose from 'mongoose';

const certificateSchema = mongoose.Schema({
  description: { type: String, required: true },
  endDate: { type: String, required: true },
  stacks: [{ type: String }],
  title: { type: String, required: true },
  imageAlt: { type: String, required: true },
  courseImg: { type: String, required: true },
  courseUrl: { type: String, required: true },
  certificateImg: { type: String, required: true },
});

module.exports = mongoose.model('Certificate', certificateSchema);
