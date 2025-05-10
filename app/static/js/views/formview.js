export default class FormView {
    constructor(manager, divId) {
        this.formManager = manager;
        this.div = document.getElementById(divId);
        this.editMode = false;
        this.categories = [];
    }

    async init() {
        this.categories = await this.formManager.getCategory();
        console.log(this.categories)
        this.render();
        this.initInput();
    }

    render() {
        this.div.innerHTML = "";
        this.renderBudgetFormSection();
        this.renderCategoryEditSection();
    }

    initInput() {
        this.updateDateInput();
        this.initMemoInput();
        this.initAmountInput();
        this.initType();
    }

    renderBudgetFormSection() {
        const section = document.createElement("div");
        section.id = "budgetFormSection";
        section.className = "budget-form-section";
        this.budgetFormSection = section;

        const title = document.createElement("h2");
        title.textContent = "家計簿入力";
        section.appendChild(title)

        const toggleWrapper = document.createElement("div");
        toggleWrapper.className = "income-expense-toggle";

        ["expense", "income"].forEach(type => {
            const btn = document.createElement("button");
            btn.className = "toggleBtn";
            btn.dataset.type = type;
            btn.textContent = type === "expense" ? "支出" : "収入";

            // 初期状態でactiveをつける
            if (this.formManager.getType() === type) {
                btn.classList.add("active");
            }

            btn.addEventListener("click", () => {
                this.formManager.setType(type);
                this.categories = this.formManager.getCategory();
                this.renderCategoryGrid();
                this.renderEditCategoryGrid();

                // クリック時にactive切り替え
                const allToggleBtns = toggleWrapper.querySelectorAll(".toggleBtn");
                allToggleBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
            });

            toggleWrapper.appendChild(btn);
        });
        section.appendChild(toggleWrapper);


        const dateDiv = document.createElement("div");
        dateDiv.className = "date-section";

        const dateLabel = document.createElement("label");
        dateLabel.setAttribute("for", "date");
        dateLabel.textContent = "日付";

        this.dateInput = document.createElement("input");
        this.dateInput.type = "date";
        this.dateInput.id = "date";
        this.dateInput.addEventListener("change", () => {
            this.formManager.setDate(this.dateInput.value);
        });

        const prevBtn = document.createElement("button");
        prevBtn.textContent = "前の日";
        prevBtn.addEventListener("click", () => {
            this.formManager.prevDate();
            this.updateDateInput();
        });

        const nextBtn = document.createElement("button");
        nextBtn.textContent = "次の日";
        nextBtn.addEventListener("click", () => {
            this.formManager.nextDate();
            this.updateDateInput();
        });

        dateDiv.append(dateLabel, this.dateInput, prevBtn, nextBtn);
        section.appendChild(dateDiv);

        const memoDiv = document.createElement("div");
        memoDiv.className = "memo-section";
        const memoLabel = document.createElement("label");
        memoLabel.setAttribute("for", "memo");
        memoLabel.textContent = "メモ";
        this.memoTextarea = document.createElement("textarea");
        this.memoTextarea.id = "memo";
        this.memoTextarea.rows = 1;
        this.memoTextarea.maxLength = 20;
        this.memoTextarea.placeholder = "20文字以内";
        this.memoTextarea.addEventListener("blur", () => {
            this.formManager.setMemo(this.memoTextarea.value);
        });
        memoDiv.append(memoLabel, this.memoTextarea);
        section.appendChild(memoDiv);

        const amountDiv = document.createElement("div");
        amountDiv.className = "amount-section";
        const amountLabel = document.createElement("label");
        amountLabel.setAttribute("for", "amount");
        amountLabel.textContent = "金額";
        this.amountInput = document.createElement("input");
        this.amountInput.type = "number";
        this.amountInput.id = "amount";
        this.amountInput.min = "1";
        this.amountInput.placeholder = "金額";
        this.amountInput.addEventListener("blur", () => {
            this.formManager.setAmount(this.amountInput.value);
        });
        amountDiv.append(amountLabel, this.amountInput);
        section.appendChild(amountDiv);

        const categorySection = document.createElement("div");
        categorySection.className = "category-section";
        const categoryTitle = document.createElement("h4");
        categoryTitle.textContent = "カテゴリーを選択";

        const categoryEditBtn = document.createElement("button");
        categoryEditBtn.id = "categoryBtn";
        categoryEditBtn.textContent = "編集";
        categoryEditBtn.addEventListener("click", () => {
            this.budgetFormSection.style.display = "none";
            this.categoryEditSection.style.display = "block";
        });
        categoryTitle.appendChild(categoryEditBtn);

        this.categoryGrid = document.createElement("div");
        this.renderCategoryGrid();

        categorySection.append(categoryTitle, this.categoryGrid);
        section.appendChild(categorySection);

        const submitBtn = document.createElement("button");
        submitBtn.id = "submitBtn";
        submitBtn.textContent = "送信";
        submitBtn.addEventListener("click", async () => {
            if (this.formManager.createBudget) {
                await this.formManager.createBudget()
            } else {
                await this.formManager.updateBudget()
            }
        })
        section.appendChild(submitBtn);

        this.div.appendChild(section);
    }


    renderCategoryEditSection() {
        const section = document.createElement("div");
        section.id = "categoryEditSectoin";
        section.className = "category-edit-sectoin";
        section.style.display = "none";
        this.categoryEditSection = section;

        const title = document.createElement("h2");
        title.textContent = "カテゴリー編集";

        const backBtn = document.createElement("button");
        backBtn.className = "back-budget-Btn";
        backBtn.id = "backBudgetBtn";
        backBtn.textContent = "戻る";
        backBtn.addEventListener("click", () => {
            this.budgetFormSection.style.display = "block";
            this.categoryEditSection.style.display = "none";
        });
        const toggleWrapper = document.createElement("div");
        toggleWrapper.className = "income-expense-toggle";

        ["expense", "income"].forEach(type => {
            const btn = document.createElement("button");
            btn.className = "toggleBtn";
            btn.dataset.type = type;
            btn.textContent = type === "expense" ? "支出" : "収入";
            btn.addEventListener("click", () => {
                this.formManager.setType(type);
                this.categories = this.formManager.getCategory();
                this.renderCategoryGrid();
                this.renderEditCategoryGrid();
            });
            toggleWrapper.appendChild(btn);
        });

        const addCategorySection = document.createElement("div");
        addCategorySection.className = "add-category-section";
        const textarea = document.createElement("textarea");
        textarea.id = "addCategoryInput";
        textarea.rows = 1;
        textarea.placeholder = "新規カテゴリーを入力";

        const addBtn = document.createElement("button");
        addBtn.id = "addCategoryBtn";
        addBtn.textContent = "追加";
        addBtn.addEventListener("click", async () => {
            const newName = textarea.value.trim();
            if (!newName || this.categories.some(c => c.name === newName)) {
                alert("同じ名前のカテゴリーがすでに存在します");
                return;
            }
            textarea.value = ""
            await this.formManager.createCategory(newName);
            this.categories = this.formManager.getCategory();
            this.renderEditCategoryGrid();
            this.renderCategoryGrid();
        });

        addCategorySection.append(textarea, addBtn);

        const editBtnWrapper = document.createElement("div");
        editBtnWrapper.className = "edit-category-button";
        this.editBtn = document.createElement("button");
        this.editBtn.id = "editCategoryBtn";
        this.renderEditBtn();

        editBtnWrapper.append(this.editBtn);

        this.editCategoryGrid = document.createElement("div");
        this.renderEditCategoryGrid();

        section.append(title, backBtn, toggleWrapper, addCategorySection, editBtnWrapper, this.editCategoryGrid);
        this.div.append(section);
    }

    renderCategoryGrid() {
        this.categoryGrid.innerHTML = "";
        this.categoryGrid.id = "categoryGrid";
        this.categoryGrid.className = "category-grid";

        this.categories.forEach(category => {
            const btn = document.createElement("button");
            btn.textContent = category.name;
            btn.className = "category-button";
            if (this.formManager.getSelectedCategory()?.id === category.id) {
                btn.classList.add("active");
            }
            btn.addEventListener("click", () => {
                this.formManager.setSelectedCategory(category);
                this.renderCategoryGrid();
            });
            this.categoryGrid.appendChild(btn);
        });
    }

    renderEditCategoryGrid() {
        this.editCategoryGrid.innerHTML = "";
        this.editCategoryGrid.id = "editCategoryGrid";
        this.editCategoryGrid.className = "edit-category-grid";

        this.categories.forEach(category => {
            const item = document.createElement("div");
            item.classList.add("edit-category-item");

            if (this.editMode) {
                const input = document.createElement("input");
                input.type = "text";
                input.value = category.name;
                input.addEventListener("blur", async () => {
                    const newName = input.value.trim();
                    if (!newName || newName === category.name) return;
                    await this.formManager.updateCategoryName(category.id, newName);
                    category.name = newName;
                    this.renderEditCategoryGrid();
                    this.renderCategoryGrid();
                });

                const delBtn = document.createElement("button");
                delBtn.textContent = "削除";
                delBtn.addEventListener("click", async () => {
                    try {
                        await this.formManager.deleteCategoryById(category.id);
                        this.categories = this.categories.filter(c => c.id !== category.id);
                        this.renderEditCategoryGrid();
                        this.renderCategoryGrid();
                    } catch (err) {
                        alert(err.message || "カテゴリ削除に失敗しました");
                    }
                });

                item.appendChild(delBtn);
                item.appendChild(input);
            } else {
                const label = document.createElement("span");
                label.textContent = category.name;
                item.appendChild(label);
            }

            this.editCategoryGrid.appendChild(item);
        });
    }

    renderEditBtn() {
        this.editBtn.textContent = this.editMode ? "完了" : "編集";
        this.editBtn.onclick = () => {
            this.editMode = !this.editMode;
            this.renderEditBtn();
            this.renderEditCategoryGrid();
        };
    }

    updateDateInput() {
        const date = this.formManager.getDate();
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        this.dateInput.value = `${yyyy}-${mm}-${dd}`;
    }

    initMemoInput() {
        this.memoTextarea.value = this.formManager.getMemo();
    }

    initAmountInput() {
        this.amountInput.value = this.formManager.getAmount();
    }

    initType() {
        this.type = this.formManager.getType();
    }
}
