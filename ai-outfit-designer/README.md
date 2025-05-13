# LibasAI - Your Personal AI Stylist

A modern web application that uses AI to help users create stylish outfit combinations, manage their wardrobe, and get personalized fashion recommendations.

## Features

- **Outfit Matching**: Upload one item and get matching pieces to complete your look
- **Virtual Closet**: Organize your wardrobe digitally and access your clothes from anywhere
- **AI Style Recommendations**: Get personalized outfit suggestions based on your style preferences, occasion, and weather
- **Complete Outfit Creation**: Build and save full outfits from your closet items

## Technologies Used

- **Next.js** - React framework for building the frontend
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Firebase** - Authentication, database, and storage
- **Cloudinary** - Image storage and transformation
- **AI/ML** - Image recognition and outfit recommendation

## Getting Started

### Prerequisites

- Node.js 14.6.0 or newer
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/libasai.git
   cd libasai
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with the following environment variables:
   ```
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id

   # Cloudinary Configuration
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
   NEXT_PUBLIC_CLOUDINARY_API_KEY=your-api-key
   NEXT_PUBLIC_CLOUDINARY_API_SECRET=your-api-secret

   # AI API Configuration
   NEXT_PUBLIC_AI_API_URL=your-ai-api-url
   NEXT_PUBLIC_AI_API_KEY=your-ai-api-key
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `src/app/` - Next.js app router pages and components
- `src/app/components/` - Reusable UI components
- `src/app/lib/` - Library code, Firebase setup, etc.
- `src/app/utils/` - Utility functions
- `public/` - Static assets

## Deployment

The app can be easily deployed to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Flibasai)

## Roadmap

- [x] Initial setup and landing page
- [x] Dashboard UI
- [x] Closet management UI
- [x] Outfit creation UI
- [ ] User authentication
- [ ] Database integration
- [ ] AI model integration
- [ ] Mobile responsiveness improvements
- [ ] Social sharing features
- [ ] B2B integration options

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Firebase for the backend services
- Cloudinary for image management
