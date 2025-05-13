<?php

namespace Charcoal\AdvancedSearch\Widget;

/**
 * Class Advanced Search Tabs Widget
 */
class AdvancedSearchTabsWidget extends AbstractAdvancedSearchWidget
{
    /** @var array $tabs */
    private $tabs;
    /** @var array $tabsWithFilters */
    private $tabsWithFilters = [];

    /**
     * @return string
     */
    public function type()
    {
        return 'charcoal/advanced-search/widget/advanced-search-tabs';
    }

    public function setTabs($tabs)
    {
        // Support for tabs in admin config
        if (is_string($tabs)) {
            $tabs = $this->adminConfig()->get($tabs);
        }

        if (empty($tabs)) {
            throw new \InvalidArgumentException('Tabs for advanced search widget cannot be empty');
        }

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
