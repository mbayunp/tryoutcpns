import React from 'react';
import { MessageSquare, Mail, Clock } from 'lucide-react';

export default function ContactSupport() {
  const contacts = [
    {
      title: 'WhatsApp Support',
      value: '0812-3456-7890',
      description: 'Hubungi admin via chat WhatsApp untuk respon cepat.',
      href: 'https://wa.me/6281234567890',
      icon: MessageSquare,
      color: 'emerald',
    },
    {
      title: 'Email Resmi',
      value: 'support@wildancasn.id',
      description: 'Kirimkan pertanyaan atau keluhan detail ke email kami.',
      href: 'mailto:support@wildancasn.id',
      icon: Mail,
      color: 'blue',
    },
    {
      title: 'Jam Operasional',
      value: 'Senin - Jumat, 08.00 - 17.00 WIB',
      description: 'Layanan support aktif pada jam kerja yang ditentukan.',
      icon: Clock,
      color: 'slate',
    },
  ];

  return (
    <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-premium-lg border border-slate-800 animate-fadeIn">
      {/* Background decorations */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-2xl mx-auto mb-10 space-y-3">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Masih Punya Pertanyaan Lain?
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Tim customer service kami siap membantu Anda menyelesaikan kendala teknis maupun non-teknis.
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {contacts.map((contact, idx) => {
          const Icon = contact.icon;
          const isLink = !!contact.href;
          const CardContent = (
            <div className="flex flex-col items-center text-center p-6 bg-slate-900/50 hover:bg-slate-900/80 rounded-2xl border border-slate-800/80 transition-all duration-300 h-full group cursor-pointer">
              <div className={`p-4 rounded-xl mb-4 transition-all duration-300 ${
                contact.color === 'emerald' 
                  ? 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white shadow-sm shadow-emerald-500/5' 
                  : contact.color === 'blue'
                  ? 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white shadow-sm shadow-blue-500/5'
                  : 'bg-slate-500/10 text-slate-400 group-hover:bg-slate-500 group-hover:text-white shadow-sm shadow-slate-500/5'
              }`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-white transition-colors">
                {contact.title}
              </h3>
              <p className="text-sm font-semibold text-slate-350 mb-1 group-hover:text-white transition-colors">
                {contact.value}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">
                {contact.description}
              </p>
            </div>
          );

          if (isLink) {
            return (
              <a key={idx} href={contact.href} target="_blank" rel="noopener noreferrer" className="block focus:outline-none h-full">
                {CardContent}
              </a>
            );
          }

          return <div key={idx} className="h-full">{CardContent}</div>;
        })}
      </div>
    </div>
  );
}
