const { Scene, PerspectiveCamera, WebGLRenderer, Vector3, OrbitControls, THREE } = require('./mocks');

// Create a mock DOM element class
class MockHTMLElement {
    constructor() {
        this.children = [];
        this.style = {};
        this.addEventListener = jest.fn();
        this.removeEventListener = jest.fn();
        this.dispatchEvent = jest.fn();
        this.remove = jest.fn();
        this.nodeType = 1;
        this.nodeName = 'DIV';
        this.ownerDocument = document;
    }

    appendChild(child) {
        if (child instanceof MockHTMLElement || child.nodeType === 1) {
            this.children.push(child);
            return child;
        }
        throw new TypeError('Failed to execute \'appendChild\' on \'Node\': parameter 1 is not of type \'Node\'.');
    }

    removeChild(child) {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }
}

// Create mock instances
const mockElement = new MockHTMLElement();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera();
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, mockElement);

// Configure mock instances
scene.background = new THREE.Color(0xf0f0f0);
camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0);
renderer.setSize = jest.fn();
renderer.setPixelRatio = jest.fn();
renderer.render = jest.fn();
renderer.dispose = jest.fn();
renderer.domElement = new MockHTMLElement();

// Set up global mocks
global.window = {
    innerWidth: 1024,
    innerHeight: 768,
    devicePixelRatio: 1,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    keys: new Set()
};

global.document = {
    getElementById: jest.fn(() => mockElement),
    createElement: jest.fn(() => new MockHTMLElement()),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    body: {
        appendChild: jest.fn(),
        removeChild: jest.fn()
    }
};

global.navigator = {
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
};

global.performance = {
    now: jest.fn(() => 0)
};

global.requestAnimationFrame = jest.fn(callback => setTimeout(callback, 0));
global.cancelAnimationFrame = jest.fn();

global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
}));

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
}));

// Make THREE available globally
global.THREE = THREE;

// Export all mocks
module.exports = {
    scene,
    camera,
    renderer,
    controls,
    mockElement,
    THREE
}; 