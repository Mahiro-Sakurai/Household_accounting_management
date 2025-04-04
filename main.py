from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/save-budget", methods=["POST"])
def save_budget():
    try:
        # リクエストからJSONデータを取得
        data = request.get_json()

        # データの処理 (ここではコンソールに表示)
        date = data.get("date")
        amount = data.get("amount")
        memo = data.get("memo")
        category = data.get("category")
        expense_type = data.get("expenseType")

        print(
            f"Date: {date}, Amount: {amount}, Memo: {memo}, Category: {category}, Expense Type: {expense_type}"
        )

        # ここでデータベースに保存したり、処理を行う

        # 成功レスポンスを返す
        return jsonify({"status": "success", "message": "データが保存されました"}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"status": "error", "message": "データ保存に失敗しました"}), 400


if __name__ == "__main__":
    app.run(debug=True)
