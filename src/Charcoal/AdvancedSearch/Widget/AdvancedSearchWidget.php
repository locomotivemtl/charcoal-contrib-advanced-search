<?php

namespace Charcoal\AdvancedSearch\Widget;

use Generator;
use Pimple\Container;

/**
 * Class Advanced Search Widget
 */
class AdvancedSearchWidget extends AbstractAdvancedSearchWidget
{
    /**
     * @param Container $container DI Container.
     * @return void
     */
    public function setDependencies(Container $container)
    {
        parent::setDependencies($container);
    }

    /**
     * @return string
     */
    public function type()
    {
        return 'charcoal/advanced-search/widget/advanced-search';
    }

    /**
     * @return Generator
     */
    public function filters()
    {
        $filters = [];

        if (!empty($this->filters)) {
            $filters = $this->processFilters($this->filters, $this->filters_options ?? null);
        }

        return $filters;
    }
}
