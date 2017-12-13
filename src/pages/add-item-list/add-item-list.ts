import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { ListsServiceProvider } from '../../providers/lists-service/lists-service';

/**
 * Generated class for the AddItemListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-add-item-list',
  templateUrl: 'add-item-list.html',
})
export class AddItemListPage {

  model = {
    name: '',
    description: '',
    price: ''
  };
  
  listId:number = null;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public listsServiceProvider: ListsServiceProvider) {
    
    this.listId = navParams.get('listId');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddItemListPage');
  }

  addItemList(){
    return this.listsServiceProvider.addItem(this.model, this.listId)
      .then(response => {
        this.viewCtrl.dismiss(response);        
      }).catch(error => {
        console.error( error );
      });
  }  

}
