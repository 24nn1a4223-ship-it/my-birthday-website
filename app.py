import os
import json
from flask import Flask, render_template, request, redirect, url_for, session, jsonify

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # Allow up to 50MB for photos

# A secret key is required by Flask to securely encrypt session cookies
app.secret_key = 'birthday-magic-secret-key-2026'

DATA_FILE = os.path.join(os.path.dirname(__file__), 'surprise_data.json')

# -------------------------------------------------------------
# 🔑 SET YOUR PASSWORD HERE
# You can change this to any password or PIN you want!
# -------------------------------------------------------------
SECRET_PASSWORD = "keerthiratnababu"


# 1. Main Home Page (Protected by Password)
@app.route('/')
def home():
    # If the user has NOT entered the password yet, show the Lock Screen
    if not session.get('authenticated'):
        return render_template('login.html')

    # If the user IS logged in, show the full Birthday Magic Studio!
    return render_template('index.html')


# 2. Login Check Route
@app.route('/login', methods=['POST'])
def login():
    entered_password = request.form.get('password', '').strip()

    # Check if the entered password matches your secret password
    if entered_password == SECRET_PASSWORD:
        session['authenticated'] = True
        return redirect(url_for('home'))
    else:
        # Show error message if password was incorrect
        return render_template('login.html', error="❌ Incorrect password! Please try again.")


# 3. Logout / Lock Website Route
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('home'))


# 4. Save Surprise Data API (Saves customized greetings & photos)
@app.route('/api/save-surprise', methods=['POST'])
def save_surprise():
    if not session.get('authenticated'):
        return jsonify({'error': 'Unauthorized'}), 401
    try:
        data = request.get_json(force=True)
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return jsonify({'status': 'success', 'message': 'Birthday surprise saved successfully!'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


# 5. Get Saved Surprise Data API (Loads customized greetings & photos)
@app.route('/api/get-surprise', methods=['GET'])
def get_surprise():
    if not session.get('authenticated'):
        return jsonify({'error': 'Unauthorized'}), 401
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
            return jsonify({'status': 'success', 'data': data})
        except Exception:
            return jsonify({'status': 'empty', 'data': None})
    return jsonify({'status': 'empty', 'data': None})


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print("\n" + "="*50)
    print("🔒 Password Protected Birthday Web Server is Running!")
    print(f"🔑 Secret Password is set to: {SECRET_PASSWORD}")
    print(f"👉 Local (this computer): http://127.0.0.1:{port}")
    print(f"👉 Phone (same Wi-Fi):   http://10.74.127.19:{port}")
    print("="*50 + "\n")
    app.run(host='0.0.0.0', port=port, debug=False)
