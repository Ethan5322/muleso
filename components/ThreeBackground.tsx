'use client';

import { Suspense, useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Wireframe } from '@react-three/drei';
import * as THREE from 'three';

function Particles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const particleCount = isMobile ? 800 : 3000;

  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, () => ({
      position: [
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
      ] as [number, number, number],
      size: Math.random() * 0.02 + 0.01,
      color: Math.random() < 0.7 ? 0x00c8ff : 0x7b2fff,
    }));
  }, [particleCount]);

  useFrame((state: any) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += state.delta * 0.03;
    meshRef.current.rotation.x += state.delta * 0.01;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[new THREE.SphereGeometry(0.02, 8, 8), new THREE.MeshStandardMaterial(), particleCount]}
    >
      {particles.map((particle, i) => {
        const matrix = new THREE.Matrix4();
        matrix.setPosition(...particle.position);
        meshRef.current?.setMatrixAt(i, matrix);
        return null;
      })}
    </instancedMesh>
  );
}

function GeometricShapes() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state: any) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z += state.delta * 0.02;
  });

  return (
    <group ref={groupRef}>
      {/* Octahedron */}
      <mesh position={[4, 2, -5]}>
        <octahedronGeometry args={[1.5]} />
        <meshBasicMaterial wireframe color={0x00c8ff} />
      </mesh>

      {/* Torus */}
      <mesh position={[-5, -1, -8]} rotation={[0.5, 0.5, 0]}>
        <torusGeometry args={[1.2, 0.4, 16, 100]} />
        <meshBasicMaterial wireframe color={0x7b2fff} />
      </mesh>

      {/* Icosahedron */}
      <mesh position={[0, -4, -6]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial wireframe color={0xe8b84b} />
      </mesh>
    </group>
  );
}

function MouseParallax({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    setMouse((prev) => ({
      x: prev.x + (target.current.x - prev.x) * 0.05,
      y: prev.y + (target.current.y - prev.y) * 0.05,
    }));
    groupRef.current.rotation.x = mouse.y * 0.08;
    groupRef.current.rotation.y = mouse.x * 0.08;
  });

  return <group ref={groupRef}>{children}</group>;
}

function SceneContent() {
  return (
    <MouseParallax>
      <Particles />
      <GeometricShapes />
    </MouseParallax>
  );
}

export default function ThreeBackground() {
  return (
    <div className="fixed top-0 left-0 w-full h-screen -z-10">
      <Suspense
        fallback={
          <div className="w-full h-full bg-[var(--bg-primary)] opacity-100" />
        }
      >
        <Canvas camera={{ position: [0, 0, 8] }} style={{ background: 'var(--bg-primary)' }}>
          <SceneContent />
        </Canvas>
      </Suspense>
    </div>
  );
}
