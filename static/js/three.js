// Three.js application class
let instance = null;

class ThreeJSApp {
    constructor() {
        if (instance) {
            console.warn('ThreeJSApp instance already exists, returning existing instance');
            return instance;
        }
        
        console.log('=== ThreeJSApp Constructor Start ===');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.animationFrameId = null;
        this.initialized = false;
        this.container = null;
        this.frameCount = 0;
        this.cube = null;
        this.ground = null;
        this.directionalLight = null;
        this.ambientLight = null;
        this.debugDisplay = null;
        this.showDebug = false;
        this.materialNeedsUpdate = false;
        this.handleKeyDown = this.handleKeyDown.bind(this);
        
        // Store instance
        instance = this;
        console.log('ThreeJSApp constructor completed');
        console.log('=== ThreeJSApp Constructor End ===');
    }

    init(containerId = 'threejsDiv') {
        try {
            console.log('=== ThreeJSApp Init Start ===');
            console.log('Initializing Three.js scene...');
            
            // Get container element
            this.container = document.getElementById(containerId);
            if (!this.container) {
                console.error('Container element not found:', containerId);
                return;
            }
            console.log('Container found:', this.container);
            console.log('Container dimensions:', {
                width: this.container.clientWidth,
                height: this.container.clientHeight,
                offsetWidth: this.container.offsetWidth,
                offsetHeight: this.container.offsetHeight
            });

            // Create scene
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0xf0f0f0);
            console.log('Scene created');

            // Create camera
            const aspect = window.innerWidth / window.innerHeight;
            console.log('Camera aspect ratio:', aspect);
            this.camera = new THREE.PerspectiveCamera(
                45,
                aspect,
                0.1,
                1000
            );
            this.camera.position.set(-30, 15, 15);
            this.camera.lookAt(-3, -3, -15);
            console.log('Camera created and positioned:', {
                position: this.camera.position,
                fov: this.camera.fov,
                aspect: this.camera.aspect
            });

            // Create renderer
            console.log('Creating renderer...');
            this.renderer = new THREE.WebGLRenderer({ 
                antialias: true,
                alpha: false,
                powerPreference: 'high-performance'
            });
            console.log('Renderer created:', this.renderer);
            
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setClearColor(0xf0f0f0, 1);
            this.renderer.shadowMap.enabled = true;
            console.log('Renderer configured');

            // Append renderer to container
            this.container.innerHTML = '';
            this.container.appendChild(this.renderer.domElement);
            console.log('Renderer added to container');

            // Create controls
            console.log('Creating OrbitControls...');
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.configureControls();
            console.log('Controls created and configured');

            // Add basic scene objects
            this.addBasicScene();

            // Create debug display
            console.log('Creating debug display...');
            this.createDebugDisplay();
            console.log('Debug display created');

            // Add event listeners
            console.log('Setting up event listeners...');
            this.setupEventListeners();
            console.log('Event listeners set up');

            // Mark as initialized
            this.initialized = true;
            console.log('Three.js scene initialized successfully');

            // Start animation loop
            console.log('Starting animation loop...');
            this.animate();
            console.log('=== ThreeJSApp Init End ===');
        } catch (error) {
            console.error('Error initializing Three.js scene:', error);
            console.error('Error stack:', error.stack);
            this.cleanup();
            throw error;
        }
    }

    addBasicScene() {
        console.log('Adding basic scene objects...');
        
        try {
            // Add ambient light
            this.ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
            this.scene.add(this.ambientLight);
            console.log('Ambient light added');

            // Add directional light
            this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            this.directionalLight.position.set(5, 15, 5);
            this.directionalLight.castShadow = true;
            this.scene.add(this.directionalLight);
            console.log('Directional light added');

            // Add ground plane
            const groundGeometry = new THREE.PlaneGeometry(20, 20);
            const groundMaterial = new THREE.MeshStandardMaterial({ 
                color: '#ffff00',  // Using hex string instead of number
                side: THREE.DoubleSide,
                roughness: 0.8,
                metalness: 0.2
            });
            this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
            this.ground.rotation.x = -Math.PI / 2;
            this.ground.receiveShadow = true;
            this.scene.add(this.ground);
            console.log('Ground plane added with yellow color:', this.ground.material.color);

            // Add a cube
            const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
            const cubeMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x00ff00,
                roughness: 0.7,
                metalness: 0.3
            });
            this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            this.cube.position.y = 0.5;
            this.cube.castShadow = true;
            this.cube.receiveShadow = true;
            this.scene.add(this.cube);
            console.log('Cube added');

            // Add grid helper
            const gridHelper = new THREE.GridHelper(20, 20, 0x000000, 0x000000);
            gridHelper.position.y = 0.01;
            this.scene.add(gridHelper);
            console.log('Grid helper added');
            
            console.log('Basic scene objects added successfully');
        } catch (error) {
            console.error('Error adding scene objects:', error);
            console.error('Error stack:', error.stack);
            throw error;
        }
    }

    configureControls() {
        if (!this.controls) return;

        // Enable smooth movement
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        // Configure for MacBook
        this.controls.screenSpacePanning = true;
        this.controls.mouseButtons = {
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN
        };

        // Configure touch events for trackpad
        this.controls.touches = {
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
        };

        // Set control speeds
        this.controls.panSpeed = 1.0;
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.0;

        // Set distance limits
        this.controls.minDistance = 5;
        this.controls.maxDistance = 50;

        // Enable panning
        this.controls.enablePan = true;

        // Set initial target
        this.controls.target.set(-3, -3, -15);
    }

    createDebugDisplay() {
        console.log('=== createDebugDisplay Start ===');
        try {
            // Create debug display element
            this.debugDisplay = document.createElement('div');
            console.log('Debug display element created');

            // Set styles
            const styles = {
                position: 'fixed',
                top: '20px',
                right: '20px',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: '#00ff00',
                padding: '12px',
                fontFamily: 'monospace',
                fontSize: '9px',
                borderRadius: '5px',
                display: 'none',
                zIndex: '9999',
                pointerEvents: 'none',
                border: '2px solid #00ff00',
                minWidth: '180px',
                boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
                textShadow: '0 0 5px rgba(0, 255, 0, 0.5)'
            };

            Object.assign(this.debugDisplay.style, styles);
            console.log('Debug display styles applied');

            // Add to document body instead of container
            document.body.appendChild(this.debugDisplay);
            console.log('Debug display added to body');
            console.log('Debug display element:', this.debugDisplay);
            console.log('=== createDebugDisplay End ===');
        } catch (error) {
            console.error('Error creating debug display:', error);
            throw error;
        }
    }

    handleKeyDown(event) {
        console.log('=== handleKeyDown Start ===');
        console.log('Key pressed:', event.key, 'Ctrl:', event.ctrlKey);
        
        if (event.ctrlKey && event.key === 'd') {
            console.log('Ctrl+D detected');
            this.showDebug = !this.showDebug;
            console.log('showDebug toggled to:', this.showDebug);
            
            if (this.debugDisplay) {
                console.log('Debug display element found');
                this.debugDisplay.style.display = this.showDebug ? 'block' : 'none';
                console.log('Debug display visibility set to:', this.showDebug);
                console.log('Current debug display style:', this.debugDisplay.style.display);
            } else {
                console.warn('Debug display element not found');
            }
            event.preventDefault();
        }
        console.log('=== handleKeyDown End ===');
    }

    setupEventListeners() {
        console.log('=== setupEventListeners Start ===');
        
        // Window resize
        window.addEventListener('resize', () => this.handleResize());
        console.log('Resize listener added');

        // Debug display toggle
        window.addEventListener('keydown', this.handleKeyDown);
        console.log('Keydown listener added');
        
        console.log('=== setupEventListeners End ===');
    }

    handleResize() {
        if (!this.camera || !this.renderer) return;

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        if (!this.initialized) {
            console.warn('Animation called before initialization');
            return;
        }

        this.animationFrameId = requestAnimationFrame(() => this.animate());

        if (this.controls) {
            this.controls.update();
        }

        if (this.renderer && this.scene && this.camera) {
            // Ensure material is properly initialized
            if (this.ground && this.ground.material && this.materialNeedsUpdate) {
                this.ground.material.needsUpdate = true;
                this.materialNeedsUpdate = false;
            }
            
            this.renderer.render(this.scene, this.camera);
            this.frameCount++;
            
            // Update debug display
            this.updateDebugDisplay();
        }
    }

    resetScene() {
        console.log('Resetting scene to default state');
        
        // Reset cube
        if (this.cube) {
            this.cube.position.set(0, 0.5, 0);
            this.cube.rotation.set(0, 0, 0);
            this.cube.material.color.setHex(0x00ff00);
        }
        
        // Reset camera and controls
        this.camera.position.set(-30, 15, 15);
        this.camera.lookAt(-3, -3, -15);
        if (this.controls) {
            this.controls.target.set(-3, -3, -15);
            this.controls.update();
        }
        
        // Reset directional light
        if (this.directionalLight) {
            this.directionalLight.position.set(5, 15, 5);
            this.directionalLight.intensity = 0.8;
            this.directionalLight.color.setHex(0xffffff);
        }
        
        // Reset ambient light
        if (this.ambientLight) {
            this.ambientLight.intensity = 0.7;
            this.ambientLight.color.setHex(0xffffff);
        }
        
        // Reset scene background
        this.scene.background = new THREE.Color(0xf0f0f0);
        
        // Reset ground
        if (this.ground) {
            this.ground.material.color.setHex(0xffff00);
        }
    }

    // Scene operation functions
    setGroundColor(colorValue) {
        console.log('=== setGroundColor Start ===');
        console.log('Raw color value:', colorValue);
        console.log('Color type:', typeof colorValue);
        console.log('Color value as string:', String(colorValue));
        console.log('ThreeJSApp instance:', this === instance ? 'Correct instance' : 'Different instance');
        
        if (!this.ground) {
            console.error('Ground object does not exist');
            return;
        }
        
        console.log('Ground object exists:', !!this.ground);
        console.log('Ground object details:', {
            uuid: this.ground.uuid,
            type: this.ground.type,
            visible: this.ground.visible,
            material: this.ground.material
        });
        console.log('Current ground color:', this.ground.material.color);
        
        // Dispose of the old material
        if (this.ground.material) {
            console.log('Disposing old material:', this.ground.material);
            this.ground.material.dispose();
        }
        
        // Create new material
        const newMaterial = new THREE.MeshStandardMaterial({
            color: colorValue,
            side: THREE.DoubleSide,
            roughness: 0.8,
            metalness: 0.2
        });
        
        // Explicitly set needsUpdate
        newMaterial.needsUpdate = true;
        
        // Assign new material
        this.ground.material = newMaterial;
        
        // Force render
        console.log('Forcing render...');
        this.renderer.render(this.scene, this.camera);
        console.log('Render info:', this.renderer.info);
        
        console.log('New material created and assigned:', newMaterial);
        console.log('New material color:', newMaterial.color);
        console.log('Material needsUpdate:', newMaterial.needsUpdate); // Should log true
        console.log('Material properties:', {
            color: newMaterial.color,
            side: newMaterial.side,
            roughness: newMaterial.roughness,
            metalness: newMaterial.metalness
        });
        
        // Verify ground is in scene
        const groundInScene = this.scene.children.includes(this.ground);
        console.log('Is ground in scene?', groundInScene);
        if (!groundInScene) {
            console.warn('Ground not in scene, re-adding...');
            this.scene.add(this.ground);
        }
        
        console.log('Scene children:', this.scene.children.map(child => ({
            uuid: child.uuid,
            type: child.type,
            name: child.name,
            visible: child.visible
        })));
        
        // Verify animation loop is running
        console.log('Animation frame ID:', this.animationFrameId);
        if (!this.animationFrameId) {
            console.warn('Animation loop not running, restarting...');
            this.animate();
        }
        
        console.log('=== setGroundColor End ===');
    }

    setGroundSize(size) {
        if (this.ground) {
            this.ground.scale.set(size, 1, size);
            console.log('Ground size set to:', size);
        }
    }

    setCameraPosition(x, y, z) {
        this.camera.position.set(x, y, z);
        console.log('Camera position set to:', x, y, z);
    }

    setCameraLookAt(x, y, z) {
        this.camera.lookAt(x, y, z);
        console.log('Camera looking at:', x, y, z);
    }

    setDirectionalLightColor(color) {
        if (this.directionalLight) {
            this.directionalLight.color.set(color);
            console.log('Directional light color set to:', color);
        }
    }

    setDirectionalLightIntensity(intensity) {
        if (this.directionalLight) {
            this.directionalLight.intensity = intensity;
            console.log('Directional light intensity set to:', intensity);
        }
    }

    setDirectionalLightPosition(x, y, z) {
        if (this.directionalLight) {
            this.directionalLight.position.set(x, y, z);
            console.log('Directional light position set to:', x, y, z);
        }
    }

    setAmbientLightColor(color) {
        if (this.ambientLight) {
            this.ambientLight.color.set(color);
            console.log('Ambient light color set to:', color);
        }
    }

    setAmbientLightIntensity(intensity) {
        if (this.ambientLight) {
            this.ambientLight.intensity = intensity;
            console.log('Ambient light intensity set to:', intensity);
        }
    }

    updateDebugDisplay() {
        if (!this.showDebug || !this.debugDisplay) {
            return;
        }

        try {
            const cubePos = this.cube.position;
            const cameraPos = this.camera.position;
            const controlsTarget = this.controls.target;

            const debugText = `
                <div style="font-weight: bold; margin-bottom: 3px;">Debug Info</div>
                <div style="margin-bottom: 6px;">
                    <div style="color: #ff9900;">Cube Position:</div>
                    <div>X: ${cubePos.x.toFixed(2)}</div>
                    <div>Y: ${cubePos.y.toFixed(2)}</div>
                    <div>Z: ${cubePos.z.toFixed(2)}</div>
                </div>
                <div style="margin-bottom: 6px;">
                    <div style="color: #ff9900;">Camera Position:</div>
                    <div>X: ${cameraPos.x.toFixed(2)}</div>
                    <div>Y: ${cameraPos.y.toFixed(2)}</div>
                    <div>Z: ${cameraPos.z.toFixed(2)}</div>
                </div>
                <div>
                    <div style="color: #ff9900;">Camera Target:</div>
                    <div>X: ${controlsTarget.x.toFixed(2)}</div>
                    <div>Y: ${controlsTarget.y.toFixed(2)}</div>
                    <div>Z: ${controlsTarget.z.toFixed(2)}</div>
                </div>
            `;

            this.debugDisplay.innerHTML = debugText;
        } catch (error) {
            console.error('Error updating debug display:', error);
        }
    }

    cleanup() {
        console.log('=== cleanup Start ===');
        
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            console.log('Animation frame cancelled');
        }

        if (this.controls) {
            this.controls.dispose();
            console.log('Controls disposed');
        }

        if (this.renderer) {
            this.renderer.dispose();
            if (this.renderer.domElement && this.renderer.domElement.parentNode) {
                this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
            }
            console.log('Renderer disposed');
        }

        if (this.debugDisplay && this.debugDisplay.parentNode) {
            this.debugDisplay.parentNode.removeChild(this.debugDisplay);
            console.log('Debug display removed');
        }

        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('keydown', this.handleKeyDown);
        console.log('Event listeners removed');

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.animationFrameId = null;
        this.initialized = false;
        this.debugDisplay = null;
        
        console.log('=== cleanup End ===');
    }
}

