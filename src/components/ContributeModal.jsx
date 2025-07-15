import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Sparkles, AlertTriangle, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ContributeModal = ({ open, onOpenChange }) => {
  const { t } = useTranslation();
  const options = [
    {
      icon: <Sparkles className="w-6 h-6 text-indigo-500 dark:text-indigo-300" />,
      title: t('help_improve'),
      desc: t('contribute_desc')
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-red-500 dark:text-red-400" />,
      title: t('report_a_problem'),
      desc: t('report_a_problem_desc')
    }
  ];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-[#242526] rounded-2xl shadow-2xl w-[380px] max-w-[95vw] z-50 border dark:border-neutral-800">
          <div className="flex items-center justify-between border-b dark:border-neutral-800 px-6 py-4">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t('contribute_your_opinion')}</h2>
            <Dialog.Close asChild>
              <button className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-neutral-800">
                <X className="w-6 h-6 text-slate-500 dark:text-white" />
              </button>
            </Dialog.Close>
          </div>
          <div className="p-2 space-y-1">
            {options.map((opt, idx) => (
              <button
                key={idx}
                className="flex w-full items-center gap-4 px-4 py-3 hover:bg-slate-50 dark:hover:bg-neutral-800 transition text-left rounded-lg"
              >
                <span className="bg-slate-100 dark:bg-neutral-800 rounded-full p-2 flex items-center justify-center">
                  {opt.icon}
                </span>
                <span className="flex-1 text-left">
                  <div className="font-semibold text-slate-800 dark:text-white text-base">{opt.title}</div>
                  <div className="text-sm text-slate-500 dark:text-neutral-300 mt-1">{opt.desc}</div>
                </span>
                <ChevronRight className="w-5 h-5 text-slate-400 dark:text-white" />
              </button>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ContributeModal; 