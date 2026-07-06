export type Json =
  string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: "user" | "admin";
          preferred_language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "user" | "admin";
          preferred_language?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "user" | "admin";
          preferred_language?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      incidents: {
        Row: {
          id: string;
          reporter_id: string | null;
          title: string;
          description: string;
          location: string | null;
          category: string | null;
          severity: string | null;
          status: "open" | "reviewed" | "closed";
          ai_summary: string | null;
          recommended_action: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reporter_id?: string | null;
          title: string;
          description: string;
          location?: string | null;
          category?: string | null;
          severity?: string | null;
          status?: "open" | "reviewed" | "closed";
          ai_summary?: string | null;
          recommended_action?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          reporter_id?: string | null;
          title?: string;
          description?: string;
          location?: string | null;
          category?: string | null;
          severity?: string | null;
          status?: "open" | "reviewed" | "closed";
          ai_summary?: string | null;
          recommended_action?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      incident_attachments: {
        Row: {
          id: string;
          incident_id: string;
          uploader_id: string | null;
          storage_path: string;
          file_name: string;
          mime_type: string;
          file_size: number;
          category: "image" | "pdf" | "audio" | "document" | "other";
          created_at: string;
        };
        Insert: {
          id?: string;
          incident_id: string;
          uploader_id?: string | null;
          storage_path: string;
          file_name: string;
          mime_type: string;
          file_size: number;
          category: "image" | "pdf" | "audio" | "document" | "other";
          created_at?: string;
        };
        Update: {
          id?: string;
          incident_id?: string;
          uploader_id?: string | null;
          storage_path?: string;
          file_name?: string;
          mime_type?: string;
          file_size?: number;
          category?: "image" | "pdf" | "audio" | "document" | "other";
          created_at?: string;
        };
        Relationships: [];
      };
      government_services: {
        Row: {
          id: string;
          slug: string;
          name: string;
          category: string;
          department: string;
          office_name: string | null;
          office_address: string | null;
          description: string;
          fee: string;
          processing_time: string;
          instructions: Json;
          documents: Json;
          warnings: Json;
          icon: string | null;
          popular: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          category: string;
          department: string;
          office_name?: string | null;
          office_address?: string | null;
          description: string;
          fee: string;
          processing_time: string;
          instructions?: Json;
          documents?: Json;
          warnings?: Json;
          icon?: string | null;
          popular?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          category?: string;
          department?: string;
          office_name?: string | null;
          office_address?: string | null;
          description?: string;
          fee?: string;
          processing_time?: string;
          instructions?: Json;
          documents?: Json;
          warnings?: Json;
          icon?: string | null;
          popular?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      citizen_requests: {
        Row: {
          id: string;
          user_id: string;
          query: string;
          language: string;
          detected_intent: string | null;
          service_slug: string | null;
          confidence: number | null;
          status: string;
          pipeline_result: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          query: string;
          language?: string;
          detected_intent?: string | null;
          service_slug?: string | null;
          confidence?: number | null;
          status?: string;
          pipeline_result?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          query?: string;
          language?: string;
          detected_intent?: string | null;
          service_slug?: string | null;
          confidence?: number | null;
          status?: string;
          pipeline_result?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      document_verifications: {
        Row: {
          id: string;
          user_id: string;
          service_slug: string | null;
          storage_path: string | null;
          file_name: string | null;
          mime_type: string | null;
          ocr_result: Json | null;
          compliance_result: Json | null;
          confidence: number | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          service_slug?: string | null;
          storage_path?: string | null;
          file_name?: string | null;
          mime_type?: string | null;
          ocr_result?: Json | null;
          compliance_result?: Json | null;
          confidence?: number | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          service_slug?: string | null;
          storage_path?: string | null;
          file_name?: string | null;
          mime_type?: string | null;
          ocr_result?: Json | null;
          compliance_result?: Json | null;
          confidence?: number | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      citizen_reports: {
        Row: {
          id: string;
          user_id: string;
          request_id: string | null;
          verification_id: string | null;
          service_slug: string | null;
          summary: string;
          report_json: Json;
          qr_data: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          request_id?: string | null;
          verification_id?: string | null;
          service_slug?: string | null;
          summary: string;
          report_json: Json;
          qr_data?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          request_id?: string | null;
          verification_id?: string | null;
          service_slug?: string | null;
          summary?: string;
          report_json?: Json;
          qr_data?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      agent_runs: {
        Row: {
          id: string;
          user_id: string;
          parent_type: string;
          parent_id: string;
          agent_name: string;
          input: Json | null;
          output: Json | null;
          success: boolean;
          duration_ms: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          parent_type: string;
          parent_id: string;
          agent_name: string;
          input?: Json | null;
          output?: Json | null;
          success?: boolean;
          duration_ms?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          parent_type?: string;
          parent_id?: string;
          agent_name?: string;
          input?: Json | null;
          output?: Json | null;
          success?: boolean;
          duration_ms?: number | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: "user" | "admin";
    };
    CompositeTypes: Record<string, never>;
  };
};
