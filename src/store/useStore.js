import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { format, differenceInDays } from 'date-fns'

export const SEED_USERS = {
  'riya.kapoor': { id:'riya.kapoor', name:'Riya Kapoor', email:'riya.kapoor@atomtech.in', role:'employee', dept:'Engineering', manager:'arjun.mehta', initials:'RK', color:'#3B82F6' },
  'dev.patel':   { id:'dev.patel',   name:'Dev Patel',   email:'dev.patel@atomtech.in',   role:'employee', dept:'Engineering', manager:'arjun.mehta', initials:'DP', color:'#8B5CF6' },
  'sneha.rao':   { id:'sneha.rao',   name:'Sneha Rao',   email:'sneha.rao@atomtech.in',   role:'employee', dept:'Engineering', manager:'arjun.mehta', initials:'SR', color:'#EC4899' },
  'kiran.nair':  { id:'kiran.nair',  name:'Kiran Nair',  email:'kiran.nair@atomtech.in',  role:'employee', dept:'Engineering', manager:'arjun.mehta', initials:'KN', color:'#F59E0B' },
  'arjun.mehta': { id:'arjun.mehta', name:'Arjun Mehta', email:'arjun.mehta@atomtech.in', role:'manager',  dept:'Engineering', team:['riya.kapoor','dev.patel','sneha.rao','kiran.nair'], initials:'AM', color:'#10B981' },
  'hr.admin':    { id:'hr.admin',    name:'HR Admin',    email:'hr@atomtech.in',           role:'admin',    dept:'HR', initials:'HR', color:'#6366F1' },
}

