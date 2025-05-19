# app/__init__.py

from flask import Flask
from flask_cors import CORS
from app.extensions import db
from flask_migrate import Migrate
from app.models.budget import Budget, Category
from app.routes.budget_routes import budget_bp
from app.routes.main_routes import main_bp
from app.routes.category_routes import category_bp
import os


def create_app():
    # Flaskアプリケーションのインスタンスappを作成
    app = Flask(__name__)

    # DBの設定を環境変数から取得
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.secret_key = os.environ.get("SECRET_KEY", "dev-secret")

    CORS(app)

    db.init_app(app)
    migrate = Migrate(app, db)

    # blueprintによるルーティング
    app.register_blueprint(budget_bp)
    app.register_blueprint(main_bp)
    app.register_blueprint(category_bp)

    return app
