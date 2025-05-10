from flask import Blueprint, request, jsonify
from app.models.budget import Category
from app.db import db

category_bp = Blueprint("category", __name__)


@category_bp.route("/api/categories", methods=["GET"])
def read_categories():
    categories = Category.query.all()
    result = [
        {"id": c.id, "name": c.name, "expense_type": c.expense_type} for c in categories
    ]
    return jsonify(result)


@category_bp.route("/api/categories", methods=["POST"])
def create_category():
    data = request.get_json()
    name = data.get("name")
    expense_type = data.get("expense_type")

    if not name or expense_type not in ["expense", "income"]:
        return jsonify({"error": "Invalid data"}), 400

    new_category = Category(name=name, expense_type=expense_type)
    db.session.add(new_category)
    db.session.commit()

    return (
        jsonify(
            {
                "message": "Category added",
                "id": new_category.id,
            }
        ),
        201,
    )


@category_bp.route("/api/categories/<int:category_id>", methods=["PUT"])
def update_category(category_id):
    data = request.get_json()
    new_name = data.get("name")

    if not new_name:
        return jsonify({"error": "No name provided"}), 400

    category = Category.query.get(category_id)
    if not category:
        return jsonify({"error": "Category not found"}), 404

    category.name = new_name
    db.session.commit()

    return jsonify({"message": "Category updated"})


@category_bp.route("/api/categories/<int:category_id>", methods=["DELETE"])
def delete_category(category_id):
    category = Category.query.get_or_404(category_id)
    if not category:
        return jsonify({"error": "Category not found"}), 404
    if category.budgets:  # 紐づく予算があるなら削除禁止
        return jsonify({"error": "このカテゴリは使用中のため削除できません"}), 400
    db.session.delete(category)
    db.session.commit()
    return jsonify({"message": "カテゴリ削除完了"}), 200
