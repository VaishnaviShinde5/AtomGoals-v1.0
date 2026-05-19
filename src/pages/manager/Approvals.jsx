import React, { useState } from 'react'
import { useStore, SEED_USERS } from '../../store/useStore'
import { PageHeader, Alert, EmptyState, WeightIndicator } from '../../components/shared/Components'
import { CheckCircle2, RotateCcw, ClipboardCheck, Edit2 } from 'lucide-react'

export default function Approvals() {
  const { currentUser, goals, approveGoals, returnGoals, updateGoal } = useStore()
  const team = SEED_USERS[currentUser.id]?.team || []
  const [returnComments, setReturnComments] = useState({})
  const [showReturnInput, setShowReturnInput] = useState({})
  const [editingCell, setEditingCell] = useState(null)

  const pendingByEmp = {}
  goals.filter(g => team.includes(g.emp) && g.approvalStatus === 'pending').forEach(g => {
    if (!pendingByEmp[g.emp]) pendingByEmp[g.emp] = []
    pendingByEmp[g.emp].push(g)
  })

  const empIds = Object.keys(pendingByEmp)

  if (empIds.length === 0) {
    return (
      <div>
        <PageHeader title="Approvals" subtitle="Review and approve team goal sheets" />
        <EmptyState icon={ClipboardCheck} title="No pending approvals" subtitle="All team members' goals are reviewed." />
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Approvals" subtitle={`${empIds.length} employee${empIds.length > 1 ? 's' : ''} pending review`} />
      <Alert type="info">
        You can edit target values and weightages inline before approving. Approved goals are locked from further edits.
      </Alert>

      {empIds.map(empId => {
        const user = SEED_USERS[empId]
        const empGoals = pendingByEmp[empId]
        const tw = empGoals.reduce((s, g) => s + Number(g.weightage || 0), 0)
        const weightOk = tw === 100

        return (
          <div className="card" key={empId} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="avatar avatar-lg" style={{ background: user?.color, color: '#fff' }}>{user?.initials}</div>
                <div>
                  <h3 style={{ fontWeight: 600 }}>{user?.name}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{empGoals.length} goals · Total weight: <span style={{ color: weightOk ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>{tw}%</span></div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {weightOk && (
                  <button className="btn btn-success" onClick={() => approveGoals(empId)}>
                    <CheckCircle2 size={15} /> Approve all
                  </button>
                )}
                <button
                  className="btn btn-danger"
                  onClick={() => setShowReturnInput(prev => ({ ...prev, [empId]: !prev[empId] }))}
                >
                  <RotateCcw size={15} /> Return for rework
                </button>
              </div>
            </div>

            {!weightOk && (
              <Alert type="danger">Total weightage is {tw}% — must be exactly 100% to approve. Adjust below.</Alert>
            )}

            {showReturnInput[empId] && (
              <div style={{ marginBottom: 14, padding: 14, background: 'var(--danger-light)', borderRadius: 'var(--radius-md)' }}>
                <label className="form-label">Return reason (required)</label>
                <textarea
                  className="form-textarea"
                  placeholder="Explain what needs to be changed..."
                  value={returnComments[empId] || ''}
                  onChange={e => setReturnComments(prev => ({ ...prev, [empId]: e.target.value }))}
                />
                <button
                  className="btn btn-danger"
                  style={{ marginTop: 8 }}
                  onClick={() => {
                    if (!returnComments[empId]?.trim()) { alert('Enter a return reason.'); return }
                    returnGoals(empId, returnComments[empId])
                    setShowReturnInput(prev => ({ ...prev, [empId]: false }))
                  }}
                >
                  <RotateCcw size={14} /> Confirm return
                </button>
              </div>
            )}

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Goal title</th>
                    <th>Thrust area</th>
                    <th>UoM</th>
                    <th>Target <Edit2 size={10} style={{ display: 'inline' }} /></th>
                    <th>Weightage <Edit2 size={10} style={{ display: 'inline' }} /></th>
                  </tr>
                </thead>
                <tbody>
                  {empGoals.map(g => (
                    <tr key={g.id}>
                      <td style={{ maxWidth: 250 }}>
                        <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{g.title}</div>
                        {g.shared && <span className="shared-badge">Shared</span>}
                      </td>
                      <td><span className="badge badge-neutral">{g.thrust}</span></td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', maxWidth: 150, fontFamily: 'var(--font-mono)' }}>{g.uom}</td>
                      <td>
                        <input
                          className="form-input"
                          style={{ width: 90, padding: '4px 8px', fontSize: '0.8rem' }}
                          defaultValue={g.target}
                          onBlur={e => updateGoal(g.id, { target: g.uom === 'Timeline' ? e.target.value : Number(e.target.value) })}
                        />
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <input
                            className="form-input"
                            style={{ width: 70, padding: '4px 8px', fontSize: '0.8rem' }}
                            type="number"
                            min={10}
                            max={100}
                            defaultValue={g.weightage}
                            onBlur={e => updateGoal(g.id, { weightage: Number(e.target.value) })}
                          />
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
    </div>
  )
}
