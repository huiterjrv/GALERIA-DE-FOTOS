const pictures = [
    "casa1",
    "casa2",
    "casa3",
    "casa4",
    "casa5",
    "casa6",
    "casa7",
    "casa8"
  ];
/*
localStorage.removeItem("posicion");//borar una variable local storage
//si abres por primera ves esta pagina deveriaas de ejecutar este codigo que
//esta comentado para vaciar la variable posicion de localstore y asi no dar un error
//en la ejecucion del script
let pocision = [];// esto es para borrar el valor de localStorage de posicion
localStorage.setItem('posicion', pocision);
*/

if(localStorage.getItem("posicion") == null){
    localStorage.setItem('posicion',"");
}

var conFototeca = document.getElementById("fototeca");
var conGaleria = document.getElementById("galeria");
var conModular = document.getElementById("lightbox");
var conImg = document.getElementById("imagen_lightbox");
var anterior = document.getElementById("anterior");
var siguiente =document.getElementById("siguiente");
anterior.addEventListener("click",flecha);
siguiente.addEventListener("click",flecha);
conModular.addEventListener("click",ventanaModular);

pictures.forEach(function(foto,num){
    let nodo = document.createElement("div");
    nodo.classList.add("foto");
    nodo.style.background = `url(img/${foto}.jpg) center/cover no-repeat`;
    nodo.setAttribute('nombre',num);//esto  es una manera de agregar un atributo o una variable a una etiqueta HTML
    nodo.addEventListener("dblclick",agregarFoto);
    nodo.addEventListener("touchend",agregarFoto);
    conFototeca.appendChild(nodo);
});

function agregarFoto(evento){
    let pocision = localStorage.getItem("posicion");
    if(pocision.length != 0 && pocision != "" ){
        pocision = pocision.split(",");
        pocision.push(evento.target.getAttribute("nombre"));
        localStorage.setItem('posicion', pocision);
    }else{
        pocision = [];
        pocision.push(evento.target.getAttribute("nombre"));
        localStorage.setItem('posicion', pocision);
    }
    let img =document.createElement("img");
    img.src ="img/borrar.png";
    img.addEventListener("click",quitarFoto);
    let clonFoto = evento.target.cloneNode(true);
    clonFoto.classList.remove("foto");
    clonFoto.addEventListener("click",ventanaModular);
    clonFoto.appendChild(img);
    evento.target.style = "display: none;";
    conGaleria.appendChild(clonFoto);
}

function quitarFoto(evento){
    evento.stopPropagation();
    console.log(evento);
    let num = evento.path[1].getAttribute("nombre");
    quitarDeMemoria(num);
    conFototeca.getElementsByTagName("div")[num].style = `display: flex; background: url(img/${pictures[num]}.jpg) center/cover no-repeat`;
    evento.path[1].classList.add("desaparicion");
    evento.path[1].classList.add("espera");
    evento.path[1].getElementsByTagName("img")[0].classList.add("espera");
    document.body.classList.add("espera");
    let x = evento.path[1];    
    let ruleta = setInterval(function(){
        x.remove();
        document.body.classList.remove("espera");
        clearInterval(ruleta);
    },600);
}

function quitarDeMemoria(n){
    let position = localStorage.getItem('posicion');
    position = position.split(",");
    for ( let i=0 ; i<position.length ; i++) {
        if(position[i]==n){
            position.splice(i,1);
        }
    }
    localStorage.setItem('posicion', position);
}

function deUltimo() {
    let verMemoria = localStorage.getItem("posicion");
    verMemoria = verMemoria.split(",");

    if(verMemoria.length != 0 && verMemoria != ""){
        verMemoria.forEach(function(foto){
            let img =document.createElement("img");
            img.src ="img/borrar.png";
            img.addEventListener("click",quitarFoto);
            let clonFoto = conFototeca.children[foto].cloneNode(true);
            clonFoto.classList.remove("foto");
            clonFoto.addEventListener("dblclick",ventanaModular);
            clonFoto.addEventListener("touchend",ventanaModular);
            clonFoto.appendChild(img);
            conFototeca.children[foto].style = "display: none;";
            conGaleria.appendChild(clonFoto);
        });
    }
}

function ventanaModular(evento){
    console.log(evento.type);
    if(evento.target == conModular && evento.type == "click" ){
        conModular.classList.add("desaparicion");
        conModular.classList.remove("aparicion");
        let ruleta = setInterval(function(){
            conModular.style = "display: none;";
            clearInterval(ruleta);
        },1000);
    }else{
        let num = evento.target.getAttribute("nombre");
        conImg.src = `img/${pictures[num]}.jpg`;
        conImg.setAttribute('nombre',num);
        conModular.classList.add("aparicion");
        conModular.classList.remove("desaparicion");
        conModular.style ="display: flex;";
    }
}

function flecha(evento){
    evento.stopPropagation();
    let numAtual = conImg.getAttribute("nombre");
    let fotoGaleria = conGaleria.getElementsByTagName("div");
    let pocision;
    if(evento.target.id == "anterior"){
        for (let i=0 ; i<fotoGaleria.length ; i++){
            if(fotoGaleria[i].getAttribute("nombre") == numAtual) {
                pocision = i;
            }
        }  
        if(pocision>0){
            pocision--;
            let num = fotoGaleria[pocision].getAttribute("nombre");
            conImg.src = `img/${pictures[num]}.jpg`;
            conImg.setAttribute("nombre",num);
        }else{
            let num = fotoGaleria[(fotoGaleria.length - 1)].getAttribute("nombre");
            conImg.src = `img/${pictures[num]}.jpg`;
            conImg.setAttribute("nombre",num);
        }    
    }else{
        for (let i=0 ; i<fotoGaleria.length ; i++){
            if(fotoGaleria[i].getAttribute("nombre") == numAtual) {
                pocision = i;
            }
        }  
        if(pocision == (fotoGaleria.length-1)){
            let num = fotoGaleria[0].getAttribute("nombre");
            conImg.src = `img/${pictures[num]}.jpg`;
            conImg.setAttribute("nombre",num);
        }else{
            pocision++;
            let num = fotoGaleria[pocision].getAttribute("nombre");
            conImg.src = `img/${pictures[num]}.jpg`;
            conImg.setAttribute("nombre",num);
        }    
    }
}

deUltimo();