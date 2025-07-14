from flask import Flask, redirect, request, jsonify, send_from_directory, url_for, session
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import os
import pandas as pd
from flask_mail import Mail, Message
from datetime import datetime, timedelta
from itsdangerous import URLSafeTimedSerializer
from random import randint
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
# -------------------------
env_path = Path(__file__).resolve().parent / '.env'
load_dotenv(dotenv_path=env_path)
load_dotenv(dotenv_path=env_path)
print("SECRET_KEY:", os.getenv("SECRET_KEY"))
print("FRONTEND_BASE_URL:", os.getenv("FRONTEND_BASE_URL"))

# -------------------------
# Flask Setup
# -------------------------
app = Flask(__name__, static_folder="../frontend/build", static_url_path="/")
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:3000",
            "http://localhost:5000",
            "https://opulent-fortnight-pj9vxqgwpp55crv9v-3000.app.github.dev",
            "https://opulent-fortnight-pj9vxqgwpp55crv9v-5000.app.github.dev"
        ],
        "supports_credentials": True
    }
})
# ------
# Prevent trailing slash redirects that cause 302 (and break CORS)
app.url_map.strict_slashes = False

# Load frontend origin from .env, fallback to Codespaces URL
FRONTEND_BASE_URL = os.getenv(
    'FRONTEND_BASE_URL',
    'https://opulent-fortnight-pj9vxqgwpp55crv9v-3000.app.github.dev'
)

# 🔐 App Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True') == 'True'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')

# 🔧 Init libraries
bcrypt = Bcrypt(app)
s = URLSafeTimedSerializer(app.config['SECRET_KEY'])
mail = Mail(app)
db = SQLAlchemy(app)

# -------------------------
# Database Models
# -------------------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(20), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    matriculation = db.Column(db.String(100), nullable=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    confirmed = db.Column(db.Boolean, default=False)

class Seat(db.Model):
    __tablename__ = 'seats'

    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(20), nullable=False)
    area = db.Column(db.String(50), nullable=False)
    is_booked = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f"<Seat {self.label} in {self.area}>"