const SEED_GOALS = [
  { id:1,  emp:'riya.kapoor', title:'Increase API response time efficiency',  thrust:'Operational Excellence', uom:'% (Min – Higher is better)',      target:95,          weightage:30, status:'On Track',    achievement:88,          quarter:'Q1', approvalStatus:'approved', shared:false, sharedBy:null,          sharedGroupId:null,  locked:true,  lockedAt:'2025-05-16', returnComment:null, managerComment:null,                         createdAt:'2025-05-12', updatedAt:'2025-05-16' },
  { id:2,  emp:'riya.kapoor', title:'Deploy microservices migration',          thrust:'Product Innovation',     uom:'Timeline',                        target:'2025-09-30', weightage:25, status:'On Track',    achievement:'2025-09-20',quarter:'Q1', approvalStatus:'approved', shared:false, sharedBy:null,          sharedGroupId:null,  locked:true,  lockedAt:'2025-05-16', returnComment:null, managerComment:null,                         createdAt:'2025-05-12', updatedAt:'2025-05-16' },
  { id:3,  emp:'riya.kapoor', title:'Zero critical production incidents',      thrust:'Quality & Compliance',   uom:'Zero',                            target:0,            weightage:20, status:'On Track',    achievement:0,           quarter:'Q1', approvalStatus:'approved', shared:false, sharedBy:null,          sharedGroupId:null,  locked:true,  lockedAt:'2025-05-16', returnComment:null, managerComment:'Great focus on reliability!', createdAt:'2025-05-12', updatedAt:'2025-05-16' },
  { id:4,  emp:'riya.kapoor', title:'Team upskilling completion rate',         thrust:'People & Culture',       uom:'% (Min – Higher is better)',      target:80,           weightage:15, status:'Not Started', achievement:null,        quarter:'Q1', approvalStatus:'approved', shared:true,  sharedBy:'arjun.mehta', sharedGroupId:'sg-001', locked:true,  lockedAt:'2025-05-14', returnComment:null, managerComment:null,                         createdAt:'2025-05-14', updatedAt:'2025-05-14' },
  { id:5,  emp:'riya.kapoor', title:'Cloud infrastructure cost reduction',     thrust:'Cost Optimization',      uom:'Numeric (Max – Lower is better)', target:50000,        weightage:10, status:'Not Started', achievement:null,        quarter:'Q1', approvalStatus:'approved', shared:false, sharedBy:null,          sharedGroupId:null,  locked:true,  lockedAt:'2025-05-16', returnComment:null, managerComment:null,                         createdAt:'2025-05-12', updatedAt:'2025-05-16' },
  { id:6,  emp:'dev.patel',   title:'Feature delivery on time',                thrust:'Product Innovation',     uom:'% (Min – Higher is better)',      target:90,           weightage:40, status:'On Track',    achievement:75,          quarter:'Q1', approvalStatus:'approved', shared:false, sharedBy:null,          sharedGroupId:null,  locked:true,  lockedAt:'2025-05-15', returnComment:null, managerComment:null,                         createdAt:'2025-05-13', updatedAt:'2025-05-15' },
  { id:7,  emp:'dev.patel',   title:'Code review turnaround (hrs)',            thrust:'Operational Excellence', uom:'Numeric (Max – Lower is better)', target:24,           weightage:30, status:'On Track',    achievement:20,          quarter:'Q1', approvalStatus:'approved', shared:false, sharedBy:null,          sharedGroupId:null,  locked:true,  lockedAt:'2025-05-15', returnComment:null, managerComment:null,                         createdAt:'2025-05-13', updatedAt:'2025-05-15' },
  { id:8,  emp:'dev.patel',   title:'Team upskilling completion rate',         thrust:'People & Culture',       uom:'% (Min – Higher is better)',      target:80,           weightage:30, status:'Not Started', achievement:null,        quarter:'Q1', approvalStatus:'approved', shared:true,  sharedBy:'arjun.mehta', sharedGroupId:'sg-001', locked:true,  lockedAt:'2025-05-14', returnComment:null, managerComment:null,                         createdAt:'2025-05-14', updatedAt:'2025-05-14' },
  { id:9,  emp:'sneha.rao',   title:'Customer NPS improvement',                thrust:'Customer Success',       uom:'Numeric (Min – Higher is better)',target:70,           weightage:50, status:'On Track',    achievement:65,          quarter:'Q1', approvalStatus:'pending',  shared:false, sharedBy:null,          sharedGroupId:null,  locked:false, lockedAt:null,         returnComment:null, managerComment:null,                         createdAt:'2025-05-17', updatedAt:'2025-05-17' },
  { id:10, emp:'sneha.rao',   title:'Support ticket resolution time (hrs)',    thrust:'Operational Excellence', uom:'Numeric (Max – Lower is better)', target:4,            weightage:30, status:'Not Started', achievement:null,        quarter:'Q1', approvalStatus:'pending',  shared:false, sharedBy:null,          sharedGroupId:null,  locked:false, lockedAt:null,         returnComment:null, managerComment:null,                         createdAt:'2025-05-17', updatedAt:'2025-05-17' },
  { id:11, emp:'sneha.rao',   title:'Upsell revenue target (₹)',              thrust:'Revenue Growth',         uom:'Numeric (Min – Higher is better)',target:500000,       weightage:20, status:'Not Started', achievement:null,        quarter:'Q1', approvalStatus:'pending',  shared:false, sharedBy:null,          sharedGroupId:null,  locked:false, lockedAt:null,         returnComment:null, managerComment:null,                         createdAt:'2025-05-17', updatedAt:'2025-05-17' },
  { id:12, emp:'kiran.nair',  title:'Pipeline conversion rate',               thrust:'Revenue Growth',         uom:'% (Min – Higher is better)',      target:25,           weightage:60, status:'On Track',    achievement:22,          quarter:'Q1', approvalStatus:'returned',  shared:false, sharedBy:null,          sharedGroupId:null,  locked:false, lockedAt:null,         returnComment:'Please align with Q2 revenue targets. Increase pipeline threshold to 30.', managerComment:null, createdAt:'2025-05-15', updatedAt:'2025-05-17' },
  { id:13, emp:'kiran.nair',  title:'New enterprise accounts won',            thrust:'Revenue Growth',         uom:'Numeric (Min – Higher is better)',target:8,            weightage:40, status:'Not Started', achievement:null,        quarter:'Q1', approvalStatus:'returned',  shared:false, sharedBy:null,          sharedGroupId:null,  locked:false, lockedAt:null,         returnComment:null, managerComment:null,                         createdAt:'2025-05-15', updatedAt:'2025-05-17' },
]

