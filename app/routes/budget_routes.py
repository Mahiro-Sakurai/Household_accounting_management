from flask import Blueprint, request, jsonify

from app.models.budget import Budget
from app.db import db
from app.models.budget import Category  # Category インポート

budget_bp = Blueprint("budget", __name__)


@budget_bp.route("/submit", methods=["POST"])
def save_budget():
    data = request.get_json()

    # Category をデータベースから取得
    category = Category.query.filter_by(id=data["category_id"]).first()

    # Category が見つからなければエラーを返す
    if not category:
        return jsonify({"status": "error", "message": "カテゴリが存在しません"}), 400

    # Budget インスタンスを作成
    budget = Budget(
        expence_type=data["expenseType"],
        category=category,  # Category インスタンスを関連付け
        amount=data["amount"],
        date=data["date"],
        memo=data.get("memo", ""),
    )

    db.session.add(budget)
    try:
        db.session.commit()
        return jsonify({"message": "データ保存完了！"}), 200
    except Exception as e:
        db.session.rollback()
        print(f"データ保存エラー: {e}")
        return jsonify({"status": "error", "message": "データ保存に失敗しました"}), 400


@budget_bp.route("/api/budgets", methods=["GET"])
def get_budgets():
    budgets = Budget.query.all()
    return jsonify(
        [
            {
                "id": b.id,
                "expenseType": b.expence_type,
                "category": b.category,
                "amount": b.amount,
                "date": b.date,
                "memo": b.memo,
            }
            for b in budgets
        ]
    )
