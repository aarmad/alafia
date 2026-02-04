import mongoose, { Schema, model, models } from 'mongoose';

const PublicationSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: {
        type: String,
        enum: ['alert', 'info', 'event', 'health-tip'],
        default: 'info'
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    authorName: { type: String, required: true },
    authorSpecialization: { type: String },
    image: { type: String },
    isPinned: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Publication = models.Publication || model('Publication', PublicationSchema);

export default Publication;
