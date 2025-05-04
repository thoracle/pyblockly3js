# Blockly3JS Design Document

## Overview
Blockly3JS is a visual programming environment that enables non-technical users to create and control 3D scenes using Blockly blocks. The application is built using Python/Flask for the backend and JavaScript for the frontend, with Three.js for 3D visualization.

## Architecture

### Backend (Python/Flask)
- **app.py**: Main Flask application
  - Handles HTTP requests
  - Manages program state
  - Provides API endpoints for code execution
  - Serves static files and templates

### Frontend (JavaScript)
- **blockly.js**: Block definitions and generators
  - Defines custom blocks for movement and control
  - Implements JavaScript code generation
  - Manages block workspace

- **three.js**: 3D visualization
  - Creates and manages Three.js scene
  - Handles object movement and rotation
  - Implements physics and collision detection
  - Manages camera and lighting

- **app.js**: Application logic
  - Initializes Blockly workspace
  - Handles user interactions
  - Manages code execution
  - Communicates with backend API

## Block Types

### Movement Blocks
- `move_forward`: Move the object forward
- `move_backward`: Move the object backward
- `turn_left`: Turn the object left
- `turn_right`: Turn the object right
- `move_distance`: Move a specific distance
- `turn_degrees`: Turn a specific number of degrees

### Logic Blocks
- `controls_if`: Conditional execution (if/else statements)
- `controls_repeat`: Loop execution (repeat blocks)
- `math_number`: Number inputs and values
- `logic_compare`: Comparison operators (=, ≠, <, ≤, >, ≥)

## API Endpoints

### POST /api/execute
Executes generated JavaScript code
- Request body: `{ code: string }`
- Response: `{ status: 'success' | 'error', message?: string }`

### POST /api/save
Saves the current program state
- Request body: `{ program: string }`
- Response: `{ status: 'success' | 'error', message?: string }`

### GET /api/load
Loads the saved program state
- Response: `{ status: 'success' | 'error', program?: string, message?: string }`

## Data Flow
1. User creates program using Blockly blocks
2. Blocks are converted to JavaScript code
3. Code is sent to backend via API
4. Backend executes code and updates 3D scene
5. Results are reflected in the visualization

## Error Handling
- Frontend validates block connections
- Backend catches and reports execution errors
- User-friendly error messages displayed in UI

## Security Considerations
- Code execution is sandboxed
- Input validation on API endpoints
- Rate limiting on code execution
- CORS configuration for API access

## Future Enhancements
- Additional block types (variables, math operations)
- Program sharing and collaboration
- User authentication and program persistence
- Custom block creation interface
- Advanced 3D scene manipulation
- Animation and timeline controls
- Export/import functionality
- Tutorial system
- Error highlighting and debugging tools 