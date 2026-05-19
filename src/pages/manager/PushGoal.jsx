import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore, THRUST_AREAS, UOM_TYPES, SEED_USERS } from '../../store/useStore'
import { PageHeader, Alert } from '../../components/shared/Components'
import { Share2, CheckCircle2 } from 'lucide-react'

export default function PushGoal() {
  const { currentUser, pushSharedGoal, cycleConfig } = useStore()
  const navigate = useNavigate()
  const team = SEED_USERS[currentUser.id]?.team || []
  const [form, setForm] = useState({ title: '', thrust: '', uom: '', target: '', weightage: '15' })
  const [selected, setSelected] = useState([])
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  function validate() {
    const e = {}
    if (!form.title.trim()) e.title = 'Required'
    if (!form.thrust) e.thrust = 'Required'
    if (!form.uom) e.uom = 'Required'
    if (!form.target) e.target = 'Required'
    if (!form.weightage || Number(form.weightage) < cycleConfig.minWeight) e.weightage = `Min ${cycleConfig.minWeight}%`
    if (!selected.length) e.recipients = 'Select at least one recipient'
    return e
  }

  function handlePush(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    pushSharedGoal({
      title: form.title.trim(),
      thrust: form.thrust,
      uom: form.uom,
      target: form.uom === 'Timeline' ? form.target : Number(form.target),
      weightage: Number(form.weightage),
      status: 'Not Started',
      achievement: null,
      quarter: 'Q1',
    }, selected)
    setSuccess(true)
    setTimeout(() => { navigate('/manager/team-goals') }, 1500)
  }

  return (
    <div>
      <PageHeader title="Push Shared Goal" subtitle="Push a departmental KPI to multiple team members" />
      <div style={{ maxWidth: 620 }}>
        <Alert type="info">
          Recipients can only adjust their weightage — goal title and target will be read-only.
          Achievement updates by any member sync across all linked goal sheets.
        </Alert>

        {success && <Alert type="success"><CheckCircle2 size={14} /> Shared goal pushed successfully! Redirecting...</Alert>}

        <div className="card">
          <form onSubmit={handlePush}>
            <div className="form-group">
              <label className="form-label">Goal title (read-only for recipients) *</label>
              <input className="form-input" placeholder="e.g. Department safety incidents" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              {errors.title && <p className="form-error">{errors.title}</p>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Thrust area *</label>
                <select className="form-select" value={form.thrust} onChange={e => setForm({ ...form, thrust: e.target.value })}>
                  <option value="">Select...</option>
                  {THRUST_AREAS.map(t => <option key={t}>{t}</option>)}
                </select>
                {errors.thrust && <p className="form-error">{errors.thrust}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Unit of measurement *</label>
                <select className="form-select" value={form.uom} onChange={e => setForm({ ...form, uom: e.target.value })}>
                  <option value="">Select...</option>
                  {UOM_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                {errors.uom && <p className="form-error">{errors.uom}</p>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Target (read-only for recipients) *</label>
                <input className="form-input" type={form.uom === 'Timeline' ? 'date' : 'number'} placeholder="e.g. 0" value={form.target} onChange={e => setForm({ ...form, target: e.target.value })} />
                {errors.target && <p className="form-error">{errors.target}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Default weightage % *</label>
                <input className="form-input" type="number" min={cycleConfig.minWeight} max={100} value={form.weightage} onChange={e => setForm({ ...form, weightage: e.target.value })} />
                {errors.weightage && <p className="form-error">{errors.weightage}</p>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Recipients *</label>
              {errors.recipients && <p className="form-error">{errors.recipients}</p>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 }}>
                {team.map(empId => {
                  const user = SEED_USERS[empId]
                  return (
                    <label key={empId} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', cursor: 'pointer', background: selected.includes(empId) ? 'var(--accent-light)' : 'var(--bg-surface)' }}>
                      <input type="checkbox" checked={selected.includes(empId)} onChange={e => setSelected(prev => e.target.checked ? [...prev, empId] : prev.filter(id => id !== empId))} style={{ width: 'auto' }} />
                      <div className="avatar avatar-sm" style={{ background: user?.color, color: '#fff' }}>{user?.initials}</div>
                      <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{user?.name}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={success}>
              <Share2 size={16} /> Push to {selected.length || 'selected'} employee{selected.length !== 1 ? 's' : ''}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
