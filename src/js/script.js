// Declaração dos Elementos usando DOM(DOCUMENT OBJECT MODEL)
const videoElemento = document.getElementById("video");
const botaoScanear = document.getElementById("btn-texto");
const resultado = document.getElementById("saida");
const canvas = document.getElementById("Canvas");



// Função assincrona para habilitar a câmera

async function configurarCamera(){
    //tratamento de erros
    try{
        //chama a API do navegador para solicitar acesso
        const midia=await navigator.mediaDevices.getUserMedia({
            //habilita a câmera traseira
            video:{ facingMode: "enviroment"},
            //o audio não será capturado
            audio:false
        });
        //recebe a função midia para ser executada
        videoElemento.srcObject=midia;
        //força a reprodução do video
        videoElemento.play();

    }catch(erro){
        resultado.innerText="Erro ao acessar a Câmera";
    }
}
//Executando a função
configurarCamera();

//função para capturar o texto da câmera
botaoScanear.onclick = async ()=>{
    botaoScanear.disabled=true; //habilitando a câmera
    resultado.innerText="Fazendo a leitura do texto...aguarde";

    //Definindo o canvas para iniciar a leitura
    const contexto = canvas.getContext("2d");

    //ajustando o tamanho do canvas para o tamanho real do video
    canvas.width =videoElemento.videoWidth;
    canvas.height = videoElemento.videoHeight

    //aplicando o filtron para melhorar o OCR
    contexto.filter='contrast(1.2) gratscale(1)';

    //desenha o video no canvas

    contexto.drawImage(videoElemento,0,0, canvas.width,canvas.height);

    try{
        const {data:{ text }}=await Tesseract.recognize(
            canvas,
            'por' //define idioma
        );
        //remove os espaços em branco
        const textoFinal = text.trim();
        //estrutura condicional ternaria ?=if : =else
        resultado.innerText=textoFinal.lenght > 0 ? textoFinal:"Não foi possivel identificar o texto";
    }catch(erro){
        resultado.innerText="Erro no processamento",erro
    }
    finally{
        //desabilitando o botão para fazer nova captura
            botaoScanear.disabled=false;
    }
}