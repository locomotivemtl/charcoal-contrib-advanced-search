<?php

namespace Charcoal\AdvancedSearch\Widget;

use Generator;
use Psr\Log\InvalidArgumentException;
use Pimple\Container;
use RuntimeException;

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

    /** @var FactoryInterface */
    private $widgetFactory;

    /** @var FactoryInterface */
    private $PropertyInputFactory;

    /** @var array $propertiesOptions */
    private $propertiesOptions = [];

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
     * @param array $data Optional. The form property data to set.
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
        $this->propertyInputFactory = $factory;
    }

    /**
     * Retrieve the widget factory.
     *
     * @throws RuntimeException If the widget factory was not previously set.
     * @return FactoryInterface
     */
    protected function propertyInputFactory()
    {
        if ($this->propertyInputFactory === null) {
            throw new RuntimeException(sprintf(
                'Property Input Factory is not defined for "%s"',
                get_class($this)
            ));
        }

        return $this->propertyInputFactory;
    }

    public function processFilters(array $filters, ?array $options = [])
    {
        foreach ($filters as $propertyIdent => $propertyMetadata) {
            if (is_string($propertyMetadata)) {
                $filters[$propertyIdent] = $options[$propertyIdent] ?? null;
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
            $prop->setPropertyIdent($propertyIdent);
            $propertyMetadata['property_type'] = $propertyMetadata['input_type'];
            $prop->setData($propertyMetadata);

            if (!empty($options[$propertyIdent])) {
                $propertyOptions = $options[$propertyIdent];

                if (is_array($propertyOptions)) {
                    $prop->mergePropertyData($propertyOptions);
                }
            }

            yield $propertyIdent => $prop;
        }
    }

    private function choicesSourceToChoices($propertyMeta = [])
    {
        if (empty($propertyMeta['choices']) && !empty($propertyMeta['choices_source'])) {
            $source = $propertyMeta['choices_source'];
            // Load choices from db
            if ($source['type'] == 'property') {
                $model = $this->modelFactory()->create($source['model']);
                $properties = iterator_to_array($model->properties());
                $choices = $properties[$source['property_ident']]['choices'];

                if (is_array($choices)) {
                    foreach ($choices as $choice) {
                        yield $choice;
                    }
                }
            } elseif ($source['type'] == 'database') {
                $model = $this->modelFactory()->create($source['model']);
                $collection = $this->collectionLoader()->reset()->setModel($model);
                $input = $this->propertyInputFactory()->create($propertyMeta['input_type']);

                if (!empty($propertyMeta['choice_obj_map'])) {
                    $input->setChoiceObjMap($propertyMeta['choice_obj_map']);
                }

                if (!empty($source['filters'])) {
                    foreach ($source['filters'] as $filter) {
                        $collection->addFilter($filter['property'], $filter['value']);
                    }
                }

                $modelCollection = $collection->load();
                foreach ($modelCollection as $item) {
                    yield $input->mapObjToChoice($item);
                }
            }
        }
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
}
