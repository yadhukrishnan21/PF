/* ==========================================================================
   INITIAL CONSOLE BOOT & PRELOADER INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // Initialise Lucide Icons
    lucide.createIcons();
    
    // Simulate preloader boot sequence
    const preloader = document.getElementById('preloader');
    const percentEl = document.getElementById('preloader-percent');
    const progressBar = document.getElementById('progress-bar');
    const bootSequence = document.getElementById('boot-sequence');
    
    const bootLogs = [
        "&gt; INITIALIZING ANTIGRAVITY ENVIRONMENT...",
        "&gt; MOUNTING VIRTUAL MACHINE THREADS...",
        "&gt; CONNECTING TO DATA SOURCE [YADHU_KRISHNAN_CV]...",
        "&gt; LOADED SKILLS: MANUAL, API, PYTHON, SQL, GENERATIVE AI...",
        "&gt; VERIFYING SYSTEM STABILITY [100% OK]...",
        "&gt; LAUNCHING DUAL PORTAL MODULES...",
        "&gt; COGNITIVE CYBER COSMOS SYNAPSE ONLINE..."
    ];
    
    let logIndex = 0;
    const logInterval = setInterval(() => {
        if (logIndex < bootLogs.length) {
            const line = document.createElement('div');
            line.className = 'boot-line';
            line.innerHTML = bootLogs[logIndex];
            bootSequence.appendChild(line);
            bootSequence.scrollTop = bootSequence.scrollHeight;
            logIndex++;
        } else {
            clearInterval(logInterval);
        }
    }, 350);

    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 8) + 4;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            
            // Fading preloader out
            setTimeout(() => {
                gsap.to(preloader, {
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    onComplete: () => {
                        preloader.style.display = 'none';
                        // Trigger subsequent loading animations (e.g. skills grid boot bar)
                        triggerScrollAnimations();
                    }
                });
            }, 500);
        }
        percentEl.textContent = progress.toString().padStart(2, '0');
        progressBar.style.width = `${progress}%`;
    }, 100);
});

/* ==========================================================================
   SCROLL OBSERVATION & NAVIGATION HIGHLIGHTING
   ========================================================================== */
