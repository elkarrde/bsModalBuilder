# --- Bootstrap 3.2.0 Modal Builder ---------------------------------------------------------------
# --- constructor ---
ModalBuilder = (defaultParams) ->
  @__version = '0.1.0'

  @defaultParams =
    title: null
    hasTitle: true
    hasFooter: true
    content: null
    isClosable: true
    buttons: [
      {
        text: 'Close'
        type: 'dismiss'
        style: 'btn-default'
      }
      {
        text: 'Ok'
        type: 'submit'
        style: 'btn-primary'
      }
    ]
  return

# --- generalized modal builder ---
ModalBuilder::buildModal = (title, content, callback, params = false) ->
  modalParams = @defaultParams
  if params isnt false
    currentParamsMap = Object.getOwnPropertyNames(params)
    currentParamsMap.forEach (item) ->
      modalParams[item] = params[item]
      return

  modalId = @__getModalId()
  modalTitle = title ? @defaultParams.title
  modalContent = content ? @defaultParams.content
  modalCallback = if typeof callback is 'function' then callback else null

  modalCloseBtn = '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'
  modalCloseBtn = ''  if modalParams.noClose? and modalParams.noClose is true

  modalDOMHeader = """
    <div class="modal-header">
      #{modalCloseBtn}
      <h4 class="modal-title" id="ModalLabel_#{modalId}">#{modalTitle}</h4>
    </div>
  """
  modalDOMHeader = if modalParams.hasTitle? and modalParams.hasTitle is true then modalDOMHeader else ''

  modalDOMContent = """
    <div class="modal-body">
      #{modalContent}
    </div>
  """
  modalDOMContent = if content? then modalDOMContent else ''

  modalDOMFooter = '<div class="modal-footer">'
  buttonHandlers = []
  modalParams.buttons.forEach (button) ->
    buttonDataType = ' data-'+button.type+'="modal"'  if button.type?
    buttonStyle = if button.style? then button.style else 'btn-default'
    buttonBind = if button.bind? then ' data-bind="'+button.bind+'"' else ''
    modalDOMFooter += '<button type="button" class="btn '+buttonStyle+'"'+buttonDataType+buttonBind+'>'+button.text+'</button>'
    buttonHandlers.push button.type  if button.type? and button.type isnt 'dismiss' and button.type isnt 'submit'
    return
  modalDOMFooter += '</div>'
  modalDOMFooter += '</div>'

  modalDOMFooter = if modalParams.hasFooter? and modalParams.hasFooter is true then modalDOMFooter else ''
  modalKbClose = if modalParams.noClose? and modalParams.noClose is true then '' else ' keyboard'

  modalDom = """
  <div class="modal fade#{modalKbClose}" id="modal_#{modalId}" tabindex="-1" role="dialog" aria-labelledby="ModalLabel_#{modalId}" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        #{modalDOMHeader}
        #{modalDOMContent}
        #{modalDOMFooter}
      </div>
    </div>
  </div>
  """

  modalContainer = @__getContainer()
  modalContainer.append modalDom

  $('#modal_'+modalId+' [data-submit="modal"]').click ->
    $('#modal_'+modalId).attr 'data-interaction', 'submit'
    $('#modal_'+modalId).modal 'toggle'
    if callback isnt null and typeof callback isnt 'string' and typeof callback isnt 'number' and typeof callback isnt 'boolean'
      if $('#modal_'+modalId+' .form-input').length is 1
        output = $('#modal_'+modalId+' .form-input').val()
      else
        ci = 0
        max = $('#modal_'+modalId+' .form-input').length
        output = {}
        while ci < max
          element = $('#modal_'+modalId+' .form-input').eq(ci)
          output[element.attr('name')] = element.val()
          ci++

      callback(output)  if typeof callback is 'function'
      callback.submit(output)  if typeof callback is 'object' and callback.submit?
    return

  $('#modal_'+modalId+' [data-dismiss="modal"]').click ->
    $('#modal_'+modalId).attr 'data-interaction', 'dismiss'
    $('#modal_'+modalId).modal 'toggle'
    if callback isnt null and typeof callback isnt 'string' and typeof callback isnt 'number' and typeof callback isnt 'boolean'
      callback.dismiss()  if typeof callback is 'object' and callback.dismiss?
    return

  buttonHandlers.forEach (handler) ->
    $('#modal_'+modalId+' [data-'+handler+'="modal"]').click ->
      $('#modal_'+modalId).attr 'data-interaction', handler
      $('#modal_'+modalId).modal 'toggle'
      if callback isnt null and typeof callback isnt 'string' and typeof callback isnt 'number' and typeof callback isnt 'boolean'
        callback[handler]()  if typeof callback is 'object' and callback[handler]?
    return

  '#modal_' + modalId

