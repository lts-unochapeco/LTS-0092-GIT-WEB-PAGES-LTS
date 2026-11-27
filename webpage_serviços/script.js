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

/* Centraliza somente o componente de Servicos na largura util da janela.
   A regra CSS tambem funciona sem JavaScript em um conteiner centralizado. */
(function () {
    "use strict";
    function initWidth() {
        const root = document.getElementById("lts-servicos-portfolio");
        if (!root || root.dataset.ltsWidthBound === "1") return;
        root.dataset.ltsWidthBound = "1";
        let frame = 0;
        function align() {
            frame = 0;
            const viewport = document.documentElement.clientWidth;
            if (!viewport || !root.isConnected) return;
            root.style.setProperty("--lts-measured-viewport", viewport + "px");
            root.style.setProperty("--lts-center-shift", "0px");
            const rect = root.getBoundingClientRect();
            if (rect.width > 0) {
                const shift = (viewport - rect.width) / 2 - rect.left;
                root.style.setProperty("--lts-center-shift", shift + "px");
            }
        }
        function schedule() {
            if (!frame) frame = window.requestAnimationFrame(align);
        }
        align();
        window.addEventListener("resize", schedule, {passive: true});
        window.addEventListener("load", schedule);
        if (typeof ResizeObserver !== "undefined") {
            const observer = new ResizeObserver(schedule);
            if (root.parentElement) observer.observe(root.parentElement);
            observer.observe(document.documentElement);
        }
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initWidth, {once: true});
    } else {
        initWidth();
    }
})();
