document.addEventListener("DOMContentLoaded", () => {

  const productData = [
    { condition: "novo",     sizes: ["S", "M", "L"],       colors: ["#4a5e45"]               },
    { condition: "seminovo", sizes: ["S", "L", "XL"],      colors: ["#2c2c2a", "#6b5a4e"]    },
    { condition: "novo",     sizes: ["XS", "S", "M"],      colors: ["#e8e5de", "#4a5e45"]    },
    { condition: "seminovo", sizes: ["XS", "S"],           colors: ["#6b5a4e", "#2c2c2a"]    },
    { condition: "novo",     sizes: ["S", "M", "L"],       colors: ["#e8e5de", "#6b5a4e"]    },
    { condition: "seminovo", sizes: ["M", "L", "XL"],      colors: ["#7a3c30", "#2c2c2a"]    },
  ];

  const state = {
    conditions: new Set(),
    sizes: new Set(),
    colors: new Set(),
  };

  function normalize(hex) {
    return (hex || "").trim().toLowerCase();
  }

  function applyFilters() {
    document.querySelectorAll(".card-produto").forEach((card, i) => {
      const data = productData[i];
      if (!data) return;

      const condOk  = state.conditions.size === 0 || state.conditions.has(data.condition);
      const sizeOk  = state.sizes.size === 0      || data.sizes.some((s) => state.sizes.has(s));
      const colorOk = state.colors.size === 0     || data.colors.some((c) => state.colors.has(normalize(c)));

      card.style.display = condOk && sizeOk && colorOk ? "" : "none";
    });
  }

  function syncConditions() {
    state.conditions.clear();
    document.querySelectorAll(".grupo-filtro input[type=checkbox]").forEach((cb) => {
      if (!cb.checked) return;
      const label = cb.parentElement.textContent.trim().toLowerCase();
      if (label.includes("seminovo"))      state.conditions.add("seminovo");
      else if (label.includes("novo"))     state.conditions.add("novo");
    });
  }

  function syncSizes() {
    state.sizes.clear();
    const seen = new Set();
    document.querySelectorAll(".btn-tamanho.ativo").forEach((btn) => {
      const s = btn.textContent.trim();
      if (!seen.has(s)) { state.sizes.add(s); seen.add(s); }
    });
  }

  function syncColors() {
    state.colors.clear();
    const seen = new Set();
    document.querySelectorAll(".bolinha.ativo").forEach((dot) => {
      const c = normalize(dot.style.background || dot.style.backgroundColor);
      if (c && !seen.has(c)) { state.colors.add(c); seen.add(c); }
    });
  }

  function mirrorSizeButtons(clickedBtn) {
    const size = clickedBtn.textContent.trim();
    const isActive = clickedBtn.classList.contains("ativo");
    document.querySelectorAll(".btn-tamanho").forEach((btn) => {
      if (btn.textContent.trim() === size) btn.classList.toggle("ativo", isActive);
    });
  }

  function mirrorColorDots(clickedDot) {
    const color = normalize(clickedDot.style.background || clickedDot.style.backgroundColor);
    const isActive = clickedDot.classList.contains("ativo");
    document.querySelectorAll(".bolinha").forEach((dot) => {
      const c = normalize(dot.style.background || dot.style.backgroundColor);
      if (c === color) dot.classList.toggle("ativo", isActive);
    });
  }

  function mirrorCheckboxes(changedCb) {
    const label = changedCb.parentElement.textContent.trim().toLowerCase();
    const isSeminovo = label.includes("seminovo");
    document.querySelectorAll(".grupo-filtro input[type=checkbox]").forEach((cb) => {
      const l = cb.parentElement.textContent.trim().toLowerCase();
      const match = isSeminovo
        ? l.includes("seminovo")
        : l.includes("novo") && !l.includes("seminovo");
      if (match) cb.checked = changedCb.checked;
    });
  }

  function clearAll() {
    document.querySelectorAll(".grupo-filtro input[type=checkbox]").forEach((cb) => cb.checked = false);
    document.querySelectorAll(".btn-tamanho").forEach((b) => b.classList.remove("ativo"));
    document.querySelectorAll(".bolinha").forEach((d) => d.classList.remove("ativo"));
    state.conditions.clear();
    state.sizes.clear();
    state.colors.clear();
    applyFilters();
  }

  document.querySelectorAll(".grupo-filtro input[type=checkbox]").forEach((cb) => {
    cb.addEventListener("change", () => { mirrorCheckboxes(cb); syncConditions(); applyFilters(); });
  });

  document.querySelectorAll(".btn-tamanho").forEach((btn) => {
    btn.addEventListener("click", () => { btn.classList.toggle("ativo"); mirrorSizeButtons(btn); syncSizes(); applyFilters(); });
  });

  document.querySelectorAll(".bolinha").forEach((dot) => {
    dot.addEventListener("click", () => { dot.classList.toggle("ativo"); mirrorColorDots(dot); syncColors(); applyFilters(); });
  });

  document.querySelectorAll(".btn-limpar").forEach((btn) => {
    btn.addEventListener("click", clearAll);
  });

  const filterToggle  = document.getElementById("filterToggle");
  const filterDrawer  = document.getElementById("filterDrawer");
  const filterClose   = document.getElementById("filterClose");
  const filterOverlay = document.getElementById("filterOverlay");

  filterToggle ?.addEventListener("click", () => filterDrawer.classList.add("open"));
  filterClose  ?.addEventListener("click", () => filterDrawer.classList.remove("open"));
  filterOverlay?.addEventListener("click", () => filterDrawer.classList.remove("open"));

  syncConditions();
  syncSizes();
  syncColors();
  applyFilters();

});