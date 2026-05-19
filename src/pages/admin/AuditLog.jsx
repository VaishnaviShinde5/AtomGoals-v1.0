import React, { useState } from 'react'
import { useStore, SEED_USERS } from '../../store/useStore'
import { PageHeader, Alert } from '../../components/shared/Components'
import { Lock, Filter } from 'lucide-react'

const TYPE_COLORS = {
  approval: 'badge-success', return: 'badge-danger', submission: 'badge-info',
  shared_goal: 'badge-accent', escalation: 'badge-warning', checkin: 'badge-neutral',
  goal: 'badge-neutral', cycle: 'badge-info', admin_unlock: 'badge-warning',
  goal_edit: 'badge-neutral', goal_delete: 'badge-danger', escalation_resolve: 'badge-success',
}

export default function AuditLog() {
  const { auditLog } = useStore()
  const [search, setSearch] = useState('')
  const [filterPostLock, setFilterPostLock] = useState(false)

  const filtered = auditLog.filter(l => {
    const matchSearch =
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.entity.toLowerCase().includes(search.toLowerCase()) ||
      (SEED_USERS[l.user]?.name || l.user).toLowerCase().includes(search.toLowerCase())
    const matchPostLock = filterPostLock ? l.postLock === true : true
    return matchSearch && matchPostLock
  })

  const postLockCount = auditLog.filter(l => l.postLock).length

  return (
    <div>
      <PageHeader
        title="Audit Log"
        subtitle={`${auditLog.length} total entries · ${postLockCount} post-lock changes`}
      />

      {postLockCount > 0 && (
        <Alert type="warning">
          <Lock size={15} />
          <div><strong>{postLockCount} post-lock change{postLockCount > 1 ? 's' : ''} detected</strong> — goals were edited after approval lock. Use the filter below to inspect.</div>
        </Alert>
      )}

      <div className="card">
        <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
          <input
            className="form-input"
            placeholder="Search by user, action, entity..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 320, flex: 1 }}
          />
          <button
            className={`btn btn-sm ${filterPostLock ? 'btn-danger' : ''}`}
            onClick={() => setFilterPostLock(f => !f)}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Lock size={13} />
            {filterPostLock ? 'Showing post-lock only' : 'Filter post-lock changes'}
            {postLockCount > 0 && <span style={{ background: 'var(--danger)', color: '#fff', borderRadius: '99px', fontSize: '0.7rem', padding: '1px 6px' }}>{postLockCount}</span>}
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Type</th>
                <th>Post-lock</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => {
                const user = SEED_USERS[l.user]
                return (
                  <tr key={l.id} style={l.postLock ? { background: 'var(--warning-light)' } : {}}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{l.ts}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {user && <div className="avatar avatar-sm" style={{ background: user.color, color: '#fff' }}>{user.initials}</div>}
                        <span style={{ fontWeight: 500, fontSize: '0.85rem' }}>{user?.name || l.user}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.875rem' }}>{l.action}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{l.entity}</td>
                    <td><span className={`badge ${TYPE_COLORS[l.entityType] || 'badge-neutral'}`}>{l.entityType}</span></td>
                    <td>
                      {l.postLock
                        ? <span className="badge badge-danger"><Lock size={10} /> Post-lock</span>
                        : <span style={{ color: 'var(--text-tertiary)', fontSize: '0.78rem' }}>—</span>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '28px', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>No matching entries</div>
        )}
      </div>
    </div>
  )
}
