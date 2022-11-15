<?php

namespace Charcoal\AdvancedSearch\Widget;

use Psr\Log\InvalidArgumentException;
use Pimple\Container;
use RuntimeException;
use Generator;

// from charcoal-admin
use Charcoal\Admin\AdminWidget;
use Charcoal\Admin\Support\HttpAwareTrait;
use Charcoal\Admin\Widget\FormPropertyWidget;

// from charcoal-factory
use Charcoal\Factory\FactoryInterface;

// from charcoal-core
use Charcoal\Model\ModelInterface;

// from charcoal-ui
use Charcoal\Ui\Layout\LayoutAwareInterface;
use Charcoal\Ui\Layout\LayoutAwareTrait;

// from charcoal-loader
use Charcoal\Loader\CollectionLoaderAwareTrait;

/**
 * Class Abstract Advanced Search Widget
 */
abstract class AbstractAdvancedSearchWidget extends AdminWidget implements
    LayoutAwareInterface
{
    use HttpAwareTrait;
    use LayoutAwareTrait;
    use CollectionLoaderAwareTrait;

    /** @var PropertyInterface[]|array $propertyFilters */
    private $propertyFilters;

    /** @var string $objType */
    protected $objType;

    /** @var ModelInterface $proto */
    private $proto;

    /** @var FactoryInterface $widgetFactory */
    private $widgetFactory;

    /** @var FactoryInterface $PropertyInputFactory */
    private $PropertyInputFactory;

    /** @var FactoryInterface $propertyFactory */
    private $propertyFactory;

    /** @var array $propertiesOptions */
    private $propertiesOptions = [];

    /** @var string $rowCountLabel */
    private $rowCountLabel;

    /** @var string $rowCountLabelPlural */
    private $rowCountLabelPlural;

    /** @var array $sortOptions */
    private $sortOptionsGenerated;

    /**
     * @param Container $container DI Container.
     * @return void
     */
    public function setDependencies(Container $container)
    {
        parent::setDependencies($container);

        // Satisfies HttpAwareTrait dependencies
        $this->setHttpRequest($container['request']);

        /** Satisfies {@see \Charcoal\Ui\Layout\LayoutAwareInterface} */
        $this->setLayoutBuilder($container['layout/builder']);

        $this->setWidgetFactory($container['widget/factory']);
        $this->setModelFactory($container['model/factory']);
        $this->setCollectionLoader($container['model/collection/loader']);
        $this->setPropertyInputFactory($container['property/input/factory']);
        $this->propertyFactory = $container['property/factory'];
    }

    /**
     * @param array $data The widget data.
     * @return self
     */
    public function setData(array $data)
    {
        parent::setData($data);

        $this->mergeDataSources($data);

        return $this;
    }

    /**
     * Retrieve the default data sources (when setting data on an entity).
     *
     * @return string[]
     */
    protected function defaultDataSources()
    {
        return [
            static::DATA_SOURCE_REQUEST,
            static::DATA_SOURCE_OBJECT,
        ];
    }

    /**
     * Retrieve the accepted metadata from the current request.
     *
     * @return array
     */
    public function acceptedRequestData()
    {
        return [
            'obj_type',
        ];
    }

    /**
     * Fetch metadata from the current request.
     *
     * @return array
     */
    public function dataFromRequest()
    {
        return $this->httpRequest()->getParams($this->acceptedRequestData());
    }

    /**
     * Retrieve the widget's data options for JavaScript components.
     *
     * @return array
     */
    public function widgetDataForJs()
    {
        return [
            'properties_options' => $this->propertiesOptions(),
        ];
    }

    /**
     * @param  array|null  $data  Optional. The form property data to set.
     * @return FormPropertyWidget
     */
    public function createFormProperty(array $data = null)
    {
        $p = $this->widgetFactory()->create(FormPropertyWidget::class);
        if ($data !== null) {
            $p->setData($data);
        }

        return $p;
    }

    /**
     * @param boolean $reload If true, reload will be forced.
     * @throws InvalidArgumentException If the object type is not defined / can not create prototype.
     * @return object
     */
    protected function proto($reload = false)
    {
        if ($this->proto === null || $reload) {
            $objType = $this->objType();
            if ($objType === null) {
                throw new InvalidArgumentException(sprintf(
                    '%s Can not create an object prototype: object type is null.',
                    get_class($this)
                ));
            }
            $this->proto = $this->modelFactory()->create($objType);
        }

        return $this->proto;
    }

    /**
     * @return mixed
     */
    public function collectionIdent()
    {
        return $this->httpRequest()->getQueryParams()['collection_ident'] ?? null;
    }

    private function setPropertyInputFactory(FactoryInterface $factory)
    {
        $this->PropertyInputFactory = $factory;
    }

    /**
     * Retrieve the widget factory.
     *
     * @throws RuntimeException If the widget factory was not previously set.
     * @return FactoryInterface
     */
    protected function propertyInputFactory()
    {
        if ($this->PropertyInputFactory === null) {
            throw new RuntimeException(sprintf(
                'Property Input Factory is not defined for "%s"',
                get_class($this)
            ));
        }

        return $this->PropertyInputFactory;
    }

    /**
     * Process filter groups.
     *
     * @param array $groups
     * @param array $layout
     * @return array
     */
    public function processGroups(array $groups, array $layout = [])
    {
        $properties_options = [];
        $groupLayout = null;

        if (!empty($layout) && is_array($layout)) {
            $groupLayout = $this->layoutBuilder->build($layout);
        }

        if (!empty($groups)) {
            foreach ($groups as $groupKey => $group) {
                $filters = [];
                $group['filters_options'] = $group['filters_options'] ?? [];
                $filterLayout = null;

                if (!empty($group['layout']) && is_array($group['layout'])) {
                    $filterLayout = $this->layoutBuilder->build($group['layout']);
                    $groups[$groupKey]['layout'] = $filterLayout;
                }

                // Set group layout + label
                if ($groupLayout) {
                    $groups[$groupKey]['groupLayout'] = $groupLayout;
                }
                $groups[$groupKey]['label'] = $group['label'] ?? '';

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
                    $filters = iterator_to_array($this->processFilters(
                        $group['filters'],
                        $group['filters_options']
                    ));

                    foreach ($filters as $propertyIdent => $propertyMetadata) {
                        $data = $propertyMetadata->propertyData();
                        $propertyIdent = $data['property_ident'] ?? $propertyIdent;

                        if (!empty($data['choices']) && !is_array($data['choices'])) {
                            $data['choices'] = iterator_to_array($data['choices']);
                        }
                        $properties_options[$propertyIdent] = $data;
                    }
                }

                $groups[$groupKey]['filters'] = [];

                if (!empty($filters)) {
                    $groups[$groupKey]['filters'] = $this->processFilters(
                        $group['filters'],
                        $group['filters_options']
                    );
                }
            }
        }

        $this->addPropertiesOptions($properties_options);

        return $groups;
    }

    /**
     * Process filters.
     *
     * @param array $filters
     * @param array $options
     * @return Generator
     */
    public function processFilters(array $filters, array $options = [])
    {
        foreach ($filters as $propertyKey => $propertyMetadata) {
            if (is_string($propertyMetadata)) {
                $propertyKey = $propertyMetadata;
                $propertyMetadata = $options[$propertyKey] ?? [];
                $filters[$propertyKey] = $propertyMetadata;
            }

            if (!empty($propertyMetadata['choices_source'])) {
                $propertyMetadata['choices'] = $this->choicesSourceToChoices($propertyMetadata);

                // Get table
                $propertyMetadata['table'] = $this->modelFactory()
                    ->create($propertyMetadata['choices_source']['model'])
                    ->source()
                    ->table();
            }

            $prop = $this->createFormProperty();
            $propertyMetadata['property_type'] = $propertyMetadata['input_type'];
            $prop->setData($propertyMetadata);

            $propertyIdent = $propertyMetadata['property_type'] ?? $propertyIdent ?? $propertyKey;
            if ($propertyIdent && $this->propertyFactory->isResolvable($propertyIdent)) {
                $prop->setProperty($this->propertyFactory->create($propertyIdent));
                $prop->mergePropertyData(['ident' => $propertyIdent]);
            }

            $prop->setPropertyIdent($propertyIdent);

            if (!empty($options[$propertyKey]['table'])) {
                $table = $options[$propertyKey]['table'];

                // If table is a resolvable model
                if ($this->modelFactory()->isResolvable($table)) {
                    $table = ($this->modelFactory()->create($table)->source()->table() ?? $table);
                    $options[$propertyKey]['table'] = $table;
                }

                $prop->mergePropertyData(['table' => $table]);
            }

            if (!empty($options[$propertyKey])) {
                $propertyOptions = $options[$propertyKey];

                if (is_array($propertyOptions)) {
                    $prop->mergePropertyData($propertyOptions);
                }
            }

            yield $propertyKey => $prop;
        }
    }

    /**
     * Convert choices json to objects.
     *
     * @param array $propertyMeta
     * @return Generator
     */
    private function choicesSourceToChoices($propertyMeta = [])
    {
        if (empty($propertyMeta['choices']) && !empty($propertyMeta['choices_source'])) {
            $source = $propertyMeta['choices_source'];
            // Load choices from db
            if ($source['type'] === 'property') {
                $model = $this->modelFactory()->create($source['model']);
                $properties = iterator_to_array($model->properties());
                $choices = $properties[$source['property_ident']]['choices'];

                return is_array($choices) ? $choices : [];
            } elseif ($source['type'] === 'database') {
                $model = $this->modelFactory()->create($source['model']);
                $collection = $this->collectionLoader()->reset()->setModel($model);
                $input = $this->propertyInputFactory()->create($propertyMeta['input_type']);

                if (!empty($propertyMeta['choice_obj_map'])) {
                    $input->setChoiceObjMap($propertyMeta['choice_obj_map']);
                }

                if (!empty($source['filters'])) {
                    foreach ($source['filters'] as $filter) {
                        $collection->addFilter($filter);
                    }
                }

                $modelCollection = $collection->load();

                $choices = array_map(function ($item) use ($input) {
                    return $input->mapObjToChoice($item);
                }, $modelCollection->values());

                return $choices;
            } else {
                return [];
            }
        }
    }

    /**
     * Get sorting options.
     *
     * @return array
     */
    public function sortOptions()
    {
        if (empty($this->sortOptionsGenerated)) {
            $properties = [];

            foreach ($this->sortOptions as $key => $value) {
                $sortOption = is_string($key) ? $key : $value;
                $property = $this->proto()->p($sortOption);

                if ($property) {
                    $propertyLabel = $this->translator()->translate($property->getLabel());
                    $properties[] = [
                        'property'  => $sortOption,
                        'label'     => $propertyLabel,
                        'direction' => ($value['direction'] ?? 'ASC'),
                    ];
                }
            }
            $this->sortOptionsGenerated = $properties;
        }

        return $this->sortOptionsGenerated;
    }

    public function hasSortOptions()
    {
        return !empty($this->sortOptions()) ? ['sortOptions' => $this->sortOptions()] : null;
    }

    // GETTERS AND SETTERS
    // ==========================================================================

    /**
     * @return array|PropertyInterface[]
     */
    public function propertyFilters()
    {
        return $this->propertyFilters;
    }

    /**
     * @param array|PropertyInterface[] $propertyFilters PropertyFilters for JobFiltersWidget.
     * @return self
     */
    public function setPropertyFilters($propertyFilters)
    {
        $this->propertyFilters = $propertyFilters;

        return $this;
    }

    /**
     * @return string
     */
    public function objType()
    {
        return $this->objType;
    }

    /**
     * @param string $objType ObjType for JobFiltersWidget.
     * @return self
     */
    public function setObjType($objType)
    {
        $this->objType = $objType;

        return $this;
    }

    /**
     * Retrieve the widget factory.
     *
     * @throws RuntimeException If the widget factory was not previously set.
     * @return FactoryInterface
     */
    protected function widgetFactory()
    {
        if ($this->widgetFactory === null) {
            throw new RuntimeException(sprintf(
                'Widget Factory is not defined for "%s"',
                get_class($this)
            ));
        }

        return $this->widgetFactory;
    }

    /**
     * Set an widget factory.
     *
     * @param FactoryInterface $factory The factory to create widgets.
     * @return void
     */
    private function setWidgetFactory(FactoryInterface $factory)
    {
        $this->widgetFactory = $factory;
    }

    /**
     * @param array $properties The options to customize the group properties.
     * @return self
     */
    public function setPropertiesOptions(array $properties)
    {
        $this->propertiesOptions = $properties;

        return $this;
    }

    /**
     * @param array $properties The options to customize the group properties.
     * @return self
     */
    public function addPropertiesOptions(array $properties)
    {
        $this->propertiesOptions = array_merge(
            $this->propertiesOptions,
            $properties
        );

        return $this;
    }

    /**
     * @return array
     */
    public function propertiesOptions()
    {
        return $this->propertiesOptions;
    }

    /**
     * @return array
     */
    public function collectionTable()
    {
        if (empty($this->collectionTable)) {
            $this->collectionTable = $this->modelFactory()->create($this->objType())
                ->source()
                ->table();
        }

        return $this->collectionTable;
    }

    public function setRowCountLabel($rowCountLabel)
    {
        $this->rowCountLabel = $this->translator()->translate($rowCountLabel);
        return $this;
    }

    public function rowCountLabel()
    {
        return $this->rowCountLabel;
    }

    public function setRowCountLabelPlural($rowCountLabelPlural)
    {
        $this->rowCountLabelPlural = $this->translator()->translate($rowCountLabelPlural);
        return $this;
    }

    public function rowCountLabelPlural()
    {
        return $this->rowCountLabelPlural;
    }
}
