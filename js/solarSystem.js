class SolarSystem {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.planets = {};
        this.planetMeshes = {};
        this.clock = new THREE.Clock();
        this.isPaused = false;
        this.selectedPlanet = null;
        this.stars = null;
        this.ambientLight = null;
        this.pointLight = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // Camera controls variables
        this.mouseDown = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.cameraRadius = 150;
        this.cameraTheta = 0;
        this.cameraPhi = Math.PI / 3;
        
        this.init();
        this.setupEventListeners();
        this.animate();
    }
    
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.updateCameraPosition();
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Add renderer to DOM
        document.getElementById('canvas-container').appendChild(this.renderer.domElement);
        
        // Create lighting
        this.createLighting();
        
        // Create stars background
        this.createStars();
        
        // Create solar system
        this.createSolarSystem();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    createLighting() {
        // Ambient light for general illumination
        this.ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(this.ambientLight);
        
        // Point light from the sun
        this.pointLight = new THREE.PointLight(0xFFF000, 2, 200);
        this.pointLight.position.set(0, 0, 0);
        this.pointLight.castShadow = true;
        this.pointLight.shadow.mapSize.width = 2048;
        this.pointLight.shadow.mapSize.height = 2048;
        this.scene.add(this.pointLight);
    }
    
    createStars() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 2000;
        const positions = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 400;     // x
            positions[i + 1] = (Math.random() - 0.5) * 400; // y
            positions[i + 2] = (Math.random() - 0.5) * 400; // z
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const starMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 1,
            transparent: true,
            opacity: 0.8
        });
        
        this.stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.stars);
    }
    
    createSolarSystem() {
        // Create Sun
        const sunGeometry = new THREE.SphereGeometry(PLANET_DATA.sun.radius, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({ 
            color: PLANET_DATA.sun.color,
            emissive: PLANET_DATA.sun.color,
            emissiveIntensity: 0.3
        });
        const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
        sunMesh.userData = { name: 'sun', data: PLANET_DATA.sun };
        this.scene.add(sunMesh);
        this.planetMeshes.sun = sunMesh;
        
        // Create planets
        Object.keys(PLANET_DATA).forEach(planetKey => {
            if (planetKey !== 'sun') {
                this.createPlanet(planetKey, PLANET_DATA[planetKey]);
            }
        });
    }
    
    createPlanet(name, data) {
        // Create planet group for orbital movement
        const planetGroup = new THREE.Group();
        
        // Create planet mesh
        const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
        const material = new THREE.MeshLambertMaterial({ 
            color: data.color,
            transparent: true,
            opacity: 0.9
        });
        const planetMesh = new THREE.Mesh(geometry, material);
        
        // Position planet at orbital distance
        planetMesh.position.x = data.distance;
        planetMesh.castShadow = true;
        planetMesh.receiveShadow = true;
        planetMesh.userData = { name, data };
        
        // Create orbit line
        const orbitGeometry = new THREE.RingGeometry(data.distance - 0.1, data.distance + 0.1, 64);
        const orbitMaterial = new THREE.MeshBasicMaterial({
            color: 0x333333,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide
        });
        const orbitLine = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbitLine.rotation.x = Math.PI / 2;
        this.scene.add(orbitLine);
        
        // Add planet to group and scene
        planetGroup.add(planetMesh);
        this.scene.add(planetGroup);
        
        // Store references
        this.planets[name] = planetGroup;
        this.planetMeshes[name] = planetMesh;
        
        // Set initial random position in orbit
        const initialAngle = Math.random() * Math.PI * 2;
        planetGroup.rotation.y = initialAngle;
    }
    
    setupEventListeners() {
        const canvas = this.renderer.domElement;
        
        // Mouse controls for camera
        canvas.addEventListener('mousedown', (event) => {
            this.mouseDown = true;
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
        });
        
        canvas.addEventListener('mousemove', (event) => {
            if (this.mouseDown) {
                const deltaX = event.clientX - this.mouseX;
                const deltaY = event.clientY - this.mouseY;
                
                this.cameraTheta -= deltaX * 0.01;
                this.cameraPhi -= deltaY * 0.01;
                this.cameraPhi = Math.max(0.1, Math.min(Math.PI - 0.1, this.cameraPhi));
                
                this.updateCameraPosition();
                
                this.mouseX = event.clientX;
                this.mouseY = event.clientY;
            }
        });
        
        canvas.addEventListener('mouseup', () => {
            this.mouseDown = false;
        });
        
        // Mouse wheel for zoom
        canvas.addEventListener('wheel', (event) => {
            event.preventDefault();
            this.cameraRadius += event.deltaY * 0.1;
            this.cameraRadius = Math.max(50, Math.min(300, this.cameraRadius));
            this.updateCameraPosition();
        });
        
        // Click detection for planet selection
        canvas.addEventListener('click', (event) => {
            if (this.mouseDown) return; // Ignore clicks during drag
            
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
            this.raycaster.setFromCamera(this.mouse, this.camera);
            
            const intersects = this.raycaster.intersectObjects(
                Object.values(this.planetMeshes)
            );
            
            if (intersects.length > 0) {
                const clickedPlanet = intersects[0].object;
                this.selectPlanet(clickedPlanet.userData.name);
            } else {
                this.deselectPlanet();
            }
        });
    }
    
    updateCameraPosition() {
        const x = this.cameraRadius * Math.sin(this.cameraPhi) * Math.cos(this.cameraTheta);
        const y = this.cameraRadius * Math.cos(this.cameraPhi);
        const z = this.cameraRadius * Math.sin(this.cameraPhi) * Math.sin(this.cameraTheta);
        
        this.camera.position.set(x, y, z);
        this.camera.lookAt(0, 0, 0);
    }
    
    selectPlanet(planetName) {
        this.selectedPlanet = planetName;
        const planetData = PLANET_DATA[planetName];
        
        // Show info panel
        const infoPanel = document.getElementById('info-panel');
        const planetNameEl = document.getElementById('planet-name');
        const planetDescription = document.getElementById('planet-description');
        const planetStats = document.getElementById('planet-stats');
        
        planetNameEl.textContent = planetData.name;
        planetDescription.textContent = planetData.description;
        planetStats.textContent = planetData.stats;
        
        infoPanel.classList.add('visible');
        
        // Highlight selected planet
        Object.keys(this.planetMeshes).forEach(name => {
            const mesh = this.planetMeshes[name];
            if (name === planetName) {
                mesh.material.emissive.setHex(0x444444);
                mesh.material.emissiveIntensity = 0.3;
            } else {
                mesh.material.emissive.setHex(0x000000);
                mesh.material.emissiveIntensity = 0;
            }
        });
    }
    
    deselectPlanet() {
        this.selectedPlanet = null;
        document.getElementById('info-panel').classList.remove('visible');
        
        // Remove highlights
        Object.keys(this.planetMeshes).forEach(name => {
            const mesh = this.planetMeshes[name];
            if (name !== 'sun') {
                mesh.material.emissive.setHex(0x000000);
                mesh.material.emissiveIntensity = 0;
            }
        });
    }
    
    updatePlanetSpeed(planetName, speed) {
        if (PLANET_DATA[planetName] && planetName !== 'sun') {
            PLANET_DATA[planetName].speed = speed;
        }
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        return this.isPaused;
    }
    
    resetSpeeds() {
        // Reset to original speeds
        const originalSpeeds = {
            mercury: 0.02,
            venus: 0.015,
            earth: 0.01,
            mars: 0.008,
            jupiter: 0.005,
            saturn: 0.003,
            uranus: 0.002,
            neptune: 0.001
        };
        
        Object.keys(originalSpeeds).forEach(planet => {
            PLANET_DATA[planet].speed = originalSpeeds[planet];
        });
    }
    
    zoomCamera(direction) {
        this.cameraRadius += direction * 20;
        this.cameraRadius = Math.max(50, Math.min(300, this.cameraRadius));
        this.updateCameraPosition();
    }
    
    resetCamera() {
        this.cameraRadius = 150;
        this.cameraTheta = 0;
        this.cameraPhi = Math.PI / 3;
        this.updateCameraPosition();
    }
    
    toggleTheme() {
        const body = document.body;
        body.classList.toggle('light-theme');
        
        if (body.classList.contains('light-theme')) {
            // Light theme
            this.scene.background = new THREE.Color(0x87CEEB);
            this.stars.material.opacity = 0.3;
            this.ambientLight.intensity = 0.6;
        } else {
            // Dark theme
            this.scene.background = new THREE.Color(0x000000);
            this.stars.material.opacity = 0.8;
            this.ambientLight.intensity = 0.3;
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (!this.isPaused) {
            const delta = this.clock.getDelta();
            
            // Rotate sun
            if (this.planetMeshes.sun) {
                this.planetMeshes.sun.rotation.y += 0.005;
            }
            
            // Animate planets
            Object.keys(this.planets).forEach(planetName => {
                const planetGroup = this.planets[planetName];
                const planetMesh = this.planetMeshes[planetName];
                const planetData = PLANET_DATA[planetName];
                
                if (planetGroup && planetData) {
                    // Orbital movement
                    planetGroup.rotation.y += planetData.speed;
                    
                    // Planet rotation
                    if (planetMesh && planetData.rotationSpeed) {
                        planetMesh.rotation.y += planetData.rotationSpeed;
                    }
                }
            });
            
            // Rotate stars slowly
            if (this.stars) {
                this.stars.rotation.y += 0.0002;
            }
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    dispose() {
        // Clean up resources
        this.scene.traverse((object) => {
            if (object.geometry) {
                object.geometry.dispose();
            }
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
        
        this.renderer.dispose();
    }
}

