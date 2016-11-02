/**
 * The Layer Typing Indicator widget renders a short description of who is currently typing into the current Conversation.
 *
 * This is designed to go inside of the layerUI.Conversation widget.
 *
 * The simplest way to customize the behavior of this widget is using the `layer-typing-indicator-change` event.
 *
 * @class layerUI.components.Conversation.TypingIndicator
 * @extends layerUI.components.Component
 */

/**
 * Custom handler to use for rendering typing indicators.
 *
 * By calling `evt.preventDefault()` on the event you can provide your own custom typing indicator text to this widget:
 *
 * ```javascript
 * document.body.addEventListener('layer-typing-indicator-change', function(evt) {
 *    evt.preventDefault();
 *    var widget = evt.target;
 *    var typingUsers = evt.detail.typing;
 *    var pausedUsers = evt.detail.paused;
 *    var text = '';
 *    if (typingUsers.length) text = typingUsers.length + ' users are typing';
 *    if (pausedUsers.length && typingUsers.length) text += ' and ';
 *    if (pausedUsers.length) text += pausedUsers.length + ' users have paused typing';
 *    widget.value = text;
 * });
 * ```
 *
 * Note that as long as you have called `evt.preventDefault()` you can also just directly manipulate child domNodes of `evt.detail.widget`
 * if a plain textual message doesn't suffice.
 *
 * @event layer-typing-indicator-change
 * @param {Event} evt
 * @param {layer.Identity[]] evt.detail.typing
 * @param {layer.Identity[]] evt.detail.paused
 */
var LUIComponent = require('../../../components/component');
LUIComponent('layer-typing-indicator', {
  properties: {
    /**
     * The Conversation whose typing indicator activity we are reporting on.
     *
     * @property {layer.Conversation}
     */
    conversation: {
      set: function(value){
        this.client = value.getClient();
        if (value) {
          var state = this.client.getTypingState(value);
          this.rerender({
            conversationId: value.id,
            typing: state.typing,
            paused: state.paused
          });
        } else {
          this.value = '';
        }
      }
    },

    /**
     * The Client we are connected with; we need it to receive typing indicator events from the WebSDK.
     *
     * This property is typically set indirectly by setting the layerUI.TypingIndicator.conversation.
     * @property {layer.Client}
     */
    client: {
      set: function(client) {
        client.on('typing-indicator-change', this.rerender.bind(this));
      }
    },

    /**
     * The value property is the text/html being rendered.
     *
     * @property {String}
     */
    value: {
      set: function(text) {
        this.nodes.panel.innerHTML = text || '';
        this.classList[text ? 'add' : 'remove']('layer-typing-occuring');
      }
    }
  },
  methods: {

    /**
     * Constructor.
     *
     * @method created
     * @private
     */
    created: function() {

    },

    /**
     * Whenever there is a typing indicator event, rerender our UI
     *
     * @method
     * @param {layer.LayerEvent} evt
     */
    rerender: function(evt) {

      // We receive typing indicator events for ALL Conversations; ignore them if they don't apply to the current Conversation
      if (evt.conversationId === this.conversation.id) {

        // Trigger an event so that the application can decide if it wants to handle the event itself.
        var customEvtResult = this.trigger('layer-layer-typing-indicator-change', {
          typing: evt.typing,
          paused: evt.paused,
          widget: this
        });

        // If the app lets us handle the event, set the value of this widget to something appropriate
        if (customEvtResult) {
          var names = evt.typing.map(function(user) {return user.displayName});
          switch(names.length) {
            case 0:
              this.value = '';
              break;
            case 1:
              this.value = names.join(', ') + ' is typing';
              break;
            default:
              this.value = names.join(', ').replace(/, ([^,]*)$/, " and $1") + ' are typing';
          }
        }
      }
    }
  }
});
