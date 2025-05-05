// Three.js application class
class ThreeJSApp {
    constructor() {
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
        this.directionalLight = null;
        this.debugDisplay = null;
        this.showDebug = false;
        this.handleKeyDown = this.handleKeyDown.bind(this);
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
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
            this.scene.add(ambientLight);
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
                color: 0x808080,
                side: THREE.DoubleSide,
                roughness: 0.8,
                metalness: 0.2
            });
            const ground = new THREE.Mesh(groundGeometry, groundMaterial);
            ground.rotation.x = -Math.PI / 2;
            ground.receiveShadow = true;
            this.scene.add(ground);
            console.log('Ground plane added');

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
            this.renderer.render(this.scene, this.camera);
            this.frameCount++;
            
            // Update debug display
            this.updateDebugDisplay();
            
            // Log every 60 frames
            if (this.frameCount % 60 === 0) {
                console.log('Frame rendered:', {
                    frameCount: this.frameCount,
                    cameraPosition: this.camera.position,
                    sceneChildren: this.scene.children.length,
                    debugDisplayVisible: this.showDebug,
                    debugDisplayExists: !!this.debugDisplay
                });
            }
        }
    }

    resetScene() {
        console.log('Resetting scene...');
        
        // Reset cube position and rotation
        if (this.cube) {
            this.cube.position.set(0, 0.5, 0);
            this.cube.rotation.set(0, 0, 0);
        }

        // Reset directional light
        if (this.directionalLight) {
            this.directionalLight.position.set(5, 15, 5);
            this.directionalLight.intensity = 0.8;
            this.directionalLight.color.set(0xffffff);
        }

        // Reset camera position and target
        if (this.camera) {
            this.camera.position.set(-30, 15, 15);
            this.camera.lookAt(-3, -3, -15);
        }

        // Reset controls
        if (this.controls) {
            this.controls.target.set(-3, -3, -15);
            this.controls.update();
        }

        console.log('Scene reset complete');
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