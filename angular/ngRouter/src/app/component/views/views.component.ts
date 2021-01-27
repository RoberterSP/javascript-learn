import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'my-views',
  templateUrl: './views.component.html',
  styleUrls: ['./views.component.less']
})
export class ViewsComponent implements OnInit {
  public title:string = 'title'
  public msg:string = 'msg'
  public isShow:Boolean = true
  public content = '<h3>解析这里面的值</h3>'
  public ngSwitch = 1
  public username:object = {
    username: 'zhansan'
  }
  public date = new Date()
  public cars:any[] = [
    {
      name: 'ceshi',
      data: {
        price: 12,
        module: 'large',
        important: true
      }
    },
    {
      name: 'demo',
      data: {
        price: 'demo',
        module: 'large',
        important: true
      }
    }
  ]

  constructor() {
    this.title = "change title value"
  }
  run () {
    setInterval (()=> {
      this.date = new Date()
    },1000)
  }
  keydown (e) {
    if (e.keyCode === 13) {
      this.run()
    } else {
      clearInterval()
    }
  }

  ngOnInit(): void {
  }

}
