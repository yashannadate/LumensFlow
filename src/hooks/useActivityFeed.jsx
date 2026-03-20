import { useState, useCallback, useEffect } from 'react'
import { fetchContractEvents } from '../utils/stellar.js'

export function useActivityFeed(triggerKey) {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    try {
      setError(null)

      const data = await fetchContractEvents(100)

      // ✅ Ensure sorting (newest first)
      const sorted = (data || []).sort(
        (a, b) => (b.timestamp || 0) - (a.timestamp || 0)
      )

      // ✅ Limit to 10 for feed
      setActivities(sorted.slice(0, 10))

    } catch (err) {
      console.error('Activity feed error:', err)
      setError(err)
      setActivities([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()

    const interval = setInterval(refresh, 10000)
    return () => clearInterval(interval)
  }, [refresh, triggerKey]) // ✅ important

  return { activities, loading, error, refresh }
}