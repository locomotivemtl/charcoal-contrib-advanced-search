<?php

namespace Charcoal\SearchFilter;

// from charcoal-app
use Charcoal\App\Module\AbstractModule;

/**
 * Search Filter Module
 */
class SearchFilterModule extends AbstractModule
{
    public const ADMIN_CONFIG = 'vendor/locomotivemtl/charcoal-contrib-search-filter/config/admin.json';
    public const APP_CONFIG = 'vendor/locomotivemtl/charcoal-contrib-search-filter/config/config.json';

    /**
     * Setup the module's dependencies.
     *
     * @return AbstractModule
     */
    public function setup()
    {
        $container = $this->app()->getContainer();

        // Define ServiceProviders and Config if needed.

        return $this;
    }
}
