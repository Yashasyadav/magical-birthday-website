import React from 'react';

/**
 * CakeEnvironment
 * Renders the luxury white marble table with golden trims and table details.
 * Table receives shadows and provides soft reflections for realistic material presence.
 */
export function CakeEnvironment() {
  return (
    <group>
      {/* Table Mat / Plate base shadow blocker */}
      <mesh receiveShadow position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 6]} />
        <shadowMaterial opacity={0.4} />
      </mesh>

      {/* Main Luxury White Marble Table */}
      <mesh receiveShadow position={[0, -0.1, 0]}>
        <cylinderGeometry args={[3.2, 3.2, 0.2, 64]} />
        {/* PBR Polished Marble Material */}
        <meshStandardMaterial 
          color="#f8fafc" 
          roughness={0.12} 
          metalness={0.05} 
        />
      </mesh>

      {/* Outer Golden Trim Rim */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[3.22, 3.22, 0.1, 64]} />
        {/* Glossy Gold Material */}
        <meshStandardMaterial 
          color="#fbbf24" 
          roughness={0.15} 
          metalness={0.95} 
        />
      </mesh>

      {/* Table support column */}
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.5, 0.8, 2.0, 32]} />
        <meshStandardMaterial 
          color="#1e293b" 
          roughness={0.4} 
        />
      </mesh>
    </group>
  );
}

export default CakeEnvironment;
