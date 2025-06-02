import { AnalysisResult, Baby, Concern, NutritionalInfo, Alternative } from '../types';
import { v4 as uuidv4 } from 'uuid';

const API_KEY = ''; // Add your Azure OpenAI API key here
// Azure OpenAI configuration
const AZURE_OPENAI_ENDPOINT = ''; // <-- Replace with your Azure endpoint

// This will be called with the text extracted from the image and baby info
export const analyzeIngredients = async (
  ingredientsText: string,
  babyProfile: Baby
): Promise<AnalysisResult> => {
  try {
    // Parse the ingredients (simple splitting for now)
    const ingredients = parseIngredients(ingredientsText);

    // Use OpenAI for real analysis
    const analysis = await analyzeWithOpenAI(ingredients, babyProfile);

    return {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      imageUrl: '', // This will be set by the component
      ingredients,
      ...analysis
    };
  } catch (error) {
    console.error('Error analyzing ingredients:', error);
    throw new Error('Failed to analyze ingredients');
  }
};

// Parse ingredients text into array of ingredients
const parseIngredients = (text: string): string[] => {
  // This is a simplified parser
  // In a real app, you'd want a more sophisticated approach
  return text
    .split(/,|;|\n/)
    .map(item => item.trim())
    .filter(item => item.length > 0);
};

// Mock analysis function for development
const mockAnalyzeIngredients = (
  ingredients: string[],
  babyProfile: Baby
): Pick<AnalysisResult, 'isHealthy' | 'concerns' | 'nutritionalInfo' | 'alternatives'> => {
  // Common ingredients that might be concerning for babies
  const commonConcerns: Record<string, Concern> = {
    'added sugar': {
      ingredient: 'added sugar',
      reason: 'Added sugars should be avoided or limited for babies under 2 years, as they provide no nutritional benefits and can contribute to unhealthy eating habits and tooth decay.',
      citations: [{
        title: 'Added Sugars and Cardiovascular Disease Risk in Children',
        source: 'American Heart Association',
        url: 'https://www.ahajournals.org/doi/full/10.1161/CIR.0000000000000439'
      }]
    },
    'high fructose corn syrup': {
      ingredient: 'high fructose corn syrup',
      reason: 'High fructose corn syrup is a type of added sugar that should be avoided for babies and young children.',
      citations: [{
        title: 'Consumption of High-Fructose Corn Syrup in Beverages May Play a Role in the Epidemic of Obesity',
        source: 'American Journal of Clinical Nutrition',
        url: 'https://academic.oup.com/ajcn/article/79/4/537/4690128'
      }]
    },
    'salt': {
      ingredient: 'salt',
      reason: 'Babies under 1 year should have minimal salt. For toddlers, salt intake should be limited as their kidneys are still developing.',
      citations: [{
        title: 'Salt Intake in Children and Adolescents',
        source: 'American Heart Association',
        url: 'https://www.ahajournals.org/doi/10.1161/HYPERTENSIONAHA.111.180265'
      }]
    },
    'artificial colors': {
      ingredient: 'artificial colors',
      reason: 'Some artificial colors have been linked to increased hyperactivity in children.',
      citations: [{
        title: 'Food additives and hyperactive behaviour in 3-year-old and 8/9-year-old children',
        source: 'The Lancet',
        url: 'https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(07)61306-3/fulltext'
      }]
    },
    'monosodium glutamate': {
      ingredient: 'monosodium glutamate',
      reason: 'MSG is a flavor enhancer that may cause adverse reactions in some children and is generally unnecessary in baby foods.',
      citations: [{
        title: 'The toxicity/safety of processed free glutamic acid (MSG)',
        source: 'Public Health Nutrition',
        url: 'https://www.cambridge.org/core/journals/public-health-nutrition/article/toxicitysafety-of-processed-free-glutamic-acid-msg/19EE8492ED24C8313F5C3C6616CFCA84'
      }]
    }
  };
  
  // Check if any of the ingredients match our concerns
  const concernsFound: Concern[] = [];
  const alternativesFound: Alternative[] = [];
  
  // Check for allergies
  const allergyRelatedIngredients = ingredients.filter(ingredient => 
    babyProfile.allergies.some(allergy => 
      ingredient.toLowerCase().includes(allergy.toLowerCase())
    )
  );
  
  allergyRelatedIngredients.forEach(ingredient => {
    const allergy = babyProfile.allergies.find(a => 
      ingredient.toLowerCase().includes(a.toLowerCase())
    );
    
    if (allergy) {
      concernsFound.push({
        ingredient,
        reason: `Contains ${allergy} which is on your baby's allergy list.`,
        citations: []
      });
    }
  });
  
  // Check for common concerns
  ingredients.forEach(ingredient => {
    Object.keys(commonConcerns).forEach(concern => {
      if (ingredient.toLowerCase().includes(concern)) {
        concernsFound.push(commonConcerns[concern]);
        
        // Add alternative
        if (concern === 'added sugar') {
          alternativesFound.push({
            original: ingredient,
            suggestion: 'Products sweetened with fruit puree',
            benefits: 'Natural fruit sugars come with fiber and nutrients, unlike added sugars.'
          });
        } else if (concern === 'salt') {
          alternativesFound.push({
            original: ingredient,
            suggestion: 'No-added-salt versions or homemade alternatives',
            benefits: 'Lower sodium content is better for developing kidneys and establishing healthy taste preferences.'
          });
        } else if (concern === 'artificial colors') {
          alternativesFound.push({
            original: ingredient,
            suggestion: 'Products with natural colors from fruits and vegetables',
            benefits: 'Natural colors provide nutrients and avoid potential behavioral issues linked to artificial dyes.'
          });
        }
      }
    });
  });
  
  // Mock nutritional info
  const nutritionalInfo: NutritionalInfo = {    calories: Math.floor(Math.random() * 200) + 50,
    protein: parseFloat((Math.random() * 5 + 1).toFixed(1)),
    carbs: parseFloat((Math.random() * 15 + 5).toFixed(1)),
    sugars: parseFloat((Math.random() * 8 + 1).toFixed(1)),
    fat: parseFloat((Math.random() * 5 + 0.5).toFixed(1)),
    sodium: Math.floor(Math.random() * 200),
    additionalInfo: concernsFound.length > 0 
      ? 'This product contains ingredients that may not be ideal for babies in this age range.' 
      : 'This product appears to contain appropriately nutritious ingredients for babies in this age range.'
  };
  
  // Mock response
  return {
    isHealthy: concernsFound.length === 0,
    concerns: concernsFound,
    nutritionalInfo,
    alternatives: alternativesFound
  };
};

