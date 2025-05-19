from flask import Blueprint, request, jsonify
from sqlalchemy import extract, func, case
from collections import OrderedDict

from app.extensions import db
from app.models.budget import Budget
from app.models.budget import Category  # Category インポート

from datetime import datetime

budget_bp = Blueprint("budget", __name__)


@budget_bp.route("/api/budgets", methods=["GET"])
def read_budgets():
    # Api.jsからyear, monthの指定
    try:
        year = int(request.args.get("year"))
        month = int(request.args.get("month"))
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid or missing 'year' or 'month' parameter"}), 400

    # 指定年月のデータを取得
    budgets = (
        db.session.query(Budget)
        .join(Category)
        .filter(
            extract("year", Budget.date) == year, extract("month", Budget.date) == month
        )
        .all()
    )

    data = {}
    daily_totals = {}
    monthly_income = 0
    monthly_expense = 0

    for budget in budgets:
        date_str = budget.date.strftime("%Y-%m-%d")

        entry = {
            "id": budget.id,
            "expense_type": budget.expense_type,
            "category_id": budget.category_id,
            "category_name": budget.category.name,
            "amount": budget.amount,
            "memo": budget.memo,
        }
        data.setdefault(date_str, []).append(entry)

        # 日ごとの集計
        if date_str not in daily_totals:
            daily_totals[date_str] = {"income": 0, "expense": 0}

        if budget.expense_type == "income":
            daily_totals[date_str]["income"] += budget.amount
            monthly_income += budget.amount
        else:
            daily_totals[date_str]["expense"] += budget.amount
            monthly_expense += budget.amount

            # 各日の収支差を追加
    for date_str in daily_totals:
        day = daily_totals[date_str]
        day["net"] = day["income"] - day["expense"]

    monthly_net = monthly_income - monthly_expense

    # data, dailytotalsを日付順にソート
    data = OrderedDict(sorted(data.items()))
    daily_totals = OrderedDict(sorted(daily_totals.items()))

    return jsonify(
        {
            "data": data,  # {date_str,["id", "expense_type", "category_id", "category_name", "amount", "memo"]}
            "daily_totals": daily_totals,  # {[date_str]["income", "expense", "net"]}
            "monthly_totals": {
                "income": monthly_income,
                "expense": monthly_expense,
                "net": monthly_net,
            },
        }
    )


@budget_bp.route("/api/budgets", methods=["POST"])
def create_budget():
    data = request.get_json()

    date = datetime.strptime(data["date_str"], "%Y-%m-%d").date()

    # Category をデータベースから取得
    category = Category.query.filter_by(id=data["category_id"]).first()

    # Category が見つからなければエラーを返す
    if not category:
        return jsonify({"status": "error", "message": "カテゴリが存在しません"}), 400
    # Budget インスタンスを作成
    budget = Budget(
        expense_type=data["expense_type"],
        category=category,  # Category インスタンスを関連付け
        amount=data["amount"],
        date=date,
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


@budget_bp.route("/api/budgets/<int:budget_id>", methods=["PUT"])
def update_budget(budget_id):
    data = request.get_json()

    budget = Budget.query.get(budget_id)

    print(data)
    print(data["date_str"])
    new_type = data.get("type")
    new_date = datetime.strptime(data.get("date_str"), "%Y-%m-%d").date()
    new_memo = data.get("memo")
    new_amount = data.get("amount")
    new_category_id = data.get("category_id")

    if not budget:
        return jsonify({"error": "Budget Not Found"})

    budget.expense_type = new_type
    budget.category_id = new_category_id
    budget.amount = new_amount
    budget.date = new_date
    budget.memo = new_memo

    db.session.commit()

    return jsonify({"message": "Budget update"})
