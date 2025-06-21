import React from 'react';
import { useNavigate } from 'react-router-dom';
import phygenLogo from '../assets/icons/phygen-icon.png';
import landmarkIcon from '../assets/icons/landmark-icon.png';
import blendIcon from '../assets/icons/blend-icon.png';
import scanTextIcon from '../assets/icons/scan-text.png';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const Landing = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-[#F1F5F9] flex flex-col">
            <div className="flex flex-1 items-start justify-center pt-32 px-8">
                {/* Left: Logo + Title + Desc + Features */}
                <div className="flex flex-col">
                    <div className="flex items-center gap-6">
                        <img src={phygenLogo} alt="PhyGen Logo" className="w-40 h-40 object-contain" />
                        <span className="text-[#004AAD] font-bold text-7xl leading-none">PhyGen</span>
                    </div>
                    <div className=" text-lg text-black font-normal"
                        dangerouslySetInnerHTML={{ __html: t('landing_description_html') }}
                    />
                    <div className="flex gap-8 mt-5">
                        <div className="flex items-center gap-2">
                            <img src={landmarkIcon} alt="Question bank" className="w-6 h-6" />
                            <span className="text-[#004AAD] text-base font-medium">{t('feature_question_bank')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <img src={blendIcon} alt="Mix exam" className="w-6 h-6" />
                            <span className="text-[#004AAD] text-base font-medium">{t('feature_mix_exam')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <img src={scanTextIcon} alt="Mark the multiple-choice sheet" className="w-6 h-6" />
                            <span className="text-[#004AAD] text-base font-medium">{t('feature_mark_sheet')}</span>
                        </div>
                    </div>
                </div>
                {/* Right: Action Card */}
                <div className="ml-24">
                    <div className="bg-white rounded-md border border-gray-200 shadow p-8 w-[350px] flex flex-col items-center">
                        <button
                            onClick={() => navigate('/signup')}
                            className="w-full bg-[#F4401E] text-white font-semibold text-lg rounded-md py-3 mb-4 border-2 border-[#F4401E] transition hover:bg-white hover:text-[#F4401E]"
                        >
                            {t('create_new_account')}
                        </button>
                        <button
                            onClick={() => navigate('/signin')}
                            className="w-full bg-[#1171E8] text-white font-semibold text-lg rounded-md py-3 border-2 border-[#1171E8] transition hover:bg-white hover:text-[#1171E8]"
                        >
                            {t('login')}
                        </button>
                    </div>
                </div>
            </div>
            {/* Footer */}
            <div className="text-center mt-auto mb-8">
                <a href="#" className="text-[#1E41AF] text-base font-semibold hover:underline">
                    {t('terms_and_policy')}
                </a>
            </div>
            <div className="absolute top-4 right-4 z-10">
                <LanguageSwitcher />
            </div>
        </div>
    );
};

export default Landing;
