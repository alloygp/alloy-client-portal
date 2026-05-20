import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import alloyIcon from '../assets/alloy-icon.png';
import riseMarkLight from '../assets/rise-mark-light.svg';
import { DATA } from '../data';
import { I } from '../Icons';
import type { AlloyOutletContext } from '../Shell';

type NavHandler = AlloyOutletContext['onNav'];

export default function DashboardPage() {
  const { onNav, mobileNav, setMobileNav } = useOutletContext<AlloyOutletContext>();
  return (
    <div className="content" data-screen-label="01 Dashboard">
      <DesktopTopBar onNav={onNav} />

      <CelebrateBanner />

      <AlloyHero onNav={onNav} mobileNav={mobileNav} setMobileNav={setMobileNav} />

      <div className="dash-spotlight">
        <ActionQueue onNav={onNav} />
        <ProjectsList onNav={onNav} />
        <DesktopActivityCard />
      </div>

      <div className="section-title" style={{ marginTop: 56, marginBottom: 32 }}>
        <span className="pip" />
        Latest ROI metrics
      </div>
      <div className="dash-metrics-row" style={{ marginBottom: 64 }}>
        <div className="dash-metrics-block">
          <div className="col-4">
            {DATA.kpis.map((k, i) => (
              <KpiCard key={i} k={k} />
            ))}
          </div>
        </div>
        <div className="dash-recognition-block">
          <RecognitionSnapshot onNav={onNav} />
        </div>
      </div>

      <DashboardFooter />
    </div>
  );
}

function DesktopTopBar({ onNav }: { onNav: NavHandler }) {
  return (
    <div className="desktop-topbar">
      <div className="ds-search">
        <I.Search width={14} height={14} />
        <input placeholder="Search projects, tickets, resources…" />
        <kbd>⌘K</kbd>
      </div>
      <div className="grow" />
      <button className="btn btn-primary" onClick={() => onNav('tickets')}>
        <I.Plus width={13} height={13} /> New request
      </button>
      <a
        className="btn btn-secondary"
        href="https://dam.alloygp.co"
        target="_blank"
        rel="noopener noreferrer"
      >
        <I.Folder width={13} height={13} /> My Assets{' '}
        <span className="ds-ext" aria-hidden="true">
          ↗
        </span>
      </a>
      <button className="ds-icon-btn" aria-label="Notifications">
        <I.Bell width={17} height={17} />
        <span className="pulse" />
      </button>
    </div>
  );
}

function CelebrateBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div className="notif-celebrate notif-payment" role="alert">
      <svg
        className="notif-decor"
        width="120"
        height="120"
        viewBox="0 0 120 120"
        aria-hidden="true"
      >
        <circle cx="95" cy="30" r="40" fill="none" stroke="#fff" strokeWidth="3" />
        <circle cx="95" cy="30" r="20" fill="none" stroke="#f5d880" strokeWidth="3" />
      </svg>
      <div className="notif-icon">
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="4" width="12" height="9" rx="1.5" stroke="#f5d880" strokeWidth="1.5" />
          <path d="M2 7h12M5 11h2" stroke="#f5d880" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <div className="notif-text">
        <div className="notif-kicker">Action required</div>
        <div className="notif-title">Payment method needed</div>
      </div>
      <button className="notif-cta">Update</button>
      <button className="notif-close" aria-label="Dismiss" onClick={() => setDismissed(true)}>
        <I.Close width={10} height={10} />
      </button>
    </div>
  );
}

interface AlloyHeroProps {
  onNav: NavHandler;
  mobileNav: boolean;
  setMobileNav: (v: boolean) => void;
}

