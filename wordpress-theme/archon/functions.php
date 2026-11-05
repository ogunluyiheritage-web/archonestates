<?php
function archon_theme_setup() {
  add_theme_support('title-tag');
  add_theme_support('post-thumbnails');
  register_nav_menus(array('primary' => __('Primary Menu', 'archon')));
}
add_action('after_setup_theme', 'archon_theme_setup');
function archon_assets() {
  wp_enqueue_style('archon-style', get_stylesheet_uri(), array(), '1.0.0');
  wp_enqueue_script('archon-script', get_template_directory_uri() . '/assets/archon.js', array(), '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'archon_assets');
