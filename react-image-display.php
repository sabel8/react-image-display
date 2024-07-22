<?php
/*
Plugin Name: React Image Display
Description: A WordPress plugin that uses React to display images.
Version: 1.0
Author: Abel Sarandi
*/

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}
// Function to get the correct asset URL from the Vite manifest
function rid_get_asset_url()
{
    $manifest_path = plugin_dir_path(__FILE__) . 'dist/.vite/manifest.json';
    if (!file_exists($manifest_path)) {
        return '';
    }

    $manifest = json_decode(file_get_contents($manifest_path), true);
    return isset($manifest["index.html"]) ? plugin_dir_url(__FILE__) . 'dist/' . $manifest["index.html"]['file'] : '';
}
function rid_get_css_url()
{
    $manifest_path = plugin_dir_path(__FILE__) . 'dist/.vite/manifest.json';
    if (!file_exists($manifest_path)) {
        return '';
    }

    $manifest = json_decode(file_get_contents($manifest_path), true);
    return isset($manifest["index.html"]) ? plugin_dir_url(__FILE__) . 'dist/' . $manifest["index.html"]['css'][0] : '';
}

function rid_enqueue_scripts()
{
    $main_js = rid_get_asset_url();
    if ($main_js) {
        wp_enqueue_script(
            'react-image-display',
            $main_js,
            array(),
            null, // No need for versioning since the filename is hashed
            true
        );
    }
}
function rid_enqueue_styles()
{
    $main_css = rid_get_css_url();
    if ($main_css) {
        wp_enqueue_style('react-image-display', $main_css, []);
    }
}

add_action('wp_enqueue_scripts', 'rid_enqueue_scripts');
add_action('wp_enqueue_scripts', 'rid_enqueue_styles');

$galleries = array();

// Create a shortcode to display the React app
function rid_display_react_app($atts)
{
    $atts = shortcode_atts(
        array(
            'images' => '', // Comma-separated list of image URLs
            'elementid' => 'react-image-display',
            'rowheight' => '400',
        ),
        $atts,
        'react_image_display'
    );

    $images = array_map('trim', explode(',', $atts['images']));

    global $galleries;

    $galleries[] = array(
        'images' => $images,
        'elementid' => $atts['elementid'],
        'rowheight' => $atts['rowheight'],
    );

    wp_localize_script('react-image-display', 'rid_params', array(
        'galleries' => $galleries,
    ));

    return '<div id="' . $atts['elementid'] . '"></div>';
}
add_shortcode('react_image_display', 'rid_display_react_app');

function add_example_images($images)
{
    $images[] = '2024/02/DSC_0883-2-scaled.jpg';
    $images[] = '2024/02/3-1-scaled.jpg';
    return $images;
}
add_filter('react-image-display', 'add_example_images');
