import { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Float, Line, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, Globe2, ShieldCheck, Sparkles } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

// --- Types & Constants ---

type Theme = 'AI' | 'ML' | 'Blockchain' | 'Research' | 'Automation' | 'Dev';

const THEMES: Theme[] = ['AI', 'ML', 'Blockchain', 'Research', 'Automation', 'Dev'];

const THEME_CONFIG: Record<Theme, { color: string; secondary: string; text: string }> = {
    AI: { color: '#00f3ff', secondary: '#7000ff', text: 'Artificial Intelligence' },
    ML: { color: '#ff00aa', secondary: '#00f3ff', text: 'Machine Learning' },
    Blockchain: { color: '#00ff88', secondary: '#0044ff', text: 'Blockchain Technology' },
    Research: { color: '#aa00ff', secondary: '#ff00aa', text: 'Research & Innovation' },
    Automation: { color: '#ffaa00', secondary: '#ff0000', text: 'Intelligent Automation' },
    Dev: { color: '#ffffff', secondary: '#00f3ff', text: 'Software Development' },
};

// --- 3D Components ---

const ConnectedParticles = ({ color }: { color: string }) => {
    const count = 100;
    const radius = 15;
    const connectionDistance = 3.5;

    const [positions, velocities] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const vel = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * radius * 2;
            pos[i * 3 + 1] = (Math.random() - 0.5) * radius * 2;
            pos[i * 3 + 2] = (Math.random() - 0.5) * radius * 2;
            vel[i * 3] = (Math.random() - 0.5) * 0.05;
            vel[i * 3 + 1] = (Math.random() - 0.5) * 0.05;
            vel[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
        }
        return [pos, vel];
    }, []);

    const particlesRef = useRef<THREE.Points>(null);
    const linesRef = useRef<THREE.LineSegments>(null);
    const lineGeometry = useMemo(() => new THREE.BufferGeometry(), []);

    useFrame(() => {
        if (!particlesRef.current || !linesRef.current) return;

        // Update positions
        for (let i = 0; i < count; i++) {
            positions[i * 3] += velocities[i * 3];
            positions[i * 3 + 1] += velocities[i * 3 + 1];
            positions[i * 3 + 2] += velocities[i * 3 + 2];

            // Bounce off boundaries
            if (Math.abs(positions[i * 3]) > radius) velocities[i * 3] *= -1;
            if (Math.abs(positions[i * 3 + 1]) > radius) velocities[i * 3 + 1] *= -1;
            if (Math.abs(positions[i * 3 + 2]) > radius) velocities[i * 3 + 2] *= -1;
        }

        particlesRef.current.geometry.attributes.position.needsUpdate = true;

        // Update connections
        const linePositions = [];
        const lineColors = [];
        const colorObj = new THREE.Color(color);

        for (let i = 0; i < count; i++) {
            for (let j = i + 1; j < count; j++) {
                const dx = positions[i * 3] - positions[j * 3];
                const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
                const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < connectionDistance) {
                    linePositions.push(
                        positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
                        positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
                    );

                    const alpha = 1.0 - dist / connectionDistance;
                    lineColors.push(colorObj.r, colorObj.g, colorObj.b, alpha);
                    lineColors.push(colorObj.r, colorObj.g, colorObj.b, alpha);
                }
            }
        }

        linesRef.current.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        linesRef.current.geometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 4)); // RGBA
    });

    return (
        <group>
            <points ref={particlesRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={count}
                        array={positions}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial color={color} size={0.15} transparent opacity={0.8} sizeAttenuation />
            </points>
            <lineSegments ref={linesRef}>
                <bufferGeometry />
                <lineBasicMaterial vertexColors transparent opacity={0.5} blending={THREE.AdditiveBlending} />
            </lineSegments>
        </group>
    );
};

const NeuralNetwork = ({ color }: { color: string }) => {
    const points = useMemo(() => {
        const p = [];
        for (let i = 0; i < 30; i++) {
            p.push(new THREE.Vector3((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10));
        }
        return p;
    }, []);

    const ref = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y = state.clock.getElapsedTime() * 0.1;
        }
    });

    return (
        <group ref={ref}>
            {points.map((p, i) => (
                <mesh key={i} position={p}>
                    <sphereGeometry args={[0.05, 16, 16]} />
                    <meshBasicMaterial color={color} />
                </mesh>
            ))}
            <Line points={points} color={color} lineWidth={1} transparent opacity={0.3} />
        </group>
    );
};

