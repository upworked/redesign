/*** IMPORTS ***/

import Swiper from './Swiper.js';
import Menu from './Menu.js';
import Modal from './Modal.js';
import Validation from './Validation.js';
import WheelIndicator from './WheelIndicator.js';

/*** SCRIPTS ***/

/* Preloader */

const
    preloader = document.querySelector('.preloader');
    
window.addEventListener('load', ()=>{
    setTimeout(()=>{
        // to prevent viewport resize when virtual keyboard opened
        let viewport = document.querySelector("meta[name=viewport]");
        viewport.setAttribute("content", viewport.content + ", height=" + window.innerHeight);
        preloader.classList.remove('active');
    }, 1000);
});

/* Menu */

const
    menuController = document.querySelector('.menu-controller'),
    menu = new Menu(document.querySelector('.menu'));

menuController.addEventListener('click', ()=>{
    menuController.classList.toggle('active');
    floatingLogo.classList.toggle('active');

    if(menu.isOpen){
        menu.close();
    }
    else{
        menu.open();
    }
})

/* Navigation */

const
    navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(item=>{
    item.addEventListener('click', ()=>{
        if(!swiperFreeze){
            swiperFreeze = true;
            
            pagesSwiper.slideTo(+item.dataset.target, 1000, true);

            setTimeout(() => {
                swiperFreeze = false;
            }, 1000);
        }
        
        menuController.classList.remove('active');
        floatingLogo.classList.remove('active');
        
        if(menu.isOpen){
            menu.close();
        }
    });
});

/* Pages */

let 
    swiperFreeze = false;

const
    floatingElements = document.querySelectorAll('.floating-elements > *'),
    floatingNav = document.querySelector('.floating-nav'),
    floatingLogo = document.querySelector('.floating-logo'),
    floatingContacts = document.querySelector('.floating-contacts'),
    footer = document.querySelector('.footer'),
    pages = document.querySelectorAll('.page'),
    // to prevent inertal scroll
    wheelIndicator = new WheelIndicator({
        elem: document.querySelector('.main-content'),
        callback: event => {
            if(!swiperFreeze){
                swiperFreeze = true;
                
                if(event.direction === 'up'){
                    pagesSwiper.slidePrev(1000);
                }
                else{
                    pagesSwiper.slideNext(1000);
                }

                setTimeout(() => {
                    swiperFreeze = false;
                }, 1000);
            }
        }
    }),
    pagesSwiper = new Swiper('.main-content', {
        direction: 'vertical',
        slidesPerView: 1,
        mousewheel: false,
        speed: 1000,
        slideActiveClass: 'active',
        pagination: {
            el: '.floating-nav',
            clickable: true,
            bulletClass: 'floating-nav_item',
            bulletActiveClass: 'active',
            renderBullet: function (index, className) {
                return `
                    <div class="${className}">
                        <div class="floating-nav_item_marker"></div>
                        <div class="floating-nav_item_title">${pages[index].dataset.title}</div>
                    </div>
                `
            },
        },
        on: {
            slideChange: function (pagesSwiper) {
                if(pages[pagesSwiper.activeIndex].classList.contains('dark')){
                    floatingElements.forEach(element => {
                        element.classList.remove('dark');
                        element.classList.add('light');
                    });
                }
                else{
                    floatingElements.forEach(element => {
                        element.classList.remove('light');
                        element.classList.add('dark');
                    });
                }
            },
            reachBeginning: function(){
                floatingNav.classList.remove('active');
            },
            reachEnd: function(){
                floatingContacts.classList.remove('active');
                footer.classList.add('active');
            },
            fromEdge: function(){
                floatingNav.classList.add('active');
                floatingContacts.classList.add('active');
                footer.classList.remove('active');
            }
        },
    });

/* Projects slider */

