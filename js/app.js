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

    const questMarkers = document.querySelectorAll(".quest-marker");
    const mapTooltip = document.createElement("div");
    mapTooltip.className = "tooltip";
    document.body.appendChild(mapTooltip);

    const modal = document.getElementById("quest-modal");
    const modalTitle = modal.querySelector(".quest-title");
    const modalDescription = modal.querySelector(".quest-description");
    const modalCloseButton = modal.querySelector(".close-button");

    // Show tooltip on hover
    questMarkers.forEach((marker) => {
        marker.addEventListener("mouseenter", (event) => {
            const tooltipText = marker.getAttribute("data-tooltip");
            mapTooltip.textContent = tooltipText;
            mapTooltip.classList.add("visible");

            const rect = marker.getBoundingClientRect();
            mapTooltip.style.left = `${rect.left + window.scrollX + rect.width / 2}px`;
            mapTooltip.style.top = `${rect.top + window.scrollY - mapTooltip.offsetHeight - 5}px`;
        });

        marker.addEventListener("mousemove", (event) => {
            mapTooltip.style.left = `${event.pageX}px`;
            mapTooltip.style.top = `${event.pageY - mapTooltip.offsetHeight - 10}px`;
        });

        marker.addEventListener("mouseleave", () => {
            mapTooltip.classList.remove("visible");
        });

        // Show modal on click
        marker.addEventListener("click", () => {
            modalTitle.textContent = marker.getAttribute("data-tooltip");
            modalDescription.textContent = marker.getAttribute("data-description");
            modal.classList.add("visible");
        });
    });

    // Close modal on close button
    modalCloseButton.addEventListener("click", () => {
        modal.classList.remove("visible");
    });

    // Close modal on clicking outside the modal content
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.classList.remove("visible");
        }
    });

    // Close modal on Escape key
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.classList.contains("visible")) {
            modal.classList.remove("visible");
        }
    });

    const svg = document.getElementById("map");
    let isPanning = false;
    let startPoint = { x: 0, y: 0 };
    let viewBox = { x: 0, y: 0, width: 1000, height: 1000 };
    const zoomFactor = 1.2; // Zoom in/out factor

    // Mouse events
    svg.addEventListener("mousedown", (event) => {
        isPanning = true;
        startPoint = { x: event.clientX, y: event.clientY };
        svg.style.cursor = "grabbing";
    });

    svg.addEventListener("mousemove", (event) => {
        if (!isPanning) return;
        const dx = (startPoint.x - event.clientX) * (viewBox.width / svg.clientWidth);
        const dy = (startPoint.y - event.clientY) * (viewBox.height / svg.clientHeight);
        viewBox.x += dx;
        viewBox.y += dy;
        startPoint = { x: event.clientX, y: event.clientY };
        updateViewBox();
    });

    svg.addEventListener("mouseup", () => {
        isPanning = false;
        svg.style.cursor = "grab";
    });

    svg.addEventListener("mouseleave", () => {
        isPanning = false;
        svg.style.cursor = "grab";
    });

    // Scroll event for zooming
    svg.addEventListener("wheel", (event) => {
        event.preventDefault();
        const scale = event.deltaY < 0 ? 1 / zoomFactor : zoomFactor;
        const mouseX = (event.offsetX / svg.clientWidth) * viewBox.width + viewBox.x;
        const mouseY = (event.offsetY / svg.clientHeight) * viewBox.height + viewBox.y;
        viewBox.width *= scale;
        viewBox.height *= scale;
        viewBox.x = mouseX - (mouseX - viewBox.x) * scale;
        viewBox.y = mouseY - (mouseY - viewBox.y) * scale;
        updateViewBox();
    });

    // Update SVG viewBox attribute
    function updateViewBox() {
        svg.setAttribute(
            "viewBox",
            `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`
        );
    }

    const userLocationMarker = document.getElementById("user-location");
    const statusElement = document.getElementById("geolocation-status");

    // Mock coordinates to simulate real-world placement (example: map bounds)
    const mapBounds = {
        north: 90,
        south: -90,
        east: 180,
        west: -180
    };

    const svgBounds = {
        width: 1000,
        height: 1000
    };

    // Convert geographical coordinates to SVG coordinates
    function geoToSvg(lat, lon) {
        const x = ((lon - mapBounds.west) / (mapBounds.east - mapBounds.west)) * svgBounds.width;
        const y = svgBounds.height - ((lat - mapBounds.south) / (mapBounds.north - mapBounds.south)) * svgBounds.height;
        return { x, y };
    }

    // Use the Geolocation API
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const { x, y } = geoToSvg(latitude, longitude);

                // Update the user's location marker
                userLocationMarker.setAttribute("cx", x);
                userLocationMarker.setAttribute("cy", y);
                userLocationMarker.setAttribute("visibility", "visible");

                // Update status message
                statusElement.textContent = `Your location: ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
            },
            (error) => {
                console.error("Geolocation error:", error);
                statusElement.textContent = "Unable to retrieve your location.";
            }
        );
    } else {
        statusElement.textContent = "Geolocation is not supported by your browser.";
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