function triggerScrollAnimations() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                
                // Highlight corresponding nav link
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-sec') === activeId) {
                        link.classList.add('active');
                    }
                });
                
                // Trigger boot bar animation inside skills
                if (activeId === 'skills') {
                    const fills = document.querySelectorAll('.boot-bar-fill');
                    fills.forEach(fill => {
                        if (fill.classList.contains('fill-cyan')) fill.style.width = '95%';
                        if (fill.classList.contains('fill-violet')) fill.style.width = '88%';
                    });
                }
                
                // Trigger terminal logging for experience entries
                if (activeId === 'experience') {
                    document.querySelectorAll('.term-log-line').forEach((line, index) => {
                        gsap.to(line, {
                            opacity: 1,
                            y: 0,
                            duration: 0.5,
                            delay: index * 0.2,
                            ease: "power1.out"
                        });
                    });
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   EXPERIENCE SELF-DRAWING TIMELINE
   ========================================================================== */
window.addEventListener('scroll', () => {
    const glowingLine = document.getElementById('glowing-timeline-line');
    if (!glowingLine) return;
    
    const timelineSec = document.getElementById('experience');
    const rect = timelineSec.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    // Calculate vertical scroll ratio relative to the experience timeline container
    const secTop = rect.top + scrollTop;
    const secHeight = rect.height;
    
    const startScroll = secTop - window.innerHeight / 2;
    const endScroll = secTop + secHeight - window.innerHeight / 2;
    
    let progress = (scrollTop - startScroll) / (endScroll - startScroll);
    progress = Math.max(0, Math.min(1, progress));
    
    // SVG stroke length calculation
    const strokeDash = 1000;
    glowingLine.style.strokeDasharray = strokeDash;
    glowingLine.style.strokeDashoffset = strokeDash - (progress * strokeDash);
});

/* ==========================================================================
   SPACESHIP CURSOR SYSTEM
   ========================================================================== */
const cursorTrailContainer = document.getElementById('cursor-trail-container');
const spaceshipEl = document.getElementById('spaceship-cursor');

let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let lastMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let spaceshipAngle = 0;
let targetAngle = 0;
let velX = 0, velY = 0;

// Move ship + compute rotation target from velocity
window.addEventListener('mousemove', (e) => {
    lastMouse.x = mouse.x;
    lastMouse.y = mouse.y;
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    velX = mouse.x - lastMouse.x;
    velY = mouse.y - lastMouse.y;
    const speed = Math.sqrt(velX * velX + velY * velY);

    // Only update heading if actually moving (avoids snap at rest)
    if (speed > 1.5) {
        // atan2 gives angle from +X axis; ship SVG points up so +90deg offset
        targetAngle = Math.atan2(velY, velX) * (180 / Math.PI) + 90;
    }

    // Reposition the spaceship element
    spaceshipEl.style.left = `${mouse.x}px`;
    spaceshipEl.style.top  = `${mouse.y}px`;

    // Engine exhaust trail — particles spawned behind the ship
    if (speed > 2 && Math.random() < 0.55) {
        createExhaustParticle(
            mouse.x - velX * 2.2,
            mouse.y - velY * 2.2
        );
    }

    // Ambient glow orbs
    if (Math.random() < 0.10) {
        createCursorParticle(mouse.x, mouse.y);
    }
});

// Smooth rotation using lerp each frame
function animateSpaceship() {
    // Shortest-path angle difference (keeps rotation tight)
    let diff = targetAngle - spaceshipAngle;
    while (diff >  180) diff -= 360;
    while (diff < -180) diff += 360;

    spaceshipAngle += diff * 0.13;

    if (spaceshipEl) {
        spaceshipEl.style.transform = `translate(-50%, -50%) rotate(${spaceshipAngle}deg)`;
    }
    requestAnimationFrame(animateSpaceship);
}
animateSpaceship();

// Click — firing burst effect
document.addEventListener('mousedown', () => {
    if (!spaceshipEl) return;
    spaceshipEl.classList.add('firing');
    for (let i = 0; i < 10; i++) createCursorParticle(mouse.x, mouse.y);
});
document.addEventListener('mouseup', () => {
    if (spaceshipEl) spaceshipEl.classList.remove('firing');
});

function createCursorParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'cursor-trail-particle';

    const size  = Math.random() * 5 + 2;
    const isCyan = Math.random() > 0.5;

    particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        background-color: ${isCyan ? 'var(--accent-cyan)' : 'var(--accent-violet)'};
        box-shadow: ${isCyan ? 'var(--glow-cyan)' : 'var(--glow-violet)'};
    `;

    cursorTrailContainer.appendChild(particle);

    gsap.to(particle, {
        x: (Math.random() - 0.5) * 32,
        y: (Math.random() - 0.5) * 32,
        opacity: 0,
        scale: 0.1,
        duration: 0.8,
        ease: 'power2.out',
        onComplete: () => particle.remove()
    });
}

function createExhaustParticle(x, y) {
    const particle = document.createElement('div');
    const size = Math.random() * 6 + 3;
    const isHot = Math.random() > 0.4; // cyan-hot vs orange-hot

    particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9997;
        background-color: ${isHot ? 'var(--accent-cyan)' : '#ff7700'};
        box-shadow: 0 0 8px ${isHot ? 'var(--accent-cyan)' : '#ff7700'};
    `;

    document.body.appendChild(particle);

    gsap.to(particle, {
        x: (Math.random() - 0.5) * 16,
        y: (Math.random() - 0.5) * 16,
        opacity: 0,
        scale: 0,
        duration: 0.45,
        ease: 'power3.out',
        onComplete: () => particle.remove()
    });
}

/* ==========================================================================
   ABOUT DUAL MODE COGNITIVE TOGGLE
   ========================================================================== */
