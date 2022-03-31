<?php

namespace Charcoal\AdvancedSearch\Widget;

use Pimple\Container;

/**
 * Class Advanced Search Widget
 */
class AdvancedSearchWidget extends AbstractAdvancedSearchWidget
{
    private $layout;
    private $groups = [];
    private $groupsWithFilters = [];

    /**
     * @return string
     */
    public function type()
    {
        return 'charcoal/advanced-search/widget/advanced-search';
    }

    public function setLayout($layout)
    {
        $this->layout = $layout;
        return $this;
    }

    /**
     * @return array
     */
    public function layout()
    {
        return $this->layout;
    }

    public function setGroups($groups)
    {
        foreach ($groups as $key => $group) {
            $groups[$key]['group_key'] = $key;
        }

        $this->groups = $groups;
        return $this;
    }

    public function groups()
    {
        return $this->groups;
    }

    public function groupsWithFilters()
    {
        if (empty($this->groupsWithFilters)) {
            $groups = $this->processGroups($this->groups(), $this->layout());
            $this->groupsWithFilters = $groups;
        }

        return $this->groupsWithFilters;
    }
}
