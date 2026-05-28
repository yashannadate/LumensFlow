import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useWallet } from '../hooks/useWallet'
import { useStream } from '../hooks/useStream'
import { buildStreamHistory, filterHistory, getHistoryStats } from '../utils/indexer'
import React from 'react'

export default function History() {
  const { address, isConnected } = useWallet()
  const { fetchUserStreams } = useStream()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isConnected) navigate('/dashboard', { replace: true })
  }, [isConnected, navigate])

  const [history, setHistory] = useState([])
  const [filtered, setFiltered] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    cancelled: 0,
    totalVolumeXLM: '0.00',
    uniqueParticipants: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 5

  const loadHistory = useCallback(async () => {
    setLoading(true)
    try {
      const streams = await fetchUserStreams()
      const enriched = buildStreamHistory(streams, address)
      setHistory(enriched)
      setStats(enrichStats(enriched))
    } catch (err) {
      console.error('History load error:', err)
    } finally {
      setLoading(false)
    }
  }, [address, fetchUserStreams])

  // Custom stats enricher to return complete volume & metrics
  const enrichStats = (enrichedList) => {
    const rawStats = getHistoryStats(enrichedList)
    return {
      total: enrichedList.length,
      active: enrichedList.filter(s => s.status === 'Active').length,
      completed: enrichedList.filter(s => s.status === 'Completed').length,
      cancelled: enrichedList.filter(s => s.status === 'Cancelled').length,
      totalVolumeXLM: rawStats ? rawStats.totalVolumeXLM : '0.00',
      uniqueParticipants: rawStats ? rawStats.uniqueParticipants : 0
    }
  }

  useEffect(() => { 
    loadHistory() 
  }, [loadHistory])

  // Apply filters whenever search, data, or dropdown filters modify
  useEffect(() => {
    setFiltered(filterHistory(history, searchQuery, statusFilter, roleFilter))
    setCurrentPage(1) // Reset to page 1 on filter change
  }, [history, searchQuery, statusFilter, roleFilter])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedData = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Status style maps matching your provided layout spec
  const statusBadges = {
    Completed: 'bg-secondary-container text-on-secondary-container px-2 py-1 rounded-sm font-label-sm text-[10px] uppercase font-bold',
    Cancelled: 'bg-surface-variant text-on-surface-variant px-2 py-1 rounded-sm font-label-sm text-[10px] uppercase',
    Active: 'bg-secondary text-on-secondary px-2 py-1 rounded-sm font-label-sm text-[10px] uppercase font-bold',
    Pending: 'bg-surface-container-high text-on-surface-variant px-2 py-1 rounded-sm font-label-sm text-[10px] uppercase'
  }

  return (
    <div className="bg-background text-on-background min-h-screen">
      <div className="p-gutter max-w-[1440px] mx-auto">
        
        {/* Hero / Header Action */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-lg">
          <div>
            <h2 className="font-display-lg text-[40px] md:text-[48px] text-primary mb-2 tracking-tight">Immutable Flow Log</h2>
            <p className="font-body-md text-on-surface-variant max-w-xl">
              Comprehensive ledger of all XLM streams initiated or received by your wallet. Transactions are verified on the Stellar Network in real-time.
            </p>
          </div>
          <button 
            onClick={loadHistory}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 border border-outline font-label-sm text-label-sm hover:border-primary transition-all uppercase tracking-widest bg-white cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-[20px] ${loading ? 'animate-spin' : ''}`}>sync</span>
            {loading ? 'Re-indexing...' : 'Re-index History'}
          </button>
        </div>

        {/* Summary Stats (Bento Style) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-sm mb-lg">
          <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-lg shadow-sm">
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-2 text-[11px] tracking-wider font-semibold">Total Streams</p>
            <p className="font-headline-lg text-primary text-3xl font-extrabold">{stats.total}</p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-lg shadow-sm">
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-2 text-[11px] tracking-wider font-semibold">Active</p>
            <div className="flex items-center gap-2">
              <p className="font-headline-lg text-primary text-3xl font-extrabold">{stats.active}</p>
              <span className={`w-2 h-2 rounded-full ${stats.active > 0 ? 'bg-secondary animate-pulse' : 'bg-outline opacity-30'}`}></span>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-lg shadow-sm">
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-2 text-[11px] tracking-wider font-semibold">Completed</p>
            <div className="flex items-center gap-2">
              <p className="font-headline-lg text-secondary text-3xl font-extrabold">{stats.completed}</p>
              <span className="w-2 h-2 bg-secondary rounded-full"></span>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-lg shadow-sm">
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-2 text-[11px] tracking-wider font-semibold">Cancelled</p>
            <p className="font-headline-lg text-error text-3xl font-extrabold">{stats.cancelled}</p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-lg shadow-sm">
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-2 text-[11px] tracking-wider font-semibold">Volume</p>
            <p className="font-headline-lg text-primary text-2xl font-extrabold tracking-tight truncate">{stats.totalVolumeXLM} <span className="text-xs font-normal">XLM</span></p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-lg shadow-sm">
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-2 text-[11px] tracking-wider font-semibold">Participants</p>
            <p className="font-headline-lg text-primary text-3xl font-extrabold">{stats.uniqueParticipants}</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-md bg-white p-3 border border-outline-variant rounded-lg">
          
          {/* Status buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <span className="font-label-sm text-label-sm text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">STATUS:</span>
            <div className="flex bg-surface-container-low p-1 rounded">
              {['all', 'Active', 'Completed', 'Cancelled'].map(s => {
                const isActive = statusFilter === s
                return (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-4 py-1.5 font-label-sm text-label-sm transition-all rounded-xs cursor-pointer border-none font-semibold ${
                      isActive ? 'bg-primary text-on-primary' : 'hover:bg-white text-on-surface-variant'
                    }`}
                  >
                    {s === 'all' ? 'All' : s}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            {/* Search Input inside the Page Filter Bar */}
            <div className="flex items-center bg-surface-container-low border border-outline-variant px-3 py-1.5 rounded-lg w-full sm:w-64">
              <span className="material-symbols-outlined text-outline text-[20px] mr-2 select-none">search</span>
              <input 
                type="text"
                placeholder="Search streams..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent border-none focus:ring-0 font-body-md text-body-md text-on-surface p-0 w-full placeholder-on-surface-variant/40"
              />
            </div>

            {/* Role dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="font-label-sm text-label-sm text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">ROLES:</span>
              <select 
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="bg-transparent border-none font-label-sm text-label-sm focus:ring-0 cursor-pointer font-semibold py-1.5 pr-8 pl-2"
              >
                <option value="all">All Roles</option>
                <option value="sender">Sent Only</option>
                <option value="receiver">Received Only</option>
              </select>
            </div>
          </div>

        </div>

        {/* Streams List Table */}
        <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase font-bold text-[11px]">Stream ID</th>
                  <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase font-bold text-[11px]">Status</th>
                  <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase font-bold text-[11px]">Role</th>
                  <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase font-bold text-[11px]">Address Mapping</th>
                  <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase font-bold text-[11px]">Date Initiated</th>
                  <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase font-bold text-[11px]">Total Amount</th>
                  <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase font-bold text-[11px] text-right">Flow Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {loading && (
                  <tr>
                    <td colSpan="7" className="p-12 text-center">
                      <span className="material-symbols-outlined text-secondary text-4xl animate-spin select-none">sync</span>
                      <p className="font-body-md text-on-surface-variant mt-2 text-sm">Indexing Stellar ledger...</p>
                    </td>
                  </tr>
                )}

                {!loading && paginatedData.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-12 text-center">
                      <span className="material-symbols-outlined text-on-surface-variant/40 text-4xl select-none">database</span>
                      <p className="font-headline-lg text-primary text-base font-bold mt-3">No streams catalogued</p>
                      <p className="font-body-md text-on-surface-variant text-sm mt-1">Try adjusting your active indexer search filters.</p>
                    </td>
                  </tr>
                )}

                {!loading && paginatedData.map(item => (
                  <tr key={item.streamId} className="hover:bg-surface-bright transition-colors group">
                    <td className="p-4 font-body-md text-primary font-bold">
                      <Link to={`/stream/${item.streamId}`} className="hover:text-secondary hover:underline">
                        #{item.streamId}
                      </Link>
                    </td>
                    <td className="p-4">
                      <span className={statusBadges[item.status] || 'bg-surface-variant text-on-surface-variant px-2 py-1 rounded-sm font-label-sm text-[10px] uppercase'}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold text-[11px]">
                      {item.role === 'sender' ? 'Sender' : 'Receiver'}
                    </td>
                    <td className="p-4 font-body-md text-on-surface-variant">
                      <div className="flex items-center gap-2">
                        <span className="bg-surface-container px-2 py-0.5 rounded text-[12px] font-mono select-all">
                          {item.senderTruncated}
                        </span>
                        <span className="material-symbols-outlined text-[16px] text-on-surface-variant/50 select-none">arrow_right_alt</span>
                        <span className="bg-surface-container-highest px-2 py-0.5 rounded text-[12px] font-bold text-primary font-mono select-all">
                          {item.receiverTruncated}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 font-body-md text-on-surface-variant text-sm">{item.startDate}</td>
                    <td className="p-4 font-body-md text-primary font-bold">{parseFloat(item.depositXLM).toFixed(2)} XLM</td>
                    <td className="p-4 font-body-md text-on-surface-variant text-right font-mono text-xs">{item.ratePerSecond} /s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 bg-surface-container-low flex justify-between items-center border-t border-outline-variant">
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              Showing {filtered.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} of {filtered.length} Streams
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || loading}
                className="px-4 py-1.5 border border-outline hover:border-primary font-label-sm text-label-sm transition-colors rounded bg-white cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || loading}
                className="px-4 py-1.5 bg-primary text-on-primary font-label-sm text-label-sm hover:bg-opacity-90 transition-colors rounded cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>

        </div>

        {/* Kinetic Minimalist Info Card */}
        <div className="mt-lg grid grid-cols-1 md:grid-cols-2 gap-lg items-stretch mb-8">
          
          <div className="relative rounded-xl overflow-hidden min-h-[240px] flex flex-col justify-end bg-primary group border border-primary-container shadow">
            <img 
              className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:scale-105 transition-transform duration-700 pointer-events-none" 
              alt="Data flows cryptographic ledger abstraction"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPWw5lxfyFFXZiym7dI2SJEg6lMarrtFbEnLwH-4_B8K8AyEuIwfapWBaZxv2FyYHr_8VCEkiCWQH3ZEp1l8pkaSZVIP1R1ZKHk66ytfHAECGwtRvgwoEa-jKVrFpxiNo2fj_TNZJh6PNouB0Wes-xaqmUua8hYDL-w9HnyPycXk0mCfVwWJ_xYlua9kfDxkdNPHyYT-mHPDbMCIUdQnNvpuz-1JqqWXDbNNomQZ9jbf4KrL5GH5oaAo6qQL21gWFMRtDCOac4NQA"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent"></div>
            <div className="relative z-10 p-6 text-white text-left">
              <p className="font-headline-lg text-white mb-2 text-xl font-bold">Automated Accounting</p>
              <p className="font-body-md text-white/80 max-w-xs text-sm">All streams generate a cryptographically signed receipt for audit purposes.</p>
            </div>
          </div>

          <div className="p-8 border border-outline-variant bg-surface-container-lowest rounded-xl flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-secondary text-[40px] select-none">shield</span>
                <h3 className="font-headline-lg text-primary text-2xl font-bold">Protocol Safety</h3>
              </div>
              <p className="font-body-md text-on-surface-variant text-sm leading-relaxed">
                Your history is pulled directly from the Horizon API. LumensFlow does not store your private keys or personal identification data. Every transaction is non-custodial.
              </p>
            </div>
            <Link 
              to="/docs" 
              className="font-label-sm text-label-sm text-secondary hover:underline flex items-center gap-2 font-bold tracking-wider pt-4"
            >
              READ TECHNICAL DOCUMENTATION
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  )
}
