document.addEventListener("DOMContentLoaded", () => {
    const navItems = document.querySelectorAll('.nav-item');
    const tabContent = document.querySelectorAll('.tab-content');
    const searchBar = document.getElementById("search-bar");
    const prevButton = document.getElementById("nav-prev");
    const nextButton = document.getElementById("nav-next");

    // Navigation Tab Logic
    navItems.forEach((navItem) => {
        navItem.addEventListener('click', (event) => {
            event.preventDefault();

            // Remove active class from all nav items and tab content
            navItems.forEach(item => item.classList.remove('active'));
            tabContent.forEach(content => {
                content.classList.remove('active');
            });

            // Add active class to clicked nav item
            navItem.classList.add('active');

            // Get target tab by ID
            const targetId = navItem.getAttribute('href').substring(1);
            const targetTab = document.getElementById(targetId);

            // Apply active class to the target tab for fade-in effect
            setTimeout(() => {
                targetTab.classList.add('active');
            }, 10); // Small delay to ensure smooth transition
        });
    });

    let activeIndex = Array.from(tabContent).findIndex((tab) =>
        tab.classList.contains("active")
    );

    // Function to update active tab and nav item
    function updateActiveTab(newIndex) {
        tabContent.forEach((tab, index) => {
            tab.classList.toggle("active", index === newIndex);
        });
        navItems.forEach((navItem, index) => {
            navItem.classList.toggle("active", index === newIndex);
        });
        activeIndex = newIndex;
    }

    // Navigate to the previous tab
    prevButton.addEventListener("click", () => {
        const newIndex = activeIndex > 0 ? activeIndex - 1 : tabContent.length - 1;
        updateActiveTab(newIndex);
    });

    // Navigate to the next tab
    nextButton.addEventListener("click", () => {
        const newIndex = activeIndex < tabContent.length - 1 ? activeIndex + 1 : 0;
        updateActiveTab(newIndex);
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

    const inventoryGrid = document.querySelector(".inventory-grid");
    const sidePanel = document.getElementById("item-details-panel");
    const closeButton = document.getElementById("close-panel");

    const nameElement = sidePanel.querySelector(".item-details-name");
    const iconElement = sidePanel.querySelector(".item-details-icon");
    const descriptionElement = sidePanel.querySelector(".item-details-description");
    const weightElement = sidePanel.querySelector(".item-details-weight");
    const valueElement = sidePanel.querySelector(".item-details-value");

    // Function to show the side panel with item details
    function showSidePanel(item) {
        const name = item.getAttribute("data-name");
        const weight = item.getAttribute("data-weight");
        const value = item.getAttribute("data-value");
        const iconSrc = item.querySelector("img").src;

        // Populate side panel with item details
        nameElement.textContent = name;
        iconElement.src = iconSrc;
        descriptionElement.textContent = `${name} is a critical inventory item with unique properties.`;
        weightElement.textContent = `Weight: ${weight}`;
        valueElement.textContent = `Value: ${value}`;

        // Show the panel
        sidePanel.classList.add("visible");
        sidePanel.classList.remove("hidden");
    }

    // Function to hide the side panel
    function hideSidePanel() {
        sidePanel.classList.remove("visible");
        sidePanel.classList.add("hidden");
    }

    // Add click listener to inventory items
    inventoryGrid.addEventListener("click", (event) => {
        const item = event.target.closest(".inventory-item");
        if (item) {
            showSidePanel(item);
        }
    });

    // Add click listener to close button
    closeButton.addEventListener("click", hideSidePanel);

    // Add listener to hide the panel when clicking outside
    document.addEventListener("click", (event) => {
        if (!sidePanel.contains(event.target) && !event.target.closest(".inventory-item")) {
            hideSidePanel();
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

    const svg = document.querySelector(".interactive-map");
    let isPanning = false;
    let startPoint = { x: 0, y: 0 };
    let transform = { x: 0, y: 0, scale: 1 };

    // Mouse down to start panning
    svg.addEventListener("mousedown", (event) => {
        isPanning = true;
        startPoint = { x: event.clientX, y: event.clientY };
    });

    // Mouse move to pan
    svg.addEventListener("mousemove", (event) => {
        if (!isPanning) return;

        const dx = event.clientX - startPoint.x;
        const dy = event.clientY - startPoint.y;

        startPoint = { x: event.clientX, y: event.clientY };
        transform.x += dx / transform.scale; // Adjust for zoom level
        transform.y += dy / transform.scale;

        applyTransform();
    });

    // Mouse up to stop panning
    svg.addEventListener("mouseup", () => {
        isPanning = false;
    });

    // Mouse leave to stop panning
    svg.addEventListener("mouseleave", () => {
        isPanning = false;
    });

    // Scroll to zoom
    svg.addEventListener("wheel", (event) => {
        event.preventDefault();
        const scaleAmount = 0.1;
        const scaleFactor = event.deltaY > 0 ? 1 - scaleAmount : 1 + scaleAmount;

        const rect = svg.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // Adjust for zoom level
        transform.x -= (mouseX / transform.scale) * (1 - scaleFactor);
        transform.y -= (mouseY / transform.scale) * (1 - scaleFactor);

        transform.scale *= scaleFactor;
        transform.scale = Math.max(0.5, Math.min(5, transform.scale)); // Restrict zoom levels

        applyTransform();
    });

    // Apply the transform to the SVG
    function applyTransform() {
        svg.setAttribute(
            "viewBox",
            `${-transform.x} ${-transform.y} ${500 / transform.scale} ${500 / transform.scale}`
        );
    }

    const stations = document.querySelectorAll(".radio-station");
    const currentlyPlaying = document.getElementById("currently-playing");

    // Create a new Audio object for the click sound
    const clickSound = new Audio("assets/sounds/mixkit-radio-static-fx-2561.wav");

    stations.forEach((station) => {
        station.addEventListener("mouseenter", () => {
            clickSound.currentTime = 0; // Reset the sound for repeated plays
            clickSound.play();
        });


        // Add click event to update the currently playing section
        station.addEventListener("click", () => {
            const stationName = station.getAttribute("data-station");
            currentlyPlaying.textContent = `Currently Playing: ${stationName}`;
        });
    });
});
