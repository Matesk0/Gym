import React, { createContext, useContext, useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { Profile } from '../types/database';

export interface OptionalSignUpOptions {
  bodyweight_kg?: number;
  height_cm?: number;
  gender?: 'male' | 'female';
  fitness_goal?: Profile['fitness_goal'];
  experience_level?: Profile['experience_level'];
  preferred_unit?: Profile['preferred_unit'];
  default_rest_seconds?: number;
  is_public_logs?: boolean;
  track_workout_time?: boolean;
  per_set_timer_enabled?: boolean;
  auto_hypertrophy_enabled?: boolean;
  target_rep_range?: Profile['target_rep_range'];
}

interface AuthContextType {
  user: { id: string; email: string } | null;
  profile: Profile | null;
  isLoading: boolean;
  isMockMode: boolean;
  signIn: (email: string, pass: string) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    pass: string,
    username: string,
    optionalDetails?: OptionalSignUpOptions
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const DEFAULT_PROFILE: Profile = {
  id: 'demo-user-123',
  username: 'Alex_LiftMaster',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
  is_online: true,
  is_public_logs: false,
  gender: 'male',
  bodyweight_kg: 78.5,
  height_cm: 178,
  fitness_goal: 'Hypertrophy',
  experience_level: 'Intermediate',
  preferred_unit: 'kg',
  default_rest_seconds: 90,
  track_workout_time: true,
  per_set_timer_enabled: true,
  auto_hypertrophy_enabled: true,
  target_rep_range: 'Hypertrophy (8-12)',
  overall_rank: 'Gold',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; email: string } | null>({
    id: DEFAULT_PROFILE.id,
    email: 'alex@gympulse.app',
  });
  const [profile, setProfile] = useState<Profile | null>(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState(false);
  const isMockMode = !isSupabaseConfigured;

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    setIsLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || '' });
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      setIsLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || '' });
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (data && !error) {
        setProfile(data as Profile);
      }
    } catch (e) {
      console.warn('Profile fetch warning:', e);
    }
  };

  const signIn = async (email: string, pass: string) => {
    if (!isSupabaseConfigured) {
      setUser({ id: DEFAULT_PROFILE.id, email });
      setProfile(DEFAULT_PROFILE);
      return { error: null };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    return { error: error ? error.message : null };
  };

  const signUp = async (
    email: string,
    pass: string,
    username: string,
    optionalDetails?: OptionalSignUpOptions
  ) => {
    if (!isSupabaseConfigured) {
      const newProf: Profile = {
        ...DEFAULT_PROFILE,
        username,
        ...optionalDetails,
      };
      setUser({ id: DEFAULT_PROFILE.id, email });
      setProfile(newProf);
      return { error: null };
    }
    const { error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          username,
          ...optionalDetails,
        },
      },
    });
    return { error: error ? error.message : null };
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!profile) return;
    const updated = { ...profile, ...updates };
    setProfile(updated);

    if (isSupabaseConfigured && user) {
      await supabase.from('profiles').update(updates).eq('id', user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isMockMode,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
