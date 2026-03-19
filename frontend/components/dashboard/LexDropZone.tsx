'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileType, CheckCircle, AlertCircle, ShieldAlert, EyeOff } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';
import { LegalAPI, UploadResponse } from '@/app/lib/api';

interface LexDropZoneProps {
  onUploadSuccess: (responses: UploadResponse[]) => void;
}

export function LexDropZone({ onUploadSuccess }: LexDropZoneProps) {
  const [privacyMode, setPrivacyMode] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const { language } = useLanguage();
  const t = translations[language];
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setIsUploading(true);
    setUploadError(null);
    setFiles(acceptedFiles); // Store accepted files
    
    try {
      // Create an array of promises for concurrent uploads
      const uploadPromises = acceptedFiles.map(file => 
        LegalAPI.uploadDocument(file, privacyMode)
      );
      
      const results = await Promise.all(uploadPromises);
      // Flatten the results array of arrays
      const flatResults = results.flat();
      onUploadSuccess(flatResults);
    } catch (error: any) {
      console.error("Upload failed", error);
      setUploadError(error.message || "Failed to upload document(s).");
    } finally {
      setIsUploading(false);
    }
  }, [privacyMode, onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: isUploading
  });

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-semibold text-foreground">{t.upload_document}</h2>
        <label className="flex items-center gap-2 cursor-pointer group">
          <div className="relative">
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={privacyMode}
              onChange={(e) => setPrivacyMode(e.target.checked)}
              disabled={isUploading}
            />
            <div className={cn(
              "block w-10 h-6 rounded-full transition-colors", 
              privacyMode ? "bg-primary" : "bg-muted-foreground/30"
            )}></div>
            <div className={cn(
              "absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform",
              privacyMode ? "transform translate-x-4" : ""
            )}></div>
          </div>
          <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" />
            {t.privacy_mode} ({t.redact_pii})
          </span>
        </label>
      </div>

      <div
        {...getRootProps()}
        className={cn(
          "relative p-12 w-full flex flex-col items-center justify-center rounded-3xl border-2 border-dashed transition-all duration-300",
          "cursor-pointer shadow-lex overflow-hidden group min-h-[300px]",
          isDragReject ? "border-danger bg-danger/5" : isDragActive ? "border-primary bg-primary/5 scale-[1.02]" : privacyMode ? "border-[#4e8df5]/40 bg-[#0f172a] shadow-[0_0_30px_rgba(78,141,245,0.08)]" : "border-border bg-card"
        )}
      >
        <input {...getInputProps()} />
        
        {/* Animated Background Elements */}
        {isDragActive && !isDragReject && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.1, scale: 1.5 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-primary rounded-full blur-3xl -z-10 pointer-events-none"
          />
        )}

        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center"
            >
             <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">{t.privacy_mode}</span>
            <div className={`px-3 py-1 rounded-full border text-[10px] font-bold transition-all flex items-center gap-2 ${privacyMode ? 'bg-[#3b82f6]/20 border-[#3b82f6]/50 text-[#3b82f6] shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'bg-muted border-border text-muted-foreground'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${privacyMode ? 'bg-[#3b82f6] animate-pulse' : 'bg-muted-foreground'}`}></div>
              {privacyMode ? t.incognito_on : t.incognito_off}
            </div>
          </div>
              <div className="w-16 h-16 rounded-full border-4 border-muted border-t-primary animate-spin mb-4" />
              <p className={cn("text-lg font-medium", privacyMode ? "text-white" : "text-foreground")}>{t.step_1_extracting_text}</p>
              <p className={cn("text-sm mt-2 text-center max-w-[250px]", privacyMode ? "text-slate-400" : "text-muted-foreground")}>
                {privacyMode ? t.running_ocr_redacting_pii : t.parsing_pdf_ocr_images}
              </p>
            </motion.div>
          ) : isDragReject ? (
            <motion.div
              key="reject"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center text-danger"
            >
              <AlertCircle className="w-16 h-16 mb-4" />
              <p className="text-lg font-medium">File type not supported</p>
              <p className="text-sm mt-2 opacity-80">Please upload PDF, DOCX, TXT, JPG, or PNG (Max 5MB)</p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center"
            >
              <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300", privacyMode ? "bg-[#4e8df5]/20" : "bg-muted")}>
                {privacyMode ? (
                  <EyeOff className={cn("w-10 h-10 transition-colors duration-300", isDragActive ? "text-[#4e8df5]" : "text-[#4e8df5] group-hover:text-[#4e8df5]/80")} />
                ) : (
                  <UploadCloud className={cn("w-10 h-10 transition-colors duration-300", isDragActive ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
                )}
              </div>
              <p className={cn("text-xl font-bold mb-2", privacyMode ? "text-white" : "text-foreground")}>
                {isDragActive ? "Drop the gavel... I mean, file!" : privacyMode ? "Incognito Upload Active" : "Drag & Drop Legal Document"}
              </p>
              <div className={cn("flex items-center gap-4 text-sm mt-4", privacyMode ? "text-slate-400" : "text-muted-foreground")}>
                <span className="flex items-center gap-1.5"><FileType className="w-4 h-4" /> PDF, DOCX, TXT, JPG, PNG</span>
                <span className={privacyMode ? "text-slate-700" : "text-border"}>•</span>
                <span>Max 5MB</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {uploadError && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-danger/10 border border-danger/20 text-danger-foreground px-4 py-3 rounded-xl text-sm flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 shrink-0 text-danger mt-0.5" />
            <p className="text-danger flex-1">{uploadError}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
