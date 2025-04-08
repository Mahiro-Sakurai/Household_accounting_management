from app.db import db


class Budget(db.Model):
    __tablename__ = "budgets"

    id = db.Column(db.Integer, primary_key=True)
    expence_type = db.Column(db.String(10))  # expence_type を追加
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"), nullable=False)
    amount = db.Column(db.Integer)
    date = db.Column(db.String(20))
    memo = db.Column(db.String(200))

    # Categoryとのリレーション（関連付け）
    category = db.relationship("Category", backref="budgets")

    def __repr__(self):
        return f"<Budget {self.expence_type} - {self.amount}>"


class Category(db.Model):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

    def __repr__(self):
        return f"<Category {self.name}>"
