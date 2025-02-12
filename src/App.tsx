import '@/App.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import MountainTrailsMap from '@/components/MountainMap'
import Header from '@/components/Navbar'
import Statistics from '@/components/Statistics'
import Register from './components/Register'
import { AuthProvider } from './context/authContext'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Header />}>
      <Route index element={<MountainTrailsMap />} />
      <Route path='/stats' element={<Statistics />} />
      <Route path='/register' element={<Register />} />
    </Route>
  )
)
function App() {

  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  )
}

export default App
