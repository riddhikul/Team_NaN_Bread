'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { Phase, LogEntry, Report, StreamedUrl, StreamedComment } from '@/lib/types';

const IconSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const IconBrain = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.66Z"/>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.66Z"/>
  </svg>
);
const IconLink = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);
const IconMessage = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const IconThumbUp = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
  </svg>
);
const IconThumbDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
  </svg>
);
const IconExternalLink = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

function SourceBadge({ source, size = 'sm' }: { source: string; size?: 'sm' | 'xs' }) {
  const labels: Record<string, string> = { reddit: 'Reddit', youtube: 'YouTube', twitter: 'X/Twitter', amazon: 'Amazon' };
  const px = size === 'xs' ? 'px-1.5 py-0.5 text-[11px]' : 'px-2 py-0.5 text-xs';
  return (
    <span className={`source-${source} ${px} rounded-md font-medium mono tracking-wide inline-flex items-center gap-1`}>
      {labels[source] || source}
    </span>
  );
}

function PhaseLabel({ phase }: { phase: Phase }) {
  const map: Record<Phase, { label: string; color: string }> = {
    idle: { label: 'Waiting', color: 'text-[var(--text-muted)]' },
    prethinking: { label: 'Generating search queries...', color: 'text-[var(--accent)]' },
    urls: { label: 'Crawling sources...', color: 'text-[var(--accent2)]' },
    comments: { label: 'Fetching comments & reviews...', color: 'text-[var(--accent3)]' },
    postthinking: { label: 'Analysing sentiment...', color: 'text-[var(--yellow)]' },
    report: { label: 'Generating report...', color: 'text-[var(--green)]' },
    done: { label: 'Analysis complete', color: 'text-[var(--green)]' },
  };
  const { label, color } = map[phase];
  return (
    <span className={`${color} mono text-[13px] tracking-wider flex items-center gap-2`}>
      {phase !== 'idle' && phase !== 'done' && (
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-current" style={{ animation: 'pulse-dot 1s ease-in-out infinite' }} />
      )}
      {label}
    </span>
  );
}

