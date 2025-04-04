
function changeSection(sectionId) {
    let sections = document.querySelectorAll(".section");
    sections.forEach(function (section) {
        section.classList.remove("active");
    });
    document.getElementById(sectionId).classList.add("active");
}

document.getElementById("budgetBtn").addEventListener("click", function () {
    changeSection("budget");
});
document.getElementById("backBudgetBtn").addEventListener("click", function () {
    changeSection("budget");
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
document.getElementById("categoryBtn").addEventListener("click", function () {
    changeSection("category");
});
