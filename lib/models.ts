import mongoose, { Schema, model, models } from 'mongoose';

// 1. File System Schema
const FileSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['folder', 'file'], required: true },
    parentId: { type: String, default: 'root' },
    icon: { type: String, default: 'file' },
    content: { type: String, default: '' },
    tags: { type: [String], default: [] }
}, { timestamps: true });

// 2. Quest (Projects/Skills) Schema
const QuestSchema = new Schema({
    title: { type: String, required: true },
    status: { type: String, enum: ['Completed', 'In Progress', 'Pending'], default: 'In Progress' },
    iconName: { type: String, default: 'Server' },
    description: { type: String, required: true },
    tasks: { type: [String], default: [] }
});

// 3. Work Experience Schema
const ExperienceSchema = new Schema({
    title: { type: String, required: true },
    date: { type: String, required: true },
    sub: { type: String, required: true },
    desc: { type: String, required: true },
    color: { type: String, default: 'blue' }
});

// 4. Profile/About Schema
const ProfileSchema = new Schema({
    name: { type: String, default: 'Amalendu Pandey' },
    profile: { type: String },
    bio: { type: String },
    experience: { type: String },
    keySkills: { type: [String] },
    personality: { type: String }
});

// Prevent model overwrite during hot reload
export const FileModel = models.File || model('File', FileSchema);
export const QuestModel = models.Quest || model('Quest', QuestSchema);
export const ExperienceModel = models.Experience || model('Experience', ExperienceSchema);
export const ProfileModel = models.Profile || model('Profile', ProfileSchema);