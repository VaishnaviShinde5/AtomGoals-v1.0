import React, { useState } from 'react'
import { useStore, computeScore, SEED_USERS } from '../../store/useStore'
import { PageHeader, Alert } from '../../components/shared/Components'
import { Download, FileText, CheckCircle2 } from 'lucide-react'

export default function ExportPage() {
  const { goals, auditLog } = useStore()
  const [downloaded, setDownloaded] = useState(null)

  function downloadCSV(data, filename) {
    const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }

  function exportGoals() {
    const headers = ['Employee Name','Employee ID','Thrust Area','Goal Title','UoM','Target','Weightage (%)','Actual Achievement','Progress Score (%)','Status','Approval Status','Quarter','Shared','Created At']
    const rows = goals.map(g => {
      const user = SEED_USERS[g.emp]
      const score = computeScore(g)
      return [
        user?.name || g.emp, g.emp, g.thrust, `"${g.title}"`,
        g.uom, g.target, g.weightage, g.achievement ?? '',
        score !== null ? score : '', g.status, g.approvalStatus,
        g.quarter, g.shared ? 'Yes' : 'No', g.createdAt
      ].join(',')
    })
    downloadCSV([headers.join(','), ...rows].join('\n'), 'atomgoals_achievement_report.csv')
    setDownloaded('goals')
    setTimeout(() => setDownloaded(null), 3000)
  }

  function exportAudit() {
    const headers = ['Timestamp','User ID','User Name','Action','Entity','Type']
    const rows = auditLog.map(l => {
      const user = SEED_USERS[l.user]
      return [l.ts, l.user, user?.name || l.user, `"${l.action}"`, `"${l.entity}"`, l.entityType].join(',')
    })
    downloadCSV([headers.join(','), ...rows].join('\n'), 'atomgoals_audit_log.csv')
    setDownloaded('audit')
    setTimeout(() => setDownloaded(null), 3000)
  }

  // Preview data
  const previewRows = goals.slice(0, 5).map(g => {
    const user = SEED_USERS[g.emp]
    const score = computeScore(g)
    return { emp: user?.name, title: g.title, score: score !== null ? `${score}%` : '—', status: g.status, approval: g.approvalStatus }
  })

  return (
    <div>
      <PageHeader title="Export" subtitle="Download achievement reports and audit logs" />

      {downloaded && <Alert type="success"><CheckCircle2 size={14} /> {downloaded === 'goals' ? 'Achievement report' : 'Audit log'} downloaded successfully.</Alert>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div className="card">
          <div style={{ display: 'flex', align: 'center', gap: 10, marginBottom: 10 }}>
            <FileText size={20} color="var(--accent)" />
            <h3 style={{ fontWeight: 600 }}>Achievement Report</h3>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
            Full goal-wise achievement report with scores, targets, actuals, and approval status for all employees.
          </p>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: 14 }}>
            {goals.length} rows · CSV format
          </div>
          <button className="btn btn-primary" onClick={exportGoals}>
            <Download size={16} /> Download achievement report
          </button>
        </div>

        <div className="card">
          <div style={{ display: 'flex', align: 'center', gap: 10, marginBottom: 10 }}>
            <FileText size={20} color="var(--success)" />
            <h3 style={{ fontWeight: 600 }}>Audit Log Export</h3>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
            Complete system audit trail with timestamps, users, actions, and entity references.
          </p>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: 14 }}>
            {auditLog.length} entries · CSV format
          </div>
          <button className="btn btn-success" onClick={exportAudit}>
            <Download size={16} /> Download audit log
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Preview — achievement report (first 5 rows)</div>
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Employee</th><th>Goal</th><th>Score</th><th>Status</th><th>Approval</th></tr>
            </thead>
            <tbody>
              {previewRows.map((r, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{r.emp}</td>
                  <td style={{ maxWidth: 240, fontSize: '0.85rem' }}>{r.title}</td>
                  <td style={{ fontWeight: 600 }}>{r.score}</td>
                  <td><span className="badge badge-neutral">{r.status}</span></td>
                  <td><span className={`badge ${r.approval === 'approved' ? 'badge-success' : r.approval === 'pending' ? 'badge-warning' : 'badge-danger'}`}>{r.approval}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
