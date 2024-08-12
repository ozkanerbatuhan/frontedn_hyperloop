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
  
    // Ana gövde
    const bodyGeometry = new THREE.BoxGeometry(4, 0.8, 0.6);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x1E90FF });
    const trainBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
    trainBody.position.y = 0.4;
    trainBody.castShadow = true;
    group.add(trainBody);
  
    // Çatı
    const roofGeometry = new THREE.CylinderGeometry(0.3, 0.3, 4, 8, 1, false, 0, Math.PI);
    const roofMaterial = new THREE.MeshPhongMaterial({ color: 0x0000CD });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.rotation.z = Math.PI / 2;
    roof.position.y = 0.8;
    roof.castShadow = true;
    group.add(roof);
  
    // Pencereler
    const windowGeometry = new THREE.PlaneGeometry(0.4, 0.3);
    const windowMaterial = new THREE.MeshPhongMaterial({ color: 0xADD8E6, transparent: true, opacity: 0.7 });
    for (let i = -1.5; i <= 1.5; i += 0.75) {
      const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
      windowMesh.position.set(i, 0.5, 0.31);
      group.add(windowMesh);
    }
  
    // Tekerlekler
    const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
    const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x1A1A1A });
    for (let i = -1.5; i <= 1.5; i += 1) {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(i, 0.2, 0.35);
      group.add(wheel);
      const wheel2 = wheel.clone();
      wheel2.position.z = -0.35;
      group.add(wheel2);
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