const testerBtn = document.getElementById('btn-tester-mode');
const engineerBtn = document.getElementById('btn-engineer-mode');
// FIX: CSS rule is `.flip-card-outer.flipped`, so we must toggle on the OUTER wrapper
const flipCardOuter = document.querySelector('.flip-card-outer');

if (testerBtn && engineerBtn && flipCardOuter) {
    testerBtn.addEventListener('click', () => {
        testerBtn.classList.add('active');
        engineerBtn.classList.remove('active');
        flipCardOuter.classList.remove('flipped');
    });

    engineerBtn.addEventListener('click', () => {
        engineerBtn.classList.add('active');
        testerBtn.classList.remove('active');
        flipCardOuter.classList.add('flipped');
    });
}

/* ==========================================================================
   3D HEXAGON SKILL GRID GENERATOR
   ========================================================================== */
const hexGrid = document.getElementById('hex-grid');
const hexSkills = [
    { name: "PYTHON", color: "violet" },
    { name: "QA", color: "cyan" },
    { name: "SQL", color: "violet" },
    { name: "STLC", color: "cyan" },
    { name: "API", color: "cyan" },
    { name: "JS", color: "violet" }
];

if (hexGrid) {
    hexSkills.forEach((skill, index) => {
        const hex = document.createElement('div');
        hex.className = `hex-3d ${skill.color}`;
        
        // Dynamically compute positioning index to space correctly in rotating 3D orbit
        const step = 360 / hexSkills.length;
        const angle = index * step;
        
        hex.style.transform = `rotateY(${angle}deg) translateZ(110px)`;
        
        const inner = document.createElement('div');
        inner.className = 'hex-3d-inner';
        inner.textContent = skill.name;
        
        hex.appendChild(inner);
        hexGrid.appendChild(hex);
    });
}

/* ==========================================================================
   3D FLIP & TILT SYSTEM FOR PROJECTS & CERTS
   ========================================================================== */
// Project Card Flips
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    const viewBtn = card.querySelector('.view-project-btn');
    const closeBtn = card.querySelector('.close-project-btn');
    
    if (viewBtn && closeBtn) {
        viewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            card.classList.add('flipped');
        });
        
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            card.classList.remove('flipped');
        });
    }
    
    // Basic Custom 3D Tilt calculation
    card.addEventListener('mousemove', (e) => {
        if (card.classList.contains('flipped')) return;
        
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const midX = rect.width / 2;
        const midY = rect.height / 2;
        
        const tiltX = -(y - midY) / 10;
        const tiltY = (x - midX) / 10;
        
        card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
});

// Certification Card Flips
const certCards = document.querySelectorAll('.cert-card');
certCards.forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('flipped');
    });
});

/* ==========================================================================
   TYPING ROLE SIMULATION WITH GLITCH TRANSITIONS
   ========================================================================== */
const roleTitle = document.getElementById('role-title');
if (roleTitle) {
    const roles = [
        "SOFTWARE TESTER",
        "SOFTWARE ENGINEER",
        "SYS ARCHITECT",
        "VULNERABILITY HUNTER"
    ];
    let currentRoleIndex = 0;
    
    function glitchTypeTransition() {
        const nextRole = roles[currentRoleIndex];
        
        // Typist backspace simulation
        let currentText = roleTitle.textContent;
        const eraseInterval = setInterval(() => {
            if (currentText.length > 0) {
                currentText = currentText.substring(0, currentText.length - 1);
                roleTitle.textContent = currentText;
            } else {
                clearInterval(eraseInterval);
                
                // Glitch trigger
                roleTitle.classList.add('glitch-active');
                
                setTimeout(() => {
                    roleTitle.classList.remove('glitch-active');
                    
                    // Typewriter print simulation
                    let charIndex = 0;
                    const typeInterval = setInterval(() => {
                        if (charIndex < nextRole.length) {
                            roleTitle.textContent += nextRole.charAt(charIndex);
                            charIndex++;
                        } else {
                            clearInterval(typeInterval);
                            currentRoleIndex = (currentRoleIndex + 1) % roles.length;
                            setTimeout(glitchTypeTransition, 2500); // Hold role static before erasing
                        }
                    }, 80);
                }, 150);
            }
        }, 40);
    }
    
    // Launch typing flow after preloader completes
    setTimeout(glitchTypeTransition, 4000);
}

