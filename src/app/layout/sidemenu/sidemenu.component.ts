import { Component, OnInit } from '@angular/core';
import { Client, Dashboard, Employee, Index } from 'src/providers/constants';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-sidemenu',
    templateUrl: './sidemenu.component.html',
    styleUrls: ['./sidemenu.component.scss'],
    standalone: true,
    imports: [NgClass, RouterLinkActive, RouterLink]
})
export class SidemenuComponent implements OnInit {
  Menu: Array<any> = [];

  ngOnInit(): void {
    this.Menu = [{
      IsActive: true,
      Name: "Administration",
      ParentDetail: {
        Catagory : "Administration",
        Childs: null,
        Icon: "fa-brands fa-fort-awesome"
      },
      Value: [{
        Link: Index,
        Catagory: "Home",
        Icon: "fa-solid fa-home"
      },{
        Link: Dashboard,
        Catagory: "Dashboard",
        Icon: "fa-solid fa-gauge-high"
      }, {
        Link: Employee,
        Catagory: "Employee",
        Icon: "fa-solid fa-id-card"
      }, {
        Link: Client,
        Catagory: "Client",
        Icon: "fa-regular fa-building"
      }]
    }]
  }

  toogle(e: any) {
    let index = Number(e.currentTarget.getAttribute("data-index"));
    let elem = document.querySelectorAll(".accordion-item-header");
    elem.forEach(x => {
      let i = Number(x.getAttribute("data-index"));
      if (x.classList.contains("active") && i != index) {
        x.classList.toggle("active");
        let nextSibling = x.nextElementSibling;
        (nextSibling as HTMLElement).style.maxHeight = '0px';
      }
    })
    let accordionItemHeader = e.currentTarget;
    accordionItemHeader.classList.toggle("active");
    const accordionItemBody = accordionItemHeader.nextElementSibling;
    let caret = document.getElementsByClassName("fa-caret-right");
    for (let i = 0; i < caret.length; i++) {
      if (caret[i].classList.contains("rotate-caret"))
      caret[i].classList.remove("rotate-caret");
    }
    if(accordionItemHeader.classList.contains("active")) {
      accordionItemBody.style.maxHeight = accordionItemBody.scrollHeight + "px";
      e.currentTarget.getElementsByClassName("fa-caret-right")[0].classList.add("rotate-caret");
    }
    else {
      accordionItemBody.style.maxHeight = 0;
      e.currentTarget.getElementsByClassName("fa-caret-right")[0].classList.remove("rotate-caret");
    }
  }

}
