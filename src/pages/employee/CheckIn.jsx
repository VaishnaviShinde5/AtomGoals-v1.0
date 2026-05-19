import React, { useState } from 'react'
import { useStore, computeScore, getScoreColor, STATUS_OPTIONS, getActiveCheckinPhase, isCheckinWindowOpen } from '../../store/useStore'
import { PageHeader, ScoreBadge, Alert } from '../../components/shared/Components'
import { Save, CheckCircle2, Calendar, Lock } from 'lucide-react'

export default function CheckIn() {
  const { currentUser, getGoalsForUser, updateAchievement, cycleConfig } = useStore()
  const goals = getGoalsForUser(currentUser.id).filter(g => g.approvalStatus === 'approved')
  const [saved, setSaved] = useState(false)
  const [localData, setLocalData] = useState(() => {
    const d = {}
    goals.forEach(g => { d[g.id] = { achievement: g.achievement ?? '', status: g.status } })
    return d
  })

  const windowOpen = isCheckinWindowOpen(cycleConfig)
  const activePhase = getActiveCheckinPhase(cycleConfig)
  const nextPhase = cycleConfig.phases.find(p => p.status === 'upcoming' || p.status === 'scheduled')

  function handleSave() {
    if (!windowOpen) return
    goals.forEach(g => {
      const { achievement, status } = localData[g.id] || {}
      if (achievement !== undefined) {
        const val = g.uom === 'Timeline' ? achievement : (achievement === '' ? null : Number(achievement))
        updateAchievement(g.id, val, status)
      }
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (goals.length === 0) {
    return (
      <div>
        <PageHeader title="Q1 Check-in" />
        <Alert type="warning">No approved goals. Complete goal setting and approval first.</Alert>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Quarterly Check-in"
        subtitle={activePhase ? `${activePhase.phase} · ${activePhase.opens} to ${activePhase.closes}` : 'Achievement tracking'}
        actions={windowOpen && (
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={16} /> Save check-in
          </button>
        )}
      />

      {/* FIX: enforce check-in window */}
      {!windowOpen && (
        <div style={{ padding:'20px 24px', background:'var(--warning-light)', border:'1px solid #FAC775', borderRadius:'var(--radius-lg)', marginBottom:20, display:'flex', alignItems:'flex-start', gap:12 }}>
          <Lock size={20} color="#854F0B" style={{ flexShrink:0, marginTop:2 }} />
          <div>
            <div style={{ fontWeight:600, color:'#633806', marginBottom:4 }}>Check-in window is not open</div>
            <div style={{ fontSize:'0.875rem', color:'#854F0B' }}>
              The current phase is <strong>Goal Setting</strong>. The next check-in window opens on{' '}
              <strong>{nextPhase?.opens || 'July 1, 2025'}</strong> ({nextPhase?.phase || 'Q1 Check-in'}).
            </div>
            <div style={{ fontSize:'0.8rem', color:'#854F0B', marginTop:6 }}>
              You can preview your goals and planned targets below, but actuals cannot be submitted until the window opens.
            </div>
          </div>
        </div>
      )}

      {windowOpen && (
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 12px', background:'var(--success-light)', color:'var(--success)', borderRadius:'var(--radius-full)', fontSize:'0.8rem', marginBottom:16, fontWeight:500 }}>
          <Calendar size={13} /> {activePhase?.phase} window is open · {activePhase?.opens} – {activePhase?.closes}
        </div>
      )}

      {saved && <Alert type="success"><CheckCircle2 size={14} /> Check-in saved successfully!</Alert>}

      {!windowOpen && (
        <Alert type="info">
          Preview only — actual achievement inputs are disabled until {nextPhase?.opens || 'July 2025'}.
        </Alert>
      )}

      {goals.map(g => {
        const local = localData[g.id] || {}
        const previewGoal = { ...g, achievement: local.achievement, status: local.status }
        const score = computeScore(previewGoal)
        const isReadOnly = !windowOpen || !!g.sharedBy

        return (
          <div className="card" key={g.id} style={{ marginBottom:12, opacity: !windowOpen ? 0.85 : 1 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
              <div>
                {g.shared && <span className="shared-badge" style={{ marginBottom:6, display:'inline-block' }}>Shared · synced from primary owner</span>}
                <h4 style={{ fontWeight:600, marginBottom:4 }}>{g.title}</h4>
                <div style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>
                  {g.thrust} · <span style={{ fontFamily:'var(--font-mono)' }}>{g.uom}</span> · Target: <strong>{g.target}{g.uom.includes('%') ? '%' : ''}</strong> · Weight: {g.weightage}%
                </div>
              </div>
              <div style={{ textAlign:'right', flexShrink:0 }}>
                <div style={{ fontSize:'1.8rem', fontWeight:700, color:score !== null ? getScoreColor(score) : 'var(--text-tertiary)', lineHeight:1 }}>
                  {score !== null ? `${score}%` : '—'}
                </div>
                <div style={{ fontSize:'0.7rem', color:'var(--text-tertiary)', marginTop:2 }}>live score</div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group" style={{ marginBottom:0 }}>
                <label className="form-label">
                  Actual achievement
                  {isReadOnly && <span style={{ marginLeft:6, color:'var(--text-tertiary)', fontSize:'0.7rem' }}>(read-only)</span>}
                </label>
                <input
                  className="form-input"
                  type={g.uom === 'Timeline' ? 'date' : 'number'}
                  value={local.achievement ?? ''}
                  onChange={e => !isReadOnly && setLocalData(prev => ({ ...prev, [g.id]: { ...prev[g.id], achievement: e.target.value } }))}
                  readOnly={isReadOnly}
                  placeholder={!windowOpen ? 'Window not open' : g.uom === 'Timeline' ? 'YYYY-MM-DD' : 'Enter actual value'}
                />
              </div>
              <div className="form-group" style={{ marginBottom:0 }}>
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={local.status || g.status}
                  onChange={e => !isReadOnly && setLocalData(prev => ({ ...prev, [g.id]: { ...prev[g.id], status: e.target.value } }))}
                  disabled={isReadOnly}
                >
                  {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {g.managerComment && (
              <div style={{ marginTop:10, padding:'8px 12px', background:'var(--info-light)', color:'var(--info)', borderRadius:'var(--radius-md)', fontSize:'0.8rem' }}>
                💬 Manager note: {g.managerComment}
              </div>
            )}
          </div>
        )
      })}

      {windowOpen && (
        <button className="btn btn-primary" onClick={handleSave} style={{ marginTop:8 }}>
          <Save size={16} /> Save all check-ins
        </button>
      )}
    </div>
  )
}
