import { useState, useEffect } from 'react'

const styles = {
    container: {
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '24px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    header: {
        marginBottom: '32px',
    },
    h1: {
        color: '#1a202c',
        marginBottom: '8px',
    },
    subtitle: {
        color: '#718096',
        fontSize: '14px',
    },
    formSection: {
        backgroundColor: '#f7fafc',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '32px',
        border: '1px solid #e2e8f0',
    },
    formTitle: {
        marginTop: 0,
        marginBottom: '16px',
        color: '#1a202c',
    },
    formGroup: {
        marginBottom: '16px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        color: '#1a202c',
        fontWeight: '500',
        fontSize: '14px',
    },
    input: {
        width: '100%',
        padding: '8px 12px',
        borderRadius: '4px',
        border: '1px solid #cbd5e0',
        fontSize: '14px',
        boxSizing: 'border-box',
    },
    buttonGroup: {
        display: 'flex',
        gap: '12px',
        marginTop: '16px',
    },
    button: {
        padding: '8px 16px',
        borderRadius: '4px',
        border: 'none',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    buttonPrimary: {
        backgroundColor: '#3182ce',
        color: 'white',
    },
    buttonSecondary: {
        backgroundColor: '#e2e8f0',
        color: '#1a202c',
    },
    buttonDanger: {
        backgroundColor: '#e53e3e',
        color: 'white',
    },
    buttonSuccess: {
        backgroundColor: '#38a169',
        color: 'white',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        overflow: 'hidden',
    },
    thead: {
        backgroundColor: '#edf2f7',
        borderBottom: '2px solid #cbd5e0',
    },
    th: {
        padding: '12px',
        textAlign: 'left',
        fontWeight: '600',
        color: '#1a202c',
        fontSize: '14px',
    },
    td: {
        padding: '12px',
        borderBottom: '1px solid #e2e8f0',
        fontSize: '14px',
    },
    tr: {
        transition: 'background-color 0.2s',
    },
    trHover: {
        backgroundColor: '#f7fafc',
    },
    actions: {
        display: 'flex',
        gap: '8px',
    },
    alert: {
        padding: '12px',
        borderRadius: '4px',
        marginBottom: '16px',
        fontSize: '14px',
    },
    alertSuccess: {
        backgroundColor: '#c6f6d5',
        color: '#22543d',
        border: '1px solid #9ae6b4',
    },
    alertError: {
        backgroundColor: '#fed7d7',
        color: '#742a2a',
        border: '1px solid #fc8181',
    },
    emptyState: {
        textAlign: 'center',
        padding: '40px 20px',
        color: '#718096',
    },
}

export default function Home() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [editingId, setEditingId] = useState(null)
    const [formData, setFormData] = useState({ name: '', email: '' })

    // Fetch users on mount
    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/users')
            if (!res.ok) throw new Error('Failed to fetch users')
            const data = await res.json()
            setUsers(data)
            setError('')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.name.trim() || !formData.email.trim()) {
            setError('Name and email are required')
            return
        }

        try {
            if (editingId) {
                // Update
                const res = await fetch(`/api/users/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                })
                if (!res.ok) {
                    const errorData = await res.json()
                    throw new Error(errorData.message || 'Failed to update user')
                }
                setSuccess('User updated successfully')
                setEditingId(null)
            } else {
                // Create
                const res = await fetch('/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                })
                if (!res.ok) {
                    const errorData = await res.json()
                    throw new Error(errorData.message || 'Failed to create user')
                }
                setSuccess('User created successfully')
            }

            setFormData({ name: '', email: '' })
            await fetchUsers()
            setTimeout(() => setSuccess(''), 3000)
        } catch (err) {
            console.error('Submit error:', err)
            setError(err.message)
            setTimeout(() => setError(''), 5000)
        }
    }

    const handleEdit = (user) => {
        setEditingId(user.id)
        setFormData({ name: user.name, email: user.email })
    }

    const handleDelete = async (id) => {
        if (!confirm('সত্যি delete করবেন?')) return

        try {
            const res = await fetch(`/api/users/${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Failed to delete user')
            setSuccess('User deleted successfully')
            await fetchUsers()
            setTimeout(() => setSuccess(''), 3000)
        } catch (err) {
            setError(err.message)
            setTimeout(() => setError(''), 3000)
        }
    }

    const handleCancel = () => {
        setEditingId(null)
        setFormData({ name: '', email: '' })
    }

    return (
        <main style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.h1}>📊 User Dashboard</h1>
                <p style={styles.subtitle}>Next.js + Prisma + MySQL — Complete CRUD Example</p>
            </div>

            {/* Alerts */}
            {error && <div style={{ ...styles.alert, ...styles.alertError }}>{error}</div>}
            {success && <div style={{ ...styles.alert, ...styles.alertSuccess }}>{success}</div>}

            {/* Create/Edit Form */}
            <div style={styles.formSection}>
                <h2 style={styles.formTitle}>
                    {editingId ? `✏️ Edit User (ID: ${editingId})` : '➕ New User'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Name</label>
                        <input
                            style={styles.input}
                            type="text"
                            name="name"
                            placeholder="e.g., John, Sarah..."
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            style={styles.input}
                            type="email"
                            name="email"
                            placeholder="e.g., rafi@example.com"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div style={styles.buttonGroup}>
                        <button
                            type="submit"
                            style={{ ...styles.button, ...styles.buttonPrimary }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#2c5aa0'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#3182ce'}
                        >
                            {editingId ? 'Update' : 'Create'}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={handleCancel}
                                style={{ ...styles.button, ...styles.buttonSecondary }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#cbd5e0'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#e2e8f0'}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Users Table */}
            <div>
                <h2 style={{ marginTop: 0, color: '#1a202c' }}>
                    👥 All Users ({users.length})
                </h2>

                {loading ? (
                    <div style={styles.emptyState}>Loading...</div>
                ) : users.length === 0 ? (
                    <div style={styles.emptyState}>
                        <p>No users yet. Add a user using the form above!</p>
                    </div>
                ) : (
                    <table style={styles.table}>
                        <thead style={styles.thead}>
                            <tr>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>Name</th>
                                <th style={styles.th}>Email</th>
                                <th style={styles.th}>Created</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} style={styles.tr} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f7fafc'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                                    <td style={styles.td}>{user.id}</td>
                                    <td style={styles.td}><strong>{user.name}</strong></td>
                                    <td style={styles.td}>{user.email}</td>
                                    <td style={styles.td}>
                                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </td>
                                    <td style={styles.td}>
                                        <div style={styles.actions}>
                                            <button
                                                onClick={() => handleEdit(user)}
                                                style={{ ...styles.button, ...styles.buttonSuccess, padding: '6px 12px' }}
                                                onMouseOver={(e) => e.target.style.backgroundColor = '#2f855a'}
                                                onMouseOut={(e) => e.target.style.backgroundColor = '#38a169'}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                style={{ ...styles.button, ...styles.buttonDanger, padding: '6px 12px' }}
                                                onMouseOver={(e) => e.target.style.backgroundColor = '#c53030'}
                                                onMouseOut={(e) => e.target.style.backgroundColor = '#e53e3e'}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </main>
    )
}
