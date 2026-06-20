import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface ThreeCanvasProps {
  currentPage: number;
}

export default function ThreeCanvas({ currentPage }: ThreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // References to animate specific groups
  const heartGroupRef = useRef<THREE.Group | null>(null);
  const memoriesGroupRef = useRef<THREE.Group | null>(null);
  const letterGroupRef = useRef<THREE.Group | null>(null);
  const celebrationGroupRef = useRef<THREE.Group | null>(null);
  const balloonsRef = useRef<THREE.Mesh[]>([]);
  const balloonSpeedsRef = useRef<number[]>([]);
  const particleSystemRef = useRef<THREE.Points | null>(null);
  
  // Rotating colored point lights (stage lights)
  const rotatingLightsRef = useRef<THREE.PointLight[]>([]);
  
  // Cyberpunk ground grid
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);

  // Screen shake state
  const cameraShakeRef = useRef<number>(0); // 0 to 1 intensity decaying

  // Custom click ripple particle arrays
  const burstsRef = useRef<Array<{
    particles: THREE.Points;
    life: number;
    maxLife: number;
    velocity: THREE.Vector3[];
  }>>([]);

  // Expanding 3D neon shockwave rings
  const shockwavesRef = useRef<Array<{
    mesh: THREE.Mesh;
    life: number;
    maxLife: number;
    color: number;
  }>>([]);

  // Mouse hover state and raycasting
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const [hoveredPhotoIndex, setHoveredPhotoIndex] = useState<number | null>(null);

  // Background scene textures
  const textureLoader = useRef<THREE.TextureLoader>(new THREE.TextureLoader().setCrossOrigin("anonymous"));

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Create Scene & WebGL Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0518, 0.02); // Deep mysterious cosmic violet fog

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    // Initial camera position off-angle for dramatic entrance
    camera.position.set(0, 5, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    // 2. Setup Stage Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff0f5, 0.9);
    dirLight.position.set(5, 15, 7);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Dynamic flashing colorful point lights that circle the hubs (stage show)
    const colors = [0xff0055, 0x00f0ff, 0xab00ff];
    rotatingLightsRef.current = [];
    colors.forEach((col, idx) => {
      const pLight = new THREE.PointLight(col, 2.5, 20);
      pLight.castShadow = true;
      scene.add(pLight);
      rotatingLightsRef.current.push(pLight);

      // Add a small glowing core mesh on each light
      const sphereGeom = new THREE.SphereGeometry(0.08, 8, 8);
      const sphereMat = new THREE.MeshBasicMaterial({ color: col });
      const core = new THREE.Mesh(sphereGeom, sphereMat);
      pLight.add(core);
    });

    // 3. Shared Cosmic Swirling Star Nebula
    const particleCount = 400;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const starSpeeds: number[] = [];
    const starRadii: number[] = [];
    const starTheta: number[] = [];
    const starYOffset: number[] = [];

    for (let i = 0; i < particleCount; i++) {
      // Create vortex arrangement
      const radius = 2 + Math.random() * 25;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 15;
      
      positions[i * 3] = radius * Math.sin(theta);
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = radius * Math.cos(theta);

      starRadii.push(radius);
      starTheta.push(theta);
      starSpeeds.push(0.005 + Math.random() * 0.015);
      starYOffset.push(y);
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Create a fuzzy glowing pink/blue star brush
    const createParticleTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.3, "rgba(236, 72, 153, 0.8)");
        gradient.addColorStop(0.6, "rgba(59, 130, 246, 0.4)");
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 16, 16);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.3,
      map: createParticleTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const spaceParticles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(spaceParticles);
    particleSystemRef.current = spaceParticles;

    // Cyberpunk Laser Ground Grid
    const gridHelper = new THREE.GridHelper(60, 40, 0xff0055, 0x475569);
    gridHelper.position.y = -4.5;
    scene.add(gridHelper);
    gridHelperRef.current = gridHelper;

    // 4. HUB 0: Welcome Scene (Center x=0, y=0, z=0)
    const welcomeGroup = new THREE.Group();
    scene.add(welcomeGroup);
    heartGroupRef.current = welcomeGroup;

    // Generate accurate 3D heart geometry using Shape extrusion
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0.4);
    heartShape.bezierCurveTo(0, 0.4, 0.1, 1.2, 0.8, 1.2);
    heartShape.bezierCurveTo(1.5, 1.2, 1.5, 0.4, 1.5, 0);
    heartShape.bezierCurveTo(1.5, -0.6, 0.9, -1.2, 0, -1.9);
    heartShape.bezierCurveTo(-0.9, -1.2, -1.5, -0.6, -1.5, 0);
    heartShape.bezierCurveTo(-1.5, 0.4, -1.5, 1.2, -0.8, 1.2);
    heartShape.bezierCurveTo(-0.1, 1.2, 0, 0.4, 0, 0.4);

    const extrudeSettings = {
      depth: 0.35,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    };

    const heartGeom = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    heartGeom.center(); // Center local pivot
    
    // Shiny red/pink cybernetic glassmorphic material
    const heartMat = new THREE.MeshPhysicalMaterial({
      color: 0xec4899,
      emissive: 0x3b0764,
      roughness: 0.05,
      metalness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      transmission: 0.65, // Insane glass transmission
      thickness: 1.5,
    });

    const heartMesh = new THREE.Mesh(heartGeom, heartMat);
    heartMesh.scale.set(1.2, 1.2, 1.2);
    heartMesh.castShadow = true;
    welcomeGroup.add(heartMesh);

    // Multi-ring glowing orbit structure
    const ringGeom = new THREE.TorusGeometry(2.2, 0.04, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.4,
    });
    const ringMesh1 = new THREE.Mesh(ringGeom, ringMat);
    ringMesh1.rotation.x = Math.PI / 2.5;
    welcomeGroup.add(ringMesh1);

    const ringMesh2 = new THREE.Mesh(
      new THREE.TorusGeometry(1.8, 0.03, 16, 100),
      new THREE.MeshBasicMaterial({
        color: 0xff00ff,
        transparent: true,
        opacity: 0.4,
      })
    );
    ringMesh2.rotation.y = Math.PI / 3;
    welcomeGroup.add(ringMesh2);

    // 5. HUB: Letter Scene (Right side x=11, y=0, z=0)
    const letterGroup = new THREE.Group();
    letterGroup.position.set(11, 0, 0);
    scene.add(letterGroup);
    letterGroupRef.current = letterGroup;

    // Elegant floating semi-transparent 3D scroll background
    const scrollGeom = new THREE.PlaneGeometry(4.3, 5.2, 10, 10);
    
    // Deform the plane to look curved like unrolled parchment
    const posAttribute = scrollGeom.attributes.position;
    for (let i = 0; i < posAttribute.count; i++) {
      const xVal = posAttribute.getX(i);
      const zOffset = Math.sin((xVal + 2.15) / 4.3 * Math.PI) * 0.45 - 0.22;
      posAttribute.setZ(i, zOffset);
    }
    scrollGeom.computeVertexNormals();

    const scrollMat = new THREE.MeshPhysicalMaterial({
      color: 0xfef08a, // Soft yellowish cream parchment color
      roughness: 0.7,
      metalness: 0.05,
      clearcoat: 0.2,
      transmission: 0.4, // Soft translucent look
      thickness: 0.6,
      side: THREE.DoubleSide
    });

    const scrollMesh = new THREE.Mesh(scrollGeom, scrollMat);
    scrollMesh.rotation.y = -0.1;
    scrollMesh.castShadow = true;
    letterGroup.add(scrollMesh);

    // Add glowing light rods at top and bottom of scroll
    const barGeom = new THREE.CylinderGeometry(0.09, 0.09, 4.8, 12);
    const barMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.5 });
    const topBar = new THREE.Mesh(barGeom, barMat);
    topBar.rotation.z = Math.PI / 2;
    topBar.position.set(0, 2.6, -0.1);
    letterGroup.add(topBar);

    const bottomBar = topBar.clone();
    bottomBar.position.y = -2.6;
    letterGroup.add(bottomBar);

    // Decorative floating shiny giant heart next to letter
    const decorativeHeart = new THREE.Mesh(heartGeom, new THREE.MeshStandardMaterial({
      color: 0xec4899,
      roughness: 0.05,
      metalness: 0.1,
    }));
    decorativeHeart.position.set(-2.9, 1.2, -0.5);
    decorativeHeart.scale.set(0.35, 0.35, 0.35);
    letterGroup.add(decorativeHeart);

    // 7. HUB 3: Celebration Scene (Far backend x=0, y=9, z=-12)
    const celebrationGroup = new THREE.Group();
    celebrationGroup.position.set(0, 9, -12);
    scene.add(celebrationGroup);
    celebrationGroupRef.current = celebrationGroup;

    // Floating balloons inside Celebration Hub
    const balloonColors = [0xff0055, 0x00f0ff, 0xab00ff, 0xeab308, 0xff3300, 0x00ff66];
    balloonsRef.current = [];
    balloonSpeedsRef.current = [];

    for (let i = 0; i < 18; i++) {
      const balloonPivot = new THREE.Group();
      
      const xSpread = (Math.random() - 0.5) * 8.5;
      const ySpread = (Math.random() - 0.5) * 4.5;
      const zSpread = (Math.random() - 0.5) * 5.5;
      balloonPivot.position.set(xSpread, ySpread, zSpread);

      const sphereGeom = new THREE.SphereGeometry(0.42, 16, 16);
      sphereGeom.scale(1, 1.25, 1); // egg shape
      
      const balloonColor = balloonColors[i % balloonColors.length];
      const mat = new THREE.MeshPhysicalMaterial({
        color: balloonColor,
        roughness: 0.05,
        metalness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        transmission: 0.4,
        thickness: 0.5,
      });

      const bMesh = new THREE.Mesh(sphereGeom, mat);
      bMesh.castShadow = true;
      balloonPivot.add(bMesh);

      // Balloon knot / cone at bottom
      const coneGeom = new THREE.ConeGeometry(0.06, 0.12, 4);
      const coneMesh = new THREE.Mesh(coneGeom, mat);
      coneMesh.position.y = -0.55;
      coneMesh.rotation.x = Math.PI;
      balloonPivot.add(coneMesh);

      // Tail ribbon trailing down
      const path = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.6, 0),
        new THREE.Vector3(Math.sin(i) * 0.15, -1.2, 0),
        new THREE.Vector3(Math.cos(i) * 0.15, -1.8, 0)
      ]);
      const stringGeom = new THREE.BufferGeometry().setFromPoints(path.getPoints(10));
      const stringMat = new THREE.LineBasicMaterial({ color: 0x94a3b8 });
      const stringLine = new THREE.Line(stringGeom, stringMat);
      balloonPivot.add(stringLine);

      bMesh.userData = { isBalloon: true, id: i, parentGroup: balloonPivot };

      celebrationGroup.add(balloonPivot);
      balloonsRef.current.push(bMesh);
      balloonSpeedsRef.current.push(1.1 + Math.random() * 0.6);
    }

    // 3D Gift Box
    const giftBoxGroup = new THREE.Group();
    giftBoxGroup.position.set(0, -1.4, 0);
    celebrationGroup.add(giftBoxGroup);

    const boxGeom = new THREE.BoxGeometry(1.3, 1.3, 1.3);
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, roughness: 0.1, metalness: 0.3 });
    const boxMesh = new THREE.Mesh(boxGeom, boxMat);
    boxMesh.castShadow = true;
    giftBoxGroup.add(boxMesh);

    // Ribbon cross
    const ribbonGeom1 = new THREE.BoxGeometry(1.35, 1.35, 0.16);
    const ribbonMat = new THREE.MeshStandardMaterial({ color: 0xff0055, roughness: 0.1 });
    const r1 = new THREE.Mesh(ribbonGeom1, ribbonMat);
    giftBoxGroup.add(r1);

    const r2 = r1.clone();
    r2.rotation.y = Math.PI / 2;
    giftBoxGroup.add(r2);

    boxMesh.userData = { isGift: true, group: giftBoxGroup };

    // 8. Dynamic Camera Tweens Configuration
    const cameraTargets = [
      { pos: new THREE.Vector3(0, 0.1, 5.4), lookAt: new THREE.Vector3(0, 0.1, 0) },         // Page 0: Welcome center
      { pos: new THREE.Vector3(11, 0.1, 6.2), lookAt: new THREE.Vector3(11, 0, 0) },        // Page 1: Letter center
      { pos: new THREE.Vector3(0, 9.2, -5.2), lookAt: new THREE.Vector3(0, 9, -12) }       // Page 2: Celebration balloons sky
    ];

    const currentLookAt = new THREE.Vector3(0, 3, 0); // Start off angle look point

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Mouse Move listener for intense gyro-parallax card tilt
    const handleMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Helper to start screen shake
    const triggerScreenShake = (amount: number) => {
      cameraShakeRef.current = Math.min(cameraShakeRef.current + amount, 1.0);
    };

    // Click handler to trigger explosion bursts & expansion shockwaves
    const handleCanvasClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycasterRef.current.setFromCamera(new THREE.Vector2(x, y), camera);
      const intersects = raycasterRef.current.intersectObjects(scene.children, true);
      
      for (const hit of intersects) {
        const obj = hit.object;
        
        // POP A BALLOON!
        if (obj.userData?.isBalloon) {
          const parent = obj.userData.parentGroup as THREE.Group | undefined;
          if (parent && parent.scale.x > 0.05) {
            triggerScreenShake(0.4); // Shake camera on balloon blow-up!

            // Spawn firework particles at parent position
            const popPos = new THREE.Vector3();
            obj.getWorldPosition(popPos);
            const balloonColorHex = (obj.material as THREE.MeshPhysicalMaterial).color.getHex();
            
            createFireworkBurst(scene, popPos, balloonColorHex);
            createNeonRingShockwave(scene, popPos, balloonColorHex);

            // Pop scaling shrink effect
            let popScale = 1.0;
            const animatePop = () => {
              popScale -= 0.22;
              if (popScale > 0) {
                parent.scale.set(popScale, popScale, popScale);
                requestAnimationFrame(animatePop);
              } else {
                parent.scale.set(0, 0, 0); // Hide
                // Respawn balloon after 5s
                setTimeout(() => {
                  parent.position.set(
                    (Math.random() - 0.5) * 8.5,
                    (Math.random() - 0.5) * 4.5,
                    (Math.random() - 0.5) * 5.5
                  );
                  let scaleUp = 0;
                  const animateRespawn = () => {
                    scaleUp += 0.06;
                    if (scaleUp <= 1) {
                      parent.scale.set(scaleUp, scaleUp, scaleUp);
                      requestAnimationFrame(animateRespawn);
                    }
                  };
                  animateRespawn();
                }, 5000);
              }
            };
            animatePop();
            break;
          }
        }

        // DISCOVER PRESENT GIFT BOUNCE
        if (obj.userData?.isGift) {
          const group = obj.userData.group as THREE.Group;
          if (group) {
            triggerScreenShake(0.65); // Epic high magnitude shake!

            let bounceTime = 0;
            const animateBounce = () => {
              bounceTime += 0.12;
              const yOffset = Math.abs(Math.sin(bounceTime)) * 2.1;
              group.position.y = -1.4 + yOffset;
              group.rotation.y += 0.22;
              if (bounceTime < Math.PI * 2) {
                requestAnimationFrame(animateBounce);
              } else {
                group.position.y = -1.4;
              }
            };
            animateBounce();
            
            const giftLoc = new THREE.Vector3();
            obj.getWorldPosition(giftLoc);
            giftLoc.y += 0.7;

            // Insane double firework explosion & glowing shockwaves
            createFireworkBurst(scene, giftLoc, 0x00f0ff);
            createFireworkBurst(scene, giftLoc, 0xff0055);
            createNeonRingShockwave(scene, giftLoc, 0xff00ff);
            break;
          }
        }
      }
    };
    window.addEventListener("click", handleCanvasClick);

    // 9. Particles Burst Explosion Helper
    const createFireworkBurst = (targetScene: THREE.Scene, position: THREE.Vector3, colorHex: number) => {
      const pCount = 70;
      const geom = new THREE.BufferGeometry();
      const pPosList = new Float32Array(pCount * 3);
      const velocities: THREE.Vector3[] = [];

      for (let i = 0; i < pCount; i++) {
        pPosList[i * 3] = position.x;
        pPosList[i * 3 + 1] = position.y;
        pPosList[i * 3 + 2] = position.z;

        // Spread sphere velocities
        const theta2 = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const speed = 0.08 + Math.random() * 0.18;

        velocities.push(new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta2) * speed,
          Math.sin(phi) * Math.sin(theta2) * speed + 0.05, // Slight upward drift
          Math.cos(phi) * speed
        ));
      }

      geom.setAttribute("position", new THREE.BufferAttribute(pPosList, 3));
      
      const sparkCanvas = document.createElement("canvas");
      sparkCanvas.width = 16;
      sparkCanvas.height = 16;
      const sCtx = sparkCanvas.getContext("2d");
      if (sCtx) {
        const grad = sCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
        grad.addColorStop(0, "white");
        grad.addColorStop(0.35, "rgba(255, 240, 0, 1)");
        grad.addColorStop(0.7, "rgba(255, 50, 0, 0.8)");
        grad.addColorStop(1, "rgba(0,0,0,0)");
        sCtx.fillStyle = grad;
        sCtx.fillRect(0, 0, 16, 16);
      }
      
      const burstMat = new THREE.PointsMaterial({
        size: 0.4,
        map: new THREE.CanvasTexture(sparkCanvas),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      const burstPoints = new THREE.Points(geom, burstMat);
      targetScene.add(burstPoints);

      burstsRef.current.push({
        particles: burstPoints,
        life: 0,
        maxLife: 50,
        velocity: velocities
      });
    };

    // Expanding 3D Shockwave Rings
    const createNeonRingShockwave = (targetScene: THREE.Scene, position: THREE.Vector3, colorHex: number) => {
      const ringGeom = new THREE.TorusGeometry(0.1, 0.03, 8, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.position.copy(position);
      // Flat face orientation
      ringMesh.rotation.x = Math.PI / 2;
      targetScene.add(ringMesh);

      shockwavesRef.current.push({
        mesh: ringMesh,
        life: 0,
        maxLife: 30,
        color: colorHex
      });
    };

    // 10. Main Animation Loop
    let clock = new THREE.Clock();
    let animationFrameId: number;

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      // Dynamic automatic 120BPM throbbing beats simulation (insane high energy)
      const pulseMultiplier = 1.0 + Math.abs(Math.sin(elapsedTime * Math.PI * 2.0)) * 0.06;

      // Slow dynamic idle spins & throb reaction
      if (heartGroupRef.current) {
        heartGroupRef.current.rotation.y = elapsedTime * 0.52;
        heartGroupRef.current.position.y = Math.sin(elapsedTime * 1.5) * 0.16;
        heartGroupRef.current.scale.set(pulseMultiplier, pulseMultiplier, pulseMultiplier);
      }
      
      if (letterGroupRef.current) {
        letterGroupRef.current.position.y = Math.sin(elapsedTime * 1.2) * 0.12;
        letterGroupRef.current.rotation.y = -0.1 + Math.sin(elapsedTime * 0.45) * 0.06;
        letterGroupRef.current.scale.set(pulseMultiplier, pulseMultiplier, pulseMultiplier);
      }

      // Energy laser ground wave effect
      if (gridHelperRef.current) {
        gridHelperRef.current.position.z = (elapsedTime * 2.0) % 1.5;
      }

      // Floating Balloons bobbing & throb reaction
      balloonsRef.current.forEach((balloon, key) => {
        const speed = balloonSpeedsRef.current[key] || 1.0;
        balloon.position.y = Math.sin(elapsedTime * 1.8 * speed + key) * 0.08;
        balloon.rotation.z = Math.sin(elapsedTime * 0.8 * speed + key) * 0.05;
        // Make individual balloons pulse slightly offset
        const scaleFact = 1.0 + Math.sin(elapsedTime * 4.0 + key) * 0.05;
        balloon.scale.set(1, 1.25 * scaleFact, 1);
      });

      // Animate Rotating Stage pointlights
      rotatingLightsRef.current.forEach((light, idx) => {
        const offset = (idx * Math.PI * 2) / rotatingLightsRef.current.length;
        const angle = elapsedTime * 1.5 + offset;
        const radius = 6.0;
        
        // Let the lights orbit active page hub
        let hubX = 0;
        let hubZ = 0;
        if (currentPage === 1) hubX = 11;
        if (currentPage === 2) { hubX = 0; hubZ = -12; }

        light.position.x = hubX + Math.sin(angle) * radius;
        light.position.z = hubZ + Math.cos(angle) * radius;
        light.position.y = idx === 1 ? 3.0 : 0.5 + Math.sin(elapsedTime * 2.0) * 1.5;
      });

      // Animate swirling cosmic star vortex 
      if (particleSystemRef.current) {
        const starGeom = particleSystemRef.current.geometry;
        const starPos = starGeom.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < particleCount; i++) {
          // Slowly increment the polar coordinate angle theta
          starTheta[i] += starSpeeds[i];
          const radius = starRadii[i];
          const theta = starTheta[i];

          starPos.setX(i, radius * Math.sin(theta));
          starPos.setY(i, starYOffset[i] + Math.sin(elapsedTime * 0.5 + i) * 0.2);
          starPos.setZ(i, radius * Math.cos(theta));
        }
        starPos.needsUpdate = true;
      }

      // Animate active click sparkles
      for (let b = burstsRef.current.length - 1; b >= 0; b--) {
        const burst = burstsRef.current[b];
        burst.life++;
        
        const bPos = burst.particles.geometry.attributes.position as THREE.BufferAttribute;
        for (let j = 0; j < bPos.count; j++) {
          const vel = burst.velocity[j];
          bPos.setX(j, bPos.getX(j) + vel.x);
          bPos.setY(j, bPos.getY(j) + vel.y);
          bPos.setZ(j, bPos.getZ(j) + vel.z);
          vel.y -= 0.0022; // gravity effect
        }
        bPos.needsUpdate = true;
        
        (burst.particles.material as THREE.PointsMaterial).opacity = 1.0 - (burst.life / burst.maxLife);
        
        if (burst.life >= burst.maxLife) {
          scene.remove(burst.particles);
          burst.particles.geometry.dispose();
          (burst.particles.material as THREE.PointsMaterial).dispose();
          burstsRef.current.splice(b, 1);
        }
      }

      // Animate 3D shockwaves
      for (let s = shockwavesRef.current.length - 1; s >= 0; s--) {
        const wave = shockwavesRef.current[s];
        wave.life++;
        
        const scaleMult = 1.0 + (wave.life * 0.42);
        wave.mesh.scale.set(scaleMult, scaleMult, scaleMult);
        
        const mat = wave.mesh.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.8 * (1.0 - (wave.life / wave.maxLife));

        if (wave.life >= wave.maxLife) {
          scene.remove(wave.mesh);
          wave.mesh.geometry.dispose();
          mat.dispose();
          shockwavesRef.current.splice(s, 1);
        }
      }

      // Camera Fly-To transitions based on current page state
      const targetNav = cameraTargets[Math.max(0, Math.min(currentPage, cameraTargets.length - 1))];
      
      // Calculate gyro-parallax offsets derived from mouse positions
      const parallaxX = mouseRef.current.x * 0.95;
      const parallaxY = mouseRef.current.y * 0.65;

      // Smooth interpolation (LERP) of camera view coordinates
      const camTargetPos = targetNav.pos.clone();
      camTargetPos.x += parallaxX;
      camTargetPos.y += parallaxY;

      // Decay and apply high-impact screen shake
      let shakeOffsetX = 0;
      let shakeOffsetY = 0;
      if (cameraShakeRef.current > 0.01) {
        shakeOffsetX = (Math.random() - 0.5) * cameraShakeRef.current * 0.8;
        shakeOffsetY = (Math.random() - 0.5) * cameraShakeRef.current * 0.8;
        cameraShakeRef.current *= 0.88; // decay
      }

      camera.position.x += (camTargetPos.x - camera.position.x) * 0.052 + shakeOffsetX;
      camera.position.y += (camTargetPos.y - camera.position.y) * 0.052 + shakeOffsetY;
      camera.position.z += (camTargetPos.z - camera.position.z) * 0.052;

      currentLookAt.x += (targetNav.lookAt.x - currentLookAt.x) * 0.06;
      currentLookAt.y += (targetNav.lookAt.y - currentLookAt.y) * 0.06;
      currentLookAt.z += (targetNav.lookAt.z - currentLookAt.z) * 0.06;

      camera.lookAt(currentLookAt);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    // Clean up on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleCanvasClick);
      cancelAnimationFrame(animationFrameId);
      
      // Dispose WebGL assets safely
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      heartGeom.dispose();
      heartMat.dispose();
      ringGeom.dispose();
      ringMat.dispose();
      ringMesh2.geometry.dispose();
      (ringMesh2.material as THREE.Material).dispose();
      scrollGeom.dispose();
      scrollMat.dispose();
      barGeom.dispose();
      barMat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      gridHelper.dispose();
      
      burstsRef.current.forEach((burst) => {
        scene.remove(burst.particles);
        burst.particles.geometry.dispose();
        (burst.particles.material as THREE.PointsMaterial).dispose();
      });

      shockwavesRef.current.forEach((wave) => {
        scene.remove(wave.mesh);
        wave.mesh.geometry.dispose();
        (wave.mesh.material as THREE.Material).dispose();
      });
    };
  }, [currentPage]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto z-0" ref={containerRef}>
      {/* Floating Interactive Hint */}
      {currentPage === 2 && (
        <div 
          className="absolute left-1/2 bottom-[24%] -translate-x-1/2 bg-pink-950/60 backdrop-blur-md px-6 py-2 rounded-full border border-pink-400 text-pink-300 text-xs md:text-sm font-semibold z-40 pointer-events-none select-none tracking-widest uppercase shadow-[0_0_15px_rgba(236,72,153,0.3)] animate-pulse"
        >
          🎁 Click the balloons or gift box to detonate firework shockwaves! 🎈
        </div>
      )}
    </div>
  );
}
