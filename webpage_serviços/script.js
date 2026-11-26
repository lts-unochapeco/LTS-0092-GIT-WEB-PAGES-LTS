
"use strict";

document.addEventListener("click", function (event) {

    if (!(event.target instanceof Element)) {
        return;
    }

    const botao = event.target.closest(
        "#servicos .toolbar button"
    );

    if (!botao) {
        return;
    }

    if (!["expand", "collapse"].includes(botao.id)) {
        return;
    }

    const secao = botao.closest("#servicos");

    const detalhes = secao.querySelectorAll(
        ".service details"
    );

    const expandir = botao.id === "expand";

    detalhes.forEach(function (item) {
        item.open = expandir;
    });

    console.info(
        "[LTS] Serviços " +
        (expandir ? "expandidos" : "recolhidos") +
        ": " + detalhes.length
    );

});