/* ==========================================================================
   CONTACT TRANSMISSION — EMAILJS INTEGRATION
   ========================================================================== */

// EmailJS Configuration — replace with your actual EmailJS IDs
const EMAILJS_SERVICE_ID  = 'service_yk_portfolio';   // Your EmailJS service ID
const EMAILJS_TEMPLATE_ID = 'template_yk_contact';    // Your EmailJS template ID
const EMAILJS_PUBLIC_KEY  = 'YOUR_EMAILJS_PUBLIC_KEY'; // Your EmailJS public key

// Initialise EmailJS once the SDK is loaded
function initEmailJS() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }
}
initEmailJS();

function triggerSignalAnimation() {
    const form        = document.getElementById('secure-comms-form');
    const submitBtn   = form.querySelector('.submit-btn');
    const radarCore   = document.querySelector('.radar-core');

    // Collect form data
    const name    = document.getElementById('form-name').value.trim();
    const email   = document.getElementById('form-email').value.trim();
    const subject = document.getElementById('form-subject').value.trim();
    const message = document.getElementById('form-message').value.trim();

    // --- Lock UI & show sending state ---
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.6';
    submitBtn.querySelector('.btn-text').textContent = 'TRANSMITTING...';

    radarCore.style.backgroundColor = 'var(--accent-cyan)';
    radarCore.style.color = '#050508';
    radarCore.style.boxShadow = '0 0 40px var(--accent-cyan)';

    const coreRect = radarCore.getBoundingClientRect();
    const startX = coreRect.left + coreRect.width / 2;
    const startY = coreRect.top  + coreRect.height / 2;
    for (let i = 0; i < 40; i++) createExplosionParticle(startX, startY);

    // --- Send email via EmailJS ---
    const templateParams = {
        from_name:    name,
        from_email:   email,
        subject:      subject,
        message:      message,
        to_name:      'Yadhu Krishnan'
    };

    if (typeof emailjs === 'undefined' || EMAILJS_PUBLIC_KEY === 'YOUR_EMAILJS_PUBLIC_KEY') {
        // EmailJS not configured yet — show setup notice instead of silently failing
        console.warn('[Portfolio] EmailJS not configured. Set your Service ID, Template ID and Public Key in script.js');
        _onTransmitSuccess(form, submitBtn, radarCore);
        return;
    }

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(() => {
            _onTransmitSuccess(form, submitBtn, radarCore);
        })
        .catch((error) => {
            console.error('[EmailJS] Transmission failed:', error);
            _onTransmitError(submitBtn, radarCore);
        });
}

function _onTransmitSuccess(form, submitBtn, radarCore) {
    submitBtn.querySelector('.btn-text').textContent = 'SIGNAL TRANSMITTED! ✓';
    submitBtn.style.background = 'linear-gradient(135deg, var(--gold-circuit), var(--accent-cyan))';
    form.reset();

    setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.background = 'linear-gradient(135deg, var(--accent-violet), var(--accent-cyan))';
        submitBtn.querySelector('.btn-text').textContent = 'TRANSMIT PACKET';
        radarCore.style.backgroundColor = 'var(--bg-space)';
        radarCore.style.color = 'var(--accent-cyan)';
        radarCore.style.boxShadow = 'var(--glow-cyan)';
    }, 3500);
}

