import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore, computeScore, getScoreColor, SEED_USERS } from '../../store/useStore'
import { PageHeader, MetricCard, ApprovalBadge, Alert } from '../../components/shared/Components'
import { Users, ClipboardCheck, TrendingUp, MessageSquare, CheckCircle2, AlertTriangle } from 'lucide-react'

export default function ManagerDashboard() {
  const { currentUser, goals, cycleConfig } = useStore()
  const navigate = useNavigate()
  const team = SEED_USERS[currentUser.id]?.team || []
  const teamGoals = goals.filter(g => team.includes(g.emp))
  const pending = teamGoals.filter(g => g.approvalStatus === 'pending')
  const pendingEmps = [...new Set(pending.map(g => g.emp))]

  function getEmpData(empId) {
    const user = SEED_USERS[empId]
    const eg = goals.filter(g => g.emp === empId)
    const status = eg[0]?.approvalStatus || 'not-submitted'
    const tw = eg.filter(g => g.approvalStatus !== 'returned').reduce((s, g) => s + Number(g.weightage || 0), 0)
    const scores = eg.filter(g => g.approvalStatus === 'approved' && computeScore(g) !== null).map(g => computeScore(g))
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null
    return { user, eg, status, tw, avg }
  }

  const teamAvgScores = team.map(id => getEmpData(id).avg).filter(Boolean)
  const teamAvg = teamAvgScores.length ? Math.round(teamAvgScores.reduce((a, b) => a + b, 0) / teamAvgScores.length) : null

  return (
    <div>
      <PageHeader title="Manager Dashboard" subtitle={`${SEED_USERS[currentUser.id]?.dept} · ${team.length} direct reports`} />

      {pendingEmps.length > 0 && (
        <Alert type="warning">
          <strong>{pendingEmps.length} employee{pendingEmps.length > 1 ? 's' : ''}</strong> waiting for goal approval.{' '}
          <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/manager/approvals')}>Review now →</span>
        </Alert>
      )}

      <div className="metric-grid">
        <MetricCard label="Team size" value={team.length} icon={Users} />
        <MetricCard label="Pending approvals" value={pendingEmps.length} color={pendingEmps.length > 0 ? 'var(--warning)' : undefined} sub="employees waiting" icon={ClipboardCheck} />
        <MetricCard label="Check-ins done" value="1" sub={`of ${team.length}`} icon={MessageSquare} />
        <MetricCard label="Team avg score" value={teamAvg !== null ? `${teamAvg}%` : '—'} color={teamAvg !== null ? getScoreColor(teamAvg) : undefined} icon={TrendingUp} />
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div className="card-title" style={{ margin: 0 }}>Team goal status</div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Goals</th>
                <th>Approval</th>
                <th>Weight total</th>
                <th>Avg score</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {team.map(empId => {
                const { user, eg, status, tw, avg } = getEmpData(empId)
                return (
                  <tr key={empId}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="avatar" style={{ background: user?.color || 'var(--accent)', color: '#fff' }}>{user?.initials}</div>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{user?.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{user?.dept}</div>
                        </div>
                      </div>
                    </td>
                    <td>{eg.length}</td>
                    <td><ApprovalBadge status={status} /></td>
                    <td>
                      <span style={{ color: tw === 100 ? 'var(--success)' : 'var(--danger)', fontWeight: 500 }}>{tw}%</span>
                    </td>
                    <td>
                      {avg !== null
                        ? <span style={{ fontWeight: 600, color: getScoreColor(avg) }}>{avg}%</span>
                        : <span style={{ color: 'var(--text-tertiary)' }}>—</span>}
                    </td>
                    <td>
                      {status === 'pending' ? (
                        <button className="btn btn-sm btn-primary" onClick={() => navigate('/manager/approvals')}>
                          <ClipboardCheck size={13} /> Review
                        </button>
                      ) : (
                        <button className="btn btn-sm" onClick={() => navigate('/manager/checkin')}>
                          <MessageSquare size={13} /> Check-in
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
