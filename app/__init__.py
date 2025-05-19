# app/__init__.py

from flask import Flask
from flask_cors import CORS
from app.extensions import db
from flask_migrate import Migrate
from app.models.budget import Budget, Category
from app.routes.budget_routes import budget_bp
from app.routes.main_routes import main_bp
from app.routes.category_routes import category_bp


def create_app():
    # Flaskアプリケーションのインスタンスappを作成
    app = Flask(__name__)

    app.secret_key = "flask_secret_key"
    app.config["SQLALCHEMY_DATABASE_URI"] = (
        "sqlite:///Household_accounting_management.db"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    CORS(app)

    db.init_app(app)
    migrate = Migrate(app, db)

    # blueprintによるルーティング
    app.register_blueprint(budget_bp)
    app.register_blueprint(main_bp)
    app.register_blueprint(category_bp)

    return app
