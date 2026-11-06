import { Component, inject } from '@angular/core';
import { LoaderService } from '../../services/loader-service';

@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.html',
  styleUrl: './loader.scss',
})
export class Loader {

  private _service = inject(LoaderService);

  readonly isLoading = this._service.loading;

}
