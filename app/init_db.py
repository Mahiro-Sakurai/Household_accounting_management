from app import create_app
from app.db import db
from app.models.budget import Category, Budget
from app.sample_data.category_samples import categories
from app.sample_data.budget_samples import sample_budgets

from datetime import date


def initialize_categories():
    app = create_app()

    with app.app_context():
        db.create_all()

        # 既存データ削除
        db.session.query(Budget).delete()
        db.session.query(Category).delete()

        for expense_type, names in categories.items():
            for name in names:
                db.session.add(Category(name=name, expense_type=expense_type))

        db.session.commit()  # ここで ID が確定する！

        # カテゴリの name → id をマッピング
        category_map = {
            (category.name, category.expense_type): category.id
            for category in Category.query.all()
        }

        for entry in sample_budgets:
            key = (entry["category_name"], entry["expense_type"])
            category_id = category_map.get(key)

            if category_id:
                budget = Budget(
                    expense_type=entry["expense_type"],
                    category_id=category_id,
                    amount=entry["amount"],
                    date=entry["date"],
                    memo=entry["memo"],
                )
                db.session.add(budget)
            else:
                print(f"⚠️ カテゴリが見つかりません: {key}")

        db.session.commit()
        print("✅ カテゴリ初期化完了！")
        print("✅ サンプル家計簿データ挿入完了！")


# 実行
initialize_categories()
