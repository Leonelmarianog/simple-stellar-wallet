class FormValidationException extends Error {
  constructor(
    public readonly errors: Record<any, string>,
    public description?: string
  ) {
    super();
    this.errors = errors;
    this.initName();
    this.initMessage();
  }

  initName: () => void = () => {
    this.name = this.constructor.name;
  };

  initMessage: () => void = () => {
    if (this.description) {
      this.message = this.description;
    } else {
      this.message = this.constructor.name
        .match(/[A-Z][a-z]+|[0-9]+/g)!
        .join(' ');
    }
  };
}

export default FormValidationException;
