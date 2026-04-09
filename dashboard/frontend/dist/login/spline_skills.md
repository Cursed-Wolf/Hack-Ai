# Spline 3D Integration Skills

This document contains instructions for integrating 3D scenes from Spline into front-end HTML/CSS/JS projects using the `<spline-viewer>` web component.

## 1. Exporting from Spline
1. Open your 3D project in the [Spline Editor](https://app.spline.design/).
2. Click the **Export** button in the top toolbar.
3. Select the **Viewer** (or Web Component) tab.
4. Customize settings like zoom, pan, hover effects, and background color (set background color to transparent inside Spline if you want it to overlay your existing web background).
5. Click **Copy Embed Code**. This will give you the script layer and the `<spline-viewer>` HTML tag.

## 2. Embedding in HTML
Include the `<script>` tag provided by Spline at the bottom of your `<body>` or inside the `<head>`, and place the `<spline-viewer>` anywhere you want the 3D element to appear.

Example:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Spline App</title>
</head>
<body>
    <!-- Assuming your Spline component is a background -->
    <div class="spline-background">
        <!-- The Spline Viewer Component -->
        <script type="module" src="https://unpkg.com/@splinetool/viewer@1.0.9/build/spline-viewer.js"></script>
        <spline-viewer url="https://prod.spline.design/YOUR_SCENE_URL/scene.splinecode"></spline-viewer>
    </div>

    <!-- The rest of your content -->
    <div class="content">
        <h1>Welcome</h1>
    </div>
</body>
</html>
```

## 3. Styling the Viewer with CSS
`<spline-viewer>` is a native custom element, which means you can style it like any other `<div>`. 

If you want the Spline 3D object to act as a full-screen background behind your UI:

```css
.spline-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1; /* Puts it behind your content */
    overflow: hidden;
}

spline-viewer {
    width: 100%;
    height: 100%;
}
```

## Quick Tips
* **Background Customization:** If your `<spline-viewer>` has an unwanted solid background color blocking your website, edit the "Background Color" property in Spline's editor directly, or append custom attributes inside the HTML tag depending on the library version.
* **Interactivity:** You can toggle mouse-following interactions, click events, and wheel scrolling from within the Export Settings menu in the Spline Editor before copying the link.
* **Performance:** `<spline-viewer>` comes with built-in lazy-loading and optimizations, but complex models with too many active particles, physics, or high-res textures may impact mobile device performance. Test carefully!
