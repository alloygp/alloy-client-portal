import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { DATA } from './data';
import { I } from './Icons';
import { pathForScreen } from './useAlloyNav';
import './styles/01-base.css';
import './styles/02-components.css';
import './styles/03-features.css';
import './styles/04-rise-hero.css';
import './styles/05-desktop.css';
import './styles/06-alloy-hero.css';

interface NavItem {
  id: string;
  label: string;
  icon: (p?: { width?: number; height?: number }) => JSX.Element;
  group: 'main' | 'growth';
  path: string;
  count?: number;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: I.Home, group: 'main', path: '/portal' },
  { id: 'roi', label: 'ROI & Insight', icon: I.Chart, group: 'main', path: '/portal/roi' },
  {
    id: 'projects',
    label: 'Projects',
    icon: I.Folder,
    group: 'main',
    path: '/portal/projects',
    count: 6,
  },
  {
    id: 'tickets',
    label: 'Support',
    icon: I.Ticket,
    group: 'main',
    path: '/portal/tickets',
    count: 3,
  },
  { id: 'playbook', label: 'Playbook', icon: I.Map, group: 'growth', path: '/portal/playbook' },
  {
    id: 'library',
    label: 'Resource library',
    icon: I.Library,
    group: 'growth',
    path: '/portal/library',
  },
  { id: 'rewards', label: 'Recognition', icon: I.Trophy, group: 'growth', path: '/portal/rewards' },
];

const TITLES: Record<string, { t: string; s: string }> = {
  dashboard: { t: 'Dashboard', s: 'Tuesday, March 17 — your week at a glance' },
  roi: { t: 'ROI & Insight', s: 'What Alloy is doing for your top line' },
  projects: { t: 'Projects', s: 'Live from Monday — every deliverable in motion' },
  tickets: { t: 'Support', s: 'One thread between you and your Alloy team' },
  playbook: { t: 'Playbook', s: 'Your two-year growth roadmap' },
  library: { t: 'Resource library', s: 'Plays, guides and courses for your team' },
  rewards: { t: 'Recognition', s: 'Wins, made tangible' },
};

function activeIdFromPath(pathname: string): string {
  const match = NAV_ITEMS.find((n) => n.path === pathname);
  if (match) return match.id;
  if (pathname.startsWith('/portal/')) {
    const seg = pathname.replace('/portal/', '');
    const m = NAV_ITEMS.find((n) => n.id === seg);
    if (m) return m.id;
  }
  return 'dashboard';
}

interface SidebarProps {
  active: string;
  onNav: (id: string) => void;
  role: string;
  onRole: (id: string) => void;
}

function Sidebar({ active, onNav, role, onRole }: SidebarProps) {
  const grouped = {
    main: NAV_ITEMS.filter((n) => n.group === 'main'),
    growth: NAV_ITEMS.filter((n) => n.group === 'growth'),
  };
  return (
    <aside className="sidebar">
      <div className="accent-bar">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="sidebar-brand">
        <div className="mark">A</div>
        <div>
          <div className="name">
            ALLOY GROWTH
            <br />
            PARTNERS
          </div>
          <div className="tag">Client Portal</div>
        </div>
      </div>

      <div className="role-switcher">
        {DATA.roles.map((r) => (
          <button key={r.id} data-active={role === r.id} onClick={() => onRole(r.id)}>
            {r.label}
          </button>
        ))}
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Account</div>
        {grouped.main.map((it) => {
          const Icon = it.icon;
          return (
            <div
              key={it.id}
              className="nav-item"
              data-active={active === it.id}
              onClick={() => onNav(it.id)}
            >
              <span className="icon">
                <Icon />
              </span>
              <span>{it.label}</span>
              {it.count ? <span className="badge-dot">{it.count}</span> : null}
            </div>
          );
        })}
        <div className="nav-section-label">Growth</div>
        {grouped.growth.map((it) => {
          const Icon = it.icon;
          return (
            <div
              key={it.id}
              className="nav-item"
              data-active={active === it.id}
              onClick={() => onNav(it.id)}
            >
              <span className="icon">
                <Icon />
              </span>
              <span>{it.label}</span>
              {it.count ? <span className="badge-dot">{it.count}</span> : null}
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="support-card">
          <div className="label">Your Alloy team</div>
          <div className="who-text">Skyler, Justin &amp; Cameron</div>
          <button onClick={() => onNav('tickets')}>Send a request →</button>
        </div>
        <div className="user-row">
          <div className="avatar">{DATA.user.initials}</div>
          <div className="who">
            <div className="nm">{DATA.user.name}</div>
            <div className="role">{DATA.account.company}</div>
          </div>
          <button className="icon-btn" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <I.Settings width={16} height={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}

interface MainHeaderProps {
  title: string;
  subtitle?: string;
  onCommand: (cmd: string) => void;
}

function MainHeader({ title, subtitle, onCommand }: MainHeaderProps) {
  return (
    <div className="main-header">
      <div>
        <h1>{title}</h1>
        {subtitle ? <span className="sub">{subtitle}</span> : null}
      </div>
      <div className="grow" />
      <div className="search">
        <I.Search width={15} height={15} />
        <input placeholder="Search projects, tickets, resources…" />
        <kbd>⌘K</kbd>
      </div>
      <button className="icon-btn">
        <I.Bell width={18} height={18} />
        <span className="pulse" />
      </button>
      <button className="btn btn-primary btn-sm" onClick={() => onCommand('new-ticket')}>
        <I.Plus width={13} height={13} /> New request
      </button>
    </div>
  );
}

export default function AlloyShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState('owner');
  const [mobileNav, setMobileNav] = useState(false);
  const active = activeIdFromPath(location.pathname);
  const title = TITLES[active] ?? TITLES.dashboard;

  const handleNav = (id: string) => {
    const path = pathForScreen(id);
    if (path) navigate(path);
    setMobileNav(false);
    window.scrollTo(0, 0);
  };
  const handleCommand = (cmd: string) => {
    if (cmd === 'new-ticket') handleNav('tickets');
  };

  return (
    <div className="alloy-app density-comfortable" data-bg="on">
      {/* Mobile top bar */}
      <div className="mobile-bar">
        <button className="icon-btn" onClick={() => setMobileNav(true)}>
          <I.Menu />
        </button>
        <div className="brand">
          <div className="mark">A</div>
          <div>Alloy Portal</div>
        </div>
        <button className="icon-btn">
          <I.Bell width={18} height={18} />
          <span className="pulse" />
        </button>
      </div>

      <div className={`sidebar-wrap ${mobileNav ? 'open' : ''}`}>
        <Sidebar active={active} onNav={handleNav} role={role} onRole={setRole} />
        <div className="sidebar-scrim" onClick={() => setMobileNav(false)} />
      </div>

      <main className="main">
        <MainHeader title={title.t} subtitle={title.s} onCommand={handleCommand} />
        <Outlet context={{ onNav: handleNav, mobileNav, setMobileNav }} />
      </main>
    </div>
  );
}

export interface AlloyOutletContext {
  onNav: (id: string) => void;
  mobileNav: boolean;
  setMobileNav: (v: boolean) => void;
}
