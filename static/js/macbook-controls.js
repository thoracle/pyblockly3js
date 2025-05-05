// Import Three.js and OrbitControls
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// MacBook-specific controls class
export class MacBookControls {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;
        this.controls = null;
        this.enabled = true;
        this.lastTouchX = 0;
        this.lastTouchY = 0;
        this.lastTouchDistance = 0;
        this.lastCenterX = 0;
        this.lastCenterY = 0;
        
        this.init();
    }

    init() {
        console.log('Initializing MacBook controls...');
        
        // Create OrbitControls
        this.controls = new OrbitControls(this.camera, this.domElement);
        
        // Configure for MacBook
        this.controls.screenSpacePanning = true;
        this.controls.mouseButtons = {
            LEFT: THREE.MOUSE.PAN,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: null
        };

        // Configure touch events for trackpad
        this.controls.touches = {
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
        };

        // Set control speeds
        this.controls.panSpeed = 0.5;
        this.controls.rotateSpeed = 0.5;
        this.controls.zoomSpeed = 0.5;

        // Set distance limits
        this.controls.minDistance = 2;
        this.controls.maxDistance = 50;

        // Enable smooth movement
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        // Enable panning
        this.controls.enablePan = true;

        // Add event listeners
        this.setupEventListeners();
        
        console.log('MacBook controls initialized');
    }

    setupEventListeners() {
        if (!this.domElement) return;

        // Touch events
        this.domElement.addEventListener('touchstart', (event) => this.handleTouchStart(event));
        this.domElement.addEventListener('touchmove', (event) => this.handleTouchMove(event));
        this.domElement.addEventListener('touchend', (event) => this.handleTouchEnd(event));
        this.domElement.addEventListener('touchcancel', (event) => this.handleTouchEnd(event));
        
        // Prevent default touch actions
        this.domElement.style.touchAction = 'none';
    }

    handleTouchStart(event) {
        if (event.touches.length === 2) {
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];

            this.lastTouchDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            this.lastCenterX = (touch1.clientX + touch2.clientX) / 2;
            this.lastCenterY = (touch1.clientY + touch2.clientY) / 2;
        }
    }

    handleTouchMove(event) {
        if (!this.controls || !this.enabled) return;

        event.preventDefault();

        if (event.touches.length === 1) {
            // Single finger rotation
            const touch = event.touches[0];
            const movementX = touch.clientX - (this.lastTouchX || touch.clientX);
            const movementY = touch.clientY - (this.lastTouchY || touch.clientY);
            
            this.controls.target.x += movementX * 0.01;
            this.controls.target.y += movementY * 0.01;

            this.lastTouchX = touch.clientX;
            this.lastTouchY = touch.clientY;
        } else if (event.touches.length === 2) {
            // Two finger gesture
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
            
            const currentDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            
            // Handle pinch-to-zoom
            if (this.lastTouchDistance) {
                const delta = currentDistance - this.lastTouchDistance;
                const zoomFactor = 1 + delta * 0.01;
                this.camera.position.z *= zoomFactor;
            }
            
            // Handle two-finger pan
            const centerX = (touch1.clientX + touch2.clientX) / 2;
            const centerY = (touch1.clientY + touch2.clientY) / 2;
            
            if (this.lastCenterX && this.lastCenterY) {
                const deltaX = centerX - this.lastCenterX;
                const deltaY = centerY - this.lastCenterY;
                
                this.controls.target.x += deltaX * 0.01;
                this.controls.target.y += deltaY * 0.01;
            }
            
            this.lastTouchDistance = currentDistance;
            this.lastCenterX = centerX;
            this.lastCenterY = centerY;
        }

        this.controls.update();
    }

    handleTouchEnd() {
        this.lastTouchX = 0;
        this.lastTouchY = 0;
        this.lastTouchDistance = 0;
        this.lastCenterX = 0;
        this.lastCenterY = 0;
    }

    update() {
        if (this.controls && this.enabled) {
            this.controls.update();
        }
    }

    dispose() {
        if (this.controls) {
            this.controls.dispose();
        }
        
        if (this.domElement) {
            this.domElement.removeEventListener('touchstart', this.handleTouchStart);
            this.domElement.removeEventListener('touchmove', this.handleTouchMove);
            this.domElement.removeEventListener('touchend', this.handleTouchEnd);
            this.domElement.removeEventListener('touchcancel', this.handleTouchEnd);
        }
    }
}

// Make MacBookControls available globally
window.MacBookControls = MacBookControls; 