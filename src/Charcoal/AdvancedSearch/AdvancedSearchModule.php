<?php

namespace Charcoal\AdvancedSearch;

// from charcoal-app
use Charcoal\App\Module\AbstractModule;

/**
 * Advanced Search Module
 */
class AdvancedSearchModule extends AbstractModule
{
    public const ADMIN_CONFIG = 'vendor/locomotivemtl/charcoal-contrib-advanced-search/config/admin.json';
    public const APP_CONFIG = 'vendor/locomotivemtl/charcoal-contrib-advanced-search/config/config.json';

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