const SEED_AUDIT = [
  { id:1, ts:'2025-05-15 09:12', user:'hr.admin',    action:'Cycle FY 2025-26 opened for goal setting',   entity:'System',               entityType:'cycle',      postLock:false },
  { id:2, ts:'2025-05-16 11:34', user:'arjun.mehta', action:'Approved goal sheet',                        entity:'Riya Kapoor',          entityType:'approval',   postLock:false },
  { id:3, ts:'2025-05-16 14:20', user:'arjun.mehta', action:'Pushed shared goal: Team upskilling',        entity:'Dev Patel, Riya Kapoor',entityType:'shared_goal',postLock:false },
  { id:4, ts:'2025-05-17 10:05', user:'arjun.mehta', action:'Returned goal sheet — needs revision',       entity:'Kiran Nair',           entityType:'return',     postLock:false },
  { id:5, ts:'2025-05-17 15:30', user:'arjun.mehta', action:'Approved goal sheet',                        entity:'Dev Patel',            entityType:'approval',   postLock:false },
  { id:6, ts:'2025-05-18 08:55', user:'hr.admin',    action:'Escalation raised: manager approval overdue',entity:'Sneha Rao',            entityType:'escalation', postLock:false },
]

const CYCLE_CONFIG = {
  name:'FY 2025–26',
  maxGoals:8,
  minWeight:10,
  totalWeight:100,
  phases:[
    { phase:'Goal Setting', opens:'2025-05-01', closes:'2025-06-30', action:'Goal creation, submission & approval',status:'active',    quarter:null },
    { phase:'Q1 Check-in', opens:'2025-07-01', closes:'2025-07-31', action:'Progress update — planned vs. actual', status:'upcoming',  quarter:'Q1'  },
    { phase:'Q2 Check-in', opens:'2025-10-01', closes:'2025-10-31', action:'Progress update — planned vs. actual', status:'scheduled', quarter:'Q2'  },
    { phase:'Q3 Check-in', opens:'2026-01-01', closes:'2026-01-31', action:'Progress update — planned vs. actual', status:'scheduled', quarter:'Q3'  },
    { phase:'Q4 / Annual', opens:'2026-03-01', closes:'2026-04-30', action:'Final achievement capture',            status:'scheduled', quarter:'Q4'  },
  ],
  escalationRules:[
    { id:'r1', label:'Goal not submitted',           daysToTrigger:7,  chain:['employee','manager','hr'] },
    { id:'r2', label:'Manager approval overdue',     daysToTrigger:5,  chain:['manager','hr'] },
    { id:'r3', label:'Check-in not submitted',       daysToTrigger:3,  chain:['employee','manager'] },
    { id:'r4', label:'Returned goals not resubmitted',daysToTrigger:3, chain:['employee','manager'] },
  ]
}

