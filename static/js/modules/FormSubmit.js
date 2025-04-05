export default class FormSubmit {
    constructor(submitBtnId, formInput, categoryManager) {
        this.submitBtn = document.getElementById(submitBtnId);
        this.formInput = formInput;
        this.categoryManager = categoryManager;
    }

    init() {
        this.submitBtn.addEventListener("click", () => {
            const { date, memo, amount } = this.formInput.getInputData();
            const category = this.categoryManager.getSelectedCategory();
            const expenseType = document.querySelector(".income-expense-toggle .active")?.dataset.type || "expense"

            if (!category || !amount || !expenseType) {
                alert("必必な情報が入力されていません");
                return;
            }

            const data = { date, amount, memo, category, expenseType };

            fetch("/save-budget", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
                .then(response => response.json())
                .then(data => {
                    console.log("Success:", data);
                    alert("データが保存されました！");
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert("データ保存に失敗しました。");
                });
        });
    }
}
