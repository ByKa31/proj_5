// we are importing our components
import "./app.scss";
import "./component/*/component.js";
import "./component/*/style.scss";
import registry from "./modules/component-registry";

import AppEvent from "./modules/app-event";

// When the document loads, it calls the registry's listen method.
document.addEventListener('DOMContentLoaded', () => registry.listen())


// Create an empty menubar
var menu = new nw.Menu({type: 'menubar'});

// on mac we add builtin menus
menu.createMacBuiltin('GITHUB SEARCH')

// Create a submenu as the 2nd level menu
var submenu = new nw.Menu();
//submenu.append(new nw.MenuItem({label: 'Load'}));

submenu.append(new nw.MenuItem({label: 'Load',
  click: function() {
    //https://docs.nwjs.io/en/latest/References/Menu/
    console.log("Load menü megnyomva");
    //Broadcasting the load event to github-user-favorites/components.js
    AppEvent.broadcast('favorites-load');
  }
}));


//submenu.append(new nw.MenuItem({label: 'Save'}));
submenu.append(new nw.MenuItem({label: 'Save',
  click: function() {
    console.log("Save menü megnyomva");
    //Broadcasting the Save event to github-user-favorites/components.js
    AppEvent.broadcast('favorites-save');

  }
}));







// Create and append the 1st level menu to the menubar
menu.append(new nw.MenuItem({label: 'Favorites', submenu: submenu}));

// Assign it to `window.menu` to get the menu displayed
nw.Window.get().menu = menu;