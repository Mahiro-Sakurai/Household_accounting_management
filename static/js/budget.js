document.addEventListener("DOMContentLoaded", function () {
    // --- 日付取得・操作 ---
    const dateInput = document.getElementById("date");
    const today = new Date();
    dateInput.value = today.toISOString().split('T')[0]; //今日の日付取得構文
    document.getElementById("prevDayBtn").addEventListener("click", function () {
        let currentDate = new Date(dateInput.value);
        currentDate.setDate(currentDate.getDate() - 1);
        dateInput.value = currentDate.toISOString().split('T')[0];
    });
    document.getElementById("nextDayBtn").addEventListener("click", function () {
        let currentDate = new Date(dateInput.value);
        currentDate.setDate(currentDate.getDate() + 1);
        dateInput.value = currentDate.toISOString().split('T')[0];
    });

    // カテゴリー選択はcategory.jsに


    let selectedCategory = null;  // selectedCategory をここで初期化

    // カテゴリー選択ボタンのイベントリスナー
    document.querySelectorAll(".category-button").forEach(button => {
        button.addEventListener("click", function () {
            selectedCategory = button.textContent;  // クリックされたカテゴリーをselectedCategoryに設定
            console.log("選択されたカテゴリー:", selectedCategory);
        });
    });

    // 送信ボタンの処理
    document.getElementById("submitBtn").addEventListener("click", function () {
        const date = document.getElementById("date").value;
        const amount = document.getElementById("amount").value;
        const memo = document.getElementById("memo").value;
        const expenseType = document.querySelector(".income-expense-toggle .active")?.dataset.type;



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
