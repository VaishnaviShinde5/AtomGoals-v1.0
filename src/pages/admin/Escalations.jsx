import React from 'react'
import { useStore, SEED_USERS } from '../../store/useStore'
import { PageHeader, Alert, EmptyState } from '../../components/shared/Components'
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react'

export default function Escalations() {
  const { cycleConfig, resolveEscalation, getEscalations } = useStore()
  const escalations = getEscalations()

  return (
    <div>
      <PageHeader title="Escalations" subtitle="Auto-computed rule-based escalation tracking" />

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">Active escalation rules</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {cycleConfig.escalationRules.map(r => (
            <div key={r.id} style={{ padding: '12px 14px', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 4 }}>{r.label}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Triggers after <strong>{r.daysToTrigger} days</strong> · Notifies: {r.chain.join(' → ')}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Alert type="info">
        <Info size={15} />
        <div>Escalations are <strong>auto-computed in real time</strong> from goal submission dates and cycle windows. Resolving an escalation marks it dismissed for this session — it reappears if the condition persists.</div>
      </Alert>

      <div className="card">
        <div className="card-title">Active escalations ({escalations.length})</div>
        {escalations.length === 0 ? (
          <EmptyState icon={CheckCircle2} title="No active escalations" subtitle="All escalation rule conditions are satisfied." />
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Type</th>
                  <th>Trigger</th>
                  <th>Days open</th>
                  <th>Notified</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {escalations.map(e => {
                  const user = SEED_USERS[e.emp]
                  return (
                    <tr key={e.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {user && <div className="avatar avatar-sm" style={{ background: user.color, color: '#fff' }}>{user.initials}</div>}
                          <span style={{ fontWeight: 500 }}>{user?.name || e.emp}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 500, fontSize: '0.875rem' }}>{e.type}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{e.trigger}</td>
                      <td><span style={{ color: 'var(--danger)', fontWeight: 700 }}>{e.daysOpen}d</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {e.notifiedLevels.map(l => <span key={l} className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>{l}</span>)}
                        </div>
                      </td>
                      <td><span className="badge badge-warning">{e.status}</span></td>
                      <td>
                        <button className="btn btn-sm btn-success" onClick={() => resolveEscalation(e.emp, e.ruleId)}>
                          <CheckCircle2 size={13} /> Resolve
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