// In a real implementation, we would analyze with OpenAI
// This is left as an exercise, as it requires an API key and proper error handling
const analyzeWithOpenAI = async (
  ingredients: string[],
  babyProfile: Baby
): Promise<Pick<AnalysisResult, 'isHealthy' | 'concerns' | 'nutritionalInfo' | 'alternatives'>> => {
  // Construct a detailed prompt for evidence-based, cited analysis
  const prompt = `You are a pediatric nutrition expert. Given the following food ingredients, analyze if this food is healthy for a toddler aged 1-3 years. For each ingredient, check for health concerns based on current medical guidelines and cite at least one reputable source (medical journal, WHO, AAP, PubMed, etc.) for each flagged ingredient. Summarize your reasoning and provide a final verdict with citations.\n\nIngredients: ${ingredients.join(", ")}\nBaby's age: ${babyProfile.age} months\nAllergies: ${babyProfile.allergies.join(", ") || 'None'}\n\nFormat your answer as JSON with this structure:\n{ concerns: [ { ingredient, reason, citations: [ { title, source, url } ] } ], nutritionalInfo: { calories, protein, carbs, sugars, fat, sodium, additionalInfo }, alternatives: [ { original, suggestion, benefits } ], isHealthy: boolean }`;

  const response = await fetch(AZURE_OPENAI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': API_KEY,
    },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: 'You are a helpful pediatric nutrition assistant.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 800
    })
  });

  if (!response.ok) {
    throw new Error('OpenAI API request failed');
  }
  const data = await response.json();
  // Extract the JSON from the LLM's response
  let content = data.choices?.[0]?.message?.content || '';
  // Attempt to extract JSON from the response
  let jsonStart = content.indexOf('{');
  let jsonEnd = content.lastIndexOf('}');
  let parsed;
  try {
    parsed = JSON.parse(content.slice(jsonStart, jsonEnd + 1));
  } catch (e) {
    throw new Error('Failed to parse LLM response as JSON');
  }
  return parsed;
};
