class SolarSystemApp {
    constructor() {
        this.solarSystem = null;
        this.controls = null;
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.start();
            });
        } else {
            this.start();
        }
    }
    
    start() {
        try {
            this.solarSystem = new SolarSystem();
            
            this.controls = new Controls(this.solarSystem);
            
            this.setupEventListeners();
            
            setTimeout(() => {
                const instructions = document.getElementById('instructions');
                if (instructions) {
                    instructions.style.opacity = '0';
                    setTimeout(() => {
                        instructions.style.display = 'none';
                    }, 300);
                }
            }, 10000); 
            
            console.log('Solar System 3D simulation initialized successfully!');
            
        } catch (error) {
            console.error('Error initializing Solar System:', error);
            this.showError('Failed to initialize 3D Solar System. Please check your browser compatibility.');
        }
    }
    
    setupEventListeners() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseSimulation();
            }
        });
        
        window.addEventListener('error', (event) => {
            console.error('Application error:', event.error);
        });
        
        document.addEventListener('keydown', (event) => {
            this.handleKeyboard(event);
        });
        
        this.setupTouchEvents();
    }
    
    handleKeyboard(event) {
        switch (event.code) {
            case 'Space':
                event.preventDefault();
                document.getElementById('pause-resume').click();
                break;
            case 'KeyR':
                if (event.ctrlKey || event.metaKey) {
                    event.preventDefault();
                    document.getElementById('reset-speeds').click();
                }
                break;
            case 'KeyT':
                if (event.ctrlKey || event.metaKey) {
                    event.preventDefault();
                    document.getElementById('theme-toggle').click();
                }
                break;
            case 'Escape':
                this.solarSystem.deselectPlanet();
                break;
        }
    }
    
    setupTouchEvents() {
        const canvas = document.querySelector('canvas');
        if (!canvas) return;
        
        let touchStart = { x: 0, y: 0 };
        let touchDistance = 0;
        
        canvas.addEventListener('touchstart', (event) => {
            event.preventDefault();
            
            if (event.touches.length === 1) {
                touchStart.x = event.touches[0].clientX;
                touchStart.y = event.touches[0].clientY;
            } else if (event.touches.length === 2) {
                const touch1 = event.touches[0];
                const touch2 = event.touches[1];
                touchDistance = Math.hypot(
                    touch2.clientX - touch1.clientX,
                    touch2.clientY - touch1.clientY
                );
            }
        });
        
        canvas.addEventListener('touchmove', (event) => {
            event.preventDefault();
            
            if (event.touches.length === 1) {
                // Single touch - rotation
                const deltaX = event.touches[0].clientX - touchStart.x;
                const deltaY = event.touches[0].clientY - touchStart.y;
                
                this.solarSystem.cameraTheta -= deltaX * 0.01;
                this.solarSystem.cameraPhi -= deltaY * 0.01;
                this.solarSystem.cameraPhi = Math.max(0.1, Math.min(Math.PI - 0.1, this.solarSystem.cameraPhi));
                
                this.solarSystem.updateCameraPosition();
                
                touchStart.x = event.touches[0].clientX;
                touchStart.y = event.touches[0].clientY;
            } else if (event.touches.length === 2) {
                // Two touches - zoom
                const touch1 = event.touches[0];
                const touch2 = event.touches[1];
                const currentDistance = Math.hypot(
                    touch2.clientX - touch1.clientX,
                    touch2.clientY - touch1.clientY
                );
                
                const delta = touchDistance - currentDistance;
                this.solarSystem.cameraRadius += delta * 0.1;
                this.solarSystem.cameraRadius = Math.max(50, Math.min(300, this.solarSystem.cameraRadius));
                this.solarSystem.updateCameraPosition();
                
                touchDistance = currentDistance;
            }
        });
    }
    
    pauseSimulation() {
        if (this.solarSystem && !this.solarSystem.isPaused) {
            document.getElementById('pause-resume').click();
        }
    }
    
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(244, 67, 54, 0.9);
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            z-index: 1000;
            max-width: 400px;
        `;
        errorDiv.innerHTML = `
            <h3>Error</h3>
            <p>${message}</p>
            <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: white; color: #f44336; border: none; border-radius: 4px; cursor: pointer;">
                Reload Page
            </button>
        `;
        document.body.appendChild(errorDiv);
    }
    
    // Public methods for external control
    getPlanetSpeed(planetName) {
        return this.controls?.getPlanetSpeed(planetName) || 0;
    }
    
    setPlanetSpeed(planetName, speed) {
        this.controls?.setPlanetSpeed(planetName, speed);
    }
    
    togglePause() {
        document.getElementById('pause-resume')?.click();
    }
    
    resetAll() {
        document.getElementById('reset-speeds')?.click();
        this.solarSystem?.resetCamera();
    }
}

let solarSystemApp;

(() => {
    solarSystemApp = new SolarSystemApp();
})();

// Make app globally accessible for debugging
if (typeof window !== 'undefined') {
    window.solarSystemApp = solarSystemApp;
}