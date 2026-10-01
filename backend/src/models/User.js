import mongoose from 'mongoose';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [80, 'El nombre no puede superar los 80 caracteres'],
    },
    correo: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [EMAIL_RE, 'El correo no tiene un formato válido'],
    },
    telefono: {
      type: String,
      trim: true,
      maxlength: [20, 'El teléfono no puede superar los 20 caracteres'],
      default: '',
    },
    // Aquí se guarda SIEMPRE el hash de bcrypt, nunca la contraseña real.
    // select:false evita que salga en las consultas por accidente.
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  },
);

export default mongoose.model('User', userSchema);
