'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Lang = 'en' | 'zh';

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const translations: Record<Lang, Record<string, string>> = {
  en: {
    // Navbar
    'nav.explore': 'Explore',
    'nav.blog': 'Blog',
    'nav.aboutUs': 'About Us',
    'nav.logIn': 'Log In',
    'nav.golnext': 'GOLnext',
    'nav.podcast': 'Podcast',
    'nav.programs': 'Programs & Events',
    'nav.ourStory': 'Our Story',
    'nav.team': 'Team',
    'nav.contactUs': 'Contact Us',
    'nav.welcomeBack': 'Welcome back,',
    'nav.dashboard': 'Dashboard',
    'nav.settings': 'Settings & Privacy',
    'nav.language': 'Language',
    'nav.signOut': 'Sign out',
    'nav.viewProfile': 'View profile',
    'nav.account': 'Account',

    // Hero
    'hero.confused': 'Confused',
    'hero.lost': 'Lost',
    'hero.stuck': 'Stuck',
    'hero.overwhelmed': 'Overwhelmed',
    'hero.frustrated': 'Frustrated',
    'hero.unsure': 'Unsure',
    'hero.headline': 'NextTry is here for you.',
    'hero.subtitle': 'And this, is your next step.',
    'hero.cta': 'Get Started',

    // Logos
    'logos.trusted': 'Trusted by leading companies and institutions',

    // Life stages
    'stage.secondary': 'Secondary School',
    'stage.secondaryTag': 'Figuring out who you want to become',
    'stage.university': 'University',
    'stage.universityTag': 'More choices, less clarity',
    'stage.earlyCareer': 'Early Career',
    'stage.earlyCareerTag': 'Starting out and standing out',
    'stage.careerChange': 'Career Change',
    'stage.careerChangeTag': 'Brave enough to start over',
    'stage.retired': 'Retired',
    'stage.retiredTag': 'A lifetime of wisdom, still unfolding',
    'stage.closing': 'Wherever you are in life,',
    'stage.closingBrand': 'NextTry',
    'stage.closingEnd': 'is here.',

    // What We Offer
    'offer.label': 'What We Offer',
    'offer.heading': 'Everything you need for your next step',
    'offer.golnext': 'GOLnext',
    'offer.golnextSub': 'AI Mentor',
    'offer.golnextDesc': 'Personalised career guidance powered by AI',
    'offer.golnextCta': 'Try GOLnext',
    'offer.podcast': 'The Fourth Relationship',
    'offer.podcastSub': 'Podcast',
    'offer.podcastDesc': 'Real mentorship stories, real growth',
    'offer.podcastCta': 'Listen Now',
    'offer.events': 'Programs & Events',
    'offer.eventsSub': 'Community',
    'offer.eventsDesc': 'Find your mentor. Build your path.',
    'offer.eventsCta': 'View Events',
    'offer.learnMore': 'Learn more',

    // How It Works
    'how.label': 'How It Works',
    'how.heading': 'How NextTry works',
    'how.step1': 'Discover yourself',
    'how.step1Desc': "Understand where you are and what's holding you back",
    'how.step2': 'Find your people',
    'how.step2Desc': 'Connect with mentors, stories, and community',
    'how.step3': 'Take your next step',
    'how.step3Desc': 'Move forward with clarity and confidence',

    // Social Proof
    'social.label': 'Testimonials',
    'social.heading': 'What our community says',
    'social.subtitle': 'Real people. Real stages of life. Real stories.',

    // CTA
    'cta.heading': 'Ready for your next step?',
    'cta.subtitle': 'Wherever you are in life — NextTry is here. Every stage. Every question. Every next step.',
    'cta.button': 'Get Started',

    // Footer
    'footer.tagline': 'Wherever you are in life — NextTry is here. Every stage. Every question. Every next step.',
    'footer.rights': 'All rights reserved.',
    'footer.explore': 'Explore',
    'footer.company': 'Company',
    'footer.resources': 'Resources',
    'footer.social': 'Social',
    'footer.privacyPolicy': 'Privacy Policy',
    'footer.blog': 'Blog',
    'footer.mentorship': 'Mentorship',
    'footer.help': 'Help',
    'footer.terms': 'Terms of Service',

    // Dashboard
    'dash.greeting.morning': 'Good morning',
    'dash.greeting.afternoon': 'Good afternoon',
    'dash.greeting.evening': 'Good evening',
    'dash.subtitle': "Here's what's happening in your NextTry journey.",
    'dash.prompt': "What's on your mind today?",
    'dash.promptSub': 'Ask GOLnext — your AI mentor is ready.',
    'dash.quickActions': 'Quick actions',
    'dash.upcomingEvents': 'Upcoming Events',
    'dash.viewAll': 'View all',
    'dash.connects': 'Connects',
    'dash.all': 'All',
    'dash.join': 'Join',
    'dash.open': 'Open',

    // Sidebar
    'side.home': 'Home',
    'side.golnext': 'GOLnext',
    'side.connects': 'Connects',
    'side.programs': 'Programs & Events',
    'side.profile': 'Profile',
    'side.settings': 'Settings',

    // GOLnext
    'gol.greeting': 'How can I help you today?',
    'gol.placeholder': 'Ask GOLnext anything...',
    'gol.followUp': 'Ask a follow-up...',
    'gol.sug1': "I don't know what I want to do after graduation",
    'gol.sug2': "I want to change careers but I'm scared",
    'gol.sug3': "I feel stuck and don't know why",
    'gol.sug4': "I have too many options and can't decide",

    // Profile
    'profile.title': 'Profile',
    'profile.edit': 'Edit',
    'profile.editTitle': 'Edit Profile',
    'profile.cancel': 'Cancel',
    'profile.signedIn': 'Signed in with Google',
    'profile.about': 'About',
    'profile.contact': 'Contact',
    'profile.social': 'Social',
    'profile.connected': 'Connected',
    'profile.noBio': 'No bio yet — click Edit to add one.',
    'profile.noSocial': 'No social accounts linked yet.',
    'profile.stage': 'Your Stage',
    'profile.stageDesc': 'Where are you in your journey right now?',
    'profile.aboutMe': 'About Me',
    'profile.aboutMeDesc': 'Tell us a bit about yourself and what you are looking for.',
    'profile.connectedAccounts': 'Connected Accounts',
    'profile.connectedAccountsDesc': 'Link your social profiles so others can find you.',
    'profile.save': 'Save Changes',
    'profile.saved': 'Saved',
    'profile.fullName': 'Full Name',
    'profile.email': 'Email',

    // Coming Soon
    'comingSoon': 'Coming Soon',
    'comingSoonDesc': 'We are working on this page. Check back soon.',

    // Blog
    'blog.title': 'Our most recent articles',
    'blog.read': 'Read',

    // Contact
    'contact.title': 'How can we help you?',
    'contact.desc': 'We are available for questions, feedback, or collaboration opportunities. Let us know how we can help!',
    'contact.submit': 'Submit',
    'contact.sent': 'Message sent!',
    'contact.sentDesc': 'Thank you for reaching out. We will get back to you as soon as possible.',
    'contact.sendAnother': 'Send another message',
  },
  zh: {
    // Navbar
    'nav.explore': '探索',
    'nav.blog': '博客',
    'nav.aboutUs': '關於我們',
    'nav.logIn': '登入',
    'nav.golnext': 'GOLnext',
    'nav.podcast': '播客',
    'nav.programs': '活動與課程',
    'nav.ourStory': '我們的故事',
    'nav.team': '團隊',
    'nav.contactUs': '聯繫我們',
    'nav.welcomeBack': '歡迎回來，',
    'nav.dashboard': '主頁',
    'nav.settings': '設定與隱私',
    'nav.language': '語言',
    'nav.signOut': '登出',
    'nav.viewProfile': '查看個人資料',
    'nav.account': '帳戶',

    // Hero
    'hero.confused': '迷茫',
    'hero.lost': '迷失',
    'hero.stuck': '困住',
    'hero.overwhelmed': '不知所措',
    'hero.frustrated': '沮喪',
    'hero.unsure': '不確定',
    'hero.headline': 'NextTry 在這裡陪你。',
    'hero.subtitle': '而這，就是你的下一步。',
    'hero.cta': '立即開始',

    // Logos
    'logos.trusted': '受到領先企業和機構的信賴',

    // Life stages
    'stage.secondary': '中學',
    'stage.secondaryTag': '探索你想成為什麼樣的人',
    'stage.university': '大學',
    'stage.universityTag': '選擇越多，方向越模糊',
    'stage.earlyCareer': '初入職場',
    'stage.earlyCareerTag': '踏出第一步，嶄露頭角',
    'stage.careerChange': '職業轉換',
    'stage.careerChangeTag': '勇敢地重新開始',
    'stage.retired': '退休',
    'stage.retiredTag': '一生的智慧，仍在綻放',
    'stage.closing': '無論你在人生的哪個階段，',
    'stage.closingBrand': 'NextTry',
    'stage.closingEnd': '都在這裡。',

    // What We Offer
    'offer.label': '我們提供',
    'offer.heading': '你邁出下一步所需的一切',
    'offer.golnext': 'GOLnext',
    'offer.golnextSub': 'AI 導師',
    'offer.golnextDesc': '由人工智能驅動的個人化職業指導',
    'offer.golnextCta': '試用 GOLnext',
    'offer.podcast': '第四種關係',
    'offer.podcastSub': '播客',
    'offer.podcastDesc': '真實的導師故事，真實的成長',
    'offer.podcastCta': '立即收聽',
    'offer.events': '活動與課程',
    'offer.eventsSub': '社群',
    'offer.eventsDesc': '找到你的導師，建立你的道路。',
    'offer.eventsCta': '查看活動',
    'offer.learnMore': '了解更多',

    // How It Works
    'how.label': '如何運作',
    'how.heading': 'NextTry 如何運作',
    'how.step1': '認識自己',
    'how.step1Desc': '了解你現在的位置和什麼在阻礙你',
    'how.step2': '找到你的人',
    'how.step2Desc': '與導師、故事和社群建立聯繫',
    'how.step3': '邁出下一步',
    'how.step3Desc': '帶著清晰和信心向前邁進',

    // Social Proof
    'social.label': '用戶評價',
    'social.heading': '社群怎麼說',
    'social.subtitle': '真實的人。真實的人生階段。真實的故事。',

    // CTA
    'cta.heading': '準備好邁出下一步了嗎？',
    'cta.subtitle': '無論你在人生的哪個階段 — NextTry 都在這裡。每個階段。每個問題。每一個下一步。',
    'cta.button': '立即開始',

    // Footer
    'footer.tagline': '無論你在人生的哪個階段 — NextTry 都在這裡。每個階段。每個問題。每一個下一步。',
    'footer.rights': '版權所有。',
    'footer.explore': '探索',
    'footer.company': '公司',
    'footer.resources': '資源',
    'footer.social': '社交媒體',
    'footer.privacyPolicy': '隱私政策',
    'footer.blog': '博客',
    'footer.mentorship': '導師計劃',
    'footer.help': '幫助',
    'footer.terms': '服務條款',

    // Dashboard
    'dash.greeting.morning': '早安',
    'dash.greeting.afternoon': '午安',
    'dash.greeting.evening': '晚安',
    'dash.subtitle': '這是你在 NextTry 旅程中的最新動態。',
    'dash.prompt': '你今天有什麼想法？',
    'dash.promptSub': '問 GOLnext — 你的 AI 導師已準備就緒。',
    'dash.quickActions': '快速操作',
    'dash.upcomingEvents': '即將舉行的活動',
    'dash.viewAll': '查看全部',
    'dash.connects': '人脈',
    'dash.all': '全部',
    'dash.join': '參加',
    'dash.open': '打開',

    // Sidebar
    'side.home': '主頁',
    'side.golnext': 'GOLnext',
    'side.connects': '人脈',
    'side.programs': '活動與課程',
    'side.profile': '個人資料',
    'side.settings': '設定',

    // GOLnext
    'gol.greeting': '我能幫你什麼？',
    'gol.placeholder': '問 GOLnext 任何問題...',
    'gol.followUp': '繼續提問...',
    'gol.sug1': '畢業後我不知道要做什麼',
    'gol.sug2': '我想轉行但我害怕',
    'gol.sug3': '我覺得卡住了，不知道為什麼',
    'gol.sug4': '我有太多選擇，無法決定',

    // Profile
    'profile.title': '個人資料',
    'profile.edit': '編輯',
    'profile.editTitle': '編輯個人資料',
    'profile.cancel': '取消',
    'profile.signedIn': '已透過 Google 登入',
    'profile.about': '關於',
    'profile.contact': '聯繫方式',
    'profile.social': '社交帳號',
    'profile.connected': '已連接',
    'profile.noBio': '尚未填寫 — 點擊編輯來新增。',
    'profile.noSocial': '尚未連接社交帳號。',
    'profile.stage': '你的階段',
    'profile.stageDesc': '你現在處於旅程中的哪個位置？',
    'profile.aboutMe': '關於我',
    'profile.aboutMeDesc': '告訴我們一些關於你自己以及你在尋找什麼。',
    'profile.connectedAccounts': '已連接帳號',
    'profile.connectedAccountsDesc': '連結你的社交帳號，讓其他人可以找到你。',
    'profile.save': '儲存變更',
    'profile.saved': '已儲存',
    'profile.fullName': '全名',
    'profile.email': '電子郵件',

    // Coming Soon
    'comingSoon': '即將推出',
    'comingSoonDesc': '我們正在開發此頁面，敬請期待。',

    // Blog
    'blog.title': '最新文章',
    'blog.read': '閱讀',

    // Contact
    'contact.title': '我們能幫你什麼？',
    'contact.desc': '我們隨時為你解答問題、提供反饋或合作機會。請告訴我們你的需求！',
    'contact.submit': '提交',
    'contact.sent': '訊息已發送！',
    'contact.sentDesc': '感謝你的聯繫，我們會盡快回覆你。',
    'contact.sendAnother': '發送另一條訊息',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  const t = (key: string): string => {
    return translations[lang][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
