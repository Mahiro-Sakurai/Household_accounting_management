document.addEventListener("DOMContentLoaded", function () {
    const displayGrid = document.getElementById("categoryGrid");
    const editGrid = document.getElementById("editCategoryGrid");
    const addBtn = document.getElementById("addCategoryBtn");
    const addInput = document.getElementById("addCategoryInput");
    const editToggleBtn = document.getElementById("editCategoryBtn");
    const toggleBtns = document.getElementsByClassName("toggleBtn");
    const amountInput = document.getElementById("amount");

    let currentType = "expense"; // 初期は支出
    let selectedCategory = null;
    let editMode = false;

    // カテゴリー別配列
    let categories = {
        expense: [
            '食費', '交通費', '娯楽', '日用品', '医療', '通信費',
            '交際費', '教育', '光熱費', '家賃', '貯金', 'その他'
        ],
        income: [
            '給料', 'ボーナス', '副業', '投資収入', 'その他収入'
        ]
    };

    // 金額のプレイスホルダー変更
    function renderAmountPlaseholder(type) {
        if (type == "expense") {
            amountInput.placeholder = "支出を入力";
        } else {
            amountInput.placeholder = "収入を入力";
        }
    }

    // 選択ボタンを描画
    function renderCategoryButtons() {
        displayGrid.innerHTML = '';
        categories[currentType].forEach(category => {
            const btn = document.createElement("button");
            btn.textContent = category;
            btn.classList.add("category-button");
            if (category === selectedCategory) btn.classList.add("active");

            btn.addEventListener("click", () => {
                selectedCategory = category;
                renderCategoryButtons(); // active更新
            });

            displayGrid.appendChild(btn);
        });
    }

    // 編集エリアの描画
    function renderEditCategories() {
        if (!editGrid) return;
        editGrid.innerHTML = '';

        categories[currentType].forEach((category, index) => {
            const item = document.createElement("div");
            item.classList.add("edit-category-item");

            if (editMode) {
                const delBtn = document.createElement("button");
                delBtn.textContent = "削除";
                delBtn.addEventListener("click", () => {
                    categories[currentType].splice(index, 1);
                    renderEditCategories();
                    renderCategoryButtons();
                });

                const input = document.createElement("input");
                input.type = "text";
                input.value = category;
                input.addEventListener("input", () => {
                    categories[currentType][index] = input.value;
                    renderCategoryButtons();
                });

                item.appendChild(delBtn);
                item.appendChild(input);

            } else {
                const label = document.createElement("span");
                label.textContent = category;
                item.appendChild(label);
            }

            editGrid.appendChild(item);
        });
    }

    // 追加
    addBtn.addEventListener("click", () => {
        const newCategory = addInput.value.trim();
        if (newCategory) {
            categories[currentType].push(newCategory);
            addInput.value = '';
            renderCategoryButtons();
            renderEditCategories();
        }
    });

    // 編集モード切り替え
    editToggleBtn.addEventListener("click", () => {
        editMode = !editMode;
        editToggleBtn.textContent = editMode ? "完了" : "編集";
        renderEditCategories();
    });

    // 各ボタンに共通のクリックイベントを追加
    for (let i = 0; i < toggleBtns.length; i++) {
        toggleBtns[i].addEventListener("click", (event) => {
            const type = event.target.getAttribute("data-type");
            handleCategoryToggle(type, event.target); // ボタン自体も渡す
        });
    }

    // 収入・支出の切り替え処理
    function handleCategoryToggle(type, clickedBtn) {
        if (type === "expense" || type === "income") {
            // 支出／収入の切り替え処理
            currentType = type;
            renderCategoryButtons();
            renderEditCategories();
            renderAmountPlaseholder(type);

            // active クラスを切り替え
            // すべてのボタンから active を削除
            Array.from(toggleBtns).forEach(btn => btn.classList.remove("active"));

            // クリックされたボタンに active クラスを追加
            clickedBtn.classList.add("active");
        } else if (type === "editExpense" || type === "editIncome") {
            // 編集モード時の切り替え処理
            currentType = type === "editExpense" ? "expense" : "income";
            renderEditCategories();
        }
    }

    // 初期描画
    renderCategoryButtons();
    renderEditCategories();
    renderAmountPlaseholder(currentType);
});
