import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'bn' | 'te' | 'ta' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation dictionaries
const translations = {
  en: {
    // Header
    'app.title': 'EduQuest',
    'app.subtitle': 'Rural Learning Platform',
    'nav.dashboard': 'Dashboard',
    'nav.subjects': 'Subjects',
    'nav.daily-questions': 'Daily Questions',
    'nav.contests': 'Contests',
    'nav.progress': 'Progress',
    'nav.achievements': 'Achievements',
    'profile': 'Profile',
    'logout': 'Logout',
    'sign-in': 'Sign In',
    'level-scholar': 'Level {level} Scholar',

    // Dashboard
    'welcome.back': 'Welcome back, {name}!',
    'welcome.new': 'Welcome to EduQuest!',
    'daily-goal': 'Complete your daily learning goal',
    'continue-learning': 'Continue Learning',
    'quick-stats': 'Quick Stats',
    'subjects-studied': 'Subjects Studied',
    'quizzes-completed': 'Quizzes Completed',
    'streak-days': 'Day Streak',
    'recent-activity': 'Recent Activity',

    // Subjects
    'choose-subject': 'Choose a Subject to Study',
    'start-learning': 'Start Learning',
    'continue-subject': 'Continue',

    // Auth
    'welcome-back': 'Welcome Back! 🚀',
    'join-eduquest': 'Join EduQuest! 🚀',
    'sign-in-journey': 'Sign in to continue your learning journey',
    'start-adventure': 'Start your educational adventure today',
    'full-name': 'Full Name',
    'email': 'Email',
    'password': 'Password',
    'create-password': 'Create password',
    'forgot-password': 'Forgot password?',
    'sign-in-btn': 'Sign In',
    'start-journey': 'Start My Learning Journey! 🌟',
    'join-teacher': 'Join as Teacher 📚',
    'no-account': "Don't have an account?",
    'have-account': 'Already have an account?',
    'sign-up': 'Sign up',
    'continue-email': 'Or continue with email',

    // Congrats Popup
    'congratulations': 'Congratulations!',
    'welcome-scholar': 'Welcome to EduQuest, Future Scholar! 🌟',
    'welcome-teacher': 'Welcome to EduQuest, Inspiring Teacher! 📚',
    'welcome-returning': 'Welcome back, {name}! 🚀',
    'journey-starts': 'Your educational journey begins now. Let\'s explore, learn, and achieve greatness together!',
    'inspire-educate': 'Ready to inspire and educate? Let\'s create amazing learning experiences!',
    'continue-adventure': 'Continue your learning adventure and unlock new achievements!',
    'first-login': 'First Login Achievement!',
    'start-journey-btn': 'Start My Journey!',
    'continue-learning-btn': 'Continue Learning!',
    'tip-daily-quiz': '💡 Tip: Complete daily quizzes to earn XP and unlock achievements!',

    // Common
    'loading': 'Loading...',
    'error': 'Error',
    'retry': 'Retry',
    'cancel': 'Cancel',
    'confirm': 'Confirm',
    'yes': 'Yes',
    'no': 'No',
  },
  hi: {
    // Header
    'app.title': 'एडुक्वेस्ट',
    'app.subtitle': 'ग्रामीण शिक्षण प्लेटफॉर्म',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.subjects': 'विषय',
    'nav.daily-questions': 'दैनिक प्रश्न',
    'nav.contests': 'प्रतियोगिताएं',
    'nav.progress': 'प्रगति',
    'nav.achievements': 'उपलब्धियां',
    'profile': 'प्रोफ़ाइल',
    'logout': 'लॉग आउट',
    'sign-in': 'साइन इन',
    'level-scholar': 'स्तर {level} विद्वान',

    // Dashboard
    'welcome.back': 'वापसी पर स्वागत, {name}!',
    'welcome.new': 'एडुक्वेस्ट में आपका स्वागत है!',
    'daily-goal': 'अपना दैनिक सीखने का लक्ष्य पूरा करें',
    'continue-learning': 'सीखना जारी रखें',
    'quick-stats': 'त्वरित आँकड़े',
    'subjects-studied': 'अध्ययन किए गए विषय',
    'quizzes-completed': 'पूर्ण किए गए क्विज़',
    'streak-days': 'दिन की लड़ी',
    'recent-activity': 'हाल की गतिविधि',

    // Subjects
    'choose-subject': 'अध्ययन के लिए एक विषय चुनें',
    'start-learning': 'सीखना शुरू करें',
    'continue-subject': 'जारी रखें',

    // Auth
    'welcome-back': 'वापसी पर स्वागत! 🚀',
    'join-eduquest': 'एडुक्वेस्ट से जुड़ें! 🚀',
    'sign-in-journey': 'अपनी सीखने की यात्रा जारी रखने के लिए साइन इन करें',
    'start-adventure': 'आज अपनी शैक्षिक यात्रा शुरू करें',
    'full-name': 'पूरा नाम',
    'email': 'ईमेल',
    'password': 'पासवर्ड',
    'create-password': 'पासवर्ड बनाएं',
    'forgot-password': 'पासवर्ड भूल गए?',
    'sign-in-btn': 'साइन इन',
    'start-journey': 'अपनी यात्रा शुरू करें! 🌟',
    'join-teacher': 'शिक्षक के रूप में जुड़ें 📚',
    'no-account': 'कोई खाता नहीं है?',
    'have-account': 'पहले से खाता है?',
    'sign-up': 'साइन अप',
    'continue-email': 'या ईमेल के साथ जारी रखें',

    // Congrats Popup
    'congratulations': 'बधाई हो!',
    'welcome-scholar': 'एडुक्वेस्ट में आपका स्वागत है, भविष्य के विद्वान! 🌟',
    'welcome-teacher': 'एडुक्वेस्ट में आपका स्वागत है, प्रेरणादायक शिक्षक! 📚',
    'welcome-returning': 'वापसी पर स्वागत, {name}! 🚀',
    'journey-starts': 'आपकी शैक्षिक यात्रा अब शुरू होती है। आइए साथ मिलकर खोजें, सीखें और महानता प्राप्त करें!',
    'inspire-educate': 'प्रेरित करने और शिक्षित करने के लिए तैयार? आइए अद्भुत शिक्षण अनुभव बनाएं!',
    'continue-adventure': 'अपनी सीखने की यात्रा जारी रखें और नए उपलब्धियां अनलॉक करें!',
    'first-login': 'पहला लॉगिन उपलब्धि!',
    'start-journey-btn': 'अपनी यात्रा शुरू करें!',
    'continue-learning-btn': 'सीखना जारी रखें!',
    'tip-daily-quiz': '💡 टिप: XP अर्जित करने और उपलब्धियां अनलॉक करने के लिए दैनिक क्विज़ पूरा करें!',

    // Common
    'loading': 'लोड हो रहा है...',
    'error': 'त्रुटि',
    'retry': 'पुनः प्रयास',
    'cancel': 'रद्द करें',
    'confirm': 'पुष्टि करें',
    'yes': 'हाँ',
    'no': 'नहीं',
  },
  bn: {
    // Header
    'app.title': 'এডুকোয়েস্ট',
    'app.subtitle': 'গ্রামীণ শিক্ষা প্ল্যাটফর্ম',
    'nav.dashboard': 'ড্যাশবোর্ড',
    'nav.subjects': 'বিষয়সমূহ',
    'nav.daily-questions': 'দৈনিক প্রশ্ন',
    'nav.contests': 'প্রতিযোগিতা',
    'nav.progress': 'অগ্রগতি',
    'nav.achievements': 'অর্জন',
    'profile': 'প্রোফাইল',
    'logout': 'লগ আউট',
    'sign-in': 'সাইন ইন',
    'level-scholar': 'স্তর {level} পণ্ডিত',

    // Dashboard
    'welcome.back': 'ফিরে আসায় স্বাগতম, {name}!',
    'welcome.new': 'এডুকোয়েস্টে আপনাকে স্বাগতম!',
    'daily-goal': 'আপনার দৈনিক শিক্ষার লক্ষ্য পূরণ করুন',
    'continue-learning': 'শিখতে থাকুন',
    'quick-stats': 'দ্রুত পরিসংখ্যান',
    'subjects-studied': 'অধ্যয়ন করা বিষয়',
    'quizzes-completed': 'সম্পূর্ণ কুইজ',
    'streak-days': 'দিনের ধারা',
    'recent-activity': 'সাম্প্রতিক কার্যকলাপ',

    // Subjects
    'choose-subject': 'অধ্যয়নের জন্য একটি বিষয় নির্বাচন করুন',
    'start-learning': 'শিখা শুরু করুন',
    'continue-subject': 'চালিয়ে যান',

    // Auth
    'welcome-back': 'ফিরে আসায় স্বাগতম! 🚀',
    'join-eduquest': 'এডুকোয়েস্টে যোগ দিন! 🚀',
    'sign-in-journey': 'আপনার শিক্ষার যাত্রা চালিয়ে যেতে সাইন ইন করুন',
    'start-adventure': 'আজ আপনার শিক্ষামূলক অভিযান শুরু করুন',
    'full-name': 'পুরো নাম',
    'email': 'ইমেইল',
    'password': 'পাসওয়ার্ড',
    'create-password': 'পাসওয়ার্ড তৈরি করুন',
    'forgot-password': 'পাসওয়ার্ড ভুলে গেছেন?',
    'sign-in-btn': 'সাইন ইন',
    'start-journey': 'আপনার যাত্রা শুরু করুন! 🌟',
    'join-teacher': 'শিক্ষক হিসেবে যোগ দিন 📚',
    'no-account': 'কোনো অ্যাকাউন্ট নেই?',
    'have-account': 'ইতিমধ্যে একটি অ্যাকাউন্ট আছে?',
    'sign-up': 'সাইন আপ',
    'continue-email': 'অথবা ইমেইল দিয়ে চালিয়ে যান',

    // Congrats Popup
    'congratulations': 'অভিনন্দন!',
    'welcome-scholar': 'এডুকোয়েস্টে আপনাকে স্বাগতম, ভবিষ্যতের পণ্ডিত! 🌟',
    'welcome-teacher': 'এডুকোয়েস্টে আপনাকে স্বাগতম, অনুপ্রেরণামূলক শিক্ষক! 📚',
    'welcome-returning': 'ফিরে আসায় স্বাগতম, {name}! 🚀',
    'journey-starts': 'আপনার শিক্ষামূলক যাত্রা এখন শুরু হয়। আসুন একসাথে অন্বেষণ করি, শিখি এবং মহত্ত্ব অর্জন করি!',
    'inspire-educate': 'অনুপ্রেরণা করতে এবং শিক্ষিত করতে প্রস্তুত? আসুন অসাধারণ শিক্ষার অভিজ্ঞতা তৈরি করি!',
    'continue-adventure': 'আপনার শিক্ষার অভিযান চালিয়ে যান এবং নতুন অর্জন আনলক করুন!',
    'first-login': 'প্রথম লগইন অর্জন!',
    'start-journey-btn': 'আপনার যাত্রা শুরু করুন!',
    'continue-learning-btn': 'শিখতে থাকুন!',
    'tip-daily-quiz': '💡 টিপ: XP অর্জন এবং অর্জন আনলক করতে দৈনিক কুইজ সম্পূর্ণ করুন!',

    // Common
    'loading': 'লোড হচ্ছে...',
    'error': 'ত্রুটি',
    'retry': 'পুনরায় চেষ্টা করুন',
    'cancel': 'বাতিল',
    'confirm': 'নিশ্চিত করুন',
    'yes': 'হ্যাঁ',
    'no': 'না',
  },
  te: {
    // Header
    'app.title': 'ఎడ్యుక్వెస్ట్',
    'app.subtitle': 'గ్రామీణ విద్యా ప్లాట్‌ఫారమ్',
    'nav.dashboard': 'డ్యాష్‌బోర్డ్',
    'nav.subjects': 'విషయాలు',
    'nav.daily-questions': 'రోజువారీ ప్రశ్నలు',
    'nav.contests': 'స్పర్ధలు',
    'nav.progress': 'పురోగతి',
    'nav.achievements': 'సాధనలు',
    'profile': 'ప్రొఫైల్',
    'logout': 'లాగ్ అవుట్',
    'sign-in': 'సైన్ ఇన్',
    'level-scholar': 'స్థాయి {level} పండితుడు',

    // Dashboard
    'welcome.back': 'తిరిగి స్వాగతం, {name}!',
    'welcome.new': 'ఎడ్యుక్వెస్ట్‌కు స్వాగతం!',
    'daily-goal': 'మీ రోజువారీ నేర్చుకోవడం లక్ష్యాన్ని పూర్తి చేయండి',
    'continue-learning': 'నేర్చుకోవడం కొనసాగించండి',
    'quick-stats': 'త్వరిత గణాంకాలు',
    'subjects-studied': 'అధ్యయనం చేసిన విషయాలు',
    'quizzes-completed': 'పూర్తైన క్విజ్‌లు',
    'streak-days': 'రోజుల స్ట్రీక్',
    'recent-activity': 'ఇటీవలి కార్యాచరణ',

    // Subjects
    'choose-subject': 'అధ్యయనం చేయడానికి విషయాన్ని ఎంచుకోండి',
    'start-learning': 'నేర్చుకోవడం ప్రారంభించండి',
    'continue-subject': 'కొనసాగించండి',

    // Auth
    'welcome-back': 'తిరిగి స్వాగతం! 🚀',
    'join-eduquest': 'ఎడ్యుక్వెస్ట్‌కు చేరండి! 🚀',
    'sign-in-journey': 'మీ నేర్చుకోవడం ప్రయాణాన్ని కొనసాగించడానికి సైన్ ఇన్ చేయండి',
    'start-adventure': 'నేటే మీ విద్యా అడ్వెంచర్ ప్రారంభించండి',
    'full-name': 'పూర్తి పేరు',
    'email': 'ఇమెయిల్',
    'password': 'పాస్‌వర్డ్',
    'create-password': 'పాస్‌వర్డ్ సృష్టించండి',
    'forgot-password': 'పాస్‌వర్డ్ మర్చిపోయారా?',
    'sign-in-btn': 'సైన్ ఇన్',
    'start-journey': 'మీ ప్రయాణం ప్రారంభించండి! 🌟',
    'join-teacher': 'ఉపాధ్యాయుడిగా చేరండి 📚',
    'no-account': 'ఖాతా లేదా?',
    'have-account': 'ఇప్పటికే ఖాతా ఉందా?',
    'sign-up': 'సైన్ అప్',
    'continue-email': 'లేదా ఇమెయిల్‌తో కొనసాగించండి',

    // Congrats Popup
    'congratulations': 'అభినందనలు!',
    'welcome-scholar': 'ఎడ్యుక్వెస్ట్‌కు స్వాగతం, భవిష్యత్తు పండితుడా! 🌟',
    'welcome-teacher': 'ఎడ్యుక్వెస్ట్‌కు స్వాగతం, ప్రేరణాత్మక ఉపాధ్యాయుడా! 📚',
    'welcome-returning': 'తిరిగి స్వాగతం, {name}! 🚀',
    'journey-starts': 'మీ విద్యా ప్రయాణం ఇప్పుడు ప్రారంభమవుతుంది. వెతకడం, నేర్చుకోవడం మరియు మహత్త్వం సాధించడం కోసం కలిసి రండి!',
    'inspire-educate': 'ప్రేరేపించడానికి మరియు విద్యావేత్తులను సిద్ధం చేయడానికి సిద్ధంగా ఉన్నారా? అద్భుతమైన విద్యా అనుభవాలను సృష్టించడం ప్రారంభిద్దాం!',
    'continue-adventure': 'మీ విద్యా అడ్వెంచర్‌ను కొనసాగించండి మరియు కొత్త సాధనలను అన్‌లాక్ చేయండి!',
    'first-login': 'మొదటి లాగిన్ సాధన!',
    'start-journey-btn': 'మీ ప్రయాణం ప్రారంభించండి!',
    'continue-learning-btn': 'నేర్చుకోవడం కొనసాగించండి!',
    'tip-daily-quiz': '💡 సూచన: XP సంపాదించడానికి మరియు సాధనలను అన్‌లాక్ చేయడానికి రోజువారీ క్విజ్‌లను పూర్తి చేయండి!',

    // Common
    'loading': 'లోడ్ అవుతోంది...',
    'error': 'లోపం',
    'retry': 'మళ్లీ ప్రయత్నించండి',
    'cancel': 'రద్దు చేయండి',
    'confirm': 'నిర్ధారించండి',
    'yes': 'అవును',
    'no': 'కాదు',
  },
  ta: {
    // Header
    'app.title': 'எடுக்குவெஸ்ட்',
    'app.subtitle': 'கிராமப்புற கல்வி தளம்',
    'nav.dashboard': 'டாஷ்போர்டு',
    'nav.subjects': 'பாடங்கள்',
    'nav.daily-questions': 'தினசரி கேள்விகள்',
    'nav.contests': 'போட்டிகள்',
    'nav.progress': 'முன்னேற்றம்',
    'nav.achievements': 'சாதனைகள்',
    'profile': 'சுயவிவரம்',
    'logout': 'வெளியேறு',
    'sign-in': 'உள்நுழை',
    'level-scholar': 'நிலை {level} அறிஞர்',

    // Dashboard
    'welcome.back': 'மீண்டும் வருக, {name}!',
    'welcome.new': 'எடுக்குவெஸ்ட்டுக்கு வருக!',
    'daily-goal': 'உங்கள் தினசரி கல்வி இலக்கை நிறைவு செய்யுங்கள்',
    'continue-learning': 'கற்றலை தொடருங்கள்',
    'quick-stats': 'விரைவு புள்ளியியல்',
    'subjects-studied': 'படித்த பாடங்கள்',
    'quizzes-completed': 'நிறைவு செய்யப்பட்ட வினாடி வினாக்கள்',
    'streak-days': 'நாள் தொடர்',
    'recent-activity': 'சமீபத்திய செயல்பாடு',

    // Subjects
    'choose-subject': 'படிப்புக்கு ஒரு பாடத்தை தேர்ந்தெடுங்கள்',
    'start-learning': 'கற்றலை தொடங்கு',
    'continue-subject': 'தொடரு',

    // Auth
    'welcome-back': 'மீண்டும் வருக! 🚀',
    'join-eduquest': 'எடுக்குவெஸ்ட்டில் இணையுங்கள்! 🚀',
    'sign-in-journey': 'உங்கள் கல்வி பயணத்தை தொடர உள்நுழையுங்கள்',
    'start-adventure': 'இன்றே உங்கள் கல்வி சாகசத்தை தொடங்குங்கள்',
    'full-name': 'முழு பெயர்',
    'email': 'மின்னஞ்சல்',
    'password': 'கடவுச்சொல்',
    'create-password': 'கடவுச்சொல் உருவாக்கு',
    'forgot-password': 'கடவுச்சொல் மறந்துவிட்டதா?',
    'sign-in-btn': 'உள்நுழை',
    'start-journey': 'உங்கள் பயணத்தை தொடங்குங்கள்! 🌟',
    'join-teacher': 'ஆசிரியராக இணையுங்கள் 📚',
    'no-account': 'கணக்கு இல்லையா?',
    'have-account': 'ஏற்கனவே கணக்கு உள்ளதா?',
    'sign-up': 'பதிவு செய்',
    'continue-email': 'அல்லது மின்னஞ்சலுடன் தொடருங்கள்',

    // Congrats Popup
    'congratulations': 'வாழ்த்துகள்!',
    'welcome-scholar': 'எடுக்குவெஸ்ட்டுக்கு வருக, எதிர்கால அறிஞரே! 🌟',
    'welcome-teacher': 'எடுக்குவெஸ்ட்டுக்கு வருக, ஊக்கமளிக்கும் ஆசிரியரே! 📚',
    'welcome-returning': 'மீண்டும் வருக, {name}! 🚀',
    'journey-starts': 'உங்கள் கல்வி பயணம் இப்போது தொடங்குகிறது. ஒன்றாக ஆராய்வோம், கற்றுக்கொள்வோம் மற்றும் மேன்மையை அடைவோம்!',
    'inspire-educate': 'ஊக்குவிப்பதற்கும் கல்வியளிப்பதற்கும் தயாரா? அற்புதமான கல்வி அனுபவங்களை உருவாக்குவோம்!',
    'continue-adventure': 'உங்கள் கல்வி சாகசத்தை தொடர்ந்து புதிய சாதனைகளை திறக்கவும்!',
    'first-login': 'முதல் உள்நுழைவு சாதனை!',
    'start-journey-btn': 'உங்கள் பயணத்தை தொடங்குங்கள்!',
    'continue-learning-btn': 'கற்றலை தொடருங்கள்!',
    'tip-daily-quiz': '💡 குறிப்பு: XP பெற மற்றும் சாதனைகளை திறக்க தினசரி வினாடி வினாக்களை நிறைவு செய்யுங்கள்!',

    // Common
    'loading': 'ஏற்றப்படுகிறது...',
    'error': 'பிழை',
    'retry': 'மீண்டும் முயற்சி செய்',
    'cancel': 'ரத்து செய்',
    'confirm': 'உறுதிப்படுத்து',
    'yes': 'ஆம்',
    'no': 'இல்லை',
  },
  mr: {
    // Header
    'app.title': 'एडुक्वेस्ट',
    'app.subtitle': 'ग्रामीण शिक्षण प्लॅटफॉर्म',
    'nav.dashboard': 'डॅशबोर्ड',
    'nav.subjects': 'विषय',
    'nav.daily-questions': 'दैनिक प्रश्न',
    'nav.contests': 'स्पर्धा',
    'nav.progress': 'प्रगती',
    'nav.achievements': 'उपलब्धी',
    'profile': 'प्रोफाइल',
    'logout': 'लॉग आउट',
    'sign-in': 'साइन इन',
    'level-scholar': 'स्तर {level} विद्वान',

    // Dashboard
    'welcome.back': 'परत स्वागत, {name}!',
    'welcome.new': 'एडुक्वेस्टमध्ये आपले स्वागत!',
    'daily-goal': 'आपले दैनिक शिक्षण लक्ष्य पूर्ण करा',
    'continue-learning': 'शिकत राहा',
    'quick-stats': 'द्रुत आकडेवारी',
    'subjects-studied': 'अभ्यासलेले विषय',
    'quizzes-completed': 'पूर्ण झालेली क्विझ',
    'streak-days': 'दिवसांची मालिका',
    'recent-activity': 'अलीकडील क्रियाकलाप',

    // Subjects
    'choose-subject': 'अभ्यासासाठी विषय निवडा',
    'start-learning': 'शिकायला सुरुवात करा',
    'continue-subject': 'सुरू ठेवा',

    // Auth
    'welcome-back': 'परत स्वागत! 🚀',
    'join-eduquest': 'एडुक्वेस्टमध्ये सामील व्हा! 🚀',
    'sign-in-journey': 'आपल्या शिक्षण प्रवासात सुरू ठेवण्यासाठी साइन इन करा',
    'start-adventure': 'आज आपले शैक्षणिक साहस सुरू करा',
    'full-name': 'पूर्ण नाव',
    'email': 'ईमेल',
    'password': 'पासवर्ड',
    'create-password': 'पासवर्ड तयार करा',
    'forgot-password': 'पासवर्ड विसरलात?',
    'sign-in-btn': 'साइन इन',
    'start-journey': 'आपले सफर सुरू करा! 🌟',
    'join-teacher': 'शिक्षक म्हणून सामील व्हा 📚',
    'no-account': 'खाते नाही?',
    'have-account': 'आधीपासून खाते आहे?',
    'sign-up': 'साइन अप',
    'continue-email': 'किंवा ईमेलने सुरू ठेवा',

    // Congrats Popup
    'congratulations': 'अभिनंदन!',
    'welcome-scholar': 'एडुक्वेस्टमध्ये आपले स्वागत, भविष्याचे विद्वान! 🌟',
    'welcome-teacher': 'एडुक्वेस्टमध्ये आपले स्वागत, प्रेरणादायी शिक्षक! 📚',
    'welcome-returning': 'परत स्वागत, {name}! 🚀',
    'journey-starts': 'आपले शैक्षणिक सफर आता सुरू होते. एकत्र शोधूया, शिकूया आणि महानता प्राप्त करूया!',
    'inspire-educate': 'प्रेरणा देण्यासाठी आणि शिक्षित करण्यासाठी तयार? अद्भुत शिक्षण अनुभव तयार करूया!',
    'continue-adventure': 'आपले शिक्षण साहस सुरू ठेवा आणि नवीन उपलब्धी अनलॉक करा!',
    'first-login': 'पहिली लॉगिन उपलब्धी!',
    'start-journey-btn': 'आपले सफर सुरू करा!',
    'continue-learning-btn': 'शिकत राहा!',
    'tip-daily-quiz': '💡 टिप: XP मिळवण्यासाठी आणि उपलब्धी अनलॉक करण्यासाठी दैनिक क्विझ पूर्ण करा!',

    // Common
    'loading': 'लोड होत आहे...',
    'error': 'त्रुटी',
    'retry': 'पुन्हा प्रयत्न करा',
    'cancel': 'रद्द करा',
    'confirm': 'पुष्टी करा',
    'yes': 'होय',
    'no': 'नाही',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Get language from localStorage or default to 'en'
    const saved = localStorage.getItem('eduquest-language');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('eduquest-language', lang);
  };

  const t = (key: string): string => {
    const translation = translations[language]?.[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`);
      return translations.en[key] || key;
    }

    // Replace placeholders like {name} with actual values
    return translation.replace(/\{(\w+)\}/g, (match, placeholder) => {
      // For now, return the placeholder as is since we don't have context values here
      // In a real app, you'd pass context or use a more sophisticated system
      return match;
    });
  };

  useEffect(() => {
    // Update document language attribute
    document.documentElement.lang = language;
  }, [language]);

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