// ── Auto-escalation engine ────────────────────────────────────────────────
function computeAutoEscalations(goals, cycleConfig) {
  const today = new Date()
  const escalations = []
  let eid = 200
  const employees = [...new Set(goals.map(g => g.emp))].filter(id => SEED_USERS[id]?.role === 'employee')
  const cycleOpen = new Date(cycleConfig.phases[0]?.opens || '2025-05-01')
  const activePhase = cycleConfig.phases.find(p => {
    if (!p.closes || !p.quarter) return false
    return today >= new Date(p.opens) && today <= new Date(p.closes)
  })

  employees.forEach(empId => {
    const eg = goals.filter(g => g.emp === empId)
    const hasAny = eg.some(g => ['draft','pending','approved','returned'].includes(g.approvalStatus))
    const hasPending = eg.some(g => g.approvalStatus === 'pending')
    const hasReturned = eg.some(g => g.approvalStatus === 'returned')
    const allApproved = eg.length > 0 && eg.every(g => g.approvalStatus === 'approved')

    // R1: not submitted
    if (!hasAny) {
      const d = differenceInDays(today, cycleOpen)
      if (d >= 7) escalations.push({ id:eid++, emp:empId, type:'Goal not submitted', trigger:`${d} days since cycle opened`, daysOpen:d, status:'Active', notifiedLevels:d>=10?['employee','manager']:['employee'], ruleId:'r1' })
    }
    // R2: pending too long
    if (hasPending) {
      const pg = eg.find(g => g.approvalStatus === 'pending')
      const d = differenceInDays(today, new Date(pg.updatedAt))
      if (d >= 5) escalations.push({ id:eid++, emp:empId, type:'Manager approval overdue', trigger:`Submitted ${d} days ago`, daysOpen:d, status:'Active', notifiedLevels:d>=7?['manager','hr']:['manager'], ruleId:'r2' })
    }
    // R4: returned not resubmitted
    if (hasReturned) {
      const rg = eg.find(g => g.approvalStatus === 'returned')
      const d = differenceInDays(today, new Date(rg.updatedAt))
      if (d >= 3) escalations.push({ id:eid++, emp:empId, type:'Returned goals not resubmitted', trigger:`Returned ${d} days ago`, daysOpen:d, status:'Active', notifiedLevels:d>=5?['employee','manager']:['employee'], ruleId:'r4' })
    }
    // R3: check-in window open but nothing logged
    if (activePhase && allApproved) {
      const hasCheckin = eg.some(g => g.achievement !== null && g.achievement !== '')
      if (!hasCheckin) {
        const d = differenceInDays(today, new Date(activePhase.opens))
        if (d >= 3) escalations.push({ id:eid++, emp:empId, type:'Check-in not submitted', trigger:`${activePhase.phase} window open ${d} days`, daysOpen:d, status:'Active', notifiedLevels:['employee'], ruleId:'r3' })
      }
    }
  })
  return escalations
}

// ── Score helpers ─────────────────────────────────────────────────────────
export function computeScore(goal) {
  const { uom, target, achievement } = goal
  if (achievement === null || achievement === undefined || achievement === '') return null
  if (uom.includes('Min')) {
    if (!target) return null
    return Math.min(150, Math.round((Number(achievement) / Number(target)) * 100))
  }
  if (uom.includes('Max')) {
    if (!achievement || Number(achievement) === 0) return 100
    return Math.min(150, Math.round((Number(target) / Number(achievement)) * 100))
  }
  if (uom === 'Timeline') {
    if (!achievement || !target) return null
    const deadline = new Date(target), done = new Date(achievement)
    if (done <= deadline) return 100
    const daysLate = Math.ceil((done - deadline) / 86400000)
    return Math.max(0, 100 - daysLate * 10)
  }
  if (uom === 'Zero') return Number(achievement) === 0 ? 100 : 0
  return null
}

export function getScoreColor(s) {
  if (s === null) return 'var(--text-tertiary)'
  return s >= 80 ? 'var(--success)' : s >= 60 ? '#D97706' : 'var(--danger)'
}
export function getScoreBg(s) {
  if (s === null) return 'var(--bg-base)'
  return s >= 80 ? 'var(--success-light)' : s >= 60 ? 'var(--warning-light)' : 'var(--danger-light)'
}

export function getActiveCheckinPhase(cycleConfig) {
  const today = new Date()
  return cycleConfig.phases.find(p => p.quarter && today >= new Date(p.opens) && today <= new Date(p.closes)) || null
}
export function isCheckinWindowOpen(cycleConfig) { return !!getActiveCheckinPhase(cycleConfig) }

let goalId = SEED_GOALS.length + 1
let auditId = SEED_AUDIT.length + 1
let sgId = 10

