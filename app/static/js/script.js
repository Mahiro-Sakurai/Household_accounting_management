import openForm from "./openForm.js";

export default function changeSection(sectionId) {
    let sections = document.querySelectorAll(".section");
    sections.forEach(function (section) {
        section.classList.remove("active");
    });
    document.getElementById(sectionId).classList.add("active");
}

document.getElementById("budgetBtn").addEventListener("click", async () => {
    changeSection("budget");

    const initialData = {
        type: "expense",
        date: new Date(),
        memo: null,
        amount: null,
        selectedCategory: null
    }
    await openForm("budgetFormCreateToday", "create", initialData);

});
document.getElementById("calendarBtn").addEventListener("click", function () {
    changeSection("calendar");
});
document.getElementById("reportBtn").addEventListener("click", function () {
    changeSection("report");
});
document.getElementById("menuBtn").addEventListener("click", function () {
    changeSection("menu");
});

