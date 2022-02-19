import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

const weaponFiles = {
  'C4 Explosive': 'c4.svg',
  'Knife': 'knife.svg',
  'Zeus': 'taser.svg',
  'Shield': 'shield.svg',
  'Bump Mines': 'bumpmine.svg',
  'C4 Explosive by remote': 'breachcharge.svg',
  'Decoy Grenade': 'decoy.svg',
  'Flashbang': 'flashbang.svg',
  'Medi-Shot': 'healthshot.svg',
  'High Explosive Grenage': 'hegrenade.svg',
  'Incendiary Grenade': 'incgrenade.svg',
  'Molotov': 'molotov.svg',
  'Smoke Grenade': 'smokegrenade.svg',
  'Tactical Awareness Grenade': 'tagrenade.svg',
  'M249': 'm249.svg',
  'MAG-7': 'mag7.svg',
  'Negev': 'negev.svg',
  'Nova': 'nova.svg',
  'Sawed-off': 'sawedoff.svg',
  'XM1014': 'xm1014.svg',
  'CZ75-Auto': 'cz75a.svg',
  'Desert Eagle': 'deagle.svg',
  'Dual Berettas': 'elite.svg',
  'Five-SeveN': 'fiveseven.svg',
  'Glock-18': 'glock.svg',
  'P2000': 'hkp2000.svg',
  'P250': 'p250.svg',
  'R8 Revolver': 'revolver.svg',
  'Tec-9': 'tec9.svg',
  'USP-S': 'usp_silencer.svg',
  'AK-47': 'ak47.svg',
  'AUG': 'aug.svg',
  'AWP': 'awp.svg',
  'FAMAS': 'famas.svg',
  'G3SG1': 'g3sg1.svg',
  'Galil AR': 'galilar.svg',
  'M4A4': 'm4a1.svg',
  'M4A1-S': 'm4a1_silencer.svg',
  'SCAR-20': 'scar20.svg',
  'SG 553': 'sg556.svg',
  'ssg 08': 'ssg08.svg',
  'PP-Bizon': 'bizon.svg',
  'MAC-10': 'mac10.svg',
  'MP5-SD': 'mp5sd.svg',
  'MP7': 'mp7.svg',
  'MP9': 'mp9.svg',
  'P90': 'p90.svg',
  'UMP-45': 'ump45.svg',
};

const primaryWeapons = [
  'M249','MAG-7','Negev','Nova','Sawed-off','XM1014',
  'AK-47','AUG','AWP','FAMAS','G3SG1','Galil AR','M4A4',
  'M4A1-S','SCAR-20','SG 553','ssg 08','PP-Bizon','MAC-10',
  'MP5-SD','MP7','MP9','P90','UMP-45'
];

const secondaryWeapons = [
  'CZ75-Auto','Desert Eagle','Dual Berettas',
  'Five-SeveN','Glock-18','P2000','P250','R8 Revolver','Tec-9','USP-S'
];

@Component({
  selector: 'app-player-info-card',
  templateUrl: './player-info-card.component.html',
  styleUrls: ['./player-info-card.component.scss']
})
export class PlayerInfoCardComponent implements OnInit, OnChanges {
  @Input() public playerInfo: any = {
    name: '',
    team: 2
  };

  @Input() public blockAlign: string = 'left';

  @Input() public playerState: any = {
    userId: 0,
    x: 0,
    y: 0,
    yaw: 0,
    team: 2,
    isAlive: true,
    hasC4: false,
    health: 0,
    armor: 0,
    helmet: false,
    weapon: "",
    weapons: [],
    kills: 0,
    deaths: 0,
    lifeState: 0
  };

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.playerState);
  }

  ngOnInit(): void {
  }

  get hasPrimary(): boolean {
    return this.playerState.weapons.filter((item) => {
      return primaryWeapons.includes(item.itemName);
    }).length > 0;
  }

  get hasSecondary(): boolean {
    return this.playerState.weapons.filter((item) => {
      return secondaryWeapons.includes(item.itemName);
    }).length > 0;
  }

  get primary(): any {
    return this.playerState.weapons.find((item) => {
      return primaryWeapons.includes(item.itemName);
    });
  };

  get secondary(): any  {
    return this.playerState.weapons.find((item) => {
      return secondaryWeapons.includes(item.itemName);
    });
  }

  getWeaponFileName(itemName: string): string {
    return `assets/weapons/${weaponFiles[itemName]}`;
  }

  get nades(): string[] {
    const nades = ['Smoke Grenade', 'High Explosive Grenade', 'Incendiary Grenade', 'Molotov', 'Flashbang'];
    const weaponNades = this.playerState.weapons.filter((weapon) => {
      return nades.includes(weapon.itemName);
    });
    weaponNades.sort((a, b) => {
      if(a.itemName == b.itemName) {
        return 0;
      }
      return (a.itemName > b.itemName) ? 1 : -1;
    });
    return weaponNades;
  }

}
