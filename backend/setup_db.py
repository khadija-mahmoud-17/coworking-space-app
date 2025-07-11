from app import app, db, Seat  # Make sure 'Seat' is imported from the same place it's declared

with app.app_context():
    for i in range(1, 21):
        seat = Seat(label=f"A{i}", area="Main room")
        db.session.add(seat)
    
    db.session.commit()
    print("✅ 20 seats added to the Main room.")
