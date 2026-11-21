export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type LeadStage =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal_sent"
  | "converted"
  | "lost";
export type PlanType = "solo" | "team" | "round_the_clock" | "unset";
export type LeadIntent = "quote" | "discovery" | "question";
export type TalentStatus = "draft" | "active" | "inactive" | "placed";
export type JobStatus =
  | "open"
  | "shortlisting"
  | "interviewing"
  | "filled"
  | "cancelled";
export type PlacementStatus = "pending" | "active" | "ended" | "buyout";
export type TaskStatus = "open" | "in_progress" | "done" | "cancelled";
export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "void";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

type TableDef<Row, Insert = Partial<Row> & Record<string, unknown>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      admin_users: TableDef<{
        user_id: string;
        email: string;
        created_at: string;
      }>;
      site_settings: TableDef<{
        id: number;
        contact_email: string;
        domain: string;
        office_location: string;
        buy_out_terms: string;
        discovery_url: string;
        phone: string;
        after_phone: string;
        hours_label: string;
        call_timezone: string;
        open_hour: number;
        close_hour: number;
        open_weekends: boolean;
        updated_at: string;
      }>;
      companies: TableDef<{
        id: string;
        name: string;
        website: string | null;
        industry: string | null;
        notes: string | null;
        created_at: string;
        updated_at: string;
      }>;
      contacts: TableDef<{
        id: string;
        company_id: string | null;
        full_name: string;
        email: string | null;
        phone: string | null;
        role: string | null;
        created_at: string;
      }>;
      leads: TableDef<{
        id: string;
        full_name: string;
        email: string;
        company_name: string | null;
        phone: string | null;
        website: string | null;
        plan_type: PlanType;
        intent: LeadIntent;
        message: string;
        stage: LeadStage;
        source: string;
        company_id: string | null;
        assigned_to: string | null;
        created_at: string;
        updated_at: string;
      }>;
      lead_notes: TableDef<{
        id: string;
        lead_id: string;
        body: string;
        created_by: string | null;
        created_at: string;
      }>;
      follow_ups: TableDef<{
        id: string;
        lead_id: string;
        due_at: string;
        note: string | null;
        completed: boolean;
        created_by: string | null;
        created_at: string;
      }>;
      talent: TableDef<{
        id: string;
        display_name: string;
        title: string | null;
        bio: string | null;
        skills: string[];
        years_experience: number | null;
        avatar_url: string | null;
        status: TalentStatus;
        approved: boolean;
        public_visible: boolean;
        internal_notes: string | null;
        created_at: string;
        updated_at: string;
      }>;
      job_requests: TableDef<{
        id: string;
        company_id: string | null;
        lead_id: string | null;
        title: string;
        description: string | null;
        status: JobStatus;
        created_at: string;
        updated_at: string;
      }>;
      shortlists: TableDef<{
        id: string;
        job_request_id: string;
        talent_id: string;
        notes: string | null;
        created_at: string;
      }>;
      interviews: TableDef<{
        id: string;
        job_request_id: string;
        talent_id: string;
        scheduled_at: string | null;
        outcome: string | null;
        notes: string | null;
        created_at: string;
      }>;
      placements: TableDef<{
        id: string;
        company_id: string | null;
        talent_id: string | null;
        job_request_id: string | null;
        status: PlacementStatus;
        start_date: string | null;
        end_date: string | null;
        notes: string | null;
        created_at: string;
        updated_at: string;
      }>;
      tasks: TableDef<{
        id: string;
        title: string;
        description: string | null;
        status: TaskStatus;
        due_at: string | null;
        related_lead_id: string | null;
        related_company_id: string | null;
        assigned_to: string | null;
        created_at: string;
        updated_at: string;
      }>;
      activities: TableDef<{
        id: string;
        entity_type: string;
        entity_id: string | null;
        summary: string;
        created_by: string | null;
        created_at: string;
      }>;
      contracts: TableDef<{
        id: string;
        company_id: string | null;
        placement_id: string | null;
        title: string;
        status: string;
        start_date: string | null;
        end_date: string | null;
        notes: string | null;
        created_at: string;
      }>;
      invoices: TableDef<{
        id: string;
        company_id: string | null;
        contract_id: string | null;
        amount_cents: number;
        currency: string;
        status: InvoiceStatus;
        issued_at: string | null;
        due_at: string | null;
        notes: string | null;
        created_at: string;
      }>;
      payments: TableDef<{
        id: string;
        invoice_id: string | null;
        amount_cents: number;
        status: PaymentStatus;
        paid_at: string | null;
        notes: string | null;
        created_at: string;
      }>;
      audit_log: TableDef<{
        id: number;
        table_name: string;
        record_id: string | null;
        action: string;
        actor: string | null;
        payload: Json | null;
        created_at: string;
      }>;
      rate_limits: TableDef<{
        id: string;
        ip_hash: string;
        created_at: string;
      }>;
    };
    Views: {
      public_talent: {
        Row: {
          id: string;
          display_name: string;
          title: string | null;
          bio: string | null;
          skills: string[] | null;
          years_experience: number | null;
          avatar_url: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      submit_lead: {
        Args: {
          p_full_name: string;
          p_email: string;
          p_company_name: string | null;
          p_phone: string | null;
          p_website: string | null;
          p_plan: PlanType;
          p_intent: LeadIntent;
          p_message: string;
          p_ip_hash: string;
          p_source?: string;
        };
        Returns: string;
      };
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      lead_stage: LeadStage;
      plan_type: PlanType;
      lead_intent: LeadIntent;
      talent_status: TalentStatus;
      job_status: JobStatus;
      placement_status: PlacementStatus;
      task_status: TaskStatus;
      invoice_status: InvoiceStatus;
      payment_status: PaymentStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
