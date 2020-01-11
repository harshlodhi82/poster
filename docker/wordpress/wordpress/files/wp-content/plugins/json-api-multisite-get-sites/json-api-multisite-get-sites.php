<?php
/*
Plugin Name: Json Api Multisite Get Sites
Description: 
Version: 1.0.0
*/

add_action('rest_api_init', 'custom_multisite_register_get_sites');

function custom_multisite_register_get_sites()
{
    register_rest_route('wp/v2', 'sites', array(
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'custom_multisite_get_sites'
    ));
}

function custom_multisite_get_sites()
{
    $sites = get_sites(array(
        'public'    => 1,   // only want the sites marked Public
        'archived'  => 0,
        'mature'    => 0,
        'spam'    => 0,
        'deleted'   => 0,
    ));

    $result = array();
    foreach ($sites as $s) {
        array_push($result, str_replace('/', '', $s->path));
    }

    return $result;
}