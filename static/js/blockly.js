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
            this.appendValueInput("SIZE")
                .setCheck("Number")
                .appendField("Set ground size to");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("Set the size of the ground plane");
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
    }
};

// Define JavaScript generators
const generators = {
    scene_color_picker: function(block) {
        const color = block.getFieldValue('COLOR');
        return `scene.background = new THREE.Color('${color}');\n`;
    },
    set_ground_color: function(block) {
        const color = block.getFieldValue('COLOR');
        return `threeApp.setGroundColor('${color}');\n`;
    },
    set_ground_size: function(block) {
        const size = Blockly.JavaScript.valueToCode(block, 'SIZE', Blockly.JavaScript.ORDER_ATOMIC);
        return `threeApp.setGroundSize(${size});\n`;
    },
    set_camera_position: function(block) {
        const x = Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_ATOMIC);
        const y = Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_ATOMIC);
        const z = Blockly.JavaScript.valueToCode(block, 'Z', Blockly.JavaScript.ORDER_ATOMIC);
        return `threeApp.setCameraPosition(${x}, ${y}, ${z});\n`;
    },
    set_camera_look_at: function(block) {
        const x = Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_ATOMIC);
        const y = Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_ATOMIC);
        const z = Blockly.JavaScript.valueToCode(block, 'Z', Blockly.JavaScript.ORDER_ATOMIC);
        return `threeApp.setCameraLookAt(${x}, ${y}, ${z});\n`;
    },
    set_light_color: function(block) {
        const color = block.getFieldValue('COLOR');
        return `threeApp.setDirectionalLightColor('${color}');\n`;
    },
    set_light_intensity: function(block) {
        const intensity = Blockly.JavaScript.valueToCode(block, 'INTENSITY', Blockly.JavaScript.ORDER_ATOMIC);
        return `threeApp.setDirectionalLightIntensity(${intensity});\n`;
    },
    set_light_position: function(block) {
        const x = Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_ATOMIC);
        const y = Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_ATOMIC);
        const z = Blockly.JavaScript.valueToCode(block, 'Z', Blockly.JavaScript.ORDER_ATOMIC);
        return `threeApp.setDirectionalLightPosition(${x}, ${y}, ${z});\n`;
    },
    set_ambient_light_color: function(block) {
        const color = block.getFieldValue('COLOR');
        return `threeApp.setAmbientLightColor('${color}');\n`;
    },
    set_ambient_light_intensity: function(block) {
        const intensity = Blockly.JavaScript.valueToCode(block, 'INTENSITY', Blockly.JavaScript.ORDER_ATOMIC);
        return `threeApp.setAmbientLightIntensity(${intensity});\n`;
    },
    reset_scene: function(block) {
        return `threeApp.resetScene();\n`;
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