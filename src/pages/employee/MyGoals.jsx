import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { PageHeader, GoalCard, WeightIndicator, Alert, EmptyState } from '../../components/shared/Components'
import { Plus, Send, Target } from 'lucide-react'

export default function MyGoals() {
  const { currentUser, getGoalsForUser, submitGoals, deleteGoal, cycleConfig } = useStore()
  const navigate = useNavigate()
  const goals = getGoalsForUser(currentUser.id)

  const drafts = goals.filter(g => g.approvalStatus === 'draft')
  const active = goals.filter(g => g.approvalStatus !== 'draft')
  const totalWeight = goals.filter(g => g.approvalStatus !== 'returned').reduce((s, g) => s + Number(g.weightage || 0), 0)
  const draftWeight = drafts.reduce((s, g) => s + Number(g.weightage || 0), 0)
  const approvedWeight = goals.filter(g => g.approvalStatus === 'approved').reduce((s, g) => s + Number(g.weightage || 0), 0)

  const canSubmit = drafts.length > 0 && (approvedWeight + draftWeight) === 100

  return (
    <div>
      <PageHeader
        title="My Goals"
        subtitle={`${goals.length} of ${cycleConfig.maxGoals} goals · Total weight: ${totalWeight}%`}
        actions={
          goals.length < cycleConfig.maxGoals && (
            <button className="btn btn-primary" onClick={() => navigate('/employee/add-goal')}>
              <Plus size={16} /> Add Goal
            </button>
          )
        }
      />

      <WeightIndicator current={totalWeight} max={100} />
      <div style={{ marginBottom: 16 }} />

      {canSubmit && (
        <Alert type="success">
          Weightage is 100% and you have {drafts.length} draft goal{drafts.length > 1 ? 's' : ''} ready.{' '}
          <button
            className="btn btn-sm btn-success"
            style={{ marginLeft: 8 }}
            onClick={() => submitGoals(currentUser.id)}
          >
            <Send size={13} /> Submit for approval
          </button>
        </Alert>
      )}

      {goals.length === 0 && (
        <EmptyState
          icon={Target}
          title="No goals yet"
          subtitle="Start by adding your first goal for FY 2025–26"
          action={<button className="btn btn-primary" onClick={() => navigate('/employee/add-goal')}><Plus size={16} /> Add first goal</button>}
        />
      )}

      {drafts.length > 0 && (
        <>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Draft ({drafts.length})
          </h3>
          {drafts.map(g => (
            <GoalCard
              key={g.id}
              goal={g}
              actions={[
                <button key="del" className="btn btn-sm btn-danger" onClick={() => deleteGoal(g.id)}>Delete</button>
              ]}
            />
          ))}
        </>
      )}

      {active.length > 0 && (
        <>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: drafts.length ? 20 : 0 }}>
            Submitted / Active ({active.length})
          </h3>
          {active.map(g => <GoalCard key={g.id} goal={g} showAchievement />)}
        </>
      )}
    </div>
  )
}
