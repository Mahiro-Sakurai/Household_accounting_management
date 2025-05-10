# app/models/budget.py

from flask_login import UserMixin
from app.db import db

"""
UserMixin: UserクラスにUserMixinメソッドを登録
    user.is_authenticated → ログイン中常にTrue
    user.get_id() → return user.id
"""


class User(db.Model, UserMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    google_id = db.Column(db.String(200), unique=True, nullable=False)

    def __repr__(self):
        return f"<User {self.username}>"


class Budget(db.Model):
    __tablename__ = "budgets"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    expense_type = db.Column(db.String(10))
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"), nullable=False)
    amount = db.Column(db.Integer)
    date = db.Column(db.Date)
    memo = db.Column(db.String(200))

    def __repr__(self):
        return f"<Budget {self.expense_type} - {self.amount}>"


class Category(db.Model):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    expense_type = db.Column(db.String(10), nullable=False)

    def __repr__(self):
        return f"<Category {self.name}>"
