import Component from "../../modules/component";
import twig from "./template.twig"

import fs from "fs"

export default (class GithubUserFavorites extends Component{

    constructor(element){
        super(element);
        this.favorites = {};
        
        this.listen('favorites-save', this.onSave.bind(this));
        this.listen('favorites-load', this.onLoad.bind(this));
        
    }

    get viewModel(){
        return {favorites: this.favorites}
    }

    add(user){
        console.log(this.favorites)
        this.favorites[user.login] = user;
        //Convert String to Object - JSON.Parse 
        // https://javascript.info/json#json-parse
        
        localStorage.setItem('gitUserList', JSON.stringify(this.favorites));
        
        this.render();
    }
	
	
	
	onLoad(){
      console.log('Load was clicked on');
      let loc = './favourites.save'
      fs.readFile(loc, 'utf8', (err, data) => {
          if (err) throw err;
          //Local storage load for further use
          localStorage.setItem('gitUserList', data);
          //Change Favourites object content for .twigg
          this.favorites = JSON.parse(data);
          //render the favourites based on the parsed data
          this.render();
      });
    }
	
	
	
	onSave(){
      console.log('onSave event loaded');
      let favSaved = localStorage.getItem('gitUserList')
      let loc = './favourites.save'
      fs.writeFile(loc, favSaved, function(err) {
          if(err) {
              return console.log(err);
          }
          console.log("The file was saved!");
      });
    }

    
	
    onRender(){
        this.$$('user').on.click((event, target)=>{
            let login = target.dataset.login;
            delete this.favorites[login];
            // menteni
            localStorage.setItem('gitUserList', JSON.stringify(this.favorites));
             
            this.render();
        });
    }

}).register(twig, 'github-user-favorites');