import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Copyright, Facebook, Twitter, Instagram, Linkedin, Rss } from "lucide-react";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-slate-50 text-slate-700 py-8 mt-auto border-t dark:bg-[#18191a] dark:text-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About PhyGen */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">PhyGen</h3>
            <p className="text-sm leading-relaxed">
              {t('footer_description')}
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t('quick_links')}</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-600 transition-colors">{t('about_us')}</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">{t('feature')}</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">{t('contact')}</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">{t('faq')}</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t('legal')}</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/privacy-policy" className="hover:text-blue-600 transition-colors">{t('privacy_policy')}</a></li>
              <li><a href="/terms" className="hover:text-blue-600 transition-colors">{t('terms_of_service')}</a></li>
              <li><a href="/data-deletion" className="hover:text-blue-600 transition-colors">{t('data_deletion')}</a></li>
            </ul>
          </div>
          
          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t('follow_us')}</h3>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-slate-500 hover:text-blue-600 dark:text-slate-200">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-500 hover:text-blue-400 dark:text-slate-200">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-500 hover:text-pink-500 dark:text-slate-200">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-500 hover:text-blue-700 dark:text-slate-200">
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        
        <Separator className="my-8 bg-slate-200" />
        
        <div className="flex flex-col sm:flex-row items-center justify-between text-sm">
          <p className="flex items-center gap-2">
            <Copyright className="h-4 w-4" />
            <span>{new Date().getFullYear()} {t('copyright')}</span>
          </p>
          <p className="mt-2 sm:mt-0">
            {t('made_by')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
