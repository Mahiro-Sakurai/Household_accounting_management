from app import create_app
from app.init_db import initialize_categories

app = create_app()
print(app.url_map)

with app.app_context():
    initialize_categories()

if __name__ == "__main__":
    app.run(debug=True)
