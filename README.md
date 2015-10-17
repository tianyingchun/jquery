Jquery
==========
the components library based on jquery

Provider all bussiness needs components encapsolute based on jquery (cmd)
----------

The usage of `Component` and `Widget` using `Dropdown` Component as example.
----------
- method1: new Dropdown($dropdownElement, options); // programing manully instance.
- method2: <div data-dropdown='{"modalClose": true}'>dropdown trigger</div> (in the most case)
- method3: $('[data-dropdown]').dropdown('open') invoke 'open' method of dropdownInstance.
- method4: $('[data-dropdown]').dropdown(options) options is config of plugin.

Note: based on above code instanced. we can invoke  $('[data-dropdown]').getInstance(`pluginName`) to get Component/Widget instance. the `pluginName` is optional, if you have mutil behavior plugin or widget has bound on this DOMNode, the pluginName is required.

