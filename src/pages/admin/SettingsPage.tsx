import { useEffect, useState } from 'react'
import type { SiteSettings } from '../../types'
import { getAdminSettings, updateSettings } from '../../services'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorState from '../../components/ErrorState'

type AsyncState = 'loading' | 'error' | 'ready'

export default function SettingsPage() {
  const [state, setState] = useState<AsyncState>('loading')
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const fetchData = async () => {
    setState('loading')
    try {
      const res = await getAdminSettings()
      if (res.code === 200) {
        setSettings(res.data)
        setState('ready')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!settings) return
    setSaving(true)
    setSuccessMsg('')
    try {
      const res = await updateSettings(settings)
      if (res.code === 200) {
        setSuccessMsg('设置已保存')
        setTimeout(() => setSuccessMsg(''), 3000)
      } else {
        alert(res.message)
      }
    } catch {
      alert('保存失败')
    } finally {
      setSaving(false)
    }
  }

  const update = (field: keyof SiteSettings, value: string | number) => {
    setSettings((prev) => prev ? { ...prev, [field]: value } : prev)
  }

  const updateSocial = (field: keyof SiteSettings['socialLinks'], value: string) => {
    setSettings((prev) => prev ? { ...prev, socialLinks: { ...prev.socialLinks, [field]: value } } : prev)
  }

  if (state === 'loading') return <LoadingSpinner />
  if (state === 'error') return <ErrorState message={errorMsg} onRetry={fetchData} />

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">站点设置</h1>

      {successMsg && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">{successMsg}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">站点名称</label>
          <input type="text" value={settings!.siteName} onChange={(e) => update('siteName', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">站点描述</label>
          <textarea value={settings!.siteDescription} onChange={(e) => update('siteDescription', e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
          <input type="text" value={settings!.logo} onChange={(e) => update('logo', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">页脚文字</label>
          <input type="text" value={settings!.footerText} onChange={(e) => update('footerText', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">每页文章数</label>
          <input type="number" value={settings!.postsPerPage} onChange={(e) => update('postsPerPage', Number(e.target.value))} className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <fieldset className="border border-gray-200 rounded-lg p-4">
          <legend className="text-sm font-medium text-gray-700 px-2">社交链接</legend>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">GitHub</label>
              <input type="text" value={settings!.socialLinks.github} onChange={(e) => updateSocial('github', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Twitter</label>
              <input type="text" value={settings!.socialLinks.twitter} onChange={(e) => updateSocial('twitter', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Email</label>
              <input type="text" value={settings!.socialLinks.email} onChange={(e) => updateSocial('email', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? '保存中...' : '保存设置'}
        </button>
      </form>
    </div>
  )
}
