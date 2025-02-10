import './App.css'
import Banner from './components/Banner'
import MountainTrailsMap from './components/MountainMap'
import Navbar from './components/Navbar'

function App() {

  return (
    <div style={{ height: '100vh' }}>
      <Banner />
      <Navbar />
      <MountainTrailsMap/>
      <footer style={{color: 'white', justifySelf: 'center', padding: 10}}>Udanych wędrówek</footer>
    </div>
  )
}

export default App
