from flask import Flask, render_template, request, redirect, url_for, session

app = Flask(__name__)

# A secret key is required by Flask to securely encrypt session cookies
app.secret_key = 'birthday-magic-secret-key-2026'

# -------------------------------------------------------------
# 🔑 SET YOUR PASSWORD HERE
# You can change this to any password or PIN you want!
# -------------------------------------------------------------
SECRET_PASSWORD = "Ratna@22#"


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


if __name__ == '__main__':
    print("\n" + "="*50)
    print("🔒 Password Protected Birthday Web Server is Running!")
    print(f"🔑 Secret Password is set to: {SECRET_PASSWORD}")
    print("👉 Open your browser to: http://127.0.0.1:5000")
    print("="*50 + "\n")
    app.run(debug=True, port=5000)
