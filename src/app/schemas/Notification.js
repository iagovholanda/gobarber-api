import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    /* Usuário no qual essas notificações vão esta relacionadas */
    user: {
      type: Number,
      required: true,
    },
    /* Padrão de leitura, se as notificações foram ou não lidas */
    read: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    /* Created / Update */
    timestamps: true,
  }
);

export default mongoose.model('Notification', NotificationSchema);
