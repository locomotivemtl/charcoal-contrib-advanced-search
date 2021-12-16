Charcoal SearchFilter
===============

[![License][badge-license]][charcoal-contrib-search-filter]
[![Latest Stable Version][badge-version]][charcoal-contrib-search-filter]
[![Code Quality][badge-scrutinizer]][dev-scrutinizer]
[![Coverage Status][badge-coveralls]][dev-coveralls]
[![Build Status][badge-travis]][dev-travis]

A [Charcoal][charcoal-app] service provider my cool feature.



## Table of Contents

-   [Installation](#installation)
    -   [Dependencies](#dependencies)
-   [Configuration](#configuration)
-   [Usage](#usage)
-   [Options](#options)
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
$ composer require locomotivemtl/charcoal-contrib-search-filter
```



### Dependencies

#### Required

-   [**PHP 5.6+**](https://php.net): _PHP 7_ is recommended.
-   [charcoal-admin][charcoal-admin] ^0.14.2.


## Configuration

Include the search-filter module in the projects's config file.
This will provide everything needed for [charcoal-contrib-search-filter] to work properly.
No need for metadata/views/action/routes path etc.

```Json
{
    "modules": {
       "charcoal/search-filter/search-filter": {}
    }
}
```


## Usage

[charcoal-contrib-search-filter] can be used as a dashboard widget to filter all the filterable widgets
included in the template. Define a structure like this one :point_down: in a dashboard widget to create filters.

```Json
{
    "filters": {
        "type": "charcoal/search-filter/widget/search-filter",
        "search_filters": [
            "taxonomy_1",
            "taxonomy_2",
            "taxonomy_3"
        ],
        "properties_options": {
            "taxonomy_1": {
                "required": false,
                "multiple": true,
                "input_type": "charcoal/admin/search/input/select"
            },
            "taxonomy_2": {
                "required": false,
                "input_type": "charcoal/admin/search/input/radio"
            },
            "taxonomy_3": {
                "required": false,
                "input_type": "charcoal/admin/search/input/checkbox"
            }
        },
        "layout": {
            "structure": [
                {"columns": [1, 1, 1]}
            ]
        }
    }
}
```

## Options

| Key                  | Values | Default | Description                                                |
| :---                 | :---:  | :---:   | ---                                                        |
| `properties`         | Array  | n/a     | Defines which of the model's properties to use as filters. |
| `properties_options` | Array  | n/a     | Defines search customizations for the filter inputs      |
| `layout`             | Array  | n/a     | Arrange the filters in a layout using structures           |




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
$ yarn insall
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
    [https://locomotivemtl.github.io/charcoal-contrib-search-filter/docs/master/](https://locomotivemtl.github.io/charcoal-contrib-search-filter/docs/master/)
-   The auto-generated `apigen` API documentation is available at:  
    [https://codedoc.pub/locomotivemtl/charcoal-contrib-search-filter/master/](https://codedoc.pub/locomotivemtl/charcoal-contrib-search-filter/master/index.html)



### Development Dependencies

-   [php-coveralls/php-coveralls][phpcov]
-   [phpunit/phpunit][phpunit]
-   [squizlabs/php_codesniffer][phpcs]



### Coding Style

The charcoal-contrib-search-filter module follows the Charcoal coding-style:

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



[charcoal-contrib-search-filter]:  https://packagist.org/packages/locomotivemtl/charcoal-contrib-search-filter
[charcoal-app]:             https://packagist.org/packages/locomotivemtl/charcoal-app
[charcoal-admin]:           https://packagist.org/packages/locomotivemtl/charcoal-admin

[dev-scrutinizer]:    https://scrutinizer-ci.com/g/locomotivemtl/charcoal-contrib-search-filter/
[dev-coveralls]:      https://coveralls.io/r/locomotivemtl/charcoal-contrib-search-filter
[dev-travis]:         https://travis-ci.org/locomotivemtl/charcoal-contrib-search-filter

[badge-license]:      https://img.shields.io/packagist/l/locomotivemtl/charcoal-contrib-search-filter.svg?style=flat-square
[badge-version]:      https://img.shields.io/packagist/v/locomotivemtl/charcoal-contrib-search-filter.svg?style=flat-square
[badge-scrutinizer]:  https://img.shields.io/scrutinizer/g/locomotivemtl/charcoal-contrib-search-filter.svg?style=flat-square
[badge-coveralls]:    https://img.shields.io/coveralls/locomotivemtl/charcoal-contrib-search-filter.svg?style=flat-square
[badge-travis]:       https://img.shields.io/travis/locomotivemtl/charcoal-contrib-search-filter.svg?style=flat-square

[psr-1]:  https://www.php-fig.org/psr/psr-1/
[psr-2]:  https://www.php-fig.org/psr/psr-2/
[psr-3]:  https://www.php-fig.org/psr/psr-3/
[psr-4]:  https://www.php-fig.org/psr/psr-4/
[psr-6]:  https://www.php-fig.org/psr/psr-6/
[psr-7]:  https://www.php-fig.org/psr/psr-7/
[psr-11]: https://www.php-fig.org/psr/psr-11/
