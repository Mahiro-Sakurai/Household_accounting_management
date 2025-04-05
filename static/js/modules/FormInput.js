export default class FormInput {
    constructor(options) {
        this.dateInput = options.dateInput;
        this.prevBtn = options.prevBtn;
        this.nextBtn = options.nextBtn;
        this.memo = options.memo;
        this.errorMsg = options.errorMsg;
        this.amount = options.amount;
    }

    dateHandler() {
        const today = new Date();
        this.dateInput.value = today.toISOString().split('T')[0];

        this.prevBtn.addEventListener("click", () => {
            const current = new Date(this.dateInput.value);
            current.setDate(current.getDate() - 1);
            this.dateInput.value = current.toISOString().split('T')[0];
        });

        this.nextBtn.addEventListener("click", () => {
            const current = new Date(this.dateInput.value);
            current.setDate(current.getDate() + 1);
            this.dateInput.value = current.toISOString().split('T')[0];
        });
    }

    memoHandler() {
        this.memo.addEventListener("input", () => {
            let value = this.memo.value;

            // 改行とスペース（半角・全角）を削除
            value = value.replace(/[\n\r\s　]/g, "");

            // 15文字を超えたらカット
            if (value.length > 15) {
                value = value.slice(0, 15);
                this.errorMsg.textContent = "15文字以内で入力してください。";
            } else if (value.length === 15) {
                this.errorMsg.textContent = "15文字以内で入力してください";
            } else {
                this.errorMsg.textContent = "";
            }

            this.memo.value = value;
        });
    }

    init() {
        this.dateHandler();
        this.memoHandler();
    }

    getInputData() {
        return {
            date: this.dateInput.value,
            memo: this.memo.value,
            amount: this.amount.value
        };
    }
}