// Make ThreeJSApp available globally
window.ThreeJSApp = ThreeJSApp;

// Make scene operation functions available globally
let threeApp = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing ThreeJSApp');
    if (!threeApp) {
        threeApp = new ThreeJSApp();
        console.log('Created new ThreeJSApp instance:', threeApp);
        threeApp.init();
    } else {
        console.log('Using existing ThreeJSApp instance:', threeApp);
    }
});

// Global function to get the ThreeJSApp instance
function getThreeJSApp() {
    if (!threeApp) {
        console.warn('ThreeJSApp not initialized, creating new instance');
        threeApp = new ThreeJSApp();
        threeApp.init();
    }
    return threeApp;
}

// Update global functions to use getThreeJSApp
function setGroundColor(color) {
    console.log('=== Global setGroundColor Start ===');
    console.log('Global function called with color:', color);
    const app = getThreeJSApp();
    console.log('Using ThreeJSApp instance:', app);
    app.setGroundColor(color);
    console.log('=== Global setGroundColor End ===');
}

function setGroundSize(size) {
    const app = getThreeJSApp();
    app.setGroundSize(size);
}

function setCameraPosition(x, y, z) {
    const app = getThreeJSApp();
    app.setCameraPosition(x, y, z);
}

function setCameraLookAt(x, y, z) {
    const app = getThreeJSApp();
    app.setCameraLookAt(x, y, z);
}

function setDirectionalLightColor(color) {
    const app = getThreeJSApp();
    app.setDirectionalLightColor(color);
}

function setDirectionalLightIntensity(intensity) {
    const app = getThreeJSApp();
    app.setDirectionalLightIntensity(intensity);
}

function setDirectionalLightPosition(x, y, z) {
    const app = getThreeJSApp();
    app.setDirectionalLightPosition(x, y, z);
}

function setAmbientLightColor(color) {
    const app = getThreeJSApp();
    app.setAmbientLightColor(color);
}

function setAmbientLightIntensity(intensity) {
    const app = getThreeJSApp();
    app.setAmbientLightIntensity(intensity);
}

function resetScene() {
    const app = getThreeJSApp();
    app.resetScene();
} 