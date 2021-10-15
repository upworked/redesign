/* Extrimely simple, just to increase functionality in the future */

export default class Modal{
    constructor(modal){
        this.element = modal;
    }

    open(){
        this.element.classList.add('active');
    }
    
    close(){
        this.element.classList.remove('active');
    }
}