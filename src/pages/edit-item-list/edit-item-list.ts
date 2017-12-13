import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { ListsServiceProvider } from '../../providers/lists-service/lists-service';

/**
 * Generated class for the EditItemListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-edit-item-list',
  templateUrl: 'edit-item-list.html',
})
export class EditItemListPage {

  model = {
    name: '',
    description: '',
    price: ''
  };

  idItem:number = null;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public listsServiceProvider: ListsServiceProvider) {

    this.idItem = navParams.get('id');
    this.model.name = navParams.get('name');
    this.model.description = navParams.get('description');
    this.model.price = navParams.get('price');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditItemListPage');
  }

  editItemList(){
    return this.listsServiceProvider.editItem(this.model, this.idItem)
      .then(response => {
        this.viewCtrl.dismiss(response);    
      }).catch(error => {
        console.error( error );
      });
  }  

}
