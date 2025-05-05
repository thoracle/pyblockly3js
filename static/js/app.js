// Main application logic
let workspace;
let isInitialized = false;
let threeApp;

export async function initApp() {
    try {
        // Import Three.js app
        const ThreeJSModule = await import('./three.js');
        const ThreeJSApp = ThreeJSModule.default;
        threeApp = new ThreeJSApp();
        await threeApp.init();

        // Prevent multiple initializations
        if (isInitialized) {
            return;
        }

        console.log('Initializing Blockly workspace...');
        
        // Initialize Blockly workspace
        initBlockly();

        // Add Run button click handler
        document.getElementById('runButton').addEventListener('click', () => {
            try {
                // Validate workspace
                if (!workspace) {
                    throw new Error('Blockly workspace not initialized');
                }

                // Get all blocks
                const blocks = workspace.getAllBlocks();
                if (blocks.length === 0) {
                    console.warn('No blocks in workspace');
                    return;
                }

                // Check for disconnected blocks
                const disconnectedBlocks = blocks.filter(block => !block.getParent());
                if (disconnectedBlocks.length > 0) {
                    console.warn('Found disconnected blocks:', disconnectedBlocks.map(b => b.type));
                }

                // Generate code
                const code = Blockly.JavaScript.workspaceToCode(workspace);
                console.log('Generated code:', code);

                if (code.trim()) {
                    executeCode(code);
                } else {
                    console.warn('No code generated from blocks');
                }
            } catch (error) {
                console.error('Error executing blocks:', error);
                alert('Error executing blocks: ' + error.message);
            }
        });

        isInitialized = true;
    } catch (error) {
        console.error('Error initializing app:', error);
        alert('Error initializing app: ' + error.message);
    }
}

// Initialize Blockly workspace
function initBlockly() {
    console.log('Initializing Blockly workspace...');
    
    // Define toolbox categories
    const toolbox = {
        kind: 'categoryToolbox',
        contents: [
            {
                kind: 'category',
                name: 'Movement',
                colour: '#5C6BC0',
                contents: [
                    {
                        kind: 'block',
                        type: 'move_forward'
                    },
                    {
                        kind: 'block',
                        type: 'move_backward'
                    },
                    {
                        kind: 'block',
                        type: 'turn_left'
                    },
                    {
                        kind: 'block',
                        type: 'turn_right'
                    },
                    {
                        kind: 'block',
                        type: 'move_distance'
                    },
                    {
                        kind: 'block',
                        type: 'turn_degrees'
                    }
                ]
            },
            {
                kind: 'category',
                name: 'Scene',
                colour: '#66BB6A',
                contents: [
                    {
                        kind: 'block',
                        type: 'scene_color_picker'
                    },
                    {
                        kind: 'block',
                        type: 'set_camera_position'
                    },
                    {
                        kind: 'block',
                        type: 'set_camera_look_at'
                    },
                    {
                        kind: 'block',
                        type: 'set_light_color'
                    },
                    {
                        kind: 'block',
                        type: 'set_light_intensity'
                    },
                    {
                        kind: 'block',
                        type: 'set_ground_color'
                    },
                    {
                        kind: 'block',
                        type: 'set_ground_size'
                    }
                ]
            },
            {
                kind: 'category',
                name: 'Logic',
                colour: '#FFA726',
                contents: [
                    {
                        kind: 'block',
                        type: 'controls_if'
                    },
                    {
                        kind: 'block',
                        type: 'controls_repeat_ext'
                    },
                    {
                        kind: 'block',
                        type: 'logic_compare'
                    },
                    {
                        kind: 'block',
                        type: 'logic_operation'
                    },
                    {
                        kind: 'block',
                        type: 'logic_negate'
                    },
                    {
                        kind: 'block',
                        type: 'logic_boolean'
                    },
                    {
                        kind: 'block',
                        type: 'math_number'
                    },
                    {
                        kind: 'block',
                        type: 'math_arithmetic'
                    },
                    {
                        kind: 'block',
                        type: 'math_random_int'
                    }
                ]
            }
        ]
    };

    // Create workspace
    workspace = Blockly.inject('blocklyDiv', {
        toolbox: toolbox,
        scrollbars: true,
        move: {
            drag: true,
            wheel: true
        },
        zoom: {
            controls: true,
            wheel: true,
            startScale: 1.0,
            maxScale: 3,
            minScale: 0.3,
            scaleSpeed: 1.2
        },
        grid: {
            spacing: 25,
            length: 3,
            colour: '#ccc',
            snap: true
        }
    });

    // Log available blocks and generators
    console.log('Available blocks:', Object.keys(Blockly.Blocks));
    console.log('Available generators:', Object.keys(Blockly.JavaScript));

    // Add change listener
    workspace.addChangeListener(function(event) {
        if (event.type === Blockly.Events.BLOCK_CREATE ||
            event.type === Blockly.Events.BLOCK_DELETE ||
            event.type === Blockly.Events.BLOCK_CHANGE) {
            updateCode();
        }
    });
}

