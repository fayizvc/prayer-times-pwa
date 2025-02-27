document.addEventListener("DOMContentLoaded", () => {
    const prayerTimesContainer = document.getElementById("prayer-times");
    const locationStatus = document.getElementById("location-status");
    const notifyBtn = document.getElementById("notify-btn");
    const adhanAudio = document.getElementById("adhan-audio");
  
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          locationStatus.textContent = "Location found!";
          fetchPrayerTimes(latitude, longitude);
        },
        () => {
          locationStatus.textContent = "Could not get location.";
        }
      );
    } else {
      locationStatus.textContent = "Geolocation is not supported.";
    }
  
    function fetchPrayerTimes(lat, lon) {
      fetch(
        `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`
      )
        .then((response) => response.json())
        .then((data) => {
          const timings = data.data.timings;
          displayPrayerTimes(timings);
          scheduleAdhan(timings);
        })
        .catch(() => {
          prayerTimesContainer.innerHTML =
            "<p class='text-red-500'>Failed to load prayer times.</p>";
        });
    }
  
    function displayPrayerTimes(timings) {
      prayerTimesContainer.innerHTML = "";
      Object.entries(timings).forEach(([name, time]) => {
        const prayerDiv = document.createElement("div");
        prayerDiv.className =
          "flex justify-between bg-green-50 px-4 py-2 rounded-lg shadow";
        prayerDiv.innerHTML = `<span class="font-medium text-green-700">${name}</span> <span class="text-gray-600">${time}</span>`;
        prayerTimesContainer.appendChild(prayerDiv);
      });
    }
  
    function scheduleAdhan(timings) {
      const now = new Date();
      Object.entries(timings).forEach(([name, time]) => {
        const [hours, minutes] = time.split(":");
        const adhanTime = new Date();
        adhanTime.setHours(hours, minutes, 0);
  
        if (adhanTime > now) {
          const timeUntilAdhan = adhanTime - now;
          setTimeout(() => {
            adhanAudio.play();
            alert(`${name} time!`);
          }, timeUntilAdhan);
        }
      });
    }
  
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("service-worker.js")
        .then(() => console.log("Service Worker Registered"))
        .catch((err) => console.log("Service Worker Failed:", err));
    }
  
    notifyBtn.addEventListener("click", () => {
      if (Notification.permission === "granted") {
        alert("Notifications are already enabled.");
      } else {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            alert("Notifications enabled.");
          }
        });
      }
    });
  });
  