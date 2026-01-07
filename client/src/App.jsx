import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import WriteArticle from './pages/WriteArticle'
import BlogTitles from './pages/BlogTitles'
import GenerateImages from './pages/GenerateImages'
import RemoveBackground from './pages/RemoveBackground'
import RemoveObject from './pages/RemoveObject'
import ReviewResume from './pages/ReviewResume'
import Community from './pages/Community'
import { useAuth } from '@clerk/clerk-react'

const App = () => {
  const { getToken } = useAuth()
  const [authToken, setAuthToken] = useState(null)

  useEffect(() => {
    getToken().then((token) => {
      console.log(token)
      setAuthToken(token)
    }).catch((error) => {
      console.error('Error getting token:', error)
    })
  }, [getToken])

  // Utility function for authenticated API calls (pass to child components via context or props)
  const makeAuthenticatedRequest = async (url, options = {}) => {
    if (!authToken) {
      throw new Error('No auth token available')
    }
    const headers = {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
    return fetch(url, { ...options, headers })
  }

  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/ai' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='write-article' element={<WriteArticle makeAuthenticatedRequest={makeAuthenticatedRequest} />} />
          <Route path='blog-titles' element={<BlogTitles makeAuthenticatedRequest={makeAuthenticatedRequest} />} />
          <Route path='generate-images' element={<GenerateImages makeAuthenticatedRequest={makeAuthenticatedRequest} />} />
          <Route path='remove-background' element={<RemoveBackground makeAuthenticatedRequest={makeAuthenticatedRequest} />} />
          <Route path='remove-object' element={<RemoveObject makeAuthenticatedRequest={makeAuthenticatedRequest} />} />
          <Route path='review-resume' element={<ReviewResume makeAuthenticatedRequest={makeAuthenticatedRequest} />} />
          <Route path='community' element={<Community makeAuthenticatedRequest={makeAuthenticatedRequest} />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App