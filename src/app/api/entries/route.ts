import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const username = formData.get('username') as string;
    const profilePictureUrl = formData.get('profilePictureUrl') as string;
    const description = formData.get('description') as string;

    if (!file || !userId || !username) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Upload image to storage
    const timestamp = Date.now();
    const filename = `${userId}/${timestamp}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabaseAdmin
      .storage
      .from('entries')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 400 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin
      .storage
      .from('entries')
      .getPublicUrl(filename);

    // Create entry in database
    const { data, error: insertError } = await supabaseAdmin
      .from('entries')
      .insert({
        user_id: userId,
        username,
        profile_picture_url: profilePictureUrl,
        image_url: publicUrl,
        description: description?.trim() || null
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting entry:', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in /api/entries:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
