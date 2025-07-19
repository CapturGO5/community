import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

declare const supabase: SupabaseClient<Database>;
export { supabase };
