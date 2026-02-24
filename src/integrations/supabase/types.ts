export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      analysis_history: {
        Row: {
          created_at: string
          id: string
          input_data: Json
          result_data: Json
          title: string
          tool: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          input_data?: Json
          result_data?: Json
          title: string
          tool: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          input_data?: Json
          result_data?: Json
          title?: string
          tool?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          assigned_employee_id: string | null
          created_at: string | null
          guest_email: string | null
          guest_name: string | null
          id: string
          last_message_at: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assigned_employee_id?: string | null
          created_at?: string | null
          guest_email?: string | null
          guest_name?: string | null
          id?: string
          last_message_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_employee_id?: string | null
          created_at?: string | null
          guest_email?: string | null
          guest_name?: string | null
          id?: string
          last_message_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          is_read: boolean | null
          sender_id: string | null
          sender_type: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          sender_id?: string | null
          sender_type: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          sender_id?: string | null
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      image_generations: {
        Row: {
          created_at: string
          height: number
          id: string
          image_url: string
          prompt: string
          style: string | null
          tokens_used: number
          user_id: string
          width: number
        }
        Insert: {
          created_at?: string
          height?: number
          id?: string
          image_url: string
          prompt: string
          style?: string | null
          tokens_used?: number
          user_id: string
          width?: number
        }
        Update: {
          created_at?: string
          height?: number
          id?: string
          image_url?: string
          prompt?: string
          style?: string | null
          tokens_used?: number
          user_id?: string
          width?: number
        }
        Relationships: []
      }
      payment_history: {
        Row: {
          amount: number
          billing_cycle: string
          created_at: string
          currency: string
          gateway_response: Json | null
          id: string
          payment_method: string
          plan_id: string
          status: string
          subscription_id: string | null
          transaction_id: string
          user_id: string
        }
        Insert: {
          amount: number
          billing_cycle: string
          created_at?: string
          currency?: string
          gateway_response?: Json | null
          id?: string
          payment_method: string
          plan_id: string
          status?: string
          subscription_id?: string | null
          transaction_id: string
          user_id: string
        }
        Update: {
          amount?: number
          billing_cycle?: string
          created_at?: string
          currency?: string
          gateway_response?: Json | null
          id?: string
          payment_method?: string
          plan_id?: string
          status?: string
          subscription_id?: string | null
          transaction_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_history_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      presentations: {
        Row: {
          created_at: string
          id: string
          prompt: string
          slide_count: number
          slides_data: Json
          theme: string
          title: string
          tokens_used: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          prompt: string
          slide_count?: number
          slides_data?: Json
          theme?: string
          title?: string
          tokens_used?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          prompt?: string
          slide_count?: number
          slides_data?: Json
          theme?: string
          title?: string
          tokens_used?: number
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country_code: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          country_code?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          country_code?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      project_files: {
        Row: {
          content: string
          created_at: string
          id: string
          is_folder: boolean
          language: string
          name: string
          path: string
          project_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          is_folder?: boolean
          language?: string
          name: string
          path?: string
          project_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_folder?: boolean
          language?: string
          name?: string
          path?: string
          project_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_github: {
        Row: {
          access_token: string
          branch: string
          connected_at: string
          id: string
          project_id: string
          repo_name: string
          repo_owner: string
          user_id: string
        }
        Insert: {
          access_token: string
          branch?: string
          connected_at?: string
          id?: string
          project_id: string
          repo_name: string
          repo_owner: string
          user_id: string
        }
        Update: {
          access_token?: string
          branch?: string
          connected_at?: string
          id?: string
          project_id?: string
          repo_name?: string
          repo_owner?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_github_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          project_id: string
          role: string
          tokens_used: number
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          project_id: string
          role: string
          tokens_used?: number
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          project_id?: string
          role?: string
          tokens_used?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          chat_count: number
          color: string
          created_at: string
          description: string
          icon: string
          id: string
          model: string
          name: string
          project_type: string
          status: string
          tokens_used: number
          updated_at: string
          user_id: string
        }
        Insert: {
          chat_count?: number
          color?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          model?: string
          name: string
          project_type?: string
          status?: string
          tokens_used?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          chat_count?: number
          color?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          model?: string
          name?: string
          project_type?: string
          status?: string
          tokens_used?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          created_at: string
          id: string
          location: string
          name: string
          rating: number
          review: string
          role: string
          status: string
          user_id: string | null
          verified: boolean | null
        }
        Insert: {
          created_at?: string
          id?: string
          location: string
          name: string
          rating: number
          review: string
          role: string
          status?: string
          user_id?: string | null
          verified?: boolean | null
        }
        Update: {
          created_at?: string
          id?: string
          location?: string
          name?: string
          rating?: number
          review?: string
          role?: string
          status?: string
          user_id?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      shared_chat_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          shared_chat_id: string
          user_avatar: string | null
          user_id: string
          user_name: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          shared_chat_id: string
          user_avatar?: string | null
          user_id: string
          user_name?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          shared_chat_id?: string
          user_avatar?: string | null
          user_id?: string
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shared_chat_comments_shared_chat_id_fkey"
            columns: ["shared_chat_id"]
            isOneToOne: false
            referencedRelation: "shared_chats"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_chat_members: {
        Row: {
          accepted_at: string | null
          id: string
          invited_at: string
          role: string
          shared_chat_id: string
          user_email: string
          user_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          id?: string
          invited_at?: string
          role?: string
          shared_chat_id: string
          user_email: string
          user_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          id?: string
          invited_at?: string
          role?: string
          shared_chat_id?: string
          user_email?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shared_chat_members_shared_chat_id_fkey"
            columns: ["shared_chat_id"]
            isOneToOne: false
            referencedRelation: "shared_chats"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_chats: {
        Row: {
          chat_data: Json
          created_at: string
          id: string
          owner_id: string
          share_token: string
          title: string
          updated_at: string
        }
        Insert: {
          chat_data?: Json
          created_at?: string
          id?: string
          owner_id: string
          share_token?: string
          title?: string
          updated_at?: string
        }
        Update: {
          chat_data?: Json
          created_at?: string
          id?: string
          owner_id?: string
          share_token?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          amount: number
          billing_cycle: string
          created_at: string
          currency: string
          current_period_end: string
          current_period_start: string
          id: string
          plan_id: string
          status: string
          tokens_used: number
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          billing_cycle?: string
          created_at?: string
          currency?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          plan_id?: string
          status?: string
          tokens_used?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          billing_cycle?: string
          created_at?: string
          currency?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          plan_id?: string
          status?: string
          tokens_used?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_chats: {
        Row: {
          created_at: string
          id: string
          messages: Json
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          messages?: Json
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          messages?: Json
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      reviews_public: {
        Row: {
          created_at: string | null
          id: string | null
          location: string | null
          name: string | null
          rating: number | null
          review: string | null
          role: string | null
          status: string | null
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          location?: string | null
          name?: string | null
          rating?: number | null
          review?: string | null
          role?: string | null
          status?: string | null
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          location?: string | null
          name?: string | null
          rating?: number | null
          review?: string | null
          role?: string | null
          status?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "employee" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "employee", "user"],
    },
  },
} as const
