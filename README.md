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