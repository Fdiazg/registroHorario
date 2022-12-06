import { AfterViewInit, Component, ComponentFactoryResolver } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { AlertController, Platform } from '@ionic/angular';
import { format, isToday, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements AfterViewInit {
  dateValue = format(new Date().getTime(), 'yyyy-MM-dd') + 'T09:00:00.000z';
  formattedString = '';
  scanActive: boolean = false;

  constructor(private alertCtrl: AlertController, private platform: Platform) {
    this.setToday();
  }

  ngAfterViewInit() {
    if (this.platform.is('capacitor')) {
      BarcodeScanner.prepare();
    }
  }

  // setToday() {
  //   this.formattedString = format(parseISO(format(new Date(),'yyyy-MM--dd') + 'T09:00:00.000z'),'HH:mm, MMM d, yyyy');
  // }

  setToday() {
    this.formattedString = format(new Date(), 'HH:mm EEEE, dd MMMM ', {
      locale: es,
    });
  }

  // async scan() {
  //   console.log('Comenzando a escaner');
  //   const status = await BarcodeScanner.checkPermission();
  //   console.log(status);
  //   const result = await BarcodeScanner.startScan();
  //   if (result.hasContent) {
  //     console.log(result.content);
  //   }
  // }


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
