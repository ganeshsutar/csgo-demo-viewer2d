import { Component, Input, OnInit } from '@angular/core';

const GrenadeImageFilenames = {
  'models/Weapons/w_eq_flashbang_dropped.mdl': 'assets/weapons/flashbang.svg',
  'models/Weapons/w_eq_incendiarygrenade_dropped.mdl': 'assets/weapons/incgrenade.svg',
  'models/Weapons/w_eq_smokegrenade_thrown.mdl': 'assets/weapons/smokegrenade.svg',
  'models/Weapons/w_eq_molotov_dropped.mdl': 'assets/weapons/molotov.svg',
  'models/Weapons/w_eq_fraggrenade_dropped.mdl': 'assets/weapons/hegrenade.svg'
};

@Component({
  selector: 'svg:g[app-projectile]',
  templateUrl: './projectile.component.html',
  styleUrls: ['./projectile.component.scss']
})
export class ProjectileComponent implements OnInit {
  @Input() public x: number = 0;
  @Input() public y: number = 0;
  @Input() public utilityModel: string = '';

  constructor() { }

  ngOnInit(): void { }

  get imageUrl(): string {
    return GrenadeImageFilenames[this.utilityModel];
  }

}