// Update code when workspace changes
function updateCode() {
    try {
        const code = Blockly.JavaScript.workspaceToCode(workspace);
        console.log('Generated code:', code);
    } catch (error) {
        console.error('Error generating code:', error);
    }
}

// API Communication
async function executeCode(code) {
    try {
        // Validate code
        if (!code || typeof code !== 'string') {
            throw new Error('Invalid code to execute');
        }

        // Execute the code directly since we're using the global object
        console.log('Executing code:', code);
        
        // Wrap code in try-catch for runtime errors
        const wrappedCode = `
            try {
                ${code}
            } catch (error) {
                console.error('Runtime error:', error);
                alert('Runtime error: ' + error.message);
            }
        `;
        
        eval(wrappedCode);
        
        // Also send to server for logging/processing
        const response = await fetch('/api/execute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        if (result.status === 'error') {
            throw new Error(result.message || 'Error executing code on server');
        }
    } catch (error) {
        console.error('Error executing code:', error);
        alert('Error executing code: ' + error.message);
    }
}

async function saveProgram() {
    try {
        if (!workspace) {
            throw new Error('Workspace not initialized');
        }

        const program = Blockly.Xml.workspaceToDom(workspace);
        const programText = Blockly.Xml.domToText(program);
        
        const response = await fetch('/api/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ program: programText }),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        if (result.status === 'error') {
            throw new Error(result.message || 'Error saving program');
        }
    } catch (error) {
        console.error('Error saving program:', error);
        alert('Error saving program: ' + error.message);
    }
}

async function loadProgram() {
    try {
        if (!workspace) {
            throw new Error('Workspace not initialized');
        }

        const response = await fetch('/api/load');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        if (result.status === 'error') {
            throw new Error(result.message || 'Error loading program');
        }
        
        if (result.status === 'success' && result.program) {
            const program = Blockly.Xml.textToDom(result.program);
            Blockly.Xml.domToWorkspace(program, workspace);
        }
    } catch (error) {
        console.error('Error loading program:', error);
        alert('Error loading program: ' + error.message);
    }
}

// Movement functions
function moveForward() {
    if (!window.object) {
        console.error('Three.js object not initialized');
        return;
    }
    window.object.position.z -= 1;
    console.log('Moving forward');
}

function moveBackward() {
    if (!window.object) {
        console.error('Three.js object not initialized');
        return;
    }
    window.object.position.z += 1;
    console.log('Moving backward');
}

function turnLeft() {
    if (!window.object) {
        console.error('Three.js object not initialized');
        return;
    }
    window.object.rotation.y += Math.PI / 2;
    console.log('Turning left');
}

function turnRight() {
    if (!window.object) {
        console.error('Three.js object not initialized');
        return;
    }
    window.object.rotation.y -= Math.PI / 2;
    console.log('Turning right');
}

function moveDistance(distance) {
    if (!window.object) {
        console.error('Three.js object not initialized');
        return;
    }
    window.object.position.z -= distance;
    console.log('Moving distance:', distance);
}

function turnDegrees(degrees) {
    if (!window.object) {
        console.error('Three.js object not initialized');
        return;
    }
    window.object.rotation.y += degrees * Math.PI / 180;
    console.log('Turning degrees:', degrees);
}

// Scene control functions
function setCameraPosition(x, y, z) {
    if (!window.camera) {
        console.warn('Three.js camera not initialized yet');
        return;
    }
    window.camera.position.set(x, y, z);
    console.log('Setting camera position:', x, y, z);
}

function setCameraLookAt(x, y, z) {
    if (!window.camera) {
        console.warn('Three.js camera not initialized yet');
        return;
    }
    window.camera.lookAt(x, y, z);
    console.log('Setting camera look at:', x, y, z);
}

function setLightColor(color) {
    if (!window.directionalLight) {
        console.warn('Three.js directional light not initialized yet');
        return;
    }
    window.directionalLight.color.set(color);
    console.log('Setting light color:', color);
}

function setLightIntensity(intensity) {
    if (!window.directionalLight) {
        console.warn('Three.js directional light not initialized yet');
        return;
    }
    window.directionalLight.intensity = intensity;
    console.log('Setting light intensity:', intensity);
}

function setGroundColor(color) {
    if (!window.ground) {
        console.warn('Three.js ground plane not initialized yet');
        return;
    }
    window.ground.material.color.set(color);
    console.log('Setting ground color:', color);
}

function setGroundSize(size) {
    if (!window.ground) {
        console.warn('Three.js ground plane not initialized yet');
        return;
    }
    window.ground.scale.set(size, size, size);
    console.log('Setting ground size:', size);
}

// Initialize the application when the page loads
window.addEventListener('load', () => {
    console.log('Page loaded, starting initialization...');
    // Start initialization after a short delay to ensure all scripts are loaded
    setTimeout(initApp, 100);
}); 