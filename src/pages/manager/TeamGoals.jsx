import React, { useState } from 'react'
import { useStore, computeScore, getScoreColor, SEED_USERS } from '../../store/useStore'
import { PageHeader, ApprovalBadge, StatusBadge, ScoreBadge } from '../../components/shared/Components'
import { Users } from 'lucide-react'

export default function TeamGoals() {
  const { currentUser, goals } = useStore()
  const team = SEED_USERS[currentUser.id]?.team || []
  const [filter, setFilter] = useState('all')

  const teamGoals = goals.filter(g => team.includes(g.emp) && (filter === 'all' || g.emp === filter))

  return (
    <div>
      <PageHeader title="Team Goals" subtitle={`All goals across ${team.length} team members`} />

      <div className="tabs">
        <button className={`tab${filter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>All</button>
        {team.map(id => (
          <button key={id} className={`tab${filter === id ? ' active' : ''}`} onClick={() => setFilter(id)}>
            {SEED_USERS[id]?.name.split(' ')[0]}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Goal</th>
                <th>Thrust</th>
                <th>Wt.</th>
                <th>Target</th>
                <th>Actual</th>
                <th>Score</th>
                <th>Status</th>
                <th>Approval</th>
              </tr>
            </thead>
            <tbody>
              {teamGoals.map(g => {
                const user = SEED_USERS[g.emp]
                return (
                  <tr key={g.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div className="avatar avatar-sm" style={{ background: user?.color, color: '#fff' }}>{user?.initials}</div>
                        <span style={{ fontSize: '0.8rem' }}>{user?.name.split(' ')[0]}</span>
                      </div>
                    </td>
                    <td style={{ maxWidth: 220 }}>
                      <div style={{ fontWeight: 500, fontSize: '0.8rem' }}>{g.title}</div>
                      {g.shared && <span className="shared-badge" style={{ marginTop: 2 }}>Shared</span>}
                    </td>
                    <td><span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>{g.thrust}</span></td>
                    <td>{g.weightage}%</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{g.target}{g.uom.includes('%') ? '%' : ''}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                      {g.achievement !== null && g.achievement !== '' ? `${g.achievement}${g.uom.includes('%') ? '%' : ''}` : '—'}
                    </td>
                    <td><ScoreBadge goal={g} /></td>
                    <td><StatusBadge status={g.status} /></td>
                    <td><ApprovalBadge status={g.approvalStatus} /></td>
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
