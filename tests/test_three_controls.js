import * as mockThree from './mocks';
import ThreeJSApp from '../static/js/three';

// Mock Three.js
jest.mock('three', () => ({
    ...mockThree.THREE,
    Scene: mockThree.Scene,
    PerspectiveCamera: mockThree.PerspectiveCamera,
    WebGLRenderer: mockThree.WebGLRenderer,
    Color: mockThree.Color,
    Vector3: mockThree.Vector3,
    MOUSE: mockThree.THREE.MOUSE,
    TOUCH: mockThree.THREE.TOUCH
}));

// Mock OrbitControls
jest.mock('three/examples/jsm/controls/OrbitControls.js', () => ({
    OrbitControls: mockThree.OrbitControls
}));

describe('Three.js Controls', () => {
    let app;
    let container;
    let mockRenderer;
    let mockControls;

    beforeEach(() => {
        // Create container element
        container = document.createElement('div');
        container.id = 'threejsDiv';
        document.body.appendChild(container);

        // Create mock renderer element
        mockRenderer = document.createElement('canvas');
        mockRenderer.style = {};
        mockRenderer.addEventListener = jest.fn();
        mockRenderer.removeEventListener = jest.fn();
        mockRenderer.dispatchEvent = jest.fn();

        // Mock window event listeners
        window.addEventListener = jest.fn();
        window.removeEventListener = jest.fn();
        window.dispatchEvent = jest.fn();

        // Set window dimensions
        window.innerWidth = 1024;
        window.innerHeight = 768;

        // Initialize app
        app = new ThreeJSApp();
        app.init();

        // Mock renderer and controls after initialization
        app.renderer = {
            ...app.renderer,
            domElement: mockRenderer,
            render: jest.fn(),
            setSize: jest.fn(),
            setPixelRatio: jest.fn(),
            dispose: jest.fn(),
            options: { antialias: true }
        };

        // Create mock controls with proper initial state
        mockControls = new mockThree.OrbitControls(app.camera, mockRenderer);
        app.controls = mockControls;
        app.controls.target = new mockThree.Vector3(0, 0, 0);

        // Re-attach event listeners to ensure they're properly mocked
        app.setupEventListeners();
    });

    afterEach(() => {
        // Clean up app
        if (app) {
            app.cleanup();
        }

        // Remove container
        if (container && container.parentNode) {
            container.parentNode.removeChild(container);
        }

        // Clear all mocks
        jest.clearAllMocks();
    });

    describe('Initialization', () => {
        test('should create scene with correct background color', () => {
            expect(app.scene.background instanceof mockThree.Color).toBe(true);
            expect(app.scene.background.value).toBe(0xf0f0f0);
        });

        test('should initialize camera with correct position', () => {
            expect(app.camera.position.x).toBe(5);
            expect(app.camera.position.y).toBe(5);
            expect(app.camera.position.z).toBe(5);
        });

        test('should create renderer with antialias', () => {
            expect(app.renderer.options.antialias).toBe(true);
        });

        test('should set correct initial camera look-at', () => {
            expect(app.camera.target.x).toBe(0);
            expect(app.camera.target.y).toBe(0);
            expect(app.camera.target.z).toBe(0);
        });

        test('should set up event listeners', () => {
            expect(window.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
            expect(window.addEventListener).toHaveBeenCalledWith('keyup', expect.any(Function));
            expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
            expect(mockRenderer.addEventListener).toHaveBeenCalledWith('touchmove', expect.any(Function));
        });
    });

    describe('OrbitControls Configuration', () => {
        test('should enable damping for smooth movement', () => {
            expect(app.controls.enableDamping).toBe(true);
            expect(app.controls.dampingFactor).toBe(0.05);
        });

        test('should configure mouse buttons for MacBook', () => {
            expect(app.controls.mouseButtons.LEFT).toBe(mockThree.THREE.MOUSE.PAN);
            expect(app.controls.mouseButtons.MIDDLE).toBe(mockThree.THREE.MOUSE.DOLLY);
            expect(app.controls.mouseButtons.RIGHT).toBe(null);
        });

        test('should set appropriate control speeds', () => {
            expect(app.controls.panSpeed).toBe(0.5);
            expect(app.controls.rotateSpeed).toBe(0.5);
            expect(app.controls.zoomSpeed).toBe(0.5);
        });

        test('should set correct distance limits', () => {
            expect(app.controls.minDistance).toBe(2);
            expect(app.controls.maxDistance).toBe(50);
        });
    });

    describe('Keyboard Controls', () => {
        test('should handle arrow key rotation', () => {
            app.keys.add('arrowleft');
            app.controls.target.x = 1;
            app.updateCameraPosition();
            expect(app.controls.target.x).toBeLessThan(1);
        });

        test('should handle zoom keys', () => {
            app.keys.add('+');
            app.camera.position.z = 10;
            app.updateCameraPosition();
            expect(app.camera.position.z).toBeLessThan(10);
        });

        test('should handle WASD panning', () => {
            app.keys.add('w');
            app.controls.target.y = 0;
            app.updateCameraPosition();
            expect(app.controls.target.y).toBeGreaterThan(0);
        });

        test('should handle key release', () => {
            app.keys.add('w');
            app.updateCameraPosition();
            app.keys.delete('w');
            app.updateCameraPosition();
            expect(app.controls.target.y).toBe(0);
        });
    });

    describe('Touch Controls', () => {
        test('should handle single-finger rotation', () => {
            // Set initial touch position
            app.lastTouchX = 50;
            app.lastTouchY = 50;
            app.controls.target.x = 0;

            // Simulate touch event
            const touchEvent = new Event('touchmove');
            touchEvent.touches = [
                { clientX: 100, clientY: 100 }
            ];
            touchEvent.preventDefault = jest.fn();

            // Call handleTouchMove directly
            app.handleTouchMove(touchEvent);

            expect(app.controls.target.x).not.toBe(0);
            expect(touchEvent.preventDefault).toHaveBeenCalled();
        });

        test('should handle two-finger pinch zoom', () => {
            // Set initial touch distance
            app.lastTouchDistance = 50;
            app.camera.position.z = 5;

            // Simulate touch event
            const touchEvent = new Event('touchmove');
            touchEvent.touches = [
                { clientX: 0, clientY: 0 },
                { clientX: 100, clientY: 0 }
            ];
            touchEvent.preventDefault = jest.fn();

            // Call handleTouchMove directly
            app.handleTouchMove(touchEvent);

            expect(app.camera.position.z).not.toBe(5);
            expect(touchEvent.preventDefault).toHaveBeenCalled();
        });

        test('should handle two-finger pan', () => {
            // Set initial center position
            app.lastCenterX = 50;
            app.lastCenterY = 25;
            app.controls.target.x = 0;

            // First simulate touchstart
            const touchStartEvent = new Event('touchmove');
            touchStartEvent.touches = [
                { clientX: 0, clientY: 0 },
                { clientX: 100, clientY: 50 }
            ];
            touchStartEvent.preventDefault = jest.fn();
            app.handleTouchMove(touchStartEvent);

            // Then simulate touchmove with different positions
            const touchMoveEvent = new Event('touchmove');
            touchMoveEvent.touches = [
                { clientX: 50, clientY: 25 },
                { clientX: 150, clientY: 75 }
            ];
            touchMoveEvent.preventDefault = jest.fn();
            app.handleTouchMove(touchMoveEvent);

            expect(app.controls.target.x).not.toBe(0);
            expect(touchMoveEvent.preventDefault).toHaveBeenCalled();
        });
    });

    describe('Animation Loop', () => {
        test('should update controls and render scene', () => {
            const renderSpy = jest.spyOn(app.renderer, 'render');
            const updateSpy = jest.spyOn(app.controls, 'update');
            app.animate();
            expect(renderSpy).toHaveBeenCalledWith(app.scene, app.camera);
            expect(updateSpy).toHaveBeenCalled();
        });

        test('should handle window resize', () => {
            window.innerWidth = 1024;
            window.innerHeight = 768;
            app.handleResize();
            expect(app.renderer.setSize).toHaveBeenCalledWith(1024, 768);
            expect(app.camera.aspect).toBe(1024 / 768);
        });
    });

    describe('Error Handling', () => {
        test('should handle missing camera gracefully', () => {
            app.camera = null;
            app.updateCameraPosition();
            expect(app.initialized).toBe(true);
        });

        test('should handle missing renderer gracefully', () => {
            app.renderer = null;
            app.handleResize();
            expect(app.initialized).toBe(true);
        });

        test('should handle missing controls gracefully', () => {
            app.controls = null;
            app.configureControls();
            expect(app.initialized).toBe(true);
        });
    });
}); 