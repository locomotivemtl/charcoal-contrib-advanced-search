Charcoal Advanced Search
===============

[![License][badge-license]][charcoal-contrib-advanced-search]
[![Latest Stable Version][badge-version]][charcoal-contrib-advanced-search]
[![Code Quality][badge-scrutinizer]][dev-scrutinizer]
[![Coverage Status][badge-coveralls]][dev-coveralls]
[![Build Status][badge-travis]][dev-travis]

A [Charcoal][charcoal-app] widget for creating tabbed filter interfaces.



## Table of Contents

-   [Installation](#installation)
    -   [Dependencies](#dependencies)
-   [Configuration](#configuration)
-   [Usage](#usage)
-   [Development](#development)
    -  [Assets](#assets)
    -  [API Documentation](#api-documentation)
    -  [Development Dependencies](#development-dependencies)
    -  [Coding Style](#coding-style)
-   [Credits](#credits)
-   [License](#license)



## Installation

The preferred (and only supported) method is with Composer:

```shell
$ composer require locomotivemtl/charcoal-contrib-advanced-search
```



### Dependencies

#### Required

-   [**PHP 5.6+**](https://php.net): _PHP 7_ is recommended.
-   [charcoal-admin][charcoal-admin] ^0.14.2.


## Configuration

Include the advanced-search module in the projects's config file.
This will provide everything needed for [charcoal-contrib-advanced-search] to work properly.
No need for metadata/views/action/routes path etc.

```Json
{
    "modules": {
       "charcoal/advanced-search/advanced-search": {}
    }
}
```


## Usage

[charcoal-contrib-advanced-search] can be used as a dashboard widget to filter all the filterable widgets
included in the template. Define a structure like these ones :point_down: in a dashboard widget to create filters.

### Basic Structure
#### With Tabs
```Json
{
    "advancedSearchNew": {
        "type": "charcoal/advanced-search/widget/advanced-search-tabs",
        "rowCountLabel": "Result",
        "sort_options": {
            "id": { "direction": "ASC" },
            "name": { "direction": "ASC" },
            "registrationDate": { "direction": "DESC" }
        },
        "tabs": [
            {},
            {}
        ]
    },
    "table": {
        "obj_type": "path/to/model",
        "type": "charcoal/admin/widget/table",
        "show_table_header": false
    }
}
```

#### Options
| Key               | Values | Default  | Description                                                   |
|:------------------|:------:|:--------:|---------------------------------------------------------------|
| `row_count_label` | String | "Result" | Non-plural label to use for the heading count. ex. "User" will display as "24 Users" |
| `sort_options`    | Array  |   n/a    | (optional) Defines sorting options                                       |
| `tabs`          | Array  |   n/a    | Defines filter [tabs](#tab-example) to use         |

#### Without Tabs
If tabs aren't needed, the widget type `charcoal/advanced-search/widget/advanced-search` can be used.

Instead of a `"filters": []` array, use a `"groups": []` array.
```Json
{
    "advancedSearchNew": {
        "type": "charcoal/advanced-search/widget/advanced-search",
        "rowCountLabel": "Result",
        "sort_options": {
            "id": { "direction": "ASC" },
            "name": { "direction": "ASC" },
            "registrationDate": { "direction": "DESC" }
        },
        "groups": [
            {},
            {}
        ]
    },
    "table": {
        "obj_type": "path/to/model",
        "type": "charcoal/admin/widget/table",
        "show_table_header": false
    }
}
```

#### Options
| Key               | Values | Default  | Description                                                   |
|:------------------|:------:|:--------:|---------------------------------------------------------------|
| `row_count_label` | String | "Result" | Non-plural label to use for the heading count. ex. "24 Users" |
| `sort_options`    | Array  |   n/a    | Defines sorting options                                       |
| `groups`          | Array  |   n/a    | Defines filter [groups](#filter-group-example) to use         |


### Tabs
#### Tab Example
```JSON
{
    "label": "First Tab",
    "groups": [
        {},
        {}
    ],
    "layout": {}
}
```
#### Options
| Key                  | Values | Default | Description                                                |
|:---------------------|:------:|:-------:|------------------------------------------------------------|
| `label` | String | n/a | Label to use for the tab |
| `groups`          | Array  |   n/a    | Defines filter [groups](#filter-group-example) to use         |
| `layout`             | Array  |   n/a   | Arrange the groups in a layout within the tab using structures           |

### Filter Group
#### Filter Group Example
```JSON
{
    "label": "Filter Group Label",
    "filters": [
        "filter_one",
        "filter_two"
    ],
    "filters_options": {
        "filter_one": {},
        "filter_two": {},
    },
    "layout": {}
}
```
#### Options
| Key                  | Values | Default | Description                                                |
|:---------------------|:------:|:-------:|------------------------------------------------------------|
| `label` | String | n/a | Label to use for the group |
| `filters`          | Array  |   n/a    | Defines filters to use in order         |
| `filters_options`          | Array  |   n/a    | Defines options for each [filter](#filter-examples) to use         |
| `layout`             | Array  |   n/a   | Arrange the filters in a layout within the group using structures           |

## Filter Examples
Filters can be defined like normal inputs. However, there are added options for select inputs.
### Select Inputs
#### Use property choices as source
```JSON
{
    "label": "Filter Label",
    "input_type": "charcoal/admin/property/input/select",
    "property_ident": "ident",
    "choices_source": {
        "type": "property",
        "model": "path/to/model",
        "property_ident": "ident"
    },
    "operator": "="
}
```
#### Use database values as source
```JSON
{
    "label": "Author Filter",
    "multiple": false,
    "input_type": "charcoal/admin/property/input/select",
    "property_ident": "authors",
    "choice_obj_map": {
        "label": "displayName"
    },
    "choices_source": {
        "type": "database",
        "model": "charcoal/admin/user",
        "filters": [
            {
                "property": "roles",
                "value": "author"
            }
        ]
    },
    "select_options": {
        "liveSearch": true,
        "size": 5
    }
}
```

#### Options
These options are added in addition to all other input options.
| Key                  | Values | Default | Description                                                |
|:---------------------|:------:|:-------:|------------------------------------------------------------|
| `choice_obj_map`         | Array  |   n/a   | Maps a database column to the Label/Value of a select option |

`choices_source`
| Key                  | Values | Default | Description                                                |
|:---------------------|:------:|:-------:|------------------------------------------------------------|
| `type`         | String  |   n/a   | Either `property` (Use a model's property as choices) or `database` (Use database results as choices).  |
| `model` | String  |   n/a   | Defines which model to use as a source        |
| `filters` | Array  |   n/a   | `database` type only. Defines optional query filters        |




## Development

To install the development environment:

```shell
$ composer install
```

To run the scripts (phplint, phpcs, and phpunit):

```shell
$ composer test
```

### Assets

To install assets build environment: 

```shell
$ yarn install
```

To run the build scripts: 
```shell
$ grunt watch
```
or
```shell
$ grunt
```


### API Documentation

-   The auto-generated `phpDocumentor` API documentation is available at:  
    [https://locomotivemtl.github.io/charcoal-contrib-advanced-search/docs/master/](https://locomotivemtl.github.io/charcoal-contrib-advanced-search/docs/master/)
-   The auto-generated `apigen` API documentation is available at:  
    [https://codedoc.pub/locomotivemtl/charcoal-contrib-advanced-search/master/](https://codedoc.pub/locomotivemtl/charcoal-contrib-advanced-search/master/index.html)



### Development Dependencies

-   [php-coveralls/php-coveralls][phpcov]
-   [phpunit/phpunit][phpunit]
-   [squizlabs/php_codesniffer][phpcs]



### Coding Style

The charcoal-contrib-advanced-search module follows the Charcoal coding-style:

-   [_PSR-1_][psr-1]
-   [_PSR-2_][psr-2]
-   [_PSR-4_][psr-4], autoloading is therefore provided by _Composer_.
-   [_phpDocumentor_](http://phpdoc.org/) comments.
-   [phpcs.xml.dist](phpcs.xml.dist) and [.editorconfig](.editorconfig) for coding standards.

> Coding style validation / enforcement can be performed with `composer phpcs`. An auto-fixer is also available with `composer phpcbf`.



## Credits

-   [Locomotive](https://locomotive.ca/)



## License

Charcoal is licensed under the MIT license. See [LICENSE](LICENSE) for details.



[charcoal-contrib-advanced-search]:  https://packagist.org/packages/locomotivemtl/charcoal-contrib-advanced-search
[charcoal-app]:             https://packagist.org/packages/locomotivemtl/charcoal-app
[charcoal-admin]:           https://packagist.org/packages/locomotivemtl/charcoal-admin

[dev-scrutinizer]:    https://scrutinizer-ci.com/g/locomotivemtl/charcoal-contrib-advanced-search/
[dev-coveralls]:      https://coveralls.io/r/locomotivemtl/charcoal-contrib-advanced-search
[dev-travis]:         https://travis-ci.org/locomotivemtl/charcoal-contrib-advanced-search

[badge-license]:      https://img.shields.io/packagist/l/locomotivemtl/charcoal-contrib-advanced-search.svg?style=flat-square
[badge-version]:      https://img.shields.io/packagist/v/locomotivemtl/charcoal-contrib-advanced-search.svg?style=flat-square
[badge-scrutinizer]:  https://img.shields.io/scrutinizer/g/locomotivemtl/charcoal-contrib-advanced-search.svg?style=flat-square
[badge-coveralls]:    https://img.shields.io/coveralls/locomotivemtl/charcoal-contrib-advanced-search.svg?style=flat-square
[badge-travis]:       https://img.shields.io/travis/locomotivemtl/charcoal-contrib-advanced-search.svg?style=flat-square

[psr-1]:  https://www.php-fig.org/psr/psr-1/
[psr-2]:  https://www.php-fig.org/psr/psr-2/
[psr-3]:  https://www.php-fig.org/psr/psr-3/
[psr-4]:  https://www.php-fig.org/psr/psr-4/
[psr-6]:  https://www.php-fig.org/psr/psr-6/
[psr-7]:  https://www.php-fig.org/psr/psr-7/
[psr-11]: https://www.php-fig.org/psr/psr-11/
