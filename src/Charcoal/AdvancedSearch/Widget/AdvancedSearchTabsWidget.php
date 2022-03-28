<?php

namespace Charcoal\AdvancedSearch\Widget;

use Pimple\Container;

/**
 * Class Advanced Search Tabs Widget
 */
class AdvancedSearchTabsWidget extends AbstractAdvancedSearchWidget
{
    private $tabs;
    private $tabsWithFilters = [];

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
        return 'charcoal/advanced-search/widget/advanced-search-tabs';
    }

    public function setTabs($tabs)
    {
        foreach ($tabs as $key => $tab) {
            $tabs[$key]['tab_key'] = $key;
        }

        $this->tabs = $tabs;
        return $this;
    }

    public function tabs()
    {
        return $this->tabs;
    }

    public function tabsWithFilters()
    {
        if (empty($this->tabsWithFilters)) {
            $tabs = $this->tabs();

            foreach ($tabs as $tabKey => $tab) {
                if (!empty($tab['groups'])) {
                    $tabs[$tabKey]['groups'] = $this->processGroups($tab['groups'], $tab['layout']);
                } else {
                    $tabs[$tabKey]['groups'] = [];
                }
            }

            $this->tabsWithFilters = $tabs;
        }

        return $this->tabsWithFilters;
    }
}
