<?php
/**
* Plugin Name: Remove Site Id From Upload Path
* Description: Required for multisite reverse proxy, otherwise images are uploaded to uploads/sites/1/ instead of /uploads.
* Version: 1.0
**/

add_filter('upload_dir', 'custom_multisite_remove_site_id_from_upload_path');
function custom_multisite_remove_site_id_from_upload_path($uploads) {
  if (defined('MULTISITE')) {
    $uploads['url'] = preg_replace('/\/sites\/[0-9]+/', '', $uploads['url']);
    $uploads['path'] = preg_replace('/\/sites\/[0-9]+/', '', $uploads['path']);
    $uploads['basedir'] = preg_replace('/\/sites\/[0-9]+/', '', $uploads['basedir']);
    $uploads['baseurl'] = preg_replace('/\/sites\/[0-9]+/', '', $uploads['baseurl']);
  }
  return $uploads;
}

?>