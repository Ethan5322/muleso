'use client';

import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion } from 'framer-motion';

function OrbScene() {
  const sphereRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);

  useFrame((state: any) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += state.delta * (isHovered ? 0.8 : 0.4);
      sphereRef.current.rotation.x += state.delta * (isHovered ? 0.3 : 0.15);
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.y -= state.delta * 0.3;
      wireframeRef.current.rotation.x += state.delta * 0.1;
    }
  });

  return (
    <>
      <pointLight position={[0, 0, 2]} intensity={2} color="#00C8FF" />

      {/* Main sphere */}
      <mesh
        ref={sphereRef}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
      >
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial
          color="#00C8FF"
          emissive="#00C8FF"
          emissiveIntensity={isHovered ? 0.8 : 0.3}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh ref={wireframeRef} scale={2.1}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial wireframe color="#00C8FF" transparent opacity={0.2} />
      </mesh>
    </>
  );
}

export default function FloatingOrb() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="w-96 h-96 rounded-full"
    >
      <Suspense fallback={<div className="w-full h-full bg-[var(--bg-card)] rounded-full" />}>
        <Canvas camera={{ position: [0, 0, 5] }} style={{ background: 'transparent' }}>
          <OrbScene />
        </Canvas>
      </Suspense>
    </motion.div>
  );
}
