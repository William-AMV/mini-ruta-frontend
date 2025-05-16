import {Model} from '../../../core/models/model';

export class Stop extends Model {
  id: string = '';
  name: string = '';
  linkPlace: string = '';
  isActive: boolean = true;

  constructor(attributes?: any) {
    super();
    super.matchAttributes(attributes);
  }
}