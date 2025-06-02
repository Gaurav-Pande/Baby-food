<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Baby Food Analyzer

This is a React application for analyzing baby food ingredients. It uses:

- React with TypeScript
- Tailwind CSS for styling
- Tesseract.js for OCR (Optical Character Recognition)
- OpenAI API for ingredient analysis
- Local Storage for data persistence

The app allows users to:
1. Upload or take pictures of food ingredient labels
2. Extract text using OCR
3. Analyze ingredients for suitability for babies (1-3 years)
4. Get health assessments, nutritional information, and alternatives

Key files and directories:
- `src/components/` - UI components
- `src/services/` - API integration and business logic
- `src/hooks/` - Custom React hooks
- `src/types.ts` - TypeScript interfaces

When suggesting code for this project, consider:
- TypeScript type safety
- React best practices and hooks
- Simple, clean UI following the existing Tailwind styling
- Performance considerations for image processing
