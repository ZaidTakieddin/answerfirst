export type Outcome =
  | "booked"
  | "info"
  | "voicemail"
  | "spam"
  | "escalated"
  | "failed";

export interface CallRow {
  id: string;
  business_id: string | null;
  vapi_call_id: string | null;
  caller_number: string | null;
  started_at: string | null;
  ended_at: string | null;
  duration_seconds: number | null;
  outcome: Outcome | null;
  transcript: string | null;
  summary: string | null;
  recording_url: string | null;
}

export interface BookingInput {
  customer_name: string;
  customer_phone: string;
  service: string;
  scheduled_for: string;
  notes?: string | null;
}

export type BusinessHours = Record<string, [string, string] | null>;

export interface Stats {
  totalCalls: number;
  booked: number;
  pipelineValueAed: number;
  avgDurationSec: number;
}
