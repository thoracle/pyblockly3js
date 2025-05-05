// Three.js application class
class ThreeJSApp {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.animationFrameId = null;
        this.initialized = false;
        this.container = null;
        this.frameCount = 0;
        console.log('ThreeJSApp constructor called');
    }

    init(containerId = 'threejsDiv') {
        try {
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
                75,
                aspect,
                0.1,
                1000
            );
            this.camera.position.set(5, 5, 5);
            this.camera.lookAt(0, 0, 0);
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
            console.log('Renderer configured:', {
                size: { width: window.innerWidth, height: window.innerHeight },
                pixelRatio: window.devicePixelRatio,
                shadowMap: this.renderer.shadowMap.enabled
            });

            // Append renderer to container
            this.container.innerHTML = '';
            this.container.appendChild(this.renderer.domElement);
            console.log('Renderer added to container');
            console.log('Canvas dimensions:', {
                width: this.renderer.domElement.width,
                height: this.renderer.domElement.height,
                style: {
                    width: this.renderer.domElement.style.width,
                    height: this.renderer.domElement.style.height
                }
            });

            // Create controls
            console.log('Creating OrbitControls...');
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.configureControls();
            console.log('Controls created and configured');

            // Add basic scene objects
            this.addBasicScene();

            // Add event listeners
            this.setupEventListeners();

            // Mark as initialized before starting animation
            this.initialized = true;
            console.log('Three.js scene initialized successfully');

            // Start animation loop
            console.log('Starting animation loop...');
            this.animate();
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
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(5, 5, 5);
            directionalLight.castShadow = true;
            this.scene.add(directionalLight);
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
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.position.y = 0.5;
            cube.castShadow = true;
            cube.receiveShadow = true;
            this.scene.add(cube);
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
        this.controls.minDistance = 2;
        this.controls.maxDistance = 50;

        // Enable panning
        this.controls.enablePan = true;
    }

    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', () => this.handleResize());
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
            
            // Log every 60 frames
            if (this.frameCount % 60 === 0) {
                console.log('Frame rendered:', {
                    frameCount: this.frameCount,
                    cameraPosition: this.camera.position,
                    sceneChildren: this.scene.children.length
                });
            }
        } else {
            console.warn('Missing renderer, scene, or camera:', {
                renderer: !!this.renderer,
                scene: !!this.scene,
                camera: !!this.camera
            });
        }
    }

    cleanup() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }

        if (this.controls) {
            this.controls.dispose();
        }

        if (this.renderer) {
            this.renderer.dispose();
            if (this.renderer.domElement && this.renderer.domElement.parentNode) {
                this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
            }
        }

        window.removeEventListener('resize', this.handleResize);

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.animationFrameId = null;
        this.initialized = false;
    }
}

// Make ThreeJSApp available globally
window.ThreeJSApp = ThreeJSApp; 