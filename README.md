# Baby Food Analyzer

A web application that analyzes baby food ingredients to determine if they're healthy for babies aged 1-3 years.

## Features

- Take a photo or upload an image of food ingredient labels
- Extract text from images using OCR
- Analyze ingredients using AI to determine if they're suitable for babies
- Personalized analysis based on baby's age and allergies
- Flag concerning ingredients with scientific citations
- Provide nutritional information and healthier alternatives
- Store history of previous analyses
- Simple, responsive design for both mobile and desktop

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/baby-food-analyzer.git
   cd baby-food-analyzer
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Add your OpenAI API key:
   - Open `src/services/analysisService.ts`
   - Update the `API_KEY` variable with your OpenAI API key

4. Start the development server:
   ```
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Deployment

This app can be easily deployed to Vercel:

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Deploy!

## Technologies Used

- React with TypeScript
- Tailwind CSS for styling
- Tesseract.js for OCR
- OpenAI API for ingredient analysis
- Local Storage for saving analysis history

## License

MIT

## Disclaimer

This app is for informational purposes only and should not replace professional medical advice about your baby's nutrition.
