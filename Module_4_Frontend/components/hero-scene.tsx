"use client";

import { useRef, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles, Stars } from "@react-three/drei";
import * as THREE from "three";

/**
 * Gentle mouse-parallax rig + slow idle drift for the whole scene.
 */
function Rig({ children }: { children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const { x, y } = state.pointer;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, x * 0.35, 0.04);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -y * 0.2, 0.04);
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.12;
  });

  return <group ref={ref}>{children}</group>;
}

function SpinningRing({
  position,
  scale = 1,
  color = "#818cf8",
  speed = 0.4,
}: {
  position: [number, number, number];
  scale?: number;
  color?: string;
  speed?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * speed * 0.6;
    ref.current.rotation.y += delta * speed;
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <torusGeometry args={[1, 0.32, 24, 80]} />
      <meshStandardMaterial color={color} roughness={0.25} metalness={0.7} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 5, 6]} intensity={1.4} color="#c7d2fe" />
      <directionalLight position={[-6, -3, -4]} intensity={0.7} color="#f0abfc" />
      <pointLight position={[4, 3, 4]} intensity={30} color="#818cf8" />

      <Rig>
        {/* Hero gem — large distorted icosahedron, right of center */}
        <Float speed={1.6} rotationIntensity={0.5} floatIntensity={1.1}>
          <mesh position={[2.9, 0.1, -0.5]} scale={1.7}>
            <icosahedronGeometry args={[1, 1]} />
            <MeshDistortMaterial
              color="#6366f1"
              roughness={0.2}
              metalness={0.65}
              distort={0.38}
              speed={1.8}
            />
          </mesh>
        </Float>

        {/* Orbiting ring */}
        <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.8}>
          <SpinningRing position={[2.9, 0.1, -0.5]} scale={2.15} color="#a5b4fc" speed={0.35} />
        </Float>

        {/* Companion shapes */}
        <Float speed={2} rotationIntensity={0.9} floatIntensity={1.4}>
          <mesh position={[-3.4, 1.7, -1.5]} scale={0.55}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#e879f9" roughness={0.3} metalness={0.6} />
          </mesh>
        </Float>

        <Float speed={1.4} rotationIntensity={0.7} floatIntensity={1.2}>
          <mesh position={[-2.7, -1.6, -1]} scale={0.4}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.3} metalness={0.6} />
          </mesh>
        </Float>

        <Float speed={1.8} rotationIntensity={0.5} floatIntensity={1}>
          <mesh position={[0.4, 2.1, -2.5]} scale={0.3}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#a78bfa" roughness={0.3} metalness={0.6} />
          </mesh>
        </Float>

        {/* Particle layers */}
        <Sparkles count={90} scale={[12, 7, 6]} size={3} speed={0.35} color="#a5b4fc" opacity={0.7} />
        <Sparkles count={40} scale={[10, 6, 5]} size={5} speed={0.25} color="#f0abfc" opacity={0.5} />
      </Rig>

      <Stars radius={60} depth={25} count={1400} factor={3.2} saturation={0} fade speed={0.6} />
    </>
  );
}

export function HeroScene() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 9], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Scene />
      </Canvas>
      {/* Legibility gradient: keeps headline readable over the 3D art */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/70 to-slate-900/10" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-900 to-transparent" />
    </div>
  );
}
