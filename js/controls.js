
class Controls {
    constructor(solarSystem) {
        this.solarSystem = solarSystem;
        this.speedControls = {};
        this.init();
    }
    
    init() {
        this.createSpeedControls();
        this.setupMainControls();
        this.setupCameraControls();
    }
    
    createSpeedControls() {
        const speedControlsContainer = document.getElementById('speed-controls');
        
        // Create speed controls for each planet
        Object.keys(PLANET_DATA).forEach(planetKey => {
            if (planetKey !== 'sun') {
                const planetData = PLANET_DATA[planetKey];
                const controlDiv = this.createSpeedControl(planetKey, planetData);
                speedControlsContainer.appendChild(controlDiv);
            }
        });
    }
    
    createSpeedControl(planetName, planetData) {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'speed-control';
        
        // Planet color indicator
        const colorDiv = document.createElement('div');
        colorDiv.className = 'planet-color';
        colorDiv.style.backgroundColor = `#${planetData.color.toString(16).padStart(6, '0')}`;
        
        // Planet name
        const nameSpan = document.createElement('span');
        nameSpan.className = 'planet-name';
        nameSpan.textContent = planetData.name;
        
        // Speed slider
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0';
        slider.max = '0.05';
        slider.step = '0.001';
        slider.value = planetData.speed;
        slider.id = `speed-${planetName}`;
        
        // Speed value display
        const valueSpan = document.createElement('span');
        valueSpan.className = 'speed-value';
        valueSpan.textContent = (planetData.speed * 100).toFixed(1);
        
        // Add event listener
        slider.addEventListener('input', (e) => {
            const newSpeed = parseFloat(e.target.value);
            this.solarSystem.updatePlanetSpeed(planetName, newSpeed);
            valueSpan.textContent = (newSpeed * 100).toFixed(1);
        });
        
        // Store reference
        this.speedControls[planetName] = { slider, valueSpan };
        
        // Assemble control
        controlDiv.appendChild(colorDiv);
        controlDiv.appendChild(nameSpan);
        controlDiv.appendChild(slider);
        controlDiv.appendChild(valueSpan);
        
        return controlDiv;
    }
    
    setupMainControls() {
        // Pause/Resume button
        const pauseBtn = document.getElementById('pause-resume');
        pauseBtn.addEventListener('click', () => {
            const isPaused = this.solarSystem.togglePause();
            pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
            pauseBtn.className = isPaused ? 'pause' : '';
        });
        
        // Theme toggle button
        const themeBtn = document.getElementById('theme-toggle');
        themeBtn.addEventListener('click', () => {
            this.solarSystem.toggleTheme();
            const isLight = document.body.classList.contains('light-theme');
            themeBtn.textContent = isLight ? 'Dark Mode' : 'Light Mode';
        });
        
        // Reset speeds button
        const resetBtn = document.getElementById('reset-speeds');
        resetBtn.addEventListener('click', () => {
            this.solarSystem.resetSpeeds();
            this.updateSpeedControls();
        });
    }
    
    setupCameraControls() {
        // Zoom controls
        document.getElementById('zoom-in').addEventListener('click', () => {
            this.solarSystem.zoomCamera(-1);
        });
        
        document.getElementById('zoom-out').addEventListener('click', () => {
            this.solarSystem.zoomCamera(1);
        });
        
        document.getElementById('reset-camera').addEventListener('click', () => {
            this.solarSystem.resetCamera();
        });
    }
    
    updateSpeedControls() {
        Object.keys(this.speedControls).forEach(planetName => {
            const { slider, valueSpan } = this.speedControls[planetName];
            const currentSpeed = PLANET_DATA[planetName].speed;
            slider.value = currentSpeed;
            valueSpan.textContent = (currentSpeed * 100).toFixed(1);
        });
    }
    
    // Method to programmatically set planet speed
    setPlanetSpeed(planetName, speed) {
        if (this.speedControls[planetName]) {
            const { slider, valueSpan } = this.speedControls[planetName];
            slider.value = speed;
            valueSpan.textContent = (speed * 100).toFixed(1);
            this.solarSystem.updatePlanetSpeed(planetName, speed);
        }
    }
    
    // Method to get current planet speed
    getPlanetSpeed(planetName) {
        return PLANET_DATA[planetName]?.speed || 0;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Controls;
}