const MorphingShape = ({ color }: { color: string }) => {
    const mesh = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if (mesh.current) {
            mesh.current.rotation.x = state.clock.getElapsedTime() * 0.2;
            mesh.current.rotation.y = state.clock.getElapsedTime() * 0.3;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh ref={mesh}>
                <icosahedronGeometry args={[2, 0]} />
                <meshStandardMaterial color={color} wireframe />
            </mesh>
        </Float>
    );
};

const BlockchainNodes = ({ color }: { color: string }) => {
    const group = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y -= 0.005;
        }
    });

    return (
        <group ref={group}>
            {[...Array(5)].map((_, i) => (
                <Float key={i} speed={1.5} rotationIntensity={0.5} floatIntensity={0.5} position={[(Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8]}>
                    <mesh>
                        <boxGeometry args={[0.8, 0.8, 0.8]} />
                        <meshStandardMaterial color={color} wireframe />
                    </mesh>
                </Float>
            ))}
        </group>
    );
};

const ResearchHologram = ({ color }: { color: string }) => {
    const ref = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y = state.clock.getElapsedTime() * 0.5;
            ref.current.rotation.x = Math.sin(state.clock.getElapsedTime()) * 0.2;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh ref={ref}>
                <sphereGeometry args={[2, 32, 32]} />
                <meshStandardMaterial color={color} wireframe transparent opacity={0.5} />
            </mesh>
        </Float>
    );
};

const AutomationGears = ({ color }: { color: string }) => {
    const ref1 = useRef<THREE.Mesh>(null);
    const ref2 = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (ref1.current) ref1.current.rotation.z = state.clock.getElapsedTime() * 0.5;
        if (ref2.current) ref2.current.rotation.z = -state.clock.getElapsedTime() * 0.5;
    });

    return (
        <group>
            <mesh ref={ref1} position={[-1.5, 0, 0]}>
                <torusKnotGeometry args={[1, 0.3, 100, 16]} />
                <meshStandardMaterial color={color} wireframe />
            </mesh>
            <mesh ref={ref2} position={[1.5, 0, 0]}>
                <torusGeometry args={[1.2, 0.2, 16, 100]} />
                <meshStandardMaterial color={color} wireframe />
            </mesh>
        </group>
    );
};

const DevCode = ({ color }: { color: string }) => {
    return (
        <group>
            {[...Array(10)].map((_, i) => (
                <Float key={i} speed={2} rotationIntensity={1} floatIntensity={2} position={[(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5]}>
                    <mesh>
                        <boxGeometry args={[0.2, 1, 0.05]} />
                        <meshBasicMaterial color={color} transparent opacity={0.6} />
                    </mesh>
                </Float>
            ))}
        </group>
    );
};

const ParallaxCamera = () => {
    const { camera, mouse } = useThree();
    const vec = new THREE.Vector3();

    useFrame(() => {
        // Smoothly interpolate camera position based on mouse coordinates
        // Mouse x and y are normalized between -1 and 1
        vec.set(mouse.x * 2, mouse.y * 2, camera.position.z);
        camera.position.lerp(vec, 0.05);
        camera.lookAt(0, 0, 0);
    });

    return null;
};

const Scene = ({ currentTheme }: { currentTheme: Theme }) => {
    const config = THEME_CONFIG[currentTheme];

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} />
            <ParallaxCamera />

            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color={config.secondary} />
            <spotLight position={[-10, -10, -10]} angle={0.3} penumbra={1} intensity={1} color={config.color} />

            {/* Antigravity Connected Particles Effect */}
            <ConnectedParticles color={config.color} />

            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <group>
                {currentTheme === 'AI' && <NeuralNetwork color={config.color} />}
                {currentTheme === 'ML' && <MorphingShape color={config.color} />}
                {currentTheme === 'Blockchain' && <BlockchainNodes color={config.color} />}
                {currentTheme === 'Research' && <ResearchHologram color={config.color} />}
                {currentTheme === 'Automation' && <AutomationGears color={config.color} />}
                {currentTheme === 'Dev' && <DevCode color={config.color} />}
            </group>
        </>
    );
};

// --- Main Component ---

