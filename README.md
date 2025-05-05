# Blockly3JS

A visual programming environment that enables non-technical users to create and control 3D scenes using Blockly blocks.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Install Node.js dependencies:
```bash
npm install
```

4. Run the application:
```bash
python app.py
```

5. Run tests:
```bash
# Python tests
pytest

# JavaScript tests
npm test
```

## Project Structure

```
blockly3js/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── package.json          # Node.js dependencies
├── .babelrc             # Babel configuration for testing
├── static/              # Static files
│   ├── js/             # JavaScript files
│   │   ├── app.js      # Frontend application logic
│   │   ├── blockly.js  # Blockly configuration and blocks
│   │   ├── three.js    # Three.js scene setup and rendering
│   │   └── macbook-controls.js # MacBook-specific controls
│   └── css/            # Stylesheets
├── templates/           # HTML templates
│   └── index.html      # Main template
└── tests/              # Test files
    └── test_app.py     # Application tests
```

## Features

- Visual programming interface using Blockly
- Real-time 3D visualization with Three.js
- Physics-based movement system
- Collision detection
- Keyboard and touch input handling
- MacBook-specific controls and gestures
- Customizable scene properties

## Development

- Use `black` for Python code formatting
- Use `flake8` for Python linting
- Use `eslint` for JavaScript linting
- Run tests before committing changes
- Follow the design guidelines in `design.md`

## Toolbox Groups and Blocks

### Movement
- `move_forward` - Move the object forward
- `move_backward` - Move the object backward
- `turn_left` - Turn the object left
- `turn_right` - Turn the object right
- `move_distance` - Move the object a specific distance
- `turn_degrees` - Turn the object a specific number of degrees

### Scene
- `set_camera_position` - Set camera position (x, y, z)
- `set_camera_look_at` - Set camera look-at position (x, y, z)
- `set_light_color` - Set directional light color
- `set_light_intensity` - Set directional light intensity (0-1)
- `set_ground_color` - Set ground plane color
- `set_ground_size` - Set ground plane size

### Logic
- `controls_if` - If/else statements
- `controls_repeat_ext` - Loops
- `logic_compare` - Comparison operations
- `logic_operation` - Boolean operations
- `logic_negate` - NOT operations
- `logic_boolean` - True/false values
- `math_number` - Number inputs
- `math_arithmetic` - Basic arithmetic operations
- `math_random_int` - Generate random integers 