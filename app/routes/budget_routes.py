from flask import Blueprint, request, jsonify
from sqlalchemy import extract, func, case
from collections import OrderedDict

from app.models.budget import Budget
from app.db import db
from app.models.budget import Category  # Category インポート

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
            "data": data,  # {date_str,["id", "expense_type", "category_id", "category.name", "amount", "memo"]}
            "daily_totals": daily_totals,  # {[date_str]["income", "expense", "net"]}
            "monthly_totals": {
                "income": monthly_income,
                "expense": monthly_expense,
                "net": monthly_net,
            },
        }
    )


"""
# 日ごとの支出・収入
@budget_bp.route("/api/budgets/calendar_summary", methods=["GET"])
def get_calendar_summary():
    # 年・月をGETパラメータから取得
    year = int(request.args.get("year"))
    month = int(request.args.get("month"))

    # 指定月の1日〜月末日までを取得
    start_date = datetime.date(year, month, 1)
    if month == 12:
        end_date = datetime.date(year + 1, 1, 1)
    else:
        end_date = datetime.date(year, month + 1, 1)

    # クエリで日付ごとの合計取得
    results = (
        db.session.query(
            Budget.date,
            func.sum(
                case((Budget.expense_type == "expense", Budget.amount), else_=0)
            ).label("total_expense"),
            func.sum(
                case((Budget.expense_type == "income", Budget.amount), else_=0)
            ).label("total_income"),
        )
        .filter(Budget.date >= start_date, Budget.date < end_date)
        .group_by(Budget.date)
        .all()
    )

    summary = [
        {
            "date": row.date.strftime("%Y-%m-%d"),
            "expense": int(row.total_expense or 0),
            "income": int(row.total_income or 0),
        }
        for row in results
    ]

    return jsonify(summary)


# 明細
@budget_bp.route("/api/budgets/day_details", methods=["GET"])
def get_day_details():
    date_str = request.args.get("date")
    try:
        target_date = datetime.datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"error": "Invalid date format"}), 400

    # CategoryもJOINして取得
    details = (
        db.session.query(Budget)
        .join(Budget.category)
        .filter(Budget.date == target_date)
        .all()
    )

    total_income = 0
    total_expense = 0
    detail_list = []

    for item in details:
        if item.expense_type == "income":
            total_income += item.amount
        elif item.expense_type == "expense":
            total_expense += item.amount

        detail_list.append(
            {
                "id": item.id,
                "expense_type": item.expense_type,
                "category_id": item.category_id,
                "category_name": item.category.name,
                "amount": item.amount,
                "memo": item.memo,
            }
        )

    return jsonify(
        {
            "date": date_str,
            "total_income": total_income,
            "total_expense": total_expense,
            "details": detail_list,
        }
    )
"""


@budget_bp.route("/api/budgets", methods=["POST"])
def create_budget():
    data = request.get_json()

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
