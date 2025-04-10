from flask import Blueprint, request, jsonify
from app.models.budget import Category
from app.db import db

category_bp = Blueprint("category", __name__)


@category_bp.route("/api/categories", methods=["GET"])
def get_categories():
    categories = Category.query.all()
    result = [
        {"id": c.id, "name": c.name, "expence_type": c.expence_type} for c in categories
    ]
    return jsonify(result)


@category_bp.route("/api/categories", methods=["POST"])
def add_category():
    data = request.get_json()
    name = data.get("name")
    expence_type = data.get("expence_type")

    if not name or expence_type not in ["expense", "income"]:
        return jsonify({"error": "Invalid data"}), 400

    new_category = Category(name=name, expence_type=expence_type)
    db.session.add(new_category)
    db.session.commit()

    return jsonify({"message": "Category added", "id": new_category.id}), 201


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
    category = Category.query.get(category_id)
    if not category:
        return jsonify({"error": "Category not found"}), 404

    db.session.delete(category)
    db.session.commit()

    return jsonify({"message": "Category deleted"})
