export interface Pharmacy {
    id: string
    name: string
    address: string
    phone: string
    whatsapp: string
    quartier: string
    latitude: number
    longitude: number
    isOnDuty: boolean
    hours: string
    medications: string[]
    distance?: number
}

export interface User {
    id: string
    email: string
    password: string
    role: 'pharmacy' | 'pregnant' | 'elderly' | 'donor'
    createdAt: Date
    profile?: PregnantProfile | ElderlyProfile | DonorProfile | PharmacyProfile
}

export interface PregnantProfile {
    name: string
    age: number
    dueDate: Date
    weeksPregnant: number
    lastCheckup?: Date
    nextCheckup?: Date
    notes: string[]
    reminders: Reminder[]
}

export interface ElderlyProfile {
    name: string
    age: number
    medications: MedicationSchedule[]
    appointments: Appointment[]
    healthConditions: string[]
    emergencyContact: string
}

export interface DonorProfile {
    name: string
    bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
    lastDonation?: Date
    phone: string
    location: string
    availableForDonation: boolean
}

export interface PharmacyProfile {
    pharmacyName: string
    license: string
    address: string
    phone: string
    whatsapp: string
    latitude: number
    longitude: number
    isOnDuty: boolean
    hours: string
    medications: MedicationStock[]
}

export interface MedicationStock {
    name: string
    quantity: number
    price: number
    expiryDate: Date
}

export interface MedicationSchedule {
    name: string
    dosage: string
    frequency: string
    time: string[]
    notes?: string
}

export interface Appointment {
    date: Date
    time: string
    doctor: string
    location: string
    reason: string
    completed: boolean
}

export interface Reminder {
    id: string
    title: string
    description: string
    date: Date
    completed: boolean
    type: 'checkup' | 'medication' | 'hydration' | 'exercise' | 'other'
}

export interface ChatMessage {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
}
