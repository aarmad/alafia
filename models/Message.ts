import mongoose, { Schema, model, models } from 'mongoose';

const MessageSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const Message = models.Message || model('Message', MessageSchema);

export default Message;
