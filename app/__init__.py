from flask import Flask
from flask_migrate import Migrate
from app.db import db
from app.routes.budget_routes import budget_bp
from app.routes.main_routes import main_bp


def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = (
        "sqlite:///Household_accounting_management.db"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    migrate = Migrate(app, db)

    app.register_blueprint(budget_bp)
    app.register_blueprint(main_bp)

    return app
