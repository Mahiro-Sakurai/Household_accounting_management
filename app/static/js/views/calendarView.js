import openForm from "../openForm.js";

export default class CalendarView {
    constructor(calendarManager, options) {
        this.manager = calendarManager;
        this.prevMonthBtn = options.prevMonthBtn;
        this.nextMonthBtn = options.nextMonthBtn;
        this.calendarGrid = options.calendarGrid;
        this.monthlySummary = options.monthlySummary;
        this.detailContainer = options.detailContainer;
        this.modalContainer = document.getElementById("modal-container");
        this.content = document.getElementById("content");

        this.prevMonthBtn.addEventListener("click", async () => {
            await this.manager.prevMonth();
            this.render();
        });
        this.nextMonthBtn.addEventListener("click", async () => {
            await this.manager.nextMonth();
            this.render();
        });
    }

    async init() {
        await this.manager.init();
        this.render();
    }

    render() {
        this.renderCalendarGrid();
        this.renderMonthlySummary();
        this.renderDailyDetails();
    }

    renderCalendarGrid() {
        const date = this.manager.getDate();
        const dailyTotals = this.manager.getDailyTotals();
        const year = date.getFullYear();
        const month = date.getMonth();

        this.calendarGrid.innerHTML = "";
        const table = document.createElement('table');

        // 曜日ヘッダー
        const days = ['日', '月', '火', '水', '木', '金', '土'];
        const thead = document.createElement('thead');
        const headRow = document.createElement('tr');
        days.forEach((day, idx) => {
            const th = document.createElement('th');
            th.textContent = day;
            th.style.color = idx === 0 ? "red" : idx === 6 ? "blue" : "black";
            headRow.appendChild(th);
        });
        thead.appendChild(headRow);
        table.appendChild(thead);

        // 日付部分
        const tbody = document.createElement('tbody');
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        let row = document.createElement('tr');
        let currentDay = 1;

        // 最初の週：空白セル
        for (let i = 0; i < firstDay.getDay(); i++) {
            row.appendChild(document.createElement('td'));
        }

        // 日付セル
        for (let i = firstDay.getDay(); currentDay <= lastDay.getDate(); i++) {
            const cell = document.createElement('td');
            const cellDate = new Date(year, month, currentDay);
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`;

            // セル内ラッパー
            const wrapper = document.createElement('div');
            wrapper.className = "calendar-cell-wrapper";

            const dateDiv = document.createElement('div');
            dateDiv.className = "calendar-date";
            dateDiv.textContent = currentDay;
            dateDiv.style.color = (i % 7 === 0) ? "red" : (i % 7 === 6) ? "blue" : "black";

            const incomeDiv = document.createElement('div');
            incomeDiv.className = "calendar-income";

            const expenseDiv = document.createElement('div');
            expenseDiv.className = "calendar-expense";

            if (dailyTotals[dateKey]) {
                incomeDiv.textContent = dailyTotals[dateKey].income;
                expenseDiv.textContent = dailyTotals[dateKey].expense;
            }

            wrapper.append(dateDiv, incomeDiv, expenseDiv);
            cell.appendChild(wrapper);
            row.appendChild(cell);

            // 日付クリックで明細スクロール
            wrapper.addEventListener("click", () => this.scrollToDetail(dateKey));

            // ダブルクリックで新規作成フォーム
            cell.addEventListener("dblclick", () => this.openFormModal({
                type: "create",
                initialData: {
                    type: "expense",
                    date: cellDate,
                    memo: "",
                    amount: 0,
                    selectedCategory: null
                }
            }));

            if (i % 7 === 6) {
                tbody.appendChild(row);
                row = document.createElement('tr');
            }
            currentDay++;
        }

        // 最後の週の空白
        if (row.children.length) {
            while (row.children.length < 7) {
                row.appendChild(document.createElement('td'));
            }
            tbody.appendChild(row);
        }

        table.appendChild(tbody);
        this.calendarGrid.appendChild(table);
    }

    renderMonthlySummary() {
        const { income, expense, net } = this.manager.getMonthlyTotals();
        this.monthlySummary.innerHTML = `
            <div><strong>収入：</strong><span style="color: blue;">¥${income.toLocaleString()}</span></div>
            <div><strong>支出：</strong><span style="color: red;">¥${expense.toLocaleString()}</span></div>
            <div><strong>合計：</strong><span style="color: ${net >= 0 ? 'blue' : 'red'};">¥${net.toLocaleString()}</span></div>
        `;
    }

    renderDailyDetails() {
        const data = this.manager.getData();
        const dailyTotals = this.manager.getDailyTotals();
        this.detailContainer.innerHTML = "";

        for (const [dateKey, entries] of Object.entries(data)) {
            const table = document.createElement('table');
            table.className = "daily-detail-table";
            table.id = `detail-${dateKey}`;

            // 日付ヘッダー
            const thead = document.createElement('thead');
            const trHead = document.createElement('tr');
            const thDate = document.createElement('th');
            thDate.colSpan = 3;
            thDate.textContent = this.manager.formatJapaneseDate(dateKey);

            const net = dailyTotals[dateKey]?.net ?? 0;
            const netSpan = document.createElement('span');
            netSpan.textContent = `（${net >= 0 ? '+' : ''}${net}円）`;
            netSpan.style.marginLeft = "1em";
            netSpan.style.color = net >= 0 ? "blue" : "red";

            thDate.appendChild(netSpan);
            trHead.appendChild(thDate);
            thead.appendChild(trHead);
            table.appendChild(thead);

            // 明細行
            const tbody = document.createElement('tbody');
            for (const entry of entries) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${entry.category_name}</td>
                    <td style="color: ${entry.expense_type === "income" ? "blue" : "red"};">${entry.amount}円</td>
                    <td>${entry.memo || ""}</td>
                `;
                tr.addEventListener("click", () => this.openFormModal({
                    type: "update",
                    initialData: {
                        id: entry.id,
                        type: entry.expense_type,
                        date: new Date(dateKey),
                        memo: entry.memo,
                        amount: entry.amount,
                        selectedCategory: { id: entry.category_id, name: entry.category_name }
                    }
                }));
                tbody.appendChild(tr);
            }
            table.appendChild(tbody);
            this.detailContainer.appendChild(table);
        }
    }

    async openFormModal({ type, initialData }) {
        this.content.innerHTML = "";
        await openForm("content", type, initialData);

        const closeBtn = document.createElement('button');
        closeBtn.textContent = "× 閉じる";
        Object.assign(closeBtn.style, {
            position: "absolute", top: "15px", right: "20px",
            background: "transparent", border: "none",
            fontSize: "36px", fontWeight: "bold", color: "#666",
            cursor: "pointer", zIndex: "10"
        });
        closeBtn.addEventListener("click", () => {
            this.modalContainer.style.display = "none";
        });

        this.content.appendChild(closeBtn);
        this.modalContainer.style.display = "flex";

        const submitBtn = document.getElementById("submitBtn");
        if (submitBtn) {
            submitBtn.addEventListener("click", async () => {
                await this.manager.readMonthlyBudgets();
                await this.render();
                this.modalContainer.style.display = "none";
            });
        }
    }

    scrollToDetail(dateKey) {
        const target = document.getElementById(`detail-${dateKey}`);
        if (target) {
            target.classList.add("highlight");
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            setTimeout(() => target.classList.remove("highlight"), 850);
        }
    }
}
