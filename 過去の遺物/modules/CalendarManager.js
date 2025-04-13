export class CalendarManager {
    constructor(options) {
        this.calendarHeader = options.calendarHeader;
        this.prevMonth = options.prevMonth;
        this.currentMonth = options.currentMonth;
        this.nextMonth = options.nextMonth;
        this.calendarContainer = options.calendarContainer;

        this.currentDate = new Date();
    }

    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        this.currentMonth.textContent = `${year}年${month + 1}月`;

        this.calendarContainer.innerHTML = "<table><thead><tr>" +
            ["日", "月", "火", "水", "木", "金", "土"].map(d => `<th>${d}</th>`).join("") +
            "</tr></thead><tbody></tbody></table>";

        const tbody = this.calendarContainer.querySelector("tbody");
        let row = document.createElement("tr");

        for (let i = 0; i < firstDay; i++) {
            row.appendChild(document.createElement("td"));
        }

        for (let day = 1; day <= lastDate; day++) {
            if ((row.children.length) % 7 === 0 && day !== 1) {
                tbody.appendChild(row);
                row = document.createElement("tr");
            }
            const cell = document.createElement("td");
            const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            cell.textContent = day;
            cell.dataset.date = dateStr;
            cell.classList.add("calendar-cell");
            row.appendChild(cell);
        }
        tbody.appendChild(row);

    }

    bindNavigation() {
        this.prevMonth.addEventListener("click", () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });

        this.nextMonth.addEventListener("click", () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });
    }
}

export class DetailDataHandler {
    constructor(options) {
        this.
            this.list = options.
                this.detailData = {
                "2025-01-18": [
                    { type: "収入", category: "給料", amount: 98000 },
                    { type: "支出", category: "家賃", amount: 60813 }
                ],
                "2025-01-21": [
                    { type: "支出", category: "食費", amount: 13000 }
                ],
                "2025-01-23": [
                    { type: "支出", category: "コンビニ", amount: 3000 },
                    { type: "支出", category: "食費", amount: 5081 },
                    { type: "支出", category: "ゲーム課金", amount: 3584 },
                    { type: "支出", category: "コンビニ", amount: 2996 }
                ]
            }
    }
}