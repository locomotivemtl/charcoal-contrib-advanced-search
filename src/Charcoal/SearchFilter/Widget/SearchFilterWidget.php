<?php

namespace Charcoal\SearchFilter\Widget;

use Generator;
use Pimple\Container;

/**
 * Class Search Filter Widget
 */
class SearchFilterWidget extends AbstractSearchFilterWidget
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
        return 'charcoal/search-filter/widget/search-filter';
    }

    /**
     * @return Generator
     */
    public function filters()
    {
        $filters = $this->processFilters($this->filters, $this->filters_options ?? null);

        return $filters;
    }
}
