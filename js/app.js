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
})