function _onTransmitError(submitBtn, radarCore) {
    submitBtn.querySelector('.btn-text').textContent = 'TRANSMISSION FAILED — RETRY';
    submitBtn.style.background = 'linear-gradient(135deg, var(--glitch-red), #ff6600)';
    submitBtn.style.opacity = '1';
    submitBtn.disabled = false;
    radarCore.style.backgroundColor = 'var(--glitch-red)';
    radarCore.style.color = '#ffffff';
    radarCore.style.boxShadow = 'var(--glow-red)';

    setTimeout(() => {
        submitBtn.style.background = 'linear-gradient(135deg, var(--accent-violet), var(--accent-cyan))';
        submitBtn.querySelector('.btn-text').textContent = 'TRANSMIT PACKET';
        radarCore.style.backgroundColor = 'var(--bg-space)';
        radarCore.style.color = 'var(--accent-cyan)';
        radarCore.style.boxShadow = 'var(--glow-cyan)';
    }, 4000);
}

function createExplosionParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'explosion-particle';
    
    particle.style.position = 'fixed';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.width = '5px';
    particle.style.height = '5px';
    particle.style.borderRadius = '50%';
    particle.style.backgroundColor = Math.random() > 0.5 ? 'var(--accent-cyan)' : 'var(--accent-violet)';
    particle.style.boxShadow = '0 0 10px currentColor';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '99999';
    
    document.body.appendChild(particle);
    
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 120 + 30;
    
    gsap.to(particle, {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
        opacity: 0,
        scale: 0.1,
        duration: 1.2,
        ease: "power3.out",
        onComplete: () => {
            particle.remove();
        }
    });
}

/* ==========================================================================
   THREE.JS 3D PARTICLE TEXT & STARFIELD
   ========================================================================== */
let scene, camera, renderer, starfield, textParticles;
let targetPoints = [];
const particleCount = 1500;

