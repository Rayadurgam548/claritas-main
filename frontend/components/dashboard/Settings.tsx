'use client';

import { useState, useEffect } from 'react';
import { 
  User, Mail, ShieldCheck, Bell, History, 
  Trash2, Download, FileText, CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { getUser } from '@/app/lib/auth';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';
import { motion } from 'framer-motion';
import { RobotAvatar, ROBOT_AVATARS } from './RobotAvatar';

export function Settings() {
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(1);
  const [complianceEnabled, setComplianceEnabled] = useState(true);
  const { language } = useLanguage();
  const t = translations[language];

  const [recentActivity, setRecentActivity] = useState([
    { id: '1', name: 'bank loan legal dox.docx', date: 'Mar 19, 2026', status: 'ANALYZED' },
    { id: '2', name: 'bank loan legal dox.docx', date: 'Mar 19, 2026', status: 'ANALYZED' },
    { id: '3', name: 'land legal dox.docx', date: 'Mar 18, 2026', status: 'ANALYZED' },
  ]);

  useEffect(() => {
    const userData = getUser();
    if (userData) {
      setUser(userData);
      setFullName(userData.name || '');
      setEmail(userData.email || '');
    }

    // Load avatar from localStorage
    const savedAvatar = localStorage.getItem('lex_avatar_id');
    if (savedAvatar) {
      setSelectedAvatar(parseInt(savedAvatar));
    }
  }, []);

  const handleUpdateProfile = () => {
    // Mock save
    console.log('Profile updated', { fullName, selectedAvatar, complianceEnabled });
    localStorage.setItem('lex_avatar_id', selectedAvatar.toString());
    alert('Profile updated successfully!');
  };

  const updateAvatar = (id: number) => {
    setSelectedAvatar(id);
    localStorage.setItem('lex_avatar_id', id.toString());
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto w-full space-y-8 pb-20">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Column - Profile Management */}
        <div className="flex-1 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-8">
              <User className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">{t.profile_management}</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">{t.full_name}</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-muted/30 border border-border/50 rounded-xl px-4 py-3 text-foreground focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">{t.email_address}</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={email}
                    readOnly
                    className="w-full bg-muted/10 border border-border/50 rounded-xl px-4 py-3 text-muted-foreground cursor-not-allowed outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 mt-4 text-xs text-muted-foreground italic">
                Update your display name and profile identity.
              </div>

              <button 
                onClick={handleUpdateProfile}
                className="w-full md:w-auto px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:scale-[1.02] transition-all shadow-glow flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                {t.save_changes}
              </button>
            </div>
          </motion.div>

          {/* Legal Safety Score */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row items-center gap-8"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-6 h-6 text-success" />
                <h2 className="text-xl font-bold text-foreground">{t.legal_safety_score}</h2>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t.safety_score_desc}
              </p>
            </div>

            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted/20"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 58}
                  strokeDashoffset={2 * Math.PI * 58 * (1 - 0.78)}
                  strokeLinecap="round"
                  className="text-success shadow-glow"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-foreground">78</span>
                <span className="text-[10px] font-bold text-success uppercase tracking-wider">Safe</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Avatar & Alerts */}
        <div className="w-full md:w-[400px] space-y-8">
          {/* Avatar Selection */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm"
          >
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-8 text-center">
              {t.avatar_selection}
            </h2>

            <div className="flex justify-center mb-10">
              <div className={cn(
                "w-24 h-24 rounded-3xl flex items-center justify-center transition-all shadow-xl border-2 border-primary/50",
                ROBOT_AVATARS[selectedAvatar - 1].color
              )}>
                {ROBOT_AVATARS[selectedAvatar - 1].svg}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {ROBOT_AVATARS.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => updateAvatar(avatar.id)}
                  className={cn(
                    "relative w-full aspect-square rounded-xl flex items-center justify-center transition-all hover:scale-110",
                    avatar.color,
                    selectedAvatar === avatar.id ? "ring-2 ring-primary ring-offset-4 ring-offset-background" : "grayscale opacity-50 hover:grayscale-0 hover:opacity-100"
                  )}
                >
                  {avatar.svg}
                  {selectedAvatar === avatar.id && (
                    <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          {/* AI Compliance Alerts */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-6 h-6 text-[#4e8df5]" />
              <h2 className="text-lg font-bold text-foreground">{t.ai_compliance_alerts}</h2>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed mb-8">
              {t.compliance_alerts_desc}
            </p>

            <div className="p-4 bg-muted/30 rounded-2xl border border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#4e8df5]/10 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-[#4e8df5]" />
                </div>
                <span className="text-sm font-medium">{t.critical_deadlines}</span>
              </div>
              <button 
                onClick={() => setComplianceEnabled(!complianceEnabled)}
                className={cn(
                  "w-12 h-6 rounded-full transition-all relative",
                  complianceEnabled ? "bg-primary shadow-glow" : "bg-muted"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                  complianceEnabled ? "left-7" : "left-1"
                )} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Activity History Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border/50 rounded-3xl shadow-sm overflow-hidden"
      >
        <div className="p-8 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <History className="w-6 h-6 text-muted-foreground" />
            <h2 className="text-xl font-bold text-foreground">{t.activity_history}</h2>
          </div>
          <span className="text-xs font-bold text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border border-border/50 uppercase tracking-tighter">
            {recentActivity.length} {t.records}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30 text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border/50">
                <th className="px-8 py-4">{t.doc_name}</th>
                <th className="px-8 py-4">{t.date}</th>
                <th className="px-8 py-4">{t.status}</th>
                <th className="px-8 py-4 text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {recentActivity.map((activity) => (
                <tr key={activity.id} className="hover:bg-muted/10 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors cursor-pointer">{activity.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-muted-foreground font-mono">{activity.date}</td>
                  <td className="px-8 py-5">
                    <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-success/10 text-success border border-success/20 uppercase tracking-wider">
                      {activity.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-all">
                         <Download className="w-4 h-4" />
                       </button>
                       <button className="p-2 hover:bg-danger/10 rounded-lg text-muted-foreground hover:text-danger transition-all">
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
