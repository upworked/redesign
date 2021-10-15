export default class Validation{
    constructor(){
        this.fields = [];
        this.errors = [];
    }

    validate(field, rules){
        this.fields.push(field);
        rules.forEach(rule => {
            switch(rule){
                case 'required':
                    if(field.value == ""){
                        this.errors.push({
                            field: field,
                            error: 'Поле не должно быть пустым'
                        })
                    }
                break;
            }
        });
    }
}