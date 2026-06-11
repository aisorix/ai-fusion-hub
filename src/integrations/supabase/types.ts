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
      agent_runs: {
        Row: {
          created_at: string
          id: string
          prompt: string
          result: string | null
          status: string
          steps: Json
          task_id: string | null
          tokens_used: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          prompt: string
          result?: string | null
          status?: string
          steps?: Json
          task_id?: string | null
          tokens_used?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          prompt?: string
          result?: string | null
          status?: string
          steps?: Json
          task_id?: string | null
          tokens_used?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      agent_schedules: {
        Row: {
          created_at: string
          cron: string
          enabled: boolean
          id: string
          last_run_at: string | null
          prompt: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          cron: string
          enabled?: boolean
          id?: string
          last_run_at?: string | null
          prompt: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          cron?: string
          enabled?: boolean
          id?: string
          last_run_at?: string | null
          prompt?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_events: {
        Row: {
          created_at: string
          error_code: string | null
          feature: string
          id: string
          latency_ms: number | null
          metadata: Json | null
          model: string | null
          status: string
          tokens_in: number | null
          tokens_out: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          error_code?: string | null
          feature: string
          id?: string
          latency_ms?: number | null
          metadata?: Json | null
          model?: string | null
          status?: string
          tokens_in?: number | null
          tokens_out?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          error_code?: string | null
          feature?: string
          id?: string
          latency_ms?: number | null
          metadata?: Json | null
          model?: string | null
          status?: string
          tokens_in?: number | null
          tokens_out?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
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
      announcements: {
        Row: {
          active: boolean
          audience: string
          body_md: string
          created_at: string
          created_by: string | null
          ends_at: string | null
          id: string
          severity: string
          starts_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          audience?: string
          body_md?: string
          created_at?: string
          created_by?: string | null
          ends_at?: string | null
          id?: string
          severity?: string
          starts_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          audience?: string
          body_md?: string
          created_at?: string
          created_by?: string | null
          ends_at?: string | null
          id?: string
          severity?: string
          starts_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string | null
          created_at: string
          id: string
          ip: string | null
          new_value: Json | null
          previous_value: Json | null
          resource: string
          resource_id: string | null
          severity: string
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          id?: string
          ip?: string | null
          new_value?: Json | null
          previous_value?: Json | null
          resource: string
          resource_id?: string | null
          severity?: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          id?: string
          ip?: string | null
          new_value?: Json | null
          previous_value?: Json | null
          resource?: string
          resource_id?: string | null
          severity?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          assigned_employee_id: string | null
          assignee_id: string | null
          created_at: string | null
          guest_email: string | null
          guest_name: string | null
          guest_token: string | null
          id: string
          internal_notes: string | null
          last_message_at: string | null
          priority: string
          status: string | null
          tags: string[]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assigned_employee_id?: string | null
          assignee_id?: string | null
          created_at?: string | null
          guest_email?: string | null
          guest_name?: string | null
          guest_token?: string | null
          id?: string
          internal_notes?: string | null
          last_message_at?: string | null
          priority?: string
          status?: string | null
          tags?: string[]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_employee_id?: string | null
          assignee_id?: string | null
          created_at?: string | null
          guest_email?: string | null
          guest_name?: string | null
          guest_token?: string | null
          id?: string
          internal_notes?: string | null
          last_message_at?: string | null
          priority?: string
          status?: string | null
          tags?: string[]
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
      coupons: {
        Row: {
          active: boolean
          amount_off: number | null
          code: string
          created_at: string
          created_by: string | null
          currency: string | null
          description: string | null
          expires_at: string | null
          id: string
          max_redemptions: number | null
          percent_off: number | null
          redeemed_count: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          amount_off?: number | null
          code: string
          created_at?: string
          created_by?: string | null
          currency?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          max_redemptions?: number | null
          percent_off?: number | null
          redeemed_count?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          amount_off?: number | null
          code?: string
          created_at?: string
          created_by?: string | null
          currency?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          max_redemptions?: number | null
          percent_off?: number | null
          redeemed_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      cowork_connectors: {
        Row: {
          config: Json
          connected_at: string | null
          created_at: string
          id: string
          service: string
          status: string
          user_id: string
        }
        Insert: {
          config?: Json
          connected_at?: string | null
          created_at?: string
          id?: string
          service: string
          status?: string
          user_id: string
        }
        Update: {
          config?: Json
          connected_at?: string | null
          created_at?: string
          id?: string
          service?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      cowork_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          model: string | null
          role: string
          task_id: string | null
          tokens_used: number
          tool_calls: Json | null
          tool_results: Json | null
          user_id: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          model?: string | null
          role?: string
          task_id?: string | null
          tokens_used?: number
          tool_calls?: Json | null
          tool_results?: Json | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          model?: string | null
          role?: string
          task_id?: string | null
          tokens_used?: number
          tool_calls?: Json | null
          tool_results?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cowork_messages_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "cowork_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      cowork_tasks: {
        Row: {
          created_at: string
          description: string
          id: string
          result: string | null
          status: string
          steps: Json
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          result?: string | null
          status?: string
          steps?: Json
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          result?: string | null
          status?: string
          steps?: Json
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      feature_flags: {
        Row: {
          audience: Json
          created_at: string
          description: string | null
          enabled: boolean
          id: string
          key: string
          rollout_percent: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          audience?: Json
          created_at?: string
          description?: string | null
          enabled?: boolean
          id?: string
          key: string
          rollout_percent?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          audience?: Json
          created_at?: string
          description?: string | null
          enabled?: boolean
          id?: string
          key?: string
          rollout_percent?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      feedback_entries: {
        Row: {
          comment: string | null
          created_at: string
          feature: string
          id: string
          metadata: Json
          nps: number | null
          rating: number | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          feature?: string
          id?: string
          metadata?: Json
          nps?: number | null
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          feature?: string
          id?: string
          metadata?: Json
          nps?: number | null
          rating?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      image_generations: {
        Row: {
          created_at: string
          height: number
          id: string
          image_url: string
          model: string | null
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
          model?: string | null
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
          model?: string | null
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
      payment_intents: {
        Row: {
          amount: number
          billing_cycle: string
          created_at: string
          currency: string
          external_id: string
          gateway: string
          id: string
          metadata: Json
          plan_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          billing_cycle?: string
          created_at?: string
          currency?: string
          external_id: string
          gateway: string
          id?: string
          metadata?: Json
          plan_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          billing_cycle?: string
          created_at?: string
          currency?: string
          external_id?: string
          gateway?: string
          id?: string
          metadata?: Json
          plan_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      prompt_template_versions: {
        Row: {
          body: string
          created_at: string
          created_by: string | null
          id: string
          model: string | null
          template_id: string
          version: number
        }
        Insert: {
          body: string
          created_at?: string
          created_by?: string | null
          id?: string
          model?: string | null
          template_id: string
          version: number
        }
        Update: {
          body?: string
          created_at?: string
          created_by?: string | null
          id?: string
          model?: string | null
          template_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "prompt_template_versions_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "prompt_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_templates: {
        Row: {
          body: string
          created_at: string
          current_version: number
          id: string
          model: string | null
          name: string
          tool: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          body?: string
          created_at?: string
          current_version?: number
          id?: string
          model?: string | null
          name: string
          tool: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          body?: string
          created_at?: string
          current_version?: number
          id?: string
          model?: string | null
          name?: string
          tool?: string
          updated_at?: string
          updated_by?: string | null
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
      secret_audit: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string | null
          created_at: string
          id: string
          secret_name: string
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          id?: string
          secret_name: string
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          id?: string
          secret_name?: string
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
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      user_chat_windows: {
        Row: {
          updated_at: string
          user_id: string
          windows: Json
        }
        Insert: {
          updated_at?: string
          user_id: string
          windows?: Json
        }
        Update: {
          updated_at?: string
          user_id?: string
          windows?: Json
        }
        Relationships: []
      }
      user_chats: {
        Row: {
          created_at: string
          id: string
          is_starred: boolean
          messages: Json
          project_id: string | null
          title: string
          title_manually_set: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_starred?: boolean
          messages?: Json
          project_id?: string | null
          title?: string
          title_manually_set?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_starred?: boolean
          messages?: Json
          project_id?: string | null
          title?: string
          title_manually_set?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_chats_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_connections: {
        Row: {
          access_token: string | null
          created_at: string
          expires_at: string | null
          external_account_id: string | null
          id: string
          metadata: Json
          refresh_token: string | null
          scopes: string[] | null
          service: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string
          expires_at?: string | null
          external_account_id?: string | null
          id?: string
          metadata?: Json
          refresh_token?: string | null
          scopes?: string[] | null
          service: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          created_at?: string
          expires_at?: string | null
          external_account_id?: string | null
          id?: string
          metadata?: Json
          refresh_token?: string | null
          scopes?: string[] | null
          service?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_custom_integrations: {
        Row: {
          api_key: string
          auth_header: string
          auth_scheme: string
          base_url: string
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          api_key: string
          auth_header?: string
          auth_scheme?: string
          base_url: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          api_key?: string
          auth_header?: string
          auth_scheme?: string
          base_url?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
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
      video_generations: {
        Row: {
          aspect_ratio: string
          created_at: string
          duration_sec: number
          id: string
          model: string | null
          prompt: string
          resolution: string
          sound: boolean
          source_type: string
          thumbnail_url: string | null
          tokens_used: number
          user_id: string
          video_url: string
        }
        Insert: {
          aspect_ratio?: string
          created_at?: string
          duration_sec?: number
          id?: string
          model?: string | null
          prompt: string
          resolution?: string
          sound?: boolean
          source_type?: string
          thumbnail_url?: string | null
          tokens_used?: number
          user_id: string
          video_url: string
        }
        Update: {
          aspect_ratio?: string
          created_at?: string
          duration_sec?: number
          id?: string
          model?: string | null
          prompt?: string
          resolution?: string
          sound?: boolean
          source_type?: string
          thumbnail_url?: string | null
          tokens_used?: number
          user_id?: string
          video_url?: string
        }
        Relationships: []
      }
      video_jobs: {
        Row: {
          aspect_ratio: string
          attempts: number
          created_at: string
          duration_sec: number
          error: string | null
          id: string
          image_data_url: string | null
          model: string
          prompt: string
          provider_job_id: string | null
          provider_polling_url: string | null
          resolution: string
          sound: boolean
          source_type: string
          status: string
          tokens_charged: number | null
          tokens_estimated: number
          updated_at: string
          user_id: string
          video_url: string | null
        }
        Insert: {
          aspect_ratio?: string
          attempts?: number
          created_at?: string
          duration_sec?: number
          error?: string | null
          id?: string
          image_data_url?: string | null
          model: string
          prompt: string
          provider_job_id?: string | null
          provider_polling_url?: string | null
          resolution?: string
          sound?: boolean
          source_type?: string
          status?: string
          tokens_charged?: number | null
          tokens_estimated?: number
          updated_at?: string
          user_id: string
          video_url?: string | null
        }
        Update: {
          aspect_ratio?: string
          attempts?: number
          created_at?: string
          duration_sec?: number
          error?: string | null
          id?: string
          image_data_url?: string | null
          model?: string
          prompt?: string
          provider_job_id?: string | null
          provider_polling_url?: string | null
          resolution?: string
          sound?: boolean
          source_type?: string
          status?: string
          tokens_charged?: number | null
          tokens_estimated?: number
          updated_at?: string
          user_id?: string
          video_url?: string | null
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
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      get_active_announcements: {
        Args: never
        Returns: {
          active: boolean
          audience: string
          body_md: string
          created_at: string
          created_by: string | null
          ends_at: string | null
          id: string
          severity: string
          starts_at: string | null
          title: string
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "announcements"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_enabled_flags: {
        Args: never
        Returns: {
          audience: Json
          enabled: boolean
          key: string
          rollout_percent: number
        }[]
      }
      get_guest_conversation: {
        Args: { _token: string }
        Returns: {
          assigned_employee_id: string | null
          assignee_id: string | null
          created_at: string | null
          guest_email: string | null
          guest_name: string | null
          guest_token: string | null
          id: string
          internal_notes: string | null
          last_message_at: string | null
          priority: string
          status: string | null
          tags: string[]
          updated_at: string | null
          user_id: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "chat_conversations"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_guest_messages: {
        Args: { _token: string }
        Returns: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          is_read: boolean | null
          sender_id: string | null
          sender_type: string
        }[]
        SetofOptions: {
          from: "*"
          to: "chat_messages"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_shared_chat_by_token: {
        Args: { _token: string }
        Returns: {
          chat_data: Json
          created_at: string
          id: string
          owner_id: string
          share_token: string
          title: string
          updated_at: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_user: { Args: { _user_id: string }; Returns: boolean }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
      send_guest_message: {
        Args: { _content: string; _sender_type?: string; _token: string }
        Returns: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          is_read: boolean | null
          sender_id: string | null
          sender_type: string
        }
        SetofOptions: {
          from: "*"
          to: "chat_messages"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "employee"
        | "user"
        | "admin_super"
        | "admin_manager"
        | "admin_viewer"
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
      app_role: [
        "admin",
        "employee",
        "user",
        "admin_super",
        "admin_manager",
        "admin_viewer",
      ],
    },
  },
} as const
