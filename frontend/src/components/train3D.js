"use client";
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const Train3D = ({ motion }) => {
  const mountRef = useRef(null);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [trainGroup, setTrainGroup] = useState(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const newScene = new THREE.Scene();
    newScene.background = new THREE.Color(0x87CEEB); // Sky blue background
    const aspectRatio = 16 / 9;
    const newCamera = new THREE.PerspectiveCamera(60, aspectRatio, 0.1, 1000);
    
    const newRenderer = new THREE.WebGLRenderer({ antialias: true });
    newRenderer.setSize(mountRef.current.clientWidth, mountRef.current.clientWidth / aspectRatio);
    newRenderer.shadowMap.enabled = true;
    newRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(newRenderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    newScene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    newScene.add(directionalLight);

    // Create train
    const newTrainGroup = createTrain();
    newScene.add(newTrainGroup);

    // Create environment
    createEnvironment(newScene);

    newCamera.position.set(0, 1, 5);
    newCamera.lookAt(newTrainGroup.position);

    setScene(newScene);
    setCamera(newCamera);
    setRenderer(newRenderer);
    setTrainGroup(newTrainGroup);

    return () => {
      mountRef.current?.removeChild(newRenderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (!scene || !camera || !renderer || !trainGroup) return;

    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (motion && motion.orientation) {
        updateTrainOrientation(trainGroup, motion.orientation);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [scene, camera, renderer, trainGroup, motion]);

  const createTrain = () => {
    const group = new THREE.Group();

    // Train body
    const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 4, 32);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x1E90FF, metalness: 0.7, roughness: 0.3 });
    const trainBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
    trainBody.rotation.z = Math.PI / 2;
    trainBody.castShadow = true;
    group.add(trainBody);

    // Train nose
    const noseGeometry = new THREE.ConeGeometry(0.5, 1, 32);
    const noseMaterial = new THREE.MeshPhongMaterial({ color: 0x1E90FF, metalness: 0.7, roughness: 0.3 });
    const trainNose = new THREE.Mesh(noseGeometry, noseMaterial);
    trainNose.rotation.z = -Math.PI / 2;
    trainNose.position.set(2.5, 0, 0);
    trainNose.castShadow = true;
    group.add(trainNose);

    // Windows
    const windowGeometry = new THREE.PlaneGeometry(0.5, 0.3);
    const windowMaterial = new THREE.MeshPhongMaterial({ color: 0xADD8E6, shininess: 100, transparent: true, opacity: 0.7 });
    for (let i = -1.5; i <= 1.5; i += 0.75) {
      const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
      windowMesh.position.set(i, 0.35, -0.49);
      windowMesh.rotation.y = Math.PI / 2;
      group.add(windowMesh);
    }

    return group;
  };

  const createEnvironment = (scene) => {
    // Ground
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x228B22 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1;
    ground.receiveShadow = true;
    scene.add(ground);

    // Track
    const trackGeometry = new THREE.BoxGeometry(20, 0.1, 1);
    const trackMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
    const track = new THREE.Mesh(trackGeometry, trackMaterial);
    track.position.y = -0.95;
    track.receiveShadow = true;
    scene.add(track);
  };

  const updateTrainOrientation = (train, orientation) => {
    train.rotation.set(
      THREE.MathUtils.degToRad(orientation.pitch),
      THREE.MathUtils.degToRad(orientation.yaw),
      THREE.MathUtils.degToRad(orientation.roll)
    );
  };

  return <div ref={mountRef} style={{ width: '100%', height: 'auto', aspectRatio: '16/9' }} />;
};

export default Train3D;