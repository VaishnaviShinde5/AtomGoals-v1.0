import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore, THRUST_AREAS, UOM_TYPES } from '../../store/useStore'
import { PageHeader, WeightIndicator, Alert } from '../../components/shared/Components'
import { Plus, Info } from 'lucide-react'

export default function AddGoal() {
  const { currentUser, getGoalsForUser, addGoal, cycleConfig } = useStore()
  const navigate = useNavigate()
  const existingGoals = getGoalsForUser(currentUser.id).filter(g => g.approvalStatus !== 'returned')
  const approvedWeight = existingGoals.filter(g => g.approvalStatus === 'approved').reduce((s, g) => s + Number(g.weightage || 0), 0)
  const draftWeight = existingGoals.filter(g => g.approvalStatus === 'draft').reduce((s, g) => s + Number(g.weightage || 0), 0)
  const usedWeight = approvedWeight + draftWeight

  const [form, setForm] = useState({ title: '', description: '', thrust: '', uom: '', target: '', weightage: '' })
  const [errors, setErrors] = useState({})

  const remaining = 100 - usedWeight
  const newTotal = usedWeight + Number(form.weightage || 0)

  function validate() {
    const e = {}
    if (!form.title.trim()) e.title = 'Goal title is required'
    if (!form.thrust) e.thrust = 'Select a thrust area'
    if (!form.uom) e.uom = 'Select a unit of measurement'
    if (!form.target) e.target = 'Target value is required'
    if (!form.weightage) e.weightage = 'Weightage is required'
    else if (Number(form.weightage) < cycleConfig.minWeight) e.weightage = `Minimum weightage is ${cycleConfig.minWeight}%`
    else if (Number(form.weightage) > 100) e.weightage = 'Weightage cannot exceed 100%'
    else if (newTotal > 100) e.weightage = `Adding ${form.weightage}% exceeds the 100% limit (current: ${usedWeight}%)`
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    addGoal({
      title: form.title.trim(),
      description: form.description.trim(),
      thrust: form.thrust,
      uom: form.uom,
      target: form.uom === 'Timeline' ? form.target : Number(form.target),
      weightage: Number(form.weightage),
      status: 'Not Started',
      achievement: null,
      quarter: 'Q1',
    })
    navigate('/employee/goals')
  }

  const atMax = existingGoals.length >= cycleConfig.maxGoals

  return (
    <div>
      <PageHeader title="Add New Goal" subtitle={`${existingGoals.length} of ${cycleConfig.maxGoals} goals used · ${remaining}% weightage remaining`} />

      {atMax && (
        <Alert type="warning">Maximum {cycleConfig.maxGoals} goals per employee. Delete a draft goal to add a new one.</Alert>
      )}

      <div style={{ maxWidth: 620 }}>
        <div className="card">
          <Alert type="info">
            <div>
              <strong>Validation rules:</strong> Max {cycleConfig.maxGoals} goals · Min {cycleConfig.minWeight}% weightage per goal · Total must equal 100%
            </div>
          </Alert>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Thrust area *</label>
                <select className="form-select" value={form.thrust} onChange={e => setForm({ ...form, thrust: e.target.value })}>
                  <option value="">Select thrust area...</option>
                  {THRUST_AREAS.map(t => <option key={t}>{t}</option>)}
                </select>
                {errors.thrust && <p className="form-error">{errors.thrust}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Unit of measurement *</label>
                <select className="form-select" value={form.uom} onChange={e => setForm({ ...form, uom: e.target.value })}>
                  <option value="">Select UoM...</option>
                  {UOM_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                {errors.uom && <p className="form-error">{errors.uom}</p>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Goal title *</label>
              <input className="form-input" placeholder="e.g. Increase API response time to 95%" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              {errors.title && <p className="form-error">{errors.title}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Description (optional)</label>
              <textarea className="form-textarea" placeholder="Describe how this goal aligns with organizational priorities..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Target value *
                  {form.uom === 'Timeline' && <span className="form-hint" style={{ display: 'inline', marginLeft: 6 }}>Use YYYY-MM-DD format</span>}
                </label>
                <input
                  className="form-input"
                  type={form.uom === 'Timeline' ? 'date' : 'number'}
                  placeholder={form.uom === 'Timeline' ? '2025-09-30' : form.uom === 'Zero' ? '0' : 'e.g. 90'}
                  value={form.target}
                  onChange={e => setForm({ ...form, target: e.target.value })}
                />
                {errors.target && <p className="form-error">{errors.target}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">
                  Weightage % *
                  <span className="form-hint" style={{ display: 'inline', marginLeft: 6 }}>min {cycleConfig.minWeight}% · remaining {remaining}%</span>
                </label>
                <input
                  className="form-input"
                  type="number"
                  min={cycleConfig.minWeight}
                  max={100}
                  placeholder={`${cycleConfig.minWeight}–${remaining}`}
                  value={form.weightage}
                  onChange={e => setForm({ ...form, weightage: e.target.value })}
                />
                {errors.weightage && <p className="form-error">{errors.weightage}</p>}
              </div>
            </div>

            {form.weightage && !errors.weightage && (
              <div style={{ marginBottom: 16 }}>
                <WeightIndicator current={newTotal} max={100} />
              </div>
            )}

            {/* UoM reference */}
            {form.uom && (
              <div style={{ padding: '10px 14px', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)', marginBottom: 16, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <strong>Score formula:</strong>{' '}
                {form.uom.includes('Min') ? 'Achievement ÷ Target × 100 (higher achievement = higher score)' :
                 form.uom.includes('Max') ? 'Target ÷ Achievement × 100 (lower achievement = higher score)' :
                 form.uom === 'Timeline' ? 'On or before deadline = 100%, each day late reduces score' :
                 form.uom === 'Zero' ? 'Achievement = 0 → 100%, anything else → 0%' : ''}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn btn-primary" disabled={atMax}>
                <Plus size={16} /> Add goal
              </button>
              <button type="button" className="btn" onClick={() => navigate('/employee/goals')}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
