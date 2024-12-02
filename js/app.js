document.addEventListener("DOMContentLoaded", () => {
    // Select all navigation items and tab content sections
    const navItems = document.querySelectorAll('.nav-item');
    const tabContent = document.querySelectorAll('.tab-content');

    // Add click event listener to each navigation item
    navItems.forEach((navItem) => {
        navItem.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default action of the link

            // Remove the active class from all navigation items and tab contents
            navItems.forEach(item => item.classList.remove('active'));
            tabContent.forEach(content => content.classList.remove('active'));

            // Add the active class to the clicked navigation item
            navItem.classList.add("active");

            // Get the target section's ID from the href attribute
            const targetId = navItem.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            // Add the 'active' class to the corresponding tab content section
            if (targetSection) {
                targetSection.classList.add("active");
            }
        })
    })

    document.querySelectorAll('progress').forEach((progressBar) => {
        // Get the current value and max value
        const value = progressBar.value;
        const max = progressBar.max;
    
        // Calculate the percentage width
        const percentage = (value / max) * 100 + '%';
    
        // Set the custom property for animation
        progressBar.style.setProperty('--progress-value', percentage);
    });

    // Create a tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    document.body.appendChild(tooltip);

    // Add event listeners to each stat label
    document.querySelectorAll('.stat label').forEach((label) => {
        label.addEventListener('mouseenter', (e) => {
            const tooltipText = label.getAttribute('data-tooltip');
            tooltip.textContent = tooltipText; // Set the tooltip text
            tooltip.classList.add('visible');

            // Position the tooltip
            const rect = label.getBoundingClientRect();
            tooltip.style.left = `${rect.left + window.scrollX + rect.width / 2}px`;
            tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 5}px`; // Adjust position above the label
        });

        label.addEventListener('mousemove', (e) => {
            // Update position on mouse move for smoother interaction
            tooltip.style.left = `${e.pageX}px`;
            tooltip.style.top = `${e.pageY - tooltip.offsetHeight - 10}px`;
        });

        label.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });
    });

   // Inventory Search Filter
   const searchBar = document.getElementById("search-bar");
   searchBar.addEventListener("keyup", () => {
       const query = searchBar.value.toLowerCase();
       const items = document.querySelectorAll(".inventory-item");

       items.forEach(item => {
           const name = item.getAttribute("data-name").toLowerCase();
           const weight = item.getAttribute("data-weight");
           const value = item.getAttribute("data-value");

           if (
               name.includes(query) ||
               weight.includes(query) ||
               value.includes(query)
           ) {
               item.style.display = "flex";
           } else {
               item.style.display = "none";
           }
       });
   });
})