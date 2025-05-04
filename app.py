from flask import Flask, render_template, jsonify, request
import json

app = Flask(__name__)

@app.route('/')
def index():
    """Render the main application page."""
    return render_template('index.html')

@app.route('/api/execute', methods=['POST'])
def execute_code():
    """Execute code generated from Blockly blocks."""
    try:
        data = request.get_json()
        code = data.get('code', '')
        
        # TODO: Implement code execution logic
        # This will be implemented when we add the physics and movement systems
        
        return jsonify({
            'status': 'success',
            'message': 'Code executed successfully'
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/save', methods=['POST'])
def save_program():
    """Save the current Blockly program."""
    try:
        data = request.get_json()
        program = data.get('program', '')
        
        # TODO: Implement program saving logic
        # This will be implemented when we add save/load functionality
        
        return jsonify({
            'status': 'success',
            'message': 'Program saved successfully'
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/load', methods=['GET'])
def load_program():
    """Load a saved Blockly program."""
    try:
        # TODO: Implement program loading logic
        # This will be implemented when we add save/load functionality
        
        return jsonify({
            'status': 'success',
            'program': ''
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True) 