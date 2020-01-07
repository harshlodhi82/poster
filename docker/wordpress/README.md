## New install

- delete db and files folders and docker-compose up
- add (only) this line in wp-config after `That's all, stop editing!`
```
define( 'WP_ALLOW_MULTISITE', true );
```
- delete all plugins
- login and go to `tools > network set up` and follow instructions to install (including more wp-config modification)

## Change domain/ip to other than localhost

- edit wp-config `define('DOMAIN_CURRENT_SITE', 'localhost');`
- login to phpmyadmin and edit tables `wp_blogs` and `wp_options` (of each site)
- possibly (seems to work without) edit tables `wp_site`, `wp_sitemeta`

## Change folder permissions

- in wp root folder give apache full ownership with `bin/chmod`

## Add plugins

- add plugins from ./plugins, then `bin/chmod`
