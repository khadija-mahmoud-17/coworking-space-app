from app import app, db
from app import Seat  # or from models import Seat if it's defined there

with app.app_context():
    # Drop and recreate only the seats table
    try:
        Seat.__table__.drop(db.engine)
        print("✅ Dropped old 'seats' table")
    except Exception as e:
        print("⚠️ Couldn't drop table (may not exist):", e)

    db.create_all()
    print("✅ Recreated all tables")

    # Add S1 to S6 for 'Main room'
    new_seats = [
        Seat(label='S1', area='Main room'),
        Seat(label='S2', area='Main room'),
        Seat(label='S3', area='Main room'),
        Seat(label='S4', area='Main room'),
        Seat(label='S5', area='Main room'),
        Seat(label='S6', area='Main room'),
    ]

    db.session.add_all(new_seats)
    db.session.commit()
    print("✅ Inserted new seats S1–S6")
