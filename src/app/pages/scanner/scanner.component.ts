import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { AlertController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss'],
})
export class ScannerComponent implements OnInit, AfterViewInit {

  scanActive: boolean = false;

  constructor(private platform: Platform, private alertCtrl: AlertController) { }

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.platform.is('capacitor')) {
      BarcodeScanner.prepare();
    }
  }

  async scan() {
    if (this.platform.is('capacitor')) {
      console.log('Comenzando a escanear');
      const allowed = await this.checkPermisos();
      if (allowed) {
        this.scanActive = true;
        // console.log('Status permisos', allowed);
        const result = await BarcodeScanner.startScan();
        if (result.hasContent) {
          console.log(result.content);
          // this.dataLocalService.guardarRegistro(result.format,result.content);
          this.scanActive = false;
        }
      }
    } else {
      console.log('Corriendo en la web');
      // this.dataLocalService.guardarRegistro('http','https://www.google.cl');

    }
  }

  checkPermisos() {
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        resolve(true);
      } else if (status.denied) {
        const alert = await this.alertCtrl.create({
          header: 'Sin permisos',
          message:
            'Por favor permita el acceso a la camara en sus preferencias',
          buttons: [
            {
              text: 'No',
              role: 'Cancel',
            },
            {
              text: 'Abrir preferencias',
              handler: () => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                BarcodeScanner.openAppSettings(), resolve(false);
              },
            },
          ],
        });

        await alert.present();
      } else {
        resolve(reject);
      }
    });
  }




}
