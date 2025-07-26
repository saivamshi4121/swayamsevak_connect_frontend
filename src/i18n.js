import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'Stories of Impact': 'Stories of Impact',
      'Seva Project Success': 'Seva Project Success',
      'Over 1000 meals served in our recent food drive, thanks to dedicated swayamsevaks.': 'Over 1000 meals served in our recent food drive, thanks to dedicated swayamsevaks.',
      'Youth Leader Spotlight': 'Youth Leader Spotlight',
      'Meet Priya, who started a new shakha in her town and inspired dozens of youth.': 'Meet Priya, who started a new shakha in her town and inspired dozens of youth.',
      'Cultural Event Impact': 'Cultural Event Impact',
      'Our annual Milan brought together 500+ participants for games, learning, and tradition.': 'Our annual Milan brought together 500+ participants for games, learning, and tradition.',
      // Add more translations as needed
    }
  },
  hi: {
    translation: {
      'Stories of Impact': 'प्रभाव की कहानियाँ',
      'Seva Project Success': 'सेवा परियोजना की सफलता',
      'Over 1000 meals served in our recent food drive, thanks to dedicated swayamsevaks.': 'हाल की खाद्य सेवा में 1000+ भोजन वितरित किए गए, समर्पित स्वयंसेवकों के कारण।',
      'Youth Leader Spotlight': 'युवा नेता की झलक',
      'Meet Priya, who started a new shakha in her town and inspired dozens of youth.': 'प्रिय से मिलें, जिन्होंने अपने शहर में नई शाखा शुरू की और दर्जनों युवाओं को प्रेरित किया।',
      'Cultural Event Impact': 'सांस्कृतिक कार्यक्रम का प्रभाव',
      'Our annual Milan brought together 500+ participants for games, learning, and tradition.': 'हमारे वार्षिक मिलन में 500+ प्रतिभागी खेल, शिक्षा और परंपरा के लिए एकत्रित हुए।',
      // Add more translations as needed
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 