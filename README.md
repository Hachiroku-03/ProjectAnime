# Musashi Anime Project

A responsive anime discovery web app built with HTML, CSS, and JavaScript. The app uses the [Jikan API](https://jikan.moe/) to fetch and display anime data, including top-rated, latest, and upcoming anime, as well as search and genre/type filtering.

---

## 📁 Project Structure

```
ProjectAnime/
│
├── Homepage.html         # Main landing page
├── Homepage.css          # Styles for homepage and navigation
├── Homepage.js           # Main JS logic (search, burger menu, etc.)
│
├── anime-details.html    # Anime details page (shows info for a selected anime)
├── anime-details.css     # Styles for anime details page
├── anime-details.js      # JS for fetching and displaying anime details
│
├── genre.html            # Genre filter page
├── genre.css
├── genre.js
│
├── type.html             # Type filter page (TV, Movie, OVA, etc.)
├── type.css
├── type.js
│
├── latest.html           # Latest anime page
├── latest.css
├── latest.js
│
├── top.html              # Top rated anime page
├── top.css
├── top.js
│
├── upcomingAnime.html    # Upcoming anime page
├── UpcomingAnime.css
├── upcomingAnime.js
│
├── Media/                # Images and other media assets
└── ...
```

---

## 🚀 Features

- **Responsive Navigation:**  
  Burger menu for mobile/tablet navigation.
- **Anime Search:**  
  Search for anime by name using the Jikan API.
- **Anime Details:**  
  Click any anime to view detailed info, trailer, and episodes.
- **Genre & Type Filtering:**  
  Browse anime by genre or type (TV, Movie, OVA, etc.).
- **Top, Latest, and Upcoming:**  
  Dedicated pages for top-rated, latest, and upcoming anime.
- **Back to Top Button:**  
  Smooth scrolls to the top of the page.

---

## 🛠️ How It Works

1. **Homepage:**  
   Displays search bar, navigation, and anime sections (top, latest, upcoming).
2. **Burger Menu:**  
   On small screens, a burger icon appears. Clicking it toggles the navigation menu.
3. **Anime Details:**  
   Clicking an anime card navigates to `anime-details.html?id=ANIME_ID`, where details are fetched and displayed.
4. **Genre/Type Pages:**  
   Clicking a genre/type navigates to a filtered list.
5. **API:**  
   All anime data is fetched from [Jikan API](https://jikan.moe/).

---

## ⚠️ Common Issues

- **Cannot GET /Homapage/anime-details.html:**  
  Make sure your links point to the correct file path (`anime-details.html` in the root, not in a subfolder).
- **Menu Overlap:**  
  The burger menu uses a fixed overlay and disables background scroll when open.

---

## 📝 How to Run

1. Clone or download the repository.
2. Open `Homepage.html` in your browser.
3. Make sure all files are in the correct locations as shown above.
4. No server is required (unless you want to avoid CORS issues with the API).

---

## 📌 Notes

- All content is streamed from external sources; no files are saved on the server.
- For best results, use a modern browser.

---

## 👨‍💻 Author

Shioya_86
2025
