import mongoose, { Schema, model, models } from 'mongoose';

// Schéma pour le profil Pharmacie
const PharmacyProfileSchema = new Schema({
    pharmacyName: { type: String, required: true },
    license: { type: String, required: true },
    address: { type: String, required: true },
    quartier: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    isOnDuty: { type: Boolean, default: false },
    hours: { type: String, default: "8h-20h" },
    medications: [{
        name: { type: String, required: true },
        quantity: { type: Number, default: 0 },
        price: { type: Number, default: 0 },
        expiryDate: { type: Date }
    }]
}, { _id: false });

// Schéma pour le profil Femme Enceinte
const PregnantProfileSchema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    dueDate: { type: Date, required: true },
    weeksPregnant: { type: Number, required: true },
    lastCheckup: { type: Date },
    nextCheckup: { type: Date },
}, { _id: false });

// Schéma pour le profil Troisième Âge
const ElderlyProfileSchema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true },
    emergencyContact: { type: String, required: true },
    healthConditions: [{ type: String }],
}, { _id: false });

// Schéma pour le profil Donneur de Sang
const DonorProfileSchema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    bloodType: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        required: true
    },
    location: { type: String, required: true },
    lastDonation: { type: Date },
    isAvailable: { type: Boolean, default: true },
}, { _id: false });

// Schéma pour les entrées du carnet de santé
const HealthRecordEntrySchema = new Schema({
    date: { type: Date, default: Date.now },
    doctorName: { type: String, required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'User' },
    diagnosis: { type: String, required: true },
    treatment: { type: String, required: true },
    notes: { type: String },
}, { _id: true });

// Schéma pour le profil Maladie Chronique
const ChronicProfileSchema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    disease: { type: String, required: true },
    medications: [{ type: String }],
    treatingDoctorId: { type: Schema.Types.ObjectId, ref: 'User' }, // ID du docteur affilié
    treatingDoctorName: { type: String },
    healthRecords: [HealthRecordEntrySchema], // Carnet de santé virtuel
    lastSync: { type: Date, default: Date.now }
}, { _id: false });

// Schéma pour le profil Docteur
const DoctorProfileSchema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    specialization: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    hospital: { type: String, required: true },
    followedPatients: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Patients assignés
}, { _id: false });

// Schéma Utilisateur Principal
const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, "L'email est requis"],
        unique: true,
        match: [/.+\@.+\..+/, "Veuillez entrer une adresse email valide"]
    },
    password: {
        type: String,
        required: [true, "Le mot de passe est requis"],
        minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"]
    },
    role: {
        type: String,
        enum: ['pharmacy', 'pregnant', 'elderly', 'donor', 'chronic', 'doctor'],
        required: [true, "Le rôle est requis"]
    },
    // Le profil est un objet flexible qui s'adapte au rôle
    // En MongoDB pur, on peut stocker ce qu'on veut, mais ici on structure un peu
    profile: {
        type: Schema.Types.Mixed,
        required: true
    },
    // Gestion des relations Patient <-> Docteur
    pendingRequests: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Demandes reçues
    connections: [{ type: Schema.Types.ObjectId, ref: 'User' }],      // Utilisateurs connectés (chat autorisé)
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Empêcher la recompilation du modèle lors du hot reload de Next.js
const User = models.User || model('User', UserSchema);

export default User;
