export default class CalendarView {
    constructor(calendarManager, options) {
        this.calendarManager = calendarManager;

        this.prevMonthBtn = options.prevMonthBtn;
        this.nextMonthBtn = options.nextMonthBtn;
        this.calendarGrid = options.calendarGrid;
        this.monthlySummary = options.monthlySummary;
        this.detailContainer = options.detailContainer;


        this.prevMonthBtn.addEventListener("click", async () => {
            await this.calendarManager.prevMonth();
            this.render();
        })
        this.nextMonthBtn.addEventListener("click", async () => {
            await this.calendarManager.nextMonth();
            this.render();
        })

    }


    async init() {
        await this.calendarManager.init();
        this.render();
    }

    render() {
        this.renderCalendarGrid();
        this.renderMonthlySummary();
        this.renderDailyDetails();
    }

    renderCalendarGrid() {
        ////////// manager呼び出し
        const date = this.calendarManager.getDate()
        const dailyTotals = this.calendarManager.getDailyTotals();


        ////////// 初期化
        const grid = document.getElementById("calendarGrid");
        grid.innerHTML = "";

        ////////// table
        const table = document.createElement('table'); /* table: 表全体の枠組み */


        ////// thead(曜日ヘッダー作成)
        const days = ['日', '月', '火', '水', '木', '金', '土'];
        const thead = document.createElement('thead'); // thead: 見出し行のブロック 
        const headRow = document.createElement('tr'); // tr: 行 

        for (let i = 0; i < days.length; i++) {
            const th = document.createElement('th'); // th: 見出しセル
            th.textContent = days[i];

            if (i === 0) th.style.color = 'red';    // 日曜
            if (i === 6) th.style.color = 'blue';   // 土曜
            th.style.color = 'black' // 平日

            headRow.appendChild(th);
        }
        thead.appendChild(headRow);
        table.appendChild(thead);


        ////// tbody(カレンダー日付)
        const tbody = document.createElement("tbody");
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0); // 翌月0日 = 今月末 

        let row = document.createElement("tr");
        let currentDay = 1;

        //// 最初の週の空白セル
        for (let i = 0; i < firstDay.getDay(); i++) {
            const emptyCell = document.createElement("td");
            row.appendChild(emptyCell);
        }

        //// 日付セル作成
        for (let i = firstDay.getDay(); currentDay <= lastDay.getDate(); i++) {

            const cell = document.createElement("td");

            // cellWrapperにdate, income, expenseの親になってもらう
            const cellWrapper = document.createElement("div"); // なぜWrapperが必要なのか→just td not including div
            cellWrapper.className = "calendar-cell-wrapper"

            // date(currentDay)
            const dateDiv = document.createElement("div");
            dateDiv.className = "calendar-date";
            dateDiv.textContent = currentDay;
            if (i % 7 == 0) dateDiv.style.color = "red";
            else if (i % 7 == 6) dateDiv.style.color = "blue";

            // dateKey_income, expense, total
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`;
            const totals = dailyTotals[dateKey];

            const incomeDiv = document.createElement('div');
            const expenseDiv = document.createElement('div');
            expenseDiv.className = "calendar-expense"
            incomeDiv.className = "calendar-income"
            if (totals) {
                incomeDiv.textContent = totals["income"]
                expenseDiv.textContent = totals["expense"]
            }


            // 親
            cellWrapper.appendChild(dateDiv);
            cellWrapper.appendChild(incomeDiv);
            cellWrapper.appendChild(expenseDiv);
            cell.appendChild(cellWrapper);
            row.appendChild(cell);

            if (i % 7 === 6) {
                // 週の終わり 
                tbody.appendChild(row);
                row = document.createElement("tr");
            }
            currentDay++;

        }

        //// 最後の週の空白セル
        for (let i = lastDay.getDay(); i < 6; i++) {
            const emptyCell = document.createElement('td');
            row.appendChild(emptyCell);
        }
        tbody.appendChild(row);

        //// body, table追加
        table.appendChild(tbody);
        this.calendarGrid.appendChild(table);
    }

    renderMonthlySummary() {
        const monthlyTotals = this.calendarManager.getMonthlyTotals();
        const monthlyIncome = monthlyTotals["income"];
        const monthlyExpense = monthlyTotals["expense"];
        const monthlyNet = monthlyTotals["net"];

        this.monthlySummary.innerHTML = `
        <div><strong>収入：</strong><span style="color: blue;">¥${monthlyIncome.toLocaleString()}</span></div>
        <div><strong>支出：</strong><span style="color: red;">¥${monthlyExpense.toLocaleString()}</span></div>
        <div><strong></strong><span style="color: ${monthlyNet >= 0 ? 'blue' : 'red'};">¥${monthlyNet.toLocaleString()}</span></div>
    `;
    }


    renderDailyDetails() {
        //////// データ取得とinit
        const data = this.calendarManager.getData();
        const dailyTotals = this.calendarManager.getDailyTotals();
        const container = this.detailContainer;
        container.innerHTML = "";


        for (const [dateKey, detailList] of Object.entries(data)) {
            const table = document.createElement("table");
            table.classList.add("daily-detail-table");

            // thead（日付＋net収支）
            const thead = document.createElement("thead");
            const trHead = document.createElement("tr");

            const thDate = document.createElement("th");
            thDate.colSpan = 3; // 見やすく横幅取る
            thDate.style.textAlign = "left";
            thDate.textContent = this.calendarManager.formatJapaneseDate(dateKey);

            const net = dailyTotals[dateKey]?.net ?? 0;
            const netSpan = document.createElement("span");
            netSpan.textContent = `（${net >= 0 ? "+" : ""}${net}円）`;
            netSpan.style.marginLeft = "1em";
            netSpan.style.color = net >= 0 ? "blue" : "red";

            thDate.appendChild(netSpan);
            trHead.appendChild(thDate);
            thead.appendChild(trHead);
            table.appendChild(thead);

            // tbody（明細一覧）
            const tbody = document.createElement("tbody");

            for (const entry of detailList) {
                const tr = document.createElement("tr");

                const tdCategory = document.createElement("td");
                tdCategory.textContent = entry.category_name;

                const tdAmount = document.createElement("td");
                tdAmount.textContent = `${entry.amount}円`;
                tdAmount.style.color = entry.expense_type === "income" ? "blue" : "red";

                const tdMemo = document.createElement("td");
                tdMemo.textContent = entry.memo || "";

                tr.appendChild(tdCategory);
                tr.appendChild(tdAmount);
                tr.appendChild(tdMemo);

                tbody.appendChild(tr);
            }

            table.appendChild(tbody);
            container.appendChild(table);
        }
    }
}
/* 

<table>
<thead>
<tr>
<th>見出し1</th>
<th>見出し2</th>
</tr>
</thead>
<tbody>
<tr>
<td>内容1</td>
<td>内容2</td>
</tr>
</tbody>
<tfoot>
<tr>
<td>フッタセル1</td>
<td>フッタセル2</td>
</tr>
</tfoot>
</table>
*/