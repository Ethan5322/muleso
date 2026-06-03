'use client';

import { Suspense, useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function TechBackground() {
  const particlesRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Create floating particles
  const particlesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const count = isMobile ? 500 : 2000;
    const positionArray = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positionArray[i] = (Math.random() - 0.5) * 50;
      positionArray[i + 1] = (Math.random() - 0.5) * 50;
      positionArray[i + 2] = (Math.random() - 0.5) * 50;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
    return geometry;
  }, [isMobile]);

  const particlesMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.15,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8,
        color: 0x00c8ff,
      }),
    []
  );

  useFrame((state: any) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.x += state.delta * 0.02;
      particlesRef.current.rotation.y += state.delta * 0.03;
    }
    if (groupRef.current) {
      groupRef.current.rotation.z += state.delta * 0.01;
    }
  });

  return (
    <>
      {/* Enhanced Lighting */}
      <ambientLight intensity={0.6} color={0x00c8ff} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color={0x00c8ff} />
      <pointLight position={[-10, -10, 10]} intensity={1} color={0x7b2fff} />
      <pointLight position={[0, 0, -15]} intensity={0.8} color={0xe8b84b} />

      {/* Floating Particles */}
      <points ref={particlesRef} geometry={particlesGeometry} material={particlesMaterial} />

      {/* Dynamic Geometric Shapes */}
      <group ref={groupRef}>
        {/* Glowing Torus 1 */}
        <mesh position={[5, 5, -8]} rotation={[0.5, 0.5, 0]}>
          <torusGeometry args={[2, 0.6, 16, 100]} />
          <meshPhongMaterial
            color={0x00c8ff}
            emissive={0x00c8ff}
            emissiveIntensity={0.4}
            wireframe={false}
          />
        </mesh>

        {/* Glowing Octahedron */}
        <mesh position={[-6, 4, -10]}>
          <octahedronGeometry args={[2]} />
          <meshPhongMaterial
            color={0x7b2fff}
            emissive={0x7b2fff}
            emissiveIntensity={0.3}
            wireframe={false}
          />
        </mesh>

        {/* Glowing Torus 2 */}
        <mesh position={[0, -5, -12]} rotation={[1, 0.5, 0.5]}>
          <torusGeometry args={[2.5, 0.5, 16, 100]} />
          <meshPhongMaterial
            color={0xe8b84b}
            emissive={0xe8b84b}
            emissiveIntensity={0.3}
            wireframe={false}
          />
        </mesh>

        {/* Glowing Sphere */}
        <mesh position={[7, -6, -15]}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshPhongMaterial
            color={0x00ff88}
            emissive={0x00ff88}
            emissiveIntensity={0.3}
            wireframe={false}
          />
        </mesh>

        {/* Wireframe Icosahedron */}
        <mesh position={[-8, -7, -8]}>
          <icosahedronGeometry args={[2.2]} />
          <meshBasicMaterial wireframe color={0x00c8ff} linewidth={1} />
        </mesh>
      </group>

      {/* Animated Helix */}
      <group position={[0, 0, -10]}>
        {Array.from({ length: 20 }).map((_, i) => {
          const angle = (i / 20) * Math.PI * 4;
          const x = Math.cos(angle) * 3;
          const y = (i / 20) * 8 - 4;
          const z = Math.sin(angle) * 3;

          return (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshPhongMaterial
                color={0x00c8ff}
                emissive={0x00c8ff}
                emissiveIntensity={0.4}
              />
            </mesh>
          );
        })}
      </group>
    </>
  );
}

export default function ThreeBackground() {
  return (
    <div className="fixed top-0 left-0 w-full h-screen -z-10">
      <Suspense
        fallback={
          <div className="w-full h-full bg-gradient-to-b from-[var(--bg-primary)] via-[rgba(123,47,255,0.1)] to-[var(--bg-primary)]" />
        }
      >
        <Canvas
          camera={{ position: [0, 0, 15], fov: 75 }}
          style={{
            background: 'linear-gradient(135deg, #050810 0%, #0A0F1E 50%, #050810 100%)',
          }}
        >
          <TechBackground />
        </Canvas>
      </Suspense>
    </div>
  );
}
