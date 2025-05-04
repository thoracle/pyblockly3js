# Blockly3JS

A visual programming environment that enables non-technical users to create and control 3D scenes using Blockly blocks.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the application:
```bash
python app.py
```

4. Run tests:
```bash
pytest
```

## Project Structure

```
blockly3js/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── static/               # Static files
│   └── js/              # JavaScript files
│       └── app.js       # Frontend application logic
├── templates/            # HTML templates
│   └── index.html       # Main template
└── tests/               # Test files
    └── test_app.py      # Application tests
```

## Features

- Visual programming interface using Blockly
- Real-time 3D visualization with Three.js
- Physics-based movement system
- Collision detection
- Keyboard input handling
- Customizable scene properties

## Development

- Use `black` for code formatting
- Use `flake8` for linting
- Run tests before committing changes

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