import CreateFormManager from "./manager/createFormManager.js";
import UpdateFormManager from "./manager/updateFormManager.js"
import FormView from "./views/formview.js";

export default async function openForm(divId, mode, initialData) {
    if (divId == "content") {
        document.getElementById("budgetFormCreateToday").innerHTML = ""
    } else {
        document.getElementById("content").innerHTML = ""
    }

    let manager;
    if (mode === "create") {
        manager = new CreateFormManager(initialData);
    } else if (mode === "update") {
        manager = new UpdateFormManager(initialData);
    }

    await manager.init();
    const view = new FormView(manager, divId);
    await view.init();
    console.log(view.categories)
}

