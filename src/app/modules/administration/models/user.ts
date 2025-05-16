import {Model} from '../../../core/models/model';

export class User extends Model {
  id: string = '';
  fullName: string = '';
  email: string = '';
  password: string = '';
  role: string = '';
  isActive: boolean = true;

  constructor(attributes?: any) {
    super();
    super.matchAttributes(attributes);
  }
}