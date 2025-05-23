<?php
/*
Plugin Name: React Image Display
Description: A WordPress plugin that uses React to display images.
Version: 1.1
Author: Abel Sarandi
*/

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

$galleries = [];

// Create a shortcode to display the React app
add_shortcode('react_image_display', function ($atts) {
    $atts = shortcode_atts(
        [
            'images' => '', // Comma-separated list of image URLs
            'elementid' => 'react-image-display',
            'rowheight' => '400',
        ],
        $atts,
        'react_image_display'
    );

    $imagesWithResponsiveData = array_map(function ($image) {
        $imagePath = trim($image);
        $attachmentId = attachment_url_to_postid($imagePath);
        if (!$attachmentId) {
            // try the scaled version of the image
            $parts = explode(".", $imagePath);
            $scaledPath = $parts[0] . "-scaled." . $parts[1];
            $attachmentId = attachment_url_to_postid($scaledPath);
        }
        $imageSrc = wp_get_attachment_image_src($attachmentId, 'large');

        if (!$imageSrc) {
            error_log("Error: Image not found ($imagePath). Please check the image URL.");
            if ($scaledPath) {
                error_log("also tried: $scaledPath");
            }
        }

        return [
            "src" => $imageSrc[0],
            "width" => $imageSrc[1],
            "height" => $imageSrc[2],
            "srcset" => wp_get_attachment_image_srcset($attachmentId, 'large'),
            "sizes" => wp_get_attachment_image_sizes($attachmentId, 'large'),
            "blurhash" => get_post_meta($attachmentId, "image_blur_large", true),
        ];
    }, explode(',', $atts['images']));

    global $galleries;

    $galleries[] = [
        'images' => $imagesWithResponsiveData,
        'elementid' => $atts['elementid'],
        'rowheight' => $atts['rowheight'],
    ];

    rid_enqueue_files();

    wp_localize_script('react-image-display', 'rid_params', ['galleries' => $galleries]);

    return "<div id=" . $atts['elementid'] . "></div>";
});

function rid_enqueue_files()
{
    $manifest_path = plugin_dir_path(__FILE__) . 'dist/.vite/manifest.json';
    if (!file_exists($manifest_path)) {
        wp_die("Error: Manifest file not found. Please check the plugin installation.");
    }

    $manifest = json_decode(file_get_contents($manifest_path), true);
    if (!isset($manifest["index.html"])) {
        wp_die("Error: Manifest file is not in the expected format. Please check the plugin installation.");
    }
    $css = plugin_dir_url(__FILE__) . 'dist/' . $manifest["index.html"]["css"][0];
    $js = plugin_dir_url(__FILE__) . 'dist/' . $manifest["index.html"]["file"];

    wp_enqueue_script('react-image-display', $js, []);
    wp_enqueue_style('react-image-display', $css, []);
}
