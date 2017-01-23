# Toptal front end development test

Components:
* [MongoDB](https://www.mongodb.com/)
* [Express](http://expressjs.com/)
* [Angular](https://angularjs.org/)
* [NodeJS](https://nodejs.org/)
* [Gulp](http://gulpjs.com/)
* [Sass](http://sass-lang.com/)
* [Bootstrap 4 Alpha (6)](http://v4-alpha.getbootstrap.com/)

----

## NPM dependencies install:

Open the terminal, go to the project's path and:

```
$ npm install
```

*Note: for Mac users make sure x-code is previously installed or [execute](http://railsapps.github.io/xcode-command-line-tools.html)*

```
$ xcode-select --install
```

----

## Run server:

### MongoDB
In one terminal instance:

```
$ mongod --dbpath /path/to/mongo/db
```

Into a **second terminal** instance and after reaching the project's path, you will be able to execute **Gulp tasks**:

----

## Gulp Tasks:

### Sass
Concat two different streams into a final CSS file:

* Destination: `public/css/main.css`
* Task dependency: **ng-templates** task

**cssStream**
Stream with all the `*.css` files from dependencies folder (ex. [animate.css](https://daneden.github.io/animate.css/))

**sassStream**
Stream which takes all `*.scss` files from [src/scss](../tree/master/src/scss) through [main.scss](../blob/master/src/scss/main.scss)

Execution :grin:

```
$ gulp sass
```

### Scripts
Concat all JS files coming whether from `npm_modules` and [src/js](../tree/master/src/js):

* Destination: `public/js/all.js`
* Task dependency: **ng-templates** task


Execution :grin:

```
$ gulp scripts
```

### Ng-templates
Searches for all angular html templates at [src](../tree/master/src) and compiles them into an angular module with [templateCache](https://docs.angularjs.org/api/ng/service/$templateCache):

* Destination: `src/js/templates.js`

Execution :grin:

```
$ gulp ng-templates
```

### Icons
Export icon font files to the public folder for development:

* Destination: `public/fonts/[font-folder-name]`

*Note: so far only exports Font Awesome but can be configured to also Bootstrap Glyphicons or another third-party library.*

Execution :grin:

```
$ gulp icons
```

### Images
Concat two different streams that compress and exports images:

* Destination: `public/img/`

**jpgPngStream**
Process all `*.{png,jpg,jpeg}` files using [TinyPNG API](https://tinypng.com/developers) only if those images not listed into a `public/img/.tinypng-sigs`. Since the free account has a monthly limit is a good advantage for developers that work daily on the project.

**svgStream**
Process all `*.svg` files using [SVGmin](https://github.com/ben-eb/gulp-svgmin). Toptal logo is an SVG

Execution :grin:

```
$ gulp images
```

### Layout
Export [index.html](../blob/master/src/index.html) layout:

* Destination: `public/`

Execution :grin:

```
$ gulp layout
```

### Dependencies
This task is only a wrapper for **sass**, **scripts**, **images**, **layout** and **icons** tasks.
Is used in two different tasks: **default** and **build**

Execution :grin:

```
$ gulp dependencies
```

### Build
After running **dependencies** moves all important files into a build folder by minifying all HTML, CSS and JS (uglifying the last one).
This task run in three different streams:

**publicStream**
Every file from `public` is exported to `build/public`

**appStream**
[app.js](../blob/master/app.js), [config.js](../blob/master/config.js) and [package.json](../blob/master/package.json) are exported to `build`

**apiStream**
Every file inside [api](../tree/master/api) folder is exported to `build/api`

*Note: This is the task you would execute when you need to deliver the project to the client*

Execution :grin:

```
$ gulp build
```

### Default
Maybe the most important task for development process. It executes **dependencies** and right after sets a few things:

**Server**
Opens a communication with [app.js](../blob/master/app.js) to use [Express](http://expressjs.com/) with [MongoDB](https://www.mongodb.com/). The environment is already set as `env: {NODE_ENV: 'development'}` so **Livereleoad** will be active (along with other development mode dependencies).

**Watchers**
* `*.scss` files at [src](../tree/master/src). Runs **sass** task after a change
* `*.js` files at [src](../tree/master/src) and `*.html` files at [src](../tree/master/src/ng-app). Runs **scripts** task after a change
* `index.html` file at [src](../tree/master/src). Runs **layout** task after a change
* `*.html`, `*.scss` and `*.js` files within `./public` to notify the server and reload the page (for CSS the **Livereleoad** only overrides the stylesheet)
* [app.js](../blob/master/app.js), [config.js](../blob/master/config.js) and `**/*.js` inside [api](../tree/master/api) to reload the server if any change is performed.

*Note: This is the task you would execute when you want to run the app*

Execution :grin:

```
$ gulp
```

## API:

### Form handler
```
/api/form/send
```
Send email to MongoDB (`toptal_test` DB - `forms` Collection)

* Type: `POST`
* [Model](../blob/master/api/models/form.js):
- '_id': `Object`,
- 'timestamp': `String`,
- 'name': `String`,
- 'email': `String`,
- 'location': `String`,
- 'twitter_user': `String`,
- 'comment': `String`


## Directives:

### Form Mail (aka Form)

This directive is a wrapper for every form developers want to config.
It can be called whether as an **Element** `E` or **Attribute** `A`.

Directive template file: `form.directive.html`

Layout sample:

```
<div data-form-mail 
     data-callback="callback()"
     data-status="$ctrl.status"
     data-is-loading="$ctrl.loading"
     data-name="[form name]"
     data-message="$ctrl.message"
     data-submit-text="[form submit button text]"
     >
```
**Scopes**
* Callback: scoped `&`, function executed on form submit through `ng-submit`. It receives no arguments
* Status: scoped `=`, receives the callback status from the controller. The outputs are `success` or `error`. Used for the callback messages styles
* Message: scoped `=`, receives the callback message from the server and prints it into the form
* Loading: scoped `=isLoading`, brings the loading status from the controller to collaborate with the UX. If is loading, the button will be disabled and a loading icon will be shown
* Submit: scoped `@submitText`, is the form's button text
* Name: scoped `=`, passing a controller property in the form's name (used for Angular built in validations even when server responses that are missing or invalid fields)

### Form Mail Field (aka Field)

This directive is used to print a form field. By default will be an `<input>` but you can set it to be `<textarea>`.
It can be called whether as an **Element** `E` or **Attribute** `A`.

Directive template file: `form.field.directive.html`

Layout sample:

```
<span data-form-mail-field
	  data-name="[form field name]"
	  data-placeholder="[form field placeholder]"
	  data-icon="[form field (font awesome) icon]"
	  data-model="$ctrl.formObject.model"
	  data-is-required="true"
	  data-regex=""
	  is-textarea="true"
	  ></span>
```
**Scopes**
* Name: scoped `@`, is the fields's name
* Placeholder: scoped `@`, is the fields's placeholder
* Icon: scoped `@`, is the fields's (font awesome) icon. Ex. if the icon class is `fa-google-plus`, the icon parameter should be `google-plus` without the `fa-` prefix
* Size *(optional)*: scoped `@`, if you want the field to span the half of the row the value would be `half`
* Type *(optional)*: scoped `@`, used to specify the type of the input unless `is-textarea` is set on `true`
* Model: scoped `=`, receives the model from the controller
* Required: scoped `=isRequired`, is set to true if the field is required (used for Angular built in validations)
* Textarea: scoped `=isTextarea`, is set to true if the field is a `<textarea>`. Default: `<input>`

Every form field element replaced by the directive template.

**Link method**
Since the model doesn't update there is a jQuery-ish code doing it on `change` event.

When the `scope` is destroyed the events are removed.

```
function link(scope, elem){

  // Model update workaround
  elem.delegate("[data-ng-model]", "change", function(){
    scope.model = this.value;
  });

  // On destroy detach events
  scope.$on('$destroy', function(){
    elem.undelegate("[data-ng-model]", "change");
  });
    
}
```

The form field directive also requires the parent form mail directive and the ngModel.













