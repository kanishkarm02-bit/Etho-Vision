export type Mode = 'wildlife' | 'vet' | 'welfare';

export interface AnalysisResult {
  id: string;
  timestamp: number;
  mode: Mode;
  originalImage: string;
  enhancedImage: string;
  organismName: string;
  naturalEnvironment: string;
  organismDescription: string;
  stateAnalysis: string;
  speciesBehavior: string;
  speciesDiet: string;
  conservationStatus: string;
  environmentClimate: string;
  environmentGeography: string;
  environmentThreats: string;
  summary: string;
  fullReport: string;
  confidenceScore: number;
  riskLevel?: string;
}

export const MODES: Record<Mode, { title: string; iconName: string; description: string; prompt: string; color: string }> = {
  wildlife: {
    title: 'Human-Wildlife Conflict Preventer',
    iconName: 'ShieldAlert',
    description: 'Scan wild animals (e.g., tigers, elephants) to detect aggression or predatory intent vs. just passing through.',
    prompt: 'You are an expert wildlife behaviorist. Analyze this image of a wild animal. Identify the organism, its natural environment, and provide a descriptive overview. Also provide detailed information about the species (typical behavior, diet, conservation status) and its natural environment (climate, geographical features, potential threats). Then, determine if the animal is showing signs of aggression, predatory intent, or if it is simply passing through. Explain your reasoning based on body language, ear position, eye focus, and posture. Provide a risk assessment (Low, Medium, High) and recommended actions for humans nearby. Format the fullReport using well-structured Markdown with clear headings, bullet points, and spacing for readability.',
    color: 'bg-orange-500',
  },
  vet: {
    title: 'Non-Verbal Vet',
    iconName: 'Stethoscope',
    description: 'Detect early signs of pain or neurological distress in service animals or livestock.',
    prompt: "You are an expert veterinary diagnostician. Analyze this image of an animal. Identify the organism, its natural environment, and provide a descriptive overview. Also provide detailed information about the species (typical behavior, diet, conservation status) and its natural environment (climate, geographical features, potential threats). Then, look for subtle, early signs of pain, discomfort, or neurological distress that a human might miss. Check posture, eye expression, ear position, and muscle tension. Provide a detailed assessment of the animal's state and recommend if immediate veterinary attention is needed. Format the fullReport using well-structured Markdown with clear headings, bullet points, and spacing for readability.",
    color: 'bg-blue-500',
  },
  welfare: {
    title: 'Animal Welfare Auditor',
    iconName: 'ClipboardCheck',
    description: 'Objectively measure stress levels via facial muscle tension (the "Grimace Scale") for shelters or farms.',
    prompt: "You are an expert animal welfare auditor. Analyze this image of an animal. Identify the organism, its natural environment, and provide a descriptive overview. Also provide detailed information about the species (typical behavior, diet, conservation status) and its natural environment (climate, geographical features, potential threats). Then, use established animal welfare metrics, such as the 'Grimace Scale' (facial muscle tension, orbital tightening, ear position, whisker change), to objectively measure the animal's stress or pain level. Provide a score or clear assessment of their welfare state and note any signs of abuse or severe neglect. Format the fullReport using well-structured Markdown with clear headings, bullet points, and spacing for readability.",
    color: 'bg-emerald-500',
  },
};
