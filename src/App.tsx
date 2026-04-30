import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'
import HomePage from './pages/HomePage'
import ArticlePage from './pages/ArticlePage'
import CategoriesPage from './pages/CategoriesPage'
import TagsPage from './pages/TagsPage'
import ArchivePage from './pages/ArchivePage'
import AboutPage from './pages/AboutPage'
import LoginPage from './pages/admin/LoginPage'
import DashboardPage from './pages/admin/DashboardPage'
import ArticleListPage from './pages/admin/ArticleListPage'
import ArticleEditPage from './pages/admin/ArticleEditPage'
import CategoryManagePage from './pages/admin/CategoryManagePage'
import TagManagePage from './pages/admin/TagManagePage'
import CommentManagePage from './pages/admin/CommentManagePage'
import SettingsPage from './pages/admin/SettingsPage'
import ProfilePage from './pages/admin/ProfilePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 公开路由 */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/article/:slug" element={<ArticlePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/tags" element={<TagsPage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>

        {/* 管理登录（无布局） */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* 管理路由（需认证） */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="/admin/articles" element={<ArticleListPage />} />
          <Route path="/admin/articles/:id" element={<ArticleEditPage />} />
          <Route path="/admin/categories" element={<CategoryManagePage />} />
          <Route path="/admin/tags" element={<TagManagePage />} />
          <Route path="/admin/comments" element={<CommentManagePage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
          <Route path="/admin/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