# --- modal displayer ---
ModalBuilder::show = (modalId, onloadCallback = false, oncloseCallback = false) ->
  $(modalId).modal('show').on 'shown.bs.modal', (e) ->
    $(modalId).find('input').eq(0).focus()
    if onloadCallback isnt false
      onloadCallback modalId
    return

  $(modalId).on 'hide.bs.modal', (e) ->
    $(modalId).find('input').eq(0).focus()
    if oncloseCallback isnt false
      oncloseCallback modalId, e
    return

  return

# --- modal hider ---
ModalBuilder::hide = (modalId) ->
  $(modalId).modal 'hide'
  return

# --- combined modal builder with displayer ---
ModalBuilder::modal = (title, content, callback, params = false) ->
  modalId = @buildModal title, content, callback, params
  if typeof params.onloadCallback is 'function' and typeof params.oncloseCallback is 'function'
    @show modalId, params.onloadCallback, params.oncloseCallback
  else if typeof params.onloadCallback is 'function'
    @show modalId, params.onloadCallback
  else
    @show modalId
  modalId

# --- modal-powered alert box ---
ModalBuilder::alert = (title, content) ->
  modalId = @modal title, content, null,
    hasTitle: title?
    buttons: [
      {
        text: 'Ok'
        type: 'submit'
        style: 'btn-primary'
      }
    ]
  modalId

# --- modal-powered confirm box ---
ModalBuilder::confirm = (title, content, callback) ->
  modalId = @modal title, content, callback,
    hasTitle: title?
    buttons: [
      {
        text: 'Cancel'
        type: 'dismiss'
        style: 'btn-standard'
      }
      {
        text: 'Ok'
        type: 'submit'
        style: 'btn-primary'
      }
    ]
  modalId

# --- modal-powered prompt box ---
ModalBuilder::prompt = (title, content, callback, params = false) ->
  placeholderText = if params.placeholder? then params.placeholder else 'Text input'
  inputBind = if params.inputBind? then ' data-bind="'+params.inputBind+'"' else ''
  promptContent = """
    <div class="form-group">
      <p>#{content}</p>
      <input type="text" class="form-control form-input" placeholder="#{placeholderText}" autofocus="autofocus"#{inputBind}>
    </div>
  """
  modalId = @modal title, promptContent, callback,
    hasTitle: title?
    buttons: [
      {
        text: 'Cancel'
        type: 'dismiss'
        style: 'btn-standard'
        bind: if params.cancelBind? then params.cancelBind else null
      }
      {
        text: 'Ok'
        type: 'submit'
        style: 'btn-primary'
        bind: if params.confirmBind? then params.confirmBind else null
      }
    ]
  modalId

# --- html-filled modal ---
ModalBuilder::html = (title, content, callback, params = false) ->
  modalContent = content
  modalButtons = if params.buttons? then params.buttons else [
    {
      text: 'Cancel'
      type: 'dismiss'
      style: 'btn-standard'
    }
    {
      text: 'Ok'
      type: 'submit'
      style: 'btn-primary'
    }
  ]
  modalId = @modal title, modalContent, callback,
    hasTitle: title?
    buttons: modalButtons
    onloadCallback: (if params.onloadCallback? then params.onloadCallback else null)
  modalId

# --- internal stuff ---
# --- pseudo-random id generator ---
ModalBuilder::__getModalId = ->
  Math.floor(Math.random() * 101) + Math.floor(Math.random() * 101)

# --- container fetcher ---
# this one could be tweaked a bit, though - e.g. could check for container visibility
ModalBuilder::__getContainer = ->
  container = if $('.container:visible').length isnt 0 then $('.container:visible') else $('.container-fluid:visible')
  if container.length is 0
    container = $('body')

  if container.length is 1
    return container
  else
    heights = []
    container.each (count) ->
      item =
        order: count
        height: $(@).height()
      heights.push item
      return
    sortedHeights = heights.sort (a, b) ->
      a.height < b.height
    return container.eq sortedHeights[0].order
