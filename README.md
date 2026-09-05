# Sign Speak - Sign Language Translator for Zambia

🤟 A mobile application that translates sign language to text and text to sign language, designed for Zambian Sign Language (ZSL).

## Features

✨ **Key Features:**
- 📷 **Sign Capture** - Use your camera to capture sign language and get text translations
- 🔤 **Text Translation** - Translate text to sign language videos/animations
- 🌍 **Multi-language** - Support for English and Nyanja (local language)
- 💳 **Subscription Plans** - Premium features with flexible pricing via Lipila
- 📱 **Offline Support** - Works offline with cached translations
- 🎨 **Modern UI** - Glass-morphism design with smooth animations
- ♿ **Accessibility** - Built with accessibility in mind

## Tech Stack

- **Frontend:** React Native + Expo
- **Backend:** Supabase (PostgreSQL + Auth)
- **Camera:** Expo Camera
- **Payment:** Lipila Payment Gateway
- **Language:** JavaScript/TypeScript
- **UI Components:** React Native + Expo Linear Gradient

## Project Structure

```
sign-speak-zm/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── GlassCard.js
│   │   └── GlassScreen.js
│   ├── screens/              # App screens/pages
│   │   ├── HomeScreen.js
│   │   └── SignCaptureScreen.js
│   ├── services/             # Business logic & APIs
│   │   ├── supabaseClient.js
│   │   ├── subscription.js
│   │   └── textCleanup.js
│   ├── theme/                # Styling & colors
│   │   └── colors.js
│   ├── i18n/                 # Internationalization
│   │   ├── translations.js
│   │   └── LanguageContext.js
│   └── config.js             # App configuration
├── supabase/
│   ├── schema.sql            # Database schema
│   └── functions/            # Supabase functions
│       └── lipila-webhook/   # Payment webhook handler
├── assets/                   # Images, icons, fonts
├── app.json                  # Expo configuration
├── package.json              # Dependencies
└── README.md                 # This file
```

## Installation

### Prerequisites
- Node.js 16+
- Expo CLI: `npm install -g expo-cli`
- Supabase account
- Lipila merchant account (for payments)

### Setup

1. **Clone the repository:**
```bash
git clone https://github.com/zedpamphlets-web/Mwape.git
cd sign-speak-zm
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
```bash
cp .env.example .env.local
```

Add your configuration:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
EXPO_PUBLIC_API_URL=your_api_url
LIPILA_MERCHANT_KEY=your_merchant_key
```

4. **Start the development server:**
```bash
npm start
```

5. **Run on device or emulator:**
- iOS: Press `i`
- Android: Press `a`
- Web: Press `w`
- Scan QR code with Expo Go app

## Usage

### Capturing Signs
1. Open the app
2. Tap "Capture Sign"
3. Point camera at sign language
4. Tap capture button
5. Get text translation

### Translating Text
1. Tap "Translate"
2. Enter or paste text
3. Get sign language video/animation
4. Share or save the translation

## API Documentation

### Supabase Functions

#### Lipila Webhook
- **Endpoint:** `supabase/functions/lipila-webhook`
- **Method:** POST
- **Purpose:** Process payment confirmations and update subscriptions

### Database Schema

- **users** - User profiles and preferences
- **subscriptions** - Subscription plans and status
- **translations** - History of translations
- **sign_captures** - Captured sign images and results

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Enhancements

- [ ] ML model for better sign recognition
- [ ] Video recording and playback
- [ ] Gesture recognition improvements
- [ ] Community translation library
- [ ] Offline ML models
- [ ] Real-time translation
- [ ] Sign language learning module
- [ ] Community features (share translations)

## License

MIT License - feel free to use this project for personal or commercial purposes

## Support

For support, email support@signspeak.zm or open an issue on GitHub

## Acknowledgments

- 🙏 Zambian Sign Language community
- 🚀 Expo and React Native teams
- 💚 Supabase for backend services
- 💳 Lipila for payment processing

---

**Made with ❤️ for the Zambian Deaf Community**
