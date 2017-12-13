import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

/*
  Generated class for the ListsServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ListsServiceProvider {

  private database: SQLiteObject;
  //initially set dbReady status to false
  private dbReady = new BehaviorSubject<boolean>(false);

  constructor(private platform:Platform, private sqlite:SQLite) {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'miscuentas.db',
        location: 'default'
      }).then((db:SQLiteObject) => {
        this.database = db;
        this.createTables().then(() => {     
          //we loaded or created tables, so, set dbReady to true
          this.dbReady.next(true);
        });
      })

    });
  }

  private createTables(){

    return this.database.executeSql(
      `CREATE TABLE IF NOT EXISTS list (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        date_list DATE,
        status INTEGER
      );`
    ,{})
    .then(()=>{
      return this.database.executeSql(
      `CREATE TABLE IF NOT EXISTS item (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT,
        price INTEGER,
        listId INTEGER,
        FOREIGN KEY(listId) REFERENCES list(id)
        );`,{} )
    }).catch((err)=>console.log("error detected creating tables", err));

  }

  private isReady(){
    return new Promise((resolve, reject) =>{
      if(this.dbReady.getValue()){ //if dbReady is true, resolve
        resolve();
      }else{ //otherwise, wait to resolve until dbReady returns true
        this.dbReady.subscribe((ready)=>{
          if(ready){ 
            resolve(); 
          }
        });
      }  
    })
  }

  getAllLists(){
    return this.isReady()
    .then(() => {
      return this.database.executeSql("SELECT list.id, list.name, list.date_list, list.status, SUM(item.price) AS total FROM LIST LEFT JOIN item ON list.id = item.listId GROUP BY list.id ORDER BY list.id DESC", [])
      .then((data) => {
              console.log(data);        
        let lists = [];
        for(let i=0; i<data.rows.length; i++){
          lists.push(data.rows.item(i));
        }
        return lists;
      })
    })
  }

  addList(name:string){
    //var today: number = Date.now();
    return this.isReady()
    .then(() => {
      return this.database.executeSql(`INSERT INTO list(name, date_list, status) VALUES (?, ? ,?);`, [name, Date.now(), 0]).then((result)=>{
        if(result.insertId){
                console.log(result);
          return this.getList(result.insertId);
        }
      })
    });    
  }

  getList(id:number){
    return this.isReady()
    .then(() => {
      return this.database.executeSql(`SELECT * FROM list WHERE id = ${id}`, [])
      .then((data) => {
        if(data.rows.length){
          return data.rows.item(0);
        }
        return null;
      })
    })    
  }

  updateList(name:string, id:number){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`UPDATE list 
        SET name = ? 
        WHERE id = ?`, 
        [name, id]);
    });       
  }

  completeList(id:number){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`UPDATE list 
        SET status = ? 
        WHERE id = ?`, 
        [1, id]);
    }); 
  }

  deleteList(id:number){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`DELETE FROM list WHERE id = ${id}`, [])
      .then((data)=>{
        if(data){
          return this.deleteItemsList(id);
        }
      })
    });
  }

  deleteItemsList(id:number){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`DELETE FROM item WHERE listId = ${id}`, [])
    })    
  }

  getAllItems(listId:number){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`SELECT * from item WHERE listId = ${listId} ORDER BY id DESC`, [])
      .then((data)=>{
        let items = [];
        for(let i=0; i<data.rows.length; i++){
          let todo = data.rows.item(i);
          items.push(todo);
        }
        return items;
      })
    })
  }

  addItem(model, listId:number){
    var price = model.price == '' ? 0 : model.price;
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`INSERT INTO item 
        (name, description, price, listId) VALUES (?, ?, ?, ?);`, 
        [model.name, model.description, price, listId]).then((result)=>{
        if(result.insertId){
          return this.getItem(result.insertId);
        }
      })
    });    
  }

  getItem(id:number){
    return this.isReady()
    .then(() => {
      return this.database.executeSql(`SELECT * FROM item WHERE id = ${id}`, [])
      .then((data) => {
        if(data.rows.length){
          return data.rows.item(0);
        }
        return null;
      })
    })    
  }

  editItem(model, id:number){
    var price = model.price == '' ? 0 : model.price;
    
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`UPDATE item 
        SET name = ?, 
            description = ?,
            price = ? 
        WHERE id = ?`, 
        [model.name, model.description, price, id]);
    });       
  }

  deleteItem(id:number){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`DELETE FROM item WHERE id = ${id}`, [])
    })    
  }

}
