import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import SignUpPage from './Components/SignUpPage.jsx'
import Dashboard from './Components/Dashboard.jsx'
import UpdateProfilePage from './Components/UpdateProfilePage.jsx'
import ForgetPasswordPage from './Components/ForgetPasswordPage.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<SignUpPage />} />
      <Route path='/dashboard' element={<Dashboard/>} />
      <Route path='/forget-password' element={<ForgetPasswordPage/>} />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
