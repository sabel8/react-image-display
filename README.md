# react-image-display 🖼️⚛️

`react-image-display` is a WordPress plugin that displays image galleries in a justified manner. The extension is made for [www.leventehegedus.com](). It supports setting a row height. You need to define unique gallery IDs if you are planning to display more than one galleries on one page.

## Usage

0. Install all dependencies using `npm install`
1. Run `npm build`
2. In a File Explorer, select the following items.
   1. `react-image-display.php`
   2. `dist` folder
3. Make a `zip` file from these items.
4. Upload that file as a new plugin to your WordPress site.
5. Use in any article with the following shortcode:

```
[react-image-display images='www.link.to/image/1, www.link.to/image/2' elementid='my-gallery' rowheight='250']
```

## Compatibility with image-blurhash

You can use [image-blurhash](https://wordpress.com/plugins/image-blur) to display blurred version of images before loading the true image. Just simply download and activate the plugin, the rest should be working automatically. Otherwise, the shortode will just render grey boxes during loading.
