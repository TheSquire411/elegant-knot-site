export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          action: string
          admin_user_id: string
          created_at: string | null
          details: Json | null
          id: string
          target_user_id: string | null
        }
        Insert: {
          action: string
          admin_user_id: string
          created_at?: string | null
          details?: Json | null
          id?: string
          target_user_id?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          target_user_id?: string | null
        }
        Relationships: []
      }
      budgets: {
        Row: {
          created_at: string
          currency: string | null
          id: string
          name: string
          spent_amount: number
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency?: string | null
          id?: string
          name: string
          spent_amount?: number
          total_amount?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currency?: string | null
          id?: string
          name?: string
          spent_amount?: number
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          budget_id: string
          category: string | null
          created_at: string
          due_date: string | null
          id: string
          is_paid: boolean | null
          is_recurring: boolean | null
          notes: string | null
          receipt_url: string | null
          task_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          budget_id: string
          category?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          is_paid?: boolean | null
          is_recurring?: boolean | null
          notes?: string | null
          receipt_url?: string | null
          task_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          budget_id?: string
          category?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          is_paid?: boolean | null
          is_recurring?: boolean | null
          notes?: string | null
          receipt_url?: string | null
          task_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_usage: {
        Row: {
          created_at: string
          feature_type: string
          id: string
          reset_date: string
          updated_at: string
          usage_count: number
          user_id: string
        }
        Insert: {
          created_at?: string
          feature_type: string
          id?: string
          reset_date: string
          updated_at?: string
          usage_count?: number
          user_id: string
        }
        Update: {
          created_at?: string
          feature_type?: string
          id?: string
          reset_date?: string
          updated_at?: string
          usage_count?: number
          user_id?: string
        }
        Relationships: []
      }
      guest_groups: {
        Row: {
          created_at: string
          id: string
          max_size: number | null
          name: string
          notes: string | null
          type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          max_size?: number | null
          name: string
          notes?: string | null
          type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          max_size?: number | null
          name?: string
          notes?: string | null
          type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      guests: {
        Row: {
          created_at: string
          dietary_restrictions: string | null
          email: string | null
          first_name: string
          guest_group_id: string | null
          id: string
          is_plus_one: boolean | null
          last_name: string | null
          notes: string | null
          phone: string | null
          relationship: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dietary_restrictions?: string | null
          email?: string | null
          first_name: string
          guest_group_id?: string | null
          id?: string
          is_plus_one?: boolean | null
          last_name?: string | null
          notes?: string | null
          phone?: string | null
          relationship?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dietary_restrictions?: string | null
          email?: string | null
          first_name?: string
          guest_group_id?: string | null
          id?: string
          is_plus_one?: boolean | null
          last_name?: string | null
          notes?: string | null
          phone?: string | null
          relationship?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guests_guest_group_id_fkey"
            columns: ["guest_group_id"]
            isOneToOne: false
            referencedRelation: "guest_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          created_at: string
          email: string
          guest_id: string
          id: string
          invitation_type: string
          opened_at: string | null
          rsvp_token: string
          sent_at: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          guest_id: string
          id?: string
          invitation_type?: string
          opened_at?: string | null
          rsvp_token?: string
          sent_at?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          guest_id?: string
          id?: string
          invitation_type?: string
          opened_at?: string | null
          rsvp_token?: string
          sent_at?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitations_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          role: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_end_date: string | null
          subscription_status: Database["public"]["Enums"]["subscription_status"]
          subscription_tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_end_date?: string | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_end_date?: string | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      registries: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      registry_items: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_purchased: boolean
          price: number | null
          priority: string | null
          purchased_at: string | null
          purchased_by: string | null
          quantity_purchased: number
          quantity_wanted: number
          registry_id: string
          store_name: string | null
          store_url: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_purchased?: boolean
          price?: number | null
          priority?: string | null
          purchased_at?: string | null
          purchased_by?: string | null
          quantity_purchased?: number
          quantity_wanted?: number
          registry_id: string
          store_name?: string | null
          store_url?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_purchased?: boolean
          price?: number | null
          priority?: string | null
          purchased_at?: string | null
          purchased_by?: string | null
          quantity_purchased?: number
          quantity_wanted?: number
          registry_id?: string
          store_name?: string | null
          store_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "registry_items_registry_id_fkey"
            columns: ["registry_id"]
            isOneToOne: false
            referencedRelation: "registries"
            referencedColumns: ["id"]
          },
        ]
      }
      rsvp_responses: {
        Row: {
          additional_notes: string | null
          attending: boolean | null
          created_at: string
          guest_id: string
          id: string
          meal_choice: string | null
          plus_one_attending: boolean | null
          plus_one_name: string | null
          response_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          additional_notes?: string | null
          attending?: boolean | null
          created_at?: string
          guest_id: string
          id?: string
          meal_choice?: string | null
          plus_one_attending?: boolean | null
          plus_one_name?: string | null
          response_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          additional_notes?: string | null
          attending?: boolean | null
          created_at?: string
          guest_id?: string
          id?: string
          meal_choice?: string | null
          plus_one_attending?: boolean | null
          plus_one_name?: string | null
          response_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rsvp_responses_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
        ]
      }
      seating_assignments: {
        Row: {
          assigned_at: string | null
          created_at: string
          guest_group_id: string
          id: string
          seating_table_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          created_at?: string
          guest_group_id: string
          id?: string
          seating_table_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          created_at?: string
          guest_group_id?: string
          id?: string
          seating_table_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "seating_assignments_guest_group_id_fkey"
            columns: ["guest_group_id"]
            isOneToOne: false
            referencedRelation: "guest_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seating_assignments_seating_table_id_fkey"
            columns: ["seating_table_id"]
            isOneToOne: false
            referencedRelation: "seating_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      seating_tables: {
        Row: {
          capacity: number
          created_at: string
          id: string
          name: string
          notes: string | null
          shape: string | null
          updated_at: string
          user_id: string
          x_position: number | null
          y_position: number | null
        }
        Insert: {
          capacity?: number
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          shape?: string | null
          updated_at?: string
          user_id: string
          x_position?: number | null
          y_position?: number | null
        }
        Update: {
          capacity?: number
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          shape?: string | null
          updated_at?: string
          user_id?: string
          x_position?: number | null
          y_position?: number | null
        }
        Relationships: []
      }
      subscription_tiers: {
        Row: {
          advanced_analytics: boolean
          ai_conversations_limit: number | null
          budget_trackers_limit: number | null
          collaboration_tools: boolean
          created_at: string
          custom_domain: boolean
          id: string
          name: string
          photo_uploads_limit: number | null
          price_monthly: number
          price_yearly: number
          priority_support: boolean
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string
          vision_boards_limit: number | null
        }
        Insert: {
          advanced_analytics?: boolean
          ai_conversations_limit?: number | null
          budget_trackers_limit?: number | null
          collaboration_tools?: boolean
          created_at?: string
          custom_domain?: boolean
          id?: string
          name: string
          photo_uploads_limit?: number | null
          price_monthly?: number
          price_yearly?: number
          priority_support?: boolean
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          vision_boards_limit?: number | null
        }
        Update: {
          advanced_analytics?: boolean
          ai_conversations_limit?: number | null
          budget_trackers_limit?: number | null
          collaboration_tools?: boolean
          created_at?: string
          custom_domain?: boolean
          id?: string
          name?: string
          photo_uploads_limit?: number | null
          price_monthly?: number
          price_yearly?: number
          priority_support?: boolean
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          vision_boards_limit?: number | null
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          canceled_at: string | null
          created_at: string
          end_date: string | null
          id: string
          start_date: string
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_subscription_id: string | null
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string
          user_id: string
        }
        Insert: {
          canceled_at?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          start_date?: string
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_subscription_id?: string | null
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id: string
        }
        Update: {
          canceled_at?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          start_date?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_subscription_id?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_vision_boards: {
        Row: {
          aesthetic: string
          avoid: string | null
          colors: string[]
          created_at: string
          generated_board_data: Json | null
          id: string
          must_have: string | null
          season: string
          updated_at: string
          user_id: string
          venue: string
        }
        Insert: {
          aesthetic: string
          avoid?: string | null
          colors: string[]
          created_at?: string
          generated_board_data?: Json | null
          id?: string
          must_have?: string | null
          season: string
          updated_at?: string
          user_id: string
          venue: string
        }
        Update: {
          aesthetic?: string
          avoid?: string | null
          colors?: string[]
          created_at?: string
          generated_board_data?: Json | null
          id?: string
          must_have?: string | null
          season?: string
          updated_at?: string
          user_id?: string
          venue?: string
        }
        Relationships: []
      }
      website_sections: {
        Row: {
          content: Json
          created_at: string
          id: string
          is_visible: boolean
          order_index: number
          section_type: string
          settings: Json
          title: string | null
          updated_at: string
          website_id: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          is_visible?: boolean
          order_index?: number
          section_type: string
          settings?: Json
          title?: string | null
          updated_at?: string
          website_id: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          is_visible?: boolean
          order_index?: number
          section_type?: string
          settings?: Json
          title?: string | null
          updated_at?: string
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "website_sections_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "wedding_websites"
            referencedColumns: ["id"]
          },
        ]
      }
      website_templates: {
        Row: {
          colors: Json
          created_at: string
          id: string
          is_public: boolean
          layout: Json
          name: string
          thumbnail_url: string | null
          typography: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          colors?: Json
          created_at?: string
          id?: string
          is_public?: boolean
          layout?: Json
          name: string
          thumbnail_url?: string | null
          typography?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          colors?: Json
          created_at?: string
          id?: string
          is_public?: boolean
          layout?: Json
          name?: string
          thumbnail_url?: string | null
          typography?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wedding_websites: {
        Row: {
          content: Json
          created_at: string
          domain: string | null
          id: string
          published_at: string | null
          settings: Json
          slug: string | null
          status: string
          theme: Json
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: Json
          created_at?: string
          domain?: string | null
          id?: string
          published_at?: string | null
          settings?: Json
          slug?: string | null
          status?: string
          theme?: Json
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string
          domain?: string | null
          id?: string
          published_at?: string | null
          settings?: Json
          slug?: string | null
          status?: string
          theme?: Json
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      admin_content_stats: {
        Row: {
          total_budgets: number | null
          total_guests: number | null
          total_registries: number | null
          total_websites: number | null
        }
        Relationships: []
      }
      admin_feature_usage_stats: {
        Row: {
          avg_per_user: number | null
          feature_type: string | null
          total_usage: number | null
          unique_users: number | null
        }
        Relationships: []
      }
      admin_subscription_stats: {
        Row: {
          percentage: number | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          user_count: number | null
        }
        Relationships: []
      }
      admin_user_stats: {
        Row: {
          admin_users: number | null
          new_this_month: number | null
          paid_users: number | null
          total_users: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      admin_get_users: {
        Args:
          | { p_limit?: number; p_offset?: number; p_search?: string }
          | {
              p_search?: string
              p_limit?: number
              p_offset?: number
              p_sort_by?: string
              p_sort_order?: string
            }
        Returns: {
          id: string
          user_id: string
          full_name: string
          username: string
          avatar_url: string
          role: string
          subscription_tier: Database["public"]["Enums"]["subscription_tier"]
          subscription_status: Database["public"]["Enums"]["subscription_status"]
          created_at: string
          updated_at: string
          last_sign_in_at: string
        }[]
      }
      admin_update_user_role: {
        Args: { p_user_id: string; p_new_role: string }
        Returns: boolean
      }
      admin_update_user_subscription: {
        Args: {
          p_user_id: string
          p_new_tier: Database["public"]["Enums"]["subscription_tier"]
        }
        Returns: boolean
      }
      can_use_feature: {
        Args: { p_user_id: string; p_feature_type: string }
        Returns: boolean
      }
      get_current_usage: {
        Args: { p_user_id: string; p_feature_type: string }
        Returns: number
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      increment_usage: {
        Args: { p_user_id: string; p_feature_type: string }
        Returns: number
      }
    }
    Enums: {
      subscription_status: "active" | "canceled" | "expired" | "trialing"
      subscription_tier: "free" | "basic" | "premium" | "enterprise"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      subscription_status: ["active", "canceled", "expired", "trialing"],
      subscription_tier: ["free", "basic", "premium", "enterprise"],
    },
  },
} as const
