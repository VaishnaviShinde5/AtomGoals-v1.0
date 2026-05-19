import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore, computeScore, getScoreColor, SEED_USERS } from '../../store/useStore'
import { PageHeader, MetricCard, ScoreBadge, ApprovalBadge, StatusBadge, Alert, ProgressBar } from '../../components/shared/Components'
import { Target, CheckSquare, Weight, TrendingUp, Plus, AlertCircle, Calendar } from 'lucide-react'

export default function EmployeeDashboard() {
  const { currentUser, getGoalsForUser, cycleConfig } = useStore()
  const navigate = useNavigate()
  const goals = getGoalsForUser(currentUser.id)

  const approved = goals.filter(g => g.approvalStatus === 'approved')
  const pending = goals.filter(g => g.approvalStatus === 'pending')
  const returned = goals.filter(g => g.approvalStatus === 'returned')
  const totalWeight = goals.filter(g => g.approvalStatus !== 'returned').reduce((s, g) => s + Number(g.weightage || 0), 0)
  const scores = approved.filter(g => computeScore(g) !== null).map(g => computeScore(g))
  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null

  const currentPhase = cycleConfig.phases.find(p => p.status === 'active')

  return (
    <div>
      <PageHeader
        title={`Good morning, ${currentUser.name.split(' ')[0]} 👋`}
        subtitle={`${cycleConfig.name} · ${currentPhase?.phase || 'Goal Setting'} phase`}
        actions={
          goals.length < cycleConfig.maxGoals && (
            <button className="btn btn-primary" onClick={() => navigate('/employee/add-goal')}>
              <Plus size={16} /> Add Goal
            </button>
          )
        }
      />

      {returned.length > 0 && (
        <Alert type="warning">
          <strong>{returned.length} goal{returned.length > 1 ? 's' : ''} returned</strong> by your manager for revision.{' '}
          <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/employee/goals')}>View and update →</span>
        </Alert>
      )}

      {pending.length > 0 && (
        <Alert type="info">
          <strong>{pending.length} goal{pending.length > 1 ? 's' : ''} pending</strong> manager approval.
        </Alert>
      )}

      <div className="metric-grid">
        <MetricCard label="Goals created" value={goals.length} sub={`of ${cycleConfig.maxGoals} max`} icon={Target} />
        <MetricCard label="Approved" value={approved.length} color="var(--success)" sub="locked & active" icon={CheckSquare} />
        <MetricCard
          label="Total weightage"
          value={`${totalWeight}%`}
          color={totalWeight === 100 ? 'var(--success)' : totalWeight > 100 ? 'var(--danger)' : 'var(--warning)'}
          sub={totalWeight === 100 ? '✓ Valid' : 'Must equal 100%'}
        />
        <MetricCard
          label="Avg score"
          value={avgScore !== null ? `${avgScore}%` : '—'}
          color={avgScore !== null ? getScoreColor(avgScore) : undefined}
          sub="Q1 actuals"
          icon={TrendingUp}
        />
      </div>

      {/* Current cycle */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title"><Calendar size={14} style={{ display: 'inline', marginRight: 6 }} />Cycle schedule</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
          {cycleConfig.phases.map(p => (
            <div key={p.phase} style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)', background: p.status === 'active' ? 'var(--accent-light)' : 'var(--bg-base)', border: p.status === 'active' ? '1px solid var(--accent)' : '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: p.status === 'active' ? 'var(--accent)' : 'var(--text-tertiary)', marginBottom: 2 }}>{p.phase}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{p.opens}</div>
              {p.status === 'active' && <div style={{ fontSize: '0.7rem', color: 'var(--accent)', marginTop: 3, fontWeight: 500 }}>● Active now</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Goals table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div className="card-title" style={{ margin: 0 }}>Goal overview</div>
          <button className="btn btn-sm" onClick={() => navigate('/employee/goals')}>View all →</button>
        </div>
        {goals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-tertiary)' }}>
            <Target size={32} strokeWidth={1} style={{ marginBottom: 8 }} />
            <div>No goals yet. <span style={{ color: 'var(--accent)', cursor: 'pointer' }} onClick={() => navigate('/employee/add-goal')}>Add your first goal →</span></div>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Goal</th>
                  <th>Thrust area</th>
                  <th>Weight</th>
                  <th>Status</th>
                  <th>Approval</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {goals.map(g => (
                  <tr key={g.id}>
                    <td style={{ maxWidth: 240 }}>
                      <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{g.title}</div>
                      {g.shared && <span className="shared-badge" style={{ marginTop: 3 }}>Shared</span>}
                    </td>
                    <td><span className="badge badge-neutral">{g.thrust}</span></td>
                    <td>{g.weightage}%</td>
                    <td><StatusBadge status={g.status} /></td>
                    <td><ApprovalBadge status={g.approvalStatus} /></td>
                    <td style={{ minWidth: 120 }}><ProgressBar goal={g} showLabel /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