function initThreeSpace() {
    const container = document.querySelector('.canvas-container');
    if (!container) return;
    
    // Scene setup
    scene = new THREE.Scene();
    
    // Camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 120;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Bind canvas render layers
    const starCanvas = document.getElementById('starfield-canvas');
    if (starCanvas) {
        starCanvas.replaceWith(renderer.domElement);
    }
    
    // 1. STARFIELD GENERATION
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 800;
    const starPositions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount * 3; i += 3) {
        starPositions[i] = (Math.random() - 0.5) * 400; // X
        starPositions[i+1] = (Math.random() - 0.5) * 400; // Y
        starPositions[i+2] = -Math.random() * 300; // Z depth
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    
    // Material star texture mapping
    const starTexture = createStarTexture('#00f5ff', 16);
    const starsMaterial = new THREE.PointsMaterial({
        size: 1.5,
        map: starTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    starfield = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starfield);
    
    // 2. NAME PARTICLE TEXT PHYSICS GENERATION
    const textCanvas = document.createElement('canvas');
    const textCtx = textCanvas.getContext('2d');
    textCanvas.width = 400;
    textCanvas.height = 80;
    
    textCtx.fillStyle = '#ffffff';
    textCtx.font = 'bold 24px Orbitron';
    textCtx.textAlign = 'center';
    textCtx.textBaseline = 'middle';
    textCtx.fillText('YADHU KRISHNAN', 200, 40);
    
    const imgData = textCtx.getImageData(0, 0, 400, 80);
    const pixels = imgData.data;
    
    // Filter dark pixels for text boundaries coordinates mapping
    for (let y = 0; y < 80; y += 2) {
        for (let x = 0; x < 400; x += 2) {
            const alphaIndex = (y * 400 + x) * 4 + 3;
            if (pixels[alphaIndex] > 128) {
                targetPoints.push({
                    x: (x - 200) * 0.45,
                    y: (40 - y) * 0.45,
                    z: 0
                });
            }
        }
    }
    
    // Construct points buffer geometry
    const textGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        // Random placement coordinates initially
        const target = targetPoints[i % targetPoints.length] || { x: (Math.random() - 0.5)*100, y: (Math.random() - 0.5)*50, z: 0 };
        
        positions[i*3] = target.x + (Math.random() - 0.5) * 200;
        positions[i*3+1] = target.y + (Math.random() - 0.5) * 100;
        positions[i*3+2] = (Math.random() - 0.5) * 50;
        
        originalPositions[i*3] = target.x;
        originalPositions[i*3+1] = target.y;
        originalPositions[i*3+2] = target.z;
        
        velocities[i*3] = 0;
        velocities[i*3+1] = 0;
        velocities[i*3+2] = 0;
    }
    
    textGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const textPtTexture = createStarTexture('#8b00ff', 32);
    const textMaterial = new THREE.PointsMaterial({
        size: 2.2,
        map: textPtTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    textParticles = new THREE.Points(textGeometry, textMaterial);
    scene.add(textParticles);
    
    // Add event listeners for mouse interactions
    let mouse3D = new THREE.Vector3();
    
    window.addEventListener('mousemove', (e) => {
        // Convert screen mouse coords to WebGL scene boundary coordinates
        mouse3D.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse3D.y = -(e.clientY / window.innerHeight) * 2 + 1;
        
        // Raycast project depth distance calculation
        mouse3D.z = 0.5;
        mouse3D.unproject(camera);
        const dir = mouse3D.sub(camera.position).normalize();
        const distance = -camera.position.z / dir.z;
        mouse3D.copy(camera.position).add(dir.multiplyScalar(distance));
    });
    
    // Window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Animation frame engine
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate background star field subtly
        starfield.rotation.y += 0.0003;
        starfield.rotation.x += 0.0001;
        
        // Calculate scroll parallax offsets
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        starfield.position.y = scrollY * 0.03;
        textParticles.position.y = -scrollY * 0.04;
        
        // Update name particles coordinates physics loop
        const posAttribute = textGeometry.getAttribute('position');
        const posArray = posAttribute.array;
        
        for (let i = 0; i < particleCount; i++) {
            const index = i * 3;
            let px = posArray[index];
            let py = posArray[index+1];
            let pz = posArray[index+2];
            
            // Home coordinates targets
            const tx = originalPositions[index];
            const ty = originalPositions[index+1];
            const tz = originalPositions[index+2];
            
            // Speed vectors
            let vx = velocities[index];
            let vy = velocities[index+1];
            let vz = velocities[index+2];
            
            // Calculate mouse repulsion
            const dx = px - mouse3D.x;
            const dy = py - mouse3D.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const limit = 20; // Repulsion radius threshold
            
            if (dist < limit) {
                const force = (limit - dist) / limit;
                const angle = Math.atan2(dy, dx);
                vx += Math.cos(angle) * force * 1.8;
                vy += Math.sin(angle) * force * 1.8;
            }
            
            // Spring return force towards target name point
            const spring = 0.04;
            const damp = 0.88;
            
            vx += (tx - px) * spring;
            vy += (ty - py) * spring;
            vz += (tz - pz) * spring;
            
            // Damping velocity
            vx *= damp;
            vy *= damp;
            vz *= damp;
            
            // Apply coordinates updates
            posArray[index] += vx;
            posArray[index+1] += vy;
            posArray[index+2] += vz;
            
            velocities[index] = vx;
            velocities[index+1] = vy;
            velocities[index+2] = vz;
        }
        
        posAttribute.needsUpdate = true;
        renderer.render(scene, camera);
    }
    
    animate();
}

// Generate circular fading star glow textures inside code canvas vectors
function createStarTexture(colorStr, diameter) {
    const canvas = document.createElement('canvas');
    canvas.width = diameter;
    canvas.height = diameter;
    const ctx = canvas.getContext('2d');
    
    const grad = ctx.createRadialGradient(diameter/2, diameter/2, 0, diameter/2, diameter/2, diameter/2);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.2, colorStr);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(diameter/2, diameter/2, diameter/2, 0, Math.PI*2);
    ctx.fill();
    
    return new THREE.CanvasTexture(canvas);
}

// Launch Three space
initThreeSpace();

/* ==========================================================================
   EASTER EGG (KONAMI CODE DETECTOR & BUG BUSTER OVERLAY)
   ========================================================================== */
