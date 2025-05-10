# app/__init__.py

from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_login import LoginManager
from app.db import db
from app.models.budget import User
from app.routes.auth_routes import auth_bp
from app.routes.budget_routes import budget_bp
from app.routes.main_routes import main_bp
from app.routes.category_routes import category_bp


def create_app():
    # Flaskアプリケーションのインスタンスappを作成
    app = Flask(__name__)

    # 秘密鍵の設定
    app.secret_key = "flask_secret_key"

    app.config["SQLALCHEMY_DATABASE_URI"] = (
        "sqlite:///Household_accounting_management.db"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    CORS(app)

    db.init_app(app)
    migrate = Migrate(app, db)

    # LoginManagerインスタンスを作成し、Flaskアプリに登録
    login_manager = LoginManager()
    login_manager.init_app(app)
    # 未ログイン時のリダイレクト先を設定
    login_manager.login_view = "auth.login"

    # ユーザー読み込み関数
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # blueprintによるルーティング
    app.register_blueprint(budget_bp)
    app.register_blueprint(main_bp)
    app.register_blueprint(category_bp)
    app.register_blueprint(auth_bp)

    return app
