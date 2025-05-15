# Nutrition Chemist Hub

A next-generation nutrition intelligence platform that helps users track their nutrition, discover personalized recipes, and manage their supplement regimen.

## Features

- 📊 Personalized Dashboard
  - Real-time nutrient tracking
  - Progress visualization
  - Daily goals and achievements

- 🥗 Smart Recipe Engine
  - Personalized recommendations
  - Nutrient gap analysis
  - Dietary preference filtering

- 💊 Supplement Management
  - Smart recommendations
  - Intake tracking
  - Reorder reminders

- 🛒 Shopping List
  - Auto-generated lists
  - Direct supplement ordering
  - Category organization

- 📱 User Experience
  - Modern, responsive design
  - Intuitive navigation
  - Real-time updates

## Tech Stack

- **Frontend:**
  - React 18
  - TypeScript
  - Tailwind CSS
  - Chart.js
  - React Router
  - Tanstack Query

- **State Management:**
  - React Context
  - Tanstack Query for server state

- **Authentication:**
  - Firebase Authentication

- **API Integration:**
  - Axios for HTTP requests
  - Custom API hooks

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/nutrition-chemist-hub.git
   cd nutrition-chemist-hub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your environment variables:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_API_BASE_URL=your_api_base_url
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components
│   ├── dashboard/      # Dashboard widgets
│   ├── recipes/        # Recipe-related components
│   └── supplements/    # Supplement-related components
├── pages/              # Page components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── types/              # TypeScript types
├── utils/              # Utility functions
└── services/           # API services
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Design inspiration from modern health and wellness apps
- Built with love for the Nutrition Chemist community 