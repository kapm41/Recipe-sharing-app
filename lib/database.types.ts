export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      favorites: {
        Row: {
          id: number;
          user_id: string;
          recipe_id: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          recipe_id: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          recipe_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      recipe_tag_map: {
        Row: {
          recipe_id: string;
          tag_id: number;
        };
        Insert: {
          recipe_id: string;
          tag_id: number;
        };
        Update: {
          recipe_id?: string;
          tag_id?: number;
        };
        Relationships: [];
      };
      recipe_tags: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      recipe_comments: {
        Row: {
          id: number;
          recipe_id: string;
          user_id: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          recipe_id: string;
          user_id: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          recipe_id?: string;
          user_id?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      recipe_likes: {
        Row: {
          id: number;
          user_id: string;
          recipe_id: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          recipe_id: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          recipe_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      recipes: {
        Row: {
          id: string;
          author_id: string;
          title: string;
          description: string | null;
          ingredients: Json;
          instructions: Json;
          prep_time_minutes: number | null;
          cook_time_minutes: number | null;
          servings: number | null;
          difficulty: string | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          title: string;
          description?: string | null;
          ingredients?: Json;
          instructions?: Json;
          prep_time_minutes?: number | null;
          cook_time_minutes?: number | null;
          servings?: number | null;
          difficulty?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          author_id?: string;
          title?: string;
          description?: string | null;
          ingredients?: Json;
          instructions?: Json;
          prep_time_minutes?: number | null;
          cook_time_minutes?: number | null;
          servings?: number | null;
          difficulty?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};


