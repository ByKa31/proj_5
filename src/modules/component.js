import registry from "./component-registry";
import AppEvent from "./app-event";
import Finder from "./finder";

export default class Component{

	/**
	 * This static method registers our component in the registry object
	 * It returns the class itself, so it is "chainable"
	 * @param twig
	 * @param tag
	 * @returns {Component}
	 */
    static register(twig, tag){
        this.twig = twig;
        this.tag = tag;
        registry.register(this, tag);
        return this;
    }

    /**
     * @param {HTMLElement} element 
     */
    static bind(element){
        // we create our component
        let component = new this(element);
        // and returns it's reference
        return component;
    }

    /**
     * this is the constructor of our component
     * 
     * @param {HTMLElement} element 
     */
    constructor(element){
        // first we store the element our component working with
        this.element = element;
        // attach the elements dataset to the component
        this.dataset = element.dataset;
        // we set this component as component property of the html element
        element.component = this;
        // we set two css classes to the element, to easily identify it later
        element.classList.add('component')
        element.setAttribute('component', 'component')
        element.classList.add(this.constructor.tag);
    }

    /**
     * this getter generates our viewmodel, it should be overwritten
     */
    get viewModel(){ return {}; }

    /**
     * this method renders our content
     */
    render(){
        // get the viewmodel
        let viewModel = this.viewModel;
        // make viewmodel as a promise if it was not it.
        // we will need it in the future, if the viewmodel runs and async functions
        // and the rendereing process must wait for it to finish
        if(!(viewModel instanceof Promise)) viewModel = Promise.resolve(viewModel);

        // so our viewmodel is now a promise, its okay to call it's then method
        viewModel
            .then(viewModel=>{
                // when we got the viewmodel, we replace our elements content
                // with the twig templates output rendered with the viewmoodel
                this.element.innerHTML = this.constructor.twig(this.viewModel);
                // we pass the viewModel to the next stem
                return viewModel;
            }).
            then((viewModel)=>{
                // right after it finished, we call the "onRender" method
                // and maybe it needs our viewModel, so we pass it
                this.onRender(viewModel);
            })
    }

    /**
     * this method is beeing called right after the rendering, it should be overwritten
     * @param {object} viewModel 
     */
    onRender(viewModel){}

//#region event handling

	/**
	 * @param {string | Array<string>} event
	 * @param {Function} handler
	 */
    listen(event, handler) { 
        AppEvent.listen(event, handler, this.element); 
    }

	/**
	 * @param {string} event
	 * @param {*} data
	 * @param {HTMLElement|[HTMLElement]} target
	 */
	message(event, data, target){
		if(!Array.isArray(target)) target = [target];
		target.forEach(target=>AppEvent.fire(event, data, {bubbles:false, cancelable: true}, target));
   }

	/**
	 * @param {string} event
	 * @param {*} data
	 * @param {{bubbles:boolean, cancelable: boolean}} options
	 */
	fire(event, data = null, options = {bubbles: true, cancelable: true}) { 
        AppEvent.fire(event, data, options, this.element);
    }
//#endregion

//#region finder
	/**
	 * @param {string|null} selector
	 * @param {Function} func
	 * @returns {BrickFinder}
	 */
	$(selector = null, func = null) { return new Finder(selector, this.element, this, func); }
	/**
	 * @param {string} role
	 * @param {Function} func
	 * @returns {BrickFinder}
	 */
	$$(role, func = null) { return new Finder('[\\(' + role + '\\)], [actor\\:' + role + ']', this.element, this, func);}
	actor(role) {
		this.root.setAttribute('actor:' + role, "")
	}
//#endregion
}
