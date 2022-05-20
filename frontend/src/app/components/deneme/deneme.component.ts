import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-deneme',
  templateUrl: './deneme.component.html',
  styleUrls: ['./deneme.component.scss']
})
export class DenemeComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
  }

}
