# bsModalBuilder

Dynamic modal builder for Twitter Bootstrap 3

[See an example](https://elkarrde.github.io/bsModalBuilder)

## Overview

bsModalBuilder is a tool for building Bootstrap modals that are tailored to 
your specific needs, one modal at a time, without reusing the same markup. 
Each dynamically created modal is built specifically for that single task, 
using The Power of JavaScript(TM) :)


## Quick-start

  + Include `bsModalBuilder.js` after main Bootstrap 3 JavaScript files,
  + Initialize new modal object like this var `Modal = new ModalBuilder();`,
  + Run your new modal: `Modal.modal(options)`;
  

## Example

Simple modal example.

```
var modal = Modal.modal(
    'Example 1',
    'This is an example 1!',
    {
        submit: function() {
		    alert('Modal has been confirmed.');
		},
        dismiss: function() {
		    alert('Modal has been dismissed.');
		}
    },
    {
        size: null,
        buttons: [
          {
            text: 'Dismiss',
            type: 'dismiss',
            style: 'btn-default'
          },
          {
            text: '<span class="glyphicon glyphicon-ok"></span> Confirm',
            type: 'submit',
            style: 'btn-primary'
          }
        ],
        onloadCallback: function(mId) {
            console.info('Modal loaded, ID:', mId);
        },
        oncloseCallback: function(mId) {
            console.log('Modal closed, ID:', mId);
        }
    }
);
```



## Methods

Modal builder supports two ways of modal generation, fully automated or manual.

### Automated building methods

  + **.modal**(title, content, callback, options) – fully customized modal builder with automathic modal displaying,
  + **.alert**(title, content) – modal-powered `alert()` equivalent,
  + **.confirm**(title, content, callback) – modal-powered `confirm()` equivalent,
  + **.prompt**(title, content, callback, options) – modal-powered `prompt()` equivalent,
  + **.html**(title, content, callback, options) – HTML-filled modal.

### Manual methods

  + **.buildModal**(title, content, callback, options) – manual builder,
  + **.show**(modal_id, loadCallback, closeCallback) – displays specific modal,
  + **.hide**(modal_id) – hides specific modal.
  



