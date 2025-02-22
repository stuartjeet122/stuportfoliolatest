import { useRef, useEffect, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { FBXLoader } from 'three-stdlib';
import { TextureLoader, MeshStandardMaterial } from 'three';

const FBXModel = ({ path, minRotationY = -Math.PI / 4, maxRotationY = Math.PI / 4 }) => {
  const fbx = useLoader(FBXLoader, path);
  const modelRef = useRef();
  const [rotationY, setRotationY] = useState(0);
  const [direction, setDirection] = useState(1);

  useFrame(() => {
    if (modelRef.current) {
      setRotationY((prevRotationY) => {
        const newRotationY = prevRotationY + 0.005 * direction;

        // Check if the new rotation exceeds the limits
        if (newRotationY > maxRotationY || newRotationY < minRotationY) {
          // Reverse direction
          setDirection(-direction);
          return Math.max(minRotationY, Math.min(newRotationY, maxRotationY)); // Clamp within limits
        }

        return newRotationY;
      });

      // Apply the rotation to the model
      modelRef.current.rotation.y = rotationY;
    }
  });

  // Apply texture manually in case it's not embedded
  useEffect(() => {
    const texture = new TextureLoader().load('/models/maxresdefault.jpg');

    fbx.traverse((child) => {
      if (child.isMesh) {
        child.material = new MeshStandardMaterial({ map: texture });
        child.material.needsUpdate = true;
      }
    });
  }, [fbx]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <primitive object={fbx} ref={modelRef} scale={0.031} />
    </>
  );
};

export default FBXModel;
