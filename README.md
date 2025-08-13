# Voca AI - AWS-Powered AI Phone Agent

Voca AI is an intelligent AI phone agent built on AWS, designed to help Microfinance Banks and Online Retailers manage customer service efficiently, reduce operational costs, and deliver personalized customer experiences.

## 🚀 Features

### Core Strengths

- **Voice & Multichannel Support**
  - Real-time phone call handling with Amazon Connect
  - Seamless integration with WhatsApp, SMS, and email for omnichannel engagement

- **AI-Driven Conversations**
  - Amazon Bedrock for natural, human-like customer conversations
  - Customizable conversation flows for banking and e-commerce needs

- **Intelligent Routing & Task Automation**
  - Directs customer queries to the right department or agent
  - Automates repetitive tasks such as account balance checks, loan application status, and order tracking

- **Scalable & Secure AWS Architecture**
  - Built with Amazon Connect, Lambda, DynamoDB, S3, and Amazon Bedrock
  - Security-first approach with AWS IAM and encryption

- **Multilingual Capability**
  - Supports multiple languages to serve diverse customer bases

## 🏗️ Architecture

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Recharts** for data visualization

### Backend (Planned)
- **AWS Lambda** for serverless functions
- **Amazon Connect** for voice calls
- **Amazon Bedrock** for AI conversations
- **DynamoDB** for data storage
- **Amazon S3** for file storage
- **AWS IAM** for security

## 📁 Project Structure

```
voca-ai/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/          # Dashboard page
│   │   ├── conversations/      # Conversations management
│   │   ├── customers/          # Customer management
│   │   ├── analytics/          # Analytics and reporting
│   │   ├── integrations/       # AWS integrations
│   │   ├── settings/           # Organization settings
│   │   └── api/                # API routes (planned)
│   ├── components/             # Reusable components
│   │   ├── ui/                 # UI components (Card, Badge, etc.)
│   │   ├── layout/             # Layout components (Sidebar, Header)
│   │   └── features/           # Feature-specific components
│   ├── lib/                    # Utility functions
│   ├── types/                  # TypeScript type definitions
│   ├── hooks/                  # Custom React hooks
│   └── utils/                  # Helper functions
├── public/                     # Static assets
├── .env.local                  # Environment variables
└── package.json                # Dependencies and scripts
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- AWS Account (for future backend integration)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd voca-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
   
   # AWS Configuration (for future integration)
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   
   # Amazon Connect Configuration
   AMAZON_CONNECT_INSTANCE_ID=your-connect-instance-id
   AMAZON_CONNECT_PHONE_NUMBER=+1234567890
   
   # Amazon Bedrock Configuration
   BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
   
   # Database Configuration
   DYNAMODB_TABLE_NAME=voca-ai-interactions
   S3_BUCKET_NAME=voca-ai-storage
   
   # Feature Flags
   ENABLE_MULTILINGUAL=true
   ENABLE_VOICE_ANALYTICS=true
   ENABLE_SENTIMENT_ANALYSIS=true
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Pages Overview

### Dashboard
- Overview of key metrics and performance indicators
- Real-time conversation monitoring
- Channel distribution and recent activity

### Conversations
- Manage and monitor customer interactions
- Filter by status, channel, and search terms
- View conversation details and transcripts

### Customers
- Customer database management
- Contact information and interaction history
- Customer segmentation and tagging

### Analytics
- Detailed performance insights
- Channel performance metrics
- Sentiment analysis and trends
- Language distribution statistics

### Integrations
- AWS service configuration
- Third-party service connections
- Integration health monitoring

### Settings
- Organization configuration
- Routing rules and automation
- Security and notification preferences

## 🎯 Use Cases

### For Microfinance Banks
- 24/7 customer service for loan inquiries
- Account information and payment reminders
- KYC verification and loan eligibility checks
- Reduce branch queues with automated support

### For Online Retailers/Vendors
- Handle order inquiries and tracking
- Process returns and refunds
- Upsell and cross-sell based on purchase history
- Proactive delivery updates and promotions

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured with Next.js rules
- **Prettier**: Code formatting
- **Tailwind CSS**: Utility-first styling

### Component Guidelines

- Use TypeScript interfaces for props
- Implement responsive design
- Follow accessibility best practices
- Use semantic HTML elements

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### AWS Amplify

1. Connect your repository to AWS Amplify
2. Configure build settings
3. Set environment variables
4. Deploy to AWS infrastructure

## 🔒 Security

- Environment variables for sensitive data
- AWS IAM roles and policies
- Input validation and sanitization
- HTTPS enforcement
- Regular security updates

## 📊 Monitoring & Analytics

- Real-time conversation monitoring
- Performance metrics tracking
- Error logging and alerting
- Customer satisfaction surveys
- Integration health checks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Frontend UI/UX implementation
- ✅ Mock data and components
- ✅ Basic routing and navigation

### Phase 2 (Next)
- 🔄 AWS backend integration
- 🔄 Amazon Connect setup
- 🔄 Amazon Bedrock integration
- 🔄 DynamoDB implementation

### Phase 3 (Future)
- 📋 Advanced AI features
- 📋 Multi-language support
- 📋 Advanced analytics
- 📋 Mobile app development

---

**Built with ❤️ for better customer experiences**