function LogPanel({ logs, isRunning }: { logs: LogEntry[]; isRunning: boolean }) {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  const typeIcon = (type: LogEntry['type']) => {
    if (type === 'prethinking') return <IconBrain />;
    if (type === 'url') return <IconLink />;
    if (type === 'comment') return <IconMessage />;
    return null;
  };

  const typeColor = (type: LogEntry['type']) => {
    if (type === 'prethinking') return 'text-[var(--accent)]';
    if (type === 'url') return 'text-[var(--accent2)]';
    if (type === 'comment') return 'text-[var(--accent3)]';
    if (type === 'postthinking') return 'text-[var(--yellow)]';
    return 'text-[var(--text-muted)]';
  };

  return (
    <div className="h-full overflow-y-auto px-4 py-3 space-y-1.5 relative">
      {isRunning && (
        <div className="absolute inset-x-0 h-10 pointer-events-none" style={{
          background: 'linear-gradient(transparent, rgba(124,107,255,0.07), transparent)',
          animation: 'scanline-sweep 3s linear infinite',
          zIndex: 10,
        }} />
      )}
      {logs.map((log, i) => (
        <div key={log.id} className="log-item flex items-start gap-2.5 group" style={{ animationDelay: `${i * 20}ms` }}>
          <span className={`mt-0.5 opacity-60 flex-shrink-0 ${typeColor(log.type)}`}>
            {typeIcon(log.type) || <span className="inline-block w-3 h-3" />}
          </span>
          <div className="flex-1 min-w-0">
            <span className={`mono text-[14px] leading-relaxed ${typeColor(log.type)} break-all`}>{log.text}</span>
            {log.source && <span className="ml-2 inline-block"><SourceBadge source={log.source} size="xs" /></span>}
          </div>
          <span className="text-[10px] mono text-[var(--text-dim)] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            {new Date(log.timestamp).toLocaleTimeString('en', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      ))}
      {logs.length === 0 && (
        <div className="flex flex-col items-center justify-center h-32 text-center">
          <p className="mono text-xs text-[var(--text-dim)]">agent activity will appear here</p>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}

// ─── Scroll-reveal hook ──────────────────────────────────────────────────────

function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── Reveal-wrapped section card ─────────────────────────────────────────────

function RevealCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useScrollReveal(0.1);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0) scale(1)' : 'translateY(22px) scale(0.98)',
      transition: `opacity 0.55s cubic-bezier(0.4,0,0.2,1) ${delay}ms, transform 0.55s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

// ─── Report Viewer ────────────────────────────────────────────────────────────

function ReportViewer({ report }: { report: Report }) {
  const confidencePct = Math.round(report.summary.confidence_score * 100);
  return (
    <div className="space-y-5 animate-fade-in">
      <RevealCard delay={0}>
      <div className="rounded-xl border bg-[var(--surface2)] p-5 relative overflow-hidden"
        style={{ borderColor: 'rgba(124,107,255,0.25)', boxShadow: '0 0 40px rgba(124,107,255,0.1), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-[0.07] -translate-y-1/2 translate-x-1/2" style={{ background: 'var(--accent)', filter: 'blur(40px)' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-[0.04] translate-y-1/2 -translate-x-1/2" style={{ background: 'var(--accent2)', filter: 'blur(40px)' }} />
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="mono text-[12px] text-[var(--text-muted)] mb-1.5 tracking-widest uppercase">Product Analysis</p>
            <h2 className="text-xl sm:text-2xl font-black text-white" style={{ fontFamily: 'Cabinet Grotesk,sans-serif', letterSpacing: '-0.025em' }}>{report.product}</h2>
            <p className="mt-2 text-[14px] text-[var(--text-muted)] leading-relaxed">{report.summary.verdict}</p>
          </div>
          <div className="flex-shrink-0 text-center">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="none" stroke="var(--border)" strokeWidth="5" />
                <circle cx="32" cy="32" r="28" fill="none" stroke="var(--accent)" strokeWidth="5"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - report.summary.confidence_score)}`}
                  strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-bold text-sm text-white">{confidencePct}%</span>
              </div>
            </div>
            <p className="mono text-[11px] text-[var(--text-muted)] mt-1">confidence</p>
          </div>
        </div>
      </div>
      </RevealCard>

      <RevealCard delay={60}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[rgba(76,255,145,0.2)] p-4" style={{ background: 'rgba(76,255,145,0.04)' }}>
          <div className="flex items-center gap-2 mb-3">
            <span style={{ color: 'var(--green)' }}><IconThumbUp /></span>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--green)' }}>Strengths</h3>
          </div>
          <ul className="space-y-2.5">
            {report.pros.map((pro, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: 'var(--green)' }} />
                <span className="text-[14px] leading-relaxed" style={{ color: 'var(--text)', opacity: 0.85 }}>{pro.point}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-[rgba(255,170,77,0.2)] p-4" style={{ background: 'rgba(255,170,77,0.04)' }}>
          <div className="flex items-center gap-2 mb-3">
            <span style={{ color: 'var(--red)' }}><IconThumbDown /></span>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--red)' }}>Concerns</h3>
          </div>
          <ul className="space-y-2.5">
            {report.cons.map((con, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: 'var(--red)' }} />
                <span className="text-[14px] leading-relaxed" style={{ color: 'var(--text)', opacity: 0.85 }}>{con.point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      </RevealCard>

      <div className="space-y-3">
        <RevealCard delay={0}>
          <h3 className="mono text-[11px] tracking-widest uppercase flex items-center gap-3" style={{ color: 'var(--text-muted)' }}>
            <span>Detailed Analysis</span>
            <span style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg,var(--border-bright),transparent)' }} />
          </h3>
        </RevealCard>
        {report.sections.map((section, i) => (
          <RevealCard key={i} delay={i * 80}>
          <div className="section-card rounded-xl border border-[var(--border)] p-4" style={{ background: 'var(--surface2)' }}>
            <div className="flex items-center justify-between mb-2 gap-2">
              <h4 className="font-semibold text-sm text-white">{section.title}</h4>
              <span className={`sentiment-${section.sentiment} px-2 py-0.5 rounded text-[10px] mono tracking-wide flex-shrink-0`}>{section.sentiment}</span>
            </div>
            {section.paragraphs.map((p, j) => (
              <p key={j} className="text-[14px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{p.text}</p>
            ))}
            {section.paragraphs[0]?.references && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {section.paragraphs[0].references.map(ref => {
                  const r = report.references[ref];
                  if (!r) return null;
                  return (
                    <a key={ref} href={r.url} target="_blank" rel="noopener noreferrer"
                      className={`source-${r.platform} px-1.5 py-0.5 rounded text-[10px] mono flex items-center gap-1 hover:opacity-80 transition-opacity`}>
                      {r.platform} <IconExternalLink />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
          </RevealCard>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const shadows: Record<string, string> = {
    'var(--accent)': '0 0 30px rgba(124,107,255,0.12), inset 0 0 20px rgba(124,107,255,0.05)',
    'var(--accent2)': '0 0 30px rgba(255,107,157,0.12), inset 0 0 20px rgba(255,107,157,0.05)',
    'var(--accent3)': '0 0 30px rgba(107,255,222,0.12), inset 0 0 20px rgba(107,255,222,0.05)',
  };
  return (
    <div className="rounded-xl border border-[var(--border)] px-4 py-3 sm:px-5 sm:py-4 transition-all duration-300 hover:-translate-y-0.5"
      style={{ background: 'var(--surface2)', boxShadow: shadows[color] || 'none' }}>
      <p className="font-black text-xl sm:text-2xl" style={{ color, fontFamily: 'Cabinet Grotesk,sans-serif', letterSpacing: '-0.03em' }}>{value.toLocaleString()}</p>
      <p className="mono text-[11px] uppercase tracking-widest mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
    </div>
  );
}

function AnalyseButton({ onClick, disabled, isRunning }: { onClick: () => void; disabled: boolean; isRunning: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="relative flex-shrink-0 px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden"
      style={{
        fontFamily: 'Cabinet Grotesk,sans-serif',
        fontSize: '15px',
        letterSpacing: '-0.01em',
        background: 'linear-gradient(135deg,#7c6bff 0%,#9d7cff 50%,#c96bff 100%)',
        backgroundSize: '200% 100%',
        backgroundPosition: hov && !disabled ? '100% 0' : '0% 0',
        transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: isRunning
          ? '0 2px 8px rgba(0,0,0,0.3)'
          : hov && !disabled
            ? '0 0 35px rgba(124,107,255,0.65), 0 0 70px rgba(124,107,255,0.2), 0 8px 24px rgba(0,0,0,0.4)'
            : '0 0 20px rgba(124,107,255,0.35), 0 4px 16px rgba(0,0,0,0.3)',
        transform: hov && !disabled && !isRunning ? 'translateY(-2px) scale(1.03)' : 'translateY(0) scale(1)',
      }}
    >
      {hov && !disabled && !isRunning && (
        <span className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%)',
          animation: 'btn-shimmer 0.55s ease forwards',
        }} />
      )}
      {isRunning ? (
        <span className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 border-2 rounded-full" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin-slow 0.7s linear infinite' }} />
          Analysing…
        </span>
      ) : 'Analyse →'}
    </button>
  );
}

export default function Home() {
  const [product, setProduct] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ queries: 0, urls: 0, comments: 0 });
  const abortRef = useRef<AbortController | null>(null);

  const addLog = useCallback((entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
    setLogs(prev => [...prev, { ...entry, id: Math.random().toString(36).slice(2), timestamp: Date.now() }]);
  }, []);

  const handleAnalyse = async () => {
    if (!product.trim() || phase !== 'idle') return;
    setError(null); setReport(null); setLogs([]); setStats({ queries: 0, urls: 0, comments: 0 });
    setPhase('prethinking');
    const ac = new AbortController();
    abortRef.current = ac;
    addLog({ type: 'system', text: `Starting analysis for "${product.trim()}"` });
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/report/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: product.trim() }),
        signal: ac.signal,
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      if (!res.body) throw new Error('No response body');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const messages = buffer.split('\n\n');
        buffer = messages.pop() || '';
        for (const msg of messages) {
          if (!msg.trim()) continue;
          const lines = msg.split('\n');
          let event = '', dataStr = '';
          for (const line of lines) {
            if (line.startsWith('event: ')) event = line.slice(7).trim();
            if (line.startsWith('data: ')) dataStr = line.slice(6).trim();
          }
          if (!event || !dataStr) continue;
          try {
            const data = JSON.parse(dataStr);
            if (event === 'prethinking') {
              setPhase('prethinking');
              const queries: string[] = data.queries || [];
              setStats(s => ({ ...s, queries: queries.length }));
              for (const q of queries) addLog({ type: 'prethinking', text: `🔍 "${q}"` });
            }
            if (event === 'urls') {
              setPhase('urls');
              const urls: StreamedUrl[] = data.urls || [];
              setStats(s => ({ ...s, urls: urls.length }));
              addLog({ type: 'system', text: `Found ${urls.length} relevant sources` });
              for (const u of urls) addLog({ type: 'url', source: u.source, text: u.url });
            }
            if (event === 'comments') {
              setPhase('comments');
              const comments: StreamedComment[] = data.comments || [];
              setStats(s => ({ ...s, comments: comments.length * 10 }));
              addLog({ type: 'system', text: `Collected ${comments.length} comments & reviews` });
              for (const c of comments) addLog({ type: 'comment', source: c.source, text: `"${c.comment}"` });
            }
            if (event === 'postthinking') {
              setPhase('postthinking');
              const thoughts: string[] = data.thoughts || [];
              for (const t of thoughts) addLog({ type: 'postthinking', text: t });
            }
            if (event === 'report') {
              setPhase('report');
              addLog({ type: 'system', text: 'Report generated successfully ✓' });
              setReport(data as Report);
              setPhase('done');
            }
          } catch { /* skip malformed SSE */ }
        }
      }
    } catch (err: unknown) {
      if ((err as Error).name === 'AbortError') return;
      const msg = (err as Error).message || 'An error occurred';
      console.error('Error:', err); // Add logging
      setError(msg.includes('502') ? 'Cannot reach Flask API' : msg);
      setPhase('idle');
    }
  };

  const handleReset = () => {
    abortRef.current?.abort();
    setPhase('idle'); setReport(null); setLogs([]); setError(null);
    setStats({ queries: 0, urls: 0, comments: 0 });
  };

  const isRunning = phase !== 'idle' && phase !== 'done';
  const isDone = phase === 'done';

  return (
    <div className="grid-bg" style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full" style={{ top: '-160px', left: '-160px', width: '500px', height: '500px', background: 'var(--accent)', opacity: 0.09, filter: 'blur(120px)', animation: 'drift 15s ease-in-out infinite' }} />
        <div className="absolute rounded-full" style={{ top: '25%', right: '-160px', width: '450px', height: '450px', background: 'var(--accent2)', opacity: 0.07, filter: 'blur(100px)', animation: 'drift 18s ease-in-out infinite', animationDelay: '-5s' }} />
        <div className="absolute rounded-full" style={{ bottom: '40px', left: '25%', width: '384px', height: '384px', background: 'var(--accent3)', opacity: 0.06, filter: 'blur(80px)', animation: 'drift 20s ease-in-out infinite', animationDelay: '-10s' }} />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8" style={{flex:1,display:"flex",flexDirection:"column"}}>

        {/* Header */}
        <header className="mb-8 sm:mb-10 flex items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-2.5 sm:gap-3 mb-2 flex-wrap">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 rounded-xl" style={{ background: 'linear-gradient(135deg,#7c6bff,#ff6b9d)', opacity: 0.6, filter: 'blur(8px)', transform: 'scale(1.35)' }} />
                <div className="relative rounded-xl flex items-center justify-center" style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#7c6bff,#ff6b9d)', boxShadow: '0 0 20px rgba(124,107,255,0.5)' }}>
                  <span style={{ fontFamily: 'Cabinet Grotesk,sans-serif', fontWeight: 900, fontSize: '11px', color: 'white', letterSpacing: '-0.02em' }}>PR</span>
                </div>
              </div>
              <h1 style={{ fontFamily: 'Cabinet Grotesk,sans-serif', fontWeight: 900, letterSpacing: '-0.03em', fontSize: 'clamp(20px,4vw,26px)', lineHeight: 1 }}>
                PR<span style={{ background: 'linear-gradient(135deg,#9d8fff,#ff6b9d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>ception</span>
              </h1>
              <span className="mono text-[10px] rounded-full tracking-widest uppercase flex-shrink-0"
                style={{ padding: '2px 10px', background: 'rgba(124,107,255,0.12)', color: 'var(--accent)', border: '1px solid rgba(124,107,255,0.25)' }}>Beta</span>
            </div>
            <p style={{ fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: '13px', color: 'var(--text-muted)' }}>
              Know what people <em>really</em> think — before you buy or sell
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {isDone ? (
              <button onClick={handleReset}
                className="transition-all duration-200 rounded-xl"
                style={{ fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: '13px', padding: '8px 16px', color: 'var(--text-muted)', border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}
                onMouseEnter={e => { const t = e.currentTarget; t.style.borderColor = 'rgba(124,107,255,0.4)'; t.style.color = 'var(--accent)'; t.style.background = 'rgba(124,107,255,0.06)'; }}
                onMouseLeave={e => { const t = e.currentTarget; t.style.borderColor = 'var(--border)'; t.style.color = 'var(--text-muted)'; t.style.background = 'transparent'; }}>
                ← New Analysis
              </button>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5 rounded-full" style={{ padding: '6px 12px', background: 'rgba(107,255,222,0.08)', border: '1px solid rgba(107,255,222,0.2)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent3)', animation: 'pulse-dot 1.5s ease-in-out infinite' }} />
                <span className="mono text-[10px] tracking-widest uppercase" style={{ color: 'var(--accent3)' }}>AI for Bharat</span>
              </div>
            )}
          </div>
        </header>

        {/* Search bar */}
        {!isDone && (
          <div className="mb-8 animate-fade-in">
            <div style={{ maxWidth: '680px' }}>
              <div className="flex gap-2 sm:gap-3">
                <div className="relative flex-1 group">
                  <div className="absolute -inset-px rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: 'linear-gradient(135deg,rgba(124,107,255,0.55),rgba(255,107,157,0.4))', zIndex: 0 }} />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ zIndex: 2, color: 'var(--text-muted)' }}>
                    <IconSearch />
                  </div>
                  <input
                    type="text"
                    value={product}
                    onChange={e => setProduct(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAnalyse()}
                    placeholder="Enter a product — e.g. Samsung Galaxy S24"
                    disabled={isRunning}
                    style={{
                      position: 'relative', zIndex: 1, width: '100%',
                      background: 'var(--surface)', border: '1px solid var(--border)',
                      borderRadius: '12px', padding: '14px 16px 14px 40px',
                      fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: '14px',
                      color: 'white', outline: 'none', transition: 'border-color 0.2s',
                      opacity: isRunning ? 0.5 : 1,
                    }}
                    className="focus:border-[var(--accent)] placeholder-[var(--text-dim)]"
                  />
                </div>
                <AnalyseButton onClick={handleAnalyse} disabled={isRunning || !product.trim()} isRunning={isRunning} />
              </div>
              <div className="mt-2.5 ml-1">
                <PhaseLabel phase={phase} />
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl mono text-sm"
            style={{ border: '1px solid rgba(255,170,77,0.3)', background: 'rgba(255,170,77,0.08)', color: 'var(--red)' }}>
            ⚠ {error} — is the Flask API running?
          </div>
        )}

        {/* Stats */}
        {(isRunning || isDone) && (
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6 animate-fade-in">
            <StatCard label="queries" value={stats.queries} color="var(--accent)" />
            <StatCard label="sources crawled" value={stats.urls} color="var(--accent2)" />
            <StatCard label="comments read" value={stats.comments} color="var(--accent3)" />
          </div>
        )}

        {/* Main grid */}
        <div className={`grid gap-4 sm:gap-6 ${report ? 'lg:grid-cols-[400px_1fr]' : 'grid-cols-1'}`}>
          {(isRunning || logs.length > 0) && (
            <div className="animate-fade-in">
              <div className="rounded-xl border border-[var(--border)] overflow-hidden flex flex-col"
                style={{ background: 'var(--surface)', height: '520px' }}>
                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] flex-shrink-0"
                  style={{ background: 'linear-gradient(90deg,rgba(124,107,255,0.06),transparent)' }}>
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <span className="w-2 h-2 rounded-full block" style={{ background: 'var(--accent)', animation: isRunning ? 'pulse-dot 1s ease-in-out infinite' : 'none' }} />
                      {isRunning && <span className="absolute inset-0 w-2 h-2 rounded-full" style={{ background: 'var(--accent)', animation: 'pulse-ring 1.5s ease-out infinite', opacity: 0.5 }} />}
                    </div>
                    <span className="mono text-[11px] font-medium tracking-widest uppercase" style={{ color: 'var(--text)' }}>Agent Activity</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--red)', opacity: 0.6 }} />
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--yellow)', opacity: 0.6 }} />
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--green)', opacity: 0.6 }} />
                  </div>
                </div>
                <div className="flex-1 overflow-hidden">
                  <LogPanel logs={logs} isRunning={isRunning} />
                </div>
                <div className="h-0.5 flex-shrink-0" style={{ background: 'var(--border)' }}>
                  {isRunning && <div className="h-full" style={{ background: 'linear-gradient(90deg,var(--accent),var(--accent2))', animation: 'progress-fill 8s linear forwards' }} />}
                  {isDone && <div className="h-full w-full" style={{ background: 'var(--green)' }} />}
                </div>
              </div>
            </div>
          )}
          {report && (
            <div className="overflow-y-auto pr-1" style={{maxHeight:"520px"}}>
              <ReportViewer report={report} />
            </div>
          )}
        </div>

        {/* Empty state */}
        {phase === 'idle' && !report && logs.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center text-center animate-fade-in" style={{ padding: 'clamp(48px,10vh,96px) 16px' }}>
            {/* Orbiting icon */}
            <div className="relative mb-8 sm:mb-10" style={{ width: '80px', height: '80px', margin: '0 auto' }}>
              <div style={{ position: 'absolute', inset: 0, animation: 'spin-slow 8s linear infinite', transformOrigin: 'center' }}>
                <div style={{ position: 'absolute', top: 0, left: '50%', width: '8px', height: '8px', borderRadius: '50%', background: '#7c6bff', boxShadow: '0 0 8px #7c6bff', transform: 'translateX(-50%) translateY(-10px)' }} />
              </div>
              <div style={{ position: 'absolute', inset: 0, animation: 'spin-slow 6s linear infinite reverse', transformOrigin: 'center' }}>
                <div style={{ position: 'absolute', bottom: 0, left: '50%', width: '6px', height: '6px', borderRadius: '50%', background: '#ff6b9d', boxShadow: '0 0 6px #ff6b9d', transform: 'translateX(-50%) translateY(10px)' }} />
              </div>
              <div style={{ position: 'absolute', inset: 0, animation: 'spin-slow 10s linear infinite', transformOrigin: 'center' }}>
                <div style={{ position: 'absolute', top: '50%', right: 0, width: '6px', height: '6px', borderRadius: '50%', background: '#6bffde', boxShadow: '0 0 6px #6bffde', transform: 'translateX(10px) translateY(-50%)' }} />
              </div>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '16px', background: 'linear-gradient(135deg,rgba(124,107,255,0.8),rgba(255,107,157,0.6))', filter: 'blur(16px)', transform: 'scale(1.3)', opacity: 0.5 }} />
              <div className="relative animate-float" style={{ width: '80px', height: '80px', borderRadius: '16px', border: '1px solid rgba(124,107,255,0.3)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(124,107,255,0.2)' }}>
                <span style={{ fontSize: '32px' }}>🔍</span>
              </div>
            </div>

            <h2 className="shimmer-text" style={{ fontFamily: 'Cabinet Grotesk,sans-serif', fontWeight: 900, letterSpacing: '-0.03em', fontSize: 'clamp(24px,5vw,36px)', marginBottom: '12px' }}>
              Analyse any product
            </h2>
            <p style={{ fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: 'clamp(13px,2vw,15px)', color: 'var(--text-muted)', maxWidth: '440px', lineHeight: 1.7, marginBottom: '32px' }}>
              PRception crawls Reddit, YouTube, X/Twitter and e-commerce reviews to give you an unbiased, AI-powered perception report in seconds.
            </p>

            <div style={{ width: '120px', height: '1px', background: 'linear-gradient(90deg,transparent,var(--border-bright),transparent)', marginBottom: '24px' }} />

            {/* Try these — highly visible */}
            <p style={{ fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Try these
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5" style={{ maxWidth: '480px' }}>
              {['Samsung Galaxy S24', 'iPhone 15 Pro', 'Sony WH-1000XM5', 'MacBook Air M3'].map(p => (
                <button
                  key={p}
                  onClick={() => setProduct(p)}
                  className="try-chip"
                  style={{ fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: '13px', fontWeight: 500 }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
              <span className="mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Made with</span>
              <span style={{ color: '#ff6b9d', fontSize: '13px', lineHeight: 1 }}>♥</span>
              <span className="mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                by <strong style={{ color: 'var(--text)', fontWeight: 600 }}>Team NaN Bread</strong> · AI for Bharat Hackathon
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full" style={{ background: 'var(--accent3)', opacity: 0.6, animation: 'pulse-dot 2s ease-in-out infinite' }} />
              <p className="mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Agentic AI + GNN Scoring</p>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
