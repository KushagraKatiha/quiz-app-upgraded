import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import SignUpPage from './Components/SignUpPage.jsx'
import Dashboard from './Components/Dashboard.jsx'
import AttemptQuizPage from './Components/StudentComponents/AttemptQuizPage.jsx'
import QuizPage from './Components/StudentComponents/QuizPage.jsx'
import ResultPage from './Components/ResultPage.jsx'
import ResetPassword from './Components/ResetPassword.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<SignUpPage />} />
      <Route path='/dashboard' element={<Dashboard/>} />
      <Route path='/take-test' element={<AttemptQuizPage/>} />
      <Route path='/take-test/:subject/:teacherName' element={<QuizPage />} />
      <Route path='/get-result' element={<ResultPage />} />
      <Route path='/reset-password/:forgetPasswordToken' element={<ResetPassword />} />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
