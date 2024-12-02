document.addEventListener("DOMContentLoaded", () => {
    const navItems = document.querySelectorAll('.nav-item');
    const tabContent = document.querySelectorAll('.tab-content');
    const searchBar = document.getElementById("search-bar");
    const modal = document.getElementById("item-modal");
    const modalName = modal.querySelector(".item-modal-name");
    const modalIcon = modal.querySelector(".item-modal-icon");
    const modalDescription = modal.querySelector(".item-modal-description");
    const modalWeight = modal.querySelector(".item-modal-weight");
    const modalValue = modal.querySelector(".item-modal-value");
    const closeButton = modal.querySelector(".close-button");

    // Navigation Tab Logic
    navItems.forEach((navItem) => {
        navItem.addEventListener('click', (event) => {
            event.preventDefault();

            // Remove active classes
            navItems.forEach(item => item.classList.remove('active'));
            tabContent.forEach(content => content.classList.remove('active'));

            // Add active class to clicked tab and its content
            navItem.classList.add("active");
            document.getElementById(navItem.getAttribute('href').substring(1)).classList.add("active");
        });
    });

    // Tooltip Logic
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    document.body.appendChild(tooltip);

    document.querySelectorAll('.stat label').forEach((label) => {
        label.addEventListener('mouseenter', () => {
            tooltip.textContent = label.getAttribute('data-tooltip');
            tooltip.classList.add('visible');
            const rect = label.getBoundingClientRect();
            tooltip.style.left = `${rect.left + window.scrollX + rect.width / 2}px`;
            tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 5}px`;
        });

        label.addEventListener('mousemove', (event) => {
            tooltip.style.left = `${event.pageX}px`;
            tooltip.style.top = `${event.pageY - tooltip.offsetHeight - 10}px`;
        });

        label.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });
    });

    // Inventory Search Filter
    searchBar.addEventListener("keyup", () => {
        const query = searchBar.value.toLowerCase();
        const items = document.querySelectorAll(".inventory-item");

        items.forEach(item => {
            const name = item.getAttribute("data-name").toLowerCase();
            const weight = item.getAttribute("data-weight");
            const value = item.getAttribute("data-value");

            // Show or hide items based on the search query
            item.style.display = (
                name.includes(query) || weight.includes(query) || value.includes(query)
            ) ? "flex" : "none";
        });
    });

    // Modal Logic
    function openModal(item) {
        modalName.textContent = item.getAttribute("data-name");
        modalIcon.src = item.querySelector("img").src;
        modalDescription.textContent = `${item.getAttribute("data-name")} is an essential item for your inventory.`;
        modalWeight.textContent = `Weight: ${item.getAttribute("data-weight")}`;
        modalValue.textContent = `Value: ${item.getAttribute("data-value")}`;
        modal.classList.add("visible");
    }

    function closeModal() {
        modal.classList.remove("visible");
    }

    // Event Delegation for Inventory Items
    document.querySelector(".inventory-grid").addEventListener("click", (event) => {
        const item = event.target.closest(".inventory-item");
        if (item) openModal(item);
    });

    // Close Modal Events
    closeButton.addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => {
        if (event.target === modal) closeModal();
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.classList.contains("visible")) {
            closeModal();
        }
    });

    const mapRegions = document.querySelectorAll(".map-region");
    const mapTooltip = document.createElement("div");
    mapTooltip.className = "tooltip";
    document.body.appendChild(mapTooltip);

    mapRegions.forEach((region) => {
        region.addEventListener("mouseenter", (e) => {
            const tooltipText = region.getAttribute("data-tooltip");
            mapTooltip.textContent = tooltipText;
            mapTooltip.classList.add("visible");

            // Position the tooltip
            const rect = region.getBoundingClientRect();
            mapTooltip.style.left = `${rect.left + window.scrollX + rect.width / 2}px`;
            mapTooltip.style.top = `${rect.top + window.scrollY - mapTooltip.offsetHeight - 5}px`;
        });

        region.addEventListener("mousemove", (e) => {
            mapTooltip.style.left = `${e.pageX}px`;
            mapTooltip.style.top = `${e.pageY - mapTooltip.offsetHeight - 10}px`;
        });

        region.addEventListener("mouseleave", () => {
            mapTooltip.classList.remove("visible");
        });
    });
});
