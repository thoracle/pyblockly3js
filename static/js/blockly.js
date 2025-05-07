// Blockly block definitions and utilities
console.log('Loading Blockly block definitions...');

// Define custom block types
const customBlocks = {
    // Scene control blocks
    scene_color_picker: {
        init: function() {
            this.appendDummyInput()
                .appendField("Set scene background color")
                .appendField(new Blockly.FieldColour("#ffffff"), "COLOR");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("Set the scene background color");
        }
    },
    set_ground_color: {
        init: function() {
            this.appendDummyInput()
                .appendField("Set ground color")
                .appendField(new Blockly.FieldColour("#808080"), "COLOR");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("Set the color of the ground plane");
        }
    },
    set_ground_size: {
        init: function() {
            this.appendValueInput("X")
                .setCheck("Number")
                .appendField("Set ground size X");
            this.appendValueInput("Y")
                .setCheck("Number")
                .appendField("Y");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("Set the size of the ground plane in X and Y dimensions");
        }
    },
    set_camera_position: {
        init: function() {
            this.appendValueInput("X")
                .setCheck("Number")
                .appendField("Set camera position X");
            this.appendValueInput("Y")
                .setCheck("Number")
                .appendField("Y");
            this.appendValueInput("Z")
                .setCheck("Number")
                .appendField("Z");
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
                .appendField("Set camera to look at X");
            this.appendValueInput("Y")
                .setCheck("Number")
                .appendField("Y");
            this.appendValueInput("Z")
                .setCheck("Number")
                .appendField("Z");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("Set where the camera is looking");
        }
    },
    set_light_color: {
        init: function() {
            this.appendDummyInput()
                .appendField("Set directional light color")
                .appendField(new Blockly.FieldColour("#ffffff"), "COLOR");
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
                .appendField("Set directional light intensity to");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("Set the intensity of the directional light (0-1)");
        }
    },
    set_light_position: {
        init: function() {
            this.appendValueInput("X")
                .setCheck("Number")
                .appendField("Set light position X");
            this.appendValueInput("Y")
                .setCheck("Number")
                .appendField("Y");
            this.appendValueInput("Z")
                .setCheck("Number")
                .appendField("Z");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("Set the position of the directional light");
        }
    },
    set_ambient_light_color: {
        init: function() {
            this.appendDummyInput()
                .appendField("Set ambient light color")
                .appendField(new Blockly.FieldColour("#ffffff"), "COLOR");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("Set the color of the ambient light");
        }
    },
    set_ambient_light_intensity: {
        init: function() {
            this.appendValueInput("INTENSITY")
                .setCheck("Number")
                .appendField("Set ambient light intensity to");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("Set the intensity of the ambient light (0-1)");
        }
    },
    reset_scene: {
        init: function() {
            this.appendDummyInput()
                .appendField("Reset scene to default");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("Reset the scene to its default state");
        }
    },
    // Wait block
    wait_seconds: {
        init: function() {
            this.appendValueInput("SECONDS")
                .setCheck("Number")
                .appendField("Wait");
            this.appendDummyInput()
                .appendField("seconds");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(280);
            this.setTooltip("Wait for the specified number of seconds");
        }
    },
    // Movement blocks
    move_forward: {
        init: function() {
            this.appendValueInput("DISTANCE")
                .setCheck("Number")
                .appendField("Move forward");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(280);
            this.setTooltip("Move the cube forward by the specified distance");
        }
    },
    move_backward: {
        init: function() {
            this.appendValueInput("DISTANCE")
                .setCheck("Number")
                .appendField("Move backward");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(280);
            this.setTooltip("Move the cube backward by the specified distance");
        }
    },
    turn_left: {
        init: function() {
            this.appendValueInput("ANGLE")
                .setCheck("Number")
                .appendField("Turn left");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(280);
            this.setTooltip("Turn the cube left by the specified angle (in degrees)");
        }
    },
    turn_right: {
        init: function() {
            this.appendValueInput("ANGLE")
                .setCheck("Number")
                .appendField("Turn right");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(280);
            this.setTooltip("Turn the cube right by the specified angle (in degrees)");
        }
    }
};

