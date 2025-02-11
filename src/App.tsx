import '@/App.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import MountainTrailsMap from '@/components/MountainMap'
import Header from '@/components/Header'
import Statistics from '@/components/Statistics'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Header />}>
      <Route index element={<MountainTrailsMap />} />
      <Route path='/stats' element={<Statistics />} />
    </Route>
  )
)
function App() {

  return (
    <>
      <RouterProvider router={router} />      
    </>
  )
}

export default App
