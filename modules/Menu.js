export default class Menu{
    constructor(menu){
        this.element = menu;
        this.isOpen = false;
    }

    open(){
        this.element.classList.add('active');
        this.isOpen = true;
    }
    
    close(){
        this.element.classList.remove('active');
        this.isOpen = false;
    }
}