
"use strict";

/* =========================================
   SKYBLINK - MAIN JAVASCRIPT
========================================= */


/* =========================================
   1. MOBILE NAVIGATION
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const navbar = document.querySelector(".navbar");
    const navLinks = document.querySelector(".nav-links");

    if (navbar && navLinks) {

        const menuButton = document.createElement("button");

        menuButton.type = "button";
        menuButton.className = "menu-toggle";
        menuButton.setAttribute("aria-label", "Toggle navigation");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.textContent = "☰";

        navbar.appendChild(menuButton);

        menuButton.addEventListener("click", () => {

            const isOpen = navLinks.classList.toggle("active");

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuButton.textContent = isOpen ? "✕" : "☰";

        });

        navLinks.querySelectorAll("a").forEach((link) => {

            link.addEventListener("click", () => {

                navLinks.classList.remove("active");

                menuButton.setAttribute("aria-expanded", "false");

                menuButton.textContent = "☰";

            });

        });

    }


    /* =========================================
       2. MISSION COUNTDOWN
    ========================================= */

    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");

    // Demo countdown target date
    const missionDate = new Date("2027-01-01T12:00:00Z").getTime();

    function updateCountdown() {

        if (
            !daysElement ||
            !hoursElement ||
            !minutesElement ||
            !secondsElement
        ) {
            return;
        }

        const currentTime = Date.now();
        const difference = missionDate - currentTime;

        if (difference <= 0) {

            daysElement.textContent = "00";
            hoursElement.textContent = "00";
            minutesElement.textContent = "00";
            secondsElement.textContent = "00";

            return;

        }

        const days = Math.floor(
            difference / (1000 * 60 * 60 * 24)
        );

        const hours = Math.floor(
            (difference / (1000 * 60 * 60)) % 24
        );

        const minutes = Math.floor(
            (difference / (1000 * 60)) % 60
        );

        const seconds = Math.floor(
            (difference / 1000) % 60
        );

        daysElement.textContent = String(days).padStart(2, "0");
        hoursElement.textContent = String(hours).padStart(2, "0");
        minutesElement.textContent = String(minutes).padStart(2, "0");
        secondsElement.textContent = String(seconds).padStart(2, "0");

    }

    updateCountdown();

    const countdownTimer = window.setInterval(updateCountdown, 1000);


    /* =========================================
       3. CONTACT FORM
    ========================================= */

    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");
    const submitButton = document.getElementById("submitBtn");

    if (contactForm) {

        contactForm.addEventListener("submit", async (event) => {

            event.preventDefault();

            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            const formData = new FormData(contactForm);

            const contactData = {
                name: String(formData.get("name") || "").trim(),
                email: String(formData.get("email") || "").trim(),
                subject: String(formData.get("subject") || "").trim(),
                message: String(formData.get("message") || "").trim()
            };

            if (
                !contactData.name ||
                !contactData.email ||
                !contactData.subject ||
                !contactData.message
            ) {

                if (formStatus) {
                    formStatus.textContent =
                        "Please fill in all fields.";
                }

                return;

            }

            const originalButtonText = submitButton
                ? submitButton.textContent
                : "";

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "SENDING...";
            }

            if (formStatus) {
                formStatus.textContent = "";
            }

            try {

                const response = await fetch("/api/contact", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(contactData)

                });

                const result = await response.json().catch(() => ({}));

                if (!response.ok) {

                    throw new Error(
                        result.message || "Unable to send your message."
                    );

                }

                if (formStatus) {
                    formStatus.textContent =
                        "Message sent successfully!";
                }

                contactForm.reset();

            } catch (error) {

                console.error("Contact form error:", error);

                if (formStatus) {

                    formStatus.textContent =
                        error.message ||
                        "Something went wrong. Please try again.";

                }

            } finally {

                if (submitButton) {

                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;

                }

            }

        });

    }


    /* =========================================
       4. BACKEND API STATUS
    ========================================= */

    async function checkServerStatus() {

        try {

            const response = await fetch("/api/status");

            if (!response.ok) {
                throw new Error("Server is unavailable.");
            }

            const data = await response.json();

            console.log("SKYBLINK Server:", data);

        } catch (error) {

            console.warn(
                "SKYBLINK API connection unavailable:",
                error.message
            );

        }

    }

    checkServerStatus();


    /* =========================================
       5. SCROLL REVEAL ANIMATION
    ========================================= */

    const revealElements = document.querySelectorAll(
        ".mission-card, .technology-card, .intro-grid, .contact-grid"
    );

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            (entries, currentObserver) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        currentObserver.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach((element) => {

            element.classList.add("reveal");

            observer.observe(element);

        });

    }

});
