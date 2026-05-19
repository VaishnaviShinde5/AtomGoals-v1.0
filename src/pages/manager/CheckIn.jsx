// Manager CheckIn
import React, { useState } from 'react'
import { useStore, computeScore, getScoreColor, SEED_USERS } from '../../store/useStore'
import { PageHeader, Alert, EmptyState, StatusBadge } from '../../components/shared/Components'
import { MessageSquare, Save, CheckCircle2 } from 'lucide-react'

export default function MgrCheckIn() {
  const { currentUser, goals, addManagerComment } = useStore()
  const team = SEED_USERS[currentUser.id]?.team || []
  const [comments, setComments] = useState({})
  const [saved, setSaved] = useState({})

  const teamWithGoals = team.map(empId => ({
    user: SEED_USERS[empId],
    goals: goals.filter(g => g.emp === empId && g.approvalStatus === 'approved')
  })).filter(t => t.goals.length > 0)

  function handleSave(empId) {
    const goalIds = goals.filter(g => g.emp === empId && g.approvalStatus === 'approved').map(g => g.id)
    goalIds.forEach(id => {
      if (comments[id]) addManagerComment(id, comments[id])
    })
    setSaved(prev => ({ ...prev, [empId]: true }))
    setTimeout(() => setSaved(prev => ({ ...prev, [empId]: false })), 2500)
  }

  return (
    <div>
      <PageHeader title="Team Check-ins" subtitle="Review Q1 achievements and add structured feedback" />

      {teamWithGoals.length === 0 && <EmptyState icon={MessageSquare} title="No approved goals" subtitle="Approve team goals first before conducting check-ins." />}

      {teamWithGoals.map(({ user, goals: empGoals }) => {
        const scores = empGoals.filter(g => computeScore(g) !== null).map(g => computeScore(g))
        const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null

        return (
          <div className="card" key={user.id} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="avatar avatar-lg" style={{ background: user.color, color: '#fff' }}>{user.initials}</div>
                <div>
                  <h3 style={{ fontWeight: 600 }}>{user.name}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{empGoals.length} approved goals</div>
                </div>
              </div>
              {avg !== null && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 700, color: getScoreColor(avg), lineHeight: 1 }}>{avg}%</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>team avg</div>
                </div>
              )}
            </div>

            {saved[user.id] && <Alert type="success"><CheckCircle2 size={14} /> Feedback saved for {user.name}</Alert>}

            <div className="table-container" style={{ marginBottom: 14 }}>
              <table>
                <thead>
                  <tr>
                    <th>Goal</th>
                    <th>Target</th>
                    <th>Actual</th>
                    <th>Score</th>
                    <th>Status</th>
                    <th>Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {empGoals.map(g => {
                    const score = computeScore(g)
                    return (
                      <tr key={g.id}>
                        <td style={{ maxWidth: 200 }}>
                          <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{g.title}</div>
                        </td>
                        <td>{g.target}{g.uom.includes('%') ? '%' : ''}</td>
                        <td><strong>{g.achievement !== null && g.achievement !== '' ? `${g.achievement}${g.uom.includes('%') ? '%' : ''}` : '—'}</strong></td>
                        <td>{score !== null ? <span style={{ fontWeight: 600, color: getScoreColor(score) }}>{score}%</span> : '—'}</td>
                        <td><StatusBadge status={g.status} /></td>
                        <td style={{ minWidth: 200 }}>
                          <input
                            className="form-input"
                            style={{ fontSize: '0.8rem', padding: '5px 8px' }}
                            placeholder={g.managerComment || 'Add feedback...'}
                            value={comments[g.id] || ''}
                            onChange={e => setComments(prev => ({ ...prev, [g.id]: e.target.value }))}
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <button className="btn btn-primary btn-sm" onClick={() => handleSave(user.id)}>
              <Save size={14} /> Save feedback for {user.name.split(' ')[0]}
            </button>
          </div>
        )
      })}
    </div>
  )
}
