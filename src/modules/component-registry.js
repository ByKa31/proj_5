class ComponentRegistry{

    constructor(){
        // creates a component registry
        this.componentRegistry = {};
    }

    /**
     * This method handles the DOM changes
     */
    onMutation(){
        // searches elements which has is attribute, but not has the component attribute.
        document.querySelectorAll("[is]:not([component])").forEach(node=>{
            let tag = node.getAttribute('is');
            // if the is attribute contains a known tag, it calls the bind method of our component
            if(this.componentRegistry.hasOwnProperty(tag)){
                this.componentRegistry[tag].bind(node).render();
            }
        });
    }

    /**
     * This must be called once, when your application is loaded
     */
    listen(){
        // creates a mutation observer
        let observer = new MutationObserver((event)=>this.onMutation());
        observer.observe(document.body, { childList:true, subtree:true });
        // call the onMutation event handler once manually, to initialize the initial tags
        this.onMutation();
    }

    /**
     * This method is called from the components, self registrar method.
     * @param component
     * @param tag
     */
    register(component, tag){
        this.componentRegistry[tag] = component;
        component.tag = tag
    }

}

let registry = new ComponentRegistry();
export default registry;