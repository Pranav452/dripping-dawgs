# 🐕 DrippingDog

A modern e-commerce platform for premium streetwear and fashion, built with Next.js 14.

## 🌟 Features

- 🛍️ Full E-commerce Functionality
  - Product catalog with filtering and search
  - Shopping cart management
  - Secure checkout process
  - Order tracking

- 👤 User Management
  - Authentication with email
  - User profiles
  - Order history
  - Wishlist functionality

- 💫 Modern UI/UX
  - Responsive design
  - Dark/Light mode
  - Animated transitions using Framer Motion
  - Toast notifications
  - Interactive product galleries

- 🔧 Technical Features
  - Server-side rendering with Next.js
  - Supabase backend integration
  - Real-time updates
  - Image optimization
  - Form validation with Zod
  - Styled with Tailwind CSS

## 🚀 Getting Started

1. **Clone the repository**
```bash
git clone [repository-url]
cd dripping-dog
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory and add:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 14
- **Styling**: 
  - Tailwind CSS
  - Shadcn UI Components
  - Radix UI Primitives
- **State Management**: 
  - Zustand for cart and UI state
  - React Context for auth
- **Database & Backend**: 
  - Supabase for data storage
  - Supabase Auth for authentication
- **Forms & Validation**: 
  - React Hook Form
  - Zod schema validation
- **UI/UX**: 
  - Framer Motion for animations
  - Lucide React for icons
  - Sonner for toast notifications

## 📁 Project Structure

```
src/
├── app/             # Next.js app router pages
├── components/      # Reusable components
│   ├── ui/         # Shadcn UI components
│   └── motion/     # Animation components
├── lib/            # Utility functions
├── hooks/          # Custom React hooks
├── store/          # Zustand stores
└── types/          # TypeScript types
```

## 🔧 Available Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint errors
npm run clean       # Clean build files
```

## 🎨 Styling

This project uses Tailwind CSS with a custom configuration:

- Custom color schemes
- Responsive design utilities
- Animation classes
- Shadcn UI integration
- Custom font configuration (Geist Sans & Mono)

## 🔒 Authentication

User authentication is handled through Supabase Auth, providing:

- Email/Password authentication
- Protected routes
- Persistent sessions
- User profile management

## 🛍️ E-commerce Features

- Product catalog with categories
- Shopping cart with persistent state
- Secure checkout process
- Order tracking
- Wishlist functionality
- User reviews and ratings

## 📱 Responsive Design

The site is fully responsive and optimized for:
- Mobile devices
- Tablets
- Desktop computers
- Large screens

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For support, email support@drippingdog.com or visit our [Contact Page](https://dripping-dogs.vercel.app/contact).

---

Built with ❤️ by the DrippingDog Team
