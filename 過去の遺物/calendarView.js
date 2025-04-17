
// calendarView.js
export default class CalendarView {
    constructor(manager, elements) {
        this.manager = manager;
        this.elements = elements;
    }

    async init() {
        this.elements.prevMonthBtn.addEventListener("click", async () => {
            this.manager.changeMonth(-1);
            await this.manager.loadCalendarData();
            this.render();
        });

        this.elements.nextMonthBtn.addEventListener("click", async () => {
            this.manager.changeMonth(1);
            await this.manager.loadCalendarData();
            this.render();
        });

        this.render();
    }

    async render() {
        this.renderHeader();
        this.renderCalendarGrid();
        await this.renderSidebar();
    }

    renderHeader() {
        const date = this.manager.getCurrentDate();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        this.elements.monthLabel.textContent = `${year}年${month}月`;
    }

    renderCalendarGrid() {
        const grid = this.elements.calendarGrid;
        grid.innerHTML = '';

        const data = this.manager.getData();
        const currentDate = this.manager.getCurrentDate();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDay = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const startOffset = firstDay.getDay();
        const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

        const dayMap = {};
        data.forEach(entry => {
            const date = new Date(entry.date);
            dayMap[date.getDate()] = entry;
        });

        for (let i = 0; i < totalCells; i++) {
            const cell = document.createElement("div");
            cell.classList.add("calendar-cell");

            const dateObj = new Date(year, month, i - startOffset + 1);
            const day = dateObj.getDate();
            const dayOfWeek = dateObj.getDay();
            const isCurrentMonth = dateObj.getMonth() === month;
            const isHoliday = this.manager.isHoliday(dateObj);
            const color = isHoliday ? 'red' : dayOfWeek === 0 ? 'red' : dayOfWeek === 6 ? 'blue' : 'black';

            if (isCurrentMonth && day > 0 && day <= daysInMonth) {
                const dayDiv = document.createElement("div");
                dayDiv.textContent = day;
                dayDiv.classList.add("calendar-day");
                dayDiv.style.color = color;

                const entry = dayMap[day] || { income: 0, expense: 0 };
                const incomeEl = entry.income ? this._createAmountEl("+", entry.income, "calendar-income") : null;
                const expenseEl = entry.expense ? this._createAmountEl("-", entry.expense, "calendar-expense") : null;

                cell.appendChild(dayDiv);
                if (incomeEl) cell.appendChild(incomeEl);
                if (expenseEl) cell.appendChild(expenseEl);
            } else {
                cell.classList.add("empty");
            }

            this.elements.calendarGrid.appendChild(cell);
        }
    }

    _createAmountEl(sign, amount, className) {
        const el = document.createElement("div");
        el.textContent = `${sign}¥${amount}`;
        el.classList.add(className);
        return el;
    }

    async renderSidebar() {
        const summaryEl = this.elements.sidebarHeader;
        const scrollArea = this.elements.sidebarScrollArea;
        scrollArea.innerHTML = '';

        const allDetails = await this.manager.getAllDetails();

        const totalIncome = allDetails.filter(i => i.expense_type === 'income').reduce((sum, i) => sum + i.amount, 0);
        const totalExpense = allDetails.filter(i => i.expense_type === 'expense').reduce((sum, i) => sum + i.amount, 0);
        const totalDiff = totalIncome - totalExpense;

        summaryEl.innerHTML = `
            <div>収入：+¥${totalIncome}</div>
            <div>支出：-¥${totalExpense}</div>
            <div>合計：¥${totalDiff}</div>
        `;

        allDetails.forEach(item => {
            const div = document.createElement("div");
            div.classList.add("detail-item");
            div.textContent = `${item.date} | ${item.expense_type} | ${item.category_name} | ¥${item.amount} | ${item.memo || ''}`;
            scrollArea.appendChild(div);
        });
    }
}