function AlloyHero({ onNav, mobileNav, setMobileNav }: AlloyHeroProps) {
  const firstName = DATA.user.name.split(' ')[0];

  const currentQ = DATA.roadmap.find((q) => q.state === 'now') ?? DATA.roadmap[0];
  const qLabel = currentQ
    ? `${currentQ.q} · ${currentQ.title || 'In progress'}`
    : 'Q2 2026 · Momentum';

  const yearGoal = { signed: 3, total: 8 };
  const yearPct = Math.round((yearGoal.signed / yearGoal.total) * 100);

  return (
    <section className="alloy-hero" aria-label="Account overview">
      <div className="alloy-hero-main">
        <div className="alloy-hero-logo" aria-hidden="true">
          <img src={riseMarkLight} alt="" />
        </div>
        <div className="alloy-hero-content">
          <div className="alloy-hero-top">
            <span className="alloy-hero-eyebrow">{DATA.account.company || 'Client account'}</span>

            <div className="alloy-hero-controls">
              <button className="alloy-hero-icon-btn" aria-label="Notifications">
                <I.Bell width={18} height={18} />
                <span className="pulse-dot" />
              </button>
              <button
                className="alloy-hero-icon-btn"
                aria-label={mobileNav ? 'Close menu' : 'Open menu'}
                onClick={() => setMobileNav(!mobileNav)}
              >
                {mobileNav ? (
                  <I.Close width={20} height={20} />
                ) : (
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  >
                    <path d="M4 7h16M4 12h16M4 17h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <h1 className="alloy-hero-title">Welcome back, {firstName}.</h1>
        </div>
      </div>

      <div className="alloy-hero-footer">
        <button
          className="alloy-hero-cta"
          onClick={() => onNav('playbook')}
          aria-label="Open the 2026 roadmap"
        >
          Open your 2026 roadmap{' '}
          <span className="arr" aria-hidden="true">
            →
          </span>
        </button>

        <div className="alloy-hero-stats">
          <div className="alloy-hero-stat">
            <span className="k">Current quarter</span>
            <span className="v">{qLabel}</span>
          </div>
          <div className="alloy-hero-stat">
            <span className="k">Year goal</span>
            <span className="v">
              {yearGoal.signed} of {yearGoal.total} boards signed
            </span>
            <div className="track" aria-hidden="true">
              <div className="track-fill" style={{ width: `${yearPct}%` }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ActionQueue({ onNav }: { onNav: NavHandler }) {
  const needsYou = DATA.projects.filter((p) => p.status === 'review' || p.status === 'blocked');
  const pendingLeads = DATA.recentLeads.filter((l) => l.quality === 'review').length;
  return (
    <div className="banner-card banner-yellow dash-feature-card">
      <div className="banner-card-head">
        <div className="bc-titles">
          <div className="bc-kicker">
            {needsYou.length} {needsYou.length === 1 ? 'thing' : 'things'} waiting on you
          </div>
          <div className="bc-title">Your action queue</div>
        </div>
      </div>
      <div className="banner-card-body">
        {pendingLeads > 0 ? (
          <button className="rise-hero-nudge aq-nudge aq-nudge-top" onClick={() => onNav('leads')}>
            <span className="rise-hero-nudge-badge">{pendingLeads}</span>
            <span className="rise-hero-nudge-body">
              <span className="rise-hero-nudge-title">
                Qualify {pendingLeads} pending {pendingLeads === 1 ? 'lead' : 'leads'}
              </span>
              <span className="rise-hero-nudge-sub">Each one keeps your pipeline live</span>
            </span>
            <span className="rise-hero-nudge-chev" aria-hidden="true">
              →
            </span>
          </button>
        ) : null}
        {needsYou.length === 0 ? (
          <div
            style={{
              padding: '18px 14px',
              textAlign: 'center',
              fontSize: 13,
              color: 'var(--fg-muted)',
            }}
          >
            <I.Sparkle width={18} height={18} /> All clear — nothing pending on your end.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {needsYou.map((p) => (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 16px',
                  background: 'var(--alloy-off-white)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 10,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--alloy-purple)' }}>
                    {p.title}
                  </div>
                </div>
                <button className="btn btn-sm btn-primary">
                  {p.status === 'blocked' ? 'Send file' : 'Review'}
                </button>
              </div>
            ))}
          </div>
        )}
        <div
          style={{
            marginTop: 14,
            padding: '10px 14px',
            background: 'var(--alloy-purple-tint)',
            borderRadius: 8,
            fontSize: 12.5,
            color: 'var(--alloy-purple)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <I.Sparkle width={14} height={14} /> Everything else is on track. We&apos;ll surface it
          here when it needs you.
        </div>
      </div>
    </div>
  );
}

const SERVICE_TONE: Record<string, string> = {
  pink: 'var(--alloy-pink)',
  yellow: 'var(--alloy-yellow)',
  purple: 'var(--alloy-purple)',
  blue: '#2a6391',
  green: 'var(--alloy-green)',
};

function ProjectsList({ onNav }: { onNav: NavHandler }) {
  const inProgress = DATA.projects.filter((p) => p.status === 'in-progress');
  const items = inProgress.slice(0, 4);
  const remaining = Math.max(0, inProgress.length - items.length);
  const services = DATA.recurringServices;
  const [showRecurring, setShowRecurring] = useState(false);

  return (
    <div className="banner-card banner-yellow active-projects-front dash-feature-card">
      <div className="banner-card-head">
        <div className="bc-titles">
          <div className="bc-kicker">In flight</div>
          <div className="bc-title">
            Active projects<span className="bc-title-count"> · {inProgress.length}</span>
          </div>
        </div>
        <button className="bc-cta" onClick={() => onNav('projects')}>
          {remaining > 0 ? `+${remaining} more →` : 'View all →'}
        </button>
      </div>
      <div className="banner-card-body">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((p) => (
            <div
              key={p.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 16px',
                background: 'var(--alloy-off-white)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 10,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13.5,
                    fontWeight: 700,
                    color: 'var(--alloy-purple)',
                    marginBottom: 2,
                  }}
                >
                  {p.title}
                </div>
                <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>
                  Due {p.due} · {p.dueRel}
                </div>
              </div>
              <span className="tag tag-status-live">
                <span className="dot" />
                On track
              </span>
            </div>
          ))}
        </div>

        <button
          className="recurring-toggle"
          onClick={() => setShowRecurring((s) => !s)}
          aria-expanded={showRecurring}
        >
          <span className="recurring-toggle-dots">
            {services.slice(0, 5).map((s) => (
              <span
                key={s.id}
                className="recurring-toggle-dot"
                style={{ background: SERVICE_TONE[s.color] }}
              />
            ))}
          </span>
          <span className="recurring-toggle-label">
            <strong>{services.length} always-on services</strong>
            <span className="recurring-toggle-sub">running in the background</span>
          </span>
          <span className={`recurring-toggle-chev ${showRecurring ? 'open' : ''}`}>
            <I.Arrow width={14} height={14} />
          </span>
        </button>
        {showRecurring ? (
          <div className="recurring-panel">
            {services.map((s) => (
              <div key={s.id} className="recurring-row">
                <span className="recurring-dot" style={{ background: SERVICE_TONE[s.color] }} />
                <div className="recurring-name">{s.name}</div>
                <span className="recurring-cadence">{s.cadence}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

interface ActivityTone {
  bg: string;
  fg: string;
  icon: JSX.Element;
}

function DesktopActivityCard() {
  const colorMap: Record<string, ActivityTone> = {
    pink: {
      bg: 'var(--alloy-pink-tint)',
      fg: 'var(--alloy-pink)',
      icon: <I.Trophy width={15} height={15} />,
    },
    yellow: {
      bg: 'var(--alloy-yellow-tint)',
      fg: '#b8881a',
      icon: <I.Phone width={15} height={15} />,
    },
    blue: {
      bg: 'var(--alloy-blue-tint)',
      fg: '#2a6391',
      icon: <I.Send width={15} height={15} />,
    },
    green: {
      bg: 'var(--alloy-green-tint)',
      fg: '#2c6e62',
      icon: <I.Star width={15} height={15} />,
    },
    purple: {
      bg: 'var(--alloy-purple-tint)',
      fg: 'var(--alloy-purple)',
      icon: <I.Sparkle width={15} height={15} />,
    },
  };
  return (
    <div className="activity-card">
      <div className="ac-head">
        <span className="ac-kicker">This week</span>
        <span className="ac-title">Activity</span>
        <span className="ac-link">View timeline →</span>
      </div>
      <div className="ac-list">
        {DATA.activity.map((a, i) => {
          const c = colorMap[a.color] ?? colorMap.pink;
          return (
            <div key={i} className="ac-item">
              <div className="ac-ic" style={{ background: c.bg, color: c.fg }}>
                {c.icon}
              </div>
              <div className="ac-body">
                <div className="ac-text">{a.text}</div>
                <div className="ac-meta">{a.meta}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface Kpi {
  label: string;
  value: string;
  trend: string;
  up: boolean;
  icon: string;
  tone: string;
}

function KpiCard({ k }: { k: Kpi }) {
  const iconMap: Record<string, JSX.Element> = {
    trophy: <I.Trophy width={15} height={15} />,
    phone: <I.Phone width={15} height={15} />,
    trend: <I.TrendUp width={15} height={15} />,
    star: <I.Star width={15} height={15} />,
  };
  return (
    <div className="stat-card">
      <div className="stat-label">
        <span className={`stat-icon stat-icon-${k.tone}`}>{iconMap[k.icon]}</span>
        {k.label}
      </div>
      <div className="stat-value">{k.value}</div>
      <div className={`stat-trend ${k.up ? '' : 'down'}`}>
        <I.TrendUp width={13} height={13} /> {k.trend} <span className="vs">vs last period</span>
      </div>
      <Sparkline tone={k.tone} />
    </div>
  );
}

function Sparkline({ tone = 'pink' }: { tone?: string }) {
  const colors: Record<string, string> = {
    pink: '#d9356e',
    yellow: '#b8881a',
    blue: '#2a6391',
    green: '#2c6e62',
  };
  const c = colors[tone] ?? '#d9356e';
  const path = 'M0 22 L8 18 L16 20 L24 14 L32 16 L40 10 L48 12 L56 6 L64 8';
  return (
    <svg className="spark" width="76" height="28" viewBox="0 0 76 28" fill="none">
      <path
        d={path}
        stroke={c}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
      <circle cx="64" cy="8" r="3" fill={c} />
    </svg>
  );
}

function RecognitionSnapshot({ onNav }: { onNav: NavHandler }) {
  const earned = DATA.badges.filter((b) => b.state === 'earned').length;
  const total = DATA.badges.length;
  const next = DATA.badges.find((b) => b.state === 'progress');
  const nextPct = next?.pct ?? 0;
  const toNext = next ? Math.max(1, Math.ceil((100 - nextPct) / 10)) : 0;
  return (
    <div className="recognition-tiles-card">
      <div className="rt-head">
        <div>
          <div className="rt-kicker">Recognition</div>
          <div className="rt-title">Your wins this year</div>
        </div>
        <a onClick={() => onNav('rewards')} className="rt-link" style={{ cursor: 'pointer' }}>
          All badges →
        </a>
      </div>
      <div className="rt-grid">
        <div className="rt-tile">
          <div className="rt-num" style={{ color: 'var(--alloy-pink)' }}>
            {earned}
            <span className="rt-num-sub">/{total}</span>
          </div>
          <div className="rt-lbl">badges earned</div>
        </div>
        <div className="rt-tile">
          <div className="rt-num" style={{ color: 'var(--alloy-yellow)' }}>
            {toNext}
          </div>
          <div className="rt-lbl">to next medal</div>
        </div>
        <div className="rt-tile">
          <div className="rt-num" style={{ color: '#fff' }}>
            Top
            <span className="rt-num-sub" style={{ marginLeft: 6 }}>
              5%
            </span>
          </div>
          <div className="rt-lbl">of Alloy clients</div>
        </div>
        <div className="rt-tile">
          <div className="rt-num" style={{ color: 'var(--alloy-green)' }}>
            14
          </div>
          <div className="rt-lbl">day streak</div>
        </div>
      </div>
      {next ? (
        <button className="rt-next" onClick={() => onNav('rewards')}>
          <BadgeMedalSmall color="var(--alloy-pink)" state="progress" />
          <div className="rt-next-body">
            <div className="rt-next-kicker">Up next · {nextPct}%</div>
            <div className="rt-next-name">{next.name}</div>
          </div>
          <span className="rt-next-arrow">→</span>
        </button>
      ) : null}
    </div>
  );
}

interface BadgeMedalSmallProps {
  color?: string;
  state?: 'earned' | 'progress' | 'locked';
}

function BadgeMedalSmall({ color = '#d9356e', state = 'earned' }: BadgeMedalSmallProps) {
  const gradId = `mg-${color.replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" style={{ margin: '0 auto', display: 'block' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor="#381c4f" />
        </linearGradient>
      </defs>
      <polygon
        points="22,4 28,8 35,7 37,14 42,18 39,25 40,32 33,34 30,40 22,38 14,40 11,34 4,32 5,25 2,18 7,14 9,7 16,8"
        fill={state === 'locked' ? '#e8e4ef' : `url(#${gradId})`}
        stroke={state === 'locked' ? '#c9c1d6' : '#fff'}
        strokeWidth="1.2"
      />
      <circle cx="22" cy="22" r="9" fill="#fff" opacity="0.15" />
      {state === 'locked' ? (
        <g>
          <rect x="18" y="20" width="8" height="7" rx="1.4" fill="#fff" />
          <path d="M19 20v-2a3 3 0 0 1 6 0v2" fill="none" stroke="#fff" strokeWidth="1.4" />
        </g>
      ) : (
        <text
          x="22"
          y="26"
          textAnchor="middle"
          fontSize="11"
          fontWeight="900"
          fill="#fff"
          fontFamily="var(--font-display)"
        >
          ★
        </text>
      )}
    </svg>
  );
}

function DashboardFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="dash-footer">
      <div className="dash-footer-accent" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="dash-footer-row">
        <div className="dash-footer-brand">
          <img src={alloyIcon} alt="" className="dash-footer-mark" />
          <div>
            <div className="dash-footer-name">Alloy Growth Partners</div>
            <div className="dash-footer-tag">
              Engineered growth for community association management.
            </div>
          </div>
        </div>
        <nav className="dash-footer-links" aria-label="Footer">
          <a href="#">Account</a>
          <a href="#">Settings</a>
          <a href="#">Support</a>
          <a href="#">Privacy</a>
        </nav>
        <div className="dash-footer-meta">
          <span>Partner Portal · v1.0</span>
          <span className="dot" aria-hidden="true">
            ·
          </span>
          <span>© {year} Alloy GP</span>
        </div>
      </div>
    </footer>
  );
}