class Booking(db.Model):
    __tablename__ = 'bookings'

    id = db.Column(db.Integer, primary_key=True)
    seat_id = db.Column(db.Integer, db.ForeignKey('seats.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user_email = db.Column(db.String(100), nullable=False)
    start_time = db.Column(db.DateTime, default=datetime.utcnow)
    end_time = db.Column(db.DateTime, nullable=False)

    seat = db.relationship('Seat', backref='bookings')
    user = db.relationship('User', backref='bookings')

# -------------------------
# Initialize DB and Add Seats S1-S6
# -------------------------
with app.app_context():
    db.create_all()

    existing_labels = {seat.label for seat in Seat.query.all()}
    for i in range(1, 7):
        label = f"S{i}"
        if label not in existing_labels:
            new_seat = Seat(label=label, area="Main Room", is_booked=False)
            db.session.add(new_seat)
    db.session.commit()

# -------------------------
# CSV Sensor Simulation
# -------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "Updated_IR_Sensor_Events.csv")

import random

def calculate_current_occupancy(file_path: str, initial_count: int = 10):
    try:
        df = pd.read_csv(file_path)
    except Exception as e:
        print(f"Error reading CSV: {e}")
        return initial_count

    if 'timestamp' not in df or 'entrance_sensor' not in df or 'exit_sensor' not in df:
        print("Missing required columns")
        return initial_count

    now = datetime.now()
    random_event = random.choice(["enter", "exit"])

    if random_event == "enter":
        new_rows = pd.DataFrame([
            {"timestamp": now, "entrance_sensor": 1, "exit_sensor": 0},
            {"timestamp": now + pd.Timedelta(seconds=1), "entrance_sensor": 0, "exit_sensor": 1}
        ])
    else:
        new_rows = pd.DataFrame([
            {"timestamp": now, "entrance_sensor": 0, "exit_sensor": 1},
            {"timestamp": now + pd.Timedelta(seconds=1), "entrance_sensor": 1, "exit_sensor": 0}
        ])

    df = pd.concat([df, new_rows], ignore_index=True)
    df = df.tail(200)
    df.to_csv(file_path, index=False)

    df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce')
    df = df.sort_values(by='timestamp').reset_index(drop=True)

    people_inside = initial_count
    i = 0

    while i < len(df) - 1:
        current = df.iloc[i]
        next_row = df.iloc[i + 1]
        time_diff = (next_row['timestamp'] - current['timestamp']).total_seconds()

        if time_diff > 3:
            i += 1
            continue

        if current['entrance_sensor'] == 1 and next_row['exit_sensor'] == 1:
            people_inside += 1
            i += 2
        elif current['exit_sensor'] == 1 and next_row['entrance_sensor'] == 1:
            people_inside = max(0, people_inside - 1)
            i += 2
        else:
            i += 1

    return people_inside

def get_crowd_status(people_inside: int):
    if people_inside < 12:
        return {"status": "Not Crowded", "color": "green"}
    elif 12 <= people_inside <= 25:
        return {"status": "Crowded", "color": "warning"}
    else:
        return {"status": "Very Crowded", "color": "red"}
@app.before_request
def handle_options_requests():
    if request.method == 'OPTIONS':
        response = app.make_response('')
        response.status_code = 200
        response.headers.add('Access-Control-Allow-Origin', request.headers.get('Origin', '*'))
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response

@app.route('/api/crowd-status', methods=['GET'])
def crowd_status():
    try:
        people_inside = calculate_current_occupancy(CSV_PATH)
        people_inside = min(people_inside, 35)

        status_info = get_crowd_status(people_inside)

        return jsonify({
            "people_inside": people_inside,
            "status": status_info["status"],
            "color": status_info["color"]
        })
    except Exception as e:
        print("Error in /api/crowd-status:", str(e))
        return jsonify({"error": "Internal Server Error"}), 500

# -------------------------
# Auth + Booking Routes
# -------------------------
@app.route('/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        # Preflight request – reply with OK
        return '', 200

    data = request.json
    if not data:
        return jsonify({"message": "No input provided"}), 400

    role = data.get('role')
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('first_name', '')
    last_name = data.get('last_name', '')
    matriculation = data.get('matriculation', '')

    if role == 'Student':
        if not all([first_name, last_name, matriculation, email, password]):
            return jsonify({"message": "Missing required student fields"}), 400
    elif role in ['Professor', 'Guest']:
        if not all([first_name, last_name, email, password]):
            return jsonify({"message": f"Missing required {role.lower()} fields"}), 400
    else:
        return jsonify({"message": "Invalid role provided"}), 400

    hashed = bcrypt.generate_password_hash(password).decode('utf-8')

    new_user = User(
        role=role,
        email=email,
        password=hashed,
        first_name=first_name,
        last_name=last_name,
        matriculation=matriculation,
        confirmed=False
    )

    db.session.add(new_user)
    db.session.commit()

    token = s.dumps(email, salt='email-confirm')
    confirm_url = url_for('confirm_email', token=token, _external=True)

    msg = Message('Confirm your email', recipients=[email])
    msg.body = f"Hi {first_name},\n\nPlease confirm your email by clicking the link: {confirm_url}"
    mail.send(msg)

    return jsonify({"message": "Registered successfully! Please check your email to confirm."}), 201

@app.route('/confirm-email/<token>')
def confirm_email(token):
    try:
        email = s.loads(token, salt='email-confirm', max_age=3600)
    except Exception:
        return jsonify({"message": "The confirmation link is invalid or has expired."}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return "User not found", 404

    if not user.confirmed:
        user.confirmed = True
        db.session.commit()

    return redirect("http://localhost:3000/login")

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    if not data:
        return jsonify({"message": "No input provided"}), 400

    identifier = data.get("identifier")
    password = data.get("password")
    role = data.get("role")

    if not identifier or not password or not role:
        return jsonify({"message": "Missing credentials"}), 400

    if role == "Student":
        user = User.query.filter(
            (User.email == identifier) | (User.matriculation == identifier),
            User.role == "Student"
        ).first()
    else:
        user = User.query.filter_by(email=identifier, role=role).first()

    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"message": "Invalid credentials or role"}), 401

    if not user.confirmed:
        return jsonify({"message": "Please confirm your email first."}), 403

    verification_code = str(randint(100000, 999999))
    session['2fa_code'] = verification_code
    session['pending_user_id'] = user.id

    msg = Message("Your Login Verification Code", sender="noreply@coworking.com", recipients=[user.email])
    msg.body = f"Hi {user.first_name},\n\nYour verification code is: {verification_code}"
    mail.send(msg)

    return jsonify({"message": "Verification code sent to your email", "require_2fa": True}), 200

@app.route('/verify-2fa', methods=['POST'])
def verify_2fa():
    data = request.json
    code = data.get('code')

    if not code or session.get('2fa_code') != code:
        return jsonify({"message": "Invalid verification code"}), 400

    user_id = session.get('pending_user_id')
    if not user_id:
        return jsonify({"message": "Session expired"}), 403

    user = User.query.get(user_id)

    session.pop('2fa_code', None)
    session.pop('pending_user_id', None)

    return jsonify({
        "message": "Login successful!",
        "user": {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role,
            "email": user.email
        }
    }), 200

@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.json
    email = data.get('email')

    if not email:
        return jsonify({"message": "Email is required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "No user with that email"}), 404

    token = s.dumps(email, salt='reset-password')
    reset_link = f"{FRONTEND_BASE_URL}/reset-password/{token}"

    msg = Message("Password Reset Request", recipients=[email])
    msg.body = f"Hi {user.first_name}, click this link to reset your password: {reset_link}"
    mail.send(msg)

    return jsonify({"message": "Reset link sent to your email"}), 200

@app.route('/reset-password/<token>', methods=['POST'])
def reset_password(token):
    try:
        email = s.loads(token, salt='reset-password', max_age=3600)
    except Exception:
        return jsonify({"message": "Invalid or expired token"}), 400

    data = request.json
    new_password = data.get('new_password')
    confirm_password = data.get('confirm_password')

    if new_password != confirm_password:
        return jsonify({"message": "Passwords do not match"}), 400

    user = User.query.filter_by(email=email).first()
    if user:
        hashed = bcrypt.generate_password_hash(new_password).decode('utf-8')
        user.password = hashed
        db.session.commit()
        return jsonify({"message": "Password reset successful"}), 200

    return jsonify({"message": "User not found"}), 404

@app.route('/contact', methods=['POST'])
def contact():
    data = request.json
    if not data:
        return jsonify({'message': 'No data received'}), 400

    msg = Message(
        subject="Coworking Space Inquiry",
        recipients=['1he.1nnovation.hub@gmail.com'],
        body=f"From: {data['first_name']} {data['last_name']} <{data['email']}>\n\nMessage:\n{data['message']}"
    )
    print("Contact form received:", data)
    try:
        mail.send(msg)
        return jsonify({'message': 'Message sent successfully!'}), 200
    except Exception as e:
        print(f"Error sending email: {e}")
        return jsonify({'message': 'Failed to send message'}), 500

from flask import request
from sqlalchemy import and_

from sqlalchemy import and_

@app.route('/api/available-seats', methods=['GET'])
def get_available_seats():
    start = request.args.get("start")
    end = request.args.get("end")

    if not start or not end:
        return jsonify({"error": "Missing start or end time"}), 400

    start_dt = datetime.fromisoformat(start)
    end_dt = datetime.fromisoformat(end)

    overlapping = Booking.query.filter(
        and_(
            Booking.start_time < end_dt,
            Booking.end_time > start_dt
        )
    ).with_entities(Booking.seat_id).distinct()

    booked_ids = [b.seat_id for b in overlapping]
    available = Seat.query.filter(~Seat.id.in_(booked_ids)).all()

    return jsonify([
        {"id": seat.id, "label": seat.label, "area": seat.area}
        for seat in available
    ])

@app.route("/api/book-seat", methods=["POST"])
def book_seat():
    data = request.json
    seat_id = data.get("seat_id")
    start_time = data.get("start_time")
    end_time = data.get("end_time")
    user_id = data.get("user_id")

    if not all([seat_id, start_time, end_time, user_id]):
        return jsonify({"message": "Missing data"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "Invalid user"}), 403

    try:
        start = datetime.fromisoformat(start_time)
        end = datetime.fromisoformat(end_time)
    except ValueError:
        return jsonify({"message": "Invalid datetime format"}), 400

    if end <= start:
        return jsonify({"message": "End time must be after start time"}), 400

    if end.date() != start.date():
        return jsonify({"message": "Booking must be within the same day"}), 400

    MAX_DURATION = timedelta(hours=4)
    if end - start > MAX_DURATION:
        end = start + MAX_DURATION

    # Check if the seat is already booked in that time slot
    seat_conflict = Booking.query.filter(
        Booking.seat_id == seat_id,
        Booking.start_time < end,
        Booking.end_time > start
    ).first()

    if seat_conflict:
        return jsonify({"message": "Seat is already booked for that time"}), 409

    # ❗ Check if the user already has an active booking
    active_booking = Booking.query.filter(
        Booking.user_id == user_id,
        Booking.end_time > datetime.utcnow()
    ).first()

    if active_booking:
        return jsonify({
            "message": "You already have an active booking. You can only book again after it ends."
        }), 403

    booking = Booking(
        seat_id=seat_id,
        user_id=user_id,
        user_email=user.email,
        start_time=start,
        end_time=end
    )

    db.session.add(booking)
    db.session.commit()

    return jsonify({"message": "Seat booked successfully"}), 200

@app.route("/api/my-bookings/<int:user_id>", methods=["GET"])
def get_my_bookings(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    bookings = Booking.query.filter_by(user_id=user_id).all()
    return jsonify([
        {
            "seat": b.seat.label,
            "area": b.seat.area,
            "start_time": b.start_time.isoformat(),
            "end_time": b.end_time.isoformat(),
        }
        for b in bookings
    ])
@app.route("/api/profile/<int:user_id>", methods=["GET"])
def get_profile(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    # Check for active booking
    active_booking = Booking.query.filter(
        Booking.user_id == user_id,
        Booking.end_time > datetime.utcnow()
    ).first()

    return jsonify({
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "role": user.role,
        "matriculation": user.matriculation,  # include this if your model has it
        "active_booking": {
            "id": active_booking.id,  # <-- added booking ID
            "seat": active_booking.seat.label,
            "start_time": active_booking.start_time.isoformat(),
            "end_time": active_booking.end_time.isoformat()
        } if active_booking else None
    })

from flask import request

@app.route("/api/bookings/<int:booking_id>", methods=["PUT"])
def update_booking(booking_id):
    data = request.get_json()
    booking = Booking.query.get(booking_id)

    if not booking:
        return jsonify({"message": "Booking not found"}), 404

    # Optional: verify that the user making the request is authorized to update this booking

    # Update booking fields
    new_seat_label = data.get("seat")
    new_start_time = data.get("start_time")
    new_end_time = data.get("end_time")

    if new_seat_label:
        seat = Seat.query.filter_by(label=new_seat_label).first()
        if not seat:
            return jsonify({"message": "Seat not found"}), 400
        booking.seat_id = seat.id

    if new_start_time:
        booking.start_time = datetime.fromisoformat(new_start_time)

    if new_end_time:
        booking.end_time = datetime.fromisoformat(new_end_time)

    db.session.commit()
    return jsonify({"message": "Booking updated successfully"})

@app.route("/api/bookings/<int:booking_id>", methods=["DELETE"])
def cancel_booking(booking_id):
    booking = Booking.query.get(booking_id)
    if not booking:
        return jsonify({"message": "Booking not found"}), 404

    db.session.delete(booking)
    db.session.commit()
    return jsonify({"message": "Booking cancelled successfully"})

@app.route("/api/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    # Also delete associated bookings
    Booking.query.filter_by(user_id=user_id).delete()

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"}), 200
@app.route('/api/test-cors', methods=['GET'])
def test_cors():
    return jsonify({"message": "CORS is working!"})
@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    if origin and origin in [
        "http://localhost:3000",
        "http://localhost:5000",
        "https://opulent-fortnight-pj9vxqgwpp55crv9v-3000.app.github.dev",
        "https://opulent-fortnight-pj9vxqgwpp55crv9v-5000.app.github.dev"
    ]:
        response.headers['Access-Control-Allow-Origin'] = origin
        response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
    return response

# -------------------------
# Run Server
# -------------------------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)