export const useStore = create(
  persist(
    (set, get) => ({
      currentUser: null,
      goals: SEED_GOALS,
      auditLog: SEED_AUDIT,
      resolvedEscalations: [],
      cycleConfig: CYCLE_CONFIG,

      login: (uid) => { const u = SEED_USERS[uid]; if (u) set({ currentUser: u }); return !!u },
      logout: () => set({ currentUser: null }),

      // Computed escalations
      getEscalations: () => {
        const { goals, cycleConfig, resolvedEscalations } = get()
        return computeAutoEscalations(goals, cycleConfig)
          .filter(e => !resolvedEscalations.includes(`${e.emp}__${e.ruleId}`))
      },

      resolveEscalation: (emp, ruleId) => {
        const user = get().currentUser
        set(s => ({ resolvedEscalations: [...s.resolvedEscalations, `${emp}__${ruleId}`] }))
        get()._audit(user?.id, `Resolved escalation: ${ruleId} for ${SEED_USERS[emp]?.name}`, SEED_USERS[emp]?.name || emp, 'escalation_resolve', false)
      },

      addGoal: (data) => {
        const user = get().currentUser
        const g = { ...data, id: goalId++, emp: user.id, approvalStatus:'draft', locked:false, lockedAt:null, shared:false, sharedBy:null, sharedGroupId:null, returnComment:null, managerComment:null, createdAt:format(new Date(),'yyyy-MM-dd'), updatedAt:format(new Date(),'yyyy-MM-dd') }
        set(s => ({ goals:[...s.goals, g] }))
        get()._audit(user.id, `Created goal: "${data.title}"`, user.id, 'goal', false)
      },

      updateGoal: (id, updates) => {
        const user = get().currentUser
        const g = get().goals.find(x => x.id === id)
        const postLock = g?.locked === true
        set(s => ({ goals: s.goals.map(x => x.id===id ? {...x,...updates,updatedAt:format(new Date(),'yyyy-MM-dd')} : x) }))
        get()._audit(user?.id, `Edited goal: "${g?.title}"`, SEED_USERS[g?.emp]?.name||'', 'goal_edit', postLock)
      },

      deleteGoal: (id) => {
        const user = get().currentUser
        const g = get().goals.find(x => x.id === id)
        set(s => ({ goals: s.goals.filter(x => x.id!==id) }))
        get()._audit(user?.id, `Deleted goal: "${g?.title}"`, user.id, 'goal_delete', false)
      },

      submitGoals: (empId) => {
        set(s => ({ goals: s.goals.map(g => g.emp===empId&&g.approvalStatus==='draft' ? {...g,approvalStatus:'pending',updatedAt:format(new Date(),'yyyy-MM-dd')} : g) }))
        get()._audit(empId, 'Submitted goal sheet for approval', SEED_USERS[empId]?.name||empId, 'submission', false)
      },

      approveGoals: (empId) => {
        const user = get().currentUser
        const now = format(new Date(),'yyyy-MM-dd')
        set(s => ({ goals: s.goals.map(g => g.emp===empId&&g.approvalStatus==='pending' ? {...g,approvalStatus:'approved',locked:true,lockedAt:now,updatedAt:now} : g) }))
        get()._audit(user.id, 'Approved all goals', SEED_USERS[empId]?.name||empId, 'approval', false)
      },

      returnGoals: (empId, comment) => {
        const user = get().currentUser
        set(s => ({ goals: s.goals.map(g => g.emp===empId&&g.approvalStatus==='pending' ? {...g,approvalStatus:'returned',returnComment:comment,locked:false,updatedAt:format(new Date(),'yyyy-MM-dd')} : g) }))
        get()._audit(user.id, `Returned goals: "${comment}"`, SEED_USERS[empId]?.name||empId, 'return', false)
      },

      // FIX: sync via sharedGroupId not title string
      updateAchievement: (goalId, achievement, status) => {
        const user = get().currentUser
        const goal = get().goals.find(g => g.id===goalId)
        if (!goal) return
        set(s => ({
          goals: s.goals.map(g => {
            if (g.id === goalId) return {...g, achievement, status, updatedAt:format(new Date(),'yyyy-MM-dd')}
            if (goal.sharedGroupId && g.sharedGroupId===goal.sharedGroupId) return {...g, achievement, updatedAt:format(new Date(),'yyyy-MM-dd')}
            return g
          })
        }))
        get()._audit(user?.id, `Check-in: "${goal.title}"`, SEED_USERS[goal.emp]?.name||'', 'checkin', false)
      },

      addManagerComment: (goalId, comment) => {
        const user = get().currentUser
        const goal = get().goals.find(g => g.id===goalId)
        set(s => ({ goals: s.goals.map(g => g.id===goalId ? {...g,managerComment:comment} : g) }))
        get()._audit(user.id, `Manager comment on: "${goal?.title}"`, SEED_USERS[goal?.emp]?.name||'', 'checkin', false)
      },

      // FIX: use sharedGroupId for proper sync
      pushSharedGoal: (data, recipientIds) => {
        const user = get().currentUser
        const maxId = Math.max(...get().goals.map(g=>g.id), 0)
        const groupId = `sg-${++sgId}`
        const now = format(new Date(),'yyyy-MM-dd')
        const newGoals = recipientIds.map((empId,i) => ({
          ...data, id:maxId+i+1, emp:empId,
          approvalStatus:'approved', locked:true, lockedAt:now,
          shared:true, sharedBy:user.id, sharedGroupId:groupId,
          returnComment:null, managerComment:null, createdAt:now, updatedAt:now,
        }))
        goalId = maxId + recipientIds.length + 1
        set(s => ({ goals:[...s.goals,...newGoals] }))
        get()._audit(user.id, `Pushed shared goal: "${data.title}"`, recipientIds.map(id=>SEED_USERS[id]?.name||id).join(', '), 'shared_goal', false)
      },

      // FIX: Admin unlock with postLock=true audit entry
      unlockGoal: (goalId) => {
        const user = get().currentUser
        const goal = get().goals.find(g=>g.id===goalId)
        set(s => ({ goals: s.goals.map(g => g.id===goalId ? {...g,locked:false,updatedAt:format(new Date(),'yyyy-MM-dd')} : g) }))
        get()._audit(user.id, `Admin unlocked goal: "${goal?.title}"`, SEED_USERS[goal?.emp]?.name||'', 'admin_unlock', true)
      },

      updateCycleConfig: (updates) => set(s => ({ cycleConfig:{...s.cycleConfig,...updates} })),

      _audit: (userId, action, entity, entityType, postLock=false) => {
        set(s => ({ auditLog:[{ id:auditId++, ts:format(new Date(),'yyyy-MM-dd HH:mm'), user:userId||'system', action, entity, entityType, postLock }, ...s.auditLog] }))
      },

      getGoalsForUser: (uid) => get().goals.filter(g=>g.emp===uid),
      getTeamGoals: (mgrid) => {
        const mgr = SEED_USERS[mgrid]
        if (!mgr?.team) return []
        return get().goals.filter(g=>mgr.team.includes(g.emp))
      },
      getTotalWeight: (uid) => get().goals.filter(g=>g.emp===uid&&g.approvalStatus!=='returned').reduce((s,g)=>s+Number(g.weightage||0),0),
    }),
    {
      name:'atomgoals-v3',
      partialize: s => ({ goals:s.goals, auditLog:s.auditLog, resolvedEscalations:s.resolvedEscalations, cycleConfig:s.cycleConfig }),
    }
  )
)

export const THRUST_AREAS = ['Revenue Growth','Customer Success','Operational Excellence','People & Culture','Product Innovation','Quality & Compliance','Cost Optimization']
export const UOM_TYPES = ['Numeric (Min – Higher is better)','Numeric (Max – Lower is better)','% (Min – Higher is better)','% (Max – Lower is better)','Timeline','Zero']
export const STATUS_OPTIONS = ['Not Started','On Track','Completed']
export { CYCLE_CONFIG }
