const buttons = document.querySelectorAll(".size-buttons button");

buttons.forEach((button) => {

    button.addEventListener("click", () => {

        if (button.disabled) {
            return;
        }

        buttons.forEach((btn) => {
            btn.classList.remove("selected");
        });

        button.classList.add("selected");

    });

});