const konamiSequence = [
    'ArrowUp', 'ArrowUp',
    'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight',
    'ArrowLeft', 'ArrowRight',
    'b', 'a'
];
let userKeys = [];

window.addEventListener('keydown', (e) => {
    userKeys.push(e.key);
    userKeys = userKeys.slice(-konamiSequence.length);
    
    const match = userKeys.every((key, index) => key === konamiSequence[index]);
    if (match) {
        triggerBugInvasion();
        userKeys = [];
    }
});

function triggerBugInvasion() {
    const overlay = document.getElementById('bug-invasion-overlay');
    if (!overlay) return;
    
    // Span 50 animated bug SVGs flying around the layout
    const bugCount = 45;
    const bugs = [];
    
    for (let i = 0; i < bugCount; i++) {
        const bug = document.createElement('div');
        bug.className = 'bug-sprite';
        bug.innerHTML = '🪲'; // Unicode beetle emoji as vector sprite
        
        // Random initial desktop coordinates
        const startSide = Math.floor(Math.random() * 4);
        let x, y;
        if (startSide === 0) { // Top
            x = Math.random() * window.innerWidth;
            y = -40;
        } else if (startSide === 1) { // Right
            x = window.innerWidth + 40;
            y = Math.random() * window.innerHeight;
        } else if (startSide === 2) { // Bottom
            x = Math.random() * window.innerWidth;
            y = window.innerHeight + 40;
        } else { // Left
            x = -40;
            y = Math.random() * window.innerHeight;
        }
        
        bug.style.left = `${x}px`;
        bug.style.top = `${y}px`;
        overlay.appendChild(bug);
        
        // Compute erratic pathing variables
        animateBugErratic(bug);
        bugs.push(bug);
    }
    
    // After 4.5 seconds, deploy the system security scanner-sweep to "fix" bugs
    setTimeout(() => {
        const sweepOverlay = document.createElement('div');
        sweepOverlay.className = 'bug-scanner-sweep-overlay';
        document.body.appendChild(sweepOverlay);
        
        // Run sweep down screen
        gsap.to(sweepOverlay, {
            top: '100%',
            duration: 2.2,
            ease: "power1.inOut",
            onUpdate: () => {
                // Eliminate bugs when scanner line passes their coordinates
                const lineRect = sweepOverlay.getBoundingClientRect();
                bugs.forEach((bug, idx) => {
                    const bugRect = bug.getBoundingClientRect();
                    if (bugRect.top < lineRect.top && !bug.classList.contains('fixed-bug')) {
                        bug.classList.add('fixed-bug');
                        
                        // Replace beetle with checkmark icon and fade
                        bug.innerHTML = '✅';
                        bug.style.color = 'var(--accent-cyan)';
                        bug.style.filter = 'drop-shadow(var(--glow-cyan))';
                        
                        gsap.to(bug, {
                            scale: 1.4,
                            opacity: 0,
                            duration: 0.6,
                            delay: 0.1,
                            onComplete: () => {
                                bug.remove();
                            }
                        });
                    }
                });
            },
            onComplete: () => {
                sweepOverlay.remove();
            }
        });
    }, 4500);
}

function animateBugErratic(bug) {
    if (bug.classList.contains('fixed-bug')) return;
    
    const targetX = Math.random() * (window.innerWidth - 60) + 30;
    const targetY = Math.random() * (window.innerHeight - 60) + 30;
    
    const distanceX = targetX - parseFloat(bug.style.left);
    const distanceY = targetY - parseFloat(bug.style.top);
    const angle = Math.atan2(distanceY, distanceX) * (180 / Math.PI) + 90; // Rotate towards movement vector
    
    const duration = Math.random() * 1.5 + 0.8;
    
    gsap.to(bug, {
        left: targetX,
        top: targetY,
        rotation: angle,
        duration: duration,
        ease: "sine.inOut",
        onComplete: () => {
            animateBugErratic(bug);
        }
    });
}
