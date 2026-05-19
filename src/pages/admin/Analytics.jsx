import React from 'react'
import { useStore, computeScore, getScoreColor, SEED_USERS, THRUST_AREAS } from '../../store/useStore'
import { PageHeader, MetricCard } from '../../components/shared/Components'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { TrendingUp } from 'lucide-react'

const COLORS = ['#1A56DB','#057A55','#D4537E','#7F77DD','#D85A30','#BA7517','#639922']

export default function Analytics() {
  const { goals } = useStore()
  const allEmps = Object.values(SEED_USERS).filter(u => u.role === 'employee')

  const empScoreData = allEmps.map(u => {
    const eg = goals.filter(g => g.emp === u.id && g.approvalStatus === 'approved')
    const scores = eg.filter(g => computeScore(g) !== null).map(g => computeScore(g))
    const avg = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : 0
    return { name: u.name.split(' ')[0], score: avg, fill: u.color }
  })

  const thrustData = THRUST_AREAS.map((t, i) => ({
    name: t,
    count: goals.filter(g => g.thrust === t).length,
    color: COLORS[i % COLORS.length]
  })).filter(d => d.count > 0)

  const statusData = [
    { name: 'On Track', value: goals.filter(g=>g.status==='On Track').length, color: '#057A55' },
    { name: 'Completed', value: goals.filter(g=>g.status==='Completed').length, color: '#1A56DB' },
    { name: 'Not Started', value: goals.filter(g=>g.status==='Not Started').length, color: '#A09D96' },
  ].filter(d => d.value > 0)

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Organization-wide goal progress and trends" />

      <div className="metric-grid">
        <MetricCard label="Total goals" value={goals.length} icon={TrendingUp} />
        <MetricCard label="On track" value={goals.filter(g=>g.status==='On Track').length} color="var(--success)" />
        <MetricCard label="Not started" value={goals.filter(g=>g.status==='Not Started').length} color="var(--text-tertiary)" />
        <MetricCard label="Approved" value={goals.filter(g=>g.approvalStatus==='approved').length} color="var(--accent)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div className="card">
          <div className="card-title">Avg progress score by employee</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={empScoreData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0,100]} tick={{ fontSize: 12 }} tickFormatter={v => `${v}%`} />
              <Tooltip formatter={v => [`${v}%`, 'Score']} />
              <Bar dataKey="score" radius={[4,4,0,0]}>
                {empScoreData.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-title">Goals by status</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" label={({name,value})=>`${name}: ${value}`} labelLine={false} fontSize={11}>
                {statusData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Goals by thrust area</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={thrustData} layout="vertical" margin={{ top: 5, right: 20, left: 120, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
            <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={120} />
            <Tooltip />
            <Bar dataKey="count" radius={[0,4,4,0]}>
              {thrustData.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
