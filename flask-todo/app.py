from flask import Flask, jsonify, request
from flask_cors import CORS  # type: ignore

app = Flask(__name__)
CORS(app)

todos = []

@app.route('/todos', methods=['GET'])
def get_todos():
    return jsonify(todos)

@app.route('/todos', methods=['POST'])
def add_todo():
    todo = request.json
    todo['done'] = False  # Add a 'done' status to each todo item
    todos.append(todo)
    return jsonify(todo), 201

@app.route('/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    todo = request.json
    for item in todos:
        if item['id'] == todo_id:
            item['text'] = todo.get('text', item['text'])
            item['done'] = todo.get('done', item['done'])
            return jsonify(item)
    return jsonify({'error': 'Todo not found'}), 404

@app.route('/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    global todos
    todos = [todo for todo in todos if todo['id'] != todo_id]
    return jsonify({'result': True})

if __name__ == '__main__':
    app.run(debug=True)
