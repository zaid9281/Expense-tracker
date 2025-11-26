import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IndianRupee, TrendingDown, TrendingUp, Wallet, Plus, Trash2, Calendar, Edit2, X, Search, PieChart } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ totalIncome: 0, totalExpenses: 0, balance: 0 });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    type: 'expense', amount: '', category: '', description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('list');

  const categories = {
    expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'],
    income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other']
  };

  const categoryIcons = {
    Food: '🍔', Transport: '🚗', Shopping: '🛍️', Bills: '📄',
    Entertainment: '🎬', Health: '💊', Salary: '💰', Freelance: '💼',
    Investment: '📈', Gift: '🎁', Other: '📌'
  };

  useEffect(() => { fetchTransactions(); fetchStats(); }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/transactions`);
      setTransactions(res.data);
    } catch (e) {
      alert('Failed to fetch transactions. Make sure backend is running on port 5000');
    } finally { setLoading(false); }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/stats`);
      setStats(res.data);
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async () => {
    if (!formData.amount || !formData.category || !formData.description) {
      alert('Please fill all fields'); return;
    }
    try {
      if (editingId) await axios.put(`${API_URL}/transactions/${editingId}`, formData);
      else await axios.post(`${API_URL}/transactions`, formData);
      setFormData({ type: 'expense', amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] });
      setShowForm(false); setEditingId(null); fetchTransactions(); fetchStats();
    } catch (e) { alert('Failed to save transaction'); }
  };

  const deleteTransaction = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    try { await axios.delete(`${API_URL}/transactions/${id}`); fetchTransactions(); fetchStats(); }
    catch (e) { alert('Failed to delete'); }
  };

  const editTransaction = (t) => {
    setFormData({ type: t.type, amount: t.amount, category: t.category, description: t.description, date: new Date(t.date).toISOString().split('T')[0] });
    setEditingId(t._id); setShowForm(true);
  };

  const filteredTransactions = transactions
    .filter(t => filterCategory === 'all' || t.category === filterCategory)
    .filter(t => filterType === 'all' || t.type === filterType)
    .filter(t => t.description.toLowerCase().includes(searchTerm.toLowerCase()) || t.category.toLowerCase().includes(searchTerm.toLowerCase()));

  const getCategoryStats = () => {
    const totals = {};
    transactions.forEach(t => { if (t.type === 'expense') totals[t.category] = (totals[t.category] || 0) + t.amount; });
    return Object.entries(totals).sort((a, b) => b[1] - a[1]);
  };

  const savingsRate = stats.totalIncome > 0 ? ((stats.balance / stats.totalIncome) * 100).toFixed(1) : 0;

  const cardStyle = { background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', padding: '32px', marginBottom: '24px' };
  const inputStyle = { width: '100%', padding: '14px 16px', border: '2px solid #E5E7EB', borderRadius: '12px', outline: 'none', fontSize: '15px', fontWeight: '500', background: 'white' };
  const labelStyle = { display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '36px', fontWeight: 'bold', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Wallet size={40} color="#667eea" /> Expense Tracker Pro
              </h1>
              <p style={{ color: '#6B7280', fontSize: '16px' }}>Manage your finances with ease</p>
            </div>
            <button onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ type: 'expense', amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] }); }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '16px 32px', borderRadius: '16px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '16px', boxShadow: '0 8px 24px rgba(102,126,234,0.4)' }}>
              {showForm ? <X size={20} /> : <Plus size={20} />} {showForm ? 'Close' : 'Add Transaction'}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          <div style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', borderRadius: '20px', padding: '28px', boxShadow: '0 10px 30px rgba(16,185,129,0.3)', color: 'white', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1 }}><TrendingUp size={120} /></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: '500', opacity: 0.9, textTransform: 'uppercase' }}>Total Income</span>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '12px' }}><TrendingUp size={24} /></div>
              </div>
              <p style={{ fontSize: '38px', fontWeight: 'bold', marginBottom: '8px' }}>₹{stats.totalIncome.toFixed(2)}</p>
              <p style={{ fontSize: '13px', opacity: 0.8 }}>↑ Total earnings</p>
            </div>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', borderRadius: '20px', padding: '28px', boxShadow: '0 10px 30px rgba(239,68,68,0.3)', color: 'white', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1 }}><TrendingDown size={120} /></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: '500', opacity: 0.9, textTransform: 'uppercase' }}>Total Expenses</span>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '12px' }}><TrendingDown size={24} /></div>
              </div>
              <p style={{ fontSize: '38px', fontWeight: 'bold', marginBottom: '8px' }}>₹{stats.totalExpenses.toFixed(2)}</p>
              <p style={{ fontSize: '13px', opacity: 0.8 }}>↓ Total spending</p>
            </div>
          </div>

          <div style={{ background: stats.balance >= 0 ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', borderRadius: '20px', padding: '28px', boxShadow: '0 10px 30px rgba(59,130,246,0.3)', color: 'white', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1 }}><IndianRupee size={120} /></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: '500', opacity: 0.9, textTransform: 'uppercase' }}>Net Balance</span>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '12px' }}><IndianRupee size={24} /></div>
              </div>
              <p style={{ fontSize: '38px', fontWeight: 'bold', marginBottom: '8px' }}>₹{stats.balance.toFixed(2)}</p>
              <p style={{ fontSize: '13px', opacity: 0.8 }}>Savings rate: {savingsRate}%</p>
            </div>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div style={cardStyle}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#1F2937' }}>{editingId ? '✏️ Edit' : '➕ Add New'} Transaction</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
              <div>
                <label style={labelStyle}>Type</label>
                <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value, category: ''})} style={{...inputStyle, cursor: 'pointer'}}>
                  <option value="expense">💸 Expense</option>
                  <option value="income">💰 Income</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Amount (₹)</label>
                <input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} style={inputStyle} placeholder="0.00" />
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} style={{...inputStyle, cursor: 'pointer'}}>
                  <option value="">Select category</option>
                  {categories[formData.type].map(cat => <option key={cat} value={cat}>{categoryIcons[cat]} {cat}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Date</label>
                <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} style={inputStyle} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Description</label>
                <input type="text" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={inputStyle} placeholder="Enter description..." />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button onClick={handleSubmit} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '14px 32px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '15px' }}>{editingId ? '💾 Update' : '✅ Add'} Transaction</button>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} style={{ background: '#E5E7EB', color: '#374151', padding: '14px 32px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: '600' }}>❌ Cancel</button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div style={{ ...cardStyle, borderRadius: '20px', padding: '24px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', flex: 1 }}>
              <div style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
                <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input type="text" placeholder="Search transactions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...inputStyle, paddingLeft: '48px' }} />
              </div>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ ...inputStyle, width: 'auto' }}>
                <option value="all">All Types</option>
                <option value="income">💰 Income</option>
                <option value="expense">💸 Expense</option>
              </select>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{ ...inputStyle, width: 'auto' }}>
                <option value="all">All Categories</option>
                {[...categories.expense, ...categories.income].map(cat => <option key={cat} value={cat}>{categoryIcons[cat]} {cat}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setView('list')} style={{ padding: '12px 16px', border: 'none', borderRadius: '12px', background: view === 'list' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#F3F4F6', color: view === 'list' ? 'white' : '#6B7280', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={18} /> List</button>
              <button onClick={() => setView('stats')} style={{ padding: '12px 16px', border: 'none', borderRadius: '12px', background: view === 'stats' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#F3F4F6', color: view === 'stats' ? 'white' : '#6B7280', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}><PieChart size={18} /> Stats</button>
            </div>
          </div>
        </div>

        {/* Transactions List / Stats */}
        <div style={cardStyle}>
          {view === 'list' ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937' }}>📋 Recent Transactions</h2>
                <span style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '8px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: '600' }}>{filteredTransactions.length} transactions</span>
              </div>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}><p style={{ color: '#6B7280' }}>Loading...</p></div>
              ) : filteredTransactions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>📊</div>
                  <p style={{ fontSize: '20px', fontWeight: '600', color: '#1F2937' }}>No transactions found</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {filteredTransactions.map(t => (
                    <div key={t._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', borderRadius: '16px', border: '2px solid', borderColor: t.type === 'income' ? '#D1FAE5' : '#FEE2E2', background: t.type === 'income' ? 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)' : 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                        <div style={{ fontSize: '28px' }}>{categoryIcons[t.category] || '📌'}</div>
                        <div>
                          <p style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '4px' }}>{t.description}</p>
                          <p style={{ fontSize: '13px', color: '#6B7280' }}>{t.category} • {new Date(t.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: '18px', fontWeight: 'bold', color: t.type === 'income' ? '#059669' : '#DC2626' }}>{t.type === 'income' ? '+' : '-'}₹{t.amount.toFixed(2)}</p>
                          <p style={{ fontSize: '12px', color: '#6B7280' }}>{t.type === 'income' ? 'Income' : 'Expense'}</p>
                        </div>
                        <button onClick={() => editTransaction(t)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', color: '#667eea' }}><Edit2 size={18} /></button>
                        <button onClick={() => deleteTransaction(t._id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', color: '#EF4444' }}><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937', marginBottom: '24px' }}>📊 Expense Breakdown by Category</h2>
              {getCategoryStats().length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}><p style={{ color: '#6B7280' }}>No expense data to display</p></div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {getCategoryStats().map(([cat, amt]) => {
                    const pct = ((amt / (stats.totalExpenses || 1)) * 100).toFixed(1);
                    return (
                      <div key={cat} style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '15px', fontWeight: '600', color: '#1F2937' }}>{categoryIcons[cat]} {cat}</span>
                          <span style={{ fontSize: '15px', fontWeight: '600', color: '#667eea' }}>₹{amt.toFixed(2)} ({pct}%)</span>
                        </div>
                        <div style={{ width: '100%', height: '12px', background: '#E5E7EB', borderRadius: '6px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;