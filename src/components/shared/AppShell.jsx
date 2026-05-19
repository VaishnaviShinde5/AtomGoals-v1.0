import React from 'react'
import { Outlet, useNavigate, NavLink } from 'react-router-dom'
import { useStore, SEED_USERS } from '../../store/useStore'
import { LayoutDashboard, Target, Plus, CheckSquare, Users, ClipboardCheck, MessageSquare, Share2, BarChart3, ScrollText, AlertTriangle, Settings, Download, LogOut, Bell, ChevronDown } from 'lucide-react'

const NAV = {
  employee: [
    { to:'/employee/dashboard', icon:LayoutDashboard, label:'Dashboard' },
    { to:'/employee/goals',     icon:Target,          label:'My Goals' },
    { to:'/employee/add-goal',  icon:Plus,            label:'Add Goal' },
    { to:'/employee/checkin',   icon:CheckSquare,     label:'Q1 Check-in' },
  ],
  manager: [
    { to:'/manager/dashboard',  icon:LayoutDashboard, label:'Dashboard' },
    { to:'/manager/team-goals', icon:Users,           label:'Team Goals' },
    { to:'/manager/approvals',  icon:ClipboardCheck,  label:'Approvals', badge:'pending' },
    { to:'/manager/checkin',    icon:MessageSquare,   label:'Check-ins' },
    { to:'/manager/push-goal',  icon:Share2,          label:'Push Goal' },
  ],
  admin: [
    { to:'/admin/dashboard',    icon:LayoutDashboard, label:'Dashboard' },
    { to:'/admin/analytics',    icon:BarChart3,       label:'Analytics' },
    { to:'/admin/audit',        icon:ScrollText,      label:'Audit Log' },
    { to:'/admin/escalations',  icon:AlertTriangle,   label:'Escalations', badge:'escalations' },
    { to:'/admin/cycle',        icon:Settings,        label:'Cycle Config' },
    { to:'/admin/export',       icon:Download,        label:'Export' },
  ],
}

export default function AppShell() {
  const { currentUser, logout, goals, getEscalations } = useStore()
  const navigate = useNavigate()
  if (!currentUser) return null

  const pendingCount = goals.filter(g => g.approvalStatus === 'pending').length
  const escCount = getEscalations().length
  const navItems = NAV[currentUser.role] || []

  function getBadge(key) {
    if (key === 'pending') return pendingCount
    if (key === 'escalations') return escCount
    return 0
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:28, height:28, borderRadius:8, background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Target size={15} color="#fff" />
            </div>
            <span style={{ fontWeight:600, fontSize:'0.95rem', letterSpacing:'-0.01em' }}>AtomGoals</span>
          </div>
          <span style={{ fontSize:'0.75rem', color:'var(--text-tertiary)', padding:'2px 8px', background:'var(--bg-base)', borderRadius:'var(--radius-full)', border:'1px solid var(--border-subtle)' }}>
            FY 2025–26 · Goal Setting
          </span>
        </div>
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8 }}>
          <button className="btn btn-ghost" style={{ padding:6, position:'relative' }}>
            <Bell size={17} />
            {(pendingCount + escCount) > 0 && <span style={{ position:'absolute', top:4, right:4, width:7, height:7, borderRadius:'50%', background:'var(--danger)' }} />}
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'5px 10px', borderRadius:'var(--radius-md)', border:'1px solid var(--border-subtle)', background:'var(--bg-surface)' }}>
            <div className="avatar" style={{ background:currentUser.color||'var(--accent)', color:'#fff' }}>{currentUser.initials}</div>
            <div style={{ lineHeight:1.3 }}>
              <div style={{ fontSize:'0.8rem', fontWeight:500 }}>{currentUser.name}</div>
              <div style={{ fontSize:'0.7rem', color:'var(--text-tertiary)', textTransform:'capitalize' }}>{currentUser.role}</div>
            </div>
            <ChevronDown size={13} color="var(--text-tertiary)" />
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => { logout(); navigate('/login') }} title="Sign out"><LogOut size={16} /></button>
        </div>
      </header>

      <nav className="sidebar">
        <div className="nav-section-label" style={{ marginTop:4 }}>{currentUser.dept}</div>
        {navItems.map(item => {
          const count = item.badge ? getBadge(item.badge) : 0
          return (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
              <item.icon size={17} />
              <span style={{ flex:1 }}>{item.label}</span>
              {count > 0 && <span style={{ fontSize:'0.7rem', fontWeight:600, minWidth:18, height:18, borderRadius:'var(--radius-full)', background:'var(--danger-light)', color:'var(--danger)', display:'flex', alignItems:'center', justifyContent:'center', padding:'0 4px' }}>{count}</span>}
            </NavLink>
          )
        })}

        <div style={{ padding:'20px 16px 8px', marginTop:'auto' }}>
          <div className="nav-section-label" style={{ padding:0, marginBottom:8 }}>Switch role (demo)</div>
          {Object.values(SEED_USERS).map(u => (
            <button key={u.id} onClick={() => { useStore.getState().login(u.id); navigate(u.role==='employee'?'/employee/dashboard':u.role==='manager'?'/manager/dashboard':'/admin/dashboard') }}
              style={{ display:'flex', alignItems:'center', gap:7, width:'100%', padding:'5px 0', fontSize:'0.78rem', color:currentUser.id===u.id?'var(--accent)':'var(--text-secondary)', background:'none', border:'none', cursor:'pointer', fontFamily:'var(--font-sans)', fontWeight:currentUser.id===u.id?500:400 }}>
              <div className="avatar avatar-sm" style={{ background:u.color, color:'#fff' }}>{u.initials}</div>
              {u.name}
            </button>
          ))}
        </div>
      </nav>

      <main className="main-content fade-in"><Outlet /></main>
    </div>
  )
}
