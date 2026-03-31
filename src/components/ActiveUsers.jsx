import { User, Users, Clock, Activity } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function ActiveUsers({ activities = [] }) {

  const userMap = new Map()

  // ✅ Build users from events (update latest interaction)
  activities.forEach(ev => {
    const processUser = (addr) => {
      if (!addr) return

      const existing = userMap.get(addr)

      const currentTime = ev.timestamp ? new Date(ev.timestamp).getTime() : 0

      if (!existing || currentTime > existing.timestamp) {
        userMap.set(addr, {
          address: addr,
          lastAction: ev.type || 'interacted',
          timestamp: currentTime
        })
      }
    }

    processUser(ev.sender)
    processUser(ev.receiver)
  })

  // ✅ Convert + sort safely
  let userList = Array.from(userMap.values())

  userList.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))

  const displayUsers = userList.slice(0, 5)

  console.log(`Active Users: Found ${userList.length}, showing ${displayUsers.length}`)

  const formatType = (type) => {
    switch (type) {
      case 'created': return 'Created Stream'
      case 'withdrawal': return 'Withdrew'
      case 'cancelled': return 'Cancelled'
      default: return 'Interacted'
    }
  }

  const shortAddr = (addr) =>
    addr ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : 'Unknown'

  const getTime = (timestamp) => {
    try {
      return timestamp
        ? formatDistanceToNow(new Date(timestamp), { addSuffix: true })
        : 'recently'
    } catch {
      return 'recently'
    }
  }

  return (
    <div style={{ background: '#0d1117', border: '1px solid #1f2937', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#fff' }}>
          Active Peer Access
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#22c55e', fontWeight: 700 }}>
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'currentColor' }} />
          {userList.length} Connected
        </div>
      </div>

      {/* ✅ Empty State */}
      {displayUsers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280', fontSize: '12px' }}>
          No active users yet
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {displayUsers.map((u) => (
            <div key={u.address} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px', background: 'rgba(17,24,39,0.5)',
              border: '1px solid #1f2937', borderRadius: '14px'
            }}>

              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #1f2937, #0d1117)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <User size={16} color="#8b5cf6" />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#fff', fontWeight: 600 }}>
                  {shortAddr(u.address)}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#9ca3af' }}>
                    <Activity size={10} />
                    <span style={{ fontSize: '11px' }}>{formatType(u.lastAction)}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6b7280' }}>
                    <Clock size={10} />
                    <span style={{ fontSize: '10px' }}>
                      {getTime(u.timestamp)}
                    </span>
                  </div>

                </div>
              </div>

            </div>
          ))}
        </div>
      )}



    </div>
  )
}