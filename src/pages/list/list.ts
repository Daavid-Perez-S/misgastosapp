import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ActionSheetController, LoadingController, Events } from 'ionic-angular';

import { ItemListPage } from '../item-list/item-list';
import { ListsServiceProvider } from '../../providers/lists-service/lists-service';
import { ListModel } from '../../providers/lists-service/list-model';

/**
 * Generated class for the ListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {

  public lists:any[] = [];

  totalL:number = 0;
  id:number = null;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl:LoadingController,
    public actionSheetCtrl: ActionSheetController,
    public events: Events,
    public listsServiceProvider: ListsServiceProvider) {
    this.getAllLists();
    events.subscribe('list:total', (total, id) => {
      this.totalL = total;
      this.id = id ;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListPage');
  }

  public getAllLists(){
    return this.listsServiceProvider.getAllLists()
    .then((data:any) =>{
      console.log(data);
        let localLists:any[] = [];
        if(data){
          for(let list of data){
            localLists.push(new ListModel(list.id, list.name, list.date_list, list.status, list.total));
          }
        }
        this.lists = localLists;
    }).catch( error => {
      console.error( error );
    });
  }

  showItemOptions(list){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Modify your list',
      buttons: [
        {
          text: 'Edit',
          handler: () => {
            console.log('Edit clicked');
            this.editList(list);
          }
        },{
          text: 'Complete',
          handler: () => {
            console.log('Completed clicked');
            this.completedList(list);
          }
        },{
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            console.log('Delete clicked');
            this.deleteList(list);
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  editList(list){
    let addListAlert = this.alertCtrl.create({
      title: 'Edit list',
      message: 'Give a new name to edit list.',
      inputs: [
        {
          name: 'name',
          value: list.name,
          placeholder: 'Name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {}
        },
        {
          text: 'Edit',
          handler: data => {
            let navTransition = addListAlert.dismiss();
            navTransition.then(()=>{
              this.listsServiceProvider.updateList(data.name, list.id)
              .then(response => {
                //update list of items, and then return the added list
                return this.getAllLists().then(()=>{
                  return response;
                })
              }).catch(error => {
                console.error( error );
              });
            });
          }
        }
      ]
    });
    addListAlert.present();
  }

  completedList(list){
    let alert = this.alertCtrl.create({
      title: 'Confirm purchase',
      message: 'Do you want to completed this list?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Complete',
          handler: () => {
            this.listsServiceProvider.completeList(list.id)
            .then(response => {
              //update list of items, and then return the added list
              return this.getAllLists().then(()=>{
                return response;
              })
            }).catch(error => {
              console.error( error );
            });
          }
        }
      ]
    });
    alert.present();
  }

  deleteList(list){
    let alert = this.alertCtrl.create({
      title: 'Confirm purchase',
      message: 'Do you want to deleted this list?',
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
            this.listsServiceProvider.deleteList(list.id)
            .then(response => {
              return this.getAllLists().then(()=>{
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

  showAddList(){
    let addListAlert = this.alertCtrl.create({
      title: 'New list',
      message: 'Give a name to the new list.',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name',
          type: 'text'

        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {}
        },
        {
          text: 'Add',
          handler: data => {
            let navTransition = addListAlert.dismiss();
            navTransition.then(()=>{this.addNewList(data.name)});
          }
        }
      ]
    });
    addListAlert.present();
  }

  addNewList(name:string){
    let loader = this.loadingCtrl.create();
    loader.present().then(()=>{
      return this.listsServiceProvider.addList(name)
      .then(response => {
        //update list of items, and then return the added list
        return this.getAllLists().then(()=>{
          loader.dismiss();
          return response;
        })
      }).catch(error => {
        console.error( error );
        loader.dismiss();
      });
    });
  }

  goToItemList(list){
    this.navCtrl.push(ItemListPage, { name: list.name, status: list.status, listId: list.id });
  }

}
