import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

const FluidMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    
    meshRef.current.position.y = Math.sin(time * 0.5) * 0.4;
    
    meshRef.current.rotation.y += 0.003;
    meshRef.current.rotation.x += 0.002;
    
    const targetX = (state.pointer.x * Math.PI) / 8;
    const targetY = (state.pointer.y * Math.PI) / 8;
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, meshRef.current.rotation.y + targetX, 0.01);
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, meshRef.current.rotation.x - targetY, 0.01);
  });

  return (
    <mesh ref={meshRef} scale={[2.8, 2.8, 2.8]}>
<icosahedronGeometry args={[1, 4]} />
<MeshDistortMaterial 
        color="#0ea5e9"
        emissive="#0284c7"
        emissiveIntensity={0.2}
        distort={0.3} 
        speed={1.5} 
        roughness={0.2} 
        metalness={0.9}
        wireframe={true}
        wireframeLinewidth={2}
      />
    </mesh>
  );
};

export const HeroThreeScene = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={1.5} color="#ffffff" />
        <directionalLight position={[10, 10, 5]} intensity={3} color="#bae6fd" />
        <directionalLight position={[-10, -10, -5]} intensity={2} color="#0284c7" />
        <FluidMesh />
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
};
