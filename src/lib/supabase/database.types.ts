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
      tasks: {
        Row: {
          completed_at: string | null
          created_at: string
          deadline: string | null
          id: string
          raw_message: string | null
          remind_d0_at: string | null
          remind_d1_at: string | null
          short_id: number
          source: Database["public"]["Enums"]["task_source"]
          status: Database["public"]["Enums"]["task_status"]
          title: string
          urgency: Database["public"]["Enums"]["task_urgency"]
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          deadline?: string | null
          id?: string
          raw_message?: string | null
          remind_d0_at?: string | null
          remind_d1_at?: string | null
          short_id?: never
          source: Database["public"]["Enums"]["task_source"]
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          urgency?: Database["public"]["Enums"]["task_urgency"]
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          deadline?: string | null
          id?: string
          raw_message?: string | null
          remind_d0_at?: string | null
          remind_d1_at?: string | null
          short_id?: never
          source?: Database["public"]["Enums"]["task_source"]
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          urgency?: Database["public"]["Enums"]["task_urgency"]
          user_id?: string
        }
        Relationships: []
      }
      wa_messages: {
        Row: {
          body: string
          id: string
          parsed: Json | null
          provider_id: string
          received_at: string
          sender: string
          task_id: string | null
        }
        Insert: {
          body: string
          id?: string
          parsed?: Json | null
          provider_id: string
          received_at?: string
          sender: string
          task_id?: string | null
        }
        Update: {
          body?: string
          id?: string
          parsed?: Json | null
          provider_id?: string
          received_at?: string
          sender?: string
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wa_messages_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      task_source: "web" | "wa"
      task_status: "todo" | "done"
      task_urgency: "banget" | "sedang" | "ringan"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database["public"]

export type Tables<TableName extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][TableName]["Row"]

export type TablesInsert<TableName extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][TableName]["Insert"]

export type TablesUpdate<TableName extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][TableName]["Update"]

export type Enums<EnumName extends keyof PublicSchema["Enums"]> =
  PublicSchema["Enums"][EnumName]

export const Constants = {
  public: {
    Enums: {
      task_source: ["web", "wa"],
      task_status: ["todo", "done"],
      task_urgency: ["banget", "sedang", "ringan"],
    },
  },
} as const
