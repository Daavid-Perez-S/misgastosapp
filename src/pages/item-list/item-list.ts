import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController, Events } from 'ionic-angular';

import { AddItemListPage } from '../add-item-list/add-item-list';
import { EditItemListPage } from '../edit-item-list/edit-item-list';

import { ListsServiceProvider } from '../../providers/lists-service/lists-service';
import { ItemModel } from '../../providers/lists-service/item-model';


/**
 * Generated class for the ItemListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-item-list',
  templateUrl: 'item-list.html',
})
export class ItemListPage {

  public items:any[] = [];

  name:string = "";
  status:number = null;
  listId:number = null;
  totalList:number = 0;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public events: Events,
    public listsServiceProvider: ListsServiceProvider) {
    
    this.name = navParams.get('name');
    this.status = navParams.get('status');
    this.listId = navParams.get('listId');

    this.getAllItems(this.listId);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemListPage');
  }

  public getAllItems(listId){
    return this.listsServiceProvider.getAllItems(listId)
    .then((data:any) =>{
          let localItems:any[] = [];
          if(data){
            for(let item of data){
              localItems.push(new ItemModel(item.name, item.description, item.price, item.id));
              this.totalList = this.totalList + item.price;
            }
            this.events.publish('list:total', this.totalList, listId);
          }
          this.items = localItems;
    }).catch( error => {
      console.error( error );
    });
  }

  showAddItemList(listId){
    let myModal = this.modalCtrl.create(AddItemListPage, { listId: listId });
    myModal.onDidDismiss(response => {
      this.totalList = 0;
      return this.getAllItems(listId).then(()=>{
        return response;
      })
    });
    myModal.present();
  }

  editItem(item){
    let myModal = this.modalCtrl.create(EditItemListPage, { name: item.name, description: item.description, price: item.price, id: item.id  });
    myModal.onDidDismiss(response => {
      this.totalList = 0;
      return this.getAllItems(this.listId).then(()=>{
        return response;
      })
    });
    myModal.present();
  }

  deleteItem(item){
    let alert = this.alertCtrl.create({
      title: 'Confirm purchase',
      message: 'Do you want to deleted this item?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            console.log('Delete clicked');
            this.listsServiceProvider.deleteItem(item.id)
            .then(response => {
              this.totalList = 0;
              return this.getAllItems(this.listId).then(()=>{
                return response;
              })
            })
            .catch( error => {
              console.error( error );
            })
          }
        }
      ]
    });
    alert.present();
  }
}
