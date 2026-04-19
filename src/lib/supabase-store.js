import { getClientId } from "@/lib/client-id";
import { DEFAULT_PROFILE } from "@/lib/local-store";
import { isSupabaseConfigured, supabase } from "@/lib/supabase-client";

const PROFILE_TABLE = "hireforge_profiles";
const ANALYSES_TABLE = "hireforge_resume_analyses";
const WELLNESS_TABLE = "hireforge_wellness_entries";

function ensureConfigured() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured");
  }
}

function withClientId(data = {}) {
  return {
    client_id: getClientId(),
    ...data
  };
}

function mapProfile(row) {
  if (!row) {
    return { ...DEFAULT_PROFILE };
  }

  return {
    ...DEFAULT_PROFILE,
    ...row,
    skills: Array.isArray(row.skills) ? row.skills : []
  };
}

export async function getRemoteProfile() {
  ensureConfigured();

  const clientId = getClientId();
  const { data, error } = await supabase
    .from(PROFILE_TABLE)
    .select("*")
    .eq("client_id", clientId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return mapProfile(data);
}

export async function updateRemoteProfile(updates) {
  ensureConfigured();

  const payload = withClientId({
    ...updates,
    updated_at: new Date().toISOString()
  });

  const { data, error } = await supabase
    .from(PROFILE_TABLE)
    .upsert(payload, { onConflict: "client_id" })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapProfile(data);
}

export async function listRemoteAnalyses(limit = 20) {
  ensureConfigured();

  const { data, error } = await supabase
    .from(ANALYSES_TABLE)
    .select("*")
    .eq("client_id", getClientId())
    .order("created_date", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data || [];
}

export async function createRemoteAnalysis(analysis) {
  ensureConfigured();

  const { data, error } = await supabase
    .from(ANALYSES_TABLE)
    .insert(withClientId(analysis))
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function listRemoteWellnessEntries(limit = 30) {
  ensureConfigured();

  const { data, error } = await supabase
    .from(WELLNESS_TABLE)
    .select("*")
    .eq("client_id", getClientId())
    .order("date", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data || [];
}

export async function createRemoteWellnessEntry(entry) {
  ensureConfigured();

  const { data, error } = await supabase
    .from(WELLNESS_TABLE)
    .insert(withClientId(entry))
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
