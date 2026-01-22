import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
// FIX: Ensure this points to the correct file location (lib/models)
import { FileModel, QuestModel, ExperienceModel, ProfileModel } from '@/lib/models';

const getModel = (type: string) => {
    switch (type) {
        case 'files': return FileModel;
        case 'quests': return QuestModel;
        case 'experience': return ExperienceModel;
        case 'profile': return ProfileModel;
        default: return null;
    }
};

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');
        const Model = getModel(type || '');

        if (!Model) return NextResponse.json({ error: 'Invalid type' }, { status: 400 });

        if (type === 'profile') {
            const doc = await Model.findOne();
            return NextResponse.json(doc || {});
        }

        const docs = await Model.find({});
        return NextResponse.json(docs);
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({ error: 'Fetch failed', details: String(error) }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');
        const body = await req.json();
        const Model = getModel(type || '');

        if (!Model) return NextResponse.json({ error: 'Invalid type' }, { status: 400 });

        if (type === 'profile') {
            if (body._id) {
                const updated = await Model.findByIdAndUpdate(body._id, body, { new: true });
                return NextResponse.json(updated);
            } else {
                const existing = await Model.findOne();
                if (existing) {
                    const updated = await Model.findByIdAndUpdate(existing._id, body, { new: true });
                    return NextResponse.json(updated);
                }
                const created = await Model.create(body);
                return NextResponse.json(created);
            }
        }

        const newDoc = await Model.create(body);
        return NextResponse.json(newDoc);
    } catch (error) {
        console.error("POST Error:", error);
        return NextResponse.json({ error: 'Creation failed', details: String(error) }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');
        const id = searchParams.get('id');
        const Model = getModel(type || '');

        if (!Model || !id) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

        await Model.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE Error:", error);
        return NextResponse.json({ error: 'Delete failed', details: String(error) }, { status: 500 });
    }
}