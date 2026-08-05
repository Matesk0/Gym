import { describe, test, expect } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';

describe('Supabase Setup SQL Script Verification', () => {
  const seedFilePath = path.join(__dirname, '../../supabase_setup.sql');

  test('supabase_setup.sql exists and contains valid SQL user provisioning commands', () => {
    expect(fs.existsSync(seedFilePath)).toBe(true);

    const sqlContent = fs.readFileSync(seedFilePath, 'utf8');

    // Check required SQL statements for auth.users, public.profiles, workout_logs, set_logs
    expect(sqlContent).toContain('INSERT INTO auth.users');
    expect(sqlContent).toContain('INSERT INTO public.profiles');
    expect(sqlContent).toContain('INSERT INTO public.workout_logs');
    expect(sqlContent).toContain('INSERT INTO public.set_logs');

    // Check pre-provisioned demo athletes
    expect(sqlContent).toContain('Titan_Marcus');
    expect(sqlContent).toContain('Elena_Valkyrie');
    expect(sqlContent).toContain('Alex_LiftMaster');
    expect(sqlContent).toContain('Dmitri_Steel');
    expect(sqlContent).toContain('Grandmaster');
  });
});
