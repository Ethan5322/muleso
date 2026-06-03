'use client';

import { Suspense, useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function HeroScene() {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  // Particles
  const particlesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const count = 1200;
    const positionArray = new Float32Array(count * 3);
    const colorArray = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positionArray[i] = (Math.random() - 0.5) * 80;
      positionArray[i + 1] = (Math.random() - 0.5) * 80;
      positionArray[i + 2] = (Math.random() - 0.5) * 80;

      const isBlue = Math.random() > 0.5;
      if (isBlue) {
        colorArray[i] = 0; colorArray[i + 1] = 0.78; colorArray[i + 2] = 1;
      } else {
        colorArray[i] = 0.48; colorArray[i + 1] = 0.18; colorArray[i + 2] = 1;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    return geometry;
  }, []);

  const particlesMaterial = useMemo(
    () => new THREE.PointsMaterial({
      size: 0.2,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6,
      vertexColors: true,
    }),
    []
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state: any) => {
    if (groupRef.current) {
      setMouse(prev => ({
        x: prev.x + (target.current.x - prev.x) * 0.05,
        y: prev.y + (target.current.y - prev.y) * 0.05,
      }));
      groupRef.current.rotation.x = mouse.y * 0.15;
      groupRef.current.rotation.y = mouse.x * 0.15;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.x += state.delta * 0.01;
      particlesRef.current.rotation.y += state.delta * 0.015;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color={0x00c8ff} />
      <pointLight position={[-10, -10, 10]} intensity={1} color={0x7b2fff} />

      {/* Background Particles */}
      <points ref={particlesRef} geometry={particlesGeometry} material={particlesMaterial} />

      {/* Main Scene Group */}
      <group ref={groupRef}>
        {/* Skeleton */}
        <group position={[-8, -2, 0]}>
          {/* Skull */}
          <mesh position={[0, 2, 0]}>
            <sphereGeometry args={[1.2, 32, 32]} />
            <meshStandardMaterial
              color={0x00c8ff}
              emissive={0x00c8ff}
              emissiveIntensity={0.3}
            />
          </mesh>

          {/* Jaw */}
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[1.8, 0.5, 1]} />
            <meshStandardMaterial
              color={0x00c8ff}
              emissive={0x00c8ff}
              emissiveIntensity={0.2}
            />
          </mesh>

          {/* Spine */}
          <group position={[0, 0, 0]}>
            {Array.from({ length: 5 }).map((_, i) => (
              <mesh key={i} position={[0, -0.8 - i * 0.6, 0]}>
                <sphereGeometry args={[0.35, 16, 16]} />
                <meshStandardMaterial
                  color={0x00c8ff}
                  emissive={0x00c8ff}
                  emissiveIntensity={0.2}
                />
              </mesh>
            ))}
          </group>

          {/* Ribcage */}
          <mesh position={[0, -1.5, 0]}>
            <boxGeometry args={[1.5, 2, 1.2]} />
            <meshBasicMaterial wireframe color={0x00c8ff} transparent opacity={0.4} />
          </mesh>
        </group>

        {/* Brain with Neural Network */}
        <group position={[-8, 3.5, 0]}>
          {/* Brain Sphere */}
          <mesh>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial
              color={0x00c8ff}
              emissive={0x00c8ff}
              emissiveIntensity={0.5}
              metalness={0.6}
              roughness={0.2}
            />
          </mesh>

          {/* Neural Network Nodes */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const x = Math.cos(angle) * 1.3;
            const y = Math.sin(angle) * 1.3;
            return (
              <mesh key={i} position={[x, y, 0]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial
                  color={0x7b2fff}
                  emissive={0x7b2fff}
                  emissiveIntensity={0.6}
                />
              </mesh>
            );
          })}
        </group>

        {/* Orbital Rings */}
        <group position={[-8, 3.5, 0]}>
          {[0, Math.PI / 3, (2 * Math.PI) / 3].map((rotation, i) => (
            <group key={i} rotation={[rotation, 0, 0]}>
              <mesh>
                <torusGeometry args={[2, 0.1, 16, 100]} />
                <meshBasicMaterial color={0x00c8ff} opacity={0.3} transparent />
              </mesh>
            </group>
          ))}
        </group>

        {/* Wireframe Globe */}
        <group position={[8, 0, 0]}>
          <mesh>
            <sphereGeometry args={[2, 32, 32]} />
            <meshBasicMaterial wireframe color={0x00c8ff} opacity={0.4} transparent />
          </mesh>

          {/* Globe Glow */}
          <mesh scale={1.05}>
            <sphereGeometry args={[2, 32, 32]} />
            <meshBasicMaterial wireframe color={0x7b2fff} opacity={0.2} transparent />
          </mesh>
        </group>
      </group>
    </>
  );
}

export default function HeroBackground() {
  return (
    <div className="fixed top-0 left-0 w-full h-screen -z-10">
      <Suspense fallback={<div className="w-full h-full" style={{ background: '#020818' }} />}>
        <Canvas camera={{ position: [0, 0, 25], fov: 60 }} style={{ background: '#020818' }}>
          <HeroScene />
        </Canvas>
      </Suspense>
    </div>
  );
}
