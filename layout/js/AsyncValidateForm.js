import Postman from './Postman.js';

export default class AsyncValidateForm {
  constructor(options) {
    this.mainNode = options.mainNode;
    this.fields = this.mainNode.querySelectorAll('input');
    this.selectNodes = this.mainNode.querySelectorAll('select');
    this.mainNode.addEventListener('submit', this.handleSubmit);
    this.messageNode = options.resultMessageNode;
    this.successHandler = options.successHandler;
    this.validationMethods = {};
    this.sendParams = {};

    this.setValidationMethods = (name) => {
      const errorElemNode = this.mainNode.querySelector(`.js-error-${name}`);

      if (this.validationMethods[name]) {
        return;
      }

      this.validationMethods[name] = {
        setError: (text = '') => {
          errorElemNode.classList.add('error');
          if (!errorElemNode.querySelector('.fieldError')) {
            const errorDiv = document.createElement('div');
            errorDiv.className = "fieldError";
            errorDiv.innerText = text ? text : "Поле обязательно должно быть заполнено";
            errorElemNode.append(errorDiv)
          } else {
            errorElemNode.querySelector('.fieldError').innerText = text ? text : "Поле обязательно должно быть заполнено";
          }
        },
        removeError: () => {
          errorElemNode.classList.remove('error');
          errorElemNode.querySelector('.fieldError')?.remove();
        }
      }
    }

    this.fields.forEach(field => {
      const {
        name,
      } = field;

      this.setValidationMethods(name);
    });

    this.selectNodes.forEach(selectNode => {
      const name = selectNode.name;

      this.setValidationMethods(name);
    });

    this.postman = new Postman();
  }

  validate = (validErrors) => {
    validErrors.forEach(validError => this.validationMethods[validError].setError());
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.sendParams = {};

    this.fields.forEach(field => {
      const {
        name,
        value,
        type,
        checked,
      } = field;

      if (type === 'radio' || type === 'checkbox') {
        if (!checked) {
          this.validationMethods[name].setError()
          return;
        }

        this.validationMethods[name].removeError()
        this.sendParams[name] = value;
      }

      if (type === 'email') {
        if (!value.length > 0) {
          this.validationMethods[name].setError()
          return;
        }

        const pattern = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (!pattern.test(value)) {
          this.validationMethods[name].setError('Неверный формат email');
          return;
        }

        this.validationMethods[name].removeError()
        this.sendParams[name] = value;
      }

      if (type === 'text') {
        if (!value.length > 0) {
          this.validationMethods[name].setError()
          return;
        }

        this.validationMethods[name].removeError()
        this.sendParams[name] = value;
      }
    })

    this.selectNodes.forEach(field => {
      const {
        selectedIndex,
        value,
        name
      } = field;

      if (selectedIndex === 0) {
        this.validationMethods[name].setError()
        return;
      }

      this.validationMethods[name].removeError()
      this.sendParams[name] = field.options[selectedIndex].dataset.productId ? field.options[selectedIndex].dataset.productId : value;
    })

    const response = await this.postman.post(this.mainNode.action, this.sendParams);
    const result = await response.json();

    if (result.validErrors) {
      this.validate(result.validErrors);
    }

    if (!result.error && this.successHandler) {
      this.successHandler(this.sendParams, result);
    }

    if (!this.messageNode) {
      return;
    }

    if (result.error) {
      this.messageNode.classList.add('error');
    } else {
      this.messageNode.classList.remove('error');
    }

    this.messageNode.innerText = result.message;
  }
}
