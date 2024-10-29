import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };

    return (
        <div className='flex gap-6'>
            <button onClick={() => changeLanguage('en')}>English</button>
           <div>
           <button onClick={() => changeLanguage('ar')}>العربية</button>
           </div>
        </div>
    );
};
export default LanguageSwitcher;