// Define JavaScript generators
const generators = {
    scene_color_picker: function(block) {
        const color = block.getFieldValue('COLOR');
        return `setSceneBackgroundColor('${color}');\n`;
    },
    set_ground_color: function(block) {
        const color = block.getFieldValue('COLOR');
        return `setGroundColor('${color}');\n`;
    },
    set_ground_size: function(block) {
        const x = Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_NONE) || '1';
        const y = Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_NONE) || '1';
        return `setGroundSize(${x}, ${y});\n`;
    },
    set_camera_position: function(block) {
        const x = Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_NONE) || '0';
        const y = Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_NONE) || '0';
        const z = Blockly.JavaScript.valueToCode(block, 'Z', Blockly.JavaScript.ORDER_NONE) || '0';
        return `setCameraPosition(${x}, ${y}, ${z});\n`;
    },
    set_camera_look_at: function(block) {
        const x = Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_ATOMIC);
        const y = Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_ATOMIC);
        const z = Blockly.JavaScript.valueToCode(block, 'Z', Blockly.JavaScript.ORDER_ATOMIC);
        return `setCameraLookAt(${x}, ${y}, ${z});\n`;
    },
    set_light_color: function(block) {
        const color = block.getFieldValue('COLOR');
        return `setDirectionalLightColor('${color}');\n`;
    },
    set_light_intensity: function(block) {
        const intensity = Blockly.JavaScript.valueToCode(block, 'INTENSITY', Blockly.JavaScript.ORDER_ATOMIC);
        return `setDirectionalLightIntensity(${intensity});\n`;
    },
    set_light_position: function(block) {
        const x = Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_ATOMIC);
        const y = Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_ATOMIC);
        const z = Blockly.JavaScript.valueToCode(block, 'Z', Blockly.JavaScript.ORDER_ATOMIC);
        return `setDirectionalLightPosition(${x}, ${y}, ${z});\n`;
    },
    set_ambient_light_color: function(block) {
        const color = block.getFieldValue('COLOR');
        return `setAmbientLightColor('${color}');\n`;
    },
    set_ambient_light_intensity: function(block) {
        const intensity = Blockly.JavaScript.valueToCode(block, 'INTENSITY', Blockly.JavaScript.ORDER_ATOMIC);
        return `setAmbientLightIntensity(${intensity});\n`;
    },
    reset_scene: function(block) {
        return `resetScene();\n`;
    },
    // Wait generator
    wait_seconds: function(block) {
        const seconds = Blockly.JavaScript.valueToCode(block, 'SECONDS', Blockly.JavaScript.ORDER_NONE) || '1';
        return `setTimeout(function() {}, ${seconds} * 1000);\n`;
    },
    // Movement generators
    move_forward: function(block) {
        const distance = Blockly.JavaScript.valueToCode(block, 'DISTANCE', Blockly.JavaScript.ORDER_NONE) || '1';
        return `moveCubeForward(${distance});\n`;
    },
    move_backward: function(block) {
        const distance = Blockly.JavaScript.valueToCode(block, 'DISTANCE', Blockly.JavaScript.ORDER_NONE) || '1';
        return `moveCubeBackward(${distance});\n`;
    },
    turn_left: function(block) {
        const angle = Blockly.JavaScript.valueToCode(block, 'ANGLE', Blockly.JavaScript.ORDER_NONE) || '90';
        return `turnCubeLeft(${angle});\n`;
    },
    turn_right: function(block) {
        const angle = Blockly.JavaScript.valueToCode(block, 'ANGLE', Blockly.JavaScript.ORDER_NONE) || '90';
        return `turnCubeRight(${angle});\n`;
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
    console.log('Registered custom blocks:', Object.keys(Blockly.Blocks).filter(key => key.startsWith('scene_') || key.startsWith('set_')));
    console.log('Registered generators:', Object.keys(Blockly.JavaScript).filter(key => key.startsWith('scene_') || key.startsWith('set_')));
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