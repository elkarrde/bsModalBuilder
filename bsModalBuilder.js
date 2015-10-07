var ModalBuilder;

ModalBuilder = function(defaultParams) {
  if (defaultParams == null) {
    defaultParams = null;
  }
  this.__version = '0.1.5';
  this.defaultParams = {
    title: null,
    hasTitle: true,
    hasFooter: true,
    content: null,
    isClosable: true,
    doesFade: true,
    size: false,
    buttons: [
      {
        text: 'Close',
        type: 'dismiss',
        style: 'btn-default'
      }, {
        text: 'Ok',
        type: 'submit',
        style: 'btn-primary'
      }
    ]
  };
  if (defaultParams != null) {
    $.extend(this.defaultParams, defaultParams);
  }
};

ModalBuilder.prototype.buildModal = function(title, content, callback, params) {
  var buttonHandlers, currentParamsMap, modalCallback, modalCloseBtn, modalContainer, modalContent, modalDOMContent, modalDOMFooter, modalDOMHeader, modalDoesFade, modalDom, modalId, modalKbClose, modalParams, modalSize, modalTitle;
  if (params == null) {
    params = false;
  }
  modalParams = this.defaultParams;
  if (params !== false) {
    currentParamsMap = Object.getOwnPropertyNames(params);
    currentParamsMap.forEach(function(item) {
      modalParams[item] = params[item];
    });
  }
  modalId = this.__getModalId();
  modalTitle = title != null ? title : this.defaultParams.title;
  modalContent = content != null ? content : this.defaultParams.content;
  modalCallback = typeof callback === 'function' ? callback : null;
  modalCloseBtn = '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
  if ((modalParams.noClose != null) && modalParams.noClose === true) {
    modalCloseBtn = '';
  }
  modalDOMHeader = "<div class=\"modal-header\">\n  " + modalCloseBtn + "\n  <h4 class=\"modal-title\" id=\"ModalLabel_" + modalId + "\">" + modalTitle + "</h4>\n</div>";
  modalDOMHeader = (modalParams.hasTitle != null) && modalParams.hasTitle === true ? modalDOMHeader : '';
  modalDOMContent = "<div class=\"modal-body\">\n  " + modalContent + "\n</div>";
  modalDOMContent = content != null ? modalDOMContent : '';
  modalDOMFooter = '<div class="modal-footer">';
  buttonHandlers = [];
  modalParams.buttons.forEach(function(button) {
    var buttonBind, buttonDataType, buttonStyle, buttonType;
    if (button.type != null) {
      buttonDataType = ' data-' + button.type + '="modal"';
    }
    buttonStyle = button.style != null ? button.style : 'btn-default';
    buttonBind = button.bind != null ? ' data-bind="' + button.bind + '"' : '';
    buttonType = button.type === 'submit' ? 'submit' : 'button';
    modalDOMFooter += '<button type="' + buttonType + '" class="btn ' + buttonStyle + '"' + buttonDataType + buttonBind + '>' + button.text + '</button>';
    if ((button.type != null) && button.type !== 'dismiss' && button.type !== 'submit') {
      buttonHandlers.push(button.type);
    }
  });
  modalDOMFooter += '</div>';
  modalDOMFooter += '</div>';
  modalDOMFooter = (modalParams.hasFooter != null) && modalParams.hasFooter === true ? modalDOMFooter : '';
  modalKbClose = (modalParams.noClose != null) && modalParams.noClose === true ? '' : ' keyboard';
  modalDoesFade = (modalParams.doesFade != null) && modalParams.doesFade === false ? '' : ' fade';
  modalSize = '';
  if (modalParams.size != null) {
    if (modalParams.size === 'lg') {
      modalSize = ' modal-lg';
    }
    if (modalParams.size === 'sm') {
      modalSize = ' modal-sm';
    }
  }
  modalDom = "<div class=\"modal" + modalDoesFade + modalKbClose + "\" id=\"modal_" + modalId + "\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"ModalLabel_" + modalId + "\" aria-hidden=\"true\">\n  <div class=\"modal-dialog" + modalSize + "\">\n    <div class=\"modal-content\">\n      " + modalDOMHeader + "\n      " + modalDOMContent + "\n      " + modalDOMFooter + "\n    </div>\n  </div>\n</div>";
  modalContainer = this.__getContainer();
  modalContainer.append(modalDom);
  $('#modal_' + modalId + ' [data-submit="modal"]').click(function() {
    var ci, element, max, output;
    $('#modal_' + modalId).attr('data-interaction', 'submit');
    $('#modal_' + modalId).modal('toggle');
    if (callback !== null && typeof callback !== 'string' && typeof callback !== 'number' && typeof callback !== 'boolean') {
      if ($('#modal_' + modalId + ' .form-input').length === 1) {
        output = $('#modal_' + modalId + ' .form-input').val();
      } else {
        ci = 0;
        max = $('#modal_' + modalId + ' .form-input').length;
        output = {};
        while (ci < max) {
          element = $('#modal_' + modalId + ' .form-input').eq(ci);
          output[element.attr('name')] = element.val();
          ci++;
        }
      }
      if (typeof callback === 'function') {
        callback(output);
      }
      if (typeof callback === 'object' && (callback.submit != null)) {
        callback.submit(output);
      }
    }
  });
  $('#modal_' + modalId + ' [data-dismiss="modal"]').click(function() {
    $('#modal_' + modalId).attr('data-interaction', 'dismiss');
    $('#modal_' + modalId).modal('toggle');
    if (callback !== null && typeof callback !== 'string' && typeof callback !== 'number' && typeof callback !== 'boolean') {
      if (typeof callback === 'object' && (callback.dismiss != null)) {
        callback.dismiss();
      }
    }
  });
  buttonHandlers.forEach(function(handler) {
    $('#modal_' + modalId + ' [data-' + handler + '="modal"]').click(function() {
      $('#modal_' + modalId).attr('data-interaction', handler);
      $('#modal_' + modalId).modal('toggle');
      if (callback !== null && typeof callback !== 'string' && typeof callback !== 'number' && typeof callback !== 'boolean') {
        if (typeof callback === 'object' && (callback[handler] != null)) {
          return callback[handler]();
        }
      }
    });
  });
  $('#modal_' + modalId).keydown(function(e) {
    if (e.key === 'Enter') {
      $('#modal_' + modalId + ' [data-submit="modal"]').trigger('click');
    } else if (e.key === 'Escape') {
      $('#modal_' + modalId + ' [data-dismiss="modal"]').trigger('click');
    }
  });
  return '#modal_' + modalId;
};

