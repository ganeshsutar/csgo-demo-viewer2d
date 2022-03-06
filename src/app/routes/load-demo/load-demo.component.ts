import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DemoParserService } from 'src/app/services/demo-parser.service';
import { DemoPlayerService } from 'src/app/services/demo-player.service';

@Component({
  selector: 'app-load-demo',
  templateUrl: './load-demo.component.html',
  styleUrls: ['./load-demo.component.scss']
})
export class LoadDemoComponent implements OnInit, OnDestroy {
  public loading = false;
  public progress = 0.0;
  public text: string = '';
  public filename = '';
  public subProgress: Subscription;
  public subLoading: Subscription;
  public subParsingText: Subscription;

  private loadedDem: any = null;

  constructor(private demoParser: DemoParserService,
    private demoPlayer: DemoPlayerService,
    private router: Router,
    private cdref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.subLoading = this.demoParser.parsing.subscribe((value) => {
      this.loading = value;
      this.cdref.detectChanges();
    });
    this.subProgress = this.demoParser.parsingProgress.subscribe((value) => {
      this.progress = value;
    });
    this.subParsingText = this.demoParser.progressText.subscribe((value) => {
      this.text =  value;
      this.cdref.detectChanges();
    });
    this.demoPlayer.removeOldDirectory().then(() => {
      this.demoPlayer.createDirectory();
    }).catch((err) => {
      // Ignore error and try creating directory
      this.demoPlayer.createDirectory();
    });
    
  }

  ngOnDestroy(): void {
    if(this.subLoading) this.subLoading.unsubscribe();
    if(this.subProgress) this.subProgress.unsubscribe();
    if(this.subParsingText) this.subParsingText.unsubscribe();
    if(this.loading) {
      this.onStopParsing();
    }
  }

  onLoadDemo(): void {
    this.demoParser.parseFile(this.filename).then((zip) => {
      const matchFilename = this.demoPlayer.getNewTempFile();
      this.loadedDem = zip;
      zip.saveZip(matchFilename);
      this.demoPlayer.loadDemoFile(matchFilename);
      this.router.navigateByUrl('/play-demo');
    }).catch((err) => {
      this.loadedDem = null;
    });
  }

  onLoadDemz(): void {
    this.demoPlayer.openDemoFile().then(() => {
      this.router.navigateByUrl('/play-demo');
    });
  }

  onOpenDemFile(): void {
    this.demoPlayer.openDemFile().then((data) => {
      console.log(data);
      if(data.canceled) return;
      const filePaths = data.filePaths;
      if(!filePaths || filePaths.length == 0) return;

      this.filename = filePaths[0];
    });
  }

  onStopParsing(): void {
    this.demoParser.cancelParsing();
  }

}
