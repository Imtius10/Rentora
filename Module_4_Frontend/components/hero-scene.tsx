"use client";

import { useRef, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, Stars } from "@react-three/drei";
import * as THREE from "three";

/**
 * Gentle mouse-parallax rig + slow idle drift for the whole scene.
 */
function Rig({ children }: { children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const { x, y } = state.pointer;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, x * 0.3, 0.04);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -y * 0.15, 0.04);
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
  });

  return <group ref={ref}>{children}</group>;
}

function Tree({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 0.36, 10]} />
        <meshStandardMaterial color="#92400e" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <coneGeometry args={[0.34, 0.62, 10]} />
        <meshStandardMaterial color="#10b981" roughness={0.8} flatShading />
      </mesh>
      <mesh position={[0, 1.02, 0]}>
        <coneGeometry args={[0.24, 0.5, 10]} />
        <meshStandardMaterial color="#34d399" roughness={0.8} flatShading />
      </mesh>
    </group>
  );
}

/**
 * Stylized low-poly house on a floating island platform:
 * cream walls, indigo pyramid roof, glowing windows, chimney + trees.
 */
function House({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  const sway = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!sway.current) return;
    sway.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.3;
  });

  return (
    <group position={position} scale={scale}>
      <group ref={sway}>
        {/* floating island platform */}
        <mesh position={[0, -0.88, 0]}>
          <cylinderGeometry args={[2.3, 1.85, 0.35, 40]} />
          <meshStandardMaterial color="#312e81" roughness={0.6} metalness={0.3} />
        </mesh>
        {/* grass top */}
        <mesh position={[0, -0.68, 0]}>
          <cylinderGeometry args={[2.28, 2.28, 0.07, 40]} />
          <meshStandardMaterial color="#065f46" roughness={0.9} />
        </mesh>
        {/* glow ring around the island */}
        <mesh position={[0, -0.88, 0]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[2.3, 0.035, 12, 90]} />
          <meshStandardMaterial
            color="#818cf8"
            emissive="#6366f1"
            emissiveIntensity={1.6}
          />
        </mesh>

        {/* walls */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.2, 1.4, 1.8]} />
          <meshStandardMaterial color="#eef2ff" roughness={0.85} />
        </mesh>
        {/* roof */}
        <mesh position={[0, 1.27, 0]} rotation-y={Math.PI / 4}>
          <coneGeometry args={[1.95, 1.15, 4]} />
          <meshStandardMaterial color="#6366f1" roughness={0.5} metalness={0.25} flatShading />
        </mesh>
        {/* chimney */}
        <mesh position={[0.62, 1.35, -0.35]}>
          <boxGeometry args={[0.28, 0.7, 0.28]} />
          <meshStandardMaterial color="#c7d2fe" roughness={0.7} />
        </mesh>
        {/* door */}
        <mesh position={[-0.55, -0.33, 0.92]}>
          <boxGeometry args={[0.44, 0.74, 0.08]} />
          <meshStandardMaterial color="#4f46e5" roughness={0.5} />
        </mesh>
        {/* glowing front window */}
        <mesh position={[0.45, 0.12, 0.92]}>
          <boxGeometry args={[0.44, 0.44, 0.08]} />
          <meshStandardMaterial color="#fde68a" emissive="#f59e0b" emissiveIntensity={1.15} />
        </mesh>
        {/* glowing side window */}
        <mesh position={[1.12, 0.12, -0.2]} rotation-y={Math.PI / 2}>
          <boxGeometry args={[0.44, 0.44, 0.08]} />
          <meshStandardMaterial color="#fde68a" emissive="#f59e0b" emissiveIntensity={1.15} />
        </mesh>

        {/* trees on the island */}
        <Tree position={[-1.55, -0.65, 0.35]} scale={1} />
        <Tree position={[1.62, -0.65, -0.4]} scale={0.78} />
      </group>
    </group>
  );
}

/**
 * Keeps the house framed on every screen: right side on desktop,
 * tucked top-right and smaller on narrow portrait screens.
 */
function ResponsiveHouse() {
  const viewport = useThree((s) => s.viewport);
  const narrow = viewport.aspect < 1;

  return (
    <Float speed={1.4} rotationIntensity={0} floatIntensity={0.9}>
      <House
        position={narrow ? [1.15, 1.55, -1] : [2.9, -0.15, 0]}
        scale={narrow ? 0.62 : 1}
      />
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[6, 6, 6]} intensity={1.5} color="#e0e7ff" />
      <directionalLight position={[-6, -2, -4]} intensity={0.7} color="#f0abfc" />
      <pointLight position={[4, 4, 5]} intensity={40} color="#818cf8" />

      <Rig>
        <ResponsiveHouse />
        {/* particle layers */}
        <Sparkles count={80} scale={[13, 8, 6]} size={3} speed={0.35} color="#a5b4fc" opacity={0.7} />
        <Sparkles count={36} scale={[11, 7, 5]} size={5} speed={0.25} color="#f0abfc" opacity={0.5} />
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
