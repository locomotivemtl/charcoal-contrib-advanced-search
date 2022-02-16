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

            foreach ($tabs as $key => $value) {
                // Process and set tab's filters
                $filters = iterator_to_array($this->processFilters($value['filters'], $value['filters_options'] ?? null));

                foreach ($filters as $propertyIdent => $propertyMetadata) {
                    $data = $propertyMetadata->propertyData();
                    if (!empty($data['choices'])) {
                        $data['choices'] = iterator_to_array($data['choices']);
                    }
                    $properties_options[$data['property_ident']] = $data;
                }

                if (!empty($filters)) {
                    $tabs[$key]['filters'] = $this->processFilters($value['filters'], $value['filters_options'] ?? null);
                } else {
                    $tabs[$key]['filters'] = [];
                }

                // Set layout for filters within tab
                if (!empty($value['layout']) && is_array($value['layout'])) {
                    $tabs[$key]['layout'] = $this->layoutBuilder->build($value['layout']);
                }
            }

            $this->setPropertiesOptions($properties_options);

            //$tabs['filters'] = iterator_to_array($tabs['filters']);
            $this->tabsWithFilters = $tabs;
        }

        return $this->tabsWithFilters;
    }
}
