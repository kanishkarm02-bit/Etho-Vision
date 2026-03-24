export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  questions: Question[];
}

const moduleTitles = [
  "Canine Body Language", "Feline Stress Signals", "Equine Pain Indicators",
  "Avian Distress Signs", "Primate Aggression", "Bovine Welfare Metrics",
  "Reptile Health Indicators", "Small Mammal Anxiety", "Wildlife Conflict Prevention",
  "Shelter Animal Assessment", "Recognizing Chronic Pain", "The Grimace Scale in Rodents",
  "Farm Animal Quality of Life", "Zoo Animal Enrichment Needs", "Marine Mammal Behavior",
  "Amphibian Environmental Stress", "Identifying Malnutrition Visually", "Post-Operative Care Signals",
  "Senior Animal Cognitive Decline", "Advanced Ethogram Construction"
];

export const learnModules: Module[] = moduleTitles.map((title, index) => {
  const id = (index + 1).toString();
  const searchQuery = encodeURIComponent(`${title} educational video`);
  const videoUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;
  
  if (index === 0) {
    return {
      id,
      title: `Module ${id}: ${title}`,
      description: "Learn to identify subtle signs of stress, happiness, and aggression in dogs to improve welfare and prevent bites.",
      videoUrl,
      questions: [
        { id: "q1", text: "What does a slow, stiff tail wag indicate?", options: ["Happiness", "Aggression/Tension", "Playfulness", "Hunger"], correctAnswerIndex: 1 },
        { id: "q2", text: "Which of these is a calming signal in dogs?", options: ["Lip licking", "Growling", "Staring", "Showing teeth"], correctAnswerIndex: 0 },
        { id: "q3", text: "What do pinned back ears typically mean?", options: ["Relaxed", "Fear or appeasement", "Listening to a sound behind", "Excitement"], correctAnswerIndex: 1 },
        { id: "q4", text: "A 'play bow' is characterized by:", options: ["Front legs down, hindquarters up", "Rolling on the back", "Standing tall on hind legs", "Crouching low to the ground"], correctAnswerIndex: 0 },
        { id: "q5", text: "Whale eye (showing the whites of the eyes) is a sign of:", options: ["Sleepiness", "Stress or anxiety", "Joy", "Curiosity"], correctAnswerIndex: 1 },
      ]
    };
  }

  return {
    id,
    title: `Module ${id}: ${title}`,
    description: `Deep dive into behavioral indicators and welfare metrics specific to ${title.toLowerCase()}. Watch the video lesson and complete the quiz to test your knowledge.`,
    videoUrl,
    questions: [
      { id: `m${id}-q1`, text: `What is a primary indicator of distress in the context of ${title.toLowerCase()}?`, options: ["Normal feeding", "Atypical vocalization or posture", "Resting", "Play behavior"], correctAnswerIndex: 1 },
      { id: `m${id}-q2`, text: `How should an auditor approach an animal showing severe signs of stress?`, options: ["Quickly and loudly", "Slowly, avoiding direct eye contact", "By offering food immediately", "By initiating physical contact"], correctAnswerIndex: 1 },
      { id: `m${id}-q3`, text: `Which environmental factor most commonly exacerbates issues related to ${title.toLowerCase()}?`, options: ["Optimal temperature", "Overcrowding and high noise", "Access to clean water", "Proper ventilation"], correctAnswerIndex: 1 },
      { id: `m${id}-q4`, text: `When using the Grimace Scale or similar metric, what are we primarily observing?`, options: ["Tail length", "Facial muscle tension and orbital tightening", "Coat color", "Overall weight"], correctAnswerIndex: 1 },
      { id: `m${id}-q5`, text: `What is the recommended action if an animal scores highly on a pain/stress index?`, options: ["Ignore it", "Wait 24 hours", "Immediate veterinary assessment", "Increase feeding"], correctAnswerIndex: 2 },
    ]
  };
});
