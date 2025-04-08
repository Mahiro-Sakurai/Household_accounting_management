from flask import Blueprint, jsonify
from app.models.budget import Category

category_bp = Blueprint("category", __name__)


@category_bp.route("/api/categories", methods=["GET"])
def get_categories():
    categories = Category.query.all()
    result = [
        {"id": c.id, "name": c.name, "expence_type": c.expence_type} for c in categories
    ]
    return jsonify(result)
