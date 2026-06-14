"use client";
import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Cookie 自动由浏览器附带，authFetch 不再手动附加 token
function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    },
  });
}

interface Tool {
  id: string; slug: string; name: string; description: string; url: string;
  price: string; price_type: string; rating: number; featured: number;
  tags: string; pros: string; cons: string; for_whom: string; not_for: string;
  alternatives: string; category_id: string; click_count: number; created_at: string; updated_at: string;
}

interface Submission {
  id: string; name: string; url: string; description: string; category_id: string;
  price: string | null; tags: string | null; status: string; created_at: string; updated_at: string;
}

interface Category { id: string; name: string; icon: string; description: string; count: number; }

interface ToolFormData {
  slug: string; name: string; description: string; url: string; price: string;
  price_type: string; rating: string; featured: boolean; tags: string; pros: string;
  cons: string; for_whom: string; not_for: string; alternatives: string; category_id: string;
}

interface PageStats {
  total_views: number;
  tool_clicks: { slug: string; count: number }[];
  search_queries: { query: string; count: number }[];
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [tab, setTab] = useState('tools');
  const [tools, setTools] = useState<Tool[]>([]);
  const [subs, setSubs] = useState<Submission[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [stats, setStats] = useState<PageStats | null>(null);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editTool, setEditTool] = useState<Tool | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [toolFilterCat, setToolFilterCat] = useState('');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ToolFormData>({
    slug: '', name: '', description: '', url: '', price: 'Free', price_type: 'Free',
    rating: '4.0', featured: false, tags: '', pros: '', cons: '', for_whom: '',
    not_for: '', alternatives: '', category_id: ''
  });

  const totalViews = stats?.total_views ?? 0;
  const topClicks = (stats?.tool_clicks ?? []) as { slug: string; count: number }[];
  const topSearches = (stats?.search_queries ?? []) as { query: string; count: number }[];

  const fetchData = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const [tRes, sRes, cRes, stRes] = await Promise.all([
        authFetch('/api/tools'),
        authFetch('/api/admin-submissions'),
        authFetch('/api/categories'),
        authFetch('/api/stats'),
      ]);

      if (!tRes.ok || !sRes.ok || !cRes.ok || !stRes.ok) {
        // 如果所有请求都 401，说明未登录，重定向到登录页
        if (tRes.status === 401 && sRes.status === 401 && cRes.status === 401) {
          window.location.href = '/login';
          return;
        }
        setFetchError('Failed to load data. Please try refreshing.');
        setLoading(false);
        return;
      }