const Hero = () => {
    const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const heroHighlights = useMemo(
        () => [
            {
                icon: Globe2,
                overline: 'Global Delivery',
                description: '50+ digital programmes executed across 10 countries.',
            },
            {
                icon: ShieldCheck,
                overline: 'Trusted Capability',
                description: 'Dedicated squads spanning AI, blockchain, cloud, and change.',
            },
            {
                icon: Sparkles,
                overline: 'Measured Impact',
                description: 'Outcome-driven roadmaps with governance and velocity dashboards.',
            },
        ],
        [],
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentThemeIndex((prev) => (prev + 1) % THEMES.length);
        }, 5000); // Change theme every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const currentTheme = THEMES[currentThemeIndex];
    const config = THEME_CONFIG[currentTheme];

    return (
        <div
            className={cn(
                'relative w-full h-screen overflow-hidden transition-colors duration-500',
                isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100',
            )}
        >
            {/* 3D Scene */}
            <div className="absolute inset-0 z-0">
                <Canvas
                    key={theme}
                    dpr={[1, 2]}
                    gl={{ antialias: true }}
                    onCreated={({ gl }) => {
                        gl.setClearColor(isDark ? new THREE.Color('#020617') : new THREE.Color('#f8fafc'));
                    }}
                >
                    <Scene currentTheme={currentTheme} />
                </Canvas>
            </div>

            {/* Overlay UI */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-center space-y-6 pointer-events-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-xl md:text-2xl font-bold tracking-[0.5em] text-cyan-400 uppercase mb-4 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
                            TechnoHeaven
                        </h2>
                    </motion.div>

                        <motion.h1
                            className={cn(
                                'text-5xl md:text-7xl font-extrabold tracking-tight transition-colors',
                                isDark ? 'text-white' : 'text-slate-900',
                            )}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                                Innovation.
                            </span>
                            <br />
                            Intelligence. Future.
                        </motion.h1>

                    <AnimatePresence mode='wait'>
                        <motion.p
                            key={currentTheme}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5 }}
                            className={cn(
                                'text-lg md:text-xl font-light tracking-wide h-8 transition-colors',
                                isDark ? 'text-gray-300' : 'text-slate-600',
                            )}
                        >
                            {config.text}
                        </motion.p>
                    </AnimatePresence>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex gap-4 justify-center mt-8"
                    >
                        <Link to="/contact">
                            <button className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                                Get Started
                            </button>
                        </Link>
                        <Link to="/services">
                            <button
                                className={cn(
                                    'px-8 py-3 font-bold rounded-full transition-all transform hover:scale-105 shadow-[0_0_10px_rgba(168,85,247,0.25)]',
                                    isDark
                                        ? 'border border-purple-500 text-purple-400 hover:bg-purple-500/10'
                                        : 'border border-purple-400 text-purple-600 hover:bg-purple-100',
                                )}
                            >
                                Explore
                            </button>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="mt-12 grid w-full max-w-4xl grid-cols-1 gap-4 px-6 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {heroHighlights.map((highlight) => {
                            const Icon = highlight.icon;
                            return (
                                <div
                                    key={highlight.overline}
                                    className={cn(
                                        'flex h-full items-start gap-3 rounded-2xl border px-5 py-4 text-left shadow-lg transition backdrop-blur hover:-translate-y-1 hover:shadow-xl',
                                        isDark
                                            ? 'border-slate-800/70 bg-slate-900/70 text-slate-200'
                                            : 'border-slate-200/80 bg-white/80 text-slate-700',
                                    )}
                                >
                                    <Icon className="mt-1 h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">
                                            {highlight.overline}
                                        </p>
                                        <p className="mt-2 text-sm leading-relaxed">
                                            {highlight.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className={cn(
                    'absolute bottom-8 left-1/2 z-20 -translate-x-1/2 cursor-pointer transition-colors',
                    isDark ? 'text-cyan-400/60 hover:text-cyan-400' : 'text-cyan-500/60 hover:text-cyan-500',
                )}
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            >
                <ChevronDown size={48} />
            </motion.div>

            {/* Gradient Overlay for better text readability */}
            <div
                className={cn(
                    'absolute inset-0 pointer-events-none transition-opacity duration-500',
                    isDark
                        ? 'bg-gradient-to-t from-slate-950 via-slate-900/20 to-slate-900 opacity-70'
                        : 'bg-gradient-to-t from-white via-white/50 to-slate-100 opacity-80',
                )}
            />
        </div>
    );
};

export default Hero;
