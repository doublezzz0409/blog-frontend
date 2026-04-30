import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { Category, Tag, SiteSettings } from '../types'
import { getCategories, getTags, getSiteSettings } from '../services'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

export default function PublicLayout() {
  const navigate = useNavigate()
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])

  useEffect(() => {
    getSiteSettings().then((res) => {
      if (res.code === 200) setSettings(res.data)
    })
    getCategories().then((res) => {
      if (res.code === 200) setCategories(res.data)
    })
    getTags().then((res) => {
      if (res.code === 200) setTags(res.data)
    })
  }, [])

  const handleSearch = (keyword: string) => {
    if (keyword.trim()) {
      navigate(`/?keyword=${encodeURIComponent(keyword)}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        siteName={settings?.siteName || '博客'}
        onSearch={handleSearch}
      />
      <div className="max-w-6xl mx-auto px-4 py-8 flex gap-8">
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
        <Sidebar categories={categories} tags={tags} />
      </div>
      <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-400">
        {settings?.footerText || ''}
      </footer>
    </div>
  )
}