      const [t, s, c, st] = await Promise.all([tRes.json(), sRes.json(), cRes.json(), stRes.json()]);
      setTools(t);
      setSubs(s);
      setCats(c);
      setStats(st as PageStats);
    } catch (err) {
      console.error('Data fetch error:', err);
      setFetchError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await authFetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore logout errors
    }
    // Clear cookie by navigating to logout
    window.location.href = '/login';
  };

  const handleStatus = async (id: string, status: string) => {
    await authFetch('/api/admin-submissions', { method: 'POST', body: JSON.stringify({ id, status }) });
    setSubs(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const handleSaveTool = async () => {
    if (!formData.name || !formData.url || !formData.category_id) { alert('Name, URL, and Category are required'); return; }
    setSaving(true);
    try {
      await authFetch('/api/tools', { method: 'POST', body: JSON.stringify({ ...formData, rating: parseFloat(formData.rating) || 4.0, featured: formData.featured ? 1 : 0 }) });
      setShowForm(false); setEditTool(null);
      await fetchData();
    } catch { alert('Failed to save tool'); } finally { setSaving(false); }
  };

  const handleEdit = (tool: Tool) => {
    setEditTool(tool);
    const sp = (val: string): string => { try { const p = JSON.parse(val); return Array.isArray(p) ? p.join(', ') : val; } catch { return val; } };
    setFormData({
      slug: tool.slug, name: tool.name, description: tool.description, url: tool.url,
      price: tool.price, price_type: tool.price_type,
      rating: tool.rating?.toString() || '4.0', featured: !!tool.featured,
      tags: sp(tool.tags), pros: sp(tool.pros), cons: sp(tool.cons),
      for_whom: tool.for_whom, not_for: tool.not_for, alternatives: tool.alternatives,
      category_id: tool.category_id
    });
  };

  const handleAddFromSubmission = (sub: Submission) => {
    setEditTool(null);
    setShowForm(true);
    setTab('tools');
    setFormData({
      slug: sub.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      name: sub.name, description: sub.description || '', url: sub.url || '',
      price: (sub.price as string) || 'Free', price_type: 'Free',
      rating: '4.0', featured: false, tags: sub.tags || '', pros: '', cons: '',
      for_whom: 'General users', not_for: 'Enterprise teams', alternatives: '',
      category_id: sub.category_id
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await authFetch(`/api/tools?id=${id}`, { method: 'DELETE' });
    await fetchData();
  };

  const filteredTools = tools.filter(t => {
    if (searchTerm && !t.name.toLowerCase().includes(searchTerm.toLowerCase()) && !t.slug.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (toolFilterCat && t.category_id !== toolFilterCat) return false;
    return true;
  });

  const filteredSubs = subs.filter(s => filter === 'all' || s.status === filter);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (fetchError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="text-red-600 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{fetchError}</p>
          <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mr-2">
            Refresh
          </button>
          <button onClick={() => window.location.href = '/login'} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />
      <main className='max-w-7xl mx-auto px-4 py-6'>
        <div className='flex items-center justify-between mb-6'>
          <h1 className='text-2xl font-bold text-gray-800'>Admin Dashboard</h1>
          <button onClick={handleLogout} className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm'>Logout</button>
        </div>

        {/* Tabs */}
        <div className='flex gap-2 mb-6'>
          {[
            { id: 'tools', label: 'Tools' },
            { id: 'submissions', label: 'Submissions' },
            { id: 'categories', label: 'Categories' },
            { id: 'analytics', label: 'Analytics' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === t.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tools Tab */}
        {tab === 'tools' && (
          <div className='space-y-4'>
            <div className='flex gap-2 items-center'>
              <input
                type='text'
                placeholder='Search tools...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm'
              />
              <select
                value={toolFilterCat}
                onChange={e => setToolFilterCat(e.target.value)}
                className='px-3 py-2 border border-gray-300 rounded-lg text-sm'
              >
                <option value=''>All Categories</option>
                {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <button
                onClick={() => { setShowForm(true); setEditTool(null); setFormData({ slug: '', name: '', description: '', url: '', price: 'Free', price_type: 'Free', rating: '4.0', featured: false, tags: '', pros: '', cons: '', for_whom: '', not_for: '', alternatives: '', category_id: '' }); }}
                className='bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700'
              >
                Add Tool
              </button>
            </div>

            {/* Tool Form Modal */}
            {showForm && (
              <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                <div className='bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto'>
                  <h2 className='text-lg font-bold mb-4'>{editTool ? 'Edit Tool' : 'Add New Tool'}</h2>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-xs font-medium text-gray-700 mb-1'>Name *</label>
                      <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className='w-full px-3 py-2 border rounded-lg text-sm' />
                    </div>
                    <div>
                      <label className='block text-xs font-medium text-gray-700 mb-1'>Slug *</label>
                      <input value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className='w-full px-3 py-2 border rounded-lg text-sm' />
                    </div>
                    <div className='col-span-2'>
                      <label className='block text-xs font-medium text-gray-700 mb-1'>Description *</label>
                      <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className='w-full px-3 py-2 border rounded-lg text-sm' rows={2} />
                    </div>
                    <div>
                      <label className='block text-xs font-medium text-gray-700 mb-1'>URL *</label>
                      <input value={formData.url} onChange={e => setFormData({ ...formData, url: e.target.value })} className='w-full px-3 py-2 border rounded-lg text-sm' />
                    </div>
                    <div>
                      <label className='block text-xs font-medium text-gray-700 mb-1'>Category *</label>
                      <select value={formData.category_id} onChange={e => setFormData({ ...formData, category_id: e.target.value })} className='w-full px-3 py-2 border rounded-lg text-sm'>
                        <option value=''>Select...</option>
                        {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className='block text-xs font-medium text-gray-700 mb-1'>Price</label>
                      <input value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className='w-full px-3 py-2 border rounded-lg text-sm' />
                    </div>
                    <div>
                      <label className='block text-xs font-medium text-gray-700 mb-1'>Price Type</label>
                      <select value={formData.price_type} onChange={e => setFormData({ ...formData, price_type: e.target.value })} className='w-full px-3 py-2 border rounded-lg text-sm'>
                        <option value='Free'>Free</option>
                        <option value='Freemium'>Freemium</option>
                        <option value='Paid'>Paid</option>
                      </select>
                    </div>
                    <div>
                      <label className='block text-xs font-medium text-gray-700 mb-1'>Rating</label>
                      <input type='number' step='0.1' value={formData.rating} onChange={e => setFormData({ ...formData, rating: e.target.value })} className='w-full px-3 py-2 border rounded-lg text-sm' />
                    </div>
                    <div className='flex items-center'>
                      <input type='checkbox' checked={formData.featured} onChange={e => setFormData({ ...formData, featured: e.target.checked })} className='mr-2' />
                      <label className='text-sm text-gray-700'>Featured</label>
                    </div>
                    <div className='col-span-2'>
                      <label className='block text-xs font-medium text-gray-700 mb-1'>Tags (comma separated)</label>
                      <input value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} className='w-full px-3 py-2 border rounded-lg text-sm' />
                    </div>
                    <div className='col-span-2'>
                      <label className='block text-xs font-medium text-gray-700 mb-1'>Pros (comma separated)</label>
                      <textarea value={formData.pros} onChange={e => setFormData({ ...formData, pros: e.target.value })} className='w-full px-3 py-2 border rounded-lg text-sm' rows={2} />
                    </div>
                    <div className='col-span-2'>
                      <label className='block text-xs font-medium text-gray-700 mb-1'>Cons (comma separated)</label>
                      <textarea value={formData.cons} onChange={e => setFormData({ ...formData, cons: e.target.value })} className='w-full px-3 py-2 border rounded-lg text-sm' rows={2} />
                    </div>
                    <div>
                      <label className='block text-xs font-medium text-gray-700 mb-1'>For Whom</label>
                      <input value={formData.for_whom} onChange={e => setFormData({ ...formData, for_whom: e.target.value })} className='w-full px-3 py-2 border rounded-lg text-sm' />
                    </div>
                    <div>
                      <label className='block text-xs font-medium text-gray-700 mb-1'>Not For</label>
                      <input value={formData.not_for} onChange={e => setFormData({ ...formData, not_for: e.target.value })} className='w-full px-3 py-2 border rounded-lg text-sm' />
                    </div>
                    <div className='col-span-2'>
                      <label className='block text-xs font-medium text-gray-700 mb-1'>Alternatives</label>
                      <input value={formData.alternatives} onChange={e => setFormData({ ...formData, alternatives: e.target.value })} className='w-full px-3 py-2 border rounded-lg text-sm' />
                    </div>
                  </div>
                  <div className='flex gap-2 mt-4 justify-end'>
                    <button onClick={() => setShowForm(false)} className='px-4 py-2 bg-gray-200 rounded-lg text-sm'>Cancel</button>
                    <button onClick={handleSaveTool} disabled={saving} className='px-4 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50'>
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className='bg-white border border-gray-200 rounded-xl overflow-hidden'>
              <table className='w-full text-sm'>
                <thead className='bg-gray-50 border-b border-gray-200'>
                  <tr>
                    <th className='px-4 py-3 text-left font-medium text-gray-600'>Name</th>
                    <th className='px-4 py-3 text-left font-medium text-gray-600'>Category</th>
                    <th className='px-4 py-3 text-left font-medium text-gray-600'>Price</th>
                    <th className='px-4 py-3 text-left font-medium text-gray-600'>Rating</th>
                    <th className='px-4 py-3 text-left font-medium text-gray-600'>Clicks</th>
                    <th className='px-4 py-3 text-right font-medium text-gray-600'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTools.map(tool => {
                    const catName = cats.find(c => c.id === tool.category_id)?.name || tool.category_id;
                    return (
                      <tr key={tool.id} className='border-b border-gray-100 hover:bg-gray-50'>
                        <td className='px-4 py-3'>
                          <div className='font-medium'>{tool.name}</div>
                          <div className='text-xs text-gray-400'>{tool.slug}</div>
                        </td>
                        <td className='px-4 py-3 text-gray-600'>{catName}</td>
                        <td className='px-4 py-3'>
                          <span className={'text-xs px-2 py-0.5 rounded-full ' + (tool.price_type === 'Free' ? 'bg-green-100 text-green-800' : tool.price_type === 'Freemium' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800')}>
                            {tool.price_type}
                          </span>
                        </td>
                        <td className='px-4 py-3 text-yellow-600'>⭐ {tool.rating}</td>
                        <td className='px-4 py-3 text-gray-600'>{tool.click_count}</td>
                        <td className='px-4 py-3 text-right'>
                          <div className='flex gap-1 justify-end'>
                            <button onClick={() => handleEdit(tool)} className='px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200'>Edit</button>
                            <button onClick={() => handleDelete(tool.id)} className='px-2 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200'>Delete</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredTools.length === 0 && <div className='p-6 text-center text-gray-500'>No tools found.</div>}
            </div>
          </div>
        )}

        {/* Submissions Tab */}
        {tab === 'submissions' && (
          <div className='space-y-4'>
            <div className='flex gap-2'>{['all','pending','approved','rejected'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={'px-3 py-1.5 text-xs rounded-full ' + (filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700')}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}</div>
            <div className='space-y-3'>
              {filteredSubs.map(sub => (
                <div key={sub.id} className='border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow'>
                  <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-3'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-2 mb-1'>
                        <h3 className='font-semibold'>{sub.name}</h3>
                        <span className={'text-xs px-2 py-0.5 rounded-full ' + (sub.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : sub.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
                          {sub.status}
                        </span>
                      </div>
                      <p className='text-sm text-gray-600 mb-1'>{sub.description}</p>
                      {sub.url && <a href={sub.url} target='_blank' rel='noopener' className='text-xs text-blue-600 hover:underline'>{sub.url}</a>}
                      <div className='flex gap-2 mt-2 text-xs text-gray-500'>
                        <span>Category: {sub.category_id}</span>
                        {sub.price && <span>| Price: {sub.price}</span>}
                        <span>| {new Date(sub.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className='flex gap-2 md:flex-shrink-0'>
                      <button onClick={() => handleStatus(sub.id, 'approved')} className='px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700'>Approve</button>
                      <button onClick={() => handleStatus(sub.id, 'rejected')} className='px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700'>Reject</button>
                      <button onClick={() => handleAddFromSubmission(sub)} className='px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700'>Edit & Add</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {tab === 'categories' && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {cats.map(c => (
              <div key={c.id} className='bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow'>
                <div className='flex items-center gap-3 mb-2'>
                  <span className='text-2xl'>{c.icon}</span>
                  <h3 className='font-semibold text-lg'>{c.name}</h3>
                </div>
                <p className='text-sm text-gray-600'>{c.description}</p>
                <p className='text-xs text-gray-400 mt-2'>{c.count} tools</p>
              </div>
            ))}
          </div>
        )}

        {/* Analytics Tab */}
        {tab === 'analytics' && (
          <div className='space-y-6'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div className='bg-blue-50 p-4 rounded-xl border border-blue-200'>
                <div className='text-2xl font-bold text-blue-700'>{totalViews}</div>
                <div className='text-sm text-blue-600'>Page Views</div>
              </div>
              <div className='bg-green-50 p-4 rounded-xl border border-green-200'>
                <div className='text-2xl font-bold text-green-700'>{tools.length}</div>
                <div className='text-sm text-green-600'>Total Tools</div>
              </div>
              <div className='bg-purple-50 p-4 rounded-xl border border-purple-200'>
                <div className='text-2xl font-bold text-purple-700'>{subs.filter(s => s.status === 'pending').length}</div>
                <div className='text-sm text-purple-600'>Pending Reviews</div>
              </div>
              <div className='bg-orange-50 p-4 rounded-xl border border-orange-200'>
                <div className='text-2xl font-bold text-orange-700'>{tools.reduce((s, t) => s + (t.click_count || 0), 0)}</div>
                <div className='text-sm text-orange-600'>Total Clicks</div>
              </div>
            </div>
            <div className='border border-gray-200 rounded-xl p-6'>
              <h3 className='font-semibold mb-4'>Top Clicked Tools</h3>
              {topClicks.length === 0 && <p className='text-gray-500 text-sm'>No click data yet.</p>}
              <div className='space-y-2'>
                {topClicks.map((c, i) => (
                  <div key={c.slug} className='flex items-center gap-3'>
                    <span className='text-xs font-mono text-gray-400 w-6'>#{i + 1}</span>
                    <span className='text-sm flex-1'>{c.slug}</span>
                    <span className='text-sm font-medium'>{c.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className='border border-gray-200 rounded-xl p-6'>
              <h3 className='font-semibold mb-4'>Top Search Queries</h3>
              {topSearches.length === 0 && <p className='text-gray-500 text-sm'>No search data yet.</p>}
              <div className='space-y-2'>
                {topSearches.map((s, i) => (
                  <div key={s.query} className='flex items-center gap-3'>
                    <span className='text-xs font-mono text-gray-400 w-6'>#{i + 1}</span>
                    <span className='text-sm flex-1'>{s.query}</span>
                    <span className='text-sm font-medium'>{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}