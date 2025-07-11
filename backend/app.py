from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import os
import pandas as pd
from flask_mail import Mail, Message
from datetime import datetime

# -------------------------
# Flask Setup
# -------------------------
app = Flask(__name__, static_folder="../frontend/build", static_url_path="/")
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
bcrypt = Bcrypt(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///coworking.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Email config (Gmail example)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'dija.aa1714@gmail.com'
app.config['MAIL_PASSWORD'] = 'pwjk ndvw iavl xstg'  # use app password for Gmail
app.config['MAIL_DEFAULT_SENDER'] = 'dija.aa1714@gmail.com'

mail = Mail(app)


db = SQLAlchemy(app)

# -------------------------
# Database Model
# -------------------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(20), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    matriculation = db.Column(db.String(100), nullable=True)  # Only for students
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

from datetime import datetime, timedelta

class Seat(db.Model):
    __tablename__ = 'seats'

    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(20), nullable=False)       # e.g. "A1", "B2"
    area = db.Column(db.String(50), nullable=False)         # e.g. "Main room", "Bar"
    is_booked = db.Column(db.Boolean, default=False)        # True if the seat is booked

    def __repr__(self):
        return f"<Seat {self.label} in {self.area}>"


class Booking(db.Model):
    __tablename__ = 'bookings'

    id = db.Column(db.Integer, primary_key=True)
    seat_id = db.Column(db.Integer, db.ForeignKey('seats.id'), nullable=False)
    user_email = db.Column(db.String(100), nullable=False)
    start_time = db.Column(db.DateTime, default=datetime.utcnow)
    end_time = db.Column(db.DateTime, nullable=False)

    seat = db.relationship('Seat', backref='bookings')

    def __repr__(self):
        return f"<Booking for seat {self.seat_id} by {self.user_email}>"


with app.app_context():
    db.create_all()


# -------------------------
# CSV Sensor Data
# -------------------------

# Automatically get the absolute path to the CSV file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "Updated_IR_Sensor_Events.csv")

def calculate_current_occupancy(file_path: str, initial_count: int = 10):
    df = pd.read_csv(file_path)
    df = df.sort_values(by='timestamp')  # Ensure data is sorted by timestamp
    people_inside = initial_count

    for _, row in df.iterrows():
        if row['entrance_sensor'] == 1 and row['exit_sensor'] == 0:
            people_inside += 1
        elif row['entrance_sensor'] == 0 and row['exit_sensor'] == 1:
            people_inside = max(0, people_inside - 1)
    return people_inside

def get_crowd_status(people_inside: int):
    if people_inside < 10:
        return {"status": "Not Crowded", "color": "green"}
    elif 10 <= people_inside <= 20:
        return {"status": "Crowded", "color": "yellow"}
    else:
        return {"status": "Very Crowded", "color": "red"}

@app.route('/api/crowd-status', methods=['GET'])
def crowd_status():
    people_inside = calculate_current_occupancy(CSV_PATH)
    status_info = get_crowd_status(people_inside)

    response = {
        "people_inside": people_inside,
        "status": status_info["status"],
        "color": status_info["color"]
    }

    return jsonify(response)
# -------------------------
# Routes
# -------------------------
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if not data:
        return jsonify({"message": "No input provided"}), 400

    role = data.get('role')
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('first_name', '')
    last_name = data.get('last_name', '')
    matriculation = data.get('matriculation', '')

    # Check required fields based on role
    if role == 'Student':
        if not all([first_name, last_name, matriculation, email, password]):
            return jsonify({"message": "Missing required student fields"}), 400
    elif role in ['Professor', 'Guest']:
        if not all([first_name, last_name, email, password]):
            return jsonify({"message": f"Missing required {role.lower()} fields"}), 400
    else:
        return jsonify({"message": "Invalid role provided"}), 400

    # Hash password
    hashed = bcrypt.generate_password_hash(password).decode('utf-8')

    new_user = User(
        role=role,
        email=email,
        password=hashed,
        first_name=first_name,
        last_name=last_name,
        matriculation=matriculation
    )

    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Registered successfully!"}), 201


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

    if user and bcrypt.check_password_hash(user.password, password):
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

    return jsonify({"message": "Invalid credentials or role"}), 401

@app.route('/contact', methods=['POST'])
def contact():
    data = request.json
    if not data:
        return jsonify({'message': 'No data received'}), 400

    msg = Message(
        subject="Coworking Space Inquiry",
        recipients=['dija.aa1714@gmail.com'],
        body=f"From: {data['first_name']} {data['last_name']} <{data['email']}>\n\nMessage:\n{data['message']}"
    )
    try:
        mail.send(msg)
        return jsonify({'message': 'Message sent successfully!'}), 200
    except Exception as e:
        print(f"Error sending email: {e}")
        return jsonify({'message': 'Failed to send message'}), 500

from flask import request
from sqlalchemy import and_

@app.route('/api/available-seats', methods=['GET'])
def get_available_seats():
    start = request.args.get("start")
    end = request.args.get("end")

    if not start or not end:
        return jsonify({"error": "Missing start or end time"}), 400

    start_dt = datetime.fromisoformat(start)
    end_dt = datetime.fromisoformat(end)

    # Get booked seat IDs with overlapping bookings
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

    try:
        start = datetime.fromisoformat(start_time)
        end = datetime.fromisoformat(end_time)
    except ValueError:
        return jsonify({"message": "Invalid datetime format"}), 400

    overlap = Booking.query.filter(
        Booking.seat_id == seat_id,
        Booking.start_time < end,
        Booking.end_time > start
    ).first()

    if overlap:
        return jsonify({"message": "Seat is already booked for that time"}), 409

    booking = Booking(seat_id=seat_id, user_id=user_id, start_time=start, end_time=end)
    db.session.add(booking)
    db.session.commit()

    return jsonify({"message": "Seat booked successfully"}), 200
# -------------------------
# Run Server
# -------------------------
if __name__ == '__main__':
    app.run(debug=True)
