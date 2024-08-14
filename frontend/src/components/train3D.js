"use client";
import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

const Train3D = ({ motion }) => {
  const mountRef = useRef(null);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [trainGroup, setTrainGroup] = useState(null);

  useEffect(() => {
    if (!scene || !camera || !renderer || !trainGroup || !motion) return;

    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (motion.orientation) {
        updateTrainOrientation(trainGroup, motion.orientation);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [scene, camera, renderer, trainGroup, motion]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const newScene = new THREE.Scene();
    newScene.background = new THREE.Color(0x1b1f23); // Dark background for contrast
    const aspectRatio = 16 / 9;
    const newCamera = new THREE.PerspectiveCamera(60, aspectRatio, 0.1, 1000);

    const newRenderer = new THREE.WebGLRenderer({ antialias: true });
    newRenderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientWidth / aspectRatio
    );
    newRenderer.shadowMap.enabled = true;
    newRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(newRenderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    newScene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    newScene.add(directionalLight);

    // Create train (Hyperloop Pod)
    const newTrainGroup = createHyperloopPod();
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

  // Create a streamlined Hyperloop pod with more detail and realism
  const createHyperloopPod = () => {
    const group = new THREE.Group();

    // Body
    const bodyGeometry = new THREE.CylinderGeometry(0.4, 0.4, 6, 64);
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: 0x1e90ff,
      shininess: 150,
      metalness: 0.8,
    });
    const trainBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
    trainBody.rotation.z = Math.PI / 2;
    trainBody.castShadow = true;
    group.add(trainBody);

    // Nose
    const noseGeometry = new THREE.SphereGeometry(0.4, 64, 64);
    const noseMaterial = new THREE.MeshPhongMaterial({
      color: 0x1e90ff,
      shininess: 150,
      metalness: 0.8,
    });
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.position.x = 3;
    nose.castShadow = true;
    group.add(nose);

    // Tail
    const tailGeometry = new THREE.SphereGeometry(0.4, 64, 64);
    const tailMaterial = new THREE.MeshPhongMaterial({
      color: 0x1e90ff,
      shininess: 150,
      metalness: 0.8,
    });
    const tail = new THREE.Mesh(tailGeometry, tailMaterial);
    tail.position.x = -3;
    tail.castShadow = true;
    group.add(tail);

    // Windows with more detail
    const windowGeometry = new THREE.PlaneGeometry(0.3, 0.2);
    const windowMaterial = new THREE.MeshPhongMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.7,
    });
    for (let i = -2.5; i <= 2.5; i += 1) {
      const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
      windowMesh.position.set(i, 0, 0.41);
      windowMesh.castShadow = true;
      group.add(windowMesh);
    }

    // Detail: Additional light strips
    const lightStripGeometry = new THREE.PlaneGeometry(0.02, 3);
    const lightStripMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const lightStrip = new THREE.Mesh(lightStripGeometry, lightStripMaterial);
    lightStrip.position.set(0, 0, 0.42);
    group.add(lightStrip);

    return group;
  };

  const createEnvironment = (scene) => {
    // Ground (Tube-like structure)
    const tubeGeometry = new THREE.CylinderGeometry(3, 3, 20, 64, 64, true);
    const tubeMaterial = new THREE.MeshPhongMaterial({
      color: 0x1b1f23,
      side: THREE.BackSide,
    });
    const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
    tube.rotation.x = Math.PI / 2;
    tube.position.y = 1;
    tube.receiveShadow = true;
    scene.add(tube);

    // Track (magnetic rail)
    const trackGeometry = new THREE.BoxGeometry(20, 0.2, 0.8);
    const trackMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    const track = new THREE.Mesh(trackGeometry, trackMaterial);
    track.position.y = -0.9;
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

  return (
    <div
      ref={mountRef}
      style={{ width: "100%", height: "auto", aspectRatio: "16/9" }}
    />
  );
};

export default Train3D;
