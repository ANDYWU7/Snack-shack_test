# The Snack Shack

A static student snack-club website using HTML, CSS, and vanilla JavaScript. Open `dist/index.html` in a browser or serve `dist` with a static HTTP server. No build or dependencies are required.

For GitHub Pages, publish from the `main` branch and `/ (root)` folder. The root `index.html` opens the website in `dist/`. The `.nojekyll` file keeps Pages from processing this plain static site as a Jekyll project.

The menu and prices are explicitly samples. Update `snacks` in `dist/app.js`, remove the sample labels when approved, and set the pickup location and schedule in `dist/index.html`. The order list exists in memory on the page and resets on reload. It does not send orders, reserve stock, or take payments; students show it in person.

Food photography: [cookies by Imad 786](https://unsplash.com/photos/5So4kc3Ocus), [chips by Esperanza Doronila](https://unsplash.com/photos/L1ltnmBlA14), and [brownies by Suchandra Varma](https://unsplash.com/photos/Ized6jKLKm8), via Unsplash. Fonts are served by Google Fonts with local fallbacks.

Verified in Microsoft Edge at desktop and 390px mobile widths: image loading, add/remove quantities, accurate totals, pickup view, Escape dismissal, and no horizontal overflow. Native WebMCP runtime validation was unavailable; the optional integration is feature-detected.
