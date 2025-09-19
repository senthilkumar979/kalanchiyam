export interface Database {
  public: {
    Tables: {
      invites: {
        Row: {
          id: string;
          email: string;
          invited_at: string;
          invited_by: string | null;
          status: "pending" | "accepted" | "expired";
        };
        Insert: {
          id?: string;
          email: string;
          invited_at?: string;
          invited_by?: string | null;
          status?: "pending" | "accepted" | "expired";
        };
        Update: {
          id?: string;
          email?: string;
          invited_at?: string;
          invited_by?: string | null;
          status?: "pending" | "accepted" | "expired";
        };
      };
      accounts: {
        Row: {
          email_id: string;
          full_name: string | null;
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          email_id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email_id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          user_email_id: string;
          file_name: string;
          storage_path: string;
          file_size: number | null;
          mime_type: string | null;
          category: string | null;
          uploaded_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_email_id: string;
          file_name: string;
          storage_path: string;
          file_size?: number | null;
          mime_type?: string | null;
          category?: string | null;
          uploaded_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_email_id?: string;
          file_name?: string;
          storage_path?: string;
          file_size?: number | null;
          mime_type?: string | null;
          category?: string | null;
          uploaded_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type Invite = Database["public"]["Tables"]["invites"]["Row"];
export type Account = Database["public"]["Tables"]["accounts"]["Row"];
export type Document = Database["public"]["Tables"]["documents"]["Row"];
