/**
 * POPCIX AI Home Assistant ("Sparky")
 * 
 * Natural-Language Diagnostic Engine for troubleshooting home problems
 * and matching with the perfect verified POPCIX service bundles.
 */

export interface AIRecommendation {
  id: string;
  problemTitle: string;
  analysisText: string;
  suggestedServiceIds: string[];
  suggestedAddonIds?: string[];
  isEmergency?: boolean;
  proTips: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'sparky';
  text: string;
  timestamp: string;
  recommendation?: AIRecommendation;
}

export class AIAssistantService {
  /**
   * Diagnoses user natural language prompt and returns tailored home service recommendations
   */
  public static diagnoseProblem(query: string): AIRecommendation {
    const q = query.toLowerCase().trim();

    if (q.includes('ac') || q.includes('cool') || q.includes('air condition') || q.includes('filter')) {
      return {
        id: 'rec-ac',
        problemTitle: 'AC Cooling & Airflow Deficiency',
        analysisText: "When an AC stops cooling efficiently, 85% of cases are caused by choked cooling coils, clogged dust filters, or low refrigerant gas pressure. A high-pressure power jet wash will clean the internal coils and restore icy cooling.",
        suggestedServiceIds: ['s1111111-1111-1111-1111-111111111111'],
        suggestedAddonIds: ['v1111111-1111-1111-1111-111111111111'],
        proTips: [
          'Switch off your AC immediately if you hear a buzzing compressor sound.',
          'Cleaning coils reduces your monthly electricity bill by up to 20%.',
        ],
      };
    }

    if (q.includes('party') || q.includes('guest') || q.includes('festival') || q.includes('deep clean') || q.includes('clean house')) {
      return {
        id: 'rec-party',
        problemTitle: 'Event & Guest Preparation Package',
        analysisText: "To get your home party-ready, we recommend combining our Full House Deep Cleaning with Bathroom Sanitization and Balcony Power Wash.",
        suggestedServiceIds: ['s2222222-2222-2222-2222-222222222222'],
        suggestedAddonIds: ['v3333333-3333-3333-3333-333333333333'],
        proTips: [
          'Book at least 24-48 hours before your event for ample drying time.',
          'Stacking living room and kitchen sanitization saves 15% on the visit.',
        ],
      };
    }

    if (q.includes('electric') || q.includes('trip') || q.includes('mcb') || q.includes('spark') || q.includes('power') || q.includes('switch')) {
      return {
        id: 'rec-electric',
        problemTitle: 'Electrical Fault & Circuit Safety',
        analysisText: "Frequent tripping MCBs or sparking switchboards indicate overloaded circuits or loose neutral wiring. Our A-grade licensed electrician will diagnose the load and secure your breaker box.",
        suggestedServiceIds: ['s3333333-3333-3333-3333-333333333333'],
        isEmergency: true,
        proTips: [
          'Do NOT touch switchboards with damp hands or metal tools.',
          'POPCIX Instant Dispatch can have a technician at your doorstep in ~30 mins.',
        ],
      };
    }

    if (q.includes('leak') || q.includes('pipe') || q.includes('tap') || q.includes('sink') || q.includes('clog') || q.includes('plumb') || q.includes('drain')) {
      return {
        id: 'rec-plumbing',
        problemTitle: 'Plumbing Leak & Drainage Inspection',
        analysisText: "Under-sink water pooling or slow drains are typically caused by worn valve gaskets or siphon trap sediment buildup. Our pro will clear the blockage and install heavy-duty seals.",
        suggestedServiceIds: ['s4444444-4444-4444-4444-444444444444'],
        proTips: [
          'Turn off the isolation valve below the sink if the water is constantly running.',
          'Avoid pouring harsh chemical acids that can erode PVC piping.',
        ],
      };
    }

    if (q.includes('cockroach') || q.includes('bug') || q.includes('pest') || q.includes('ant') || q.includes('termite') || q.includes('insect')) {
      return {
        id: 'rec-pest',
        problemTitle: 'Eco-Friendly Kitchen & Home Pest Control',
        analysisText: "Pests nest deep within cabinet hinges and drainage channels. We utilize 100% odorless Bayer herbal gel baiting that eliminates nests without requiring you to clear out your pantry.",
        suggestedServiceIds: ['s5555555-5555-5555-5555-555555555555'],
        proTips: [
          'Gel dots are completely non-toxic for children and pets.',
          'Includes a 90-day free re-treatment guarantee.',
        ],
      };
    }

    // Default friendly diagnostic
    return {
      id: 'rec-general',
      problemTitle: 'Comprehensive Home Care Solution',
      analysisText: `Based on your request "${query}", our certified POPCIX home specialist will inspect the issue, provide upfront transparent pricing, and sort it out today.`,
      suggestedServiceIds: ['s2222222-2222-2222-2222-222222222222'],
      proTips: [
        'All POPCIX bookings come with our 30-Day Happiness Guarantee.',
        'Earn XP & Points towards your next Home Hero level!',
      ],
    };
  }

  /**
   * Maps natural language search string to matched service categories or IDs
   */
  public static mapSearchIntent(searchQuery: string): { matchedKeywords: string[]; categorySlug?: string } {
    const q = searchQuery.toLowerCase();
    if (q.includes('ac') || q.includes('cool') || q.includes('jet')) return { matchedKeywords: ['ac', 'cooling'], categorySlug: 'ac-services' };
    if (q.includes('clean') || q.includes('wash') || q.includes('dust')) return { matchedKeywords: ['cleaning', 'scrub'], categorySlug: 'cleaning' };
    if (q.includes('electric') || q.includes('light') || q.includes('wire') || q.includes('fan')) return { matchedKeywords: ['electrician'], categorySlug: 'electrician' };
    if (q.includes('leak') || q.includes('plumb') || q.includes('pipe') || q.includes('tap')) return { matchedKeywords: ['plumbing'], categorySlug: 'plumber' };
    if (q.includes('pest') || q.includes('cockroach') || q.includes('termite')) return { matchedKeywords: ['pest control'], categorySlug: 'pest-control' };
    if (q.includes('car') || q.includes('auto')) return { matchedKeywords: ['car cleaning'], categorySlug: 'car-cleaning' };
    if (q.includes('wood') || q.includes('door') || q.includes('lock') || q.includes('carpenter')) return { matchedKeywords: ['carpentry'], categorySlug: 'carpenter' };
    return { matchedKeywords: [searchQuery] };
  }
}
