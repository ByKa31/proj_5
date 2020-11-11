import Component from "../../modules/component";
import twig from "./template.twig"

export default (class GithubUserSearch extends Component{

    constructor(element){
        super(element);
        this.listen('ADD-TO-FAVORITES', this.addToFavorites.bind(this));
    }

    onRender(){
        this.$$('search').on.input((event, target)=>{
            this.$$('list').node.component.search(target.value);
        }, 300).node.focus()
    }

    addToFavorites(event){
        this.$$('favorites').node.component.add(event.data);
    }
}).register(twig, 'github-user-search');