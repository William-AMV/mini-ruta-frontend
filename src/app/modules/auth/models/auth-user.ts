import {User} from "../../administration/models/user";
import {Model} from '../../../core/models/model';

export class AuthUser extends Model {
  email: string = '';
  response: string = '';
  user!: User;

  constructor(attributes?: any) {
    super();
    super.matchAttributes(attributes);
  }

}