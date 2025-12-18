
export type Language = 'EN' | 'HI' | 'MR';

export interface MedicineInfo {
  name: string;
  usage: string;
  dosage: string;
  warning: string;
}

export interface FirstAidStep {
  step: string;
  description: string;
}

export interface SymptomAdvice {
  firstAid: FirstAidStep[];
  otcSuggestions: string[];
  disclaimer: string;
}

export interface GroundingChunk {
  maps?: {
    uri: string;
    title: string;
  };
}

export interface DailyTip {
  title: string;
  content: string;
  category: 'Wellness' | 'Yoga' | 'Diet';
}
