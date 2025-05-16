export class Model {
  public matchAttributes(attributes?: any, preventClearData: boolean = false) {
    if (attributes) {
      if (!preventClearData) {
        for (const key in this) {
          if (this.hasOwnProperty(key)) {
            delete this[key];
          }
        }
      }
      for (const key in attributes) {
        if (
          attributes.hasOwnProperty(key)
          && attributes[key] !== null
          && attributes[key] !== undefined
        ) {
          this[key as keyof typeof this] = attributes[key];
        } else {
          delete this[key as keyof typeof this];
        }
      }
    }
  }
}