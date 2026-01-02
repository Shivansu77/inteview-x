import React, { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls, ContactShadows } from '@react-three/drei'
import { Model as MyAvatar } from './MyAvatar'
import './App.css'

function App() {
  const [avatarUrl, setAvatarUrl] = useState('/models/myAvatar.glb')

  const toggleAvatar = () => {
    setAvatarUrl((prev) =>
      prev === '/models/myAvatar.glb' ? '/models/avatar2.glb' : '/models/myAvatar.glb'
    )
  }

  return (
    <>
      <div className="ui-controls">
        <button onClick={toggleAvatar}>
          Switch Character ({avatarUrl.includes('myAvatar') ? 'Avatar 1' : 'Avatar 2'})
        </button>
      </div>

      <Canvas shadows camera={{ position: [0, 1.5, 4], fov: 40 }}>
        {/* Basic Lighting setup */}
        <ambientLight intensity={0.7} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-mapSize={[512, 512]} castShadow />
        <directionalLight position={[-5, 5, 5]} intensity={0.5} />

        {/* Background color */}
        <color attach="background" args={['#202025']} />

        {/* Model */}
        <Suspense fallback={null}>
          <group position={[0, -1, 0]}>
            <MyAvatar key={avatarUrl} modelUrl={avatarUrl} />
          </group>
          <ContactShadows resolution={1024} scale={50} blur={2} opacity={0.5} far={10} color="#000000" />
        </Suspense>

        {/* Controls */}
        <OrbitControls target={[0, 1, 0]} />
      </Canvas>
    </>
  )
}

export default App
