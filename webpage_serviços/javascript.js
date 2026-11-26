/* LTS | Expansão e recolhimento exclusivos do portfólio. */
(function () {
    "use strict";
    // Evita duplicação caso o editor ou plugin carregue o código mais de uma vez.
    const key = Symbol.for("lts.servicos.portfolio.listener.v2");
    if (document[key]) return;
    document[key] = true;
    document.addEventListener("click", function (event) {
        if (!(event.target instanceof Element)) return;
        const button = event.target.closest(
            "#lts-servicos-portfolio #lts-svc-servicos .lts-svc-toolbar button"
        );
        if (!button || !["lts-svc-expand", "lts-svc-collapse"].includes(button.id)) return;
        const section = button.closest("#lts-svc-servicos");
        const open = button.id === "lts-svc-expand";
        section.querySelectorAll(".lts-svc-service details").forEach(function (item) {
            item.open = open;
        });
    });
})();
