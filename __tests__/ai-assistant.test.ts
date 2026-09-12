import { describe, it, expect } from 'vitest';
import { AIAssistantService } from '../src/services/aiAssistant';

describe('POPCIX AI Assistant Natural-Language Diagnostics', () => {
  it('correctly maps AC issue to AC jet wash recommendation', () => {
    const rec = AIAssistantService.diagnoseProblem('My AC is blowing warm air and not cooling');
    expect(rec.problemTitle).toContain('AC Cooling');
    expect(rec.suggestedServiceIds).toContain('s1111111-1111-1111-1111-111111111111');
    expect(rec.proTips.length).toBeGreaterThan(0);
  });

  it('correctly maps party preparation to full house cleaning package', () => {
    const rec = AIAssistantService.diagnoseProblem('I have a party tomorrow and need to clean house');
    expect(rec.problemTitle).toContain('Event & Guest');
    expect(rec.suggestedServiceIds).toContain('s2222222-2222-2222-2222-222222222222');
  });

  it('correctly maps search queries to category slugs', () => {
    const search1 = AIAssistantService.mapSearchIntent('ac repair');
    expect(search1.categorySlug).toBe('ac-services');

    const search2 = AIAssistantService.mapSearchIntent('pipe leak under sink');
    expect(search2.categorySlug).toBe('plumber');
  });
});
