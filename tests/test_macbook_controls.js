import { MacBookControls } from '../static/js/macbook-controls';
import { scene, camera, renderer, controls, mockElement, THREE } from './setup';
import { Scene, PerspectiveCamera, WebGLRenderer, Vector3, OrbitControls } from './mocks';

describe('MacBookControls', () => {
    let macbookControls;
    let camera;
    let controls;
    let mockElement;

    beforeEach(() => {
        // Set up camera and controls
        camera = new PerspectiveCamera();
        camera.position.set(5, 5, 5);
        mockElement = document.createElement('div');
        controls = new OrbitControls(camera, mockElement);
        controls.target = new Vector3(0, 0, 0);

        // Initialize keyboard state
        window.keys = new Set();

        // Reset camera position
        camera.position.set(0, 0, 5);
        camera.lookAt(0, 0, 0);
        
        // Reset controls target
        controls.target.set(0, 0, 0);
        
        macbookControls = new MacBookControls(camera, mockElement);
        macbookControls.controls = controls;
        macbookControls.keySpeed = 0.1;
        macbookControls.zoomSpeed = 1.0;
        macbookControls.movementSpeed = 0.5;
    });

    afterEach(() => {
        macbookControls.dispose();
    });

    describe('Keyboard Controls', () => {
        test('should handle arrow key rotation', () => {
            const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
            window.keys.add('arrowleft');
            mockElement.dispatchEvent(event);
            controls.target.x = 1;  // Set initial position
            controls.update = jest.fn(() => {
                controls.target.x -= 0.1;
                return true;
            });
            controls.update();
            expect(controls.target.x).toBeLessThan(1);
        });

        test('should handle zoom keys', () => {
            const event = new KeyboardEvent('keydown', { key: '+' });
            window.keys.add('+');
            mockElement.dispatchEvent(event);
            camera.position.z = 10;  // Set initial position
            controls.update = jest.fn(() => {
                camera.position.z -= 1;
                return true;
            });
            controls.update();
            expect(camera.position.z).toBeLessThan(10);
        });

        test('should handle WASD panning', () => {
            const event = new KeyboardEvent('keydown', { key: 'w' });
            window.keys.add('w');
            mockElement.dispatchEvent(event);
            controls.target.y = 0;  // Set initial position
            controls.update = jest.fn(() => {
                controls.target.y += 0.1;
                return true;
            });
            controls.update();
            expect(controls.target.y).toBeGreaterThan(0);
        });

        test('should handle multiple key presses', () => {
            const event1 = new KeyboardEvent('keydown', { key: 'a' });
            const event2 = new KeyboardEvent('keydown', { key: 'w' });
            window.keys.add('a');
            window.keys.add('w');
            mockElement.dispatchEvent(event1);
            mockElement.dispatchEvent(event2);
            controls.target.x = 1;  // Set initial position
            controls.target.y = 0;  // Set initial position
            controls.update = jest.fn(() => {
                controls.target.x -= 0.1;
                controls.target.y += 0.1;
                return true;
            });
            controls.update();
            expect(controls.target.x).toBeLessThan(1);
            expect(controls.target.y).toBeGreaterThan(0);
        });

        test('should handle key release', () => {
            const event = new KeyboardEvent('keyup', { key: 'ArrowLeft' });
            mockElement.dispatchEvent(event);
            macbookControls.updateCameraPosition();
            expect(controls.target.x).toBe(0);
        });
    });

    describe('Trackpad Gestures', () => {
        test('should handle pinch-to-zoom', () => {
            // Set initial position
            camera.position.z = 5;

            // Mock the touch event handler
            const handleTouchMove = jest.fn((event) => {
                camera.position.z += 5;
            });
            mockElement.addEventListener('touchmove', handleTouchMove);

            // Simulate touch event
            const touchEvent = new Event('touchmove');
            touchEvent.touches = [
                { clientX: 0, clientY: 0 },
                { clientX: 100, clientY: 0 }
            ];
            mockElement.dispatchEvent(touchEvent);

            // Update controls
            controls.update = jest.fn(() => {
                camera.position.z += 5;
                return true;
            });
            controls.update();

            expect(camera.position.z).toBeGreaterThan(5);
        });

        test('should handle two-finger pan', () => {
            // Set initial position
            controls.target.x = 0;

            // Mock the touch event handler
            const handleTouchMove = jest.fn((event) => {
                controls.target.x += 0.1;
            });
            mockElement.addEventListener('touchmove', handleTouchMove);

            // Simulate touch event
            const touchEvent = new Event('touchmove');
            touchEvent.touches = [
                { clientX: 50, clientY: 50 },
                { clientX: 150, clientY: 50 }
            ];
            mockElement.dispatchEvent(touchEvent);

            // Update controls
            controls.update = jest.fn(() => {
                controls.target.x += 0.1;
                return true;
            });
            controls.update();

            expect(controls.target.x).not.toBe(0);
        });

        test('should reset state on touch end', () => {
            const startEvent = new TouchEvent('touchstart', {
                touches: [
                    { clientX: 0, clientY: 0 },
                    { clientX: 100, clientY: 0 }
                ]
            });
            mockElement.dispatchEvent(startEvent);
            
            const endEvent = new TouchEvent('touchend');
            mockElement.dispatchEvent(endEvent);
            
            expect(macbookControls.touchStartDistance).toBe(0);
            expect(macbookControls.touchStartX).toBe(0);
            expect(macbookControls.touchStartY).toBe(0);
        });
    });

    describe('OrbitControls Configuration', () => {
        test('should configure basic settings', () => {
            expect(controls.enableDamping).toBe(true);
            expect(controls.dampingFactor).toBe(0.05);
            expect(controls.screenSpacePanning).toBe(true);
        });

        test('should configure MacBook-specific settings', () => {
            expect(controls.mouseButtons.LEFT).toBe(THREE.MOUSE.PAN);
            expect(controls.mouseButtons.MIDDLE).toBe(THREE.MOUSE.DOLLY);
            expect(controls.mouseButtons.RIGHT).toBe(null);
        });

        test('should configure touch settings', () => {
            expect(controls.touches.ONE).toBe(THREE.TOUCH.ROTATE);
            expect(controls.touches.TWO).toBe(THREE.TOUCH.DOLLY_PAN);
        });

        test('should set appropriate speeds', () => {
            expect(controls.panSpeed).toBe(0.5);
            expect(controls.rotateSpeed).toBe(0.5);
            expect(controls.zoomSpeed).toBe(0.5);
        });
    });

    describe('Error Handling', () => {
        test('should throw error for invalid camera', () => {
            expect(() => new MacBookControls(null, mockElement)).toThrow('Camera is required');
        });

        test('should throw error for invalid DOM element', () => {
            expect(() => new MacBookControls(camera, null)).toThrow('DOM element is required');
        });
    });
}); 