const
    projectsContainer = document.querySelector('.projects_slider'),
    projectsPagination = document.querySelector('.projects_pagination'),
    projectsPaginationFill = document.querySelector('.projects_pagination_fill'),
    projects = new Swiper('.projects_slider', {
        slidesPerView: window.innerWidth > 768 ? 2.25 : 1.10,
        spaceBetween: 10,
        freeMode: window.innerWidth > 768,
        grabCursor: true,
        pagination: {
            el: '.projects_pagination',
            type: 'progressbar',
            progressbarFillClass: 'projects_pagination_fill'
        },
        on: {
            reachBeginning: function(){
                projectsContainer.classList.add('beginning');
            },
            reachEnd: function(){
                projectsContainer.classList.add('end');
            },
            fromEdge: function(){
                projectsContainer.classList.remove('beginning');
                projectsContainer.classList.remove('end');
            }
        }
    });

projectsPagination.addEventListener('click', (event)=>{
    projectsPaginationFill.style.transform = `translate3d(0px, 0px, 0px) scaleX(${event.offsetX / projectsPagination.offsetWidth}) scaleY(1)`;
    projects.translateTo(-(event.offsetX / projectsPagination.offsetWidth * projects.virtualSize), 500, true, true);
})

/* Intro eye moving */

const 
    intro = document.querySelector('.intro'),
    introEye = document.querySelector('.intro_eye'),
    introEyeDemensions = introEye.getBoundingClientRect();

intro.addEventListener('mousemove', (event)=>{
    if(window.innerWidth > 768){
        if(event.clientX > introEyeDemensions.left && event.clientX < introEyeDemensions.right && event.clientY > introEyeDemensions.top && event.clientY < introEyeDemensions.bottom){
            introEye.classList.add('active');
        }
        else{
            introEye.classList.remove('active');
        }
    }
})

/* Form */

const
    contactsForm = document.querySelector('.contacts_form'),
    contactstFromTextInputs = contactsForm.querySelectorAll('.form_text_item'),
    contactsFormCheckbox = contactsForm.querySelector('.form_check_item input'),
    modalElement = document.querySelector('.success-modal'),
    modal = new Modal(modalElement);

contactstFromTextInputs.forEach(item=>{
    const
        input = item.querySelector('.form_item_input'),
        placeholder = item.querySelector('.form_item_placeholder');
    
    input.addEventListener('focus', ()=>{
        placeholder.classList.add('active');
        if(window.innerWidth <= 480){
            footer.classList.remove('active');
            floatingNav.classList.remove('active');
        }
    })

    input.addEventListener('blur', ()=>{
        if(input.value == ""){
            placeholder.classList.remove('active');
            if(window.innerWidth <= 480){
                footer.classList.add('active');
                floatingNav.classList.add('active');
            }
        }
    })
})

contactsFormCheckbox.addEventListener('change', ()=>{
    if(!contactsFormCheckbox.checked){
        contactsForm.classList.add('disabled');
    }
    else{
        contactsForm.classList.remove('disabled');
    }
});

contactsForm.addEventListener('submit', (event)=>{
    if(!contactsForm.classList.contains('disabled')){
        event.preventDefault();

        const validation = new Validation();

        ['input[type="text"]', 'textarea'].forEach(inputItem=>{
            contactsForm.querySelectorAll(inputItem).forEach(item=>{
                validation.validate(item, ['required'])
            })
        })

        if(validation.errors.length > 0){
            validation.fields.forEach(field => {
                field.closest('.form_item').classList.remove('invalid');
            })
            validation.errors.forEach(error => {
                error.field.closest('.form_item').classList.add('invalid')
            })
        }
        else{
            validation.fields.forEach(field => {
                field.closest('.form_item').classList.remove('invalid');
            })

            fetch('/server/sendmail.php', {
                method: 'POST',
                body: new FormData(contactsForm)
            })
            .then(response=>{
                return response.json()
            })
            .then(result=>{
                contactsForm.reset();
                
                contactsForm.querySelectorAll('.form_item_placeholder').forEach(item=>{
                    item.classList.remove('active');
                });

                switch(result.status){
                    case 'success':
                        modal.open();
    
                        modalElement.addEventListener('click', ()=>{
                            modal.close();
                        })
    
                        setTimeout(()=>{
                            modal.close();
                        }, 2000);
                    break;
                    case 'fail':
                        console.log('fail')
                    break;
                }
            })
        }

    }
})
