import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface FloatingSpheresProps {
  className?: string;
}

const FloatingSpheres: React.FC<FloatingSpheresProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.OrthographicCamera>();
  const materialRef = useRef<THREE.ShaderMaterial>();
  const clockRef = useRef<THREE.Clock>();
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(0.5, 0.5));
  const targetMouseRef = useRef<THREE.Vector2>(new THREE.Vector2(0.5, 0.5));
  const animationFrameRef = useRef<number>();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      premultipliedAlpha: false
    });
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    renderer.setSize(rect.width, rect.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    container.appendChild(renderer.domElement);

    // Create clock
    const clock = new THREE.Clock();

    // Create shader material
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(rect.width, rect.height) },
        uSphereCount: { value: 6 },
        uAmbientIntensity: { value: 0.2 },
        uDiffuseIntensity: { value: 0.8 },
        uSpecularIntensity: { value: 3.0 },
        uSpecularPower: { value: 16.0 },
        uFresnelPower: { value: 3.0 },
        uBackgroundColor: { value: new THREE.Color(0x000000) },
        uSphereColor: { value: new THREE.Color(0x000000) },
        uLightColor: { value: new THREE.Color(0xffffff) },
        uLightPosition: { value: new THREE.Vector3(1, 1, 1) },
        uSmoothness: { value: 0.25 },
        uContrast: { value: 1.8 },
        uFogDensity: { value: 0.02 },
        uCameraDistance: { value: 2.5 },
        uMovementPattern: { value: 1 }, // 0: orbital, 1: wave, 2: chaos, 3: pulse
        uMovementSpeed: { value: 0.8 },
        uMovementScale: { value: 1.4 },
        uIndividualRotation: { value: true },
        uMousePosition: { value: new THREE.Vector2(0.5, 0.5) },
        uMouseProximityEffect: { value: true },
        uMinMovementScale: { value: 0.9 },
        uMaxMovementScale: { value: 1.1 },
        uMouseInfluence: { value: 0.1 },
        uHoverIntensity: { value: 0.0 }
      },
      vertexShader: `
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uResolution;
        uniform int uSphereCount;
        uniform float uAmbientIntensity;
        uniform float uDiffuseIntensity;
        uniform float uSpecularIntensity;
        uniform float uSpecularPower;
        uniform float uFresnelPower;
        uniform vec3 uBackgroundColor;
        uniform vec3 uSphereColor;
        uniform vec3 uLightColor;
        uniform vec3 uLightPosition;
        uniform float uSmoothness;
        uniform float uContrast;
        uniform float uFogDensity;
        uniform float uCameraDistance;
        uniform int uMovementPattern;
        uniform float uMovementSpeed;
        uniform float uMovementScale;
        uniform bool uIndividualRotation;
        uniform vec2 uMousePosition;
        uniform bool uMouseProximityEffect;
        uniform float uMinMovementScale;
        uniform float uMaxMovementScale;
        uniform float uMouseInfluence;
        uniform float uHoverIntensity;
        
        varying vec2 vUv;
        
        const float PI = 3.14159265359;
        const float EPSILON = 0.0001;
        const int MAX_STEPS = 100;
        const float MAX_DIST = 100.0;
        
        float sdSphere(vec3 p, float r) {
          return length(p) - r;
        }
        
        float smin(float a, float b, float k) {
          float h = max(k - abs(a - b), 0.0) / k;
          return min(a, b) - h * h * k * 0.25;
        }
        
        mat3 rotateY(float theta) {
          float c = cos(theta);
          float s = sin(theta);
          return mat3(
            c, 0, s,
            0, 1, 0,
            -s, 0, c
          );
        }
        
        mat3 rotateX(float theta) {
          float c = cos(theta);
          float s = sin(theta);
          return mat3(
            1, 0, 0,
            0, c, -s,
            0, s, c
          );
        }
        
        float getDistanceToCenter(vec2 pos) {
          float dist = length(pos - vec2(0.5, 0.5)) * 2.0;
          return smoothstep(0.0, 1.0, dist);
        }
        
        float sdf(vec3 pos) {
          float result = MAX_DIST;
          float t = uTime * uMovementSpeed;
          
          float dynamicMovementScale = uMovementScale;
          vec2 mouseOffset = vec2(0.0);
          
          if (uMouseProximityEffect) {
            float distToCenter = getDistanceToCenter(uMousePosition);
            float smoothT = smoothstep(0.0, 1.0, distToCenter);
            dynamicMovementScale = mix(uMinMovementScale, uMaxMovementScale, smoothT);
            
            // Add subtle mouse attraction
            vec2 mouseDir = (uMousePosition - vec2(0.5)) * 2.0;
            float mouseDistance = length(mouseDir);
            if (mouseDistance > 0.0) {
              mouseOffset = normalize(mouseDir) * uMouseInfluence * (1.0 - mouseDistance);
            }
          }
          
          for (int i = 0; i < 10; i++) {
            if (i >= uSphereCount) break;
            
            float speed = 0.4 + float(i) * 0.15;
            float radius = 0.15 + float(i % 3) * 0.1;
            float orbitRadius = (0.5 + float(i % 5) * 0.2) * dynamicMovementScale;
            float phaseOffset = float(i) * PI * 0.2;
            
            vec3 offset;
            
            if (i == 0) {
              offset = vec3(
                sin(t * speed) * orbitRadius * 0.8 + mouseOffset.x * 0.5,
                sin(t * 0.6) * orbitRadius * 1.2 + mouseOffset.y * 0.3,
                cos(t * speed * 0.8) * orbitRadius * 0.6
              );
            } 
            else if (i == 1) {
              offset = vec3(
                sin(t * speed + PI) * orbitRadius * 0.9 + mouseOffset.x * 0.3,
                -sin(t * 0.5) * orbitRadius * 1.1 + mouseOffset.y * 0.4,
                cos(t * speed * 0.7 + PI) * orbitRadius * 0.7
              );
            }
            else {
              // Wave pattern with more dynamic movement
              float wave = sin(t * 0.3 + float(i) * 0.8) * 0.6;
              float mouseInfluenceScale = 0.2 / (1.0 + float(i) * 0.1);
              offset = vec3(
                sin(t * speed + phaseOffset + wave) * orbitRadius + mouseOffset.x * mouseInfluenceScale,
                sin(t * (speed * 0.6) + phaseOffset * 1.4 + wave) * (orbitRadius * 0.9) + mouseOffset.y * mouseInfluenceScale,
                cos(t * (speed * 0.4) + phaseOffset * 1.1) * (orbitRadius * 0.8)
              );
            }
            
            if (uIndividualRotation) {
              float rotSpeed = t * (0.1 + float(i) * 0.02);
              mat3 rot = rotateY(rotSpeed) * rotateX(rotSpeed * 0.8);
              offset = rot * offset;
            }
            
            float sphere = sdSphere(pos + offset, radius);
            result = smin(result, sphere, uSmoothness);
          }
          
          return result;
        }
        
        vec3 calcNormal(vec3 p) {
          vec2 e = vec2(EPSILON, 0.0);
          return normalize(vec3(
            sdf(p + e.xyy) - sdf(p - e.xyy),
            sdf(p + e.yxy) - sdf(p - e.yxy),
            sdf(p + e.yyx) - sdf(p - e.yyx)
          ));
        }
        
        float raymarch(vec3 ro, vec3 rd) {
          float t = 0.0;
          
          for (int i = 0; i < MAX_STEPS; i++) {
            vec3 p = ro + rd * t;
            float d = sdf(p);
            
            if (d < EPSILON) {
              return t;
            }
            
            if (t > MAX_DIST) {
              break;
            }
            
            t += d * 0.8;
          }
          
          return -1.0;
        }
        
        float softShadow(vec3 ro, vec3 rd, float mint, float maxt, float k) {
          float result = 1.0;
          float t = mint;
          
          for (int i = 0; i < 32; i++) {
            if (t >= maxt) break;
            
            float h = sdf(ro + rd * t);
            
            if (h < EPSILON) {
              return 0.0;
            }
            
            result = min(result, k * h / t);
            t += h;
          }
          
          return result;
        }
        
        float ambientOcclusion(vec3 p, vec3 n) {
          float occ = 0.0;
          float weight = 1.0;
          
          for (int i = 0; i < 5; i++) {
            float dist = 0.01 + 0.02 * float(i * i);
            float h = sdf(p + n * dist);
            occ += (dist - h) * weight;
            weight *= 0.85;
          }
          
          return clamp(1.0 - occ, 0.0, 1.0);
        }
        
        vec3 lighting(vec3 p, vec3 rd, float t) {
          if (t < 0.0) {
            return vec3(0.0);
          }
          
          vec3 normal = calcNormal(p);
          vec3 viewDir = -rd;
          
          // Pure black spheres with minimal lighting for visibility
          vec3 baseColor = vec3(0.0, 0.0, 0.0);
          
          // Very subtle edge lighting to define sphere shape
          vec3 lightDir = normalize(uLightPosition);
          float edgeFactor = 1.0 - abs(dot(normal, viewDir));
          float rimLight = pow(edgeFactor, 2.0) * (0.15 + uHoverIntensity * 0.1);
          
          // Add subtle hover glow
          float hoverGlow = uHoverIntensity * 0.05;
          
          // Only add minimal rim lighting for sphere definition
          vec3 color = baseColor + vec3(rimLight + hoverGlow);
          
          return color;
        }
        
        void main() {
          vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution.xy) / uResolution.y;
          
          vec3 ro = vec3(0.0, 0.0, -uCameraDistance);
          vec3 rd = normalize(vec3(uv, 1.0));
          
          float camRotY = sin(uTime * 0.05) * 0.05;
          float camRotX = cos(uTime * 0.04) * 0.025;
          rd = rotateY(camRotY) * rotateX(camRotX) * rd;
          
          float t = raymarch(ro, rd);
          vec3 p = ro + rd * t;
          vec3 color = lighting(p, rd, t);
          
          if (t > 0.0) {
            // Force pure black for spheres
            gl_FragColor = vec4(color, 1.0);
          } else {
            // Completely transparent background
            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
          }
        }
      `,
      transparent: true
    });

    // Create mesh
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Store references
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    materialRef.current = material;
    clockRef.current = clock;

    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouseRef.current.x = (event.clientX - rect.left) / rect.width;
      targetMouseRef.current.y = 1.0 - (event.clientY - rect.top) / rect.height;
    };

    const handleMouseEnter = () => {
      if (materialRef.current) {
        materialRef.current.uniforms.uHoverIntensity.value = 1.0;
      }
    };

    const handleMouseLeave = () => {
      if (materialRef.current) {
        materialRef.current.uniforms.uHoverIntensity.value = 0.0;
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Animation loop
    const animate = () => {
      if (!materialRef.current || !rendererRef.current || !sceneRef.current || !clockRef.current) return;

      // Smooth mouse movement
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.1;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.1;

      materialRef.current.uniforms.uMousePosition.value = mouseRef.current;
      materialRef.current.uniforms.uTime.value = clockRef.current.getElapsedTime();

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !materialRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      rendererRef.current.setSize(rect.width, rect.height);
      materialRef.current.uniforms.uResolution.value.set(rect.width, rect.height);
    };

    window.addEventListener('resize', handleResize);

    setIsReady(true);
    animate();

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`floating-spheres ${className}`}
      style={{
        width: '100%',
        height: '100%',
        opacity: isReady ? 1 : 0,
        transition: 'opacity 1s ease-in-out'
      }}
    />
  );
};

export default FloatingSpheres;