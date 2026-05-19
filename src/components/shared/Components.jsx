import React, { useState } from 'react'
import { Lock, Share2, AlertCircle, CheckCircle2, Clock, X, Info } from 'lucide-react'
import { computeScore, getScoreColor, getScoreBg } from '../../store/useStore'

// ── Score Badge ──────────────────────────────────────────────────────────
export function ScoreBadge({ goal, size = 'md' }) {
  const score = computeScore(goal)
  if (score === null) return <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>—</span>
  const color = getScoreColor(score)
  const bg = getScoreBg(score)
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, background: bg, color, borderRadius: 'var(--radius-full)', padding: size === 'lg' ? '4px 12px' : '2px 8px', fontSize: size === 'lg' ? '0.9rem' : '0.78rem', fontWeight: 600 }}>
      {score}%
    </span>
  )
}

// ── Progress Bar ─────────────────────────────────────────────────────────
export function ProgressBar({ goal, showLabel = false }) {
  const score = computeScore(goal)
  if (score === null) return <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>No data</span>
  const pct = Math.min(100, score)
  const color = getScoreColor(score)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div className="progress" style={{ flex: 1, minWidth: 70 }}>
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      {showLabel && <span style={{ fontSize: '0.78rem', fontWeight: 600, color, minWidth: 34 }}>{score}%</span>}
    </div>
  )
}

// ── Weight Indicator ─────────────────────────────────────────────────────
export function WeightIndicator({ current, max = 100 }) {
  const pct = Math.min(100, (current / max) * 100)
  const isOk = current === max
  const isOver = current > max
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Total weightage</span>
        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: isOk ? 'var(--success)' : isOver ? 'var(--danger)' : 'var(--warning)' }}>
          {current}% / {max}%
        </span>
      </div>
      <div className="weight-bar">
        <div className="weight-bar-fill" style={{ width: `${pct}%`, background: isOk ? 'var(--success)' : isOver ? 'var(--danger)' : '#D97706' }} />
      </div>
      {!isOk && (
        <p style={{ fontSize: '0.75rem', color: isOver ? 'var(--danger)' : 'var(--warning)', marginTop: 5 }}>
          {isOver ? `Over by ${current - max}%` : `${max - current}% remaining`}
        </p>
      )}
    </div>
  )
}

// ── Status Badge ─────────────────────────────────────────────────────────
export function ApprovalBadge({ status }) {
  const map = {
    approved: { cls: 'badge-success', label: 'Approved' },
    pending:  { cls: 'badge-warning', label: 'Pending' },
    returned: { cls: 'badge-danger',  label: 'Returned' },
    draft:    { cls: 'badge-neutral', label: 'Draft' },
  }
  const { cls, label } = map[status] || map.draft
  return <span className={`badge ${cls}`}>{label}</span>
}

export function StatusBadge({ status }) {
  const map = {
    'On Track':   { cls: 'badge-success', icon: '●' },
    'Completed':  { cls: 'badge-info', icon: '✓' },
    'Not Started':{ cls: 'badge-neutral', icon: '○' },
  }
  const { cls } = map[status] || map['Not Started']
  return <span className={`badge ${cls}`}>{status}</span>
}

// ── Goal Card ────────────────────────────────────────────────────────────
export function GoalCard({ goal, actions, showAchievement = false }) {
  const score = computeScore(goal)
  return (
    <div className="card" style={{ borderLeft: `3px solid ${goal.approvalStatus === 'approved' ? 'var(--success)' : goal.approvalStatus === 'pending' ? '#D97706' : goal.approvalStatus === 'returned' ? 'var(--danger)' : 'var(--border-subtle)'}`, marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5, flexWrap: 'wrap' }}>
            {goal.shared && <span className="shared-badge"><Share2 size={10} /> Shared</span>}
            {goal.locked && <span className="locked-badge"><Lock size={10} /> Locked</span>}
            <ApprovalBadge status={goal.approvalStatus} />
            <StatusBadge status={goal.status} />
          </div>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 6 }}>{goal.title}</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <span className="chip">{goal.thrust}</span>
            <span className="chip" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>{goal.uom}</span>
            <span className="chip">Wt: {goal.weightage}%</span>
            <span className="chip">Target: {goal.target}{goal.uom.includes('%') ? '%' : ''}</span>
          </div>
        </div>
        {score !== null && (
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: getScoreColor(score), lineHeight: 1 }}>{score}%</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', marginTop: 2 }}>progress</div>
          </div>
        )}
      </div>

      {showAchievement && goal.achievement !== null && goal.achievement !== '' && goal.achievement !== 0 && (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
          Actual: <strong style={{ color: 'var(--text-primary)' }}>{goal.achievement}{goal.uom.includes('%') ? '%' : ''}</strong>
        </div>
      )}

      {goal.returnComment && (
        <div className="alert alert-warning" style={{ marginBottom: 8, fontSize: '0.8rem' }}>
          <AlertCircle size={14} />
          <div><strong>Manager feedback:</strong> {goal.returnComment}</div>
        </div>
      )}

      {goal.managerComment && (
        <div className="alert alert-info" style={{ marginBottom: 8, fontSize: '0.8rem' }}>
          <Info size={14} />
          <div><strong>Check-in note:</strong> {goal.managerComment}</div>
        </div>
      )}

      {goal.sharedBy && (
        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
          Shared by manager · Achievement synced from primary owner
        </div>
      )}

      {actions && <div style={{ display: 'flex', gap: 8, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>{actions}</div>}
    </div>
  )
}

// ── Modal ────────────────────────────────────────────────────────────────
export function Modal({ title, children, onClose, width = 520 }) {
  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ width }}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="btn btn-ghost" style={{ padding: 6 }} onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

// ── Page Header ──────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>{actions}</div>}
    </div>
  )
}

// ── Metric Card ──────────────────────────────────────────────────────────
export function MetricCard({ label, value, sub, color, icon: Icon }) {
  return (
    <div className="metric-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="metric-label">{label}</div>
        {Icon && <Icon size={16} color="var(--text-tertiary)" />}
      </div>
      <div className="metric-value" style={{ color: color || 'var(--text-primary)' }}>{value}</div>
      {sub && <div className="metric-sub">{sub}</div>}
    </div>
  )
}

// ── Alert ────────────────────────────────────────────────────────────────
export function Alert({ type = 'info', children }) {
  const icons = { info: Info, success: CheckCircle2, warning: AlertCircle, danger: AlertCircle }
  const Icon = icons[type] || Info
  return (
    <div className={`alert alert-${type}`}>
      <Icon size={16} />
      <div>{children}</div>
    </div>
  )
}

// ── Empty State ──────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon = Target, title, subtitle, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon"><Icon size={40} strokeWidth={1} /></div>
      <div className="empty-state-title">{title}</div>
      {subtitle && <div className="empty-state-sub">{subtitle}</div>}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  )
}
