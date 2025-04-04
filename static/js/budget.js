document.addEventListener("DOMContentLoaded", function () {
    // 支出・収入ボタンの選択処理
    document.getElementById("expenseBtn").addEventListener("click", function () {
        toggleIncomeExpense("expense");
    });

    document.getElementById("incomeBtn").addEventListener("click", function () {
        toggleIncomeExpense("income");
    });

    function toggleIncomeExpense(type) {
        let expenseBtn = document.getElementById("expenseBtn");
        let incomeBtn = document.getElementById("incomeBtn");
        let amountInput = document.getElementById("amount");

        // すべてのボタンの `active` を解除
        expenseBtn.classList.remove("active");
        incomeBtn.classList.remove("active");

        if (type === "expense") {
            expenseBtn.classList.add("active"); // 支出ボタンを選択状態にする
            amountInput.placeholder = "支出を入力"; // プレースホルダー変更
        } else {
            incomeBtn.classList.add("active"); // 収入ボタンを選択状態にする
            amountInput.placeholder = "収入を入力"; // プレースホルダー変更
        }
    }

    // --- 日付取得・操作 ---
    const dateInput = document.getElementById("date");
    const today = new Date();
    dateInput.value = today.toISOString().split('T')[0]; // 今日の日付を設定

    // 前の日ボタン
    document.getElementById("prevDayBtn").addEventListener("click", function () {
        let currentDate = new Date(dateInput.value);
        currentDate.setDate(currentDate.getDate() - 1);
        dateInput.value = currentDate.toISOString().split('T')[0];
    });

    // 次の日ボタン
    document.getElementById("nextDayBtn").addEventListener("click", function () {
        let currentDate = new Date(dateInput.value);
        currentDate.setDate(currentDate.getDate() + 1);
        dateInput.value = currentDate.toISOString().split('T')[0];
    });

    // カテゴリー選択はcategory.jsに

    // 送信ボタンの処理
    document.getElementById("submitBtn").addEventListener("click", function () {
        const date = document.getElementById("date").value;
        const amount = document.getElementById("amount").value;
        const memo = document.getElementById("memo").value;
        const expenseType = document.querySelector(".income-expense-toggle button.active")?.id;

        if (!selectedCategory || !amount || !expenseType) {
            alert("必要な情報が入力されていません");
            return;
        }

        // POSTデータを作成
        const data = {
            date: date,
            amount: amount,
            memo: memo,
            category: selectedCategory,
            expenseType: expenseType, // "expense" or "income"
        };

        // Fetch APIを使ってPythonサーバーにデータをPOST
        fetch("/save-budget", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
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
});
