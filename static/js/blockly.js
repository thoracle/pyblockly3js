// Blockly block definitions and utilities
console.log('Loading Blockly block definitions...');

// Define custom block types
const customBlocks = {
    // Color picker block
    scene_color_picker: {
        init: function() {
            this.appendDummyInput()
                .appendField("Set scene color")
                .appendField(new Blockly.FieldColour("#ffffff"), "COLOR");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip("Set the scene background color");
        }
    },
    // Movement blocks
    move_forward: {
        init: function() {
            this.appendDummyInput()
                .appendField("move forward");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip("Move the object forward");
        }
    },
    move_backward: {
        init: function() {
            this.appendDummyInput()
                .appendField("move backward");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip("Move the object backward");
        }
    },
    turn_left: {
        init: function() {
            this.appendDummyInput()
                .appendField("turn left");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip("Turn the object left");
        }
    },
    turn_right: {
        init: function() {
            this.appendDummyInput()
                .appendField("turn right");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip("Turn the object right");
        }
    },
    move_distance: {
        init: function() {
            this.appendValueInput("DISTANCE")
                .setCheck("Number")
                .appendField("move")
                .appendField("units");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip("Move the object a specific distance");
        }
    },
    turn_degrees: {
        init: function() {
            this.appendValueInput("DEGREES")
                .setCheck("Number")
                .appendField("turn")
                .appendField("degrees");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip("Turn the object a specific number of degrees");
        }
    },
    // Scene control blocks
    set_camera_position: {
        init: function() {
            this.appendValueInput("X")
                .setCheck("Number")
                .appendField("set camera position x");
            this.appendValueInput("Y")
                .setCheck("Number")
                .appendField("y");
            this.appendValueInput("Z")
                .setCheck("Number")
                .appendField("z");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("Set the camera position in 3D space");
        }
    },
    set_camera_look_at: {
        init: function() {
            this.appendValueInput("X")
                .setCheck("Number")
                .appendField("set camera to look at x");
            this.appendValueInput("Y")
                .setCheck("Number")
                .appendField("y");
            this.appendValueInput("Z")
                .setCheck("Number")
                .appendField("z");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("Set where the camera is looking");
        }
    },
    set_light_color: {
        init: function() {
            this.appendValueInput("COLOR")
                .setCheck("Colour")
                .appendField("set light color to");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("Set the color of the directional light");
        }
    },
    set_light_intensity: {
        init: function() {
            this.appendValueInput("INTENSITY")
                .setCheck("Number")
                .appendField("set light intensity to");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("Set the intensity of the directional light (0-1)");
        }
    },
    set_ground_color: {
        init: function() {
            this.appendValueInput("COLOR")
                .setCheck("Colour")
                .appendField("set ground color to");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("Set the color of the ground plane");
            this.setInputsInline(true);
            
            // Add a default color picker block
            const colorBlock = workspace.newBlock('scene_color_picker');
            colorBlock.initSvg();
            this.getInput('COLOR').connection.connect(colorBlock.outputConnection);
        }
    },
    set_ground_size: {
        init: function() {
            this.appendValueInput("SIZE")
                .setCheck("Number")
                .appendField("set ground size to");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("Set the size of the ground plane");
        }
    }
};

