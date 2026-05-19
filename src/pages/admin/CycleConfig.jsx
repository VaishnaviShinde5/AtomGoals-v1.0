import React, { useState } from 'react'
import { useStore } from '../../store/useStore'
import { PageHeader, Alert } from '../../components/shared/Components'
import { Settings, Save, CheckCircle2 } from 'lucide-react'

export default function CycleConfig() {
  const { cycleConfig, updateCycleConfig } = useStore()
  const [form, setForm] = useState({ name: cycleConfig.name, maxGoals: cycleConfig.maxGoals, minWeight: cycleConfig.minWeight, totalWeight: cycleConfig.totalWeight })
  const [saved, setSaved] = useState(false)

  function handleSave(e) {
    e.preventDefault()
    updateCycleConfig({ ...form, maxGoals: Number(form.maxGoals), minWeight: Number(form.minWeight), totalWeight: Number(form.totalWeight) })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const phaseStatus = { active: 'badge-success', upcoming: 'badge-info', scheduled: 'badge-neutral' }

  return (
    <div>
      <PageHeader title="Cycle Configuration" subtitle="Manage goal setting and check-in windows" />

      {saved && <Alert type="success"><CheckCircle2 size={14} /> Configuration saved successfully.</Alert>}

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">FY 2025–26 phase schedule</div>
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Phase</th><th>Opens on</th><th>Action description</th><th>Status</th></tr>
            </thead>
            <tbody>
              {cycleConfig.phases.map(p => (
                <tr key={p.phase}>
                  <td style={{ fontWeight: 500 }}>{p.phase}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{p.opens}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{p.action}</td>
                  <td><span className={`badge ${phaseStatus[p.status] || 'badge-neutral'}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 520 }}>
        <div className="card-title"><Settings size={14} style={{ display: 'inline', marginRight: 6 }} />Cycle parameters</div>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Cycle name</label>
            <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Max goals per employee</label>
              <input className="form-input" type="number" min={1} max={20} value={form.maxGoals} onChange={e => setForm({ ...form, maxGoals: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Min weightage per goal (%)</label>
              <input className="form-input" type="number" min={1} max={50} value={form.minWeight} onChange={e => setForm({ ...form, minWeight: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Required total weightage (%)</label>
            <input className="form-input" type="number" min={100} max={100} value={form.totalWeight} onChange={e => setForm({ ...form, totalWeight: e.target.value })} />
            <p className="form-hint">Must always be 100% per BRD requirements.</p>
          </div>
          <button type="submit" className="btn btn-primary"><Save size={16} /> Save configuration</button>
        </form>
      </div>
    </div>
  )
}
