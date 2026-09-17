# 📰 NewsHub

A single-page news reader built with plain HTML, CSS, and JavaScript — no frameworks, no backend, no build tools. It fetches live articles directly from a public API and displays them in a responsive, searchable, filterable grid.

## Live Demo

Open `index.html` directly in your browser — no server required.

## Features

- **Live data** — fetches real, current articles from the Spaceflight News API
- **Source filter** — chips built automatically from the loaded articles
- **Live search** — filters titles and summaries as you type
- **Article modal** — click a card for a summary, then jump to the full story
- **Dark mode** — theme choice saved in the browser with `localStorage`
- **Fully responsive** — works on desktop, tablet, and mobile

## Tech Stack

- HTML5
- CSS3 (custom properties for theming, CSS Grid for layout)
- Vanilla JavaScript (fetch API, async/await, event delegation)
- [Spaceflight News API](https://api.spaceflightnewsapi.net/) — free, no API key required

## Project Structure
news-app/
├── index.html # page structure: header, grid, modal
├── css/
│ └── style.css # styling + light/dark theme
└── js/
└── app.js # fetch, normalize, render, events


## How It Works

1. On load, the app fetches the latest articles from the API.
2. Each article is normalized into a consistent shape (`title`, `summary`, `source`, `image`, `date`, `url`).
3. Articles are filtered live based on the search box and the active source chip.
4. Clicking a card opens a modal with the full summary and a link to the original article.
5. The theme toggle switches a `data-theme` attribute on the page, and CSS variables handle the color swap. The choice is saved to `localStorage`.

## Running Locally

No installation needed:

```bash
git clone https://github.com/umama08/newshub.git
cd newshub
```

Then just open `index.html` in your browser.

## Ideas for Future Improvements

- Pagination using the API's `offset` parameter
- Server-side search using the API's `search` parameter
- Cache the last API response in `localStorage` for instant load
- Bookmark/save-for-later feature

## Author

**Umama Ahmed**
[GitHub](https://github.com/umama08) · [LinkedIn](https://linkedin.com/in/umamaahmed0100)
