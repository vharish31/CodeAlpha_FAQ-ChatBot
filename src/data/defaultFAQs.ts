import { TopicPreset } from '../types';

export const TOPIC_PRESETS: TopicPreset[] = [
  {
    id: 'ai-studio',
    name: 'Google AI Studio & Gemini',
    description: 'Frequently asked questions regarding Google AI Studio developer tooling, pricing, and API keys.',
    icon: 'Brain',
    faqs: [
      {
        id: 'ai-1',
        category: 'General',
        question: 'What is Google AI Studio?',
        answer: 'Google AI Studio is a fast, web-based prototyping environment for developers to experiment with Gemini models. It allows you to design prompts, test parameters, and export your work to production-ready code in multiple programming languages.'
      },
      {
        id: 'ai-2',
        category: 'Security',
        question: 'How do I secure my Gemini API keys?',
        answer: 'You should always store your Gemini API keys securely in server-side environment variables or serverless secret managers. Never hardcode or expose your API keys in the client-side browser files, as they can be easily stolen.'
      },
      {
        id: 'ai-3',
        category: 'Pricing',
        question: 'Is there a free tier for using Gemini models?',
        answer: 'Yes! Google AI Studio provides a robust free tier with generous rate limits, making it excellent for testing, prototyping, and personal projects. Production scale workloads can transition to a pay-as-you-go model.'
      },
      {
        id: 'ai-4',
        category: 'Models',
        question: 'What is the difference between Gemini Flash and Gemini Pro?',
        answer: 'Gemini Flash is optimized for speed, low latency, and high-frequency tasks at lower costs, while Gemini Pro is designed for complex reasoning, advanced coding, multi-step planning, and maximum accuracy.'
      },
      {
        id: 'ai-5',
        category: 'Capabilities',
        question: 'What multimodal formats does the Gemini API support?',
        answer: 'Gemini models are natively multimodal. They can accept and process diverse inputs including plain text, computer code, images (JPEG, PNG, WebP), audio files (MP3, WAV), and high-resolution video streams.'
      }
    ]
  },
  {
    id: 'smarthome',
    name: 'SmartHome Hub IoT',
    description: 'Troubleshooting guides for pairing, resetting, and configuring smart bulbs, thermostats, and cameras.',
    icon: 'Cpu',
    faqs: [
      {
        id: 'sh-1',
        category: 'Setup',
        question: 'How do I pair my smart plug with the mobile application?',
        answer: 'Plug in the smart outlet. Press and hold the power button for 5-8 seconds until the indicator light blinks rapidly. In your mobile app, tap the plus (+) icon, select "Smart Plug", and follow the on-screen Wi-Fi credentials prompt.'
      },
      {
        id: 'sh-2',
        category: 'Connectivity',
        question: 'Does the smart thermostat continue working if the internet goes down?',
        answer: 'Yes, your smart thermostat will continue regulating temperature based on its cached schedules. You can also make manual adjustments on the wall unit. However, remote control, weather alerts, and smart scheduler overrides require an active Wi-Fi connection.'
      },
      {
        id: 'sh-3',
        category: 'Compatibility',
        question: 'Can I connect Philips Hue smart bulbs directly to Google Home?',
        answer: 'Modern Philips Hue bulbs with Bluetooth can connect directly to the Google Home app without additional hardware. Older Zigbee-only bulbs require a Philips Hue Bridge hub connected to your local router to link with Google Assistant.'
      },
      {
        id: 'sh-4',
        category: 'Troubleshooting',
        question: 'How do I factory reset my outdoor security camera?',
        answer: 'Locate the rubber reset cover on the bottom of the security camera. Use a paperclip or SIM ejector pin to press and hold the internal reset button for 10-15 seconds until the camera plays a setup audio chime and the LED light cycles red.'
      },
      {
        id: 'sh-5',
        category: 'Power',
        question: 'How long does the battery last on the smart doorbell?',
        answer: 'Under average usage (approx. 10-15 motion events per day), the doorbell battery lasts between 4 to 6 months on a single full charge. High-traffic areas, colder temperatures, and continuous live streaming will deplete the battery faster.'
      }
    ]
  },
  {
    id: 'acme-saas',
    name: 'Acme SaaS Billing',
    description: 'Helpful responses regarding subscription tiers, payment safety, team seats, and refund policies.',
    icon: 'CreditCard',
    faqs: [
      {
        id: 'as-1',
        category: 'Billing',
        question: 'How do I upgrade or downgrade my current subscription plan?',
        answer: 'Navigate to your Workspace Dashboard, select "Billing & Subscriptions" in the settings panel, click the "Modify Plan" button, choose your desired tier, and click confirm. Upgrades are prorated instantly; downgrades apply at the start of your next billing cycle.'
      },
      {
        id: 'as-2',
        category: 'Security',
        question: 'Is my credit card and payment info kept secure?',
        answer: 'Absolutely. We process all billing operations via Stripe, a fully PCI-DSS Level 1 compliant processor. We never store, transmit, or view your full credit card credentials on our servers.'
      },
      {
        id: 'as-3',
        category: 'Seats',
        question: 'How many team members can I invite to my workspace?',
        answer: 'The Starter plan includes up to 3 active seats. The Professional plan allows up to 15 team members, and the Enterprise plan offers unlimited team seats alongside dedicated single-sign-on (SSO) capabilities.'
      },
      {
        id: 'as-4',
        category: 'Billing',
        question: 'What is your refund policy?',
        answer: 'We provide a 14-day hassle-free money-back guarantee for all newly initiated subscriptions. If you are unsatisfied for any reason, please email support@acmesaas.com within 14 days of activation, and we will issue a full refund.'
      },
      {
        id: 'as-5',
        category: 'Billing',
        question: 'Can I pay annually instead of monthly?',
        answer: 'Yes! You can toggle between monthly and annual payment schedules in the billing settings. Selecting annual billing grants you a 20% flat discount on any of our paid subscription tiers.'
      }
    ]
  },
  {
    id: 'chat-help',
    name: 'Chat Bot Guide',
    description: 'Helpful information on how the similarity matching system, search thresholds, and chat interface operate.',
    icon: 'MessageSquare',
    faqs: [
      {
        id: 'ch-1',
        category: 'Matching',
        question: 'How does the chatbot find the right answer?',
        answer: 'The chatbot processes your input question by normalizing text, filtering out standard English stopwords, stemming word suffixes, and then computing the Cosine Similarity score against every registered FAQ in the database.'
      },
      {
        id: 'ch-2',
        category: 'Metrics',
        question: 'How does the matching score work?',
        answer: 'A score of 100% means perfect keyword intersection after NLP preprocessing. Lower scores indicate partial matches. The chatbot automatically suggests highly related alternatives when multiple items exceed a low threshold.'
      },
      {
        id: 'ch-3',
        category: 'Robustness',
        question: 'Can the chatbot handle spelling typos?',
        answer: 'Since this engine uses exact keyword matching with basic suffix stemming, major spelling mistakes might lower the score. However, light plurals or verb tenses are normalized (e.g., "updates" to "update") to improve resilience.'
      },
      {
        id: 'ch-4',
        category: 'Privacy',
        question: 'Are my chat queries sent to any external server?',
        answer: 'No. The entire Natural Language Processing (NLP) pipeline and cosine similarity vector math run 100% locally inside your browser, ensuring maximum privacy and instant responses.'
      },
      {
        id: 'ch-5',
        category: 'Customization',
        question: 'Can I customize the active FAQ items?',
        answer: 'Yes! You can use the "Edit FAQs" panel on the left to add your own custom questions, modify the existing questions and answers, or delete topics in real-time.'
      }
    ]
  },
  {
    id: 'human-knowledge',
    name: 'Human Knowledge FAQ',
    description: 'Fascinating general knowledge, biology, cognitive traits, and evolutionary history of humans.',
    icon: 'User',
    faqs: [
      {
        id: 'hk-1',
        category: 'Biology',
        question: 'What is the scientific name for humans?',
        answer: 'The scientific name for modern humans is Homo sapiens, which translates from Latin to "wise man". This species arose in Africa approximately 300,000 years ago.'
      },
      {
        id: 'hk-2',
        category: 'Anatomy',
        question: 'How many bones are in the adult human body?',
        answer: 'An adult human skeleton consists of 206 bones. Interestingly, infants are born with around 270 bones, many of which fuse together as they grow and develop.'
      },
      {
        id: 'hk-3',
        category: 'Anatomy',
        question: 'What is the average resting heart rate for adults?',
        answer: 'For most healthy adults, a normal resting heart rate ranges from 60 to 100 beats per minute. Highly active athletes can have resting heart rates as low as 40 beats per minute.'
      },
      {
        id: 'hk-4',
        category: 'Neurology',
        question: 'How do humans process and store memories?',
        answer: 'Memories are processed through complex neural networks in the brain, primarily involving the hippocampus and prefrontal cortex. They are encoded, stored in short-term or long-term structures, and retrieved through synaptic reactivation.'
      },
      {
        id: 'hk-5',
        category: 'Biology',
        question: 'Why do humans need to sleep?',
        answer: 'Sleep is crucial for physical restoration, immune system support, metabolic regulation, and cognitive health. During sleep, the brain consolidates memories, clears out metabolic waste products, and repairs cellular tissue.'
      },
      {
        id: 'hk-6',
        category: 'Biology',
        question: 'What percentage of the human body is water?',
        answer: 'On average, water makes up about 60% of the adult human body. Crucial organs like the brain and heart are composed of roughly 73% water, while the lungs are about 83% water.'
      }
    ]
  },
  {
    id: 'global-facts',
    name: 'Global Facts',
    description: 'Fascinating universal facts about geography, space, physics, history, and chemistry.',
    icon: 'Globe',
    faqs: [
      {
        id: 'gf-1',
        category: 'Geography',
        question: 'What is the largest ocean on Earth?',
        answer: 'The Pacific Ocean is the largest and deepest ocean on Earth, covering more than 60 million square miles, which is larger than all of Earth’s land area combined.'
      },
      {
        id: 'gf-2',
        category: 'Space',
        question: 'How old is the universe estimated to be?',
        answer: 'The universe is estimated to be approximately 13.8 billion years old, a figure calculated based on cosmic microwave background radiation and expansion rates.'
      },
      {
        id: 'gf-3',
        category: 'Physics',
        question: 'What is the speed of light in a vacuum?',
        answer: 'The speed of light in a vacuum is approximately 299,792 kilometers per second (or about 186,282 miles per second), which serves as an absolute speed limit in modern physics.'
      },
      {
        id: 'gf-4',
        category: 'Geography',
        question: 'What is the tallest mountain on Earth?',
        answer: 'Mount Everest, located in the Himalayas on the border between Nepal and China, is the tallest mountain above sea level, reaching an elevation of 8,848.86 meters (29,031.7 feet).'
      },
      {
        id: 'gf-5',
        category: 'Chemistry',
        question: 'What is the most abundant element in the universe?',
        answer: 'Hydrogen is the most abundant chemical element in the universe, making up roughly 75% of all baryonic (normal) matter, followed by helium which makes up about 24%.'
      },
      {
        id: 'gf-6',
        category: 'History',
        question: 'When did the first human moon landing occur?',
        answer: 'The first human moon landing occurred on July 20, 1969, during the NASA Apollo 11 mission, when Neil Armstrong and Buzz Aldrin stepped onto the lunar surface.'
      }
    ]
  }
];
