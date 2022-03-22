<?php

namespace Charcoal\AdvancedSearch\Widget;

use Generator;
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

        $properties_options = [];
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
            $properties_options = [];

            foreach ($tabs as $tabKey => $tab) {
                $groupLayout = null;
                if (!empty($tab['layout']) && is_array($tab['layout'])) {
                    $groupLayout = $this->layoutBuilder->build($tab['layout']);
                    $tabs[$tabKey]['layout'] = $groupLayout;
                }

                if (!empty($tab['groups'])) {
                    foreach ($tab['groups'] as $groupKey => $group) {
                        $group['filters_options'] = $group['filters_options'] ?? [];

                        $filterLayout = null;

                        if (!empty($group['layout']) && is_array($group['layout'])) {
                            $filterLayout = $this->layoutBuilder->build($group['layout']);
                            $tabs[$tabKey]['groups'][$groupKey]['layout'] = $filterLayout;
                        }

                        if ($groupLayout) {
                            $tabs[$tabKey]['groups'][$groupKey]['groupLayout'] = $groupLayout;
                        }
                        $tabs[$tabKey]['groups'][$groupKey]['label'] = $group['label'] ?? '';
                        $filters = [];

                        // Process and set tab's filters
                        if (!empty($group['filters'])) {
                            if ($filterLayout) {
                                foreach ($group['filters'] as $groupFilterKey => $groupFilter) {
                                    if (is_string($groupFilter)) {
                                        $groupFilterKey = $groupFilter;
                                    }
                                    $group['filters_options'][$groupFilterKey]['layout'] = $filterLayout;
                                }
                            }
                            $filters = iterator_to_array($this->processFilters($group['filters'], $group['filters_options']));

                            foreach ($filters as $propertyIdent => $propertyMetadata) {
                                $data = $propertyMetadata->propertyData();
                                $propertyIdent = $data['property_ident'] ?? $propertyIdent;

                                if (!empty($data['choices'])) {
                                    $data['choices'] = iterator_to_array($data['choices']);
                                }
                                $properties_options[$propertyIdent] = $data;
                            }
                        }

                        if (!empty($filters)) {
                            $tabs[$tabKey]['groups'][$groupKey]['filters'] = $this->processFilters($group['filters'], $group['filters_options']);
                        } else {
                            $tabs[$tabKey]['groups'][$groupKey]['filters'] = [];
                        }
                    }
                }
            }

            $this->setPropertiesOptions($properties_options);

            $this->tabsWithFilters = $tabs;
        }

        return $this->tabsWithFilters;
    }
}