// Define JavaScript generators
const generators = {
    scene_color_picker: function(block) {
        const color = block.getFieldValue('COLOR');
        return `scene.background = new THREE.Color('${color}');\n`;
    },
    move_forward: function(block) {
        return 'moveForward();\n';
    },
    move_backward: function(block) {
        return 'moveBackward();\n';
    },
    turn_left: function(block) {
        return 'turnLeft();\n';
    },
    turn_right: function(block) {
        return 'turnRight();\n';
    },
    move_distance: function(block) {
        const distance = Blockly.JavaScript.valueToCode(block, 'DISTANCE', Blockly.JavaScript.ORDER_ATOMIC);
        if (!distance) {
            console.error('Missing distance value in move_distance block');
            return 'console.error("Missing distance value");\n';
        }
        return `moveDistance(${distance});\n`;
    },
    turn_degrees: function(block) {
        const degrees = Blockly.JavaScript.valueToCode(block, 'DEGREES', Blockly.JavaScript.ORDER_ATOMIC);
        if (!degrees) {
            console.error('Missing degrees value in turn_degrees block');
            return 'console.error("Missing degrees value");\n';
        }
        return `turnDegrees(${degrees});\n`;
    },
    // Scene control generators
    set_camera_position: function(block) {
        const x = Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_ATOMIC);
        const y = Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_ATOMIC);
        const z = Blockly.JavaScript.valueToCode(block, 'Z', Blockly.JavaScript.ORDER_ATOMIC);
        if (!x || !y || !z) {
            console.error('Missing position values in set_camera_position block');
            return 'console.error("Missing position values");\n';
        }
        return `setCameraPosition(${x}, ${y}, ${z});\n`;
    },
    set_camera_look_at: function(block) {
        const x = Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_ATOMIC);
        const y = Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_ATOMIC);
        const z = Blockly.JavaScript.valueToCode(block, 'Z', Blockly.JavaScript.ORDER_ATOMIC);
        if (!x || !y || !z) {
            console.error('Missing look at values in set_camera_look_at block');
            return 'console.error("Missing look at values");\n';
        }
        return `setCameraLookAt(${x}, ${y}, ${z});\n`;
    },
    set_light_color: function(block) {
        const color = Blockly.JavaScript.valueToCode(block, 'COLOR', Blockly.JavaScript.ORDER_ATOMIC);
        if (!color) {
            console.error('Missing color value in set_light_color block');
            return 'console.error("Missing color value");\n';
        }
        return `setLightColor(${color});\n`;
    },
    set_light_intensity: function(block) {
        const intensity = Blockly.JavaScript.valueToCode(block, 'INTENSITY', Blockly.JavaScript.ORDER_ATOMIC);
        if (!intensity) {
            console.error('Missing intensity value in set_light_intensity block');
            return 'console.error("Missing intensity value");\n';
        }
        return `setLightIntensity(${intensity});\n`;
    },
    set_ground_color: function(block) {
        const color = Blockly.JavaScript.valueToCode(block, 'COLOR', Blockly.JavaScript.ORDER_ATOMIC);
        if (!color) {
            console.error('Missing color value in set_ground_color block');
            return 'console.error("Missing color value");\n';
        }
        return `setGroundColor(${color});\n`;
    },
    set_ground_size: function(block) {
        const size = Blockly.JavaScript.valueToCode(block, 'SIZE', Blockly.JavaScript.ORDER_ATOMIC);
        if (!size) {
            console.error('Missing size value in set_ground_size block');
            return 'console.error("Missing size value");\n';
        }
        return `setGroundSize(${size});\n`;
    }
};

// Initialize Blockly
function initializeBlockly() {
    // Register custom blocks
    Object.entries(customBlocks).forEach(([type, definition]) => {
        Blockly.Blocks[type] = definition;
    });

    // Initialize Blockly.JavaScript.forBlock if it doesn't exist
    if (!Blockly.JavaScript.forBlock) {
        Blockly.JavaScript.forBlock = {};
    }

    // Register JavaScript generators
    Object.entries(generators).forEach(([type, generator]) => {
        Blockly.JavaScript[type] = generator;
        Blockly.JavaScript.forBlock[type] = generator;
    });

    // Verify block registration
    console.log('Registered custom blocks:', Object.keys(Blockly.Blocks).filter(key => key.startsWith('scene_') || key.startsWith('move_') || key.startsWith('turn_') || key.startsWith('set_')));
    console.log('Registered generators:', Object.keys(Blockly.JavaScript).filter(key => key.startsWith('scene_') || key.startsWith('move_') || key.startsWith('turn_') || key.startsWith('set_')));
}

// Wait for Blockly to be fully loaded
if (typeof Blockly !== 'undefined') {
    initializeBlockly();
} else {
    window.addEventListener('load', () => {
        if (typeof Blockly !== 'undefined') {
            initializeBlockly();
        }
    });
}

console.log('Blockly block definitions loaded successfully'); 