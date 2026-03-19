'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { 
  FileText, Shield, Zap, Search, MessageSquare, 
  CloudUpload, ChevronRight, CheckCircle, 
  Download, Activity, Server, Smartphone, Layout
} from 'lucide-react';
import { useState, useEffect } from 'react';

// Animation variants
const fadeInUp: any = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const floatAnimation: any = {
  initial: { y: 0 },
  animate: { 
    y: [-10, 10, -10],
    rotate: [-1, 1, -1],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
  }
};

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary selection:text-primary-foreground relative">
      {/* Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b-0 border-white/5 transition-all duration-300 py-4 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-text shadow-glow">
              <span className="font-bold text-background text-xl leading-none">C</span>
            </div>
            <span className="text-xl font-bold tracking-wider text-foreground">CLARITAS</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
            <a href="#about" className="hover:text-primary transition-colors">About</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-all px-4 py-2 rounded-full border border-transparent hover:border-primary/30">
              Sign In
            </Link>
            <Link href="/dashboard" className="text-sm font-medium px-6 py-2 rounded-full bg-primary text-primary-foreground shadow-glow hover:bg-primary/90 transition-all scale-100 hover:scale-105 active:scale-95">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* 1. HERO SECTION */}
        <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 px-6 flex items-center justify-center min-h-screen">
          <motion.div 
            className="max-w-4xl mx-auto text-center z-10"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="inline-block mb-6 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md">
              <span className="text-sm font-semibold tracking-wide text-primary glow-text uppercase">The Future of Legal Tech</span>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight"
            >
              Understand Legal Documents <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-gradient bg-300%">
                Instantly with AI
              </span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Upload, Analyze, and Chat with your Legal Documents in Seconds. 
              Simplify complex legal jargon and uncover hidden risks with our cutting-edge AI engine.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary text-primary-foreground text-lg font-bold shadow-glow hover:shadow-[0_0_40px_rgba(0,245,212,0.8)] transition-all scale-100 hover:scale-105 group flex items-center justify-center gap-2">
                Get Started
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/login" className="w-full sm:w-auto px-8 py-4 rounded-full glass border border-primary/30 hover:bg-primary/5 hover:border-primary text-lg font-semibold transition-all flex items-center justify-center">
                Login
              </Link>
            </motion.div>
          </motion.div>

          {/* 3D Floating Elements (Mockups) */}
          <motion.div 
            variants={floatAnimation} 
            initial="initial" 
            animate="animate"
            className="absolute top-[20%] right-[10%] w-32 h-32 md:w-64 md:h-64 glass rounded-3xl -z-10 bg-gradient-to-br from-primary/20 to-accent/10 border border-white/10 rotate-12 blur-[2px]"
          />
          <motion.div 
            variants={floatAnimation} 
            initial="initial" 
            animate="animate"
            style={{ transitionDelay: '1s' }}
            className="absolute bottom-[20%] left-[10%] w-24 h-24 md:w-48 md:h-48 glass rounded-full -z-10 bg-gradient-to-tl from-accent/20 to-primary/10 border border-white/10 -rotate-12 blur-[1px]"
          />
        </section>

        {/* 2. ABOUT SECTION */}
        <section id="about" className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4">What is Claritas?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Your AI-powered legal document analyzer. Claritas decodes complex contracts, providing instant summaries, risks, and actionable insights.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <FileText className="w-8 h-8" />, title: "Smart Document Analysis", desc: "Instantly break down complex clauses into plain English." },
                { icon: <MessageSquare className="w-8 h-8" />, title: "AI Legal Chat Assistant", desc: "Ask specific questions about your document and get immediate answers." },
                { icon: <Search className="w-8 h-8" />, title: "Risk Detection", desc: "Highlight potentially dangerous clauses and missing protections automatically." },
                { icon: <Activity className="w-8 h-8" />, title: "Key Insights Extraction", desc: "Extract dates, entities, and critical obligations in seconds." },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="glass p-8 rounded-3xl flex flex-col items-start gap-4 hover:border-primary/50 transition-all group"
                >
                  <div className="p-4 rounded-2xl bg-primary/10 text-primary group-hover:shadow-glow transition-all">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-32 px-6 relative bg-gradient-to-b from-transparent via-primary/5 to-transparent">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">How it Works</h2>
              <p className="text-muted-foreground text-lg">Five simple steps to total contract clarity.</p>
            </div>

            <div className="relative">
              {/* Timeline Connector */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-accent/20 -translate-y-1/2 z-0"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
                {[
                  { icon: <CloudUpload />, title: "Upload", desc: "Drop your PDF or DOCX file." },
                  { icon: <Server />, title: "Process", desc: "AI instantly scans the content." },
                  { icon: <Search />, title: "Analyze", desc: "View simplified risks and summaries." },
                  { icon: <MessageSquare />, title: "Chat", desc: "Ask follow-up questions to the AI." },
                  { icon: <Download />, title: "Export", desc: "Download your insights report." },
                ].map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="flex flex-col items-center text-center group"
                  >
                    <div className="w-20 h-20 rounded-full glass flex items-center justify-center mb-6 text-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-glow transition-all duration-300 relative border-2 border-primary/20">
                      <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm shadow-lg z-10">{i+1}</span>
                      {step.icon}
                    </div>
                    <h4 className="font-bold text-lg mb-2">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4. AI CHAT PREVIEW SECTION */}
        <section className="py-24 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 space-y-8"
            >
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">Interact with your Documents</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Claritas doesn't just read documents; it understands them. Use the built-in holographic AI assistant to query any specific clause, ask for definitions, or uncover hidden liabilities simply by typing.
              </p>
              <ul className="space-y-4">
                {[
                  "Context-aware responses",
                  "Instant legal term translation",
                  "Secure, private conversations"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              style={{ y }}
              className="flex-1 w-full relative"
            >
              <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full"></div>
              <div className="glass rounded-3xl p-6 relative border border-white/10 shadow-2xl backdrop-blur-2xl">
                <div className="flex items-center gap-3 pb-4 border-b border-white/5 mb-6">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <div className="text-xs font-medium text-muted-foreground w-full text-center pr-10">AI Assistant - Active</div>
                </div>

                <div className="space-y-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex justify-end"
                  >
                    <div className="bg-primary text-primary-foreground px-5 py-3 rounded-2xl rounded-tr-sm text-sm max-w-[80%] shadow-glow">
                      Explain the indemnity clause in Section 4.
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-start"
                  >
                    <div className="glass bg-white/5 border border-white/10 px-5 py-3 rounded-2xl rounded-tl-sm text-sm max-w-[90%] text-foreground">
                      <span className="font-semibold text-accent mb-2 block flex items-center gap-2">
                        <Zap className="w-4 h-4" /> Claritas AI
                      </span>
                      This clause states that you must compensate the other party for any losses, damages, or legal costs that arise from your breach of the contract. 
                      <span className="block mt-2 text-warning font-medium text-xs border border-warning/30 bg-warning/10 p-2 rounded relative overflow-hidden">
                        <div className="absolute inset-0 bg-warning/5 animate-pulse"></div>
                        ⚠️ High Risk: It does not have a liability cap, meaning your financial exposure is technically unlimited.
                      </span>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1 }}
                    className="flex items-center gap-2 text-muted-foreground text-xs pl-2"
                  >
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    Claritas is typing...
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 5. FEATURES SECTION */}
        <section id="features" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Uncompromising Performance</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Large Feature */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="lg:col-span-2 glass rounded-3xl p-8 md:p-12 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent group-hover:from-primary/20 transition-all"></div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center text-accent mb-6">
                      <Zap className="w-7 h-7" />
                    </div>
                    <h3 className="text-3xl font-bold">Real-time AI analysis</h3>
                    <p className="text-lg text-muted-foreground max-w-md">
                      Powered by advanced LLMs, Claritas processes dense 50-page contracts in a matter of seconds, outperforming traditional legal review flows.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Smaller Features */}
              <motion.div whileHover={{ scale: 1.02 }} className="glass rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-transparent group-hover:from-accent/20 transition-all"></div>
                <Shield className="w-10 h-10 text-primary mb-6" />
                <h3 className="text-xl font-bold mb-3">Secure Handling</h3>
                <p className="text-muted-foreground text-sm">Partitioned storage ensures your documents belong only to you and aren't leaked to other sessions.</p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className="glass rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent group-hover:from-primary/20 transition-all"></div>
                <FileText className="w-10 h-10 text-accent mb-6" />
                <h3 className="text-xl font-bold mb-3">Multi-format Support</h3>
                <p className="text-muted-foreground text-sm">Upload standard .PDF or .DOCX files without worrying about complex pre-processing.</p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className="glass rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tl from-warning/10 to-transparent group-hover:from-warning/20 transition-all"></div>
                <Smartphone className="w-10 h-10 text-warning mb-6" />
                <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
                <p className="text-muted-foreground text-sm">Optimized pipeline from extraction to AI generation guarantees you won't be kept waiting.</p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className="glass rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-success/10 to-transparent group-hover:from-success/20 transition-all"></div>
                <Layout className="w-10 h-10 text-success mb-6" />
                <h3 className="text-xl font-bold mb-3">Clean & Simple UI</h3>
                <p className="text-muted-foreground text-sm">A distraction-free, aesthetically stunning interface designed for absolute clarity.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 6. CALL TO ACTION */}
        <section className="py-32 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 blur-[100px]"></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto glass rounded-[3rem] p-12 md:p-24 text-center relative border border-primary/20 shadow-glow"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-accent to-transparent"></div>

            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">Ready to Simplify <br className="hidden md:block" /> Your Legal Documents?</h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Join the future of legal tech today. Create an account to upload, analyze, and instantly decode your contracts.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/dashboard" className="w-full sm:w-auto px-10 py-5 bg-primary text-primary-foreground text-xl font-bold rounded-full hover:bg-primary/90 transition-all shadow-[0_0_30px_rgba(0,245,212,0.4)] hover:shadow-[0_0_50px_rgba(0,245,212,0.8)] flex items-center justify-center gap-3 group">
                Get Started
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/login" className="w-full sm:w-auto px-10 py-5 glass border border-primary/30 hover:border-primary rounded-full text-xl font-bold transition-all flex items-center justify-center">
                Login Securely
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      {/* 7. FOOTER */}
      <footer className="border-t border-white/5 py-12 px-6 bg-background relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="font-bold text-background text-xs">C</span>
            </div>
            <span className="font-bold tracking-widest text-muted-foreground">CLARITAS AI</span>
          </div>
          
          <div className="flex gap-8 text-sm font-medium text-muted-foreground">
            <a href="#about" className="hover:text-primary transition-colors">About</a>
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>

          <p className="text-sm text-muted-foreground/50">
            © {new Date().getFullYear()} Claritas AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
