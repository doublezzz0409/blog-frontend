import { useEffect, useState } from 'react'
import type { User, ProfileFormData, ChangePasswordParams } from '../../types'
import { getProfile, updateProfile, changePassword } from '../../services'
import LoadingSpinner from '../../components/LoadingSpinner'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'

type AsyncState = 'loading' | 'empty' | 'error' | 'ready'

export default function ProfilePage() {
  const [state, setState] = useState<AsyncState>('loading')
  const [user, setUser] = useState<User | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const [form, setForm] = useState<ProfileFormData>({ nickname: '', avatar: '', email: '', bio: '' })
  const [pwForm, setPwForm] = useState<ChangePasswordParams>({ oldPassword: '', newPassword: '' })
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState('')

  const fetchData = async () => {
    setState('loading')
    try {
      const res = await getProfile()
      if (res.code === 200) {
        if (!res.data || (!res.data.nickname && !res.data.email)) {
          setState('empty')
        } else {
          setUser(res.data)
          setForm({ nickname: res.data.nickname, avatar: res.data.avatar, email: res.data.email, bio: res.data.bio })
          setState('ready')
        }
      } else {
        setErrorMsg(res.message)
        setState('error')
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : '加载失败')
      setState('error')
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccessMsg('')
    try {
      const res = await updateProfile(form)
      if (res.code === 200) {
        setUser(res.data)
        setSuccessMsg('个人信息已更新')
        setTimeout(() => setSuccessMsg(''), 3000)
      }
    } catch {
      alert('更新失败')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwError('')
    setPwSuccess('')
    try {
      const res = await changePassword(pwForm)
      if (res.code === 200) {
        setPwSuccess('密码已修改')
        setPwForm({ oldPassword: '', newPassword: '' })
        setTimeout(() => setPwSuccess(''), 3000)
      } else {
        setPwError(res.message)
      }
    } catch (err) {
      setPwError(err instanceof Error ? err.message : '修改失败')
    }
  }

  if (state === 'loading') return <LoadingSpinner />
  if (state === 'empty') return <EmptyState message="暂无个人信息" />
  if (state === 'error') return <ErrorState message={errorMsg} onRetry={fetchData} />

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">个人信息</h1>

      {/* 个人信息表单 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <img src={user!.avatar} alt={user!.nickname} className="w-16 h-16 rounded-full object-cover" />
          <div>
            <p className="font-medium text-gray-900">{user!.username}</p>
            <p className="text-sm text-gray-500">用户名不可修改</p>
          </div>
        </div>

        {successMsg && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">{successMsg}</div>
        )}

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">昵称</label>
            <input type="text" value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">头像 URL</label>
            <input type="text" value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">简介</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {saving ? '保存中...' : '保存'}
          </button>
        </form>
      </div>

      {/* 修改密码 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">修改密码</h2>

        {pwError && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">{pwError}</div>}
        {pwSuccess && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">{pwSuccess}</div>}

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">原密码</label>
            <input type="password" value={pwForm.oldPassword} onChange={(e) => setPwForm({ ...pwForm, oldPassword: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">新密码</label>
            <input type="password" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <button type="submit" className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors">
            修改密码
          </button>
        </form>
      </div>
    </div>
  )
}
