import Component from "../../modules/component";
import twig from "./template.twig"
import "./style.scss";

export default (class GithubUserList extends Component{

    constructor(element){
        super(element);
        this.users = [];
    }

    search(keyword){
        this.keyword = keyword.trim();
        if(this.keyword){
            fetch("https://api.github.com/search/users?q=" + keyword)
            .then(res=>res.json())
            .then(users=>{
                this.users = users.items;
                this.render();
            });
        }
    }

    // we create our viewmodel
    get viewModel(){
        return {
            users: this.users
        };
    }

    onRender(){
        this.$$('user').on.click((event, target)=>{
            this.fire('ADD-TO-FAVORITES', this.users[target.dataset.index]);
        });
    }
}).register(twig, 'github-user-list');