ModalBuilder.prototype.show = function(modalId, onloadCallback, oncloseCallback) {
  if (onloadCallback == null) {
    onloadCallback = false;
  }
  if (oncloseCallback == null) {
    oncloseCallback = false;
  }
  $(modalId).modal('show').on('shown.bs.modal', function() {
    $(modalId).find('input').eq(0).focus();
    if (onloadCallback !== false) {
      onloadCallback(modalId);
    }
  });
  $(modalId).on('hide.bs.modal', function(e) {
    $(modalId).find('input').eq(0).focus();
    if (oncloseCallback !== false) {
      oncloseCallback(modalId, e);
    }
  });
};

ModalBuilder.prototype.hide = function(modalId) {
  $(modalId).modal('hide');
};

ModalBuilder.prototype.modal = function(title, content, callback, params) {
  var modalId;
  if (params == null) {
    params = false;
  }
  modalId = this.buildModal(title, content, callback, params);
  if (typeof params.onloadCallback === 'function' && typeof params.oncloseCallback === 'function') {
    this.show(modalId, params.onloadCallback, params.oncloseCallback);
  } else if (typeof params.onloadCallback === 'function') {
    this.show(modalId, params.onloadCallback);
  } else {
    this.show(modalId);
  }
  return modalId;
};

ModalBuilder.prototype.alert = function(title, content) {
  var modalId;
  modalId = this.modal(title, content, null, {
    hasTitle: title != null,
    buttons: [
      {
        text: 'Ok',
        type: 'submit',
        style: 'btn-primary'
      }
    ]
  });
  return modalId;
};

ModalBuilder.prototype.confirm = function(title, content, callback) {
  var modalId;
  modalId = this.modal(title, content, callback, {
    hasTitle: title != null,
    buttons: [
      {
        text: 'Cancel',
        type: 'dismiss',
        style: 'btn-standard'
      }, {
        text: 'Ok',
        type: 'submit',
        style: 'btn-primary'
      }
    ]
  });
  return modalId;
};

ModalBuilder.prototype.prompt = function(title, content, callback, params) {
  var inputBind, modalId, placeholderText, promptContent;
  if (params == null) {
    params = false;
  }
  placeholderText = params.placeholder != null ? params.placeholder : 'Text input';
  inputBind = params.inputBind != null ? ' data-bind="' + params.inputBind + '"' : '';
  promptContent = "<div class=\"form-group\">\n  <p>" + content + "</p>\n  <input type=\"text\" class=\"form-control form-input\" placeholder=\"" + placeholderText + "\" autofocus=\"autofocus\"" + inputBind + ">\n</div>";
  modalId = this.modal(title, promptContent, callback, {
    hasTitle: title != null,
    buttons: [
      {
        text: 'Cancel',
        type: 'dismiss',
        style: 'btn-standard',
        bind: params.cancelBind != null ? params.cancelBind : null
      }, {
        text: 'Ok',
        type: 'submit',
        style: 'btn-primary',
        bind: params.confirmBind != null ? params.confirmBind : null
      }
    ]
  });
  return modalId;
};

ModalBuilder.prototype.html = function(title, content, callback, params) {
  var modalButtons, modalContent, modalId;
  if (params == null) {
    params = false;
  }
  modalContent = content;
  modalButtons = params.buttons != null ? params.buttons : [
    {
      text: 'Cancel',
      type: 'dismiss',
      style: 'btn-standard'
    }, {
      text: 'Ok',
      type: 'submit',
      style: 'btn-primary'
    }
  ];
  modalId = this.modal(title, modalContent, callback, {
    hasTitle: title != null,
    buttons: modalButtons,
    onloadCallback: (params.onloadCallback != null ? params.onloadCallback : null)
  });
  return modalId;
};

ModalBuilder.prototype.__getModalId = function() {
  return Math.floor(Math.random() * 101) + Math.floor(Math.random() * 101);
};

ModalBuilder.prototype.__getContainer = function() {
  var container, heights, sortedHeights;
  container = $('.container:visible').length !== 0 ? $('.container:visible') : $('.container-fluid:visible');
  if (container.length === 0) {
    container = $('body');
  }
  if (container.length === 1) {
    return container;
  } else {
    heights = [];
    container.each(function(count) {
      var item;
      item = {
        order: count,
        height: $(this).height()
      };
      heights.push(item);
    });
    sortedHeights = heights.sort(function(a, b) {
      return a.height < b.height;
    });
    return container.eq(sortedHeights[0].order);
  }
};
