const mockColor = jest.fn();
const mockScene = jest.fn(() => ({
    background: mockColor(),
    add: jest.fn()
}));

const mockPerspectiveCamera = jest.fn(() => ({
    position: {
        set: jest.fn(),
        lerp: jest.fn(),
        clone: jest.fn().mockReturnThis(),
        multiplyScalar: jest.fn().mockReturnThis(),
        x: 0,
        y: 0,
        z: 0
    },
    aspect: 0,
    updateProjectionMatrix: jest.fn(),
    lookAt: jest.fn()
}));

const mockWebGLRenderer = jest.fn(() => ({
    setSize: jest.fn(),
    setPixelRatio: jest.fn(),
    domElement: {
        style: {},
        addEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
        remove: jest.fn()
    },
    render: jest.fn(),
    dispose: jest.fn()
}));

const mockMouseButtons = {
    ROTATE: 1,
    DOLLY: 2,
    PAN: 3
};

const mockTouchActions = {
    ROTATE: 1,
    DOLLY_PAN: 2
};

const mockOrbitControls = jest.fn(() => ({
    enableDamping: true,
    dampingFactor: 0.05,
    screenSpacePanning: true,
    minDistance: 2,
    maxDistance: 50,
    mouseButtons: {
        LEFT: mockMouseButtons.PAN,
        MIDDLE: mockMouseButtons.DOLLY,
        RIGHT: null
    },
    touches: {
        ONE: mockTouchActions.ROTATE,
        TWO: mockTouchActions.DOLLY_PAN
    },
    panSpeed: 0.5,
    rotateSpeed: 0.5,
    zoomSpeed: 0.5,
    enablePan: true,
    update: jest.fn(),
    target: { x: 0, y: 0, z: 0 },
    dispose: jest.fn()
}));

// Mock Vector3 class
class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    copy(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }

    multiplyScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    }

    lerp(v, alpha) {
        this.x += (v.x - this.x) * alpha;
        this.y += (v.y - this.y) * alpha;
        this.z += (v.z - this.z) * alpha;
        return this;
    }

    equals(v) {
        return this.x === v.x && this.y === v.y && this.z === v.z;
    }

    clone() {
        return new Vector3(this.x, this.y, this.z);
    }
}

// Mock Color class
class Color {
    constructor(color) {
        this.value = color;
    }
    equals(other) {
        return this.value === other.value;
    }
}

// Mock Scene class
class Scene {
    constructor() {
        this.background = new Color(0xf0f0f0);
        this.children = [];
    }
    add(object) {
        this.children.push(object);
        return this;
    }
    remove(object) {
        const index = this.children.indexOf(object);
        if (index !== -1) {
            this.children.splice(index, 1);
        }
        return this;
    }
}

// Mock PerspectiveCamera class
class PerspectiveCamera {
    constructor() {
        this.position = new Vector3(5, 5, 5);
        this.target = new Vector3(0, 0, 0);
        this.aspect = 1;
        this.fov = 75;
        this.near = 0.1;
        this.far = 1000;
        this.updateProjectionMatrix = jest.fn();
    }
    lookAt(x, y, z) {
        if (x instanceof Vector3) {
            this.target.copy(x);
        } else {
            this.target.set(x, y, z);
        }
        return this;
    }
}

// Mock WebGLRenderer class
class WebGLRenderer {
    constructor(options = {}) {
        this.options = { antialias: true, ...options };
        this.domElement = document.createElement('canvas');
        this.domElement.width = 1024;
        this.domElement.height = 768;
        this.setSize = jest.fn((width, height) => {
            this.domElement.width = width;
            this.domElement.height = height;
        });
        this.setPixelRatio = jest.fn();
        this.render = jest.fn();
        this.dispose = jest.fn();
    }
}

// Mock THREE.js constants
const THREE = {
    MOUSE: {
        LEFT: 0,
        MIDDLE: 1,
        RIGHT: 2,
        PAN: 0,
        DOLLY: 1,
        ROTATE: 2
    },
    TOUCH: {
        ROTATE: 0,
        PAN: 1,
        DOLLY_PAN: 2,
        DOLLY_ROTATE: 3
    },
    Color,
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Vector3
};

// Mock OrbitControls class
class OrbitControls {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;
        this.target = new Vector3();
        this.enableDamping = true;
        this.dampingFactor = 0.05;
        this.screenSpacePanning = true;
        this.mouseButtons = {
            LEFT: THREE.MOUSE.PAN,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: null
        };
        this.touches = {
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
        };
        this.panSpeed = 0.5;
        this.rotateSpeed = 0.5;
        this.zoomSpeed = 0.5;
        this.minDistance = 2;
        this.maxDistance = 50;
        this.enablePan = true;
        this.update = jest.fn(() => {
            // Simulate camera movement based on target
            if (this.camera && this.camera.position) {
                // Store the target values before they're modified
                const targetX = this.target.x;
                const targetY = this.target.y;
                const targetZ = this.target.z;

                // Update camera position
                this.camera.position.lerp(this.target, 0.1);

                // Restore target values
                this.target.x = targetX;
                this.target.y = targetY;
                this.target.z = targetZ;
            }
            return true;
        });
        this.dispose = jest.fn();
    }
}

// Export all mocks
module.exports = {
    THREE,
    Vector3,
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    OrbitControls,
    Color
}; 