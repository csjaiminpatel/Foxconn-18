# Installation

To be able to run Orion locally, you need to install a couple of packages.

### Dependencies

#### NodeJS

First of all, install [NodeJS](https://nodejs.org/en/) on your local machine.
You need NodeJS for running npm scripts.

#### Angular CLI

Then install [Angular CLI](https://cli.angular.io/) on your local machine.
You need Angular CLI for running Angular projects.

#### Python

To be sure, you should also install Python [Python](https://www.python.org/downloads/) on your local machine.
Python is mainly used for SCSS > CSS bundling in Angular CLI projects.

#### Links

[NodeJS](https://nodejs.org/en/)

[Angular CLI](https://cli.angular.io/)

[Python](https://www.python.org/downloads/)

# Setup

### Client setup

Now you can go to [Gitlab](https://oriongit.foxservice.cz/orion/frontend/web) page and pull Orion web project.

Project uses Master and Develop branches. Master is mainly used for production version. Develop version is used for development version.

Developers cannot push code to the master and develop directly, but create feature from develop branch. To get their code to the develop, they have to create merge request.

#### Running against development server

In this case, you don't need to run server on your local machine as you will call development server API.

Just run in command line

```javascript
npm run adfs
```

and application will start with configuration for development server.

API base url will set to https://develop.dev.orion.foxservice.cz/

Used configuration is config.orion-adfs.json as main configuration file.

#### Local serving

Before you run your project locally, install all npm dependencies.

```javascript
npm install
```

After that, you can project. In root folder start application with command in console.

```javascript
 ng serve
```

In this case, application automatically chooses dev configuration file a main file.

Then open another console tab and run second project with

```javascript
 ng serve orion-api
```

#### Build version

```javascript
ng build --prod
```

### API setup

For running locally against mock server, you need to start Orion API project. Then run catalogue and library projects to be able to work on **Configurator**.

- Mock server on client
- Catalogue API
- Library API

#### Mock server

Mock server is generated with Nrwl Nx and is build with NestJS.

```javascript
ng serve orion-api
```

#### Library

Go to [Library repository](https://oriongit.foxservice.cz/orion/services/workflow/library) and pull project. For testing, setup your own path in _LibraryController_ for message queue.

For example: [ServiceRoute("/api/sv-v{version}/WorkFlow/Library")]

#### Catalogue

Go to [Catalogue repository](https://oriongit.foxservice.cz/orion/services/workflow/catalogue.git) and pull project. For testing, setup your own path in _CatalogueController_ for message queue.

For example: [ServiceRoute("/api/sv-v{version}/WorkFlow/Catalogue")]

> Note: your API path must be the same path as you setup in Orion client configuration

### Extensions

Here is a list of Extensions which can help you during development.

#### Visual Studio Code

[Angular snippets](https://marketplace.visualstudio.com/items?itemName=Mikael.Angular-BeastCode 'Helps with generating files and codes')

[Nrwl Nx console](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console 'Helps with generating angular and node files and codes')

[Angular Service](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template 'Helps with template auto completion')

# Configuration

### Client configuration

There is several types of configuration, which needs to be set before you start with development.

#### Configuration

For getting right configuration, you have to build application with specific configuration name.

Config name is the name of environment in application **environments**.

Then application looks into the environment file and look for the **name** property.

<img src="./documentation/Orion-configuration-environment.PNG" style="zoom:60%;" />

Property **name** is the part of name of the configuration file in application **assets/config** with API's.

```javascript
// Run application with specific configuration
ng serve --c {config name}
```

Example: If you want to build application with config.orion-adfs json configuration, just run

```javascript
ng serve --c orion-adfs
```

then you will have config.orion-adfs.json as main configuration file.

> Note: If you want to run application against local API, you have to setup apiBaseUrl as
>
> https://ls51-dev.orion.cz.foxconn.com:8443/ and also setup the same API version prefix for the API controller and client as its shown bellow
>
> Example: sv-v1

<img src="./documentation/Orion-configuration-config.PNG" style="zoom:60%;" />

Structure of the config and environments folders shown bellow.

<img src="./documentation/Orion-configuration.PNG" style="zoom:60%;" />

> Note: You don't need to call dev with --c its automatically

#### Internationalization

To get language working, don't forget that you need to have correctly setup JSON files for translation. Application works with two different types of translation. Both types uses same philosophy with setting path to the folder with translations. Folder has to include folder for each language like cz, en, etc...

##### Global

Global translation provides data to the whole application and its setup is initialized in AppModule (app.module.ts).

Example of usage in Orion is bellow. Global translation is stored in _assets/i18n/app_.

<img src="./documentation/Orion-configuration-language.PNG" style="zoom:60%;" />

##### Isolated

Isolated translation is used in case, you want to isolate data from global and module is initialized in specific module. This is mainly used for lazy loaded modules. As its shown bellow, you have to create new folder for module and create translation JSON files.

Be sure, your module folder is in correct feature (mes/scm).

Example shows, how configurator is defined in structure.

<img src="./documentation/Orion-configuration-language-isolated.PNG" style="zoom:60%;" />

#### Authentication

Last but not least, there is authentication configuration. Authentication file provides application data to connect via ADFS. Configuration file is stored in assets/auth folder as **oauth-configuration.json**.

As in previous cases, AppModule sets path to the configuration file and initializes service for connection to ADFS. For development, there is only one configuration file, which is override with right values during deployment.

# Structure

Here is the structure of current workspace setup. Workspace is generated with Nrwl Nx extension to get better monorepo style. Most of parts are similar to the classic Angular application, but there are some additional folders and files directly connected with Nx such as apps and libs and nx.json.

<img src="./documentation/workspace-structure.PNG" style="zoom:67%;" />

### Apps

Orion consist of two separated applications. First is client application called **orion**, which is currently running on the Angular 18. Its setup to be able to switch between different API's (localhost, dev, prod, mock).

Second application is MOCK server called **orion-api**, mainly used for logging as test user instead of logging as user in active directory.

There are two possibilities how to run application on local machine.

#### Run against mock server

##### Client

```javascript
ng serve
```

##### Mock server

```javascript
ng serve orion-api
```

Application automatically runs with **config.dev.json** configuration from _assets/config_.

#### Run against ADFS

To run application against ADFS, run npm script (shortcut)

```javascript
npm run adfs
```

or use

```
ng serve --c orion-adfs --ssl true --port 44360
```

### Libs

Libraries are modules, which are easily usable in other applications inside workspace (any other application can import library). Library setup should always be in angular.json file, which is updated after generating library with script. Modules are generated as library via [Nrwl nx](https://nx.dev/angular) extension. It uses own configuration.

#### Core

Core module includes main parts of the application such as authentication, language, configuration, guards, interceptors and many more. Module is always imported only once in every application. Core module can be used in other applications.

#### Datagrid

Generic Datagrid component with several style and functional options. It can be used as with local data as with remote data. Component includes features such as filtering, grouping, ordering, etc...

#### Dynamic Form Builder

Generic form generator, based on JSON data structure as input. Form builder includes basic functions such as validations, label and tooltip setup, etc...

Input data are type safe and uses FieldConfig interface shown bellow.

```javascript
/**
 * FieldConfig interface
 */
export interface FieldConfig {
  /**
   * FieldConfig id
   * @type number | string
   */
  id?: number | string;

  /**
   * FieldConfig disabled state
   * @type boolean
   */
  disabled?: boolean;

  /**
   * FieldConfig label
   * @type string
   */
  label?: string;

  /**
   * FieldConfig name
   * @type number | stringstring
   */
  name: string;

  /**
   * FieldConfig options
   * @type Option[]
   */
  options?: Option[];

  /**
   * FieldConfig placeholder
   * @type string
   */
  placeholder?: string;

  /**
   * FieldConfig type
   * @type FieldType
   */
  type: FieldType;

  /**
   * FieldConfig input type
   * @type FieldInputType
   */
  inputType?: FieldInputType;

  /**
   * FieldConfig validations
   * @type  Validation[]
   */
  validations?: Validation[];

  /**
   * FieldConfig value
   * @type any
   */
  value?: any;

  /**
   * FieldConfig flex (flexbox)
   * @type number
   */
  flex?: number;

  /**
   * FieldConfig columns
   * @type Column[]
   */
  columns?: Column[];

  /**
   * FieldConfig rows
   * @type Row[]
   */
  rows?: Row[];

  /**
   * FieldConfig readonly
   * @type boolean
   */
  readOnly?: boolean;

  /**
   *Filedconfig parameters
   * @type any
   */
  parameters?: FieldConfig[];

  /**
   * FieldConfig tooltip
   * Detail information for the element
   * @type string
   */
  tooltip?: string;
}
```

One of the most important part is to fill correct form element type. Application supports several types. Some of them are basic types, some of them are extension for our needs.

```javascript
/**
 * Field Type enum
 */
export enum FieldType {
  /**
   * Input type
   */
  Input = 'input',

  /**
   * Button type
   */
  Button = 'button',

  /**
   * Select type
   */
  Select = 'select',

  /**
   * Checkbox type
   */
  Checkbox = 'checkbox',

  /**
   * Toggle type
   */
  Toggle = 'toggle',

  /**
   * Radio button type
   */
  Radio = 'radio',

  /**
   * Table type
   */
  Table = 'table',

  /**
   * Date picker
   */
  DatePicker = 'datepicker',

  /**
   * Date picker with range
   */
  DateRangePicker = 'daterangepicker',

  /**
   * Date picker with time
   */
  DateTimePicker = 'datetimepicker',

  /**
   * Range type
   */
  Range = 'range',

  /**
   * Children type
   */
  Children = 'children',

  /**
   * Card type
   */
   Card = 'card'
}
```

#### Shared

As it's name stands, its mainly used for shared code. The main goals is to reuse component as much as possible. There is for example breadcrumb, dashboard tile or dialog.

#### Workflow

Workflow library is group for two sub libraries Common and Symbol palette. The main purpose of this library is to create custom nodes and connectors, drag and drop them on diagram screen and open parameters.

##### Common

Library helps you to create diagram elements. It defines element and connector interface.

##### Symbol palette

Library provides component with generated symbol palettes, which you can then easily drag and drop on diagram screen.

Example of symbol palette for MES configurator.

<img src="./documentation/symbol-pallete.PNG" alt="Symbol palette" style="zoom:67%;" />

### k8s

Folder contains data for automatic deploy tools to override configuration with correct values before deploying on server. Currently, there are two possibilities DEV and PROD. In both, you can find property hostName, where its set to current environment (dev host, prod host).

#### DEV

Dev folder contains yaml file for with configuration for development cluster. File contains data for ingress, setups mounts and maps configuration data for client stored in config.orion-adfs.json.

#### PROD

PROD folder contains yaml file for with configuration for production cluster. File contains data for ingress, setups mounts and maps configuration data for client stored in config.orion-adfs.json.

# Technologies

### Angular

[Angular](https://angular.io) is JavaScript framework for creating single page applications.

### Nrwl nx

[Nrwl nx](https://nx.dev/angular) is a set of Extensible Dev Tools for Monorepos.

### NGXS

[Ngxs](https://ngxs.gitbook.io/) is a state management pattern + library for Angular.

### Lodash

[Lodash](https://lodash.com/docs/4.17.15) is JavaScript utility for functional programming. Its a set of methods for iterating arrays, objects and strings.

### Links

[Angular](https://angular.io)

[Nrwl nx](https://nx.dev/angular)

[Ngxs](https://ngxs.gitbook.io)

[Lodash](https://lodash.com)
