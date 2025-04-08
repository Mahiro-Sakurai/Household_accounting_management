# app/init_db.py に書く

from app import create_app
from app.db import db
from app.models.budget import Category


def initialize_categories():
    app = create_app()

    with app.app_context():
        categories = {
            "expense": [
                "食費",
                "交通費",
                "娯楽",
                "日用品",
                "医療",
                "通信費",
                "交際費",
                "教育",
                "光熱費",
                "家賃",
                "貯金",
                "その他",
            ],
            "income": ["給料", "ボーナス", "副業", "投資収入", "その他収入"],
        }

        for expense_type, names in categories.items():
            for name in names:
                exists = Category.query.filter_by(
                    name=name, expence_type=expense_type
                ).first()
                if not exists:
                    db.session.add(Category(name=name, expence_type=expense_type))
        db.session.commit()
        print("カテゴリ初期化完了！")
