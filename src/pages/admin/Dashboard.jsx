import React, { useState } from 'react'
import { useStore, computeScore, getScoreColor, SEED_USERS } from '../../store/useStore'
import { PageHeader, MetricCard, ApprovalBadge, Alert, Modal } from '../../components/shared/Components'
import { Users, CheckCircle2, Clock, AlertTriangle, Unlock, Lock, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  const { goals, cycleConfig, unlockGoal, getEscalations } = useStore()
  const escalations = getEscalations()
  const [unlockModal, setUnlockModal] = useState(false)
  const [unlockSearch, setUnlockSearch] = useState('')

  const allEmps = Object.values(SEED_USERS).filter(u => u.role === 'employee')
  const allMgrs = Object.values(SEED_USERS).filter(u => u.role === 'manager')
  const approvedEmps = [...new Set(goals.filter(g => g.approvalStatus === 'approved').map(g => g.emp))]

  function getEmpData(empId) {
    const eg = goals.filter(g => g.emp === empId)
    const status = eg.length ? eg[0].approvalStatus : 'not-submitted'
    const scores = eg.filter(g => g.approvalStatus === 'approved' && computeScore(g) !== null).map(g => computeScore(g))
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null
    const hasCheckin = eg.some(g => g.achievement !== null && g.achievement !== '')
    return { eg, status, avg, hasCheckin }
  }

  const allScores = allEmps.map(u => getEmpData(u.id).avg).filter(Boolean)
  const orgAvg = allScores.length ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : null

  // Manager effectiveness: check-in completion per manager
  function getMgrEffectiveness(mgrId) {
    const mgr = SEED_USERS[mgrId]
    if (!mgr?.team) return null
    const teamCheckins = mgr.team.map(empId => getEmpData(empId).hasCheckin)
    const done = teamCheckins.filter(Boolean).length
    const approved = mgr.team.map(empId => getEmpData(empId).status === 'approved').filter(Boolean).length
    return { teamSize: mgr.team.length, checkinsDone: done, approvalsDone: approved }
  }

  // Locked goals for unlock UI
  const lockedGoals = goals.filter(g => g.locked && !g.shared)
  const filteredLocked = lockedGoals.filter(g =>
    !unlockSearch || (SEED_USERS[g.emp]?.name || g.emp).toLowerCase().includes(unlockSearch.toLowerCase()) ||
    g.title.toLowerCase().includes(unlockSearch.toLowerCase())
  )

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        subtitle={`Organization overview · ${cycleConfig.name}`}
        actions={
          <button className="btn btn-sm" onClick={() => setUnlockModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Unlock size={15} /> Unlock goals
          </button>
        }
      />

      <div className="metric-grid">
        <MetricCard label="Total employees" value={allEmps.length} icon={Users} />
        <MetricCard label="Goals approved" value={approvedEmps.length} color="var(--success)" sub={`of ${allEmps.length} employees`} icon={CheckCircle2} />
        <MetricCard label="Active escalations" value={escalations.length} color={escalations.length > 0 ? 'var(--danger)' : undefined} icon={AlertTriangle} />
        <MetricCard label="Org avg score" value={orgAvg !== null ? `${orgAvg}%` : '—'} color={orgAvg !== null ? getScoreColor(orgAvg) : undefined} icon={TrendingUp} />
      </div>

      {/* Heatmap */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">Progress score heatmap</div>
        <div className="heatmap-grid">
          {allEmps.map(u => {
            const { avg } = getEmpData(u.id)
            const bg = avg === null ? '#E5E4DF' : avg >= 80 ? '#C0DD97' : avg >= 60 ? '#FAC775' : '#F09595'
            const tc = avg === null ? '#888' : avg >= 80 ? '#3B6D11' : avg >= 60 ? '#633806' : '#791F1F'
            return (
              <div key={u.id} className="heatmap-cell" style={{ background: bg, color: tc }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: 2 }}>{u.name.split(' ')[0]}</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{avg !== null ? `${avg}%` : '—'}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Manager effectiveness — BRD §5.4 */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">Manager effectiveness dashboard</div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Manager</th>
                <th>Team size</th>
                <th>Goals approved</th>
                <th>Check-ins facilitated</th>
                <th>Check-in rate</th>
                <th>Effectiveness</th>
              </tr>
            </thead>
            <tbody>
              {allMgrs.map(mgr => {
                const eff = getMgrEffectiveness(mgr.id)
                if (!eff) return null
                const rate = eff.teamSize > 0 ? Math.round((eff.checkinsDone / eff.teamSize) * 100) : 0
                return (
                  <tr key={mgr.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="avatar" style={{ background: mgr.color, color: '#fff' }}>{mgr.initials}</div>
                        <span style={{ fontWeight: 500 }}>{mgr.name}</span>
                      </div>
                    </td>
                    <td>{eff.teamSize}</td>
                    <td><span style={{ color: eff.approvalsDone === eff.teamSize ? 'var(--success)' : 'var(--warning)', fontWeight: 600 }}>{eff.approvalsDone}/{eff.teamSize}</span></td>
                    <td>{eff.checkinsDone}/{eff.teamSize}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress" style={{ flex: 1, minWidth: 70 }}>
                          <div className="progress-fill" style={{ width: `${rate}%`, background: rate >= 75 ? 'var(--success)' : rate >= 50 ? '#D97706' : 'var(--danger)' }} />
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>{rate}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${rate >= 75 ? 'badge-success' : rate >= 50 ? 'badge-warning' : 'badge-danger'}`}>
                        {rate >= 75 ? 'High' : rate >= 50 ? 'Medium' : 'Low'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live completion table — reactive */}
      <div className="card">
        <div className="card-title">Check-in completion status (live)</div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Dept</th>
                <th>Goals</th>
                <th>Approval</th>
                <th>Q1 check-in</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {allEmps.map(u => {
                const { eg, status, avg, hasCheckin } = getEmpData(u.id)
                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="avatar" style={{ background: u.color, color: '#fff' }}>{u.initials}</div>
                        <span style={{ fontWeight: 500 }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{u.dept}</td>
                    <td>{eg.length > 0 ? <span className="badge badge-success">{eg.length} goals</span> : <span className="badge badge-neutral">None</span>}</td>
                    <td><ApprovalBadge status={status} /></td>
                    <td>{hasCheckin ? <span className="badge badge-success">Submitted</span> : <span className="badge badge-neutral">Pending</span>}</td>
                    <td>{avg !== null ? <span style={{ fontWeight: 600, color: getScoreColor(avg) }}>{avg}%</span> : <span style={{ color: 'var(--text-tertiary)' }}>—</span>}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Unlock Goal Modal — BRD §3 Admin capability */}
      {unlockModal && (
        <Modal title="Unlock Goals for Editing" onClose={() => setUnlockModal(false)} width={580}>
          <Alert type="warning">
            Unlocking a goal allows the employee to edit it post-approval. This action is logged in the audit trail as a post-lock change.
          </Alert>
          <div className="form-group">
            <label className="form-label">Search goals</label>
            <input className="form-input" placeholder="Search by employee or goal title..." value={unlockSearch} onChange={e => setUnlockSearch(e.target.value)} />
          </div>
          <div style={{ maxHeight: 340, overflowY: 'auto' }}>
            {filteredLocked.length === 0 && (
              <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>No locked goals found</div>
            )}
            {filteredLocked.map(g => {
              const user = SEED_USERS[g.emp]
              return (
                <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div className="avatar avatar-sm" style={{ background: user?.color, color: '#fff', flexShrink: 0 }}>{user?.initials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{user?.name} · Locked {g.lockedAt}</div>
                  </div>
                  <span className="locked-badge" style={{ flexShrink: 0 }}><Lock size={10} /> Locked</span>
                  <button
                    className="btn btn-sm btn-danger"
                    style={{ flexShrink: 0 }}
                    onClick={() => { unlockGoal(g.id) }}
                  >
                    <Unlock size={12} /> Unlock
                  </button>
                </div>
              )
            })}
          </div>
        </Modal>
      )}
    </div>
  )
}
